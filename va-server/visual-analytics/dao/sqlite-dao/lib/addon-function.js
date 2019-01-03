var common = require('./common');

const getQuery = require('./query-utils').getQuery;
const DDL_CHECK_TABLE_DEFAULT = common.DDL_CHECK_TABLE;
var query = common.query;
var batchUpdate = common.batchUpdate;

const DDL_CREATE_ADDON_FUNCTION_TABLE_DEFAULT = '' +
    'CREATE TABLE brtc_addon_function (' +
    '    id character varying(80)  NOT NULL,                  ' +
    '    label character varying(120)  NOT NULL,              ' +
    '    version character varying(40),                       ' +
    '    type character varying(40),                          ' +
    '    contents text,                                       ' +
    '    script_id character varying(120),                    ' +
    '    description text,                                    ' +
    '    resource_id character varying(80),                   ' +
    '    creator character varying(40),                       ' +
    '    create_time timestamp without time zone,             ' +
    '    updater character varying(40),                       ' +
    '    update_time timestamp without time zone,             ' +
    '    markdown text,                                       ' +
    '    CONSTRAINT brtc_addon_function_pkey PRIMARY KEY (id) ' +
    ')                                                        ' +
    'WITH (                                                   ' +
    '    OIDS = FALSE                                         ' +
    ')                                                        ';

const DDL_CREATE_ADDON_FUNCTION_TABLE_SQLITE = '' +
    'CREATE TABLE brtc_addon_function (' +
    '    id character varying(80)  NOT NULL,                  ' +
    '    label character varying(120)  NOT NULL,              ' +
    '    version character varying(40),                       ' +
    '    type character varying(40),                          ' +
    '    contents text,                                       ' +
    '    script_id character varying(120),                    ' +
    '    description text,                                    ' +
    '    resource_id character varying(80),                   ' +
    '    creator character varying(40),                       ' +
    '    create_time timestamp without time zone,             ' +
    '    updater character varying(40),                       ' +
    '    update_time timestamp without time zone,             ' +
    '    markdown text,                                       ' +
    '    CONSTRAINT brtc_addon_function_pkey PRIMARY KEY (id) ' +
    ')                                                        ';

const ADDON_FUNCTION_SELECT_ALL_DEFAULT = 'SELECT * FROM brtc_addon_function ORDER BY create_time desc, label ';
const ADDON_FUNCTION_SELECT_BY_ID_DEFAULT = 'SELECT * FROM brtc_addon_function where id = $1 ';
const ADDON_FUNCTION_CREATE_DEFAULT = '' +
    'INSERT INTO brtc_addon_function (id, label, version, type, contents, script_id, description, resource_id, creator, create_time, markdown) ' +
    '       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, now(), $10)';

const ADDON_FUNCTION_CREATE_SQLITE = `
    INSERT INTO brtc_addon_function
        (id, label, version, type, contents, script_id, description, resource_id, creator, create_time, markdown)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, datetime('now'), $10)
`;

const ADDON_FUNCTION_DELETE_BY_ID_DEFAULT = 'DELETE FROM brtc_addon_function WHERE id=$1 ';

const stmt = {
    DDL_CHECK_TABLE: {
        default: DDL_CHECK_TABLE_DEFAULT
    },
    DDL_CREATE_ADDON_FUNCTION_TABLE: {
        default: DDL_CREATE_ADDON_FUNCTION_TABLE_DEFAULT,
        sqlite: DDL_CREATE_ADDON_FUNCTION_TABLE_SQLITE
    },
    ADDON_FUNCTION_SELECT_ALL: {
        default: ADDON_FUNCTION_SELECT_ALL_DEFAULT
    },
    ADDON_FUNCTION_SELECT_BY_ID: {
        default: ADDON_FUNCTION_SELECT_BY_ID_DEFAULT
    },
    ADDON_FUNCTION_CREATE: {
        default: ADDON_FUNCTION_CREATE_DEFAULT,
        sqlite: ADDON_FUNCTION_CREATE_SQLITE
    },
    ADDON_FUNCTION_DELETE_BY_ID: {
        default: ADDON_FUNCTION_DELETE_BY_ID_DEFAULT
    }
};

const DDL_CHECK_TABLE = getQuery(stmt, 'DDL_CHECK_TABLE');
const DDL_CREATE_ADDON_FUNCTION_TABLE = getQuery(stmt, 'DDL_CREATE_ADDON_FUNCTION_TABLE');
const ADDON_FUNCTION_SELECT_ALL = getQuery(stmt, 'ADDON_FUNCTION_SELECT_ALL');
const ADDON_FUNCTION_SELECT_BY_ID = getQuery(stmt, 'ADDON_FUNCTION_SELECT_BY_ID');
const ADDON_FUNCTION_CREATE = getQuery(stmt, 'ADDON_FUNCTION_CREATE');
const ADDON_FUNCTION_DELETE_BY_ID = getQuery(stmt, 'ADDON_FUNCTION_DELETE_BY_ID');

module.exports = {
    addon_function: {
        checkSchema: function (errCallback, doneCallback) {
            query(DDL_CHECK_TABLE, ['brtc_addon_function'], errCallback, function (result) {
                if (result.length === 0) {
                    query(DDL_CREATE_ADDON_FUNCTION_TABLE, [], errCallback, doneCallback);
                } else {
                    var columns = {};
                    for (var i in result) {
                        columns[result[i].column_name] = true;
                    }
                    if (!columns['markdown']) query('ALTER TABLE brtc_addon_function ADD COLUMN markdown text', errCallback);
                    if (doneCallback) doneCallback(result.rows, result, DDL_CHECK_TABLE, ['brtc_addon_function']);
                }
            });
        },
        selectAll: function (opt, errCallback, doneCallback) {
            query(ADDON_FUNCTION_SELECT_ALL, [], errCallback, doneCallback);
        },
        selectById: function (opt, errCallback, doneCallback) {
            query(ADDON_FUNCTION_SELECT_BY_ID, [opt.id], errCallback, doneCallback);
        },
        create: function (opt, errCallback, doneCallback) {
            query(ADDON_FUNCTION_CREATE, [opt.id, opt.label, '1.0', opt.type, opt.contents, opt.scriptId, opt.description, null, opt.userId, opt.markdown], errCallback, doneCallback);
        },
        deleteById: function (opt, errCallback, doneCallback) {
            query(ADDON_FUNCTION_DELETE_BY_ID, [opt.id], errCallback, doneCallback);
        }
    }

};
