/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  verbose: true,

  testEnvironment: 'node',

  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
  },

  transform: {
    '^.+\.ts?$': ['ts-jest', { useESM: true }],
  },
};
