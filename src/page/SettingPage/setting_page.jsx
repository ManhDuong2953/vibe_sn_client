import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaEdit, FaEye, FaEyeSlash, FaTrash, FaUserPlus, FaSave } from 'react-icons/fa';
import './setting_page.scss';
import { FaFaceGrinWide } from 'react-icons/fa6';
import NavigativeBar from '../../layout/NavigativeBar/navigative_bar';
import BackButton from '../../component/BackButton/back_button';
import { deleteData, getData, putData } from '../../ultils/fetchAPI/fetch_API';
import { API_DELETE_FACE_RECOGNITION_BY_ID, API_GET_FACE_RECOGNITION_BY_ID, API_GET_USER_SETTING, API_UPDATE_USER_SETTING } from '../../API/api_server';

const SettingPage = ({ titlePage }) => {
    useEffect(() => {
        document.title = titlePage;
    }, [titlePage]);
    const [dataSetting, setDataSetting] = useState({});
    const [dataFace, setDataFace] = useState([]);
    const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
    const [showFaceImages, setShowFaceImages] = useState(false);
    useEffect(() => {
        const fetchDataSetting = async () => {

            const [response, responses] = await Promise.all([
                getData(API_GET_USER_SETTING),
                getData(API_GET_FACE_RECOGNITION_BY_ID)
            ]);

            setDataSetting(response?.data);
            setDataFace(responses?.data);
            setLoading(true); // Bắt đầu tải dữ liệu

        };

        fetchDataSetting();
    }, []);



    const handleDeleteFace = async () => {
        try {
            if (window.confirm("Bạn chắc chắn muốn xóa dữ liệu khuôn mặt hiện có chứ")) {
                const response = await deleteData(API_DELETE_FACE_RECOGNITION_BY_ID);
                if (response?.status) {
                    window.location.reload();
                }
            }
        } catch (error) {
            console.log(error.message);

        }
    };

    const toggleFaceImages = () => {
        setShowFaceImages(!showFaceImages);
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setDataSetting(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSaveSettings = async () => {
        try {
            const response = await putData(API_UPDATE_USER_SETTING, dataSetting, {
                'Content-Type': 'application/json',
            });
            if (response?.status) {
                window.location.reload();
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <React.Fragment>
            <NavigativeBar />

            <div className="setting-page">
                <BackButton />

                <h1>Cài đặt</h1>
                <div className="setting-container">
                    <div className="setting-option">
                        <Link to={"/profile/edit"} className="setting-link">
                            <FaEdit className="icon" />
                            Chỉnh sửa thông tin cá nhân
                        </Link>
                    </div>
                    {loading && (<>

                        <div className="setting-option face-recognition-option">
                            {dataFace?.length > 0 ? (
                                <>
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
                                            {dataFace && dataFace.map((face, index) => (
                                                <img key={index} src={face?.media_link} alt='' />
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <Link to="/face-recognition/create">
                                    <button className="btn btn-primary">
                                        <FaFaceGrinWide className="icon" />
                                        Tạo khuôn mặt
                                    </button>
                                </Link>
                            )}
                        </div>
                        <div className="setting-option">
                            <label>Quyền riêng tư mặc định cho bài viết</label>
                            <select value={dataSetting && dataSetting?.post_privacy} name="post_privacy" onChange={handleChange}>
                                <option value={1}>&#x1F310; Mọi người</option>
                                <option value={0}>&#x1F512; Chỉ mình tôi</option>
                            </select>
                        </div>
                        <div className="setting-option">
                            <label>Quyền riêng tư mặc định cho tin</label>
                            <select value={dataSetting && dataSetting?.story_privacy} name='story_privacy' onChange={handleChange}>
                                <option value={1}>&#x1F310; Mọi người</option>
                                <option value={0}>&#x1F512; Chỉ mình tôi</option>
                            </select>
                        </div>
                        <div className="setting-option">
                            <label>Chế độ chủ đề</label>
                            <select value={dataSetting && dataSetting?.dark_theme} name='dark_theme' onChange={handleChange}>
                                <option value="1">&#127769; Tối</option>
                                <option value={0}>&#127774; Sáng</option>
                            </select>
                        </div>
                      
                        <div className="setting-option">
                            <button className="btn btn-save" onClick={handleSaveSettings}>
                                <FaSave className="icon" />
                                Lưu cài đặt
                            </button>
                        </div>
                    </>)}
                </div>
            </div>
        </React.Fragment>
    );
};

export default SettingPage;
