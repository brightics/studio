/**
 * Created by daewon.park on 2016-10-17.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    Brightics.VA.RepositoryQueryTemplate = {
        pathCache: {},
        schemaCache: {},
        getFiles: function (path) {
            return this.pathCache[path];
        },
        getColumns: function (path) {
            return this.schemaCache[path];
        },
        browse: function (path, rescan, additionalOpt) {
            var _this = this;
            var opt = {
                url: 'api/va/v2/data/browse',
                type: 'GET',
                blocking: false,
                contentType: 'application/json; charset=utf-8'
            };
            $.extend(true, opt, additionalOpt);
            return $.ajax(opt).done(function (files) {
                _this.pathCache[path] = files.sort(function (a, b) {
                    return a.path.localeCompare(b.path);
                });
            });
        },
        schema: function (path, rescan, additionalOpt) {
            var _this = this;
            var scan = rescan || true;
            var opt = {
                url: 'api/va/v2/data/schema?key=' + path + '&rescan=' + scan,
                type: 'GET',
                blocking: false,
                contentType: 'application/json; charset=utf-8'
            };
            $.extend(true, opt, additionalOpt);
            return $.ajax(opt).done(function (schema) {
                _this.schemaCache[path] = schema.columns;
            });
        },
        move: function (source, destination, additionalOpt) {
            var opt = {
                url: 'api/va/v2/data/move',
                type: 'POST',
                blocking: false,
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify({
                    source: source,
                    destination : destination
                })
            };
            $.extend(true, opt, additionalOpt);
            return $.ajax(opt);
        },
        copy: function (source, destination, additionalOpt) {
            var opt = {
                url: 'api/va/v2/data/copy',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                blocking: true,
                data: JSON.stringify({
                    source: source,
                    destination : destination
                })
            };
            $.extend(true, opt, additionalOpt);
            return $.ajax(opt);
        },
        delete: function (path, additionalOpt) {
            var opt = {
                url: 'api/va/v2/data/delete',
                type: 'POST',
                blocking: false,
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify({
                    path: path
                })
            };
            $.extend(true, opt, additionalOpt);
            return $.ajax(opt);
        }
    };

}).call(this);