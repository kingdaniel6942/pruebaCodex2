export class Logger {
  static info(message: string, ...rest: unknown[]) {
    console.info(`[Dice] ${message}`, ...rest);
  }

  static warn(message: string, ...rest: unknown[]) {
    console.warn(`[Dice] ${message}`, ...rest);
  }

  static error(message: string, ...rest: unknown[]) {
    console.error(`[Dice] ${message}`, ...rest);
  }
}
