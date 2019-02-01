import * as firebase from 'firebase/app';
import { mapState } from 'vuex';

export default {
  name: 'HeaderBar',
  computed: {
    ...mapState('user', ['user']),
    ...mapState('theme', ['activeTheme']),
  },
  methods: {
    logout() {
      firebase.auth().signOut();
    },
  },
};
