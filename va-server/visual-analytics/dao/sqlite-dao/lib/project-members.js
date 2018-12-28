var async = require('async');
var common = require('./common');
var query = common.query;

const getQuery = require('./query-utils').getQuery;

// TODO brtc_user --> brtc_user_view
const SELECT_MEMBER_BY_PROJECT_DEFAULT = '' +
    'SELECT m.* ' +
    '  FROM ( SELECT creator as user_id, \'role_10001\' as role_id, \'role_proj_member\' as role_category, \'Owner\' as role_label, create_time as joined_time ' +
    '           FROM brtc_project ' +
    '          WHERE id = $1 ' +
    '          UNION ' +
    '         SELECT a.user_id, a.role_id, b.role_category, b.role_label, a.create_time as joined_time ' +
    '           FROM brtc_user_resource_role a left join brtc_role b on a.role_id = b.role_id ' +
    '          WHERE a.resource_type = \'project\' ' +
    '            AND a.resource_id = $1 ' +
    '            AND b.role_category = \'role_proj_member\' ) m' +
    ' WHERE 1 = 1';


const SELECT_MEMBER_BY_PROJECT_ORDERED_DEFAULT = SELECT_MEMBER_BY_PROJECT_DEFAULT +
    ' ORDER by m.role_id';

const SELECT_MEMBER_BY_PROJECT_USER_DEFAULT = SELECT_MEMBER_BY_PROJECT_DEFAULT +
    '   AND m.user_id = $2';

const SELECT_PERMISSION_BY_PROJECT_USER_DEFAULT = '' +
    'SELECT r.*, p.permission_id, p.permission_attr ' +
    '  FROM ( SELECT creator as user_id, \'role_10001\' as role_id, \'role_proj_member\' as role_category, \'Owner\' as role_label, create_time as joined_time ' +
    '           FROM brtc_project ' +
    '          WHERE id = $1 ' +
    '            AND creator = $2 ' +
    '          UNION ' +
    '         SELECT a.user_id, a.role_id, b.role_category, b.role_label, a.create_time as joined_time ' +
    '           FROM brtc_user_resource_role a left join brtc_role b on a.role_id = b.role_id ' +
    '          WHERE a.resource_type = \'project\' ' +
    '            AND a.resource_id = $1 ' +
    '            AND a.user_id = $2 ' +
    '            AND b.role_category = \'role_proj_member\' ) r, brtc_role_permission p ' +
    ' WHERE r.role_id = p.role_id ';

const UPDATE_AUTHORITY_DEFAULT = 'UPDATE brtc_user_resource_role SET (role_id) = ($1) WHERE resource_type = \'project\' AND resource_id=$2 AND user_id=$3';

/**
 * 프로젝트 소유자를 멤버로 추가할 경우 CASE WHEN THEN 을 이용하여 아이디를 NULL 로 입력하여 INSERT 못하게 함. by daewon.park
 */
const INSERT_MEMBER_DEFAULT = '' +
    'INSERT INTO brtc_user_resource_role (user_id, resource_type, resource_id, role_id, create_time) ' +
    'SELECT CASE WHEN $1 = (SELECT creator FROM brtc_project WHERE id=$2) THEN NULL ELSE $1 END, ' +
    '       \'project\', $2, $3, now()';

const INSERT_MEMBER_SQLITE = `
    INSERT INTO brtc_user_resource_role (user_id, resource_type, resource_id, role_id, create_time)
    SELECT CASE WHEN $1 = (SELECT creator FROM brtc_project WHERE id=$2) THEN NULL ELSE $1 END,
           'project', $2, $3, datetime('now')`;

const DELETE_MEMBER_DEFAULT = 'DELETE FROM brtc_user_resource_role WHERE user_id=$1 AND resource_type=\'project\' AND resource_id=$2 AND role_id=$3';

