var events = require('events');

var ProjectPermission = {
    hasPermission: function (permissions, perm) {
        for (var i in permissions) {
            if (permissions[i].permission_id === perm) {
                return true;
            }
        }
        return false;
    },
    check: function (projectId, userId, permissionId) {
        var _this = this;
        var emitter = new events.EventEmitter();

        var opt = {
            project_id: projectId,
            user_id: userId
        };

        __BRTC_DAO.project.selectById({id: projectId}, function (err) {
            emitter.emit('fail', err);
        }, function (result) {
            if (!result || result.length === 0) {
                emitter.emit('empty');
            } else {
                __BRTC_DAO.project.members.selectPermissionByProjectUser(opt, function (err) {
                    emitter.emit('fail', err);
                }, function (permissions) {
                    if (_this.hasPermission(permissions, permissionId)) {
                        emitter.emit('accept', permissions);
                    } else {
                        emitter.emit('deny', permissions);
                    }
                });
            }
        });

        return emitter;
    },
    execute: function (projectId, userId, permissionId, res, task, modelUpdateFlag) {
        var perm = this.check(projectId, userId, permissionId);
        perm.on('accept', function (permissions) {
            task(permissions);
        });
        perm.on('deny', function (permissions) {
            if (modelUpdateFlag) {
                __BRTC_ERROR_HANDLER.sendNotAllowedError2(res);
            } else {
                __BRTC_ERROR_HANDLER.sendNotAllowedError(res);
            }
        });
        perm.on('fail', function (err) {
            __BRTC_ERROR_HANDLER.sendServerError(res, err);
        });
        perm.on('empty', function () {
            __BRTC_ERROR_HANDLER.sendError(res, 10102);
        });
    }
};

exports.ProjectPermission = ProjectPermission;

exports.PERMISSION = {
    PROJECT: {
        CREATE: 'perm_proj_create',
        READ: 'perm_proj_read',
        UPDATE: 'perm_proj_update',
        DELETE: 'perm_proj_delete'
    },
    FILE: {
        CREATE: 'perm_file_create',
        READ: 'perm_file_read',
        UPDATE: 'perm_file_update',
        DELETE: 'perm_file_delete'
    }
};