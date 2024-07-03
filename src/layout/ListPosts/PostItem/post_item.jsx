import React, { useState } from "react";
import "./post_item.scss";
import { Link } from "react-router-dom";
import PopupInfoShort from "../../../component/PopupInfoShort/popup_info_short";
import { FaRegHeart, FaFaceGrinBeamSweat, FaFaceGrinSquintTears, FaFaceSadTear, FaFaceSadCry, FaFaceSmileWink, FaFaceRollingEyes } from "react-icons/fa6";
import { FaAngry, FaHeart } from "react-icons/fa";
import { IoHeartDislikeOutline } from "react-icons/io5";
import { FaRegComment } from "react-icons/fa6";
import { VscShare } from "react-icons/vsc";

function PostItem() {
    const [activeIcon, setActiveIcon] = useState("default");
    const [activeTitle, setActiveTitle] = useState("");

    const handleIconClick = (icon, title) => {
        setActiveIcon(icon);
        setActiveTitle(title);
    };

    const reactionCounts = {
        heart: 10,
        sweat: 5,
        tears: 20,
        tear: 2,
        cry: 1,
        angry: 3,
        smile: 8,
        rollingeyes: 4
    };

    const icons = {
        default: <FaRegHeart title="" className="reaction-icon" />,
        heart: <FaHeart title="Yêu thương" className="reaction-icon--heart" />,
        sweat: <FaFaceGrinBeamSweat title="Cười trừ" className="reaction-icon--sweat" />,
        tears: <FaFaceGrinSquintTears title="Haha" className="reaction-icon--tears" />,
        tear: <FaFaceSadTear title="Buồn" className="reaction-icon--tear" />,
        cry: <FaFaceSadCry title="Khóc" className="reaction-icon--cry" />,
        angry: <FaAngry title="Tức giận" className="reaction-icon--angry" />,
        smile: <FaFaceSmileWink title="Nháy mắt" className="reaction-icon--smile" />,
        rollingeyes: <FaFaceRollingEyes title="Nghi ngờ" className="reaction-icon--rollingeyes" />
    };

    return (
        <React.Fragment>
            <div className="post-item--container">
                <div className="header-post--item">
                    <div className="avt-img">
                        <PopupInfoShort />
                        <img className="avt-group" src="https://media.istockphoto.com/id/1224500457/vi/anh/n%E1%BB%81n-t%E1%BA%A3ng-c%C3%B4ng-ngh%E1%BB%87-tr%E1%BB%ABu-t%C6%B0%E1%BB%A3ng-m%C3%A3-l%E1%BA%ADp-tr%C3%ACnh-c%E1%BB%A7a-nh%C3%A0-ph%C3%A1t-tri%E1%BB%83n-ph%E1%BA%A7n-m%E1%BB%81m-v%C3%A0-k%E1%BB%8Bch-b%E1%BA%A3n-m%C3%A1y-t%C3%ADnh.jpg?s=612x612&w=0&k=20&c=492Izyb2fyCZfeBOiFxUnxeoMTOH8STWSFa9NJ2WWns=" alt="" />
                        <img className="avt-member--group" src="https://cdn.24h.com.vn/upload/1-2023/images/2023-01-04/Ve-dep-dien-dao-chung-sinh-cua-co-gai-sinh-nam-1999-lot-top-guong-mat-dep-nhat-the-gioi-57068584_2351143488502839_871658938696715268_n-1672812988-819-width1080height1080.jpg" alt="" />
                    </div>
                    <div className="info-header">
                        <div className="row">
                            <Link><p className="name">Nhóm Lập trình NodeJS</p></Link>
                        </div>
                        <div className="row">
                            <Link><p className="subname">Dasha Taran</p></Link><i>•</i> <p className="time">12 phút trước</p><i>•</i> <p className="privacy" title="Mọi người">&#x1F30D;</p>
                        </div>
                    </div>
                </div>
                <div className="content-container">
                    <div className="content content-text">
                        FPOLY thì làm sao mà mấy nhà tuyển dụng từ chối nhỉ,mấy ông đại học có đủ trình làm web như mmohub.io không ????
                        Đây là sản phẩm của 1 sinh viên Poly năm 2 làm.
                    </div>
                    <div className="content content-media">
                        <div className="row-content">
                            <img src="https://cdn.vnreview.vn/589824_141218525146579_2278892467388416?wt=120be312383668ba24c56601dc577c38&rt=016b300e0ff3cc5887b0ad4173a0f888&width=1080" alt="" className="img-1" />
                        </div>
                        <div className="row-content">
                            <img src="https://cdn.vnreview.vn/589824_141218525146579_2278892467388416?wt=120be312383668ba24c56601dc577c38&rt=016b300e0ff3cc5887b0ad4173a0f888&width=1080" alt="" className="img-1" />
                            <video src="https://cdn.pixabay.com/video/2016/04/18/2849-163375551_large.mp4" controls muted></video>
                        </div>
                    </div>
                </div>
                <p className="analyst">
                    33 bình luận, 8 lượt chia sẻ
                </p>
                <div className="action-post--container">
                    <div className="reaction-container">
                        <div className="react-icon--show">
                            {icons[activeIcon]}
                            <div className={"reaction-title--"+activeIcon}>{activeTitle}</div>
                        </div>
                        <div className="react-icon--hide">
                            <div className="reaction-wrapper">
                                <IoHeartDislikeOutline title="" className="reaction-icon" onClick={() => handleIconClick("default", "")} />
                                <div className="reaction-count">0</div>
                            </div>
                            <div className="reaction-wrapper">
                                <FaHeart title="Yêu thương" className="reaction-icon--heart" onClick={() => handleIconClick("heart", "Yêu thương")} />
                                <div className="reaction-count">{reactionCounts.heart}</div>
                            </div>
                            <div className="reaction-wrapper">
                                <FaFaceGrinBeamSweat title="Cười trừ" className="reaction-icon--sweat" onClick={() => handleIconClick("sweat", "Cười trừ")} />
                                <div className="reaction-count">{reactionCounts.sweat}</div>
                            </div>
                            <div className="reaction-wrapper">
                                <FaFaceGrinSquintTears title="Haha" className="reaction-icon--tears" onClick={() => handleIconClick("tears", "Haha")} />
                                <div className="reaction-count">{reactionCounts.tears}</div>
                            </div>
                            <div className="reaction-wrapper">
                                <FaFaceSadTear title="Buồn" className="reaction-icon--tear" onClick={() => handleIconClick("tear", "Buồn")} />
                                <div className="reaction-count">{reactionCounts.tear}</div>
                            </div>
                            <div className="reaction-wrapper">
                                <FaFaceSadCry title="Khóc" className="reaction-icon--cry" onClick={() => handleIconClick("cry", "Khóc")} />
                                <div className="reaction-count">{reactionCounts.cry}</div>
                            </div>
                            <div className="reaction-wrapper">
                                <FaAngry title="Tức giận" className="reaction-icon--angry" onClick={() => handleIconClick("angry", "Tức giận")} />
                                <div className="reaction-count">{reactionCounts.angry}</div>
                            </div>
                            <div className="reaction-wrapper">
                                <FaFaceSmileWink title="Nháy mắt" className="reaction-icon--smile" onClick={() => handleIconClick("smile", "Nháy mắt")} />
                                <div className="reaction-count">{reactionCounts.smile}</div>
                            </div>
                            <div className="reaction-wrapper">
                                <FaFaceRollingEyes title="Nghi ngờ" className="reaction-icon--rollingeyes" onClick={() => handleIconClick("rollingeyes", "Nghi ngờ")} />
                                <div className="reaction-count">{reactionCounts.rollingeyes}</div>
                            </div>
                        </div>
                    </div>
                    <div className="comment-container"><FaRegComment />Bình luận</div>
                    <div className="share-container"><VscShare />Lưu</div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default PostItem;
