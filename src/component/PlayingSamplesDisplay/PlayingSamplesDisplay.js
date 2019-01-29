import { mapState } from 'vuex';
import { drawArcPath } from '../../util/drawUtils';
import { PI2 } from '../../util/miscUtils';
import { audioContext } from '../../util/soundUtils';

export default {
  name: 'PlayingSamplesDisplay',
  props: ['sizeData'],
  inject: ['scheduler'],
  mounted() {
    this.context = this.$refs.canvas.getContext('2d');
  },
  methods: {
    draw() {
      if (!this.scheduler || !this.scheduler.samplePlayer) {
        return;
      }
      this.context.clearRect(0, 0, this.sizeData.size, this.sizeData.size);

      this.scheduler.samplePlayer.playingSamples.forEach(playingSample => {
        // dont play if sample has ended
        if (playingSample.bufferSource.isFinished) {
          return;
        }

        // todo check destructuring
        const { currentTime } = audioContext;

        // dont play if it hasnt started
        if (playingSample.startTime > currentTime) {
          return;
        }

        // only play samples from the active sequence
        if (playingSample.sequence !== this.activeSequence) {
          return;
        }

        const playedDuration = currentTime - playingSample.startTime;
        const playedDurationFactor = playedDuration / playingSample.bufferSource.buffer.duration;
        const startFactor = playingSample.sliceStartFactor;
        const endFactor = startFactor + playingSample.sliceDurationFactor;
        const progressFactor = startFactor + playedDurationFactor;

        if (progressFactor > endFactor) {
          return;
        }

        // draw arc for sample
        drawArcPath(
          this.context,
          this.sizeData.halfSize,
          this.sizeData.halfSize,
          startFactor * PI2 + this.sizeData.rotateOffset,
          progressFactor * PI2 + this.sizeData.rotateOffset,
          this.sizeData.sampleOuterRadius,
          this.sizeData.sampleInnerRadius,
        );

        this.context.fillStyle = 'rgba(0,195,255, 0.5)';
        this.context.fill();
      });
    },
  },
  watch: {
    sizeData() {
      this.$refs.canvas.width = this.sizeData.size;
      this.$refs.canvas.height = this.sizeData.size;

      this.draw();
    },
    isPlaying() {
      const frameCall = () => {
        this.draw();
        if (this.isPlaying) {
          requestAnimationFrame(frameCall);
        }
      };

      requestAnimationFrame(frameCall);
    },
  },
  computed: {
    ...mapState({
      isPlaying: state => state.main.isPlaying,
      activeSequence: state => state.sequence.activeSequence,
    }),
  },
};
