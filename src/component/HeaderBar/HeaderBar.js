import * as firebase from 'firebase/app';
import { mapGetters, mapState } from 'vuex';
import { userStore } from '../../store/module/user/user';

export default {
  name: 'HeaderBar',
  computed: {
    ...mapGetters({
      isLoggedIn: userStore.IS_LOGGED_IN,
    }),
    ...mapState('theme', ['activeTheme']),
    ...mapState({
      userId: state => state.user.userId,
      isAdmin: state => state.user.isAdmin,
    }),
  },
  methods: {
    logout() {
      firebase.auth().signOut();
    },
  },
};
