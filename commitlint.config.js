/**
 * @type {import('@commitlint/types').UserConfig}
 */

export default {
  extends: ['@commitlint/config-conventional'],
  rules: { 'header-max-length': [2, 'always', 100] },
};
