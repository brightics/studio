/**
 * Created by daewon.park on 2016-09-22.
 */
var common = require('./common');
var query = common.query;
var batchUpdate = common.batchUpdate;

const getQuery = require('./query-utils').getQuery;

const DDL_CHECK_TABLE_DEFAULT = common.DDL_CHECK_TABLE;
const DDL_CREATE_ROLE_PERMISSION_TABLE_DEFAULT = 'CREATE TABLE brtc_role_permission ( ' +
    'role_id character varying(80) NOT NULL, ' +
    'permission_id character varying(80) NOT NULL, ' +
    'permission_attr character varying(2048), ' +
    'description character varying(2048), ' +
    'CONSTRAINT brtc_role_permission_pkey PRIMARY KEY (role_id, permission_id) ) WITH ( OIDS=FALSE )';
const DDL_CREATE_ROLE_PERMISSION_TABLE_SQLITE = 'CREATE TABLE brtc_role_permission ( ' +
    'role_id character varying(80) NOT NULL, ' +
    'permission_id character varying(80) NOT NULL, ' +
    'permission_attr character varying(2048), ' +
    'description character varying(2048), ' +
    'CONSTRAINT brtc_role_permission_pkey PRIMARY KEY (role_id, permission_id) )';

const ROLE_PERMISSION_SELECT_ALL_DEFAULT = 'SELECT * FROM brtc_role_permission ORDER BY role_id, permission_id';
const ROLE_PERMISSION_CREATE_DEFAULT = 'INSERT INTO brtc_role_permission (role_id, permission_id, permission_attr, description) VALUES ($1, $2, $3, $4)';
const ROLE_PERMISSION_DELETE_BY_ROLE_ID_DEFAULT = 'DELETE FROM brtc_role_permission WHERE role_id = $1';
const ROLE_PERMISSION_DELETE_BY_PERMISSION_ID_DEFAULT = 'DELETE FROM brtc_role_permission WHERE permission_id = $1';
const ROLE_PERMISSION_DELETE_DEPLOY_EXCEPT_ADMIN_DEFAULT = 'DELETE FROM brtc_role_permission WHERE role_id = $1 AND permission_id LIKE \'perm_deploy%\'';
const ROLE_PERMISSION_DELETE_GENERAL_PERMISSION_DEFAULT = 'DELETE FROM brtc_role_permission WHERE role_id = \'role_10103\' AND permission_id = $1';


const stmt = {
    DDL_CHECK_TABLE: {
        default: DDL_CHECK_TABLE_DEFAULT
    },
    DDL_CREATE_ROLE_PERMISSION_TABLE: {
        default: DDL_CREATE_ROLE_PERMISSION_TABLE_DEFAULT,
        sqlite: DDL_CREATE_ROLE_PERMISSION_TABLE_SQLITE
    },
    ROLE_PERMISSION_SELECT_ALL: {
        default: ROLE_PERMISSION_SELECT_ALL_DEFAULT
    },
    ROLE_PERMISSION_CREATE: {
        default: ROLE_PERMISSION_CREATE_DEFAULT
    },
    ROLE_PERMISSION_DELETE_BY_ROLE_ID: {
        default: ROLE_PERMISSION_DELETE_BY_ROLE_ID_DEFAULT
    },
    ROLE_PERMISSION_DELETE_DEPLOY_EXCEPT_ADMIN: {
        default: ROLE_PERMISSION_DELETE_DEPLOY_EXCEPT_ADMIN_DEFAULT
    },
    ROLE_PERMISSION_DELETE_GENERAL_PERMISSION: {
        default: ROLE_PERMISSION_DELETE_GENERAL_PERMISSION_DEFAULT
    },
    ROLE_PERMISSION_DELETE_BY_PERMISSION_ID: {
        default: ROLE_PERMISSION_DELETE_BY_PERMISSION_ID_DEFAULT
    }
};

