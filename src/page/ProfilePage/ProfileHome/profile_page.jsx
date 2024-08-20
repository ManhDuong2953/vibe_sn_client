import React, { useContext, useEffect, useState } from "react";
import "./profile_page.scss";
import NavigativeBar from "../../../layout/NavigativeBar/navigative_bar";
import ProfileHeader from "../../../layout/ProfileHeader/profile_header";
import { FaSchoolCircleCheck } from "react-icons/fa6";
import { IoHome } from "react-icons/io5";
import PostItem from "../../../layout/ListPosts/PostItem/post_item";
import { Link, useParams } from "react-router-dom";
import { MdDateRange, MdEditNote } from "react-icons/md";
import FormPost from "../../../component/FormPost/form_post";
import { getData } from "../../../ultils/fetchAPI/fetch_API";
import { API_GET_INFO_USER_PROFILE_BY_ID } from "../../../API/api_server";
import { OwnDataContext } from "../../../provider/own_data";
import { formatDateVN } from "../../../ultils/formatDate/format_date";

function ProfilePage({ titlePage }) {
    useEffect(() => {
        document.title = titlePage;
    }, [titlePage]);
    const dataOwner = useContext(OwnDataContext);
    const { user_id } = useParams();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState();

    useEffect(() => {
        try {
            const fetchData = async () => {
                const response = await getData(API_GET_INFO_USER_PROFILE_BY_ID(user_id));
                setData(response?.data);
                return response?.status
            }
            setLoading(fetchData());
        } catch (error) {
            console.log(error.message);
        }
    }, [user_id]);


    return (
        <React.Fragment>
            <NavigativeBar />
            <div className="profile">
                <div className="profile-container">
                    <ProfileHeader userId={user_id ?? null} classNameActive={"post"} />
                    <div className="profile-main">
                        <div className="profile-left">
                            <div className="title-intro box">
                                <h3>
                                    Giới thiệu
                                </h3>
                                <div className="slogan">{data && data?.user_slogan}</div>
                                <div className="info-short--item info-school"><FaSchoolCircleCheck /><p>Từng học tại <b>{data && data?.user_school}</b></p></div>
                                <div className="info-short--item info-address"><IoHome /><p>Đang sống tại <b>{data && data?.user_address}</b></p></div>
                                <div className="info-short--item info-school"><MdDateRange /><p>Tạo ngày: <b>{data && formatDateVN(data?.date_of_birth) }</b></p></div>

                                <Link to={`/profile/${dataOwner && dataOwner?.user_id}/edit`}>
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