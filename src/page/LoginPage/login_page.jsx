// src/components/Login.jsx
import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaFacebook, FaGoogle } from 'react-icons/fa';
import './login_page.scss';
import logo from '../../www/logo.png'; // Add your logo image here
import { MdEmail } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import { Link } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // Handle login logic here
    };

    return (
        <div className="login-main">
            <div className="login-container">
                <img className='img-thumb' src="https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/09/mang-xa-hoi-la-gi-1.jpg" alt="" />
                <div className="login-box">
                    <img src={logo} alt="Logo" className="logo" />
                    <h2>Đăng nhập</h2>
                    <form onSubmit={handleLogin}>
                        <div className="input-group">
                            <MdEmail className="icon" />
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <RiLockPasswordFill className="icon" />
                            <input
                                type="password"
                                placeholder="Mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Link to="/login/forgot-password">
                            <p>Quên mật khẩu?</p>
                        </Link>
                        <button type="submit" className="login-button">ĐĂNG NHẬP</button>
                    </form>
                    <p>hoặc</p>
                    <div className="social-login">
                        <button className="facebook-button">
                            <FaFacebook className="icon" /> Đăng nhập với Facebook
                        </button>
                        <button className="google-button">
                            <FaGoogle className="icon" /> Đăng nhập với Google
                        </button>
                    </div>
                    <p className='have-acc'>Chưa có tài khoản, <Link to="/signup">
                        đăng ký ngay
                    </Link></p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
