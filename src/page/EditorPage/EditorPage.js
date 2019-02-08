import { mapState, mapGetters } from 'vuex';
import DiscControls from '../../component/DiscControls';
import RingControls from '../../component/RingControls';
import ThemeControls from '../../component/ThemeControls';
import SampleControls from '../../component/SampleControls';
import ShareControls from '../../component/ShareControls';
import MixerControls from '../../component/MixerControls';
import { interactionStore } from '../../store/module/interaction/interaction';

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
      activeMenuItemId: 'disc',
      menuItems: [
        {
          label: 'S',
          id: 'disc',
        },
        {
          label: 'R',
          id: 'ring',
        },
        {
          label: 'M',
          id: 'mixer',
        },
        {
          label: 'V',
          id: 'theme',
        },
        {
          label: 'S',
          id: 'share', // todo create consts
        },
      ],
    };
  },
  watch: {
    selectedDisc(value) {
      if (value) {
        this.activeMenuItemId = 'disc';
      }
    },
    selectedRing(value) {
      if (value) {
        this.activeMenuItemId = 'ring';
      }
    },
  },
  methods: {
    setActiveMenuItem(item) {
      this.activeMenuItemId = item.id;
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
