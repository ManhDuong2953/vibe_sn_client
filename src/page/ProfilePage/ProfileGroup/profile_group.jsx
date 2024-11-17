import React, { useEffect, useState } from "react";
import "./profile_group.scss";

import NavigativeBar from "../../../layout/NavigativeBar/navigative_bar";
import ProfileHeader from "../../../layout/ProfileHeader/profile_header";
import ListSuggest from "../../../layout/SideBarRight/Suggest/list_suggest";
import { useParams } from "react-router-dom";
import { getData } from "../../../ultils/fetchAPI/fetch_API";
import { API_LIST_GROUP_BY_OWNER } from "../../../API/api_server";
import GroupItem from "../../../component/GroupItem/group_item";
function ProfileGroup({ titlePage }) {
  useEffect(() => {
    document.title = titlePage;
  }, [titlePage]);
  const { user_id } = useParams();

  const [dataGroup, setDataGroup] = useState([]);
  useEffect(() => {
    const getAllGroupByOwner = async () => {
      const response = await getData(API_LIST_GROUP_BY_OWNER);
      if (response.status) {
        setDataGroup(response.data);
      }
    };
    getAllGroupByOwner();
  }, []);

  return (
    <React.Fragment>
      <NavigativeBar />
      <div className="profile">
        <div className="profile-container">
          <ProfileHeader userId={user_id} classNameActive="group" />
          <div className="profile-group--container">
            <h3 className="box">
              Nhóm của bạn{" "}
              <form action="" method="get">
                <input type="text" placeholder="&#x1F50D; Nhập tên nhóm" />
              </form>
            </h3>

            {dataGroup.length > 0 &&
              dataGroup.map((data, index) => (
                <GroupItem key={index} group_id={data?.group_id} />
              ))}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default ProfileGroup;
