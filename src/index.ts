import 'reflect-metadata';

import { RestaurantApiApp } from './apps/restaurant-api';
import './apps/restaurant-api/dependencies';

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

void main();
