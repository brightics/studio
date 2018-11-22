/**
 * Created by daewon.park on 2016-09-20.
 */
var common = require('./common');
const getQuery = require('./query-utils').getQuery;
const DDL_CHECK_TABLE_DEFAULT = common.DDL_CHECK_TABLE;
var query = common.query;
var batchUpdate = common.batchUpdate;

const DDL_CREATE_USER_RESOURCE_ROLE_TABLE_DEFAULT = 'CREATE TABLE brtc_user_resource_role (' +
    'user_id character varying(80) NOT NULL, ' +
    'resource_type character varying(80) NOT NULL, ' +
    'resource_id character varying(80) NOT NULL, ' +
    'role_id character varying(80) NOT NULL,' +
    'create_time timestamp without time zone' +
    ') WITH ( OIDS=FALSE )';
const DDL_CREATE_USER_RESOURCE_ROLE_TABLE_SQLITE = 'CREATE TABLE brtc_user_resource_role (' +
    'user_id character varying(80) NOT NULL, ' +
    'resource_type character varying(80) NOT NULL, ' +
    'resource_id character varying(80) NOT NULL, ' +
    'role_id character varying(80) NOT NULL,' +
    'create_time timestamp without time zone' +
    ')';

const DDL_CREATE_USER_RESOURCE_ROLE_IDX_01_DEFAULT = 'CREATE INDEX brtc_user_resource_role_idx_01 ON brtc_user_resource_role USING btree (user_id, resource_type)';
const DDL_CREATE_USER_RESOURCE_ROLE_IDX_02_DEFAULT = 'CREATE UNIQUE INDEX brtc_user_resource_role_idx_02 ON brtc_user_resource_role USING btree (user_id, resource_type, resource_id, role_id)';
const USER_RESOURCE_ROLE_SELECT_ALL_DEFAULT = 'SELECT * FROM brtc_user_resource_role ORDER BY user_id, resource_type, resource_id, role_id';
const USER_RESOURCE_ROLE_SELECT_BY_RESOURCE_DEFAULT = 'SELECT * FROM brtc_user_resource_role WHERE resource_type=$1 AND resource_id';
const USER_RESOURCE_ROLE_SELECT_BY_USER_ID_DEFAULT = 'SELECT * FROM brtc_user_resource_role WHERE user_id=$1 AND role_id=$2';
const USER_RESOURCE_ROLE_CREATE_DEFAULT = 'INSERT INTO brtc_user_resource_role (user_id, resource_type, resource_id, role_id, create_time) VALUES ($1, $2, $3, $4, now())';
const USER_RESOURCE_ROLE_CREATE_SQLITE = `INSERT INTO brtc_user_resource_role (user_id, resource_type, resource_id, role_id, create_time) VALUES ($1, $2, $3, $4, datetime('now'))`;
const USER_RESOURCE_ROLE_DELETE_DEFAULT = 'DELETE FROM brtc_user_resource_role WHERE user_id=$1 AND resource_type=$2 AND resource_id=$3 AND role_id=$4';
const USER_RESOURCE_ROLE_DELETE_BY_ROLE_ID_DEFAULT = 'DELETE FROM brtc_user_resource_role WHERE role_id=$1';

const USER_RESOURCE_PERMISSION_SELECT_BY_USER_DEFAULT = '' +
    'SELECT distinct p.* ' +
    '  FROM brtc_user_resource_role urr, brtc_role r, brtc_role_permission rp, brtc_permission p ' +
    ' WHERE urr.user_id = $1 ' +
    '   AND urr.role_id = r.role_id ' +
    '   AND urr.role_id = rp.role_id ' +
    '   AND rp.permission_id = p.permission_id ';

const USER_RESOURCE_PERMISSION_SELECT_BY_ROLE_DEFAULT = '' +
    'SELECT distinct urr.*' +
    '  FROM brtc_user_resource_role urr, brtc_role r, brtc_role_permission rp, brtc_permission p' +
    ' WHERE urr.role_id = $1 ' +
    '   AND urr.role_id = r.role_id ' +
    '   AND urr.role_id = rp.role_id ' +
    '   AND rp.permission_id = p.permission_id ';

