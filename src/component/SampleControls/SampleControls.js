import SampleLoader from 'component/SampleLoader';
import { mapState } from 'vuex';

export default {
	name: 'SampleControls',
	components: {
		SampleLoader,
	},
	computed: {
		...mapState({
			samples: state => state.sample.samples,
		}),
	},
};
