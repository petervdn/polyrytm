import SampleManagerItem from '../SampleManagerItem';
import SampleManagerItemState from '../../data/enum/SampleManagerItemState';

const createItemFromFile = file => ({
  file,
  name: file.name,
  // size: file.size,
  state: SampleManagerItemState.WAITING_TO_UPLOAD,
});

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
  mounted() {
    this.fileSelect = this.$refs.fileSelect;
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
      const items = Array.from(this.fileSelect.files).map(createItemFromFile);
      this.items.push(...items);

      this.$refs.fileSelect.value = null;
    },
    addSamples() {
      // todo set correct auth rules on storage
      this.fileSelect.click();
    },
  },
};
