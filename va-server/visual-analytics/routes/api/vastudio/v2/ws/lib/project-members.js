var PERMISSION = require('./common').PERMISSION;
var projectPermission = require('./common').ProjectPermission;
var request = __REQ_request;

exports.listMembers = function (req, res) {
    var task = function (permissions) {
        var opt = {
            project_id: req.params.project
        };
        __BRTC_DAO.project.members.selectByProject(opt, function (err) {
            __BRTC_ERROR_HANDLER.sendServerError(res, err);
        }, function (result) {
            var options = __BRTC_ACCOUNT_SERVER.createRequestOptions('GET', '/api/account/v2/users');
            __BRTC_ACCOUNT_SERVER.setBearerToken(options, req.accessToken);
            request(options, function (error, response, body) {
                if (error) {
                    return res.status(400).json(JSON.parse(body));
                }

                var projectMembers = result.map(x => Object.assign(x, JSON.parse(body).find(y => y.id === x.user_id)));
                projectMembers.forEach(function (member) {
                    member['user_name'] = member['name'];
                    delete member['name'];
                });
                return res.json(projectMembers);
            });
        });
    };
    projectPermission.execute(req.params.project, req.apiUserId, PERMISSION.PROJECT.READ, res, task);

};

exports.inviteMember = function (req, res) {

    var task = function (permissions) {
        var opt = {
            project_id: req.params.project,
            user_id: req.apiUserId,
            members: req.body.members
        };
        __BRTC_DAO.project.members.invite(opt, function (err) {
            __BRTC_ERROR_HANDLER.sendServerError(res, err);
        }, function (result) {
            res.json(result);
        });
    };
    projectPermission.execute(req.params.project, req.apiUserId, PERMISSION.PROJECT.UPDATE, res, task);

};

exports.withdrawMember = function (req, res) {
    var task = function (permissions) {
        var opt = {
            project_id: req.params.project,
            user_id: req.apiUserId,
            members: req.body.members
        };
        __BRTC_DAO.project.members.withdraw(opt, function (err) {
            __BRTC_ERROR_HANDLER.sendServerError(res, err);
        }, function (result) {
            res.json(result);
        });
    };

    // 본인만 With
    var permission = PERMISSION.PROJECT.UPDATE;
    if (req.body.members.length === 1 && req.apiUserId === req.body.members[0].user_id) {
        permission = PERMISSION.PROJECT.READ;
    }

    projectPermission.execute(req.params.project, req.apiUserId, permission, res, task);
};

exports.changeAuthority = function (req, res) {
    var task = function (permissions) {
        var opt = {
            project_id: req.params.project,
            user_id: req.apiUserId,
            members: req.body.members
        };
        __BRTC_DAO.project.members.updateAuthority(opt, function (err) {
            __BRTC_ERROR_HANDLER.sendServerError(res, err);
        }, function (result) {
            res.json(result);
        });
    };
    projectPermission.execute(req.params.project, req.apiUserId, PERMISSION.PROJECT.UPDATE, res, task);
};