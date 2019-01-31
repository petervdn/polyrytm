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

      this.$eventBus.$emit(GlobalEvent.RING_ITEMS_CHANGE, this.selectedRing); // todo event bus doesnt seem to be set? also: why do we need it
    },
    adjustVolumes(type) {
      this.setRingVolumes({
        ring: this.selectedRing,
        volumes: generateVolumes(this.selectedRing.items, type),
      });

      this.$eventBus.$emit(GlobalEvent.RING_ITEMS_CHANGE, this.selectedRing);
    },
  },
};
