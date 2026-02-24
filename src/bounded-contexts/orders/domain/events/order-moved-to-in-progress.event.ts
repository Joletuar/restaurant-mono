import { DomainEvent } from '@src/bounded-contexts/shared/domain/domain-event.interface';

interface Props {
  orderId: string;
  previousStatus: string;
  newStatus: string;
}

export class OrderMovedToInProgressEvent extends DomainEvent<
  Omit<Props, 'orderId'>
> {
  static readonly EVENT_NAME = 'order.status.in_progress';
  static readonly EVENT_VERSION = 1;

  constructor(props: Props) {
    const { orderId, previousStatus, newStatus } = props;

    super(
      OrderMovedToInProgressEvent.EVENT_NAME,
      orderId,
      OrderMovedToInProgressEvent.EVENT_VERSION,
      {
        previousStatus,
        newStatus,
      }
    );
  }
}
