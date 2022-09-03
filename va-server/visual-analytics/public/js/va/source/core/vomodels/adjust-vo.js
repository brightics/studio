/* -----------------------------------------------------
 *  adjust-vo.js
 *  Created by hyunseok.oh@samsung.com on 2018-02-07
 * ----------------------------------------------------*/

/* global Brightics */

var adjustFile = function (file) {
    file.contents = Brightics.VA.Core.Utils.ModelUtils.extendModel(file.contents);
    var supportModelList = Object.keys(Brightics.VA.Core.Interface.Clazz);
    if (supportModelList.indexOf(file.contents.type) < 0) return;
    file.contents.title = file.label;
    file.contents.mid = file.id;
    file.contents.adjustLinks();
};

var adjustVersion = function (version) {
    version.contents = Brightics.VA.Core.Utils.ModelUtils.extendModel(version.contents);
    var supportModelList = Object.keys(Brightics.VA.Core.Interface.Clazz);
    if (typeof file !== 'undefined') {
        if (supportModelList.indexOf(version.contents.type) < 0) return;
    }
    version.contents.title = version.label;
    version.contents.mid = version.file_id;
    version.contents.version_id = version.version_id;
    version.contents.adjustLinks();
};

var migrator = 0;
var migrate = function (model) {
    migrator = migrator || new Brightics.VA.Core.Tools.ModelMigrator.Executor();
    try {
        migrator.migrate(model);
    } catch (e) {
        console.error(e);
        throw new Error('Migration failed.');
    }
};

export { adjustFile, adjustVersion, migrate };
