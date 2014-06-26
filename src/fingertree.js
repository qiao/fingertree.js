(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define([], factory);
  } else if (typeof exports === 'object') {
    // CommonJS
    module.exports = factory();
  } else {
    // browser global
    root.returnExports = factory();
  }
}(this, function () {

  function Node2(a, b) {
    this.a = a;
    this.b = b;
  }

  function Node3(a, b, c) {
    this.a = a;
    this.b = b;
    this.c = c;
  }


  function Empty() { }

  Empty.prototype.addFirst = function (v) {
    return new Single(v);
  };

  Empty.prototype.addLast = function (v) {
    return new Single(v);
  };

  Empty.prototype.isEmpty = function () {
    return true;
  };

  Empty.prototype.concat = function (other) {
    return other;
  };


  function Single(value) {
    this.value = value;
  }

  Single.prototype.addFirst = function (v) {
    return new Deep([v], new Empty(), [this.value]);
  };

  Single.prototype.addLast = function (v) {
    return new Deep([this.value], new Empty(), [v]);
  };

  Single.prototype.isEmpty = function () {
    return false;
  };

  Single.prototype.concat = function (other) {
    return other.addFirst(this.value);
  };



  function Deep(left, mid, right) {
    this.left = left;
    this.mid = mid;
    this.right = right;
  }

  Deep.prototype.addFirst = function (v) {
    var left = this.left;
    var mid = this.mid;
    var right = this.right;

    if (left.length === 4) {
      return new Deep([v, left[0]],
                      mid.addFirst(new Node3(left[1], left[2], left[3])),
                      right);
    }
    return new Deep([v].concat(left), mid, right);
  };

  Deep.prototype.addLast = function (v) {
    var left = this.left;
    var mid = this.mid;
    var right = this.right;

    if (right.length === 4) {
      return new Deep(left,
                      mid.addLast(new Node3(right[0], right[1], right[2])),
                      [right[3], v]);
    }
    return new Deep(left, mid, right.concat[v]);
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
    return new Deep(t1.left,
                    app3(t1.mid,
                         nodes(t1.right.concat(ts).concat(t2.left)),
                         t2.mid),
                    t2.right);
  }

  function nodes(xs) {
    switch (xs.length) {
      case 2: return [new Node2(xs[0], xs[1])];
      case 3: return [new Node3(xs[0], xs[1], xs[2])];
      case 4: return [new Node2(xs[0], xs[1]), new Node2(xs[2], xs[3])];
      case 5: return [new Node3(xs[0], xs[1], xs[2]),
                      new Node2(xs[3], xs[4])];
      case 6: return [new Node3(xs[0], xs[1], xs[2]),
                      new Node3(xs[3], xs[4], xs[5])];
      case 7: return [new Node3(xs[0], xs[1], xs[2]),
                      new Node3(xs[3], xs[4], xs[5])];
      case 8: return [new Node3(xs[0], xs[1], xs[2]),
                      new Node3(xs[3], xs[4], xs[5]),
                      new Node2(xs[6], xs[7])];
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

  function toTree(xs) {
    return prepend(new Empty(), xs);
  }

  return {
    toTree: toTree
  };
}));
