var common = require('./common');
var query = common.query;

const getQuery = require('./query-utils').getQuery;

const DDL_CHECK_TABLE_DEFAULT = common.DDL_CHECK_TABLE;
const DDL_CREATE_PROJECT_TABLE_DEFAULT = 'CREATE TABLE brtc_project ( id character varying(80) NOT NULL, label character varying(80) NOT NULL, description text, creator character varying(80), create_time timestamp without time zone, updater character varying(80), update_time timestamp without time zone, type character varying(40), tag character varying(80), CONSTRAINT brtc_project_pkey PRIMARY KEY (id) ) WITH ( OIDS=FALSE )';
const DDL_CREATE_PROJECT_TABLE_SQLITE = 'CREATE TABLE brtc_project ( id character varying(80) NOT NULL, label character varying(80) NOT NULL, description text, creator character varying(80), create_time timestamp without time zone, updater character varying(80), update_time timestamp without time zone, type character varying(40), tag character varying(80), CONSTRAINT brtc_project_pkey PRIMARY KEY (id) )';
const PROJECT_SELECT_ALL_DEFAULT = 'SELECT * FROM brtc_project ORDER BY label';
const PROJECT_SELECT_BY_ID_DEFAULT = 'SELECT * FROM brtc_project WHERE id=$1';
const PROJECT_SELECT_BY_CREATOR_DEFAULT = 'SELECT * FROM brtc_project WHERE creator=$1 ORDER BY label';

// const PROJECT_SELECT_BY_MEMBER = '' +
//     'SELECT * ' +
//     '  FROM ( SELECT * FROM brtc_project WHERE creator=$1 ' +
//     '          UNION ' +
//     '         SELECT * FROM brtc_project ' +
//     '          WHERE creator <> $1 ' +
//     '            AND id IN ( SELECT a.resource_id ' +
//     '                          FROM brtc_user_resource_role a left join brtc_role b on a.role_id = b.role_id ' +
//     '	                      WHERE a.user_id=$1 ' +
//     '                           AND a.resource_type = \'project\' AND b.role_category = \'role_proj_member\' ) ' +
//     '       ) p ' +
//     ' ORDER BY label collate "C"';

const PROJECT_SELECT_BY_MEMBER_DEFAULT = '' +
    'WITH project_list as (SELECT *                                                                                        ' +
    '		FROM (                                                                                                         ' +
    '		SELECT * FROM brtc_project WHERE creator=$1                                                                    ' +
    '		UNION                                                                                                          ' +
    '		SELECT * FROM brtc_project                                                                                     ' +
    '		WHERE creator <> $1                                                                                            ' +
    '		AND id IN ( SELECT a.resource_id                                                                               ' +
    '					FROM brtc_user_resource_role a left join brtc_role b on a.role_id = b.role_id                      ' +
    '					WHERE a.user_id= $1                                                                                ' +
    '					AND a.resource_type = \'project\' AND b.role_category = \'role_proj_member\' )                     ' +
    '		) p                                                                                                            ' +
    ')' +
    // '	ORDER BY label collate "C")                                                                                        ' +
    'SELECT project.*, COALESCE(model.model_count, 0) as model_count, COALESCE(report.report_count, 0) as report_count FROM ' +
    'project_list AS project                                                                                               ' +
    'LEFT JOIN                                                                                                             ' +
    '(SELECT project.id, count(*) as model_count FROM                                                                      ' +
    '	 project_list AS project, brtc_file AS file                                                                        ' +
    'WHERE file.project_id = project.id                                                                                    ' +
    'AND file.type NOT IN (\'visual\')                                                    ' +
    'GROUP BY project.id) AS model                                                                                         ' +
    'ON project.id = model.id                                                                                              ' +
    'LEFT JOIN                                                                                                             ' +
    '(SELECT project.id, count(*) as report_count FROM                                                                     ' +
    '	project_list AS project, brtc_file AS file                                                                         ' +
    'WHERE file.project_id = project.id                                                                                    ' +
    'AND file.type IN (\'visual\')                                                                                         ' +
    'GROUP BY project.id) AS report                                                                                        ' +
    'ON project.id = report.id                                                                                               ';

const PROJECT_CREATE_DEFAULT = 'INSERT INTO brtc_project (id, label, description, creator, create_time, updater, update_time, type, tag) VALUES ($1, $2, $3, $4, now(), $5, now(), $6, $7)';
const PROJECT_CREATE_SQLITE = `INSERT INTO brtc_project (id, label, description, creator, create_time, updater, update_time, type, tag) VALUES ($1, $2, $3, $4, datetime('now'), $5, datetime('now'), $6, $7)`;
const PROJECT_UPDATE_DEFAULT = 'UPDATE brtc_project SET (label, description, updater, update_time, type, tag) = ($1, $2, $3, now(), $4, $5) WHERE id=$6';
const PROJECT_UPDATE_SQLITE = `UPDATE brtc_project SET (label, description, updater, update_time, type, tag) = ($1, $2, $3, datetime('now'), $4, $5) WHERE id=$6`;

const PROJECT_UPDATE_TIME_DEFAULT = 'UPDATE brtc_project SET (update_time) = (now()) WHERE id=$1';
const PROJECT_UPDATE_TIME_SQLITE = `UPDATE brtc_project SET (update_time) = (datetime('now')) WHERE id=$1`;
const PROJECT_DELETE_DEFAULT = 'DELETE FROM brtc_project WHERE id=$1';
const PROJECT_DELETE_BY_CREATOR_DEFAULT = 'DELETE FROM brtc_project WHERE creator=$1';

