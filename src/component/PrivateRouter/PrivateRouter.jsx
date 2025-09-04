import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getData } from "../../ultils/fetchAPI/fetch_API";
import { API_AUTH_TOKEN } from "../../API/api_server";
import Spinner from "../Spinner/spinner";
import { loginSuccess, logout } from "../../redux/Reducer/auth";

const PrivateRoute = () => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const responseDecodeToken = await getData(API_AUTH_TOKEN, {
          credentials: "include", // gửi cookie HttpOnly kèm theo
        });

        if (responseDecodeToken?.status) {
          dispatch(loginSuccess(responseDecodeToken.user)); // ✅ lưu user vào redux
        } else {
          dispatch(logout()); // ❌ clear redux nếu không hợp lệ
        }
      } catch (error) {
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, [dispatch]);

  if (loading) return <Spinner />;

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
