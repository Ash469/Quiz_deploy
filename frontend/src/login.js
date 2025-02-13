import React, { useState } from 'react';
import './login.css';
// import Header from "../../Header/header";
// import Footer from "../../Footer/footer";
// import Techno_owl from "./techno_owl_logo.jpg";
// import Button from '../../Assets/Button/button';
// import Jump from '../../design/jump';
// import Hover from '../../design/hover';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const baseURL = process.env.NODE_ENV === "production" ? "https://technothlon.techniche.org.in/api/" : "http://localhost:3001/api/";
    const redirectUrl = process.env.NODE_ENV === "production" ? "https://technothlon.techniche.org.in/userportal" : "http://localhost:3000/userportal";
    const [roll, setRoll] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    // const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!roll.trim()) {
            setError('Please enter Roll Number');
            return;
        }
        if (!password.trim()) {
            setError('Please enter Password');
            return;
        }
        // axios.post(${baseURL}uploadcsv / login, { roll, password })
        //     .then(res => {
        //         if (res.data.status) {
        //             window.location.href = redirectUrl;
        //         } else {
        //             setError("Wrong Roll or Password");
        //             setRoll('');
        //             setPassword('');
        //         }
        //     })
    //         .catch((err) => {
    //             console.log('Error during login:', err);
    //             setError("Wrong Roll or Password");
    //             setRoll('');
    //             setPassword('');
    //         });
    // };
    }
    return (
        <div className="App">
            <div className="container"></div>
            <div className="login-screen">
                <div className="left-half">
                    <div className="login-container">
                        <div className="logo">
                            {/* <img src={Techno_owl} alt="AboutUs" /> */}
                        </div>
                        <div className="head">
                            <p>Log In</p>
                        </div>
                        <div className="text" id="for-whom">
                            <p>For registered students</p>
                        </div>
                        <div className="login-card">
                            <div className="form-mainn">
                                <label className="labell" id="rollnumber">Roll Number</label>
                                <input
                                    type="text"
                                    className="form-control form-input"
                                    id="roll"
                                    name='roll'
                                    value={roll}
                                    onChange={(e) => setRoll(e.target.value)}
                                    placeholder='Roll no.'
                                    required
                                />
                                <label className="labell" id="password">Password</label>
                                <input
                                    type="password"
                                    placeholder='Password'
                                    className="form-control form-input"
                                    id="password"
                                    name='password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                {error && <p className="error-message">{error}</p>}
                            </div>
                        </div>
                    </div>
                </div>
                <div  div className="right-half">
                    
                </div>
            </div>
        </div>
    );
};

export default Login;
