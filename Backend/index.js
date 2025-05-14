const express = require('express');
const cors = require('cors');
const path = require('path');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());9

const dbPath = path.join(__dirname, 'tutoringSystem.db');
let db = null;

const SECRET_KEY = "your_strong_secret_key_here";

// Initialize Database and Server
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    await createTables();
    await createAdminUser();
    
    app.listen(7800, () => {
      console.log(`Server Running at http://localhost:7800`);
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

// Create all required tables
const createTables = async () => {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'student',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT
    );
    
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      full_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      FOREIGN KEY (user_id) REFERENCES users (id)
    );
    
    CREATE TABLE IF NOT EXISTS student_courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      course_id INTEGER NOT NULL,
      current_level INTEGER NOT NULL DEFAULT 1,
      pre_test_score INTEGER,
      FOREIGN KEY (student_id) REFERENCES students (id),
      FOREIGN KEY (course_id) REFERENCES courses (id)
    );
    
    CREATE TABLE IF NOT EXISTS modules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course_id INTEGER NOT NULL,
      level INTEGER NOT NULL,
      module_number INTEGER NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      FOREIGN KEY (course_id) REFERENCES courses (id)
    );
    
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      module_id INTEGER NOT NULL,
      question_text TEXT NOT NULL,
      option_a TEXT NOT NULL,
      option_b TEXT NOT NULL,
      option_c TEXT NOT NULL,
      option_d TEXT NOT NULL,
      correct_answer TEXT NOT NULL,
      marks INTEGER NOT NULL,
      FOREIGN KEY (module_id) REFERENCES modules (id)
    );
    
    CREATE TABLE IF NOT EXISTS tests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      module_id INTEGER NOT NULL,
      test_type TEXT NOT NULL, -- 'pre', 'slip', 'final'
      score INTEGER NOT NULL,
      taken_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students (id),
      FOREIGN KEY (module_id) REFERENCES modules (id)
    );
    
    CREATE TABLE IF NOT EXISTS test_answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      test_id INTEGER NOT NULL,
      question_id INTEGER NOT NULL,
      selected_answer TEXT NOT NULL,
      is_correct INTEGER NOT NULL, -- 0 or 1
      FOREIGN KEY (test_id) REFERENCES tests (id),
      FOREIGN KEY (question_id) REFERENCES questions (id)
    );
  `);
};

// Create admin user if not exists
const createAdminUser = async () => {
  const adminExists = await db.get("SELECT id FROM users WHERE username = 'admin'");
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await db.run(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      ['admin', hashedPassword, 'admin']
    );
  }
};

initializeDBAndServer();

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Access Denied' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid Token' });
    req.user = user;
    next();
  });
};

// Authorization Middleware (Admin only)
const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// User Registration
app.post('/register', async (req, res) => {
  const { username, password, full_name, email, phone } = req.body;
  
  if (!username || !password || !full_name || !email) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await db.run('BEGIN TRANSACTION');
    
    // Create user
    const userResult = await db.run(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      [username, hashedPassword, 'student']
    );
    
    // Create student profile
    await db.run(
      "INSERT INTO students (user_id, full_name, email, phone) VALUES (?, ?, ?, ?)",
      [userResult.lastID, full_name, email, phone]
    );
    
    await db.run('COMMIT');
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    await db.run('ROLLBACK');
    if (error.code === 'SQLITE_CONSTRAINT') {
      res.status(400).json({ error: 'Username or email already exists' });
    } else {
      res.status(500).json({ error: 'Registration failed' });
    }
  }
});

// User Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const user = await db.get(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      SECRET_KEY,
      { expiresIn: '1h' }
    );
    
    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get all courses
app.get('/courses', authenticateToken, async (req, res) => {
  try {
    const courses = await db.all("SELECT * FROM courses");
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Student enroll in a course
app.post('/enroll', authenticateToken, async (req, res) => {
  const { course_id } = req.body;
  const student_id = req.user.id;
  
  try {
    // Check if already enrolled
    const existingEnrollment = await db.get(
      "SELECT id FROM student_courses WHERE student_id = ? AND course_id = ?",
      [student_id, course_id]
    );
    
    if (existingEnrollment) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }
    
    await db.run(
      "INSERT INTO student_courses (student_id, course_id) VALUES (?, ?)",
      [student_id, course_id]
    );
    
    res.status(201).json({ message: 'Enrolled successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Enrollment failed' });
  }
});

// Get student's enrolled courses
app.get('/my-courses', authenticateToken, async (req, res) => {
  const student_id = req.user.id;
  
  try {
    const courses = await db.all(`
      SELECT c.id, c.name, c.description, sc.current_level, sc.pre_test_score
      FROM student_courses sc
      JOIN courses c ON sc.course_id = c.id
      WHERE sc.student_id = ?
    `, [student_id]);
    
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Take pre-test
app.post('/pre-test', authenticateToken, async (req, res) => {
  const { course_id, answers } = req.body;
  const student_id = req.user.id;
  
  try {
    // Get questions for the course (basic level)
    const questions = await db.all(`
      SELECT q.* FROM questions q
      JOIN modules m ON q.module_id = m.id
      WHERE m.course_id = ? AND m.level = 1
      ORDER BY RANDOM() LIMIT 10
    `, [course_id]);
    
    if (questions.length === 0) {
      return res.status(404).json({ error: 'No questions found for pre-test' });
    }
    
    // Calculate score
    let score = 0;
    const testAnswers = [];
    
    questions.forEach((question, index) => {
      const isCorrect = answers[index] === question.correct_answer ? 1 : 0;
      if (isCorrect) score += question.marks;
      testAnswers.push({
        question_id: question.id,
        selected_answer: answers[index],
        is_correct: isCorrect
      });
    });
    
    await db.run('BEGIN TRANSACTION');
    
    // Record test
    const testResult = await db.run(
      "INSERT INTO tests (student_id, module_id, test_type, score) VALUES (?, ?, ?, ?)",
      [student_id, questions[0].module_id, 'pre', score]
    );
    
    // Record answers
    for (const answer of testAnswers) {
      await db.run(
        "INSERT INTO test_answers (test_id, question_id, selected_answer, is_correct) VALUES (?, ?, ?, ?)",
        [testResult.lastID, answer.question_id, answer.selected_answer, answer.is_correct]
      );
    }
    
    // Determine level based on score
    let level;
    if (score <= 20) level = 1;
    else if (score <= 40) level = 2;
    else if (score <= 60) level = 3;
    else if (score <= 80) level = 4;
    else level = 5;
    
    // Update student course level
    await db.run(
      "UPDATE student_courses SET current_level = ?, pre_test_score = ? WHERE student_id = ? AND course_id = ?",
      [level, score, student_id, course_id]
    );
    
    await db.run('COMMIT');
    
    res.json({ 
      score, 
      level,
      message: `Assigned to level ${level} based on your score`
    });
  } catch (error) {
    await db.run('ROLLBACK');
    res.status(500).json({ error: 'Failed to process pre-test' });
  }
});

// Get module content
app.get('/modules/:course_id/:level/:module_number', authenticateToken, async (req, res) => {
  const { course_id, level, module_number } = req.params;
  const student_id = req.user.id;
  
  try {
    // Verify student is enrolled and at correct level
    const enrollment = await db.get(
      "SELECT current_level FROM student_courses WHERE student_id = ? AND course_id = ?",
      [student_id, course_id]
    );
    
    if (!enrollment) {
      return res.status(403).json({ error: 'Not enrolled in this course' });
    }
    
    if (parseInt(level) > enrollment.current_level) {
      return res.status(403).json({ error: 'Complete previous levels first' });
    }
    
    // Get module content
    const module = await db.get(
      "SELECT * FROM modules WHERE course_id = ? AND level = ? AND module_number = ?",
      [course_id, level, module_number]
    );
    
    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }
    
    res.json(module);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch module' });
  }
});

// Take slip test
app.post('/slip-test', authenticateToken, async (req, res) => {
  const { module_id, answers } = req.body;
  const student_id = req.user.id;
  
  try {
    // Get all questions for the module
    const questions = await db.all(
      "SELECT * FROM questions WHERE module_id = ? ORDER BY RANDOM() LIMIT 5",
      [module_id]
    );
    
    if (questions.length === 0) {
      return res.status(404).json({ error: 'No questions found for slip test' });
    }
    
    // Calculate score
    let score = 0;
    const testAnswers = [];
    
    questions.forEach((question, index) => {
      const isCorrect = answers[index] === question.correct_answer ? 1 : 0;
      if (isCorrect) score += question.marks;
      testAnswers.push({
        question_id: question.id,
        selected_answer: answers[index],
        is_correct: isCorrect
      });
    });
    
    await db.run('BEGIN TRANSACTION');
    
    // Record test
    const testResult = await db.run(
      "INSERT INTO tests (student_id, module_id, test_type, score) VALUES (?, ?, ?, ?)",
      [student_id, module_id, 'slip', score]
    );
    
    // Record answers
    for (const answer of testAnswers) {
      await db.run(
        "INSERT INTO test_answers (test_id, question_id, selected_answer, is_correct) VALUES (?, ?, ?, ?)",
        [testResult.lastID, answer.question_id, answer.selected_answer, answer.is_correct]
      );
    }
    
    await db.run('COMMIT');
    
    // Determine if level should change
    const suggestion = score > 80 ? 'consider moving to next level' : 
                      score < 20 ? 'consider reviewing previous level' : 
                      'continue with current level';
    
    res.json({ 
      score, 
      suggestion,
      message: `Slip test completed. ${suggestion}`
    });
  } catch (error) {
    await db.run('ROLLBACK');
    res.status(500).json({ error: 'Failed to process slip test' });
  }
});

// Take final test
app.post('/final-test', authenticateToken, async (req, res) => {
  const { course_id, answers } = req.body;
  const student_id = req.user.id;
  
  try {
    // Get all questions for the course at student's level
    const questions = await db.all(`
      SELECT q.* FROM questions q
      JOIN modules m ON q.module_id = m.id
      WHERE m.course_id = ? AND m.level = (
        SELECT current_level FROM student_courses 
        WHERE student_id = ? AND course_id = ?
      )
      ORDER BY RANDOM() LIMIT 10
    `, [course_id, student_id, course_id]);
    
    if (questions.length === 0) {
      return res.status(404).json({ error: 'No questions found for final test' });
    }
    
    // Calculate score
    let score = 0;
    const testAnswers = [];
    
    questions.forEach((question, index) => {
      const isCorrect = answers[index] === question.correct_answer ? 1 : 0;
      if (isCorrect) score += question.marks;
      testAnswers.push({
        question_id: question.id,
        selected_answer: answers[index],
        is_correct: isCorrect
      });
    });
    
    // Get average slip test score
    const slipTests = await db.all(`
      SELECT score FROM tests 
      WHERE student_id = ? AND test_type = 'slip' AND module_id IN (
        SELECT id FROM modules WHERE course_id = ?
      )
    `, [student_id, course_id]);
    
    const slipTestAverage = slipTests.reduce((sum, test) => sum + test.score, 0) / slipTests.length;
    
    // Calculate final score
    const finalScore = (score * 0.7) + (slipTestAverage * 0.3);
    
    await db.run('BEGIN TRANSACTION');
    
    // Record test
    const testResult = await db.run(
      "INSERT INTO tests (student_id, module_id, test_type, score) VALUES (?, ?, ?, ?)",
      [student_id, questions[0].module_id, 'final', score]
    );
    
    // Record answers
    for (const answer of testAnswers) {
      await db.run(
        "INSERT INTO test_answers (test_id, question_id, selected_answer, is_correct) VALUES (?, ?, ?, ?)",
        [testResult.lastID, answer.question_id, answer.selected_answer, answer.is_correct]
      );
    }
    
    await db.run('COMMIT');
    
    // Determine if level should change
    const suggestion = finalScore > 80 ? 'consider moving to next level' : 
                      finalScore < 20 ? 'consider reviewing previous level' : 
                      'continue with current level';
    
    res.json({ 
      finalScore, 
      testScore: score,
      slipTestAverage,
      suggestion,
      message: `Final test completed. ${suggestion}`
    });
  } catch (error) {
    await db.run('ROLLBACK');
    res.status(500).json({ error: 'Failed to process final test' });
  }
});

// Admin endpoints for managing content
app.post('/admin/courses', authenticateToken, authorizeAdmin, async (req, res) => {
  const { name, description } = req.body;
  
  try {
    await db.run(
      "INSERT INTO courses (name, description) VALUES (?, ?)",
      [name, description]
    );
    res.status(201).json({ message: 'Course created successfully' });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      res.status(400).json({ error: 'Course already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create course' });
    }
  }
});

app.post('/admin/modules', authenticateToken, authorizeAdmin, async (req, res) => {
  const { course_id, level, module_number, title, content } = req.body;
  
  try {
    await db.run(
      "INSERT INTO modules (course_id, level, module_number, title, content) VALUES (?, ?, ?, ?, ?)",
      [course_id, level, module_number, title, content]
    );
    res.status(201).json({ message: 'Module created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create module' });
  }
});

app.post('/admin/questions', authenticateToken, authorizeAdmin, async (req, res) => {
  const { module_id, question_text, option_a, option_b, option_c, option_d, correct_answer, marks } = req.body;
  
  try {
    await db.run(
      `INSERT INTO questions 
      (module_id, question_text, option_a, option_b, option_c, option_d, correct_answer, marks) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [module_id, question_text, option_a, option_b, option_c, option_d, correct_answer, marks]
    );
    res.status(201).json({ message: 'Question added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add question' });
  }
});

