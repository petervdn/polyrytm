import RingsRenderer from './RingsRenderer';
import WaveformRenderer from './WaveformRenderer';
import DiscInteractionManager from './DiscInteractionManager';

export default {
	name: 'DiscViewItem',
	props: ['sizeData', 'disc', 'index'],
	mounted() {
		// create both parts of the renderer
		this.waveformRenderer = new WaveformRenderer(this.disc, this.sizeData, this.$store, this.$scheduler);
		this.ringsRenderer = new RingsRenderer(this.disc, this.sizeData, this.$store, this.$scheduler);

		// interactionmanager should be tied to the element on top (otherwise no mouse events)
		this.interactionManager = new DiscInteractionManager(
			this.ringsRenderer.canvas,
			this.sizeData,
			this.disc,
			this.$store,
		);

		// add
		this.$refs.container.appendChild(this.waveformRenderer.canvas);
		this.$refs.container.appendChild(this.ringsRenderer.canvas);
	},
	watch: {
		sizeData() {
			this.waveformRenderer.resize(this.sizeData);
			this.ringsRenderer.resize(this.sizeData);
			this.interactionManager.resize(this.sizeData);
		},
		disc() {
			// this happens when a disc is remove, vue reuses the existing components and re-distributes the discs
			this.waveformRenderer.setDisc(this.disc);
			this.ringsRenderer.setDisc(this.disc);
			this.interactionManager.setDisc(this.disc);
		},
	},
};
