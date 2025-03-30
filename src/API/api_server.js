const API_HOST = process.env.REACT_APP_API_URL;

// User account API endpoints
const API_SIGNUP_POST = API_HOST + "/users/account/signup";
const API_SIGNUP_SOCIALNETWORK_POST =
  API_HOST + "/users/account/social-network/signup";
const API_LOGIN_POST = API_HOST + "/users/account/login";
const API_GET_ALL_USERS = API_HOST + "/users/account/all";
const API_GET_USER_BY_ID = (id) => `${API_HOST}/users/account/info/${id}`;
const API_UPDATE_USER_PASSWORD = `${API_HOST}/users/account/reset-password`;
const API_DELETE_USER = (id) => `${API_HOST}/users/account/delete/${id}`;
const API_CHECK_EXIST_USER = (id) =>
  `${API_HOST}/users/account/is-existed/${id}`;

//User Setting
const API_GET_USER_SETTING = `${API_HOST}/users/setting/get-setting/`;
const API_UPDATE_USER_SETTING = `${API_HOST}/users/setting/update-setting/`;

// User infomanation API endpoint
const API_GET_INFO_USER_PROFILE_BY_ID = (id) =>
  `${API_HOST}/users/info-profile/${id}`;
const API_UPDATE_USER = `${API_HOST}/users/update-profile/`;
const API_GET_INFO_OWNER_PROFILE_BY_ID = `${API_HOST}/users/info-profile/`;
const API_GET_ALL_PROFILE_MEDIA_BY_ID = `${API_HOST}/users/profile-media/my-profile-media`;

//User face recognition profile
const API_CREATE_FACE_RECOGNITION_BY_ID = `${API_HOST}/users/face-recognition/create-face-recognition/`;
const API_GET_FACE_RECOGNITION_BY_ID = `${API_HOST}/users/face-recognition/get-face-recognition/`;
const API_DELETE_FACE_RECOGNITION_BY_ID = `${API_HOST}/users/face-recognition/delete-face-recognition/`;
const API_ALL_FACE_RECOGNITION = `${API_HOST}/users/face-recognition/get-all-face-recognition`;
const API_ALL_FACE_RECOGNITION_BY_USER_ID_ENCODE = `${API_HOST}/users/face-recognition/get-all-face-recognition-by-id`;
const API_LOGIN_FACE_RECOGNITION = `${API_HOST}/users/face-recognition/login-face-recognition`;

//Token
const API_LOGOUT = API_HOST + "/token/delete";
const API_ROTATION_TOKEN = API_HOST + "/token/create";
const API_DECODE_TOKEN = API_HOST + "/token/decode-refresh-token";
const API_AUTH_TOKEN = API_HOST + "/token/auth-token";

// OTP API endpoints
const API_CREATE_OTP = API_HOST + "/otp/create";
const API_CREATE_LINK_OTP = API_HOST + "/otp/link/create";
const API_CREATE_OTP_SIGNUP = API_HOST + "/otp/signup/create";
const API_VERIFY_OTP = API_HOST + "/otp/verify";

//Friend API endpoints
const API_FRIEND_REQUEST = (id) => API_HOST + "/users/friend/request/" + id;
const API_FRIEND_ACCEPT = (id) => API_HOST + "/users/friend/accept/" + id;
const API_FRIEND_STATUS = API_HOST + "/users/friend/status/";
const API_FRIEND_LIST = (id) => API_HOST + "/users/friend/list/" + id;
const API_COUNT_MANUAL_FRIEND = (id) =>
  API_HOST + "/users/friend/get-count-manual-friend/" + id;
const API_FRIEND_LIST_REQUEST = API_HOST + "/users/friend/requests/list";
const API_FRIEND_DELETE = API_HOST + "/users/friend/delete";
const API_FRIEND_SUGGEST = API_HOST + "/users/friend/list-suggest";
const API_FRIEND_DATE_OF_BIRTH = API_HOST + "/users/friend/list-dob";
const API_FRIEND_CREATE_BLOCK = (id) =>
  API_HOST + "/users/friend-block/create-block/" + id;
const API_FRIEND_CHECK_BLOCK = (id) =>
  API_HOST + "/users/friend-block/check-block/" + id;
const API_FRIEND_DELETE_BLOCK = (id) =>
  API_HOST + "/users/friend-block/delete-block/" + id;

// Profile Heart API endpoint
const API_PROFILE_HEART_GET = (id) =>
  API_HOST + "/users/profile-heart/list/" + id;
const API_PROFILE_HEART_CREATE = (id) =>
  API_HOST + "/users/profile-heart/create/" + id;
