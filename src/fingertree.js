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

    var m = measurer.identity();
    for (var i = 0, len = items.length; i < len; ++i) {
      m = measurer.sum(m, measurer.measure(items[i]));
    }
    this.measure = m;
  }

  Digit.prototype.first = function () {
    return this.items[0];
  };

  Digit.prototype.last = function () {
    return this.items[this.items.length - 1];
  };

  function Node(measurer, items) {
    this.items = items;
     
    var m = measurer.identity();
    for (var i = 0, len = items.length; i < len; ++i) {
      m = measurer.sum(m, measurer.measure(items[i]));
    }
    this.measure = m;
  }

  function FingerTree(measurer) {
    this.measurer = measurer;
  } 

  FingerTree.fromArray = fromArray;

  function Empty(measurer) {
    FingerTree.call(this, measurer);
    this.measure = this.measurer.identity();
  }

  Empty.prototype = create(FingerTree.prototype);

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
    this.measure = this.measurer.measure(value);
  }

  Single.prototype = create(FingerTree.prototype);

  Single.prototype.addFirst = function (v) {
    var measurer = this.measurer;

    return new Deep(measurer,
                    new Digit(measurer, [v]),
                    new Empty(makeNodeMeasurer(measurer)),
                    new Digit(measurer, [this.value]));
  };

  Single.prototype.addLast = function (v) {
    var measurer = this.measurer;

    return new Deep(measurer,
                    new Digit(measurer, [this.value]),
                    new Empty(makeNodeMeasurer(measurer)),
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
    this.measure = this.measurer.sum(
      this.measurer.sum(this.left.measure, this.mid.measure),
      this.right.measure);
  }

  Deep.prototype = create(FingerTree.prototype);


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

  function makeNodeMeasurer(measurer) {
    return {
      identity: measurer.identity,
      measure: function (n) {
        return n.measure;
      },
      sum: measurer.sum
    };
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
