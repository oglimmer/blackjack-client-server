"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

define("ace/mode/jssm_highlight_rules", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text_highlight_rules"], function (e, t, n) {
  "use strict";

  var r = e("../lib/oop"),
      i = e("./text_highlight_rules").TextHighlightRules,
      s = function s() {
    this.$rules = {
      start: [{
        token: "punctuation.definition.comment.mn",
        regex: /\/\*/,
        push: [{
          token: "punctuation.definition.comment.mn",
          regex: /\*\//,
          next: "pop"
        }, {
          defaultToken: "comment.block.jssm"
        }],
        comment: "block comment"
      }, {
        token: "comment.line.jssm",
        regex: /\/\//,
        push: [{
          token: "comment.line.jssm",
          regex: /$/,
          next: "pop"
        }, {
          defaultToken: "comment.line.jssm"
        }],
        comment: "block comment"
      }, {
        token: "entity.name.function",
        regex: /\${/,
        push: [{
          token: "entity.name.function",
          regex: /}/,
          next: "pop"
        }, {
          defaultToken: "keyword.other"
        }],
        comment: "js outcalls"
      }, {
        token: "constant.numeric",
        regex: /[0-9]*\.[0-9]*\.[0-9]*/,
        comment: "semver"
      }, {
        token: "constant.language.jssmLanguage",
        regex: /graph_layout\s*:/,
        comment: "jssm language tokens"
      }, {
        token: "constant.language.jssmLanguage",
        regex: /machine_name\s*:/,
        comment: "jssm language tokens"
      }, {
        token: "constant.language.jssmLanguage",
        regex: /machine_version\s*:/,
        comment: "jssm language tokens"
      }, {
        token: "constant.language.jssmLanguage",
        regex: /jssm_version\s*:/,
        comment: "jssm language tokens"
      }, {
        token: "keyword.control.transition.jssmArrow.legal_legal",
        regex: /<->/,
        comment: "transitions"
      }, {
        token: "keyword.control.transition.jssmArrow.legal_none",
        regex: /<-/,
        comment: "transitions"
      }, {
        token: "keyword.control.transition.jssmArrow.none_legal",
        regex: /->/,
        comment: "transitions"
      }, {
        token: "keyword.control.transition.jssmArrow.main_main",
        regex: /<=>/,
        comment: "transitions"
      }, {
        token: "keyword.control.transition.jssmArrow.none_main",
        regex: /=>/,
        comment: "transitions"
      }, {
        token: "keyword.control.transition.jssmArrow.main_none",
        regex: /<=/,
        comment: "transitions"
      }, {
        token: "keyword.control.transition.jssmArrow.forced_forced",
        regex: /<~>/,
        comment: "transitions"
      }, {
        token: "keyword.control.transition.jssmArrow.none_forced",
        regex: /~>/,
        comment: "transitions"
      }, {
        token: "keyword.control.transition.jssmArrow.forced_none",
        regex: /<~/,
        comment: "transitions"
      }, {
        token: "keyword.control.transition.jssmArrow.legal_main",
        regex: /<-=>/,
        comment: "transitions"
      }, {
        token: "keyword.control.transition.jssmArrow.main_legal",
        regex: /<=->/,
        comment: "transitions"
      }, {
        token: "keyword.control.transition.jssmArrow.legal_forced",
        regex: /<-~>/,
        comment: "transitions"
      }, {
        token: "keyword.control.transition.jssmArrow.forced_legal",
        regex: /<~->/,
        comment: "transitions"
      }, {
        token: "keyword.control.transition.jssmArrow.main_forced",
        regex: /<=~>/,
        comment: "transitions"
      }, {
        token: "keyword.control.transition.jssmArrow.forced_main",
        regex: /<~=>/,
        comment: "transitions"
      }, {
        token: "constant.numeric.jssmProbability",
        regex: /[0-9]+%/,
        comment: "edge probability annotation"
      }, {
        token: "constant.character.jssmAction",
        regex: /\'[^']*\'/,
        comment: "action annotation"
      }, {
        token: "entity.name.tag.jssmLabel.doublequoted",
        regex: /\"[^"]*\"/,
        comment: "jssm label annotation"
      }, {
        token: "entity.name.tag.jssmLabel.atom",
        regex: /[a-zA-Z0-9_.+&()#@!?,]/,
        comment: "jssm label annotation"
      }]
    }, this.normalizeRules();
  };

  s.metaData = {
    fileTypes: ["jssm", "jssm_state"],
    name: "JSSM",
    scopeName: "source.jssm"
  }, r.inherits(s, i), t.JSSMHighlightRules = s;
}), define("ace/mode/folding/cstyle", ["require", "exports", "module", "ace/lib/oop", "ace/range", "ace/mode/folding/fold_mode"], function (e, t, n) {
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
}), define("ace/mode/jssm", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text", "ace/mode/jssm_highlight_rules", "ace/mode/folding/cstyle"], function (e, t, n) {
  "use strict";

  var r = e("../lib/oop"),
      i = e("./text").Mode,
      s = e("./jssm_highlight_rules").JSSMHighlightRules,
      o = e("./folding/cstyle").FoldMode,
      u = function u() {
    this.HighlightRules = s, this.foldingRules = new o();
  };

  r.inherits(u, i), function () {
    this.lineCommentStart = "//", this.blockComment = {
      start: "/*",
      end: "*/"
    }, this.$id = "ace/mode/jssm";
  }.call(u.prototype), t.Mode = u;
});

(function () {
  window.require(["ace/mode/jssm"], function (m) {
    if ((typeof module === "undefined" ? "undefined" : _typeof(module)) == "object" && (typeof exports === "undefined" ? "undefined" : _typeof(exports)) == "object" && module) {
      module.exports = m;
    }
  });
})();