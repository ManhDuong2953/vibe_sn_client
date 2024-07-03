// routes.js

import HomePage from "../page/Home/home_page";
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
    path: '/story/:story',
    exact: true,
    component: <StoriesPage titlePage="Tin | Vibe"/>,
  },

];

export default routes;
