import VueTypes from 'vue-types';
import { mapState } from 'vuex';
import { uploadToStorage } from '../../firebase/storageUtils';
import firebaseConfig from '../../firebase/enum/firebaseConfig';
import SampleManagerItemState from '../../data/enum/SampleManagerItemState';
import { db } from '../../firebase/firebaseUtils';

// @vue/component
export default {
  name: 'SampleManagerItem',
  props: {
    item: VueTypes.shape({
      name: VueTypes.string.isRequired,
      path: VueTypes.string.def(''),
      size: VueTypes.number.isRequired,
      uploadData: VueTypes.shape({
        state: VueTypes.string,
        file: VueTypes.instanceOf(File),
      }),
    }),
  },
  computed: {
    ...mapState({
      userId: state => state.user.userId,
    }),
  },
  mounted() {
    if (
      this.item.uploadData &&
      this.item.uploadData.state === SampleManagerItemState.WAITING_TO_UPLOAD
    ) {
      // todo check if file-prop exists?
      const path = `${firebaseConfig.storage.SAMPLES}/${this.userId}`;

      this.setUploadState(SampleManagerItemState.UPLOADING);
      uploadToStorage(this.item.uploadData.file, path, progress => {
        console.log(progress);
      }).then(() => {
        this.setUploadState(SampleManagerItemState.WAITING_FOR_DB_ENTRY);
        const samplesRef = db.collection(firebaseConfig.firestore.collection.SAMPLES);
        samplesRef.where('path', '==', `${path}/${this.item.name}`).onSnapshot(snapshot => {
          if (snapshot.size === 1) {
            this.setUploadState(SampleManagerItemState.ADDED);
          }
        });
      });
    }
  },
  methods: {
    setUploadState(state) {
      this.$emit('uploadStateChange', state);
    },
  },
};
