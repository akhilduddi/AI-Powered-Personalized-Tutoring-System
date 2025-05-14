import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const hamburgerAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(180deg); }
`;

// Mock data for different branches and levels
const mockMaterials = {
  CSE: {
    Beginner: {
      'Module 1': {
        title: 'Introduction to Programming',
        description: 'Learn the basics of programming with Python',
        modules: [
          {
            id: 1,
            title: 'Getting Started with Python',
            description: 'Introduction to Python programming language',
            topics: [
              {
                id: 1,
                title: 'Python Installation',
                description: 'How to install and set up Python on your computer'
              },
              {
                id: 2,
                title: 'First Python Program',
                description: 'Write and run your first Python program'
              }
            ]
          },
          {
            id: 2,
            title: 'Variables and Data Types',
            description: 'Understanding variables and different data types in Python',
            topics: [
              {
                id: 3,
                title: 'Variables',
                description: 'Learn about variables and how to use them'
              },
              {
                id: 4,
                title: 'Data Types',
                description: 'Explore different data types in Python'
              }
            ]
          }
        ],
        videos: [
          {
            id: 1,
            title: 'Python for Beginners',
            description: 'Complete Python tutorial for beginners',
            url: 'https://www.youtube.com/embed/_uQrJ0TkZlc'
          },
          {
            id: 2,
            title: 'Python Variables',
            description: 'Understanding variables in Python',
            url: 'https://www.youtube.com/embed/khKv-8qSNYm'
          }
        ]
      },
      'Module 2': {
        title: 'Control Structures',
        description: 'Learn about loops and conditional statements',
        modules: [
          {
            id: 3,
            title: 'If Statements',
            description: 'Understanding conditional statements',
            topics: [
              {
                id: 5,
                title: 'Basic If Statements',
                description: 'Learn how to use if statements'
              },
              {
                id: 6,
                title: 'Else and Elif',
                description: 'Understanding else and elif clauses'
              }
            ]
          }
        ],
        videos: [
          {
            id: 3,
            title: 'Python Control Structures',
            description: 'Learn about if statements and loops',
            url: 'https://www.youtube.com/embed/daefaLgNkw0'
          }
        ]
      }
    },
    Intermediate: {
      'Module 1': {
        title: 'Object-Oriented Programming',
        description: 'Learn about classes and objects in Python',
        modules: [
          {
            id: 4,
            title: 'Classes and Objects',
            description: 'Understanding object-oriented programming',
            topics: [
              {
                id: 7,
                title: 'Creating Classes',
                description: 'How to create and use classes'
              },
              {
                id: 8,
                title: 'Inheritance',
                description: 'Understanding class inheritance'
              }
            ]
          }
        ],
        videos: [
          {
            id: 4,
            title: 'Python OOP',
            description: 'Object-oriented programming in Python',
            url: 'https://www.youtube.com/embed/JeznW_7DlB0'
          }
        ]
      }
    }
  },
  ECE: {
    Beginner: {
      'Module 1': {
        title: 'Basic Electronics',
        description: 'Introduction to electronic components and circuits',
        modules: [
          {
            id: 5,
            title: 'Electronic Components',
            description: 'Learn about basic electronic components',
            topics: [
              {
                id: 9,
                title: 'Resistors',
                description: 'Understanding resistors and their uses'
              },
              {
                id: 10,
                title: 'Capacitors',
                description: 'Learn about capacitors and their applications'
              }
            ]
          }
        ],
        videos: [
          {
            id: 5,
            title: 'Basic Electronics',
            description: 'Introduction to electronic components',
            url: 'https://www.youtube.com/embed/6Maq5IyHSuc'
          }
        ]
      }
    }
  },
  EEE: {
    Beginner: {
      'Module 1': {
        title: 'Electrical Circuits',
        description: 'Introduction to electrical circuits and components',
        modules: [
          {
            id: 6,
            title: 'Circuit Basics',
            description: 'Understanding basic electrical circuits',
            topics: [
              {
                id: 11,
                title: 'Ohm\'s Law',
                description: 'Learn about Ohm\'s Law and its applications'
              },
              {
                id: 12,
                title: 'Series and Parallel Circuits',
                description: 'Understanding different circuit configurations'
              }
            ]
          }
        ],
        videos: [
          {
            id: 6,
            title: 'Electrical Circuits',
            description: 'Introduction to electrical circuits',
            url: 'https://www.youtube.com/embed/0PvJKHeCjsc'
          }
        ]
      }
    }
  }
};

const Material = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedBranch, setSelectedBranch] = useState(searchParams.get('branch') || 'CSE');
  const [selectedLevel, setSelectedLevel] = useState(searchParams.get('level') || 'Beginner');
  const [selectedModule, setSelectedModule] = useState(searchParams.get('module') || 'Module 1');
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const branches = ['CSE', 'ECE', 'EEE'];
  const levels = ['Beginner', 'Intermediate', 'Advanced'];
  const modules = ['Module 1', 'Module 2', 'Module 3'];

  useEffect(() => {
    setTimeout(() => {
      try {
        const materialData = mockMaterials[selectedBranch]?.[selectedLevel]?.[selectedModule];
        if (!materialData) {
          throw new Error('Material not found for the selected combination');
        }
        setMaterial(materialData);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 500);
  }, [selectedBranch, selectedLevel, selectedModule]);

  const handleBranchChange = (branch) => {
    setSelectedBranch(branch);
    navigate(`/materials?branch=${branch}&level=${selectedLevel}&module=${selectedModule}`);
  };

  const handleLevelChange = (level) => {
    setSelectedLevel(level);
    navigate(`/materials?branch=${selectedBranch}&level=${level}&module=${selectedModule}`);
  };

  const handleModuleChange = (module) => {
    setSelectedModule(module);
    navigate(`/materials?branch=${selectedBranch}&level=${selectedLevel}&module=${module}`);
  };

  return (
    <PageContainer>
      <Sidebar isOpen={isSidebarOpen}>
        <SidebarToggle 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          isOpen={isSidebarOpen}
        >
          <HamburgerIcon isOpen={isSidebarOpen}>
            <span></span>
            <span></span>
            <span></span>
          </HamburgerIcon>
        </SidebarToggle>
        <SidebarContent isOpen={isSidebarOpen}>
          <SidebarHeader>
            <h2>Navigation</h2>
          </SidebarHeader>
          <SidebarSection>
            <h3>Select Branch</h3>
            {branches.map(branch => (
              <SidebarButton
                key={branch}
                active={selectedBranch === branch}
                onClick={() => handleBranchChange(branch)}
              >
                {branch}
              </SidebarButton>
            ))}
          </SidebarSection>

          <SidebarDivider />

          <SidebarSection>
            <h3>Select Level</h3>
            {levels.map(level => (
              <SidebarButton
                key={level}
                active={selectedLevel === level}
                onClick={() => handleLevelChange(level)}
              >
                {level}
              </SidebarButton>
            ))}
          </SidebarSection>

          <SidebarDivider />

          <SidebarSection>
            <h3>Select Module</h3>
            {modules.map(module => (
              <SidebarButton
                key={module}
                active={selectedModule === module}
                onClick={() => handleModuleChange(module)}
              >
                {module}
              </SidebarButton>
            ))}
          </SidebarSection>
        </SidebarContent>
      </Sidebar>

      <MainContent isOpen={isSidebarOpen}>
        {loading ? (
          <LoadingState>
            <div className="loader"></div>
            <p>Loading material...</p>
          </LoadingState>
        ) : error ? (
          <ErrorState>
            <p>{error}</p>
          </ErrorState>
        ) : material ? (
          <>
            <Header>
              <h1>{material.title}</h1>
              <p>{material.description}</p>
            </Header>

            <ModuleGrid>
              {material.modules.map((module, index) => (
                <ModuleCard key={module.id} delay={index * 0.2}>
                  <h2>{module.title}</h2>
                  <p>{module.description}</p>
                  <TopicList>
                    {module.topics.map(topic => (
                      <TopicItem key={topic.id}>
                        <span>📚</span>
                        <div>
                          <h3>{topic.title}</h3>
                          <p>{topic.description}</p>
                        </div>
                      </TopicItem>
                    ))}
                  </TopicList>
                </ModuleCard>
              ))}
            </ModuleGrid>

            <VideoSection>
              <h2>Video Resources</h2>
              <VideoGrid>
                {material.videos.map(video => (
                  <VideoCard key={video.id}>
                    <iframe
                      src={video.url}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                    <div>
                      <h3>{video.title}</h3>
                      <p>{video.description}</p>
                    </div>
                  </VideoCard>
                ))}
              </VideoGrid>
            </VideoSection>
          </>
        ) : null}
      </MainContent>
    </PageContainer>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 3rem;
  animation: ${fadeIn} 0.8s ease-out;

  h1 {
    font-size: 2.5rem;
    color: #2c3e50;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  }

  p {
    font-size: 1.2rem;
    color: #34495e;
    max-width: 800px;
    margin: 0 auto;
    line-height: 1.6;
  }
`;

const ModuleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const ModuleCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.8s ease-out;
  animation-fill-mode: both;
  animation-delay: ${props => props.delay}s;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  }

  h2 {
    color: #2c3e50;
    margin-bottom: 1rem;
    font-size: 1.8rem;
    position: relative;
    padding-bottom: 0.5rem;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 50px;
      height: 3px;
      background: linear-gradient(90deg, #3498db, #9b59b6);
      border-radius: 3px;
    }
  }

  p {
    color: #34495e;
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }
`;

const TopicList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const TopicItem = styled.li`
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1rem;

  &:hover {
    background: #e9ecef;
    transform: translateX(10px);
  }

  span {
    font-size: 1.2rem;
    color: #3498db;
  }

  div {
    flex: 1;
  }

  h3 {
    color: #2c3e50;
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
  }

  p {
    color: #7f8c8d;
    font-size: 0.9rem;
    margin: 0;
  }
`;

const VideoSection = styled.div`
  margin-top: 3rem;
  animation: ${slideIn} 0.8s ease-out;

  h2 {
    color: #2c3e50;
    margin-bottom: 2rem;
    font-size: 2rem;
    text-align: center;
  }
`;

const VideoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const VideoCard = styled.div`
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  }

  iframe {
    width: 100%;
    height: 200px;
    border: none;
  }

  div {
    padding: 1.5rem;

    h3 {
      color: #2c3e50;
      margin-bottom: 0.5rem;
      font-size: 1.2rem;
    }

    p {
      color: #7f8c8d;
      font-size: 0.9rem;
      margin: 0;
    }
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 3rem;
  animation: ${pulse} 2s infinite;

  p {
    color: #2c3e50;
    font-size: 1.2rem;
    margin-top: 1rem;
  }
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 2rem;
  background: #fff5f5;
  border-radius: 10px;
  color: #e53e3e;
  margin: 2rem 0;
  animation: ${fadeIn} 0.5s ease-out;

  p {
    margin: 0;
    font-size: 1.1rem;
  }
`;

const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Sidebar = styled.div`
  width: ${props => props.isOpen ? '280px' : '60px'};
  background: #2c3e50;
  position: fixed;
  height: 100vh;
  overflow-x: hidden;
  box-shadow: 3px 0 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
`;

const SidebarContent = styled.div`
  width: 280px;
  padding: 1rem;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  margin-top: 60px;
`;

const SidebarHeader = styled.div`
  padding: 1rem;
  color: white;
  text-align: center;
  margin-bottom: 1rem;

  h2 {
    font-size: 1.5rem;
    font-weight: 500;
    margin: 0;
  }
`;

const SidebarDivider = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 1rem 0;
`;

const SidebarToggle = styled.button`
  position: fixed;
  left: ${props => props.isOpen ? '240px' : '20px'};
  top: 20px;
  width: 40px;
  height: 40px;
  background: ${props => props.isOpen ? '#2c3e50' : '#3498db'};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);

  &:hover {
    background: ${props => props.isOpen ? '#34495e' : '#2980b9'};
    transform: scale(1.05);
  }

  &:focus {
    outline: none;
  }
`;

const HamburgerIcon = styled.div`
  width: 20px;
  height: 20px;
  position: relative;
  transform: rotate(0deg);
  transition: 0.3s ease-in-out;
  cursor: pointer;

  span {
    display: block;
    position: absolute;
    height: 2px;
    width: 100%;
    background: white;
    border-radius: 2px;
    opacity: 1;
    left: 0;
    transform: rotate(0deg);
    transition: 0.25s ease-in-out;

    &:nth-child(1) {
      top: ${props => props.isOpen ? '9px' : '0px'};
      transform: ${props => props.isOpen ? 'rotate(45deg)' : 'rotate(0)'};
    }

    &:nth-child(2) {
      top: 9px;
      opacity: ${props => props.isOpen ? '0' : '1'};
      width: ${props => props.isOpen ? '0%' : '100%'};
    }

    &:nth-child(3) {
      top: ${props => props.isOpen ? '9px' : '18px'};
      transform: ${props => props.isOpen ? 'rotate(-45deg)' : 'rotate(0)'};
    }
  }
`;

const SidebarSection = styled.div`
  margin-bottom: 1.5rem;
  padding: 0 1rem;

  h3 {
    color: #ecf0f1;
    margin-bottom: 1rem;
    font-size: 1rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 1px;
    position: relative;
    padding-bottom: 0.5rem;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 30px;
      height: 2px;
      background: #3498db;
      border-radius: 2px;
    }
  }
`;

const SidebarButton = styled.button`
  width: 100%;
  padding: 0.8rem 1rem;
  margin-bottom: 0.5rem;
  border: none;
  border-radius: 8px;
  background: ${props => props.active ? '#3498db' : 'rgba(255, 255, 255, 0.05)'};
  color: ${props => props.active ? 'white' : '#bdc3c7'};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  display: flex;
  align-items: center;

  &:hover {
    background: ${props => props.active ? '#3498db' : 'rgba(255, 255, 255, 0.1)'};
    transform: translateX(5px);
    color: white;
  }

  &:focus {
    outline: none;
  }
`;

const MainContent = styled.div`
  flex: 1;
  margin-left: ${props => props.isOpen ? '280px' : '60px'};
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 100vh;
`;

export default Material; 