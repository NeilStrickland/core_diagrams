/* eslint-env browser */
/* global comb */

'use strict';

var irange = function (x) {
 var n, R, i;

 n = parseInt(x);
 R = [];
 for (i = 1; i <= n; i++) { R.push(i); }
 return R;
};

//////////////////////////////////////////////////////////////////////

var dp = function (u, v) {
 var n, m, i, x;

 n = u.length;
 m = v.length;
 if (n !== m) { throw 'length mismatch'; }

 x = 0;
 for (i = 0; i < n; i++) { x += u[i] * v[i]; }
 return x;
};

//////////////////////////////////////////////////////////////////////

var random_element_of = function (A) {
 if (Array.isArray(A)) {
  return A[Math.floor(Math.random() * A.length)];
 } else {
  return Math.ceil(Math.random() * parseInt(A));
 }
};

//////////////////////////////////////////////////////////////////////

var random_subset_of = function (A_, size_) {
 var A, n, V, T, i, j, k, size;

 if (Array.isArray(A_)) {
  A = A_;
  n = A.length;
 } else {
  n = parseInt(A_);
  A = irange(n);
 }

 if (size_ === null) {
  V = [];
  for (i in A) {
   if (Math.random() >= 0.5) { V.push(A[i]); }
  }
  return V;
 } else {
  size = parseInt(size_);
  if (size > n) { return null; }
  T = {};
  for (i = 0; i < n; i++) { T[i] = 0; }
  V = [];
  for (i = 0; i < size; i++) {
   j = Math.floor(Math.random() * (n - i));
   k = 0;
   while (j) {
    k++;
    while (T[k]) { k++; }
    j--;
   }
   V.push(A[k]);
   T[k] = 1;
  }
  return V;
 }
};

//////////////////////////////////////////////////////////////////////

var permutations = function (n) {
 var P, Q, i, j, u, v;

 if (n <= 0) {
  return [[]];
 } else {
  P = permutations(n - 1);
  Q = [];
  for (i in P) {
   for (j = n - 1; j >= 0; j--) {
    u = P[i];
    v = u.slice(0, j);
    v.push(n);
    v = v.concat(u.slice(j, n - 1));
    Q.push(v);
   }
  }
 }
 return Q;
}

//////////////////////////////////////////////////////////////////////

var interval = {};

interval.munch = function (u) {
 var o = Object.create(this);
 o.type = u[0];
 o.left_type = u[0].substring(0, 1);
 o.right_type = u[0].substring(1, 2);
 o.start = u[1];
 o.end = u[2];
 o.is_bounded_below = !(o.start == -Infinity);
 o.is_bounded_above = !(o.end == Infinity);
 return o;
};

interval.is_empty = function () {
 if (this.start > this.end) { return true; }
 if (this.start == this.end && (this.left_type == 'o' || this.right_type == 'o')) { return true; }
 return false;
}

interval.is_singleton = function () {
 return (this.start == this.end && this.left_type == 'c' && this.right_type == 'c');
}

interval.is_whole_line = function () {
 return (this.start == -Infinity && this.end == Infinity);
}

interval.latex = function () {
 if (this.start == -Infinity) {
  this.start_latex = '-\\infty';
 } else if (this.start == Infinity) {
  this.start_latex = '\\infty';
 } else {
  this.start_latex = this.start;
 }

 if (this.end == -Infinity) {
  this.end_latex = '-\\infty';
 } else if (this.end == Infinity) {
  this.end_latex = '\\infty';
 } else {
  this.end_latex = this.end;
 }

 if (this.is_empty()) { return '\\emptyset'; }
 if (this.is_singleton()) { return '\\{' + this.start + '\\}'; }
 if (this.is_whole_line()) { return '\\mathbb{R}'; }

 var s = '';
 if (this.left_type == 'o') { s += '('; } else { s += '['; }
 s += this.start_latex + ',' + this.end_latex;
 if (this.right_type == 'o') { s += ')'; } else { s += ']'; }
 this.interval_latex = s;
 return s;
}

interval.equals = function (x) {
 if (this.type != x.type) { return false; }
 if (this.start != x.start) { return false; }
 if (this.end != x.end) { return false; }
 return true;
}

interval.is_contained_in = function (x) {
 if (this.start < x.start) { return false; }
 if (this.end > x.end) { return false; }
 if (this.start == x.start && this.left_type == 'c' && x.left_type == 'o') { return false; }
 if (this.end == x.end && this.right_type == 'c' && x.right_type == 'o') { return false; }
 return true;
}

