import { mapState } from 'vuex';
import DiscMixer from '../DiscMixer';

export default {
  name: 'MixerControls',
  components: {
    DiscMixer,
  },
  computed: {
    ...mapState({
      discs: state => state.disc.discs,
    }),
  },
};
