import { Link } from "react-router-dom";
import "./group_item.scss";
import { useEffect, useState } from "react";
import { API_GROUP_DETAIL } from "../../API/api_server";
import AvatarWithText from "../../skeleton/avatarwithtext";
import { getData } from "../../ultils/fetchAPI/fetch_API";
function GroupItem({ group_id = null, data = {} }) {
  const [loading, setLoading] = useState(false);
  const [dataGr, setDataGr] = useState();
  useEffect(() => {
    if (!group_id && data) {
      setDataGr(data);
      setLoading(false);
    }
  }, [data]);
  useEffect(() => {
    try {
      if (!group_id && data) return;
      setLoading(true);

      const fetchData = async () => {
        const response = await getData(API_GROUP_DETAIL(group_id));
        if (response?.status) {
          setDataGr(response?.data);
        }
      };
      fetchData();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [group_id, data]);

  return (
    <li className="list-group--item">
      {!loading && dataGr ? (
        <Link to={`/group/` + dataGr?.group_id}>
          <div className="avt-group">
            <img src={dataGr?.avatar_media_link} alt="" />
          </div>
          <div className="name-group">
            <b>{dataGr?.group_name}</b>
          </div>
        </Link>
      ) : (
        <div className="loading-skeleton">
          <AvatarWithText />
        </div>
      )}
    </li>
  );
}

export default GroupItem;
