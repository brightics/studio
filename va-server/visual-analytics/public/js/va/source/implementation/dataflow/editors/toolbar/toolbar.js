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
        var items = Brightics.VA.Implementation.DataFlow.Toolbar.ItemsTemplate;
        for(var i in items) {
            this.addItem(items[i]);
        }
    };

    Brightics.VA.Implementation.DataFlow.Toolbar = Toolbar;
}).call(this);