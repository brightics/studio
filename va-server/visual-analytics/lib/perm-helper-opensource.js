var request = __REQ_request;

var events = require('events');
var extend = require('extend');

var PERMISSION_RESOURCE_TYPES = {
    USER: 'user',
    AGENT: 'agent',
    SCHEDULE: 'schedule',
    NOTICE: 'notice',
    AUTHORIZATION: 'authorization',
    JOB: 'job',
    REPO: 'repo',
    VIEW: 'view',
    DEPLOY: 'deploy',
    PUBLISH: 'publish',
    DATASOURCE: 'datasource',
    MONITORING: 'monitoring',
    UDF: 'udf',
    DATA: 'data'
};

var PERMISSIONS = {
    PERM_ACCOUNT_CREATE: 'perm_account_create',
    PERM_ACCOUNT_READ: 'perm_account_read',
    PERM_ACCOUNT_UPDATE: 'perm_account_update',
    PERM_ACCOUNT_DELETE: 'perm_account_delete',
    PERM_AGENT_CREATE: 'perm_agent_create',
    PERM_AGENT_READ: 'perm_agent_read',
    PERM_AGENT_UPDATE: 'perm_agent_update',
    PERM_AGENT_DELETE: 'perm_agent_delete',
    PERM_AGENT_START: 'perm_agent_start',
    PERM_AGENT_STOP: 'perm_agent_stop',
    PERM_REPO_SHARED_CREATE: 'perm_repo_shared_create',
    PERM_REPO_SHARED_READ: 'perm_repo_shared_read',
    PERM_REPO_SHARED_UPDATE: 'perm_repo_shared_update',
    PERM_REPO_SHARED_DELETE: 'perm_repo_shared_delete',
    PERM_SCHEDULE_CREATE: 'perm_schedule_create',
    PERM_SCHEDULE_READ: 'perm_schedule_read',
    PERM_SCHEDULE_UPDATE: 'perm_schedule_update',
    PERM_SCHEDULE_DELETE: 'perm_schedule_delete',
    PERM_NOTICE_CREATE: 'perm_notice_create',
    PERM_NOTICE_READ: 'perm_notice_read',
    PERM_NOTICE_UPDATE: 'perm_notice_update',
    PERM_NOTICE_DELETE: 'perm_notice_delete',
    PERM_AUTHORIZATION_CREATE: 'perm_authorization_create',
    PERM_AUTHORIZATION_READ: 'perm_authorization_read',
    PERM_AUTHORIZATION_UPDATE: 'perm_authorization_update',
    PERM_AUTHORIZATION_DELETE: 'perm_authorization_delete',
    PERM_JOB_STOP: 'perm_job_stop',
    PERM_INVISIBLE_LOGOUT: 'perm_invisible_logout',
    PERM_INVISIBLE_PROFILE_SETTING: 'perm_invisible_profile_setting',
    PERM_INVISIBLE_SETTING: 'perm_invisible_setting',
    PERM_DEPLOY_CREATE: 'perm_deploy_create',
    PERM_DEPLOY_READ: 'perm_deploy_read',
    PERM_DEPLOY_UPDATE: 'perm_deploy_update',
    PERM_DEPLOY_DELETE: 'perm_deploy_delete',
    PERM_PUBLISH_CREATE: 'perm_publish_create',
    PERM_PUBLISH_READ: 'perm_publish_read',
    PERM_PUBLISH_DELETE: 'perm_publish_delete',
    PERM_DATASOURCE_CREATE: 'perm_datasource_create',
    PERM_DATASOURCE_READ: 'perm_datasource_read',
    PERM_DATASOURCE_UPDATE: 'perm_datasource_update',
    PERM_DATASOURCE_DELETE: 'perm_datasource_delete',
    PERM_MONITORING_READ: 'perm_monitoring_read',
    PERM_UDF_READ: 'perm_udf_read',
    PERM_UDF_CREATE: 'perm_udf_create',
    PERM_UDF_DELETE: 'perm_udf_delete',
    PERM_ACCOUNT_READ_FORCE: 'perm_account_read_force',
    PERM_AGENT_READ_FORCE: 'perm_agent_read_force',
    DATA_UPLOAD_SHARED: 'data_upload_shared'
};

var queryPermissions = function (req, resourceTypes, errCallback, doneCallback) {
    var opt = {
        user_id: __BRTC_ARGS.user_id,
        resource_type: resourceTypes
    };
    __BRTC_DAO.user.resource.role.selectPermissionByUserAndResourceType(opt, errCallback, doneCallback);
};

var hasPermission = function (permissions, perm) {
    if (perm) {
        for (var i in permissions) {
            if (permissions[i].permission_id === perm) {
                return true;
            }
        }
        return false;
    } else {
        // 체크하려는 perm 이 NULL 이면 권한 체크하지 않고 permissions 를 리턴하는 목적으로 이용
        return true;
    }
};

var checkPermission = function (req, resourceTypes, perm) {
    var emitter = new events.EventEmitter();
    queryPermissions(req, resourceTypes, function (err) {
        emitter.emit('fail', err);
    }, function (permissions) {
        if (hasPermission(permissions, perm)) {
            emitter.emit('accept', permissions);
        } else {
            emitter.emit('deny', permissions);
        }
    });
    return emitter;
};

var getPermResourceType = function () {
    var list = PERMISSION_RESOURCE_TYPES;
    var customPermissionFile = __REQ_path.resolve(__dirname, '../permission-conf.json');
    if (!__REQ_fs.existsSync(customPermissionFile)) {
        return list;
    } else {
        var customPermissionsConf = require('../permission-conf.json');
        return extend(true, list, customPermissionsConf['CUSTOM_PERMISSION_RESOURCE_TYPES']);
    }
};

var getPermissions = function () {
    var list = PERMISSIONS;
    var customPermissionFile = __REQ_path.resolve(__dirname, '../permission-conf.json');
    if (!__REQ_fs.existsSync(customPermissionFile)) {
        return list;
    } else {
        var customPermissionsConf = require('../permission-conf.json');
        return extend(true, list, customPermissionsConf['CUSTOM_PERMISSIONS']);
    }
};

exports.PERMISSION_RESOURCE_TYPES = getPermResourceType();
exports.PERMISSIONS = getPermissions();
exports.queryPermissions = queryPermissions;
exports.hasPermission = hasPermission;
exports.checkPermission = checkPermission;
