import { mapState } from 'vuex';
import DiscView from '../component/DiscView';
import Notification from '../component/Notification';
import MainControls from '../component/MainControls';
import HeaderBar from '../component/HeaderBar';
import { staticColors } from '../util/colorUtils';
import { RouteNames } from '../router/routes';

export default {
  name: 'App',
  components: {
    HeaderBar,
    DiscView,
    Notification,
    MainControls,
  },
  mounted() {
    this.applyActiveTheme();
  },
  watch: {
    activeTheme() {
      this.applyActiveTheme();
    },
  },
  methods: {
    applyActiveTheme() {
      const html = document.querySelector('html');

      html.style.backgroundColor = this.activeTheme.invertUi
        ? staticColors.uiBright
        : staticColors.uiDark;
      html.style.color = this.activeTheme.invertUi ? staticColors.uiDark : staticColors.uiBright;
    },
  },
  computed: {
    isInEditor() {
      return this.$route.name === RouteNames.EDITOR;
    },
    ...mapState({
      activeTheme: state => state.app.activeTheme,
      // uiBright: state => state.theme.activeTheme, todo ??
    }),
  },
};

/**

 - customize theme (colors, ring positions, spacing)
 - Sharing
 - share image
 - mixer
 - effects (delay, reverb)
 - sample explorer
 - click = slice preview
 - multiple samples per disc
 - phone playable
 - give project a name
 - about page
 - no alpha for ringitem flashes
 - links to fb/twitter
 - randomize
 - drag slices
 - flashes when slices play
 - optimize schedule stuff
 - play button

 - upload samples
 - examples
 - upvotes (needs login)


 */
