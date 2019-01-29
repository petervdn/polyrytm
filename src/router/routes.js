import HomePage from '../page/HomePage';
import EditorPage from '../page/EditorPage';
import LoginPage from '../page/LoginPage';
import PlayPage from '../page/PlayPage';
import UserPage from '../page/UserPage';
import SamplesPage from '../page/SamplesPage';
import UserHome from '../component/UserHome';
import Params from '../data/enum/Params';

export const RouteNames = {
  HOME: 'home',
  LOGIN: 'login',
  EDITOR: 'editor',
  USER_HOME: 'user-home',
  ME: 'me',
  PLAY: 'play',
  SAMPLES: 'samples',
};

export default [
  {
    path: '/',
    component: HomePage,
    name: RouteNames.HOME,
  },
  {
    path: '/login',
    component: LoginPage,
    name: RouteNames.LOGIN,
  },
  {
    path: '/editor',
    component: EditorPage,
    name: RouteNames.EDITOR,
  },
  {
    path: `/user/:${Params.USER_ID}`,
    component: UserPage,
    children: [
      {
        path: '/',
        component: UserHome,
        name: RouteNames.USER_HOME,
      },
    ],
  },
  {
    path: `/play/:${Params.RYTM_ID}`,
    component: PlayPage,
    name: RouteNames.PLAY,
  },
  {
    path: '/samples',
    component: SamplesPage,
    name: RouteNames.SAMPLES,
  },
];
