async function main(): Promise<void> {
  console.log('Starting application...');
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
