/**
 * Created by SDS on 2016-09-05.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function VariablesSideBar(parentId, options) {
        Brightics.VA.Core.Tools.SideBar.call(this, parentId, options);
    }

    VariablesSideBar.prototype = Object.create(Brightics.VA.Core.Tools.SideBar.prototype);
    VariablesSideBar.prototype.constructor = VariablesSideBar;

    VariablesSideBar.prototype.createContent = function () {
        this.$modelSideBar = $('' +
            '<div class="brtc-va-tools-sidebar brtc-style-sidebar brtc-style-s-sidebar dataflow">' +
            '   <div class="brtc-va-tools-sidebar-variabletab brtc-style-tab" />' +
            '</div>');
        this.$parent.find('.brtc-va-studio-sidebar-area').append(this.$modelSideBar);

        this.$variableArea = this.$modelSideBar.find('.brtc-va-tools-sidebar-variabletab');
        this.dataEditorVariable = new Brightics.VA.Core.Views.Variable(this.$variableArea, {
            width: '100%',
            height: 'calc(100% - 30px)',
            editor: this.getEditor()
        });
    };

    VariablesSideBar.prototype.initPreferenceTarget = function () {
        this.preferenceTarget['scroll'] = this.$variableArea.find('.brtc-va-tools-sidebar-variable-list');
    };

    VariablesSideBar.prototype.destroy = function () {
        this.dataEditorVariable.destroy();
    };

    Brightics.VA.Core.Tools.SideBar.VariablesSideBar = VariablesSideBar;

}).call(this);