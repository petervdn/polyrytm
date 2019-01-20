import Params from 'data/enum/Params';

export default {
	HOME: '/',
	LOGIN: '/login',
	EDITOR: '/editor',
	USER: `/user/:${Params.USER_ID}`,
	ME: '/me',
	PLAY: `/play/:${Params.RYTM_ID}`,
	SAMPLES: '/samples',
};
