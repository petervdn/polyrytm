import VueTypes from 'vue-types';
import { mapState } from 'vuex';
import SampleState from '../../data/enum/SampleState';

// @vue/component
export default {
  name: 'SampleManagerItem',
  props: {
    sample: VueTypes.shape({
      name: VueTypes.string.isRequired,
      path: VueTypes.string.def(''),
      size: VueTypes.number.isRequired,
      state: VueTypes.string.isRequired,
      uploadProgress: VueTypes.number.def(0),
      // loadProgress: VueTypes.number.isRequired,
      audioBuffer: VueTypes.instanceOf(AudioBuffer),
    }),
  },

  data() {
    return {
      progress: 0,
    };
  },
  computed: {
    ...mapState({
      userId: state => state.user.userId,
    }),
  },
  created() {
    this.SampleState = SampleState;
  },
};
