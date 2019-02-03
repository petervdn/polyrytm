import { mapState } from 'vuex';
import SampleManagerItem from '../SampleManagerItem';
import SampleManagerItemState from '../../data/enum/SampleManagerItemState';
import {
  createSampleManagerItemFromFile,
  createSampleManagerItemFromSample,
} from '../../util/sampleUtils';

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
    this.items = [...this.samples.map(createSampleManagerItemFromSample)];
  },
  methods: {
    onItemStateChange(item, state) {
      item.state = state;

      switch (state) {
        case SampleManagerItemState.UPLOADED: {
          break;
        }
        case SampleManagerItemState.UPLOADING: {
          break;
        }
        default: {
          throw new Error(`Unhandled state: ${state}`);
        }
      }
      console.log('item', item, 'state', state);
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
