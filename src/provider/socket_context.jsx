import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPhoneAlt, FaPhoneSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { OwnDataContext } from "./own_data";

// Tạo context
const SocketContext = createContext();

// URL server của bạn, thay đổi nếu cần
const SOCKET_URL = process.env.REACT_APP_PORT_SOCKET;

// Tạo Provider để quản lý kết nối socket
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const navigator = useNavigate();
  const dataOwner = useContext(OwnDataContext);
  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    // Cleanup khi component bị unmount
    return () => {
      newSocket.close();
    };
  }, [SOCKET_URL]);

  const handleAccept = (data) => {
    if (socket) {
      socket.emit("acceptCallUser", {
        status: "Accepted",
        ...data,
      });
      navigator(data?.link_call);
    }
  };

  const handleDecline = (data) => {
    toast("Bạn đã từ chối cuộc gọi");
    if (socket) {
      socket.emit("acceptCallUser", {
        status: "Declined",
        ...data,
      });
    }
  };

  useEffect(() => {
    if (socket) {
      //Nhận thông báo gọi từ người gọi
      socket.on("user-calling", (data) => {
        if (data && dataOwner && data?.receiver_id === dataOwner?.user_id)
          toast.info(
            ({ closeToast }) => (
              <div>
                <p>Bạn có một cuộc gọi!</p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    gap: "10px",
                    marginTop: "10px",
                  }}
                >
                  <button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: "#4CAF50", // Màu xanh cho nút nghe
                      color: "white",
                      padding: "6px 10px",
                      fontSize: "12px", // Làm nhỏ chữ
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      transition: "background-color 0.3s ease",
                    }}
                    onClick={() => {
                      handleAccept(data);
                      closeToast();
                    }}
                    onMouseOver={(e) =>
                      (e.target.style.backgroundColor = "#45A049")
                    } // Thay đổi màu khi hover
                    onMouseOut={(e) =>
                      (e.target.style.backgroundColor = "#4CAF50")
                    }
                  >
                    <FaPhoneAlt style={{ marginRight: "5px" }} />
                    Nghe
                  </button>
                  <button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: "#F44336", // Màu đỏ cho nút từ chối
                      color: "white",
                      padding: "6px 10px",
                      fontSize: "12px",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      transition: "background-color 0.3s ease",
                    }}
                    onClick={() => {
                      handleDecline(data);
                      closeToast();
                    }}
                    onMouseOver={(e) =>
                      (e.target.style.backgroundColor = "#E53935")
                    }
                    onMouseOut={(e) =>
                      (e.target.style.backgroundColor = "#F44336")
                    }
                  >
                    <FaPhoneSlash style={{ marginRight: "5px" }} />
                    Từ chối
                  </button>
                </div>
              </div>
            ),
            {
              position: "top-right",
              autoClose: 60000, // Tự động đóng sau 60 giây
              closeOnClick: true,
              hideProgressBar: false, // Hiển thị thanh tiến trình
              icon: false, // Ẩn icon mặc định của toast
            }
          );
      });
    }
    return () => {
      if (socket) {
        socket.off("user-calling"); // Cleanup listener khi socket thay đổi hoặc component unmount
      }
    };
  }, [dataOwner, socket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

// Hook để dùng socket ở các component khác
export const useSocket = () => {
  return useContext(SocketContext);
};
