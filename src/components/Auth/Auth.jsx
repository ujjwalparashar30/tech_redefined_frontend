import React, { useState } from 'react';
import Login from "./Login";
import Signup from "./SignUp";
import { useAuthStore } from '../../store/useAuthStore';
export default function Auth() {

    const [isActive, setIsActive] = useState(false);
    const { signup, isSigningUp } = useAuthStore();
    const { login, isLoggingIn } = useAuthStore();

    const handleClick = () => {
        setIsActive(!isActive);
    }

    const handleRegisterClick = (e) => {
        e.preventDefault();
        signup(formData);
    };

    const handleLoginClick = (e) => {
        e.preventDefault();
        login(formData);
    };
    return (
        <div className={`container-auth ${isActive ? 'active' : ''}`} id="container">
            <Signup handleRegisterClick={handleRegisterClick} />
            <Login handleLoginClick={handleLoginClick} />
            <div className="toggle-container">
                <div className="toggle">
                    <div className="toggle-panel toggle-left">
                        <h1>Welcome ZASHIONITES</h1>
                        <p>Enter your personal details to use all site features</p>
                        <button id="login" onClick={handleClick}>
                            Sign In
                        </button>
                    </div>
                    <div className="toggle-panel toggle-right">
                        <h1>ZASHION</h1>
                        <p>Register with your personal details to use all site features</p>
                        <button id="register" onClick={handleClick} >
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}