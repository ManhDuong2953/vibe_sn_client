import React, { useCallback, useEffect, useState } from "react";
import "./profile_editor.scss";
import NavigativeBar from "../../../layout/NavigativeBar/navigative_bar";
import BackButton from "../../../component/BackButton/back_button";
import getCroppedImg from "../../../ultils/cropImage/get_crop_image";
import Cropper from "react-easy-crop";

function ProfileEditor({ titlePage }) {
    useEffect(() => {
        document.title = titlePage;
    }, [titlePage]);
    const [formData, setFormData] = useState({
        fullName: '',
        nickName: '',
        slogan: '',
        education: '',
        location: '',
        email: '',
        password: '',
        password_old: '',
        confirm_password: '',
    });

    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [isShowCropContainer, setIsShowCropContainer] = useState(false);
    const [avatarImage, setAvatarImage] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [croppedAvatar, setCroppedAvatar] = useState(null);
    const [croppedCover, setCroppedCover] = useState(null);

    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);


    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const generateCroppedImage = useCallback(async (image, setCroppedImage) => {
        if (image && croppedAreaPixels) {
            try {
                const croppedImage = await getCroppedImg(image, croppedAreaPixels);
                setCroppedImage(croppedImage);
                setIsShowCropContainer(false);
            } catch (e) {
                console.error(e);
            }
        }
    }, [croppedAreaPixels]);

    const handleAvatarChange = (e) => {
        setIsShowCropContainer(true);
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const imageUrl = URL.createObjectURL(file);
            setAvatarImage(imageUrl);
            setCroppedAvatar(null);
        }
    };

    const handleCoverChange = (e) => {
        setIsShowCropContainer(true);
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const imageUrl = URL.createObjectURL(file);
            setCoverImage(imageUrl);
            setCroppedCover(null);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSave = () => {
        if (!formData.email || !formData.password_old || !formData.password || !formData.confirm_password) {
            setShowVerificationModal(true);
            return;
        }

        // Xử lý lưu thông tin cá nhân sau khi nhập mã xác thực
    };

    const closeVerificationModal = () => {
        setShowVerificationModal(false);
    };

    return (
        <React.Fragment>
            <NavigativeBar />
            <div className="personal-info-editor">
                <BackButton />
                <form>
                    <div className="side-left">

                        <h2 className="form-title form-group full-width">Chỉnh sửa thông tin cá nhân</h2>
                        <div className="form-group full-width">
                            <label htmlFor="fullName ">Họ và tên:</label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="nickName">Biệt danh:</label>
                            <input
                                type="text"
                                id="nickName"
                                name="nickName"
                                value={formData.nickName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="slogan">Giới thiệu:</label>
                            <input
                                type="text"
                                id="slogan"
                                name="slogan"
                                value={formData.slogan}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="education">Từng học tại:</label>
                            <input
                                type="text"
                                id="education"
                                name="education"
                                value={formData.education}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="location">Đang sống:</label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group full-width">
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group full-width">
                            <label htmlFor="password_old">Mật khẩu cũ:</label>
                            <input
                                type="password"
                                id="password_old"
                                name="password_old"
                                value={formData.password_old}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Mật khẩu mới:</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirm_password">Nhắc lại mật khẩu:</label>
                            <input
                                type="password"
                                id="confirm_password"
                                name="confirm_password"
                                value={formData.confirm_password}
                                onChange={handleChange}
                            />
                        </div>

                    </div>
                    <div className="side-left">
                        <div className="form-group full-width">
                            <label htmlFor="avatar">
                                Ảnh đại diện: <br />
                                <img src={croppedAvatar ?? "https://t4.ftcdn.net/jpg/02/17/88/73/360_F_217887350_mDfLv2ootQNeffWXT57VQr8OX7IvZKvB.jpg"} className="preview avt" alt=""/>
                            </label>
                            <input id="avatar" type="file" hidden accept="image/*" onChange={handleAvatarChange} />
                        </div>
                        <div className="form-group full-width">
                            <label htmlFor="cover">
                                Ảnh bìa: <br />
                                <img src={croppedCover ?? "https://www.allwebtuts.com/wp-content/uploads/2017/01/awts-ghimg3.jpg"} className="preview cover" alt=""/>
                            </label>
                            <input id="cover" type="file" hidden accept="image/*" onChange={handleCoverChange} />
                        </div>
                    </div>
                    <div className="form-group full-width">
                        <button type="button" onClick={handleSave}>Lưu</button>
                    </div>
                </form>

                {showVerificationModal && (
                    <div className="verification-modal">
                        <div className="modal-content">
                            <button className="close-button" onClick={closeVerificationModal}>&times;</button>
                            <h3>Nhập mã xác thực</h3>
                            <input
                                type="text"
                                placeholder="Nhập mã xác thực..."
                            />
                            <button>Xác nhận</button>
                        </div>
                    </div>
                )}
                  {(isShowCropContainer) && (
                    <div className="crop-img-container">
                        {avatarImage && !croppedAvatar && (

                            <div className="crop-container">
                                <Cropper
                                    image={avatarImage}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1}
                                    onCropChange={setCrop}
                                    onZoomChange={setZoom}
                                    onCropComplete={onCropComplete}
                                />
                                <button
                                    type="button"
                                    className="btn-func crop"
                                    onClick={() => generateCroppedImage(avatarImage, setCroppedAvatar)}
                                >
                                    Cắt ảnh đại diện
                                </button>
                            </div>
                        )}
                        {coverImage && !croppedCover && (
                            <div className="crop-container">
                                <Cropper
                                    image={coverImage}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={2.5}
                                    onCropChange={setCrop}
                                    onZoomChange={setZoom}
                                    onCropComplete={onCropComplete}
                                />
                                <button
                                    type="button"
                                    className="btn-func crop"
                                    onClick={() => generateCroppedImage(coverImage, setCroppedCover)}
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
