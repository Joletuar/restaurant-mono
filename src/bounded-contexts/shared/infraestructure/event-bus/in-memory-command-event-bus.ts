import {
  Command,
  CommandBus,
  CommandHandler,
  CommandMiddleware,
} from '@src/bounded-contexts/shared/domain/command-bus.interface';

export class InMemoryCommandBus implements CommandBus {
  private handlers: Map<string, CommandHandler<any>> = new Map();
  private middlewares: CommandMiddleware[] = [];

  async dispatch<T extends Command>(cmd: T): Promise<void> {
    const handler = this.handlers.get(cmd.commandName);

    if (!handler) {
      throw new Error(`No handler registered for <${cmd.commandName}>.`); // TODO: USE CUSTOM ERROR
    }

    let next = (cmd: T): Promise<void> => handler.handle(cmd);

    // Se itera de forma inversa para mantener el orden de ejecución de los middlewares

    for (let i = this.middlewares.length - 1; i >= 0; i--) {
      const middleware = this.middlewares[i]!;
      const currentNext = next;

      next = (cmd) => middleware.execute(cmd, currentNext);
    }

    return next(cmd);
  }

  register<T extends Command>(cmd: T, handler: CommandHandler<T>): void {
    if (this.handlers.has(cmd.commandName)) {
      console.log(`Command handler <${cmd.commandName}> is already registered`);

      return;
    }

    this.handlers.set(cmd.commandName, handler);
  }

  addMiddleware(middleware: CommandMiddleware): void {
    this.middlewares.push(middleware);
  }
}
