import { lazy } from 'react';

const ChatMessengerPage = lazy(() => import("../page/ChatPage/chat_page"));
const CreateFaceRecognitionPage = lazy(() => import("../page/FaceRecognitionPage/CreateFaceRecognition/create_face_recognition"));
const LoginFaceRecognitionPage = lazy(() => import("../page/FaceRecognitionPage/LoginFaceRecognition/login_face_recognition"));
const ForgotPasswordPage = lazy(() => import("../page/ForgotPassword/forgot_password"));
const CreateGroupPage = lazy(() => import("../page/GroupPage/CreateGroup/create_group"));
const EditInfoGroupPage = lazy(() => import("../page/GroupPage/EditInfoGroup/edit_info_group"));
const GroupAdminPage = lazy(() => import("../page/GroupPage/GroupAdmin/group_admin"));
const GroupAdminMemberPage = lazy(() => import("../page/GroupPage/GroupAdminMember/group_admin_member"));
const GroupHomePage = lazy(() => import("../page/GroupPage/GroupHome/group_home"));
const GroupMemberPage = lazy(() => import("../page/GroupPage/GroupMember/group_member"));
const ListPostGroupPage = lazy(() => import("../page/GroupPage/ListPostGroup/list_post_group"));
const HomePage = lazy(() => import("../page/Home/home_page"));
const LoginPage = lazy(() => import("../page/LoginPage/login_page"));
const Logout = lazy(() => import("../page/Logout/log_out"));
const CreateProductPage = lazy(() => import("../page/MarketplacePage/MarketplaceCreate/marketplace_create"));
const MarketplaceDetail = lazy(() => import("../page/MarketplacePage/MarketplaceDetail/marketplace_detail"));
const EditProductPage = lazy(() => import("../page/MarketplacePage/MarketplaceEdit/marketplace_edit"));
const MarketplaceSearchPage = lazy(() => import("../page/MarketplacePage/MarketplaceSearch/marketplace_search"));
const PostDetail = lazy(() => import("../page/PostPage/PostDetail/post_detail"));
const EditPost = lazy(() => import("../page/PostPage/PostEdit/post_edit"));
const ProfileEditor = lazy(() => import("../page/ProfilePage/ProfileEditor/profile_editor"));
const ProfileFriend = lazy(() => import("../page/ProfilePage/ProfileFriends/profile_friends"));
const ProfileGroup = lazy(() => import("../page/ProfilePage/ProfileGroup/profile_group"));
const ProfilePage = lazy(() => import("../page/ProfilePage/ProfileHome/profile_page"));
const ProfileImage = lazy(() => import("../page/ProfilePage/ProfileImage/profile_image"));
const ProfileLiked = lazy(() => import("../page/ProfilePage/ProfileLiked/profile_liked"));
const ProfileRequest = lazy(() => import("../page/ProfilePage/ProfileRequest/profile_request"));
const ProfileStoreStory = lazy(() => import("../page/ProfilePage/ProfileStoreStory/profile_store_story"));
const SearchPage = lazy(() => import("../page/SearchPage/search_page"));
const SettingPage = lazy(() => import("../page/SettingPage/setting_page"));
const SignupPage = lazy(() => import("../page/SignupPage/signup_page"));
const CreateStoryImagePreview = lazy(() => import("../page/StoriesPage/CreateStoryPage/CreateStoryImagePreview/create_story_image_preview"));
const CreateStoryTextPreview = lazy(() => import("../page/StoriesPage/CreateStoryPage/CreateStoryTextPreview/create_story_text_preview"));
const CreateStoryPage = lazy(() => import("../page/StoriesPage/CreateStoryPage/create_story_page"));
const StoriesPage = lazy(() => import("../page/StoriesPage/stories_page"));
const VideoCall = lazy(() => import("../page/VideoCall/video_call"));



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
    component: <SettingPage titlePage="Cài đặt | Vibe" />,
  },
  {
    path: '/login/face-recognition/',
    exact: true,
    requireAuth: false,
    component: <LoginFaceRecognitionPage titlePage="Đăng nhập Nhận diện khuôn mặt | Vibe" />,
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
    component: <ForgotPasswordPage titlePage="Quên mật khẩu | Vibe" />,
  },
  {
    path: '/signup',
    exact: true,
    requireAuth: false,
    component: <SignupPage titlePage="Đăng kí | Vibe" />,
  },
  {
    path: '/face-recognition/create',
    exact: true,
    requireAuth: true,
    component: <CreateFaceRecognitionPage titlePage="Tạo Nhận diện khuôn mặt | Vibe" />,
  },
  {
    path: '/messenger/:id_receiver_param',
    exact: true,
    requireAuth: true,
    component: <ChatMessengerPage titlePage="Nhắn tin | Vibe" />,
  },
  {
    path: '/messenger',
    exact: true,
    requireAuth: true,
    component: <ChatMessengerPage titlePage="Nhắn tin | Vibe" />,
  },
  {
    path: '/messenger/video-call',
    exact: true,
    requireAuth: true,
    component: <VideoCall titlePage="Cuộc gọi video | Vibe" />,
  },
  {
    path: '/messenger/audio-call',
    exact: true,
    requireAuth: true,
    component: <VideoCall isVideoCall={false} titlePage="Cuộc gọi thoại | Vibe" />,
  },
  {
    path: '/search',
    exact: true,
    requireAuth: true,
    component: <SearchPage titlePage="Tìm kiếm | Vibe" />,
  }



];

export default routes;
