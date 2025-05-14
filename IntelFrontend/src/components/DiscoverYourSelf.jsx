import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './../styles/discoverYourself.css';

const DiscoverYourSelf = () => {
  const navigate = useNavigate();
  const branches = [
    {
      id: 1,
      name: 'CSE',
      value: 'CSE',
      description: 'Explore programming, algorithms, and software development.',
      logo: '💻',
      color: '#6366f1'
    },
    {
      id: 2,
      name: 'ECE',
      value: 'ECE',
      description: 'Dive into circuits, microprocessors, and embedded systems.',
      logo: '🔌',
      color: '#10b981'
    },
    {
      id: 3,
      name: 'EEE',
      value: 'EEE',
      description: 'Bridging power engineering and electronics.',
      logo: '⚡',
      color: '#ec4899'
    },
    {
      id: 4,
      name: 'Mechanical',
      value: 'MECH',
      description: 'Master machines, thermodynamics, and robotics.',
      logo: '⚙️',
      color: '#f59e0b'
    },
    {
      id: 5,
      name: 'Civil',
      value: 'CIVIL',
      description: 'Shape the world with infrastructure design.',
      logo: '🏗️',
      color: '#8b5cf6'
    }
  ];

  const handlePreTest = (branchValue) => {
    navigate(`/testQuestions?branch=${branchValue}`);
  };

  return (
    <div className="discover-container">
      <div className="discover-header">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="discover-title"
        >
          Discover Your Engineering Path
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="discover-subtitle"
        >
          Take our pre-test to find which engineering branch suits you best
        </motion.p>
      </div>

      <motion.div 
        className="branches-grid"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
          }
        }}
      >
        {branches.map((branch) => (
          <motion.div 
            key={branch.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
            whileHover={{ scale: 1.03 }}
            className="branch-card"
            style={{ '--card-color': branch.color }}
          >
            <div className="branch-logo" style={{ backgroundColor: branch.color }}>
              {branch.logo}
            </div>
            <h3>{branch.name}</h3>
            <p>{branch.description}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="pre-test-button"
              onClick={() => handlePreTest(branch.value)}
              style={{ backgroundColor: branch.color }}
            >
              Take Pre-Test
            </motion.button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default DiscoverYourSelf;