// routes.js

import CreateGroupPage from "../page/GroupPage/CreateGroup/create_group";
import GroupHomePage from "../page/GroupPage/GroupHome/group_home";
import HomePage from "../page/Home/home_page";
import PostDetail from "../page/PostPage/PostDetail/post_detail";
import EditPost from "../page/PostPage/PostEdit/post_edit";
import ProfileEditor from "../page/ProfilePage/ProfileEditor/profile_editor";
import ProfileFriend from "../page/ProfilePage/ProfileFriends/profile_friends";
import ProfileGroup from "../page/ProfilePage/ProfileGroup/profile_group";
import ProfileImage from "../page/ProfilePage/ProfileImage/profile_image";
import ProfileLiked from "../page/ProfilePage/ProfileLiked/profile_liked";
import ProfileRequest from "../page/ProfilePage/ProfileRequest/profile_request";
import ProfileStoreStory from "../page/ProfilePage/ProfileStoreStory/profile_store_story";
import ProfilePage from "../page/ProfilePage/profile_page";
import CreateStoryImagePreview from "../page/StoriesPage/CreateStoryPage/CreateStoryImagePreview/create_story_image_preview";
import CreateStoryTextPreview from "../page/StoriesPage/CreateStoryPage/CreateStoryTextPreview/create_story_text_preview";
import CreateStoryPage from "../page/StoriesPage/CreateStoryPage/create_story_page";
import StoriesPage from "../page/StoriesPage/stories_page";


const routes = [
  {
    path: '/',
    exact: true,
    component: <HomePage titlePage="Vibe"/>,
  },


  //story
  {
    path: '/story/create',
    exact: true,
    component: <CreateStoryPage titlePage="Tạo tin | Vibe"/>,
  },
  {
    path: '/story/create/preview/image',
    exact: true,
    component: <CreateStoryImagePreview titlePage="Xem trước tin | Vibe"/>,
  },
  {
    path: '/story/create/preview/text',
    exact: true,
    component: <CreateStoryTextPreview titlePage="Xem trước tin | Vibe"/>,
  },
  {
    path: '/story/:story_id',
    exact: true,
    component: <StoriesPage titlePage="Tin | Vibe"/>,
  },

  //post
  {
    path: '/post/:post_id',
    exact: true,
    component: <PostDetail titlePage="Bài viết | Vibe"/>,
  },
  {
    path: '/post/:post_id/edit',
    exact: true,
    component: <EditPost titlePage="Bài viết | Vibe"/>,
  },

  //profile
  {
    path: '/profile/:user_id',
    exact: true,
    component: <ProfilePage titlePage="Trang cá nhân | Vibe"/>,
  },
  {
    path: '/profile/:user_id/image',
    exact: true,
    component: <ProfileImage titlePage="Trang cá nhân | Vibe"/>,
  },
  {
    path: '/profile/:user_id/friends',
    exact: true,
    component: <ProfileFriend titlePage="Trang cá nhân | Vibe"/>,
  },
  {
    path: '/profile/:user_id/group',
    exact: true,
    component: <ProfileGroup titlePage="Trang cá nhân | Vibe"/>,
  },
  {
    path: '/profile/:user_id/liked',
    exact: true,
    component: <ProfileLiked titlePage="Trang cá nhân | Vibe"/>,
  },
  {
    path: '/profile/:user_id/request-add--fr',
    exact: true,
    component: <ProfileRequest titlePage="Trang cá nhân | Vibe"/>,
  },
  {
    path: '/profile/:user_id/edit',
    exact: true,
    component: <ProfileEditor titlePage="Trang cá nhân | Vibe"/>,
  },
  {
    path: '/profile/:user_id/store-story',
    exact: true,
    component: <ProfileStoreStory titlePage="Trang cá nhân | Vibe"/>,
  },

  {
    path: '/group/create',
    exact: true,
    component: <CreateGroupPage titlePage="Nhóm | Vibe"/>,
  },
  {
    path: '/group/:group_id',
    exact: true,
    component: <GroupHomePage titlePage="Nhóm | Vibe"/>,
  }

];

export default routes;
