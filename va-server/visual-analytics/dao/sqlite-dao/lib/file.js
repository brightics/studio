var common = require('./common');
const getQuery = require('./query-utils').getQuery;
const DDL_CHECK_TABLE_DEFAULT = common.DDL_CHECK_TABLE;
var query = common.query;
var conf = require('../../../va-conf');
var transformModel = require('../../../lib/transform-model');
var hash = require('object-hash');

/**
 * 모델 버젼 관리 추가로 인해 from_version 추가
 */
const DDL_CREATE_FILE_TABLE_DEFAULT = '' +
    'CREATE TABLE brtc_file ( id character varying(80) NOT NULL, ' +
    '                         project_id character varying(80), label character varying(80) NOT NULL, ' +
    '                         contents text, ' +
    '                         description text, ' +
    '                         model_image bytea, ' +
    '                         creator character varying(80), ' +
    '                         create_time timestamp without time zone, ' +
    '                         updater character varying(80), ' +
    '                         update_time timestamp without time zone, ' +
    '                         event_key character varying(40), ' +
    '                         type character varying(40), ' +
    '                         tag character varying(80), ' +
    '                         from_version character varying(80) DEFAULT \'0.0\', ' +
    '                         CONSTRAINT brtc_file_pkey PRIMARY KEY (id) ) WITH ( OIDS=FALSE )';

const DDL_CREATE_FILE_TABLE_SQLITE = '' +
    'CREATE TABLE brtc_file ( id character varying(80) NOT NULL, ' +
    '                         project_id character varying(80), label character varying(80) NOT NULL, ' +
    '                         contents text, ' +
    '                         description text, ' +
    '                         model_image bytea, ' +
    '                         creator character varying(80), ' +
    '                         create_time timestamp without time zone, ' +
    '                         updater character varying(80), ' +
    '                         update_time timestamp without time zone, ' +
    '                         event_key character varying(40), ' +
    '                         type character varying(40), ' +
    '                         tag character varying(80), ' +
    '                         from_version character varying(80) DEFAULT \'0.0\', ' +
    '                         CONSTRAINT brtc_file_pkey PRIMARY KEY (id) )';

const FILE_SELECT_BY_PROJECT_DEFAULT = 'SELECT * FROM brtc_file WHERE project_id=$1 ORDER BY label';
const FILE_SELECT_BY_ID_DEFAULT = 'SELECT * FROM brtc_file WHERE id=$1 AND project_id=$2';
const FILE_SELECT_BY_FILE_DEFAULT = 'SELECT * FROM brtc_file WHERE project_id = (SELECT project_id FROM brtc_file WHERE id=$1 )';

const FILE_SELECT_FOR_UPDATE = `
    SELECT * FROM brtc_file
    WHERE id=$1 AND project_id=$2 AND (event_key=$3 OR event_key IS NULL)
`;


const FILE_CREATE_DEFAULT = `
    INSERT INTO brtc_file
    (id, project_id, label, contents, description, creator, create_time, updater, update_time, event_key, type, tag)
    VALUES ($1, $2, $3, $4, $5, $6, now(), $7, now(), to_char(current_timestamp, \'YYMMDD_HH24MISS_US\'), $8, $9)
`;

const FILE_CREATE_SQLITE = `
    INSERT INTO brtc_file
    (id, project_id, label, contents, description, creator, create_time, updater, update_time, event_key, type, tag)
    VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        datetime('now'),
        $7,
        datetime('now'),
        strftime('%Y_%H%M%f', current_timestamp),
        $8,
        $9)
`;

const FILE_UPDATE_DEFAULT = '' +
    'UPDATE brtc_file ' +
    '   SET (label, contents, description, updater, update_time, event_key, type, tag) = ($1, $2, $3, $4, now(), to_char(current_timestamp, \'YYMMDD_HH24MISS_US\'), $5, $6) ' +
    ' WHERE id=$7 AND project_id=$8 AND (event_key=$9 OR event_key IS NULL)';

