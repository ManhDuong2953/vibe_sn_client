// src/components/Signup.jsx
import React, { useState } from 'react';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import './signup_page.scss';
import logo from '../../www/logo.png'; // Add your logo image here
import { Link } from 'react-router-dom';

const SignupPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showOtpPopup, setShowOtpPopup] = useState(false);
    const [otp, setOtp] = useState('');

    const handleSignup = (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
            setShowOtpPopup(true);
        } else {
            alert("Passwords do not match!");
        }
    };

    const handleOtpSubmit = (e) => {
        e.preventDefault();
        // Handle OTP submission logic here
        setShowOtpPopup(false);
    };

    return (
        <div className="signup-main">
            <div className="signup-container">
                <img className='img-thumb' src="https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/09/mang-xa-hoi-la-gi-1.jpg" alt="" />
                <div className="signup-box">
                    <img src={logo} alt="Logo" className="logo" />
                    <h2>Đăng ký</h2>
                    <form onSubmit={handleSignup}>
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
                        <div className="input-group">
                            <RiLockPasswordFill className="icon" />
                            <input
                                type="password"
                                placeholder="Nhắc lại mật khẩu"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="signup-button">ĐĂNG KÝ</button>
                        <p className='have-acc'>Đã có tài khoản, <Link to="/login">
                            đăng nhập ngay
                        </Link></p>
                    </form>
                </div>
            </div>
            {showOtpPopup && (
                <div className="otp-popup">
                    <div className="otp-box">
                        <h3>Nhập mã OTP đã gửi tới manhme2953</h3>
                        <form onSubmit={handleOtpSubmit}>
                            <input
                                type="text"
                                placeholder="Nhập mã OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                            <button type="submit" className="otp-button">Xác nhận</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SignupPage;
