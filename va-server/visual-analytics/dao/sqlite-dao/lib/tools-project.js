var common = require('./common');
var query = common.query;

const getQuery = require('./query-utils').getQuery;
const IDGenerator = require('../../../lib/tools/idgenerator');

const DDL_CHECK_TABLE_DEFAULT = common.DDL_CHECK_TABLE;
const DDL_CREATE_TOOLS_PROJECT_TABLE_DEFAULT =
    'CREATE TABLE brtc_tools_project ( id character varying(80) NOT NULL, ' +
    '                               label character varying(80) NOT NULL, ' +
    '                               description text, ' +
    '                               creator character varying(80), ' +
    '                               create_time timestamp without time zone, ' +
    '                               updater character varying(80), ' +
    '                               update_time timestamp without time zone, ' +
    '                               CONSTRAINT brtc_tools_project_pkey PRIMARY KEY (id) ) WITH ( OIDS=FALSE )';

const DDL_CREATE_TOOLS_PROJECT_TABLE_SQLITE =
    'CREATE TABLE brtc_tools_project ( id character varying(80) NOT NULL, ' +
    '                               label character varying(80) NOT NULL, ' +
    '                               description text, ' +
    '                               creator character varying(80), ' +
    '                               create_time timestamp without time zone, ' +
    '                               updater character varying(80), ' +
    '                               update_time timestamp without time zone, ' +
    '                               CONSTRAINT brtc_tools_project_pkey PRIMARY KEY (id) )';

const TOOLS_PROJECT_SELECT_ALL_DEFAULT = 'SELECT * FROM brtc_tools_project ORDER BY label';
const TOOLS_PROJECT_SELECT_BY_ID_DEFAULT = 'SELECT * FROM brtc_tools_project WHERE id=$1';
const TOOLS_PROJECT_SELECT_BY_CREATOR_DEFAULT = 'SELECT * FROM brtc_tools_project WHERE creator=$1 ORDER BY label';

const TOOLS_PROJECT_CREATE_DEFAULT = 'INSERT INTO brtc_tools_project (id, label, description, creator, create_time, updater, update_time) VALUES ($1, $2, $3, $4, now(), $5, now())';
const TOOLS_PROJECT_CREATE_SQLITE = `INSERT INTO brtc_tools_project (id, label, description, creator, create_time, updater, update_time) VALUES ($1, $2, $3, $4, datetime('now'), $5, datetime('now'))`;

const TOOLS_PROJECT_UPDATE_DEFAULT = 'UPDATE brtc_tools_project SET (label, description, updater, update_time) = ($1, $2, $3, now()) WHERE id=$6';
const TOOLS_PROJECT_UPDATE_SQLITE = `UPDATE brtc_tools_project SET (label, description, updater, update_time) = ($1, $2, $3, datetime('now')) WHERE id=$6`;

const TOOLS_PROJECT_UPDATE_TIME_DEFAULT = 'UPDATE brtc_tools_project SET (update_time) = (now()) WHERE id=$1';
const TOOLS_PROJECT_UPDATE_TIME_SQLITE = `UPDATE brtc_tools_project SET (update_time) = (datetime('now')) WHERE id=$1`;
const TOOLS_PROJECT_DELETE_DEFAULT = 'DELETE FROM brtc_tools_project WHERE id=$1';
const TOOLS_PROJECT_DELETE_BY_CREATOR_DEFAULT = 'DELETE FROM brtc_tools_project WHERE creator=$1';

const stmt = {
    DDL_CHECK_TABLE: {
        default: DDL_CHECK_TABLE_DEFAULT
    },
    DDL_CREATE_TOOLS_PROJECT_TABLE: {
        default: DDL_CREATE_TOOLS_PROJECT_TABLE_DEFAULT,
        sqlite: DDL_CREATE_TOOLS_PROJECT_TABLE_SQLITE
    },
    TOOLS_PROJECT_SELECT_ALL: {
        default: TOOLS_PROJECT_SELECT_ALL_DEFAULT
    },
    TOOLS_PROJECT_SELECT_BY_ID: {
        default: TOOLS_PROJECT_SELECT_BY_ID_DEFAULT
    },
    TOOLS_PROJECT_SELECT_BY_CREATOR: {
        default: TOOLS_PROJECT_SELECT_BY_CREATOR_DEFAULT
    },
    TOOLS_PROJECT_CREATE: {
        default: TOOLS_PROJECT_CREATE_DEFAULT,
        sqlite: TOOLS_PROJECT_CREATE_SQLITE
    },
    TOOLS_PROJECT_UPDATE: {
        default: TOOLS_PROJECT_UPDATE_DEFAULT,
        sqlite: TOOLS_PROJECT_UPDATE_SQLITE
    },
    TOOLS_PROJECT_UPDATE_TIME: {
        default: TOOLS_PROJECT_UPDATE_TIME_DEFAULT,
        sqlite: TOOLS_PROJECT_UPDATE_TIME_SQLITE
    },
    TOOLS_PROJECT_DELETE: {
        default: TOOLS_PROJECT_DELETE_DEFAULT
    },
    TOOLS_PROJECT_DELETE_BY_CREATOR: {
        default: TOOLS_PROJECT_DELETE_BY_CREATOR_DEFAULT
    }
};

