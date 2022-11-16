/* -----------------------------------------------------
 *  object-utils.js
 *  Created by hyunseok.oh@samsung.com on 2018-03-08.
 * ---------------------------------------------------- */

/* global _ */

var _getByPath = function (obj, path) {
    try {
        var idx = -1;
        var length = path.length;
        var ret = obj;
        while (++idx < length) {
            ret = ret[path[idx]];
        }
        return ret;
    } catch (e) {
        return undefined;
    }
};

var get = function (obj, key) {
    if (key instanceof Array) return _getByPath(obj, key);
    return obj[key];
};

var copy = function (val) {
    return _.clone(val);
};

var updateProp = function (_obj, path, val) {
    var obj = _obj;
    var idx = -1;
    var len = path.length;
    while (++idx < len - 1) {
        obj = obj[path[idx]];
    }
    var old = copy(obj[path[path.length - 1]]);
    obj[path[path.length - 1]] = copy(val);
    return old;
};

var addProp = function (_obj, path, val) {
    var obj = _obj;
    var idx = -1;
    var len = path.length;
    while (++idx < len - 1) {
        obj = obj[path[idx]];
    }
    if (Array.isArray(obj)) {
        obj.splice(path[path.length - 1], 0, val);
    } else {
        obj[path[path.length - 1]] = copy(val);
    }
    return undefined;
};

var removeProp = function (_obj, path) {
    var obj = _obj;
    var idx = -1;
    var len = path.length;
    while (++idx < len - 1) {
        obj = obj[path[idx]];
    }
    var old = copy(obj[path[path.length - 1]]);
    if (Array.isArray(obj)) {
        obj.splice(path[path.length - 1], 1);
    } else {
        delete obj[path[path.length - 1]];
    }
    return old;
};

export { get, updateProp, addProp, removeProp };
