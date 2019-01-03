/**
 * Created by daewon.park on 2016-09-20.
 */
var common = require('./common');
var query = common.query;
var batchUpdate = common.batchUpdate;

const getQuery = require('./query-utils').getQuery;

const DDL_CHECK_TABLE_DEFAULT = common.DDL_CHECK_TABLE;

const DDL_CREATE_ROLE_TABLE_DEFAULT = 'CREATE TABLE brtc_role ( ' +
    'role_id character varying(80) NOT NULL, ' +
    'role_category character varying(80) NOT NULL, ' +
    'role_label character varying(80) NOT NULL, ' +
    'description character varying(2048), ' +
    'CONSTRAINT brtc_role_pkey PRIMARY KEY (role_id) ) WITH ( OIDS=FALSE )';
const DDL_CREATE_ROLE_TABLE_SQLITE = 'CREATE TABLE brtc_role ( ' +
    'role_id character varying(80) NOT NULL, ' +
    'role_category character varying(80) NOT NULL, ' +
    'role_label character varying(80) NOT NULL, ' +
    'description character varying(2048), ' +
    'CONSTRAINT brtc_role_pkey PRIMARY KEY (role_id) )';
const ROLE_SELECT_ALL_DEFAULT = 'SELECT * FROM brtc_role ORDER BY role_id';
const ROLE_SELECT_ALL_EXTRICT_DEFAULT = 'SELECT * FROM brtc_role WHERE role_id IN (\'role_10101\', \'role_10102\', \'role_10103\') ORDER BY role_id ';
const ROLE_SELECT_WITH_CONDITION_DEFAULT = 'SELECT distinct a.* FROM brtc_role a, brtc_user_resource_role b WHERE a.role_id = b.role_id';
const ROLE_SELECT_WITH_CONDITION_EXTRICT_DEFAULT = 'SELECT distinct a.* FROM brtc_role a left outer join brtc_user_resource_role b on a.role_id = b.role_id WHERE a.role_id IN (\'role_10101\', \'role_10102\', \'role_10103\')';
const ROLE_SELECT_BY_ID_DEFAULT = 'SELECT * FROM brtc_role WHERE role_id=$1';
const ROLE_CREATE_DEFAULT = 'INSERT INTO brtc_role (role_id, role_category, role_label, description) VALUES ($1, $2, $3, $4)';
const ROLE_UPDATE_DEFAULT = 'UPDATE brtc_role SET (role_category, role_label, description) = ($1, $2, $3) WHERE role_id=$4';
const ROLE_DELETE_DEFAULT = 'DELETE FROM brtc_role WHERE role_id=$1';
const ROLE_SELECT_MAX_INDEX_DEFAULT = 'select to_number(MAX(SUBSTR(role_id, 6, 5)), \'99999\') + 1 as max_index from brtc_role';

const stmt = {
    DDL_CHECK_TABLE: {
        default: DDL_CHECK_TABLE_DEFAULT
    },
    DDL_CREATE_ROLE_TABLE: {
        default: DDL_CREATE_ROLE_TABLE_DEFAULT,
        sqlite: DDL_CREATE_ROLE_TABLE_SQLITE
    },
    ROLE_SELECT_ALL: {
        default: ROLE_SELECT_ALL_DEFAULT
    },
    ROLE_SELECT_ALL_EXTRICT: {
        default: ROLE_SELECT_ALL_EXTRICT_DEFAULT
    },
    ROLE_SELECT_WITH_CONDITION: {
        default: ROLE_SELECT_WITH_CONDITION_DEFAULT
    },
    ROLE_SELECT_WITH_CONDITION_EXTRICT: {
        default: ROLE_SELECT_WITH_CONDITION_EXTRICT_DEFAULT
    },
    ROLE_SELECT_BY_ID: {
        default: ROLE_SELECT_BY_ID_DEFAULT
    },
    ROLE_CREATE: {
        default: ROLE_CREATE_DEFAULT
    },
    ROLE_UPDATE: {
        default: ROLE_UPDATE_DEFAULT
    },
    ROLE_DELETE: {
        default: ROLE_DELETE_DEFAULT
    },
    ROLE_SELECT_MAX_INDEX: {
        default: ROLE_SELECT_MAX_INDEX_DEFAULT
    }
};

const DDL_CHECK_TABLE = getQuery(stmt, 'DDL_CHECK_TABLE');
const DDL_CREATE_ROLE_TABLE = getQuery(stmt, 'DDL_CREATE_ROLE_TABLE');
const ROLE_SELECT_ALL = getQuery(stmt, 'ROLE_SELECT_ALL');
const ROLE_SELECT_ALL_EXTRICT = getQuery(stmt, 'ROLE_SELECT_ALL_EXTRICT');
const ROLE_SELECT_WITH_CONDITION = getQuery(stmt, 'ROLE_SELECT_WITH_CONDITION');
const ROLE_SELECT_WITH_CONDITION_EXTRICT = getQuery(stmt, 'ROLE_SELECT_WITH_CONDITION_EXTRICT');
const ROLE_SELECT_BY_ID = getQuery(stmt, 'ROLE_SELECT_BY_ID');
const ROLE_CREATE = getQuery(stmt, 'ROLE_CREATE');
const ROLE_UPDATE = getQuery(stmt, 'ROLE_UPDATE');
const ROLE_DELETE = getQuery(stmt, 'ROLE_DELETE');
const ROLE_SELECT_MAX_INDEX = getQuery(stmt, 'ROLE_SELECT_MAX_INDEX');

