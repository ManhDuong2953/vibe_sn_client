// src/components/Signup.jsx
import React, { useEffect, useState } from 'react';
import bgAuthentication from '../../www/bgAuthen.jpg';
import { FaUser } from 'react-icons/fa';
import { PiGenderMaleFill } from "react-icons/pi";
import { MdDateRange, MdEmail } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import './signup_page.scss';
import logo from '../../www/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import getDataForm from '../../ultils/getDataForm/get_data_form';
import { postData } from '../../ultils/fetchAPI/fetch_API';
import { API_CREATE_OTP_SIGNUP, API_SIGNUP_POST } from '../../API/api_server';
import OtpPopup from '../../component/PopupOTP/popup_otp';

const SignupPage = ({ titlePage }) => {
    useEffect(() => {
        document.title = titlePage;
    }, [titlePage]);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [showOtpPopup, setShowOtpPopup] = useState(false);
    const [payloadSignup, setPayloadSignup] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
            setMessage("");
            const data = getDataForm(".form-signup");
            setPayloadSignup(data);
            const response = await postData(API_CREATE_OTP_SIGNUP, data);
            if (response?.status) {
                setShowOtpPopup(true);
            }
        } else {
            setMessage("Mật khẩu không trùng khớp!");
        }
    };

    const handleOtpVerifySuccess = async () => {
        setShowOtpPopup(false);        
        const responseSignup = await postData(API_SIGNUP_POST, payloadSignup);
        if (responseSignup?.status) {
            navigate("/login");
        }
    };

    const handleCloseOtpPopup = () => {
        setShowOtpPopup(false);
    };

    const handleResendOtp = async (e) => {
        await handleSignup(e);
    };

    return (
        <div className="signup-main">
            <div className="signup-container">
                <img className='img-thumb' src={bgAuthentication} alt="" />
                <div className="signup-box">
                    <img src={logo} alt="Logo" className="logo" />
                    <h2>Đăng ký</h2>
                    <form onSubmit={handleSignup} className='form-signup'>
                        <div className="input-group">
                            <FaUser className="icon" />
                            <input
                                type="text"
                                placeholder="Tên người dùng"
                                name='user_name'
                                maxLength={255}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <MdEmail className="icon" />
                            <input
                                type="email"
                                placeholder="Email"
                                name='user_email'
                                maxLength={255}
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input_select_gender input-group">
                            <PiGenderMaleFill className="icon" />
                            <span>

                                <input
                                    type="radio"
                                    name="user_gender"
                                    value="male"
                                    required
                                    id="gender_male"
                                />
                                <label htmlFor="gender_male">Nam</label>

                                <input
                                    type="radio"
                                    name="user_gender"
                                    value="female"
                                    required
                                    id="gender_female"
                                />
                                <label htmlFor="gender_female">Nữ</label>

                                <input
                                    type="radio"
                                    name="user_gender"
                                    value="other"
                                    required
                                    id="gender_other"
                                />
                                <label htmlFor="gender_other">Khác</label>
                            </span>
                        </div>
                        <div className="input-group">
                            <MdDateRange className="icon" />
                            <input
                                type="date"
                                id="dob"
                                name="date_of_birth"
                            />
                        </div>
                        <div className="input-group">
                            <RiLockPasswordFill className="icon" />
                            <input
                                type="password"
                                placeholder="Mật khẩu"
                                name='user_password'
                                maxLength={255}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <RiLockPasswordFill className="icon" />
                            <input
                                type="password"
                                placeholder="Nhắc lại mật khẩu"
                                name='user_confirm_password'
                                maxLength={255}
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <p className="text-danger">{message}</p>
                        <button type="submit" className="signup-button">ĐĂNG KÝ</button>
                        <p className='have-acc'>Đã có tài khoản, <Link to="/login">đăng nhập ngay</Link></p>
                    </form>
                </div>
            </div>
            {showOtpPopup && (
                <OtpPopup
                    email={email}
                    onVerifySuccess={handleOtpVerifySuccess}
                    onClose={handleCloseOtpPopup}
                    onResendOtp={handleResendOtp}
                />
            )}
        </div>
    );
};

export default SignupPage;
