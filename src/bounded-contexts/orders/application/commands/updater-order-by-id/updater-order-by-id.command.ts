import type { Command } from '@src/bounded-contexts/shared/domain/bus/command-bus.interface';
import { IdValueObject } from '@src/bounded-contexts/shared/domain/value-objects/id.value-object';

type Props = {
  orderId: string;
  status: string;
};

export class UpdaterOrderByIdCommand implements Command {
  _id: string;
  _metadata?: Record<string, unknown> | undefined = {};

  constructor(
    readonly props: Props,
    metadata?: Record<string, unknown>
  ) {
    this._metadata = metadata;

    this._id = IdValueObject.generateId().value;
  }
}
