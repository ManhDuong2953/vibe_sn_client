import React, { useRef, useState, useEffect } from 'react';
import './video_call.scss';
import { FaVideoSlash, FaVideo, FaMicrophoneSlash, FaMicrophone, FaPhoneAlt } from 'react-icons/fa';

const VideoCall = ({ isVideoCall }) => {
    const userVideo = useRef();
    const partnerVideo = useRef();
    const [stream, setStream] = useState(null);
    const [isCalled, setIsCalled] = useState(false);
    const [isVideoMuted, setIsVideoMuted] = useState(isVideoCall !== false); // Bắt đầu có video nếu isVideoCall không phải false
    const [isAudioMuted, setIsAudioMuted] = useState(false);
    const avatarUrl = 'https://cdn.24h.com.vn/upload/1-2023/images/2023-01-04/Ve-dep-dien-dao-chung-sinh-cua-co-gai-sinh-nam-1999-lot-top-guong-mat-dep-nhat-the-gioi-57068584_2351143488502839_871658938696715268_n-1672812988-819-width1080height1080.jpg';

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsCalled(true);
        }, 10000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: !isVideoMuted, audio: !isAudioMuted })
            .then(stream => {
                userVideo.current.srcObject = stream;
                setStream(stream);
            })
            .catch(error => {
                console.error("Error accessing media devices.", error);
            });

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    useEffect(() => {
        if (stream) {
            stream.getVideoTracks()[0].enabled = !isVideoMuted;
            stream.getAudioTracks()[0].enabled = !isAudioMuted;
        }
    }, [isVideoMuted, isAudioMuted, stream]);

    const handleVideoToggle = () => {
        setIsVideoMuted(prev => !prev); // Đảo ngược trạng thái video
    };

    const handleAudioToggle = () => {
        setIsAudioMuted(prev => !prev); // Đảo ngược trạng thái audio
    };

    return (
        <React.Fragment>
            <div className="video-call-container">
                <div className="video-wrapper">
                    <video ref={userVideo} autoPlay muted className="user-video" />
                    {isVideoMuted ? (
                        <img src={avatarUrl} alt="Avatar" className="partner-avatar" />
                    ) : (
                        isCalled ? (
                            <video src='https://cdn.pixabay.com/video/2021/08/30/86866-594991232_large.mp4' ref={partnerVideo} autoPlay className="partner-video" />
                        ) : (
                            <div>
                                <h2 style={{ textAlign: "center", marginBottom: "-20px" }}>Đang gọi Dasha Taran ...</h2>
                                <img src={avatarUrl} alt="Avatar" className="partner-avatar" />
                            </div>
                        )
                    )}
                </div>
                <div className="controls">
                    <button onClick={handleVideoToggle} className="control-button">
                        {isVideoMuted ? <FaVideoSlash /> : <FaVideo />}
                    </button>
                    <button onClick={handleAudioToggle} className="control-button">
                        {isAudioMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
                    </button>
                    <button className="control-button end-call" onClick={() => window.close()}>
                        <FaPhoneAlt />
                    </button>
                </div>
            </div>
        </React.Fragment>
    );
};

export default VideoCall;
