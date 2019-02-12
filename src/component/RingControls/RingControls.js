import { mapState, mapGetters, mapMutations } from 'vuex';
import { interactionStore } from '../../store/module/interaction/interaction';
import { discStore } from '../../store/module/disc/disc';
import { GlobalEvent, globalEventBus } from '../../data/globalEvents';
import { generateVolumes } from '../../util/ringUtils';

export default {
  name: 'RingControls',
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
      selectedRing: interactionStore.GET_SELECTED_RING,
    }),
  },
  methods: {
    ...mapMutations({
      setNumberOfRingItems: discStore.SET_NUMBER_OF_RING_ITEMS,
      setRingVolumes: discStore.SET_RING_VOLUMES,
    }),
    onRemoveClick() {
      // this.$store.commit(discStore.mutations.removeRing, this.selection.ring); // todo mapmutations
    },
    adjustRingItems(amount) {
      this.setNumberOfRingItems({
        amount,
        ring: this.selectedRing,
      });

      globalEventBus.$emit(GlobalEvent.RING_ITEMS_CHANGE, this.selectedRing);
    },
    adjustVolumes(type) {
      this.setRingVolumes({
        ring: this.selectedRing,
        volumes: generateVolumes(this.selectedRing.items, type),
      });

      globalEventBus.$emit(GlobalEvent.RING_ITEMS_CHANGE, this.selectedRing);
    },
  },
};
