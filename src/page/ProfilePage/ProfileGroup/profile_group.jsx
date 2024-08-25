import React, { useEffect } from "react";
import "./profile_group.scss";

import NavigativeBar from "../../../layout/NavigativeBar/navigative_bar";
import ProfileHeader from "../../../layout/ProfileHeader/profile_header";
import ListSuggest from "../../../layout/SideBarRight/Suggest/list_suggest";
import { useParams } from "react-router-dom";
function ProfileGroup({ titlePage }) {
    useEffect(() => {
        document.title = titlePage;
    }, [titlePage]);
    const { user_id } = useParams();
    
    return (
        <React.Fragment>
            <NavigativeBar />
            <div className="profile">
                <div className="profile-container">
                    <ProfileHeader userId={user_id} classNameActive="group" />
                    <div className="profile-group--container">
                        <h3 className="box">Nhóm của bạn <form action="" method="get">
                            <input type="text" placeholder="&#x1F50D; Nhập tên nhóm"/>
                        </form></h3>
                       
                        <ListSuggest />
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default ProfileGroup;