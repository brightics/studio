/**
 * Created by daewon.park on 2016-09-22.
 */
var common = require('./common');
const getQuery = require('./query-utils').getQuery;
const DDL_CHECK_TABLE_DEFAULT = common.DDL_CHECK_TABLE;
var query = common.query;
var batchUpdate = common.batchUpdate;

const DDL_CREATE_PERMISSION_TABLE_DEFAULT = 'CREATE TABLE brtc_permission (' +
    'permission_id character varying(80) NOT NULL, ' +
    'resource_type character varying(80) NOT NULL, ' +
    'description character varying(2048) NOT NULL, ' +
    'CONSTRAINT brtc_permission_pkey PRIMARY KEY (permission_id) ' +
    ') WITH ( OIDS=FALSE )';

const DDL_CREATE_PERMISSION_TABLE_SQLITE = 'CREATE TABLE brtc_permission (' +
    'permission_id character varying(80) NOT NULL, ' +
    'resource_type character varying(80) NOT NULL, ' +
    'description character varying(2048) NOT NULL, ' +
    'CONSTRAINT brtc_permission_pkey PRIMARY KEY (permission_id))';

const PERMISSION_SELECT_ALL_DEFAULT = 'SELECT * FROM brtc_permission ORDER BY permission_id';
const PERMISSION_RESOURCE_TYPE_SELECT_BY_USERID_DEFAULT = 'SELECT DISTINCT p.resource_type AS resource_type ' +
    'FROM brtc_user_resource_role urr, brtc_role_permission rp, brtc_permission p ' +
    'WHERE urr.user_id = $1 ' +
    'AND urr.role_id = rp.role_id ' +
    'AND rp.permission_id = p.permission_id ';
const PERMISSION_CREATE_DEFAULT = 'INSERT INTO brtc_permission (permission_id, resource_type, description) VALUES ($1, $2, $3)';
const PERMISSION_DELETE_DEFAULT = 'DELETE FROM brtc_permission WHERE resource_type = $1';


const stmt = {
    DDL_CHECK_TABLE: {
        default: DDL_CHECK_TABLE_DEFAULT
    },
    DDL_CREATE_PERMISSION_TABLE: {
        default: DDL_CREATE_PERMISSION_TABLE_DEFAULT,
        sqlite: DDL_CREATE_PERMISSION_TABLE_SQLITE
    },
    PERMISSION_SELECT_ALL: {
        default: PERMISSION_SELECT_ALL_DEFAULT
    },
    PERMISSION_RESOURCE_TYPE_SELECT_BY_USERID: {
        default: PERMISSION_RESOURCE_TYPE_SELECT_BY_USERID_DEFAULT
    },
    PERMISSION_CREATE: {
        default: PERMISSION_CREATE_DEFAULT
    }
};

const DDL_CHECK_TABLE = getQuery(stmt, 'DDL_CHECK_TABLE');
const DDL_CREATE_PERMISSION_TABLE = getQuery(stmt, 'DDL_CREATE_PERMISSION_TABLE');
const PERMISSION_SELECT_ALL = getQuery(stmt, 'PERMISSION_SELECT_ALL');
const PERMISSION_RESOURCE_TYPE_SELECT_BY_USERID = getQuery(stmt, 'PERMISSION_RESOURCE_TYPE_SELECT_BY_USERID');
const PERMISSION_CREATE = getQuery(stmt, 'PERMISSION_CREATE');


