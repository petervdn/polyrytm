import { mapState, mapActions, mapGetters } from 'vuex';
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
  methods: {
    onSelectChange(event) {
      const index = parseInt(event.target.value, 10);

      if (index === -1) return; // nothing selected

      // todo sample is loaded again when leaving editor? (probably because waveform is redrawn)
      const sample = this.samples[index];
      this.addSampleToDisc({ disc: this.selectedDisc, sample }); // todo immediately add, then load?
      // todo check if this sound hasnt been added yet (or should that be possible?)
    },
    ...mapActions({
      addSampleToDisc: discStore.ADD_SAMPLE_TO_DISC,
      showNotification: notificationStore.actions.showNotification,
      hideNotification: notificationStore.actions.hideNotification,
    }),
  },
  computed: {
    ...mapState({
      samples: state => state.sample.samples,
    }),
    ...mapGetters({
      selectedDisc: interactionStore.GET_SELECTED_DISC,
    }),
  },
};