const DDL_CHECK_TABLE = getQuery(stmt, 'DDL_CHECK_TABLE');
const DDL_CREATE_ROLE_PERMISSION_TABLE = getQuery(stmt, 'DDL_CREATE_ROLE_PERMISSION_TABLE');
const ROLE_PERMISSION_SELECT_ALL = getQuery(stmt, 'ROLE_PERMISSION_SELECT_ALL');
const ROLE_PERMISSION_CREATE = getQuery(stmt, 'ROLE_PERMISSION_CREATE');
const ROLE_PERMISSION_DELETE_BY_ROLE_ID = getQuery(stmt, 'ROLE_PERMISSION_DELETE_BY_ROLE_ID');
const ROLE_PERMISSION_DELETE_DEPLOY_EXCEPT_ADMIN = getQuery(stmt, 'ROLE_PERMISSION_DELETE_DEPLOY_EXCEPT_ADMIN');
const ROLE_PERMISSION_DELETE_GENERAL_PERMISSION = getQuery(stmt, 'ROLE_PERMISSION_DELETE_GENERAL_PERMISSION');
const ROLE_PERMISSION_DELETE_BY_PERMISSION_ID = getQuery(stmt, 'ROLE_PERMISSION_DELETE_BY_PERMISSION_ID');


const canMonitor = __BRTC_CONF['use-monitoring'] && process.platform === 'linux';

const fnify = (fn) => fn || function () { };

const doWhen = (cond, cb) => (result) => {
    if (cond(result.length)) {
        cb(result);
    }
};

const lenIsZero = (len) => len === 0;

