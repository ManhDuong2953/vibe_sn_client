import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import "./comment_item.scss";
import { FaCamera, FaHeart } from "react-icons/fa6";
import { ImReply } from "react-icons/im";
import { IoSendSharp } from "react-icons/io5";
import SubCommentItem from "./SubCommentItem/sub_comment_item";
import { LiaReplySolid } from "react-icons/lia";
import PopupInfoShort from "../../../../../component/PopupInfoShort/popup_info_short";
import { IoMdMore } from "react-icons/io";
import { MdBugReport, MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import { OwnDataContext } from "../../../../../provider/own_data";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import { timeAgo } from "../../../../../ultils/formatDate/format_date";
import { getData, postData } from "../../../../../ultils/fetchAPI/fetch_API";
import {
  API_CREATE_SUB_COMMENT_BY_COMMENT_ID,
  API_DELETE_COMMENT_POST_BY_COMMENT_ID,
  API_GET_USER_BY_ID,
  API_HEART_COMMENT_BY_COMMENT_ID,
} from "../../../../../API/api_server";
import { LoadingIcon } from "../../../../../ultils/icons/loading";
registerPlugin(FilePondPluginImagePreview);

export default function CommentItem({ data, user_id, fetchData }) {
  const [showInputComment, setShowInputComment] = useState(false);
  const [showSubComment, setShowSubComment] = useState(false);
  const [idReply, setIdReply] = useState(null);
  const [userNameReply, setUserNameReply] = useState(null);
  const [textRawReply, setTextRawReply] = useState("Trả lời default: ");
  const [contentReply, setContentReply] = useState("");
  const [isActive, setIsActive] = useState(false);
  const dataOwner = useContext(OwnDataContext);
  const [showFilePond, setShowFilePond] = useState(false);
  const [files, setFiles] = useState([]); // Quản lý file từ FilePond
  const inputRef = useRef(null); // Tạo ref cho input
  const [loading, setLoading] = useState(false); //
  const [loadingSend, setLoadingSend] = useState(false); //
  const [sending, setSending] = useState(false);
  //Loading
  useEffect(() => {
    if (data) setLoading(true);
  }, [data]);

  // lấy id người phản hồi
  const getSupplyID = useCallback(
    async (id) => {
      setIdReply(id);
      const user = await fetchUser(id);
      setUserNameReply(user?.user_name);

      const updatedTextRawReply = `<a href="/profile/${id}">${user?.user_name}</a><p>${contentReply}</p>`;

      setTextRawReply(updatedTextRawReply); // Cập nhật đồng thời
    },
    [contentReply]
  );

  //Lấy thông tin người phản hồi
  const fetchUser = async (id_user) => {
    try {
      const response = await getData(API_GET_USER_BY_ID(id_user));
      if (response?.status) {
        return response?.data;
      } else {
        throw new Error("Không tìm thấy người dùng");
      }
    } catch (error) {
      toast.error("L��i: Không tìm thấy người dùng");
      return null;
    }
  };

  //Kiểm tra có giá trị value input k
  useEffect(() => {
    if (contentReply || files.length > 0) {
      setSending(true);
    } else {
      setSending(false);
    }
  }, [contentReply, files]);

  //Kiểm tra nhập liệu
  const handleChangeReply = (value) => {
    setContentReply(value);

    // Đồng bộ hóa nội dung raw
    setTextRawReply(
      `<a href="/profile/${idReply}">${userNameReply}</a><p>${value}</p>`
    );
  };

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  const handleFilesChange = (newFiles) => {
    setFiles(newFiles); // Update the files state
    if (newFiles.length > 0 && inputRef.current) {
      inputRef.current.focus(); // Automatically focus the input if there are files
    }
  };

  const [heartCmt, setHeartCmt] = useState(data?.comment_count_comment_heart);
  const handleHeartComment = async () => {
    try {
      const response = await postData(
        API_HEART_COMMENT_BY_COMMENT_ID(data?.comment_id)
      );

      if (response?.status) {
        setHeartCmt((prev) => prev + 1);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // console.log(data);

  // Đăng subcomment
  const handleSubmitComment = async (e) => {
    try {
      e.preventDefault();
      setLoadingSend(true);
      const formData = new FormData();
      textRawReply && formData.append("comment_text", textRawReply);
      if (files.length > 0) {
        // Thêm tệp tin nếu có
        files.forEach((file) => {
          formData.append("media_type", file.file.type);
          formData.append("file", file.file); // `file.file` là tệp tin thực tế từ FilePond
        });
      }

      // Gửi formData tới API
      const response = await postData(
        API_CREATE_SUB_COMMENT_BY_COMMENT_ID(data?.comment_id),
        formData
      );

      if (response?.status) {
        await fetchData();
      }
      // Xóa dữ liệu sau khi gửi thành công
    } catch (error) {
      console.error("Lỗi khi gửi bình luận:", error);
    } finally {
      setSending(false); // Hide loading spinner
      setLoadingSend(false);
      setContentReply("");
      setTextRawReply("");
      setFiles([]);
      setShowFilePond(false);
    }
  };

  const handleDeleteComment = async () => {
    try {
      const response = await postData(
        API_DELETE_COMMENT_POST_BY_COMMENT_ID(data?.comment_id),
        {
          post_id: data?.post_id,
        }
      );
      if (response?.status) {
        await fetchData();
      }
    } catch (error) {
      console.error("Lỗi khi xóa bình luận:", error);
    }
  };

  return (
    <React.Fragment>
      {loading && (
        <li className="container-item">
          <div className="container-item-main active">
            <div className={`action-container ${isActive ? "active" : ""}`}>
              <IoMdMore className="icon-more" onClick={handleToggle} />
              <div className="action-func">
                {(data?.commenting_user_id === dataOwner?.user_id ||
                  user_id === dataOwner?.user_id) && (
                  <div className="row" onClick={() => handleDeleteComment()}>
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
            <div className="avt-img popup">
              <PopupInfoShort user_id={data?.commenting_user_id} />
              <img src={data?.avatar} alt="" />
            </div>
            <div className="comment-content--wrapper--container">
              <div className="comment-content--wrapper">
                <div className="comment-content">
                  <p className="name">{data?.commenting_user_name}</p>
                  {data?.comment_text && (
                    <p className="comment-content--text">
                      {data?.comment_text}
                    </p>
                  )}
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
                        setShowInputComment(!showInputComment);
                        setShowSubComment(true);
                        getSupplyID(data?.commenting_user_id);
                      }}
                    >
                      <ImReply />
                      <b>Phản hồi</b>
                    </div>
                  </div>
                  <p className="time">{timeAgo(data?.created_at)}</p>
                </div>
                {!showSubComment && data?.sub_comments?.length > 0 && (
                  <div
                    className="see-more--subcomment"
                    onClick={() => {
                      setShowInputComment(!showInputComment);
                      setShowSubComment(true);
                    }}
                  >
                    <p>Xem thêm {data?.sub_comments?.length} phản hồi</p>
                    <LiaReplySolid />
                  </div>
                )}
              </div>
            </div>
          </div>
          {showSubComment && (
            <>
              {data?.sub_comments?.map((item, index) => (
                <SubCommentItem
                  post_id={data?.post_id}
                  handleGetSupplyID={getSupplyID}
                  commenting_user_id={data?.commenting_user_id}
                  user_id={user_id}
                  data={item}
                  fetchData={fetchData}
                />
              ))}
            </>
          )}
          {showInputComment && (
            <form
              className="input-container-sub-comment"
              onSubmit={(e) => handleSubmitComment(e)}
            >
              <div className="avt-img">
                <img src={dataOwner?.avatar} alt="" />
              </div>
              <div className="input-wrapper">
                {showFilePond && (
                  <FilePond
                    files={files}
                    acceptedFileTypes={["image/*", "video/*"]} // Chỉ chấp nhận ảnh và video
                    allowMultiple={false}
                    onupdatefiles={handleFilesChange}
                    labelIdle='Kéo và Thả tệp phương tiện or <span className="filepond--label-action">Duyệt</span>'
                  />
                )}
                <div className="input-control--container">
                  <input
                    type="text"
                    value={contentReply}
                    onChange={(e) => handleChangeReply(e.target.value)}
                    placeholder={"Phản hồi cho " + userNameReply}
                    autoFocus={true}
                  />
                  <div className="input-media">
                    <label
                      htmlFor="input-img"
                      onClick={() =>
                        setShowFilePond((showFilePond) => !showFilePond)
                      }
                    >
                      <FaCamera />
                    </label>
                  </div>
                </div>
              </div>
              {!loadingSend ? (
                sending && (
                  <button style={{ margin: "0" }} type="submit">
                    <IoSendSharp />
                  </button>
                )
              ) : (
                <div>
                  <LoadingIcon />
                </div>
              )}
            </form>
          )}
        </li>
      )}
    </React.Fragment>
  );
}