interval.contains = function (x) {
 if (this.start > x) { return false; }
 if (this.end < x) { return false; }
 if (this.start == x && this.left_type == 'o') { return false; }
 if (this.end == x && this.right_type == 'o') { return false; }
 return true;
}

interval.make_svg = function (svg, opts) {
 var defaults = {
  truncate: 5,
  x0: 0,
  y0: 0,
  bracket_height: 0.25,
  color: 'red',
  thickness: 1,
  f : function (x) { return x; },
  g : function (y) { return y; }
 };
 if (!opts) { opts = {}; }
 for (var i in defaults) {
  if (! opts.hasOwnProperty(i)) {
   opts[i] = defaults[i];
  }
 }
 var f = opts.f;
 var g = opts.g;
 var f0 = f(0);
 var xs = f(1) - f(0);
 var ys = g(0) - g(1);
 var y1 = g(opts.y0);
 this.svg_group = svg.group();
 this.svg_axis = svg.hline(f(-opts.truncate), f(opts.truncate), y1, 'grey', 1);
 this.svg_axis.setAttribute('stroke-dasharray', '2,2');
 this.svg_group.appendChild(this.svg_axis);
 if (this.is_empty()) { return this.svg_group; }
 if (this.is_singleton()) {
  var x = f(this.start);
  var r = 0.5 * ys * opts.bracket_height;
  this.svg_group.appendChild(svg.disc(x, y1, r, opts.color, opts.thickness));
  return this.svg_group;
 }
 var s = this.start;
 var l = this.left_type;
 if (s < -opts.truncate) { s = -opts.truncate; l = ''; }
 var e = this.end;
 var r = this.right_type;
 if (e > opts.truncate) { e = opts.truncate; r = ''; }
 var x1 = f(opts.x0 + s);
 var x2 = f(opts.x0 + e);
 this.svg_bar = svg.hline(x1, x2, y1, opts.color, opts.thickness);
 this.svg_left_cap = svg.group();
 this.svg_right_cap = svg.group();
 this.svg_group.appendChild(this.svg_bar);
 this.svg_group.appendChild(this.svg_left_cap);
 this.svg_group.appendChild(this.svg_right_cap);
 var h = ys * opts.bracket_height;
 if (l == 'c') {
  this.svg_left_cap.appendChild(svg.vline(x1, y1 - 0.5 * h, y1 + 0.5 * h, opts.color, opts.thickness));
  this.svg_left_cap.appendChild(svg.hline(x1, x1 + 0.3 * h, y1 - 0.5 * h, opts.color, opts.thickness));
  this.svg_left_cap.appendChild(svg.hline(x1, x1 + 0.3 * h, y1 + 0.5 * h, opts.color, opts.thickness));
 } else if (l == 'o') {
  var n = svg.node('path');
  var rx = 0.3 * h;
  var ry = 0.5 * h;
  var nx = x1 + rx;
  var ny = y1 + ry;
  var nz = y1 - ry;
  n.setAttribute('stroke', opts.color);
  n.setAttribute('stroke-width', opts.thickness);
  n.setAttribute('fill', 'none');
  n.setAttribute('d', 'M ' + nx + ' ' + ny + ' A ' + rx + ' ' + ry + ' 0 0 1 ' + nx + ' ' + nz);
  this.svg_left_cap.appendChild(n);
 }

 if (r == 'c') {
  this.svg_right_cap.appendChild(svg.vline(x2, y1 - 0.5 * h, y1 + 0.5 * h, opts.color, opts.thickness));
  this.svg_right_cap.appendChild(svg.hline(x2 - 0.3 * h, x2, y1 - 0.5 * h, opts.color, opts.thickness));
  this.svg_right_cap.appendChild(svg.hline(x2 - 0.3 * h, x2, y1 + 0.5 * h, opts.color, opts.thickness));
 } else if (r == 'o') {
  var n = svg.node('path');
  var rx = 0.3 * h;
  var ry = 0.5 * h;
  var nx = x2 - rx;
  var ny = y1 + ry;
  var nz = y1 - ry;
  n.setAttribute('stroke', opts.color);
  n.setAttribute('stroke-width', opts.thickness);
  n.setAttribute('fill', 'none');
  n.setAttribute('d', 'M ' + nx + ' ' + ny + ' A ' + rx + ' ' + ry + ' 0 0 0 ' + nx + ' ' + nz);
  this.svg_right_cap.appendChild(n);
 }

 return this.svg_group;
}