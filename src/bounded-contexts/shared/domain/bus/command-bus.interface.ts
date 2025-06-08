export interface Command {
  readonly _id: string;
  readonly _metadata?: Record<string, unknown>;
}

export interface CommandHandler<T extends Command> {
  handle(cmd: T): Promise<void>;
}

export interface CommandMiddleware {
  execute(cmd: Command, next: (cmd: Command) => Promise<void>): Promise<void>;
}

export interface CommandClass {
  new (...args: any[]): Command;
}

export interface CommandBus {
  register(cmd: CommandClass, handler: CommandHandler<Command>): void;
  dispatch(cmd: Command): Promise<void>;
  addMiddleware(middleware: CommandMiddleware): void;
}
