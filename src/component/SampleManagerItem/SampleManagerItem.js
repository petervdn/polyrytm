import VueTypes from 'vue-types';
import { mapState } from 'vuex';
import SampleProcessingState from '../../data/enum/SampleProcessingState';

// @vue/component
export default {
  name: 'SampleManagerItem',
  props: {
    sample: VueTypes.shape({
      name: VueTypes.string.isRequired,
      path: VueTypes.string.def(''),
      size: VueTypes.number.isRequired,
      processingData: VueTypes.shape({
        progress: VueTypes.number,
        state: VueTypes.string,
      }),
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
    this.SampleProcessingState = SampleProcessingState;
  },
};
