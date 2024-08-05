import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BsEmojiLaughingFill } from "react-icons/bs";
import { IoIosCloseCircle } from "react-icons/io";
import "./post_edit.scss";
import TextEditor from "../../../ultils/textEditor/react_draft_wysiwyg";
import NavigativeBar from "../../../layout/NavigativeBar/navigative_bar";



export default function EditPost({ titlePage }) {
    useEffect(() => {
        document.title = titlePage;
    }, [titlePage]);
    const navigate = useNavigate();
    const { id } = useParams();
    const [showEmotion, setShowEmotion] = useState(false);
    const [content, setContent] = useState("");
    const [emotion, setEmotion] = useState("");
    const [privacy, setPrivacy] = useState("global");

    useEffect(() => {
        fetchPostData(id);
    }, [id]);

    const fetchPostData = (id) => {
        // Simulate fetching post data
        const postData = {
            content: "Nội dung ban đầu của bài viết",
            emotion: "vui vẻ",
            privacy: "global",
        };
        setContent(postData.content);
        setEmotion(postData.emotion);
        setPrivacy(postData.privacy);
    };

    const toggleEmotion = () => setShowEmotion(!showEmotion);
    const handleContentChange = (newContent) => setContent(newContent);

    const handleSave = () => {
        const updatedPost = {
            content,
            emotion,
            privacy
        };
        console.log("Updated Post:", updatedPost);
        navigate(-1); // Navigate back
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
                            <img
                                src="https://cdn.24h.com.vn/upload/1-2023/images/2023-01-04/Ve-dep-dien-dao-chung-sinh-cua-co-gai-sinh-nam-1999-lot-top-guong-mat-dep-nhat-the-gioi-57068584_2351143488502839_871658938696715268_n-1672812988-819-width1080height1080.jpg"
                                alt="avatar"
                            />
                        </div>
                        <div className="privacy-container">
                            <p className="name">
                                <b>Dasha Taran</b>
                                {showEmotion && (
                                    <>
                                        đang cảm thấy{" "}
                                        <select
                                            name="emotion"
                                            id="emotion-select"
                                            value={emotion}
                                            onChange={(e) => setEmotion(e.target.value)}
                                        >
                                            <option value="vui vẻ">&#128515; Vui vẻ</option>
                                            <option value="tức cười">&#128518; Tức cười</option>
                                            <option value="tức giận">&#128544; Tức giận</option>
                                            <option value="háo hức">&#128513; Háo hức</option>
                                            <option value="phê pha">&#129396; Phê pha</option>
                                            <option value="cảm ơn">&#128515; Cảm ơn</option>
                                            <option value="tự hào">&#128526; Tự hào</option>
                                            <option value="quyết tâm">&#128170; Quyết tâm</option>
                                            <option value="toại nguyện">&#128516; Toại nguyện</option>
                                            <option value="buồn bã">&#128532; Buồn bã</option>
                                            <option value="sợ hãi">&#128552; Sợ hãi</option>
                                            <option value="ngạc nhiên">&#128558; Ngạc nhiên</option>
                                            <option value="thở phào">&#128523; Thở phào</option>
                                            <option value="chán nản">&#128549; Chán nản</option>
                                            <option value="lo lắng">&#128542; Lo lắng</option>
                                            <option value="hạnh phúc">&#128512; Hạnh phúc</option>
                                            <option value="bi thương">&#128546; Bi thương</option>
                                            <option value="tỉnh táo">&#129302; Tỉnh táo</option>
                                            <option value="tự tin">&#128526; Tự tin</option>
                                            <option value="hào hứng">&#128519; Hào hứng</option>
                                            <option value="nổi giận">&#128545; Nổi giận</option>
                                            <option value="thiếu tự tin">&#128533; Thiếu tự tin</option>
                                            <option value="an tâm">&#128522; An tâm</option>
                                            <option value="phiêu lưu">&#127947; Phiêu lưu</option>
                                            <option value="đối mặt">&#128567; Đối mặt</option>
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
                                <option value="global">&#x1F30D; Mọi người</option>
                                <option value="friend">&#x1F465; Bạn bè</option>
                                <option value="private">&#x1F512; Chỉ mình tôi</option>
                            </select>
                        </div>
                    </div>
                    {!showEmotion && (
                        <div className="func btn-create-emotion handle" onClick={toggleEmotion}>
                            <BsEmojiLaughingFill /> Cảm xúc
                        </div>
                    )}
                    <div className="editor-wrapper">
                        <TextEditor initialContent={content} onContentChange={handleContentChange} />
                    </div>
                    <p className="text-danger">* Ảnh, video đã đăng không thể chỉnh sửa</p>
                    <ul className="list-media">
                        <li><img src="https://vcdn1-giaitri.vnecdn.net/2023/12/31/sao4-1703997513.jpg?w=460&h=0&q=100&dpr=2&fit=crop&s=n2u9joDoWVg5V9VxyyWnrw" alt="" /></li>
                        <li><img src="https://vcdn1-giaitri.vnecdn.net/2023/12/31/sao4-1703997513.jpg?w=460&h=0&q=100&dpr=2&fit=crop&s=n2u9joDoWVg5V9VxyyWnrw" alt="" /></li>
                        <li><img src="https://vcdn1-giaitri.vnecdn.net/2023/12/31/sao4-1703997513.jpg?w=460&h=0&q=100&dpr=2&fit=crop&s=n2u9joDoWVg5V9VxyyWnrw" alt="" /></li>
                        <li>
                            <video muted autoPlay src="https://cdn.pixabay.com/video/2024/06/14/216696_large.mp4"></video>
                        </li>
                    </ul>
                    <div className="func btn-save-edit handle" onClick={handleSave}>
                        Lưu
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
