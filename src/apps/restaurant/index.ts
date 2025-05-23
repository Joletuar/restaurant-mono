export class RestaurantApp {
  constructor(readonly httpServer: any) {}

  async init(): Promise<void> {}

  async close(): Promise<void> {}
}
