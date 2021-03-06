module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    'jest/globals': true,
  },
  extends: ['airbnb-base', 'airbnb-typescript/base'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    project: './tsconfig.json',
  },
  plugins: ['jest', '@typescript-eslint'],
  rules: {
    'no-bitwise': 'off',
    // NOTE Useless constructors used for documentation purposes
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-useless-constructor': 'off',
  },
};
