import { mapState } from 'vuex';
import { TweenLite, Expo } from 'gsap';

// todo handle a notification that has nothing set

export default {
  name: 'Notification',
  data() {
    return {
      animatedProgress: 0,
    };
  },
  methods: {
    onOkButtonClick() {
      this.notification.resolve(true);
    },
    onCancelButtonClick() {
      this.notification.resolve(false);
    },
  },
  watch: {
    notification() {
      // when there is a progress, start a small fake increase of progress
      // (prettier than the bar staying empty for a while)
      if (this.notification && typeof this.notification.progress !== 'undefined') {
        this.animatedProgress = 0; // avoids progress being 1 from a previous notification
        TweenLite.to(this, 3, { animatedProgress: 0.05 });
      }
    },
    animatedProgress(value) {
      if (value >= 1) {
        this.notification.resolve();
      }
    },
    'notification.progress': function(value) {
      // dont tween zeros, it will interfere with the fake progress tween
      if (value > 0) {
        TweenLite.killTweensOf(this);
        // sine we have a fake start of the progressbar, it can go back when real data comes in
        const tweenToValue = Math.max(this.animatedProgress, value);
        TweenLite.to(this, 0.8, { animatedProgress: tweenToValue, ease: Expo.easeOut });
      }
    },
  },
  computed: {
    ...mapState('notification', ['notification']),
  },
};
