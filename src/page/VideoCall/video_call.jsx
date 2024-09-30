import React, { useRef, useState, useEffect } from "react";
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
  const avatarUrl = "https://example.com/avatar.jpg";

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
