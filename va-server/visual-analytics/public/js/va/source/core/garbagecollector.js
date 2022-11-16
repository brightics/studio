/**
 * Created by daewon.park on 2016-02-21.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    Brightics.VA.Core.GarbageCollector = {
        list: {},
        clearAlluxio: function () {
            for (var i in this.list) {
                var opt = {
                    url: this.list[i],
                    type: 'POST',
                    contentType: 'application/json; charset=utf-8',
                    blocking: false,
                    data: JSON.stringify({user: Brightics.VA.Env.Session.userId})
                };
                $.ajax(opt).done(function (data) {
                }).fail(function (err) {
                });
            }
            this.clearList();
        },
        addList: function (mid, fid) {
            var id = mid + '_' + fid;
            var path = this.getPath(mid, fid);
            this.list[id] = path;
        },
        removeList: function (mid, fid) {
            var id = mid + '_' + fid;
            delete this.list[id];
        },
        clearList: function () {
            this.list = {};
        },
        getPath: function (mid, fid) {
            return 'api/v1/repo/alluxio/functions/' + mid + '/' + fid + '/destroy';
        },
        immediatelyClearData: function (models, tables) {
            var options = {
                user: Brightics.VA.Env.Session.userId
            };
            if (models && models.length > 0) {
                options.mids = {};
                for (var i in models) {
                    if (tables && tables.length > 0) {
                        options.mids[models[i]] = tables;
                    } else {
                        options.mids[models[i]] = [];
                    }
                }
            }
            var opt = {
                url: 'api/va/v2/datasources/staging/remove',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                blocking: false,
                data: JSON.stringify(options)
            };
            $.ajax(opt).done(function (data) {
            }).fail(function (err) {
            });
        }
    };

}).call(this);