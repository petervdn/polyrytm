import { mapState } from 'vuex';
import { RouteNames } from '../../router/routes';
import { firebaseInstance } from '../../firebase/firebase';

export default {
  name: 'LoginPage',
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
    };
  },
  computed: {
    ...mapState({
      user: state => state.user.user,
    }),
  },
  methods: {
    login() {
      firebaseInstance.auth
        .signInWithEmailAndPassword(this.email, this.password)
        .then(() => {
          this.$router.push({ name: RouteNames.HOME });
        })
        .catch(error => {
          this.errorMessage = error.message;
        });
    },
    signup() {
      firebaseInstance.auth
        .createUserWithEmailAndPassword(this.email, this.password)
        .catch(error => {
          this.errorMessage = error.message;
        });
    },
  },
};
