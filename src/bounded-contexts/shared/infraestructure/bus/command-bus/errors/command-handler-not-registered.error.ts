import { InfrastructureError } from '@src/bounded-contexts/shared/domain/errors/infraestructure.error';

export class CommandHandlerNotRegisteredError extends InfrastructureError {
  constructor(commandName: string) {
    super(
      `Handler not registered for command: ${commandName}`,
      [`No handler found for command: ${commandName}`],
      undefined,
      true
    );

    this.name = 'HandlerNotRegisteredError';
  }
}
