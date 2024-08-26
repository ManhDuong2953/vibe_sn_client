// routes.js

import ChatMessengerPage from "../page/ChatPage/chat_page";
import CreateFaceRecognitionPage from "../page/FaceRecognitionPage/CreateFaceRecognition/create_face_recognition";
import LoginFaceRecognitionPage from "../page/FaceRecognitionPage/LoginFaceRecognition/login_face_recognition";
import ForgotPasswordPage from "../page/ForgotPassword/forgot_password";
import CreateGroupPage from "../page/GroupPage/CreateGroup/create_group";
import EditInfoGroupPage from "../page/GroupPage/EditInfoGroup/edit_info_group";
import GroupAdminPage from "../page/GroupPage/GroupAdmin/group_admin";
import GroupAdminMemberPage from "../page/GroupPage/GroupAdminMember/group_admin_member";
import GroupHomePage from "../page/GroupPage/GroupHome/group_home";
import GroupMemberPage from "../page/GroupPage/GroupMember/group_member";
import ListPostGroupPage from "../page/GroupPage/ListPostGroup/list_post_group";
import HomePage from "../page/Home/home_page";
import LoginPage from "../page/LoginPage/login_page";
import Logout from "../page/Logout/log_out";
import CreateProductPage from "../page/MarketplacePage/MarketplaceCreate/marketplace_create";
import MarketplaceDetail from "../page/MarketplacePage/MarketplaceDetail/marketplace_detail";
import EditProductPage from "../page/MarketplacePage/MarketplaceEdit/marketplace_edit";
import MarketplaceSearchPage from "../page/MarketplacePage/MarketplaceSearch/marketplace_search";
import PostDetail from "../page/PostPage/PostDetail/post_detail";
import EditPost from "../page/PostPage/PostEdit/post_edit";
import ProfileEditor from "../page/ProfilePage/ProfileEditor/profile_editor";
import ProfileFriend from "../page/ProfilePage/ProfileFriends/profile_friends";
import ProfileGroup from "../page/ProfilePage/ProfileGroup/profile_group";
import ProfilePage from "../page/ProfilePage/ProfileHome/profile_page";
import ProfileImage from "../page/ProfilePage/ProfileImage/profile_image";
import ProfileLiked from "../page/ProfilePage/ProfileLiked/profile_liked";
import ProfileRequest from "../page/ProfilePage/ProfileRequest/profile_request";
import ProfileStoreStory from "../page/ProfilePage/ProfileStoreStory/profile_store_story";
import SearchPage from "../page/SearchPage/search_page";
import SettingPage from "../page/SettingPage/setting_page";
import SignupPage from "../page/SignupPage/signup_page";
import CreateStoryImagePreview from "../page/StoriesPage/CreateStoryPage/CreateStoryImagePreview/create_story_image_preview";
import CreateStoryTextPreview from "../page/StoriesPage/CreateStoryPage/CreateStoryTextPreview/create_story_text_preview";
import CreateStoryPage from "../page/StoriesPage/CreateStoryPage/create_story_page";
import StoriesPage from "../page/StoriesPage/stories_page";
import VideoCall from "../page/VideoCall/video_call";


