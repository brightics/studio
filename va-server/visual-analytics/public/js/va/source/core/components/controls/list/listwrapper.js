/**
 * hyunseok.oh@samsung.com
 * 2018. 01. 22
 */

'use strict';


import { Base } from '../base/base';

function ListWrapper($el, options) {
    Base.call(this, $el, options);
}

ListWrapper.prototype = Object.create(Base.prototype);
ListWrapper.prototype.constructor = ListWrapper;

ListWrapper.prototype.update = function (data) {
    throw new Error('not implemented');
};

export { ListWrapper };
