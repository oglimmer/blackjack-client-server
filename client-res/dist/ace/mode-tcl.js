"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

define("ace/mode/folding/cstyle", ["require", "exports", "module", "ace/lib/oop", "ace/range", "ace/mode/folding/fold_mode"], function (e, t, n) {
  "use strict";

  var r = e("../../lib/oop"),
      i = e("../../range").Range,
      s = e("./fold_mode").FoldMode,
      o = t.FoldMode = function (e) {
    e && (this.foldingStartMarker = new RegExp(this.foldingStartMarker.source.replace(/\|[^|]*?$/, "|" + e.start)), this.foldingStopMarker = new RegExp(this.foldingStopMarker.source.replace(/\|[^|]*?$/, "|" + e.end)));
  };

  r.inherits(o, s), function () {
    this.foldingStartMarker = /([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/, this.foldingStopMarker = /^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/, this.singleLineBlockCommentRe = /^\s*(\/\*).*\*\/\s*$/, this.tripleStarBlockCommentRe = /^\s*(\/\*\*\*).*\*\/\s*$/, this.startRegionRe = /^\s*(\/\*|\/\/)#?region\b/, this._getFoldWidgetBase = this.getFoldWidget, this.getFoldWidget = function (e, t, n) {
      var r = e.getLine(n);
      if (this.singleLineBlockCommentRe.test(r) && !this.startRegionRe.test(r) && !this.tripleStarBlockCommentRe.test(r)) return "";

      var i = this._getFoldWidgetBase(e, t, n);

      return !i && this.startRegionRe.test(r) ? "start" : i;
    }, this.getFoldWidgetRange = function (e, t, n, r) {
      var i = e.getLine(n);
      if (this.startRegionRe.test(i)) return this.getCommentRegionBlock(e, i, n);
      var s = i.match(this.foldingStartMarker);

      if (s) {
        var o = s.index;
        if (s[1]) return this.openingBracketBlock(e, s[1], n, o);
        var u = e.getCommentFoldRange(n, o + s[0].length, 1);
        return u && !u.isMultiLine() && (r ? u = this.getSectionRange(e, n) : t != "all" && (u = null)), u;
      }

      if (t === "markbegin") return;
      var s = i.match(this.foldingStopMarker);

      if (s) {
        var o = s.index + s[0].length;
        return s[1] ? this.closingBracketBlock(e, s[1], n, o) : e.getCommentFoldRange(n, o, -1);
      }
    }, this.getSectionRange = function (e, t) {
      var n = e.getLine(t),
          r = n.search(/\S/),
          s = t,
          o = n.length;
      t += 1;
      var u = t,
          a = e.getLength();

      while (++t < a) {
        n = e.getLine(t);
        var f = n.search(/\S/);
        if (f === -1) continue;
        if (r > f) break;
        var l = this.getFoldWidgetRange(e, "all", t);

        if (l) {
          if (l.start.row <= s) break;
          if (l.isMultiLine()) t = l.end.row;else if (r == f) break;
        }

        u = t;
      }

      return new i(s, o, u, e.getLine(u).length);
    }, this.getCommentRegionBlock = function (e, t, n) {
      var r = t.search(/\s*$/),
          s = e.getLength(),
          o = n,
          u = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/,
          a = 1;

      while (++n < s) {
        t = e.getLine(n);
        var f = u.exec(t);
        if (!f) continue;
        f[1] ? a-- : a++;
        if (!a) break;
      }

      var l = n;
      if (l > o) return new i(o, r, l, t.length);
    };
  }.call(o.prototype);
}), define("ace/mode/tcl_highlight_rules", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text_highlight_rules"], function (e, t, n) {
  "use strict";

  var r = e("../lib/oop"),
      i = e("./text_highlight_rules").TextHighlightRules,
      s = function s() {
    this.$rules = {
      start: [{
        token: "comment",
        regex: "#.*\\\\$",
        next: "commentfollow"
      }, {
        token: "comment",
        regex: "#.*$"
      }, {
        token: "support.function",
        regex: "[\\\\]$",
        next: "splitlineStart"
      }, {
        token: "text",
        regex: /\\(?:["{}\[\]$\\])/
      }, {
        token: "text",
        regex: "^|[^{][;][^}]|[/\r/]",
        next: "commandItem"
      }, {
        token: "string",
        regex: '[ ]*["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
      }, {
        token: "string",
        regex: '[ ]*["]',
        next: "qqstring"
      }, {
        token: "variable.instance",
        regex: "[$]",
        next: "variable"
      }, {
        token: "support.function",
        regex: "!|\\$|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^=|{\\*}|;|::"
      }, {
        token: "identifier",
        regex: "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
      }, {
        token: "paren.lparen",
        regex: "[[{]",
        next: "commandItem"
      }, {
        token: "paren.lparen",
        regex: "[(]"
      }, {
        token: "paren.rparen",
        regex: "[\\])}]"
      }, {
        token: "text",
        regex: "\\s+"
      }],
      commandItem: [{
        token: "comment",
        regex: "#.*\\\\$",
        next: "commentfollow"
      }, {
        token: "comment",
        regex: "#.*$",
        next: "start"
      }, {
        token: "string",
        regex: '[ ]*["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
      }, {
        token: "variable.instance",
        regex: "[$]",
        next: "variable"
      }, {
        token: "support.function",
        regex: "(?:[:][:])[a-zA-Z0-9_/]+(?:[:][:])",
        next: "commandItem"
      }, {
        token: "support.function",
        regex: "[a-zA-Z0-9_/]+(?:[:][:])",
        next: "commandItem"
      }, {
        token: "support.function",
        regex: "(?:[:][:])",
        next: "commandItem"
      }, {
        token: "paren.rparen",
        regex: "[\\])}]"
      }, {
        token: "paren.lparen",
        regex: "[[({]"
      }, {
        token: "support.function",
        regex: "!|\\$|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^=|{\\*}|;|::"
      }, {
        token: "keyword",
        regex: "[a-zA-Z0-9_/]+",
        next: "start"
      }],
      commentfollow: [{
        token: "comment",
        regex: ".*\\\\$",
        next: "commentfollow"
      }, {
        token: "comment",
        regex: ".+",
        next: "start"
      }],
      splitlineStart: [{
        token: "text",
        regex: "^.",
        next: "start"
      }],
      variable: [{
        token: "variable.instance",
        regex: "[a-zA-Z_\\d]+(?:[(][a-zA-Z_\\d]+[)])?",
        next: "start"
      }, {
        token: "variable.instance",
        regex: "{?[a-zA-Z_\\d]+}?",
        next: "start"
      }],
      qqstring: [{
        token: "string",
        regex: '(?:[^\\\\]|\\\\.)*?["]',
        next: "start"
      }, {
        token: "string",
        regex: ".+"
      }]
    };
  };

  r.inherits(s, i), t.TclHighlightRules = s;
}), define("ace/mode/matching_brace_outdent", ["require", "exports", "module", "ace/range"], function (e, t, n) {
  "use strict";

  var r = e("../range").Range,
      i = function i() {};

  (function () {
    this.checkOutdent = function (e, t) {
      return /^\s+$/.test(e) ? /^\s*\}/.test(t) : !1;
    }, this.autoOutdent = function (e, t) {
      var n = e.getLine(t),
          i = n.match(/^(\s*\})/);
      if (!i) return 0;
      var s = i[1].length,
          o = e.findMatchingBracket({
        row: t,
        column: s
      });
      if (!o || o.row == t) return 0;
      var u = this.$getIndent(e.getLine(o.row));
      e.replace(new r(t, 0, t, s - 1), u);
    }, this.$getIndent = function (e) {
      return e.match(/^\s*/)[0];
    };
  }).call(i.prototype), t.MatchingBraceOutdent = i;
}), define("ace/mode/tcl", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text", "ace/mode/folding/cstyle", "ace/mode/tcl_highlight_rules", "ace/mode/matching_brace_outdent", "ace/range"], function (e, t, n) {
  "use strict";

  var r = e("../lib/oop"),
      i = e("./text").Mode,
      s = e("./folding/cstyle").FoldMode,
      o = e("./tcl_highlight_rules").TclHighlightRules,
      u = e("./matching_brace_outdent").MatchingBraceOutdent,
      a = e("../range").Range,
      f = function f() {
    this.HighlightRules = o, this.$outdent = new u(), this.foldingRules = new s(), this.$behaviour = this.$defaultBehaviour;
  };

  r.inherits(f, i), function () {
    this.lineCommentStart = "#", this.getNextLineIndent = function (e, t, n) {
      var r = this.$getIndent(t),
          i = this.getTokenizer().getLineTokens(t, e),
          s = i.tokens;
      if (s.length && s[s.length - 1].type == "comment") return r;

      if (e == "start") {
        var o = t.match(/^.*[\{\(\[]\s*$/);
        o && (r += n);
      }

      return r;
    }, this.checkOutdent = function (e, t, n) {
      return this.$outdent.checkOutdent(t, n);
    }, this.autoOutdent = function (e, t, n) {
      this.$outdent.autoOutdent(t, n);
    }, this.$id = "ace/mode/tcl", this.snippetFileId = "ace/snippets/tcl";
  }.call(f.prototype), t.Mode = f;
});

(function () {
  window.require(["ace/mode/tcl"], function (m) {
    if ((typeof module === "undefined" ? "undefined" : _typeof(module)) == "object" && (typeof exports === "undefined" ? "undefined" : _typeof(exports)) == "object" && module) {
      module.exports = m;
    }
  });
})();