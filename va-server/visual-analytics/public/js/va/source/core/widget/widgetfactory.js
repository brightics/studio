/**
 * Created by SDS on 2016-01-28.
 */
(function () {
    'use strict';

    var root = this;

    root.Brightics.VA.Core.Widget.Factory = {
        variableControl: function (parentId, options) {
            return new root.Brightics.VA.Core.Widget.Controls.VariableControl(parentId, options);
        },
        arrayInputControl: function (parentId, options) {
            return new root.Brightics.VA.Core.Widget.Controls.ArrayInputControl(parentId, options);
        },
        argumentControl: function (parentId, options) {
            return new root.Brightics.VA.Core.Widget.Controls.ArgumentControl(parentId, options);
        },
        createFadeOutMessage: function ($control, options) {
            new root.Brightics.VA.Core.Widget.Controls.FadeOutMessage($control, options);
        },
        noteControl: function ($control, options) {
            return new root.Brightics.VA.Core.Widget.Controls.NoteControl($control, options);
        },
        numericInputControl: function (parentId, options) {
            return new root.Brightics.VA.Core.Widget.Controls.NumericInput(parentId, options);
        },
        aceEditorControl: function ($control, options) {
            return new root.Brightics.VA.Core.Widget.Controls.AceEditorControl($control, options);
        },
        tabControl: function ($control, options) {
            return new root.Brightics.VA.Core.Widget.Controls.TabControl($control, options);
        },
        colorPickerControl: function ($control, options) {
            return new root.Brightics.VA.Core.Widget.Controls.ColorPickerControl($control, options);
        },
        opacityControl: function ($control, options) {
            return new root.Brightics.VA.Core.Widget.Controls.OpacityControl($control, options);
        },
        borderControl: function ($control, options) {
            return new root.Brightics.VA.Core.Widget.Controls.BorderControl($control, options);
        },
        virtualColumnSelectorControl: function ($control, options) {
            return new root.Brightics.VA.Core.Widget.Controls.VirtualColumnSelectorControl($control, options);
        }
    };

}).call(this);