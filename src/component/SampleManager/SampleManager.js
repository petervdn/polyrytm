import { mapActions, mapState } from 'vuex';
import SampleManagerItem from '../SampleManagerItem';
import { sampleStore } from '../../store/module/sample/sample';

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
