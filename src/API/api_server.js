const API_HOST = 'http://localhost:2953/api';

// User account API endpoints
const API_SIGNUP_POST = API_HOST + '/users/account/signup';
const API_SIGNUP_SOCIALNETWORK_POST = API_HOST + '/users/account/social-network/signup';
const API_LOGIN_POST = API_HOST + '/users/account/login';
const API_GET_ALL_USERS = API_HOST + '/users/account/all';
const API_GET_USER_BY_ID = (id) => `${API_HOST}/users/account/info/${id}`;
const API_UPDATE_USER_PASSWORD = `${API_HOST}/users/account/reset-password`;
const API_DELETE_USER = (id) => `${API_HOST}/users/account/delete/${id}`;
const API_CHECK_EXIST_USER = (id) => `${API_HOST}/users/account/is-existed/${id}`;

//User Setting
const API_GET_USER_SETTING = (id) => `${API_HOST}/users/setting/get-setting/${id}`;
const API_UPDATE_USER_SETTING = (id) => `${API_HOST}/users/setting/update-setting/${id}`;

// User infomanation API endpoint
const API_GET_INFO_USER_PROFILE_BY_ID = (id) => `${API_HOST}/users/info-profile/${id}`;
const API_UPDATE_USER = (id) => `${API_HOST}/users/update-profile/${id}`;
const API_GET_INFO_OWNER_PROFILE_BY_ID = `${API_HOST}/users/info-profile/`;


//User face recognition profile
const API_CREATE_FACE_RECOGNITION_BY_ID = id => `${API_HOST}/users/face-recognition/create-face-recognition/${id}`;
const API_GET_FACE_RECOGNITION_BY_ID = id => `${API_HOST}/users/face-recognition/get-face-recognition/${id}`;
const API_DELETE_FACE_RECOGNITION_BY_ID = id => `${API_HOST}/users/face-recognition/delete-face-recognition/${id}`;
const API_ALL_FACE_RECOGNITION = `${API_HOST}/users/face-recognition/get-all-face-recognition`;
const API_LOGIN_FACE_RECOGNITION = `${API_HOST}/users/face-recognition/login-face-recognition`;


//Token
const API_LOGOUT = API_HOST + '/token/delete';
const API_ROTATION_TOKEN = API_HOST + '/token/create';
const API_DECODE_TOKEN = API_HOST + '/token/decode-refresh-token';


// OTP API endpoints
const API_CREATE_OTP = API_HOST + '/otp/create';
const API_CREATE_LINK_OTP = API_HOST + '/otp/link/create';
const API_CREATE_OTP_SIGNUP = API_HOST + '/otp/signup/create';
const API_VERIFY_OTP = API_HOST + '/otp/verify';

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
    API_UPDATE_USER,
    API_UPDATE_USER_PASSWORD,
    API_DELETE_USER,
    API_CHECK_EXIST_USER,

    API_CREATE_OTP,
    API_CREATE_LINK_OTP,
    API_CREATE_OTP_SIGNUP,
    API_VERIFY_OTP
};
