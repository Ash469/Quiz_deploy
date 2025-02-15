'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import '../../styles/Quiz.css';

interface Question {
    question: string;
    A: string;
    B: string;
    C: string;
    D: string;
    answer: string;
}

type UserAnswers = Record<number, string>;

const calculateScore = (questions: Question[], userAnswers: string[]): number => {
    return questions.reduce((score, question, index) => {
        return score + (question.answer === userAnswers[index] ? 1 : 0);
    }, 0);
};

const QuizPage: React.FC = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
    const [timeRemaining, setTimeRemaining] = useState(300);
    const router = useRouter();

    const handleFinalSubmit = useCallback(async () => {
        const score = calculateScore(questions, Object.values(userAnswers));
        console.log('Score:', score);

        const quizResult = {
            score,
            totalQuestions: questions.length,
            userAnswers: Object.values(userAnswers),
            correctAnswers: questions.map(q => ({ question: q.question, answer: q.answer }))
        };

        localStorage.setItem('quizResult', JSON.stringify(quizResult));

        try {
            const token = localStorage.getItem('jwtToken');
            console.log('Token:', token);

            const response = await fetch('https://quiz-deploy-2jti.onrender.com/leaderboard', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ score }),
            });

            if (!response.ok) {
                throw new Error(`Error submitting score: ${response.statusText}`);
            }

            console.log('Score submitted successfully');
        } catch (err) {
            console.error('Error submitting score:', err);
        }

        router.push('/result');
    }, [questions, userAnswers, router]);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch('https://krish-2512.github.io/api/questions-2.json');
                if (!response.ok) throw new Error('Failed to fetch questions');
                const data: Question[] = await response.json();
                setQuestions(data.sort(() => 0.5 - Math.random()).slice(0, 10));
            } catch (err) {
                console.error('Error loading questions:', err);
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
    }, [timeRemaining, handleFinalSubmit]);

    const handleAnswerChange = (answer: string) => {
        setUserAnswers((prev) => ({ ...prev, [currentQuestion]: answer }));
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
                                    {questions[currentQuestion][option as keyof Question]}
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
