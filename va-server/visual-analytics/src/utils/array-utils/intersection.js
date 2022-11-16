/**
 * 2018. 02. 08
 * hyunseok.oh@samsung.com
 */

/**
 * @param {Array} a
 * @param {Array} b
 * @param {Function} getKey
 * @return {Array} a intersection b
 */
var intersection = function (a, b, _getKey) {
    var set = {};
    var getKey = _getKey || function (e) {
        return e;
    };
    _.forEach(a, function (e) {
        set[getKey(e)] = true;
    });
    return _.filter(b, function (e) {
        return set[getKey(e)];
    });
};

export { intersection };
