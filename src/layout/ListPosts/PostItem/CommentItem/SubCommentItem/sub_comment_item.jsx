import React, { useState } from "react";
import PopupInfoShort from "../../../../../component/PopupInfoShort/popup_info_short";
import { FaHeart } from "react-icons/fa6";
import { ImReply } from "react-icons/im";

function SubCommentItem({ handleGetSupplyID, ID }) {

    return (
        <React.Fragment>
            <div className="container-item-main sub-comment">
                <div className="avt-img">
                    <PopupInfoShort />
                    <img src="https://cdn.24h.com.vn/upload/1-2023/images/2023-01-04/Ve-dep-dien-dao-chung-sinh-cua-co-gai-sinh-nam-1999-lot-top-guong-mat-dep-nhat-the-gioi-57068584_2351143488502839_871658938696715268_n-1672812988-819-width1080height1080.jpg" alt="" />
                </div>
                <div className="comment-content--wrapper--container">
                    <div className="comment-content--wrapper">
                        <div className="comment-content">
                            <p className="name">Dasha Taran</p>
                            <p className="comment-content--text"><a href="">Dasha Taran</a>Chia sẻ</p>
                            {/* <div className="comment-content--img">
                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShQW135Us68ieCIzf0BiOVCddMygPvAcIRIg&s" alt="" />
                                </div> */}
                            <p className="quantity-heart">
                                <FaHeart /><b>12</b>
                            </p>
                        </div>
                        <div className="comment-action--reply">
                            <div className="action">
                                <div className="heart"><FaHeart /><b>Yêu thích</b></div>
                                <div className="reply" onClick={() => { handleGetSupplyID(ID)}}><ImReply /><b>Phản hồi</b></div>
                            </div>
                            <p className="time">7 giờ trước</p>
                        </div>
                    </div>

                </div>
            </div>
        </React.Fragment>
    );
}

export default SubCommentItem;