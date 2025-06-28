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

export interface CommandClass<T extends Command = Command> {
  new (...args: any[]): T;
}

export interface CommandBus {
  register<T extends Command>(
    cmd: CommandClass<T>,
    handler: CommandHandler<T>
  ): void;

  dispatch<T extends Command>(cmd: T): Promise<void>;

  addMiddleware(middleware: CommandMiddleware): void;
}
