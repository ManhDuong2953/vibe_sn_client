import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaEye, FaEyeSlash, FaTrash, FaUserPlus, FaSave } from 'react-icons/fa';
import './setting_page.scss';
import { FaFaceGrinWide } from 'react-icons/fa6';
import NavigativeBar from '../../layout/NavigativeBar/navigative_bar';
import BackButton from '../../component/BackButton/back_button';

const SettingPage = ({ titlePage }) => {
    useEffect(() => {
        document.title = titlePage;
    }, [titlePage]);
    const [privacyPost, setPrivacyPost] = useState('everyone');
    const [privacyStory, setPrivacyStory] = useState('everyone');
    const [hasFaceRecognition, setHasFaceRecognition] = useState(false);
    const [showFaceImages, setShowFaceImages] = useState(false);

    const handlePrivacyPostChange = (e) => {
        setPrivacyPost(e.target.value);
    };

    const handlePrivacyStoryChange = (e) => {
        setPrivacyStory(e.target.value);
    };

    const handleDeleteFace = () => {
        setHasFaceRecognition(false);
    };

    const handleCreateFace = () => {
        setHasFaceRecognition(true);
    };

    const toggleFaceImages = () => {
        setShowFaceImages(!showFaceImages);
    };

    const handleSaveSettings = () => {
        alert('Cài đặt đã được lưu');
    };

    return (
        <React.Fragment>
            <NavigativeBar />

            <div className="setting-page">
                <BackButton />

                <h1>Cài đặt</h1>
                <div className="setting-container">
                    <div className="setting-option">
                        <Link to="/edit-profile" className="setting-link">
                            <FaEdit className="icon" />
                            Chỉnh sửa thông tin cá nhân
                        </Link>
                    </div>
                    <div className="setting-option">
                        <label>Quyền riêng tư mặc định cho bài viết</label>
                        <select value={privacyPost} onChange={handlePrivacyPostChange}>
                            <option value="everyone">&#x1F310; Mọi người</option>
                            <option value="onlyMe">&#x1F512; Chỉ mình tôi</option>
                        </select>
                    </div>
                    <div className="setting-option">
                        <label>Quyền riêng tư mặc định cho tin</label>
                        <select value={privacyStory} onChange={handlePrivacyStoryChange}>
                            <option value="everyone">&#x1F310; Mọi người</option>
                            <option value="onlyMe">&#x1F512; Chỉ mình tôi</option>
                        </select>
                    </div>
                    <div className="setting-option face-recognition-option">
                        {hasFaceRecognition ? (
                            <>
                                <button className="btn btn-primary" onClick={handleCreateFace}>
                                    <FaFaceGrinWide className="icon" />
                                    Thay đổi khuôn mặt
                                </button>
                                <button className="btn btn-danger" onClick={handleDeleteFace}>
                                    <FaTrash className="icon" />
                                    Xóa khuôn mặt
                                </button>
                                <button className="btn btn-secondary" onClick={toggleFaceImages}>
                                    {showFaceImages ? (
                                        <>
                                            <FaEyeSlash className="icon" />
                                            Ẩn danh sách khuôn mặt
                                        </>
                                    ) : (
                                        <>
                                            <FaEye className="icon" />
                                            Hiện danh sách khuôn mặt
                                        </>
                                    )}
                                </button>
                                {showFaceImages && (
                                    <div className="face-images">
                                        {Array.from({ length: 10 }).map((_, index) => (
                                            <img key={index} src={`https://cdn.24h.com.vn/upload/4-2021/images/2021-12-26/Mau-nu-dep-1-1640493153-233-width1080height1350.jpg`} alt={`Face ${index + 1}`} />
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <Link to="/face-recognition/create">
                                <button className="btn btn-primary" onClick={handleCreateFace}>
                                    <FaFaceGrinWide className="icon" />
                                    Tạo khuôn mặt
                                </button>
                            </Link>
                        )}
                    </div>
                    <div className="setting-option">
                        <button className="btn btn-save" onClick={handleSaveSettings}>
                            <FaSave className="icon" />
                            Lưu cài đặt
                        </button>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default SettingPage;
