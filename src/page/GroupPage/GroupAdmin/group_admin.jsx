import React, { useEffect, useState } from "react";
import "./group_admin.scss";
import NavigativeBar from "../../../layout/NavigativeBar/navigative_bar";
import PostItem from "../../../layout/ListPosts/PostItem/post_item";
import GroupHeader from "../../../layout/GroupHeader/group_header";
import { MdDateRange, MdGroupOff } from "react-icons/md";
import {
  FaFileCircleCheck,
  FaPeopleGroup,
  FaPeopleLine,
} from "react-icons/fa6";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaInfoCircle } from "react-icons/fa";
import {
  deleteData,
  getData,
  postData,
} from "../../../ultils/fetchAPI/fetch_API";
import {
  API_ACCEPT_GROUP_POST,
  API_DELETE_GROUP,
  API_GROUP_DETAIL,
  API_LIST_GROUP_UNAPPROVED_POST,
  API_REFUSE_GROUP_POST,
} from "../../../API/api_server";
import { toast } from "react-toastify";

function GroupAdminPage({ titlePage }) {
  useEffect(() => {
    document.title = titlePage;
  }, [titlePage]);
  const { group_id } = useParams();
  const navigate = useNavigate();
  const [dataGroup, setDataGroup] = useState();
  useEffect(() => {
    try {
      if (!group_id) return;
      const getGroupDetail = async () => {
        const response = await getData(API_GROUP_DETAIL(group_id));
        if (response?.status) {
          setDataGroup(response?.data);
        }
      };

      getGroupDetail();
    } catch (error) {
      console.error(error.message);
    }
  }, [group_id]);

  const handleDeleteGroup = async () => {
    try {
      const response = await deleteData(API_DELETE_GROUP(group_id));
      if (response?.status) {
        toast.success("Xóa nhóm thành công!");
        navigate("/group");
      } else {
        toast.error("Xóa nhóm thất bại!");
      }
    } catch (error) {
      toast.error("Xóa nhóm thất bại!");
    }
  };

  const [listPostGroup, setListPostGroup] = useState([]);
  useEffect(() => {
    const getAllGroupPost = async () => {
      try {
        const response = await getData(
          API_LIST_GROUP_UNAPPROVED_POST(group_id)
        );
        if (response?.status) {
          setListPostGroup(response?.data);
        }
      } catch (error) {
        console.error("Error fetching group detail:", error);
      }
    };
    getAllGroupPost();
  }, [group_id]);

  const handleUpdateGroupPost = async (group_post_id, action) => {
    try {
      const apiUri =
        action === "accepted"
          ? API_ACCEPT_GROUP_POST(group_id)
          : API_REFUSE_GROUP_POST(group_id);
      const response = await postData(apiUri, {
        group_post_id,
      });
      if (response?.status) {
        // Xoá phần tử trong mảng listpostgroup mà có group_post_id là có group_post_id tham chiếu truyền vào
        const newListPostGroup = listPostGroup.filter(
          (item) => item.group_post_id !== group_post_id
        );
        setListPostGroup(newListPostGroup);
      }
    } catch (error) {
      console.error("Cập nhật nhóm thất bại!");
    }
  };

  return (
    <React.Fragment>
      <div className="group-admin">
        <NavigativeBar />
        <div className="group-wrapper container">
          <div className="group-container">
            <GroupHeader group_id={group_id} classNameActive={"admin"} />
            <div className="group-main">
              <div className="group-left">
                <div className="title-content box">
                  <h3>Phê duyệt bài viết ({listPostGroup?.length})</h3>
                </div>
                <form action="" method="get">
                  <input
                    type="text"
                    placeholder="&#x1F50D; Nhập tên thành viên đăng bài hoặc nội dung bài viết"
                  />
                </form>

                {listPostGroup ? (
                  listPostGroup?.map((data, index) => (
                    <div className="action-post--admin" key={index}>
                      <div className="action-post">
                        <div
                          className="btn-action btn-accept"
                          onClick={() =>
                            handleUpdateGroupPost(
                              data?.group_post_id,
                              "accepted"
                            )
                          }
                        >
                          <FaFileCircleCheck />
                          <p>Phê duyệt</p>
                        </div>
                        <div
                          className="btn-action btn-delete"
                          onClick={() =>
                            handleUpdateGroupPost(
                              data?.group_post_id,
                              "refused"
                            )
                          }
                        >
                          <RiDeleteBin5Fill />
                          <p>Xóa bài</p>
                        </div>
                      </div>
                      <PostItem data={data} />
                    </div>
                  ))
                ) : (
                  <h4 className="box-center">
                    Nhóm chưa có bài viết nào hoặc nhóm đang để chế độ riêng tư.
                  </h4>
                )}
              </div>
              <div className="group-right">
                <div className="title-intro box">
                  <h3>Thống kê bài viết</h3>
                  <div className="info-short--item info-school">
                    <MdDateRange />
                    {listPostGroup?.length?.toLocaleString()} bài viết 
                  </div>
                  <div className="info-short--item info-address">
                    <FaPeopleGroup />
                    {dataGroup?.member_count?.toLocaleString()} thành viên 
                  </div>
                </div>
                <Link to={`/group/${group_id}/admin/edit`}>
                  <div className="title-direct-member info box">
                    <p>Sửa thông tin nhóm</p>
                    <FaInfoCircle />
                  </div>
                </Link>
                <Link to={`/group/${group_id}/admin/member`}>
                  <div className="title-direct-member box">
                    <p>Quản lý thành viên</p>
                    <FaPeopleLine />
                  </div>
                </Link>

                <div
                  className="title-direct-member delete box"
                  onClick={() => handleDeleteGroup()}
                >
                  <p>Giải tán nhóm</p>
                  <MdGroupOff />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default GroupAdminPage;
