import React, { useContext, useEffect, useRef, useState } from "react";
import PopupInfoShort from "../../../../component/PopupInfoShort/popup_info_short";
import { Link } from "react-router-dom";
import "./header_post.scss";
import { timeAgo } from "../../../../ultils/formatDate/format_date";
import { IoMdMore } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import { IoTrashBin } from "react-icons/io5";
import { MdBugReport } from "react-icons/md";
import { toast } from "react-toastify";
import { OwnDataContext } from "../../../../provider/own_data";
import {
  API_CHECK_ROLE_MEMBER_GROUP,
  API_DELETE_POST,
} from "../../../../API/api_server";
import { deleteData, getData } from "../../../../ultils/fetchAPI/fetch_API";
function HeaderPost({ data }) {
  const dataOwner = useContext(OwnDataContext);
  const moreActionRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (data) setLoaded(true);
  }, [data]);
  useEffect(() => {
    if (loaded) {
      const boxAction = moreActionRef.current;

      const handleClick = () => {
        if (boxAction) {
          boxAction.classList.toggle("active");
        }
      };

      if (boxAction) {
        boxAction.addEventListener("click", handleClick);
      }

      return () => {
        if (boxAction) {
          boxAction.removeEventListener("click", handleClick);
        }
      };
    }
  }, [loaded]);
  useEffect(() => {
    if (!data?.group?.group_id) return;
    const checkRole = async () => {
      const response = await getData(
        API_CHECK_ROLE_MEMBER_GROUP(data?.group?.group_id)
      );
      if (response?.status) {
        setRole(response?.data?.member_role);
      }
    };
    checkRole();
  }, [data?.group?.group_id]);

  const [role, setRole] = useState(0);
  const handleDeletePost = async () => {
    try {
      if (window.confirm("Bài viết sẽ bị xoá vĩnh viễn. Tiếp tục tác vụ?")) {
        const response = await deleteData(API_DELETE_POST(data?.post_id));
        if (response?.status) {
          window.location.reload();
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <React.Fragment>
      <div className="header-main">
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
      <div className="more-action" ref={moreActionRef}>
        <>
          <IoMdMore />
          <ul className="box-action">
            {dataOwner?.user_id === data.user_id && (
              <Link to={`/post/${data?.post_id}/edit`}>
                <li>
                  <FaEdit />
                  <p>Sửa bài viết</p>
                </li>
              </Link>
            )}
            {(dataOwner?.user_id === data.user_id || role === 1) && (
              <li onClick={() => handleDeletePost(data?.post_id)}>
                <IoTrashBin />
                <p>Xóa bài viết</p>
              </li>
            )}

            <li
              onClick={() =>
                toast.success(
                  "Cám ơn bạn đã báo cáo, chúng tôi sẽ xem xét và phản hồi sớm nhất!"
                )
              }
            >
              <MdBugReport />
              <p>Báo cáo bài viết</p>
            </li>
          </ul>
        </>
      </div>
      </div>
    </React.Fragment>
  );
}

export default HeaderPost;
