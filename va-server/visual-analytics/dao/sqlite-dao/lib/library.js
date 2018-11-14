/**
 * Created by daewon.park on 2016-09-12.
 */

var common = require('./common');
const getQuery = require('./query-utils').getQuery;
const DDL_CHECK_TABLE_DEFAULT = common.DDL_CHECK_TABLE;
var query = common.query;

const DDL_CREATE_LIBRARY_TABLE_DEFAULT = 'CREATE TABLE brtc_library ( id character varying(80) NOT NULL, label character varying(80) NOT NULL, description text, creator character varying(80), create_time timestamp without time zone, updater character varying(80), update_time timestamp without time zone, type character varying(40), CONSTRAINT brtc_library_pkey PRIMARY KEY (id) ) WITH ( OIDS=FALSE )';

const DDL_CREATE_LIBRARY_TABLE_SQLITE = 'CREATE TABLE brtc_library ( id character varying(80) NOT NULL, label character varying(80) NOT NULL, description text, creator character varying(80), create_time timestamp without time zone, updater character varying(80), update_time timestamp without time zone, type character varying(40), CONSTRAINT brtc_library_pkey PRIMARY KEY (id) )';

const LIBRARY_SELECT_ALL_DEFAULT = 'SELECT * FROM brtc_library ORDER BY label';
const LIBRARY_SELECT_BY_ID_DEFAULT = 'SELECT * FROM brtc_library WHERE id=$1';
const LIBRARY_SELECT_BY_TYPE_DEFAULT = 'SELECT * FROM brtc_library WHERE type=$1 ORDER BY label';
const LIBRARY_SELECT_BY_CREATOR_DEFAULT = 'SELECT * FROM brtc_library WHERE creator=$1 ORDER BY label';
const LIBRARY_CREATE_DEFAULT = 'INSERT INTO brtc_library (id, label, description, creator, create_time, updater, update_time, type) VALUES ($1, $2, $3, $4, now(), $5, now(), $6)';
const LIBRARY_CREATE_SQLITE = `INSERT INTO brtc_library (id, label, description, creator, create_time, updater, update_time, type) VALUES ($1, $2, $3, $4, datetime('now'), $5, datetime('now'), $6)`;
const LIBRARY_UPDATE_DEFAULT = 'UPDATE brtc_library SET (label, description, updater, update_time, type) = ($1, $2, $3, now(), $4) WHERE id=$5';
const LIBRARY_UPDATE_SQLITE = `UPDATE brtc_library SET (label, description, updater, update_time, type) = ($1, $2, $3, datetime('now'), $4) WHERE id=$5`;

const LIBRARY_DELETE_DEFAULT = 'DELETE FROM brtc_library WHERE id=$1';

const DDL_CREATE_LIBRARY_TEMPLATE_TABLE_DEFAULT = 'CREATE TABLE brtc_library_template ( id character varying(80) NOT NULL, library_id character varying(80), label character varying(80) NOT NULL, contents text, description text, creator character varying(80), create_time timestamp without time zone, updater character varying(80), update_time timestamp without time zone, CONSTRAINT brtc_library_template_pkey PRIMARY KEY (id) ) WITH ( OIDS=FALSE )';
const DDL_CREATE_LIBRARY_TEMPLATE_TABLE_SQLITE = `CREATE TABLE brtc_library_template ( id character varying(80) NOT NULL, library_id character varying(80), label character varying(80) NOT NULL, contents text, description text, creator character varying(80), create_time timestamp without time zone, updater character varying(80), update_time timestamp without time zone, CONSTRAINT brtc_library_template_pkey PRIMARY KEY (id) )`;

const LIBRARY_TEMPLATE_SELECT_ALL_DEFAULT = 'SELECT * FROM brtc_library_template ORDER BY label';
const LIBRARY_TEMPLATE_SELECT_BY_ID_DEFAULT = 'SELECT * FROM brtc_library_template WHERE id=$1 AND library_id=$2';
const LIBRARY_TEMPLATE_SELECT_BY_CREATOR_DEFAULT = 'SELECT * FROM brtc_library_template WHERE creator=$1 ORDER BY label';
const LIBRARY_TEMPLATE_SELECT_BY_LIBRARY_ID_DEFAULT = 'SELECT * FROM brtc_library_template WHERE library_id=$1 ORDER BY label';

const LIBRARY_TEMPLATE_CREATE_DEFAULT = 'INSERT INTO brtc_library_template (id, library_id, label, contents, description, creator, create_time, updater, update_time) VALUES ($1, $2, $3, $4, $5, $6, now(), $7, now())';
const LIBRARY_TEMPLATE_CREATE_SQLITE = `INSERT INTO brtc_library_template (id, library_id, label, contents, description, creator, create_time, updater, update_time) VALUES ($1, $2, $3, $4, $5, $6, datetime('now'), $7, datetime('now'))`;

