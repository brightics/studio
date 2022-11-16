/**
 * hyunseok.oh@samsung.com
 * 2018. 01. 24
 */


import { Base } from '../base/base';

function DropdownWrapper($el, options) {
    Base.call(this, $el, options);
}

DropdownWrapper.prototype = Object.create(Base.prototype);
DropdownWrapper.prototype.constructor = DropdownWrapper;

DropdownWrapper.prototype.setItems = function (items) {
    throw new Error('not implemented');
};

DropdownWrapper.prototype.getItems = function () {
    throw new Error('not implemented');
};

DropdownWrapper.prototype.getSelectedItem = function () {
    throw new Error('not implemented');
};

DropdownWrapper.prototype.isSelected = function () {
    throw new Error('not implemented');
};

DropdownWrapper.prototype.isOpened = function () {
    throw new Error('not implemented');
};

DropdownWrapper.prototype.open = function () {
    throw new Error('not implemented');
};

DropdownWrapper.prototype.close = function () {
    throw new Error('not implemented');
};

DropdownWrapper.prototype.enable = function () {
    throw new Error('not implemented');
};

DropdownWrapper.prototype.disable = function () {
    throw new Error('not implemented');
};

export { DropdownWrapper };
