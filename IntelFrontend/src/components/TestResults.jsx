import '../styles/tests.css';

export default function TestResults({ score, total }) {
  return (
    <div className="test-results">
      <h2>Test Results</h2>
      <div className="score">
        You scored {score} out of {total} ({Math.round((score / total) * 100)}%)
      </div>
      <button className="retake-btn">Retake Test</button>
      <button className="return-btn">Return to Course</button>
    </div>
  );
}