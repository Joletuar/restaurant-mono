import { DomainEvent } from '@src/bounded-contexts/shared/domain/domain-event.interface';

interface Props {
  orderId: string;
  previousStatus: string;
  newStatus: string;
}

export class OrderStatusUpdatedEvent extends DomainEvent<
  Omit<Props, 'orderId'>
> {
  static readonly EVENT_NAME = 'order.updated';

  constructor(props: Props) {
    const { orderId, previousStatus, newStatus } = props;

    super(OrderStatusUpdatedEvent.EVENT_NAME, orderId, {
      previousStatus,
      newStatus,
    });
  }
}
