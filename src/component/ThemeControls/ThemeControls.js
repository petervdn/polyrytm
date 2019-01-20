import { mapState } from 'vuex';
import { themeStore } from 'store/module/theme/theme';
import Slider from 'component/Slider/Slider';

export default {
	name: 'ThemeControls',
	components: {
		Slider,
	},
	mounted() {
		this.localThemeIndex = this.themes.indexOf(this.activeTheme);
	},
	methods: {},
	data() {
		return {
			localThemeIndex: -1,
		};
	},
	watch: {
		localThemeIndex() {
			this.$store.commit(themeStore.mutations.updateActiveTheme, this.themes[this.localThemeIndex]);
		},
	},
	computed: {
		...mapState({
			activeTheme: state => state.theme.activeTheme,
			themes: state => state.theme.themes,
		}),
	},
};
