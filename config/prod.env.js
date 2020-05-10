module.exports = {
  NODE_ENV: '"production"',
  SERVER_ENV: `"${process.env.SERVER_ENV || 'prod'}"`,
};
