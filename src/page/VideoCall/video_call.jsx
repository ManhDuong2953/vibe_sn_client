import React, { useRef, useState, useEffect, useContext } from "react";
import "./video_call.scss";
import {
  FaVideoSlash,
  FaVideo,
  FaMicrophoneSlash,
  FaMicrophone,
  FaPhoneAlt,
} from "react-icons/fa";
import Peer from "peerjs";
import { getURLParam } from "../../ultils/getParamURL/get_param_URL";
import { getData } from "../../ultils/fetchAPI/fetch_API";
import { API_GET_INFO_USER_PROFILE_BY_ID } from "../../API/api_server";
import { useSocket } from "../../provider/socket_context";
import { OwnDataContext } from "../../provider/own_data";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const VideoCall = ({ isVideoCall, titlePage, userId }) => {
  useEffect(() => {
    document.title = titlePage;
  }, [titlePage]);

  const userVideo = useRef();
  const partnerVideo = useRef();
  const peerInstance = useRef(null);

  const [receiver_id, setReceiverID] = useState();
  const [room_id, setRoomID] = useState();
  const [sender_id, setSenderID] = useState();
  const [stream, setStream] = useState(null);
  const [isCalled, setIsCalled] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(isVideoCall !== false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState();
  const dataOwner = useContext(OwnDataContext);
  const socket = useSocket();

  const navigate = useNavigate();
  toast.dismiss();

  useEffect(() => {
    const params = getURLParam();
    setSenderID(params?.sender_id);
    setRoomID(params?.ROOM_ID);
    setReceiverID(params?.receiver_id);
    const timer = setTimeout(() => {
      setIsCalled(true);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  //Bật cam lần đầu
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error("Error accessing media devices.", err);
      });
  }, []);

  //Get thông tin người nghe
  useEffect(() => {
    try {
      const fetchAPI = async () => {
        const response = await getData(
          API_GET_INFO_USER_PROFILE_BY_ID(
            dataOwner?.user_id !== sender_id ? sender_id : receiver_id
          )
        );

        if (response.status === true && response.data?.avatar) {
          const { avatar } = response.data;
          setAvatarUrl(avatar);
        }
      };

      fetchAPI();
    } catch (error) {
      console.log("Error: ", error);
    }
  }, [receiver_id, dataOwner]);

  //Gửi thông tin
  useEffect(() => {
    if (socket && dataOwner?.user_id) {
      socket.emit("registerUser", { user_id: dataOwner?.user_id });

      //Gửi thông báo gọi cho người nghe
      socket.emit("callUser", {
        receiver_id: receiver_id,
        sender_id: sender_id,
        room_id: room_id,
        link_call: `/messenger/video-call?ROOM_ID=${
          receiver_id + sender_id
        }&sender_id=${sender_id}&receiver_id=${receiver_id}`,
      });

      //Lắng nghe sự kiện người nghe chấp nhận
      socket.on("statusAcceptedCallUser", (data) => {
        if (data?.status === "Accepted") {
          toast("Người nghe đang vào cuộc hội thoại...");
        } else {
          toast.error("Người nghe đã từ chối gọi...");
          navigate(-1);
        }
      });

      // Dọn dẹp khi component bị hủy
      return () => {
        socket.off("connect");
        socket.off("registerUser");
        socket.off("callUser");
      };
    }
  }, [receiver_id, sender_id, room_id, socket, dataOwner]);

  const handleVideoToggle = () => {
    setIsVideoMuted((prev) => !prev);
  };

  const handleAudioToggle = () => {
    setIsAudioMuted((prev) => !prev);
  };

  return (
    <React.Fragment>
      <div className="video-call-container">
        <div className="video-wrapper">
          <video ref={userVideo} autoPlay muted className="user-video" />
          {isVideoMuted ? (
            <img src={avatarUrl} alt="Avatar" className="partner-avatar" />
          ) : isCalled ? (
            <video ref={partnerVideo} autoPlay className="partner-video" />
          ) : (
            <div>
              <h2 style={{ textAlign: "center", marginBottom: "-20px" }}>
                Đang gọi ...
              </h2>
              <img src={avatarUrl} alt="Avatar" className="partner-avatar" />
            </div>
          )}
        </div>
        <div className="controls">
          <button onClick={handleVideoToggle} className="control-button">
            {isVideoMuted ? <FaVideoSlash /> : <FaVideo />}
          </button>
          <button onClick={handleAudioToggle} className="control-button">
            {isAudioMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
          </button>
          <button
            className="control-button end-call"
            onClick={() => window.close()}
          >
            <FaPhoneAlt />
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default VideoCall;
