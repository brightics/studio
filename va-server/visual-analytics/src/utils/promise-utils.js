/* -----------------------------------------------------
 *  promise-utils.js
 *  Created by hyunseok.oh@samsung.com on 2018-02-14.
 * ----------------------------------------------------*/

/* global _ */
var serial = function (fnArray) {
    return _.reduce(fnArray, function (prv, cur) {
        return prv.then(function (param) {
            return cur(param);
        });
    }, Promise.resolve());
};


var parallel = function (fnArray) {
    // fn = 프로미스를 리턴하는 함수
    return Promise.all(_.map(fnArray, function (fn) {
        return fn();
    }));
};

export { serial, parallel };
