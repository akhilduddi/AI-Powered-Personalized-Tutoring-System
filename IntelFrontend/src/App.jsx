import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import CourseList from './components/CourseList';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import AdminPanel from './components/AdminPanel';
import ModuleView from './components/ModuleView';
import TestQuestion from './components/TestQuestion';
import TestResults from './components/TestResults';
import './styles/layout.css';
import Home from './components/Home';
import DiscoverYourSelf from './components/DiscoverYourSelf';
import Supreme from './components/Supreme';
import Material from './components/Material';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/courses" element={<CourseList />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/module/:id" element={<ModuleView />} />
            <Route path="/test/:id" element={<TestQuestion />} />
            <Route path="/results/:id" element={<TestResults />} />
            <Route path="/testQuestions" element={<TestQuestion />} />
            <Route path="/discover-yourself" element={<DiscoverYourSelf />} />
            <Route path="/supreme" element={<Supreme />} />

            <Route path="/materials" element={<Material />} />
          
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;