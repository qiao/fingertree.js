module.exports = process.env.FINGERTREE_TEST_COV ? 
  require('./src-cov/fingertree') :
  require('./src/fingertree');
