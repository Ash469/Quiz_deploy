'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import '../../styles/leaderboard.css';
interface LeaderboardEntry {
    _id: string;
    rank: number;
    name: string;
    score: number;
}

const LeaderboardPage: React.FC = () => {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await fetch('https://quiz-deploy-2jti.onrender.com/leaderboard');
                if (!response.ok) throw new Error('Failed to fetch leaderboard data');
                const data: LeaderboardEntry[] = await response.json();
                setLeaderboard(data.slice(0, 5)); // Limit to top 5 entries
                setError(null); // Reset error if successful
            } catch (err) {
                setError('Error fetching leaderboard data. Please try again later.');
                console.error(err);
            }
        };

        fetchLeaderboard();
        const intervalId = setInterval(fetchLeaderboard, 10000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="leaderboard-page">
            <h2>Leaderboard</h2>

            {error && <p className="error-message">{error}</p>}

            <table className="leaderboard-table">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Name</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {leaderboard.length > 0 ? (
                        leaderboard.map((user) => (
                            <tr key={user._id}>
                                <td>{user.rank}</td>
                                <td>{user.name}</td>
                                <td>{user.score}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={3} className="no-data">No leaderboard data available</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <button className="logout-button" onClick={() => router.push('/')}>
                Logout
            </button>
        </div>
    );
};

export default LeaderboardPage;
