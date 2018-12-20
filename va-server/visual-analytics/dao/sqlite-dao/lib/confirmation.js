var common = require('./common');

const getQuery = require('./query-utils').getQuery;
var query = common.query;

const DDL_CHECK_TABLE_DEFAULT = common.DDL_CHECK_TABLE;

const DDL_CREATE_CONFIRMATION_USER_TABLE_DEFAULT = 'CREATE TABLE brtc_confirmation_user ( user_id character varying(80) NOT NULL, confirmation_token character varying(256), confirmation_sent_at timestamp without time zone, password character varying(10000), name character varying(80), email character varying(80), CONSTRAINT brtc_confirmation_user_pkey PRIMARY KEY (user_id)) WITH (OIDS=FALSE)';

const DDL_CREATE_CONFIRMATION_USER_TABLE_SQLITE = 'CREATE TABLE brtc_confirmation_user ( user_id character varying(80) NOT NULL, confirmation_token character varying(256), confirmation_sent_at timestamp without time zone, password character varying(10000), name character varying(80), email character varying(80), CONSTRAINT brtc_confirmation_user_pkey PRIMARY KEY (user_id))';

const CONFIRMATION_USER_SELECT_BY_USER_ID_DEFAULT = 'SELECT * FROM brtc_confirmation_user WHERE user_id=$1';

const CONFIRMATION_USER_SELECT_BY_USER_ID_AND_TOKEN_DEFAULT = 'SELECT * FROM brtc_confirmation_user WHERE user_id=$1 AND confirmation_token=$2';

const CONFIRMATION_USER_CREATE_DEFAULT = 'INSERT INTO brtc_confirmation_user (user_id, password, name, email, confirmation_token, confirmation_sent_at) VALUES ($1, $2, $3, $4, $5, now())';

const CONFIRMATION_USER_CREATE_SQLITE = `INSERT INTO brtc_confirmation_user (user_id, password, name, email, confirmation_token, confirmation_sent_at) VALUES ($1, $2, $3, $4, $5, datetime('now')`;

const CONFIRMATION_USER_DELETE_BY_USER_ID_DEFAULT = 'DELETE FROM brtc_confirmation_user WHERE user_id=$1';

const queryStmt = {
    DDL_CHECK_TABLE: {
        default: DDL_CHECK_TABLE_DEFAULT
    },
    DDL_CREATE_CONFIRMATION_USER_TABLE: {
        default: DDL_CREATE_CONFIRMATION_USER_TABLE_DEFAULT,
        sqlite: DDL_CREATE_CONFIRMATION_USER_TABLE_SQLITE
    },
    CONFIRMATION_USER_SELECT_BY_USER_ID: {
        default: CONFIRMATION_USER_SELECT_BY_USER_ID_DEFAULT
    },
    CONFIRMATION_USER_SELECT_BY_USER_ID_AND_TOKEN: {
        default: CONFIRMATION_USER_SELECT_BY_USER_ID_AND_TOKEN_DEFAULT
    },
    CONFIRMATION_USER_CREATE: {
        default: CONFIRMATION_USER_CREATE_DEFAULT,
        sqlite: CONFIRMATION_USER_CREATE_SQLITE
    },
    CONFIRMATION_USER_DELETE_BY_USER_ID: {
        default: CONFIRMATION_USER_DELETE_BY_USER_ID_DEFAULT
    }
};

const DDL_CHECK_TABLE = getQuery(queryStmt, 'DDL_CHECK_TABLE');
const DDL_CREATE_CONFIRMATION_USER_TABLE = getQuery(queryStmt, 'DDL_CREATE_CONFIRMATION_USER_TABLE');
const CONFIRMATION_USER_SELECT_BY_USER_ID = getQuery(queryStmt, 'CONFIRMATION_USER_SELECT_BY_USER_ID');
const CONFIRMATION_USER_SELECT_BY_USER_ID_AND_TOKEN =
    getQuery(queryStmt, 'CONFIRMATION_USER_SELECT_BY_USER_ID_AND_TOKEN');
const CONFIRMATION_USER_CREATE = getQuery(queryStmt, 'CONFIRMATION_USER_CREATE');
const CONFIRMATION_USER_DELETE_BY_USER_ID = getQuery(queryStmt, 'CONFIRMATION_USER_DELETE_BY_USER_ID');

module.exports = {
    confirmation: {
        user: {
            checkSchema: function (errCallback, doneCallback) {
                query(DDL_CHECK_TABLE, ['brtc_confirmation_user'], errCallback, function (result) {
                    if (result.length === 0) {
                        query(DDL_CREATE_CONFIRMATION_USER_TABLE, [], errCallback, doneCallback);
                        return;
                    }
                    var columns = {};
                    for (var i in result) {
                        columns[result[i].column_name] = true;
                    }
                    if (!columns['user_id']) query('ALTER TABLE brtc_confirmation_user ADD COLUMN user_id character varying(80)', errCallback);
                    if (!columns['confirmation_token']) query('ALTER TABLE brtc_confirmation_user ADD COLUMN confirmation_token character varying(256)', errCallback);
                    if (!columns['confirmation_status']) query('ALTER TABLE brtc_confirmation_user ADD COLUMN confirmation_status character varying(5)', errCallback);
                    if (!columns['confirmed_at']) query('ALTER TABLE brtc_confirmation_user ADD COLUMN confirmed_at timestamp', errCallback);
                    if (!columns['confirmation_sent_at']) query('ALTER TABLE brtc_confirmation_user ADD COLUMN confirmation_sent_at timestamp', errCallback);
                    if (!columns['password']) query('ALTER TABLE brtc_confirmation_user ADD COLUMN password character varying(10000) ', errCallback);
                    if (!columns['name']) query('ALTER TABLE brtc_confirmation_user ADD COLUMN name character varying(80)', errCallback);
                    if (!columns['email']) query('ALTER TABLE brtc_confirmation_user ADD COLUMN email character varying(80);', errCallback);

                    if (doneCallback) doneCallback();
                });
            },
            selectById: function (opt, errCallback, doneCallback) {
                query(CONFIRMATION_USER_SELECT_BY_USER_ID, [opt.userId], errCallback, doneCallback);
            },
            selectByIdAndToken: function (opt, errCallback, doneCallback) {
                query(CONFIRMATION_USER_SELECT_BY_USER_ID_AND_TOKEN, [opt.userId, opt.confirmationToken], errCallback, doneCallback);
            },
            create: function (opt, errCallback, doneCallback) {
                query(CONFIRMATION_USER_CREATE, [opt.userId, opt.password, opt.name, opt.email, opt.confirmationToken], errCallback, doneCallback);
            },
            deleteByUserId: function (opt, errCallback, doneCallback) {
                query(CONFIRMATION_USER_DELETE_BY_USER_ID, [opt.userId], errCallback, doneCallback);
            }
        }
    }
};