module.exports = {
    permission: {
        checkSchema: function (errCallback, doneCallback) {
            query(DDL_CHECK_TABLE, ['brtc_permission'], errCallback, function (result) {
                if (result.length === 0) {
                    query(DDL_CREATE_PERMISSION_TABLE, [], errCallback, function () {
                        var records = [];
                        records.push(['perm_proj_create', 'project', 'Create a project']);
                        records.push(['perm_proj_read', 'project', 'Read a project']);
                        records.push(['perm_proj_update', 'project', 'Modify a project']);
                        records.push(['perm_proj_delete', 'project', 'Delete a project']);
                        records.push(['perm_file_create', 'file', 'Create a file']);
                        records.push(['perm_file_read', 'file', 'Read a file']);
                        records.push(['perm_file_update', 'file', 'Modify a file']);
                        records.push(['perm_file_delete', 'file', 'Delete a file']);
                        records.push(['perm_account_create', 'user', 'Create a account']);
                        records.push(['perm_account_read', 'user', 'Read a account']);
                        records.push(['perm_account_update', 'user', 'Modify a account']);
                        records.push(['perm_account_delete', 'user', 'Delete a account']);
                        records.push(['perm_agent_create', 'agent', 'Create a agent']);
                        records.push(['perm_agent_read', 'agent', 'Read a agent']);
                        records.push(['perm_agent_update', 'agent', 'Modify a agent']);
                        records.push(['perm_agent_delete', 'agent', 'Delete a agent']);
                        records.push(['perm_agent_start', 'agent', 'Start a agent']);
                        records.push(['perm_agent_stop', 'agent', 'Stop a agent']);
                        records.push(['perm_repo_shared_create', 'repo', 'Create a shared file']);
                        records.push(['perm_repo_shared_read', 'repo', 'Read a shared file']);
                        records.push(['perm_repo_shared_update', 'repo', 'Modify a shared file']);
                        records.push(['perm_repo_shared_delete', 'repo', 'Delete a shared file']);
                        records.push(['perm_schedule_create', 'schedule', 'Create a schedule job']);
                        records.push(['perm_schedule_read', 'schedule', 'Read a schedule job']);
                        records.push(['perm_schedule_update', 'schedule', 'Modify a schedule job']);
                        records.push(['perm_schedule_delete', 'schedule', 'Delete a schedule job']);
                        records.push(['perm_notice_create', 'notice', 'Create a notice']);
                        records.push(['perm_notice_read', 'notice', 'Read a notice']);
                        records.push(['perm_notice_update', 'notice', 'Modify a notice']);
                        records.push(['perm_notice_delete', 'notice', 'Delete a notice']);
                        records.push(['perm_authorization_create', 'authorization', 'Create a authorization']);
                        records.push(['perm_authorization_read', 'authorization', 'Read a authorization']);
                        records.push(['perm_authorization_update', 'authorization', 'Modify a authorization']);
                        records.push(['perm_authorization_delete', 'authorization', 'Delete a authorization']);
                        records.push(['data_upload_private', 'data', 'Upload to private repository']);
                        records.push(['data_upload_shared', 'data', 'Upload to shared repository']);
                        records.push(['data_limited_upload', 'data', 'Limited(50M * 2) upload']);
                        records.push(['data_unlimited_upload', 'data', 'Unlimited upload']);
                        records.push(['perm_job_stop', 'job', 'Stop streaming job']);
                        records.push(['perm_deploy_create', 'deploy', 'Create a deploy']);
                        records.push(['perm_deploy_read', 'deploy', 'Read a deploy']);
                        records.push(['perm_deploy_update', 'deploy', 'Update a deploy']);
                        records.push(['perm_deploy_delete', 'deploy', 'Delete a deploy']);
                        records.push(['perm_publish_create', 'publish', 'Create a publish']);
                        records.push(['perm_publish_read', 'publish', 'Read a publish']);
                        records.push(['perm_publish_delete', 'publish', 'Delete a publish']);

                        records.push(['perm_datasource_create', 'datasource', 'Create a datasource']);
                        records.push(['perm_datasource_read', 'datasource', 'Read a datasource']);
                        records.push(['perm_datasource_update', 'datasource', 'Update a datasource']);
                        records.push(['perm_datasource_delete', 'datasource', 'Delete a datasource']);

                        if (__BRTC_CONF['use-monitoring'] && process.platform === 'linux') {
                            records.push(['perm_monitoring_read', 'monitoring', 'Read a monitoring']);
                        }

                        records.push(['perm_account_read_force', 'user', 'Force read a account']);
                        records.push(['perm_agent_read_force', 'agent', 'Force read a agent']);

                        records.push(['perm_udf_read', 'udf', 'Read user defined function']);
                        records.push(['perm_udf_create', 'udf', 'Create user defined function']);
                        records.push(['perm_udf_delete', 'udf', 'Delete user defined function']);

                        batchUpdate(PERMISSION_CREATE, records);

                        if (doneCallback) doneCallback(result.rows, result, DDL_CREATE_PERMISSION_TABLE, []);
                    });
                } else {
                    query('select * from brtc_permission where resource_type = \'monitoring\'', [], errCallback, function (result) {
                        if (__BRTC_CONF['use-monitoring'] && process.platform === 'linux') {
                            if(result.length === 0 ) {
                                var records = [];
                                records.push(['perm_monitoring_read', 'monitoring', 'Read a monitoring']);

                                batchUpdate(PERMISSION_CREATE, records);
                            }
                        } else if (result.length > 0) {
                            batchUpdate(PERMISSION_DELETE_DEFAULT, [['monitoring']]);
                        }


                        if (doneCallback) doneCallback(result.rows, result, DDL_CHECK_TABLE, ['brtc_permission']);
                    });

                    query('select * from brtc_permission where resource_type = \'datasource\'', [], errCallback, function (result) {
                        if (result.length === 0) {
                            var records = [];
                            records.push(['perm_datasource_create', 'datasource', 'Create a datasource']);
                            records.push(['perm_datasource_read', 'datasource', 'Read a datasource']);
                            records.push(['perm_datasource_update', 'datasource', 'Update a datasource']);
                            records.push(['perm_datasource_delete', 'datasource', 'Delete a datasource']);

                            batchUpdate(PERMISSION_CREATE, records);
                        }

                        if (doneCallback) doneCallback(result.rows, result, DDL_CHECK_TABLE, ['brtc_permission']);
                    });

                    query('select * from brtc_permission where resource_type = \'deploy\'', [], errCallback, function (result) {
                        if (result.length === 0) {
                            var records = [];
                            records.push(['perm_deploy_create', 'deploy', 'Create a deploy']);
                            records.push(['perm_deploy_read', 'deploy', 'Read a deploy']);
                            records.push(['perm_deploy_update', 'deploy', 'Update a deploy']);
                            records.push(['perm_deploy_delete', 'deploy', 'Delete a deploy']);

                            batchUpdate(PERMISSION_CREATE, records);
                        }

                        if (doneCallback) doneCallback(result.rows, result, DDL_CHECK_TABLE, ['brtc_permission']);
                    });

                    query('select * from brtc_permission where resource_type = \'publish\'', [], errCallback, function (result) {
                        if (result.length === 0) {
                            var records = [];
                            records.push(['perm_publish_create', 'publish', 'Create a publish']);
                            records.push(['perm_publish_read', 'publish', 'Read a publish']);
                            records.push(['perm_publish_delete', 'publish', 'Delete a publish']);

                            batchUpdate(PERMISSION_CREATE, records);
                        }

                        if (doneCallback) doneCallback(result.rows, result, DDL_CHECK_TABLE, ['brtc_permission']);
                    });

                    query('select * from brtc_permission where permission_id in (\'perm_schedule_read_my\', \'perm_publish_read_my\')', [], errCallback, function (result) {
                        if (result.length === 0) {
                            var records = [];
                            records.push(['perm_schedule_read_my', 'schedule', 'Create a my publish']);
                            records.push(['perm_publish_read_my', 'publish', 'Read a my publish']);

                            batchUpdate(PERMISSION_CREATE, records);
                        }

                        if (doneCallback) doneCallback(result.rows, result, DDL_CHECK_TABLE, ['brtc_permission']);
                    });
                }
            });
        },
        selectAll: function (opt, errCallback, doneCallback) {
            query(PERMISSION_SELECT_ALL, [], errCallback, doneCallback);
        },
        selectPermissionResourceTypeByUserId: function (opt, errCallback, doneCallback) {
            query(PERMISSION_RESOURCE_TYPE_SELECT_BY_USERID, [opt['user_id']], errCallback, doneCallback);
        }
    }
};
