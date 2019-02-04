import VueTypes from 'vue-types';
import { mapState } from 'vuex';

// @vue/component
export default {
  name: 'SampleManagerItem',
  props: {
    sample: VueTypes.shape({
      name: VueTypes.string.isRequired,
      path: VueTypes.string.def(''),
      size: VueTypes.number.isRequired,
      uploadData: VueTypes.shape({
        progress: VueTypes.number,
        state: VueTypes.string,
        file: VueTypes.instanceOf(File),
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
};
