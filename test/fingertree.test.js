/* globals describe, it */

var FingerTree = require('..');

describe('Finger Tree', function () {

  var tree;

  it('should construct an empty tree when given an empty array', function () {
    tree = FingerTree.fromArray([]);
    tree.isEmpty().should.be.true;
  });

  it('should construct a tree containing initial elements', function () {
    tree = FingerTree.fromArray([1, 2, 3]);
    tree.isEmpty().should.be.false;
  });

  it('should be able to get the first element', function () {
    tree = FingerTree.fromArray([]);
    (tree.peekFirst() === null).should.be.true;

    tree = FingerTree.fromArray([1, 2, 3]);
    tree.peekFirst().should.eql(1);
  });

  it('should be able to get the last element', function () {
    tree = FingerTree.fromArray([]);
    (tree.peekLast() === null).should.be.true;

    tree = FingerTree.fromArray([1, 2, 3]);
    tree.peekLast().should.eql(3);
  });
});
