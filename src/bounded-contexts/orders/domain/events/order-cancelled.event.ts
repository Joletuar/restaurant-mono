import { DomainEvent } from '@src/bounded-contexts/shared/domain/domain-event.interface';

interface Props {
  orderId: string;
  previousStatus: string;
  newStatus: string;
}

export class OrderCancelledEvent extends DomainEvent<Omit<Props, 'orderId'>> {
  static readonly EVENT_NAME = 'order.status.cancelled';
  static readonly EVENT_VERSION = 1;

  constructor(props: Props) {
    const { orderId, previousStatus, newStatus } = props;

    super(
      OrderCancelledEvent.EVENT_NAME,
      orderId,
      OrderCancelledEvent.EVENT_VERSION,
      {
        previousStatus,
        newStatus,
      }
    );
  }
}
