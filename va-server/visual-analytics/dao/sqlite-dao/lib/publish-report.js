/**
 * Created by daewon.park on 2016-09-20.
 */
var common = require('./common');
var query = common.query;
var batchUpdate = common.batchUpdate;

const getQuery = require('./query-utils').getQuery;

const DDL_CHECK_TABLE_DEFAULT = common.DDL_CHECK_TABLE;

const DDL_CREATE_PUBLISH_TABLE_DEFAULT = 'CREATE TABLE brtc_report_publish ( ' +
    'publish_id character varying(80) NOT NULL, ' +
    'publishing_title character varying(200) NOT NULL, ' +
    'publishing_date timestamp without time zone NOT NULL, ' +
    'publisher character varying(80) NOT NULL, ' +
    'schedule character varying(80) , ' +
    'embed_code character varying(80) , ' +
    'link character varying(80) , ' +
    'project_id character varying(80) NOT NULL, ' +
    'model_id character varying(80) NOT NULL, ' +
    'publishing_contents text, ' +
    'CONSTRAINT brtc_report_publish_pkey PRIMARY KEY (publish_id) ) WITH ( OIDS=FALSE )';

const DDL_CREATE_PUBLISH_TABLE_SQLITE = 'CREATE TABLE brtc_report_publish ( ' +
    'publish_id character varying(80) NOT NULL, ' +
    'publishing_title character varying(200) NOT NULL, ' +
    'publishing_date timestamp without time zone NOT NULL, ' +
    'publisher character varying(80) NOT NULL, ' +
    'schedule character varying(80) , ' +
    'embed_code character varying(80) , ' +
    'url character varying(80) , ' +
    'link character varying(80) , ' +
    'project_id character varying(80) NOT NULL, ' +
    'model_id character varying(80) NOT NULL, ' +
    'publishing_contents text, ' +
    'CONSTRAINT brtc_report_publish_pkey PRIMARY KEY (publish_id) )';
const PUBLISH_CHECK_DUPLICATE_DEFAULT = 'SELECT * FROM brtc_report_publish WHERE url=$1 OR publish_id=$1';
const PUBLISH_SELECT_DEFAULT = 'SELECT * FROM brtc_report_publish WHERE publishing_title ~*$1';
const PUBLISH_SELECT_ALL_DEFAULT = 'SELECT * FROM brtc_report_publish order by publishing_date desc';
const PUBLISH_SELECT_BY_ID_DEFAULT = 'SELECT * FROM brtc_report_publish WHERE publish_id=$1';
const PUBLISH_SELECT_BY_URL_DEFAULT = 'SELECT * FROM brtc_report_publish WHERE url=$1';
const PUBLISH_CREATE_DEFAULT = 'INSERT INTO brtc_report_publish (publish_id, publishing_title, publishing_date, publisher, project_id, model_id, publishing_contents, url) VALUES ($1, $2, now(), $3, $4, $5, $6, $7)';
const PUBLISH_CREATE_SQLITE = `INSERT INTO brtc_report_publish (publish_id, publishing_title, publishing_date, publisher, project_id, model_id, publishing_contents, url) VALUES ($1, $2, datetime('now'), $3, $4, $5, $6, $7)`;
const PUBLISH_DELETE_DEFAULT = 'DELETE FROM brtc_report_publish WHERE publish_id=$1';
const PUBLISH_UPDATE_DEFAULT = 'UPDATE brtc_report_publish SET publishing_contents=$2 WHERE publish_id=$1';

const stmt = {
    DDL_CHECK_TABLE: {
        default: DDL_CHECK_TABLE_DEFAULT
    },
    DDL_CREATE_PUBLISH_TABLE: {
        default: DDL_CREATE_PUBLISH_TABLE_DEFAULT,
        sqlite: DDL_CREATE_PUBLISH_TABLE_SQLITE
    },
    PUBLISH_CHECK_DUPLICATE: {
        default: PUBLISH_CHECK_DUPLICATE_DEFAULT
    },
    PUBLISH_SELECT: {
        default: PUBLISH_SELECT_DEFAULT
    },
    PUBLISH_SELECT_ALL: {
        default: PUBLISH_SELECT_ALL_DEFAULT
    },
    PUBLISH_SELECT_BY_ID: {
        default: PUBLISH_SELECT_BY_ID_DEFAULT
    },
    PUBLISH_SELECT_BY_URL: {
        default: PUBLISH_SELECT_BY_URL_DEFAULT
    },
    PUBLISH_CREATE: {
        default: PUBLISH_CREATE_DEFAULT,
        sqlite: PUBLISH_CREATE_SQLITE
    },
    PUBLISH_DELETE: {
        default: PUBLISH_DELETE_DEFAULT
    },
    PUBLISH_UPDATE: {
        default: PUBLISH_UPDATE_DEFAULT
    }
};

