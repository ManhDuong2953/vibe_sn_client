import React from "react";
import PopupInfoShort from "../../../../component/PopupInfoShort/popup_info_short";
import { Link } from "react-router-dom";
import "./header_post.scss";
function HeaderPost() {
    return (
        <React.Fragment>
            <div className="header-post--item">
                <div className="avt-img">
                    <PopupInfoShort />
                    {/* <img className="avt-group" src="https://media.istockphoto.com/id/1224500457/vi/anh/n%E1%BB%81n-t%E1%BA%A3ng-c%C3%B4ng-ngh%E1%BB%87-tr%E1%BB%ABu-t%C6%B0%E1%BB%A3ng-m%C3%A3-l%E1%BA%ADp-tr%C3%ACnh-c%E1%BB%A7a-nh%C3%A0-ph%C3%A1t-tri%E1%BB%83n-ph%E1%BA%A7n-m%E1%BB%81m-v%C3%A0-k%E1%BB%8Bch-b%E1%BA%A3n-m%C3%A1y-t%C3%ADnh.jpg?s=612x612&w=0&k=20&c=492Izyb2fyCZfeBOiFxUnxeoMTOH8STWSFa9NJ2WWns=" alt="" /> */}
                    {/* <img className="avt-member--group" src="https://cdn.24h.com.vn/upload/1-2023/images/2023-01-04/Ve-dep-dien-dao-chung-sinh-cua-co-gai-sinh-nam-1999-lot-top-guong-mat-dep-nhat-the-gioi-57068584_2351143488502839_871658938696715268_n-1672812988-819-width1080height1080.jpg" alt="" /> */}
                    <img className="avt-member--group avt-user" src="https://cdn.24h.com.vn/upload/1-2023/images/2023-01-04/Ve-dep-dien-dao-chung-sinh-cua-co-gai-sinh-nam-1999-lot-top-guong-mat-dep-nhat-the-gioi-57068584_2351143488502839_871658938696715268_n-1672812988-819-width1080height1080.jpg" alt="" />
                </div>
                <div className="info-header">
                    <div className="row">
                        <Link><p className="name">Nhóm Lập trình NodeJS</p> </Link>
                        <p className="react">đang cảm thấy vui vẻ trong khoảng khắc này: </p>
                    </div>
                    <div className="row">
                        <Link><p className="subname">Dasha Taran</p></Link><i>•</i> <p className="time">12 phút trước</p><i>•</i> <p className="privacy" title="Mọi người">&#x1F30D;</p>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default HeaderPost;