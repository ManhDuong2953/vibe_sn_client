import { useEffect, useState } from "react";
import { API_FRIEND_SUGGEST } from "../../../API/api_server";
import { getData } from "../../../ultils/fetchAPI/fetch_API";
import "./list_suggest.scss";
import SuggestItem from "./SuggestItem/suggest_item";
import AvatarWithText from "../../../skeleton/avatarwithtext";
function ListSuggest() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getData(API_FRIEND_SUGGEST);
      if (response?.status) {
        setData(response.data);
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);
  

  return (
    <div className="list-suggest--container">
      <ul className="list-suggest">
        {loading === true ? (
          <div className="loading-skeleton">
            <AvatarWithText />
            <AvatarWithText />
            <AvatarWithText />
            <AvatarWithText />
            <AvatarWithText />
            <AvatarWithText />
          </div>
        ) : data?.length && loading === false ? (
          data?.map((item, index) => (
            <SuggestItem key={index} user_id={item?.user_id} />
          ))
        ) : (
          <h5
            className="text-center"
            style={{ margin: "5px 0", color: "#7171718c" }}
          >
            Bạn không có gợi ý kết bạn nào
          </h5>
        )}
      </ul>
    </div>
  );
}

export default ListSuggest;
