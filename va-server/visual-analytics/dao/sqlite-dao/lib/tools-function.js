var common = require('./common');

const getQuery = require('./query-utils').getQuery;
const DDL_CHECK_TABLE_DEFAULT = common.DDL_CHECK_TABLE;
var query = common.query;
const IDGenerator = require('../../../lib/tools/idgenerator');

/**
 * 모델 버젼 관리 추가로 인해 from_version 추가
 */
const DDL_CREATE_TOOLS_FUNCTION_TABLE_DEFAULT = '' +
    'CREATE TABLE brtc_tools_function ( id character varying(80) NOT NULL, ' +
    '                         tools_project_id character varying(80), label character varying(80) NOT NULL, ' +
    '                         contents text, ' +
    '                         description text, ' +
    '                         creator character varying(80), ' +
    '                         create_time timestamp without time zone, ' +
    '                         updater character varying(80), ' +
    '                         update_time timestamp without time zone, ' +
    '                         event_key character varying(40), ' +
    '                         type character varying(40), ' +
    '                         version_id character varying(80), ' +
    '                         CONSTRAINT brtc_tools_function_pkey PRIMARY KEY (id) ) WITH ( OIDS=FALSE )';
const DDL_CREATE_TOOLS_FUNCTION_TABLE_SQLITE = '' +
    'CREATE TABLE brtc_tools_function ( id character varying(80) NOT NULL, ' +
    '                         tools_project_id character varying(80), label character varying(80) NOT NULL, ' +
    '                         contents text, ' +
    '                         description text, ' +
    '                         creator character varying(80), ' +
    '                         create_time timestamp without time zone, ' +
    '                         updater character varying(80), ' +
    '                         update_time timestamp without time zone, ' +
    '                         event_key character varying(40), ' +
    '                         type character varying(40), ' +
    '                         version_id character varying(80), ' +
    '                         CONSTRAINT brtc_tools_function_pkey PRIMARY KEY (id) )';

const TOOLS_FUNCTION_SELECT_BY_PROJECT_DEFAULT = 'SELECT * FROM brtc_tools_function WHERE tools_project_id=$1 ORDER BY label';
const TOOLS_FUNCTION_SELECT_BY_ID_DEFAULT = 'SELECT * FROM brtc_tools_function WHERE id=$1 AND tools_project_id=$2';
const TOOLS_FUNCTION_SELECT_BY_FILE_DEFAULT = 'SELECT * FROM brtc_tools_function WHERE tools_project_id = (SELECT tools_project_id FROM brtc_tools_function WHERE id=$1 )';
const TOOLS_FUNCTION_CREATE_DEFAULT = '' +
    'INSERT INTO brtc_tools_function (id, tools_project_id, label, contents, description, creator, create_time, updater, update_time, event_key, type) ' +
    '       VALUES ($1, $2, $3, $4, $5, $6, now(), $7, now(), to_char(current_timestamp, \'YYMMDD_HH24MISS_US\'), $8)';
const TOOLS_FUNCTION_CREATE_SQLITE = `
    INSERT INTO brtc_tools_function(id, tools_project_id, label,
        contents, description, creator, create_time, updater, update_time, event_key, type)
           VALUES ($1, $2, $3, $4, $5, $6, datetime('now'), $7, datetime('now'),
           strftime('%Y_%H%M%f', current_timestamp), $8)`;
const TOOLS_FUNCTION_UPDATE_DEFAULT = '' +
    'UPDATE brtc_tools_function ' +
    '   SET (label, contents, description, updater, update_time, event_key, type) = ($1, $2, $3, $4, now(), to_char(current_timestamp, \'YYMMDD_HH24MISS_US\'), $5) ' +
    ' WHERE id=$6 AND tools_project_id=$7 AND (event_key=$8 OR event_key IS NULL)';
const TOOLS_FUNCTION_UPDATE_SQLITE = `
    UPDATE brtc_tools_function 
       SET (label, contents, description, updater, update_time, event_key, type) = ($1, $2, $3, $4, datetime('now'), strftime('%Y_%H%M%f', current_timestamp), $5) 
     WHERE id=$6 AND tools_project_id=$7 AND (event_key=$8 OR event_key IS NULL)`;
const TOOLS_FUNCTION_DELETE_DEFAULT = 'DELETE FROM brtc_tools_function WHERE id=$1 AND tools_project_id=$2';
const TOOLS_FUNCTION_DELETE_BY_PROJECTID_DEFAULT = 'DELETE FROM brtc_tools_function WHERE tools_project_id=$1';
const TOOLS_FUNCTION_SELECT_BY_CREATOR_DEFAULT = 'SELECT * FROM brtc_tools_function WHERE tools_project_id=$1 AND creator=$2 ORDER BY label';

