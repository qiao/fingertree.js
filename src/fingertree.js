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

  var create = Object.create || function (o) {
    function F() {}
    F.prototype = o;
    return new F();
  };
  
  function Digit(measurer, items) {
    this.items = items;
    this.length = items.length;
    this.measurer = measurer;
  }

  Digit.prototype.measure = function () {
    var items = this.items;
    var measurer = this.measurer;

    var m = measurer.identity();
    for (var i = 0; i < items.length; ++i) {
      m = measurer.sum(m, measurer.measure(items[i]));
    }
    return m;
  };

  Digit.prototype.get = function (index) {
    return this.items[index];
  };

  Digit.prototype.first = function () {
    return this.items[0];
  };

  Digit.prototype.last = function () {
    return this.items[this.items.length - 1];
  };

  function Node(measurer, items) {
    this.items = items;
     
    var m = measurer.identity();
    for (var i = 0; i < items.length; ++i) {
      m = measurer.sum(m, measurer.measure(items[i]));
    }
    this.memoizedMeasure = m;
  }

  Node.prototype.measure = function () {
    return this.memoizedMeasure;
  };

  function FingerTree(measurer) {
    this.measurer = measurer || {
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
  } 

  FingerTree.fromArray = fromArray;

  function Empty(measurer) {
    FingerTree.call(this, measurer);
    this.memoizedMeasure = this.measurer.identity();
  }

  Empty.prototype = create(FingerTree.prototype);

  Empty.prototype.measure = function () {
    return this.memoizedMeasure;
  };

  Empty.prototype.addFirst = function (v) {
    return new Single(this.measurer, v);
  };

  Empty.prototype.addLast = function (v) {
    return new Single(this.measurer, v);
  };

  Empty.prototype.peekFirst = function () {
    return null;
  };

  Empty.prototype.peekLast = function () {
    return null;
  };

  Empty.prototype.isEmpty = function () {
    return true;
  };

  Empty.prototype.concat = function (other) {
    return other;
  };



  function Single(measurer, value) {
    FingerTree.call(this, measurer);
    this.value = value;
    this.memoizedMeasure = this.measurer.measure(value);
  }

  Single.prototype = create(FingerTree.prototype);

  Single.prototype.measure = function () {
    return this.memoizedMeasure;
  };

  Single.prototype.addFirst = function (v) {
    var measurer = this.measurer;
    return new Deep(measurer,
                    new Digit(measurer, [v]),
                    new Empty(measurer),
                    new Digit(measurer, [this.value]));
  };

  Single.prototype.addLast = function (v) {
    var measurer = this.measurer;
    return new Deep(measurer,
                    new Digit(measurer, [this.value]),
                    new Empty(measurer),
                    new Digit(measurer, [v]));
  };

  Single.prototype.peekFirst = function () {
    return this.value;
  };

  Single.prototype.peekLast = function () {
    return this.value;
  };

  Single.prototype.isEmpty = function () {
    return false;
  };

  Single.prototype.concat = function (other) {
    return other.addFirst(this.value);
  };


  function Deep(measurer, left, mid, right) {
    FingerTree.call(this, measurer);
    this.left = left;
    this.mid = mid;
    this.right = right;
    this.memoizedMeasure = null;
  }

  Deep.prototype = create(FingerTree.prototype);

  Deep.prototype.measure = function () {
    var measurer = this.measurer;
    if (this.memoizedMeasure === null) {
      this.memoizedMeasure = measurer.sum(
        measurer.sum(this.left.measure(), this.mid.measure()),
        this.right.measure());
    }
    return this.memoizedMeasure;
  };

  Deep.prototype.addFirst = function (v) {
    var left = this.left;
    var mid = this.mid;
    var right = this.right;
    var measurer = this.measurer;

    if (left.length === 4) {
      return new Deep(measurer,
                      new Digit(measurer, [v, left.get(0)]),
                      mid.addFirst(new Node(measurer, [left.get(1), left.get(2), left.get(3)])),
                      right);
    }
    return new Deep(measurer,
                    new Digit(measurer, [v].concat(left.items)),
                    mid,
                    right);
  };

  Deep.prototype.addLast = function (v) {
    var left = this.left;
    var mid = this.mid;
    var right = this.right;
    var measurer = this.measurer;

    if (right.length === 4) {
      return new Deep(measurer,
                      left,
                      mid.addLast(new Node(measurer, [right[0], right[1], right[2]])),
                      new Digit(measurer, [right[3], v]));
    }
    return new Deep(measurer,
                    left,
                    mid,
                    new Digit(measurer, right.items.concat([v])));
  };

  Deep.prototype.peekFirst = function () {
    return this.left.first();
  };

  Deep.prototype.peekLast = function () {
    return this.right.last();
  };

  Deep.prototype.isEmpty = function () {
    return false;
  };

  Deep.prototype.concat = function (other) {
    if (other instanceof Empty) {
      return this;
    }
    if (other instanceof Single) {
      return this.addLast(other.value);
    }
    return app3(this, [], other);
  };

  function app3(t1, ts, t2) {
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
                    app3(t1.mid,
                         nodes(t1.measurer, t1.right.itemsconcat(ts).concat(t2.left.items)),
                         t2.mid),
                    t2.right);
  }

  function nodes(m, xs) {
    switch (xs.length) {
      case 2: return new Digit(m, [new Node(m, xs)]);
      case 3: return new Digit(m, [new Node(m, xs)]);
      case 4: return new Digit(m, [new Node(m, [xs[0], xs[1]]),
                                   new Node(m, [xs[2], xs[3]])]);
      case 5: return new Digit(m, [new Node(m, [xs[0], xs[1], xs[2]]),
                                   new Node(m, [xs[3], xs[4]])]);
      case 6: return new Digit(m, [new Node(m, [xs[0], xs[1], xs[2]]),
                                   new Node(m, [xs[3], xs[4], xs[5]])]);
      case 7: return new Digit(m, [new Node(m, [xs[0], xs[1], xs[2]]),
                                   new Node(m, [xs[3], xs[4], xs[5]])]);
      case 8: return new Digit(m, [new Node(m, [xs[0], xs[1], xs[2]]),
                                   new Node(m, [xs[3], xs[4], xs[5]]),
                                   new Node(m, [xs[6], xs[7]])]);
      default: throw new Error('invalid number of nodes');
    }
  }

  function prepend(tree, xs) {
    for (var i = xs.length - 1; i >= 0; --i) {
      tree = tree.addFirst(xs[i]);
    }
    return tree;
  }

  function append(tree, xs) {
    for (var i = 0, len = xs.length; i < len; ++i) {
      tree = tree.addLast(xs[i]);
    }
    return tree;
  }

  function fromArray(xs, measurer) {
    return prepend(new Empty(measurer), xs);
  }

  return FingerTree;
}));
