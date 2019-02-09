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
    onDeleteSample(sample) {
      this.$confirm(`Do you really want to delete ${sample.name}?`).then(() => {
        this.deleteSampleFromDatabase(sample);
      });
    },
    onFileSelectionChange() {
      Array.from(this.fileSelect.files).forEach(file => {
        this.uploadFileAsSample(file);
      });

      this.$refs.fileSelect.value = null;
    },
    ...mapActions({
      uploadFileAsSample: sampleStore.UPLOAD_FILE_AS_SAMPLE,
      deleteSampleFromDatabase: sampleStore.DELETE_SAMPLE_FROM_DATABASE,
    }),
    onAddSamplesClick() {
      this.fileSelect.click();
    },
  },
};
