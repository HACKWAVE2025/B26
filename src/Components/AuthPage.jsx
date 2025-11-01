import React, { useState } from 'react';

const AuthPage = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAuthAction = (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError("Please enter both email and password.");
            return;
        }

        setLoading(true);
        // Simulate a network request
        setTimeout(() => {
            onLogin(email); 
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2 className="auth-title">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="auth-subtitle">
                    {isLogin ? 'Sign in to access your dashboard' : 'Get started with your personal assistant'}
                </p>

                {error && <div className="error-message">{error}</div>}

                <form className="auth-form" onSubmit={handleAuthAction}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email</label>
                        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="form-input" required />
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••••••" className="form-input" required />
                    </div>
                    <button type="submit" disabled={loading} className="submit-button">
                        {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
                    </button>
                </form>

                <p className="toggle-text">
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}
                    <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="toggle-button">
                        {isLogin ? 'Sign Up' : 'Log In'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthPage;