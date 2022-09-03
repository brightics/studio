/* -----------------------------------------------------
 *  activity.js
 *  Created by hyunseok.oh@samsung.com on 2018-04-02.
 * ---------------------------------------------------- */

/* global _ */

function Activity(fn) {
    this.fn = fn;
}

Activity.prototype.getId = function () {
    return this.fn.fid;
};

Activity.prototype.getParameters = function () {
    return this.fn.param;
};

Activity.prototype.getParameter = function (key) {
    return this.fn.param[key];
};

Activity.prototype.setParameters = function (param) {
    this.fn.param = param;
    return this;
};

Activity.prototype.setParameter = function (key, val) {
    this.fn.param[key] = val;
    return this;
};

Activity.prototype.hasInData = function () {
    return this.getInDataSize() > -1;
};

Activity.prototype.hasOutData = function () {
    return this.getOutDataSize() > -1;
};

Activity.prototype.getInDataSize = function () {
    return this.fn.inData ? this.fn.inData.length : -1;
};

Activity.prototype.getOutDataSize = function () {
    return this.fn.outData ? this.fn.outData.length : -1;
};

Activity.prototype.getName = function () {
    return this.fn.func;
};

Activity.prototype.getOperation = function () {
    return this.fn[FUNCTION_NAME];
};

Activity.prototype.getPersistMode = function () {
    return this.fn['persist-mode'];
};

Activity.prototype.getDisplay = function () {
    return this.fn.display;
};

Activity.prototype.getTitle = function () {
    return this.fn.title;
};

Activity.prototype.getVariables = function () {
    return this.fn.gv;
};

Activity.prototype.getVariable = function (key) {
    return this.fn.gv[key];
};

Activity.prototype.toJSON = function () {
    var ret = {};
    _.forIn(this.fn, function (prop, key) {
        if (prop instanceof Object && prop.hasOwnProperty('toJSON')) {
            ret[key] = prop.toJSON();
        } else {
            ret[key] = prop;
        }
    });
    return ret;
};

