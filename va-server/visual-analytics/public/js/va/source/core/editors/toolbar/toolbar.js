/**
 * Created by jmk09.jung on 2018-02-13.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function Toolbar($parent, options) {
        this.options = options;
        this.editor = options.editor || null;

        this.items = {};

        this.retrieveParent($parent);
        this.createControls();
        this.registerItems();
    }

    Toolbar.prototype.retrieveParent = function ($parent) {
        this.$parent = $parent;
    };

    Toolbar.prototype.createControls = function () {
        this.$mainControl = $('' +
            '<div class="brtc-va-editors-modeleditor-toolbar brtc-style-editor-toolbar brtc-style-col-12">' +
            '</div>');
        this.$parent.append(this.$mainControl);

        this.createNavigator(this.$mainControl);
    };

    Toolbar.prototype.createNavigator = function ($toolbarContainer) {
        this.navigator = new Brightics.VA.Core.Editors.Navigator($toolbarContainer, this.options);
    };

    Toolbar.prototype.registerItems = function () {
        console.error('registerItems must be implemented');
    };

    Toolbar.prototype.addItem = function (item) {
        var ITEM =
            (item.class && typeof item.class === 'function') ? (item.class) : (Brightics.VA.Core.Editors.Toolbar.Item);
        var itemInstance = new ITEM(this.$mainControl, item);
        this.items[itemInstance.getItemType()] = itemInstance;
    };

    Toolbar.prototype.getHeight = function () {
        return this.$mainControl.outerHeight();
    };

    Toolbar.prototype.showItem = function (itemType) {
        this.items[itemType].show();
    };

    Toolbar.prototype.hideItem = function (itemType) {
        this.items[itemType].hide();
    };

    Toolbar.prototype.getItem = function (itemType) {
        return this.items[itemType];
    };

    Brightics.VA.Core.Editors.Toolbar = Toolbar;

}).call(this);