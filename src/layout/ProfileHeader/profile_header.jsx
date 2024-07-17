import React, { useEffect, useState } from "react";
import "./profile_header.scss";
import { IoHeartCircle, IoQrCodeOutline } from "react-icons/io5";
import { IoIosPersonAdd } from "react-icons/io";
import { FaUserCheck } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaFacebookMessenger } from "react-icons/fa6";
import QRCodePopup from "../../component/QRCode/qr_code";
function ProfileHeader({ classNameActive }) {
    const [isHearted, setIsHearted] = useState(false);
    const [isFriend, setIsFriend] = useState(false);
    const [showQRCodePopup, setShowQRCodePopup] = useState(false);

    const handleQRCodeClick = () => {
        setShowQRCodePopup(true);
    };

    const handleClosePopup = () => {
        setShowQRCodePopup(false);
    };

    const currentURL = window.location.href;
    useEffect(() => {
        const listNavigation = document.querySelectorAll('.profile-navigation a li');
        listNavigation.forEach(navigation => {
            if (navigation.classList.contains(classNameActive)) {
                document.querySelector('.profile-navigation a li.active').classList.remove("active")
                navigation.classList.add("active");
            }
        })
    }, [classNameActive]);
    return (
        <React.Fragment>
            <div className="profile-header--container">
                <div className="profile-header">
                    <div className="profile-cover--img">
                        <img src="https://c4.wallpaperflare.com/wallpaper/243/676/950/dasha-taran-photoshopped-lips-face-women-hd-wallpaper-preview.jpg" alt="" />
                    </div>
                    <div className="profile-avatar--img">
                        <img src="https://pbs.twimg.com/profile_images/1415999849888055300/8zvKC-eE_400x400.jpg" alt="" />
                        <div className="header-container">
                            <div className="info-analyst">
                                <h1 className="name">Dasha Taran</h1>
                                <p className="nickname">@dashataran1223</p>
                                <div className="analyst">
                                    <p className="quantity-friend">1002 bạn bè</p>
                                    <i>•</i>
                                    <p className="quantity-like">1002 lượt thích</p>
                                    <i>•</i>
                                    <p className="quantity-same--fr">1002 bạn chung</p>
                                </div>
                            </div>
                            <div className="btn-action">
                                <IoQrCodeOutline onClick={handleQRCodeClick} className="code-qr" />
                                <QRCodePopup show={showQRCodePopup} url={currentURL} onClose={handleClosePopup} />
                                <Link>
                                    <div className="btn btn-messenger" >
                                        <FaFacebookMessenger /> Nhắn tin
                                    </div>
                                </Link>
                                <div className={`btn btn-like ${isHearted ? "active" : ""}`} onClick={() => setIsHearted(!isHearted)}><IoHeartCircle /> {isHearted ? "Đã thích" : "Thích"}</div>
                                <div className={`btn btn-add--friend ${isFriend ? "active" : ""}`} onClick={() => setIsFriend(!isFriend)}>
                                    {isFriend ? (<><FaUserCheck /> Bạn bè</>) : (<><IoIosPersonAdd /> Thêm bạn bè</>)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ul className="profile-navigation">
                    <Link to="/profile/123">
                        <li className="profile-navigation--item post active">Bài viết</li>
                    </Link>
                    <Link to="/profile/123/image">
                        <li className="profile-navigation--item image">Ảnh</li>
                    </Link>
                    <Link to="/profile/123/friends">
                        <li className="profile-navigation--item friends">Bạn bè</li>
                    </Link>
                    <Link to="/profile/123/group">
                        <li className="profile-navigation--item group">Nhóm</li>
                    </Link>
                    <Link to="/profile/123/liked">
                        <li className="profile-navigation--item liked">Đã thích</li>
                    </Link>
                    <Link to="/profile/123/request-add--fr">
                        <li className="profile-navigation--item request-add--fr">Yêu cầu kết bạn</li>
                    </Link>
                    <Link to="/profile/123/store-story">
                        <li className="profile-navigation--item store-story">Kho lưu trữ tin</li>
                    </Link>
                </ul>
            </div>
        </React.Fragment>
    );
}

export default ProfileHeader;