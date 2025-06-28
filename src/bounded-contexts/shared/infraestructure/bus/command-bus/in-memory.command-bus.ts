import dependencyContainer from '@src/apps/restaurant-api/dependencies';
import {
  type Command,
  type CommandBus,
  type CommandClass,
  type CommandHandler,
  type CommandMiddleware,
} from '@src/bounded-contexts/shared/domain/bus/command-bus.interface';
import { type Logger } from '@src/bounded-contexts/shared/domain/logger.interface';

export class InMemoryCommandBus implements CommandBus {
  private _logger?: Logger;

  private handlers: Map<CommandClass, CommandHandler<any>> = new Map();
  private middlewares: CommandMiddleware[] = [];

  register<T extends Command>(
    cmd: CommandClass<T>,
    handler: CommandHandler<T>
  ): void {
    if (this.handlers.has(cmd)) {
      this.getLogger().warn(
        {},
        `Command handler <${cmd.name}> is already registered.`
      );

      return;
    }

    this.handlers.set(cmd, handler);
  }

  async dispatch<T extends Command>(cmd: T): Promise<void> {
    const handler = this.handlers.get(cmd.constructor as CommandClass);

    if (!handler) {
      throw new Error(`No handler registered for <${cmd.constructor.name}>.`);
    }

    let next = (cmd: Command): Promise<void> => handler.handle(cmd);

    // Se itera de forma inversa para mantener el orden de ejecución de los middlewares
    for (let i = this.middlewares.length - 1; i >= 0; i--) {
      const middleware = this.middlewares[i]!;
      const currentNext = next;

      next = (cmd) => middleware.execute(cmd, currentNext);
    }

    return next(cmd);
  }

  addMiddleware(middleware: CommandMiddleware): void {
    if (this.middlewares.find((m) => m === middleware)) {
      this.getLogger().warn(
        {},
        `Middleware <${middleware.constructor.name}> is already registered.`
      );

      return;
    }

    this.middlewares.push(middleware);
  }

  private getLogger(): Logger {
    if (!this._logger) {
      this._logger = dependencyContainer.resolve('Logger');
    }
    return this._logger;
  }
}
