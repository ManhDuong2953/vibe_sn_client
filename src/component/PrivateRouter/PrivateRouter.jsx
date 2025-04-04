import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import { getData } from "../../ultils/fetchAPI/fetch_API";
import { API_AUTH_TOKEN } from "../../API/api_server";
import Spinner from "../Spinner/spinner";

const PrivateRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(Cookies.get("accessToken") ? true : false);
  const accessToken = Cookies.get("accessToken");
  
  useEffect(() => {
      const checkAuthentication = async () => {
      if (accessToken) {
          try {
              const responseDecodeToken = await getData(API_AUTH_TOKEN);
              
              if (responseDecodeToken?.status) {
                  setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                setIsAuthenticated(false);
            }
        } else {
        setIsAuthenticated(false);
    }
};
checkAuthentication();
}, [accessToken]);


  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;

// import React, { useEffect, useState } from 'react';
// import { Navigate, Outlet } from 'react-router-dom';
// import Cookies from 'js-cookie';
// import { postData } from '../../ultils/fetchAPI/fetch_API';
// import { API_DECODE_TOKEN, API_ROTATION_TOKEN } from '../../API/api_server';
// import Spinner from '../Spinner/spinner';

// const PrivateRoute = () => {
//     const [isAuthenticated, setIsAuthenticated] = useState(null);
//     const [checked, setChecked] = useState(false);

//     useEffect(() => {
//         if (!checked) {
//             const checkAuthentication = async () => {
//                 const accessToken = Cookies.get('accessToken');
//                 const refreshToken = Cookies.get('refreshToken');
//                 const keyRefreshTokenEncode = Cookies.get('key_refresh_token_encode');

//                 if (!refreshToken || !keyRefreshTokenEncode) {
//                     setIsAuthenticated(false);
//                     setChecked(true);
//                     return;
//                 }

//                 if (accessToken) {
//                     setIsAuthenticated(true);
//                     setChecked(true);
//                 } else {
//                     try {
//                         const responseDecodeToken = await postData(API_DECODE_TOKEN, {
//                             key_refresh_token_encode: keyRefreshTokenEncode,
//                             refresh_token: refreshToken,
//                         });

//                         if (responseDecodeToken?.status) {
//                             const { user_id } = responseDecodeToken?.data || {};
//                             if (!user_id) {
//                                 setIsAuthenticated(false);
//                                 setChecked(true);
//                                 return;
//                             }

//                             const responseRotationToken = await postData(API_ROTATION_TOKEN, {
//                                 key_refresh_token_encode: keyRefreshTokenEncode,
//                                 user_id,
//                             });

//                             if (responseRotationToken?.status) {
//                                 // Cập nhật cookie với token mới nếu cần
//                                 setIsAuthenticated(true);
//                             } else {
//                                 setIsAuthenticated(false);
//                             }
//                         } else {
//                             setIsAuthenticated(false);
//                         }
//                     } catch (error) {
//                         setIsAuthenticated(false);
//                     } finally {
//                         setChecked(true);
//                     }
//                 }
//             };

//             checkAuthentication();
//         }
//     }, [checked]);

//     if (!checked) {
//         return <Spinner />;
//     }

//     return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
// };

// export default PrivateRoute;
