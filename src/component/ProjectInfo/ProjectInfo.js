import { mapState } from 'vuex';

export default {
	name: 'ProjectInfo',
	computed: {
		...mapState({
			activeColorTheme: state => state.theme.activeColorTheme,
		}),
		...mapState('project', ['name', 'author', 'link']),
		styleObject() {
			if (!this.activeColorTheme) {
				return {};
			}

			return {
				infoColor: this.activeColorTheme.displayInfo,
			};
		},
	},
};
