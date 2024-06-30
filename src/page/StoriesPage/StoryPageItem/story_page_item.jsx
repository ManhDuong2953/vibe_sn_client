import { Link } from "react-router-dom";
import PopupInfoShort from "../../../component/PopupInfoShort/popup_info_short";
import "./story_page_item.scss";
import React, { useState } from "react";
import AvatarWithText from "../../../skeleton/avatarwithtext";
function StoryPageItem({ active }) {
    const [loaded, setLoaded] = useState(false)
    setTimeout(() => {
        setLoaded(true);
    }, 2000);
    return (
        <React.Fragment>
            {loaded ? (
                <li className={`user-story--item ${active ? "active" : ""} `}>
                    <Link>
                        <div className="img">
                            <PopupInfoShort />
                            <img src="https://cdn.24h.com.vn/upload/1-2023/images/2023-01-04/Ve-dep-dien-dao-chung-sinh-cua-co-gai-sinh-nam-1999-lot-top-guong-mat-dep-nhat-the-gioi-57068584_2351143488502839_871658938696715268_n-1672812988-819-width1080height1080.jpg" alt="" />
                        </div>
                        <div className="info">
                            <p className="name">Dastra Taran</p>
                            <p className="time">5 giờ trước</p>
                        </div>
                    </Link>
                </li>
            ) : (
                <div className="loading-skeleton">
                    <AvatarWithText />
                </div>
            )}
        </React.Fragment>
    );
}

export default StoryPageItem;