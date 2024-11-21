import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BsEmojiLaughingFill } from "react-icons/bs";
import { IoIosCloseCircle } from "react-icons/io";
import "./post_edit.scss";
import TextEditor from "../../../ultils/textEditor/react_draft_wysiwyg";
import NavigativeBar from "../../../layout/NavigativeBar/navigative_bar";
import { getData, postData } from "../../../ultils/fetchAPI/fetch_API";
import { API_POST_DETAIL, API_UPDATE_POST } from "../../../API/api_server";

// Import FilePond and necessary plugins
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import FilePondPluginFileEncode from "filepond-plugin-file-encode";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import {
  dataURLtoBlob,
  urlToBlob,
} from "../../../ultils/dataURLtoBLOB/dataURL_to_BLOB";
import { toast } from "react-toastify";
import { LoadingIcon } from "../../../ultils/icons/loading";

// Register plugins
registerPlugin(
  FilePondPluginFileEncode,
  FilePondPluginFileValidateSize,
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview
);

export default function EditPost({ titlePage }) {
  useEffect(() => {
    document.title = titlePage;
  }, [titlePage]);
  const fileOld = useRef();

  const navigate = useNavigate();
  const { post_id } = useParams();
  const [showEmotion, setShowEmotion] = useState(false);
  const [content, setContent] = useState("");
  const [emotion, setEmotion] = useState("");
  const [privacy, setPrivacy] = useState("global");
  const [data, setData] = useState();
  const [media, setMedia] = useState([]); // To store selected media
  const [isMediaChanged, setIsMediaChanged] = useState(false); // To track media changes
  const [loading, setLoading] = useState(false); // Loading state
  // Cập nhật lại media ban đầu
  const fetchPostData = async () => {
    try {
      const response = await getData(API_POST_DETAIL(post_id));
      if (response?.status) {
        setData(response?.data);
        if (response?.data?.react_emoji) {
          setShowEmotion(true);
          setEmotion(response?.data?.react_emoji);
        }
        setPrivacy(response?.data?.post_privacy);
        setContent(response?.data?.post_text);

        // Chuyển đổi các media cũ thành định dạng mà FilePond yêu cầu
        const mediaFiles = response?.data?.media?.map((item) => ({
          source: item?.media_link, // Liên kết tới media
        }));

        fileOld.current = mediaFiles;
        setMedia(mediaFiles); // Cập nhật media cho FilePond
        setIsMediaChanged(false); // Đặt lại isMediaChanged là false vì chưa có thay đổi
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!post_id) return;
    fetchPostData();
  }, [post_id]);

  const toggleEmotion = () => setShowEmotion(!showEmotion);
  const handleContentChange = (newContent) => {
    setContent(newContent); // Lưu HTML vào state
  };

  useEffect(() => {
    if (showEmotion) {
      setEmotion("vui vẻ &#128515;"); // Reset emotion when showEmotion is false
    } else {
      setEmotion(); // Reset emotion when showEmotion is true
    }
  }, [showEmotion]);

  // Handle media changes
  const handleMediaChange = (files) => {
    // Compare new media to old media
    const hasMediaChanged =
      files.length !== fileOld.current.length ||
      files.some(
        (file, index) => file.source !== fileOld.current[index]?.source
      );

    setIsMediaChanged(hasMediaChanged); // Set isMediaChanged based on comparison
    setMedia(files); // Update media with new files
  };

  const handleSave = async () => {
    setLoading(true); // Show loading spinner

    try {
      // Form data to be sent
      const formData = new FormData();
      formData.append("post_id", post_id);
      if (content?.html !== "<p></p>")
        formData.append("post_text", content?.html);
      formData.append("post_privacy", privacy);
      emotion && formData.append("react_emoji", emotion);
      formData.append("is_media_changed", isMediaChanged);

      // Nếu media đã thay đổi, gửi các file đã chọn
      if (isMediaChanged) {
        for (const file of media) {
          const actualFile = file.file || file; // Nếu file có trường 'file', sử dụng nó; nếu không thì sử dụng chính 'file'

          // Kiểm tra xem file là ảnh hay video
          if (actualFile && actualFile.type.startsWith("image")) {
            formData.append("files", actualFile, actualFile.name); // Gửi ảnh
          } else if (actualFile && actualFile.type.startsWith("video")) {
            formData.append("files", actualFile, actualFile.name); // Gửi video
          } else {
            toast.error("File không hợp lệ:", actualFile.type);
          }
        }
      }

      // Make API call to update the post
      const response = await postData(API_UPDATE_POST(data?.post_id), formData);

      if (response.status) {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật bài viết:", error);
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  return (
    <React.Fragment>
      <NavigativeBar />
      <div className="edit-post-container">
        <div className="close" onClick={() => navigate(-1)}>
          <IoIosCloseCircle />
        </div>
        <h2 className="title">Chỉnh sửa bài đăng</h2>
        <div className="form-post-wrapper">
          <div className="privacy-main">
            <div className="avatar">
              <img src={data?.avatar} alt="avatar" />
            </div>
            <div className="privacy-container">
              <p className="name">
                <b>{data?.user_name}</b>
                {showEmotion && (
                  <>
                    đang cảm thấy{" "}
                    <select
                      name="emotion"
                      id="emotion-select"
                      value={emotion} // Đảm bảo sử dụng giá trị mặc định nếu emotion chưa được thiết lập
                      onChange={(e) => setEmotion(e.target.value)}
                    >
                      <option value="vui vẻ &#128515;">&#128515; Vui vẻ</option>
                      <option value="tức cười &#128518;">
                        &#128518; Tức cười
                      </option>
                      <option value="tức giận &#128544;">
                        &#128544; Tức giận
                      </option>
                      <option value="háo hức &#128513;">
                        &#128513; Háo hức
                      </option>
                      <option value="phê pha &#129396;">
                        &#129396; Phê pha
                      </option>
                      <option value="cảm ơn &#128515;">&#128515; Cảm ơn</option>
                      <option value="tự hào &#128526;">&#128526; Tự hào</option>
                      <option value="quyết tâm &#128170;">
                        &#128170; Quyết tâm
                      </option>
                      <option value="toại nguyện &#128516;">
                        &#128516; Toại nguyện
                      </option>
                      <option value="buồn bã &#128532;">
                        &#128532; Buồn bã
                      </option>
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
                      <option value="lo lắng &#128542;">
                        &#128542; Lo lắng
                      </option>
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
                      <option value="đối mặt &#128567;">
                        &#128567; Đối mặt
                      </option>
                    </select>{" "}
                    với khoảng khắc này:
                  </>
                )}
              </p>
              <select
                name="privacy"
                id="privacy-select"
                value={privacy}
                onChange={(e) => setPrivacy(e.target.value)}
              >
                <option value={1}>&#x1F30D; Mọi người</option>
                <option value={0}>&#x1F512; Chỉ mình tôi</option>
              </select>
            </div>
          </div>
          {!showEmotion && (
            <div
              className="func btn-create--react handle"
              onClick={toggleEmotion}
            >
              <BsEmojiLaughingFill /> Thêm bày tỏ cảm xúc
            </div>
          )}
          <div className="editor-wrapper">
            <TextEditor
              initialContent={content}
              getText={handleContentChange}
            />
          </div>

          {/* FilePond Media Upload */}
          <FilePond
            files={media} // Truyền danh sách file media vào
            allowMultiple={true} // Cho phép chọn nhiều file
            onupdatefiles={handleMediaChange} // Cập nhật danh sách files khi người dùng thay đổi
            labelIdle="Kéo & Thả tập tin hoặc Duyệt"
            allowImagePreview={true} // Cho phép xem trước ảnh
          />

          {loading ? (
            <LoadingIcon />
          ) : (
            <div
              className="func btn-save-edit handle"
              onClick={() => handleSave()}
            >
              Lưu
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}
