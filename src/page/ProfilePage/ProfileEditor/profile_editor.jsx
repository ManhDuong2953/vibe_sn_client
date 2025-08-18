import React, { useCallback, useEffect, useState } from "react";
import "./profile_editor.scss";
import NavigativeBar from "../../../layout/NavigativeBar/navigative_bar";
import BackButton from "../../../component/BackButton/back_button";
import getCroppedImg from "../../../ultils/cropImage/get_crop_image";
import Cropper from "react-easy-crop";
import tempAvt from "../../../www/imgavtupload.jpg";
import tempCover from "../../../www/imgcoverupload.jpg";
import { Link, useNavigate, useParams } from "react-router-dom";
import { API_GET_INFO_OWNER_PROFILE_BY_ID, API_GET_INFO_USER_PROFILE_BY_ID, API_UPDATE_USER } from "../../../API/api_server";
import { getData, putData } from "../../../ultils/fetchAPI/fetch_API";

function ProfileEditor({ titlePage }) {
    useEffect(() => {
        document.title = titlePage;
    }, [titlePage]);

    const navigate = useNavigate();


    //đặt state cho các giá trị 
    const [formData, setFormData] = useState({
        user_name: '',
        user_nickname: '',
        user_email: '',
        user_gender: '',
        date_of_birth: '',
        user_slogan: '',
        user_school: '',
        user_address: ''
    });

    const [loading, setLoading] = useState(false);
    const [isCropVisible, setIsCropVisible] = useState(false); // trạng thái có hiện layout crop không
    const [currentImageToCrop, setCurrentImageToCrop] = useState(null); // trạng thái cho tên ảnh đang crop
    const [imageToCrop, setImageToCrop] = useState(null); // trạng thái cho link ảnh đang crop
    const [croppedImages, setCroppedImages] = useState({ avatar: null, cover: null }); // lưu link ảnh avt hoặc cover
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getData(API_GET_INFO_OWNER_PROFILE_BY_ID);
                if (response?.status) {
                    const userData = response.data;
                    setFormData(prevState => ({
                        ...prevState,
                        ...userData
                    }));
                }
            } catch (error) {
                console.error(error.message);
            }
        };
        fetchData();
    }, []);

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const generateCroppedImage = useCallback(async () => {
        if (imageToCrop && croppedAreaPixels) {
            try {
                const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels);
                setCroppedImages(prevState => ({ ...prevState, [currentImageToCrop]: croppedImage }));
                setIsCropVisible(false);
                setCurrentImageToCrop(null);
                setImageToCrop(null);
            } catch (e) {
                console.error("Error generating cropped image:", e);
            }
        }
    }, [imageToCrop, croppedAreaPixels, currentImageToCrop]);

    const cancelCrop = () => {
        setIsCropVisible(false);
        setImageToCrop(null);
        setCurrentImageToCrop(null);
    };

    const handleImageChange = (e, fieldName) => {
        setCurrentImageToCrop(fieldName);
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const imageUrl = URL.createObjectURL(file);
            setImageToCrop(imageUrl);
            setIsCropVisible(true);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSave = async () => {
        const payload = new FormData();

        // Append all other form data except images
        for (const key in formData) {
            if (formData.hasOwnProperty(key) && key !== 'avatar' && key !== 'cover') {
                payload.append(key, formData[key]);
            }
        }

        // Append cropped images to the payload
        const appendImage = async (imageUrl, fieldName) => {
            try {
                const response = await fetch(imageUrl);
                const blob = await response.blob();
                payload.append(fieldName, blob, `${fieldName}.jpg`);
            } catch (error) {
                console.error("Error appending image:", error);
            }
        };

        if (croppedImages.avatar) {
            await appendImage(croppedImages.avatar, 'avatar');
        }

        if (croppedImages.cover) {
            await appendImage(croppedImages.cover, 'cover');
        }

        try {
            setLoading(true);
            const responseUpdate = await putData(API_UPDATE_USER, payload);
            // Optionally notify user of success
            if (responseUpdate.status) {
                navigate(-1)
            }
        } catch (error) {
            console.error('Error:', error);
            // Optionally notify user of error
        } finally {
            setLoading(false);
        }
    };


    return (
        <React.Fragment>
            <NavigativeBar />
            <div className="personal-info-editor">
                <BackButton />
                <form className="form-edit" encType="multipart/form-data">
                    <div className="side-left">
                        <h2 className="form-group form-title full-width">Chỉnh sửa thông tin cá nhân</h2>
                        <div className="form-group full-width">
                            <label htmlFor="user_name">Họ và tên:</label>
                            <input
                                type="text"
                                id="user_name"
                                name="user_name"
                                value={formData?.user_name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="user_nickname">Biệt danh:</label>
                            <input
                                type="text"
                                id="user_nickname"
                                name="user_nickname"
                                value={formData?.user_nickname}
                                disabled
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="dob">Ngày sinh:</label>
                            <input
                                type="date"
                                id="dob"
                                name="date_of_birth"
                                value={formData?.date_of_birth}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group full-width">
                            <label htmlFor="user_slogan">Giới thiệu:</label>
                            <input
                                type="text"
                                id="user_slogan"
                                name="user_slogan"
                                value={formData?.user_slogan}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="user_school">Từng học tại:</label>
                            <input
                                type="text"
                                id="user_school"
                                name="user_school"
                                value={formData?.user_school}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="user_address">Đang sống:</label>
                            <input
                                type="text"
                                id="user_address"
                                name="user_address"
                                value={formData?.user_address}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="user_gender">Giới tính:</label>
                            <select
                                name="user_gender"
                                id="user_gender"
                                value={formData?.user_gender || 'other'}
                                onChange={handleChange}
                            >
                                <option value="other">Khác</option>
                                <option value="male">Nam</option>
                                <option value="female">Nữ</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="user_email">Email:</label>
                            <input
                                disabled
                                type="email"
                                id="user_email"
                                name="user_email"
                                value={formData?.user_email}
                            />
                        </div>
                        <Link to="/login/forgot-password">
                            <p className="change-pw">Đổi mật khẩu?</p>
                        </Link>
                    </div>
                    <div className="side-left">
                        <div className="form-group full-width">
                            <label htmlFor="avatar">
                                Ảnh đại diện: <br />
                                <img src={croppedImages.avatar ?? formData.avatar ?? tempAvt} className="preview avt" alt="" />
                            </label>
                            <input
                                id="avatar"
                                name="avatar"
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={(e) => handleImageChange(e, 'avatar')}
                            />
                        </div>
                        <div className="form-group full-width">
                            <label htmlFor="cover">
                                Ảnh bìa: <br />
                                <img src={croppedImages.cover ?? formData.cover ?? tempCover} className="preview cover" alt="" />
                            </label>
                            <input
                                id="cover"
                                name="cover"
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={(e) => handleImageChange(e, 'cover')}
                            />
                        </div>
                        <div className="form-group full-width">
                            <button type="button" onClick={handleSave} disabled={loading}>
                                {loading ? 'Đang lưu...' : 'Lưu'}
                            </button>
                        </div>
                    </div>
                </form>

                {isCropVisible && currentImageToCrop && (
                    <div className="crop-img-container">
                        <div className="crop-container">
                            <Cropper
                                image={imageToCrop}
                                crop={crop}
                                zoom={zoom}
                                aspect={currentImageToCrop === 'avatar' ? 1 : 2.5}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                            />
                            <div className="crop-controls">
                                <button
                                    type="button"
                                    className="btn-func crop"
                                    onClick={generateCroppedImage}
                                >
                                    Cắt ảnh {currentImageToCrop === 'avatar' ? 'đại diện' : 'bìa'}
                                </button>
                                <button
                                    type="button"
                                    className="btn-func cancel"
                                    onClick={cancelCrop}
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </React.Fragment>
    );
}

export default ProfileEditor;
