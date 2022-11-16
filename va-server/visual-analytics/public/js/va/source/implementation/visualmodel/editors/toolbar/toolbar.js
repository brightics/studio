/**
 * Created by jmk09.jung on 2018-02-13.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function Toolbar($parent, options) {
        Brightics.VA.Core.Editors.Toolbar.call(this, $parent, options);
    }

    Toolbar.prototype = Object.create(Brightics.VA.Core.Editors.Toolbar.prototype);
    Toolbar.prototype.constructor = Toolbar;
    
    Toolbar.prototype.registerItems = function () {
        var items = Brightics.VA.Implementation.Visual.Toolbar.ItemsTemplate;
        for(var i in items) {
            this.addItem(items[i]);
        }
    };

    Toolbar.prototype.handleOnSelectionChanged = function (selection) {
        _.forEach(this.items, function (item) {
            item.handleOnSelectionChanged(selection);
        });
    };

    Toolbar.prototype.handleOnCopy = function () {
        this.getItem('paste').handleOnCopy();
    };

    Brightics.VA.Implementation.Visual.Toolbar = Toolbar;
}).call(this);