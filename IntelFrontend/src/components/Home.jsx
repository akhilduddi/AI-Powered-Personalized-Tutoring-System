import { Link } from 'react-router-dom';
import Chatbot from './Chatbot';
import { useRef } from 'react';
import { useScroll, motion, useTransform } from 'framer-motion';

const Home = () => {
  // Create refs for parallax sections
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const overviewRef = useRef(null);
  const learningRef = useRef(null);
  const evaluationRef = useRef(null);
  
  // Set up scroll animations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  // Parallax effects for different sections
  const yHero = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const yOverview = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const yLearning = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const yEvaluation = useTransform(scrollYProgress, [0, 1], [0, -20]);
  
  // Background parallax effects
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 200]);

  return (
    <div className="home-container" ref={containerRef}>
      {/* Background elements with parallax */}
      <motion.div 
        className="parallax-bg"
        style={{ y: bgY }}
      />
      
      {/* Hero section with strong parallax */}
      <motion.section 
        className="hero-section"
        ref={heroRef}
        style={{ y: yHero }}
      >
        <div className="hero-content">
          <h1 className="hero-title">Smart Tutoring System</h1>
          <p className="hero-subtitle">Personalized Learning Paths Based on Your Skill Level</p>
          <div className="cta-buttons">
            <Link to="/register" className="primary-button">Get Started</Link>
            <Link to="/login" className="secondary-button">Login</Link>
          </div>
        </div>
      </motion.section>

      {/* System overview with medium parallax */}
      <motion.section 
        className="system-overview"
        ref={overviewRef}
        style={{ y: yOverview }}
      >
        <h2 className="section-heading">How Our Tutoring System Works</h2>
        
        <div className="process-steps">
          <motion.div 
            className="step-card"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="step-number">1</div>
            <h3 className="step-title">Student Access & Authentication</h3>
            <p className="step-description">
              Students can securely log in or sign up with credentials stored safely for authentication and authorization.
            </p>
          </motion.div>

          <motion.div 
            className="step-card"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="step-number">2</div>
            <h3 className="step-title">Course Selection</h3>
            <p className="step-description">
              Choose from our engineering courses: CSE, ECE, EEE, Civil, or Mechanical.
            </p>
          </motion.div>

          <motion.div 
            className="step-card"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="step-number">3</div>
            <h3 className="step-title">Pre-Test Assessment</h3>
            <p className="step-description">
              Take a 100-mark pre-test with 10 questions to evaluate your current knowledge level.
            </p>
          </motion.div>
          
          <motion.div 
            className="step-card ultra-compact"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="step-number">4</div>
            <h3 className="step-title">Levels: 
              <span className="level-chip">0-20: Newbie</span>
              <span className="level-chip">21-40: Beginner</span>
              <span className="level-chip">41-60: Intermediate</span>
              <span className="level-chip">61-80: Advanced</span>
              <span className="level-chip">81-100: Expert</span>
            </h3>
          </motion.div>
        </div>
      </motion.section>

      {/* Learning process with light parallax */}
      <motion.section 
        className="learning-process"
        ref={learningRef}
        style={{ y: yLearning }}
      >
        <h2 className="section-heading">Your Learning Journey</h2>
        
        <div className="learning-features">
          <motion.div 
            className="feature-box"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="feature-title">Module-Based Learning</h3>
            <p>
              Each course consists of 3 modules with comprehensive learning materials tailored to your level.
            </p>
          </motion.div>

          <motion.div 
            className="feature-box"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="feature-title">Slip Tests</h3>
            <p>
              After each module, take a 100-mark slip test (5 questions × 20 marks) to assess your understanding.
            </p>
          </motion.div>

          <motion.div 
            className="feature-box"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="feature-title">Adaptive Progression</h3>
            <p>
              Our system suggests level adjustments based on your performance:
              <br />
              <strong>Score &gt; 80:</strong> Move to next level
              <br />
              <strong>Score &lt; 20:</strong> Review previous level
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Evaluation section with subtle parallax */}
      <motion.section 
        className="evaluation-section"
        ref={evaluationRef}
        style={{ y: yEvaluation }}
      >
        <h2 className="section-heading">Comprehensive Evaluation</h2>
        
        <div className="evaluation-steps">
          <motion.div 
            className="evaluation-card"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="evaluation-title">Final Test</h3>
            <p>
              After completing all modules, take a comprehensive 100-mark final test (10 questions × 10 marks).
            </p>
          </motion.div>

          <motion.div 
            className="evaluation-card"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="evaluation-title">Performance Analysis</h3>
            <p>
              Your average slip test score is calculated to provide personalized feedback.
            </p>
          </motion.div>

          <motion.div 
            className="evaluation-card"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="evaluation-title">Final Score Calculation</h3>
            <p>
              Final Result = (Final Test Score × 0.7) + (Slip Test Average × 0.3)
              <br />
              Stored securely and displayed with detailed analysis.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Benefits section with staggered animations */}
      <section className="benefits-section">
        <h2 className="section-heading">Why Choose Our System</h2>
        
        <div className="benefits-grid">
          {[
            {
              title: "Personalized Learning",
              text: "Content adapted to your exact skill level for optimal learning."
            },
            {
              title: "Progress Tracking",
              text: "Detailed analytics to monitor your improvement over time."
            },
            {
              title: "Adaptive Difficulty",
              text: "Automatic level adjustments based on your performance."
            },
            {
              title: "Comprehensive Feedback",
              text: "Detailed test results with areas for improvement highlighted."
            }
          ].map((benefit, index) => (
            <motion.div 
              key={index}
              className="benefit-item"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h3>{benefit.title}</h3>
              <p>{benefit.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA with fade-in effect */}
      <motion.section 
        className="ready-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2>Ready to Start Learning?</h2>
        <p>Join thousands of students who have improved their skills with our adaptive tutoring system.</p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/register" className="primary-button large-button">Begin Your Journey Now</Link>
        </motion.div>
      </motion.section>
      
      <Chatbot />
    </div>
  );
};

export default Home;