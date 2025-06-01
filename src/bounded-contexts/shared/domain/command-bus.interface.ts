export interface Command {
  readonly _id: string;
  readonly _metadata?: Record<string, unknown>;
}

export interface CommandHandler<T extends Command> {
  handle(cmd: T): Promise<void>;
}

export interface CommandMiddleware {
  execute<T extends Command>(
    cmd: T,
    next: (cmd: T) => Promise<void>
  ): Promise<void>;
}

export interface CommandClass {
  new (...args: any[]): Command;
}

export interface CommandBus {
  register<T extends Command>(
    cmd: CommandClass,
    handler: CommandHandler<T>
  ): void;
  dispatch<T extends Command>(cmd: T): Promise<void>;
  addMiddleware(middleware: CommandMiddleware): void;
}
