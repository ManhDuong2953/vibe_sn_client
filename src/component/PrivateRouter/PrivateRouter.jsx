import { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getData } from "../../ultils/fetchAPI/fetch_API";
import { API_AUTH_TOKEN } from "../../API/api_server";
import Spinner from "../Spinner/spinner";
import { loginSuccess, logout } from "../../redux/Reducer/auth";

const PrivateRoute = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      console.log("🔍 Bắt đầu check auth...");
      try {
        const responseDecodeToken = await getData(API_AUTH_TOKEN, {
          credentials: "include",
        });
        console.log("✅ API_AUTH_TOKEN response:", responseDecodeToken);

        if (responseDecodeToken?.status) {
          dispatch(loginSuccess(responseDecodeToken.user));
          console.log("👉 loginSuccess dispatch");
        } else {
          dispatch(logout());
          console.log("❌ Token invalid -> logout");
        }
      } catch (error) {
        console.error("🔥 Auth check error:", error);
        dispatch(logout());
      } finally {
        setLoading(false);
        console.log("⏹️ Done check auth, loading=false");
      }
    };

    checkAuthentication();
  }, [dispatch]);

  if (loading) return <Spinner />;

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
