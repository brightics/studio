import { ajaxGet, ajaxPost } from '../../../../../../src/utils/ajax2promise';

var dbGetDatasources = function () {
    var url = 'api/admin/v2/datasources';
    return ajaxGet(url);
};

var dbGetDatasource = function (datasourceName) {
    var url = 'api/admin/v2/datasources/' + datasourceName;
    return ajaxGet(url);
};

var dbAddDatasource = function (data) {
    var url = 'api/admin/v2/datasources/' + data.datasourceName;
    return ajaxPost(url, data);
};

var dbUpdateDatasource = function (data) {
    var url = 'api/admin/v2/datasources/' + data.datasourceName + '/update';
    return ajaxPost(url, data);
};


var dbDeleteDatasource = function (datasourceName) {
    var url = 'api/admin/v2/datasources/' + datasourceName + '/delete';
    return ajaxPost(url);
};

var dbGetDbTypes = function () {
    var url = 'api/admin/v2/datasources/dbtype';
    return ajaxGet(url);
};

var cloudGetDatasources = function () {
    var url = 'api/admin/v2/s3';
    return ajaxGet(url);
};

var cloudGetDatasource = function (datasourceName) {
    var url = 'api/admin/v2/s3/' + datasourceName;
    return ajaxGet(url);
};

var cloudAddDatasource = function (data) {
    var url = 'api/admin/v2/s3/' + data.datasourceName;
    return cloudGetDatasource(data.datasourceName).then(function (_data) {
        if (!_data) {
            return ajaxPost(url, data);
        } else {
            var err = {
                errors: [
                    {
                        code: 500,
                        message: 'Datasource name already exists.'
                    }
                ]
            };
            throw err;
        }
    });
};

var cloudUpdateDatasource = function (data) {
    var url = 'api/admin/v2/s3/' + data.datasourceName + '/update';
    return ajaxPost(url, data);
};


var cloudDeleteDatasource = function (datasourceName) {
    var url = 'api/admin/v2/s3/' + datasourceName + '/delete';
    return ajaxPost(url);
};

var DatasourceDao = {
    DB: {
        getDbTypes: dbGetDbTypes,
        getDatasources: dbGetDatasources,
        getDatasource: dbGetDatasource,
        addDatasource: dbAddDatasource,
        updateDatasource: dbUpdateDatasource,
        deleteDatasource: dbDeleteDatasource
    },
    Cloud: {
        getS3s: cloudGetDatasources,
        getS3: cloudGetDatasource,
        addS3: cloudAddDatasource,
        updateS3: cloudUpdateDatasource,
        deleteS3: cloudDeleteDatasource
    }
};


export { DatasourceDao };
