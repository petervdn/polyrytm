import { sampleStore } from '../../store/module/sample/sample';
import { audioContext } from '../../util/soundUtils';

export default {
  name: 'SampleLoader',
  data() {
    return {
      isDraggingOverDropArea: false,
      isLoading: false,
    };
  },
  mounted() {
    this.fileReader = new FileReader();
    this.fileReader.addEventListener('loadend', this.handleLoadEnd);
  },
  methods: {
    onDragOver() {
      this.isDraggingOverDropArea = true;
    },
    onDragLeave() {
      this.isDraggingOverDropArea = false;
    },
    onFileDrop(event) {
      if (this.isLoading) return;

      this.isDraggingOverDropArea = false;

      if (event.dataTransfer.files.length === 1) {
        this.isLoading = true;
        // eslint-disable-next-line
        this.loadingFile = event.dataTransfer.files[0];

        this.fileReader.readAsArrayBuffer(this.loadingFile);
      }
    },
    handleLoadEnd() {
      audioContext.decodeAudioData(this.fileReader.result, audioBuffer => {
        // sound decoded
        this.isLoading = false;

        this.$store.commit(sampleStore.mutations.addSample, {
          name: this.loadingFile.name,
          audioBuffer,
        });
      });
    },
  },
};
