export default class AnimationFrame {
	private callback: () => void;
	private requestAnimationFrameId: number;

	constructor(callback: () => void) {
		this.callback = callback;
	}

	public start() {
		this.requestAnimationFrameId = requestAnimationFrame(this.update);
	}

	public stop() {
		cancelAnimationFrame(this.requestAnimationFrameId);
	}

	update = () => {
		this.callback();

		this.requestAnimationFrameId = requestAnimationFrame(this.update);
	};
}
