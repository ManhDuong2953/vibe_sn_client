import React, { useEffect } from "react";
import "./profile_image.scss";

import NavigativeBar from "../../../layout/NavigativeBar/navigative_bar";
import ProfileHeader from "../../../layout/ProfileHeader/profile_header";
import { Link } from "react-router-dom";
function ProfileImage({ titlePage }) {
    useEffect(() => {
        document.title = titlePage;
    }, [titlePage]);
    return (
        <React.Fragment>
            <NavigativeBar />
            <div className="profile">
                <div className="profile-container">
                    <ProfileHeader classNameActive="image"/>
                    <div className="profile-img--container">
                        <h3 className="box">Ảnh</h3>
                        <ul className="post-image--list">
                            <Link to="/post/123">
                                <li className="post-image--item">
                                    <img src="https://i.pinimg.com/736x/89/fd/69/89fd69b76f1fc3ed1cf1ab79446d8cec.jpg" alt="" />
                                    <p className="time">12/12/2023</p>
                                </li>
                            </Link>
                          
                        </ul>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default ProfileImage;