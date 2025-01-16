import React, { useContext, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import "./form_post.scss";
import { Link } from "react-router-dom";
import { FaImages } from "react-icons/fa";
import { BsEmojiLaughingFill } from "react-icons/bs";
import { IoIosCloseCircle } from "react-icons/io";
import { IoNewspaperSharp } from "react-icons/io5";

import TextEditor from "../../ultils/textEditor/react_draft_wysiwyg";
import { OwnDataContext } from "../../provider/own_data";
import { postData } from "../../ultils/fetchAPI/fetch_API";
import { API_CREATE_POST, API_GROUP_POST_CREATE } from "../../API/api_server";
import { LoadingIcon } from "../../ultils/icons/loading";
import { toast } from "react-toastify";

import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import FilePondPluginFileEncode from "filepond-plugin-file-encode";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
registerPlugin(
  FilePondPluginFileEncode,
  FilePondPluginFileValidateSize,
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview
);

export default function FormPost({ group_id = undefined }) {
  const [showEmotion, setShowEmotion] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [text, setText] = useState(false);  
  const [showPopup, setShowPopup] = useState(false);
  const dataOwner = useContext(OwnDataContext);
  const [privacy, setPrivacy] = useState(); // Default privacy is "global"
  const [selectedEmoji, setSelectedEmoji] = useState("vui vẻ &#128515;"); // Store selected emoji
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false); // Default
  const [isDisabled, setIsDisabled] = useState(true);
  useEffect(() => {
    if (dataOwner) setPrivacy(dataOwner?.post_privacy);
  }, [dataOwner]);

  useEffect(() => {
    const overlay = document.querySelector("#overlay");
    const popupPost = document.querySelector(".form-post--popup--container");

    if (showPopup) {
      overlay.classList.add("active");
      if (!overlay.contains(popupPost)) {
        overlay.appendChild(popupPost);
      }
    } else {
      overlay.classList.remove("active");
      if (overlay.contains(popupPost)) {
        overlay.removeChild(popupPost);
      }
      setShowEmotion(false);
      setShowImage(false);
    }

    const handleClickOutside = (event) => {
      if (popupPost && !popupPost.contains(event.target)) {
        setShowPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPopup]);

  const toggleEmotion = () => setShowEmotion(!showEmotion);
  const toggleImg = () => setShowImage(!showImage);
  const handleClosePopup = () => setShowPopup(false);
  const handleSetText = (text) => {
    setText(text);
  };

  const handleEmojiChange = (event) => {
    setSelectedEmoji(event.target.value);
  };

  const handlePrivacyChange = (event) => {
    setPrivacy(event.target.value);
  };

  const handleCreatePostGroup = async (post_id) => {
    const response = await postData(API_GROUP_POST_CREATE(group_id), {
      post_id,
    });

    return response?.status;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();

    if (
      text?.html !== "<p></p>" ||
      text?.html !== "<span></span>" ||
      text?.html !== ""
    ) {
      formData.append("post_text", text?.html);
    }

    if (showEmotion) {
      formData.append("react_emoji", selectedEmoji);
    }
    formData.append("post_privacy", group_id ? 1 : privacy);

    selectedFiles.forEach((file) => formData.append("files", file.file));

    try {
      const response = await postData(API_CREATE_POST, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response?.status) {
        if (group_id) {
          const statusPostgr = await handleCreatePostGroup(response?.post_id); // Thêm bài viết vào nhóm
          if (statusPostgr) {
            toast.success(
              "Bài viết đã đăng thành công, chờ quản trị viên xét duyệt!"
            );
          }
        }
        setShowPopup(false);
        window.location.reload();
      }
    } catch (error) {
      alert("Lỗi khi đăng bài");
      console.error("Lỗi khi gọi API tạo bài viết:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Disable button if text is empty, no files selected, and no emoji
    setIsDisabled(text.html === "<p></p>" && selectedFiles.length === 0);
  }, [text, selectedFiles, selectedEmoji]);

  const PopupContent = (
    <form
      className="form-post--popup--container"
      onSubmit={(e) => handleSubmit(e)}
    >
      <div className="close" onClick={handleClosePopup}>
        <IoIosCloseCircle />
      </div>
      <h2 className="title">Tạo bài đăng</h2>
      <div className="form-post--popup--wrapper">
        <div className="privacy-main">
          <div className="avt-img">
            <img src={dataOwner && dataOwner?.avatar} alt="avatar" />
          </div>
          <div className="privacy-container">
            <p className="name">
              <b>{dataOwner && dataOwner?.user_name} </b>
              {showEmotion && !group_id && (
                <>
                  đang cảm thấy{" "}
                  <select
                    name="react"
                    id="react-select"
                    defaultValue={"vui vẻ &#128515;"}
                    value={selectedEmoji}
                    onChange={handleEmojiChange}
                  >
                    <option value="vui vẻ &#128515;">&#128515; Vui vẻ</option>
                    <option value="tức cười &#128518;">
                      &#128518; Tức cười
                    </option>
                    <option value="tức giận &#128544;">
                      &#128544; Tức giận
                    </option>
                    <option value="háo hức &#128513;">&#128513; Háo hức</option>
                    <option value="phê pha &#129396;">&#129396; Phê pha</option>
                    <option value="cảm ơn &#128515;">&#128515; Cảm ơn</option>
                    <option value="tự hào &#128526;">&#128526; Tự hào</option>
                    <option value="quyết tâm &#128170;">
                      &#128170; Quyết tâm
                    </option>
                    <option value="toại nguyện &#128516;">
                      &#128516; Toại nguyện
                    </option>
                    <option value="buồn bã &#128532;">&#128532; Buồn bã</option>
                    <option value="sợ hãi &#128552;">&#128552; Sợ hãi</option>
                    <option value="ngạc nhiên &#128558;">
                      &#128558; Ngạc nhiên
                    </option>
                    <option value="thở phào &#128523;">
                      &#128523; Thở phào
                    </option>
                    <option value="chán nản &#128549;">
                      &#128549; Chán nản
                    </option>
                    <option value="lo lắng &#128542;">&#128542; Lo lắng</option>
                    <option value="hạnh phúc &#128512;">
                      &#128512; Hạnh phúc
                    </option>
                    <option value="bi thương &#128546;">
                      &#128546; Bi thương
                    </option>
                    <option value="tỉnh táo &#129302;">
                      &#129302; Tỉnh táo
                    </option>
                    <option value="tự tin &#128526;">&#128526; Tự tin</option>
                    <option value="hào hứng &#128519;">
                      &#128519; Hào hứng
                    </option>
                    <option value="nổi giận &#128545;">
                      &#128545; Nổi giận
                    </option>
                    <option value="thiếu tự tin &#128533;">
                      &#128533; Thiếu tự tin
                    </option>
                    <option value="an tâm &#128522;">&#128522; An tâm</option>
                    <option value="phiêu lưu &#127947;">
                      &#127947; Phiêu lưu
                    </option>
                    <option value="đối mặt &#128567;">&#128567; Đối mặt</option>
                  </select>{" "}
                  với khoảng khắc này:
                </>
              )}
            </p>
            {!group_id && (
              <select
                name="privacy"
                id="privacy-select"
                value={privacy}
                onChange={handlePrivacyChange}
              >
                <option value={1}>&#x1F30D; Mọi người</option>
                <option value={0}>&#x1F512; Chỉ mình tôi</option>
              </select>
            )}
          </div>
        </div>
        {!showImage && (
          <div className="func btn-create--img handle" onClick={toggleImg}>
            <FaImages /> Thêm ảnh
          </div>
        )}
        {!showEmotion && !group_id && (
          <div
            className="func btn-create--react handle"
            onClick={toggleEmotion}
          >
            <BsEmojiLaughingFill /> Thêm bày tỏ cảm xúc
          </div>
        )}
        <br />
        <i>
          *Ghi chú: Nhấn @ để tag bạn bè, hãy thêm hashtag để có thể lên xu
          hướng
        </i>
        <TextEditor getText={handleSetText} />
        {showImage && (
          <FilePond
            files={selectedFiles}
            onupdatefiles={setSelectedFiles}
            allowMultiple={true}
            maxFiles={10}
            name="files"
            labelIdle='Kéo và thả ảnh hoặc <span class="filepond--label-action">Chọn ảnh</span>'
            acceptedFileTypes={["image/*", "video/*"]}
          />
        )}
      </div>
      {loading ? (
        <LoadingIcon />
      ) : (
        <button disabled={isDisabled} type="submit">
          Đăng
        </button>
      )}
    </form>
  );

  return (
    <React.Fragment>
      <div className="form-post--main">
        <div className="form-post--container">
          <div className="row input-func">
            <div className="avt-img">
              <img src={dataOwner && dataOwner?.avatar} alt="avatar" />
            </div>
            <div
              onClick={() => {
                setShowPopup(true);
                setShowImage(false);
                setShowEmotion(false);
              }}
              className="btn-input"
            >
              {dataOwner && dataOwner?.user_name} ơi, bạn đang nghĩ gì thế?
            </div>
          </div>
          {!group_id && (
            <div className="row row-func">
              <Link to="/story/create">
                <div className="func btn-create--story">
                  <IoNewspaperSharp /> Đăng tin
                </div>
              </Link>
              <div
                onClick={() => {
                  setShowPopup(true);
                  setShowImage(true);
                  setShowEmotion(false);
                }}
                className="func btn-create--img"
              >
                <FaImages /> Đăng ảnh
              </div>
              <div
                onClick={() => {
                  setShowPopup(true);
                  setShowImage(false);
                  setShowEmotion(true);
                }}
                className="func btn-create--react"
              >
                <BsEmojiLaughingFill /> Bày tỏ cảm xúc
              </div>
            </div>
          )}
        </div>
      </div>
      <div id="overlay">
        {showPopup &&
          ReactDOM.createPortal(
            PopupContent,
            document.getElementById("overlay")
          )}
      </div>
    </React.Fragment>
  );
}
