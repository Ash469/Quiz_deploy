'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import '../../styles/result.css';

interface Question {
    question: string;
    answer: string;
}

interface QuizResult {
    score: number;
    totalQuestions: number;
    userAnswers: string[];
    correctAnswers: Question[];
}

const ResultPage: React.FC = () => {
    const router = useRouter();
    const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

    useEffect(() => {
        const storedResult = localStorage.getItem('quizResult');
        if (storedResult) {
            setQuizResult(JSON.parse(storedResult));
        }
    }, []);

    if (!quizResult) {
        return <div>No data available</div>;
    }

    const { score, totalQuestions, userAnswers, correctAnswers } = quizResult;

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
                <button onClick={() => router.push('/start')}>Back to Dashboard</button>
                <button onClick={() => router.push('/leaderboard')}>Leaderboard</button>
            </div>
        </div>
    );
};

export default ResultPage;
