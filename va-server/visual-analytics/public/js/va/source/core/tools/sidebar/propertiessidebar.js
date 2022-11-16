/**
 * Created by SDS on 2016-09-05.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function PropertiesSideBar(parentId, options) {
        Brightics.VA.Core.Tools.SideBar.call(this, parentId, options);
    }

    PropertiesSideBar.prototype = Object.create(Brightics.VA.Core.Tools.SideBar.prototype);
    PropertiesSideBar.prototype.constructor = PropertiesSideBar;

    PropertiesSideBar.prototype.createContent = function () {
        this.$controlSideBar = $('' +
            '<div class="brtc-va-tools-sidebar brtc-style-sidebar brtc-style-s-sidebar controlflow">' +
            '   <div class="brtc-va-tools-sidebar-propertytab brtc-style-tab" />' +
            '</div>');
        this.$parent.find('.brtc-va-studio-sidebar-area').append(this.$controlSideBar);

        var $propertyArea = this.$controlSideBar.find('.brtc-va-tools-sidebar-propertytab');
        this.controlEditorProperties = new Brightics.VA.Implementation.ControlFlow.Views.Properties($propertyArea, {
            width: '100%',
            height: '100%'
        });
        this.controlEditorProperties.editorChanged(this.getEditor());
    };

    PropertiesSideBar.prototype.selectionChanged = function (selection) {
        if (this.controlEditorProperties.activeEditor 
            && this.controlEditorProperties.activeEditor.getModel().type == Brightics.VA.Implementation.ControlFlow.Clazz) {
            if (selection instanceof Object && selection.func) {
                for (var fnUnit in Brightics.VA.Implementation.ControlFlow.Functions) {
                    if (fnUnit == selection.func) this.controlEditorProperties.selectionChanged(selection);
                }
            } else if (typeof selection === 'undefined') this.controlEditorProperties.selectionChanged();
        }

        this.applyPreferenceSettings(true);
    };

    PropertiesSideBar.prototype.initPreferenceTarget = function () {
        this.preferenceTarget['scroll'] = this.$controlSideBar.find('.brtc-va-views-properties');
    };

    PropertiesSideBar.prototype.render = function () {
        this.controlEditorProperties.render();
    };

    Brightics.VA.Core.Tools.SideBar.PropertiesSideBar = PropertiesSideBar;
}).call(this);