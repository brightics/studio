var common = require('./common');
const getQuery = require('./query-utils').getQuery;
const DDL_CHECK_TABLE_DEFAULT = common.DDL_CHECK_TABLE;
var query = common.query;
var batchUpdate = common.batchUpdate;

const DDL_CREATE_NOTICE_TABLE_DEFAULT = 'CREATE TABLE brtc_notice ( id character varying(80) NOT NULL, title character varying(200) NOT NULL, content text, creator character varying(80), create_time timestamp without time zone, updater character varying(80), update_time timestamp without time zone, hits integer, CONSTRAINT brtc_notice_pkey PRIMARY KEY (id) ) WITH (OIDS=FALSE)';
const DDL_CREATE_NOTICE_TABLE_SQLITE = 'CREATE TABLE brtc_notice ( id character varying(80) NOT NULL, title character varying(200) NOT NULL, content text, creator character varying(80), create_time timestamp without time zone, updater character varying(80), update_time timestamp without time zone, hits integer, CONSTRAINT brtc_notice_pkey PRIMARY KEY (id) )';

const NOTICE_SELECT_ALL_DEFAULT = 'SELECT * FROM brtc_notice order by update_time desc, create_time desc';
const NOTICE_SELECT_BY_ID_DEFAULT = 'SELECT * FROM brtc_notice WHERE id=$1';
const NOTICE_CREATE_DEFAULT = 'INSERT INTO brtc_notice (id, title, content, creator, create_time, update_time, hits) VALUES ($1, $2, $3, $4, now(), now(), 0)';
const NOTICE_CREATE_SQLITE = `INSERT INTO brtc_notice (id, title, content, creator, create_time, update_time, hits) VALUES ($1, $2, $3, $4, datetime('now'), datetime('now'), 0)`;
const NOTICE_UPDATE_DEFAULT = 'UPDATE brtc_notice SET (title, content, updater, update_time) = ($1, $2, $3, now()) WHERE id=$4';
const NOTICE_UPDATE_SQLITE = `UPDATE brtc_notice SET (title, content, updater, update_time) = ($1, $2, $3, datetime('now')) WHERE id=$4`;
const NOTICE_UPDATE_HITS_DEFAULT = 'UPDATE brtc_notice SET (hits) = ($1) WHERE id=$2';
const NOTICE_DELETE_DEFAULT = 'DELETE FROM brtc_notice WHERE id=$1';

const stmt = {
    DDL_CHECK_TABLE: {
        default: DDL_CHECK_TABLE_DEFAULT
    },
    DDL_CREATE_NOTICE_TABLE: {
        default: DDL_CREATE_NOTICE_TABLE_DEFAULT,
        sqlite: DDL_CREATE_NOTICE_TABLE_SQLITE
    },
    NOTICE_SELECT_ALL: {
        default: NOTICE_SELECT_ALL_DEFAULT
    },
    NOTICE_SELECT_BY_ID: {
        default: NOTICE_SELECT_BY_ID_DEFAULT
    },
    NOTICE_CREATE: {
        default: NOTICE_CREATE_DEFAULT,
        sqlite: NOTICE_CREATE_SQLITE
    },
    NOTICE_UPDATE: {
        default: NOTICE_UPDATE_DEFAULT,
        sqlite: NOTICE_UPDATE_SQLITE
    },
    NOTICE_UPDATE_HITS: {
        default: NOTICE_UPDATE_HITS_DEFAULT
    },
    NOTICE_DELETE: {
        default: NOTICE_DELETE_DEFAULT
    }
};

const DDL_CHECK_TABLE = getQuery(stmt, 'DDL_CHECK_TABLE');
const DDL_CREATE_NOTICE_TABLE = getQuery(stmt, 'DDL_CREATE_NOTICE_TABLE');
const NOTICE_SELECT_ALL = getQuery(stmt, 'NOTICE_SELECT_ALL');
const NOTICE_SELECT_BY_ID = getQuery(stmt, 'NOTICE_SELECT_BY_ID');
const NOTICE_CREATE = getQuery(stmt, 'NOTICE_CREATE');
const NOTICE_UPDATE = getQuery(stmt, 'NOTICE_UPDATE');
const NOTICE_UPDATE_HITS = getQuery(stmt, 'NOTICE_UPDATE_HITS');
const NOTICE_DELETE = getQuery(stmt, 'NOTICE_DELETE');

module.exports = {
    notice: {
        checkSchema: function (errCallback, doneCallback) {
            query(DDL_CHECK_TABLE, ['brtc_notice'], errCallback, function (result) {
                if (result.length == 0) {
                    query(DDL_CREATE_NOTICE_TABLE, [], errCallback, doneCallback);
                } else {
                    if (doneCallback) doneCallback(result.rows, result, DDL_CHECK_TABLE, ['brtc_notice']);
                }
            });
        },
        selectAll: function (opt, errCallback, doneCallback) {
            query(NOTICE_SELECT_ALL, [], errCallback, doneCallback);
        },
        selectById: function (opt, errCallback, doneCallback) {
            query(NOTICE_SELECT_BY_ID, [opt.id], errCallback, doneCallback);
        },
        create: function (opt, errCallback, doneCallback) {
            query(NOTICE_CREATE, [opt.id, opt.title, opt.content, opt.creator], errCallback, doneCallback);
        },
        update: function (opt, errCallback, doneCallback) {
            query(NOTICE_UPDATE, [opt.title, opt.content, opt.updater, opt.id], errCallback, doneCallback);
        },
        updateHits: function (opt, errCallback, doneCallback) {
            query(NOTICE_UPDATE_HITS, [opt.hits, opt.id], errCallback, doneCallback);
        },
        delete: function (opt, errCallback, doneCallback) {
            query(NOTICE_DELETE, [opt.id], errCallback, doneCallback);
        },
        deleteByNoticeList: function (opt, errCallback, doneCallback) {
            var records = [];
            var noticeList = opt.noticeList;
            for (var i = 0; i < noticeList.length; i++) {
                records.push([noticeList[i].id]);
            }
            batchUpdate(NOTICE_DELETE, records, errCallback, doneCallback);
        }
    }
};
