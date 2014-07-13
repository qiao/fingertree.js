# FingerTree.js

[![Build Status](https://travis-ci.org/qiao/fingertree.js.svg?branch=master)](https://travis-ci.org/qiao/fingertree.js)

Implementation of Finger Tree, an immutable general-purpose
data structure which can further be used to implement random-access
sequences, priority-queues, ordered sequences, interval trees, etc.

Based on: Ralf Hinze and Ross Paterson, ["Finger trees: a simple general-purpose data structure"](http://www.soi.city.ac.uk/~ross/papers/FingerTree.html).

## Installation (Browser)

Download the [js file](https://raw.githubusercontent.com/qiao/fingertree.js/master/src/fingertree.js) and include it in your web page.

```html
<script type="text/javascript" src="./fingertree.js"></script>
```


## Installation (Node.js)

If you want to use it in Node.js, you may install it via npm.

```
npm install fingertree
```

Then, in your program:

```javascript
var FingerTree = require('fingertree');
```

## Quick Examples

```javascript
// Create a finger-tree from an array
// By default, the tree is annotated with a size measurer.
var tree = FingerTree.fromArray([1, 2, 3, 4]);
tree.measure; // 4

tree.peekFirst(); // 1
tree.peekLast();  // 4

// Create a new tree with an element added to the front
var tree2 = tree.addFirst(0);
tree2.peekFirst(); // 0

// Create a new tree with an element added to the end
var tree3 = tree.addLast(5);
tree3.peekLast(); // 5

// Create a new tree with the first element removed
var tree4 = tree.removeFirst();
tree4.peekFirst(); // 2

// Create a new tree with the last element removed
var tree5 = tree.removeLast();
tree5.peekLast(); // 3

// Split into two trees with a predicate on measure.
var split = tree.split(function (measure) {
  return measure > 3;
});
split[0].measure; // 3
split[1].measure; // 1


// Create a finger-tree with a custom measurer.
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
var maxTree = FingerTree.fromArray([1, 3, 2, 9, 7], measurer);
maxTree.measure; // 9
```


## License

[MIT License](http://www.opensource.org/licenses/mit-license.php)

&copy; 2014 Xueqiao Xu &lt;xueqiaoxu@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
