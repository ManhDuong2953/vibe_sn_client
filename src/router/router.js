// routes.js

import HomePage from "../page/Home/home_page";
import StoriesPage from "../page/StoriesPage/stories_page";


const routes = [
  {
    path: '/',
    exact: true,
    component: <HomePage title="Vibe"/>,
  },

  {
    path: '/story/:story',
    exact: true,
    component: <StoriesPage title="Vibe"/>,
  },

];

export default routes;
