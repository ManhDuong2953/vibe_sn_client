import React, { useState } from "react";
import "./comment.scss";
import { FaRegHeart, FaFaceGrinBeamSweat, FaFaceGrinSquintTears, FaFaceSadTear, FaFaceSadCry, FaFaceSmileWink, FaFaceRollingEyes } from "react-icons/fa6";
import { FaAngry, FaHeart, FaCamera } from "react-icons/fa";
import { IoHeartDislikeOutline, IoSendSharp } from "react-icons/io5";
import { FaRegComment } from "react-icons/fa6";
import { VscShare } from "react-icons/vsc";
import { FaHandHoldingHeart } from "react-icons/fa6";
import { ImReply } from "react-icons/im";
import CommentItem from "./CommentItem/comment_item";
function Comment({setShowCommentPage}) {
    const [activeIcon, setActiveIcon] = useState("default");
    const [activeTitle, setActiveTitle] = useState("");
    const [showCommentContainer, setShowCommentContainer] = useState(setShowCommentPage??false);

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
        <div className="analyst">
            <p className="like">
                <FaHandHoldingHeart /> <b>129</b>
            </p>
            <p className="comment-share" onClick={() => setShowCommentContainer(!showCommentContainer)}>
                33 bình luận, 8 lượt chia sẻ
            </p>
        </div>
        <div className="action-post--container">
            <div className="reaction-container">
                <div className="react-icon--show">
                    {icons[activeIcon]}
                    <div className={"reaction-title--" + activeIcon}>{activeTitle}</div>
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
            <div className="comment-container" onClick={() => setShowCommentContainer(!showCommentContainer)}><FaRegComment />Bình luận</div>
            <div className="share-container"><VscShare />Lưu</div>
        </div>
        {showCommentContainer && (
            <div className="comment-container--main">
                <p className="load-more--comment">Tải thêm bình luận</p>
                <ul className="comment-container">
                    <CommentItem/>
                    <CommentItem />
                    <CommentItem />
                </ul>
                <div className="input-container">
                    <div className="avt-img">
                        <img src="https://cdn.24h.com.vn/upload/1-2023/images/2023-01-04/Ve-dep-dien-dao-chung-sinh-cua-co-gai-sinh-nam-1999-lot-top-guong-mat-dep-nhat-the-gioi-57068584_2351143488502839_871658938696715268_n-1672812988-819-width1080height1080.jpg" alt="" />
                    </div>
                    <div className="input-wrapper">
                        <div className="input-control--container">

                            <input type="text" name="" id="" placeholder="Viết bình luận..." required />
                            <div className="input-media">
                                <label htmlFor="input-img"><FaCamera /></label>
                                <input type="file" name="" hidden id="input-img" accept="image/*" />
                            </div>
                        </div>
                    </div>
                    <button type="submit" ><IoSendSharp />
                    </button>
                </div>
            </div>)
        }
    </React.Fragment>);
}

export default Comment;