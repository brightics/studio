/**
 * hyunseok.oh@samsung.com
 * 2018. 01. 31
 */

/**
 * @param {Class} a sub class
 * @param {Class} b super class
 */
var inherits = function (subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
};

export { inherits };
