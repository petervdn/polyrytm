import { mapState, mapMutations, mapGetters } from 'vuex';
import { discStore } from '../../store/module/disc/disc';
import { interactionStore } from '../../store/module/interaction/interaction';
import { createDefaultDisc } from '../../util/discUtils';

export default {
  name: 'DiscSelector',
  computed: {
    ...mapState({
      discs: state => state.disc.discs,
    }),
    ...mapGetters({
      selectedDisc: interactionStore.GET_SELECTED_DISC,
    }),
  },
  methods: {
    onAddDiscClick() {
      this.addDisc(createDefaultDisc());
    },
    ...mapMutations({
      addDisc: discStore.ADD_DISC,
      setSelection: interactionStore.SET_SELECTION,
    }),
  },
};
