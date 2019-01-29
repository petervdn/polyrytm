import { TweenLite } from 'gsap';
import { mapState, mapGetters } from 'vuex';
import DiscViewItem from '../DiscViewItem';
import { getSizeData } from '../../util/DiscViewUtils';
import { interactionStore } from '../../store/module/interaction/interaction';
import { RouteNames } from '../../router/routes';

export default {
  name: 'DiscView',
  components: {
    DiscViewItem,
  },
  mounted() {
    window.addEventListener('resize', () => {
      this.updateSizeData();
    });

    // todo must be a better way
    this.tweenObj = {
      leftOffset: this.leftOffset,
      scale: this.scale,
    };

    this.updateSizeData();
  },
  data() {
    return {
      sizeData: null,
      leftOffset: 0,
      scale: 1,
    };
  },
  methods: {
    updateSizeData() {
      this.sizeData = getSizeData(this.$refs.wrapper);
      this.updatePositions(true);
    },
    updatePositions(immediate) {
      if (this.discs.length === 0) {
        // on init
        return;
      }

      if (this.selectedDisc) {
        const discIndex = this.discs.indexOf(this.selectedDisc);
        const zeroPosition = this.sizeData.center.x - this.sizeData.halfSquareSize;

        const leftOffset = zeroPosition - discIndex * this.sizeData.squareSize;

        const tweenTime = immediate || this.discs.length === 1 ? 0 : 0.2;
        TweenLite.to(this.tweenObj, tweenTime, {
          leftOffset,
          scale: 1,
          onUpdate: () => {
            this.leftOffset = this.tweenObj.leftOffset;
            this.scale = this.tweenObj.scale;
          },
        });
      } else {
        // no disc selected = zoomed out view. need to know how much to scale-down to make it fit
        const discsWidth = this.discs.length * this.sizeData.squareSize;
        const availableWidth = this.sizeData.size.width;
        const scale = Math.min(availableWidth / discsWidth, 1); // never grow larger

        const tweenTime = immediate || this.discs.length === 1 ? 0 : 0.2;
        TweenLite.to(this.tweenObj, tweenTime, {
          scale,
          leftOffset: -(0.5 * (1 - scale) * this.sizeData.squareSize), // took me a while :/
          onUpdate: () => {
            this.leftOffset = this.tweenObj.leftOffset;
            this.scale = this.tweenObj.scale;
          },
        });
      }
    },
  },
  watch: {
    discs() {
      this.updatePositions();
    },
    selectedDisc() {
      this.updatePositions();
    },
    $route() {
      setTimeout(() => this.updateSizeData());
    },
  },
  computed: {
    verticalTop() {
      return this.sizeData.size.height * 0.5 - this.sizeData.halfSquareSize;
    },
    ...mapState({
      discs: state => state.disc.discs,
      isPlaying: state => state.scheduler.isPlaying,
    }),
    ...mapGetters({
      selectedDisc: interactionStore.getters.selectedDisc,
    }),
    isInEditor() {
      return this.$route.name === RouteNames.EDITOR;
    },
  },
};
