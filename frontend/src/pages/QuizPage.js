import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './QuizPage.css';

const QuizPage = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [timeRemaining, setTimeRemaining] = useState(300);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get('https://krish-2512.github.io/api/questions-2.json');
                const shuffled = response.data.sort(() => 0.5 - Math.random());
                setQuestions(shuffled.slice(0, 10));
            } catch (err) {
                console.error("Error loading questions:", err);
            }
        };
        fetchQuestions();
    }, []);

    useEffect(() => {
        if (timeRemaining <= 0) {
            handleFinalSubmit();
        }
        const timerId = setInterval(() => {
            setTimeRemaining((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timerId);
    }, [timeRemaining]);

    const handleAnswerChange = (answer) => {
        setUserAnswers((prev) => ({ ...prev, [currentQuestion]: answer }));
    };

    const calculateScore = () => {
        let score = 0;
        questions.forEach((question, index) => {
            const userAnswer = userAnswers[index];
            if (userAnswer === question.answer) {
                score += 3;
            } else if (userAnswer) {
                score -= 1; 
            }
        });
        return score;
    };

    const handleFinalSubmit = async () => {
        const score = calculateScore();
        console.log("Score:", score);
        try {
            const token = localStorage.getItem('jwtToken');
            console.log("Token:", token);
            const response = await axios.post('http://localhost:5000/leaderboard', { score }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            console.log("Score submitted:", response.data);
        } catch (err) {
            console.error("Error submitting score to leaderboard:", {
                message: err.message,
                response: err.response ? err.response.data : null,
                status: err.response ? err.response.status : null
            });
        }
    
        navigate('/result', {
            state: {
                score,
                totalQuestions: questions.length,
                userAnswers,
                correctAnswers: questions,
            }
        });
    };
    

    if (questions.length === 0) return <div>Questions Loading...</div>;

    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;

    return (
        <div className="quiz-page">
            <div className="quiz-container">
                <h3>Question {currentQuestion + 1} of {questions.length}</h3>

                <div className="timer-container">
                    <div className="timer-title">Time Remaining</div>
                    <div className="circular-timer">
                        <div className="timer-inner">
                            {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                        </div>
                    </div>
                </div>

                <div className="question">
                    <h4>{questions[currentQuestion]?.question}</h4>
                    <ul>
                        {['A', 'B', 'C', 'D'].map((option) => (
                            <li key={option}>
                                <label>
                                    <input
                                        type="radio"
                                        name={`question-${currentQuestion}`}
                                        value={option}
                                        onChange={() => handleAnswerChange(option)}
                                        checked={userAnswers[currentQuestion] === option}
                                    />
                                    {questions[currentQuestion][option]}
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="navigation-buttons">
                    {currentQuestion > 0 && (
                        <button onClick={() => setCurrentQuestion((prev) => prev - 1)}>
                            Previous Question
                        </button>
                    )}
                    {currentQuestion < questions.length - 1 ? (
                        <button onClick={() => setCurrentQuestion((prev) => prev + 1)}>
                            Next Question
                        </button>
                    ) : (
                        <button className="submit-button" onClick={handleFinalSubmit}>
                            Final Submit
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizPage;