// Get student progress
app.get('/progress/:course_id', authenticateToken, async (req, res) => {
  const { course_id } = req.params;
  const student_id = req.user.id;
  
  try {
    const progress = await db.get(`
      SELECT sc.current_level, sc.pre_test_score,
      (SELECT AVG(score) FROM tests 
       WHERE student_id = ? AND test_type = 'slip' AND module_id IN (
         SELECT id FROM modules WHERE course_id = ?
       )) as slip_test_avg,
      (SELECT score FROM tests 
       WHERE student_id = ? AND test_type = 'final' AND module_id IN (
         SELECT id FROM modules WHERE course_id = ?
       ) LIMIT 1) as final_test_score
      FROM student_courses sc
      WHERE sc.student_id = ? AND sc.course_id = ?
    `, [student_id, course_id, student_id, course_id, student_id, course_id]);
    
    if (!progress) {
      return res.status(404).json({ error: 'No progress found for this course' });
    }
    
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

app.get('/questions',  async (req, res) => {
  try {
    const questions = await db.all("SELECT * FROM QuestionSet");
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

app.get('/questions/:branch', async (req, res) => {
  try {
    const { branch } = req.params; // Get branch from URL

    const questions = await db.all("SELECT * FROM QuestionSet WHERE branch = ?", [branch]);

    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

app.get('/questions/pretest/:branch', async (req, res) => {
  try {
    const { branch } = req.params;

    const questions = await db.all(
      "SELECT * FROM QuestionSet WHERE branch = ? AND test_type = 'Pre-Test'",
      [branch]
    );

    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pretest questions' });
  }
});



// app.get('/modules/filter/:level', async (req, res) => {
//   try {
//     const { level } = req.params;

//     const modules = await db.all(
//       "SELECT * FROM QuestionSet WHERE branch='CSE' level = ? and module = ?",
//       [level]
//     );

//     res.json(modules);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch modules' }).error;
//   }
// });

app.get('/questions/branch/:branch/level/:level/module/:module', async (req, res) => {
  try {
    const { branch, level, module } = req.params;
    const questions = await db.all(
      "SELECT * FROM QuestionSet WHERE branch = ? AND level = ? AND module = ?",
      [branch, level, module]
    );

    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch questions by branch, level & module" });
  }
});




module.exports = app;