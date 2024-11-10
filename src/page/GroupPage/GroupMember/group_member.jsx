import React, { useEffect, useState } from "react";
import "./group_member.scss";
import NavigativeBar from "../../../layout/NavigativeBar/navigative_bar";
import GroupHeader from "../../../layout/GroupHeader/group_header";
import { FaPeopleGroup } from "react-icons/fa6";
import SuggestItem from "../../../layout/SideBarRight/Suggest/SuggestItem/suggest_item";
import { useParams } from "react-router-dom";
import { getData } from "../../../ultils/fetchAPI/fetch_API";
import { API_LIST_MEMBERS_OFFICAL_GROUP } from "../../../API/api_server";

function GroupMemberPage({ titlePage }) {
  useEffect(() => {
    document.title = titlePage;
  }, [titlePage]);

  const { group_id } = useParams();
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await getData(API_LIST_MEMBERS_OFFICAL_GROUP(group_id));
        if (response.status) {
          setMembers(response?.data);
        } else {
          console.error("Failed to fetch members");
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchMembers();
  }, []);
 

  // Tách riêng quản trị viên và thành viên nhóm
  const adminMembers = members?.filter(item => item?.member_role === 1) || [];
  const regularMembers = members?.filter(item => item?.member_role === 0) || [];

  return (
    <React.Fragment>
      <div className="group-dom--members">
        <NavigativeBar />
        <div className="group-wrapper container">
          <div className="group-container">
            <GroupHeader group_id={group_id} classNameActive={"members"} />
            <div className="group-main">
              <h3 className="title">Thành viên nhóm</h3>

              {members?.length > 0 ? (
                <>
                  {/* Hiển thị quản trị viên và số lượng */}
                  {adminMembers?.length > 0 && (
                    <>
                      <h3 className="box">Quản trị viên ({adminMembers?.length ?? 0})</h3>
                      <ul className="list-members">
                        {adminMembers.map((item, index) => (
                          <SuggestItem key={index} user_id={item?.member_id} />
                        ))}
                      </ul>
                    </>
                  )}

                  {/* Hiển thị thành viên nhóm và số lượng */}
                  {regularMembers?.length > 0 && (
                    <>
                      <h3 className="box">Thành viên nhóm ({regularMembers?.length ?? 0})</h3>
                      <ul className="list-members">
                        {regularMembers.map((item, index) => (
                          <SuggestItem key={index} user_id={item?.member_id} />
                        ))}
                      </ul>
                    </>
                  )}
                </>
              ) : (
                <div className="text-center" style={{ padding: "50px" }}>
                  <FaPeopleGroup />
                  <h3>Chưa có thành viên nào trong nhóm</h3>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default GroupMemberPage;
