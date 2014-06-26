/* globals describe, it */

var FingerTree = require('..');

describe('Finger Tree', function () {

  it('should construct an empty tree when given an empty array', function () {
    var tree = FingerTree.toTree([]);
    tree.isEmpty().should.be.true;
  });
});