const API_PROFILE_HEART_DELETE = (id) =>
  API_HOST + "/users/profile-heart/delete/" + id;

// KeysPair API endpoint
const API_CREATE_KEYSPAIR = API_HOST + "/users/keys_pair/register/";
const API_IS_EXIST_KEYSPAIR = API_HOST + "/users/keys_pair/is_exist_keys_pair/";
const API_GET_PRIVATE_KEY = API_HOST + "/users/keys_pair/get_private_key/";
const API_DELETE_KEYS_PAIR = API_HOST + "/users/keys_pair/delete_keys_pair/";
const API_CHECK_KEYSPAIR = (id) =>
  API_HOST + "/users/keys_pair/is-has-keypair/" + id;

// Message API ENDPOINT
const API_SEND_MESSAGE = (id) => API_HOST + "/messenger/send/" + id;
const API_GET_ALL_MESSAGE = (id) => API_HOST + "/messenger/all-message/" + id;
const API_GET_ALL_CONVERSATION = API_HOST + "/messenger/all-conversation/";
const API_DELETE_ALL_MESSAGE = (id) =>
  API_HOST + "/messenger/delete-all-messenger/" + id;
const API_DELETE_MESSAGE = (id) =>
  API_HOST + "/messenger/delete-messenger/" + id;
const API_DELETE_MESSAGE_OWNER_SIDE = (id) =>
  API_HOST + "/messenger/delete-messenger-by-owner-side/" + id;

// STORY API ENDPOINT
const API_CREATE_STORY = API_HOST + "/stories/create-story";
const API_LIST_STORY = API_HOST + "/stories/list-story";
const API_LIST_MY_STORY = API_HOST + "/stories/my-list-story";
const API_STORY_BY_ID = (id) => `${API_HOST}/stories/story-by-id/${id}`;
const API_STORIES_BY_ID = (id) => `${API_HOST}/stories/stories-by-id/${id}`;
const API_CREATE_HEART_STORY = (id) =>
  `${API_HOST}/stories/create-heart-story/${id}`;
const API_DELETE_STORY = (id) => `${API_HOST}/stories/delete-story/${id}`;

// GROUP API ENDPOINT
const API_GROUP_CREATE = API_HOST + "/group/channel/create";
const API_LIST_GROUP_BY_USERID = (id) =>
  API_HOST + "/group/members/list-all-group/" + id;
const API_GROUP_DETAIL = (id) => API_HOST + "/group/channel/details/" + id;
const API_UPDATE_GROUP = (id) => API_HOST + "/group/channel/update/" + id;
const API_DELETE_GROUP = (id) => API_HOST + "/group/channel/delete/" + id;
const API_LIST_GROUP_BY_OWNER = API_HOST + "/group/members/list-all-group/";
const API_LIST_MEMBERS_GROUP = (id) =>
  API_HOST + "/group/members/list-members-group/" + id;
const API_LIST_MEMBERS_OFFICAL_GROUP = (id) =>
  API_HOST + "/group/members/list-members-offical-group/" + id;
const API_LIST_MEMBERS_UNAPPROVED_GROUP = (id) =>
  API_HOST + "/group/members/list-members-unapproved-group/" + id;
const API_CHECK_ROLE_MEMBER_GROUP = (id) =>
  API_HOST + "/group/members/check-role/" + id;
const API_INVITE_MEMBER_GROUP = (id) =>
  API_HOST + "/group/members/invited-group/" + id;
const API_ACCEPT_INVITE_MEMBER_GROUP = (id) =>
  API_HOST + "/group/members/accept-invited-group/" + id;
const API_REFUSE_INVITE_MEMBER_GROUP = (id) =>
  API_HOST + "/group/members/refuse-invited-group/" + id;

const API_DELETE_INVITE_MEMBER_GROUP = (id) =>
  API_HOST + "/group/members/delete-invited-group/" + id;
const API_SET_ADMIN_MEMBER_GROUP = (id) =>
  API_HOST + "/group/members/set-admin-group/" + id;
// api bài viết nhóm
const API_GROUP_POST_CREATE = (post_id) =>
  API_HOST + "/group/posts/create/" + post_id;
const API_LIST_GROUP_ACCEPTED_POST = (group_id) =>
  API_HOST + "/group/posts/list-post-accepted/" + group_id;
const API_LIST_GROUP_UNAPPROVED_POST = (group_id) =>
  API_HOST + "/group/posts/list-post-unapproved/" + group_id;
const API_ACCEPT_GROUP_POST = (group_id) =>
  API_HOST + "/group/posts/accepted-post/" + group_id;
const API_REFUSE_GROUP_POST = (group_id) =>
  API_HOST + "/group/posts/refused-post/" + group_id;
