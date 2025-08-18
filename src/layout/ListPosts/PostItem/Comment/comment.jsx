import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from "react";
import "./comment.scss";
import { FaCamera } from "react-icons/fa";
import { IoSendSharp } from "react-icons/io5";
import { FaRegComment } from "react-icons/fa6";
import { VscShare } from "react-icons/vsc";
import { FaHandHoldingHeart } from "react-icons/fa6";
import CommentItem from "./CommentItem/comment_item";
import {
  deleteData,
  getData,
  postData,
} from "../../../../ultils/fetchAPI/fetch_API";
import {
  API_CREATE_COMMENT_POST_BY_POST_ID,
  API_DELETE_REACT_BY_ID,
  API_LIST_COMMENT_POST,
  API_POST_REACT_BY_ID,
} from "../../../../API/api_server";
import { OwnDataContext } from "../../../../provider/own_data";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import { LoadingIcon } from "../../../../ultils/icons/loading";
import { toast } from "react-toastify";
registerPlugin(FilePondPluginImagePreview);

function Comment({ setShowCommentPage, data }) {
  const dataOwner = useContext(OwnDataContext);
  const [activeIcon, setActiveIcon] = useState("default");
  const [activeTitle, setActiveTitle] = useState("");
  const [sending, setSending] = useState(false);
  const [showCommentContainer, setShowCommentContainer] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [files, setFiles] = useState([]); // Quản lý file từ FilePond
  const inputRef = useRef(null); // Tạo ref cho input
  const [loading, setLoading] = useState(false);

  const [reactionCounts, setReactionCount] = useState({});
  const [totalReacts, setTotalReacts] = useState(0);
  const [listComment, setListComment] = useState([]);
  const [showFilePond, setShowFilePond] = useState(false);

  const icons = {
    default: { icon: "👍", title: "Thích" },
    heart: { icon: "😍", title: "Yêu thương" },
    smile: { icon: "😂", title: "Cười" },
    cry: { icon: "😭", title: "Khóc" },
    angry: { icon: "😡", title: "Tức giận" },
  };
  useEffect(() => {
    setShowCommentContainer(setShowCommentPage);
  }, []);
  useEffect(() => {
    if (!data || !dataOwner) return;
    data?.reacts?.forEach((element) => {
      if (element?.user_id === dataOwner?.user_id) {
        setActiveIcon(element.react);
        setActiveTitle(icons[element.react]?.title);
      }
    });
  }, [dataOwner, data]);

  // Xử lý khi click icon để tym
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

  // Tính toán số lượng cảm xúc khi nhận dữ liệu
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

  const handleFilesChange = (newFiles) => {
    setFiles(newFiles); // Update the files state
    if (newFiles.length > 0 && inputRef.current) {
      inputRef.current.focus(); // Automatically focus the input if there are files
    }
  };

  useEffect(() => {
    if (commentText || files.length > 0) {
      setSending(true);
    } else {
      setSending(false);
    }
  }, [commentText, files]);

  // lấy list comment
  const fetchData = useCallback(async () => {
    if (!data?.post_id) return;
    const response = await getData(API_LIST_COMMENT_POST(data?.post_id));
    if (response?.status) {
      setListComment(response.data);
    }
  }, [data?.post_id]);

  const handleSubmitComment = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const formData = new FormData();
      commentText && formData.append("comment_text", commentText);
      if (files.length > 0) {
        // Thêm tệp tin nếu có
        files.forEach((file) => {
          formData.append("media_type", file.file.type);
          formData.append("file", file.file); // `file.file` là tệp tin thực tế từ FilePond
        });
      }

      // Gửi formData tới API
      const response = await postData(
        API_CREATE_COMMENT_POST_BY_POST_ID(data?.post_id),
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
      setLoading(false);
      setCommentText("");
      setFiles([]);
      setShowFilePond(false);
      setShowCommentContainer(true);
    }
  };

  useEffect(() => {
    try {
      fetchData();
    } catch (error) {
      console.error(error);
    }
  }, [showCommentContainer, data?.post_id]);

  const sharePostHandle = async (text, post_id) => {
    const domain = `${window.location.protocol}//${window.location.host}`; // Lấy domain

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Bài viết được tạo trên nền tảng mạng xã hội Vibe",
          text: "Bấm vào đây để truy cập bài viết",
          url: domain + "/post/" + post_id, // Chia sẻ domain
        });
      } catch (error) {
        console.error("Lỗi khi chia sẻ:", error);
        toast.error("Chia sẻ không thành công.");
      }
    } else {
      toast.warning("Trình duyệt không hỗ trợ chia sẻ.");
    }
  };

  return (
    <React.Fragment>
      <div id="comment-main">
        <div className="analyst">
          <p className="like">
            <span>👍</span> <b>{totalReacts}</b>
          </p>
          <p
            className="comment-share"
            onClick={() => setShowCommentContainer(!showCommentContainer)}
          >
            {listComment?.length || 0} bình luận
          </p>
        </div>
        <div className="action-post--container">
          <div className="reaction-container">
            <div className="react-icon--show">
              <span>{icons[activeIcon]?.icon}</span>
              <div>{activeTitle}</div>
            </div>

            <div className="react-icon--hide">
              {Object.keys(icons).map((iconKey) => (
                <div
                  className="reaction-wrapper"
                  key={iconKey}
                  onClick={() =>
                    handleIconClick(iconKey, icons[iconKey]?.title)
                  }
                >
                  <span>{icons[iconKey]?.icon}</span>
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
            <div
              className="share-container"
              onClick={() => sharePostHandle(data?.post_text, data?.post_id)}
            >
              <VscShare />
              Chia sẻ
            </div>
          )}
        </div>
        <div className="comment-container--main">
          {showCommentContainer && (
            <>
              <p className="load-more--comment" onClick={() => fetchData()}>
                Tải thêm bình luận
              </p>
              <ul className="comment-container">
                {listComment &&
                  listComment?.map((dataComment, index) => (
                    <CommentItem
                      key={index}
                      data={dataComment}
                      user_id={data?.user_id}
                      fetchData={fetchData}
                    />
                  ))}
              </ul>
            </>
          )}
        </div>
        <form
          className="input-container"
          onSubmit={(e) => handleSubmitComment(e)}
        >
          <div className="avt-img">
            <img src={dataOwner?.avatar} alt="User Avatar" />
          </div>
          <div className="input-wrapper--post">
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
                placeholder="Viết bình luận..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <label
                htmlFor="input-img"
                onClick={() => setShowFilePond((showFilePond) => !showFilePond)}
              >
                <FaCamera />
              </label>
            </div>
          </div>
          {!loading ? (
            sending && (
              <button type="button">
                <IoSendSharp />
              </button>
            )
          ) : (
            <div style={{ margin: "0 10px 10px 0" }}>
              <LoadingIcon />
            </div>
          )}
        </form>
      </div>
    </React.Fragment>
  );
}

export default Comment;
