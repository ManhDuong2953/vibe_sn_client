import React, { useState, useCallback, useRef, useEffect } from "react";
import "./create_group.scss";
import { FaCropSimple } from "react-icons/fa6";
import getCroppedImg from "../../../ultils/cropImage/get_crop_image";
import NavigativeBar from "../../../layout/NavigativeBar/navigative_bar";
import Cropper from "react-easy-crop";
import BackButton from "../../../component/BackButton/back_button";
import tempAvt from "../../../www/imgavtupload.jpg";
import tempCover from "../../../www/imgcoverupload.jpg";
import { toast } from "react-toastify";
import { postData } from "../../../ultils/fetchAPI/fetch_API";
import { API_GROUP_CREATE } from "../../../API/api_server";
import { fetchBlob } from "../../../ultils/fetchBlob/fetchBlob";
import { LoadingIcon } from "../../../ultils/icons/loading";
function CreateGroupPage({ titlePage }) {
  const [isShowCropContainer, setIsShowCropContainer] = useState(false);
  const [groupName, setGroupName] = useState(null);
  const [privacy, setPrivacy] = useState(1);
  const [introduction, setIntroduction] = useState(null);

  const [avatarImage, setAvatarImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [croppedAvatar, setCroppedAvatar] = useState(null);
  const [croppedCover, setCroppedCover] = useState(null);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    document.title = titlePage;
  }, [titlePage]);

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

  const cancelCrop = () => {
    setCroppedAvatar(null);
    setCroppedCover(null);
    setIsShowCropContainer(false);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      // TODO: Create group API call
      const payload = new FormData();
      payload.append("group_name", groupName);
      payload.append("group_slogan", introduction);
      payload.append("group_privacy", privacy);
      payload.append("avatar", await fetchBlob(avatarImage));
      payload.append("cover", await fetchBlob(coverImage));

      const response = await postData(API_GROUP_CREATE, payload);
      if (response?.status) {
        toast.success("Tạo nhóm thành công");
        window.location.href = "/group/" + response?.data?.group_id;
      }
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau");
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <NavigativeBar />
      <div className="create-group-page">
        <BackButton />
        <form onSubmit={(e) => handleSubmit(e)}>
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
                    onError={(e) => {
                      e.target.src =
                        "https://tenten.vn/tin-tuc/wp-content/uploads/2022/06/loi-http-error-4.png";
                    }}
                    src={croppedAvatar ?? tempAvt}
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
                    onError={(e) => {
                      e.target.src =
                        "https://tenten.vn/tin-tuc/wp-content/uploads/2022/06/loi-http-error-4.png";
                    }}
                    src={croppedCover ?? tempCover}
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
          {loading ? <LoadingIcon /> : <button type="submit">Tạo nhóm</button>}
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
                <div className="btn-container">
                  <button
                    type="button"
                    className="btn-func crop"
                    onClick={() =>
                      generateCroppedImage(avatarImage, setCroppedAvatar)
                    }
                  >
                    Cắt ảnh đại diện
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
                <div className="btn-container">
                  <button
                    type="button"
                    className="btn-func crop"
                    onClick={() =>
                      generateCroppedImage(coverImage, setCroppedCover)
                    }
                  >
                    Cắt ảnh bìa
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
            )}
          </div>
        )}
      </div>
    </React.Fragment>
  );
}

export default CreateGroupPage;
