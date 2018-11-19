var extend = require('extend');

module.exports = extend(true, {},
    require('./lib/common-procedure'),
    require('./lib/project'),
    require('./lib/project-members'),
    require('./lib/file'),
    require('./lib/file-version'),
    require('./lib/library'),
    require('./lib/send'),
    require('./lib/status'),
    require('./lib/notice'),
    require('./lib/token'),
    require('./lib/confirmation'),
    require('./lib/role'),
    require('./lib/role-permission'),
    require('./lib/permission'),
    require('./lib/user-resource-role'),
    require('./lib/publish-report'),
    require('./lib/function-label'),
    require('./lib/addon-function'),
    require('./lib/tools-function'),
    require('./lib/tools-project')
);
