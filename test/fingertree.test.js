/* globals describe, it */

var FingerTree = require('..');

describe('Finger Tree', function () {

  var tree;
  
  function range(n) {
    var a = [];
    for (var i = 0; i < n; ++i) {
      a.push(i);
    }
    return a;
  }

  it('should construct an empty tree when given an empty array', function () {
    tree = FingerTree.fromArray([]);
    tree.isEmpty().should.be.true;
  });

  it('should construct a tree containing initial elements', function () {
    tree = FingerTree.fromArray([1, 2, 3]);
    tree.isEmpty().should.be.false;

    tree = FingerTree.fromArray(range(1000));
    tree.isEmpty().should.be.false;
  });

  it('should be able to get the first element', function () {
    tree = FingerTree.fromArray([]);
    (tree.peekFirst() === null).should.be.true;

    tree = FingerTree.fromArray([1, 2, 3]);
    tree.peekFirst().should.eql(1);

    tree = FingerTree.fromArray(range(1000));
    tree.peekFirst().should.eql(0);
  });

  it('should be able to get the last element', function () {
    tree = FingerTree.fromArray([]);
    (tree.peekLast() === null).should.be.true;

    tree = FingerTree.fromArray([1, 2, 3]);
    tree.peekLast().should.eql(3);

    tree = FingerTree.fromArray(range(1000));
    tree.peekLast().should.eql(999);
  });
});
