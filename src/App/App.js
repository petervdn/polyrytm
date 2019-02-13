import { mapActions, mapState } from 'vuex';
import DiscView from '../component/DiscView';
import Notification from '../component/Notification';
import MainControls from '../component/MainControls';
import HeaderBar from '../component/HeaderBar';
import { staticColors } from '../util/colorUtils';
import { RouteNames } from '../router/routes';
import { discStore } from '../store/module/disc/disc';

export default {
  name: 'App',
  components: {
    HeaderBar,
    DiscView,
    Notification,
    MainControls,
  },
  mounted() {
    this.initDiscs();
    this.applyActiveTheme();
  },
  watch: {
    activeTheme() {
      this.applyActiveTheme();
    },
  },
  methods: {
    ...mapActions({
      initDiscs: discStore.INIT_DISCS,
    }),
    applyActiveTheme() {
      const html = document.querySelector('html');

      // todo handle in css?
      html.style.backgroundColor = this.activeTheme.invertUi
        ? staticColors.uiBright
        : staticColors.uiDark;
      html.style.color = this.activeTheme.invertUi ? staticColors.uiDark : staticColors.uiBright;
    },
  },
  computed: {
    isInEditor() {
      // todo move getter to store?
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
 - check all props (vuetypes)
- sample packs
 - upload samples
 - examples
 - upvotes (needs login)
- check all :key values (should NOT use index)

 */
