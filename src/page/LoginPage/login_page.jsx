// src/components/Login.jsx
import { useEffect, useState } from "react";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import "./login_page.scss";
import logo from "../../www/logo.png"; // Add your logo image here
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import ShowPopupLoginWithFacebook from "../../config/login_with_facebook";
import ShowPopupLoginWithGoogle from "../../config/login_with_google";
import bgAuthentication from "../../www/bgAuthen.jpg";
import getDataForm from "../../ultils/getDataForm/get_data_form";
import { getData, postData } from "../../ultils/fetchAPI/fetch_API";
import {
  API_CHECK_EXIST_USER,
  API_LOGIN_POST,
  API_SIGNUP_SOCIALNETWORK_POST,
} from "../../API/api_server";
import { LuScanFace } from "react-icons/lu";
import { LoadingIcon } from "../../ultils/icons/loading";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/Reducer/auth";

const LoginPage = ({ titlePage }) => {
  useEffect(() => {
    document.title = titlePage;
    console.log(API_LOGIN_POST);
    
  }, [titlePage]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [textError, setTextError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setTextError("");
      const data = getDataForm(".form-login");
      setLoading(true);
      const response = await postData(API_LOGIN_POST, {
        type_account: "register",
        ...data,
      });
      if (response?.status) {
        dispatch(
          loginSuccess({
            isLoggedIn: true,
          })
        );
        navigate("/");
        return;
      } else {
        setTextError(
          response?.message ||
            "Lỗi đăng nhập, vui lòng thử lại hoặc dùng phương thức đăng nhập khác"
        );
      }
    } catch (error) {
      setTextError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSocial = async (payload) => {
    try {
      setTextError("");
      setLoading(true);
      const response = await getData(
        API_CHECK_EXIST_USER(`uid_${payload?.user_id}`)
      );
      if (response?.status === 200 || response?.status === true) {
        const responseLogin = await postData(API_LOGIN_POST, {
          user_id_login: `uid_${payload?.user_id}`,
          user_password: payload?.user_password,
          type_account: payload?.type_account,
        });

        if (responseLogin?.status || responseLogin?.status === true) {
          navigate("/");
          dispatch(
            loginSuccess({
              isLoggedIn: true,
            })
          );
          return;
        } else {
          setTextError(
            "Lỗi đăng nhập, vui lòng thử lại hoặc dùng phương thức đăng nhập khác"
          );
        }
      } else {
        const responseSignup = await postData(
          API_SIGNUP_SOCIALNETWORK_POST,
          payload
        );
        if (responseSignup?.status || responseSignup?.status === true) {
          await handleLoginSocial(payload);
        } else {
          setTextError(
            "Lỗi đăng nhập, vui lòng thử lại hoặc dùng phương thức đăng nhập khác"
          );
        }
      }
    } catch (error) {
      setTextError(error.message);
    } finally {
      setLoading(false);
    }
  };

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
        <img
          onError={(e) => {
            e.target.src =
              "https://tenten.vn/tin-tuc/wp-content/uploads/2022/06/loi-http-error-4.png";
          }}
          className="img-thumb"
          src={bgAuthentication}
          alt="Marketing"
        />
        <div className="flex flex-col items-center w-full login-box">
          <img
            onError={(e) => {
              e.target.src =
                "https://tenten.vn/tin-tuc/wp-content/uploads/2022/06/loi-http-error-4.png";
            }}
            src={logo}
            alt="Logo"
            className="logo"
          />
          <h2 className="bg-red-400 text-red-600">Đăng nhập</h2>
          <form className="w-full form-login" onSubmit={handleLogin}>
            <div className="input-group">
              <MdEmail className="icon" />
              <input
                autoFocus
                type="email"
                placeholder="Email"
                name="user_email"
                required
              />
            </div>
            <div className="input-group">
              <RiLockPasswordFill className="icon" />
              <input
                type="password"
                placeholder="Mật khẩu"
                name="user_password"
                required
              />
            </div>
            <Link to="/login/forgot-password" className="fg-pws">
              <p className="forgot-password">Quên mật khẩu?</p>
            </Link>
            {textError && <p className="text-danger">{textError}</p>}
            {loading ? (
              <LoadingIcon />
            ) : (
              <button type="submit" className="login-button">
                ĐĂNG NHẬP
              </button>
            )}
          </form>
          <Link to="/login/face-recognition/">
            <LuScanFace className="icon-face" />
          </Link>

          <p>hoặc</p>
          <div className="social-login">
            <button
              className="facebook-button"
              onClick={handleLoginWithFacebook}
            >
              <FaFacebook className="icon" /> Đăng nhập với Facebook
            </button>
            <button className="google-button" onClick={handleLoginWithGoogle}>
              <FaGoogle className="icon" /> Đăng nhập với Google
            </button>
          </div>
          <p className="have-acc">
            Chưa có tài khoản, <Link to="/signup">đăng ký ngay</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
