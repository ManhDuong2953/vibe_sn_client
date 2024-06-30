// routes.js

import HomePage from "../page/Home/home_page";
import CreateStoryImagePreview from "../page/StoriesPage/CreateStoryPage/CreateStoryImagePreview/create_story_image_preview";
import CreateStoryPage from "../page/StoriesPage/CreateStoryPage/create_story_page";
import StoriesPage from "../page/StoriesPage/stories_page";


const routes = [
  {
    path: '/',
    exact: true,
    component: <HomePage title="Vibe"/>,
  },

  {
    path: '/story/create',
    exact: true,
    component: <CreateStoryPage title="Tạo tin | Vibe"/>,
  },
  {
    path: '/story/create/preview',
    exact: true,
    component: <CreateStoryImagePreview title="Tạo tin | Vibe"/>,
  },
  {
    path: '/story/:story',
    exact: true,
    component: <StoriesPage title="Tin | Vibe"/>,
  },

];

export default routes;
