import React, { useRef, useState, useEffect, useContext } from "react";
import "./video_call.scss";
import {
  FaVideoSlash,
  FaVideo,
  FaMicrophoneSlash,
  FaMicrophone,
  FaPhoneAlt,
} from "react-icons/fa";
import { getURLParam } from "../../ultils/getParamURL/get_param_URL";
import { getData } from "../../ultils/fetchAPI/fetch_API";
import { API_GET_INFO_USER_PROFILE_BY_ID } from "../../API/api_server";
import { useSocket } from "../../provider/socket_context";
import { OwnDataContext } from "../../provider/own_data";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Peer from "simple-peer";

const VideoCall = ({ isVideoCall, titlePage, userId }) => {
  useEffect(() => {
    document.title = titlePage;
  }, [titlePage]);

  const userVideo = useRef(); // Video của người nhận
  const myVideo = useRef(); // Video của người gọi
  const [stream, setStream] = useState(); // Dữ liệu stream của người gọi
  const [callAccepted, setCallAccepted] = useState(false); // Trạng thái nhận cuộc gọi
  const [callEnded, setCallEnded] = useState(false); // Trạng thái kết thúc cuộc gọi
  const [isVideoMuted, setIsVideoMuted] = useState(isVideoCall !== false); // Trạng thái tắt/bật video
  const [isAudioMuted, setIsAudioMuted] = useState(false); // Trạng thái tắt/bật âm thanh
  const [avatarUrl, setAvatarUrl] = useState(); // Ảnh đại diện của người nhận

  const dataOwner = useContext(OwnDataContext); // Dữ liệu người gọi
  const socket = useSocket(); // Kết nối socket.io
  const connectionRef = useRef(); // Tham chiếu đến kết nối Peer
  const navigate = useNavigate(); // Điều hướng trang

  toast.dismiss(); // Tắt mọi thông báo

  useEffect(() => {
    const params = getURLParam();
    const sender_id = params?.sender_id;
    const receiver_id = params?.receiver_id;
    const room_id = params?.ROOM_ID;

    // Bật camera và micro
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        if (myVideo.current) {
          myVideo.current.srcObject = stream;
        }
      });

    // Lấy thông tin người nhận từ API
    const fetchUserAvatar = async () => {
      const userIdToFetch =
        dataOwner?.user_id !== sender_id ? sender_id : receiver_id;
      try {
        const response = await getData(
          API_GET_INFO_USER_PROFILE_BY_ID(userIdToFetch)
        );
        if (response.status === true && response.data?.avatar) {
          setAvatarUrl(response.data.avatar); // Đặt avatar người nhận
        }
      } catch (error) {
        console.log("Error fetching user avatar:", error);
      }
    };
    fetchUserAvatar();

    // Lắng nghe tín hiệu gọi từ socket
    socket.on("user-calling", (data) => {
      const peer = new Peer({
        initiator: false, // Người nhận không phải người khởi tạo
        trickle: false,
        stream: stream, // Dữ liệu stream
      });

      // Khi nhận được tín hiệu, trả lại tín hiệu cho người gọi
      peer.on("signal", (signal) => {
        socket.emit("acceptCallUser", {
          status: "Accepted",
          signal,
          sender_id,
          receiver_id,
          room_id,
        });
      });

      // Khi kết nối thành công, hiển thị video của người gọi
      peer.on("stream", (userStream) => {
        if (userVideo.current) {
          userVideo.current.srcObject = userStream;
        }
      });

      peer.signal(data.signal); // Kết nối với tín hiệu từ người gọi
      setCallAccepted(true);
      connectionRef.current = peer;
    });

    // Người gọi bắt đầu cuộc gọi
    if (params?.isCaller) {
      const peer = new Peer({
        initiator: true, // Người gọi là người khởi tạo
        trickle: false,
        stream: stream,
      });

      // Khi tín hiệu sẵn sàng, gửi tín hiệu tới người nhận
      peer.on("signal", (signal) => {
        socket.emit("callUser", {
          receiver_id,
          sender_id,
          room_id,
          signal,
        });
      });

      // Khi nhận được stream từ người nhận, hiển thị video
      peer.on("stream", (userStream) => {
        if (userVideo.current) {
          userVideo.current.srcObject = userStream;
        }
      });

      connectionRef.current = peer; // Lưu kết nối
    }

    // Lắng nghe trạng thái chấp nhận cuộc gọi
    socket.on("statusAcceptedCallUser", (data) => {
      if (data?.status === "Accepted") {
        toast("Người nghe đang vào cuộc hội thoại...");
      } else {
        toast.error("Người nghe đã từ chối cuộc gọi...");
        navigate(-1); // Điều hướng quay lại trang trước nếu bị từ chối
      }
    });

    // Dọn dẹp khi component bị hủy
    return () => {
      socket.off("user-calling");
      socket.off("statusAcceptedCallUser");
      if (connectionRef.current) {
        connectionRef.current.destroy();
      }
    };
  }, [stream, socket, navigate, dataOwner]);

  const handleEndCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy(); // Hủy kết nối Peer
    window.close();
  };

  return (
    <div className="video-call-container">
      <div className="video-wrapper">
        <video ref={myVideo} autoPlay muted className="my-video" />
        {isVideoMuted ? (
          <img src={avatarUrl} alt="Avatar" className="user-avatar" />
        ) : callAccepted ? (
          <video ref={userVideo} autoPlay className="user-video" />
        ) : (
          <div>
            <h2 style={{ textAlign: "center", marginBottom: "-20px" }}>
              Đang gọi ...
            </h2>
            <img src={avatarUrl} alt="Avatar" className="user-avatar" />
          </div>
        )}
      </div>
      <div className="controls">
        <button onClick={() => setIsVideoMuted((prev) => !prev)}>
          {isVideoMuted ? <FaVideoSlash /> : <FaVideo />}
        </button>
        <button onClick={() => setIsAudioMuted((prev) => !prev)}>
          {isAudioMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
        </button>
        <button onClick={handleEndCall} className="control-button end-call">
          <FaPhoneAlt />
        </button>
      </div>
    </div>
  );
};

export default VideoCall;
