import React, { useCallback, useRef, useState } from "react";
import "./comment_item.scss";
import { FaCamera, FaHeart } from "react-icons/fa6";
import { ImReply } from "react-icons/im";
import { IoSendSharp } from "react-icons/io5";
import SubCommentItem from "./SubCommentItem/sub_comment_item";
import { LiaReplySolid } from "react-icons/lia";
import PopupInfoShort from "../../../../../component/PopupInfoShort/popup_info_short";
import { IoMdMore } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";

function CommentItem() {
    const [showInputComment, setShowInputComment] = useState(false);
    const [showSubComment, setShowSubComment] = useState(false);
    const [idReply, setIdReply] = useState(null);
    const [textRawReply, setTextRawReply] = useState("Trả lời default: ");
    const [textReply, setTextReply] = useState("");
    const [isActive, setIsActive] = useState(false);

    const getSupplyID = useCallback((id) => {
        setIdReply(id);
        setTextReply(`Trả lời ${id}: `);
        setTextRawReply(`<a href="http://">${id}</a><p>${textReply}</p>`);
    }, [idReply, textReply]);

    const handleChangeReply = (e) => {
        setTextReply(e);
        console.log(textRawReply);
    };

    const handleToggle = () => {
        setIsActive(!isActive);
    };

    return (
        <React.Fragment>
            <li className="container-item">
                <div className="container-item-main active">
                    <div className={`action-container ${isActive ? 'active' : ''}`}>
                        <IoMdMore className="icon-more" onClick={handleToggle} />
                        <div className="action-func">
                            <div className="row"><CiEdit />Chỉnh sửa</div>
                            <div className="row"><MdDelete />Xóa</div>
                        </div>
                    </div>
                    <div className="avt-img">
                        <PopupInfoShort />
                        <img src="https://cdn.24h.com.vn/upload/1-2023/images/2023-01-04/Ve-dep-dien-dao-chung-sinh-cua-co-gai-sinh-nam-1999-lot-top-guong-mat-dep-nhat-the-gioi-57068584_2351143488502839_871658938696715268_n-1672812988-819-width1080height1080.jpg" alt="" />
                    </div>
                    <div className="comment-content--wrapper--container">
                        <div className="comment-content--wrapper">
                            <div className="comment-content">
                                <p className="name">Dasha Taran</p>
                                <p className="comment-content--text">Chia sẻ hữu ích, tuyệt vời!</p>
                                <div className="comment-content--img">
                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShQW135Us68ieCIzf0BiOVCddMygPvAcIRIg&s" alt="" />
                                </div>
                                <p className="quantity-heart">
                                    <FaHeart /><b>12</b>
                                </p>
                            </div>
                            <div className="comment-action--reply">
                                <div className="action">
                                    <div className="heart"><FaHeart /><b>Yêu thích</b></div>
                                    <div className="reply" onClick={() => { setShowInputComment(!showInputComment); setShowSubComment(true) }}><ImReply /><b>Phản hồi</b></div>
                                </div>
                                <p className="time">7 giờ trước</p>
                            </div>
                            {!showSubComment && (
                                <div className="see-more--subcomment" onClick={() => { setShowInputComment(!showInputComment); setShowSubComment(true) }}><p>Xem thêm 5 phản hồi với Dasha Taran</p><LiaReplySolid /></div>
                            )}
                        </div>
                    </div>
                </div>
                {showSubComment && (
                    <>
                        <SubCommentItem handleGetSupplyID={getSupplyID} ID={1} />
                        <SubCommentItem handleGetSupplyID={getSupplyID} ID={2} />
                        <SubCommentItem handleGetSupplyID={getSupplyID} ID={3} />
                        <SubCommentItem handleGetSupplyID={getSupplyID} ID={4} />
                        <SubCommentItem handleGetSupplyID={getSupplyID} ID={5} />
                    </>
                )}
                {showInputComment && (
                    <div className="input-container sub-comment">
                        <div className="avt-img">
                            <img src="https://cdn.24h.com.vn/upload/1-2023/images/2023-01-04/Ve-dep-dien-dao-chung-sinh-cua-co-gai-sinh-nam-1999-lot-top-guong-mat-dep-nhat-the-gioi-57068584_2351143488502839_871658938696715268_n-1672812988-819-width1080height1080.jpg" alt="" />
                        </div>
                        <div className="input-wrapper">
                            <div className="input-control--container">
                                <input type="text" name="" id="" value={textReply} onChange={e => handleChangeReply(e.target.value)} placeholder="Viết phản hồi..." required />
                                <div className="input-media">
                                    <label htmlFor="input-img"><FaCamera /></label>
                                    <input type="file" name="" hidden id="input-img" accept="image/*" />
                                </div>
                            </div>
                        </div>
                        <button type="submit"><IoSendSharp /></button>
                    </div>
                )}
            </li>
        </React.Fragment>
    );
}

export default CommentItem;