const stmt = {
    DDL_CHECK_TABLE: {
        default: DDL_CHECK_TABLE_DEFAULT
    },
    DDL_CREATE_PROJECT_TABLE: {
        default: DDL_CREATE_PROJECT_TABLE_DEFAULT,
        sqlite: DDL_CREATE_PROJECT_TABLE_SQLITE
    },
    PROJECT_SELECT_ALL: {
        default: PROJECT_SELECT_ALL_DEFAULT
    },
    PROJECT_SELECT_BY_ID: {
        default: PROJECT_SELECT_BY_ID_DEFAULT
    },
    PROJECT_SELECT_BY_CREATOR: {
        default: PROJECT_SELECT_BY_CREATOR_DEFAULT
    },
    PROJECT_SELECT_BY_MEMBER: {
        default: PROJECT_SELECT_BY_MEMBER_DEFAULT
    },
    PROJECT_CREATE: {
        default: PROJECT_CREATE_DEFAULT,
        sqlite: PROJECT_CREATE_SQLITE
    },
    PROJECT_UPDATE: {
        default: PROJECT_UPDATE_DEFAULT,
        sqlite: PROJECT_UPDATE_SQLITE
    },
    PROJECT_UPDATE_TIME: {
        default: PROJECT_UPDATE_TIME_DEFAULT,
        sqlite: PROJECT_UPDATE_TIME_SQLITE
    },
    PROJECT_DELETE: {
        default: PROJECT_DELETE_DEFAULT
    },
    PROJECT_DELETE_BY_CREATOR: {
        default: PROJECT_DELETE_BY_CREATOR_DEFAULT
    }
};

const DDL_CHECK_TABLE = getQuery(stmt, 'DDL_CHECK_TABLE');
const DDL_CREATE_PROJECT_TABLE = getQuery(stmt, 'DDL_CREATE_PROJECT_TABLE');
const PROJECT_SELECT_ALL = getQuery(stmt, 'PROJECT_SELECT_ALL');
const PROJECT_SELECT_BY_ID = getQuery(stmt, 'PROJECT_SELECT_BY_ID');
const PROJECT_SELECT_BY_CREATOR = getQuery(stmt, 'PROJECT_SELECT_BY_CREATOR');
const PROJECT_SELECT_BY_MEMBER = getQuery(stmt, 'PROJECT_SELECT_BY_MEMBER');
const PROJECT_CREATE = getQuery(stmt, 'PROJECT_CREATE');
const PROJECT_UPDATE = getQuery(stmt, 'PROJECT_UPDATE');
const PROJECT_UPDATE_TIME = getQuery(stmt, 'PROJECT_UPDATE_TIME');
const PROJECT_DELETE = getQuery(stmt, 'PROJECT_DELETE');
const PROJECT_DELETE_BY_CREATOR = getQuery(stmt, 'PROJECT_DELETE_BY_CREATOR');

module.exports = {
    project: {
        checkSchema: function (errCallback, doneCallback) {
            query(DDL_CHECK_TABLE, ['brtc_project'], errCallback, function (result) {
                if (result.length === 0) {
                    query(DDL_CREATE_PROJECT_TABLE, [], errCallback, doneCallback);
                    return;
                }
                var columns = {};
                for (var i in result) {
                    columns[result[i].column_name] = true;
                }
                if (!columns['create_time']) query('ALTER TABLE brtc_project ADD COLUMN create_time timestamp', errCallback);
                if (!columns['updater']) query('ALTER TABLE brtc_project ADD COLUMN updater character varying(80)', errCallback);
                if (!columns['update_time']) query('ALTER TABLE brtc_project ADD COLUMN update_time timestamp', errCallback);
                if (!columns['type']) query('ALTER TABLE brtc_project ADD COLUMN type character varying(40)', errCallback);
                if (!columns['tag']) query('ALTER TABLE brtc_project ADD COLUMN tag character varying(80)', errCallback);
                if (doneCallback) doneCallback(result.rows, result, DDL_CHECK_TABLE, ['brtc_project']);
            });
        },
        selectAll: function (opt, errCallback, doneCallback) {
            query(PROJECT_SELECT_ALL, [], errCallback, doneCallback);
        },
        selectByCreator: function (opt, errCallback, doneCallback) {
            query(PROJECT_SELECT_BY_CREATOR, [opt.creator], errCallback, doneCallback);
        },
        selectByMember: function (opt, errCallback, doneCallback) {
            query(PROJECT_SELECT_BY_MEMBER, [opt.user_id], errCallback, doneCallback);
        },
        selectById: function (opt, errCallback, doneCallback) {
            query(PROJECT_SELECT_BY_ID, [opt.id], errCallback, doneCallback);
        },
        create: function (opt, errCallback, doneCallback) {
            query(PROJECT_CREATE, [opt.id, opt.label, opt.description, opt.creator, opt.creator, opt.type, opt.tag], errCallback, doneCallback);
        },
        update: function (opt, errCallback, doneCallback) {
            query(PROJECT_UPDATE, [opt.label, opt.description, opt.updater, opt.type, opt.tag, opt.id], errCallback, doneCallback);
        },
        updateTime: function (opt, errCallback, doneCallback) {
            query(PROJECT_UPDATE_TIME, [opt.id], errCallback, doneCallback);
        },
        delete: function (opt, errCallback, doneCallback) {
            query(PROJECT_DELETE, [opt.id], errCallback, doneCallback);
        },
        deleteByCreator: function (opt, errCallback, doneCallback) {
            query(PROJECT_DELETE_BY_CREATOR, [opt.user_id], errCallback, doneCallback);
        }
    }
};