module.exports = {
    role: {
        permission: {
            checkSchema: function (_errCallback, _doneCallback) {
                const errCallback = fnify(_errCallback);
                const doneCallback = fnify(_doneCallback);
                query(DDL_CHECK_TABLE, ['brtc_role_permission'], errCallback, function (result) {
                    if (result.length === 0) {
                        query(DDL_CREATE_ROLE_PERMISSION_TABLE, [], errCallback, function () {
                            var records = [];
                            records.push(['role_10001', 'perm_proj_read', '', 'Read a project']);
                            records.push(['role_10001', 'perm_proj_update', '', 'Modify a project']);
                            records.push(['role_10001', 'perm_proj_delete', '', 'Delete a project']);
                            records.push(['role_10001', 'perm_file_create', '', 'Create a file']);
                            records.push(['role_10001', 'perm_file_read', '', 'Read a file']);
                            records.push(['role_10001', 'perm_file_update', '', 'Modify a file']);
                            records.push(['role_10001', 'perm_file_delete', '', 'Delete a file']);

                            records.push(['role_10002', 'perm_proj_read', '', 'Read a project']);
                            records.push(['role_10002', 'perm_proj_update', '', 'Modify a project']);
                            records.push(['role_10002', 'perm_file_create', '', 'Create a file']);
                            records.push(['role_10002', 'perm_file_read', '', 'Read a file']);
                            records.push(['role_10002', 'perm_file_update', '', 'Modify a file']);
                            records.push(['role_10002', 'perm_file_delete', '', 'Delete a file']);

                            records.push(['role_10003', 'perm_proj_read', '', 'Read a project']);
                            records.push(['role_10003', 'perm_file_create', '', 'Create a file']);
                            records.push(['role_10003', 'perm_file_read', '', 'Read a file']);
                            records.push(['role_10003', 'perm_file_update', '', 'Modify a file']);
                            records.push(['role_10003', 'perm_file_delete', '', 'Delete a file']);

                            records.push(['role_10004', 'perm_proj_read', '', 'Read a project']);
                            records.push(['role_10004', 'perm_file_read', '', 'Read a file']);

                            records.push(['role_10101', 'perm_account_create', '', 'Create a account']);
                            records.push(['role_10101', 'perm_account_read', '', 'Read a account']);
                            records.push(['role_10101', 'perm_account_update', '', 'Modify a account']);
                            records.push(['role_10101', 'perm_account_delete', '', 'Delete a account']);
                            records.push(['role_10101', 'perm_agent_create', '', 'Create a agent']);
                            records.push(['role_10101', 'perm_agent_read', '', 'Read a agent']);
                            records.push(['role_10101', 'perm_agent_update', '', 'Modify a agent']);
                            records.push(['role_10101', 'perm_agent_delete', '', 'Delete a agent']);
                            records.push(['role_10101', 'perm_schedule_create', '', 'Create a schedule']);
                            records.push(['role_10101', 'perm_schedule_read', '', 'Read a schedule']);
                            records.push(['role_10101', 'perm_schedule_update', '', 'Modify a schedule']);
                            records.push(['role_10101', 'perm_schedule_delete', '', 'Delete a schedule']);
                            records.push(['role_10101', 'perm_notice_create', '', 'Create a notice']);
                            records.push(['role_10101', 'perm_notice_read', '', 'Read a notice']);
                            records.push(['role_10101', 'perm_notice_update', '', 'Modify a notice']);
                            records.push(['role_10101', 'perm_notice_delete', '', 'Delete a notice']);
                            records.push(['role_10101', 'perm_authorization_create', '', 'Create a authorization']);
                            records.push(['role_10101', 'perm_authorization_read', '', 'Read a authorization']);
                            records.push(['role_10101', 'perm_authorization_update', '', 'Modify a authorization']);
                            records.push(['role_10101', 'perm_authorization_delete', '', 'Delete a authorization']);
                            records.push(['role_10101', 'perm_job_stop', '', 'Stop a streaming job']);
                            records.push(['role_10101', 'perm_repo_shared_create', '', 'Create a shared file']);
                            records.push(['role_10101', 'perm_repo_shared_read', '', 'Read a shared file']);
                            records.push(['role_10101', 'perm_repo_shared_update', '', 'Modify a shared file']);
                            records.push(['role_10101', 'perm_repo_shared_delete', '', 'Delete a shared file']);
                            records.push(['role_10101', 'perm_deploy_create', '', 'Create a deploy']);
                            records.push(['role_10101', 'perm_deploy_read', '', 'Read a deploy']);
                            records.push(['role_10101', 'perm_deploy_update', '', 'Update a deploy']);
                            records.push(['role_10101', 'perm_deploy_delete', '', 'Delete a deploy']);
                            records.push(['role_10101', 'perm_publish_create', '', 'Create a publish']);
                            records.push(['role_10101', 'perm_publish_read', '', 'Read a publish']);
                            records.push(['role_10101', 'perm_publish_delete', '', 'Delete a publish']);
                            records.push(['role_10101', 'perm_account_read_force', '', 'Force read a account']);
                            records.push(['role_10101', 'perm_agent_read_force', '', 'Force read a agent']);

                            records.push(['role_10101', 'perm_datasource_create', '', 'Create a datasource']);
                            records.push(['role_10101', 'perm_datasource_read', '', 'Read a datasource']);
                            records.push(['role_10101', 'perm_datasource_update', '', 'Update a datasource']);
                            records.push(['role_10101', 'perm_datasource_delete', '', 'Delete a datasource']);

                            if (canMonitor) {
                                records.push(['role_10101', 'perm_monitoring_read', '', 'Read a monitoring']);
                            }

                            records.push(['role_10102', 'perm_account_read', '', 'Read a account']);
                            records.push(['role_10102', 'perm_agent_read', '', 'Read a agent']);
                            records.push(['role_10102', 'perm_agent_update', '', 'Modify a agent']);
                            records.push(['role_10102', 'perm_schedule_create', '', 'Create a schedule']);
                            records.push(['role_10102', 'perm_schedule_read', '', 'Read a schedule']);
                            records.push(['role_10102', 'perm_schedule_update', '', 'Modify a schedule']);
                            records.push(['role_10102', 'perm_schedule_delete', '', 'Delete a schedule']);
                            records.push(['role_10102', 'perm_notice_read', '', 'Read a notice']);
                            records.push(['role_10102', 'perm_job_stop', '', 'Stop a streaming job']);
                            // records.push(['role_10102', 'perm_deploy_create', '', 'Create a deploy']);
                            // records.push(['role_10102', 'perm_deploy_read', '', 'Read a deploy']);
                            // records.push(['role_10102', 'perm_deploy_update', '', 'Update a deploy']);
                            // records.push(['role_10102', 'perm_deploy_delete', '', 'Delete a deploy']);
                            records.push(['role_10102', 'perm_publish_create', '', 'Create a publish']);
                            records.push(['role_10102', 'perm_publish_read', '', 'Read a publish']);
                            records.push(['role_10102', 'perm_publish_delete', '', 'Delete a publish']);
                            records.push(['role_10102', 'perm_repo_shared_create', '', 'Create a shared file']);
                            records.push(['role_10102', 'perm_repo_shared_read', '', 'Read a shared file']);

                            records.push(['role_10103', 'perm_account_read', '', 'Read a account']);
                            // records.push(['role_10103', 'perm_agent_read', '', 'Read a agent']);
                            records.push(['role_10103', 'perm_schedule_read_my', '', 'Read a my schedule']);
                            records.push(['role_10103', 'perm_notice_read', '', 'Read a notice']);
                            // records.push(['role_10103', 'perm_deploy_create', '', 'Create a deploy']);
                            // records.push(['role_10103', 'perm_deploy_read', '', 'Read a deploy']);
                            records.push(['role_10103', 'perm_publish_read', '', 'Read a publish']);
                            records.push(['role_10103', 'perm_publish_read_my', '', 'Read a my publish']);
                            records.push(['role_10103', 'perm_repo_shared_create', '', 'Create a shared file']);
                            records.push(['role_10103', 'perm_repo_shared_read', '', 'Read a shared file']);

                            records.push(['role_12001', 'perm_proj_create', '{"limit": 30}', 'Create a project']);
                            records.push(['role_12002', 'perm_proj_create', '{"limit": 20}', 'Create a project']);
                            records.push(['role_12003', 'perm_proj_create', '{"limit": 10}', 'Create a project']);
                            records.push(['role_12004', 'perm_proj_create', '{"limit": 5}', 'Create a project']);
                            records.push(['role_12005', 'perm_proj_create', '{"limit": 3}', 'Create a project']);
                            records.push(['role_12006', 'perm_proj_create', '{"limit": 1}', 'Create a project']);

                            records.push(['role_12001', 'perm_file_create', '{"limit": 30}', 'Create a file']);
                            records.push(['role_12002', 'perm_file_create', '{"limit": 20}', 'Create a file']);
                            records.push(['role_12003', 'perm_file_create', '{"limit": 10}', 'Create a file']);
                            records.push(['role_12004', 'perm_file_create', '{"limit": 5}', 'Create a file']);
                            records.push(['role_12005', 'perm_file_create', '{"limit": 3}', 'Create a file']);
                            records.push(['role_12006', 'perm_file_create', '{"limit": 1}', 'Create a file']);

                            records.push(['role_10101', 'perm_udf_read', '', 'Read user defined function']);
                            records.push(['role_10101', 'perm_udf_create', '', 'Create user defined function']);
                            records.push(['role_10101', 'perm_udf_delete', '', 'Delete user defined function']);
                            records.push(['role_10103', 'perm_udf_read', '', 'Read user defined function']);

                            records.push(['role_10101', 'data_upload_shared', '', 'Upload to shared repository']);
                            records.push(['role_10102', 'data_upload_shared', '', 'Upload to shared repository']);

                            batchUpdate(ROLE_PERMISSION_CREATE, records);

                            doneCallback(result.rows, result, DDL_CREATE_ROLE_PERMISSION_TABLE, ['brtc_role_permission']);
                        });
                    }
                    query('select * from brtc_role_permission where role_id = \'role_10101\' and permission_id in (\'perm_monitoring_read\')', [], errCallback, function (result) {
                        if (canMonitor) {
                            if (result.length === 0) {
                                var records = [];
                                records.push(['role_10101', 'perm_monitoring_read', '', 'Read a monitoring']);
                                batchUpdate(ROLE_PERMISSION_CREATE, records);
                            }
                        } else if (result.length > 0) {
                            batchUpdate(ROLE_PERMISSION_DELETE_BY_PERMISSION_ID, [['perm_monitoring_read']]);
                        }
                    });

                    query('select * from brtc_role_permission where role_id = \'role_10101\' and permission_id in (\'perm_datasource_create\', \'perm_datasource_read\', \'perm_datasource_delete\', \'perm_datasource_update\')', [], errCallback, doWhen(lenIsZero, (result) => {
                        var records = [];
                        records.push(['role_10101', 'perm_datasource_create', '', 'Create a datasource']);
                        records.push(['role_10101', 'perm_datasource_read', '', 'Read a datasource']);
                        records.push(['role_10101', 'perm_datasource_update', '', 'Update a datasource']);
                        records.push(['role_10101', 'perm_datasource_delete', '', 'Delete a datasource']);

                        batchUpdate(ROLE_PERMISSION_CREATE, records);
                    }));

                    query('select * from brtc_role_permission where role_id = \'role_10101\' and permission_id in (\'perm_deploy_read\', \'perm_deploy_delete\')', [], errCallback, doWhen(lenIsZero, (result) => {
                        var records = [];
                        records.push(['role_10101', 'perm_deploy_create', '', 'Create a deploy']);
                        records.push(['role_10101', 'perm_deploy_read', '', 'Read a deploy']);
                        records.push(['role_10101', 'perm_deploy_update', '', 'Update a deploy']);
                        records.push(['role_10101', 'perm_deploy_delete', '', 'Delete a deploy']);

                        // records.push(['role_10102', 'perm_deploy_create', '', 'Create a deploy']);
                        // records.push(['role_10102', 'perm_deploy_read', '', 'Read a deploy']);
                        // records.push(['role_10102', 'perm_deploy_update', '', 'Update a deploy']);
                        // records.push(['role_10102', 'perm_deploy_delete', '', 'Delete a deploy']);
                        //
                        // records.push(['role_10103', 'perm_deploy_create', '', 'Create a deploy']);
                        // records.push(['role_10103', 'perm_deploy_read', '', 'Read a deploy']);

                        batchUpdate(ROLE_PERMISSION_CREATE, records);
                    }));

                    query('select * from brtc_role_permission where permission_id in (\'perm_publish_create\', \'perm_publish_read\' , \'perm_publish_delete\')', [], errCallback,
                        doWhen(lenIsZero, (result) => {
                            var records = [];
                            records.push(['role_10101', 'perm_publish_create', '', 'Create a publish']);
                            records.push(['role_10101', 'perm_publish_read', '', 'Read a publish']);
                            records.push(['role_10101', 'perm_publish_delete', '', 'Delete a publish']);

                            records.push(['role_10102', 'perm_publish_create', '', 'Create a publish']);
                            records.push(['role_10102', 'perm_publish_read', '', 'Read a publish']);
                            records.push(['role_10102', 'perm_publish_delete', '', 'Delete a publish']);

                            records.push(['role_10103', 'perm_publish_read', '', 'Read a publish']);

                            batchUpdate(ROLE_PERMISSION_CREATE, records);
                        })
                    );

                    query('select * from brtc_role_permission where permission_id in (\'perm_repo_shared_create\')', [], errCallback, doWhen(lenIsZero, (result) => {
                        var records = [];

                        records.push(['role_10101', 'perm_repo_shared_create', '', 'Create a shared file']);
                        records.push(['role_10102', 'perm_repo_shared_create', '', 'Create a shared file']);
                        records.push(['role_10103', 'perm_repo_shared_create', '', 'Create a shared file']);

                        batchUpdate(ROLE_PERMISSION_CREATE, records);
                    }));

                    query('select * from brtc_role_permission where permission_id in (\'perm_repo_shared_read\')', [], errCallback, doWhen(lenIsZero, (result) => {
                        var records = [];

                        records.push(['role_10101', 'perm_repo_shared_read', '', 'Read a shared file']);
                        records.push(['role_10102', 'perm_repo_shared_read', '', 'Read a shared file']);
                        records.push(['role_10103', 'perm_repo_shared_read', '', 'Read a shared file']);

                        batchUpdate(ROLE_PERMISSION_CREATE, records);
                    }));

                    query('SELECT * FROM brtc_role_permission WHERE (role_id = \'role_10103\' OR role_id = \'role_10102\') AND permission_id LIKE \'perm_deploy%\'', [], errCallback, doWhen((len) => len > 0, (result) => {
                        var records = [];

                        records.push(['role_10103']);
                        records.push(['role_10102']);

                        batchUpdate(ROLE_PERMISSION_DELETE_DEPLOY_EXCEPT_ADMIN, records);
                    }));

                    query('select * from brtc_role_permission where role_id = \'role_10103\' AND permission_id in (\'perm_schedule_read_my\', \'perm_publish_read_my\', \'perm_publish_read\')', [], errCallback, doWhen((len) => len < 3, (result) => {
                        var prev = [], added = [];
                        prev.push(['perm_schedule_read_my']);
                        prev.push(['perm_publish_read_my']);

                        // list.push(['role_10103', 'perm_deploy_create', '', 'Create a deploy']);
                        added.push(['role_10103', 'perm_schedule_read_my', '', 'Read a my schedule']);
                        added.push(['role_10103', 'perm_publish_read_my', '', 'Read a my publish']);
                        added.push(['role_10103', 'perm_publish_read', '', 'Read a publish']);

                        batchUpdate(ROLE_PERMISSION_DELETE_GENERAL_PERMISSION, prev);

                        batchUpdate(ROLE_PERMISSION_CREATE, added);
                    }));

                    query('select * from brtc_role_permission where role_id = \'role_10103\' AND permission_id in (\'perm_schedule_read\')', [], errCallback, doWhen((len) => len > 0, (result) => {
                        var records = [];

                        records.push(['perm_schedule_read']);
                        // records.push(['perm_publish_read']);

                        batchUpdate(ROLE_PERMISSION_DELETE_GENERAL_PERMISSION, records);
                    }));

                    query('select * from brtc_role_permission where role_id = \'role_10103\' AND permission_id in (\'perm_agent_read\')', [], errCallback, function (result) {
                        if (result.length > 0) {
                            var records = [];

                            records.push(['perm_agent_read']);

                            batchUpdate(ROLE_PERMISSION_DELETE_GENERAL_PERMISSION, records);
                        }
                    });

                    query('select * from brtc_role_permission where role_id = \'role_10101\' AND permission_id in (\'data_upload_shared\')', [], errCallback, doWhen(lenIsZero, (result) => {
                        var added = [];
                        added.push(['role_10101', 'data_upload_shared', '', 'Upload to shared repository']);

                        batchUpdate(ROLE_PERMISSION_CREATE, added);
                    }));

                    query('select * from brtc_role_permission where role_id = \'role_10102\' AND permission_id in (\'data_upload_shared\')', [], errCallback, doWhen(lenIsZero, (result) => {
                        var added = [];
                        added.push(['role_10102', 'data_upload_shared', '', 'Upload to shared repository']);

                        batchUpdate(ROLE_PERMISSION_CREATE, added);
                    }));

                    doneCallback(result.rows, result, DDL_CHECK_TABLE, ['brtc_role_permission']);
                });
            },
            selectAll: function (opt, errCallback, doneCallback) {
                query(ROLE_PERMISSION_SELECT_ALL, [], errCallback, doneCallback);
            },
            createFromPermissionList: function (opt, errCallback, doneCallback) {
                var records = [];
                var permissionIdList = opt.permissionIdList;
                for (var i = 0; i < permissionIdList.length; i++) {
                    records.push([opt.role_id, permissionIdList[i], '', '']);
                }
                batchUpdate(ROLE_PERMISSION_CREATE, records, errCallback, doneCallback);

            },
            deleteByRoleIdList: function (opt, errCallback, doneCallback) {
                var records = [];
                var roleIdList = opt.roleIdList;
                for (var i = 0; i < roleIdList.length; i++) {
                    records.push([roleIdList[i]]);
                }
                batchUpdate(ROLE_PERMISSION_DELETE_BY_ROLE_ID, records, errCallback, doneCallback);
            },
        }
    }
};
