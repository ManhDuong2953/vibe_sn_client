import { API_COUNT_MANUAL_FRIEND, API_FRIEND_LIST } from "../API/api_server";
import { getData } from "../ultils/fetchAPI/fetch_API";

export const getAllFriends = async (user_id) => {
  try {
    const response = await getData(API_FRIEND_LIST(user_id));
    if (response?.status) {
      return response;
    }
    throw new Error(`HTTP error! status: ${response?.status}`);
  } catch (error) {
    console.error(error);
  }
};

export const getCountMutualFriends = async (friend_id) => {
  try {
    // Lấy danh sách bạn bè của cả hai người dùng
    const friendsUser1 = await getData(API_COUNT_MANUAL_FRIEND(friend_id));
    if (friendsUser1?.status) {
      return friendsUser1?.data?.mutual_friend_count ?? 0;
    }
    return 0;
  } catch (error) {
    console.error("Failed to fetch mutual friends:", error);
    return 0;
  }
};




export const getListMutualFriends = async (user_id1, user_id2) => {
  try {
    if (!user_id1 && !user_id2) return [];

    // Lấy danh sách bạn bè của cả hai người dùng
    const friendsUser1 = await getAllFriends(user_id1);
    const friendsUser2 = await getAllFriends(user_id2);

    if (friendsUser1 && friendsUser2) {
      // Lọc ra những bạn chung
      const mutualFriends = friendsUser1.data.filter((friend1) =>
        friendsUser2.data.some(
          (friend2) => friend2.friend_id === friend1.friend_id
        )
      );
      return mutualFriends;
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch mutual friends:", error);
    return 0;
  }
};