const FILE_UPDATE_SQLITE = `
    UPDATE brtc_file
       SET (label, contents, description, updater, update_time, event_key, type, tag)
        = ($1, $2, $3, $4, datetime('now'), strftime('%Y_%H%M%f', current_timestamp), $5, $6)
     WHERE id=$7 AND project_id=$8 AND (event_key=$9 OR event_key IS NULL)
`;

const FILE_DELETE_DEFAULT = 'DELETE FROM brtc_file WHERE id=$1 AND project_id=$2';
const FILE_DELETE_BY_PROJECTID_DEFAULT = 'DELETE FROM brtc_file WHERE project_id=$1';

const FILE_SELECT_FOR_SAVE_DEFAUT = `
    SELECT * FROM brtc_file
    WHERE id=$1 AND project_id=$2 AND (event_key=$3 OR event_key IS NULL)
`;

const FILE_SELECT_FOR_SAVE_SQLITE = `
    SELECT * FROM brtc_file
    WHERE id=$1 AND project_id=$2 AND (event_key=$3 OR event_key IS NULL)
`;

const stmt ={
    DDL_CHECK_TABLE: {
        default: DDL_CHECK_TABLE_DEFAULT
    },
    DDL_CREATE_FILE_TABLE: {
        default: DDL_CREATE_FILE_TABLE_DEFAULT,
        sqlite: DDL_CREATE_FILE_TABLE_SQLITE
    },
    FILE_SELECT_BY_PROJECT: {
        default: FILE_SELECT_BY_PROJECT_DEFAULT
    },
    FILE_SELECT_BY_ID: {
        default: FILE_SELECT_BY_ID_DEFAULT
    },
    FILE_SELECT_BY_FILE: {
        default: FILE_SELECT_BY_FILE_DEFAULT
    },
    FILE_CREATE: {
        default: FILE_CREATE_DEFAULT,
        sqlite: FILE_CREATE_SQLITE
    },
    FILE_UPDATE: {
        default: FILE_UPDATE_DEFAULT,
        sqlite: FILE_UPDATE_SQLITE
    },
    FILE_DELETE: {
        default: FILE_DELETE_DEFAULT
    },
    FILE_DELETE_BY_PROJECTID: {
        default: FILE_DELETE_BY_PROJECTID_DEFAULT
    },
    FILE_SAVE: {
        default: FILE_SELECT_FOR_SAVE_DEFAUT,
        sqlite: FILE_SELECT_FOR_SAVE_SQLITE
    }
};

const DDL_CHECK_TABLE = getQuery(stmt, 'DDL_CHECK_TABLE');
const DDL_CREATE_FILE_TABLE = getQuery(stmt, 'DDL_CREATE_FILE_TABLE');
const FILE_SELECT_BY_PROJECT = getQuery(stmt, 'FILE_SELECT_BY_PROJECT');
const FILE_SELECT_BY_ID = getQuery(stmt, 'FILE_SELECT_BY_ID');
const FILE_SELECT_BY_FILE = getQuery(stmt, 'FILE_SELECT_BY_FILE');
const FILE_CREATE = getQuery(stmt, 'FILE_CREATE');
const FILE_UPDATE = getQuery(stmt, 'FILE_UPDATE');
const FILE_DELETE = getQuery(stmt, 'FILE_DELETE');
const FILE_DELETE_BY_PROJECTID = getQuery(stmt, 'FILE_DELETE_BY_PROJECTID');

const FILE_SELECT_FOR_SAVE = getQuery(stmt, 'FILE_SAVE');