module.exports = {
    role: {
        checkSchema: function (errCallback, doneCallback) {
            query(DDL_CHECK_TABLE, ['brtc_role'], errCallback, function (result) {
                if (result.length === 0) {
                    query(DDL_CREATE_ROLE_TABLE, [], errCallback, function () {
                        var records = [];
                        records.push(['role_10001', 'role_proj_member', 'Owner', 'Project Owner']);
                        records.push(['role_10002', 'role_proj_member', 'Organizer', 'Project Organizer']);
                        records.push(['role_10003', 'role_proj_member', 'Member', 'Project Member']);
                        records.push(['role_10004', 'role_proj_member', 'Reporter', 'Project Reporter']);
                        records.push(['role_10101', 'role_management', 'Administrator', 'Administrator']);
                        records.push(['role_10102', 'role_management', 'Power User', 'Power User']);
                        records.push(['role_10103', 'role_management', 'General User', 'General User']);
                        records.push(['role_12001', 'role_vip_level', 'Master', 'Master']);
                        records.push(['role_12002', 'role_vip_level', 'Diamond', 'Diamond']);
                        records.push(['role_12003', 'role_vip_level', 'Platinum', 'Platinum']);
                        records.push(['role_12004', 'role_vip_level', 'Gold', 'Gold']);
                        records.push(['role_12005', 'role_vip_level', 'Silver', 'Silver']);
                        records.push(['role_12006', 'role_vip_level', 'Bronze', 'Bronze']);
                        batchUpdate(ROLE_CREATE, records);

                        if (doneCallback) doneCallback(result.rows, result, DDL_CREATE_ROLE_TABLE, []);
                    });
                } else {
                    if (doneCallback) doneCallback(result.rows, result, DDL_CHECK_TABLE, ['brtc_role']);
                }
            });
        },
        selectAll: function (opt, errCallback, doneCallback) {
            query(ROLE_SELECT_ALL, [], errCallback, doneCallback);
        },
        selectAllExtrict: function (opt, errCallback, doneCallback) {
            query(ROLE_SELECT_ALL_EXTRICT, [], errCallback, doneCallback);
        },
        selectByCondition: function (opt, errCallback, doneCallback) {
            var sql = ROLE_SELECT_WITH_CONDITION;
            if(opt['user_id'])
                sql += ' AND b.user_id like ' + '\'%' + opt['user_id'] + '%\'';
            if(opt['role_label'])
                sql += ' AND a.role_label like ' + '\'%' + opt['role_label'] + '%\''
            query(sql, [], errCallback, doneCallback);
        },
        selectByConditionExtrict: function (opt, errCallback, doneCallback) {
            var sql = ROLE_SELECT_WITH_CONDITION_EXTRICT;
            if(opt['user_id'])
                sql += ' AND lower(b.user_id) like ' + '\'%' + opt['user_id'].toLowerCase() + '%\'';
            if(opt['role_label'])
                sql += ' AND lower(a.role_label) like ' + '\'%' + opt['role_label'].toLowerCase() + '%\''
            query(sql, [], errCallback, doneCallback);
        },
        selectMaxIndex: function (opt, errCallback, doneCallback) {
            query(ROLE_SELECT_MAX_INDEX, [], errCallback, doneCallback);
        },
        selectById: function (opt, errCallback, doneCallback) {
            query(ROLE_SELECT_BY_ID, [opt.role_id], errCallback, doneCallback);
        },
        create: function (opt, errCallback, doneCallback) {
            query(ROLE_CREATE, [opt.role_id, opt.role_category, opt.role_label, opt.description], errCallback, doneCallback);
        },
        update: function (opt, errCallback, doneCallback) {
            query(ROLE_UPDATE, [opt.role_category, opt.role_label, opt.description, opt.role_id], errCallback, doneCallback);
        },
        delete: function (opt, errCallback, doneCallback) {
            query(ROLE_DELETE, [opt.role_id], errCallback, doneCallback);
        },
        deleteByRoleIdList: function (opt, errCallback, doneCallback) {
            var records = [];
            var roleIdList = opt.roleIdList;
            for (var i = 0; i < roleIdList.length; i++) {
                records.push([roleIdList[i]]);
            }
            batchUpdate(ROLE_DELETE, records, errCallback, doneCallback);
        },
    }
};