const stmt = {
    SELECT_MEMBER_BY_PROJECT: {
        default: SELECT_MEMBER_BY_PROJECT_DEFAULT
    },
    SELECT_MEMBER_BY_PROJECT_ORDERED: {
        default: SELECT_MEMBER_BY_PROJECT_ORDERED_DEFAULT
    },
    SELECT_MEMBER_BY_PROJECT_USER: {
        default: SELECT_MEMBER_BY_PROJECT_USER_DEFAULT
    },
    SELECT_PERMISSION_BY_PROJECT_USER: {
        default: SELECT_PERMISSION_BY_PROJECT_USER_DEFAULT
    },
    UPDATE_AUTHORITY: {
        default: UPDATE_AUTHORITY_DEFAULT
    },
    INSERT_MEMBER: {
        default: INSERT_MEMBER_DEFAULT,
        sqlite: INSERT_MEMBER_SQLITE
    },
    DELETE_MEMBER: {
        default: DELETE_MEMBER_DEFAULT
    }
};

const SELECT_MEMBER_BY_PROJECT_ORDERED = getQuery(stmt, 'SELECT_MEMBER_BY_PROJECT_ORDERED');
const SELECT_MEMBER_BY_PROJECT_USER = getQuery(stmt, 'SELECT_MEMBER_BY_PROJECT_USER');
const SELECT_PERMISSION_BY_PROJECT_USER = getQuery(stmt, 'SELECT_PERMISSION_BY_PROJECT_USER');
const UPDATE_AUTHORITY = getQuery(stmt, 'UPDATE_AUTHORITY');
const INSERT_MEMBER = getQuery(stmt, 'INSERT_MEMBER');
const DELETE_MEMBER = getQuery(stmt, 'DELETE_MEMBER');

const doWhilst = (opt, getArgs, qry, errCallback, doneCallback) => {
    let count = 0;
    let affected = 0;
    async.whilst(
        () => {
            return count < opt.members.length;
        },
        (next) => {
            query(qry, getArgs(opt, count),
                (err) => {
                    count++;
                    console.log(err);
                    next(null, affected);
                },
                (result) => {
                    count++;
                    affected += result;
                    next(null, affected);
                }
            );
        },
        (err, n) => {
            if (err) {
                if (errCallback) errCallback(err);
            } else {
                if (doneCallback) doneCallback(n);
            }
        }
    );
};

module.exports = {
    project: {
        members: {
            selectByProject: function (opt, errCallback, doneCallback) {
                query(SELECT_MEMBER_BY_PROJECT_ORDERED, [opt.project_id],
                    errCallback, doneCallback);
            },
            selectByProjectUser: function (opt, errCallback, doneCallback) {
                query(SELECT_MEMBER_BY_PROJECT_USER, [opt.project_id, opt.user_id],
                    errCallback, doneCallback);
            },
            selectPermissionByProjectUser: function (opt, errCallback, doneCallback) {
                query(SELECT_PERMISSION_BY_PROJECT_USER, [opt.project_id, opt.user_id],
                    errCallback, doneCallback);
            },
            updateAuthority: function (opt, errCallback, doneCallback) {
                doWhilst(opt,
                    (o, cnt) => [o.members[cnt].role_id, o.project_id, o.members[cnt].user_id],
                    UPDATE_AUTHORITY,
                    errCallback,
                    doneCallback
                );
            },
            invite: function (opt, errCallback, doneCallback) {
                doWhilst(opt,
                    (o, cnt) => [o.members[cnt].user_id, o.project_id, o.members[cnt].role_id],
                    INSERT_MEMBER,
                    errCallback,
                    doneCallback
                );
            },
            withdraw: function (opt, errCallback, doneCallback) {
                doWhilst(opt,
                    (o, cnt) => [o.members[cnt].user_id, o.project_id, o.members[cnt].role_id],
                    DELETE_MEMBER,
                    errCallback,
                    doneCallback
                );
            }
        }
    }
};
