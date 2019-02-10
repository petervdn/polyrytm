import { mapGetters, mapState } from 'vuex';
import { userStore } from '../../store/module/user/user';
import { firebaseInstance } from '../../firebase/firebase';

export default {
  name: 'HeaderBar',
  computed: {
    ...mapGetters({
      isLoggedIn: userStore.IS_LOGGED_IN,
    }),
    ...mapState({
      theme: state => state.theme.activeTheme,
      userId: state => state.user.userId,
      isAdmin: state => state.user.isAdmin,
    }),
  },
  methods: {
    logout() {
      firebaseInstance.auth.signOut(); // todo do something with logout promise? (might fail)
    },
  },
};
