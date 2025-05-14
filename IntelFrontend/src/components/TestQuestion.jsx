import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";

const TestQuestion = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [level, setLevel] = useState("");
  const [percentage, setPercentage] = useState(0);
  const [selectedBranch, setSelectedBranch] = useState("CSE");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const branches = [
    { value: "CSE", label: "Computer Science" },
    { value: "ECE", label: "Electronics" },
    { value: "MECH", label: "Mechanical" },
    { value: "CIVIL", label: "Civil" },
    { value: "EEE", label: "Electrical" },
  ];

  useEffect(() => {
    const branchFromUrl = searchParams.get('branch');
    if (branchFromUrl && branches.some(b => b.value === branchFromUrl)) {
      setSelectedBranch(branchFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchQuestions(selectedBranch);
  }, [selectedBranch]);

  const fetchQuestions = (branch) => {
    setLoading(true);
    setError(null);
    fetch(`http://localhost:7800/questions/pretest/${branch}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch questions");
        return res.json();
      })
      .then((data) => {
        setQuestions(data);
        setAnswers({});
        setSubmitted(false);
        setScore(0);
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
        setError(error.message);
      })
      .finally(() => setLoading(false));
  };

  const handleBranchChange = (e) => {
    setSelectedBranch(e.target.value);
  };

  const handleOptionChange = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const getCourseLevel = (percent) => {
    if (percent <= 20) return "Newbie (Level 1) → Foundational topics, slow pace.";
    if (percent <= 40) return "Beginner (Level 2) → Basic concepts with examples.";
    if (percent <= 60) return "Intermediate (Level 3) → Practical applications, case studies.";
    if (percent <= 80) return "Advanced (Level 4) → Deep concepts, real-world projects.";
    return "Expert (Level 5) → Complex problem-solving.";
  };

  const handleSubmit = async () => {
    let calculatedScore = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q[`option_${q.correct_option.toLowerCase()}`]) {
        calculatedScore += q.marks;
      }
    });

    const percent = Math.round((calculatedScore / questions.length) * 100);
    setScore(calculatedScore);
    setPercentage(percent);
    setLevel(getCourseLevel(percent));
    setSubmitted(true);
    setShowPopup(true);

    try {
      await fetch("http://localhost:7800/submit-answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          answers, 
          score: calculatedScore, 
          percentage: percent,
          branch: selectedBranch
        }),
      });
    } catch (error) {
      console.error("Error submitting answers:", error);
    }
  };

  const closePopup = () => setShowPopup(false);
  
  const moveToNextModule = () => {
    const levelNumber = level.match(/Level (\d+)/)?.[1] || '1';
    navigate(`/supreme?branch=${selectedBranch}&level=${levelNumber}`);
  };

  const optionLabels = ["A", "B", "C", "D"];

  return (
    <Container>
      <PageTitle>Pre-Test Questions</PageTitle>
      
      <BranchSelectorContainer>
        <SelectorWrapper>
          <SelectorLabel>Select Your Course:</SelectorLabel>
          <BranchSelector 
            value={selectedBranch} 
            onChange={handleBranchChange}
            disabled={submitted}
          >
            {branches.map((branch) => (
              <option key={branch.value} value={branch.value}>
                {branch.label}
              </option>
            ))}
          </BranchSelector>
          <SelectorArrow />
        </SelectorWrapper>
      </BranchSelectorContainer>

      {loading && (
        <LoadingAnimation>
          <Loader />
          <p>Loading questions...</p>
        </LoadingAnimation>
      )}

      {error && (
        <ErrorMessage>
          ⚠️ {error}
        </ErrorMessage>
      )}

      {!loading && !error && questions.length > 0 && (
        <QuestionsWrapper>
          {questions.map((q, index) => (
            <QuestionCard key={q.id}>
              <QuestionText>{index + 1}. {q.question}</QuestionText>

              <OptionsGroup>
                {["option_a", "option_b", "option_c", "option_d"].map((opt, idx) => (
                  <OptionLabel 
                    key={opt}
                    $submitted={submitted}
                    $isSelected={answers[q.id] === q[opt]}
                    $isCorrect={submitted && q[opt] === q[`option_${q.correct_option.toLowerCase()}`]}
                  >
                    <input
                      type="radio"
                      name={`question-${q.id}`}
                      value={q[opt]}
                      checked={answers[q.id] === q[opt]}
                      onChange={() => handleOptionChange(q.id, q[opt])}
                      disabled={submitted}
                    />
                    <OptionLetter>{optionLabels[idx]}.</OptionLetter> {q[opt]}
                  </OptionLabel>
                ))}
              </OptionsGroup>
            </QuestionCard>
          ))}

          {!submitted && (
            <SubmitButton 
              onClick={handleSubmit}
              disabled={Object.keys(answers).length !== questions.length}
            >
              Get Results
            </SubmitButton>
          )}
        </QuestionsWrapper>
      )}

      {!loading && !error && questions.length === 0 && (
        <EmptyState>
          <EmptyIcon>📭</EmptyIcon>
          <h3>No questions available</h3>
          <p>There are no questions for the selected course yet.</p>
        </EmptyState>
      )}

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
                    <p>{score}<span>/{questions.length}</span></p>
                    <small>Correct Answers</small>
                  </ScoreText>
                  <PercentageText>{percentage}%</PercentageText>
                </CircleInner>
              </ScoreCircle>

              <LevelRecommendation>
                <h4>Recommended Level:</h4>
                <p>{level}</p>
              </LevelRecommendation>

              <ButtonGroup>
                <RetryButton onClick={closePopup}>Retry Test</RetryButton>
                <NextButton onClick={moveToNextModule}>Continue Learning</NextButton>
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

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-20px); }
  60% { transform: translateY(-10px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Styled Components
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const PageTitle = styled.h1`
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
  font-size: 2.2rem;
  position: relative;

  &::after {
    content: '';
    display: block;
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, #3498db, #9b59b6);
    margin: 0.5rem auto 0;
    border-radius: 2px;
  }
`;

const BranchSelectorContainer = styled.div`
  margin-bottom: 2rem;
  animation: ${fadeIn} 0.6s ease-out;
`;

const SelectorWrapper = styled.div`
  position: relative;
  max-width: 400px;
  margin: 0 auto;
`;

const SelectorLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #7f8c8d;
  font-weight: 500;
  text-align: center;
`;

const BranchSelector = styled.select`
  width: 100%;
  padding: 12px 16px;
  font-size: 1rem;
  border: 2px solid #dfe6e9;
  border-radius: 8px;
  background-color: white;
  appearance: none;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
  }
`;

const SelectorArrow = styled.div`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid #7f8c8d;
  pointer-events: none;
  transition: transform 0.2s ease;

  ${BranchSelector}:focus ~ & {
    transform: translateY(-50%) rotate(180deg);
  }
`;

const LoadingAnimation = styled.div`
  text-align: center;
  margin: 3rem 0;
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

const ErrorMessage = styled.div`
  background-color: #ffecec;
  color: #e74c3c;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  margin: 2rem 0;
  border-left: 4px solid #e74c3c;
  animation: ${fadeIn} 0.3s ease;
`;

const QuestionsWrapper = styled.div`
  animation: ${fadeIn} 0.6s ease;
`;

const QuestionCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  transform-origin: top;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }
`;

const QuestionText = styled.h2`
  font-size: 1.2rem;
  color: #2c3e50;
  margin-bottom: 1rem;
`;

const OptionsGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const OptionLabel = styled.label`
  display: flex;
  align-items: center;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  background: ${props => {
    if (!props.$submitted) return '#f8f9fa';
    if (props.$isSelected && props.$isCorrect) return '#e6f7ee';
    if (props.$isSelected && !props.$isCorrect) return '#fde8e8';
    if (!props.$isSelected && props.$isCorrect) return '#e6f7ee';
    return '#f8f9fa';
  }};
  border: 1px solid ${props => {
    if (!props.$submitted) return '#dfe6e9';
    if (props.$isSelected && props.$isCorrect) return '#4CAF50';
    if (props.$isSelected && !props.$isCorrect) return '#e74c3c';
    if (!props.$isSelected && props.$isCorrect) return '#4CAF50';
    return '#dfe6e9';
  }};
  cursor: pointer;
  transition: all 0.2s ease;

  input {
    margin-right: 10px;
    cursor: pointer;
  }

  &:hover {
    background: #e8f4fd;
    border-color: #3498db;
  }
`;

const OptionLetter = styled.span`
  font-weight: bold;
  margin-right: 5px;
  color: #3498db;
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #3498db, #9b59b6);
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  margin: 2rem auto;
  display: block;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 10px;
  margin: 2rem 0;
  animation: ${pulse} 2s infinite;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  animation: ${bounce} 2s infinite;
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
  animation: ${bounce} 1s;
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

export default TestQuestion;