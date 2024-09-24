import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { deleteData } from '../../ultils/fetchAPI/fetch_API';
import { API_LOGOUT } from '../../API/api_server';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        // Gọi API để xóa token từ phía server (nếu cần)
        const response = await deleteData(API_LOGOUT);

        if (response.ok) {

          // Xóa token từ cookie
          Cookies.remove('accessToken');
          Cookies.remove('key_refresh_token_encode');
          Cookies.remove('refreshToken')
          localStorage.clear();

          // Redirect đến trang đăng nhập
          navigate('/login');
        }
      } catch (error) {
        // Thông báo lỗi nếu có
        toast.error('Đăng xuất thất bại');
      }
    };

    logout();
  }, [navigate]);

  return null; // Không render gì ra DOM
};

export default Logout;
