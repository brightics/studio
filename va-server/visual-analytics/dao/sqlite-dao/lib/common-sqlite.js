var async = require('async');
var sqlite3 = require('sqlite3').verbose();
var conf = require('../../../va-conf');
var dbInfo = conf['meta-db'];

const EXPIRE_TOKEN_SECOND = 86400;
const DDL_CHECK_TABLE = 'pragma table_info($1)';

var db = new sqlite3.Database(dbInfo.url);

var getExpiredTime = function () {
    return (new Date().getTime()) / 1000 + (EXPIRE_TOKEN_SECOND);
};

const transformSql = (sql, _args) => {
    const q = sql + ' ';
    const len = q.length;
    let args = new Array(_args.length);
    let ret = [];
    let state = 0;
    let num = 0;
    let cnt = 0;
    const nxtNum = (index, num) => index >= 0 ? num * 10 + index : num;
    for (let i = 0; i < len; ++i) {
        const index = '0123456789'.indexOf(q[i]);
        if (q[i] === '$') {
            state = 1;
            ret.push('?');
            num = 0;
        } else if (state === 1) {
            num = nxtNum(index, num);
        }
        if (q[i] !== '$' && index === -1) {
            if (state === 1) args[cnt++] = _args[parseInt(num - 1)];
            state = 0;
            ret.push(q[i]);
        }
        if (state === 0 && index >= 0) ret.push(q[i]);
    }

    return [ret.join(''), args];
};

const fnify = (fn) => fn && typeof fn === 'function' ? fn : function () { };
const ddlCheckQuery = (sql, rep) => {
    return sql === DDL_CHECK_TABLE ? sql.replace('$1', rep) : sql;
};

const stringify = (o) => typeof o === 'object' ? JSON.stringify(o) : o;

var query = function (__sql, _args, _errCallback, _doneCallback) {
    const errCallback = fnify(_errCallback);
    const doneCallback = fnify(_doneCallback);
    const _sql = ddlCheckQuery(__sql, _args[0]);
    // const _sql = __sql === DDL_CHECK_TABLE ? __sql.replace('$1', _args[0]) : __sql;
    // const ret = [];
    // const args = genArr(_args.length, 0);//new Array(_args.length);
    // {
    //     const q = _sql + ' ';
    //     const len = q.length;
    //     let state = 0;
    //     let num = 0;
    //     let cnt = 0;
    //     for (let i = 0; i < len; ++i) {
    //         const index = '0123456789'.indexOf(q[i]);
    //         if (q[i] === '$') {
    //             state = 1;
    //             ret.push('?');
    //             num = 0;
    //         } else if (state === 1) {
    //             if (index >= 0) {
    //                 num *= 10;
    //                 num += index;
    //             }
    //         }
    //         if (q[i] !== '$' && index === -1) {
    //             if (state === 1) args[cnt++] = _args[parseInt(num - 1)];
    //             state = 0;
    //             ret.push(q[i]);
    //         }
    //         if (state === 0 && index >= 0) ret.push(q[i]);
    //     }
    // }
    // const sql = ret.join('');
    const [sql, args] = transformSql(_sql, _args);
    let type = '';
    if (__sql.trim() === DDL_CHECK_TABLE.trim()) {
        type = 'ddl_check';
    }

    const convert = (data, t) => {
        if (type === 'ddl_check') {
            if (!data) return undefined;
            const res = data.map((d) => {
                return Object.assign({ column_name: d.name }, d);
            });
            return [res, { rows: res, rowCount: res.length }, sql, args];
        }
        if (Array.isArray(data)) {
            return [data, {
                rows: data,
                rowCount: data.length
            }, sql, args];
        }
        return [data, data, sql, args];
    };

    const handleError = function (err) {
        if (err) {
            errCallback({
                code: err.code,
                message: err.message,
                error: err.message,
                query: sql
            });
            return true;
        }
        return false;
    };

    db.all(sql, args.map(stringify), (err, result) => {
        if (handleError(err)) return;
        if (err) {
            console.log(sql);
            console.error(err);
        }
        doneCallback(...convert(result, type));
    });
};

var batchUpdate = function (sql, records, errCallback, doneCallback) {
    var count = 0;
    var affected = 0;
    const handleError = function (err) {
        if (err) {
            if (errCallback) {
                errCallback({
                    code: err.code,
                    message: err.message,
                    error: err.message,
                    query: sql
                });
            }
            return true;
        }
        return false;
    };
    async.whilst(
        function () {
            return count < records.length;
        },
        function (next) {
            query(sql, records[count], function (err) {
                // 실패하는 경우가 있을까? 일단 없다고 가정하고 진행하자. by daewon.park
                count++;
                console.log(err);
                next(null, affected);
            }, function (result) {
                count++;
                affected += result;
                next(null, affected);
            });
        },
        function (err, n) {
            if (handleError(err)) return;
            if (doneCallback) doneCallback(n);
        }
    );
};

exports.query = query;
exports.getExpiredTime = getExpiredTime;
exports.DDL_CHECK_TABLE = DDL_CHECK_TABLE;
exports.batchUpdate = batchUpdate;
