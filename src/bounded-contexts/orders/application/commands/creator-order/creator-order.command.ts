import type { Command } from '@src/bounded-contexts/shared/domain/bus/command-bus.interface';
import { IdValueObject } from '@src/bounded-contexts/shared/domain/value-objects/id.value-object';

interface Data {
  recipeId: string;
  status: string;
}

export class CreatorOrderCommand implements Command {
  _id: string;
  _metadata?: Record<string, unknown> = {};

  constructor(
    readonly data: Data,
    metadata?: Record<string, unknown>
  ) {
    this._metadata = metadata;

    this._id = IdValueObject.generateId().value;
  }
}
