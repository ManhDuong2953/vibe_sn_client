import React, { useContext, useEffect, useRef, useState } from "react";
import "./navigative_bar.scss";
import logo from "../../www/logo_sm.png";
import { AiFillHome } from "react-icons/ai";
import { FaShop } from "react-icons/fa6";
import { HiMiniUserGroup } from "react-icons/hi2";
import { BiLogoMessenger, BiSolidBellRing } from "react-icons/bi";
import { MdDarkMode } from "react-icons/md";
import { IoMdSearch, IoMdSettings } from "react-icons/io";
import { FaChevronRight } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import imgError from "../../www/error_image.png";
import NoticeItem from "../../component/NoticeItem/notice_item";
import ToggleButton from 'react-toggle-button'
import useToggleListener from "../../ultils/animation/toggle_active";
import { useDispatch } from "react-redux";
import { darkHandle, lightHandle } from "../../redux/Reducer/reducer";
import { IoListOutline, IoSettingsSharp } from "react-icons/io5";
import { OwnDataContext } from "../../provider/own_data";

function NavigativeBar() {
    const navigate = useNavigate();
    const [searchString, setSearchString] = useState("");
    const dataOwner = useContext(OwnDataContext);
    const [darkOn, setDarkOn] = useState(dataOwner?.dark_theme === 1);

    // Cập nhật lại state darkOn khi dataOwner thay đổi
    useEffect(() => {
        setDarkOn(dataOwner?.dark_theme === 1);
    }, [dataOwner]);

    const handleInput = (e) => {
        setSearchString(e);
    }

    const handleSubmit = (e) => {
        if (e === "Enter") {
            navigate(`/search?searchString=` + searchString);
        }

    }
    const dispatch = useDispatch()
    useEffect(() => {
        if (darkOn) {
            dispatch(darkHandle())
        } else if (!darkOn) {
            dispatch(lightHandle())
        }
    }, [darkOn, dispatch]);

    // Use useToggleListener hook for bell-notice--icon and personal-icon
    useToggleListener("bell-notice--icon", "box-notice");
    useToggleListener("personal-icon", "box-personal");
    useEffect(() => {
        const currentPath = window.location.pathname.split("/")[0] + "/" + window.location.pathname.split("/")[1];
        const activeLink = document.querySelector(".navbar-side--middle a.active");
        if (activeLink) activeLink.classList.remove("active");

        document.querySelectorAll(".navbar-side--middle a").forEach(link => {
            if (link.getAttribute("href") === currentPath) {
                link.classList.add("active");
            }
        });
        const iconToggleNavbar = document.querySelector(".toggle-navbar");
        const navBar = document.querySelector(".navbar-side--middle");
        const handleToggle = () => {
            navBar.classList.toggle("active");
        }
        iconToggleNavbar.addEventListener("click", handleToggle);
        return () => {
            iconToggleNavbar.removeEventListener("click", handleToggle);
        }
    }, []);

    return (
        <React.Fragment>
            <nav className="navbar-container">
                <div className="container">
                    <div className="navbar-side--left">
                        <div className="logo-container">
                            <Link to="/">
                                <img src={logo} onError={(e) => { e.target.src = imgError }} alt="" />
                            </Link>
                        </div>
                        <form method="get" onSubmit={e => e.preventDefault()}>
                            <Link to="/search">
                                <IoMdSearch />
                            </Link>
                            <input type="text" onKeyDown={e => handleSubmit(e.key)} onChange={e => handleInput(e.target.value)} placeholder="Tìm kiếm theo bài viết..." value={searchString} name="searchString" />
                        </form>
                        <IoListOutline className="toggle-navbar" />
                        <div className="temp"></div>
                    </div>
                    <ul className="navbar-side--middle">
                        <li><img src={logo} className="logo" onError={(e) => { e.target.src = imgError }} alt="" /></li>
                        <Link to="/" className="active" title="Trang chủ">
                            <li><AiFillHome /><b>Trang chủ</b></li>
                        </Link>
                        <Link to="/marketplace" title="Cửa hàng">
                            <li><FaShop /><b>Marketplace</b></li>
                        </Link>
                        <Link to="/messenger" title="Nhắn tin">
                            <li>
                                <div className="messenger-icon--container">
                                    <BiLogoMessenger />
                                    <p>9</p>
                                    <b>Nhắn tin</b>
                                </div>
                            </li>
                        </Link>
                        <Link to="/group" title="Nhóm">
                            <li><HiMiniUserGroup /><b>Nhóm</b></li>
                        </Link>
                        <Link to={"/setting/"} title="Cài đặt">
                            <li><IoMdSettings /><b>Cài đặt</b></li>
                        </Link>
                    </ul>
                    <div className="navbar-side--right">
                        <div className="bell-notice--icon">
                            <div className="icon-notice--container">
                                <BiSolidBellRing />
                                <p>4</p>
                            </div>
                            <ul className="box-notice">
                                <div className="box-notice--header">
                                    <h1 lang="vi">Thông báo</h1>
                                    <p className="delete-all">Xóa tất cả</p>
                                </div>
                                <div className="box-notice--body">
                                    <ul className="list-notice">
                                        <NoticeItem />
                                        <NoticeItem />
                                        <NoticeItem />
                                        <NoticeItem />
                                        <NoticeItem />
                                        <NoticeItem />
                                        <NoticeItem />
                                        <NoticeItem />
                                        <NoticeItem />
                                        <NoticeItem />
                                    </ul>
                                </div>
                            </ul>
                        </div>
                        <div className="personal-icon">
                            <img className="avt-navbar" src={dataOwner && dataOwner?.avatar} alt="" />
                            <div className="box-personal">
                                <ul className="list-personal--options">
                                    <li className="personal-direct--profile">
                                        <Link to={`/profile/${dataOwner && dataOwner?.user_id}`}>
                                            <img className="avt-direct--profile" src={dataOwner && dataOwner?.avatar} alt="" />
                                            <span>
                                                <h4>{dataOwner && dataOwner?.user_name}</h4>
                                                <p>Nhấn để vào trang cá nhân</p>
                                            </span>
                                        </Link>
                                    </li>
                                    <li className="dark-mode--setting" onClick={() => {
                                        setDarkOn(!darkOn);
                                    }}>
                                        <span>
                                            <MdDarkMode />
                                            <p>
                                                Chế độ tối
                                            </p>
                                        </span>
                                        <ToggleButton
                                            value={darkOn}
                                            activeLabel="Bật"
                                            inactiveLabel="Tắt"
                                        />
                                    </li>
                                    <li className="function-direct">
                                        <Link to={"/setting"}>
                                            <span>
                                                <IoSettingsSharp />
                                                <p>
                                                    Cài đặt và Nhận diện
                                                </p>
                                            </span>
                                            <FaChevronRight />
                                        </Link>
                                    </li>
                                    <li className="function-direct logout">
                                        <Link to="/logout">
                                            <span>
                                                <MdLogout />
                                                <p>
                                                    Đăng xuất
                                                </p>
                                            </span>
                                            <FaChevronRight />
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </React.Fragment>
    );
}

export default NavigativeBar;
