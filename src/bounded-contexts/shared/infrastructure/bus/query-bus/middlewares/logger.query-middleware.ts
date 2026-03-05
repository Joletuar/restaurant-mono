import type {
  Query,
  QueryMiddleware,
  QueryResponse,
} from '@src/bounded-contexts/shared/domain/bus/query-bus.interface';
import type { Logger } from '@src/bounded-contexts/shared/domain/logger.interface';

export class LoggerQueryMiddleware implements QueryMiddleware {
  constructor(private readonly logger: Logger) {}

  async execute<Q extends Query, R extends QueryResponse<unknown>>(
    query: Q,
    next: (query: Q) => Promise<R>
  ): Promise<R> {
    const reqId = query._metadata?.['reqId'] || 'unknown';
    const queryName = query.constructor.name;
    const { _metadata, ...queryData } = { ...query };

    this.logger.info(
      { reqId, queryType: queryName, queryId: query._id, queryData },
      `[🔍 Query] Starting execution of ${queryName}`
    );

    try {
      const startTime = performance.now();
      const result = await next(query);
      const executionTime = (performance.now() - startTime).toFixed(2);

      this.logger.debug(
        { reqId, output: result },
        `[🔭 Query] Output of ${queryName}`
      );

      this.logger.info(
        { reqId, queryType: queryName, executionTime: `${executionTime}ms` },
        `[✅ Query] Completed execution of ${queryName}`
      );

      return result;
    } catch (error) {
      this.logger.error(
        { reqId, queryType: queryName, queryId: query._id, queryData },
        `[❌ Query] Error when executing ${queryName}`
      );

      throw error;
    }
  }
}
