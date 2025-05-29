import { ConfigProvider } from './config/app-config';
import dependencyContainer from './dependencies';
import type { HttpServer } from './http/http-server.interface';

export class RestaurantApiApp {
  private readonly server: HttpServer;
  private readonly config = ConfigProvider.getConfig();
  private readonly dependencies = dependencyContainer;

  constructor() {
    this.server = this.dependencies.resolve<HttpServer>('HttpServer');
  }

  async init(): Promise<void> {
    try {
      await this.server.start();

      console.log(
        `[🚀] Restaurant API server started in ${this.config.http.environment} mode`
      );

      console.log(`[✅] Server started on port ${this.config.http.port}`);
    } catch (error) {
      console.error('[❎] Error starting server:', error);

      throw error;
    }
  }

  async close(): Promise<void> {
    await this.server.stop();
  }
}
