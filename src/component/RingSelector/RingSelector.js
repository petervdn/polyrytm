import { mapMutations, mapGetters } from 'vuex';
import { discStore } from '../../store/module/disc/disc';
import { createDefaultRing } from '../../util/discUtils';
import { interactionStore } from '../../store/module/interaction/interaction';

export default {
  name: 'RingSelector',
  computed: {
    ...mapGetters({
      selectedDisc: interactionStore.GET_SELECTED_DISC,
      selectedRing: interactionStore.GET_SELECTED_RING,
    }),
  },
  methods: {
    ...mapMutations({
      setSelection: interactionStore.SET_SELECTION,
    }),
    addRing() {
      this.$store.commit(discStore.ADD_RING, {
        disc: this.selectedDisc,
        ring: createDefaultRing(this.selectedDisc),
      });
    },
  },
};
