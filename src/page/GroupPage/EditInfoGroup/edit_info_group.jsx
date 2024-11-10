import React, { useState, useCallback, useEffect } from "react";
import "./edit_info_group.scss";
import { FaCropSimple } from "react-icons/fa6";
import getCroppedImg from "../../../ultils/cropImage/get_crop_image";
import NavigativeBar from "../../../layout/NavigativeBar/navigative_bar";
import Cropper from "react-easy-crop";
import BackButton from "../../../component/BackButton/back_button";
import tempAvt from "../../../www/imgavtupload.jpg";
import tempCover from "../../../www/imgcoverupload.jpg";
import { API_GROUP_DETAIL, API_UPDATE_GROUP } from "../../../API/api_server";
import { useNavigate, useParams } from "react-router-dom";
import { getData, postData } from "../../../ultils/fetchAPI/fetch_API";
import { LoadingIcon } from "../../../ultils/icons/loading";

function EditInfoGroupPage({ titlePage }) {
  useEffect(() => {
    document.title = titlePage;
  }, [titlePage]);
  const navigate = useNavigate();
  const { group_id } = useParams();
  const [groupName, setGroupName] = useState("");
  const [privacy, setPrivacy] = useState(0);
  const [introduction, setIntroduction] = useState("");
  const [avatarImage, setAvatarImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [croppedAvatar, setCroppedAvatar] = useState(null);
  const [croppedCover, setCroppedCover] = useState(null);
  const [isShowCropContainer, setIsShowCropContainer] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [dataGroup, setDataGroup] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDataGroup = async () => {
      if (!group_id) return;
      try {
        const response = await getData(API_GROUP_DETAIL(group_id));
        if (response?.status) {
          setDataGroup(response?.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchDataGroup();
  }, [group_id]);

  useEffect(() => {
    if (dataGroup) {
      setGroupName(dataGroup.group_name || "");
      setPrivacy(dataGroup.group_privacy || 0);
      setIntroduction(dataGroup.group_slogan || "");
      setAvatarImage(dataGroup.avatar_media_link || tempAvt);
      setCoverImage(dataGroup.cover_media_link || tempCover);
    }
  }, [dataGroup]);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const generateCroppedImage = useCallback(
    async (image, setCroppedImage) => {
      if (image && croppedAreaPixels) {
        try {
          const croppedImage = await getCroppedImg(image, croppedAreaPixels);
          setCroppedImage(croppedImage);
          setIsShowCropContainer(false);
        } catch (e) {
          console.error(e);
        }
      }
    },
    [croppedAreaPixels]
  );

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("group_name", groupName);
    formData.append("group_slogan", introduction);
    formData.append("group_privacy", privacy);

    // Kiểm tra và thêm ảnh vào formData
    if (croppedAvatar) {
      const blobAvatar = await fetch(croppedAvatar).then((r) => r.blob());
      formData.append("avatar", blobAvatar, "avatar.jpg");
    }

    if (croppedCover) {
      const blobCover = await fetch(croppedCover).then((r) => r.blob());
      formData.append("cover", blobCover, "cover.jpg");
    }

    try {
      const response = await postData(API_UPDATE_GROUP(group_id), formData);
      if (response?.status) {
        navigate(-1);
      } else {
        alert("Có lỗi xảy ra khi cập nhật thông tin nhóm.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <NavigativeBar />
      <div className="edit-group-page">
        <BackButton />
        <form onSubmit={handleSubmit}>
          <h1>Sửa thông tin nhóm</h1>
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
                  onChange={(e) => setPrivacy(Number(e.target.value))}
                >
                  <option value={1}>Công khai</option>
                  <option value={0}>Riêng tư</option>
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
                  <img
                    src={croppedAvatar ?? avatarImage}
                    alt="Cropped Avatar"
                    className="cropped-image avatar"
                  />
                </label>
                <input
                  id="avatar"
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="cover">
                  <h3>Ảnh bìa nhóm:</h3>
                  <img
                    src={croppedCover ?? coverImage}
                    alt="Cropped Cover"
                    className="cropped-image cover"
                  />
                </label>
                <input
                  id="cover"
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleCoverChange}
                />
              </div>
            </div>
          </div>
          {loading ? (
            <LoadingIcon />
          ) : (
            <button type="submit">Lưu thay đổi</button>
          )}
        </form>
        {isShowCropContainer && (
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
                  onClick={() =>
                    generateCroppedImage(avatarImage, setCroppedAvatar)
                  }
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
                  onClick={() =>
                    generateCroppedImage(coverImage, setCroppedCover)
                  }
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

export default EditInfoGroupPage;
