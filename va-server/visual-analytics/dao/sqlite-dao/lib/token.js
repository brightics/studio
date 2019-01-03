var common = require('./common');
var query = common.query;
var getExpiredTime = common.getExpiredTime;

const getQuery = require('./query-utils').getQuery;
const DDL_CHECK_TABLE_DEFAULT = common.DDL_CHECK_TABLE;

const DDL_CREATE_TOKEN_USER_TABLE_DEFAULT = 'CREATE TABLE brtc_token_user ( token character varying(256) NOT NULL, user_id character varying(80), expire_date timestamp without time zone, CONSTRAINT brtc_token_user_pkey PRIMARY KEY (token) ) WITH ( OIDS=FALSE )';
const DDL_CREATE_TOKEN_USER_TABLE_SQLITE = 'CREATE TABLE brtc_token_user ( token character varying(256) NOT NULL, user_id character varying(80), expire_date timestamp without time zone, CONSTRAINT brtc_token_user_pkey PRIMARY KEY (token) ) ';
const TOKEN_USER_SELECT_BY_TOKEN_DEFAULT = 'SELECT * FROM brtc_token_user WHERE token=$1';
const TOKEN_USER_SELECT_BY_USER_ID_DEFAULT = 'SELECT * FROM brtc_token_user WHERE user_id=$1';
const TOKEN_USER_CREATE_DEFAULT = 'INSERT INTO brtc_token_user (token, user_id, expire_date) VALUES ($1, $2, to_timestamp($3))';
const TOKEN_USER_CREATE_SQLITE = 'INSERT INTO brtc_token_user (token, user_id, expire_date) VALUES ($1, $2, $3)';
const TOKEN_USER_UPDATE_DEFAULT = 'UPDATE brtc_token_user SET (token, user_id, expire_date) = ($1, $2, to_timestamp($3)) WHERE token=$4';
const TOKEN_USER_UPDATE_SQLITE = 'UPDATE brtc_token_user SET (token, user_id, expire_date) = ($1, $2, $3) WHERE token=$4';
const TOKEN_USER_UPDATE_EXPIRE_DATE_DEFAULT = 'UPDATE brtc_token_user SET (expire_date) = (to_timestamp($1)) WHERE token=$2';
const TOKEN_USER_UPDATE_EXPIRE_DATE_SQLITE = 'UPDATE brtc_token_user SET (expire_date) = ($1) WHERE token=$2';
const TOKEN_USER_DELETE_BY_TOKEN_DEFAULT = 'DELETE FROM brtc_token_user WHERE token=$1';
const TOKEN_USER_DELETE_BY_USER_ID_DEFAULT = 'DELETE FROM brtc_token_user WHERE user_id=$1';

const stmt = {
    DDL_CHECK_TABLE: {
        default: DDL_CHECK_TABLE_DEFAULT
    },
    DDL_CREATE_TOKEN_USER_TABLE: {
        default: DDL_CREATE_TOKEN_USER_TABLE_DEFAULT,
        sqlite: DDL_CREATE_TOKEN_USER_TABLE_SQLITE
    },
    TOKEN_USER_SELECT_BY_TOKEN: {
        default: TOKEN_USER_SELECT_BY_TOKEN_DEFAULT
    },
    TOKEN_USER_CREATE: {
        default: TOKEN_USER_CREATE_DEFAULT,
        sqlite: TOKEN_USER_CREATE_SQLITE
    },
    TOKEN_USER_SELECT_BY_USER_ID: {
        default: TOKEN_USER_SELECT_BY_USER_ID_DEFAULT
    },
    TOKEN_USER_UPDATE: {
        default: TOKEN_USER_UPDATE_DEFAULT,
        sqlite: TOKEN_USER_UPDATE_SQLITE
    },
    TOKEN_USER_UPDATE_EXPIRE_DATE: {
        default: TOKEN_USER_UPDATE_EXPIRE_DATE_DEFAULT,
        sqlite: TOKEN_USER_UPDATE_EXPIRE_DATE_SQLITE
    },
    TOKEN_USER_DELETE_BY_TOKEN: {
        default: TOKEN_USER_DELETE_BY_TOKEN_DEFAULT
    },
    TOKEN_USER_DELETE_BY_USER_ID: {
        default: TOKEN_USER_DELETE_BY_USER_ID_DEFAULT
    }
};

