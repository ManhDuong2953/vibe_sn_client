import React, { useEffect, useState } from "react";
import "./profile_request.scss";

import NavigativeBar from "../../../layout/NavigativeBar/navigative_bar";
import ProfileHeader from "../../../layout/ProfileHeader/profile_header";
import ProfileRequestItem from "./ProfileRequestItem/profile_request_item";
import { useParams } from "react-router-dom";
function ProfileRequest({ titlePage }) {
    useEffect(() => {
        document.title = titlePage;
    }, [titlePage]);
    const { user_id } = useParams();

    return (
        <React.Fragment>
            <NavigativeBar />
            <div className="profile">
                <div className="profile-container">
                    <ProfileHeader userId={user_id} classNameActive="request-add--fr" />
                    <div className="profile-request--container">
                        <h3 className="box">Yêu cầu kết bạn <form action="" method="get">
                            <input type="text" placeholder="&#x1F50D; Nhập tên hoặc biệt danh của người yêu cầu kết bạn" />
                        </form></h3>

                        <ul className="list-request">

                            <ProfileRequestItem />
                            <ProfileRequestItem />
                            <ProfileRequestItem />
                            <ProfileRequestItem />
                            <ProfileRequestItem />
                            <ProfileRequestItem />
                            <ProfileRequestItem />
                        </ul>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default ProfileRequest;