/**
 * Created by jhoon80.park on 2016-01-27.
 */
(function () {
    "use strict";

    var root = this;

    var Brightics = root.Brightics;

    function PropertyControl(parentId, options) {
        this.parentId = parentId;
        this.options = options;
        this.retrieveParent();
        this.createControls();
    }

    PropertyControl.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    PropertyControl.prototype.createControls = function () {
        this.$mainControl = $('' +
            '<div class="brtc-va-editors-sheet-controls-propertycontrol">' +
            '   <div class="brtc-va-editors-sheet-controls-propertycontrol-label"></div>' +
            '   <div class="brtc-va-editors-sheet-controls-propertycontrol-contents">' +
            '</div>');

    this.$labelArea = this.$mainControl.find('.brtc-va-editors-sheet-controls-propertycontrol-label');
    this.$contentsArea = this.$mainControl.find('.brtc-va-editors-sheet-controls-propertycontrol-contents');
    this.setLabel(this.$labelArea);

        this.$mainControl.jqxExpander(
            {
                theme: Brightics.VA.Env.Theme,
                arrowPosition: "left"
            });
        this.$parent.append(this.$mainControl);

    };

    PropertyControl.prototype.setLabel = function ($parents) {
        $parents.text(this.options.label);
    };


  root.Brightics.VA.Core.Editors.Sheet.Controls.PropertyControl = PropertyControl;

}).call(this);
