import React, { useEffect, useState } from "react";
import NavigativeBar from "../../../layout/NavigativeBar/navigative_bar";
import SuggestItem from "../../../layout/SideBarRight/Suggest/SuggestItem/suggest_item";
import PostItem from "../../../layout/ListPosts/PostItem/post_item";
import "./list_post_group.scss";
import { Link } from "react-router-dom";
import { MdOutlineGroupAdd } from "react-icons/md";
import { FaLayerGroup } from "react-icons/fa6";
import { getData } from "../../../ultils/fetchAPI/fetch_API";
import { API_LIST_GROUP_BY_OWNER, API_LIST_GROUP_UNAPPROVED_POST } from "../../../API/api_server";
import GroupItem from "../../../component/GroupItem/group_item";
function ListPostGroupPage({ titlePage }) {
  useEffect(() => {
    document.title = titlePage;
  }, [titlePage]);

  const [listPostGroup, setListPostGroup] = useState([]);
  useEffect(() => {
    const icon = document.querySelector(".icon-gr");
    const sideLeft = document.querySelector(".side-left");
    const handleToggle = () => {
      sideLeft.classList.toggle("active");
    };
    icon.addEventListener("click", handleToggle);
    return () => {
      if (icon) {
        icon.removeEventListener("click", handleToggle);
      }
    };
  }, []);
  
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
  
  // useEffect(() => {
  //   const getAllGroupPost = async () => {
  //     try {
  //       const response = await getData(
  //         API_LIST_GROUP_UNAPPROVED_POST(group_id)
  //       );
  //       if (response?.status) {
  //         setListPostGroup(response?.data);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching group detail:", error);
  //     }
  //   };
  //   getAllGroupPost();
  // }, [group_id]);

  return (
    <React.Fragment>
      <NavigativeBar />
      <div className="list-post-group">
        <div className="container">
          <FaLayerGroup className="icon-gr" />

          <div className="side-left">
            <ul className="list-gr">
              <h2>Nhóm của bạn</h2>
              <Link className="create-gr" to="/group/create">
                <MdOutlineGroupAdd />
                <h5>Tạo nhóm</h5>
              </Link>
              {dataGroup.length > 0 &&
                dataGroup.map((data, index) => (
                  <GroupItem key={index} group_id={data?.group_id} />
                ))}
            </ul>
          </div>
          <div className="side-right">
            <ul className="list-gr">
              {/* {listPostGroup ? (
                listPostGroup?.map((data, index) => {
                  return <PostItem dataPost={data} />;
                })
              ) : (
                <h4 className="box-center">
                  Nhóm chưa có bài viết nào. Hãy thêm bài viết trao đổi nào!!
                </h4>
              )} */}
            </ul>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default ListPostGroupPage;
