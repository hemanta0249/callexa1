import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const HomeMain = () => {
    const navigate = useNavigate();
    // State for form switching
    const [isRightPanelActive, setIsRightPanelActive] = useState(false);

    // State for Sign Up form
    const [signUpForm, setSignUpForm] = useState({
        name: '',
        email: '',
        password: ''
    });

    // State for Sign In form
    const [signInForm, setSignInForm] = useState({
        email: '',
        password: ''
    });

    // Handle input change for Sign Up form
    const handleSignUpChange = (e) => {
        const { name, value } = e.target;
        setSignUpForm({ ...signUpForm, [name]: value });
    };

    // Handle input change for Sign In form
    const handleSignInChange = (e) => {
        const { name, value } = e.target;
        setSignInForm({ ...signInForm, [name]: value });
    };

    // Handle Sign Up form submission
    const handleSignUpSubmit = async (e) => {
        e.preventDefault();
        console.log('Sign Up form data:', signUpForm);
        const response = await fetch("/api/auth/createusers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(signUpForm)
        })
        const json = await response.json();
        console.log(json);
        if (json.success) {
            toast.success("You're registered successfully");
        }
        else {
            toast.error("something went wrong");
        }
    };

    // Handle Sign In form submission
    const handleSignInSubmit = async (e) => {
        e.preventDefault();
        console.log('Sign In form data:', signInForm);

        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(signInForm)
        })
        const json = await response.json();

        if (json.success) {
            localStorage.setItem('token', json.authToken);
            navigate('/home');
        }
        else {
            toast.error("invalid cridentials");
        }

    };

    // Toggle between sign-up and sign-in
    const handleSignUpClick = () => {
        setIsRightPanelActive(true);
    };

    const handleSignInClick = () => {
        setIsRightPanelActive(false);
    };

    return (
        <div>
            <ToastContainer />

            <div style={{ padding: "0 1rem", width: "100vw" }}>
                <div className={`container ${isRightPanelActive ? 'right-panel-active' : ''}`} id="container">

                    <button className="ghost ghostbtn1 d-md-none d-block" onClick={handleSignUpClick} id="signUp">Sign Up</button>
                    <button className="ghost ghostbtn2 d-md-none d-block" onClick={handleSignInClick} id="signIn">Sign In</button>

                    <div className="form-container sign-up-container">
                        <form onSubmit={handleSignUpSubmit}>
                            <h1>Create Account</h1>
                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={signUpForm.name}
                                onChange={handleSignUpChange}
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={signUpForm.email}
                                onChange={handleSignUpChange}
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={signUpForm.password}
                                onChange={handleSignUpChange}
                            />
                            <button type="submit">Sign Up</button>
                        </form>
                    </div>
                    <div className="form-container sign-in-container">
                        <form onSubmit={handleSignInSubmit}>
                            <h1>Sign in</h1>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={signInForm.email}
                                onChange={handleSignInChange}
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={signInForm.password}
                                onChange={handleSignInChange}
                            />
                            <a href="#">Forgot your password?</a>
                            <button type="submit">Sign In</button>
                        </form>
                    </div>
                    <div className="overlay-container d-md-block d-none">
                        <div className="overlay">
                            <div className="overlay-panel overlay-left">
                                <h1>Welcome Back!</h1>
                                <p>To keep connected with us please login with your personal info</p>
                                <button className="ghost" onClick={handleSignInClick} id="signIn">Sign In</button>
                            </div>
                            <div className="overlay-panel overlay-right">
                                <h1>Hello, Friend!</h1>
                                <p>Enter your personal details and start your journey with us</p>
                                <button className="ghost" onClick={handleSignUpClick} id="signUp">Sign Up</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeMain;
