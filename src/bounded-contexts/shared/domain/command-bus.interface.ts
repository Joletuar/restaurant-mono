export interface Command {
  readonly _id: string;
  readonly _name: string;
  readonly _metadata?: Record<string, unknown>;
}

export interface CommandHandler {
  handle<T extends Command>(cmd: T): Promise<void>;
}

export interface CommandMiddleware {
  _name: string;

  execute<T extends Command>(
    cmd: T,
    next: (cmd: T) => Promise<void>
  ): Promise<void>;
}

export interface CommandBus {
  dispatch<T extends Command>(cmd: T): Promise<void>;
  register(commandName: string, handler: CommandHandler): void;
  addMiddleware(middleware: CommandMiddleware): void;
}