// const FILTER_USER_BY_AGENT = '' +
//     "   AND (CASE WHEN char_length($1) > 0 THEN " +
//     "   (brtc_user.id::text IN " +
//     "     ( SELECT agent.user_id " +
//     "       FROM brightics_agent_user_map mine, brightics_agent_user_map agent" +
//     "       WHERE " +
//     "         mine.user_id::text = $1::text " +
//     "         AND mine.agent_id = agent.agent_id " +
//     "     ) " +
//     "   ) " +
//     "  ELSE 1 = 1 " +
//     "  END)";

const PERMISSION_SELECT_BY_ROLE_DEFAULT = '' +
    'SELECT distinct p.* ' +
    '  FROM brtc_role r, brtc_role_permission rp, brtc_permission p ' +
    ' WHERE r.role_id = $1 ' +
    '   AND r.role_id = rp.role_id ' +
    '   AND rp.permission_id = p.permission_id ' +
    ' ORDER BY p.permission_id';

const stmt = {
    DDL_CHECK_TABLE: {
        default: DDL_CHECK_TABLE_DEFAULT
    },
    DDL_CREATE_USER_RESOURCE_ROLE_TABLE: {
        default: DDL_CREATE_USER_RESOURCE_ROLE_TABLE_DEFAULT,
        sqlite: DDL_CREATE_USER_RESOURCE_ROLE_TABLE_SQLITE
    },
    DDL_CREATE_USER_RESOURCE_ROLE_IDX_01: {
        default: DDL_CREATE_USER_RESOURCE_ROLE_IDX_01_DEFAULT
    },
    DDL_CREATE_USER_RESOURCE_ROLE_IDX_02: {
        default: DDL_CREATE_USER_RESOURCE_ROLE_IDX_02_DEFAULT
    },
    USER_RESOURCE_ROLE_SELECT_ALL: {
        default: USER_RESOURCE_ROLE_SELECT_ALL_DEFAULT
    },
    USER_RESOURCE_ROLE_SELECT_BY_RESOURCE: {
        default: USER_RESOURCE_ROLE_SELECT_BY_RESOURCE_DEFAULT
    },
    USER_RESOURCE_ROLE_SELECT_BY_USER_ID: {
        default: USER_RESOURCE_ROLE_SELECT_BY_USER_ID_DEFAULT
    },
    USER_RESOURCE_ROLE_CREATE: {
        default: USER_RESOURCE_ROLE_CREATE_DEFAULT,
        sqlite: USER_RESOURCE_ROLE_CREATE_SQLITE
    },
    USER_RESOURCE_ROLE_DELETE: {
        default: USER_RESOURCE_ROLE_DELETE_DEFAULT
    },
    USER_RESOURCE_ROLE_DELETE_BY_ROLE_ID: {
        default: USER_RESOURCE_ROLE_DELETE_BY_ROLE_ID_DEFAULT
    },
    USER_RESOURCE_PERMISSION_SELECT_BY_USER: {
        default: USER_RESOURCE_PERMISSION_SELECT_BY_USER_DEFAULT
    },
    USER_RESOURCE_PERMISSION_SELECT_BY_ROLE: {
        default: USER_RESOURCE_PERMISSION_SELECT_BY_ROLE_DEFAULT
    },
    PERMISSION_SELECT_BY_ROLE: {
        default: PERMISSION_SELECT_BY_ROLE_DEFAULT
    }
};

const DDL_CHECK_TABLE = getQuery(stmt, 'DDL_CHECK_TABLE');
const DDL_CREATE_USER_RESOURCE_ROLE_TABLE = getQuery(stmt, 'DDL_CREATE_USER_RESOURCE_ROLE_TABLE');
const USER_RESOURCE_ROLE_SELECT_ALL = getQuery(stmt, 'USER_RESOURCE_ROLE_SELECT_ALL');
const USER_RESOURCE_ROLE_SELECT_BY_RESOURCE = getQuery(stmt, 'USER_RESOURCE_ROLE_SELECT_BY_RESOURCE');
const USER_RESOURCE_ROLE_SELECT_BY_USER_ID = getQuery(stmt, 'USER_RESOURCE_ROLE_SELECT_BY_USER_ID');
const USER_RESOURCE_ROLE_CREATE = getQuery(stmt, 'USER_RESOURCE_ROLE_CREATE');
const USER_RESOURCE_ROLE_DELETE = getQuery(stmt, 'USER_RESOURCE_ROLE_DELETE');
const USER_RESOURCE_ROLE_DELETE_BY_ROLE_ID = getQuery(stmt, 'USER_RESOURCE_ROLE_DELETE_BY_ROLE_ID');
const USER_RESOURCE_PERMISSION_SELECT_BY_USER = getQuery(stmt, 'USER_RESOURCE_PERMISSION_SELECT_BY_USER');
const USER_RESOURCE_PERMISSION_SELECT_BY_ROLE = getQuery(stmt, 'USER_RESOURCE_PERMISSION_SELECT_BY_ROLE');
const PERMISSION_SELECT_BY_ROLE = getQuery(stmt, 'PERMISSION_SELECT_BY_ROLE');

