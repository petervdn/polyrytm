import { mapState, mapMutations, mapGetters, mapActions } from 'vuex';
import SampleSelector from '../SampleSelector';
import DiscSound from '../DiscSound';
import { discStore } from '../../store/module/disc/disc';
import { createSlices } from '../../util/discUtils';
import { schedulerStore } from '../../store/module/scheduler/scheduler';
import { interactionStore } from '../../store/module/interaction/interaction';
import { notificationStore } from '../../store/module/notification/notification';

export default {
  name: 'DiscControls',
  components: {
    SampleSelector,
    DiscSound,
  },
  computed: {
    ...mapState({
      discs: state => state.disc.discs,
    }),
    ...mapGetters({
      selectedDisc: interactionStore.getters.selectedDisc,
    }),
  },
  methods: {
    // todo when slices change, check if disc has non-existing slices
    ...mapMutations({
      updateSlicesForDisc: discStore.UPDATE_SLICES_FOR_DISC,
      setSecondsPerRevolution: schedulerStore.mutations.setSecondsPerRevolution,
    }),
    onRemoveClick() {
      this.showNotification({
        title: 'Remove disc',
        message: 'Are you sure you want to remove the current disc?',
        okButton: 'yes',
        cancelButton: 'no',
      }).then(result => {
        if (result) {
          this.removeDisc(this.selectedDisc);
        }
      });
    },
    matchTime() {
      this.setSecondsPerRevolution(this.selectedDisc.sound.sample.audioBuffer.duration);
    },
    updateSlices(event) {
      this.updateSlicesForDisc({
        disc: this.selectedDisc,
        slices: createSlices(this.selectedDisc, parseInt(event.target.value, 10)),
      });
    },
    ...mapActions({
      removeDisc: discStore.REMOVE_DISC,
      showNotification: notificationStore.actions.showNotification,
    }),
  },
};
