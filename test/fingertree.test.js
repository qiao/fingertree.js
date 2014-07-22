/* globals describe, it */

var FingerTree = require('..');

describe('Finger Tree', function () {

  function range(n) {
    var a = [];
    for (var i = 0; i < n; ++i) {
      a.push(i);
    }
    return a;
  }

  it('should construct an empty tree when given an empty array', function () {
    var tree = FingerTree.fromArray([]);
    tree.isEmpty().should.be.true;
  });

  it('should construct a tree containing initial elements', function () {
    var tree = FingerTree.fromArray([1, 2, 3]);
    tree.isEmpty().should.be.false;

    tree = FingerTree.fromArray(range(1000));
    tree.isEmpty().should.be.false;
  });

  it('should be able to get the first element', function () {
    var tree = FingerTree.fromArray([]);
    (tree.peekFirst() === null).should.be.true;

    tree = FingerTree.fromArray([1]);
    tree.peekFirst().should.eql(1);

    tree = FingerTree.fromArray([1, 2, 3]);
    tree.peekFirst().should.eql(1);

    tree = FingerTree.fromArray(range(1000));
    tree.peekFirst().should.eql(0);
  });

  it('should be able to get the last element', function () {
    var tree = FingerTree.fromArray([]);
    (tree.peekLast() === null).should.be.true;

    tree = FingerTree.fromArray([1]);
    tree.peekLast().should.eql(1);

    tree = FingerTree.fromArray([1, 2, 3]);
    tree.peekLast().should.eql(3);

    tree = FingerTree.fromArray(range(1000));
    tree.peekLast().should.eql(999);
  });

  it('should be able to add element to the front', function () {
    var tree = FingerTree.fromArray([]);
    tree = tree.addFirst(1);
    tree.peekFirst().should.equal(1);

    tree = FingerTree.fromArray([1]);
    tree = tree.addFirst(0);
    tree.peekFirst().should.equal(0);

    tree = FingerTree.fromArray([1, 2, 3]);
    tree = tree.addFirst(0);
    tree.peekFirst().should.equal(0);

    tree = FingerTree.fromArray(range(1000));
    tree = tree.addFirst(-1);
    tree.peekFirst().should.equal(-1);
  });

  it('should be able to add element to the end', function () {
    var tree = FingerTree.fromArray([]);
    tree = tree.addLast(1);
    tree.peekLast().should.equal(1);

    var tree = FingerTree.fromArray([1]);
    tree = tree.addLast(2);
    tree.peekLast().should.equal(2);

    tree = FingerTree.fromArray([1, 2, 3]);
    tree = tree.addLast(4);
    tree.peekLast().should.equal(4);

    tree = FingerTree.fromArray([]);
    for (var i = 0; i < 5; ++i) {
      tree = tree.addLast(i);
    }
    tree = tree.addLast(5);
    tree.peekLast().should.equal(5);

    tree = FingerTree.fromArray(range(1000));
    tree = tree.addLast(1000);
    tree.peekLast().should.equal(1000);
  });

  it('should be able to get a new tree with the first element removed', function () {
    var tree = FingerTree.fromArray([1, 2]).removeFirst();
    tree.peekFirst().should.eql(2);

    tree = FingerTree.fromArray([1, 2, 3]).removeFirst();
    tree.peekFirst().should.eql(2);
    tree.peekLast().should.eql(3);

    tree = FingerTree.fromArray([1, 2]).addLast(3).removeFirst();
    tree.peekFirst().should.eql(2);
    tree.peekLast().should.eql(3);
    

    tree = FingerTree.fromArray(range(1000)).removeFirst();
    tree.peekFirst().should.eql(1);
    tree.peekLast().should.eql(999);

    tree = FingerTree.fromArray(range(1000));
    for (var i = 0; i < 10; ++i) {
      tree = tree.removeFirst();
    }
    tree.peekFirst().should.eql(10);
    tree.peekLast().should.eql(999);
  });

  it('should be able to get a new tree with the last element removed', function () {
    var tree = FingerTree.fromArray([1]).removeLast();
    (tree.peekFirst() === null).should.be.true;
    (tree.peekLast() === null).should.be.true;

    tree = FingerTree.fromArray([1, 2, 3]).removeLast();
    tree.peekFirst().should.eql(1);
    tree.peekLast().should.eql(2);

    tree = FingerTree.fromArray(range(1000)).removeLast();
    tree.peekFirst().should.eql(0);
    tree.peekLast().should.eql(998);

    tree = FingerTree.fromArray(range(1000));
    for (var i = 0; i < 10; ++i) {
      tree = tree.removeLast();
    }
    tree.peekFirst().should.eql(0);
    tree.peekLast().should.eql(989);
  });

  it('should be able to concat two trees into one', function () {
    var tree = FingerTree.fromArray([]).concat(FingerTree.fromArray([1, 2, 3]));
    tree.peekFirst().should.eql(1);
    tree.peekLast().should.eql(3);
    tree.measure().should.eql(3);

    tree = FingerTree.fromArray([1, 2, 3]).concat(FingerTree.fromArray([]));
    tree.peekFirst().should.eql(1);
    tree.peekLast().should.eql(3);
    tree.measure().should.eql(3);

    tree = FingerTree.fromArray([1]).concat(FingerTree.fromArray([2, 3]));
    tree.peekFirst().should.eql(1);
    tree.peekLast().should.eql(3);
    tree.measure().should.eql(3);

    tree = FingerTree.fromArray([1, 2]).concat(FingerTree.fromArray([3]));
    tree.peekFirst().should.eql(1);
    tree.peekLast().should.eql(3);
    tree.measure().should.eql(3);

    tree = FingerTree.fromArray([1, 2, 3]).concat(FingerTree.fromArray([4, 5, 6]));
    tree.peekFirst().should.eql(1);
    tree.peekLast().should.eql(6);
    tree.measure().should.eql(6);

    tree = FingerTree.fromArray(range(100)).concat(FingerTree.fromArray(range(100)));
    tree.peekFirst().should.eql(0);
    tree.peekLast().should.eql(99);
    tree.measure().should.eql(200);
  });

  it('should be annotated with default measurer', function () {
    var tree = FingerTree.fromArray([1, 2, 3]);
    tree.measure().should.eql(3);

    tree = FingerTree.fromArray(range(1000));
    tree.measure().should.eql(1000);
  });

  it('should be able to be split into two halves given a predicate', function () {
    var tree = FingerTree.fromArray([]);
    var split = tree.split(function (x) { return true; });
    split[0].isEmpty().should.be.true;
    split[1].isEmpty().should.be.true;

    tree = FingerTree.fromArray([1]);
    split = tree.split(function (x) {
      return x > 0;
    });
    split[0].measure().should.eql(1);
    split[1].isEmpty().should.be.true;

    tree = FingerTree.fromArray([1]);
    split = tree.split(function (x) {
      return x > 1;
    });
    split[0].isEmpty().should.be.true;
    split[1].measure().should.eql(1);

    tree = FingerTree.fromArray(range(100));
    split = tree.split(function (x) {
      return x > 50;
    });
    split[0].measure().should.eql(50);
    split[1].measure().should.eql(50);

    tree = FingerTree.fromArray(range(100));
    split = tree.split(function (x) {
      return x > 99;
    });
    split[0].measure().should.eql(99);
    split[1].measure().should.eql(1);

    tree = FingerTree.fromArray(range(100));
    split = tree.split(function (x) {
      return x > 100;
    });
    split[0].measure().should.eql(100);
    split[1].isEmpty().should.be.true;
  });

  it('should be able to be annotated with custom measurer', function () {
    var measurer = {
      identity: function () {
        return -Infinity;
      },
      measure: function (x) {
        return x;
      },
      sum: function (a, b) {
        return Math.max(a, b);
      }
    };
    var tree = FingerTree.fromArray([1, 4, 3, 5, 2, 9], measurer);
    tree.measure().should.eql(9);
  });

  it('should be able to take elements until a predicate is returning true', function () {
    var tree = FingerTree.fromArray([1, 2, 3, 4, 5]).takeUntil(function (m) {
      return m > 3;
    });
    tree.measure().should.eql(3);
    tree.peekFirst().should.eql(1);
    tree.peekLast().should.eql(3);
  });

  it('should be able to drop elements until a predicate is returning true', function () {
    var tree = FingerTree.fromArray([1, 2, 3, 4, 5]).dropUntil(function (m) {
      return m > 3;
    });
    tree.measure().should.eql(2);
    tree.peekFirst().should.eql(4);
    tree.peekLast().should.eql(5);
  });

  it('should be able to map a function onto the elements', function () {
    var tree = FingerTree.fromArray([1, 2, 3, 4, 5]).map(function (x) {
      return x * x;
    });
    tree.measure().should.eql(5);
    tree.peekFirst().should.eql(1);
    tree.peekLast().should.eql(25);
  });

  it('should be able to be serialized into JSON', function () {
    var tree = FingerTree.fromArray([]);
    JSON.parse(JSON.stringify(tree)).should.eql({
      type: 'empty',
      measure: 0
    });

    tree = FingerTree.fromArray([1]);
    JSON.parse(JSON.stringify(tree)).should.eql({
      type: 'single',
      value: 1,
      measure: 1
    });

    tree = FingerTree.fromArray([1, 2, 3]);
    JSON.parse(JSON.stringify(tree)).should.eql({
      type: 'deep',
      left: {
        type: 'digit',
        items: [1, 2],
        measure: 2
      },
      mid: {
        type: 'empty',
        measure: 0
      },
      right: {
        type: 'digit',
        items: [3],
        measure: 1
      },
      measure: 3
    });

    tree = FingerTree.fromArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    JSON.parse(JSON.stringify(tree)).should.eql({
      type: 'deep',
      left: {
        type: 'digit',
        items: [1, 2],
        measure: 2
      },
      mid: {
        type: 'deep',
        left: {
          type: 'digit',
          items: [{
            type: 'node',
            items: [3, 4, 5],
            measure: 3
          }],
          measure: 3
        },
        mid: {
          type: 'empty',
          measure: 0
        },
        right: {
          type: 'digit',
          items: [{
            type: 'node',
            items: [6, 7, 8],
            measure: 3
          }],
          measure: 3
        },
        measure: 6
      },
      right: {
        type: 'digit',
        items: [9],
        measure: 1
      },
      measure: 9
    });
  });
});
