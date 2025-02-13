import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignUpPage';
import StartQuizPage from './pages/StartQuizPage';
import QuizPage from './pages/QuizPage';
import ResultPage from './pages/ResultPage';
import LeaderboardPage from './pages/LeaderboardPage';
import Certificate from './pages/Certificate';


function App() {
    return (
        <Provider store={store}>
            <Router>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    {/* <Route path="/" element={<Certificate />} /> */}
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/start-quiz" element={<StartQuizPage />} />
                    <Route path="/quiz" element={<QuizPage />} />
                    <Route path="/result" element={<ResultPage />} />
                    <Route path="/leaderboard" element={<LeaderboardPage />} />
                </Routes>
            </Router>
        </Provider>
        
        
    );
}

export default App;
