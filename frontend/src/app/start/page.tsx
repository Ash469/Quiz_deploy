'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../../styles/startQuiz.css';

interface Question {
    question: string;
    options: string[];
    answer: string;
}

const StartQuizPage: React.FC = () => {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const startQuiz = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('https://krish-2512.github.io/api/questions-2.json');
            const questions: Question[] = await res.json();
            const selectedQuestions = questions.sort(() => 0.5 - Math.random()).slice(0, 10);
            localStorage.setItem('questions', JSON.stringify(selectedQuestions));
            router.push('/quiz');
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
