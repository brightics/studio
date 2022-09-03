/**
 * hyunseok.oh@samsung.com
 * 2017. 01. 22
 */

import { EventEmitter } from '../../../../../../../../src/event-emitter/event-emitter';

function Base($el, options) {
    EventEmitter.call(this);
    this.$el = $el;
    this.options = options;
}

Base.prototype = Object.create(EventEmitter.prototype);
Base.prototype.constructor = Base;

// 뭐 넣을지 몰라서 일단 아무거나 넣어봤음
Base.prototype.getParent = function () {
    return this.$el;
};

Base.prototype.getOptions = function () {
    return this.options;
};

Base.prototype.render = function () {
    throw new Error('not implemented');
};

Base.prototype.destroy = function () {
};

export { Base };
