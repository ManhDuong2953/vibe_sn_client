import React, { useEffect, useState } from "react";
import "./group_home.scss";
import NavigativeBar from "../../../layout/NavigativeBar/navigative_bar";
import PostItem from "../../../layout/ListPosts/PostItem/post_item";
import GroupHeader from "../../../layout/GroupHeader/group_header";
import { MdDateRange } from "react-icons/md";
import { FaPeopleGroup } from "react-icons/fa6";
import FormPost from "../../../component/FormPost/form_post";
import ListSuggest from "../../../layout/SideBarRight/Suggest/list_suggest";
import { CgPushChevronLeft, CgPushChevronRight } from "react-icons/cg";
import { useParams } from "react-router-dom";
import { getData } from "../../../ultils/fetchAPI/fetch_API";
import { API_GROUP_DETAIL } from "../../../API/api_server";


function GroupHomePage({ titlePage }) {
    useEffect(() => {
        document.title = titlePage;
    }, [titlePage]);
    const {group_id} = useParams();
   
    return (
        <React.Fragment>
            <div className="group-dom">
                <NavigativeBar />
                <div className="group-wrapper container">
                    <div className="group-container">
                        <GroupHeader group_id={group_id} classNameActive={"post"} />
                        <div className="group-main">
                            <div className="group-left">
                                <FormPost />
                                <div className="title-content box">
                                    <h3>
                                        Bài viết
                                    </h3>

                                </div>
                                <PostItem />
                                <PostItem />
                            </div>
                            <div className="group-right">
                                <div className="title-intro box">
                                    <h3>
                                        Giới thiệu
                                    </h3>
                                    <div className="slogan">Tuyền Văn Hóa - Vlogger với những góc nhìn độc đáo về bóng đá trong nước & Quốc tế</div>
                                    <div className="info-short--item info-school"><MdDateRange />Tạo ngày: <b>29/05/2024</b></div>
                                    <div className="info-short--item info-address"><FaPeopleGroup />Thành viên nhóm: <b> 100.000 </b> thành viên</div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default GroupHomePage;