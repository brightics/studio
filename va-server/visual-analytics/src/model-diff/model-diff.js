/* -----------------------------------------------------
 *  model-diff.js
 *  Created by hyunseok.oh@samsung.com on 2018-07-23.
 * ---------------------------------------------------- */

/* global _ */
const MODEL_SYNC_KEY = '__brtc__model__sync__';

function keyValue(key, val) {
    var x = {};
    x[key] = val;
    return x;
}

function arrayDiff(a, b) {
    var len = Math.max(a.length, b.length);
    return _.range(len).reduce(function (prv, idx) {
        if (!_.has(a, idx)) {
            return _.merge(prv, keyValue(idx, {
                [MODEL_SYNC_KEY]: true,
                action: 'add',
                val: b[idx]
            }));
        } else if (!_.has(b, idx)) {
            return _.merge(prv, keyValue(idx, {
                [MODEL_SYNC_KEY]: true,
                action: 'remove'
            }));
        } else {
            var dif = diff(a[idx], b[idx]);
            if (!(_.isObject(dif) && _.isEmpty(dif))) {
                return _.merge(prv, keyValue(idx, dif));
            }
        }
        return prv;
    }, {});
}

export function diff(a, b) {
    if (a === b) return {};
    var aIsArray = _.isArray(a);
    var bIsArray = _.isArray(b);
    if (aIsArray && bIsArray) return arrayDiff(a, b);
    if (aIsArray || bIsArray || !_.isObject(a) || !_.isObject(b)) {
        return {
            [MODEL_SYNC_KEY]: true,
            action: 'update',
            val: b
        };
    }

    var allKeys = _.union(_.keys(a), _.keys(b));

    return _.reduce(allKeys, function (prv, key) {
        if (!_.has(a, key)) {
            return _.merge(prv, keyValue(key, {
                [MODEL_SYNC_KEY]: true,
                action: 'add',
                val: b[key]
            }));
        }

        if (!_.has(b, key)) {
            return _.merge(prv, keyValue(key, {
                [MODEL_SYNC_KEY]: true,
                action: 'remove'
            }));
        }

        var dif = diff(a[key], b[key]);

        if (_.isObject(dif) && _.isEmpty(dif)) return prv;
        return _.merge(prv, keyValue(key, dif));
    }, {});
}

function omitFunction(a) {
    // return JSON.parse(JSON.stringify(a));
    return _.reduce(a, function (prv, val, key) {
        if (_.isFunction(val)) return prv;
        prv[key] = val;
        return prv;
    }, {});
}

export function modelDiff(a, b) {
    // var prv = performance.now();
    var x = diff(omitFunction(a), omitFunction(b));
    // console.log(performance.now() - prv);
    return x;
}