const API_LIST_MY_GROUP_POST = API_HOST + "/group/posts/list-post-all-group";

// POST API ENDPOINT
const API_CREATE_POST = API_HOST + "/post/create-post";
const API_DELETE_POST = (id) => `${API_HOST}/post/delete-post/${id}`;
const API_UPDATE_POST = (id) => `${API_HOST}/post/edit-post/${id}`;
const API_POST_DETAIL = (id) => `${API_HOST}/post/post-detail/${id}`;
const API_SHARE_POST = (id) => `${API_HOST}/post/share-post/${id}`;

const API_GET_POSTS = API_HOST + "/post/list-post";
const API_GET_POSTS_BY_ID = (id) => `${API_HOST}/post/list-post-by-user/${id}`;
const API_HEART_COMMENT_BY_COMMENT_ID = (id) =>
  `${API_HOST}/post/heart-comment/${id}`;

const API_HEART_SUB_COMMENT_BY_COMMENT_ID = (id) =>
  `${API_HOST}/post/heart-sub-comment/${id}`;
const API_POST_REACT_BY_ID = (id) => `${API_HOST}/post/create-react-post/${id}`;
const API_DELETE_REACT_BY_ID = (id) =>
  `${API_HOST}/post/delete-react-post/${id}`;
const API_CREATE_COMMENT_POST_BY_POST_ID = (id) =>
  `${API_HOST}/post/create-comment-post/${id}`;
const API_CREATE_SUB_COMMENT_BY_COMMENT_ID = (id) =>
  `${API_HOST}/post/create-sub-comment-post/${id}`;

const API_LIST_COMMENT_POST = (id) =>
  `${API_HOST}/post/list-comment-post/${id}`;

const API_DELETE_COMMENT_POST_BY_COMMENT_ID = (id) =>
  `${API_HOST}/post/delete-comment/${id}`;

const API_DELETE_SUB_COMMENT_POST_BY_SUB_COMMENT_ID = (id) =>
  `${API_HOST}/post/delete-sub-comment/${id}`;

// API ENDPOINT MARKETPLACE
const API_MARKETPLACE_CREATE = API_HOST + "/marketplace/create-product/";
const API_MARKETPLACE_GET_ALL = API_HOST + "/marketplace/get-all-product/";
const API_MARKETPLACE_SEARCH = API_HOST + "/marketplace/search-product/";
const API_MARKETPLACE_GET_BY_ID = (id) =>
  API_HOST + "/marketplace/get-product-by-id/" + id;
const API_MARKETPLACE_DELETE_BY_ID = (id) =>
  API_HOST + "/marketplace/delete-product-by-id/" + id;

const API_MARKETPLACE_UPDATE_BY_ID = (id) =>
  API_HOST + "/marketplace/update-product-by-id/" + id;

//SEARCH API ENDPOINT
const API_SEARCH_USERS = API_HOST + "/search-page/users";
const API_SEARCH_GROUP = API_HOST + "/search-page/groups";
const API_SEARCH_POST = API_HOST + "/search-page/posts";

////// NOTIFICATION API ENDPOINT
const API_CREATE_NOTIFICATION = API_HOST + "/notices/create-notice";
const API_DELETE_NOTIFICATION_BY_ID = (id) =>
  API_HOST + "/notices/delete-notice/" + id;
const API_LIST_NOTIFICATION = API_HOST + "/notices/list-notice";
const API_DELETE_ALL_NOTIFICATION = API_HOST + "/notices/delete-all";
const API_DELETE_ALL_NOTICE_CURRRENT =
  API_HOST + "/notices/delete-notice-current";

const API_POST_CONFIRM_PURCHASE = API_HOST + "/confirm-purchase";

