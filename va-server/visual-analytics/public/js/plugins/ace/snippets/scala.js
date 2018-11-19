define("ace/snippets/scala",["require","exports","module"], function(require, exports, module) {
"use strict";
var rawFile = new XMLHttpRequest();
rawFile.open("GET", "js/plugins/ace/snippets/scala.snippet", false);
rawFile.onreadystatechange = function ()
{
    if(rawFile.readyState === 4)
    {
        if(rawFile.status === 200 || rawFile.status == 0)
        {
            exports.snippetText = rawFile.responseText;
        }
    }
};
rawFile.send(null);
/*exports.snippetText = "\
# SQLContext\n\
# dropTempTable\n\
snippet dropTempTable\n\
\tdropTempTable(${1:tableName})\n\
#sql\n\
snippet sql\n\
\tsql(${1:sqlText})\n\
\n\
# DataFrame\n\
# registerTempTable\n\
snippet registerTempTable\n\
\tregisterTempTable(${1:tableName})\n\
";*/
exports.scope = "scala";

});
