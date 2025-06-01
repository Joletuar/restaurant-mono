import dependencyContainer from '@src/apps/restaurant-api/dependencies';
import {
  type Command,
  type CommandBus,
  type CommandHandler,
  type CommandMiddleware,
} from '@src/bounded-contexts/shared/domain/command-bus.interface';
import { type Logger } from '@src/bounded-contexts/shared/domain/logger.interface';

export class InMemoryCommandBus implements CommandBus {
  private _logger?: Logger;

  private handlers: Map<string, CommandHandler> = new Map();
  private middlewares: CommandMiddleware[] = [];

  async dispatch<T extends Command>(cmd: T): Promise<void> {
    const handler = this.handlers.get(cmd._name);

    if (!handler) {
      throw new Error(`No handler registered for <${cmd._name}>.`); // TODO: USE CUSTOM ERROR
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

  register(commandName: string, handler: CommandHandler): void {
    if (this.handlers.has(commandName)) {
      this.logger.warn(
        {},
        `Command handler <${commandName}> is already registered.`
      );

      return;
    }

    this.handlers.set(commandName, handler);
  }

  addMiddleware(middleware: CommandMiddleware): void {
    if (this.middlewares.find((m) => m === middleware)) {
      this.logger.warn(
        {},
        `Middleware <${middleware._name}> is already registered.`
      );

      return;
    }

    this.middlewares.push(middleware);
  }

  private get logger(): Logger {
    if (!this._logger) {
      this._logger = dependencyContainer.resolve('Logger');
    }
    return this._logger;
  }
}
