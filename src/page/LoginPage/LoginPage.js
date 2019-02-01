import * as firebase from 'firebase/app';
import 'firebase/auth';
import { mapState } from 'vuex';
import { RouteNames } from '../../router/routes';

export default {
  name: 'LoginPage',
  mounted() {
    this.auth = firebase.auth();
  },
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
      this.auth
        .signInWithEmailAndPassword(this.email, this.password)
        .then(() => {
          this.$router.push({ name: RouteNames.HOME });
        })
        .catch(error => {
          this.errorMessage = error.message;
        });
    },
    signup() {
      this.auth.createUserWithEmailAndPassword(this.email, this.password).catch(error => {
        this.errorMessage = error.message;
      });
    },
  },
};
