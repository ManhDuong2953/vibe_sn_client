import React, { useContext, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';
import { OwnDataContext } from '../../provider/own_data';
import { postData } from '../../ultils/fetchAPI/fetch_API';
import { API_DECODE_TOKEN, API_ROTATION_TOKEN } from '../../API/api_server';

const PrivateRoute = () => {
    const dataOwner = useContext(OwnDataContext);
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        if (!checked) {
            const checkAuthentication = async () => {
                const accessToken = Cookies.get('accessToken');
                const refreshToken = Cookies.get('refreshToken');
                const keyRefreshTokenEncode = Cookies.get('key_refresh_token_encode');

                console.log("Cookies:", { accessToken, refreshToken, keyRefreshTokenEncode });

                if (!refreshToken || !keyRefreshTokenEncode) {
                    console.log("Thiếu refresh token hoặc key encode");
                    setIsAuthenticated(false);
                    setChecked(true);
                    return;
                }

                if (accessToken) {
                    console.log("Có access token, xác thực thành công");
                    setIsAuthenticated(true);
                    setChecked(true);
                } else {
                    console.log("Không có access token, thử làm mới");

                    try {
                        const responseDecodeToken = await postData(API_DECODE_TOKEN, {
                            key_refresh_token_encode: keyRefreshTokenEncode,
                            refresh_token: refreshToken,
                        });

                        console.log("Kết quả decode token:", responseDecodeToken);

                        if (responseDecodeToken?.status) {
                            const { user_id } = responseDecodeToken?.data || {};
                            if (!user_id) {
                                console.error("Không tìm thấy user ID trong phản hồi decode token");
                                setIsAuthenticated(false);
                                setChecked(true);
                                return;
                            }

                            const responseRotationToken = await postData(API_ROTATION_TOKEN, {
                                key_refresh_token_encode: keyRefreshTokenEncode,
                                user_id,
                            });

                            console.log("Kết quả làm mới token:", responseRotationToken);

                            if (responseRotationToken?.status) {
                                // Cập nhật cookie với token mới nếu cần
                                setIsAuthenticated(true);
                            } else {
                                console.error("Làm mới token thất bại");
                                setIsAuthenticated(false);
                            }
                        } else {
                            console.error("Làm mới token thất bại");
                            setIsAuthenticated(false);
                        }
                    } catch (error) {
                        console.error("Lỗi trong quá trình làm mới token:", error);
                        setIsAuthenticated(false);
                    } finally {
                        setChecked(true);
                    }
                }
            };

            checkAuthentication();
        }
    }, [checked, dataOwner]);

    if (!checked) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
