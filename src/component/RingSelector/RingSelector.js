import { mapMutations, mapGetters } from 'vuex';
import { discStore } from '../../store/module/disc/disc';
import { createDefaultRing } from '../../util/discUtils';
import { interactionStore } from '../../store/module/interaction/interaction';

export default {
	name: 'RingSelector',
	computed: {
		...mapGetters({
			selectedDisc: interactionStore.getters.selectedDisc,
			selectedRing: interactionStore.getters.selectedRing,
		}),
	},
	methods: {
		...mapMutations({
			setSelection: interactionStore.mutations.setSelection,
		}),
		addRing() {
			this.$store.commit(discStore.mutations.addRing, {
				disc: this.selectedDisc,
				ring: createDefaultRing(this.selectedDisc),
			});
		},
	},
};
