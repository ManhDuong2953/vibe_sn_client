import React, { useState, useEffect, useContext } from "react";
import "./comment.scss";
import {
  FaRegHeart,
  FaFaceGrinBeamSweat,
  FaFaceGrinSquintTears,
  FaFaceSadTear,
  FaFaceSadCry,
  FaFaceSmileWink,
  FaFaceRollingEyes,
} from "react-icons/fa6";
import { FaAngry, FaHeart, FaCamera } from "react-icons/fa";
import { IoSendSharp } from "react-icons/io5";
import { FaRegComment } from "react-icons/fa6";
import { VscShare } from "react-icons/vsc";
import { FaHandHoldingHeart } from "react-icons/fa6";
import CommentItem from "./CommentItem/comment_item";
import { deleteData, postData } from "../../../../ultils/fetchAPI/fetch_API";
import {
  API_DELETE_REACT_BY_ID,
  API_POST_REACT_BY_ID,
} from "../../../../API/api_server";
import { OwnDataContext } from "../../../../provider/own_data";

function Comment({ setShowCommentPage, data }) {
  const dataOwner = useContext(OwnDataContext);
  const [activeIcon, setActiveIcon] = useState("default");
  const [activeTitle, setActiveTitle] = useState("");
  const [showCommentContainer, setShowCommentContainer] = useState(
    setShowCommentPage ?? false
  );
  const [commentText, setCommentText] = useState("");
  const [mediaPreview, setMediaPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setMediaPreview({
        url: fileURL,
        type: file.type.startsWith("image") ? "image" : "video",
      });
    } else {
      setMediaPreview(null);
    }
  };

  const icons = {
    default: <FaRegHeart title="" className="reaction-icon" />,
    heart: <FaHeart title="Yêu thương" className="reaction-icon--heart" />,
    sweat: (
      <FaFaceGrinBeamSweat title="Cười trừ" className="reaction-icon--sweat" />
    ),
    tears: (
      <FaFaceGrinSquintTears title="Haha" className="reaction-icon--tears" />
    ),
    tear: <FaFaceSadTear title="Buồn" className="reaction-icon--tear" />,
    cry: <FaFaceSadCry title="Khóc" className="reaction-icon--cry" />,
    angry: <FaAngry title="Tức giận" className="reaction-icon--angry" />,
    smile: (
      <FaFaceSmileWink title="Nháy mắt" className="reaction-icon--smile" />
    ),
    rollingeyes: (
      <FaFaceRollingEyes
        title="Nghi ngờ"
        className="reaction-icon--rollingeyes"
      />
    ),
  };

  const [reactionCounts, setReactionCount] = useState({});
  const [totalReacts, setTotalReacts] = useState(0);

  useEffect(() => {
    if (!data || !dataOwner) return;
    data?.reacts?.forEach((element) => {
      if (element?.user_id === dataOwner?.user_id) {
        setActiveIcon(element.react);
      }
    });
  }, [dataOwner]);

  // Xử lý khi click icon
  const handleIconClick = async (icon, title) => {
    try {
      // Nếu icon hiện tại không phải "default", xóa react trước đó
      if (activeIcon !== "default") {
        await deleteData(API_DELETE_REACT_BY_ID(data?.post_id));

        // Giảm số lượng của react cũ
        setReactionCount((prev) => ({
          ...prev,
          [activeIcon]: Math.max((prev[activeIcon] || 1) - 1, 0),
        }));

        // Giảm tổng react
        setTotalReacts((prev) => Math.max(prev - 1, 0));
      }

      // Nếu icon mới không phải "default", thêm react mới
      if (icon !== "default") {
        await postData(API_POST_REACT_BY_ID(data?.post_id), { react: icon });

        // Tăng số lượng của react mới
        setReactionCount((prev) => ({
          ...prev,
          [icon]: (prev[icon] || 0) + 1,
        }));

        // Tăng tổng react
        setTotalReacts((prev) => prev + 1);
      }

      // Cập nhật trạng thái icon và tiêu đề
      setActiveIcon(icon);
      setActiveTitle(title);
    } catch (error) {
      console.error(error);
    }
  };

  // Tính toán số lượng phản ứng khi nhận dữ liệu
  useEffect(() => {
    if (data?.reacts) {
      const counts = data.reacts.reduce((acc, react) => {
        acc[react.react] = (acc[react.react] || 0) + 1;
        return acc;
      }, {});

      setReactionCount(counts);

      // Tính tổng số lượng react
      const total = Object.values(counts).reduce(
        (sum, count) => sum + count,
        0
      );
      setTotalReacts(total);
    }
  }, [data]);

  const handleSubmitComment = async () => {
    if (!commentText && !mediaPreview) {
      alert("Bạn chưa nhập nội dung hoặc thêm file.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("commentText", commentText);
      if (mediaPreview) {
        const response = await fetch(mediaPreview.url);
        const blob = await response.blob();
        formData.append("media", new File([blob], "file", { type: blob.type }));
      }

      // Gửi formData tới API
      await postData("/api/comment", formData);
      alert("Bình luận đã được gửi!");

      // Xóa dữ liệu sau khi gửi thành công
      setCommentText("");
      setMediaPreview(null);
    } catch (error) {
      console.error("Lỗi khi gửi bình luận:", error);
    }
  };

  return (
    <React.Fragment>
      <div className="analyst">
        <p className="like">
          <FaHandHoldingHeart /> <b>{totalReacts}</b>
        </p>
        <p
          className="comment-share"
          onClick={() => setShowCommentContainer(!showCommentContainer)}
        >
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
            {Object.keys(icons).map((iconKey) => (
              <div className="reaction-wrapper" key={iconKey}>
                {React.cloneElement(icons[iconKey], {
                  onClick: () =>
                    handleIconClick(iconKey, icons[iconKey]?.props?.title),
                })}
                <div className="reaction-count">
                  {reactionCounts[iconKey] || 0}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div
          className="comment-container"
          onClick={() => setShowCommentContainer(!showCommentContainer)}
        >
          <FaRegComment />
          Bình luận
        </div>
        {dataOwner?.user_id !== data?.user_id && (
          <div className="share-container">
            <VscShare />
            Lưu
          </div>
        )}
      </div>
      {showCommentContainer && (
        <div className="comment-container--main">
          <p className="load-more--comment">Tải thêm bình luận</p>
          <ul className="comment-container">
            
            <CommentItem />
          </ul>
          <div className="input-container">
            <div className="avt-img">
              <img
                src={dataOwner?.avatar}
                alt="User Avatar"
              />
            </div>
            <div className="input-wrapper--post">
              {mediaPreview && (
                <div className="media-preview">
                  {mediaPreview.type === "image" ? (
                    <img src={mediaPreview.url} alt="Preview" />
                  ) : (
                    <video controls>
                      <source src={mediaPreview.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                  <button
                    className="remove-media"
                    onClick={() => setMediaPreview(null)}
                    title="Xóa file"
                  >
                    X
                  </button>
                </div>
              )}
              <div className="input-control--container">
                <input
                  type="text"
                  placeholder="Viết bình luận..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <div className="input-media">
                  <label htmlFor="input-img">
                    <FaCamera />
                  </label>
                  <input
                    type="file"
                    id="input-img"
                    hidden
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </div>
            <button type="button" onClick={handleSubmitComment}>
              <IoSendSharp />
            </button>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

export default Comment;
