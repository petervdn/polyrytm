import { mapState } from 'vuex';
import DiscMixer from 'component/DiscMixer';

export default {
	name: 'MixerControls',
	components: {
		DiscMixer,
	},
	computed: {
		...mapState({
			discs: state => state.disc.discs,
		}),
	},
};
