import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';

const SupremeTest = () => {
  // State for filters
  const [filters, setFilters] = useState({
    branch: '',
    level: '',
    module: ''
  });

  // State for available options
  const [options, setOptions] = useState({
    branches: [],
    levels: [],
    modules: []
  });

  // Test state
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [levelRecommendation, setLevelRecommendation] = useState("");
  const [percentage, setPercentage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const navigate = useNavigate();

  // Fetch initial options
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        // In a real app, you would have API endpoints for these
        const branches = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL'];
        const levels = ['Newbie', 'Intermediate', 'Advanced', 'Expert'];
        const modules = ['Module 1', 'Module 2', 'Module 3', 'Module 4'];
        
        setOptions({
          branches,
          levels,
          modules
        });
      } catch (err) {
        setError('Failed to load filter options');
        console.error(err);
      }
    };

    fetchOptions();
  }, []);

  // Fetch questions when filters change
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!filters.branch || !filters.level || !filters.module) return;

      setLoading(true);
      setError(null);
      setCurrentQuestionIndex(0);
      setAnswers({});
      setSubmitted(false);
      setScore(0);
      setShowPopup(false);
      setTimeLeft(600);
      
      try {
        const response = await axios.get(
          `http://localhost:7800/questions/branch/${encodeURIComponent(filters.branch)}/level/${encodeURIComponent(filters.level)}/module/${encodeURIComponent(filters.module)}`
        );
        setQuestions(response.data);
      } catch (err) {
        setError('Failed to load questions. Please try again.');
        console.error('Error fetching questions:', err);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [filters]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0 || submitted) {
      if (!submitted) handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const handleOptionSelect = (questionId, option) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const getCourseLevel = (percent) => {
    if (percent <= 20) return "Newbie (Level 1) → Foundational topics, slow pace.";
    if (percent <= 40) return "Beginner (Level 2) → Basic concepts with examples.";
    if (percent <= 60) return "Intermediate (Level 3) → Practical applications, case studies.";
    if (percent <= 80) return "Advanced (Level 4) → Deep concepts, real-world projects.";
    return "Expert (Level 5) → Complex problem-solving.";
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    let calculatedScore = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q[`option_${q.correct_option.toLowerCase()}`]) {
        calculatedScore += q.marks;
      }
    });

    const percent = Math.round((calculatedScore / questions.reduce((total, q) => total + q.marks, 0)) * 100);
    setScore(calculatedScore);
    setPercentage(percent);
    setLevelRecommendation(getCourseLevel(percent));
    setSubmitted(true);
    setShowPopup(true);

    try {
      await axios.post("http://localhost:7800/submit-answers", { 
        answers, 
        score: calculatedScore, 
        percentage: percent,
        branch: filters.branch,
        level: filters.level,
        module: filters.module
      });
    } catch (error) {
      console.error("Error submitting answers:", error);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setFilters({ branch: '', level: '', module: '' });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const currentQuestion = questions[currentQuestionIndex];
  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <Container>
      {/* Filter Section - Only shown before test starts */}
      {!questions.length && (
        <FilterSection>
          <h2>Select Test Parameters</h2>
          <FilterGrid>
            {/* Branch Filter */}
            <FilterGroup>
              <label>Branch</label>
              <Select
                value={filters.branch}
                onChange={(e) => handleFilterChange('branch', e.target.value)}
              >
                <option value="">Select Branch</option>
                {options.branches.map(branch => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
              </Select>
            </FilterGroup>

            {/* Level Filter */}
            <FilterGroup>
              <label>Level</label>
              <Select
                value={filters.level}
                onChange={(e) => handleFilterChange('level', e.target.value)}
                disabled={!filters.branch}
              >
                <option value="">Select Level</option>
                {options.levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </Select>
            </FilterGroup>

            {/* Module Filter */}
            <FilterGroup>
              <label>Module</label>
              <Select
                value={filters.module}
                onChange={(e) => handleFilterChange('module', e.target.value)}
                disabled={!filters.level}
              >
                <option value="">Select Module</option>
                {options.modules.map(module => (
                  <option key={module} value={module}>{module}</option>
                ))}
              </Select>
            </FilterGroup>
          </FilterGrid>
        </FilterSection>
      )}

      {/* Loading State */}
      {loading && (
        <LoadingState>
          <Loader />
          <p>Loading questions...</p>
        </LoadingState>
      )}

      {/* Error State */}
      {error && (
        <ErrorState>
          <ErrorIcon>⚠️</ErrorIcon>
          <p>{error}</p>
        </ErrorState>
      )}

      {/* Test Interface */}
      {!loading && !error && questions.length > 0 && (
        <TestInterface>
          {/* Test Header */}
          <TestHeader>
            <TestInfo>
              <h3>{filters.branch} - {filters.level} - {filters.module}</h3>
              <p>Question {currentQuestionIndex + 1} of {questions.length}</p>
            </TestInfo>
            <Timer>{formatTime(timeLeft)}</Timer>
          </TestHeader>

          {/* Progress Bar */}
          <ProgressBar>
            <ProgressFill 
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </ProgressBar>

          {/* Question Card */}
          <QuestionCard>
            <QuestionText>{currentQuestion.question}</QuestionText>
            
            <OptionsList>
              {['A', 'B', 'C', 'D'].map((option, idx) => {
                const optionKey = `option_${option.toLowerCase()}`;
                const isSelected = answers[currentQuestion.id] === currentQuestion[optionKey];
                const isCorrect = submitted && currentQuestion[optionKey] === currentQuestion[`option_${currentQuestion.correct_option.toLowerCase()}`];
                
                return (
                  <OptionItem 
                    key={option}
                    onClick={() => !submitted && handleOptionSelect(currentQuestion.id, currentQuestion[optionKey])}
                    $isSelected={isSelected}
                    $isCorrect={isCorrect}
                    $submitted={submitted}
                  >
                    <OptionRadio 
                      type="radio" 
                      checked={isSelected}
                      readOnly
                    />
                    <OptionLabel>
                      <OptionLetter>{optionLabels[idx]}.</OptionLetter>
                      {currentQuestion[optionKey]}
                    </OptionLabel>
                    {submitted && isCorrect && (
                      <CorrectBadge>Correct</CorrectBadge>
                    )}
                    {submitted && isSelected && !isCorrect && (
                      <IncorrectBadge>Incorrect</IncorrectBadge>
                    )}
                  </OptionItem>
                );
              })}
            </OptionsList>
          </QuestionCard>

          {/* Navigation Buttons */}
          <NavigationButtons>
            <NavButton 
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </NavButton>
            
            {currentQuestionIndex < questions.length - 1 ? (
              <NavButton 
                onClick={handleNextQuestion}
                disabled={!answers[currentQuestion.id]}
              >
                Next
              </NavButton>
            ) : (
              <SubmitButton 
                onClick={handleSubmit}
                disabled={submitted || !answers[currentQuestion.id]}
              >
                Submit Test
              </SubmitButton>
            )}
          </NavigationButtons>
        </TestInterface>
      )}

      {/* Results Popup */}
      {showPopup && (
        <PopupOverlay>
          <PopupContent>
            <ResultHeader>
              <ResultIcon>🎯</ResultIcon>
              <h2>Test Results</h2>
            </ResultHeader>
            
            <ResultBody>
              <ScoreCircle>
                <CircleBackground />
                <CircleProgress $percentage={percentage} />
                <CircleInner>
                  <ScoreText>
                    <p>{score}<span>/{questions.reduce((total, q) => total + q.marks, 0)}</span></p>
                    <small>Total Marks</small>
                  </ScoreText>
                  <PercentageText>{percentage}%</PercentageText>
                </CircleInner>
              </ScoreCircle>

              <LevelRecommendation>
                <h4>Recommended Level:</h4>
                <p>{levelRecommendation}</p>
              </LevelRecommendation>

              <ButtonGroup>
                <RetryButton onClick={closePopup}>Take Another Test</RetryButton>
                <NextButton onClick={() => navigate('/dashboard')}>
                  View Dashboard
                </NextButton>
              </ButtonGroup>
            </ResultBody>
          </PopupContent>
        </PopupOverlay>
      )}
    </Container>
  );
};

// Animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const zoomIn = keyframes`
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Styled Components
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const FilterSection = styled.div`
  background: white;
  border-radius: 10px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);

  h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #2c3e50;
  }
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const FilterGroup = styled.div`
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #4a5568;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background-color: white;
  font-size: 1rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
  }

  &:disabled {
    background-color: #f7fafc;
    cursor: not-allowed;
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const Loader = styled.div`
  display: inline-block;
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 1rem;
`;

const ErrorState = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #fff5f5;
  border-radius: 6px;
  color: #e53e3e;
  margin-bottom: 1rem;
`;

const ErrorIcon = styled.span`
  font-size: 1.5rem;
`;

const TestInterface = styled.div`
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const TestHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #4299e1;
  color: white;
`;

const TestInfo = styled.div`
  h3 {
    margin: 0;
    font-size: 1.1rem;
  }

  p {
    margin: 0.25rem 0 0;
    font-size: 0.9rem;
    opacity: 0.9;
  }
`;

const Timer = styled.div`
  background: rgba(0, 0, 0, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: bold;
  font-size: 1.1rem;
`;

const ProgressBar = styled.div`
  height: 6px;
  background: #e2e8f0;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: #48bb78;
  transition: width 0.3s ease;
`;

const QuestionCard = styled.div`
  padding: 1.5rem;
`;

const QuestionText = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  color: #2d3748;
  line-height: 1.4;
`;

const OptionsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const OptionItem = styled.li`
  padding: 1rem;
  margin-bottom: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s;
  border: 1px solid ${props => {
    if (props.$submitted && props.$isCorrect) return '#48bb78';
    if (props.$submitted && props.$isSelected && !props.$isCorrect) return '#f56565';
    if (props.$isSelected) return '#4299e1';
    return '#e2e8f0';
  }};
  background-color: ${props => {
    if (props.$submitted && props.$isCorrect) return '#f0fff4';
    if (props.$submitted && props.$isSelected && !props.$isCorrect) return '#fff5f5';
    if (props.$isSelected) return '#ebf8ff';
    return 'white';
  }};

  &:hover {
    background-color: ${props => !props.$submitted && '#ebf8ff'};
    border-color: ${props => !props.$submitted && '#bee3f8'};
  }
`;

const OptionRadio = styled.input`
  margin-right: 1rem;
  cursor: pointer;
`;

const OptionLabel = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;

const OptionLetter = styled.span`
  font-weight: bold;
  margin-right: 0.5rem;
  color: #4299e1;
`;

const CorrectBadge = styled.span`
  margin-left: 1rem;
  padding: 0.25rem 0.5rem;
  background: #48bb78;
  color: white;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
`;

const IncorrectBadge = styled.span`
  margin-left: 1rem;
  padding: 0.25rem 0.5rem;
  background: #f56565;
  color: white;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
`;

const NavButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #e2e8f0;
  background: white;

  &:hover {
    background: #f7fafc;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background: #4299e1;
  color: white;
  border: none;

  &:hover {
    background: #3182ce;
  }

  &:disabled {
    background: #a0aec0;
    cursor: not-allowed;
  }
`;

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease;
`;

const PopupContent = styled.div`
  background: white;
  border-radius: 15px;
  width: 90%;
  max-width: 500px;
  padding: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  animation: ${zoomIn} 0.3s ease;
`;

const ResultHeader = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
`;

const ResultIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const ResultBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ScoreCircle = styled.div`
  position: relative;
  width: 180px;
  height: 180px;
  margin: 0 auto 2rem;
`;

const CircleBackground = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #f3f3f3;
`;

const CircleProgress = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  clip: ${props => `rect(0, 180px, 180px, ${90 - (props.$percentage * 0.9)}px)`};
  background: #4CAF50;
  transform: rotate(0deg);
`;

const CircleInner = styled.div`
  position: absolute;
  width: 140px;
  height: 140px;
  background: white;
  border-radius: 50%;
  top: 20px;
  left: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ScoreText = styled.div`
  text-align: center;
  margin-bottom: 0.5rem;
  
  p {
    font-size: 2rem;
    font-weight: bold;
    margin: 0;
    color: #2c3e50;
    
    span {
      font-size: 1rem;
      color: #7f8c8d;
    }
  }
  
  small {
    color: #7f8c8d;
    font-size: 0.8rem;
  }
`;

const PercentageText = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #4CAF50;
`;

const LevelRecommendation = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 1.5rem;
  width: 100%;
  text-align: center;
  
  h4 {
    margin: 0 0 0.5rem;
    color: #2c3e50;
  }
  
  p {
    margin: 0;
    color: #7f8c8d;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
`;

const RetryButton = styled.button`
  flex: 1;
  background: white;
  color: #3498db;
  border: 2px solid #3498db;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    background: #f0f7fd;
  }
`;

const NextButton = styled.button`
  flex: 1;
  background: linear-gradient(135deg, #3498db, #9b59b6);
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

export default SupremeTest;