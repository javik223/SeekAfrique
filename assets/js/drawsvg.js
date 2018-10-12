/*!
 * VERSION: 0.0.6
 * DATE: 2015-08-22
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * @license Copyright (c) 2008-2015, GreenSock. All rights reserved.
 * DrawSVGPlugin is a Club GreenSock membership benefit; You must have a valid membership to use
 * this code without violating the terms of use. Visit http://greensock.com/club/ to sign up or get more details.
 * This work is subject to the software agreement that was issued with your membership.
 *
 * @author: Jack Doyle, jack@greensock.com
 */
var _gsScope =
  'undefined' != typeof module && module.exports && 'undefined' != typeof global
    ? global
    : this || window;
(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push(function() {
  'use strict';
  function t(t, e, i, r) {
    return (
      (i = parseFloat(i) - parseFloat(t)),
      (r = parseFloat(r) - parseFloat(e)),
      Math.sqrt(i * i + r * r)
    );
  }
  function e(t) {
    return (
      ('string' != typeof t && t.nodeType) ||
        ((t = _gsScope.TweenLite.selector(t)), t.length && (t = t[0])),
      t
    );
  }
  function i(t, e, i) {
    var r,
      s,
      n = t.indexOf(' ');
    return (
      -1 === n
        ? ((r = void 0 !== i ? i + '' : t), (s = t))
        : ((r = t.substr(0, n)), (s = t.substr(n + 1))),
      (r = -1 !== r.indexOf('%') ? (parseFloat(r) / 100) * e : parseFloat(r)),
      (s = -1 !== s.indexOf('%') ? (parseFloat(s) / 100) * e : parseFloat(s)),
      r > s ? [s, r] : [r, s]
    );
  }
  function r(i) {
    if (!i) return 0;
    i = e(i);
    var r,
      s,
      n,
      a,
      o,
      l,
      h,
      u,
      f = i.tagName.toLowerCase();
    if ('path' === f)
      (o = i.style.strokeDasharray),
        (i.style.strokeDasharray = 'none'),
        (r = i.getTotalLength() || 0),
        (i.style.strokeDasharray = o);
    else if ('rect' === f) (s = i.getBBox()), (r = 2 * (s.width + s.height));
    else if ('circle' === f) r = 2 * Math.PI * parseFloat(i.getAttribute('r'));
    else if ('line' === f)
      r = t(
        i.getAttribute('x1'),
        i.getAttribute('y1'),
        i.getAttribute('x2'),
        i.getAttribute('y2'),
      );
    else if ('polyline' === f || 'polygon' === f)
      for (
        n = i.getAttribute('points').split(' '),
          r = 0,
          o = n[0].split(','),
          'polygon' === f &&
            (n.push(n[0]), -1 === n[0].indexOf(',') && n.push(n[1])),
          l = 1;
        n.length > l;
        l++
      )
        (a = n[l].split(',')),
          1 === a.length && (a[1] = n[l++]),
          2 === a.length && ((r += t(o[0], o[1], a[0], a[1]) || 0), (o = a));
    else
      'ellipse' === f &&
        ((h = parseFloat(i.getAttribute('rx'))),
        (u = parseFloat(i.getAttribute('ry'))),
        (r = Math.PI * (3 * (h + u) - Math.sqrt((3 * h + u) * (h + 3 * u)))));
    return r || 0;
  }
  function s(t, i) {
    if (!t) return [0, 0];
    (t = e(t)), (i = i || r(t) + 1);
    var s = a(t),
      n = s.strokeDasharray || '',
      o = parseFloat(s.strokeDashoffset),
      l = n.indexOf(',');
    return (
      0 > l && (l = n.indexOf(' ')),
      (n = 0 > l ? i : parseFloat(n.substr(0, l)) || 1e-5),
      n > i && (n = i),
      [Math.max(0, -o), Math.max(0, n - o)]
    );
  }
  var n,
    a = document.defaultView
      ? document.defaultView.getComputedStyle
      : function() {};
  (n = _gsScope._gsDefine.plugin({
    propName: 'drawSVG',
    API: 2,
    version: '0.0.6',
    global: !0,
    overwriteProps: ['drawSVG'],
    init: function(t, e) {
      if (!t.getBBox) return !1;
      var n,
        a,
        o,
        l = r(t) + 1;
      return (
        (this._style = t.style),
        e === !0 || 'true' === e
          ? (e = '0 100%')
          : e
            ? -1 === (e + '').indexOf(' ') && (e = '0 ' + e)
            : (e = '0 0'),
        (n = s(t, l)),
        (a = i(e, l, n[0])),
        (this._length = l + 10),
        0 === n[0] && 0 === a[0]
          ? ((o = Math.max(1e-5, a[1] - l)),
            (this._dash = l + o),
            (this._offset = l - n[1] + o),
            this._addTween(
              this,
              '_offset',
              this._offset,
              l - a[1] + o,
              'drawSVG',
            ))
          : ((this._dash = n[1] - n[0] || 1e-6),
            (this._offset = -n[0]),
            this._addTween(
              this,
              '_dash',
              this._dash,
              a[1] - a[0] || 1e-5,
              'drawSVG',
            ),
            this._addTween(this, '_offset', this._offset, -a[0], 'drawSVG')),
        !0
      );
    },
    set: function(t) {
      this._firstPT &&
        (this._super.setRatio.call(this, t),
        (this._style.strokeDashoffset = this._offset),
        (this._style.strokeDasharray =
          1 === t || 0 === t
            ? 0.001 > this._offset && 10 >= this._length - this._dash
              ? 'none'
              : this._offset === this._dash
                ? '0px, 999999px'
                : this._dash + 'px,' + this._length + 'px'
            : this._dash + 'px,' + this._length + 'px'));
    },
  })),
    (n.getLength = r),
    (n.getPosition = s);
}),
  _gsScope._gsDefine && _gsScope._gsQueue.pop()();