const DDL_CHECK_TABLE = getQuery(stmt, 'DDL_CHECK_TABLE');
const DDL_CREATE_TOOLS_PROJECT_TABLE = getQuery(stmt, 'DDL_CREATE_TOOLS_PROJECT_TABLE');
const TOOLS_PROJECT_SELECT_ALL = getQuery(stmt, 'TOOLS_PROJECT_SELECT_ALL');
const TOOLS_PROJECT_SELECT_BY_ID = getQuery(stmt, 'TOOLS_PROJECT_SELECT_BY_ID');
const TOOLS_PROJECT_SELECT_BY_CREATOR = getQuery(stmt, 'TOOLS_PROJECT_SELECT_BY_CREATOR');
const TOOLS_PROJECT_CREATE = getQuery(stmt, 'TOOLS_PROJECT_CREATE');
const TOOLS_PROJECT_UPDATE = getQuery(stmt, 'TOOLS_PROJECT_UPDATE');
const TOOLS_PROJECT_UPDATE_TIME = getQuery(stmt, 'TOOLS_PROJECT_UPDATE_TIME');
const TOOLS_PROJECT_DELETE = getQuery(stmt, 'TOOLS_PROJECT_DELETE');
const TOOLS_PROJECT_DELETE_BY_CREATOR = getQuery(stmt, 'TOOLS_PROJECT_DELETE_BY_CREATOR');

module.exports = {
    tools_project: {
        checkSchema: function (errCallback, doneCallback) {
            query(DDL_CHECK_TABLE, ['brtc_tools_project'], errCallback, function (result) {
                if (result.length === 0) {
                    query(DDL_CREATE_TOOLS_PROJECT_TABLE, [], errCallback, doneCallback)
                } else {
                    var columns = {};
                    for (var i in result) {
                        columns[result[i].column_name] = true
                    }
                    if (doneCallback) doneCallback(result.rows, result, DDL_CHECK_TABLE, ['brtc_tools_project'])
                }
            })
        },
        selectAll: function (opt, errCallback, doneCallback) {
            query(TOOLS_PROJECT_SELECT_ALL, [], errCallback, doneCallback)
        },
        selectByCreator: function (opt, errCallback, doneCallback) {
            query(TOOLS_PROJECT_SELECT_BY_CREATOR, [opt.creator], errCallback, doneCallback)
        },
        // selectByMember: function (opt, errCallback, doneCallback) {
        //   query(TOOLS_PROJECT_SELECT_BY_MEMBER, [opt.user_id], errCallback, doneCallback)
        // },
        selectById: function (opt, errCallback, doneCallback) {
            query(TOOLS_PROJECT_SELECT_BY_ID, [opt.id], errCallback, doneCallback)
        },
        create: function (opt, errCallback, doneCallback) {
            var id = opt.id || IDGenerator.project.id();
            query(TOOLS_PROJECT_CREATE, [id, opt.label, opt.description, opt.creator, opt.creator], errCallback, doneCallback)
        },
        update: function (opt, errCallback, doneCallback) {
            query(TOOLS_PROJECT_UPDATE, [opt.label, opt.description, opt.updater, opt.id], errCallback, doneCallback)
        },
        updateTime: function (opt, errCallback, doneCallback) {
            query(TOOLS_PROJECT_UPDATE_TIME, [opt.id], errCallback, doneCallback)
        },
        delete: function (opt, errCallback, doneCallback) {
            query(TOOLS_PROJECT_DELETE, [opt.id], errCallback, doneCallback)
        },
        deleteByCreator: function (opt, errCallback, doneCallback) {
            query(TOOLS_PROJECT_DELETE_BY_CREATOR, [opt.user_id], errCallback, doneCallback)
        }
    }
};
