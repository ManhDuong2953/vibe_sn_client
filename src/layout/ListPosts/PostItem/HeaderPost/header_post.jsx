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
          {data?.group?.group_id ? (
            <>
              <img
                className="avt-group"
                src={data?.group?.avatar_media_link}
                alt=""
              />
              <img className="avt-member--group" src={data?.avatar} alt="" />
            </>
          ) : (
            <img
              className="avt-member--group avt-user"
              src={data?.avatar}
              alt=""
            />
          )}
        </div>
        <div className="info-header">
          <div className="row">
            {data?.group?.group_id ? (
              <Link to={"/group/" + data?.group?.group_id}>
                <p className="name">{data?.group?.group_name}</p>
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
            {data?.group?.group_id && (
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
