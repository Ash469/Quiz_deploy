import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Leaderboard.css';

const LeaderboardPage = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await axios.get('http://localhost:5000/leaderboard');
                // Assuming the response.data is an array of leaderboard entries
                setLeaderboard(response.data.slice(0, 5)); // Limit to top 5 entries
            } catch (error) {
                console.error("Error fetching leaderboard data:", error);
            }
        };

        fetchLeaderboard();
        const intervalId = setInterval(fetchLeaderboard, 10000);
        return () => clearInterval(intervalId);
    }, []);

    const handleLogout = () => {
        // Implement logout functionality here if needed
        navigate('/');
    };

    return (
        <div className="leaderboard-page">
            <h2>Leaderboard</h2>
            <table className="leaderboard-table">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Name</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {leaderboard.map((user, index) => (
                        <tr key={user._id}> {/* Use _id as the key */}
                            <td>{user.rank}</td> {/* Display rank from the database */}
                            <td>{user.name}</td>
                            <td>{user.score}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="logout-button" onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
};

export default LeaderboardPage;