const LIBRARY_TEMPLATE_UPDATE_DEFAULT = 'UPDATE brtc_library_template SET (label, description, updater, update_time) = ($1, $2, $3, now()) WHERE id=$4 AND library_id=$5';
const LIBRARY_TEMPLATE_UPDATE_SQLITE = `UPDATE brtc_library_template SET (label, description, updater, update_time) = ($1, $2, $3, datetime('now')) WHERE id=$4 AND library_id=$5`;
const LIBRARY_TEMPLATE_DELETE_DEFAULT = 'DELETE FROM brtc_library_template WHERE id=$1 AND library_id=$2';

const stmt = {
    DDL_CHECK_TABLE: {
        default: DDL_CHECK_TABLE_DEFAULT
    },
    DDL_CREATE_LIBRARY_TABLE: {
        default: DDL_CREATE_LIBRARY_TABLE_DEFAULT,
        sqlite: DDL_CREATE_LIBRARY_TABLE_SQLITE
    },
    LIBRARY_SELECT_ALL: {
        default: LIBRARY_SELECT_ALL_DEFAULT
    },
    LIBRARY_SELECT_BY_ID: {
        default: LIBRARY_SELECT_BY_ID_DEFAULT
    },
    LIBRARY_SELECT_BY_TYPE: {
        default: LIBRARY_SELECT_BY_TYPE_DEFAULT
    },
    LIBRARY_SELECT_BY_CREATOR: {
        default: LIBRARY_SELECT_BY_CREATOR_DEFAULT
    },
    LIBRARY_CREATE: {
        default: LIBRARY_CREATE_DEFAULT,
        sqlite: LIBRARY_CREATE_SQLITE
    },
    LIBRARY_UPDATE: {
        default: LIBRARY_UPDATE_DEFAULT,
        sqlite: LIBRARY_UPDATE_SQLITE
    },
    LIBRARY_DELETE: {
        default: LIBRARY_DELETE_DEFAULT
    },
    DDL_CREATE_LIBRARY_TEMPLATE_TABLE: {
        default: DDL_CREATE_LIBRARY_TEMPLATE_TABLE_DEFAULT,
        sqlite: DDL_CREATE_LIBRARY_TEMPLATE_TABLE_SQLITE
    },
    LIBRARY_TEMPLATE_SELECT_ALL: {
        default: LIBRARY_TEMPLATE_SELECT_ALL_DEFAULT
    },
    LIBRARY_TEMPLATE_SELECT_BY_ID: {
        default: LIBRARY_TEMPLATE_SELECT_BY_ID_DEFAULT
    },
    LIBRARY_TEMPLATE_SELECT_BY_CREATOR: {
        default: LIBRARY_TEMPLATE_SELECT_BY_CREATOR_DEFAULT
    },
    LIBRARY_TEMPLATE_SELECT_BY_LIBRARY_ID: {
        default: LIBRARY_TEMPLATE_SELECT_BY_LIBRARY_ID_DEFAULT
    },
    LIBRARY_TEMPLATE_CREATE: {
        default: LIBRARY_TEMPLATE_CREATE_DEFAULT,
        sqlite: LIBRARY_TEMPLATE_CREATE_SQLITE
    },
    LIBRARY_TEMPLATE_UPDATE: {
        default: LIBRARY_TEMPLATE_UPDATE_DEFAULT,
        sqlite: LIBRARY_TEMPLATE_UPDATE_SQLITE
    },
    LIBRARY_TEMPLATE_DELETE: {
        default: LIBRARY_TEMPLATE_DELETE_DEFAULT
    }
};

const DDL_CHECK_TABLE = getQuery(stmt, 'DDL_CHECK_TABLE');
const DDL_CREATE_LIBRARY_TABLE = getQuery(stmt, 'DDL_CREATE_LIBRARY_TABLE');
const LIBRARY_SELECT_ALL = getQuery(stmt, 'LIBRARY_SELECT_ALL');
const LIBRARY_SELECT_BY_ID = getQuery(stmt, 'LIBRARY_SELECT_BY_ID');
const LIBRARY_SELECT_BY_TYPE = getQuery(stmt, 'LIBRARY_SELECT_BY_TYPE');
const LIBRARY_SELECT_BY_CREATOR = getQuery(stmt, 'LIBRARY_SELECT_BY_CREATOR');
const LIBRARY_CREATE = getQuery(stmt, 'LIBRARY_CREATE');
const LIBRARY_UPDATE = getQuery(stmt, 'LIBRARY_UPDATE');
const LIBRARY_DELETE = getQuery(stmt, 'LIBRARY_DELETE');
const DDL_CREATE_LIBRARY_TEMPLATE_TABLE = getQuery(stmt, 'DDL_CREATE_LIBRARY_TEMPLATE_TABLE');
const LIBRARY_TEMPLATE_SELECT_ALL = getQuery(stmt, 'LIBRARY_TEMPLATE_SELECT_ALL');
const LIBRARY_TEMPLATE_SELECT_BY_ID = getQuery(stmt, 'LIBRARY_TEMPLATE_SELECT_BY_ID');
const LIBRARY_TEMPLATE_SELECT_BY_CREATOR = getQuery(stmt, 'LIBRARY_TEMPLATE_SELECT_BY_CREATOR');
const LIBRARY_TEMPLATE_SELECT_BY_LIBRARY_ID = getQuery(stmt, 'LIBRARY_TEMPLATE_SELECT_BY_LIBRARY_ID');
const LIBRARY_TEMPLATE_CREATE = getQuery(stmt, 'LIBRARY_TEMPLATE_CREATE');
const LIBRARY_TEMPLATE_UPDATE = getQuery(stmt, 'LIBRARY_TEMPLATE_UPDATE');
const LIBRARY_TEMPLATE_DELETE = getQuery(stmt, 'LIBRARY_TEMPLATE_DELETE');

