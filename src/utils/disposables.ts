export class DisposableBag {
  private disposers: Array<() => void> = [];

  add(dispose: () => void) {
    this.disposers.push(dispose);
  }

  dispose() {
    this.disposers.forEach((fn) => fn());
    this.disposers = [];
  }
}
