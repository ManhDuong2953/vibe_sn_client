import React, { useContext, useEffect, useRef, useState } from "react";
import "./navigative_bar.scss";
import logo from "../../www/logo_sm.png";
import { AiFillHome, AiOutlineReload } from "react-icons/ai";
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
import ToggleButton from "react-toggle-button";
import useToggleListener from "../../ultils/animation/toggle_active";
import { useDispatch, useSelector } from "react-redux";
import { darkHandle, lightHandle } from "../../redux/Reducer/theme";
import { IoListOutline, IoSettingsSharp } from "react-icons/io5";
import { OwnDataContext } from "../../provider/own_data";
import { useSocket } from "../../provider/socket_context";
import { deleteData, getData } from "../../ultils/fetchAPI/fetch_API";
import {
  API_DELETE_ALL_NOTICE_CURRRENT,
  API_DELETE_ALL_NOTIFICATION,
  API_DELETE_NOTIFICATION_BY_ID,
  API_LIST_NOTIFICATION,
  API_LOGOUT,
} from "../../API/api_server";
import { Popover } from "@mui/material";
import { toast } from "react-toastify";
import Web3 from "web3";
import { setWallet } from "../../redux/Reducer/wallet";
import { logout } from "../../redux/Reducer/auth";

function NavigativeBar() {
  const navigate = useNavigate();
  const [searchString, setSearchString] = useState("");
  const dataOwner = useContext(OwnDataContext);
  const [darkOn, setDarkOn] = useState(dataOwner?.dark_theme === 1);
  const socket = useSocket();
  useEffect(() => {
    if (socket && dataOwner) {
      socket.emit("dark_theme", {
        user_id: dataOwner?.user_id,
        dark_theme: darkOn ? 1 : 0,
      });
    }
  }, [darkOn]);
  // Cập nhật lại state darkOn khi dataOwner thay đổi
  useEffect(() => {
    setDarkOn(dataOwner?.dark_theme === 1);
  }, [dataOwner]);

  const handleInput = (e) => {
    setSearchString(e);
  };

  const handleSubmit = (e) => {
    if (e === "Enter") {
      navigate(`/search?searchString=` + searchString);
    }
  };
  const dispatch = useDispatch();
  useEffect(() => {
    if (darkOn) {
      dispatch(darkHandle());
    } else if (!darkOn) {
      dispatch(lightHandle());
    }
  }, [darkOn, dispatch]);

  // Use useToggleListener hook for bell-notice--icon and personal-icon
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = async (event) => {
    setAnchorEl(event.currentTarget);
    setUnseenCount(0);
    try {
      const response = await deleteData(API_DELETE_ALL_NOTICE_CURRRENT);
      if (response?.status === true) {
        setUnseenCount(0);
        setListNotifications((prevList) =>
          prevList.map((notice) => ({ ...notice, is_seen: 1 }))
        );
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  useToggleListener("personal-icon", "box-personal");
  useEffect(() => {
    const currentPath =
      window.location.pathname.split("/")[0] +
      "/" +
      window.location.pathname.split("/")[1];
    const activeLink = document.querySelector(".navbar-side--middle a.active");
    if (activeLink) activeLink.classList.remove("active");

    document.querySelectorAll(".navbar-side--middle a").forEach((link) => {
      if (link.getAttribute("href") === currentPath) {
        link.classList.add("active");
      }
    });
    const iconToggleNavbar = document.querySelector(".toggle-navbar");
    const navBar = document.querySelector(".navbar-side--middle");
    const handleToggle = () => {
      navBar.classList.toggle("active");
    };
    iconToggleNavbar.addEventListener("click", handleToggle);
    return () => {
      iconToggleNavbar.removeEventListener("click", handleToggle);
    };
  }, []);

  const [listNotifications, setListNotifications] = useState([]);
  const [unseenCount, setUnseenCount] = useState(0);

  const fetchNotifications = async () => {
    const response = await getData(API_LIST_NOTIFICATION);
    if (response?.status) {
      setListNotifications(response.data);
    }
  };

  // Theo dõi sự thay đổi của listNotifications để tính số lượng thông báo chưa xem
  useEffect(() => {
    const countUnseen = listNotifications.filter(
      (notice) => notice.is_seen === 0
    ).length;
    setUnseenCount(countUnseen);
  }, [listNotifications]);

  useEffect(() => {
    try {
      if (!dataOwner?.user_id) return;
      fetchNotifications();
    } catch (error) {
      console.error(error.message);
    }
  }, [dataOwner]);

  useEffect(() => {
    if (socket) {
      socket.on("send_notice", (data) => {
        setListNotifications((prevData) => [data, ...prevData]);
      });
    }
  }, [socket]);

  const handleDeleteNotice = async (notice_id, e) => {
    e.preventDefault();
    try {
      const response = await deleteData(
        API_DELETE_NOTIFICATION_BY_ID(notice_id)
      );
      if (response?.status === true) {
        setListNotifications((prevList) =>
          prevList.filter((notice) => notice.notice_id !== notice_id)
        );
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteAllNotice = async () => {
    try {
      const response = await deleteData(API_DELETE_ALL_NOTIFICATION);
      if (response?.status === true) {
        setListNotifications([]);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const logoutHandle = async () => {
    try {
      // Gọi API để xóa token từ phía server (nếu cần)
      const response = await deleteData(API_LOGOUT);

      if (response?.status) {
        // Xóa token từ cookie
        localStorage.clear();
        // Redirect đến trang đăng nhập
        dispatch(logout());
        navigate("/login");
      }
    } catch (error) {
      // Thông báo lỗi nếu có
      toast.error("Đăng xuất thất bại");
    }
  };

  const { account, balance } = useSelector((state) => state.wallet);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const web3 = new Web3(window.ethereum);
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const balanceWei = await web3.eth.getBalance(accounts[0]);
        const balanceEther = web3.utils.fromWei(balanceWei, "ether");
        const formattedBalance = parseFloat(balanceEther).toFixed(4);

        dispatch(
          setWallet({ account: accounts[0], balance: Number(formattedBalance) })
        );
      } catch (error) {
        toast.error("Kết nối ví thất bại:", error);
      }
    } else {
      toast.info("Vui lòng cài đặt MetaMask!");
    }
  };

  const handleAccountsChanged = async (accounts) => {
    if (accounts.length > 0) {
      const web3 = new Web3(window.ethereum);
      const balanceWei = await web3.eth.getBalance(accounts[0]);
      const balanceEther = web3.utils.fromWei(balanceWei, "ether");
      const formattedBalance = parseFloat(balanceEther).toFixed(4);

      dispatch(setWallet({ account: accounts[0], balance: formattedBalance }));
    } else {
      dispatch(setWallet({ account: accounts[0], balance: 0 }));
    }
  };

  const switchAccount = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: "wallet_requestPermissions",
          params: [{ eth_accounts: {} }],
        });
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        handleAccountsChanged(accounts);
      } catch (error) {
        toast.error("Lỗi đổi tài khoản:", error);
      }
    } else {
      toast.info("Vui lòng cài đặt MetaMask!");
    }
  };

  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <React.Fragment>
      <nav className="navbar-container">
        <div className="container">
          <div className="navbar-side--left">
            <div className="logo-container">
              <Link to="/">
                <img
                  src={logo}
                  onError={(e) => {
                    e.target.src = imgError;
                  }}
                  alt=""
                />
              </Link>
            </div>
            <form method="get" onSubmit={(e) => e.preventDefault()}>
              <Link to="/search">
                <IoMdSearch />
              </Link>
              <input
                type="text"
                onKeyDown={(e) => handleSubmit(e.key)}
                onChange={(e) => handleInput(e.target.value)}
                placeholder="Tìm kiếm theo bài viết..."
                value={searchString}
                name="searchString"
              />
            </form>
            <IoListOutline className="toggle-navbar" />
            <div className="temp"></div>
          </div>
          <ul className="navbar-side--middle">
            <Link to="/" className="active" title="Trang chủ">
              <li>
                <AiFillHome />
                <b>Trang chủ</b>
              </li>
            </Link>
            <Link to="/marketplace" title="Cửa hàng">
              <li>
                <FaShop />
                <b>Marketplace</b>
              </li>
            </Link>
            <Link to="/messenger" title="Nhắn tin">
              <li>
                <div className="messenger-icon--container">
                  <BiLogoMessenger size={31} />
                  <b>Nhắn tin</b>
                </div>
              </li>
            </Link>
            <Link to="/group" title="Nhóm">
              <li>
                <HiMiniUserGroup />
                <b>Nhóm</b>
              </li>
            </Link>
            <Link to={"/setting"} title="Cài đặt">
              <li>
                <IoMdSettings />
                <b>Cài đặt</b>
              </li>
            </Link>
          </ul>
          <div className="navbar-side--right" ref={popupRef}>
            <div className="wallet-container">
              <button
                className="wallet-button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <i className="fa-solid fa-wallet"></i>
              </button>

              {isMenuOpen && (
                <ul className="wallet-menu">
                  {account && (
                    <>
                      <li>
                        <i className="fa-solid fa-wallet"></i>
                        {account.substring(0, 12)}...
                        {account.slice(-4)}
                      </li>
                      <li className="balance">
                        <p>Số dư:</p>
                        <strong>
                          <i className="fa-brands fa-ethereum"></i>
                          {balance || balance === 0
                            ? `${balance?.toLocaleString()} ETH`
                            : "Đang tải..."}
                          <AiOutlineReload
                            style={{ marginLeft: "5px", cursor: "pointer" }}
                            onClick={connectWallet}
                          />
                        </strong>
                      </li>
                      <li className="wallet-action" onClick={switchAccount}>
                        Đổi tài khoản
                      </li>
                    </>
                  )}
                  {!account && (
                    <li className="wallet-action" onClick={connectWallet}>
                      Kết nối ví
                    </li>
                  )}
                </ul>
              )}
            </div>
            <div className="bell-notice--icon">
              <div className="icon-notice--container" onClick={handleClick}>
                <BiSolidBellRing />
                {unseenCount > 0 && (
                  <p> {unseenCount > 9 ? "9+" : unseenCount} </p>
                )}
              </div>

              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
              >
                <ul className="box-notice">
                  <div className="box-notice--header">
                    <h3 lang="vi">Thông báo</h3>
                    {listNotifications.length > 0 && (
                      <p
                        className="delete-all"
                        onClick={() => handleDeleteAllNotice()}
                      >
                        Xóa tất cả
                      </p>
                    )}
                  </div>
                  <div className="box-notice--body">
                    <ul className="list-notice">
                      {listNotifications.length > 0 ? (
                        listNotifications?.map((item, index) => (
                          <NoticeItem
                            key={index}
                            data={item}
                            handleDeleteNotice={handleDeleteNotice}
                          />
                        ))
                      ) : (
                        <h4 className="box-center">Không có thông báo nào.</h4>
                      )}
                    </ul>
                  </div>
                </ul>
              </Popover>
            </div>

            <div className="personal-icon">
              <img
                className="avt-navbar"
                src={dataOwner && dataOwner?.avatar}
                alt=""
                onError={(e) => {
                  e.target.src =
                    "https://tenten.vn/tin-tuc/wp-content/uploads/2022/06/loi-http-error-4.png";
                }}
              />
              <div className="box-personal">
                <ul className="list-personal--options">
                  <li className="personal-direct--profile">
                    <Link to={`/profile/${dataOwner && dataOwner?.user_id}`}>
                      <img
                        onError={(e) => {
                          e.target.src =
                            "https://tenten.vn/tin-tuc/wp-content/uploads/2022/06/loi-http-error-4.png";
                        }}
                        className="avt-direct--profile"
                        src={dataOwner && dataOwner?.avatar}
                        alt=""
                      />
                      <span>
                        <h4>{dataOwner && dataOwner?.user_name}</h4>
                        <p>Nhấn để vào trang cá nhân</p>
                      </span>
                    </Link>
                  </li>

                  <li
                    className="dark-mode--setting"
                    onClick={() => {
                      setDarkOn(!darkOn);
                    }}
                  >
                    <span>
                      <MdDarkMode />
                      <p>Chế độ tối</p>
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
                        <p>Cài đặt và Nhận diện</p>
                      </span>
                      <FaChevronRight />
                    </Link>
                  </li>
                  <li
                    className="function-direct logout"
                    onClick={() => logoutHandle()}
                  >
                    <div className="list">
                      <span>
                        <MdLogout />
                        <p>Đăng xuất</p>
                      </span>
                      <FaChevronRight />
                    </div>
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
