import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ResultPage.css';

const ResultPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const { score, totalQuestions, userAnswers, correctAnswers } = location.state || {};

    if (!score && score !== 0) {
        return <div>No data available</div>;
    }

    const handleBackToDashboard = () => {
        navigate('/start-quiz'); 
    };

    const handleLeaderboard = () => {
        navigate('/leaderboard');
    };

    return (
        <div className="result-page">
            <h2>Quiz Results</h2>
            <p>Your Score: {score} / {totalQuestions}</p>

            <h3>Question Breakdown:</h3>
            <ul>
                {correctAnswers.map((question, index) => (
                    <li key={index} className={`question-item ${userAnswers[index] === question.answer ? 'correct' : 'incorrect'}`}>
                        <div className="question-text">
                            <p><strong>Q{index + 1}:</strong> {question.question}</p>
                            <p>Your Answer: {userAnswers[index] || 'Not Answered'}</p>
                            <p>Correct Answer: {question.answer}</p>
                        </div>
                    </li>
                ))}
            </ul>

            <div className="result-buttons">
                <button onClick={handleBackToDashboard}>Back to Dashboard</button>
                <button onClick={handleLeaderboard}>Leaderboard</button>
            </div>
        </div>
    );
};

export default ResultPage;
