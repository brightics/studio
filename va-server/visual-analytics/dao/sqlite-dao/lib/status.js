var common = require('./common');

const getQuery = require('./query-utils').getQuery;
var query = common.query;
const DDL_CHECK_TABLE_DEFAULT = common.DDL_CHECK_TABLE;

const DDL_CREATE_USER__STATUS_TABLE_DEFAULT = 'CREATE TABLE brtc_user_status ( id character varying(80) NOT NULL, last_login_time timestamp without time zone, last_password_time timestamp without time zone, temp_password_flag boolean, token character varying(80), user_ip character varying(80), CONSTRAINT brtc_user_status_pkey PRIMARY KEY (id) ) WITH ( OIDS=FALSE )';
const DDL_CREATE_USER__STATUS_TABLE_SQLITE = 'CREATE TABLE brtc_user_status ( id character varying(80) NOT NULL, last_login_time timestamp without time zone, last_password_time timestamp without time zone, temp_password_flag boolean, token character varying(80), user_ip character varying(80), CONSTRAINT brtc_user_status_pkey PRIMARY KEY (id) )';
const USER_STATUS_SELECT_BY_USER_ID_DEFAULT = 'SELECT * FROM brtc_user_status WHERE id=$1';
const USER_STATUS_SELECT_BY_USER_ID_AND_TOKEN_DEFAULT = 'SELECT * FROM brtc_user_status WHERE id=$1 AND token =$2';
const USER_STATUS_CREATE_DEFAULT = 'INSERT INTO brtc_user_status (id, last_login_time, last_password_time, temp_password_flag) VALUES ($1, now(), now(), false)';
const USER_STATUS_CREATE_SQLITE = `INSERT INTO brtc_user_status (id, last_login_time, last_password_time, temp_password_flag) VALUES ($1, datetime('now'), datetime('now'), false)`;
const USER_STATUS_UPDATE_TOKEN_DEFAULT = 'UPDATE brtc_user_status SET (token) = ($2) WHERE id=$1';
const USER_STATUS_UPDATE_LOGIN_TIME_DEFAULT = 'UPDATE brtc_user_status SET (last_login_time) = (now()) WHERE id=$1';
const USER_STATUS_UPDATE_LOGIN_TIME_SQLITE = `UPDATE brtc_user_status SET (last_login_time) = (datetime('now')) WHERE id=$1`;
const USER_STATUS_UPDATE_PASSWORD_TIME_DEFAULT = 'UPDATE brtc_user_status SET (last_password_time, temp_password_flag) = (now(), $2) WHERE id=$1';
const USER_STATUS_UPDATE_PASSWORD_TIME_SQLITE = `UPDATE brtc_user_status SET (last_password_time, temp_password_flag) = (datetime('now'), $2) WHERE id=$1`;
const USER_STATUS_UPDATE_TEMP_PASSWORD_FLAG_DEFAULT = 'UPDATE brtc_user_status SET (temp_password_flag) = ($2) WHERE id=$1';
const USER_STATUS_UPDATE_USER_IP_DEFAULT = 'UPDATE brtc_user_status SET (user_ip) = ($1) WHERE id=$2';
const USER_STATUS_DELETE_DEFAULT = 'DELETE FROM brtc_user_status WHERE id=$1';
const USER_STATUS_INSERT_DEFAULT = 'INSERT INTO brtc_user_status (id, last_login_time, last_password_time) SELECT id, now(), now() FROM brtc_user';
const USER_STATUS_INSERT_SQLITE = `INSERT INTO brtc_user_status (id, last_login_time, last_password_time) SELECT id, datetime('now'), datetime('now') FROM brtc_user`;


const stmt = {
    DDL_CHECK_TABLE: {
        default: DDL_CHECK_TABLE_DEFAULT
    },
    DDL_CREATE_USER__STATUS_TABLE: {
        default: DDL_CREATE_USER__STATUS_TABLE_DEFAULT,
        sqlite: DDL_CREATE_USER__STATUS_TABLE_SQLITE
    },
    USER_STATUS_SELECT_BY_USER_ID: {
        default: USER_STATUS_SELECT_BY_USER_ID_DEFAULT
    },
    USER_STATUS_SELECT_BY_USER_ID_AND_TOKEN: {
        default: USER_STATUS_SELECT_BY_USER_ID_AND_TOKEN_DEFAULT
    },
    USER_STATUS_CREATE: {
        default: USER_STATUS_CREATE_DEFAULT,
        sqlite: USER_STATUS_CREATE_SQLITE
    },
    USER_STATUS_UPDATE_TOKEN: {
        default: USER_STATUS_UPDATE_TOKEN_DEFAULT
    },
    USER_STATUS_UPDATE_LOGIN_TIME: {
        default: USER_STATUS_UPDATE_LOGIN_TIME_DEFAULT,
        sqlite: USER_STATUS_UPDATE_LOGIN_TIME_SQLITE
    },
    USER_STATUS_UPDATE_PASSWORD_TIME: {
        default: USER_STATUS_UPDATE_PASSWORD_TIME_DEFAULT,
        sqlite: USER_STATUS_UPDATE_PASSWORD_TIME_SQLITE
    },
    USER_STATUS_UPDATE_TEMP_PASSWORD_FLAG: {
        default: USER_STATUS_UPDATE_TEMP_PASSWORD_FLAG_DEFAULT
    },
    USER_STATUS_UPDATE_USER_IP: {
        default: USER_STATUS_UPDATE_USER_IP_DEFAULT
    },
    USER_STATUS_DELETE: {
        default: USER_STATUS_DELETE_DEFAULT
    },
    USER_STATUS_INSERT: {
        default: USER_STATUS_INSERT_DEFAULT,
        sqlite: USER_STATUS_INSERT_SQLITE
    }
};

