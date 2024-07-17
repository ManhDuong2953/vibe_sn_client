// src/components/ForgotPassword.jsx
import React, { useState } from 'react';
import { MdEmail, MdOutlinePassword } from 'react-icons/md';
import './forgot_password.scss';
import logo from '../../www/logo.png'; // Add your logo image here
import { AiFillCode } from 'react-icons/ai';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // Send OTP to the user's email
    setShowOtpInput(true);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    // Verify OTP and allow password reset
    alert("Password reset successfully!");
  };

  return (
    <div className="forgot-password-main">
      <div className="forgot-password-container">
        <img className='img-thumb' src="https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/09/mang-xa-hoi-la-gi-1.jpg" alt="" />
        <div className="forgot-password-box">
          <img src={logo} alt="Logo" className="logo" />
          <h2>Quên mật khẩu</h2>
          {!showOtpInput ? (
            <form onSubmit={handleEmailSubmit}>
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
              <button type="submit" className="forgot-password-button">Gửi mã OTP</button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit}>
              <div className="input-group">
                <AiFillCode className="icon" />
                <input
                  type="text"
                  placeholder="OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <MdOutlinePassword  className="icon" />
                <input
                  type="password"
                  placeholder="Mật khẩu mới"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <MdOutlinePassword className="icon" />
                <input
                  type="password"
                  placeholder="Nhắc lại mật khẩu mới"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="forgot-password-button">Đặt lại mật khẩu</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
