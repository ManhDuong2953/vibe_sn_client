import React from "react";
import "./profile_liked.scss";

import NavigativeBar from "../../../layout/NavigativeBar/navigative_bar";
import ProfileHeader from "../../../layout/ProfileHeader/profile_header";
import ListSuggest from "../../../layout/SideBarRight/Suggest/list_suggest";
function ProfileLiked() {
    return (
        <React.Fragment>
            <NavigativeBar />
            <div className="profile">
                <div className="profile-container">
                    <ProfileHeader classNameActive="liked" />
                    <div className="profile-liked--container">
                        <h3 className="box">Đã thích <form action="" method="get">
                            <input type="text" placeholder="&#x1F50D; Nhập tên hoặc biệt danh của người bạn đã thích"/>
                        </form></h3>
                       
                        <ListSuggest />
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default ProfileLiked;