import React, { useEffect, useState } from "react";
import "./navigative_bar.scss";
import logo from "../../www/logo_sm.png";
import { AiFillHome } from "react-icons/ai";
import { FaUserFriends } from "react-icons/fa";
import { FaShop } from "react-icons/fa6";
import { HiMiniUserGroup } from "react-icons/hi2";
import { BiLogoMessenger, BiSolidBellRing } from "react-icons/bi";
import { MdDarkMode } from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";
import { IoMdSearch } from "react-icons/io";
import { FaChevronRight } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { Link } from "react-router-dom";
import imgError from "../../www/error_image.png";
import NoticeItem from "../../component/NoticeItem/notice_item";
import ToggleButton from 'react-toggle-button'
import useToggleListener from "../../ultils/animation/ToggleActive";
import { useDispatch, useSelector } from "react-redux";
import { darkHandle, lightHandle } from "../../redux/Reducer/reducer";

function NavigativeBar() {
    const theme = useSelector((state) => state.themeUI.theme)
    const [darkOn, setDarkOn] = useState(theme === "dark" ? true : false);
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
                        <form action="" method="get">
                            <IoMdSearch />
                            <input type="text" placeholder="Tìm kiếm theo bài viết..." name="searchString" />
                        </form>
                        <div className="temp"></div>
                    </div>
                    <ul className="navbar-side--middle">
                        <Link to="/" className="active" title="Trang chủ">
                            <li><AiFillHome /></li>
                        </Link>
                        <Link title="Cửa hàng">
                            <li><FaShop /></li>
                        </Link>
                        <Link title="Nhắn tin">
                            <li>
                                <div className="messenger-icon--container">
                                    <BiLogoMessenger />
                                    <p>9</p>
                                </div>
                            </li>
                        </Link>
                        <Link title="Bạn bè của bạn">
                            <li><FaUserFriends /></li>
                        </Link>
                        <Link title="Nhóm">
                            <li><HiMiniUserGroup /></li>
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
                            <img className="avt-navbar" src="https://cdn.24h.com.vn/upload/1-2023/images/2023-01-04/Ve-dep-dien-dao-chung-sinh-cua-co-gai-sinh-nam-1999-lot-top-guong-mat-dep-nhat-the-gioi-57068584_2351143488502839_871658938696715268_n-1672812988-819-width1080height1080.jpg" alt="" />
                            <div className="box-personal">
                                <ul className="list-personal--options">
                                    <li className="personal-direct--profile">
                                        <Link>
                                            <img className="avt-direct--profile" src="https://cdn.24h.com.vn/upload/1-2023/images/2023-01-04/Ve-dep-dien-dao-chung-sinh-cua-co-gai-sinh-nam-1999-lot-top-guong-mat-dep-nhat-the-gioi-57068584_2351143488502839_871658938696715268_n-1672812988-819-width1080height1080.jpg" alt="" />
                                            <span>
                                                <h4>Dasha Taran</h4>
                                                <p>Nhấn để vào trang cá nhân</p>
                                            </span>
                                        </Link>
                                    </li>
                                    <li className="dark-mode--setting">
                                        <span>
                                            <MdDarkMode />
                                            <p>
                                                Chế độ tối
                                            </p>
                                        </span>
                                        <ToggleButton
                                            value={darkOn}
                                            onToggle={() => {
                                                setDarkOn(!darkOn);

                                            }}
                                            activeLabel="Bật"
                                            inactiveLabel="Tắt"
                                        />
                                    </li>
                                    <li className="function-direct">
                                        <Link>
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
                                        <Link>
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