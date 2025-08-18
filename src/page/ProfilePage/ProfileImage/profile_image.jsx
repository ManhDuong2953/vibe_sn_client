import React, { useEffect, useState } from "react";
import "./profile_image.scss";

import NavigativeBar from "../../../layout/NavigativeBar/navigative_bar";
import ProfileHeader from "../../../layout/ProfileHeader/profile_header";
import { useParams } from "react-router-dom";
import { getData } from "../../../ultils/fetchAPI/fetch_API";
import { API_GET_ALL_PROFILE_MEDIA_BY_ID } from "../../../API/api_server";
import { timeAgo } from "../../../ultils/formatDate/format_date";
function ProfileImage({ titlePage }) {
  useEffect(() => {
    document.title = titlePage;
  }, [titlePage]);
  const { user_id } = useParams();
  const [images, setImages] = useState();
  useEffect(() => {
    const fetchData = async () => {
      const response = await getData(API_GET_ALL_PROFILE_MEDIA_BY_ID);
      if (response?.status) {
        setImages(response.data);
      }
    };
    fetchData();
  }, []);
  return (
    <React.Fragment>
      <NavigativeBar />
      <div className="profile">
        <div className="profile-container">
          <ProfileHeader userId={user_id} classNameActive="image" />
          <div className="profile-img--container">
            <h3 className="box">Ảnh</h3>
            <ul className="post-image--list">
              {images &&
                images?.map((image) => (
                  <li className="post-image--item" key={Math.random()}>
                    <img src={image.media_link} alt="" />
                    <p className="time">{timeAgo(image.created_at)}</p>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default ProfileImage;
