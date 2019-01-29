import { mapState, mapMutations } from 'vuex';
import { themeStore } from '../../store/module/theme/theme';
import Slider from '../Slider/Slider';

export default {
  name: 'ThemeControls',
  components: {
    Slider,
  },
  mounted() {
    this.localThemeIndex = this.themes.indexOf(this.activeTheme);
  },
  data() {
    return {
      localThemeIndex: -1,
    };
  },
  watch: {
    localThemeIndex() {
      this.setActiveTheme(this.themes[this.localThemeIndex]);
    },
  },
  methods: {
    ...mapMutations({
      setActiveTheme: themeStore.SET_ACTIVE_THEME,
    }),
  },
  computed: {
    ...mapState({
      activeTheme: state => state.theme.activeTheme,
      themes: state => state.theme.themes,
    }),
  },
};
