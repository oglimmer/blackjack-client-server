"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

define("ace/ext/hardwrap", ["require", "exports", "module", "ace/range", "ace/editor", "ace/config"], function (e, t, n) {
  "use strict";

  function i(e, t) {
    function m(e, t, n) {
      if (e.length < t) return;
      var r = e.slice(0, t),
          i = e.slice(t),
          s = /^(?:(\s+)|(\S+)(\s+))/.exec(i),
          o = /(?:(\s+)|(\s+)(\S+))$/.exec(r),
          u = 0,
          a = 0;
      o && !o[2] && (u = t - o[1].length, a = t), s && !s[2] && (u || (u = t), a = t + s[1].length);
      if (u) return {
        start: u,
        end: a
      };
      if (o && o[2] && o.index > n) return {
        start: o.index,
        end: o.index + o[2].length
      };
      if (s && s[2]) return u = t + s[2].length, {
        start: u,
        end: u + s[3].length
      };
    }

    var n = t.column || e.getOption("printMarginColumn"),
        i = t.allowMerge != 0,
        s = Math.min(t.startRow, t.endRow),
        o = Math.max(t.startRow, t.endRow),
        u = e.session;

    while (s <= o) {
      var a = u.getLine(s);

      if (a.length > n) {
        var f = m(a, n, 5);

        if (f) {
          var l = /^\s*/.exec(a)[0];
          u.replace(new r(s, f.start, s, f.end), "\n" + l);
        }

        o++;
      } else if (i && /\S/.test(a) && s != o) {
        var c = u.getLine(s + 1);

        if (c && /\S/.test(c)) {
          var h = a.replace(/\s+$/, ""),
              p = c.replace(/^\s+/, ""),
              d = h + " " + p,
              f = m(d, n, 5);

          if (f && f.start > h.length || d.length < n) {
            var v = new r(s, h.length, s + 1, c.length - p.length);
            u.replace(v, " "), s--, o--;
          } else h.length < a.length && u.remove(new r(s, h.length, s, a.length));
        }
      }

      s++;
    }
  }

  function s(e) {
    if (e.command.name == "insertstring" && /\S/.test(e.args)) {
      var t = e.editor,
          n = t.selection.cursor;
      if (n.column <= t.renderer.$printMarginColumn) return;
      var r = t.session.$undoManager.$lastDelta;
      i(t, {
        startRow: n.row,
        endRow: n.row,
        allowMerge: !1
      }), r != t.session.$undoManager.$lastDelta && t.session.markUndoGroup();
    }
  }

  var r = e("../range").Range,
      o = e("../editor").Editor;
  e("../config").defineOptions(o.prototype, "editor", {
    hardWrap: {
      set: function set(e) {
        e ? this.commands.on("afterExec", s) : this.commands.off("afterExec", s);
      },
      value: !1
    }
  }), t.hardWrap = i;
}), define("ace/keyboard/vim", ["require", "exports", "module", "ace/range", "ace/lib/event_emitter", "ace/lib/dom", "ace/lib/oop", "ace/lib/keys", "ace/lib/event", "ace/search", "ace/lib/useragent", "ace/search_highlight", "ace/commands/multi_select_commands", "ace/mode/text", "ace/ext/hardwrap", "ace/multi_select"], function (e, t, n) {
  "use strict";

  function r() {
    function t(e) {
      return _typeof(e) != "object" ? e + "" : "line" in e ? e.line + ":" + e.ch : "anchor" in e ? t(e.anchor) + "->" + t(e.head) : Array.isArray(e) ? "[" + e.map(function (e) {
        return t(e);
      }) + "]" : JSON.stringify(e);
    }

    var e = "";

    for (var n = 0; n < arguments.length; n++) {
      var r = arguments[n],
          i = t(r);
      e += i + "  ";
    }

    console.log(e);
  }

  function g(e) {
    return {
      row: e.line,
      column: e.ch
    };
  }

  function y(e) {
    return new w(e.row, e.column);
  }

  function E(e, t) {
    var n = e.state.vim;
    if (!n || n.insertMode) return t.head;
    var r = n.sel.head;
    if (!r) return t.head;
    if (n.visualBlock && t.head.line != r.line) return;
    return t.from() == t.anchor && !t.empty() && t.head.line == r.line && t.head.ch != r.ch ? new w(t.head.line, t.head.ch - 1) : t.head;
  }

  function C(e) {
    e.setOption("disableInput", !0), e.setOption("showCursorWhenSelecting", !1), m.signal(e, "vim-mode-change", {
      mode: "normal"
    }), e.on("cursorActivity", or), ut(e), m.on(e.getInputField(), "paste", P(e));
  }

  function k(e) {
    e.setOption("disableInput", !1), e.off("cursorActivity", or), m.off(e.getInputField(), "paste", P(e)), e.state.vim = null;
  }

  function L(e, t) {
    this == m.keyMap.vim && (e.options.$customCursor = null, m.rmClass(e.getWrapperElement(), "cm-fat-cursor")), (!t || t.attach != A) && k(e);
  }

  function A(e, t) {
    this == m.keyMap.vim && (e.curOp && (e.curOp.selectionChanged = !0), e.options.$customCursor = E, m.addClass(e.getWrapperElement(), "cm-fat-cursor")), (!t || t.attach != A) && C(e);
  }

  function O(e, t) {
    if (!t) return undefined;
    if (this[e]) return this[e];
    var n = D(e);
    if (!n) return !1;
    var r = ct.findKey(t, n);
    return typeof r == "function" && m.signal(t, "vim-keypress", n), r;
  }

  function D(e) {
    if (e.charAt(0) == "'") return e.charAt(1);
    var t = e.split(/-(?!$)/),
        n = t[t.length - 1];
    if (t.length == 1 && t[0].length == 1) return !1;
    if (t.length == 2 && t[0] == "Shift" && n.length == 1) return !1;
    var r = !1;

    for (var i = 0; i < t.length; i++) {
      var s = t[i];
      s in M ? t[i] = M[s] : r = !0, s in _ && (t[i] = _[s]);
    }

    return r ? (Q(n) && (t[t.length - 1] = n.toLowerCase()), "<" + t.join("-") + ">") : !1;
  }

  function P(e) {
    var t = e.state.vim;
    return t.onPasteFn || (t.onPasteFn = function () {
      t.insertMode || (e.setCursor(Lt(e.getCursor(), 0, 1)), Tt.enterInsertMode(e, {}, t));
    }), t.onPasteFn;
  }

  function F(e, t) {
    var n = [];

    for (var r = e; r < e + t; r++) {
      n.push(String.fromCharCode(r));
    }

    return n;
  }

  function V(e, t) {
    return t >= e.firstLine() && t <= e.lastLine();
  }

  function $(e) {
    return /^[a-z]$/.test(e);
  }

  function J(e) {
    return "()[]{}".indexOf(e) != -1;
  }

  function K(e) {
    return H.test(e);
  }

  function Q(e) {
    return W.test(e);
  }

  function G(e) {
    return /^\s*$/.test(e);
  }

  function Y(e) {
    return ".?!".indexOf(e) != -1;
  }

  function Z(e, t) {
    for (var n = 0; n < t.length; n++) {
      if (t[n] == e) return !0;
    }

    return !1;
  }

  function tt(e, t, n, r, i) {
    if (t === undefined && !i) throw Error("defaultValue is required unless callback is provided");
    n || (n = "string"), et[e] = {
      type: n,
      defaultValue: t,
      callback: i
    };
    if (r) for (var s = 0; s < r.length; s++) {
      et[r[s]] = et[e];
    }
    t && nt(e, t);
  }

  function nt(e, t, n, r) {
    var i = et[e];
    r = r || {};
    var s = r.scope;
    if (!i) return new Error("Unknown option: " + e);

    if (i.type == "boolean") {
      if (t && t !== !0) return new Error("Invalid argument: " + e + "=" + t);
      t !== !1 && (t = !0);
    }

    i.callback ? (s !== "local" && i.callback(t, undefined), s !== "global" && n && i.callback(t, n)) : (s !== "local" && (i.value = i.type == "boolean" ? !!t : t), s !== "global" && n && (n.state.vim.options[e] = {
      value: t
    }));
  }

  function rt(e, t, n) {
    var r = et[e];
    n = n || {};
    var i = n.scope;
    if (!r) return new Error("Unknown option: " + e);

    if (r.callback) {
      var s = t && r.callback(undefined, t);
      if (i !== "global" && s !== undefined) return s;
      if (i !== "local") return r.callback();
      return;
    }

    var s = i !== "global" && t && t.state.vim.options[e];
    return (s || i !== "local" && r || {}).value;
  }

  function ot() {
    this.latestRegister = undefined, this.isPlaying = !1, this.isRecording = !1, this.replaySearchQueries = [], this.onRecordingDone = undefined, this.lastInsertModeChanges = st();
  }

  function ut(e) {
    return e.state.vim || (e.state.vim = {
      inputState: new ht(),
      lastEditInputState: undefined,
      lastEditActionCommand: undefined,
      lastHPos: -1,
      lastHSPos: -1,
      lastMotion: null,
      marks: {},
      insertMode: !1,
      insertModeRepeat: undefined,
      visualMode: !1,
      visualLine: !1,
      visualBlock: !1,
      lastSelection: null,
      lastPastedText: null,
      sel: {},
      options: {}
    }), e.state.vim;
  }

  function ft() {
    at = {
      searchQuery: null,
      searchIsReversed: !1,
      lastSubstituteReplacePart: undefined,
      jumpList: it(),
      macroModeState: new ot(),
      lastCharacterSearch: {
        increment: 0,
        forward: !0,
        selectedCharacter: ""
      },
      registerController: new mt({}),
      searchHistoryController: new gt(),
      exCommandHistoryController: new gt()
    };

    for (var e in et) {
      var t = et[e];
      t.value = t.defaultValue;
    }
  }

  function ht() {
    this.prefixRepeat = [], this.motionRepeat = [], this.operator = null, this.operatorArgs = null, this.motion = null, this.motionArgs = null, this.keyBuffer = [], this.registerName = null;
  }

  function pt(e, t) {
    e.state.vim.inputState = new ht(), m.signal(e, "vim-command-done", t);
  }

  function dt(e, t, n) {
    this.clear(), this.keyBuffer = [e || ""], this.insertModeChanges = [], this.searchQueries = [], this.linewise = !!t, this.blockwise = !!n;
  }

  function vt(e, t) {
    var n = at.registerController.registers;
    if (!e || e.length != 1) throw Error("Register name must be 1 character");
    n[e] = t, z.push(e);
  }

  function mt(e) {
    this.registers = e, this.unnamedRegister = e['"'] = new dt(), e["."] = new dt(), e[":"] = new dt(), e["/"] = new dt();
  }

  function gt() {
    this.historyBuffer = [], this.iterator = 0, this.initialPrefix = null;
  }

  function wt(e, t) {
    bt[e] = t;
  }

  function Et(e, t) {
    var n = [];

    for (var r = 0; r < t; r++) {
      n.push(e);
    }

    return n;
  }

  function xt(e, t) {
    St[e] = t;
  }

  function Nt(e, t) {
    Tt[e] = t;
  }

  function Ct(e, t) {
    var n = e.state.vim,
        r = n.insertMode || n.visualMode,
        i = Math.min(Math.max(e.firstLine(), t.line), e.lastLine()),
        s = It(e, i) - 1 + !!r,
        o = Math.min(Math.max(0, t.ch), s);
    return new w(i, o);
  }

  function kt(e) {
    var t = {};

    for (var n in e) {
      e.hasOwnProperty(n) && (t[n] = e[n]);
    }

    return t;
  }

  function Lt(e, t, n) {
    return _typeof(t) == "object" && (n = t.ch, t = t.line), new w(e.line + t, e.ch + n);
  }

  function At(e, t, n, r) {
    var i,
        s = [],
        o = [];

    for (var u = 0; u < t.length; u++) {
      var a = t[u];
      if (n == "insert" && a.context != "insert" || a.context && a.context != n || r.operator && a.type == "action" || !(i = Ot(e, a.keys))) continue;
      i == "partial" && s.push(a), i == "full" && o.push(a);
    }

    return {
      partial: s.length && s,
      full: o.length && o
    };
  }

  function Ot(e, t) {
    if (t.slice(-11) == "<character>") {
      var n = t.length - 11,
          r = e.slice(0, n),
          i = t.slice(0, n);
      return r == i && e.length > n ? "full" : i.indexOf(r) == 0 ? "partial" : !1;
    }

    return e == t ? "full" : t.indexOf(e) == 0 ? "partial" : !1;
  }

  function Mt(e) {
    var t = /^.*(<[^>]+>)$/.exec(e),
        n = t ? t[1] : e.slice(-1);
    if (n.length > 1) switch (n) {
      case "<CR>":
        n = "\n";
        break;

      case "<Space>":
        n = " ";
        break;

      default:
        n = "";
    }
    return n;
  }

  function _t(e, t, n) {
    return function () {
      for (var r = 0; r < n; r++) {
        t(e);
      }
    };
  }

  function Dt(e) {
    return new w(e.line, e.ch);
  }

  function Pt(e, t) {
    return e.ch == t.ch && e.line == t.line;
  }

  function Ht(e, t) {
    return e.line < t.line ? !0 : e.line == t.line && e.ch < t.ch ? !0 : !1;
  }

  function Bt(e, t) {
    return arguments.length > 2 && (t = Bt.apply(undefined, Array.prototype.slice.call(arguments, 1))), Ht(e, t) ? e : t;
  }

  function jt(e, t) {
    return arguments.length > 2 && (t = jt.apply(undefined, Array.prototype.slice.call(arguments, 1))), Ht(e, t) ? t : e;
  }

  function Ft(e, t, n) {
    var r = Ht(e, t),
        i = Ht(t, n);
    return r && i;
  }

  function It(e, t) {
    return e.getLine(t).length;
  }

  function qt(e) {
    return e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, "");
  }

  function Rt(e) {
    return e.replace(/([.?*+$\[\]\/\\(){}|\-])/g, "\\$1");
  }

  function Ut(e, t, n) {
    var r = It(e, t),
        i = new Array(n - r + 1).join(" ");
    e.setCursor(new w(t, r)), e.replaceRange(i, e.getCursor());
  }

  function zt(e, t) {
    var n = [],
        r = e.listSelections(),
        i = Dt(e.clipPos(t)),
        s = !Pt(t, i),
        o = e.getCursor("head"),
        u = Xt(r, o),
        a = Pt(r[u].head, r[u].anchor),
        f = r.length - 1,
        l = f - u > u ? f : 0,
        c = r[l].anchor,
        h = Math.min(c.line, i.line),
        p = Math.max(c.line, i.line),
        d = c.ch,
        v = i.ch,
        m = r[l].head.ch - d,
        g = v - d;
    m > 0 && g <= 0 ? (d++, s || v--) : m < 0 && g >= 0 ? (d--, a || v++) : m < 0 && g == -1 && (d--, v++);

    for (var y = h; y <= p; y++) {
      var b = {
        anchor: new w(y, d),
        head: new w(y, v)
      };
      n.push(b);
    }

    return e.setSelections(n), t.ch = v, c.ch = d, c;
  }

  function Wt(e, t, n) {
    var r = [];

    for (var i = 0; i < n; i++) {
      var s = Lt(t, i, 0);
      r.push({
        anchor: s,
        head: s
      });
    }

    e.setSelections(r, 0);
  }

  function Xt(e, t, n) {
    for (var r = 0; r < e.length; r++) {
      var i = n != "head" && Pt(e[r].anchor, t),
          s = n != "anchor" && Pt(e[r].head, t);
      if (i || s) return r;
    }

    return -1;
  }

  function Vt(e, t) {
    var n = t.lastSelection,
        r = function r() {
      var t = e.listSelections(),
          n = t[0],
          r = t[t.length - 1],
          i = Ht(n.anchor, n.head) ? n.anchor : n.head,
          s = Ht(r.anchor, r.head) ? r.head : r.anchor;
      return [i, s];
    },
        i = function i() {
      var t = e.getCursor(),
          r = e.getCursor(),
          i = n.visualBlock;

      if (i) {
        var s = i.width,
            o = i.height;
        r = new w(t.line + o, t.ch + s);
        var u = [];

        for (var a = t.line; a < r.line; a++) {
          var f = new w(a, t.ch),
              l = new w(a, r.ch),
              c = {
            anchor: f,
            head: l
          };
          u.push(c);
        }

        e.setSelections(u);
      } else {
        var h = n.anchorMark.find(),
            p = n.headMark.find(),
            d = p.line - h.line,
            v = p.ch - h.ch;
        r = {
          line: r.line + d,
          ch: d ? r.ch : v + r.ch
        }, n.visualLine && (t = new w(t.line, 0), r = new w(r.line, It(e, r.line))), e.setSelection(t, r);
      }

      return [t, r];
    };

    return t.visualMode ? r() : i();
  }

  function $t(e, t) {
    var n = t.sel.anchor,
        r = t.sel.head;
    t.lastPastedText && (r = e.posFromIndex(e.indexFromPos(n) + t.lastPastedText.length), t.lastPastedText = null), t.lastSelection = {
      anchorMark: e.setBookmark(n),
      headMark: e.setBookmark(r),
      anchor: Dt(n),
      head: Dt(r),
      visualMode: t.visualMode,
      visualLine: t.visualLine,
      visualBlock: t.visualBlock
    };
  }

  function Jt(e, t, n) {
    var r = e.state.vim.sel,
        i = r.head,
        s = r.anchor,
        o;
    return Ht(n, t) && (o = n, n = t, t = o), Ht(i, s) ? (i = Bt(t, i), s = jt(s, n)) : (s = Bt(t, s), i = jt(i, n), i = Lt(i, 0, -1), i.ch == -1 && i.line != e.firstLine() && (i = new w(i.line - 1, It(e, i.line - 1)))), [s, i];
  }

  function Kt(e, t, n) {
    var r = e.state.vim;
    t = t || r.sel;
    var n = n || r.visualLine ? "line" : r.visualBlock ? "block" : "char",
        i = Qt(e, t, n);
    e.setSelections(i.ranges, i.primary);
  }

  function Qt(e, t, n, r) {
    var i = Dt(t.head),
        s = Dt(t.anchor);

    if (n == "char") {
      var o = !r && !Ht(t.head, t.anchor) ? 1 : 0,
          u = Ht(t.head, t.anchor) ? 1 : 0;
      return i = Lt(t.head, 0, o), s = Lt(t.anchor, 0, u), {
        ranges: [{
          anchor: s,
          head: i
        }],
        primary: 0
      };
    }

    if (n == "line") {
      if (!Ht(t.head, t.anchor)) {
        s.ch = 0;
        var a = e.lastLine();
        i.line > a && (i.line = a), i.ch = It(e, i.line);
      } else i.ch = 0, s.ch = It(e, s.line);

      return {
        ranges: [{
          anchor: s,
          head: i
        }],
        primary: 0
      };
    }

    if (n == "block") {
      var f = Math.min(s.line, i.line),
          l = s.ch,
          c = Math.max(s.line, i.line),
          h = i.ch;
      l < h ? h += 1 : l += 1;
      var p = c - f + 1,
          d = i.line == f ? 0 : p - 1,
          v = [];

      for (var m = 0; m < p; m++) {
        v.push({
          anchor: new w(f + m, l),
          head: new w(f + m, h)
        });
      }

      return {
        ranges: v,
        primary: d
      };
    }
  }

  function Gt(e) {
    var t = e.getCursor("head");
    return e.getSelection().length == 1 && (t = Bt(t, e.getCursor("anchor"))), t;
  }

  function Yt(e, t) {
    var n = e.state.vim;
    t !== !1 && e.setCursor(Ct(e, n.sel.head)), $t(e, n), n.visualMode = !1, n.visualLine = !1, n.visualBlock = !1, n.insertMode || m.signal(e, "vim-mode-change", {
      mode: "normal"
    });
  }

  function Zt(e, t, n) {
    var r = e.getRange(t, n);

    if (/\n\s*$/.test(r)) {
      var i = r.split("\n");
      i.pop();
      var s;

      for (var s = i.pop(); i.length > 0 && s && G(s); s = i.pop()) {
        n.line--, n.ch = 0;
      }

      s ? (n.line--, n.ch = It(e, n.line)) : n.ch = 0;
    }
  }

  function en(e, t, n) {
    t.ch = 0, n.ch = 0, n.line++;
  }

  function tn(e) {
    if (!e) return 0;
    var t = e.search(/\S/);
    return t == -1 ? e.length : t;
  }

  function nn(e, t, n, r, i) {
    var s = Gt(e),
        o = e.getLine(s.line),
        u = s.ch,
        a = i ? B[0] : j[0];

    while (!a(o.charAt(u))) {
      u++;
      if (u >= o.length) return null;
    }

    r ? a = j[0] : (a = B[0], a(o.charAt(u)) || (a = B[1]));
    var f = u,
        l = u;

    while (a(o.charAt(f)) && f < o.length) {
      f++;
    }

    while (a(o.charAt(l)) && l >= 0) {
      l--;
    }

    l++;

    if (t) {
      var c = f;

      while (/\s/.test(o.charAt(f)) && f < o.length) {
        f++;
      }

      if (c == f) {
        var h = l;

        while (/\s/.test(o.charAt(l - 1)) && l > 0) {
          l--;
        }

        l || (l = h);
      }
    }

    return {
      start: new w(s.line, l),
      end: new w(s.line, f)
    };
  }

  function rn(e, t, n) {
    var r = t;
    if (!m.findMatchingTag || !m.findEnclosingTag) return {
      start: r,
      end: r
    };
    var i = m.findMatchingTag(e, t) || m.findEnclosingTag(e, t);
    return !i || !i.open || !i.close ? {
      start: r,
      end: r
    } : n ? {
      start: i.open.from,
      end: i.close.to
    } : {
      start: i.open.to,
      end: i.close.from
    };
  }

  function sn(e, t, n) {
    Pt(t, n) || at.jumpList.add(e, t, n);
  }

  function on(e, t) {
    at.lastCharacterSearch.increment = e, at.lastCharacterSearch.forward = t.forward, at.lastCharacterSearch.selectedCharacter = t.selectedCharacter;
  }

  function fn(e, t, n, r) {
    var i = Dt(e.getCursor()),
        s = n ? 1 : -1,
        o = n ? e.lineCount() : -1,
        u = i.ch,
        a = i.line,
        f = e.getLine(a),
        l = {
      lineText: f,
      nextCh: f.charAt(u),
      lastCh: null,
      index: u,
      symb: r,
      reverseSymb: (n ? {
        ")": "(",
        "}": "{"
      } : {
        "(": ")",
        "{": "}"
      })[r],
      forward: n,
      depth: 0,
      curMoveThrough: !1
    },
        c = un[r];
    if (!c) return i;
    var h = an[c].init,
        p = an[c].isComplete;
    h && h(l);

    while (a !== o && t) {
      l.index += s, l.nextCh = l.lineText.charAt(l.index);

      if (!l.nextCh) {
        a += s, l.lineText = e.getLine(a) || "";
        if (s > 0) l.index = 0;else {
          var d = l.lineText.length;
          l.index = d > 0 ? d - 1 : 0;
        }
        l.nextCh = l.lineText.charAt(l.index);
      }

      p(l) && (i.line = a, i.ch = l.index, t--);
    }

    return l.nextCh || l.curMoveThrough ? new w(a, l.index) : i;
  }

  function ln(e, t, n, r, i) {
    var s = t.line,
        o = t.ch,
        u = e.getLine(s),
        a = n ? 1 : -1,
        f = r ? j : B;

    if (i && u == "") {
      s += a, u = e.getLine(s);
      if (!V(e, s)) return null;
      o = n ? 0 : u.length;
    }

    for (;;) {
      if (i && u == "") return {
        from: 0,
        to: 0,
        line: s
      };
      var l = a > 0 ? u.length : -1,
          c = l,
          h = l;

      while (o != l) {
        var p = !1;

        for (var d = 0; d < f.length && !p; ++d) {
          if (f[d](u.charAt(o))) {
            c = o;

            while (o != l && f[d](u.charAt(o))) {
              o += a;
            }

            h = o, p = c != h;
            if (c == t.ch && s == t.line && h == c + a) continue;
            return {
              from: Math.min(c, h + 1),
              to: Math.max(c, h),
              line: s
            };
          }
        }

        p || (o += a);
      }

      s += a;
      if (!V(e, s)) return null;
      u = e.getLine(s), o = a > 0 ? 0 : u.length;
    }
  }

  function cn(e, t, n, r, i, s) {
    var o = Dt(t),
        u = [];
    (r && !i || !r && i) && n++;
    var a = !r || !i;

    for (var f = 0; f < n; f++) {
      var l = ln(e, t, r, s, a);

      if (!l) {
        var c = It(e, e.lastLine());
        u.push(r ? {
          line: e.lastLine(),
          from: c,
          to: c
        } : {
          line: 0,
          from: 0,
          to: 0
        });
        break;
      }

      u.push(l), t = new w(l.line, r ? l.to - 1 : l.from);
    }

    var h = u.length != n,
        p = u[0],
        d = u.pop();
    return r && !i ? (!h && (p.from != o.ch || p.line != o.line) && (d = u.pop()), new w(d.line, d.from)) : r && i ? new w(d.line, d.to - 1) : !r && i ? (!h && (p.to != o.ch || p.line != o.line) && (d = u.pop()), new w(d.line, d.to)) : new w(d.line, d.from);
  }

  function hn(e, t, n, r, i) {
    var s = t,
        o = new w(s.line + n.repeat - 1, Infinity),
        u = e.clipPos(o);
    return u.ch--, i || (r.lastHPos = Infinity, r.lastHSPos = e.charCoords(u, "div").left), o;
  }

  function pn(e, t, n, r) {
    var i = e.getCursor(),
        s = i.ch,
        o;

    for (var u = 0; u < t; u++) {
      var a = e.getLine(i.line);
      o = mn(s, a, r, n, !0);
      if (o == -1) return null;
      s = o;
    }

    return new w(e.getCursor().line, o);
  }

  function dn(e, t) {
    var n = e.getCursor().line;
    return Ct(e, new w(n, t - 1));
  }

  function vn(e, t, n, r) {
    if (!Z(n, U)) return;
    t.marks[n] && t.marks[n].clear(), t.marks[n] = e.setBookmark(r);
  }

  function mn(e, t, n, r, i) {
    var s;
    return r ? (s = t.indexOf(n, e + 1), s != -1 && !i && (s -= 1)) : (s = t.lastIndexOf(n, e - 1), s != -1 && !i && (s += 1)), s;
  }

  function gn(e, t, n, r, i) {
    function c(t) {
      return !/\S/.test(e.getLine(t));
    }

    function h(e, t, n) {
      return n ? c(e) != c(e + t) : !c(e) && c(e + t);
    }

    function p(t) {
      r = r > 0 ? 1 : -1;
      var n = e.ace.session.getFoldLine(t);
      n && t + r > n.start.row && t + r < n.end.row && (r = (r > 0 ? n.end.row : n.start.row) - t);
    }

    var s = t.line,
        o = e.firstLine(),
        u = e.lastLine(),
        a,
        f,
        l = s;

    if (r) {
      while (o <= l && l <= u && n > 0) {
        p(l), h(l, r) && n--, l += r;
      }

      return new w(l, 0);
    }

    var d = e.state.vim;

    if (d.visualLine && h(s, 1, !0)) {
      var v = d.sel.anchor;
      h(v.line, -1, !0) && (!i || v.line != s) && (s += 1);
    }

    var m = c(s);

    for (l = s; l <= u && n; l++) {
      h(l, 1, !0) && (!i || c(l) != m) && n--;
    }

    f = new w(l, 0), l > u && !m ? m = !0 : i = !1;

    for (l = s; l > o; l--) {
      if (!i || c(l) == m || l == s) if (h(l, -1, !0)) break;
    }

    return a = new w(l, 0), {
      start: a,
      end: f
    };
  }

  function yn(e, t, n, r) {
    function i(e, t) {
      if (t.pos + t.dir < 0 || t.pos + t.dir >= t.line.length) {
        t.ln += t.dir;

        if (!V(e, t.ln)) {
          t.line = null, t.ln = null, t.pos = null;
          return;
        }

        t.line = e.getLine(t.ln), t.pos = t.dir > 0 ? 0 : t.line.length - 1;
      } else t.pos += t.dir;
    }

    function s(e, t, n, r) {
      var s = e.getLine(t),
          o = s === "",
          u = {
        line: s,
        ln: t,
        pos: n,
        dir: r
      },
          a = {
        ln: u.ln,
        pos: u.pos
      },
          f = u.line === "";
      i(e, u);

      while (u.line !== null) {
        a.ln = u.ln, a.pos = u.pos;
        if (u.line === "" && !f) return {
          ln: u.ln,
          pos: u.pos
        };
        if (o && u.line !== "" && !G(u.line[u.pos])) return {
          ln: u.ln,
          pos: u.pos
        };
        Y(u.line[u.pos]) && !o && (u.pos === u.line.length - 1 || G(u.line[u.pos + 1])) && (o = !0), i(e, u);
      }

      var s = e.getLine(a.ln);
      a.pos = 0;

      for (var l = s.length - 1; l >= 0; --l) {
        if (!G(s[l])) {
          a.pos = l;
          break;
        }
      }

      return a;
    }

    function o(e, t, n, r) {
      var s = e.getLine(t),
          o = {
        line: s,
        ln: t,
        pos: n,
        dir: r
      },
          u = {
        ln: o.ln,
        pos: null
      },
          a = o.line === "";
      i(e, o);

      while (o.line !== null) {
        if (o.line === "" && !a) return u.pos !== null ? u : {
          ln: o.ln,
          pos: o.pos
        };
        if (!(!Y(o.line[o.pos]) || u.pos === null || o.ln === u.ln && o.pos + 1 === u.pos)) return u;
        o.line !== "" && !G(o.line[o.pos]) && (a = !1, u = {
          ln: o.ln,
          pos: o.pos
        }), i(e, o);
      }

      var s = e.getLine(u.ln);
      u.pos = 0;

      for (var f = 0; f < s.length; ++f) {
        if (!G(s[f])) {
          u.pos = f;
          break;
        }
      }

      return u;
    }

    var u = {
      ln: t.line,
      pos: t.ch
    };

    while (n > 0) {
      r < 0 ? u = o(e, u.ln, u.pos, r) : u = s(e, u.ln, u.pos, r), n--;
    }

    return new w(u.ln, u.pos);
  }

  function bn(e, t, n, r) {
    var i = t,
        s,
        o,
        u = {
      "(": /[()]/,
      ")": /[()]/,
      "[": /[[\]]/,
      "]": /[[\]]/,
      "{": /[{}]/,
      "}": /[{}]/,
      "<": /[<>]/,
      ">": /[<>]/
    }[n],
        a = {
      "(": "(",
      ")": "(",
      "[": "[",
      "]": "[",
      "{": "{",
      "}": "{",
      "<": "<",
      ">": "<"
    }[n],
        f = e.getLine(i.line).charAt(i.ch),
        l = f === a ? 1 : 0;
    s = e.scanForBracket(new w(i.line, i.ch + l), -1, undefined, {
      bracketRegex: u
    }), o = e.scanForBracket(new w(i.line, i.ch + l), 1, undefined, {
      bracketRegex: u
    });
    if (!s || !o) return {
      start: i,
      end: i
    };
    s = s.pos, o = o.pos;

    if (s.line == o.line && s.ch > o.ch || s.line > o.line) {
      var c = s;
      s = o, o = c;
    }

    return r ? o.ch += 1 : s.ch += 1, {
      start: s,
      end: o
    };
  }

  function wn(e, t, n, r) {
    var i = Dt(t),
        s = e.getLine(i.line),
        o = s.split(""),
        u,
        a,
        f,
        l,
        c = o.indexOf(n);
    i.ch < c ? i.ch = c : c < i.ch && o[i.ch] == n && (a = i.ch, --i.ch);
    if (o[i.ch] == n && !a) u = i.ch + 1;else for (f = i.ch; f > -1 && !u; f--) {
      o[f] == n && (u = f + 1);
    }
    if (u && !a) for (f = u, l = o.length; f < l && !a; f++) {
      o[f] == n && (a = f);
    }
    return !u || !a ? {
      start: i,
      end: i
    } : (r && (--u, ++a), {
      start: new w(i.line, u),
      end: new w(i.line, a)
    });
  }

  function En() {}

  function Sn(e) {
    var t = e.state.vim;
    return t.searchState_ || (t.searchState_ = new En());
  }

  function xn(e) {
    return Nn(e, "/");
  }

  function Tn(e) {
    return Cn(e, "/");
  }

  function Nn(e, t) {
    var n = Cn(e, t) || [];
    if (!n.length) return [];
    var r = [];
    if (n[0] !== 0) return;

    for (var i = 0; i < n.length; i++) {
      typeof n[i] == "number" && r.push(e.substring(n[i] + 1, n[i + 1]));
    }

    return r;
  }

  function Cn(e, t) {
    t || (t = "/");
    var n = !1,
        r = [];

    for (var i = 0; i < e.length; i++) {
      var s = e.charAt(i);
      !n && s == t && r.push(i), n = !n && s == "\\";
    }

    return r;
  }

  function kn(e) {
    var t = "|(){",
        n = "}",
        r = !1,
        i = [];

    for (var s = -1; s < e.length; s++) {
      var o = e.charAt(s) || "",
          u = e.charAt(s + 1) || "",
          a = u && t.indexOf(u) != -1;
      r ? ((o !== "\\" || !a) && i.push(o), r = !1) : o === "\\" ? (r = !0, u && n.indexOf(u) != -1 && (a = !0), (!a || u === "\\") && i.push(o)) : (i.push(o), a && u !== "\\" && i.push("\\"));
    }

    return i.join("");
  }

  function An(e) {
    var t = !1,
        n = [];

    for (var r = -1; r < e.length; r++) {
      var i = e.charAt(r) || "",
          s = e.charAt(r + 1) || "";
      Ln[i + s] ? (n.push(Ln[i + s]), r++) : t ? (n.push(i), t = !1) : i === "\\" ? (t = !0, K(s) || s === "$" ? n.push("$") : s !== "/" && s !== "\\" && n.push("\\")) : (i === "$" && n.push("$"), n.push(i), s === "/" && n.push("\\"));
    }

    return n.join("");
  }

  function Mn(e) {
    var t = new m.StringStream(e),
        n = [];

    while (!t.eol()) {
      while (t.peek() && t.peek() != "\\") {
        n.push(t.next());
      }

      var r = !1;

      for (var i in On) {
        if (t.match(i, !0)) {
          r = !0, n.push(On[i]);
          break;
        }
      }

      r || n.push(t.next());
    }

    return n.join("");
  }

  function _n(e, t, n) {
    var r = at.registerController.getRegister("/");
    r.setText(e);
    if (e instanceof RegExp) return e;
    var i = Tn(e),
        s,
        o;
    if (!i.length) s = e;else {
      s = e.substring(0, i[0]);
      var u = e.substring(i[0]);
      o = u.indexOf("i") != -1;
    }
    if (!s) return null;
    rt("pcre") || (s = kn(s)), n && (t = /^[^A-Z]*$/.test(s));
    var a = new RegExp(s, t || o ? "im" : "m");
    return a;
  }

  function Dn(e) {
    typeof e == "string" && (e = document.createElement(e));

    for (var t, n = 1; n < arguments.length; n++) {
      if (!(t = arguments[n])) continue;
      _typeof(t) != "object" && (t = document.createTextNode(t));
      if (t.nodeType) e.appendChild(t);else for (var r in t) {
        if (!Object.prototype.hasOwnProperty.call(t, r)) continue;
        r[0] === "$" ? e.style[r.slice(1)] = t[r] : e.setAttribute(r, t[r]);
      }
    }

    return e;
  }

  function Pn(e, t) {
    var n = Dn("span", {
      $color: "red",
      $whiteSpace: "pre",
      "class": "cm-vim-message"
    }, t);
    e.openNotification ? e.openNotification(n, {
      bottom: !0,
      duration: 5e3
    }) : alert(n.innerText);
  }

  function Hn(e, t) {
    return Dn(document.createDocumentFragment(), Dn("span", {
      $fontFamily: "monospace",
      $whiteSpace: "pre"
    }, e, Dn("input", {
      type: "text",
      autocorrect: "off",
      autocapitalize: "off",
      spellcheck: "false"
    })), t && Dn("span", {
      $color: "#888"
    }, t));
  }

  function Bn(e, t) {
    var n = Hn(t.prefix, t.desc);
    if (e.openDialog) e.openDialog(n, t.onClose, {
      onKeyDown: t.onKeyDown,
      onKeyUp: t.onKeyUp,
      bottom: !0,
      selectValueOnOpen: !1,
      value: t.value
    });else {
      var r = "";
      typeof t.prefix != "string" && t.prefix && (r += t.prefix.textContent), t.desc && (r += " " + t.desc), t.onClose(prompt(r, ""));
    }
  }

  function jn(e, t) {
    if (e instanceof RegExp && t instanceof RegExp) {
      var n = ["global", "multiline", "ignoreCase", "source"];

      for (var r = 0; r < n.length; r++) {
        var i = n[r];
        if (e[i] !== t[i]) return !1;
      }

      return !0;
    }

    return !1;
  }

  function Fn(e, t, n, r) {
    if (!t) return;

    var i = Sn(e),
        s = _n(t, !!n, !!r);

    if (!s) return;
    return qn(e, s), jn(s, i.getQuery()) ? s : (i.setQuery(s), s);
  }

  function In(e) {
    if (e.source.charAt(0) == "^") var t = !0;
    return {
      token: function token(n) {
        if (t && !n.sol()) {
          n.skipToEnd();
          return;
        }

        var r = n.match(e, !1);

        if (r) {
          if (r[0].length == 0) return n.next(), "searching";

          if (!n.sol()) {
            n.backUp(1);
            if (!e.exec(n.next() + r[0])) return n.next(), null;
          }

          return n.match(e), "searching";
        }

        while (!n.eol()) {
          n.next();
          if (n.match(e, !1)) break;
        }
      },
      query: e
    };
  }

  function qn(e, t) {
    var n = Sn(e),
        r = n.getOverlay();
    if (!r || t != r.query) r && e.removeOverlay(r), r = In(t), e.addOverlay(r), e.showMatchesOnScrollbar && (n.getScrollbarAnnotate() && n.getScrollbarAnnotate().clear(), n.setScrollbarAnnotate(e.showMatchesOnScrollbar(t))), n.setOverlay(r);
  }

  function Rn(e, t, n, r) {
    return r === undefined && (r = 1), e.operation(function () {
      var i = e.getCursor(),
          s = e.getSearchCursor(n, i);

      for (var o = 0; o < r; o++) {
        var u = s.find(t);

        if (o == 0 && u && Pt(s.from(), i)) {
          var a = t ? s.from() : s.to();
          u = s.find(t), u && !u[0] && Pt(s.from(), a) && e.getLine(a.line).length == a.ch && (u = s.find(t));
        }

        if (!u) {
          s = e.getSearchCursor(n, t ? new w(e.lastLine()) : new w(e.firstLine(), 0));
          if (!s.find(t)) return;
        }
      }

      return s.from();
    });
  }

  function Un(e, t, n, r, i) {
    return r === undefined && (r = 1), e.operation(function () {
      var s = e.getCursor(),
          o = e.getSearchCursor(n, s),
          u = o.find(!t);
      !i.visualMode && u && Pt(o.from(), s) && o.find(!t);

      for (var a = 0; a < r; a++) {
        u = o.find(t);

        if (!u) {
          o = e.getSearchCursor(n, t ? new w(e.lastLine()) : new w(e.firstLine(), 0));
          if (!o.find(t)) return;
        }
      }

      return [o.from(), o.to()];
    });
  }

  function zn(e) {
    var t = Sn(e);
    e.removeOverlay(Sn(e).getOverlay()), t.setOverlay(null), t.getScrollbarAnnotate() && (t.getScrollbarAnnotate().clear(), t.setScrollbarAnnotate(null));
  }

  function Wn(e, t, n) {
    return typeof e != "number" && (e = e.line), t instanceof Array ? Z(e, t) : typeof n == "number" ? e >= t && e <= n : e == t;
  }

  function Xn(e) {
    var t = e.ace.renderer;
    return {
      top: t.getFirstFullyVisibleRow(),
      bottom: t.getLastFullyVisibleRow()
    };
  }

  function Vn(e, t, n) {
    if (n == "'" || n == "`") return at.jumpList.find(e, -1) || new w(0, 0);
    if (n == ".") return $n(e);
    var r = t.marks[n];
    return r && r.find();
  }

  function $n(e) {
    var t = e.ace.session.$undoManager;
    if (t && t.$lastDelta) return y(t.$lastDelta.end);
  }

  function Gn(e, t, n, r, i, s, o, u, a) {
    function p() {
      e.operation(function () {
        while (!f) {
          d(), g();
        }

        y();
      });
    }

    function d() {
      var t = e.getRange(s.from(), s.to()),
          n = t.replace(o, u),
          r = s.to().line;
      s.replace(n), c = s.to().line, i += c - r, h = c < r;
    }

    function v() {
      var e = l && Dt(s.to()),
          t = s.findNext();
      return t && !t[0] && e && Pt(s.from(), e) && (t = s.findNext()), t;
    }

    function g() {
      while (v() && Wn(s.from(), r, i)) {
        if (!n && s.from().line == c && !h) continue;
        e.scrollIntoView(s.from(), 30), e.setSelection(s.from(), s.to()), l = s.from(), f = !1;
        return;
      }

      f = !0;
    }

    function y(t) {
      t && t(), e.focus();

      if (l) {
        e.setCursor(l);
        var n = e.state.vim;
        n.exMode = !1, n.lastHPos = n.lastHSPos = l.ch;
      }

      a && a();
    }

    function b(t, n, r) {
      m.e_stop(t);
      var i = m.keyName(t);

      switch (i) {
        case "Y":
          d(), g();
          break;

        case "N":
          g();
          break;

        case "A":
          var s = a;
          a = undefined, e.operation(p), a = s;
          break;

        case "L":
          d();

        case "Q":
        case "Esc":
        case "Ctrl-C":
        case "Ctrl-[":
          y(r);
      }

      return f && y(r), !0;
    }

    e.state.vim.exMode = !0;
    var f = !1,
        l,
        c,
        h;
    g();

    if (f) {
      Pn(e, "No matches for " + o.source);
      return;
    }

    if (!t) {
      p(), a && a();
      return;
    }

    Bn(e, {
      prefix: Dn("span", "replace with ", Dn("strong", u), " (y/n/a/q/l)"),
      onKeyDown: b
    });
  }

  function Yn(e) {
    var t = e.state.vim,
        n = at.macroModeState,
        r = at.registerController.getRegister("."),
        i = n.isPlaying,
        s = n.lastInsertModeChanges;
    i || (e.off("change", sr), m.off(e.getInputField(), "keydown", fr)), !i && t.insertModeRepeat > 1 && (lr(e, t, t.insertModeRepeat - 1, !0), t.lastEditInputState.repeatOverride = t.insertModeRepeat), delete t.insertModeRepeat, t.insertMode = !1, e.setCursor(e.getCursor().line, e.getCursor().ch - 1), e.setOption("keyMap", "vim"), e.setOption("disableInput", !0), e.toggleOverwrite(!1), r.setText(s.changes.join("")), m.signal(e, "vim-mode-change", {
      mode: "normal"
    }), n.isRecording && rr(n);
  }

  function Zn(e) {
    S.unshift(e);
  }

  function er(e, t, n, r, i) {
    var s = {
      keys: e,
      type: t
    };
    s[t] = n, s[t + "Args"] = r;

    for (var o in i) {
      s[o] = i[o];
    }

    Zn(s);
  }

  function tr(e, t, n, r) {
    var i = at.registerController.getRegister(r);

    if (r == ":") {
      i.keyBuffer[0] && Qn.processCommand(e, i.keyBuffer[0]), n.isPlaying = !1;
      return;
    }

    var s = i.keyBuffer,
        o = 0;
    n.isPlaying = !0, n.replaySearchQueries = i.searchQueries.slice(0);

    for (var u = 0; u < s.length; u++) {
      var a = s[u],
          f,
          l;

      while (a) {
        f = /<\w+-.+?>|<\w+>|./.exec(a), l = f[0], a = a.substring(f.index + l.length), ct.handleKey(e, l, "macro");

        if (t.insertMode) {
          var c = i.insertModeChanges[o++].changes;
          at.macroModeState.lastInsertModeChanges.changes = c, cr(e, c, 1), Yn(e);
        }
      }
    }

    n.isPlaying = !1;
  }

  function nr(e, t) {
    if (e.isPlaying) return;
    var n = e.latestRegister,
        r = at.registerController.getRegister(n);
    r && r.pushText(t);
  }

  function rr(e) {
    if (e.isPlaying) return;
    var t = e.latestRegister,
        n = at.registerController.getRegister(t);
    n && n.pushInsertModeChanges && n.pushInsertModeChanges(e.lastInsertModeChanges);
  }

  function ir(e, t) {
    if (e.isPlaying) return;
    var n = e.latestRegister,
        r = at.registerController.getRegister(n);
    r && r.pushSearchQuery && r.pushSearchQuery(t);
  }

  function sr(e, t) {
    var n = at.macroModeState,
        r = n.lastInsertModeChanges;
    if (!n.isPlaying) while (t) {
      r.expectCursorActivityForChange = !0;
      if (r.ignoreCount > 1) r.ignoreCount--;else if (t.origin == "+input" || t.origin == "paste" || t.origin === undefined) {
        var i = e.listSelections().length;
        i > 1 && (r.ignoreCount = i);
        var s = t.text.join("\n");
        r.maybeReset && (r.changes = [], r.maybeReset = !1), s && (e.state.overwrite && !/\n/.test(s) ? r.changes.push([s]) : r.changes.push(s));
      }
      t = t.next;
    }
  }

  function or(e) {
    var t = e.state.vim;

    if (t.insertMode) {
      var n = at.macroModeState;
      if (n.isPlaying) return;
      var r = n.lastInsertModeChanges;
      r.expectCursorActivityForChange ? r.expectCursorActivityForChange = !1 : r.maybeReset = !0;
    } else e.curOp.isVimOp || ur(e, t);
  }

  function ur(e, t, n) {
    var r = e.getCursor("anchor"),
        i = e.getCursor("head");
    t.visualMode && !e.somethingSelected() ? Yt(e, !1) : !t.visualMode && !t.insertMode && e.somethingSelected() && (t.visualMode = !0, t.visualLine = !1, m.signal(e, "vim-mode-change", {
      mode: "visual"
    }));

    if (t.visualMode) {
      var s = Ht(i, r) ? 0 : -1,
          o = Ht(i, r) ? -1 : 0;
      i = Lt(i, 0, s), r = Lt(r, 0, o), t.sel = {
        anchor: r,
        head: i
      }, vn(e, t, "<", Bt(i, r)), vn(e, t, ">", jt(i, r));
    } else !t.insertMode && !n && (t.lastHPos = e.getCursor().ch);
  }

  function ar(e) {
    this.keyName = e;
  }

  function fr(e) {
    function i() {
      return n.maybeReset && (n.changes = [], n.maybeReset = !1), n.changes.push(new ar(r)), !0;
    }

    var t = at.macroModeState,
        n = t.lastInsertModeChanges,
        r = m.keyName(e);
    if (!r) return;
    (r.indexOf("Delete") != -1 || r.indexOf("Backspace") != -1) && m.lookupKey(r, "vim-insert", i);
  }

  function lr(e, t, n, r) {
    function u() {
      s ? yt.processAction(e, t, t.lastEditActionCommand) : yt.evalInput(e, t);
    }

    function a(n) {
      if (i.lastInsertModeChanges.changes.length > 0) {
        n = t.lastEditActionCommand ? n : 1;
        var r = i.lastInsertModeChanges;
        cr(e, r.changes, n);
      }
    }

    var i = at.macroModeState;
    i.isPlaying = !0;
    var s = !!t.lastEditActionCommand,
        o = t.inputState;
    t.inputState = t.lastEditInputState;
    if (s && t.lastEditActionCommand.interlaceInsertRepeat) for (var f = 0; f < n; f++) {
      u(), a(1);
    } else r || u(), a(n);
    t.inputState = o, t.insertMode && !r && Yn(e), i.isPlaying = !1;
  }

  function cr(e, t, n) {
    function r(t) {
      return typeof t == "string" ? m.commands[t](e) : t(e), !0;
    }

    var i = e.getCursor("head"),
        s = at.macroModeState.lastInsertModeChanges.visualBlock;
    s && (Wt(e, i, s + 1), n = e.listSelections().length, e.setCursor(i));

    for (var o = 0; o < n; o++) {
      s && e.setCursor(Lt(i, o, 0));

      for (var u = 0; u < t.length; u++) {
        var a = t[u];
        if (a instanceof ar) m.lookupKey(a.keyName, "vim-insert", r);else if (typeof a == "string") e.replaceSelection(a);else {
          var f = e.getCursor(),
              l = Lt(f, 0, a[0].length);
          e.replaceRange(a[0], f, l), e.setCursor(l);
        }
      }
    }

    s && e.setCursor(Lt(i, 0, 1));
  }

  function pr(e, t, n) {
    t.length > 1 && t[0] == "n" && (t = t.replace("numpad", "")), t = hr[t] || t;
    var r = "";
    return n.ctrlKey && (r += "C-"), n.altKey && (r += "A-"), (r || t.length > 1) && n.shiftKey && (r += "S-"), r += t, r.length > 1 && (r = "<" + r + ">"), r;
  }

  function vr(e) {
    var t = new e.constructor();
    return Object.keys(e).forEach(function (n) {
      var r = e[n];
      Array.isArray(r) ? r = r.slice() : r && _typeof(r) == "object" && r.constructor != Object && (r = vr(r)), t[n] = r;
    }), e.sel && (t.sel = {
      head: e.sel.head && Dt(e.sel.head),
      anchor: e.sel.anchor && Dt(e.sel.anchor)
    }), t;
  }

  function mr(e, t, n) {
    var r = !1,
        i = N.maybeInitVimState_(e),
        s = i.visualBlock || i.wasInVisualBlock,
        o = e.ace.inMultiSelectMode;
    i.wasInVisualBlock && !o ? i.wasInVisualBlock = !1 : o && i.visualBlock && (i.wasInVisualBlock = !0);
    if (t == "<Esc>" && !i.insertMode && !i.visualMode && o) e.ace.exitMultiSelectMode();else if (s || !o || e.ace.inVirtualSelectionMode) r = N.handleKey(e, t, n);else {
      var u = vr(i);
      e.operation(function () {
        e.ace.forEachSelection(function () {
          var i = e.ace.selection;
          e.state.vim.lastHPos = i.$desiredColumn == null ? i.lead.column : i.$desiredColumn;
          var s = e.getCursor("head"),
              o = e.getCursor("anchor"),
              a = Ht(s, o) ? 0 : -1,
              f = Ht(s, o) ? -1 : 0;
          s = Lt(s, 0, a), o = Lt(o, 0, f), e.state.vim.sel.head = s, e.state.vim.sel.anchor = o, r = dr(e, t, n), i.$desiredColumn = e.state.vim.lastHPos == -1 ? null : e.state.vim.lastHPos, e.virtualSelectionMode() && (e.state.vim = vr(u));
        }), e.curOp.cursorActivity && !r && (e.curOp.cursorActivity = !1);
      }, !0);
    }
    return r && !i.visualMode && !i.insert && i.visualMode != e.somethingSelected() && ur(e, i, !0), r;
  }

  function yr(e, t) {
    t.off("beforeEndOperation", yr);
    var n = t.state.cm.vimCmd;
    n && t.execCommand(n.exec ? n : n.name, n.args), t.curOp = t.prevOp;
  }

  var i = e("../range").Range,
      s = e("../lib/event_emitter").EventEmitter,
      o = e("../lib/dom"),
      u = e("../lib/oop"),
      a = e("../lib/keys"),
      f = e("../lib/event"),
      l = e("../search").Search,
      c = e("../lib/useragent"),
      h = e("../search_highlight").SearchHighlight,
      p = e("../commands/multi_select_commands"),
      d = e("../mode/text").Mode.prototype.tokenRe,
      v = e("../ext/hardwrap").hardWrap;
  e("../multi_select");

  var m = function m(e) {
    this.ace = e, this.state = {}, this.marks = {}, this.options = {}, this.$uid = 0, this.onChange = this.onChange.bind(this), this.onSelectionChange = this.onSelectionChange.bind(this), this.onBeforeEndOperation = this.onBeforeEndOperation.bind(this), this.ace.on("change", this.onChange), this.ace.on("changeSelection", this.onSelectionChange), this.ace.on("beforeEndOperation", this.onBeforeEndOperation);
  };

  m.Pos = function (e, t) {
    if (!(this instanceof w)) return new w(e, t);
    this.line = e, this.ch = t;
  }, m.defineOption = function (e, t, n) {}, m.commands = {
    redo: function redo(e) {
      e.ace.redo();
    },
    undo: function undo(e) {
      e.ace.undo();
    },
    newlineAndIndent: function newlineAndIndent(e) {
      e.ace.insert("\n");
    },
    goLineLeft: function goLineLeft(e) {
      e.ace.selection.moveCursorLineStart();
    },
    goLineRight: function goLineRight(e) {
      e.ace.selection.moveCursorLineEnd();
    }
  }, m.keyMap = {}, m.addClass = m.rmClass = function () {}, m.e_stop = m.e_preventDefault = f.stopEvent, m.keyName = function (e) {
    var t = a[e.keyCode] || e.key || "";
    return t.length == 1 && (t = t.toUpperCase()), t = f.getModifierString(e).replace(/(^|-)\w/g, function (e) {
      return e.toUpperCase();
    }) + t, t;
  }, m.keyMap["default"] = function (e) {
    return function (t) {
      var n = t.ace.commands.commandKeyBinding[e.toLowerCase()];
      return n && t.ace.execCommand(n) !== !1;
    };
  }, m.lookupKey = function br(e, t, n) {
    t || (t = "default"), typeof t == "string" && (t = m.keyMap[t]);
    var r = typeof t == "function" ? t(e) : t[e];
    if (r === !1) return "nothing";
    if (r === "...") return "multi";
    if (r != null && n(r)) return "handled";

    if (t.fallthrough) {
      if (!Array.isArray(t.fallthrough)) return br(e, t.fallthrough, n);

      for (var i = 0; i < t.fallthrough.length; i++) {
        var s = br(e, t.fallthrough[i], n);
        if (s) return s;
      }
    }
  }, m.findMatchingTag = function (e, t) {}, m.signal = function (e, t, n) {
    return e._signal(t, n);
  }, m.on = f.addListener, m.off = f.removeListener, m.isWordChar = function (e) {
    return e < "" ? /^\w$/.test(e) : (d.lastIndex = 0, d.test(e));
  }, function () {
    u.implement(m.prototype, s), this.destroy = function () {
      this.ace.off("change", this.onChange), this.ace.off("changeSelection", this.onSelectionChange), this.ace.off("beforeEndOperation", this.onBeforeEndOperation), this.removeOverlay();
    }, this.virtualSelectionMode = function () {
      return this.ace.inVirtualSelectionMode && this.ace.selection.index;
    }, this.onChange = function (e) {
      var t = {
        text: e.action[0] == "i" ? e.lines : []
      },
          n = this.curOp = this.curOp || {};
      n.changeHandlers || (n.changeHandlers = this._eventRegistry.change && this._eventRegistry.change.slice()), n.lastChange ? n.lastChange.next = n.lastChange = t : n.lastChange = n.change = t, this.$updateMarkers(e);
    }, this.onSelectionChange = function () {
      var e = this.curOp = this.curOp || {};
      e.cursorActivityHandlers || (e.cursorActivityHandlers = this._eventRegistry.cursorActivity && this._eventRegistry.cursorActivity.slice()), this.curOp.cursorActivity = !0, this.ace.inMultiSelectMode && this.ace.keyBinding.removeKeyboardHandler(p.keyboardHandler);
    }, this.operation = function (e, t) {
      if (!t && this.curOp || t && this.curOp && this.curOp.force) return e();
      (t || !this.ace.curOp) && this.curOp && this.onBeforeEndOperation();

      if (!this.ace.curOp) {
        var n = this.ace.prevOp;
        this.ace.startOperation({
          command: {
            name: "vim",
            scrollIntoView: "cursor"
          }
        });
      }

      var r = this.curOp = this.curOp || {};
      this.curOp.force = t;
      var i = e();
      return this.ace.curOp && this.ace.curOp.command.name == "vim" && (this.state.dialog && (this.ace.curOp.command.scrollIntoView = !1), this.ace.endOperation(), !r.cursorActivity && !r.lastChange && n && (this.ace.prevOp = n)), (t || !this.ace.curOp) && this.curOp && this.onBeforeEndOperation(), i;
    }, this.onBeforeEndOperation = function () {
      var e = this.curOp;
      e && (e.change && this.signal("change", e.change, e), e && e.cursorActivity && this.signal("cursorActivity", null, e), this.curOp = null);
    }, this.signal = function (e, t, n) {
      var r = n ? n[e + "Handlers"] : (this._eventRegistry || {})[e];
      if (!r) return;
      r = r.slice();

      for (var i = 0; i < r.length; i++) {
        r[i](this, t);
      }
    }, this.firstLine = function () {
      return 0;
    }, this.lastLine = function () {
      return this.ace.session.getLength() - 1;
    }, this.lineCount = function () {
      return this.ace.session.getLength();
    }, this.setCursor = function (e, t) {
      _typeof(e) == "object" && (t = e.ch, e = e.line);
      var n = !this.curOp && !this.ace.inVirtualSelectionMode;
      this.ace.inVirtualSelectionMode || this.ace.exitMultiSelectMode(), this.ace.session.unfold({
        row: e,
        column: t
      }), this.ace.selection.moveTo(e, t), n && (this.ace.renderer.scrollCursorIntoView(), this.ace.endOperation());
    }, this.getCursor = function (e) {
      var t = this.ace.selection,
          n = e == "anchor" ? t.isEmpty() ? t.lead : t.anchor : e == "head" || !e ? t.lead : t.getRange()[e];
      return y(n);
    }, this.listSelections = function (e) {
      var t = this.ace.multiSelect.rangeList.ranges;
      return !t.length || this.ace.inVirtualSelectionMode ? [{
        anchor: this.getCursor("anchor"),
        head: this.getCursor("head")
      }] : t.map(function (e) {
        return {
          anchor: this.clipPos(y(e.cursor == e.end ? e.start : e.end)),
          head: this.clipPos(y(e.cursor))
        };
      }, this);
    }, this.setSelections = function (e, t) {
      var n = this.ace.multiSelect,
          r = e.map(function (e) {
        var t = g(e.anchor),
            n = g(e.head),
            r = i.comparePoints(t, n) < 0 ? new i.fromPoints(t, n) : new i.fromPoints(n, t);
        return r.cursor = i.comparePoints(r.start, n) ? r.end : r.start, r;
      });

      if (this.ace.inVirtualSelectionMode) {
        this.ace.selection.fromOrientedRange(r[0]);
        return;
      }

      t ? r[t] && r.push(r.splice(t, 1)[0]) : r = r.reverse(), n.toSingleRange(r[0].clone());
      var s = this.ace.session;

      for (var o = 0; o < r.length; o++) {
        var u = s.$clipRangeToDocument(r[o]);
        n.addRange(u);
      }
    }, this.setSelection = function (e, t, n) {
      var r = this.ace.selection;
      r.moveTo(e.line, e.ch), r.selectTo(t.line, t.ch), n && n.origin == "*mouse" && this.onBeforeEndOperation();
    }, this.somethingSelected = function (e) {
      return !this.ace.selection.isEmpty();
    }, this.clipPos = function (e) {
      var t = this.ace.session.$clipPositionToDocument(e.line, e.ch);
      return y(t);
    }, this.foldCode = function (e) {
      this.ace.session.$toggleFoldWidget(e.line, {});
    }, this.markText = function (e) {
      return {
        clear: function clear() {},
        find: function find() {}
      };
    }, this.$updateMarkers = function (e) {
      var t = e.action == "insert",
          n = e.start,
          r = e.end,
          s = (r.row - n.row) * (t ? 1 : -1),
          o = (r.column - n.column) * (t ? 1 : -1);
      t && (r = n);

      for (var u in this.marks) {
        var a = this.marks[u],
            f = i.comparePoints(a, n);
        if (f < 0) continue;

        if (f === 0 && t) {
          if (a.bias != 1) {
            a.bias = -1;
            continue;
          }

          f = 1;
        }

        var l = t ? f : i.comparePoints(a, r);

        if (l > 0) {
          a.row += s, a.column += a.row == r.row ? o : 0;
          continue;
        }

        !t && l <= 0 && (a.row = n.row, a.column = n.column, l === 0 && (a.bias = 1));
      }
    };

    var e = function e(_e, t, n, r) {
      this.cm = _e, this.id = t, this.row = n, this.column = r, _e.marks[this.id] = this;
    };

    e.prototype.clear = function () {
      delete this.cm.marks[this.id];
    }, e.prototype.find = function () {
      return y(this);
    }, this.setBookmark = function (t, n) {
      var r = new e(this, this.$uid++, t.line, t.ch);
      if (!n || !n.insertLeft) r.$insertRight = !0;
      return this.marks[r.id] = r, r;
    }, this.moveH = function (e, t) {
      if (t == "char") {
        var n = this.ace.selection;
        n.clearSelection(), n.moveCursorBy(0, e);
      }
    }, this.findPosV = function (e, t, n, r) {
      if (n == "page") {
        var i = this.ace.renderer,
            s = i.layerConfig;
        t *= Math.floor(s.height / s.lineHeight), n = "line";
      }

      if (n == "line") {
        var o = this.ace.session.documentToScreenPosition(e.line, e.ch);
        r != null && (o.column = r), o.row += t, o.row = Math.min(Math.max(0, o.row), this.ace.session.getScreenLength() - 1);
        var u = this.ace.session.screenToDocumentPosition(o.row, o.column);
        return y(u);
      }

      debugger;
    }, this.charCoords = function (e, t) {
      if (t == "div" || !t) {
        var n = this.ace.session.documentToScreenPosition(e.line, e.ch);
        return {
          left: n.column,
          top: n.row
        };
      }

      if (t == "local") {
        var r = this.ace.renderer,
            n = this.ace.session.documentToScreenPosition(e.line, e.ch),
            i = r.layerConfig.lineHeight,
            s = r.layerConfig.characterWidth,
            o = i * n.row;
        return {
          left: n.column * s,
          top: o,
          bottom: o + i
        };
      }
    }, this.coordsChar = function (e, t) {
      var n = this.ace.renderer;

      if (t == "local") {
        var r = Math.max(0, Math.floor(e.top / n.lineHeight)),
            i = Math.max(0, Math.floor(e.left / n.characterWidth)),
            s = n.session.screenToDocumentPosition(r, i);
        return y(s);
      }

      if (t == "div") throw "not implemented";
    }, this.getSearchCursor = function (e, t, n) {
      var r = !1,
          i = !1;
      e instanceof RegExp && !e.global && (r = !e.ignoreCase, e = e.source, i = !0), e == "\\n" && (e = "\n", i = !1);
      var s = new l();
      t.ch == undefined && (t.ch = Number.MAX_VALUE);
      var o = {
        row: t.line,
        column: t.ch
      },
          u = this,
          a = null;
      return {
        findNext: function findNext() {
          return this.find(!1);
        },
        findPrevious: function findPrevious() {
          return this.find(!0);
        },
        find: function find(t) {
          s.setOptions({
            needle: e,
            caseSensitive: r,
            wrap: !1,
            backwards: t,
            regExp: i,
            start: a || o
          });
          var n = s.find(u.ace.session);
          return a = n, a && [!a.isEmpty()];
        },
        from: function from() {
          return a && y(a.start);
        },
        to: function to() {
          return a && y(a.end);
        },
        replace: function replace(e) {
          a && (a.end = u.ace.session.doc.replace(a, e));
        }
      };
    }, this.scrollTo = function (e, t) {
      var n = this.ace.renderer,
          r = n.layerConfig,
          i = r.maxHeight;
      i -= (n.$size.scrollerHeight - n.lineHeight) * n.$scrollPastEnd, t != null && this.ace.session.setScrollTop(Math.max(0, Math.min(t, i))), e != null && this.ace.session.setScrollLeft(Math.max(0, Math.min(e, r.width)));
    }, this.scrollInfo = function () {
      return 0;
    }, this.scrollIntoView = function (e, t) {
      if (e) {
        var n = this.ace.renderer,
            r = {
          top: 0,
          bottom: t
        };
        n.scrollCursorIntoView(g(e), n.lineHeight * 2 / n.$size.scrollerHeight, r);
      }
    }, this.getLine = function (e) {
      return this.ace.session.getLine(e);
    }, this.getRange = function (e, t) {
      return this.ace.session.getTextRange(new i(e.line, e.ch, t.line, t.ch));
    }, this.replaceRange = function (e, t, n) {
      n || (n = t);
      var r = new i(t.line, t.ch, n.line, n.ch);
      return this.ace.session.$clipRangeToDocument(r), this.ace.session.replace(r, e);
    }, this.replaceSelection = this.replaceSelections = function (e) {
      var t = this.ace.selection;

      if (this.ace.inVirtualSelectionMode) {
        this.ace.session.replace(t.getRange(), e[0] || "");
        return;
      }

      t.inVirtualSelectionMode = !0;
      var n = t.rangeList.ranges;
      n.length || (n = [this.ace.multiSelect.getRange()]);

      for (var r = n.length; r--;) {
        this.ace.session.replace(n[r], e[r] || "");
      }

      t.inVirtualSelectionMode = !1;
    }, this.getSelection = function () {
      return this.ace.getSelectedText();
    }, this.getSelections = function () {
      return this.listSelections().map(function (e) {
        return this.getRange(e.anchor, e.head);
      }, this);
    }, this.getInputField = function () {
      return this.ace.textInput.getElement();
    }, this.getWrapperElement = function () {
      return this.ace.container;
    };
    var t = {
      indentWithTabs: "useSoftTabs",
      indentUnit: "tabSize",
      tabSize: "tabSize",
      firstLineNumber: "firstLineNumber",
      readOnly: "readOnly"
    };
    this.setOption = function (e, n) {
      this.state[e] = n;

      switch (e) {
        case "indentWithTabs":
          e = t[e], n = !n;
          break;

        case "keyMap":
          this.state.$keyMap = n;
          return;

        default:
          e = t[e];
      }

      e && this.ace.setOption(e, n);
    }, this.getOption = function (e) {
      var n,
          r = t[e];
      r && (n = this.ace.getOption(r));

      switch (e) {
        case "indentWithTabs":
          return e = t[e], !n;

        case "keyMap":
          return this.state.$keyMap || "vim";
      }

      return r ? n : this.state[e];
    }, this.toggleOverwrite = function (e) {
      return this.state.overwrite = e, this.ace.setOverwrite(e);
    }, this.addOverlay = function (e) {
      if (!this.$searchHighlight || !this.$searchHighlight.session) {
        var t = new h(null, "ace_highlight-marker", "text"),
            n = this.ace.session.addDynamicMarker(t);
        t.id = n.id, t.session = this.ace.session, t.destroy = function (e) {
          t.session.off("change", t.updateOnChange), t.session.off("changeEditor", t.destroy), t.session.removeMarker(t.id), t.session = null;
        }, t.updateOnChange = function (e) {
          var n = e.start.row;
          n == e.end.row ? t.cache[n] = undefined : t.cache.splice(n, t.cache.length);
        }, t.session.on("changeEditor", t.destroy), t.session.on("change", t.updateOnChange);
      }

      var r = new RegExp(e.query.source, "gmi");
      this.$searchHighlight = e.highlight = t, this.$searchHighlight.setRegexp(r), this.ace.renderer.updateBackMarkers();
    }, this.removeOverlay = function (e) {
      this.$searchHighlight && this.$searchHighlight.session && this.$searchHighlight.destroy();
    }, this.getScrollInfo = function () {
      var e = this.ace.renderer,
          t = e.layerConfig;
      return {
        left: e.scrollLeft,
        top: e.scrollTop,
        height: t.maxHeight,
        width: t.width,
        clientHeight: t.height,
        clientWidth: t.width
      };
    }, this.getValue = function () {
      return this.ace.getValue();
    }, this.setValue = function (e) {
      return this.ace.setValue(e, -1);
    }, this.getTokenTypeAt = function (e) {
      var t = this.ace.session.getTokenAt(e.line, e.ch);
      return t && /comment|string/.test(t.type) ? "string" : "";
    }, this.findMatchingBracket = function (e) {
      var t = this.ace.session.findMatchingBracket(g(e));
      return {
        to: t && y(t)
      };
    }, this.indentLine = function (e, t) {
      t === !0 ? this.ace.session.indentRows(e, e, "	") : t === !1 && this.ace.session.outdentRows(new i(e, 0, e, 0));
    }, this.indexFromPos = function (e) {
      return this.ace.session.doc.positionToIndex(g(e));
    }, this.posFromIndex = function (e) {
      return y(this.ace.session.doc.indexToPosition(e));
    }, this.focus = function (e) {
      return this.ace.textInput.focus();
    }, this.blur = function (e) {
      return this.ace.blur();
    }, this.defaultTextHeight = function (e) {
      return this.ace.renderer.layerConfig.lineHeight;
    }, this.scanForBracket = function (e, t, n, r) {
      var i = r.bracketRegex.source,
          s = /paren|text|operator|tag/;
      if (t == 1) var o = this.ace.session.$findClosingBracket(i.slice(1, 2), g(e), s);else var o = this.ace.session.$findOpeningBracket(i.slice(-2, -1), {
        row: e.line,
        column: e.ch + 1
      }, s);
      return o && {
        pos: y(o)
      };
    }, this.refresh = function () {
      return this.ace.resize(!0);
    }, this.getMode = function () {
      return {
        name: this.getOption("mode")
      };
    }, this.execCommand = function (e) {
      if (m.commands.hasOwnProperty(e)) return m.commands[e](this);
      if (e == "indentAuto") return this.ace.execCommand("autoindent");
      console.log(e + " is not implemented");
    }, this.getLineNumber = function (e) {
      return e.row;
    }, this.getLineHandle = function (e) {
      return {
        text: this.ace.session.getLine(e),
        row: e
      };
    };
  }.call(m.prototype);

  var b = m.StringStream = function (e, t) {
    this.pos = this.start = 0, this.string = e, this.tabSize = t || 8, this.lastColumnPos = this.lastColumnValue = 0, this.lineStart = 0;
  };

  b.prototype = {
    eol: function eol() {
      return this.pos >= this.string.length;
    },
    sol: function sol() {
      return this.pos == this.lineStart;
    },
    peek: function peek() {
      return this.string.charAt(this.pos) || undefined;
    },
    next: function next() {
      if (this.pos < this.string.length) return this.string.charAt(this.pos++);
    },
    eat: function eat(e) {
      var t = this.string.charAt(this.pos);
      if (typeof e == "string") var n = t == e;else var n = t && (e.test ? e.test(t) : e(t));
      if (n) return ++this.pos, t;
    },
    eatWhile: function eatWhile(e) {
      var t = this.pos;

      while (this.eat(e)) {
        ;
      }

      return this.pos > t;
    },
    eatSpace: function eatSpace() {
      var e = this.pos;

      while (/[\s\u00a0]/.test(this.string.charAt(this.pos))) {
        ++this.pos;
      }

      return this.pos > e;
    },
    skipToEnd: function skipToEnd() {
      this.pos = this.string.length;
    },
    skipTo: function skipTo(e) {
      var t = this.string.indexOf(e, this.pos);
      if (t > -1) return this.pos = t, !0;
    },
    backUp: function backUp(e) {
      this.pos -= e;
    },
    column: function column() {
      throw "not implemented";
    },
    indentation: function indentation() {
      throw "not implemented";
    },
    match: function match(e, t, n) {
      if (typeof e != "string") {
        var s = this.string.slice(this.pos).match(e);
        return s && s.index > 0 ? null : (s && t !== !1 && (this.pos += s[0].length), s);
      }

      var r = function r(e) {
        return n ? e.toLowerCase() : e;
      },
          i = this.string.substr(this.pos, e.length);

      if (r(i) == r(e)) return t !== !1 && (this.pos += e.length), !0;
    },
    current: function current() {
      return this.string.slice(this.start, this.pos);
    },
    hideFirstChars: function hideFirstChars(e, t) {
      this.lineStart += e;

      try {
        return t();
      } finally {
        this.lineStart -= e;
      }
    }
  }, m.defineExtension = function (e, t) {
    m.prototype[e] = t;
  }, o.importCssString(".normal-mode .ace_cursor{    border: none;    background-color: rgba(255,0,0,0.5);}.normal-mode .ace_hidden-cursors .ace_cursor{  background-color: transparent;  border: 1px solid red;  opacity: 0.7}.ace_dialog {  position: absolute;  left: 0; right: 0;  background: inherit;  z-index: 15;  padding: .1em .8em;  overflow: hidden;  color: inherit;}.ace_dialog-top {  border-bottom: 1px solid #444;  top: 0;}.ace_dialog-bottom {  border-top: 1px solid #444;  bottom: 0;}.ace_dialog input {  border: none;  outline: none;  background: transparent;  width: 20em;  color: inherit;  font-family: monospace;}", "vimMode", !1), function () {
    function e(e, t, n) {
      var r = e.ace.container,
          i;
      return i = r.appendChild(document.createElement("div")), n ? i.className = "ace_dialog ace_dialog-bottom" : i.className = "ace_dialog ace_dialog-top", typeof t == "string" ? i.innerHTML = t : i.appendChild(t), i;
    }

    function t(e, t) {
      e.state.currentNotificationClose && e.state.currentNotificationClose(), e.state.currentNotificationClose = t;
    }

    m.defineExtension("openDialog", function (n, r, i) {
      function a(e) {
        if (typeof e == "string") f.value = e;else {
          if (o) return;
          if (e && e.type == "blur" && document.activeElement === f) return;
          u.state.dialog == s && (u.state.dialog = null, u.focus()), o = !0, s.remove(), i.onClose && i.onClose(s);
          var t = u;
          t.state.vim && (t.state.vim.status = null, t.ace._signal("changeStatus"), t.ace.renderer.$loop.schedule(t.ace.renderer.CHANGE_CURSOR));
        }
      }

      if (this.virtualSelectionMode()) return;
      i || (i = {}), t(this, null);
      var s = e(this, n, i.bottom),
          o = !1,
          u = this;
      this.state.dialog = s;
      var f = s.getElementsByTagName("input")[0],
          l;
      if (f) i.value && (f.value = i.value, i.selectValueOnOpen !== !1 && f.select()), i.onInput && m.on(f, "input", function (e) {
        i.onInput(e, f.value, a);
      }), i.onKeyUp && m.on(f, "keyup", function (e) {
        i.onKeyUp(e, f.value, a);
      }), m.on(f, "keydown", function (e) {
        if (i && i.onKeyDown && i.onKeyDown(e, f.value, a)) return;
        e.keyCode == 13 && r(f.value);
        if (e.keyCode == 27 || i.closeOnEnter !== !1 && e.keyCode == 13) m.e_stop(e), a();
      }), i.closeOnBlur !== !1 && m.on(f, "blur", a), f.focus();else if (l = s.getElementsByTagName("button")[0]) m.on(l, "click", function () {
        a(), u.focus();
      }), i.closeOnBlur !== !1 && m.on(l, "blur", a), l.focus();
      return a;
    }), m.defineExtension("openNotification", function (n, r) {
      function a() {
        if (s) return;
        s = !0, clearTimeout(o), i.remove();
      }

      if (this.virtualSelectionMode()) return;
      t(this, a);
      var i = e(this, n, r && r.bottom),
          s = !1,
          o,
          u = r && typeof r.duration != "undefined" ? r.duration : 5e3;
      return m.on(i, "click", function (e) {
        m.e_preventDefault(e), a();
      }), u && (o = setTimeout(a, u)), a;
    });
  }();

  var w = m.Pos,
      S = [{
    keys: "<Left>",
    type: "keyToKey",
    toKeys: "h"
  }, {
    keys: "<Right>",
    type: "keyToKey",
    toKeys: "l"
  }, {
    keys: "<Up>",
    type: "keyToKey",
    toKeys: "k"
  }, {
    keys: "<Down>",
    type: "keyToKey",
    toKeys: "j"
  }, {
    keys: "g<Up>",
    type: "keyToKey",
    toKeys: "gk"
  }, {
    keys: "g<Down>",
    type: "keyToKey",
    toKeys: "gj"
  }, {
    keys: "<Space>",
    type: "keyToKey",
    toKeys: "l"
  }, {
    keys: "<BS>",
    type: "keyToKey",
    toKeys: "h",
    context: "normal"
  }, {
    keys: "<Del>",
    type: "keyToKey",
    toKeys: "x",
    context: "normal"
  }, {
    keys: "<C-Space>",
    type: "keyToKey",
    toKeys: "W"
  }, {
    keys: "<C-BS>",
    type: "keyToKey",
    toKeys: "B",
    context: "normal"
  }, {
    keys: "<S-Space>",
    type: "keyToKey",
    toKeys: "w"
  }, {
    keys: "<S-BS>",
    type: "keyToKey",
    toKeys: "b",
    context: "normal"
  }, {
    keys: "<C-n>",
    type: "keyToKey",
    toKeys: "j"
  }, {
    keys: "<C-p>",
    type: "keyToKey",
    toKeys: "k"
  }, {
    keys: "<C-[>",
    type: "keyToKey",
    toKeys: "<Esc>"
  }, {
    keys: "<C-c>",
    type: "keyToKey",
    toKeys: "<Esc>"
  }, {
    keys: "<C-[>",
    type: "keyToKey",
    toKeys: "<Esc>",
    context: "insert"
  }, {
    keys: "<C-c>",
    type: "keyToKey",
    toKeys: "<Esc>",
    context: "insert"
  }, {
    keys: "<C-Esc>",
    type: "keyToKey",
    toKeys: "<Esc>"
  }, {
    keys: "<C-Esc>",
    type: "keyToKey",
    toKeys: "<Esc>",
    context: "insert"
  }, {
    keys: "s",
    type: "keyToKey",
    toKeys: "cl",
    context: "normal"
  }, {
    keys: "s",
    type: "keyToKey",
    toKeys: "c",
    context: "visual"
  }, {
    keys: "S",
    type: "keyToKey",
    toKeys: "cc",
    context: "normal"
  }, {
    keys: "S",
    type: "keyToKey",
    toKeys: "VdO",
    context: "visual"
  }, {
    keys: "<Home>",
    type: "keyToKey",
    toKeys: "0"
  }, {
    keys: "<End>",
    type: "keyToKey",
    toKeys: "$"
  }, {
    keys: "<PageUp>",
    type: "keyToKey",
    toKeys: "<C-b>"
  }, {
    keys: "<PageDown>",
    type: "keyToKey",
    toKeys: "<C-f>"
  }, {
    keys: "<CR>",
    type: "keyToKey",
    toKeys: "j^",
    context: "normal"
  }, {
    keys: "<Ins>",
    type: "keyToKey",
    toKeys: "i",
    context: "normal"
  }, {
    keys: "<Ins>",
    type: "action",
    action: "toggleOverwrite",
    context: "insert"
  }, {
    keys: "H",
    type: "motion",
    motion: "moveToTopLine",
    motionArgs: {
      linewise: !0,
      toJumplist: !0
    }
  }, {
    keys: "M",
    type: "motion",
    motion: "moveToMiddleLine",
    motionArgs: {
      linewise: !0,
      toJumplist: !0
    }
  }, {
    keys: "L",
    type: "motion",
    motion: "moveToBottomLine",
    motionArgs: {
      linewise: !0,
      toJumplist: !0
    }
  }, {
    keys: "h",
    type: "motion",
    motion: "moveByCharacters",
    motionArgs: {
      forward: !1
    }
  }, {
    keys: "l",
    type: "motion",
    motion: "moveByCharacters",
    motionArgs: {
      forward: !0
    }
  }, {
    keys: "j",
    type: "motion",
    motion: "moveByLines",
    motionArgs: {
      forward: !0,
      linewise: !0
    }
  }, {
    keys: "k",
    type: "motion",
    motion: "moveByLines",
    motionArgs: {
      forward: !1,
      linewise: !0
    }
  }, {
    keys: "gj",
    type: "motion",
    motion: "moveByDisplayLines",
    motionArgs: {
      forward: !0
    }
  }, {
    keys: "gk",
    type: "motion",
    motion: "moveByDisplayLines",
    motionArgs: {
      forward: !1
    }
  }, {
    keys: "w",
    type: "motion",
    motion: "moveByWords",
    motionArgs: {
      forward: !0,
      wordEnd: !1
    }
  }, {
    keys: "W",
    type: "motion",
    motion: "moveByWords",
    motionArgs: {
      forward: !0,
      wordEnd: !1,
      bigWord: !0
    }
  }, {
    keys: "e",
    type: "motion",
    motion: "moveByWords",
    motionArgs: {
      forward: !0,
      wordEnd: !0,
      inclusive: !0
    }
  }, {
    keys: "E",
    type: "motion",
    motion: "moveByWords",
    motionArgs: {
      forward: !0,
      wordEnd: !0,
      bigWord: !0,
      inclusive: !0
    }
  }, {
    keys: "b",
    type: "motion",
    motion: "moveByWords",
    motionArgs: {
      forward: !1,
      wordEnd: !1
    }
  }, {
    keys: "B",
    type: "motion",
    motion: "moveByWords",
    motionArgs: {
      forward: !1,
      wordEnd: !1,
      bigWord: !0
    }
  }, {
    keys: "ge",
    type: "motion",
    motion: "moveByWords",
    motionArgs: {
      forward: !1,
      wordEnd: !0,
      inclusive: !0
    }
  }, {
    keys: "gE",
    type: "motion",
    motion: "moveByWords",
    motionArgs: {
      forward: !1,
      wordEnd: !0,
      bigWord: !0,
      inclusive: !0
    }
  }, {
    keys: "{",
    type: "motion",
    motion: "moveByParagraph",
    motionArgs: {
      forward: !1,
      toJumplist: !0
    }
  }, {
    keys: "}",
    type: "motion",
    motion: "moveByParagraph",
    motionArgs: {
      forward: !0,
      toJumplist: !0
    }
  }, {
    keys: "(",
    type: "motion",
    motion: "moveBySentence",
    motionArgs: {
      forward: !1
    }
  }, {
    keys: ")",
    type: "motion",
    motion: "moveBySentence",
    motionArgs: {
      forward: !0
    }
  }, {
    keys: "<C-f>",
    type: "motion",
    motion: "moveByPage",
    motionArgs: {
      forward: !0
    }
  }, {
    keys: "<C-b>",
    type: "motion",
    motion: "moveByPage",
    motionArgs: {
      forward: !1
    }
  }, {
    keys: "<C-d>",
    type: "motion",
    motion: "moveByScroll",
    motionArgs: {
      forward: !0,
      explicitRepeat: !0
    }
  }, {
    keys: "<C-u>",
    type: "motion",
    motion: "moveByScroll",
    motionArgs: {
      forward: !1,
      explicitRepeat: !0
    }
  }, {
    keys: "gg",
    type: "motion",
    motion: "moveToLineOrEdgeOfDocument",
    motionArgs: {
      forward: !1,
      explicitRepeat: !0,
      linewise: !0,
      toJumplist: !0
    }
  }, {
    keys: "G",
    type: "motion",
    motion: "moveToLineOrEdgeOfDocument",
    motionArgs: {
      forward: !0,
      explicitRepeat: !0,
      linewise: !0,
      toJumplist: !0
    }
  }, {
    keys: "g$",
    type: "motion",
    motion: "moveToEndOfDisplayLine"
  }, {
    keys: "g^",
    type: "motion",
    motion: "moveToStartOfDisplayLine"
  }, {
    keys: "g0",
    type: "motion",
    motion: "moveToStartOfDisplayLine"
  }, {
    keys: "0",
    type: "motion",
    motion: "moveToStartOfLine"
  }, {
    keys: "^",
    type: "motion",
    motion: "moveToFirstNonWhiteSpaceCharacter"
  }, {
    keys: "+",
    type: "motion",
    motion: "moveByLines",
    motionArgs: {
      forward: !0,
      toFirstChar: !0
    }
  }, {
    keys: "-",
    type: "motion",
    motion: "moveByLines",
    motionArgs: {
      forward: !1,
      toFirstChar: !0
    }
  }, {
    keys: "_",
    type: "motion",
    motion: "moveByLines",
    motionArgs: {
      forward: !0,
      toFirstChar: !0,
      repeatOffset: -1
    }
  }, {
    keys: "$",
    type: "motion",
    motion: "moveToEol",
    motionArgs: {
      inclusive: !0
    }
  }, {
    keys: "%",
    type: "motion",
    motion: "moveToMatchedSymbol",
    motionArgs: {
      inclusive: !0,
      toJumplist: !0
    }
  }, {
    keys: "f<character>",
    type: "motion",
    motion: "moveToCharacter",
    motionArgs: {
      forward: !0,
      inclusive: !0
    }
  }, {
    keys: "F<character>",
    type: "motion",
    motion: "moveToCharacter",
    motionArgs: {
      forward: !1
    }
  }, {
    keys: "t<character>",
    type: "motion",
    motion: "moveTillCharacter",
    motionArgs: {
      forward: !0,
      inclusive: !0
    }
  }, {
    keys: "T<character>",
    type: "motion",
    motion: "moveTillCharacter",
    motionArgs: {
      forward: !1
    }
  }, {
    keys: ";",
    type: "motion",
    motion: "repeatLastCharacterSearch",
    motionArgs: {
      forward: !0
    }
  }, {
    keys: ",",
    type: "motion",
    motion: "repeatLastCharacterSearch",
    motionArgs: {
      forward: !1
    }
  }, {
    keys: "'<character>",
    type: "motion",
    motion: "goToMark",
    motionArgs: {
      toJumplist: !0,
      linewise: !0
    }
  }, {
    keys: "`<character>",
    type: "motion",
    motion: "goToMark",
    motionArgs: {
      toJumplist: !0
    }
  }, {
    keys: "]`",
    type: "motion",
    motion: "jumpToMark",
    motionArgs: {
      forward: !0
    }
  }, {
    keys: "[`",
    type: "motion",
    motion: "jumpToMark",
    motionArgs: {
      forward: !1
    }
  }, {
    keys: "]'",
    type: "motion",
    motion: "jumpToMark",
    motionArgs: {
      forward: !0,
      linewise: !0
    }
  }, {
    keys: "['",
    type: "motion",
    motion: "jumpToMark",
    motionArgs: {
      forward: !1,
      linewise: !0
    }
  }, {
    keys: "]p",
    type: "action",
    action: "paste",
    isEdit: !0,
    actionArgs: {
      after: !0,
      isEdit: !0,
      matchIndent: !0
    }
  }, {
    keys: "[p",
    type: "action",
    action: "paste",
    isEdit: !0,
    actionArgs: {
      after: !1,
      isEdit: !0,
      matchIndent: !0
    }
  }, {
    keys: "]<character>",
    type: "motion",
    motion: "moveToSymbol",
    motionArgs: {
      forward: !0,
      toJumplist: !0
    }
  }, {
    keys: "[<character>",
    type: "motion",
    motion: "moveToSymbol",
    motionArgs: {
      forward: !1,
      toJumplist: !0
    }
  }, {
    keys: "|",
    type: "motion",
    motion: "moveToColumn"
  }, {
    keys: "o",
    type: "motion",
    motion: "moveToOtherHighlightedEnd",
    context: "visual"
  }, {
    keys: "O",
    type: "motion",
    motion: "moveToOtherHighlightedEnd",
    motionArgs: {
      sameLine: !0
    },
    context: "visual"
  }, {
    keys: "d",
    type: "operator",
    operator: "delete"
  }, {
    keys: "y",
    type: "operator",
    operator: "yank"
  }, {
    keys: "c",
    type: "operator",
    operator: "change"
  }, {
    keys: "=",
    type: "operator",
    operator: "indentAuto"
  }, {
    keys: ">",
    type: "operator",
    operator: "indent",
    operatorArgs: {
      indentRight: !0
    }
  }, {
    keys: "<",
    type: "operator",
    operator: "indent",
    operatorArgs: {
      indentRight: !1
    }
  }, {
    keys: "g~",
    type: "operator",
    operator: "changeCase"
  }, {
    keys: "gu",
    type: "operator",
    operator: "changeCase",
    operatorArgs: {
      toLower: !0
    },
    isEdit: !0
  }, {
    keys: "gU",
    type: "operator",
    operator: "changeCase",
    operatorArgs: {
      toLower: !1
    },
    isEdit: !0
  }, {
    keys: "n",
    type: "motion",
    motion: "findNext",
    motionArgs: {
      forward: !0,
      toJumplist: !0
    }
  }, {
    keys: "N",
    type: "motion",
    motion: "findNext",
    motionArgs: {
      forward: !1,
      toJumplist: !0
    }
  }, {
    keys: "gn",
    type: "motion",
    motion: "findAndSelectNextInclusive",
    motionArgs: {
      forward: !0
    }
  }, {
    keys: "gN",
    type: "motion",
    motion: "findAndSelectNextInclusive",
    motionArgs: {
      forward: !1
    }
  }, {
    keys: "x",
    type: "operatorMotion",
    operator: "delete",
    motion: "moveByCharacters",
    motionArgs: {
      forward: !0
    },
    operatorMotionArgs: {
      visualLine: !1
    }
  }, {
    keys: "X",
    type: "operatorMotion",
    operator: "delete",
    motion: "moveByCharacters",
    motionArgs: {
      forward: !1
    },
    operatorMotionArgs: {
      visualLine: !0
    }
  }, {
    keys: "D",
    type: "operatorMotion",
    operator: "delete",
    motion: "moveToEol",
    motionArgs: {
      inclusive: !0
    },
    context: "normal"
  }, {
    keys: "D",
    type: "operator",
    operator: "delete",
    operatorArgs: {
      linewise: !0
    },
    context: "visual"
  }, {
    keys: "Y",
    type: "operatorMotion",
    operator: "yank",
    motion: "expandToLine",
    motionArgs: {
      linewise: !0
    },
    context: "normal"
  }, {
    keys: "Y",
    type: "operator",
    operator: "yank",
    operatorArgs: {
      linewise: !0
    },
    context: "visual"
  }, {
    keys: "C",
    type: "operatorMotion",
    operator: "change",
    motion: "moveToEol",
    motionArgs: {
      inclusive: !0
    },
    context: "normal"
  }, {
    keys: "C",
    type: "operator",
    operator: "change",
    operatorArgs: {
      linewise: !0
    },
    context: "visual"
  }, {
    keys: "~",
    type: "operatorMotion",
    operator: "changeCase",
    motion: "moveByCharacters",
    motionArgs: {
      forward: !0
    },
    operatorArgs: {
      shouldMoveCursor: !0
    },
    context: "normal"
  }, {
    keys: "~",
    type: "operator",
    operator: "changeCase",
    context: "visual"
  }, {
    keys: "<C-w>",
    type: "operatorMotion",
    operator: "delete",
    motion: "moveByWords",
    motionArgs: {
      forward: !1,
      wordEnd: !1
    },
    context: "insert"
  }, {
    keys: "<C-w>",
    type: "idle",
    context: "normal"
  }, {
    keys: "<C-i>",
    type: "action",
    action: "jumpListWalk",
    actionArgs: {
      forward: !0
    }
  }, {
    keys: "<C-o>",
    type: "action",
    action: "jumpListWalk",
    actionArgs: {
      forward: !1
    }
  }, {
    keys: "<C-e>",
    type: "action",
    action: "scroll",
    actionArgs: {
      forward: !0,
      linewise: !0
    }
  }, {
    keys: "<C-y>",
    type: "action",
    action: "scroll",
    actionArgs: {
      forward: !1,
      linewise: !0
    }
  }, {
    keys: "a",
    type: "action",
    action: "enterInsertMode",
    isEdit: !0,
    actionArgs: {
      insertAt: "charAfter"
    },
    context: "normal"
  }, {
    keys: "A",
    type: "action",
    action: "enterInsertMode",
    isEdit: !0,
    actionArgs: {
      insertAt: "eol"
    },
    context: "normal"
  }, {
    keys: "A",
    type: "action",
    action: "enterInsertMode",
    isEdit: !0,
    actionArgs: {
      insertAt: "endOfSelectedArea"
    },
    context: "visual"
  }, {
    keys: "i",
    type: "action",
    action: "enterInsertMode",
    isEdit: !0,
    actionArgs: {
      insertAt: "inplace"
    },
    context: "normal"
  }, {
    keys: "gi",
    type: "action",
    action: "enterInsertMode",
    isEdit: !0,
    actionArgs: {
      insertAt: "lastEdit"
    },
    context: "normal"
  }, {
    keys: "I",
    type: "action",
    action: "enterInsertMode",
    isEdit: !0,
    actionArgs: {
      insertAt: "firstNonBlank"
    },
    context: "normal"
  }, {
    keys: "gI",
    type: "action",
    action: "enterInsertMode",
    isEdit: !0,
    actionArgs: {
      insertAt: "bol"
    },
    context: "normal"
  }, {
    keys: "I",
    type: "action",
    action: "enterInsertMode",
    isEdit: !0,
    actionArgs: {
      insertAt: "startOfSelectedArea"
    },
    context: "visual"
  }, {
    keys: "o",
    type: "action",
    action: "newLineAndEnterInsertMode",
    isEdit: !0,
    interlaceInsertRepeat: !0,
    actionArgs: {
      after: !0
    },
    context: "normal"
  }, {
    keys: "O",
    type: "action",
    action: "newLineAndEnterInsertMode",
    isEdit: !0,
    interlaceInsertRepeat: !0,
    actionArgs: {
      after: !1
    },
    context: "normal"
  }, {
    keys: "v",
    type: "action",
    action: "toggleVisualMode"
  }, {
    keys: "V",
    type: "action",
    action: "toggleVisualMode",
    actionArgs: {
      linewise: !0
    }
  }, {
    keys: "<C-v>",
    type: "action",
    action: "toggleVisualMode",
    actionArgs: {
      blockwise: !0
    }
  }, {
    keys: "<C-q>",
    type: "action",
    action: "toggleVisualMode",
    actionArgs: {
      blockwise: !0
    }
  }, {
    keys: "gv",
    type: "action",
    action: "reselectLastSelection"
  }, {
    keys: "J",
    type: "action",
    action: "joinLines",
    isEdit: !0
  }, {
    keys: "gJ",
    type: "action",
    action: "joinLines",
    actionArgs: {
      keepSpaces: !0
    },
    isEdit: !0
  }, {
    keys: "p",
    type: "action",
    action: "paste",
    isEdit: !0,
    actionArgs: {
      after: !0,
      isEdit: !0
    }
  }, {
    keys: "P",
    type: "action",
    action: "paste",
    isEdit: !0,
    actionArgs: {
      after: !1,
      isEdit: !0
    }
  }, {
    keys: "r<character>",
    type: "action",
    action: "replace",
    isEdit: !0
  }, {
    keys: "@<character>",
    type: "action",
    action: "replayMacro"
  }, {
    keys: "q<character>",
    type: "action",
    action: "enterMacroRecordMode"
  }, {
    keys: "R",
    type: "action",
    action: "enterInsertMode",
    isEdit: !0,
    actionArgs: {
      replace: !0
    },
    context: "normal"
  }, {
    keys: "R",
    type: "operator",
    operator: "change",
    operatorArgs: {
      linewise: !0,
      fullLine: !0
    },
    context: "visual",
    exitVisualBlock: !0
  }, {
    keys: "u",
    type: "action",
    action: "undo",
    context: "normal"
  }, {
    keys: "u",
    type: "operator",
    operator: "changeCase",
    operatorArgs: {
      toLower: !0
    },
    context: "visual",
    isEdit: !0
  }, {
    keys: "U",
    type: "operator",
    operator: "changeCase",
    operatorArgs: {
      toLower: !1
    },
    context: "visual",
    isEdit: !0
  }, {
    keys: "<C-r>",
    type: "action",
    action: "redo"
  }, {
    keys: "m<character>",
    type: "action",
    action: "setMark"
  }, {
    keys: '"<character>',
    type: "action",
    action: "setRegister"
  }, {
    keys: "zz",
    type: "action",
    action: "scrollToCursor",
    actionArgs: {
      position: "center"
    }
  }, {
    keys: "z.",
    type: "action",
    action: "scrollToCursor",
    actionArgs: {
      position: "center"
    },
    motion: "moveToFirstNonWhiteSpaceCharacter"
  }, {
    keys: "zt",
    type: "action",
    action: "scrollToCursor",
    actionArgs: {
      position: "top"
    }
  }, {
    keys: "z<CR>",
    type: "action",
    action: "scrollToCursor",
    actionArgs: {
      position: "top"
    },
    motion: "moveToFirstNonWhiteSpaceCharacter"
  }, {
    keys: "z-",
    type: "action",
    action: "scrollToCursor",
    actionArgs: {
      position: "bottom"
    }
  }, {
    keys: "zb",
    type: "action",
    action: "scrollToCursor",
    actionArgs: {
      position: "bottom"
    },
    motion: "moveToFirstNonWhiteSpaceCharacter"
  }, {
    keys: ".",
    type: "action",
    action: "repeatLastEdit"
  }, {
    keys: "<C-a>",
    type: "action",
    action: "incrementNumberToken",
    isEdit: !0,
    actionArgs: {
      increase: !0,
      backtrack: !1
    }
  }, {
    keys: "<C-x>",
    type: "action",
    action: "incrementNumberToken",
    isEdit: !0,
    actionArgs: {
      increase: !1,
      backtrack: !1
    }
  }, {
    keys: "<C-t>",
    type: "action",
    action: "indent",
    actionArgs: {
      indentRight: !0
    },
    context: "insert"
  }, {
    keys: "<C-d>",
    type: "action",
    action: "indent",
    actionArgs: {
      indentRight: !1
    },
    context: "insert"
  }, {
    keys: "a<character>",
    type: "motion",
    motion: "textObjectManipulation"
  }, {
    keys: "i<character>",
    type: "motion",
    motion: "textObjectManipulation",
    motionArgs: {
      textObjectInner: !0
    }
  }, {
    keys: "/",
    type: "search",
    searchArgs: {
      forward: !0,
      querySrc: "prompt",
      toJumplist: !0
    }
  }, {
    keys: "?",
    type: "search",
    searchArgs: {
      forward: !1,
      querySrc: "prompt",
      toJumplist: !0
    }
  }, {
    keys: "*",
    type: "search",
    searchArgs: {
      forward: !0,
      querySrc: "wordUnderCursor",
      wholeWordOnly: !0,
      toJumplist: !0
    }
  }, {
    keys: "#",
    type: "search",
    searchArgs: {
      forward: !1,
      querySrc: "wordUnderCursor",
      wholeWordOnly: !0,
      toJumplist: !0
    }
  }, {
    keys: "g*",
    type: "search",
    searchArgs: {
      forward: !0,
      querySrc: "wordUnderCursor",
      toJumplist: !0
    }
  }, {
    keys: "g#",
    type: "search",
    searchArgs: {
      forward: !1,
      querySrc: "wordUnderCursor",
      toJumplist: !0
    }
  }, {
    keys: ":",
    type: "ex"
  }],
      x = S.length,
      T = [{
    name: "colorscheme",
    shortName: "colo"
  }, {
    name: "map"
  }, {
    name: "imap",
    shortName: "im"
  }, {
    name: "nmap",
    shortName: "nm"
  }, {
    name: "vmap",
    shortName: "vm"
  }, {
    name: "unmap"
  }, {
    name: "write",
    shortName: "w"
  }, {
    name: "undo",
    shortName: "u"
  }, {
    name: "redo",
    shortName: "red"
  }, {
    name: "set",
    shortName: "se"
  }, {
    name: "setlocal",
    shortName: "setl"
  }, {
    name: "setglobal",
    shortName: "setg"
  }, {
    name: "sort",
    shortName: "sor"
  }, {
    name: "substitute",
    shortName: "s",
    possiblyAsync: !0
  }, {
    name: "nohlsearch",
    shortName: "noh"
  }, {
    name: "yank",
    shortName: "y"
  }, {
    name: "delmarks",
    shortName: "delm"
  }, {
    name: "registers",
    shortName: "reg",
    excludeFromCommandHistory: !0
  }, {
    name: "vglobal",
    shortName: "v"
  }, {
    name: "global",
    shortName: "g"
  }],
      N = function N() {
    return ct;
  };

  m.defineOption("vimMode", !1, function (e, t, n) {
    t && e.getOption("keyMap") != "vim" ? e.setOption("keyMap", "vim") : !t && n != m.Init && /^vim/.test(e.getOption("keyMap")) && e.setOption("keyMap", "default");
  });
  var M = {
    Shift: "S",
    Ctrl: "C",
    Alt: "A",
    Cmd: "D",
    Mod: "A",
    CapsLock: ""
  },
      _ = {
    Enter: "CR",
    Backspace: "BS",
    Delete: "Del",
    Insert: "Ins"
  },
      H = /[\d]/,
      B = [m.isWordChar, function (e) {
    return e && !m.isWordChar(e) && !/\s/.test(e);
  }],
      j = [function (e) {
    return /\S/.test(e);
  }],
      I = F(65, 26),
      q = F(97, 26),
      R = F(48, 10),
      U = [].concat(I, q, R, ["<", ">"]),
      z = [].concat(I, q, R, ["-", '"', ".", ":", "_", "/"]),
      W;

  try {
    W = new RegExp("^[\\p{Lu}]$", "u");
  } catch (X) {
    W = /^[A-Z]$/;
  }

  var et = {};
  tt("filetype", undefined, "string", ["ft"], function (e, t) {
    if (t === undefined) return;

    if (e === undefined) {
      var n = t.getOption("mode");
      return n == "null" ? "" : n;
    }

    var n = e == "" ? "null" : e;
    t.setOption("mode", n);
  });

  var it = function it() {
    function s(s, o, u) {
      function l(n) {
        var r = ++t % e,
            o = i[r];
        o && o.clear(), i[r] = s.setBookmark(n);
      }

      var a = t % e,
          f = i[a];

      if (f) {
        var c = f.find();
        c && !Pt(c, o) && l(o);
      } else l(o);

      l(u), n = t, r = t - e + 1, r < 0 && (r = 0);
    }

    function o(s, o) {
      t += o, t > n ? t = n : t < r && (t = r);
      var u = i[(e + t) % e];

      if (u && !u.find()) {
        var a = o > 0 ? 1 : -1,
            f,
            l = s.getCursor();

        do {
          t += a, u = i[(e + t) % e];
          if (u && (f = u.find()) && !Pt(l, f)) break;
        } while (t < n && t > r);
      }

      return u;
    }

    function u(e, n) {
      var r = t,
          i = o(e, n);
      return t = r, i && i.find();
    }

    var e = 100,
        t = -1,
        n = 0,
        r = 0,
        i = new Array(e);
    return {
      cachedCursor: undefined,
      add: s,
      find: u,
      move: o
    };
  },
      st = function st(e) {
    return e ? {
      changes: e.changes,
      expectCursorActivityForChange: e.expectCursorActivityForChange
    } : {
      changes: [],
      expectCursorActivityForChange: !1
    };
  };

  ot.prototype = {
    exitMacroRecordMode: function exitMacroRecordMode() {
      var e = at.macroModeState;
      e.onRecordingDone && e.onRecordingDone(), e.onRecordingDone = undefined, e.isRecording = !1;
    },
    enterMacroRecordMode: function enterMacroRecordMode(e, t) {
      var n = at.registerController.getRegister(t);
      n && (n.clear(), this.latestRegister = t, e.openDialog && (this.onRecordingDone = e.openDialog(document.createTextNode("(recording)[" + t + "]"), null, {
        bottom: !0
      })), this.isRecording = !0);
    }
  };
  var at,
      lt,
      ct = {
    buildKeyMap: function buildKeyMap() {},
    getRegisterController: function getRegisterController() {
      return at.registerController;
    },
    resetVimGlobalState_: ft,
    getVimGlobalState_: function getVimGlobalState_() {
      return at;
    },
    maybeInitVimState_: ut,
    suppressErrorLogging: !1,
    InsertModeKey: ar,
    map: function map(e, t, n) {
      Qn.map(e, t, n);
    },
    unmap: function unmap(e, t) {
      return Qn.unmap(e, t);
    },
    noremap: function noremap(e, t, n) {
      function r(e) {
        return e ? [e] : ["normal", "insert", "visual"];
      }

      var i = r(n),
          s = S.length,
          o = x;

      for (var u = s - o; u < s && i.length; u++) {
        var a = S[u];

        if (a.keys == t && (!n || !a.context || a.context === n) && a.type.substr(0, 2) !== "ex" && a.type.substr(0, 3) !== "key") {
          var f = {};

          for (var l in a) {
            f[l] = a[l];
          }

          f.keys = e, n && !f.context && (f.context = n), this._mapCommand(f);
          var c = r(a.context);
          i = i.filter(function (e) {
            return c.indexOf(e) === -1;
          });
        }
      }
    },
    mapclear: function mapclear(e) {
      var t = S.length,
          n = x,
          r = S.slice(0, t - n);
      S = S.slice(t - n);
      if (e) for (var i = r.length - 1; i >= 0; i--) {
        var s = r[i];
        if (e !== s.context) if (s.context) this._mapCommand(s);else {
          var o = ["normal", "insert", "visual"];

          for (var u in o) {
            if (o[u] !== e) {
              var a = {};

              for (var f in s) {
                a[f] = s[f];
              }

              a.context = o[u], this._mapCommand(a);
            }
          }
        }
      }
    },
    setOption: nt,
    getOption: rt,
    defineOption: tt,
    defineEx: function defineEx(e, t, n) {
      if (!t) t = e;else if (e.indexOf(t) !== 0) throw new Error('(Vim.defineEx) "' + t + '" is not a prefix of "' + e + '", command not registered');
      Kn[e] = n, Qn.commandMap_[t] = {
        name: e,
        shortName: t,
        type: "api"
      };
    },
    handleKey: function handleKey(e, t, n) {
      var r = this.findKey(e, t, n);
      if (typeof r == "function") return r();
    },
    findKey: function findKey(e, t, n) {
      function i() {
        var r = at.macroModeState;

        if (r.isRecording) {
          if (t == "q") return r.exitMacroRecordMode(), pt(e), !0;
          n != "mapping" && nr(r, t);
        }
      }

      function s() {
        if (t == "<Esc>") return pt(e), r.visualMode ? Yt(e) : r.insertMode && Yn(e), !0;
      }

      function o(n) {
        var r;

        while (n) {
          r = /<\w+-.+?>|<\w+>|./.exec(n), t = r[0], n = n.substring(r.index + t.length), ct.handleKey(e, t, "mapping");
        }
      }

      function u() {
        if (s()) return !0;
        var n = r.inputState.keyBuffer = r.inputState.keyBuffer + t,
            i = t.length == 1,
            o = yt.matchCommand(n, S, r.inputState, "insert");

        while (n.length > 1 && o.type != "full") {
          var n = r.inputState.keyBuffer = n.slice(1),
              u = yt.matchCommand(n, S, r.inputState, "insert");
          u.type != "none" && (o = u);
        }

        if (o.type == "none") return pt(e), !1;
        if (o.type == "partial") return lt && window.clearTimeout(lt), lt = window.setTimeout(function () {
          r.insertMode && r.inputState.keyBuffer && pt(e);
        }, rt("insertModeEscKeysTimeout")), !i;
        lt && window.clearTimeout(lt);

        if (i) {
          var a = e.listSelections();

          for (var f = 0; f < a.length; f++) {
            var l = a[f].head;
            e.replaceRange("", Lt(l, 0, -(n.length - 1)), l, "+input");
          }

          at.macroModeState.lastInsertModeChanges.changes.pop();
        }

        return pt(e), o.command;
      }

      function a() {
        if (i() || s()) return !0;
        var n = r.inputState.keyBuffer = r.inputState.keyBuffer + t;
        if (/^[1-9]\d*$/.test(n)) return !0;
        var o = /^(\d*)(.*)$/.exec(n);
        if (!o) return pt(e), !1;
        var u = r.visualMode ? "visual" : "normal",
            a = o[2] || o[1];
        r.inputState.operatorShortcut && r.inputState.operatorShortcut.slice(-1) == a && (a = r.inputState.operatorShortcut);
        var f = yt.matchCommand(a, S, r.inputState, u);
        if (f.type == "none") return pt(e), !1;
        if (f.type == "partial") return !0;
        if (f.type == "clear") return pt(e), !0;
        r.inputState.keyBuffer = "";
        var o = /^(\d*)(.*)$/.exec(n);
        return o[1] && o[1] != "0" && r.inputState.pushRepeatDigit(o[1]), f.command;
      }

      var r = ut(e),
          f;
      return r.insertMode ? f = u() : f = a(), f === !1 ? undefined : f === !0 ? function () {
        return !0;
      } : function () {
        if ((f.operator || f.isEdit) && e.getOption("readOnly")) return;
        return e.operation(function () {
          e.curOp.isVimOp = !0;

          try {
            f.type == "keyToKey" ? o(f.toKeys) : yt.processCommand(e, r, f);
          } catch (t) {
            throw e.state.vim = undefined, ut(e), ct.suppressErrorLogging || console.log(t), t;
          }

          return !0;
        });
      };
    },
    handleEx: function handleEx(e, t) {
      Qn.processCommand(e, t);
    },
    defineMotion: wt,
    defineAction: Nt,
    defineOperator: xt,
    mapCommand: er,
    _mapCommand: Zn,
    defineRegister: vt,
    exitVisualMode: Yt,
    exitInsertMode: Yn
  };
  ht.prototype.pushRepeatDigit = function (e) {
    this.operator ? this.motionRepeat = this.motionRepeat.concat(e) : this.prefixRepeat = this.prefixRepeat.concat(e);
  }, ht.prototype.getRepeat = function () {
    var e = 0;
    if (this.prefixRepeat.length > 0 || this.motionRepeat.length > 0) e = 1, this.prefixRepeat.length > 0 && (e *= parseInt(this.prefixRepeat.join(""), 10)), this.motionRepeat.length > 0 && (e *= parseInt(this.motionRepeat.join(""), 10));
    return e;
  }, dt.prototype = {
    setText: function setText(e, t, n) {
      this.keyBuffer = [e || ""], this.linewise = !!t, this.blockwise = !!n;
    },
    pushText: function pushText(e, t) {
      t && (this.linewise || this.keyBuffer.push("\n"), this.linewise = !0), this.keyBuffer.push(e);
    },
    pushInsertModeChanges: function pushInsertModeChanges(e) {
      this.insertModeChanges.push(st(e));
    },
    pushSearchQuery: function pushSearchQuery(e) {
      this.searchQueries.push(e);
    },
    clear: function clear() {
      this.keyBuffer = [], this.insertModeChanges = [], this.searchQueries = [], this.linewise = !1;
    },
    toString: function toString() {
      return this.keyBuffer.join("");
    }
  }, mt.prototype = {
    pushText: function pushText(e, t, n, r, i) {
      if (e === "_") return;
      r && n.charAt(n.length - 1) !== "\n" && (n += "\n");
      var s = this.isValidRegister(e) ? this.getRegister(e) : null;

      if (!s) {
        switch (t) {
          case "yank":
            this.registers[0] = new dt(n, r, i);
            break;

          case "delete":
          case "change":
            n.indexOf("\n") == -1 ? this.registers["-"] = new dt(n, r) : (this.shiftNumericRegisters_(), this.registers[1] = new dt(n, r));
        }

        this.unnamedRegister.setText(n, r, i);
        return;
      }

      var o = Q(e);
      o ? s.pushText(n, r) : s.setText(n, r, i), this.unnamedRegister.setText(s.toString(), r);
    },
    getRegister: function getRegister(e) {
      return this.isValidRegister(e) ? (e = e.toLowerCase(), this.registers[e] || (this.registers[e] = new dt()), this.registers[e]) : this.unnamedRegister;
    },
    isValidRegister: function isValidRegister(e) {
      return e && Z(e, z);
    },
    shiftNumericRegisters_: function shiftNumericRegisters_() {
      for (var e = 9; e >= 2; e--) {
        this.registers[e] = this.getRegister("" + (e - 1));
      }
    }
  }, gt.prototype = {
    nextMatch: function nextMatch(e, t) {
      var n = this.historyBuffer,
          r = t ? -1 : 1;
      this.initialPrefix === null && (this.initialPrefix = e);

      for (var i = this.iterator + r; t ? i >= 0 : i < n.length; i += r) {
        var s = n[i];

        for (var o = 0; o <= s.length; o++) {
          if (this.initialPrefix == s.substring(0, o)) return this.iterator = i, s;
        }
      }

      if (i >= n.length) return this.iterator = n.length, this.initialPrefix;
      if (i < 0) return e;
    },
    pushInput: function pushInput(e) {
      var t = this.historyBuffer.indexOf(e);
      t > -1 && this.historyBuffer.splice(t, 1), e.length && this.historyBuffer.push(e);
    },
    reset: function reset() {
      this.initialPrefix = null, this.iterator = this.historyBuffer.length;
    }
  };
  var yt = {
    matchCommand: function matchCommand(e, t, n, r) {
      var i = At(e, t, r, n);
      if (!i.full && !i.partial) return {
        type: "none"
      };
      if (!i.full && i.partial) return {
        type: "partial"
      };
      var s;

      for (var o = 0; o < i.full.length; o++) {
        var u = i.full[o];
        s || (s = u);
      }

      if (s.keys.slice(-11) == "<character>") {
        var a = Mt(e);
        if (!a || a.length > 1) return {
          type: "clear"
        };
        n.selectedCharacter = a;
      }

      return {
        type: "full",
        command: s
      };
    },
    processCommand: function processCommand(e, t, n) {
      t.inputState.repeatOverride = n.repeatOverride;

      switch (n.type) {
        case "motion":
          this.processMotion(e, t, n);
          break;

        case "operator":
          this.processOperator(e, t, n);
          break;

        case "operatorMotion":
          this.processOperatorMotion(e, t, n);
          break;

        case "action":
          this.processAction(e, t, n);
          break;

        case "search":
          this.processSearch(e, t, n);
          break;

        case "ex":
        case "keyToEx":
          this.processEx(e, t, n);
          break;

        default:
      }
    },
    processMotion: function processMotion(e, t, n) {
      t.inputState.motion = n.motion, t.inputState.motionArgs = kt(n.motionArgs), this.evalInput(e, t);
    },
    processOperator: function processOperator(e, t, n) {
      var r = t.inputState;

      if (r.operator) {
        if (r.operator == n.operator) {
          r.motion = "expandToLine", r.motionArgs = {
            linewise: !0
          }, this.evalInput(e, t);
          return;
        }

        pt(e);
      }

      r.operator = n.operator, r.operatorArgs = kt(n.operatorArgs), n.keys.length > 1 && (r.operatorShortcut = n.keys), n.exitVisualBlock && (t.visualBlock = !1, Kt(e)), t.visualMode && this.evalInput(e, t);
    },
    processOperatorMotion: function processOperatorMotion(e, t, n) {
      var r = t.visualMode,
          i = kt(n.operatorMotionArgs);
      i && r && i.visualLine && (t.visualLine = !0), this.processOperator(e, t, n), r || this.processMotion(e, t, n);
    },
    processAction: function processAction(e, t, n) {
      var r = t.inputState,
          i = r.getRepeat(),
          s = !!i,
          o = kt(n.actionArgs) || {};
      r.selectedCharacter && (o.selectedCharacter = r.selectedCharacter), n.operator && this.processOperator(e, t, n), n.motion && this.processMotion(e, t, n), (n.motion || n.operator) && this.evalInput(e, t), o.repeat = i || 1, o.repeatIsExplicit = s, o.registerName = r.registerName, pt(e), t.lastMotion = null, n.isEdit && this.recordLastEdit(t, r, n), Tt[n.action](e, o, t);
    },
    processSearch: function processSearch(e, t, n) {
      function a(r, i, s) {
        at.searchHistoryController.pushInput(r), at.searchHistoryController.reset();

        try {
          Fn(e, r, i, s);
        } catch (o) {
          Pn(e, "Invalid regex: " + r), pt(e);
          return;
        }

        yt.processMotion(e, t, {
          type: "motion",
          motion: "findNext",
          motionArgs: {
            forward: !0,
            toJumplist: n.searchArgs.toJumplist
          }
        });
      }

      function f(e) {
        a(e, !0, !0);
        var t = at.macroModeState;
        t.isRecording && ir(t, e);
      }

      function l(t, n, i) {
        var s = m.keyName(t),
            o,
            a;
        s == "Up" || s == "Down" ? (o = s == "Up" ? !0 : !1, a = t.target ? t.target.selectionEnd : 0, n = at.searchHistoryController.nextMatch(n, o) || "", i(n), a && t.target && (t.target.selectionEnd = t.target.selectionStart = Math.min(a, t.target.value.length))) : s != "Left" && s != "Right" && s != "Ctrl" && s != "Alt" && s != "Shift" && at.searchHistoryController.reset();
        var f;

        try {
          f = Fn(e, n, !0, !0);
        } catch (t) {}

        f ? e.scrollIntoView(Rn(e, !r, f), 30) : (zn(e), e.scrollTo(u.left, u.top));
      }

      function c(t, n, r) {
        var i = m.keyName(t);
        i == "Esc" || i == "Ctrl-C" || i == "Ctrl-[" || i == "Backspace" && n == "" ? (at.searchHistoryController.pushInput(n), at.searchHistoryController.reset(), Fn(e, o), zn(e), e.scrollTo(u.left, u.top), m.e_stop(t), pt(e), r(), e.focus()) : i == "Up" || i == "Down" ? m.e_stop(t) : i == "Ctrl-U" && (m.e_stop(t), r(""));
      }

      if (!e.getSearchCursor) return;
      var r = n.searchArgs.forward,
          i = n.searchArgs.wholeWordOnly;
      Sn(e).setReversed(!r);
      var s = r ? "/" : "?",
          o = Sn(e).getQuery(),
          u = e.getScrollInfo();

      switch (n.searchArgs.querySrc) {
        case "prompt":
          var h = at.macroModeState;

          if (h.isPlaying) {
            var p = h.replaySearchQueries.shift();
            a(p, !0, !1);
          } else Bn(e, {
            onClose: f,
            prefix: s,
            desc: "(JavaScript regexp)",
            onKeyUp: l,
            onKeyDown: c
          });

          break;

        case "wordUnderCursor":
          var d = nn(e, !1, !0, !1, !0),
              v = !0;
          d || (d = nn(e, !1, !0, !1, !1), v = !1);
          if (!d) return;
          var p = e.getLine(d.start.line).substring(d.start.ch, d.end.ch);
          v && i ? p = "\\b" + p + "\\b" : p = Rt(p), at.jumpList.cachedCursor = e.getCursor(), e.setCursor(d.start), a(p, !0, !1);
      }
    },
    processEx: function processEx(e, t, n) {
      function r(t) {
        at.exCommandHistoryController.pushInput(t), at.exCommandHistoryController.reset(), Qn.processCommand(e, t);
      }

      function i(t, n, r) {
        var i = m.keyName(t),
            s,
            o;
        if (i == "Esc" || i == "Ctrl-C" || i == "Ctrl-[" || i == "Backspace" && n == "") at.exCommandHistoryController.pushInput(n), at.exCommandHistoryController.reset(), m.e_stop(t), pt(e), r(), e.focus();
        i == "Up" || i == "Down" ? (m.e_stop(t), s = i == "Up" ? !0 : !1, o = t.target ? t.target.selectionEnd : 0, n = at.exCommandHistoryController.nextMatch(n, s) || "", r(n), o && t.target && (t.target.selectionEnd = t.target.selectionStart = Math.min(o, t.target.value.length))) : i == "Ctrl-U" ? (m.e_stop(t), r("")) : i != "Left" && i != "Right" && i != "Ctrl" && i != "Alt" && i != "Shift" && at.exCommandHistoryController.reset();
      }

      n.type == "keyToEx" ? Qn.processCommand(e, n.exArgs.input) : t.visualMode ? Bn(e, {
        onClose: r,
        prefix: ":",
        value: "'<,'>",
        onKeyDown: i,
        selectValueOnOpen: !1
      }) : Bn(e, {
        onClose: r,
        prefix: ":",
        onKeyDown: i
      });
    },
    evalInput: function evalInput(e, t) {
      var n = t.inputState,
          r = n.motion,
          i = n.motionArgs || {},
          s = n.operator,
          o = n.operatorArgs || {},
          u = n.registerName,
          a = t.sel,
          f = Dt(t.visualMode ? Ct(e, a.head) : e.getCursor("head")),
          l = Dt(t.visualMode ? Ct(e, a.anchor) : e.getCursor("anchor")),
          c = Dt(f),
          h = Dt(l),
          p,
          d,
          v;
      s && this.recordLastEdit(t, n), n.repeatOverride !== undefined ? v = n.repeatOverride : v = n.getRepeat();
      if (v > 0 && i.explicitRepeat) i.repeatIsExplicit = !0;else if (i.noRepeat || !i.explicitRepeat && v === 0) v = 1, i.repeatIsExplicit = !1;
      n.selectedCharacter && (i.selectedCharacter = o.selectedCharacter = n.selectedCharacter), i.repeat = v, pt(e);

      if (r) {
        var m = bt[r](e, f, i, t, n);
        t.lastMotion = bt[r];
        if (!m) return;

        if (i.toJumplist) {
          !s && e.ace.curOp != null && (e.ace.curOp.command.scrollIntoView = "center-animate");
          var g = at.jumpList,
              y = g.cachedCursor;
          y ? (sn(e, y, m), delete g.cachedCursor) : sn(e, f, m);
        }

        m instanceof Array ? (d = m[0], p = m[1]) : p = m, p || (p = Dt(f));

        if (t.visualMode) {
          if (!t.visualBlock || p.ch !== Infinity) p = Ct(e, p);
          d && (d = Ct(e, d)), d = d || h, a.anchor = d, a.head = p, Kt(e), vn(e, t, "<", Ht(d, p) ? d : p), vn(e, t, ">", Ht(d, p) ? p : d);
        } else s || (p = Ct(e, p), e.setCursor(p.line, p.ch));
      }

      if (s) {
        if (o.lastSel) {
          d = h;
          var b = o.lastSel,
              E = Math.abs(b.head.line - b.anchor.line),
              S = Math.abs(b.head.ch - b.anchor.ch);
          b.visualLine ? p = new w(h.line + E, h.ch) : b.visualBlock ? p = new w(h.line + E, h.ch + S) : b.head.line == b.anchor.line ? p = new w(h.line, h.ch + S) : p = new w(h.line + E, h.ch), t.visualMode = !0, t.visualLine = b.visualLine, t.visualBlock = b.visualBlock, a = t.sel = {
            anchor: d,
            head: p
          }, Kt(e);
        } else t.visualMode && (o.lastSel = {
          anchor: Dt(a.anchor),
          head: Dt(a.head),
          visualBlock: t.visualBlock,
          visualLine: t.visualLine
        });

        var x, T, N, C, k;

        if (t.visualMode) {
          x = Bt(a.head, a.anchor), T = jt(a.head, a.anchor), N = t.visualLine || o.linewise, C = t.visualBlock ? "block" : N ? "line" : "char", k = Qt(e, {
            anchor: x,
            head: T
          }, C);

          if (N) {
            var L = k.ranges;
            if (C == "block") for (var A = 0; A < L.length; A++) {
              L[A].head.ch = It(e, L[A].head.line);
            } else C == "line" && (L[0].head = new w(L[0].head.line + 1, 0));
          }
        } else {
          x = Dt(d || h), T = Dt(p || c);

          if (Ht(T, x)) {
            var O = x;
            x = T, T = O;
          }

          N = i.linewise || o.linewise, N ? en(e, x, T) : i.forward && Zt(e, x, T), C = "char";
          var M = !i.inclusive || N;
          k = Qt(e, {
            anchor: x,
            head: T
          }, C, M);
        }

        e.setSelections(k.ranges, k.primary), t.lastMotion = null, o.repeat = v, o.registerName = u, o.linewise = N;

        var _ = St[s](e, o, k.ranges, h, p);

        t.visualMode && Yt(e, _ != null), _ && e.setCursor(_);
      }
    },
    recordLastEdit: function recordLastEdit(e, t, n) {
      var r = at.macroModeState;
      if (r.isPlaying) return;
      e.lastEditInputState = t, e.lastEditActionCommand = n, r.lastInsertModeChanges.changes = [], r.lastInsertModeChanges.expectCursorActivityForChange = !1, r.lastInsertModeChanges.visualBlock = e.visualBlock ? e.sel.head.line - e.sel.anchor.line : 0;
    }
  },
      bt = {
    moveToTopLine: function moveToTopLine(e, t, n) {
      var r = Xn(e).top + n.repeat - 1;
      return new w(r, tn(e.getLine(r)));
    },
    moveToMiddleLine: function moveToMiddleLine(e) {
      var t = Xn(e),
          n = Math.floor((t.top + t.bottom) * .5);
      return new w(n, tn(e.getLine(n)));
    },
    moveToBottomLine: function moveToBottomLine(e, t, n) {
      var r = Xn(e).bottom - n.repeat + 1;
      return new w(r, tn(e.getLine(r)));
    },
    expandToLine: function expandToLine(e, t, n) {
      var r = t;
      return new w(r.line + n.repeat - 1, Infinity);
    },
    findNext: function findNext(e, t, n) {
      var r = Sn(e),
          i = r.getQuery();
      if (!i) return;
      var s = !n.forward;
      return s = r.isReversed() ? !s : s, qn(e, i), Rn(e, s, i, n.repeat);
    },
    findAndSelectNextInclusive: function findAndSelectNextInclusive(e, t, n, r, i) {
      var s = Sn(e),
          o = s.getQuery();
      if (!o) return;
      var u = !n.forward;
      u = s.isReversed() ? !u : u;
      var a = Un(e, u, o, n.repeat, r);
      if (!a) return;
      if (i.operator) return a;
      var f = a[0],
          l = new w(a[1].line, a[1].ch - 1);

      if (r.visualMode) {
        if (r.visualLine || r.visualBlock) r.visualLine = !1, r.visualBlock = !1, m.signal(e, "vim-mode-change", {
          mode: "visual",
          subMode: ""
        });
        var c = r.sel.anchor;
        if (c) return s.isReversed() ? n.forward ? [c, f] : [c, l] : n.forward ? [c, l] : [c, f];
      } else r.visualMode = !0, r.visualLine = !1, r.visualBlock = !1, m.signal(e, "vim-mode-change", {
        mode: "visual",
        subMode: ""
      });

      return u ? [l, f] : [f, l];
    },
    goToMark: function goToMark(e, t, n, r) {
      var i = Vn(e, r, n.selectedCharacter);
      return i ? n.linewise ? {
        line: i.line,
        ch: tn(e.getLine(i.line))
      } : i : null;
    },
    moveToOtherHighlightedEnd: function moveToOtherHighlightedEnd(e, t, n, r) {
      if (r.visualBlock && n.sameLine) {
        var i = r.sel;
        return [Ct(e, new w(i.anchor.line, i.head.ch)), Ct(e, new w(i.head.line, i.anchor.ch))];
      }

      return [r.sel.head, r.sel.anchor];
    },
    jumpToMark: function jumpToMark(e, t, n, r) {
      var i = t;

      for (var s = 0; s < n.repeat; s++) {
        var o = i;

        for (var u in r.marks) {
          if (!$(u)) continue;
          var a = r.marks[u].find(),
              f = n.forward ? Ht(a, o) : Ht(o, a);
          if (f) continue;
          if (n.linewise && a.line == o.line) continue;
          var l = Pt(o, i),
              c = n.forward ? Ft(o, a, i) : Ft(i, a, o);
          if (l || c) i = a;
        }
      }

      return n.linewise && (i = new w(i.line, tn(e.getLine(i.line)))), i;
    },
    moveByCharacters: function moveByCharacters(e, t, n) {
      var r = t,
          i = n.repeat,
          s = n.forward ? r.ch + i : r.ch - i;
      return new w(r.line, s);
    },
    moveByLines: function moveByLines(e, t, n, r) {
      var i = t,
          s = i.ch;

      switch (r.lastMotion) {
        case this.moveByLines:
        case this.moveByDisplayLines:
        case this.moveByScroll:
        case this.moveToColumn:
        case this.moveToEol:
          s = r.lastHPos;
          break;

        default:
          r.lastHPos = s;
      }

      var o = n.repeat + (n.repeatOffset || 0),
          u = n.forward ? i.line + o : i.line - o,
          a = e.firstLine(),
          f = e.lastLine();
      if (u < a && i.line == a) return this.moveToStartOfLine(e, t, n, r);
      if (u > f && i.line == f) return hn(e, t, n, r, !0);
      var l = e.ace.session.getFoldLine(u);
      return l && (n.forward ? u > l.start.row && (u = l.end.row + 1) : u = l.start.row), n.toFirstChar && (s = tn(e.getLine(u)), r.lastHPos = s), r.lastHSPos = e.charCoords(new w(u, s), "div").left, new w(u, s);
    },
    moveByDisplayLines: function moveByDisplayLines(e, t, n, r) {
      var i = t;

      switch (r.lastMotion) {
        case this.moveByDisplayLines:
        case this.moveByScroll:
        case this.moveByLines:
        case this.moveToColumn:
        case this.moveToEol:
          break;

        default:
          r.lastHSPos = e.charCoords(i, "div").left;
      }

      var s = n.repeat,
          o = e.findPosV(i, n.forward ? s : -s, "line", r.lastHSPos);
      if (o.hitSide) if (n.forward) var u = e.charCoords(o, "div"),
          a = {
        top: u.top + 8,
        left: r.lastHSPos
      },
          o = e.coordsChar(a, "div");else {
        var f = e.charCoords(new w(e.firstLine(), 0), "div");
        f.left = r.lastHSPos, o = e.coordsChar(f, "div");
      }
      return r.lastHPos = o.ch, o;
    },
    moveByPage: function moveByPage(e, t, n) {
      var r = t,
          i = n.repeat;
      return e.findPosV(r, n.forward ? i : -i, "page");
    },
    moveByParagraph: function moveByParagraph(e, t, n) {
      var r = n.forward ? 1 : -1;
      return gn(e, t, n.repeat, r);
    },
    moveBySentence: function moveBySentence(e, t, n) {
      var r = n.forward ? 1 : -1;
      return yn(e, t, n.repeat, r);
    },
    moveByScroll: function moveByScroll(e, t, n, r) {
      var i = e.getScrollInfo(),
          s = null,
          o = n.repeat;
      o || (o = i.clientHeight / (2 * e.defaultTextHeight()));
      var u = e.charCoords(t, "local");
      n.repeat = o;
      var s = bt.moveByDisplayLines(e, t, n, r);
      if (!s) return null;
      var a = e.charCoords(s, "local");
      return e.scrollTo(null, i.top + a.top - u.top), s;
    },
    moveByWords: function moveByWords(e, t, n) {
      return cn(e, t, n.repeat, !!n.forward, !!n.wordEnd, !!n.bigWord);
    },
    moveTillCharacter: function moveTillCharacter(e, t, n) {
      var r = n.repeat,
          i = pn(e, r, n.forward, n.selectedCharacter),
          s = n.forward ? -1 : 1;
      return on(s, n), i ? (i.ch += s, i) : null;
    },
    moveToCharacter: function moveToCharacter(e, t, n) {
      var r = n.repeat;
      return on(0, n), pn(e, r, n.forward, n.selectedCharacter) || t;
    },
    moveToSymbol: function moveToSymbol(e, t, n) {
      var r = n.repeat;
      return fn(e, r, n.forward, n.selectedCharacter) || t;
    },
    moveToColumn: function moveToColumn(e, t, n, r) {
      var i = n.repeat;
      return r.lastHPos = i - 1, r.lastHSPos = e.charCoords(t, "div").left, dn(e, i);
    },
    moveToEol: function moveToEol(e, t, n, r) {
      return hn(e, t, n, r, !1);
    },
    moveToFirstNonWhiteSpaceCharacter: function moveToFirstNonWhiteSpaceCharacter(e, t) {
      var n = t;
      return new w(n.line, tn(e.getLine(n.line)));
    },
    moveToMatchedSymbol: function moveToMatchedSymbol(e, t) {
      var n = t,
          r = n.line,
          i = n.ch,
          s = e.getLine(r),
          o;

      for (; i < s.length; i++) {
        o = s.charAt(i);

        if (o && J(o)) {
          var u = e.getTokenTypeAt(new w(r, i + 1));
          if (u !== "string" && u !== "comment") break;
        }
      }

      if (i < s.length) {
        var a = /[<>]/.test(s[i]) ? /[(){}[\]<>]/ : /[(){}[\]]/,
            f = e.findMatchingBracket(new w(r, i + 1), {
          bracketRegex: a
        });
        return f.to;
      }

      return n;
    },
    moveToStartOfLine: function moveToStartOfLine(e, t) {
      return new w(t.line, 0);
    },
    moveToLineOrEdgeOfDocument: function moveToLineOrEdgeOfDocument(e, t, n) {
      var r = n.forward ? e.lastLine() : e.firstLine();
      return n.repeatIsExplicit && (r = n.repeat - e.getOption("firstLineNumber")), new w(r, tn(e.getLine(r)));
    },
    moveToStartOfDisplayLine: function moveToStartOfDisplayLine(e) {
      return e.execCommand("goLineLeft"), e.getCursor();
    },
    moveToEndOfDisplayLine: function moveToEndOfDisplayLine(e) {
      e.execCommand("goLineRight");
      var t = e.getCursor();
      return t.sticky == "before" && t.ch--, t;
    },
    textObjectManipulation: function textObjectManipulation(e, t, n, r) {
      var i = {
        "(": ")",
        ")": "(",
        "{": "}",
        "}": "{",
        "[": "]",
        "]": "[",
        "<": ">",
        ">": "<"
      },
          s = {
        "'": !0,
        '"': !0,
        "`": !0
      },
          o = n.selectedCharacter;
      o == "b" ? o = "(" : o == "B" && (o = "{");
      var u = !n.textObjectInner,
          a;
      if (i[o]) a = bn(e, t, o, u);else if (s[o]) a = wn(e, t, o, u);else if (o === "W") a = nn(e, u, !0, !0);else if (o === "w") a = nn(e, u, !0, !1);else if (o === "p") {
        a = gn(e, t, n.repeat, 0, u), n.linewise = !0;
        if (r.visualMode) r.visualLine || (r.visualLine = !0);else {
          var f = r.inputState.operatorArgs;
          f && (f.linewise = !0), a.end.line--;
        }
      } else {
        if (o !== "t") return null;
        a = rn(e, t, u);
      }
      return e.state.vim.visualMode ? Jt(e, a.start, a.end) : [a.start, a.end];
    },
    repeatLastCharacterSearch: function repeatLastCharacterSearch(e, t, n) {
      var r = at.lastCharacterSearch,
          i = n.repeat,
          s = n.forward === r.forward,
          o = (r.increment ? 1 : 0) * (s ? -1 : 1);
      e.moveH(-o, "char"), n.inclusive = s ? !0 : !1;
      var u = pn(e, i, s, r.selectedCharacter);
      return u ? (u.ch += o, u) : (e.moveH(o, "char"), t);
    }
  },
      St = {
    change: function change(e, t, n) {
      var r,
          i,
          s = e.state.vim,
          o = n[0].anchor,
          u = n[0].head;

      if (!s.visualMode) {
        i = e.getRange(o, u);
        var a = s.lastEditInputState || {};

        if (a.motion == "moveByWords" && !G(i)) {
          var f = /\s+$/.exec(i);
          f && a.motionArgs && a.motionArgs.forward && (u = Lt(u, 0, -f[0].length), i = i.slice(0, -f[0].length));
        }

        var l = new w(o.line - 1, Number.MAX_VALUE),
            c = e.firstLine() == e.lastLine();
        u.line > e.lastLine() && t.linewise && !c ? e.replaceRange("", l, u) : e.replaceRange("", o, u), t.linewise && (c || (e.setCursor(l), m.commands.newlineAndIndent(e)), o.ch = Number.MAX_VALUE), r = o;
      } else if (t.fullLine) u.ch = Number.MAX_VALUE, u.line--, e.setSelection(o, u), i = e.getSelection(), e.replaceSelection(""), r = o;else {
        i = e.getSelection();
        var h = Et("", n.length);
        e.replaceSelections(h), r = Bt(n[0].head, n[0].anchor);
      }

      at.registerController.pushText(t.registerName, "change", i, t.linewise, n.length > 1), Tt.enterInsertMode(e, {
        head: r
      }, e.state.vim);
    },
    "delete": function _delete(e, t, n) {
      var r,
          i,
          s = e.state.vim;

      if (!s.visualBlock) {
        var o = n[0].anchor,
            u = n[0].head;
        t.linewise && u.line != e.firstLine() && o.line == e.lastLine() && o.line == u.line - 1 && (o.line == e.firstLine() ? o.ch = 0 : o = new w(o.line - 1, It(e, o.line - 1))), i = e.getRange(o, u), e.replaceRange("", o, u), r = o, t.linewise && (r = bt.moveToFirstNonWhiteSpaceCharacter(e, o));
      } else {
        i = e.getSelection();
        var a = Et("", n.length);
        e.replaceSelections(a), r = Bt(n[0].head, n[0].anchor);
      }

      return at.registerController.pushText(t.registerName, "delete", i, t.linewise, s.visualBlock), Ct(e, r);
    },
    indent: function indent(e, t, n) {
      var r = e.state.vim,
          i = n[0].anchor.line,
          s = r.visualBlock ? n[n.length - 1].anchor.line : n[0].head.line,
          o = r.visualMode ? t.repeat : 1;
      t.linewise && s--;

      for (var u = i; u <= s; u++) {
        for (var a = 0; a < o; a++) {
          e.indentLine(u, t.indentRight);
        }
      }

      return bt.moveToFirstNonWhiteSpaceCharacter(e, n[0].anchor);
    },
    indentAuto: function indentAuto(e, t, n) {
      return n.length > 1 && e.setSelection(n[0].anchor, n[n.length - 1].head), e.execCommand("indentAuto"), bt.moveToFirstNonWhiteSpaceCharacter(e, n[0].anchor);
    },
    changeCase: function changeCase(e, t, n, r, i) {
      var s = e.getSelections(),
          o = [],
          u = t.toLower;

      for (var a = 0; a < s.length; a++) {
        var f = s[a],
            l = "";
        if (u === !0) l = f.toLowerCase();else if (u === !1) l = f.toUpperCase();else for (var c = 0; c < f.length; c++) {
          var h = f.charAt(c);
          l += Q(h) ? h.toLowerCase() : h.toUpperCase();
        }
        o.push(l);
      }

      return e.replaceSelections(o), t.shouldMoveCursor ? i : !e.state.vim.visualMode && t.linewise && n[0].anchor.line + 1 == n[0].head.line ? bt.moveToFirstNonWhiteSpaceCharacter(e, r) : t.linewise ? r : Bt(n[0].anchor, n[0].head);
    },
    yank: function yank(e, t, n, r) {
      var i = e.state.vim,
          s = e.getSelection(),
          o = i.visualMode ? Bt(i.sel.anchor, i.sel.head, n[0].head, n[0].anchor) : r;
      return at.registerController.pushText(t.registerName, "yank", s, t.linewise, i.visualBlock), o;
    }
  },
      Tt = {
    jumpListWalk: function jumpListWalk(e, t, n) {
      if (n.visualMode) return;
      var r = t.repeat,
          i = t.forward,
          s = at.jumpList,
          o = s.move(e, i ? r : -r),
          u = o ? o.find() : undefined;
      u = u ? u : e.getCursor(), e.setCursor(u), e.ace.curOp.command.scrollIntoView = "center-animate";
    },
    scroll: function scroll(e, t, n) {
      if (n.visualMode) return;
      var r = t.repeat || 1,
          i = e.defaultTextHeight(),
          s = e.getScrollInfo().top,
          o = i * r,
          u = t.forward ? s + o : s - o,
          a = Dt(e.getCursor()),
          f = e.charCoords(a, "local");
      if (t.forward) u > f.top ? (a.line += (u - f.top) / i, a.line = Math.ceil(a.line), e.setCursor(a), f = e.charCoords(a, "local"), e.scrollTo(null, f.top)) : e.scrollTo(null, u);else {
        var l = u + e.getScrollInfo().clientHeight;
        l < f.bottom ? (a.line -= (f.bottom - l) / i, a.line = Math.floor(a.line), e.setCursor(a), f = e.charCoords(a, "local"), e.scrollTo(null, f.bottom - e.getScrollInfo().clientHeight)) : e.scrollTo(null, u);
      }
    },
    scrollToCursor: function scrollToCursor(e, t) {
      var n = e.getCursor().line,
          r = e.charCoords(new w(n, 0), "local"),
          i = e.getScrollInfo().clientHeight,
          s = r.top,
          o = r.bottom - s;

      switch (t.position) {
        case "center":
          s = s - i / 2 + o;
          break;

        case "bottom":
          s = s - i + o;
      }

      e.scrollTo(null, s);
    },
    replayMacro: function replayMacro(e, t, n) {
      var r = t.selectedCharacter,
          i = t.repeat,
          s = at.macroModeState;
      r == "@" ? r = s.latestRegister : s.latestRegister = r;

      while (i--) {
        tr(e, n, s, r);
      }
    },
    enterMacroRecordMode: function enterMacroRecordMode(e, t) {
      var n = at.macroModeState,
          r = t.selectedCharacter;
      at.registerController.isValidRegister(r) && n.enterMacroRecordMode(e, r);
    },
    toggleOverwrite: function toggleOverwrite(e) {
      e.state.overwrite ? (e.toggleOverwrite(!1), e.setOption("keyMap", "vim-insert"), m.signal(e, "vim-mode-change", {
        mode: "insert"
      })) : (e.toggleOverwrite(!0), e.setOption("keyMap", "vim-replace"), m.signal(e, "vim-mode-change", {
        mode: "replace"
      }));
    },
    enterInsertMode: function enterInsertMode(e, t, n) {
      if (e.getOption("readOnly")) return;
      n.insertMode = !0, n.insertModeRepeat = t && t.repeat || 1;
      var r = t ? t.insertAt : null,
          i = n.sel,
          s = t.head || e.getCursor("head"),
          o = e.listSelections().length;
      if (r == "eol") s = new w(s.line, It(e, s.line));else if (r == "bol") s = new w(s.line, 0);else if (r == "charAfter") s = Lt(s, 0, 1);else if (r == "firstNonBlank") s = bt.moveToFirstNonWhiteSpaceCharacter(e, s);else if (r == "startOfSelectedArea") {
        if (!n.visualMode) return;
        n.visualBlock ? (s = new w(Math.min(i.head.line, i.anchor.line), Math.min(i.head.ch, i.anchor.ch)), o = Math.abs(i.head.line - i.anchor.line) + 1) : i.head.line < i.anchor.line ? s = i.head : s = new w(i.anchor.line, 0);
      } else if (r == "endOfSelectedArea") {
        if (!n.visualMode) return;
        n.visualBlock ? (s = new w(Math.min(i.head.line, i.anchor.line), Math.max(i.head.ch, i.anchor.ch) + 1), o = Math.abs(i.head.line - i.anchor.line) + 1) : i.head.line >= i.anchor.line ? s = Lt(i.head, 0, 1) : s = new w(i.anchor.line, 0);
      } else if (r == "inplace") {
        if (n.visualMode) return;
      } else r == "lastEdit" && (s = $n(e) || s);
      e.setOption("disableInput", !1), t && t.replace ? (e.toggleOverwrite(!0), e.setOption("keyMap", "vim-replace"), m.signal(e, "vim-mode-change", {
        mode: "replace"
      })) : (e.toggleOverwrite(!1), e.setOption("keyMap", "vim-insert"), m.signal(e, "vim-mode-change", {
        mode: "insert"
      })), at.macroModeState.isPlaying || (e.on("change", sr), m.on(e.getInputField(), "keydown", fr)), n.visualMode && Yt(e), Wt(e, s, o);
    },
    toggleVisualMode: function toggleVisualMode(e, t, n) {
      var r = t.repeat,
          i = e.getCursor(),
          s;
      n.visualMode ? n.visualLine ^ t.linewise || n.visualBlock ^ t.blockwise ? (n.visualLine = !!t.linewise, n.visualBlock = !!t.blockwise, m.signal(e, "vim-mode-change", {
        mode: "visual",
        subMode: n.visualLine ? "linewise" : n.visualBlock ? "blockwise" : ""
      }), Kt(e)) : Yt(e) : (n.visualMode = !0, n.visualLine = !!t.linewise, n.visualBlock = !!t.blockwise, s = Ct(e, new w(i.line, i.ch + r - 1)), n.sel = {
        anchor: i,
        head: s
      }, m.signal(e, "vim-mode-change", {
        mode: "visual",
        subMode: n.visualLine ? "linewise" : n.visualBlock ? "blockwise" : ""
      }), Kt(e), vn(e, n, "<", Bt(i, s)), vn(e, n, ">", jt(i, s)));
    },
    reselectLastSelection: function reselectLastSelection(e, t, n) {
      var r = n.lastSelection;
      n.visualMode && $t(e, n);

      if (r) {
        var i = r.anchorMark.find(),
            s = r.headMark.find();
        if (!i || !s) return;
        n.sel = {
          anchor: i,
          head: s
        }, n.visualMode = !0, n.visualLine = r.visualLine, n.visualBlock = r.visualBlock, Kt(e), vn(e, n, "<", Bt(i, s)), vn(e, n, ">", jt(i, s)), m.signal(e, "vim-mode-change", {
          mode: "visual",
          subMode: n.visualLine ? "linewise" : n.visualBlock ? "blockwise" : ""
        });
      }
    },
    joinLines: function joinLines(e, t, n) {
      var r, i;

      if (n.visualMode) {
        r = e.getCursor("anchor"), i = e.getCursor("head");

        if (Ht(i, r)) {
          var s = i;
          i = r, r = s;
        }

        i.ch = It(e, i.line) - 1;
      } else {
        var o = Math.max(t.repeat, 2);
        r = e.getCursor(), i = Ct(e, new w(r.line + o - 1, Infinity));
      }

      var u = 0;

      for (var a = r.line; a < i.line; a++) {
        u = It(e, r.line);
        var s = new w(r.line + 1, It(e, r.line + 1)),
            f = e.getRange(r, s);
        f = t.keepSpaces ? f.replace(/\n\r?/g, "") : f.replace(/\n\s*/g, " "), e.replaceRange(f, r, s);
      }

      var l = new w(r.line, u);
      n.visualMode && Yt(e, !1), e.setCursor(l);
    },
    newLineAndEnterInsertMode: function newLineAndEnterInsertMode(e, t, n) {
      n.insertMode = !0;
      var r = Dt(e.getCursor());
      if (r.line === e.firstLine() && !t.after) e.replaceRange("\n", new w(e.firstLine(), 0)), e.setCursor(e.firstLine(), 0);else {
        r.line = t.after ? r.line : r.line - 1, r.ch = It(e, r.line), e.setCursor(r);
        var i = m.commands.newlineAndIndentContinueComment || m.commands.newlineAndIndent;
        i(e);
      }
      this.enterInsertMode(e, {
        repeat: t.repeat
      }, n);
    },
    paste: function paste(e, t, n) {
      var r = Dt(e.getCursor()),
          i = at.registerController.getRegister(t.registerName),
          s = i.toString();
      if (!s) return;

      if (t.matchIndent) {
        var o = e.getOption("tabSize"),
            u = function u(e) {
          var t = e.split("	").length - 1,
              n = e.split(" ").length - 1;
          return t * o + n * 1;
        },
            a = e.getLine(e.getCursor().line),
            f = u(a.match(/^\s*/)[0]),
            l = s.replace(/\n$/, ""),
            c = s !== l,
            h = u(s.match(/^\s*/)[0]),
            s = l.replace(/^\s*/gm, function (t) {
          var n = f + (u(t) - h);
          if (n < 0) return "";

          if (e.getOption("indentWithTabs")) {
            var r = Math.floor(n / o);
            return Array(r + 1).join("	");
          }

          return Array(n + 1).join(" ");
        });

        s += c ? "\n" : "";
      }

      if (t.repeat > 1) var s = Array(t.repeat + 1).join(s);
      var p = i.linewise,
          d = i.blockwise;

      if (d) {
        s = s.split("\n"), p && s.pop();

        for (var v = 0; v < s.length; v++) {
          s[v] = s[v] == "" ? " " : s[v];
        }

        r.ch += t.after ? 1 : 0, r.ch = Math.min(It(e, r.line), r.ch);
      } else p ? n.visualMode ? s = n.visualLine ? s.slice(0, -1) : "\n" + s.slice(0, s.length - 1) + "\n" : t.after ? (s = "\n" + s.slice(0, s.length - 1), r.ch = It(e, r.line)) : r.ch = 0 : r.ch += t.after ? 1 : 0;

      var m, g;

      if (n.visualMode) {
        n.lastPastedText = s;
        var y,
            b = Vt(e, n),
            E = b[0],
            S = b[1],
            x = e.getSelection(),
            T = e.listSelections(),
            N = new Array(T.length).join("1").split("1");
        n.lastSelection && (y = n.lastSelection.headMark.find()), at.registerController.unnamedRegister.setText(x), d ? (e.replaceSelections(N), S = new w(E.line + s.length - 1, E.ch), e.setCursor(E), zt(e, S), e.replaceSelections(s), m = E) : n.visualBlock ? (e.replaceSelections(N), e.setCursor(E), e.replaceRange(s, E, E), m = E) : (e.replaceRange(s, E, S), m = e.posFromIndex(e.indexFromPos(E) + s.length - 1)), y && (n.lastSelection.headMark = e.setBookmark(y)), p && (m.ch = 0);
      } else if (d) {
        e.setCursor(r);

        for (var v = 0; v < s.length; v++) {
          var C = r.line + v;
          C > e.lastLine() && e.replaceRange("\n", new w(C, 0));
          var k = It(e, C);
          k < r.ch && Ut(e, C, r.ch);
        }

        e.setCursor(r), zt(e, new w(r.line + s.length - 1, r.ch)), e.replaceSelections(s), m = r;
      } else e.replaceRange(s, r), p && t.after ? m = new w(r.line + 1, tn(e.getLine(r.line + 1))) : p && !t.after ? m = new w(r.line, tn(e.getLine(r.line))) : !p && t.after ? (g = e.indexFromPos(r), m = e.posFromIndex(g + s.length - 1)) : (g = e.indexFromPos(r), m = e.posFromIndex(g + s.length));

      n.visualMode && Yt(e, !1), e.setCursor(m);
    },
    undo: function undo(e, t) {
      e.operation(function () {
        _t(e, m.commands.undo, t.repeat)(), e.setCursor(e.getCursor("anchor"));
      });
    },
    redo: function redo(e, t) {
      _t(e, m.commands.redo, t.repeat)();
    },
    setRegister: function setRegister(e, t, n) {
      n.inputState.registerName = t.selectedCharacter;
    },
    setMark: function setMark(e, t, n) {
      var r = t.selectedCharacter;
      vn(e, n, r, e.getCursor());
    },
    replace: function replace(e, t, n) {
      var r = t.selectedCharacter,
          i = e.getCursor(),
          s,
          o,
          u = e.listSelections();
      if (n.visualMode) i = e.getCursor("start"), o = e.getCursor("end");else {
        var a = e.getLine(i.line);
        s = i.ch + t.repeat, s > a.length && (s = a.length), o = new w(i.line, s);
      }
      if (r == "\n") n.visualMode || e.replaceRange("", i, o), (m.commands.newlineAndIndentContinueComment || m.commands.newlineAndIndent)(e);else {
        var f = e.getRange(i, o);
        f = f.replace(/[^\n]/g, r);

        if (n.visualBlock) {
          var l = new Array(e.getOption("tabSize") + 1).join(" ");
          f = e.getSelection(), f = f.replace(/\t/g, l).replace(/[^\n]/g, r).split("\n"), e.replaceSelections(f);
        } else e.replaceRange(f, i, o);

        n.visualMode ? (i = Ht(u[0].anchor, u[0].head) ? u[0].anchor : u[0].head, e.setCursor(i), Yt(e, !1)) : e.setCursor(Lt(o, 0, -1));
      }
    },
    incrementNumberToken: function incrementNumberToken(e, t) {
      var n = e.getCursor(),
          r = e.getLine(n.line),
          i = /(-?)(?:(0x)([\da-f]+)|(0b|0|)(\d+))/gi,
          s,
          o,
          u,
          a;

      while ((s = i.exec(r)) !== null) {
        o = s.index, u = o + s[0].length;
        if (n.ch < u) break;
      }

      if (!t.backtrack && u <= n.ch) return;
      if (!s) return;
      var f = s[2] || s[4],
          l = s[3] || s[5],
          c = t.increase ? 1 : -1,
          h = {
        "0b": 2,
        0: 8,
        "": 10,
        "0x": 16
      }[f.toLowerCase()],
          p = parseInt(s[1] + l, h) + c * t.repeat;
      a = p.toString(h);
      var d = f ? new Array(l.length - a.length + 1 + s[1].length).join("0") : "";
      a.charAt(0) === "-" ? a = "-" + f + d + a.substr(1) : a = f + d + a;
      var v = new w(n.line, o),
          m = new w(n.line, u);
      e.replaceRange(a, v, m), e.setCursor(new w(n.line, o + a.length - 1));
    },
    repeatLastEdit: function repeatLastEdit(e, t, n) {
      var r = n.lastEditInputState;
      if (!r) return;
      var i = t.repeat;
      i && t.repeatIsExplicit ? n.lastEditInputState.repeatOverride = i : i = n.lastEditInputState.repeatOverride || i, lr(e, n, i, !1);
    },
    indent: function indent(e, t) {
      e.indentLine(e.getCursor().line, t.indentRight);
    },
    exitInsertMode: Yn
  },
      un = {
    "(": "bracket",
    ")": "bracket",
    "{": "bracket",
    "}": "bracket",
    "[": "section",
    "]": "section",
    "*": "comment",
    "/": "comment",
    m: "method",
    M: "method",
    "#": "preprocess"
  },
      an = {
    bracket: {
      isComplete: function isComplete(e) {
        if (e.nextCh === e.symb) {
          e.depth++;
          if (e.depth >= 1) return !0;
        } else e.nextCh === e.reverseSymb && e.depth--;

        return !1;
      }
    },
    section: {
      init: function init(e) {
        e.curMoveThrough = !0, e.symb = (e.forward ? "]" : "[") === e.symb ? "{" : "}";
      },
      isComplete: function isComplete(e) {
        return e.index === 0 && e.nextCh === e.symb;
      }
    },
    comment: {
      isComplete: function isComplete(e) {
        var t = e.lastCh === "*" && e.nextCh === "/";
        return e.lastCh = e.nextCh, t;
      }
    },
    method: {
      init: function init(e) {
        e.symb = e.symb === "m" ? "{" : "}", e.reverseSymb = e.symb === "{" ? "}" : "{";
      },
      isComplete: function isComplete(e) {
        return e.nextCh === e.symb ? !0 : !1;
      }
    },
    preprocess: {
      init: function init(e) {
        e.index = 0;
      },
      isComplete: function isComplete(e) {
        if (e.nextCh === "#") {
          var t = e.lineText.match(/^#(\w+)/)[1];

          if (t === "endif") {
            if (e.forward && e.depth === 0) return !0;
            e.depth++;
          } else if (t === "if") {
            if (!e.forward && e.depth === 0) return !0;
            e.depth--;
          }

          if (t === "else" && e.depth === 0) return !0;
        }

        return !1;
      }
    }
  };
  tt("pcre", !0, "boolean"), En.prototype = {
    getQuery: function getQuery() {
      return at.query;
    },
    setQuery: function setQuery(e) {
      at.query = e;
    },
    getOverlay: function getOverlay() {
      return this.searchOverlay;
    },
    setOverlay: function setOverlay(e) {
      this.searchOverlay = e;
    },
    isReversed: function isReversed() {
      return at.isReversed;
    },
    setReversed: function setReversed(e) {
      at.isReversed = e;
    },
    getScrollbarAnnotate: function getScrollbarAnnotate() {
      return this.annotate;
    },
    setScrollbarAnnotate: function setScrollbarAnnotate(e) {
      this.annotate = e;
    }
  };

  var Ln = {
    "\\n": "\n",
    "\\r": "\r",
    "\\t": "	"
  },
      On = {
    "\\/": "/",
    "\\\\": "\\",
    "\\n": "\n",
    "\\r": "\r",
    "\\t": "	",
    "\\&": "&"
  },
      Jn = function Jn() {
    this.buildCommandMap_();
  };

  Jn.prototype = {
    processCommand: function processCommand(e, t, n) {
      var r = this;
      e.operation(function () {
        e.curOp.isVimOp = !0, r._processCommand(e, t, n);
      });
    },
    _processCommand: function _processCommand(e, t, n) {
      var r = e.state.vim,
          i = at.registerController.getRegister(":"),
          s = i.toString();
      r.visualMode && Yt(e);
      var o = new m.StringStream(t);
      i.setText(t);
      var u = n || {};
      u.input = t;

      try {
        this.parseInput_(e, o, u);
      } catch (a) {
        throw Pn(e, a.toString()), a;
      }

      var f, l;
      if (!u.commandName) u.line !== undefined && (l = "move");else {
        f = this.matchCommand_(u.commandName);

        if (f) {
          l = f.name, f.excludeFromCommandHistory && i.setText(s), this.parseCommandArgs_(o, u, f);

          if (f.type == "exToKey") {
            for (var c = 0; c < f.toKeys.length; c++) {
              ct.handleKey(e, f.toKeys[c], "mapping");
            }

            return;
          }

          if (f.type == "exToEx") {
            this.processCommand(e, f.toInput);
            return;
          }
        }
      }

      if (!l) {
        Pn(e, 'Not an editor command ":' + t + '"');
        return;
      }

      try {
        Kn[l](e, u), (!f || !f.possiblyAsync) && u.callback && u.callback();
      } catch (a) {
        throw Pn(e, a.toString()), a;
      }
    },
    parseInput_: function parseInput_(e, t, n) {
      t.eatWhile(":"), t.eat("%") ? (n.line = e.firstLine(), n.lineEnd = e.lastLine()) : (n.line = this.parseLineSpec_(e, t), n.line !== undefined && t.eat(",") && (n.lineEnd = this.parseLineSpec_(e, t)));
      var r = t.match(/^(\w+|!!|@@|[!#&*<=>@~])/);
      return r ? n.commandName = r[1] : n.commandName = t.match(/.*/)[0], n;
    },
    parseLineSpec_: function parseLineSpec_(e, t) {
      var n = t.match(/^(\d+)/);
      if (n) return parseInt(n[1], 10) - 1;

      switch (t.next()) {
        case ".":
          return this.parseLineSpecOffset_(t, e.getCursor().line);

        case "$":
          return this.parseLineSpecOffset_(t, e.lastLine());

        case "'":
          var r = t.next(),
              i = Vn(e, e.state.vim, r);
          if (!i) throw new Error("Mark not set");
          return this.parseLineSpecOffset_(t, i.line);

        case "-":
        case "+":
          return t.backUp(1), this.parseLineSpecOffset_(t, e.getCursor().line);

        default:
          return t.backUp(1), undefined;
      }
    },
    parseLineSpecOffset_: function parseLineSpecOffset_(e, t) {
      var n = e.match(/^([+-])?(\d+)/);

      if (n) {
        var r = parseInt(n[2], 10);
        n[1] == "-" ? t -= r : t += r;
      }

      return t;
    },
    parseCommandArgs_: function parseCommandArgs_(e, t, n) {
      if (e.eol()) return;
      t.argString = e.match(/.*/)[0];
      var r = n.argDelimiter || /\s+/,
          i = qt(t.argString).split(r);
      i.length && i[0] && (t.args = i);
    },
    matchCommand_: function matchCommand_(e) {
      for (var t = e.length; t > 0; t--) {
        var n = e.substring(0, t);

        if (this.commandMap_[n]) {
          var r = this.commandMap_[n];
          if (r.name.indexOf(e) === 0) return r;
        }
      }

      return null;
    },
    buildCommandMap_: function buildCommandMap_() {
      this.commandMap_ = {};

      for (var e = 0; e < T.length; e++) {
        var t = T[e],
            n = t.shortName || t.name;
        this.commandMap_[n] = t;
      }
    },
    map: function map(e, t, n) {
      if (e != ":" && e.charAt(0) == ":") {
        if (n) throw Error("Mode not supported for ex mappings");
        var r = e.substring(1);
        t != ":" && t.charAt(0) == ":" ? this.commandMap_[r] = {
          name: r,
          type: "exToEx",
          toInput: t.substring(1),
          user: !0
        } : this.commandMap_[r] = {
          name: r,
          type: "exToKey",
          toKeys: t,
          user: !0
        };
      } else if (t != ":" && t.charAt(0) == ":") {
        var i = {
          keys: e,
          type: "keyToEx",
          exArgs: {
            input: t.substring(1)
          }
        };
        n && (i.context = n), S.unshift(i);
      } else {
        var i = {
          keys: e,
          type: "keyToKey",
          toKeys: t
        };
        n && (i.context = n), S.unshift(i);
      }
    },
    unmap: function unmap(e, t) {
      if (e != ":" && e.charAt(0) == ":") {
        if (t) throw Error("Mode not supported for ex mappings");
        var n = e.substring(1);
        if (this.commandMap_[n] && this.commandMap_[n].user) return delete this.commandMap_[n], !0;
      } else {
        var r = e;

        for (var i = 0; i < S.length; i++) {
          if (r == S[i].keys && S[i].context === t) return S.splice(i, 1), !0;
        }
      }
    }
  };
  var Kn = {
    colorscheme: function colorscheme(e, t) {
      if (!t.args || t.args.length < 1) {
        Pn(e, e.getOption("theme"));
        return;
      }

      e.setOption("theme", t.args[0]);
    },
    map: function map(e, t, n) {
      var r = t.args;

      if (!r || r.length < 2) {
        e && Pn(e, "Invalid mapping: " + t.input);
        return;
      }

      Qn.map(r[0], r[1], n);
    },
    imap: function imap(e, t) {
      this.map(e, t, "insert");
    },
    nmap: function nmap(e, t) {
      this.map(e, t, "normal");
    },
    vmap: function vmap(e, t) {
      this.map(e, t, "visual");
    },
    unmap: function unmap(e, t, n) {
      var r = t.args;
      (!r || r.length < 1 || !Qn.unmap(r[0], n)) && e && Pn(e, "No such mapping: " + t.input);
    },
    move: function move(e, t) {
      yt.processCommand(e, e.state.vim, {
        type: "motion",
        motion: "moveToLineOrEdgeOfDocument",
        motionArgs: {
          forward: !1,
          explicitRepeat: !0,
          linewise: !0
        },
        repeatOverride: t.line + 1
      });
    },
    set: function set(e, t) {
      var n = t.args,
          r = t.setCfg || {};

      if (!n || n.length < 1) {
        e && Pn(e, "Invalid mapping: " + t.input);
        return;
      }

      var i = n[0].split("="),
          s = i[0],
          o = i[1],
          u = !1;

      if (s.charAt(s.length - 1) == "?") {
        if (o) throw Error("Trailing characters: " + t.argString);
        s = s.substring(0, s.length - 1), u = !0;
      }

      o === undefined && s.substring(0, 2) == "no" && (s = s.substring(2), o = !1);
      var a = et[s] && et[s].type == "boolean";
      a && o == undefined && (o = !0);

      if (!a && o === undefined || u) {
        var f = rt(s, e, r);
        f instanceof Error ? Pn(e, f.message) : f === !0 || f === !1 ? Pn(e, " " + (f ? "" : "no") + s) : Pn(e, "  " + s + "=" + f);
      } else {
        var l = nt(s, o, e, r);
        l instanceof Error && Pn(e, l.message);
      }
    },
    setlocal: function setlocal(e, t) {
      t.setCfg = {
        scope: "local"
      }, this.set(e, t);
    },
    setglobal: function setglobal(e, t) {
      t.setCfg = {
        scope: "global"
      }, this.set(e, t);
    },
    registers: function registers(e, t) {
      var n = t.args,
          r = at.registerController.registers,
          i = "----------Registers----------\n\n";
      if (!n) for (var s in r) {
        var o = r[s].toString();
        o.length && (i += '"' + s + "    " + o + "\n");
      } else {
        var s;
        n = n.join("");

        for (var u = 0; u < n.length; u++) {
          s = n.charAt(u);
          if (!at.registerController.isValidRegister(s)) continue;
          var a = r[s] || new dt();
          i += '"' + s + "    " + a.toString() + "\n";
        }
      }
      Pn(e, i);
    },
    sort: function sort(e, t) {
      function u() {
        if (t.argString) {
          var e = new m.StringStream(t.argString);
          e.eat("!") && (n = !0);
          if (e.eol()) return;
          if (!e.eatSpace()) return "Invalid arguments";
          var u = e.match(/([dinuox]+)?\s*(\/.+\/)?\s*/);
          if (!u && !e.eol()) return "Invalid arguments";

          if (u[1]) {
            r = u[1].indexOf("i") != -1, i = u[1].indexOf("u") != -1;
            var a = u[1].indexOf("d") != -1 || u[1].indexOf("n") != -1 && 1,
                f = u[1].indexOf("x") != -1 && 1,
                l = u[1].indexOf("o") != -1 && 1;
            if (a + f + l > 1) return "Invalid arguments";
            s = a && "decimal" || f && "hex" || l && "octal";
          }

          u[2] && (o = new RegExp(u[2].substr(1, u[2].length - 2), r ? "i" : ""));
        }
      }

      function S(e, t) {
        if (n) {
          var i;
          i = e, e = t, t = i;
        }

        r && (e = e.toLowerCase(), t = t.toLowerCase());
        var o = s && d.exec(e),
            u = s && d.exec(t);
        return o ? (o = parseInt((o[1] + o[2]).toLowerCase(), v), u = parseInt((u[1] + u[2]).toLowerCase(), v), o - u) : e < t ? -1 : 1;
      }

      function x(e, t) {
        if (n) {
          var i;
          i = e, e = t, t = i;
        }

        return r && (e[0] = e[0].toLowerCase(), t[0] = t[0].toLowerCase()), e[0] < t[0] ? -1 : 1;
      }

      var n,
          r,
          i,
          s,
          o,
          a = u();

      if (a) {
        Pn(e, a + ": " + t.argString);
        return;
      }

      var f = t.line || e.firstLine(),
          l = t.lineEnd || t.line || e.lastLine();
      if (f == l) return;
      var c = new w(f, 0),
          h = new w(l, It(e, l)),
          p = e.getRange(c, h).split("\n"),
          d = o ? o : s == "decimal" ? /(-?)([\d]+)/ : s == "hex" ? /(-?)(?:0x)?([0-9a-f]+)/i : s == "octal" ? /([0-7]+)/ : null,
          v = s == "decimal" ? 10 : s == "hex" ? 16 : s == "octal" ? 8 : null,
          g = [],
          y = [];
      if (s || o) for (var b = 0; b < p.length; b++) {
        var E = o ? p[b].match(o) : null;
        E && E[0] != "" ? g.push(E) : !o && d.exec(p[b]) ? g.push(p[b]) : y.push(p[b]);
      } else y = p;
      g.sort(o ? x : S);
      if (o) for (var b = 0; b < g.length; b++) {
        g[b] = g[b].input;
      } else s || y.sort(S);
      p = n ? g.concat(y) : y.concat(g);

      if (i) {
        var T = p,
            N;
        p = [];

        for (var b = 0; b < T.length; b++) {
          T[b] != N && p.push(T[b]), N = T[b];
        }
      }

      e.replaceRange(p.join("\n"), c, h);
    },
    vglobal: function vglobal(e, t) {
      this.global(e, t);
    },
    global: function global(e, t) {
      var n = t.argString;

      if (!n) {
        Pn(e, "Regular Expression missing from global");
        return;
      }

      var r = t.commandName[0] === "v",
          i = t.line !== undefined ? t.line : e.firstLine(),
          s = t.lineEnd || t.line || e.lastLine(),
          o = xn(n),
          u = n,
          a;
      o.length && (u = o[0], a = o.slice(1, o.length).join("/"));
      if (u) try {
        Fn(e, u, !0, !0);
      } catch (f) {
        Pn(e, "Invalid regex: " + u);
        return;
      }
      var l = Sn(e).getQuery(),
          c = [];

      for (var h = i; h <= s; h++) {
        var p = e.getLineHandle(h),
            d = l.test(p.text);
        d !== r && c.push(a ? p : p.text);
      }

      if (!a) {
        Pn(e, c.join("\n"));
        return;
      }

      var v = 0,
          m = function m() {
        if (v < c.length) {
          var t = c[v++],
              n = e.getLineNumber(t);

          if (n == null) {
            m();
            return;
          }

          var r = n + 1 + a;
          Qn.processCommand(e, r, {
            callback: m
          });
        }
      };

      m();
    },
    substitute: function substitute(e, t) {
      if (!e.getSearchCursor) throw new Error("Search feature not available. Requires searchcursor.js or any other getSearchCursor implementation.");
      var n = t.argString,
          r = n ? Nn(n, n[0]) : [],
          i,
          s = "",
          o,
          u,
          a,
          f = !1,
          l = !1;
      if (r.length) i = r[0], rt("pcre") && i !== "" && (i = new RegExp(i).source), s = r[1], s !== undefined && (rt("pcre") ? s = Mn(s.replace(/([^\\])&/g, "$1$$&")) : s = An(s), at.lastSubstituteReplacePart = s), o = r[2] ? r[2].split(" ") : [];else if (n && n.length) {
        Pn(e, "Substitutions should be of the form :s/pattern/replace/");
        return;
      }
      o && (u = o[0], a = parseInt(o[1]), u && (u.indexOf("c") != -1 && (f = !0), u.indexOf("g") != -1 && (l = !0), rt("pcre") ? i = i + "/" + u : i = i.replace(/\//g, "\\/") + "/" + u));
      if (i) try {
        Fn(e, i, !0, !0);
      } catch (c) {
        Pn(e, "Invalid regex: " + i);
        return;
      }
      s = s || at.lastSubstituteReplacePart;

      if (s === undefined) {
        Pn(e, "No previous substitute regular expression");
        return;
      }

      var h = Sn(e),
          p = h.getQuery(),
          d = t.line !== undefined ? t.line : e.getCursor().line,
          v = t.lineEnd || d;
      d == e.firstLine() && v == e.lastLine() && (v = Infinity), a && (d = v, v = d + a - 1);
      var m = Ct(e, new w(d, 0)),
          g = e.getSearchCursor(p, m);
      Gn(e, f, l, d, v, g, p, s, t.callback);
    },
    redo: m.commands.redo,
    undo: m.commands.undo,
    write: function write(e) {
      m.commands.save ? m.commands.save(e) : e.save && e.save();
    },
    nohlsearch: function nohlsearch(e) {
      zn(e);
    },
    yank: function yank(e) {
      var t = Dt(e.getCursor()),
          n = t.line,
          r = e.getLine(n);
      at.registerController.pushText("0", "yank", r, !0, !0);
    },
    delmarks: function delmarks(e, t) {
      if (!t.argString || !qt(t.argString)) {
        Pn(e, "Argument required");
        return;
      }

      var n = e.state.vim,
          r = new m.StringStream(qt(t.argString));

      while (!r.eol()) {
        r.eatSpace();
        var i = r.pos;

        if (!r.match(/[a-zA-Z]/, !1)) {
          Pn(e, "Invalid argument: " + t.argString.substring(i));
          return;
        }

        var s = r.next();

        if (r.match("-", !0)) {
          if (!r.match(/[a-zA-Z]/, !1)) {
            Pn(e, "Invalid argument: " + t.argString.substring(i));
            return;
          }

          var o = s,
              u = r.next();

          if (!($(o) && $(u) || Q(o) && Q(u))) {
            Pn(e, "Invalid argument: " + o + "-");
            return;
          }

          var a = o.charCodeAt(0),
              f = u.charCodeAt(0);

          if (a >= f) {
            Pn(e, "Invalid argument: " + t.argString.substring(i));
            return;
          }

          for (var l = 0; l <= f - a; l++) {
            var c = String.fromCharCode(a + l);
            delete n.marks[c];
          }
        } else delete n.marks[s];
      }
    }
  },
      Qn = new Jn();
  m.keyMap.vim = {
    attach: A,
    detach: L,
    call: O
  }, tt("insertModeEscKeysTimeout", 200, "number"), m.keyMap["vim-insert"] = {
    fallthrough: ["default"],
    attach: A,
    detach: L,
    call: O
  }, m.keyMap["vim-replace"] = {
    Backspace: "goCharLeft",
    fallthrough: ["vim-insert"],
    attach: A,
    detach: L,
    call: O
  }, ft(), m.Vim = N(), N = m.Vim;
  var hr = {
    "return": "CR",
    backspace: "BS",
    "delete": "Del",
    esc: "Esc",
    left: "Left",
    right: "Right",
    up: "Up",
    down: "Down",
    space: "Space",
    insert: "Ins",
    home: "Home",
    end: "End",
    pageup: "PageUp",
    pagedown: "PageDown",
    enter: "CR"
  },
      dr = N.handleKey.bind(N);
  N.handleKey = function (e, t, n) {
    return e.operation(function () {
      return dr(e, t, n);
    }, !0);
  }, t.CodeMirror = m;
  var gr = N.maybeInitVimState_;
  t.handler = {
    $id: "ace/keyboard/vim",
    drawCursor: function drawCursor(e, t, n, r, s) {
      var u = this.state.vim || {},
          a = n.characterWidth,
          f = n.lineHeight,
          l = t.top,
          c = t.left;

      if (!u.insertMode) {
        var h = r.cursor ? i.comparePoints(r.cursor, r.start) <= 0 : s.selection.isBackwards() || s.selection.isEmpty();
        !h && c > a && (c -= a);
      }

      !u.insertMode && u.status && (f /= 2, l += f), o.translate(e, c, l), o.setStyle(e.style, "width", a + "px"), o.setStyle(e.style, "height", f + "px");
    },
    handleKeyboard: function handleKeyboard(e, t, n, r, i) {
      var s = e.editor,
          o = s.state.cm,
          u = gr(o);
      if (r == -1) return;
      u.insertMode || (t == -1 ? (n.charCodeAt(0) > 255 && e.inputKey && (n = e.inputKey, n && e.inputHash == 4 && (n = n.toUpperCase())), e.inputChar = n) : t == 4 || t == 0 ? e.inputKey == n && e.inputHash == t && e.inputChar ? (n = e.inputChar, t = -1) : (e.inputChar = null, e.inputKey = n, e.inputHash = t) : e.inputChar = e.inputKey = null);
      if (o.state.overwrite && u.insertMode && n == "backspace" && t == 0) return {
        command: "gotoleft"
      };
      if (n == "c" && t == 1 && !c.isMac && s.getCopyText()) return s.once("copy", function () {
        u.insertMode ? s.selection.clearSelection() : o.operation(function () {
          Yt(o);
        });
      }), {
        command: "null",
        passEvent: !0
      };

      if (n == "esc" && !u.insertMode && !u.visualMode && !o.ace.inMultiSelectMode) {
        var a = Sn(o),
            f = a.getOverlay();
        f && o.removeOverlay(f);
      }

      if (t == -1 || t & 1 || t === 0 && n.length > 1) {
        var l = u.insertMode,
            h = pr(t, n, i || {});
        u.status == null && (u.status = "");
        var p = mr(o, h, "user");
        u = gr(o), p && u.status != null ? u.status += h : u.status == null && (u.status = ""), o._signal("changeStatus");
        if (!p && (t != -1 || l)) return;
        return {
          command: "null",
          passEvent: !p
        };
      }
    },
    attach: function attach(e) {
      function n() {
        var n = gr(t).insertMode;
        t.ace.renderer.setStyle("normal-mode", !n), e.textInput.setCommandMode(!n), e.renderer.$keepTextAreaAtCursor = n, e.renderer.$blockCursor = !n;
      }

      e.state || (e.state = {});
      var t = new m(e);
      e.state.cm = t, e.$vimModeHandler = this, m.keyMap.vim.attach(t), gr(t).status = null, t.on("vim-command-done", function () {
        if (t.virtualSelectionMode()) return;
        gr(t).status = null, t.ace._signal("changeStatus"), t.ace.session.markUndoGroup();
      }), t.on("changeStatus", function () {
        t.ace.renderer.updateCursor(), t.ace._signal("changeStatus");
      }), t.on("vim-mode-change", function () {
        if (t.virtualSelectionMode()) return;
        n(), t._signal("changeStatus");
      }), n(), e.renderer.$cursorLayer.drawCursor = this.drawCursor.bind(t);
    },
    detach: function detach(e) {
      var t = e.state.cm;
      m.keyMap.vim.detach(t), t.destroy(), e.state.cm = null, e.$vimModeHandler = null, e.renderer.$cursorLayer.drawCursor = null, e.renderer.setStyle("normal-mode", !1), e.textInput.setCommandMode(!1), e.renderer.$keepTextAreaAtCursor = !0;
    },
    getStatusText: function getStatusText(e) {
      var t = e.state.cm,
          n = gr(t);
      if (n.insertMode) return "INSERT";
      var r = "";
      return n.visualMode && (r += "VISUAL", n.visualLine && (r += " LINE"), n.visualBlock && (r += " BLOCK")), n.status && (r += (r ? " " : "") + n.status), r;
    }
  }, N.defineOption({
    name: "wrap",
    set: function set(e, t) {
      t && t.ace.setOption("wrap", e);
    },
    type: "boolean"
  }, !1), N.defineEx("write", "w", function () {
    console.log(":write is not implemented");
  }), S.push({
    keys: "zc",
    type: "action",
    action: "fold",
    actionArgs: {
      open: !1
    }
  }, {
    keys: "zC",
    type: "action",
    action: "fold",
    actionArgs: {
      open: !1,
      all: !0
    }
  }, {
    keys: "zo",
    type: "action",
    action: "fold",
    actionArgs: {
      open: !0
    }
  }, {
    keys: "zO",
    type: "action",
    action: "fold",
    actionArgs: {
      open: !0,
      all: !0
    }
  }, {
    keys: "za",
    type: "action",
    action: "fold",
    actionArgs: {
      toggle: !0
    }
  }, {
    keys: "zA",
    type: "action",
    action: "fold",
    actionArgs: {
      toggle: !0,
      all: !0
    }
  }, {
    keys: "zf",
    type: "action",
    action: "fold",
    actionArgs: {
      open: !0,
      all: !0
    }
  }, {
    keys: "zd",
    type: "action",
    action: "fold",
    actionArgs: {
      open: !0,
      all: !0
    }
  }, {
    keys: "<C-A-k>",
    type: "action",
    action: "aceCommand",
    actionArgs: {
      name: "addCursorAbove"
    }
  }, {
    keys: "<C-A-j>",
    type: "action",
    action: "aceCommand",
    actionArgs: {
      name: "addCursorBelow"
    }
  }, {
    keys: "<C-A-S-k>",
    type: "action",
    action: "aceCommand",
    actionArgs: {
      name: "addCursorAboveSkipCurrent"
    }
  }, {
    keys: "<C-A-S-j>",
    type: "action",
    action: "aceCommand",
    actionArgs: {
      name: "addCursorBelowSkipCurrent"
    }
  }, {
    keys: "<C-A-h>",
    type: "action",
    action: "aceCommand",
    actionArgs: {
      name: "selectMoreBefore"
    }
  }, {
    keys: "<C-A-l>",
    type: "action",
    action: "aceCommand",
    actionArgs: {
      name: "selectMoreAfter"
    }
  }, {
    keys: "<C-A-S-h>",
    type: "action",
    action: "aceCommand",
    actionArgs: {
      name: "selectNextBefore"
    }
  }, {
    keys: "<C-A-S-l>",
    type: "action",
    action: "aceCommand",
    actionArgs: {
      name: "selectNextAfter"
    }
  }), S.push({
    keys: "gq",
    type: "operator",
    operator: "hardWrap"
  }), N.defineOperator("hardWrap", function (e, t, n, r, i) {
    var s = n[0].anchor.line,
        o = n[0].head.line;
    return t.linewise && o--, v(e.ace, {
      startRow: s,
      endRow: o
    }), w(o, 0);
  }), tt("textwidth", undefined, "number", ["tw"], function (e, t) {
    if (t === undefined) return;

    if (e === undefined) {
      var n = t.ace.getOption("printMarginColumn");
      return n;
    }

    var r = Math.round(e);
    r > 1 && t.ace.setOption("printMarginColumn", r);
  }), Tt.aceCommand = function (e, t, n) {
    e.vimCmd = t, e.ace.inVirtualSelectionMode ? e.ace.on("beforeEndOperation", yr) : yr(null, e.ace);
  }, Tt.fold = function (e, t, n) {
    e.ace.execCommand(["toggleFoldWidget", "toggleFoldWidget", "foldOther", "unfoldall"][(t.all ? 2 : 0) + (t.open ? 1 : 0)]);
  }, t.handler.defaultKeymap = S, t.handler.actions = Tt, t.Vim = N;
});

(function () {
  window.require(["ace/keyboard/vim"], function (m) {
    if ((typeof module === "undefined" ? "undefined" : _typeof(module)) == "object" && (typeof exports === "undefined" ? "undefined" : _typeof(exports)) == "object" && module) {
      module.exports = m;
    }
  });
})();