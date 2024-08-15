import React, { useCallback, useEffect, useState } from "react";
import "./profile_editor.scss";
import NavigativeBar from "../../../layout/NavigativeBar/navigative_bar";
import BackButton from "../../../component/BackButton/back_button";
import getCroppedImg from "../../../ultils/cropImage/get_crop_image";
import Cropper from "react-easy-crop";
import tempAvt from "../../../www/imgavtupload.jpg";
import tempCover from "../../../www/imgcoverupload.jpg";
import { Link, useParams } from "react-router-dom";
import { API_GET_INFO_USER_PROFILE_BY_ID, API_UPDATE_USER } from "../../../API/api_server";
import { getData, putData } from "../../../ultils/fetchAPI/fetch_API";

function ProfileEditor({ titlePage }) {
    useEffect(() => {
        document.title = titlePage;
    }, [titlePage]);

    const [formData, setFormData] = useState({
        user_name: '',
        user_nickname: '',
        user_email: '',
        avatar: '',
        date_of_birth: '',
        cover: '',
        slogan: '',
        education: '',
        location: ''
    });

    const [loading, setLoading] = useState(false);
    const [isShowCropContainer, setIsShowCropContainer] = useState(false);
    const [imageToCrop, setImageToCrop] = useState(null);
    const [croppedImages, setCroppedImages] = useState({ avatar: null, cover: null });
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const { user_id } = useParams();
    console.log(croppedAreaPixels);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getData(API_GET_INFO_USER_PROFILE_BY_ID(user_id));
                if (response?.status) {
                    const userData = response.data;
                    setFormData(userData);
                    if (userData?.avatar) setImageToCrop(userData.avatar);
                    if (userData?.cover) setImageToCrop(userData.cover);
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        fetchData();
    }, [user_id]);

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const generateCroppedImage = useCallback(async (image, fieldName) => {
        if (image && croppedAreaPixels) {
            try {
                const croppedImage = await getCroppedImg(image, croppedAreaPixels);
                setCroppedImages(prevState => ({ ...prevState, [fieldName]: croppedImage }));
                setIsShowCropContainer(false);
            } catch (e) {
                console.error("Error generating cropped image:", e);
            }
        }
    }, [croppedAreaPixels]);

    const handleImageChange = (e, fieldName) => {
        setIsShowCropContainer(true);
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const imageUrl = URL.createObjectURL(file);
            setFormData(formData => ({
                ...formData,
                [fieldName]: imageUrl
            }));
            setImageToCrop(imageUrl);
            setCroppedImages(prevState => ({ ...prevState, [fieldName]: null }));
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

        for (const key in formData) {
            if (formData.hasOwnProperty(key)) {
                payload.append(key, formData[key]);
            }
        }

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
        } else if (formData.avatar) {
            await appendImage(formData.avatar, 'avatar');
        }

        if (croppedImages.cover) {
            await appendImage(croppedImages.cover, 'cover');
        } else if (formData.cover) {
            await appendImage(formData.cover, 'cover');
        }

        try {
            setLoading(true);
            await putData(API_UPDATE_USER(user_id), payload, {}, false);
            // Optionally notify user of success
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
                        <h2 className="form-title form-group full-width">Chỉnh sửa thông tin cá nhân</h2>
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
                            <label htmlFor="slogan">Giới thiệu:</label>
                            <input
                                type="text"
                                id="slogan"
                                name="slogan"
                                value={formData?.slogan}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="education">Từng học tại:</label>
                            <input
                                type="text"
                                id="education"
                                name="education"
                                value={formData?.education}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="location">Đang sống:</label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={formData?.location}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="gender">Giới tính:</label>
                            <select name="gender" id="gender">
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
                    </div>
                    <div className="form-group full-width">
                        <button type="button" onClick={handleSave} disabled={loading}>
                            {loading ? 'Đang lưu...' : 'Lưu'}
                        </button>
                    </div>
                </form>

                {isShowCropContainer && (
                    <div className="crop-img-container">
                        {formData.avatar && !croppedImages.avatar && (
                            <div className="crop-container">
                                <Cropper
                                    image={formData.avatar}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1} // For square crop
                                    onCropChange={setCrop}
                                    onZoomChange={setZoom}
                                    onCropComplete={onCropComplete}
                                />
                                <button
                                    type="button"
                                    className="btn-func crop"
                                    onClick={() => generateCroppedImage(formData.avatar, 'avatar')}
                                >
                                    Cắt ảnh đại diện
                                </button>
                            </div>
                        )}
                        {formData.cover && !croppedImages.cover && (
                            <div className="crop-container">
                                <Cropper
                                    image={formData.cover}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={2.5} // For rectangular crop
                                    onCropChange={setCrop}
                                    onZoomChange={setZoom}
                                    onCropComplete={onCropComplete}
                                />
                                <button
                                    type="button"
                                    className="btn-func crop"
                                    onClick={() => generateCroppedImage(formData.cover, 'cover')}
                                >
                                    Cắt ảnh bìa
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </React.Fragment>
    );
}

export default ProfileEditor;
