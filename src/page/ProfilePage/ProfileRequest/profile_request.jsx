import React, { useEffect, useState } from "react";
import "./profile_request.scss";

import NavigativeBar from "../../../layout/NavigativeBar/navigative_bar";
import ProfileHeader from "../../../layout/ProfileHeader/profile_header";
import ProfileRequestItem from "./ProfileRequestItem/profile_request_item";
import { useParams } from "react-router-dom";
import { getData } from "../../../ultils/fetchAPI/fetch_API";
import { API_FRIEND_LIST_REQUEST } from "../../../API/api_server";
function ProfileRequest({ titlePage }) {
  useEffect(() => {
    document.title = titlePage;
  }, [titlePage]);
  const { user_id } = useParams();
  const [data, setData] = useState([]);
  useEffect(() => {
    try {
      const fetchData = async () => {
        const response = await getData(API_FRIEND_LIST_REQUEST);
        if (response?.status) {
          setData(response?.data);
        }
      };
      fetchData();
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <React.Fragment>
      <NavigativeBar />
      <div className="profile">
        <div className="profile-container">
          <ProfileHeader userId={user_id} classNameActive="request-add--fr" />
          <div className="profile-request--container">
            <h3 className="box">Yêu cầu kết bạn</h3>

            <ul className="list-request">
              {data?.length ? (
                data.map((item, index) => (
                  <ProfileRequestItem
                    key={index}
                    user_id={item?.requestor_id}
                  />
                ))
              ) : (
                <h4
                  className="box-center"
                >
                  Bạn không có lời mời kết bạn nào
                </h4>
              )}
            </ul>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default ProfileRequest;
