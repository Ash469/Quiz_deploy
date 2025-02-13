import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './StartQuizPage.css';

const StartQuizPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const startQuiz = async () => {
        setLoading(true);
        try {
            const res = await axios.get('https://krish-2512.github.io/api/questions-2.json');
            const questions = res.data;
            const selectedQuestions = questions.sort(() => 0.5 - Math.random()).slice(0, 10);
            localStorage.setItem('questions', JSON.stringify(selectedQuestions));
            navigate('/quiz');
        } catch (err) {
            setError('Failed to load questions. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="start-quiz-page">
            <div className="start-quiz-container">
                <h1>Welcome to the Quiz!</h1>
                <div className="rules">
                    <h2>Rules:</h2>
                    <ul>
                        <li>The quiz consists of 10 questions randomly selected for each session.</li>
                        <li>You have limited time to answer questions.</li>
                        <li>Each correct answer awards +3 points, and incorrect answers deduct -1 points.</li>
                        <li>Do your best and have fun!</li>
                    </ul>
                </div>
                <button className="start-button" onClick={startQuiz} disabled={loading}>
                    {loading ? 'Starting...' : 'Start Quiz'}
                </button>
                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
};

export default StartQuizPage;
