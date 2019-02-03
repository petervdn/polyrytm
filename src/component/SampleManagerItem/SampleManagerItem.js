import VueTypes from 'vue-types';
import { mapState } from 'vuex';
import { uploadToStorage } from '../../firebase/storageUtils';
import firebaseConfig from '../../firebase/enum/firebaseConfig';
import SampleManagerItemState from '../../data/enum/SampleManagerItemState';

// @vue/component
export default {
  name: 'SampleManagerItem',
  // props: {
  //   item: VueTypes.any,
  // },
  props: {
    item: VueTypes.shape({
      name: VueTypes.string.isRequired,
      path: VueTypes.string.def(''),
      size: VueTypes.number.isRequired,
      state: VueTypes.string,
      file: VueTypes.instanceOf(File).def(undefined),
    }),
  },
  computed: {
    ...mapState({
      userId: state => state.user.userId,
    }),
  },
  mounted() {
    if (this.item.state === SampleManagerItemState.WAITING_TO_UPLOAD) {
      // todo check if file exists
      this.setState(SampleManagerItemState.UPLOADING);
      uploadToStorage(
        this.item.file,
        `${firebaseConfig.storage.SAMPLES}/${this.userId}`,
        progress => {
          console.log(progress);
        },
      ).then(() => {
        console.log('done');
        this.setState(SampleManagerItemState.UPLOADED);
      });
    }
  },
  methods: {
    setState(state) {
      this.$emit('stateChange', state);
    },
  },
};
