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


async function db_all(query, args){
    return new Promise(function(resolve,reject){
        db.all(query, args, function(err,rows){
            if(err){return reject(err);}
            resolve(rows);
        });
    });
}

var query = async function (__sql, _args, _errCallback, _doneCallback) {
    const errCallback = fnify(_errCallback);
    const doneCallback = fnify(_doneCallback);
    const _sql = ddlCheckQuery(__sql, _args[0]);
    const [sql, args] = transformSql(_sql, _args);
    let type = '';
    if (__sql.trim() === DDL_CHECK_TABLE.trim()) {
        type = 'ddl_check';
    }

    const convert = (data) => {
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

    try {
        const result = await db_all(sql, args.map(stringify));
        doneCallback(...convert(result));
    }catch (err) {
        handleError(err);
    }
};

var batchUpdate = async function (sql, records, errCallback, doneCallback) {
    const _errCallback = fnify(errCallback);
    const _doneCallback = fnify(doneCallback);
    let doneCount = 0;

    const jobs = records.map(async record => {
        try {
            await query(sql, record, function (err) {
                doneCount++;
                console.error(err);
            }, function (result) {
                doneCount++;
            });
        } catch(err) {
            console.error(err.message);
        }
    });

    try {
        await Promise.all(jobs); //TODO:: Promise.allSettled 로 변경 필요, 현재는 Babel 버전이 맞지 않음
        _doneCallback(doneCount);
    } catch (err) {
        _errCallback(err.message, err, sql, records);
    } finally {
        if (doneCount === records.length) {
            console.log(`${records.length} records successful : ${sql}`);
        } else {
            console.error(`Only ${doneCount} of ${records.length} records succeeded : ${sql}`);
        }
    }
};

exports.query = query;
exports.getExpiredTime = getExpiredTime;
exports.DDL_CHECK_TABLE = DDL_CHECK_TABLE;
exports.batchUpdate = batchUpdate;
