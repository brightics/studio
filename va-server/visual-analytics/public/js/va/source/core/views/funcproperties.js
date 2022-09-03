/**
 * Created by gy84.bae on 2016-01-28.
 */
(function () {
    'use strict';

    let root = this;
    let Brightics = root.Brightics;

    function FuncProperties(parentId, options) {
        this.parentId = parentId;
        this.options = options;
        this.retrieveParent();
        this.createControls();
    }

    FuncProperties.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    FuncProperties.prototype.createControls = function () {
        this.$mainControl = $('' +
            '<div class="brtc-va-views-funcproperties brtc-va-tab-contents brtc-style-tab-content">' +
            '</div>');
        this.$parent.append(this.$mainControl);
    };

    FuncProperties.prototype.selectionChanged = function (fnUnit) {
        if (this.propertiesPanel) {
            this.propertiesPanel.destroy();
        }

        this.empty();

        if (fnUnit && fnUnit.length > 0) {
            this.propertiesPanel = this.options.panelFactory.createPropertiesPanel(this.$mainControl, {
                width: '100%',
                height: '100%',
                fnUnit: fnUnit[0]
            });
        }
    };

    FuncProperties.prototype.empty = function () {
        this.$mainControl.empty();
    };

    Brightics.VA.Core.Views.FuncProperties = FuncProperties;

}).call(this);