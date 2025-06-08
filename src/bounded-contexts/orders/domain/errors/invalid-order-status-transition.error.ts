import { DomainValidationError } from '@src/bounded-contexts/shared/domain/errors/domain-validation.error';

export class InvalidOrderStatusTransitionError extends DomainValidationError {
  constructor(message: string, currentStatus: string, newStatus: string) {
    super(message, [
      `The order has the current <${currentStatus}> status, and can't no change to <${newStatus}> status.`,
    ]);

    this.name = 'InvalidOrderStatusTransitionError';
  }
}