module.exports = {
    library: {
        checkSchema: function (errCallback, doneCallback) {
            var _this = this;
            query(DDL_CHECK_TABLE, ['brtc_library'], errCallback, function (result) {
                if (result.length == 0) {
                    query(DDL_CREATE_LIBRARY_TABLE, [], errCallback, function () {
                        var opt = {
                            id: 'brtc-va-shared',
                            label: 'Open Library',
                            creator: 'System',
                            type: 'Opened'
                        };
                        _this.create(opt, errCallback, doneCallback);
                        if (doneCallback) doneCallback(result.rows, result, DDL_CREATE_LIBRARY_TABLE, []);
                    });
                } else {
                    if (doneCallback) doneCallback(result.rows, result, DDL_CHECK_TABLE, ['brtc_library']);
                }
            });
        },
        selectAll: function (opt, errCallback, doneCallback) {
            query(LIBRARY_SELECT_ALL, [], errCallback, doneCallback);
        },
        selectByCreator: function (opt, errCallback, doneCallback) {
            query(LIBRARY_SELECT_BY_CREATOR, [opt.creator], errCallback, doneCallback);
        },
        selectById: function (opt, errCallback, doneCallback) {
            query(LIBRARY_SELECT_BY_ID, [opt.id], errCallback, doneCallback);
        },
        selectByType: function (opt, errCallback, doneCallback) {
            query(LIBRARY_SELECT_BY_TYPE, [opt.type], errCallback, doneCallback);
        },
        create: function (opt, errCallback, doneCallback) {
            query(LIBRARY_CREATE, [opt.id, opt.label, opt.description, opt.creator, opt.creator, opt.type], errCallback, doneCallback);
        },
        update: function (opt, errCallback, doneCallback) {
            query(LIBRARY_UPDATE, [opt.label, opt.description, opt.updater, opt.type, opt.id], errCallback, doneCallback);
        },
        delete: function (opt, errCallback, doneCallback) {
            query(LIBRARY_DELETE, [opt.id], errCallback, doneCallback);
        }
    },
    template: {
        checkSchema: function (errCallback, doneCallback) {
            query(DDL_CHECK_TABLE, ['brtc_library_template'], errCallback, function (result) {
                if (result.length == 0) {
                    query(DDL_CREATE_LIBRARY_TEMPLATE_TABLE, [], errCallback, doneCallback);
                }
                else {
                    if (doneCallback) doneCallback(result.rows, result, DDL_CHECK_TABLE, ['brtc_library_template']);
                }
            });
        },
        selectAll: function (opt, errCallback, doneCallback) {
            query(LIBRARY_TEMPLATE_SELECT_ALL, [], errCallback, doneCallback);
        },
        selectByCreator: function (opt, errCallback, doneCallback) {
            query(LIBRARY_TEMPLATE_SELECT_BY_CREATOR, [opt.creator], errCallback, doneCallback);
        },
        selectById: function (opt, errCallback, doneCallback) {
            query(LIBRARY_TEMPLATE_SELECT_BY_ID, [opt.id, opt.library_id], errCallback, doneCallback);
        },
        selectByLibrary: function (opt, errCallback, doneCallback) {
            query(LIBRARY_TEMPLATE_SELECT_BY_LIBRARY_ID, [opt.library_id], errCallback, doneCallback);
        },
        create: function (opt, errCallback, doneCallback) {
            query(LIBRARY_TEMPLATE_CREATE, [opt.id, opt.library_id, opt.label, opt.contents, opt.description, opt.creator, opt.creator], errCallback, doneCallback);
        },
        update: function (opt, errCallback, doneCallback) {
            query(LIBRARY_TEMPLATE_UPDATE, [opt.label, opt.description, opt.updater, opt.id, opt.library_id], errCallback, doneCallback);
        },
        delete: function (opt, errCallback, doneCallback) {
            query(LIBRARY_TEMPLATE_DELETE, [opt.id, opt.library_id], errCallback, doneCallback);
        }        
    }
};
