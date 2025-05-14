import './../styles/courses.css';

// CourseCard.jsx
const CourseCard = ({ course, branchName, index }) => {
  return (
    <div 
      className="course-card"
      style={{ 
        '--card-color': course.color || '#3b82f6',
        animationDelay: `${index * 0.1}s` 
      }}
    >
      <div className="card-icon" style={{ backgroundColor: course.color }}>
        {course.icon}
      </div>
      <div className="card-content">
        <h3>{course.title}</h3>
        <p className="card-description">{course.description}</p>
        <div className="card-meta">
          <span className="branch">{branchName}</span>
          <span className={`level ${course.level.toLowerCase()}`}>
            {course.level}
          </span>
        </div>
        <div className="card-footer">
          <span className="instructor">👨‍🏫 {course.instructor}</span>
          <span className="duration">⏱️ {course.duration}</span>
        </div>
      </div>
    </div>
  );
};
export default CourseCard;