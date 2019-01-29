import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';
import SampleLoader from '../SampleLoader';
import { discStore } from '../../store/module/disc/disc';
import { notificationStore } from '../../store/module/notification/notification';
import { interactionStore } from '../../store/module/interaction/interaction';

export default {
  name: 'SampleSelector',
  components: {
    SampleLoader,
  },
  mounted() {},
  data() {
    return {
      selectedSampleIndex: -1,
    };
  },
  watch: {
    selectedDisc() {
      this.selectedSampleIndex = this.samples.indexOf(this.selectedDisc.sound.sample);
    },
  },
  methods: {
    onSelectChange(event) {
      const index = parseInt(event.target.value, 10);

      if (index === -1) {
        // deselect sample
        // this.setSampleForDisc({ disc: this.selectedDisc, sample: null });
      } else {
        // select a sample
        const sample = this.samples[index];
        if (!sample.audioBuffer) {
          // sample needs to be loaded, show notification
          this.showNotification({
            progress: 0,
            title: 'Loading...',
            message: `Sample: ${sample.name}`,
          });
        }
        this.addSampleToDisc({
          sample,
          disc: this.selectedDisc,
          onProgress: value => {
            // todo dont pass this when not loading?
            this.setNotificationProgress(value);
          },
        });
      }
    },
    ...mapActions({
      setSampleForDisc: discStore.actions.setSampleForDisc,
      addSampleToDisc: discStore.actions.addSampleToDisc,
      showNotification: notificationStore.actions.showNotification,
      hideNotification: notificationStore.actions.hideNotification,
    }),
    ...mapMutations({
      setNotificationProgress: notificationStore.mutations.setNotificationProgress,
    }),
  },
  computed: {
    ...mapState({
      samples: state => state.sample.samples,
    }),
    ...mapGetters({
      selectedDisc: interactionStore.getters.selectedDisc,
    }),
  },
};
