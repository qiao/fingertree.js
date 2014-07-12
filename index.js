module.exports = process.env.TEST_COV ? 
  require('./src-cov/fingertree') :
  require('./src/fingertree');
