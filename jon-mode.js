/*global define CodeMirror*/
(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("codemirror/lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["codemirror/lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

CodeMirror.defineMode("jackl", function () {

  var rules = [
    'comment',    /^--.*/,
    'atom',       /^<([0-9A-F]{2}(?:\s+[0-9A-F]{2})*)>/i,
    'atom',       /^(null|true|false)\b/,
    'string',     /^\"(?:[^\"\\]|\\.)*\"/,
    'string',     /^'(?:[^'\\]|\\.)*'/,
    'builtin',    /^@[a-z]+/,
    'variable',   /^[A-Z_]([-\.]?[A-Z0-9_])*[?!]?/i,
    'variable-2', /^:+[A-Z_]([-]?[A-Z0-9_])*[?!]?/i,
    'number',     /^(-)?0X([0-9A-F]+)/i,
    'number',     /^[+-]?[1-9][0-9]*/,
    'number',     /^0/,
    null,         /^\s+/,
  ];

  return {
    startState: function () {
      return {
        indentStack: []
      };
    },

    token: function (stream, state) {
      for (var i = 0; i < rules.length; i += 2) {
        var match;
        if ((match = stream.match(rules[i + 1]))) {
          var type = rules[i];
          return type;
        }
      }
      var char = stream.next();
      if (char === "(" || char === "[" || char === "{") state.indentStack.push(stream.indentation() + 2);
      if (char === ")" || char === "]" || char === "}") state.indentStack.pop();
    },

    indent: function (state, textAfter) {
      var match = textAfter.match(/^[)}\]]*$/);
      var closers = match ? match[0].length : 0;
      return state.indentStack[state.indentStack.length - 1 - closers]|0;
    },

    electricInput: /[^\s]$/,

    lineComment: "--"
  };
});

CodeMirror.defineMIME("text/x-jon", "jon");

});
