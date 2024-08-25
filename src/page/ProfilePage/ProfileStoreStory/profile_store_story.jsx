import React, { useEffect } from "react";
import "./profile_store_story.scss";

import NavigativeBar from "../../../layout/NavigativeBar/navigative_bar";
import ProfileHeader from "../../../layout/ProfileHeader/profile_header";
import { Link, useParams } from "react-router-dom";
function ProfileStoreStory({ titlePage }) {
    useEffect(() => {
        document.title = titlePage;
    }, [titlePage]);
    const { user_id } = useParams();

    return (
        <React.Fragment>
            <NavigativeBar />
            <div className="profile">
                <div className="profile-container">
                    <ProfileHeader userId={user_id} classNameActive="store-story" />
                    <div className="profile-story--container">
                        <h3 className="box">Kho lưu trữ tin</h3>
                        <ul className="post-image--list">
                            <Link to="/story/123">
                                <li className="post-image--item">
                                    <img src="https://gaixinhbikini.com/wp-content/uploads/2022/08/Hinh-anh-gai-Nga-dep-luvvn-51.jpg" alt="" />
                                    <p className="time">12/12/2023</p>
                                </li>
                            </Link>

                            <Link to="/story/123">
                                <li className="post-image--item">
                                    <img src="https://gaixinhbikini.com/wp-content/uploads/2022/08/Hinh-anh-gai-Nga-dep-luvvn-51.jpg" alt="" />
                                    <p className="time">12/12/2023</p>

                                </li>
                            </Link>
                            <Link to="/story/123">
                                <li className="post-image--item">
                                    <img src="https://gaixinhbikini.com/wp-content/uploads/2022/08/Hinh-anh-gai-Nga-dep-luvvn-51.jpg" alt="" />
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

export default ProfileStoreStory;