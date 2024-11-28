import {
  API_INFO_COUNTRY,
  API_WEATHER_CURRENT,
  API_WEATHER_FORECAST,
} from "../API/api_fe";
import { API_FRIEND_LIST } from "../API/api_server";
import { getData } from "../ultils/fetchAPI/fetch_API";
import { getCurrentLocation } from "../ultils/getLocation/get_location";

const fetchDataFE = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response?.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return null;
  }
};
export const getDataWeatherCurrent = async () => {
  const { latitude, longitude } = await getCurrentLocation();
  return fetchDataFE(API_WEATHER_CURRENT(latitude, longitude));
};

export const getDataWeatherForecast = async () => {
  const { latitude, longitude } = await getCurrentLocation();
  return fetchDataFE(API_WEATHER_FORECAST(latitude, longitude));
};

export const getDataInfoCountry = async (name_country) => {
  return fetchDataFE(API_INFO_COUNTRY(name_country));
};

export const getAllFriends = async (user_id) => {
  try {
    const response = await getData(API_FRIEND_LIST(user_id));
    if (response?.status) {
      return response;
    }
    throw new Error(`HTTP error! status: ${response?.status}`);
  } catch (error) {
    console.log(error);
  }
};

export const getCountMutualFriends = async (user_id1, user_id2) => {
  try {
    if(!user_id1 && !user_id2) return 0;
    // Lấy danh sách bạn bè của cả hai người dùng
    const friendsUser1 = await getAllFriends(user_id1);
    const friendsUser2 = await getAllFriends(user_id2);

    if (friendsUser1 && friendsUser2) {
      // Lọc ra những bạn chung
      const mutualFriends = friendsUser1.data.filter(friend1 =>
        friendsUser2.data.some(friend2 => friend2.friend_id === friend1.friend_id)
      );
      return mutualFriends?.length; 
    }
    return 0;
  } catch (error) {
    console.error("Failed to fetch mutual friends:", error);
    return 0;
  }
};


export const getListMutualFriends = async (user_id1, user_id2) => {
  try {
    if(!user_id1 && !user_id2) return [];

    // Lấy danh sách bạn bè của cả hai người dùng
    const friendsUser1 = await getAllFriends(user_id1);
    const friendsUser2 = await getAllFriends(user_id2);

    if (friendsUser1 && friendsUser2) {
      // Lọc ra những bạn chung
      const mutualFriends = friendsUser1.data.filter(friend1 =>
        friendsUser2.data.some(friend2 => friend2.friend_id === friend1.friend_id)
      );
      return mutualFriends; 
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch mutual friends:", error);
    return 0;
  }
};
