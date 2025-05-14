import '../styles/courses.css';

export default function ModuleView() {
  const module = {
    title: 'React Components',
    content: 'In this module, you will learn about React components and how to create reusable UI elements.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '15 min'
  };

  return (
    <div className="module-view">
      <h2>{module.title}</h2>
      <p>{module.content}</p>
      <div className="video-container">
        <iframe 
          width="560" 
          height="315" 
          src={module.videoUrl} 
          title={module.title}
          allowFullScreen
        ></iframe>
      </div>
      <div className="module-actions">
        <button className="prev-btn">Previous</button>
        <button className="next-btn">Next</button>
      </div>
    </div>
  );
}