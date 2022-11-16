/**
 * Created by jmk09.jung on 2018-02-13.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function Separator($parent, options) {
        Brightics.VA.Core.Editors.Toolbar.Item.call(this, $parent, options);
    }

    Separator.prototype = Object.create(Brightics.VA.Core.Editors.Toolbar.Item.prototype);
    Separator.prototype.constructor = Separator;

    Separator.prototype.initOptions = function () {
        this.setOptions(
            {
                "attribute": {
                    "item-type": "separator"
                }
            }
        );
    };

    Brightics.VA.Core.Editors.Toolbar.Separator = Separator;

}).call(this);