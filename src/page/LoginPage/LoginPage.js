import * as firebase from 'firebase';
import { mapState } from 'vuex';
import PagePaths from '../../data/enum/PagePaths';

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
		...mapState('user', ['user']),
	},
	methods: {
		login() {
			this.auth
				.signInWithEmailAndPassword(this.email, this.password)
				.then(() => {
					this.$router.push(PagePaths.HOME);
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