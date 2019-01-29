import { mapState, mapMutations, mapGetters } from 'vuex';
import { discStore } from '../../store/module/disc/disc';
import { interactionStore } from '../../store/module/interaction/interaction';

export default {
  name: 'DiscSelector',
  computed: {
    ...mapState('disc', ['discs']),
    ...mapGetters({
      selectedDisc: interactionStore.getters.selectedDisc,
    }),
  },
  methods: {
    ...mapMutations({
      addDisc: discStore.mutations.addDisc,
      setSelection: interactionStore.mutations.setSelection,
    }),
  },
};