module.exports = {
    user: {
        resource: {
            role: {
                checkSchema: function (errCallback, doneCallback) {
                    query(DDL_CHECK_TABLE, ['brtc_user_resource_role'], errCallback, function (result) {
                        if (result.length == 0) {
                            query(DDL_CREATE_USER_RESOURCE_ROLE_TABLE, [], errCallback, function () {
                                // query(DDL_CREATE_USER_RESOURCE_ROLE_IDX_01, [], errCallback, doneCallback);
                                // query(DDL_CREATE_USER_RESOURCE_ROLE_IDX_02, [], errCallback, doneCallback);
                                query(USER_RESOURCE_ROLE_CREATE, ['brightics@samsung.com', 'management', 'N/A', 'role_10101'], errCallback, doneCallback);

                                if (doneCallback) doneCallback(result.rows, result, DDL_CREATE_USER_RESOURCE_ROLE_TABLE, []);
                            });
                        } else {
                            if (doneCallback) doneCallback(result.rows, result, DDL_CHECK_TABLE, ['brtc_user_resource_role']);
                        }
                    });
                },
                selectAll: function (opt, errCallback, doneCallback) {
                    query(USER_RESOURCE_ROLE_SELECT_ALL, [], errCallback, doneCallback);
                },
                selectByResource: function (opt, errCallback, doneCallback) {
                    query(USER_RESOURCE_ROLE_SELECT_BY_RESOURCE, [opt.resource_type, opt.resource_id], errCallback, doneCallback);
                },
                selectByUser: function (opt, errCallback, doneCallback) {
                    query(USER_RESOURCE_ROLE_SELECT_BY_USER_ID, [opt.user_id, opt.role_id], errCallback, doneCallback);
                },
                create: function (opt, errCallback, doneCallback) {
                    query(USER_RESOURCE_ROLE_CREATE, [opt.user_id, opt.resource_type, opt.resource_id, opt.role_id], errCallback, doneCallback);
                },
                delete: function (opt, errCallback, doneCallback) {
                    query(USER_RESOURCE_ROLE_DELETE, [opt.user_id, opt.resource_type, opt.resource_id, opt.role_id], errCallback, doneCallback);
                },
                selectPermissionByUserAndResourceType: function (opt, errCallback, doneCallback) {
                    var params = [];
                    for (var i = 0; i < opt.resource_type.length; i++) {
                        params.push('$' + (i + 2));
                    }
                    var sql = USER_RESOURCE_PERMISSION_SELECT_BY_USER +
                        '   AND p.resource_type IN (' + params.join(',') + ')';
                    var args = [opt.user_id].concat(opt.resource_type);
                    query(sql, args, errCallback, doneCallback);
                },
                selectUserByRoleId: function (opt, errCallback, doneCallback) {
                    query(USER_RESOURCE_PERMISSION_SELECT_BY_ROLE, [opt.role_id], errCallback, doneCallback);
                },
                selectPermissionByRoleId: function (opt, errCallback, doneCallback) {
                    query(PERMISSION_SELECT_BY_ROLE, [opt.role_id], errCallback, doneCallback);
                },
                createByUserIdList: function (opt, errCallback, doneCallback) {
                    var records = [];
                    var userIdList = opt.userIdList;
                    for (var i in userIdList) {
                        records.push([userIdList[i], '', '', opt.role_id]);
                    }
                    batchUpdate(USER_RESOURCE_ROLE_CREATE, records, errCallback, doneCallback);
                },
                deleteByRoleIdList: function (opt, errCallback, doneCallback) {
                    var records = [];
                    var roleIdList = opt.roleIdList;
                    for (var i = 0; i < roleIdList.length; i++) {
                        records.push([roleIdList[i]]);
                    }
                    batchUpdate(USER_RESOURCE_ROLE_DELETE_BY_ROLE_ID, records, errCallback, doneCallback);
                },
            }
        }
    }
};