const DDL_CHECK_TABLE = getQuery(stmt, 'DDL_CHECK_TABLE');
const DDL_CREATE_PUBLISH_TABLE = getQuery(stmt, 'DDL_CREATE_PUBLISH_TABLE');
const PUBLISH_CHECK_DUPLICATE = getQuery(stmt, 'PUBLISH_CHECK_DUPLICATE');
const PUBLISH_SELECT = getQuery(stmt, 'PUBLISH_SELECT');
const PUBLISH_SELECT_ALL = getQuery(stmt, 'PUBLISH_SELECT_ALL');
const PUBLISH_SELECT_BY_ID = getQuery(stmt, 'PUBLISH_SELECT_BY_ID');
const PUBLISH_SELECT_BY_URL = getQuery(stmt, 'PUBLISH_SELECT_BY_URL');
const PUBLISH_CREATE = getQuery(stmt, 'PUBLISH_CREATE');
const PUBLISH_DELETE = getQuery(stmt, 'PUBLISH_DELETE');
const PUBLISH_UPDATE = getQuery(stmt, 'PUBLISH_UPDATE');

module.exports = {
    publishreport: {
        checkSchema: function (errCallback, doneCallback) {
            query(DDL_CHECK_TABLE, ['brtc_report_publish'], errCallback, function (result) {
                if (result.length === 0) {
                    query(DDL_CREATE_PUBLISH_TABLE, [], errCallback, doneCallback);
                } else {
                    var columns = {};
                    for (var i in result) {
                        columns[result[i].column_name] = true;
                    }
                    if (!columns['url']) query('ALTER TABLE brtc_report_publish ADD COLUMN url character varying(80)', errCallback);
                    else if (doneCallback) doneCallback(result.rows, result, DDL_CHECK_TABLE, ['brtc_report_publish']);
                }
            });
        },
        checkDuplicate: function (opt, errCallback, doneCallback) {
            query(PUBLISH_CHECK_DUPLICATE, [opt.url], errCallback, doneCallback);
        },
        select: function (opt, errCallback, doneCallback) {
            query(PUBLISH_SELECT, [opt.publishing_title], errCallback, doneCallback);
        },
        selectAll: function (opt, errCallback, doneCallback) {
            query(PUBLISH_SELECT_ALL, [], errCallback, doneCallback);
        },
        selectById: function (opt, errCallback, doneCallback) {
            query(PUBLISH_SELECT_BY_ID, [opt.publish_id], errCallback, doneCallback);
        },
        selectByUrl: function (opt, errCallback, doneCallback) {
            query(PUBLISH_SELECT_BY_URL, [opt.url], errCallback, doneCallback);
        },
        create: function (opt, errCallback, doneCallback) {
            query(PUBLISH_CREATE, [opt.publish_id, opt.publishing_title, opt.publisher, opt.project_id, opt.model_id, opt.publish_contents, opt.url], errCallback, doneCallback);
        },
        update: function (opt, errCallback, doneCallback) {
            query(PUBLISH_UPDATE, [opt.publish_id, opt.publish_contents], errCallback, doneCallback);
        },
        delete: function (opt, errCallback, doneCallback) {
            query(PUBLISH_DELETE, [opt.publish_id], errCallback, doneCallback);
        },
        deleteByPublishIdList: function (opt, errCallback, doneCallback) {
            var records = [];
            var publishList = opt.publishReportList;

            for (var i = 0; i < publishList.length; i++) {
                records.push([publishList[i].publish_id]);
            }

            batchUpdate(PUBLISH_DELETE, records, errCallback, doneCallback);
        }
    }
};
