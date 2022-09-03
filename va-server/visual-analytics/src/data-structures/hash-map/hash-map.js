/**
 * hyunseok.oh@samsung.com
 * 2018. 01. 31
 */


/* global _ */

function HashMap() {
    this.map = {};
    this.chk = {};
}

HashMap.prototype.set = function (key, value) {
    this.map[key] = value;
    this.chk[key] = true;
};

HashMap.prototype.get = function (key) {
    return this.map[key];
};

HashMap.prototype.remove = function (key) {
    var ret = this.map[key];
    this.chk[key] = false;
    delete this.map[key];
    return ret;
};

HashMap.prototype.has = function (key) {
    return this.chk[key];
};

HashMap.prototype.toArray = function () {
    return _.toArray(this.map);
};

HashMap.prototype.toJSON = function () {
    return this.map;
};

export { HashMap };
