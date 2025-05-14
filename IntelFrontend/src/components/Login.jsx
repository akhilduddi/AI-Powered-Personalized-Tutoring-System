import { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';

// Animations
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Styled Components
const CosmicBackground = styled.div`
  min-height: 100vh;
  background: linear-gradient(-45deg, #0f0c29, #302b63, #24243e, #000000);
  background-size: 400% 400%;
  animation: ${gradientShift} 15s ease infinite;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const Stars = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(2px 2px at 20px 30px, #fff, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 40px 70px, #fff, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 90px 40px, #fff, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 130px 80px, #fff, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 160px 120px, #fff, rgba(0,0,0,0));
  background-size: 200px 200px;
`;

const FloatingPlanet = styled.div`
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #4e54c8, #302b63);
  box-shadow: inset -25px -25px 40px rgba(0,0,0,0.5);
  right: -100px;
  bottom: -100px;
  opacity: 0.3;
  animation: ${float} 12s ease-in-out infinite;
  z-index: 0;
`;

const FormCard = styled(motion.div)`
  background: rgba(15, 12, 41, 0.8);
  border-radius: 16px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  position: relative;
  z-index: 2;
`;

const Title = styled.h2`
  color: #fff;
  text-align: center;
  margin-bottom: 32px;
  font-size: 28px;
  font-weight: 600;
  letter-spacing: 0.5px;
  position: relative;
  
  &::after {
    content: '';
    display: block;
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, #8e2de2, #4a00e0);
    margin: 16px auto 0;
    border-radius: 3px;
  }
`;

const InputGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 12px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.3s ease;
  color: #fff;
  background: rgba(255, 255, 255, 0.05);
  
  &:focus {
    border-color: #8e2de2;
    outline: none;
    box-shadow: 0 0 0 3px rgba(142, 45, 226, 0.3);
    background: rgba(255, 255, 255, 0.08);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

const Button = styled(motion.button)`
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #8e2de2, #4a00e0);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #4a00e0, #8e2de2);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
  }

  &:hover::before {
    opacity: 1;
  }

  &:disabled {
    background: #6a6a8e;
    cursor: not-allowed;
    
    &::before {
      display: none;
    }
  }
`;

const ErrorText = styled(motion.p)`
  color: #ff6b6b;
  font-size: 13px;
  margin-top: 8px;
  padding-left: 4px;
`;

const Alert = styled(motion.div)`
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ErrorAlert = styled(Alert)`
  background: rgba(255, 107, 107, 0.1);
  color: #ff6b6b;
  border: 1px solid rgba(255, 107, 107, 0.3);
`;

const Spinner = styled.div`
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      const response = await axios.post('http://localhost:7800/login', formData);
      
      if (response.status === 200) {
        localStorage.setItem('authToken', response.data.token || 'dummy-token');
        navigate('/discover-yourself');
      }
    } catch (error) {
      setSubmitError(error.response?.data?.message || 'Login failed. Please check your credentials.');
      setTimeout(() => {
        navigate('/testQuestions');
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CosmicBackground>
      <Stars />
      <FloatingPlanet />
      
      <FormCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Title>Cosmic Portal</Title>
        
        <AnimatePresence>
          {submitError && (
            <ErrorAlert
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {submitError}
            </ErrorAlert>
          )}
        </AnimatePresence>
        
        <form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>Stellar ID</Label>
            <Input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your cosmic identifier"
            />
            {errors.username && (
              <ErrorText
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.username}
              </ErrorText>
            )}
          </InputGroup>
          
          <InputGroup>
            <Label>Nebula Key</Label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your secret passphrase"
            />
            {errors.password && (
              <ErrorText
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.password}
              </ErrorText>
            )}
          </InputGroup>
          
          <Button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? (
              <>
                <Spinner />
                Warping In...
              </>
            ) : 'Access Portal'}
          </Button>
        </form>
      </FormCard>
    </CosmicBackground>
  );
};

export default Login;