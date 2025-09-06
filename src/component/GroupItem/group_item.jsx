import { Link } from "react-router-dom";
import "./group_item.scss";
import { useEffect, useState } from "react";
import { API_GROUP_DETAIL } from "../../API/api_server";
import AvatarWithText from "../../skeleton/avatarwithtext";
import { getData } from "../../ultils/fetchAPI/fetch_API";
function GroupItem({ group_id = null, data = null }) {
  const [loading, setLoading] = useState(false);
  const [dataGr, setDataGr] = useState(null);

  // Nếu có data từ props, chỉ set lần đầu khi component mount
  useEffect(() => {
    if (data && !dataGr) {
      setDataGr(data);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // chỉ chạy 1 lần khi mount

  // Nếu có group_id, fetch data từ API
  useEffect(() => {
    if (!group_id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getData(API_GROUP_DETAIL(group_id));
        if (response?.status) {
          setDataGr(response.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [group_id]);

  return (
    <li className="list-group--item">
      {!loading ? (
        dataGr && (
          <Link to={`/group/${dataGr.group_id}`}>
            <div className="avt-group">
              <img
                onError={(e) =>
                  (e.target.src =
                    "https://tenten.vn/tin-tuc/wp-content/uploads/2022/06/loi-http-error-4.png")
                }
                src={dataGr.avatar_media_link}
                alt=""
              />
            </div>
            <div className="name-group">
              <b>{dataGr.group_name}</b>
            </div>
          </Link>
        )
      ) : (
        <div className="loading-skeleton">
          <AvatarWithText />
        </div>
      )}
    </li>
  );
}

export default GroupItem;
