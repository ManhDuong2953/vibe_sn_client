import React, { useEffect, useState } from "react";
import "./group_header.scss";
import { MdGroupAdd } from "react-icons/md";
import { MdGroupRemove } from "react-icons/md";
import { Link } from "react-router-dom";
import { FaUserLock } from "react-icons/fa";
import { AiOutlineGlobal } from "react-icons/ai";
import { FaFacebookMessenger } from "react-icons/fa6";
import ListSuggest from "../SideBarRight/Suggest/list_suggest";
import { CgPushChevronLeft, CgPushChevronRight } from "react-icons/cg";

function GroupHeader({ classNameActive }) {

    const [isFriend, setIsFriend] = useState(false);
    useEffect(() => {
        const listNavigation = document.querySelectorAll('.group-navigation a li');
        listNavigation.forEach(navigation => {
            if (navigation.classList.contains(classNameActive)) {
                document.querySelector('.group-navigation a li.active').classList.remove("active")
                navigation.classList.add("active");
            }
        })
    }, [classNameActive]);
    return (
        <React.Fragment>
            <div className="group-header--main">
        
                <div className="group-header--container">
                    <div className="group-header">
                        <div className="group-cover--img">
                            <img src="https://caodang.fpt.edu.vn/wp-content/uploads/ed.png" alt="" />
                        </div>
                        <div className="group-avatar--img">
                            <img src="https://media.vneconomy.vn/w800/images/upload/2022/08/08/learn-programming-career-jpg.jpeg" alt="" />
                            <div className="header-container">
                                <div className="info-analyst">
                                    <h1 className="name">Cùng học lập trình từ con số 0</h1>
                                    <div className="analyst">
                                        <p className="private"><FaUserLock />Nhóm công khai</p>
                                        <i>•</i>
                                        <p className="quantity-member">1002 thành viên</p>
                                        <i>•</i>
                                        <p className="quantity-same--fr">43 bạn chung</p>
                                    </div>
                                </div>
                                <div className="btn-action">
                                    <Link>
                                        <div className="btn btn-messenger" >
                                            <FaFacebookMessenger /> Nhắn tin
                                        </div>
                                    </Link>
                                    <div className={`btn btn-add--gr ${isFriend ? "active" : ""}`} onClick={() => setIsFriend(!isFriend)}>
                                        {isFriend ? (<><MdGroupRemove /> Rời nhóm</>) : (<><MdGroupAdd /> Tham gia nhóm</>)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ul className="group-navigation">
                        <Link to="/group/123">
                            <li className="group-navigation--item post active">Bài viết</li>
                        </Link>
                        <Link to="/group/123/members">
                            <li className="group-navigation--item members">Thành viên</li>
                        </Link>
                        <Link to="/group/123/admin">
                            <li className="group-navigation--item admin">Quản trị nhóm</li>
                        </Link>

                    </ul>
                </div>
            </div>
        </React.Fragment >
    );
}

export default GroupHeader;