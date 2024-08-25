import React, { useEffect } from "react";
import "./profile_friends.scss";

import NavigativeBar from "../../../layout/NavigativeBar/navigative_bar";
import ProfileHeader from "../../../layout/ProfileHeader/profile_header";
import ListContact from "../../../layout/SideBarRight/Contact/list_contact";
import { useParams } from "react-router-dom";
function ProfileFriend({ titlePage }) {
    useEffect(() => {
        document.title = titlePage;
    }, [titlePage]);
    const { user_id } = useParams();

    return (
        <React.Fragment>
            <NavigativeBar />
            <div className="profile">
                <div className="profile-container">
                    <ProfileHeader userId={user_id} classNameActive="friends" />
                    <div className="profile-friends--container">
                        <h3 className="box">Bạn bè của bạn <form action="" method="get">
                            <input type="text" placeholder="&#x1F50D; Nhập tên hoặc biệt danh của bạn bè"/>
                        </form></h3>
                       
                        <ListContact />
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default ProfileFriend;