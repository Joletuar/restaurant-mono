export interface Command {
  readonly commandName: string;
  readonly id: string;
  readonly metadata?: Record<string, unknown>;
}

export interface CommandHandler {
  handle<T extends Command>(cmd: T): Promise<void>;
}

export interface CommandMiddleware {
  commandMiddlewareName: string;

  execute<T extends Command>(
    cmd: T,
    next: (cmd: T) => Promise<void>
  ): Promise<void>;
}

export interface CommandBus {
  dispatch<T extends Command>(cmd: T): Promise<void>;
  register<T extends Command>(cmd: T, handler: CommandHandler): void;
  addMiddleware(middleware: CommandMiddleware): void;
}