const stmt = {
    DDL_CHECK_TABLE: {
        default: DDL_CHECK_TABLE_DEFAULT
    },
    DDL_CREATE_TOOLS_FUNCTION_TABLE: {
        default: DDL_CREATE_TOOLS_FUNCTION_TABLE_DEFAULT,
        sqlite: DDL_CREATE_TOOLS_FUNCTION_TABLE_SQLITE
    },
    TOOLS_FUNCTION_SELECT_BY_PROJECT: {
        default: TOOLS_FUNCTION_SELECT_BY_PROJECT_DEFAULT
    },
    TOOLS_FUNCTION_SELECT_BY_ID: {
        default: TOOLS_FUNCTION_SELECT_BY_ID_DEFAULT
    },
    TOOLS_FUNCTION_SELECT_BY_FILE: {
        default: TOOLS_FUNCTION_SELECT_BY_FILE_DEFAULT
    },
    TOOLS_FUNCTION_CREATE: {
        default: TOOLS_FUNCTION_CREATE_DEFAULT,
        sqlite: TOOLS_FUNCTION_CREATE_SQLITE
    },
    TOOLS_FUNCTION_UPDATE: {
        default: TOOLS_FUNCTION_UPDATE_DEFAULT,
        sqlite: TOOLS_FUNCTION_UPDATE_SQLITE
    },
    TOOLS_FUNCTION_DELETE: {
        default: TOOLS_FUNCTION_DELETE_DEFAULT
    },
    TOOLS_FUNCTION_DELETE_BY_PROJECTID: {
        default: TOOLS_FUNCTION_DELETE_BY_PROJECTID_DEFAULT
    },
    TOOLS_FUNCTION_SELECT_BY_CREATOR: {
        default: TOOLS_FUNCTION_SELECT_BY_CREATOR_DEFAULT
    }
};

const DDL_CHECK_TABLE = getQuery(stmt, 'DDL_CHECK_TABLE');
const DDL_CREATE_TOOLS_FUNCTION_TABLE = getQuery(stmt, 'DDL_CREATE_TOOLS_FUNCTION_TABLE');
const TOOLS_FUNCTION_SELECT_BY_PROJECT = getQuery(stmt, 'TOOLS_FUNCTION_SELECT_BY_PROJECT');
const TOOLS_FUNCTION_SELECT_BY_ID = getQuery(stmt, 'TOOLS_FUNCTION_SELECT_BY_ID');
const TOOLS_FUNCTION_SELECT_BY_FILE = getQuery(stmt, 'TOOLS_FUNCTION_SELECT_BY_FILE');
const TOOLS_FUNCTION_CREATE = getQuery(stmt, 'TOOLS_FUNCTION_CREATE');
const TOOLS_FUNCTION_UPDATE = getQuery(stmt, 'TOOLS_FUNCTION_UPDATE');
const TOOLS_FUNCTION_DELETE = getQuery(stmt, 'TOOLS_FUNCTION_DELETE');
const TOOLS_FUNCTION_DELETE_BY_PROJECTID = getQuery(stmt, 'TOOLS_FUNCTION_DELETE_BY_PROJECTID');
const TOOLS_FUNCTION_SELECT_BY_CREATOR = getQuery(stmt, 'TOOLS_FUNCTION_SELECT_BY_CREATOR');

module.exports = {
    tools_function: {
        checkSchema: function (errCallback, doneCallback) {
            query(DDL_CHECK_TABLE, ['brtc_tools_function'], errCallback, function (result) {
                if (result.length === 0) {
                    query(DDL_CREATE_TOOLS_FUNCTION_TABLE, [], errCallback, doneCallback)
                } else {
                    var columns = {}
                    for (var i in result) {
                        columns[result[i].column_name] = true
                    }
                    if (doneCallback) doneCallback(result.rows, result, DDL_CHECK_TABLE, ['brtc_tools_function'])
                }
            })
        },
        selectByProject: function (opt, errCallback, doneCallback) {
            query(TOOLS_FUNCTION_SELECT_BY_PROJECT, [opt.tools_project_id], errCallback, doneCallback)
        },
        selectByCreator: function (opt, errCallback, doneCallback) {
            query(TOOLS_FUNCTION_SELECT_BY_CREATOR, [opt.tools_project_id, opt.creator], errCallback, doneCallback)
        },
        selectByFile: function (opt, errCallback, doneCallback) {
            query(TOOLS_FUNCTION_SELECT_BY_FILE, [opt.id], errCallback, doneCallback)
        },
        selectById: function (opt, errCallback, doneCallback) {
            query(TOOLS_FUNCTION_SELECT_BY_ID, [opt.id, opt.tools_project_id], errCallback, doneCallback)
        },
        create: function (opt, errCallback, doneCallback) {
            var id = opt.id || IDGenerator.func.id()
            query(TOOLS_FUNCTION_CREATE, [id, opt.tools_project_id, opt.label, opt.contents, opt.description, opt.creator, opt.creator, opt.type], errCallback, doneCallback)
        },
        update: function (opt, errCallback, doneCallback) {
            query(TOOLS_FUNCTION_UPDATE, [opt.label, opt.contents, opt.description, opt.updater, opt.type, opt.id, opt.tools_project_id, opt.event_key], errCallback, doneCallback)
        },
        delete: function (opt, errCallback, doneCallback) {
            query(TOOLS_FUNCTION_DELETE, [opt.id, opt.tools_project_id], errCallback, doneCallback)
        },
        deleteByProjectID: function (opt, errCallback, doneCallback) {
            query(TOOLS_FUNCTION_DELETE_BY_PROJECTID, [opt.tools_project_id], errCallback, doneCallback)
        }
    }
};
