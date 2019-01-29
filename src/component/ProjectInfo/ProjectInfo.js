import { mapState } from 'vuex';

export default {
  name: 'ProjectInfo',
  computed: {
    ...mapState({
      activeTheme: state => state.app.activeTheme,
    }),
    ...mapState('project', ['name', 'author', 'link']),
    styleObject() {
      if (!this.activeTheme) {
        return {};
      }

      return {
        infoColor: this.activeTheme.displayInfo,
      };
    },
  },
};
