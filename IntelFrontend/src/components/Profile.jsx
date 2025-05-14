import '../styles/layout.css';

export default function Profile() {
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    joined: 'January 2023',
    coursesEnrolled: 3,
    testsCompleted: 5
  };

  return (
    <div className="profile">
      <h2>Your Profile</h2>
      <div className="profile-info">
        <div className="avatar">
          <img src="https://via.placeholder.com/150" alt="User Avatar" />
        </div>
        <div className="details">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Member since:</strong> {user.joined}</p>
          <p><strong>Courses enrolled:</strong> {user.coursesEnrolled}</p>
          <p><strong>Tests completed:</strong> {user.testsCompleted}</p>
        </div>
      </div>
      <button className="edit-profile-btn">Edit Profile</button>
    </div>
  );
}