/**
 * Created by jmk09.jung on 2018-02-13.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function Item($parent, options) {
        this.options = options || {};
        this.options.attribute = this.options.attribute || {};
        this.options.action = this.options.action || {};

        this.retrieveParent($parent);
        this.createControls();

        this.initOptions();
        this.applyOptions();
    }

    Item.prototype.retrieveParent = function ($parent) {
        this.$parent = $parent;
    };

    Item.prototype.createControls = function () {
        this.$mainControl = $('<div class="brtc-style-editor-toolitem brtc-style-s-editor-toolitem"></div>');
        this.$parent.append(this.$mainControl);
    };

    Item.prototype.initOptions = function() {
        //Override
    };

    Item.prototype.applyOptions = function () {
        this.applyAttribute();
        this.applyAction();
        this.applyVisible();
        this.applySeparator();
    };

    Item.prototype.applyAttribute = function () {
        for (var key in this.options.attribute) {
            this.$mainControl.attr(key, this.options.attribute[key]);
        }
    };

    Item.prototype.applyAction = function () {
        for (var key in this.options.action) {
            if (typeof this.options.action[key] === 'function') {
                this.$mainControl.on(key, this.options.action[key].bind(this));
            }
        }
    };

    Item.prototype.applyVisible = function () {
        if (this.options.visible === false) {
            this.$mainControl.hide();
        }
    };

    Item.prototype.applySeparator = function () {
        if (this.options.separator === true) {
            var $separator = $('<div class="brtc-style-editor-toolitem brtc-style-s-editor-toolitem" item-type="separator"></div>');
            this.$parent.append($separator);
        }
    };

    Item.prototype.setOptions = function (options) {
        this.options = $.extend(this.options, options);
    };

    Item.prototype.getOptions = function () {
        return this.options;
    };

    Item.prototype.getTitle = function () {
        return this.options.attribute['title'];
    };

    Item.prototype.getItemType = function () {
        return this.options.attribute['item-type'];
    };

    Item.prototype.show = function () {
        this.$mainControl.show();
    };

    Item.prototype.hide = function () {
        this.$mainControl.hide();
    };

    Item.prototype.setEnable = function () {
        this.$mainControl.removeClass('status-disabled');
    };

    Item.prototype.setDisable = function () {
        this.$mainControl.addClass('status-disabled');
    };

    Item.prototype.handleOnSelectionChanged = function () {
    };

    Brightics.VA.Core.Editors.Toolbar.Item = Item;

}).call(this);