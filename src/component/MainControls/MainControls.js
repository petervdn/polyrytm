import DiscSelector from 'component/DiscSelector';
import RingSelector from 'component/RingSelector';
import { mapState, mapMutations, mapGetters } from 'vuex';
import { schedulerStore } from '../../store/module/scheduler/scheduler';
import { settingStore } from '../../store/module/setting/setting';
import PlayMode from '../../data/enum/PlayMode';
import { interactionStore } from '../../store/module/interaction/interaction';
import { attachHintToElement } from '../../util/interactionUtils';

export default {
	name: 'MainControls',
	components: {
		DiscSelector,
		RingSelector,
	},
	mounted() {
		// todo destruct
		attachHintToElement(this.$refs.wrapper, null, this.$store); // forces an empty hint when mouse over this area
		attachHintToElement(this.$refs.playLabel, 'play/stop', this.$store);
		attachHintToElement(this.$refs.modeLabel, 'switch between a rotating disc and a static disc', this.$store);
		attachHintToElement(
			this.$refs.secRevLabel,
			'seconds per revolution, the time it takes for the disc(s) to rotate (one global setting)',
			this.$store,
		);
		attachHintToElement(this.$refs.discsLabel, 'select and create discs', this.$store);
		attachHintToElement(this.$refs.ringsLabel, 'select and create rings for the current disc', this.$store);
	},
	computed: {
		...mapState({
			isPlaying: state => state.scheduler.isPlaying,
			secondsPerRevolution: state => state.scheduler.secondsPerRevolution,
			playMode: state => state.setting.playMode,
		}),
		...mapGetters({
			hint: interactionStore.getters.hint,
			selectedDisc: interactionStore.getters.selectedDisc,
		}),
	},
	methods: {
		...mapMutations({
			setPlayMode: settingStore.mutations.setPlayMode,
		}),
		togglePlayMode() {
			this.setPlayMode(this.playMode === PlayMode.ROTATE ? PlayMode.STATIC : PlayMode.ROTATE);
		},
		start() {
			this.$scheduler.start();
		},
		stop() {
			this.$scheduler.stop();
		},
		updateSecondsPerRevolution(event) {
			// todo check valid value (and update field)
			this.$store.commit(schedulerStore.mutations.setSecondsPerRevolution, parseFloat(event.target.value));
		},
	},
};
