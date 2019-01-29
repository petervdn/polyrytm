import { mapState, mapGetters, mapMutations } from 'vuex';
import SampleSelector from '../SampleSelector';
import { interactionStore } from '../../store/module/interaction/interaction';
import { discStore } from '../../store/module/disc/disc';
import { GlobalEvent } from '../../data/globalEvents';
import { generateVolumes } from '../../util/ringUtils';

export default {
  name: 'RingControls',
  components: {
    SampleSelector,
  },
  mounted() {},
  data() {
    return {
      newRingItemsVolumeMode: 'random', // todo enum
    };
  },
  computed: {
    ...mapState({
      sequences: state => state.disc.sequences,
      selection: state => state.interaction.selection,
    }),
    ...mapGetters({
      selectedRing: interactionStore.getters.selectedRing,
    }),
  },
  methods: {
    ...mapMutations({
      updateNumberOfRingItems: discStore.mutations.updateNumberOfRingItems,
      updateRingVolumes: discStore.mutations.updateRingVolumes,
    }),
    onRemoveClick() {
      // this.$store.commit(discStore.mutations.removeRing, this.selection.ring); // todo mapmutations
    },
    adjustRingItems(amount) {
      this.updateNumberOfRingItems({
        amount,
        ring: this.selectedRing,
      });

      this.$eventBus.$emit(GlobalEvent.RING_ITEMS_CHANGE, this.selectedRing);
    },
    adjustVolumes(type) {
      this.updateRingVolumes({
        ring: this.selectedRing,
        volumes: generateVolumes(this.selectedRing.items, type),
      });

      this.$eventBus.$emit(GlobalEvent.RING_ITEMS_CHANGE, this.selectedRing);
    },
  },
};
