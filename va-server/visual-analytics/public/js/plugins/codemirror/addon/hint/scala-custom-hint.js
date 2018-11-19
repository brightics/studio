(function (mod) {
    if (typeof exports == "object" && typeof module == "object") // CommonJS
        mod(require("../../lib/codemirror"));
    else if (typeof define == "function" && define.amd) // AMD
        define(["../../lib/codemirror"], mod);
    else // Plain browser env
        mod(CodeMirror);
})(function (CodeMirror) {
    "use strict";
    var Pos = CodeMirror.Pos;

    var WORD = /[\w]+/, RANGE = 500;

    function forEach(arr, f) {
        for (var i = 0, e = arr.length; i < e; ++i) f(arr[i]);
    }

    function arrayContains(arr, item) {
        if (!Array.prototype.indexOf) {
            var i = arr.length;
            while (i--) {
                if (arr[i] === item) {
                    return true;
                }
            }
            return false;
        }
        return arr.indexOf(item) != -1;
    }

    function scriptHint(editor, keywords, getToken, options) {
        // Find the token at the cursor
        var cur = editor.getCursor(), token = getToken(editor, cur);
        if (/\b(?:string|comment)\b/.test(token.type)) return;
        token.state = CodeMirror.innerMode(editor.getMode(), token.state).state;

        // If it's not a 'word-style' token, ignore the token.
        if (!/^[\w$_]*$/.test(token.string)) {
            token = {start: cur.ch, end: cur.ch, string: "", state: token.state, type: token.string == "." ? "property" : null};
        } else if (token.end > cur.ch) {
            token.end = cur.ch;
            token.string = token.string.slice(0, cur.ch - token.start);
        }

        var tprop = token;
        var tpropPrev = getToken(editor, Pos(cur.line, tprop.start));
        if(tpropPrev.string == '.') tprop.type = 'property';
        // If it is a property, find out what it is a property of.
        var context = [];
        while (tprop.type == "property") {
            tprop = getToken(editor, Pos(cur.line, tprop.start));
            if(tprop.string == '.') {
                tprop = getToken(editor, Pos(cur.line, tprop.start));
            }
            if(tprop.string == ')') {
                while(tprop.string != '(') tprop = getToken(editor, Pos(cur.line, tprop.start));
                tprop = getToken(editor, Pos(cur.line, tprop.start));
            }
            if(arrayContains(sqlContextDataFrameMembers, tprop.string)) tprop.type = 'DataFrame';
            if(tprop.string === 'sqlContext') tprop.type = 'SQLContext';
            else if(typeof sparkClasses[tprop.string] != 'undefined') tprop.type = tprop.string;
            if(tprop.type != null) context.push(tprop);
        }
        var start = token.start;
        if(context.length && typeof sparkClasses[context[0].type] != 'undefined' && context[0].type == context[0].string) start = context[0].start;
        return {list: getCompletions(token, context, keywords, options),
            from: Pos(cur.line, start),
            to: Pos(cur.line, token.end)};
    }

    function scalaHint(editor, options) {
        var scalaKeywords = CodeMirror.helpers['hintWords']['text/x-scala'];
        return scriptHint(editor, scalaKeywords, function (e, cur) {return e.getTokenAt(cur);}, options);
    }

    CodeMirror.registerHelper("hint", "scala-custom", scalaHint);

    var sqlContextDataFrameMembers = ('sql range createDataFrame createExternalTable table tables').split(" ");
    var sqlContextMembers = ('' +
    'baseRelationToDataFrame(baseRelation: BaseRelation)' +
    '#cacheTable(tableName: String)' +
    '#clearCache()' +
    '#createDataFrame(data: List[_], beanClass: Class[_])' +
    '#createDataFrame(data: JavaRDD[_], beanClass: Class[_])' +
    '#createDataFrame(data: RDD[_], beanClass: Class[_])' +
    '#createDataFrame(data: List[Row], schema: StructType)' +
    '#createDataFrame(data: JavaRDD[Row], schema: StructType)' +
    '#createDataFrame(data: RDD[Row], schema: StructType)' +
    '#createExternalTable(tableName: String, source: String, schema: StructType, options: Map[String, String])' +
    '#createExternalTable(tableName: String, source: String, options: Map[String, String])' +
    '#createExternalTable(tableName: String, path: String, source: String)' +
    '#createExternalTable(tableName: String, path: String)' +
    '#dropTempTable(tableName: String)' +
    '#emptyDataFrame' +
    '#getAllConfs' +
    '#getConf(key: String, defaultValue: String)' +
    '#getConf(key: String)' +
    '#isCached(tableName: String)' +
    '#range(start: Long, end: Long, step: Long, numPartitions: Int)' +
    '#range(start: Long, end: Long)' +
    '#range(end: Long)' +
    '#read' +
    '#setConf(key: String, value: String)' +
    '#setConf(props: Properties)' +
    '#sql(sqlText: String)' +
    '#table(tableName: String)' +
    '#tableNames(databaseName: String)' +
    '#tableNames()' +
    '#tables(databaseName: String)' +
    '#tables()' +
    '#udf' +
    '#uncacheTable(tableName: String)' +
    '').split("#");
    var dataFrameMembers = ('' +
    'agg(expr: Column, exprs: Column*)' +
    '#agg(exprs: Map[String, String])' +
    '#collect()' +
    '#collectAsList()' +
    '#count()' +
    '#describe(cols: String*)' +
    '#first()' +
    '#head()' +
    '#head(n: Int)' +
    '#show(numRows: Int, truncate: Boolean)' +
    '#take(n: Int)' +
    '#takeAsList(n: Int)' +
    '#cache()' +
    '#columns' +
    '#dtypes' +
    '#explain(extended: Boolean)' +
    '#isLocal' +
    '#persist(newLevel: StorageLevel)' +
    '#persist()' +
    '#printSchema()' +
    '#registerTempTable(tableName: String)' +
    '#schema' +
    '#toDF(colNames: String*)' +
    '#toDF()' +
    '#unpersist()' +
    '#unpersist(blocking: Boolean)' +
    '#write' +
    '#explain()').split("#");
    var rddMembers = ('' +
    'cache()' +
    '#checkpoint()' +
    '#collect()' +
    '#context' +
    '#count()' +
    '#countApprox(timeout, confidence)' +
    '#countApproxDistinct(relativeSD)' +
    '#countApproxDistinct(p, sp)' +
    '#countByValue()' +
    '#dependancies' +
    '#distinct()' +
    '#filter(f)' +
    '#first()' +
    '#foreach(f)' +
    '#foreachPartition(f)' +
    '#getCheckpointFile' +
    '#gtetNumPartitions' +
    '#getStorageLevel' +
    '#glom()' +
    '#groupBy[K](f, p)' +
    '#groupBy[K](f, numPartitions)' +
    '#groupBy[K](f)' +
    '#id' +
    '#intersection(other, numPartitions)' +
    '#intersection(other, partitioner)' +
    '#intersection(other)' +
    '#isCheckpointed' +
    '#isEmpty()' +
    '#iterator(split, context)' +
    '#keyBy[K](f)' +
    '#localCheckpoint()' +
    '#max()' +
    '#min()' +
    '#name' +
    '#partitioner' +
    '#partitions' +
    '#persist()' +
    '#persist(newLevel)' +
    '').split("#");

    var sparkClasses = {
        SQLContext : sqlContextMembers,
        RDD : rddMembers,
        DataFrame : dataFrameMembers
    };

    function forAllProps(obj, callback) {
        if (!Object.getOwnPropertyNames || !Object.getPrototypeOf) {
            for (var name in obj) callback(name)
        } else {
            for (var o = obj; o; o = Object.getPrototypeOf(o))
                Object.getOwnPropertyNames(o).forEach(callback)
        }
    }

    function getCompletions(token, context, keywords, options) {
        var found = [], start = token.string, global = options && options.globalScope || window;

        function maybeAdd(str) {
            if (str.toUpperCase().lastIndexOf(start.toUpperCase(), 0) == 0 && !arrayContains(found, str)) found.push(str);
        }

        if (context && context.length) {
            // If this is a property, see if it belongs to some object we can
            // find in the current environment.
            var obj = context.pop(), base;
            if(typeof sparkClasses[obj.type] != 'undefined') {
                forEach(sparkClasses[obj.type], maybeAdd);
            }
        } else {
            forEach(keywords, maybeAdd);
        }
        forEach(Object.keys(sparkClasses), maybeAdd);
        return found;
    }
});
