/**
 * Created by daewon.park on 2016-02-21.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    Brightics.VA.Core.DataQueryTemplate = {
        schemaCache: {},
        cache: {},
        requested: {},
        addCache: function (mid, table, data) {
            var id = mid + '_' + table;
            // TODO 메모리 사용을 줄이기 위해 cache 기능을 off 해보자 by daewon.park since 2017-05-23
            // this.cache[id] = data;
            this.schemaCache[id] = data;
        },
        removeCache: function (mid, table) {
            // TODO 메모리 사용을 줄이기 위해 cache 기능을 off 하고 schemaCache 별도 관리 by daewon.park since 2017-05-23
            if (table) {
                var id = mid + '_' + table;
                delete this.cache[id];
                delete this.schemaCache[id];
            } else {
                var deleted = [];
                for (let key in this.cache) {
                    if (key.indexOf(mid + '_') == 0) {
                        deleted.push(key);
                    }
                }
                for (const d of deleted) {
                    delete this.cache[d];
                }

                deleted = [];
                for (let key in this.schemaCache) {
                    if (key.indexOf(mid + '_') == 0) {
                        deleted.push(key);
                    }
                }
                for (let d of deleted) {
                    delete this.schemaCache[d];
                }
            }
        },
        isCached: function (mid, table) {
            var id = mid + '_' + table;
            return this.cache[id];
        },
        clearCache: function () {
            this.cache = {};
            this.schemaCache = {};
        },
        queryTable: function (mid, table, doneCallback, failCallback, force, options) {
            var id = mid + '_' + table, options = options || {};
            if (force === true || !this.cache[id]) {
                if (options.publish) {
                    options.destination = 'publish';
                    this.queryData(mid, table, options.offset || 0, options.limit || 1000, doneCallback, failCallback, options);
                } else {
                    this.queryData(mid, table, options.offset || 0, options.limit || 1000, doneCallback, failCallback, options);
                }
            } else {
                doneCallback(this.cache[id], table);
            }
        },
        queryTableForReport: function (mid, table, doneCallback, failCallback, force) {
            var id = mid + '_' + table;
            if (force === true || !this.cache[id]) {
                this.queryData(mid, table, 0, 1000, doneCallback, failCallback, '/report');
            } else {
                doneCallback(this.cache[id], table);
            }
        },
        fetchMore: function (mid, table, more, doneCallback, failCallback) {
            var length, id = mid + '_' + table;
            if (this.cache[id] && this.cache[id].columns && this.cache[id].data) {
                length = this.cache[id].data.length + more;
            } else {
                length = more;
            }
            this.queryData(mid, table, 0, length, doneCallback, failCallback);
        },
        queryData: function (mid, table, offset, length, doneCallback, failCallback, _options) {
            var _this = this, id = mid + '_' + table;
            var options = _options || {};

            if (!this.requested[id]) this.requested[id] = [];
            this.requested[id].push({
                done: doneCallback,
                fail: failCallback
            });
            
            // if (!this.requested[id]) {
            //     this.requested[id] = [];
            //     this.requested[id].push({
            //         done: doneCallback,
            //         fail: failCallback
            //     });
            // }
            // else {
            //     this.requested[id].push({
            //         done: doneCallback,
            //         fail: failCallback
            //     });
            //     return;
            // }

            var userId = options.user || Brightics.VA.Env.Session.userId;
            var errorHandler = function (err) {
                _this.removeCache(mid, table);

                var data = {
                    columns: [],
                    data: [],
                    count: 0
                };
                _this.requested[id].shift().fail(data, table, err);
                // for (var i in _this.requested[id]) {
                //     _this.requested[id][i].fail(data, table, err); //TODO _this.requested[id][i].fail(data, table)로 수정 및 에러 확인 필요
                // }
                // delete _this.requested[id];
            };

            var doneHandler = function (data) {
                _this.addCache(mid, table, data);
                _this.requested[id].shift().done(data, table);
                // for (var i in _this.requested[id]) {
                //     _this.requested[id][i].done(data, table);
                // }
                // delete _this.requested[id];
            };

            var urlDestination = options.destination || 'api/va/v2/data';
            var url = urlDestination + '/staging/query?user=' + userId + '&mid=' + mid + '&tab=' + table + '&offset=' + offset + '&limit=' + length;
            if (options.columns) {
                const c = options.columns;
                if (c.useRange) url += `&start=${c.start - 1}&end=${c.end - 1}`;
                else url += `&skiprange=true`;

                if (c.useIndex || c.useName) {
                    if (c.integratedIndexes && c.integratedIndexes.length > 0) {
                        url += `&indexes=${JSON.stringify(c.integratedIndexes)}`;
                    }
                }
            }
            $.get(url).done(doneHandler).fail(errorHandler);
        },
        getSchemaAsync: function (mid, table, doneCallback, failCallback, _options) {
            var _this = this;
            var options = _options || {};
            var userId = options.user || Brightics.VA.Env.Session.userId;
            var queryString = Brightics.VA.Core.Utils.CommonUtils.getQueryString({
                user: userId,
                mid: mid,
                tab: table,
                offset: 0,
                limit: 1
            });
            var url = 'api/va/v2/data/staging/query?' + queryString;
            var done = function (data) {
                _this.addCache(mid, table, data);
                return doneCallback(data.columns);
            };

            var fail = function (err) {
                _this.removeCache(mid, table);
                return failCallback([], table, err);
            };
            $.get(url).done(done).fail(fail);
        },
        getSchema: function (mid, table) {
            var id = mid + '_' + table;
            return this.schemaCache[id] && table !== undefined ? this.schemaCache[id].columns : undefined;
        },
        querySchema: function (mid, table, doneCallback, failCallback, force) {
            var userId = Brightics.VA.Env.Session.userId;
            var key =  `/${userId}/${mid}/${table}`;

            var urlDestination = 'api/va/v2/data';
            var url = urlDestination + '/staging/schema?key=' + key;
            $.get(url).done(data => doneCallback(data, table)).fail(err => failCallback({
                columns: [],
                data: [],
                count: 0
            }, table, err));
        },
        getSchemaFromData: function (mid, table) {
            console.warn('This method is deprecated');
            return this.getData(mid, table)
        },
        getData: function (mid, table) {
            var id = mid + '_' + table;
            return this.schemaCache[id] && table !== undefined ? this.schemaCache[id].data : undefined;
        },
        getTable: function (mid, table) {
            var id = mid + '_' + table;
            return this.schemaCache[id] && table !== undefined ? this.schemaCache[id] : undefined;
        }
    };

}).call(this);