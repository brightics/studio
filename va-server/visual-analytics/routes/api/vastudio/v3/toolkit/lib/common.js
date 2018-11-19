var events = require('events');

var ToolsProjectPermission = {
    hasPermission: function (permissions, perm) {
        for (var i in permissions) {
            if (permissions[i].permission_id === perm) {
                return true
            }
        }
        return false
    },
    check: function (tpid, userId, permissionId) {
        var _this = this;
        var emitter = new events.EventEmitter();

        var opt = {
            tools_project_id: tpid,
            user_id: userId
        };
        __BRTC_DAO.tools_project.members.selectPermissionByProjectUser(opt, function (err) {
            emitter.emit('fail', err)
        }, function (permissions) {
            if (_this.hasPermission(permissions, permissionId)) {
                emitter.emit('accept', permissions)
            } else {
                emitter.emit('deny', permissions)
            }
        });

        return emitter
    },
    execute: function (tpid, userId, permissionId, res, task, modelUpdateFlag) {
        var perm = this.check(tpid, userId, permissionId);
        perm.on('accept', function (permissions) {
            task(permissions)
        });
        perm.on('deny', function (permissions) {
            if (modelUpdateFlag) {
                __BRTC_ERROR_HANDLER.sendNotAllowedError2(res)
            } else {
                __BRTC_ERROR_HANDLER.sendNotAllowedError(res)
            }
        });
        perm.on('fail', function (err) {
            __BRTC_ERROR_HANDLER.sendServerError(res, err)
        })
    }
};

exports.ToolsProjectPermission = ToolsProjectPermission;

exports.PERMISSION = {
    TOOLS_PROJECT: {
        CREATE: 'perm_tools_proj_create',
        READ: 'perm_tools_proj_read',
        UPDATE: 'perm_tools_proj_update',
        DELETE: 'perm_tools_proj_delete'
    },
    TOOLS_FUNCTION: {
        CREATE: 'perm_tools_func_create',
        READ: 'perm_tools_func_read',
        UPDATE: 'perm_tools_func_update',
        DELETE: 'perm_tools_func_delete'
    }
};
