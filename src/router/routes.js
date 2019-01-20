import HomePage from 'page/HomePage';
import EditorPage from 'page/EditorPage';
import LoginPage from 'page/LoginPage';
import PlayPage from 'page/PlayPage';
import UserPage from 'page/UserPage';
import SamplesPage from 'page/SamplesPage';
import UserHome from 'component/UserHome';
import PagePaths from 'data/enum/PagePaths';
import PageNames from 'data/enum/PageNames';

export default [
	{
		path: PagePaths.HOME,
		component: HomePage,
		name: PageNames.HOME,
	},
	{
		path: PagePaths.LOGIN,
		component: LoginPage,
		name: PageNames.LOGIN,
	},
	{
		path: PagePaths.EDITOR,
		component: EditorPage,
		name: PageNames.EDITOR,
	},
	{
		path: PagePaths.USER,
		component: UserPage,
		children: [
			{
				path: '/',
				component: UserHome,
				name: PageNames.USER_HOME,
			},
		],
	},
	{
		path: PagePaths.PLAY,
		component: PlayPage,
		name: PageNames.PLAY,
	},
	{
		path: PagePaths.SAMPLES,
		component: SamplesPage,
		name: PageNames.SAMPLES,
	},
];
