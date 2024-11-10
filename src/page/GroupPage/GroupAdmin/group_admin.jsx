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
import { deleteData } from "../../../ultils/fetchAPI/fetch_API";
import { API_DELETE_GROUP } from "../../../API/api_server";
import { toast } from "react-toastify";

function GroupAdminPage({ titlePage }) {
  useEffect(() => {
    document.title = titlePage;
  }, [titlePage]);
  const { group_id } = useParams();
  const navigate = useNavigate();
  const handleDeleteGroup = async () => {
    try {
      const response = await deleteData(API_DELETE_GROUP(group_id));
      if (response.status) {
        toast.success("Xóa nhóm thành công!");
        navigate("/group");
      } else {
        toast.error("Xóa nhóm thất bại!");
      }
    } catch (error) {
      toast.error("Xóa nhóm thất bại!");
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
                  <h3>Phê duyệt bài viết (15)</h3>
                </div>
                <form action="" method="get">
                  <input
                    type="text"
                    placeholder="&#x1F50D; Nhập tên thành viên đăng bài hoặc nội dung bài viết"
                  />
                </form>

                <div className="action-post--admin">
                  <div className="action-post">
                    <div className="btn-action btn-accept">
                      <FaFileCircleCheck />
                      <p>Phê duyệt</p>
                    </div>
                    <div className="btn-action btn-delete">
                      <RiDeleteBin5Fill />
                      <p>Xóa bài</p>
                    </div>
                  </div>
                  <PostItem />
                </div>

                <div className="action-post--admin">
                  <div className="action-post">
                    <div className="btn-action btn-accept">
                      <FaFileCircleCheck />
                      <p>Phê duyệt</p>
                    </div>
                    <div className="btn-action btn-delete">
                      <RiDeleteBin5Fill />
                      <p>Xóa bài</p>
                    </div>
                  </div>
                  <PostItem />
                </div>
              </div>
              <div className="group-right">
                <div className="title-intro box">
                  <h3>Thống kê bài viết</h3>
                  <div className="info-short--item info-school">
                    <MdDateRange />
                    100.000 bài viết (+3 bài viết hôm nay)
                  </div>
                  <div className="info-short--item info-address">
                    <FaPeopleGroup />
                    100.000 thành viên (+5 thành viên hôm nay)
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

                  <div className="title-direct-member delete box" onClick={()=>handleDeleteGroup()}>
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
