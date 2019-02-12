// @vue/component
import { mapActions, mapGetters, mapState, mapMutations } from 'vuex';
import { interactionStore } from '../../store/module/interaction/interaction';
import { discStore } from '../../store/module/disc/disc';

export default {
  name: 'DiscSoundSelector',
  data() {
    return {
      selectedSampleIndex: -1,
    };
  },
  computed: {
    ...mapGetters({
      selectedDisc: interactionStore.GET_SELECTED_DISC,
    }),
    ...mapState({
      samples: state => state.sample.samples,
    }),
  },
  methods: {
    onSoundClick(sound) {
      this.setSelection(sound);
    },
    onSoundMouseEnter(sound) {
      this.setHighlight(sound);
    },
    onSoundMouseLeave() {
      this.setHighlight(null);
    },
    onSelectChange(event) {
      const index = parseInt(event.target.value, 10);

      if (index === -1) return; // nothing selected

      // todo sample is loaded again when leaving editor? (probably because waveform is redrawn)
      const sample = this.samples[index];
      this.addSampleToDisc({ disc: this.selectedDisc, sample });
      // todo check if this sound hasnt been added yet (or should that be possible?)
    },
    ...mapMutations({
      setSelection: interactionStore.SET_SELECTION,
      setHighlight: interactionStore.SET_HIGHLIGHT,
    }),
    ...mapActions({
      addSampleToDisc: discStore.ADD_SAMPLE_TO_DISC,
    }),
  },
};