const saveFileByCommand = function (opt, errCallback, doneCallback) {
    query(FILE_SELECT_FOR_SAVE, [opt.id, opt.project_id, opt.event_key], errCallback,
        function (result) {
            if (result.length > 0) {
                try {
                    result[0].contents =
                        transformModel(JSON.parse(result[0].contents), opt.modelDiff);
                    if (hash(result[0].contents, {
                        respectFunctionProperties: false,
                        respectFunctionNames: false,
                        respectType: false
                    }) !== opt.hash) {
                        return errCallback('differentHash');
                    }
                } catch (e) {
                    return errCallback('differentHash');
                }


                if (conf['meta-db'].type === 'sqlite') {
                    query(FILE_UPDATE, [opt.label, result[0].contents,
                        opt.description, opt.updater, opt.type, opt.tag, opt.id,
                        opt.project_id, opt.event_key], errCallback, () => doneCallback(1));
                } else {
                    query(FILE_UPDATE, [opt.label, result[0].contents,
                        opt.description, opt.updater, opt.type, opt.tag, opt.id,
                        opt.project_id, opt.event_key], errCallback, doneCallback);
                }
            }
        });
};

module.exports = {
    file: {
        checkSchema: function (errCallback, doneCallback) {
            query(DDL_CHECK_TABLE, ['brtc_file'], errCallback, function (result) {
                if (result.length === 0) {
                    query(DDL_CREATE_FILE_TABLE, [], errCallback, doneCallback);
                    return;
                }
                var columns = {};
                for (var i in result) {
                    columns[result[i].column_name] = true;
                }
                if (!columns['creator']) query('ALTER TABLE brtc_file ADD COLUMN creator character varying(80)', errCallback);
                if (!columns['create_time']) query('ALTER TABLE brtc_file ADD COLUMN create_time timestamp', errCallback);
                if (!columns['updater']) query('ALTER TABLE brtc_file ADD COLUMN updater character varying(80)', errCallback);
                if (!columns['update_time']) query('ALTER TABLE brtc_file ADD COLUMN update_time timestamp', errCallback);
                if (!columns['event_key']) query('ALTER TABLE brtc_file ADD COLUMN event_key character varying(40)', errCallback);
                if (!columns['type']) query('ALTER TABLE brtc_file ADD COLUMN type character varying(40)', errCallback);
                if (!columns['tag']) query('ALTER TABLE brtc_file ADD COLUMN tag character varying(80)', errCallback);
                if (!columns['from_version']) query('ALTER TABLE brtc_file ADD COLUMN from_version character varying(80) DEFAULT \'0.0\'', errCallback);
                if (doneCallback) doneCallback(result.rows, result, DDL_CHECK_TABLE, ['brtc_file']);
            });
        },
        selectByProject: function (opt, errCallback, doneCallback) {
            query(FILE_SELECT_BY_PROJECT, [opt.project_id], errCallback, doneCallback);
        },
        selectByFile: function (opt, errCallback, doneCallback) {
            query(FILE_SELECT_BY_FILE, [opt.id], errCallback, doneCallback);
        },
        selectById: function (opt, errCallback, doneCallback) {
            query(FILE_SELECT_BY_ID, [opt.id, opt.project_id], errCallback, doneCallback);
        },
        create: function (opt, errCallback, doneCallback) {
            query(FILE_CREATE, [opt.id, opt.project_id, opt.label, opt.contents, opt.description, opt.creator, opt.creator, opt.type, opt.tag], errCallback, doneCallback);
        },
        update: function (opt, errCallback, doneCallback) {
            // FIXME: T.T
            if (conf['meta-db'].type === 'sqlite') {
                query(FILE_UPDATE, [opt.label, opt.contents, opt.description, opt.updater, opt.type, opt.tag, opt.id, opt.project_id, opt.event_key], errCallback, () => doneCallback(1));
            } else {
                query(FILE_UPDATE, [opt.label, opt.contents, opt.description, opt.updater, opt.type, opt.tag, opt.id, opt.project_id, opt.event_key], errCallback, doneCallback);
            }
        },
        delete: function (opt, errCallback, doneCallback) {
            query(FILE_DELETE, [opt.id, opt.project_id], errCallback, doneCallback);
        },
        deleteByProjectID: function (opt, errCallback, doneCallback) {
            query(FILE_DELETE_BY_PROJECTID, [opt.project_id], errCallback, doneCallback);
        },
        save: function (opt, errCallback, doneCallback) {
            saveFileByCommand(opt, errCallback, doneCallback);
        }
    }
};
