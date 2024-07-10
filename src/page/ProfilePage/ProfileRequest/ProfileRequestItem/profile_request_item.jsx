import React, { useState } from "react";
import PopupInfoShort from "../../../../component/PopupInfoShort/popup_info_short";
import AvatarWithText from "../../../../skeleton/avatarwithtext";
import "./profile_request_item.scss";
function ProfileRequestItem() {
    const [loading, setLoading] = useState(true);

    return ( 
        <React.Fragment>
             <li className="list-suggest--item request">
                                {
                                    loading ? (
                                        <>
                                            <div className="item-container">
                                                <div className="avt-suggest ">
                                                    <PopupInfoShort />
                                                    <img src="https://cdn.24h.com.vn/upload/1-2023/images/2023-01-04/Ve-dep-dien-dao-chung-sinh-cua-co-gai-sinh-nam-1999-lot-top-guong-mat-dep-nhat-the-gioi-57068584_2351143488502839_871658938696715268_n-1672812988-819-width1080height1080.jpg" alt="" />
                                                </div>
                                                <div className="name-suggest">
                                                    <b>Dasha Taran</b>
                                                    <p>53 bạn chung</p>
                                                </div>
                                            </div>
                                            <div className="btn-container">
                                                <div className="btn btn-accept">Chấp nhận</div>
                                                <div className="btn btn-refuse">Từ chối</div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="loading-skeleton">
                                            <AvatarWithText />
                                        </div>
                                    )
                                }
                            </li>
        </React.Fragment>
     );
}

export default ProfileRequestItem;