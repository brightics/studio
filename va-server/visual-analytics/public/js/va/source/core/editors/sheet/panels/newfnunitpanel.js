/**
 * Created by jhoon80.park on 2016-01-29.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var BasePanel = Brightics.VA.Core.Editors.Sheet.Panels.BasePanel;

    NewFnUnitPanel.prototype = Object.create(BasePanel.prototype);

    function NewFnUnitPanel(parentId, options) {
        BasePanel.call(this, parentId, options);
    }

    NewFnUnitPanel.prototype.createBottomArea = function () {
    };

    NewFnUnitPanel.prototype.createTopAreaControls = function ($parent) {
        Brightics.VA.Core.Editors.Sheet.Panels.BasePanel.prototype.createTopAreaControls.call(this, $parent);

        var $header = this.$mainControl.find('.brtc-va-editors-sheet-panels-basepanel-header');
        $header.addClass('brtc-va-editors-sheet-panels-newfnunitpanel-header');
    };

    NewFnUnitPanel.prototype.createContentsArea = function ($parent) {
        Brightics.VA.Core.Editors.Sheet.Panels.BasePanel.prototype.createContentsArea.call(this, $parent);

        var $contents = this.$mainControl.find('.brtc-va-editors-sheet-panels-basepanel-contents-area');
        $contents.append('' +
            '<div>' +
            '   <i class="fa fa-plus-circle fa-4x"></i>' +
            '</div>');
        $contents.addClass('brtc-va-editors-sheet-panels-newfnunitpanel-contents');
    };


    Brightics.VA.Core.Editors.Sheet.Panels.NewFnUnitPanel = NewFnUnitPanel;

}).call(this);