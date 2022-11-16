/**
 * hyunseok.oh@samsung.com
 * 2018. 01. 24
 */

/* global _ */

import { DropdownWrapper } from './dropdownwrapper';

function JqxDropdownWrapper($el, options) {
    DropdownWrapper.call(this, $el, options);
    // width
    // height
    // renderer
    // itemHeight
    // placeHolder
    // minHeight
    // maxHeight

    // @event
    // open
    // close
    // select
    this.jqxOptions = this._brtcOptions2jqxOptions(options);
    this._initEventListener();
}

JqxDropdownWrapper.prototype = Object.create(DropdownWrapper.prototype);
JqxDropdownWrapper.prototype.constructor = JqxDropdownWrapper;

JqxDropdownWrapper.prototype._initEventListener = function () {
    this.$el.on('open', function (evt) {
        this.emit('open', evt);
    }.bind(this));

    this.$el.on('close', function (evt) {
        this.emit('close', evt);
    }.bind(this));

    this.$el.on('select', function (evt) {
        this.emit('select', evt);
    }.bind(this));
};

JqxDropdownWrapper.prototype._getAutoDropDownHeight = function (options) {
    if (options.itemHeight * options.source.length > options.dropDownHeight) {
        return false;
    }
    return true;
};

JqxDropdownWrapper.prototype._brtcOptions2jqxOptions = function (options) {
    var resultOptions = {};

    resultOptions.theme = 'office';
    resultOptions.width = options.width || '100%';
    resultOptions.itemHeight = options.itemHeight || 30;
    resultOptions.height = resultOptions.itemHeight;
    resultOptions.dropDownHeight = options.height || 300;
    this.renderer = this._getRenderer(options.renderer);
    resultOptions.placeHolder = typeof options.placeHolder !== 'undefined' ?
        options.placeHolder : 'choose';
    this.data = options.data || [];
    resultOptions.source = this._getRenderedData(this.data);
    resultOptions.autoDropDownHeight = this._getAutoDropDownHeight(resultOptions);
    return resultOptions;
};

JqxDropdownWrapper.prototype._getRenderer = function (renderer) {
    return renderer || function (val) {
        return val;
    };
};

JqxDropdownWrapper.prototype._getRenderedData = function (data) {
    return _.map(data, this.renderer);
};

JqxDropdownWrapper.prototype.render = function () {
    this.$el.jqxDropDownList(this.jqxOptions);
    return this;
};

JqxDropdownWrapper.prototype.setItems = function (items) {
    this.data = items;
    this.jqxOptions.source = this._getRenderedData(this.data);
    this.jqxOptions.autoDropDownHeight = this._getAutoDropDownHeight(this.jqxOptions);
    this.$el.jqxDropDownList({ source: this.jqxOptions.source });
    return this;
};

JqxDropdownWrapper.prototype.getItems = function () {
    return this.data;
};

JqxDropdownWrapper.prototype.getSelectedItem = function () {
    if (!this.isSelected()) {
        throw new Error('not selected');
    }
    return this.data[this.$el.jqxDropDownList('selectedIndex')];
};

JqxDropdownWrapper.prototype.isSelected = function () {
    return this.$el.jqxDropDownList('selectedIndex') > -1;
};

JqxDropdownWrapper.prototype.isOpened = function () {
    return this.$el.jqxDropDownList('isOpened');
};

JqxDropdownWrapper.prototype.open = function () {
    this.$el.jqxDropDownList('open');
    return this;
};

JqxDropdownWrapper.prototype.close = function () {
    this.$el.jqxDropDownList('close');
    return this;
};

JqxDropdownWrapper.prototype.enable = function () {
    this.$el.jqxDropDownList({ disabled: false });
    return this;
};

JqxDropdownWrapper.prototype.disable = function () {
    this.$el.jqxDropDownList({ disabled: true });
    return this;
};

JqxDropdownWrapper.prototype.focus = function () {
    this.$el.jqxDropDownList('focus');
    return this;
};

export { JqxDropdownWrapper };