const DDL_CHECK_TABLE = getQuery(stmt, 'DDL_CHECK_TABLE');
const DDL_CREATE_USER__STATUS_TABLE = getQuery(stmt, 'DDL_CREATE_USER__STATUS_TABLE');
const USER_STATUS_SELECT_BY_USER_ID = getQuery(stmt, 'USER_STATUS_SELECT_BY_USER_ID');
const USER_STATUS_SELECT_BY_USER_ID_AND_TOKEN = getQuery(stmt, 'USER_STATUS_SELECT_BY_USER_ID_AND_TOKEN');
const USER_STATUS_CREATE = getQuery(stmt, 'USER_STATUS_CREATE');
const USER_STATUS_UPDATE_TOKEN = getQuery(stmt, 'USER_STATUS_UPDATE_TOKEN');
const USER_STATUS_UPDATE_LOGIN_TIME = getQuery(stmt, 'USER_STATUS_UPDATE_LOGIN_TIME');
const USER_STATUS_UPDATE_PASSWORD_TIME = getQuery(stmt, 'USER_STATUS_UPDATE_PASSWORD_TIME');
const USER_STATUS_UPDATE_TEMP_PASSWORD_FLAG = getQuery(stmt, 'USER_STATUS_UPDATE_TEMP_PASSWORD_FLAG');
const USER_STATUS_UPDATE_USER_IP = getQuery(stmt, 'USER_STATUS_UPDATE_USER_IP');
const USER_STATUS_DELETE = getQuery(stmt, 'USER_STATUS_DELETE');
const USER_STATUS_INSERT = getQuery(stmt, 'USER_STATUS_INSERT');

module.exports = {
    status: {
        user: {
            checkSchema: function (errCallback, doneCallback) {
                query(DDL_CHECK_TABLE, ['brtc_user_status'], errCallback, function (result) {
                    if (result.length == 0) {
                        query(DDL_CREATE_USER__STATUS_TABLE, [], errCallback, function () {
                            query(USER_STATUS_INSERT, [], errCallback, doneCallback);
                        });
                    } else {
                        var columns = {};
                        for (var i in result) {
                            columns[result[i].column_name] = true;
                        }
                        if (!columns['id']) query('ALTER TABLE brtc_user_status ADD COLUMN id character varying(80)', errCallback);
                        if (!columns['last_login_time']) query('ALTER TABLE brtc_user_status ADD COLUMN last_login_time timestamp without time zone', errCallback);
                        if (!columns['last_password_time']) query('ALTER TABLE brtc_user_status ADD COLUMN last_password_time timestamp without time zone', errCallback);
                        if (!columns['temp_password_flag']) query('ALTER TABLE brtc_user_status ADD COLUMN temp_password_flag boolean', errCallback);
                        if (!columns['token']) query('ALTER TABLE brtc_user_status ADD COLUMN token character varying(80)', errCallback);
                        if (!columns['user_ip']) query('ALTER TABLE brtc_user_status ADD COLUMN user_ip character varying(80)', errCallback);

                        if (doneCallback) doneCallback();
                    }
                });
            },
            selectById: function (opt, errCallback, doneCallback) {
                query(USER_STATUS_SELECT_BY_USER_ID, [opt.id], errCallback, doneCallback);
            },
            selectByIdAndToken: function (opt, errCallback, doneCallback) {
                query(USER_STATUS_SELECT_BY_USER_ID_AND_TOKEN, [opt.id, opt.token], errCallback, doneCallback);
            },
            create: function (opt, errCallback, doneCallback) {
                query(USER_STATUS_CREATE, [opt.id], errCallback, doneCallback);
            },
            updateToken: function (opt, errCallback, doneCallback) {
                query(USER_STATUS_UPDATE_TOKEN, [opt.id, opt.token], errCallback, doneCallback);
            },
            updateLoginTime: function (opt, errCallback, doneCallback) {
                query(USER_STATUS_UPDATE_LOGIN_TIME, [opt.id], errCallback, doneCallback);
            },
            updatePasswordTime: function (opt, errCallback, doneCallback) {
                query(USER_STATUS_UPDATE_PASSWORD_TIME, [opt.id, opt.temp_password_flag], errCallback, doneCallback);
            },
            updateTempPasswordFlag: function (opt, errCallback, doneCallback) {
                query(USER_STATUS_UPDATE_TEMP_PASSWORD_FLAG, [opt.id, opt.temp_password_flag], errCallback, doneCallback);
            },
            updateUserIp: function (opt, errCallback, doneCallback) {
                query(USER_STATUS_UPDATE_USER_IP, [opt.ip, opt.id], errCallback, doneCallback);
            },
            delete: function (opt, errCallback, doneCallback) {
                query(USER_STATUS_DELETE, [opt.id], errCallback, doneCallback);
            }
        }
    }
};
