import React, { useEffect, useState } from "react";
import "./group_home.scss";
import NavigativeBar from "../../../layout/NavigativeBar/navigative_bar";
import PostItem from "../../../layout/ListPosts/PostItem/post_item";
import GroupHeader from "../../../layout/GroupHeader/group_header";
import { MdDateRange, MdOutlinePublic } from "react-icons/md";
import { FaPeopleGroup } from "react-icons/fa6";
import FormPost from "../../../component/FormPost/form_post";
import { useParams } from "react-router-dom";
import { getData } from "../../../ultils/fetchAPI/fetch_API";
import {
  API_GROUP_DETAIL,
  API_LIST_GROUP_ACCEPTED_POST,
  API_LIST_MEMBERS_OFFICAL_GROUP,
} from "../../../API/api_server";
import { formatDate } from "../../../ultils/formatDate/format_date";
import { RiGitRepositoryPrivateFill } from "react-icons/ri";

function GroupHomePage({ titlePage }) {
  useEffect(() => {
    document.title = titlePage;
  }, [titlePage]);
  const { group_id } = useParams();

  const [listPostGroup, setListPostGroup] = useState([]);
  useEffect(() => {
    const getAllGroupPost = async () => {
      try {
        const response = await getData(API_LIST_GROUP_ACCEPTED_POST(group_id));
        if (response?.status) {
          setListPostGroup(response?.data);
        }
      } catch (error) {
        console.error("Error fetching group detail:", error);
      }
    };
    getAllGroupPost();
  }, [group_id]);

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

  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
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
      }
    };
    fetchMembers();
  }, [group_id]);

  return (
    <React.Fragment>
      <div className="group-dom">
        <NavigativeBar />
        <div className="group-wrapper container">
          <div className="group-container">
            <GroupHeader group_id={group_id} classNameActive={"post"} />
            <div className="group-main">
              <div className="group-left">
                <FormPost group_id={group_id} />
                <div className="title-content box">
                  <h3>Bài viết</h3>
                </div>
                {listPostGroup ? (
                  listPostGroup?.map((data, index) => (
                    <PostItem key={index} data={data} />
                  ))
                ) : (
                  <h4 className="box-center">
                    Nhóm chưa có bài viết nào hoặc nhóm đang để chế độ riêng tư.
                  </h4>
                )}
              </div>
              <div className="group-right">
                <div className="title-intro box">
                  <h3>Giới thiệu</h3>
                  {dataGroup && (
                    <div className="slogan">{dataGroup?.group_slogan}</div>
                  )}
                  <div className="info-short">
                    <div className="info-short--item info-name">
                      <b>{dataGroup?.group_name}</b>
                    </div>
                    {dataGroup?.group_privacy === 0 && (
                      <div className="info-short--item info-privacy">
                        <RiGitRepositoryPrivateFill />
                        Nhóm riêng tư: Chỉ thành viên mới có thể xem nội dung
                        bài viết và thành viên trong nhóm
                      </div>
                    )}
                    {dataGroup?.group_privacy === 1 && (
                      <div className="info-short--item info-privacy">
                        <MdOutlinePublic />
                        Nhóm công khai: Bất kỳ ai cũng có thể xem nội dung bài
                        viết
                      </div>
                    )}
                  </div>
                  {dataGroup?.created_at && (
                    <div className="info-short--item info-school">
                      <MdDateRange />
                      Tạo ngày:
                      <b>{formatDate(dataGroup?.created_at, "dd/mm/yy")}</b>
                    </div>
                  )}

                  <div className="info-short--item info-address">
                    <FaPeopleGroup />
                    Thành viên nhóm: <b> {members.length} </b> thành viên
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default GroupHomePage;