const DDL_CHECK_TABLE = getQuery(stmt, 'DDL_CHECK_TABLE');
const DDL_CREATE_TOKEN_USER_TABLE = getQuery(stmt, 'DDL_CREATE_TOKEN_USER_TABLE');
const TOKEN_USER_SELECT_BY_TOKEN = getQuery(stmt, 'TOKEN_USER_SELECT_BY_TOKEN');
const TOKEN_USER_CREATE = getQuery(stmt, 'TOKEN_USER_CREATE');
const TOKEN_USER_SELECT_BY_USER_ID = getQuery(stmt, 'TOKEN_USER_SELECT_BY_USER_ID');
const TOKEN_USER_UPDATE = getQuery(stmt, 'TOKEN_USER_UPDATE');
const TOKEN_USER_UPDATE_EXPIRE_DATE = getQuery(stmt, 'TOKEN_USER_UPDATE_EXPIRE_DATE');
const TOKEN_USER_DELETE_BY_TOKEN = getQuery(stmt, 'TOKEN_USER_DELETE_BY_TOKEN');
const TOKEN_USER_DELETE_BY_USER_ID = getQuery(stmt, 'TOKEN_USER_DELETE_BY_USER_ID');

module.exports = {
    token: {
        user: {
            checkSchema: function (errCallback, doneCallback) {
                query(DDL_CHECK_TABLE, ['brtc_token_user'], errCallback, function (result) {
                    if (result.length === 0) {
                        query(DDL_CREATE_TOKEN_USER_TABLE, [], errCallback, doneCallback);
                    } else {
                        var columns = {};
                        for (var i in result) {
                            columns[result[i].column_name] = true;
                        }
                        if (!columns['token']) query('ALTER TABLE brtc_token_user ADD COLUMN token character varying(256)', errCallback);
                        if (!columns['user_id']) query('ALTER TABLE brtc_token_user ADD COLUMN user_id character varying(80)', errCallback);
                        if (!columns['expire_date']) query('ALTER TABLE brtc_token_user ADD COLUMN expire_date date ', errCallback);

                        // 서버 재시작 시 토큰 초기화
                        // query('DELETE FROM brtc_token_user', errCallback);

                        if (doneCallback) doneCallback();
                    }
                });
            },
            selectByToken: function (opt, errCallback, doneCallback) {
                query(TOKEN_USER_SELECT_BY_TOKEN, [opt.token], errCallback, doneCallback);
            },
            selectByUserId: function (opt, errCallback, doneCallback) {
                query(TOKEN_USER_SELECT_BY_USER_ID, [opt.userId], errCallback, doneCallback);
            },
            create: function (opt, errCallback, doneCallback) {
                query(TOKEN_USER_CREATE, [opt.token, opt.userId, getExpiredTime()], errCallback, doneCallback);
            },
            update: function (opt, errCallback, doneCallback) {
                query(TOKEN_USER_UPDATE, [opt.newToken, opt.userId, getExpiredTime(), opt.token], errCallback, doneCallback);
            },
            updateExpireDate: function (opt, errCallback, doneCallback) {
                query(TOKEN_USER_UPDATE_EXPIRE_DATE, [getExpiredTime(), opt.token], errCallback, doneCallback);
            },
            deleteByToken: function (opt, errCallback, doneCallback) {
                query(TOKEN_USER_DELETE_BY_TOKEN, [opt.token], errCallback, doneCallback);
            },
            deleteByUserId: function (opt, errCallback, doneCallback) {
                query(TOKEN_USER_DELETE_BY_USER_ID, [opt.userId], errCallback, doneCallback);
            }
        }
    }
};
