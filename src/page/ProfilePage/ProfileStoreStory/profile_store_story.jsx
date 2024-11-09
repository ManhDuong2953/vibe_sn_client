import React, { useEffect, useState } from "react";
import "./profile_store_story.scss";

import NavigativeBar from "../../../layout/NavigativeBar/navigative_bar";
import ProfileHeader from "../../../layout/ProfileHeader/profile_header";
import { Link, useParams } from "react-router-dom";
import { getData } from "../../../ultils/fetchAPI/fetch_API";
import { API_LIST_MY_STORY } from "../../../API/api_server";
import { timeAgo } from "../../../ultils/formatDate/format_date";
function ProfileStoreStory({ titlePage }) {
  useEffect(() => {
    document.title = titlePage;
  }, [titlePage]);
  const { user_id } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    try {
      const fetchData = async () => {
        setLoading(true);
        const response = await getData(API_LIST_MY_STORY);
        if (response.status) {
          setData(response.data);
          console.log(response.data);
        }
      };
      fetchData();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);
  return (
    <React.Fragment>
      <NavigativeBar />
      <div className="profile">
        <div className="profile-container">
          <ProfileHeader userId={user_id} classNameActive="store-story" />
          <div className="profile-story--container">
            <h3 className="box">Kho lưu trữ tin</h3>
            <ul className="post-image--list">
              {loading ? (
                <div className="loading-spinner"></div>
              ) : (
                data?.map((item) => (
                  <Link to={"/story/" + item?.story_id}>
                    <li className="post-image--item">
                      <img src={item?.media_link} alt="" />
                      <p className="time">{timeAgo(item?.created_at)}</p>
                    </li>
                  </Link>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default ProfileStoreStory;
