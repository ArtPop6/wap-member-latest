module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: { sourceType: 'module' },
  env: {
    browser: true,
  },
  extends: 'standard',
  plugins: ['html'],
  'settings': {
    'import/resolver': {
      webpack: {
        config: 'build/webpack.dev.conf.js',
        'config-index': 1,
      }
    }
  },
  'globals': {
    'wx': true,
  },
  'rules': {
    'import/extensions': ['error', 'always', {
      'js': 'never',
      'vue': 'never'
    }],
    'import/no-extraneous-dependencies': ['error', { 'devDependencies': true }],
    'no-param-reassign': 'off',
    "space-before-function-paren": ['error', 'never'],
  },
}
