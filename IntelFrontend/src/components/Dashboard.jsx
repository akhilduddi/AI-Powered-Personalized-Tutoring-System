import { Link } from 'react-router-dom';
import './../styles/layout.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1>Welcome to your Dashboard</h1>
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>Your Courses</h3>
          <p>View and manage your enrolled courses</p>
          <Link to="/courses" className="dashboard-link">Go to Courses</Link>
        </div>
        <div className="dashboard-card">
          <h3>Upcoming Tests</h3>
          <p>Check your upcoming assessments</p>
          <Link to="/tests" className="dashboard-link">View Tests</Link>
        </div>
        <div className="dashboard-card">
          <h3>Your Progress</h3>
          <p>Track your learning journey</p>
          <Link to="/profile" className="dashboard-link">View Profile</Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;