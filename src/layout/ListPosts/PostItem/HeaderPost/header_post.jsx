import React from "react";
import PopupInfoShort from "../../../../component/PopupInfoShort/popup_info_short";
import { Link } from "react-router-dom";
import "./header_post.scss";
import { timeAgo } from "../../../../ultils/formatDate/format_date";
function HeaderPost({ data }) {
  return (
    <React.Fragment>
      <div className="header-post--item">
        <div className="avt-img">
          <PopupInfoShort user_id={data?.user_id} />
          {data?.group_id && (
            <>
              <img
                className="avt-group"
                src="https://media.istockphoto.com/id/1224500457/vi/anh/n%E1%BB%81n-t%E1%BA%A3ng-c%C3%B4ng-ngh%E1%BB%87-tr%E1%BB%ABu-t%C6%B0%E1%BB%A3ng-m%C3%A3-l%E1%BA%ADp-tr%C3%ACnh-c%E1%BB%A7a-nh%C3%A0-ph%C3%A1t-tri%E1%BB%83n-ph%E1%BA%A7n-m%E1%BB%81m-v%C3%A0-k%E1%BB%8Bch-b%E1%BA%A3n-m%C3%A1y-t%C3%ADnh.jpg?s=612x612&w=0&k=20&c=492Izyb2fyCZfeBOiFxUnxeoMTOH8STWSFa9NJ2WWns="
                alt=""
              />
              <img className="avt-member--group" src={data?.avatar} alt="" />
            </>
          )}
          <img
            className="avt-member--group avt-user"
            src={data?.avatar}
            alt=""
          />
        </div>
        <div className="info-header">
          <div className="row">
            {data?.group_id ? (
              <Link to={"/group/" + data?.group_id}>
                <p className="name">Nhóm Lập trình NodeJS</p>
              </Link>
            ) : (
              <Link to={"/profile/" + data?.user_id}>
                <p className="subname">{data?.user_name}</p>
              </Link>
            )}
            {data?.react_emoji && (
              <p
                className="react"
                dangerouslySetInnerHTML={{
                  __html: `đang cảm thấy ${data?.react_emoji} trong khoảng khắc này:`,
                }}
              />
            )}
          </div>
          <div className="row">
            {data?.group_id && (
              <>
                <Link to={"/profile/" + data?.user_id}>
                  <p className="subname">{data?.user_name}</p>
                </Link>

                <i>•</i>
              </>
            )}
            <p className="time">{timeAgo(data?.created_at)}</p>
            <i>•</i>
            {data?.post_privacy === 0 ? (
              <p className="privacy" title="Chỉ mình tôi">
                &#x1F512;
              </p>
            ) : (
              <p className="privacy" title="Mọi người">
                &#x1F30D;
              </p>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default HeaderPost;
