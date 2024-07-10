import React, { useCallback, useState } from "react";
import "./comment_item.scss";
import { FaCamera, FaHeart } from "react-icons/fa6";
import { ImReply } from "react-icons/im";
import { IoSendSharp } from "react-icons/io5";
import SubCommentItem from "./SubCommentItem/sub_comment_item";
import { LiaReplySolid } from "react-icons/lia";
import PopupInfoShort from "../../../../../component/PopupInfoShort/popup_info_short";

function CommentItem() {
    const [showInputComment, setShowInputComment] = useState(false);
    const [showSubComment, setShowSubComment] = useState(false);
    const [idReply, setIdReply] = useState();
    const [textRawReply, setTextRawRepLy] = useState(`Trả lời ${"default"}: `);
    const [textReply, setTextRepLy] = useState(" ");
    const getSupplyID = useCallback((id) => {
        setIdReply(id);
        setTextRepLy(`Trả lời ${id}: `)
        setTextRawRepLy(`<a href="http://"> ${idReply} </a><p>${textReply}</p>`);
    }, [idReply, textReply])

    const handleChangeReply = (e) => {
        setTextRepLy(e);
        console.log(textRawReply);
    }
    return (
        <React.Fragment>

            <li className="container-item">
                <div className="container-item-main">
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
                                    <div className="reply" onClick={() => {setShowInputComment(!showInputComment);setShowSubComment(true)}}><ImReply /><b>Phản hồi</b></div>
                                </div>
                                <p className="time">7 giờ trước</p>
                            </div>
                            {!showSubComment && (
                                <div className="see-more--subcomment" onClick={() => {setShowInputComment(!showInputComment);setShowSubComment(true)}}><p>Xem thêm 5 phản hồi với Dasha Taran </p><LiaReplySolid /></div>
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
                        <button type="submit" ><IoSendSharp />
                        </button>
                    </div>
                )}
            </li>

        </React.Fragment>
    );
}

export default CommentItem;