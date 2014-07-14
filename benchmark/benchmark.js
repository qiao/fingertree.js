var FingerTree = require('..');


var t, i, len = 100000;

console.time('addFirst');
t = FingerTree.fromArray([]);
for (i = 0; i < len; ++i) {
  t = t.addFirst(i);
}
console.timeEnd('addFirst');

console.time('removeFirst');
for (i = 0; i < len; ++i) {
  t = t.removeFirst();
}
console.timeEnd('removeFirst');

console.time('addLast');
t = FingerTree.fromArray([]);
for (i = 0; i < len; ++i) {
  t = t.addLast(i);
}
console.timeEnd('addLast');

console.time('split');
for (i = 0; i < len; ++i) {
  t.split(function (m) {
    return m > i;
  });
}
console.timeEnd('split');

console.time('removeLast');
for (i = 0; i < len; ++i) {
  t = t.removeLast();
}
console.timeEnd('removeLast');
