import { useState } from 'react';
import CourseCard from './CourseCard';
import './../styles/courses.css';

const CourseList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const branches = {
    cse: 'Computer Science',
    ece: 'Electronics',
    mech: 'Mechanical',
    civil: 'Civil',
    common: 'Common'
  };

  const [courses] = useState([
    // Computer Science (15 courses)
    { id: 3, title: 'Fullstack Development', description: 'Complete MERN stack applications', instructor: 'Prof. Alex Chen', duration: '10 weeks', branch: 'cse', level: 'Advanced', icon: '🌐', color: '#3b82f6' },
   { id: 6, title: 'Cloud Computing', description: 'AWS, Azure, GCP fundamentals', instructor: 'Dr. Emily Wilson', duration: '6 weeks', branch: 'cse', level: 'Intermediate', icon: '☁️', color: '#0284c7' },
    { id: 7, title: 'Data Structures', description: 'Master algorithms in Python', instructor: 'Prof. David Kim', duration: '9 weeks', branch: 'cse', level: 'Intermediate', icon: '📊', color: '#0d9488' },
    { id: 8, title: 'Machine Learning', description: 'AI model building basics', instructor: 'Dr. Sanjay Verma', duration: '12 weeks', branch: 'cse', level: 'Advanced', icon: '🤖', color: '#db2777' },
   // Electronics (10 courses)
    { id: 16, title: 'Embedded Systems', description: 'Arduino programming', instructor: 'Prof. Sunita Kapoor', duration: '8 weeks', branch: 'ece', level: 'Intermediate', icon: '🔌', color: '#f59e0b' },
    { id: 17, title: 'VLSI Design', description: 'Chip design fundamentals', instructor: 'Dr. Ravi Shankar', duration: '10 weeks', branch: 'ece', level: 'Advanced', icon: '🖥️', color: '#b45309' },
    { id: 18, title: 'IoT Fundamentals', description: 'Internet of Things basics', instructor: 'Prof. Vikram Joshi', duration: '6 weeks', branch: 'ece', level: 'Beginner', icon: '📶', color: '#047857' },
 
    // Mechanical (10 courses)
    { id: 26, title: 'CAD/CAM', description: 'Computer-Aided Design', instructor: 'Dr. Anil Kapoor', duration: '6 weeks', branch: 'mech', level: 'Beginner', icon: '✏️', color: '#ef4444' },
    { id: 27, title: 'Thermodynamics', description: 'Heat and energy principles', instructor: 'Prof. Deepak Verma', duration: '8 weeks', branch: 'mech', level: 'Intermediate', icon: '🔥', color: '#ea580c' },
    { id: 28, title: 'Automobile Engineering', description: 'Vehicle systems', instructor: 'Dr. Nisha Reddy', duration: '7 weeks', branch: 'mech', level: 'Intermediate', icon: '🚗', color: '#65a30d' },
 
    { id: 36, title: 'Structural Analysis', description: 'Building structure design', instructor: 'Dr. Priyanka Sharma', duration: '10 weeks', branch: 'civil', level: 'Advanced', icon: '🏗️', color: '#8b5cf6' },
    { id: 37, title: 'Geotechnical Engineering', description: 'Soil mechanics', instructor: 'Prof. Vikas Rao', duration: '8 weeks', branch: 'civil', level: 'Intermediate', icon: '⛰️', color: '#d97706' },
    { id: 38, title: 'Transportation Engineering', description: 'Road and highway design', instructor: 'Dr. Rajeev Sinha', duration: '7 weeks', branch: 'civil', level: 'Intermediate', icon: '🛣️', color: '#059669' },

    
    { id: 48, title: 'Project Management', description: 'Agile and Waterfall methods', instructor: 'Dr. Rahul Kapoor', duration: '5 weeks', branch: 'common', level: 'Intermediate', icon: '📅', color: '#d97706' },
    { id: 49, title: 'Research Methodology', description: 'Academic research skills', instructor: 'Prof. Neha Sharma', duration: '4 weeks', branch: 'common', level: 'Intermediate', icon: '🔍', color: '#0d9488' },
    { id: 50, title: 'Ethics in Engineering', description: 'Professional responsibility', instructor: 'Dr. Priya Verma', duration: '3 weeks', branch: 'common', level: 'Beginner', icon: '⚖️', color: '#4338ca' }
  ]);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = selectedBranch === 'all' || course.branch === selectedBranch;
    const matchesLevel = selectedLevel === 'all' || course.level.toLowerCase() === selectedLevel.toLowerCase();
    
    return matchesSearch && matchesBranch && matchesLevel;
  });

  return (
    <div className="course-list-container">
      <div className="course-header">
        <h2 className="course-title">Discover Our Courses</h2>
        <p className="course-subtitle">Find the perfect course to advance your skills</p>
      </div>

      {/* Search and Filter Section */}
      <div className="search-filter-container">
        <div className={`search-container ${isFilterOpen ? 'filter-open' : ''}`}>
          <div className="search-input-wrapper">
            <svg className="search-icon" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button 
                className="clear-search"
                onClick={() => setSearchTerm('')}
              >
                <svg viewBox="0 0 24 24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            )}
          </div>

          <button 
            className="filter-toggle"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <svg className="filter-icon" viewBox="0 0 24 24">
              <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>
            </svg>
            Filters
          </button>
        </div>

        <div className={`filter-options ${isFilterOpen ? 'open' : ''}`}>
          <div className="filter-group">
            <label>Branch:</label>
            <select 
              value={selectedBranch} 
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="styled-select"
            >
              <option value="all">All Branches</option>
              {Object.entries(branches).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Level:</label>
            <select 
              value={selectedLevel} 
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="styled-select"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length > 0 ? (
        <div className="courses-grid">
          {filteredCourses.map((course, index) => (
            <CourseCard 
              key={course.id} 
              course={course} 
              branchName={branches[course.branch]}
              index={index}
            />
          ))}
        </div>
      ) : (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <h3>No courses found</h3>
          <p>Try adjusting your search or filters</p>
          <button 
            className="reset-filters"
            onClick={() => {
              setSearchTerm('');
              setSelectedBranch('all');
              setSelectedLevel('all');
            }}
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseList;