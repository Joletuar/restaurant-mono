import 'reflect-metadata';

import { RestaurantApiApp } from './apps/restaurant-api';

async function main(): Promise<void> {
  console.log('[🚀] Starting application...');

  try {
    await new RestaurantApiApp().init();

    console.log('[✅] Application started successfully.');
  } catch (error) {
    console.error('[❎] Error during initialization:', error);
    process.exit(1);
  }
}

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing');
  process.exit(0);
});

process.on('uncaughtException', (error: unknown) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on(
  'unhandledRejection',
  (reason: unknown, promise: Promise<unknown>) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
  }
);

process.on('exit', (code) => {
  console.log(`About to exit with code: ${code}`);
});

void main();
