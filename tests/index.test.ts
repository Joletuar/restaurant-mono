import { helloWorld } from '@src/index';

describe('index.ts', () => {
  it('should execute the index file without errors', () => {
    helloWorld();

    expect(true).toBe(true);
  });
});
