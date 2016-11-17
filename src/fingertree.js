/**
 * @fileoverview Implementation of Finger Tree, an immutable general-purpose
 *   data structure which can further be used to implement random-access
 *   sequences, priority-queues, ordered sequences, interval trees, etc.
 *
 *   Based on:
 *   Ralf Hinze and Ross Paterson,
 *   "Finger trees: a simple general-purpose data structure",
 *   <http://www.soi.city.ac.uk/~ross/papers/FingerTree.html>
 * @author Xueqiao Xu <xueqiaoxu@gmail.com>
 */


// universal module loader
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define([], factory);
  } else if (typeof exports === 'object') {
    // CommonJS
    module.exports = factory();
  } else {
    // browser global
    root.FingerTree = factory();
  }
}(this, function () {

  'use strict';

  /**
   * Polyfill for Object.create.
   */
  var create = Object.create || function (o) {
    function F() {}
    F.prototype = o;
    return new F();
  };

  /**
   * Placeholder for methods of interfaces / abstract base classes.
   */
  function notImplemented() {
    throw new Error('Not Implemented');
  }

  /**
   * A split is a container which has 3 parts, in which the left part is the
   * elements that do not satisfy the predicate, the middle part is the
   * first element that satisfies the predicate and the last part is the rest
   * elements.
   * @constructor
   * @param {Array|FingerTree} left
   * @param {*} mid
   * @param {Array|FingerTree} right
   */
  function Split(left, mid, right) {
    this.left = left;
    this.mid = mid;
    this.right = right;
  }
  
  /**
   * A digit is a measured container of one to four elements.
   * @constructor
   * @param {Object.<string, function>} measurer
   * @param {Array.<*>} items
   */
  function Digit(measurer, items) {
    this.items = items;
    this.length = items.length;
    this.measurer = measurer;

    var m = measurer.identity();
    for (var i = 0, len = items.length; i < len; ++i) {
      m = measurer.sum(m, measurer.measure(items[i]));
    }

    /**
     * @private
     */
    this.measure_ = m;
  }

  /**
   * Get the measure of the digit.
   * @return {*}
   */
  Digit.prototype.measure = function () {
    return this.measure_;
  };

  /**
   * Get the first element stored in the digit.
   * @return {*}
   */
  Digit.prototype.peekFirst = function () {
    return this.items[0];
  };

  /**
   * Get the last element stored in the digit.
   * @return {*}
   */
  Digit.prototype.peekLast = function () {
    return this.items[this.items.length - 1];
  };

  /**
   * Return a new digit with the first item removed.
   * @return {Digit}
   */
  Digit.prototype.removeFirst = function () {
    return this.slice(1);
  };

  /**
   * Return a new digit with the first item removed.
   * @return {Digit}
   */
  Digit.prototype.removeLast = function () {
    return this.slice(0, this.length - 1);
  };

  /**
   * Return a new digit with the items sliced.
   * @param {Number} start
   * @param {Number} end
   * @return {Digit}
   */
  Digit.prototype.slice = function (start, end) {
    if (end === undefined) {
      end = this.length;
    }
    return new Digit(this.measurer, this.items.slice(start, end));
  };

  /**
   * Split the digit into 3 parts, in which the left part is the elements
   * that do not satisfy the predicate, the middle part is the first 
   * element that satisfies the predicate and the last part is the rest
   * elements.
   * @param {Function} predicate A function which returns either true or false
   *   given each stored element.
   * @param {*} initial The initial measure for the predicate
   * @return {Split}
   */
  Digit.prototype.split = function (predicate, initial) {
    var items = this.items;
    var measurer = this.measurer;
    var measure = initial;
    var i, len = items.length;

    if (len === 1) {
      return new Split([], items[0], []);
    }

    for (i = 0, len = items.length; i < len; ++i) {
      measure = measurer.sum(measure, measurer.measure(items[i]));
      if (predicate(measure)) {
        break;
      }
    }
    return new Split(items.slice(0, i),
                     items[i],
                     items.slice(i + 1));
  };

  /**
   * Return the JSON representation of the digit.
   * @return {Object}
   */
  Digit.prototype.toJSON = function () {
    return {
      type: 'digit',
      items: this.items,
      measure: this.measure()
    };
  };

  /**
   * A node is a measured container of either 2 or 3 sub-finger-trees.
   * @constructor
   * @param {Object.<string, function>} measurer
   * @param {Array.<FingerTree>} items
   */
  function Node(measurer, items) {
    this.items = items;
    this.measurer = measurer;

    var m = measurer.identity();
    for (var i = 0, len = items.length; i < len; ++i) {
      m = measurer.sum(m, measurer.measure(items[i]));
    }

    /**
     * @private
     */
    this.measure_ = m;
  }

  /**
   * Get the measure of the node.
   * @return {*}
   */
  Node.prototype.measure = function () {
    return this.measure_;
  };

  /**
   * Convert the node to a digit.
   * @return {Node}
   */
  Node.prototype.toDigit = function () {
    return new Digit(this.measurer, this.items);
  };

  /**
   * Return the JSON representation of the node.
   * @return {Object}
   */
  Node.prototype.toJSON = function () {
    return {
      type: 'node',
      items: this.items,
      measure: this.measure()
    };
  };

  /**
   * Interface of finger-tree.
   * @interface
   */
  function FingerTree() { } 

  FingerTree.fromArray = fromArray;

  /**
   * Get the measure of the tree.
   * @return {*}
   */
  FingerTree.prototype.measure = notImplemented;

  /**
   * Check whether the tree is empty.
   * @return {boolean} True if the tree is empty.
   */
  FingerTree.prototype.isEmpty = notImplemented;

  /**
   * Return a new tree with an element added to the front.
   * @param {*} v The element to add.
   * @return {FingerTree}
   */
  FingerTree.prototype.addFirst = notImplemented;

  /**
   * Return a new tree with an element added to the end.
   * @param {*} v The element to add.
   * @return {FingerTree} A new finger-tree with the element added.
   */
  FingerTree.prototype.addLast = notImplemented;

  /**
   * Return a new tree with the first element removed.
   * @return {FingerTree}
   */
  FingerTree.prototype.removeFirst = notImplemented;

  /**
   * Return a new tree with the last element removed.
   * @return {FingerTree}
   */
  FingerTree.prototype.removeLast = notImplemented;

  /**
   * Get the first element of the tree.
   * @return {*}
   */
  FingerTree.prototype.peekFirst = notImplemented;

  /**
   * Get the last element of the tree.
   * @return {*}
   */
  FingerTree.prototype.peekLast = notImplemented;

  /**
   * Concatenate this tree with another tree.
   * @param {FingerTree} other
   * @return {FingerTree} The concatenated tree.
   */
  FingerTree.prototype.concat = notImplemented;

  /**
   * Split the tree into two halves, where the first half is a finger-tree
   * which contains all the elements that do not satisfy the given predicate,
   * while the ones from the other half do.
   * @param {function(*): boolean} predicate
   * @return {Array.<FingerTree>} An array with the first element being a
   *   finger-tree that contains all the nonsatisfying elements and the second
   *   element being a finger-tree that contains all the other elements.
   */
  FingerTree.prototype.split = notImplemented;

  /**
   * Take elements from the tree until the predicate returns true.
   * @param {function(*): boolean} predicate
   * @return {FingerTree}
   */
  FingerTree.prototype.takeUntil = function (predicate) {
    return this.split(predicate)[0];
  };

  /**
   * Drop elements from the tree until the predicate is returns true.
   * @param {function(*): boolean} predicate
   * @return {FingerTree}
   */
  FingerTree.prototype.dropUntil = function (predicate) {
    return this.split(predicate)[1];
  };

  /**
   * Return the JSON representation of the tree.
   * @return {Object}
   */
  FingerTree.prototype.toJSON = notImplemented;


  /**
   * An empty finger-tree.
   * @constructor
   * @implements {FingerTree}
   * @param {Object.<string, function>} measurer
   */
  function Empty(measurer) {
    this.measurer = measurer;
    this.measure_ = measurer.identity();
  }

  Empty.prototype = create(FingerTree.prototype);

  /**
   * @inheritDoc
   */
  Empty.prototype.measure = function () {
    return this.measure_;
  };


  /**
   * @inheritDoc
   */
  Empty.prototype.addFirst = function (v) {
    return new Single(this.measurer, v);
  };

  /**
   * @inheritDoc
   */
  Empty.prototype.addLast = function (v) {
    return new Single(this.measurer, v);
  };

  /**
   * @inheritDoc
   */
  Empty.prototype.peekFirst = function () {
    return null;
  };

  /**
   * @inheritDoc
   */
  Empty.prototype.peekLast = function () {
    return null;
  };

  /**
   * @inheritDoc
   */
  Empty.prototype.isEmpty = function () {
    return true;
  };

  /**
   * @inheritDoc
   */
  Empty.prototype.concat = function (other) {
    return other;
  };

  /**
   * @inheritDoc
   */
  Empty.prototype.split = function (predicate) {
    return [this, this];
  };

  /**
   * @inheritDoc
   */
  Empty.prototype.toJSON = function () {
    return {
      type: 'empty',
      measure: this.measure()
    };
  };


  /**
   * A finger-tree which contains exactly one element.
   * @constructor
   * @implements {FingerTree}
   * @param {Object.<string, function>} measurer
   * @param {*} value
   */
  function Single(measurer, value) {
    this.value = value;
    this.measurer = measurer;
    this.measure_ = measurer.measure(value);
  }

  Single.prototype = create(FingerTree.prototype);

  /**
   * @inheritDoc
   */
  Single.prototype.measure = function () {
    return this.measure_;
  };

  /**
   * @inheritDoc
   */
  Single.prototype.addFirst = function (v) {
    var measurer = this.measurer;

    return new Deep(measurer,
                    new Digit(measurer, [v]),
                    new Empty(makeNodeMeasurer(measurer)),
                    new Digit(measurer, [this.value]));
  };

  /**
   * @inheritDoc
   */
  Single.prototype.addLast = function (v) {
    var measurer = this.measurer;

    return new Deep(measurer,
                    new Digit(measurer, [this.value]),
                    new Empty(makeNodeMeasurer(measurer)),
                    new Digit(measurer, [v]));
  };

  /**
   * @inheritDoc
   */
  Single.prototype.removeFirst = function () {
    return new Empty(this.measurer);
  };

  /**
   * @inheritDoc
   */
  Single.prototype.removeLast = function () {
    return new Empty(this.measurer);
  };

  /**
   * @inheritDoc
   */
  Single.prototype.peekFirst = function () {
    return this.value;
  };

  /**
   * @inheritDoc
   */
  Single.prototype.peekLast = function () {
    return this.value;
  };

  /**
   * @inheritDoc
   */
  Single.prototype.isEmpty = function () {
    return false;
  };

  /**
   * @inheritDoc
   */
  Single.prototype.concat = function (other) {
    return other.addFirst(this.value);
  };

  /**
   * Helper function to split the tree into 3 parts.
   * @private
   * @param {function(*): boolean} predicate
   * @param {*} initial The initial measurement for reducing
   * @return {Split}
   */
  Single.prototype.splitTree = function (predicate, initial) {
    return new Split(new Empty(this.measurer),
                     this.value,
                     new Empty(this.measurer));
  };

  /**
   * @inheritDoc
   */
  Single.prototype.split = function (predicate) {
    if (predicate(this.measure())) {
      return [new Empty(this.measurer), this];
    }
    return [this, new Empty(this.measurer)];
  };

  /**
   * @inheritDoc
   */
  Single.prototype.toJSON = function () {
    return {
      type: 'single',
      value: this.value,
      measure: this.measure()
    };
  };


  /**
   * A finger-tree which contains two or more elements.
   * @constructor
   * @implements {FingerTree}
   * @param {Object.<string, function>} measurer
   * @param {Digit} left
   * @param {FingerTree} mid
   * @param {Digit} right
   */
  function Deep(measurer, left, mid, right) {
    /**
     * @type {Digit}
     */
    this.left = left;

    /**
     * @type {FingerTree}
     */
    this.mid = mid;

    /**
     * @type {Digit}
     */
    this.right = right;

    this.measurer = measurer;

    /**
     * @private
     */
    this.measure_ = null;
  }

  Deep.prototype = create(FingerTree.prototype);

  /**
   * @inheritDoc
   */
  Deep.prototype.measure = function () {
    if (this.measure_ === null) {
      var measurer = this.measurer;
      this.measure_ = measurer.sum(
        measurer.sum(this.left.measure(), this.mid.measure()),
        this.right.measure());
    }
    return this.measure_;
  };

  /**
   * @inheritDoc
   */
  Deep.prototype.addFirst = function (v) {
    var left = this.left;
    var mid = this.mid;
    var right = this.right;
    var measurer = this.measurer;
    var leftItems = left.items;

    if (left.length === 4) {
      return new Deep(measurer,
                      new Digit(measurer, [v, leftItems[0]]),
                      mid.addFirst(new Node(measurer, [leftItems[1],
                                                       leftItems[2],
                                                       leftItems[3]])),
                      right);
    }
    return new Deep(measurer,
                    new Digit(measurer, [v].concat(leftItems)),
                    mid,
                    right);
  };

  /**
   * @inheritDoc
   */
  Deep.prototype.addLast = function (v) {
    var left = this.left;
    var mid = this.mid;
    var right = this.right;
    var measurer = this.measurer;
    var rightItems = right.items;

    if (right.length === 4) {
      return new Deep(measurer,
                      left,
                      mid.addLast(new Node(measurer, [rightItems[0],
                                                      rightItems[1],
                                                      rightItems[2]])),
                      new Digit(measurer, [rightItems[3], v]));
    }
    return new Deep(measurer,
                    left,
                    mid,
                    new Digit(measurer, rightItems.concat([v])));
  };

  /**
   * @inheritDoc
   */
  Deep.prototype.removeFirst = function () {
    var left = this.left;
    var mid = this.mid;
    var right = this.right;
    var measurer = this.measurer;

    if (left.length > 1) {
      return new Deep(measurer, left.removeFirst(), mid, right);
    }
    if (!mid.isEmpty()) {
      var newMid = new DelayedFingerTree(function () {
        return mid.removeFirst();
      });
      return new Deep(measurer, mid.peekFirst().toDigit(), newMid, right);
    }
    if (right.length === 1) {
      return new Single(measurer, right.items[0]);
    }
    return new Deep(measurer, right.slice(0, 1), mid, right.slice(1));
  };

  /**
   * @inheritDoc
   */
  Deep.prototype.removeLast = function () {
    var left = this.left;
    var mid = this.mid;
    var right = this.right;
    var measurer = this.measurer;

    if (right.length > 1) {
      return new Deep(measurer, left, mid, right.removeLast());
    }
    if (!mid.isEmpty()) {
      var newMid = new DelayedFingerTree(function () {
        return mid.removeLast();
      });
      return new Deep(measurer, left, newMid, mid.peekLast().toDigit());
    }
    if (left.length === 1) {
      return new Single(measurer, left.items[0]);
    }
    return new Deep(measurer, left.slice(0, -1), mid, left.slice(-1));
  };

  /**
   * @inheritDoc
   */
  Deep.prototype.peekFirst = function () {
    return this.left.peekFirst();
  };

  /**
   * @inheritDoc
   */
  Deep.prototype.peekLast = function () {
    return this.right.peekLast();
  };

  /**
   * @inheritDoc
   */
  Deep.prototype.isEmpty = function () {
    return false;
  };

  /**
   * @inheritDoc
   */
  Deep.prototype.concat = function (other) {
    if (other instanceof Empty) {
      return this;
    }
    if (other instanceof Single) {
      return this.addLast(other.value);
    }
    return app3(this, [], other);
  };

  /**
   * Helper function to split the tree into 3 parts.
   * @private
   * @param {function(*): boolean} predicate
   * @param {*} initial The initial measurement for reducing
   * @return {Split}
   */
  Deep.prototype.splitTree = function (predicate, initial) {
    var left = this.left;
    var mid = this.mid;
    var right = this.right;
    var measurer = this.measurer;

    // see if the split point is inside the left tree
    var leftMeasure = measurer.sum(initial, left.measure());
    if (predicate(leftMeasure)) {
      var split = left.split(predicate, initial);
      return new Split(fromArray(split.left, measurer),
                       split.mid,
                       deepLeft(measurer, split.right, mid, right));
    }

    // see if the split point is inside the mid tree
    var midMeasure = measurer.sum(leftMeasure, mid.measure());
    if (predicate(midMeasure)) {
      var midSplit = mid.splitTree(predicate, leftMeasure);
      var split = midSplit.mid.toDigit().split(predicate, measurer.sum(leftMeasure, midSplit.left.measure()));
      return new Split(deepRight(measurer, left, midSplit.left, split.left),
                       split.mid,
                       deepLeft(measurer, split.right, midSplit.right, right));
    }

    // the split point is in the right tree
    var split = right.split(predicate, midMeasure);
    return new Split(deepRight(measurer, left, mid, split.left),
                     split.mid,
                     fromArray(split.right, measurer));
  };

  /**
   * @inheritDoc
   */
  Deep.prototype.split = function (predicate) {
    if (predicate(this.measure())) {
      var split = this.splitTree(predicate, this.measurer.identity());
      return [split.left, split.right.addFirst(split.mid)];
    }
    return [this, new Empty(this.measurer)];
  };

  /**
   * @inheritDoc
   */
  Deep.prototype.toJSON = function () {
    return {
      type: 'deep',
      left: this.left,
      mid: this.mid,
      right: this.right,
      measure: this.measure()
    };
  };


  /**
   * A lazy-evaluted finger-tree.
   * @constructor
   * @implements {FingerTree}
   * @param {function(): FingerTree} thunk A function, which when called, will
   *   return a finger-tree instance.
   */
  function DelayedFingerTree(thunk) {
    this.tree = null;
    this.thunk = thunk;
  }

  /**
   * Evaluate the thunk and return the finger-tree.
   * @return {FingerTree}
   */
  DelayedFingerTree.prototype.force = function () {
    if (this.tree === null) {
      this.tree = this.thunk();
    }
    return this.tree;
  };

  /**
   * @inheritDoc
   */
  DelayedFingerTree.prototype.isEmpty = function (v) {
    return this.force().isEmpty();
  };

  /**
   * @inheritDoc
   */
  DelayedFingerTree.prototype.measure = function () {
    return this.force().measure();
  };

  /**
   * @inheritDoc
   */
  DelayedFingerTree.prototype.peekFirst = function () {
    return this.force().peekFirst();
  };

  /**
   * @inheritDoc
   */
  DelayedFingerTree.prototype.peekLast = function () {
    return this.force().peekLast();
  };

  /**
   * @inheritDoc
   */
  DelayedFingerTree.prototype.addFirst = function (v) {
    return this.force().addFirst(v);
  };

  /**
   * @inheritDoc
   */
  DelayedFingerTree.prototype.addLast = function (v) {
    return this.force().addLast(v);
  };

  /**
   * @inheritDoc
   */
  DelayedFingerTree.prototype.removeFirst = function () {
    return this.force().removeFirst();
  };

  /**
   * @inheritDoc
   */
  DelayedFingerTree.prototype.removeLast = function () {
    return this.force().removeLast();
  };

  /**
   * @inheritDoc
   */
  DelayedFingerTree.prototype.splitTree = function (predicate, initial) {
    return this.force().splitTree(predicate, initial);
  };

  /**
   * @inheritDoc
   */
  DelayedFingerTree.prototype.split = function (predicate) {
    return this.force().split(predicate);
  };

  /**
   * @inheritDoc
   */
  DelayedFingerTree.prototype.concat = function (other) {
    return this.force().concat(other);
  };

  /**
   * @inheritDoc
   */
  DelayedFingerTree.prototype.takeUntil = function (predicate) {
    return this.force().takeUntil(predicate);
  };

  /**
   * @inheritDoc
   */
  DelayedFingerTree.prototype.dropUntil = function (predicate) {
    return this.force().dropUntil(predicate);
  };

  /**
   * @inheritDoc
   */
  DelayedFingerTree.prototype.toJSON = function () {
    return this.force().toJSON();
  };


  /**
   * @param {Array} left
   * @param {FingerTree} mid
   * @param {Digit} right
   */
  function deepLeft(measurer, left, mid, right) {
    if (!left.length) {
      if (mid.isEmpty()) {
        return fromArray(right.items, measurer);
      }
      return new DelayedFingerTree(function () {
        return new Deep(measurer,
                        mid.peekFirst().toDigit(),
                        mid.removeFirst(),
                        right);
      });
    }
    return new Deep(measurer, new Digit(measurer, left), mid, right);
  }

  /**
   * @param {Digit} left
   * @param {FingerTree} mid
   * @param {Array} right
   */
  function deepRight(measurer, left, mid, right) {
    if (!right.length) {
      if (mid.isEmpty()) {
        return fromArray(left.items, measurer);
      }
      return new DelayedFingerTree(function () {
        return new Deep(measurer,
                        left,
                        mid.removeLast(),
                        mid.peekLast().toDigit());
      });
    }
    return new Deep(measurer, left, mid, new Digit(measurer, right));
  }

  /**
   * Helper function to concatenate two finger-trees with additional elements
   * in between.
   * @param {FingerTree} t1 Left finger-tree
   * @param {Array} ts An array of elements in between the two finger-trees
   * @param {FingerTree} t2 Right finger-tree
   * @return {FingerTree}
   */
  function app3(t1, ts, t2) {
    if (t1 instanceof DelayedFingerTree) {
      t1 = t1.force();
    }
    if (t2 instanceof DelayedFingerTree) {
      t2 = t2.force();
    }
    if (t1 instanceof Empty) {
      return prepend(t2, ts);
    }
    if (t2 instanceof Empty) {
      return append(t1, ts);
    }
    if (t1 instanceof Single) {
      return prepend(t2, ts).addFirst(t1.value);
    }
    if (t2 instanceof Single) {
      return append(t1, ts).addLast(t2.value);
    }
    return new Deep(t1.measurer,
                    t1.left,
                    new DelayedFingerTree(function () {
                      return app3(t1.mid,
                                  nodes(t1.measurer, 
                                        t1.right.items
                                          .concat(ts)
                                          .concat(t2.left.items)),
                                  t2.mid);
                    }),
                    t2.right);
  }

  /**
   * Helper function to group an array of elements into an array of nodes.
   * @param {Object.<string, function>} m Measurer 
   * @param {Array} xs
   * @return {Array}
   */
  function nodes(m, xs) {
    switch (xs.length) {
      case 2: return [new Node(m, xs)];
      case 3: return [new Node(m, xs)];
      case 4: return [new Node(m, [xs[0], xs[1]]),
                      new Node(m, [xs[2], xs[3]])];
      case 5: return [new Node(m, [xs[0], xs[1], xs[2]]),
                      new Node(m, [xs[3], xs[4]])];
      case 6: return [new Node(m, [xs[0], xs[1], xs[2]]),
                      new Node(m, [xs[3], xs[4], xs[5]])];
      case 7: return [new Node(m, [xs[0], xs[1], xs[2]]),
                      new Node(m, [xs[3], xs[4]]),
                      new Node(m, [xs[5], xs[6]])];
      case 8: return [new Node(m, [xs[0], xs[1], xs[2]]),
                      new Node(m, [xs[3], xs[4], xs[5]]),
                      new Node(m, [xs[6], xs[7]])];
      default: throw new Error('invalid number of nodes');
    }
  }

  /**
   * Construct a derived measurer which will return the memoized
   * measurement of a node instead of evaluting the node.
   * @param {Object.<string, function>} measurer
   * @return {Object.<string, function>}
   */
  function makeNodeMeasurer(measurer) {
    return {
      identity: measurer.identity,
      measure: function (n) {
        return n.measure();
      },
      sum: measurer.sum
    };
  }

  /**
   * Prepend an array of elements to the left of a tree.
   * Returns a new tree with the original one unmodified.
   * @param {FingerTree} tree
   * @param {Array} xs
   * @return {FingerTree}
   */
  function prepend(tree, xs) {
    for (var i = xs.length - 1; i >= 0; --i) {
      tree = tree.addFirst(xs[i]);
    }
    return tree;
  }

  /**
   * Append an array of elements to the right of a tree.
   * Returns a new tree with the original one unmodified.
   * @param {FingerTree} tree
   * @param {Array} xs
   * @return {FingerTree}
   */
  function append(tree, xs) {
    for (var i = 0, len = xs.length; i < len; ++i) {
      tree = tree.addLast(xs[i]);
    }
    return tree;
  }

  /**
   * Construct a fingertree from an array.
   * @param {Array} xs An array of elements.
   * @param {Object.<string, function>} measurer
   * @return {FingerTree}
   */
  function fromArray(xs, measurer) {
    measurer = measurer || {
      identity: function () {
        return 0;
      },
      measure: function (v) {
        return 1;
      },
      sum: function (a, b) {
        return a + b;
      }
    };
    return prepend(new Empty(measurer), xs);
  }

  return FingerTree;
}));
