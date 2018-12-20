var pg = require('pg');
var async = require('async');
var Transaction = require('pg-transaction');
var conf = require('../../../va-conf');
var connectionUrl = conf['meta-db'].url;

var pool = new pg.Pool({
    connectionString: connectionUrl
});

const EXPIRE_TOKEN_SECOND = 86400;
const DDL_CHECK_TABLE = 'SELECT column_name, data_type FROM information_schema.columns WHERE table_name = $1';

const fnify = (fn) => fn && typeof fn === 'function' ? fn : function () { };

var query = function (sql, args, _errCallback, _doneCallback) {
    const errCallback = fnify(_errCallback);
    const doneCallback = fnify(_doneCallback);
    pool.connect(function (err, client, done) {

        var handleError = function (err) {
            if (err) {
                if (client) done(client);
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

        if (handleError(err)) return;

        client.query(sql, args, function (err, result) {
            if (handleError(err)) return;
            done();

            if (doneCallback) {
                if (result.command === 'INSERT' || result.command === 'UPDATE' || result.command === 'DELETE') {
                    doneCallback(result.rowCount, result, sql, args);
                } else {
                    doneCallback(result.rows, result, sql, args);
                }
            }
        });
    });
};

var batchUpdate = function (sql, records, errCallback, doneCallback) {
    var count = 0;
    var affected = 0;
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
            }, function (result, ...args) {
                count++;
                affected += result;
                next(null, affected);
            });
        },
        function (err, n) {
            if (err) {
                errCallback(err);
            } else {
                doneCallback(n);
            }
        }
    );
};

var transaction = function (executeCallback, _errCallback, _doneCallback) {
    const errCallback = fnify(_errCallback);
    const doneCallback = fnify(_doneCallback);
    pool.connect(function (err, client, done) {
        var handleError = function (err) {
            if (err) {
                if (client) done(client);
                errCallback({
                    code: err.code,
                    message: err.message,
                    error: err.message
                });
                return true;
            }
            return false;
        };

        if (handleError(err)) return;

        var tx = new Transaction(client);
        var result = executeCallback(tx);

        if (doneCallback) doneCallback(result);
    });
};

var getExpiredTime = function () {
    return (new Date().getTime()) / 1000 + (EXPIRE_TOKEN_SECOND);
};

if (conf['meta-db'].type === 'sqlite') {
    Object.assign(exports, require('./common-sqlite'));
} else {
    exports.DDL_CHECK_TABLE = DDL_CHECK_TABLE;
    exports.query = query;
    exports.batchUpdate = batchUpdate;
    exports.transaction = transaction;
    exports.getExpiredTime = getExpiredTime;
}


