import React, { useEffect } from "react";
import "./profile_page.scss";
import NavigativeBar from "../../../layout/NavigativeBar/navigative_bar";
import ProfileHeader from "../../../layout/ProfileHeader/profile_header";
import { FaSchoolCircleCheck } from "react-icons/fa6";
import { IoHome } from "react-icons/io5";
import PostItem from "../../../layout/ListPosts/PostItem/post_item";
import { Link } from "react-router-dom";
import { MdDateRange, MdEditNote } from "react-icons/md";
import FormPost from "../../../component/FormPost/form_post";

function ProfilePage({ titlePage }) {
    useEffect(() => {
        document.title = titlePage;
    }, [titlePage]);
    return (
        <React.Fragment>
            <NavigativeBar />
            <div className="profile">
                <div className="profile-container">
                    <ProfileHeader classNameActive={"post"} />
                    <div className="profile-main">
                        <div className="profile-left">
                            <div className="title-intro box">
                                <h3>
                                    Giới thiệu
                                </h3>
                                <div className="slogan">Tuyền Văn Hóa - Vlogger với những góc nhìn độc đáo về bóng đá trong nước & Quốc tế</div>
                                <div className="info-short--item info-school"><FaSchoolCircleCheck />Từng học tại <b>Trường đại học Mát-cơ-va</b></div>
                                <div className="info-short--item info-address"><IoHome />Đang sống tại <b>Moscow</b></div>
                                <div className="info-short--item info-school"><MdDateRange />Tạo ngày: <b>29/05/2024</b></div>

                                <Link to="/profile/123/edit">
                                    <div className="edit-btn"> <MdEditNote /><p>Sửa thông tin</p></div>
                                </Link>
                            </div>
                            <div className="title-friend box">
                                <h3>
                                    Bạn bè
                                </h3>
                                <Link to="/profile/123/image">
                                    <ul className="list-fr">
                                        <li className="friend-item">
                                            <img src="https://pbs.twimg.com/profile_images/1415999849888055300/8zvKC-eE_400x400.jpg" alt="" />
                                        </li>
                                        <li className="friend-item">
                                            <img src="https://pbs.twimg.com/profile_images/1415999849888055300/8zvKC-eE_400x400.jpg" alt="" />
                                        </li>
                                        <li className="friend-item">
                                            <img src="https://pbs.twimg.com/profile_images/1415999849888055300/8zvKC-eE_400x400.jpg" alt="" />
                                        </li>
                                        <li className="friend-item">
                                            <img src="https://pbs.twimg.com/profile_images/1415999849888055300/8zvKC-eE_400x400.jpg" alt="" />
                                        </li>
                                    </ul>
                                </Link>
                            </div>
                        </div>
                        <div className="profile-right">
                            <FormPost />
                            <div className="title-content box">
                                <h3>
                                    Bài viết
                                </h3>
                            </div>
                            <PostItem />
                            <PostItem />
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default ProfilePage;