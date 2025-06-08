import type { OrderDto } from '@src/bounded-contexts/orders/application/order.dto';
import type { QueryResponse } from '@src/bounded-contexts/shared/domain/bus/query-bus.interface';

export interface FinderOrderByIdQueryReponse extends QueryResponse<OrderDto> {}