const routes = [
  {
    path: '/',
    exact: true,
    requireAuth: true,
    component: <HomePage titlePage="Vibe" />,
  },


  //story
  {
    path: '/story/create',
    exact: true,
    requireAuth: true,
    component: <CreateStoryPage titlePage="Tạo tin | Vibe" />,
  },
  {
    path: '/story/create/preview/image',
    exact: true,
    requireAuth: true,
    component: <CreateStoryImagePreview titlePage="Xem trước tin | Vibe" />,
  },
  {
    path: '/story/create/preview/text',
    exact: true,
    requireAuth: true,
    component: <CreateStoryTextPreview titlePage="Xem trước tin | Vibe" />,
  },
  {
    path: '/story/:story_id',
    exact: true,
    requireAuth: true,
    component: <StoriesPage titlePage="Tin | Vibe" />,
  },

  //post
  {
    path: '/post/:post_id',
    exact: true,
    requireAuth: true,
    component: <PostDetail titlePage="Bài viết | Vibe" />,
  },
  {
    path: '/post/:post_id/edit',
    exact: true,
    requireAuth: true,
    component: <EditPost titlePage="Bài viết | Vibe" />,
  },

  //profile
  {
    path: '/profile/:user_id',
    exact: true,
    requireAuth: true,
    component: <ProfilePage titlePage="Trang cá nhân | Vibe" />,
  },
  {
    path: '/profile/:user_id/image',
    exact: true,
    requireAuth: true,
    component: <ProfileImage titlePage="Trang cá nhân | Vibe" />,
  },
  {
    path: '/profile/:user_id/friends',
    exact: true,
    requireAuth: true,
    component: <ProfileFriend titlePage="Trang cá nhân | Vibe" />,
  },
  {
    path: '/profile/:user_id/group',
    exact: true,
    requireAuth: true,
    component: <ProfileGroup titlePage="Trang cá nhân | Vibe" />,
  },
  {
    path: '/profile/:user_id/liked',
    exact: true,
    requireAuth: true,
    component: <ProfileLiked titlePage="Trang cá nhân | Vibe" />,
  },
  {
    path: '/profile/:user_id/request-add--fr',
    exact: true,
    requireAuth: true,
    component: <ProfileRequest titlePage="Trang cá nhân | Vibe" />,
  },
  {
    path: '/profile/edit',
    exact: true,
    requireAuth: true,
    component: <ProfileEditor titlePage="Trang cá nhân | Vibe" />,
  },
  {
    path: '/profile/:user_id/store-story',
    exact: true,
    requireAuth: true,
    component: <ProfileStoreStory titlePage="Trang cá nhân | Vibe" />,
  },


  {
    path: '/group/',
    exact: true,
    requireAuth: true,
    component: <ListPostGroupPage titlePage="Nhóm | Vibe" />,
  },
  {
    path: '/group/create',
    exact: true,
    requireAuth: true,
    component: <CreateGroupPage titlePage="Nhóm | Vibe" />,
  },
  {
    path: '/group/:group_id',
    exact: true,
    requireAuth: true,
    component: <GroupHomePage titlePage="Nhóm | Vibe" />,
  },
  {
    path: '/group/:group_id/members',
    exact: true,
    requireAuth: true,
    component: <GroupMemberPage titlePage="Nhóm | Vibe" />,
  },
  {
    path: '/group/:group_id/admin',
    exact: true,
    requireAuth: true,
    component: <GroupAdminPage titlePage="Nhóm | Vibe" />,
  },
  {
    path: '/group/:group_id/admin/member',
    exact: true,
    requireAuth: true,
    component: <GroupAdminMemberPage titlePage="Nhóm | Vibe" />,
  },
  {
    path: '/group/:group_id/admin/edit',
    exact: true,
    requireAuth: true,
    component: <EditInfoGroupPage titlePage="Nhóm | Vibe" />,
  },

  {
    path: '/marketplace',
    exact: true,
    requireAuth: true,
    component: <MarketplaceSearchPage titlePage="Chợ | Vibe" />,
  },
  {
    path: '/marketplace/create',
    exact: true,
    requireAuth: true,
    component: <CreateProductPage titlePage="Chợ | Vibe" />,
  },
  {
    path: '/marketplace/product/detail/:id_product',
    exact: true,
    requireAuth: true,
    component: <MarketplaceDetail titlePage="Chợ | Vibe" />,
  },
  {
    path: '/marketplace/product/detail/:id_product/edit',
    exact: true,
    requireAuth: true,
    component: <EditProductPage titlePage="Chợ | Vibe" />,
  },
  {
    path: '/setting',
    exact: true,
    requireAuth: true,
    component: <SettingPage titlePage="Chợ | Vibe" />,
  },
  {
    path: '/login/face-recognition/',
    exact: true,
    requireAuth: false,
    component: <LoginFaceRecognitionPage titlePage="Chợ | Vibe" />,
  },
  {
    path: '/login',
    exact: true,
    requireAuth: false,
    component: <LoginPage titlePage="Đăng nhập | Vibe" />,
  },
  {
    path: '/logout',
    exact: true,
    requireAuth: true,
    component: <Logout titlePage="Đăng xuất | Vibe" />,
  },
  {
    path: '/login/forgot-password',
    exact: true,
    requireAuth: false,
    component: <ForgotPasswordPage titlePage="Chợ | Vibe" />,
  },
  {
    path: '/signup',
    exact: true,
    requireAuth: false,
    component: <SignupPage titlePage="Chợ | Vibe" />,
  },
  {
    path: '/face-recognition/create',
    exact: true,
    requireAuth: true,
    component: <CreateFaceRecognitionPage titlePage="Chợ | Vibe" />,
  },
  {
    path: '/messenger/:id',
    exact: true,
    requireAuth: true,
    component: <ChatMessengerPage titlePage="Chợ | Vibe" />,
  },
  {
    path: '/messenger/video-call',
    exact: true,
    requireAuth: true,
    component: <VideoCall titlePage="Chợ | Vibe" />,
  },
  {
    path: '/messenger/audio-call',
    exact: true,
    requireAuth: true,
    component: <VideoCall isVideoCall={false} titlePage="Chợ | Vibe" />,
  },
  {
    path: '/search',
    exact: true,
    requireAuth: true,
    component: <SearchPage titlePage="Chợ | Vibe" />,
  }



];

export default routes;
