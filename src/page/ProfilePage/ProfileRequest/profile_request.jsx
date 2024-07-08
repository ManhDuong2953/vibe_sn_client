import React from "react";
import "./profile_request.scss";
import "../profile_page.scss";
import NavigativeBar from "../../../layout/NavigativeBar/navigative_bar";
import ProfileHeader from "../../../layout/ProfileHeader/profile_header";
function ProfileRequest() {
    return (
        <React.Fragment>
            <NavigativeBar />
            <div className="profile">
                <div className="profile-container">
                    <ProfileHeader classNameActive="request-add--fr" />
                    <div className="profile-liked--container">
                        <h3 className="box">Yêu cầu kết bạn <form action="" method="get">
                            <input type="text" placeholder="&#x1F50D; Nhập tên hoặc biệt danh của người yêu cầu kết bạn"/>
                        </form></h3>
                       
                        
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default ProfileRequest;