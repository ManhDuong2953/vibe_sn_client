// src/components/Login.jsx
import React, { useEffect } from 'react';
import { FaFacebook, FaGoogle } from 'react-icons/fa';
import './login_page.scss';
import logo from '../../www/logo.png'; // Add your logo image here
import { MdEmail } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import { Link, useNavigate } from 'react-router-dom';
import ShowPopupLoginWithFacebook from '../../config/login_with_facebook';
import ShowPopupLoginWithGoogle from '../../config/login_with_google';
import bgAuthentication from '../../www/bgAuthen.jpg';
import getDataForm from '../../ultils/getDataForm/get_data_form';
import { getData, postData } from '../../ultils/fetchAPI/fetch_API';
import { API_CHECK_EXIST_USER, API_LOGIN_POST, API_SIGNUP_SOCIALNETWORK_POST } from '../../API/api_server';
import getToken from '../../ultils/getToken/get_token';
import { LuScanFace } from 'react-icons/lu';
import { toast } from 'react-toastify';

const LoginPage = ({ titlePage }) => {
    useEffect(() => {
        document.title = titlePage;
    }, [titlePage]);

    const navigate = useNavigate();

    useEffect(() => {
        const storedToken = getToken();
        if (storedToken) {
            navigate('/');
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        const data = getDataForm(".form-login");
        const response = await postData(API_LOGIN_POST, data);
        if (response?.status) {
            navigate("/");
        }
    };

    const handleLoginSocial = async (payload) => {
        try {
            const response = await getData(API_CHECK_EXIST_USER(`uid_${payload?.user_id}`));
            console.log("check", response);
            if (response?.status) {
                const responseLogin = await postData(API_LOGIN_POST, {
                    user_email: payload?.user_email,
                    user_password: payload?.user_password
                });
                if (responseLogin?.status) {
                    navigate("/");
                } else {
                    toast.error("Lỗi đăng nhập, vui lòng thử lại hoặc dùng phương thức đăng nhập khác")
                }
            } else {
                const responseSignup = await postData(API_SIGNUP_SOCIALNETWORK_POST, payload);
                if (responseSignup) {
                    await handleLoginSocial(payload);
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleLoginWithGoogle = async () => {
        const payload = await ShowPopupLoginWithGoogle();
        await handleLoginSocial(payload);

    };

    const handleLoginWithFacebook = async () => {
        const data = await ShowPopupLoginWithFacebook();
        await handleLoginSocial(data);
    };

    return (
        <div className="login-main">
            <div className="login-container">
                <img className='img-thumb' src={bgAuthentication} alt="Marketing" />
                <div className="login-box">
                    <img src={logo} alt="Logo" className="logo" />
                    <h2>Đăng nhập</h2>
                    <form className='form-login' onSubmit={handleLogin}>
                        <div className="input-group">
                            <MdEmail className="icon" />
                            <input
                                type="email"
                                placeholder="Email"
                                name='user_email'
                                required
                            />
                        </div>
                        <div className="input-group">
                            <RiLockPasswordFill className="icon" />
                            <input
                                type="password"
                                placeholder="Mật khẩu"
                                name='user_password'
                                required
                            />
                        </div>
                        <Link to="/login/forgot-password">
                            <p className='forgot-password '>Quên mật khẩu?</p>
                        </Link>
                        <button type="submit" className="login-button">ĐĂNG NHẬP</button>
                    </form>
                    <Link to="/login/face-recognition/">
                        <LuScanFace className='icon-face' />
                    </Link>

                    <p>hoặc</p>
                    <div className="social-login">
                        <button className="facebook-button" onClick={handleLoginWithFacebook}>
                            <FaFacebook className="icon" /> Đăng nhập với Facebook
                        </button>
                        <button className="google-button" onClick={handleLoginWithGoogle}>
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
