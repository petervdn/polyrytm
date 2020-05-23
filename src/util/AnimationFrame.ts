export default class AnimationFrame {
  private callback: () => void;
  private requestAnimationFrameId: number = -1;

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
