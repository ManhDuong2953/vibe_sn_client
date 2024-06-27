import React, { useEffect } from "react";
import "./popup_info_short.scss";
import { Link } from "react-router-dom";
import { FaSchoolCircleCheck, FaArrowUpRightFromSquare } from "react-icons/fa6";
import { IoHome } from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";
import { IoHeartCircleSharp } from "react-icons/io5";

function PopupInfoShort() {
    useEffect(() => {
        const popupInfo = document.querySelector(".popup-info--container");
        const avtParent = popupInfo?.parentNode;
        avtParent.classList.add("popup");
        const handleMouseEnter = () => {
            if (avtParent) {
                //fetch data 
                const screenMidpoint = window.innerHeight / 2;
                const y = avtParent.getBoundingClientRect().y;
                if (y <= screenMidpoint) {
                    popupInfo.style.top = "45px"
                } else {
                    popupInfo.style.top = "-245px"
                }
            }
        };

        if (avtParent) {
            avtParent.addEventListener("mouseenter", handleMouseEnter);
        }

        return () => {
            if (avtParent) {
                avtParent.removeEventListener("mouseenter", handleMouseEnter);
            }
        };
    }, []);

    return (
        <React.Fragment>
            <div className="popup-info--container">
                <div className="row info">
                    <img src="https://cdn.24h.com.vn/upload/1-2023/images/2023-01-04/Ve-dep-dien-dao-chung-sinh-cua-co-gai-sinh-nam-1999-lot-top-guong-mat-dep-nhat-the-gioi-57068584_2351143488502839_871658938696715268_n-1672812988-819-width1080height1080.jpg" alt="" />
                    <div className="info-short">
                        <b className="name-user">Dastra Taran</b>
                        <p className="nickname-user">@dastrataran533</p>
                        <div className="info-short--item info-school"><FaSchoolCircleCheck />Từng học tại <b>Trường đại học Mát-cơ-va</b></div>
                        <div className="info-short--item info-address"><IoHome />Đang sống tại <b>Moscow</b></div>
                        <div className="info-short--item info-quantity--fr"><FaUserFriends />Có <b>1000 bạn bè</b></div>
                        <div className="info-short--item info-quantity--fr"><IoHeartCircleSharp />Có <b>1000 lượt yêu thích</b></div>

                    </div>
                </div>
                <div className="row">
                    <Link >
                        <h5 className="direct-info--detail">
                            Xem trang cá nhân <FaArrowUpRightFromSquare />
                        </h5>
                        <div className="temp"></div>
                        <form action="" method="post" className="active">
                            <IoHeartCircleSharp /> <p>Đã thích</p>
                        </form>
                    </Link>
                </div>
            </div>
        </React.Fragment>
    );
}

export default PopupInfoShort;
