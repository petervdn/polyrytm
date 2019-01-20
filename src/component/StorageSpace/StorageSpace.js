import { TweenLite } from 'gsap';

export default {
	name: 'StorageSpace',
	props: ['max', 'used'],
	mounted() {
		this.animatedPercentage = this.percentage;
	},
	data() {
		return {
			animatedPercentage: 0,
		};
	},
	watch: {
		percentage() {
			TweenLite.to(this, 1, { animatedPercentage: this.percentage });
		},
	},
	computed: {
		percentage() {
			return this.used / this.max * 100;
		},
	},
};
