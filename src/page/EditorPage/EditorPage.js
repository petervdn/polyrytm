import { mapState, mapGetters } from 'vuex';
import DiscControls from '../../component/DiscControls';
import RingControls from '../../component/RingControls';
import ThemeControls from '../../component/ThemeControls';
import SampleControls from '../../component/SampleControls';
import ShareControls from '../../component/ShareControls';
import MixerControls from '../../component/MixerControls';
import { interactionStore } from '../../store/module/interaction/interaction';

const MenuItems = {
  DISC: 'disc',
  RING: 'ring',
  MIXER: 'mixer',
  THEME: 'theme',
  SHARE: 'share',
};

export default {
  name: 'EditorPage',
  components: {
    DiscControls,
    ThemeControls,
    RingControls,
    SampleControls,
    ShareControls,
    MixerControls,
  },
  data() {
    return {
      activeMenuItem: MenuItems.DISC,
      menuItems: [
        {
          label: 'disc',
          id: MenuItems.DISC,
        },
        {
          label: 'ring',
          id: MenuItems.RING,
        },
        {
          label: 'mixer',
          id: MenuItems.MIXER,
        },
        {
          label: 'theme',
          id: MenuItems.THEME,
        },
        {
          label: 'share',
          id: MenuItems.SHARE,
        },
      ],
    };
  },
  created() {
    this.MenuItems = MenuItems;
  },
  watch: {
    selectedDisc(value) {
      if (value) {
        this.activeMenuItem = MenuItems.DISC;
      }
    },
    selectedRing(value) {
      if (value) {
        this.activeMenuItem = MenuItems.RING;
      }
    },
  },
  methods: {
    setActiveMenuItem(item) {
      this.activeMenuItem = item.id;
    },
  },
  computed: {
    ...mapGetters({
      selectedDisc: interactionStore.GET_SELECTED_DISC,
      selectedRing: interactionStore.GET_SELECTED_RING,
    }),
    ...mapState('interaction', ['selection']),
  },
};
