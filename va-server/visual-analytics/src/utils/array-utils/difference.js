/**
 * 2018. 02. 08
 * hyunseok.oh@samsung.com
 */

/**
 * @param {Array} a
 * @param {Array} b
 * @param {Function} getKey
 * @return {Array} a - b
 */
var difference = function (a, b, _getKey) {
    var set = {};
    var getKey = _getKey || function (e) {
        return e;
    };
    _.forEach(b, function (e) {
        set[getKey(e)] = true;
    });
    return _.filter(a, function (e) {
        return set[getKey(e)] ? false : true;
    });
};

export { difference };
