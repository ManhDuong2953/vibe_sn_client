import React, { useState, useCallback, useRef, useEffect } from "react";
import "./create_group.scss"
import { FaCropSimple } from "react-icons/fa6";
import getCroppedImg from "../../../ultils/cropImage/get_crop_image";
import NavigativeBar from "../../../layout/NavigativeBar/navigative_bar";
import Cropper from "react-easy-crop";
import BackButton from "../../../component/BackButton/back_button";

function CreateGroupPage({ titlePage }) {
    const [isShowCropContainer, setIsShowCropContainer] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [privacy, setPrivacy] = useState("public");
    const [introduction, setIntroduction] = useState("");

    const [avatarImage, setAvatarImage] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [croppedAvatar, setCroppedAvatar] = useState(null);
    const [croppedCover, setCroppedCover] = useState(null);

    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    useEffect(() => {
        document.title = titlePage;
    }, [titlePage]);

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

    return (
        <React.Fragment>
            <NavigativeBar />
            <div className="create-group-page">
                <BackButton />
                <form>
                    <h1>Tạo nhóm</h1>
                    <div className="side-container">
                        <div className="side-left">
                            <div className="form-group">
                                <label htmlFor="groupName">Tên nhóm:</label>
                                <input
                                    type="text"
                                    id="groupName"
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="privacy">Quyền riêng tư:</label>
                                <select
                                    id="privacy"
                                    value={privacy}
                                    onChange={(e) => setPrivacy(e.target.value)}
                                >
                                    <option value="public">Công khai</option>
                                    <option value="private">Riêng tư</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="introduction">Giới thiệu nhóm:</label>
                                <textarea
                                    id="introduction"
                                    value={introduction}
                                    onChange={(e) => setIntroduction(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="side-right">
                            <div className="form-group">
                                <label htmlFor="avatar">
                                    <h3>Ảnh đại diện nhóm:</h3>
                                    <img src={croppedAvatar ?? "https://t4.ftcdn.net/jpg/02/17/88/73/360_F_217887350_mDfLv2ootQNeffWXT57VQr8OX7IvZKvB.jpg"} alt="Cropped Avatar" className="cropped-image avatar" />
                                </label>
                                <input id="avatar" type="file" hidden accept="image/*" onChange={handleAvatarChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="cover">
                                    <h3>Ảnh bìa nhóm:</h3>
                                    <img src={croppedCover ?? "https://www.allwebtuts.com/wp-content/uploads/2017/01/awts-ghimg3.jpg"} alt="Cropped Cover" className="cropped-image cover" />
                                </label>
                                <input id="cover" type="file" hidden accept="image/*" onChange={handleCoverChange} />
                            </div>
                        </div>
                    </div>
                    <button type="submit">Tạo nhóm</button>
                </form>
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
};

export default CreateGroupPage;