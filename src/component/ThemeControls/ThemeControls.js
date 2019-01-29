import { mapState, mapMutations } from 'vuex';
import { appStore } from '../../store/module/app/app';
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
      setActiveTheme: appStore.SET_ACTIVE_THEME,
    }),
  },
  computed: {
    ...mapState({
      activeTheme: state => state.app.activeTheme,
      themes: state => state.app.themes,
    }),
  },
};
