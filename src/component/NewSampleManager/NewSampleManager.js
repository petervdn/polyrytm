import { mapState } from 'vuex';
import SampleManagerItem from '../SampleManagerItem';
import { createSampleManagerItemFromFile } from '../../util/sampleUtils';
import SampleManagerItemState from '../../data/enum/SampleManagerItemState';

// @vue/component
export default {
  name: 'NewSampleManager',
  components: { SampleManagerItem },
  data() {
    return {
      canUpload: true,
      items: [],
    };
  },
  computed: {
    ...mapState({
      samples: state => state.sample.samples,
    }),
  },
  mounted() {
    this.fileSelect = this.$refs.fileSelect;
    this.items = [...this.samples];
  },
  methods: {
    onItemUploadStateChange(item, state) {
      // todo move all this to store
      if (state === SampleManagerItemState.ADDED) {
        const { uploadData, ...newItem } = item;
        this.items.splice(this.items.indexOf(item), 1, newItem);
      } else {
        item.uploadData.state = state;
      }
    },
    onFileSelectionChange() {
      const items = Array.from(this.fileSelect.files).map(createSampleManagerItemFromFile);
      this.items.push(...items);

      this.$refs.fileSelect.value = null;
    },
    addSamples() {
      // todo set correct auth rules on storage
      this.fileSelect.click();
    },
  },
};
