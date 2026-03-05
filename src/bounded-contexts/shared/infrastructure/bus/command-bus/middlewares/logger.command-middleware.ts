import type {
  Command,
  CommandMiddleware,
} from '@src/bounded-contexts/shared/domain/bus/command-bus.interface';
import type { Logger } from '@src/bounded-contexts/shared/domain/logger.interface';

export class LoggerCommandMiddleware implements CommandMiddleware {
  constructor(private readonly logger: Logger) {}

  async execute<T extends Command>(
    command: T,
    next: (cmd: T) => Promise<void>
  ): Promise<void> {
    const reqId = command._metadata?.['reqId'] || 'unknown';
    const commandName = command.constructor.name;
    const { _metadata, ...commandData } = { ...command };

    this.logger.info(
      { reqId, commandType: commandName, commandId: command._id, commandData },
      `[🛠️ Command] Starting execution of ${commandName}`
    );

    try {
      const startTime = performance.now();
      const result = await next(command);
      const executionTime = (performance.now() - startTime).toFixed(2);

      this.logger.info(
        {
          reqId,
          commandType: commandName,
          executionTime: `${executionTime}ms`,
        },
        `[✅ Command] Completed execution of ${commandName}`
      );

      return result;
    } catch (error) {
      this.logger.error(
        {
          reqId,
          commandType: commandName,
          commandId: command._id,
          commandData,
        },
        `[❌ Command] Error when executing ${commandName}`
      );

      throw error;
    }
  }
}