export {
  API_SIGNUP_POST,
  API_SIGNUP_SOCIALNETWORK_POST,
  API_LOGIN_POST,
  API_LOGOUT,
  API_ROTATION_TOKEN,
  API_DECODE_TOKEN,
  API_GET_USER_SETTING,
  API_UPDATE_USER_SETTING,
  API_GET_ALL_USERS,
  API_GET_USER_BY_ID,
  API_GET_INFO_USER_PROFILE_BY_ID,
  API_GET_INFO_OWNER_PROFILE_BY_ID,
  API_CREATE_FACE_RECOGNITION_BY_ID,
  API_GET_FACE_RECOGNITION_BY_ID,
  API_DELETE_FACE_RECOGNITION_BY_ID,
  API_LOGIN_FACE_RECOGNITION,
  API_ALL_FACE_RECOGNITION,
  API_ALL_FACE_RECOGNITION_BY_USER_ID_ENCODE,
  API_UPDATE_USER,
  API_UPDATE_USER_PASSWORD,
  API_DELETE_USER,
  API_CHECK_EXIST_USER,
  API_PROFILE_HEART_GET,
  API_PROFILE_HEART_CREATE,
  API_PROFILE_HEART_DELETE,
  API_CREATE_OTP,
  API_CREATE_LINK_OTP,
  API_CREATE_OTP_SIGNUP,
  API_VERIFY_OTP,
  API_FRIEND_ACCEPT,
  API_FRIEND_DELETE,
  API_FRIEND_LIST,
  API_FRIEND_LIST_REQUEST,
  API_FRIEND_REQUEST,
  API_FRIEND_STATUS,
  API_CREATE_KEYSPAIR,
  API_GET_PRIVATE_KEY,
  API_IS_EXIST_KEYSPAIR,
  API_DELETE_KEYS_PAIR,
  API_SEND_MESSAGE,
  API_GET_ALL_MESSAGE,
  API_GET_ALL_CONVERSATION,
  API_CHECK_KEYSPAIR,
  API_GROUP_CREATE,
  API_LIST_GROUP_BY_OWNER,
  API_LIST_GROUP_BY_USERID,
  API_GROUP_DETAIL,
  API_DELETE_ALL_MESSAGE,
  API_DELETE_MESSAGE,
  API_DELETE_MESSAGE_OWNER_SIDE,
  API_CREATE_HEART_STORY,
  API_CREATE_STORY,
  API_LIST_STORY,
  API_STORY_BY_ID,
  API_STORIES_BY_ID,
  API_DELETE_STORY,
  API_GET_ALL_PROFILE_MEDIA_BY_ID,
  API_LIST_MEMBERS_GROUP,
  API_LIST_MEMBERS_OFFICAL_GROUP,
  API_LIST_MEMBERS_UNAPPROVED_GROUP,
  API_CHECK_ROLE_MEMBER_GROUP,
  API_INVITE_MEMBER_GROUP,
  API_FRIEND_SUGGEST,
  API_LIST_MY_STORY,
  API_FRIEND_DATE_OF_BIRTH,
  API_ACCEPT_INVITE_MEMBER_GROUP,
  API_REFUSE_INVITE_MEMBER_GROUP,
  API_DELETE_INVITE_MEMBER_GROUP,
  API_SET_ADMIN_MEMBER_GROUP,
  API_DELETE_GROUP,
  API_UPDATE_GROUP,
  API_CREATE_POST,
  API_DELETE_POST,
  API_UPDATE_POST,
  API_POST_DETAIL,
  API_GET_POSTS,
  API_GET_POSTS_BY_ID,
  API_GROUP_POST_CREATE,
  API_LIST_GROUP_ACCEPTED_POST,
  API_LIST_GROUP_UNAPPROVED_POST,
  API_ACCEPT_GROUP_POST,
  API_REFUSE_GROUP_POST,
  API_POST_REACT_BY_ID,
  API_DELETE_REACT_BY_ID,
  API_LIST_MY_GROUP_POST,
  API_CREATE_COMMENT_POST_BY_POST_ID,
  API_CREATE_SUB_COMMENT_BY_COMMENT_ID,
  API_LIST_COMMENT_POST,
  API_SHARE_POST,
  API_HEART_COMMENT_BY_COMMENT_ID,
  API_HEART_SUB_COMMENT_BY_COMMENT_ID,
  API_DELETE_COMMENT_POST_BY_COMMENT_ID,
  API_DELETE_SUB_COMMENT_POST_BY_SUB_COMMENT_ID,
  API_MARKETPLACE_CREATE,
  API_MARKETPLACE_GET_ALL,
  API_MARKETPLACE_GET_BY_ID,
  API_MARKETPLACE_DELETE_BY_ID,
  API_MARKETPLACE_UPDATE_BY_ID,
  API_MARKETPLACE_SEARCH,
  API_SEARCH_USERS,
  API_SEARCH_GROUP,
  API_SEARCH_POST,
  API_CREATE_NOTIFICATION,
  API_DELETE_NOTIFICATION_BY_ID,
  API_LIST_NOTIFICATION,
  API_DELETE_ALL_NOTIFICATION,
  API_DELETE_ALL_NOTICE_CURRRENT,
  API_FRIEND_CREATE_BLOCK,
  API_FRIEND_CHECK_BLOCK,
  API_FRIEND_DELETE_BLOCK,
  API_COUNT_MANUAL_FRIEND,
  API_AUTH_TOKEN,
  API_POST_CONFIRM_PURCHASE
};
