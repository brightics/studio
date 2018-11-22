(function (mod) {
    if (typeof exports == "object" && typeof module == "object") // CommonJS
        mod(require("../../lib/codemirror"));
    else if (typeof define == "function" && define.amd) // AMD
        define(["../../lib/codemirror"], mod);
    else // Plain browser env
        mod(CodeMirror);
})(function (CodeMirror) {
    "use strict";

    var WORD = /[\w$]+/, RANGE = 500;

    CodeMirror.registerHelper("hint", "brtc-custom", function (editor, options) {
        var word = options && options.word || WORD;
        var cur = editor.getCursor(), curLine = editor.getLine(cur.line);
        var end = cur.ch, start = end;
        while (start && word.test(curLine.charAt(start - 1))) --start;

        var token = editor.getTokenAt(cur), start, end, search;
        if (token.end > cur.ch) {
            token.end = cur.ch;
            token.string = token.string.slice(0, cur.ch - token.start);
        }

        if (token.string.match(WORD)) {
            search = token.string;
            start = token.start;
            end = token.end;
        } else {
            start = end = cur.ch;
            search = "";
        }
        
        var list = []; //options && options.list || [];
        for (var i in options.list) {
            if (options.list[i].startsWith(search)) {
                list.push(options.list[i]);
            }
        }

        return {list: list, from: CodeMirror.Pos(cur.line, start), to: CodeMirror.Pos(cur.line, end)};
    });
});
