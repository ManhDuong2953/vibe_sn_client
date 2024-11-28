import React, { useEffect, useState } from "react";
import "./group_admin_member.scss";
import NavigativeBar from "../../../layout/NavigativeBar/navigative_bar";
import PostItem from "../../../layout/ListPosts/PostItem/post_item";
import GroupHeader from "../../../layout/GroupHeader/group_header";
import {
  MdAdminPanelSettings,
  MdDateRange,
  MdOutlineGroupOff,
} from "react-icons/md";
import { FaAngleLeft, FaFileCircleCheck, FaPeopleGroup } from "react-icons/fa6";
import { RiDeleteBin5Fill } from "react-icons/ri";
import SuggestItem from "../../../layout/SideBarRight/Suggest/SuggestItem/suggest_item";
import { Link, useParams } from "react-router-dom";
import { getData, postData } from "../../../ultils/fetchAPI/fetch_API";
import {
  API_ACCEPT_INVITE_MEMBER_GROUP,
  API_LIST_MEMBERS_OFFICAL_GROUP,
  API_LIST_MEMBERS_UNAPPROVED_GROUP,
  API_REFUSE_INVITE_MEMBER_GROUP,
  API_SET_ADMIN_MEMBER_GROUP,
} from "../../../API/api_server";

function GroupAdminMemberPage({ titlePage }) {
  useEffect(() => {
    document.title = titlePage;
  }, [titlePage]);
  const { group_id } = useParams();
  const [listApprover, setListApprover] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      setLoading(true);
      const fetchData = async () => {
        const response = await getData(
          API_LIST_MEMBERS_UNAPPROVED_GROUP(group_id)
        );
        if (response?.status) {
          setListApprover(response?.data);
        }
      };
      fetchData();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const [members, setMembers] = useState([]);
  const [loadingMember, setLoadingMember] = useState(false);
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoadingMember(true);
        const response = await getData(
          API_LIST_MEMBERS_OFFICAL_GROUP(group_id)
        );
        if (response?.status) {
          setMembers(response?.data);
        } else {
          console.error("Failed to fetch members");
        }
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoadingMember(false);
      }
    };
    fetchMembers();
  }, []);

  const handleAccepted = async (memberId) => {
    if (window.confirm("Bạn có chắc chắn muốn chấp nhận lời mời này không?")) {
      try {
        const response = await postData(
          API_ACCEPT_INVITE_MEMBER_GROUP(group_id),
          {
            member_id: memberId,
          }
        );
        if (response?.status) {
          window.location.reload();
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleRefused = async (memberId) => {
    if (window.confirm("Bạn có chắc chắn muốn từ chối lời mời này không?")) {
      try {
        const response = await postData(
          API_REFUSE_INVITE_MEMBER_GROUP(group_id),
          {
            member_id: memberId,
          }
        );
        if (response?.status) {
          window.location.reload();
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSetAdmin = async (memberId) => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn đặt người này làm quản trị viên không?"
      )
    ) {
      try {
        const response = await postData(API_SET_ADMIN_MEMBER_GROUP(group_id), {
          member_id: memberId,
        });
        if (response?.status) {
          window.location.reload();
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <React.Fragment>
      <div className="group-admin-members">
        <NavigativeBar />
        <div className="group-wrapper container">
          <div className="group-container">
            <GroupHeader group_id={group_id} classNameActive={"admin"} />
            <div className="group-main">
              <div className="group-left">
                <Link to={`/group/${group_id}/admin`}>
                  <div className="title-direct--post box">
                    <FaAngleLeft />
                    <p>Quản lý bài viết</p>
                  </div>
                </Link>
                <div className="title-content box">
                  <h3>Quản lý thành viên ({members?.length ?? 0})</h3>
                </div>

                {members?.length > 0 ? (
                  members?.map((item, index) => {
                    if (item.member_role === 1) {
                      return (
                        <div className="action-member--admin" key={index}>
                          <div className="action-member">
                            <div
                              className="btn-action btn-delete"
                              onClick={() => handleRefused(item?.member_id)}
                            >
                              <MdOutlineGroupOff />
                              <p>Khai trừ</p>
                            </div>
                          </div>
                          <SuggestItem
                            loading={loadingMember}
                            user_id={item?.member_id}
                          />
                        </div>
                      );
                    } else if (item.member_role === 0) {
                      // sửa lại điều kiện này nếu cần
                      return (
                        <div className="action-member--admin" key={index}>
                          <div className="action-member">
                            <div
                              className="btn-action btn-accept"
                              onClick={() => handleSetAdmin(item?.member_id)}
                            >
                              <MdAdminPanelSettings />
                              <p>Đặt làm quản trị viên</p>
                            </div>
                            <div
                              className="btn-action btn-delete"
                              onClick={() => handleRefused(item?.member_id)}
                            >
                              <MdOutlineGroupOff />
                              <p>Khai trừ</p>
                            </div>
                          </div>
                          <SuggestItem
                            loading={loadingMember}
                            user_id={item?.member_id}
                          />
                        </div>
                      );
                    }
                    return null; // Trả về null nếu không thỏa mãn điều kiện nào
                  })
                ) : (
                  <h5 className="text-center">Nhóm chưa có thành viên nào</h5>
                )}
              </div>
              <div className="group-right">
                <div className="title-intro box">
                  <h3>Thống kê bài viết</h3>
                  <div className="info-short--item info-school">
                    <MdDateRange />
                    100.000 bài viết
                  </div>
                  <div className="info-short--item info-address">
                    <FaPeopleGroup />
                    {members?.length.toLocaleString() ?? 0} thành viên
                  </div>
                </div>
                <div className="title-content box">
                  <h3>Yêu cầu gia nhập ({listApprover?.length ?? 0})</h3>
                </div>

                {listApprover?.length > 0 ? (
                  listApprover.map((item) => (
                    <div className="action-member--admin">
                      <div className="action-member">
                        <div
                          className="btn-action btn-accept"
                          onClick={() => handleAccepted(item?.member_id)}
                        >
                          <FaFileCircleCheck />
                          <p>Phê duyệt</p>
                        </div>
                        <div
                          className="btn-action btn-delete"
                          onClick={() => handleRefused(item?.member_id)}
                        >
                          <RiDeleteBin5Fill />
                          <p>Xóa</p>
                        </div>
                      </div>

                      <SuggestItem
                        loading={loading}
                        user_id={item?.member_id}
                      />
                    </div>
                  ))
                ) : (
                  <h5 className="text-center">
                    Không có lời mời tham gia nhóm nào
                  </h5>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default GroupAdminMemberPage;
