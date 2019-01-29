import { mapState } from 'vuex';
import SampleLoader from '../SampleLoader';

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
