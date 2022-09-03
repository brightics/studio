/* -----------------------------------------------------
 *  resource.js
 *  Created by hyunseok.oh@samsung.com on 2018-02-08
 * ----------------------------------------------------*/

function Resource() {

}

Resource.prototype.equals = function (that) {
    throw new Error('not implemented');
};

Resource.prototype.getHashCode = function () {
    throw new Error('not implemented');
};

Resource.prototype.toJSON = function () {
    throw new Error('not implemented');
};

Resource.prototype.getResourceName = function () {
    throw new Error('not implemented');
};

export { Resource };
