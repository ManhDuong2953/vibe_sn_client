import React, { useContext, useState } from "react";
import { FaHeart } from "react-icons/fa6";
import { ImReply } from "react-icons/im";
import PopupInfoShort from "../../../../../../component/PopupInfoShort/popup_info_short";
import { IoMdMore } from "react-icons/io";
import { MdBugReport, MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import { timeAgo } from "../../../../../../ultils/formatDate/format_date";
import { postData } from "../../../../../../ultils/fetchAPI/fetch_API";
import { API_DELETE_SUB_COMMENT_POST_BY_SUB_COMMENT_ID, API_HEART_SUB_COMMENT_BY_COMMENT_ID } from "../../../../../../API/api_server";
import { OwnDataContext } from "../../../../../../provider/own_data";

function SubCommentItem({
  handleGetSupplyID,
  data,
  commenting_user_id,
  user_id,
  post_id,
  fetchData
}) {
  const [isActive, setIsActive] = useState(false);
  const [heartCmt, setHeartCmt] = useState(data?.sub_comment_count_heart);

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  const dataOwner = useContext(OwnDataContext);

  const handleHeartComment = async () => {
    try {
      const response = await postData(
        API_HEART_SUB_COMMENT_BY_COMMENT_ID(data?.sub_comment_id)
      );

      if (response?.status) {
        setHeartCmt((prev) => prev + 1);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteComment = async()=>{
    try {
      const response = await postData(
        API_DELETE_SUB_COMMENT_POST_BY_SUB_COMMENT_ID(data?.sub_comment_id),{
          post_id
        }
      );
      if (response.status) {
        await fetchData();
      }
    } catch (error) {
      console.error("Lỗi khi xóa bình luận:", error);
    }
  }

  return (
    <React.Fragment>
      <div className="container-item-main sub-comment active">
        <div className={`action-container ${isActive ? "active" : ""}`}>
          <IoMdMore className="icon-more" onClick={handleToggle} />
          <div className="action-func">
            {(data?.replying_user_id === dataOwner?.user_id ||
              user_id === dataOwner?.user_id) && (
              <div className="row" onClick={()=>handleDeleteComment()}>
                <MdDelete />
                Xóa
              </div>
            )}
            <div
              className="row"
              onClick={() => {
                toast.success(
                  "Bình luận này đã bị xem xét do Tiêu chuẩn Cộng đồng"
                );
              }}
            >
              <MdBugReport />
              Báo cáo vi phạm
            </div>
          </div>
        </div>
        <div className="avt-img">
          <PopupInfoShort user_id={data?.replying_user_id} />
          <img src={data?.replying_user_avatar} alt="" />
        </div>
        <div className="comment-content--wrapper--container">
          <div className="comment-content--wrapper">
            <div className="comment-content">
              <p className="name">{data?.replying_user_name}</p>
              <p className="comment-content--text">
                {data?.comment_text && (
                  <p
                    style={{ display: "ruby" }}
                    dangerouslySetInnerHTML={{ __html: data?.comment_text }}
                  />
                )}
              </p>
              {data?.media_link && (
                <div className="comment-content--img">
                  {data?.media_type === "image" && (
                    <img src={data?.media_link} alt="" />
                  )}
                  {data?.media_type === "video" && (
                    <video controls loop src={data?.media_link} />
                  )}
                </div>
              )}
              <p className="quantity-heart">
                <FaHeart />
                <b>{heartCmt}</b>
              </p>
            </div>
            <div className="comment-action--reply">
              <div className="action">
                <div className="heart" onClick={() => handleHeartComment()}>
                  <FaHeart />
                  <b>Yêu thích</b>
                </div>
                <div
                  className="reply"
                  onClick={() => {
                    handleGetSupplyID(commenting_user_id);
                  }}
                >
                  <ImReply />
                  <b>Phản hồi</b>
                </div>
              </div>
              <p className="time">{timeAgo(data?.created_at)}</p>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default SubCommentItem;
