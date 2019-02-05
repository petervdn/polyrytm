import { mapActions, mapState } from 'vuex';
import SampleManagerItem from '../SampleManagerItem';
import { sampleStore } from '../../store/module/sample/sample';
import { removeFileFromStorage } from '../../firebase/storageUtils';

// @vue/component
export default {
  name: 'SampleManager',
  components: { SampleManagerItem },
  data() {
    return {
      canUpload: true,
    };
  },
  computed: {
    ...mapState({
      samples: state => state.sample.samples,
    }),
  },
  mounted() {
    this.fileSelect = this.$refs.fileSelect;
  },
  methods: {
    deleteSample(sample) {
      console.log(sample);
      removeFileFromStorage(sample.path).then(() => {
        console.log('done');
      });
      /*
      var storage = firebase.storage();

// Create a storage reference from our storage service
var storageRef = storage.ref();
       */
    },
    onFileSelectionChange() {
      Array.from(this.fileSelect.files).forEach(file => {
        this.uploadFileAsSample(file);
      });

      this.$refs.fileSelect.value = null;
    },
    ...mapActions({
      uploadFileAsSample: sampleStore.UPLOAD_FILE_AS_SAMPLE,
    }),
    onAddSamplesClick() {
      this.fileSelect.click();
    },
  },
};
