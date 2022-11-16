/* -----------------------------------------------------
 *  color-picker-dialog.js
 *  Created by hyunseok.oh@samsung.com on 2018-09-05.
 * ---------------------------------------------------- */

(function (root) {
    'use strict';
    var Brightics = root.Brightics;

    function ColorPickerDialog(parentId, options) {
        Brightics.VA.Dialogs.Dialog.call(this, parentId, options);
        var self = this;
        this._close = function (event) {
            if (event.target.classList.contains('ui-widget-overlay')) {
                self.close();
            }
        };
        $(window).on('mousedown', this._close);
        this.dialogResult.color = options.color;

        if (this.options.onClose) {
            this.options.close = (function (fn) {
                return function (dialogResult) {
                    if (dialogResult.color) fn(dialogResult.color);
                };
            }(this.options.onClose));
        }
    }

    ColorPickerDialog.prototype = Object.create(Brightics.VA.Dialogs.Dialog.prototype);
    ColorPickerDialog.prototype.constructor = ColorPickerDialog;

    ColorPickerDialog.prototype.createDialogContentsArea = function ($parent) {
        this.$colorPicker = this.createColorPicker($parent);
    };

    ColorPickerDialog.prototype._initOptions = function () {
        Brightics.VA.Dialogs.Dialog.prototype._initOptions.call(this);
        this.dialogOptions.height = 'auto';
        this.dialogOptions.width = 'auto';
        this.dialogOptions.title = 'Color Picker';
    };

    ColorPickerDialog.prototype.createColorPicker = function ($parent) {
        var self = this;
        var $el = $('<div></div>');

        $el.jqxColorPicker({
            height: 230,
            width: 275,
            colorMode: 'hue'
        });
        $el.jqxColorPicker('setColor', this.options.color);
        $parent.append($el);


        var toHex = function (v) {
            return v >= 10 ? String.fromCharCode((v - 10) + 'A'.charCodeAt(0)) : v.toString();
        };

        var hexColors = function (colors) {
            return '#' + ['r', 'g', 'b'].map(function (key) {
                var n = parseInt(colors[key], 10);
                return [parseInt(n / 16, 10), n % 16].map(toHex).join('');
            }).join('');
        };

        $el.bind('colorchange', function (e) {
            self.dialogResult.color = hexColors(e.args.color);
        });
        return $el;
    };

    ColorPickerDialog.prototype.createDialogButtonBar = function ($parent) {
        var self = this;
        this.$resetButton = $('<input type="button" class="brtc-va-dialogs-buttonbar-cancel" value="Reset" />');
        $parent.append(this.$resetButton);
        this.$resetButton.jqxButton({
            theme: Brightics.VA.Env.Theme
        });
        this.$resetButton.click(function () {
            self.dialogResult.color = self.options.color;
            self.$colorPicker.jqxColorPicker('setColor', self.options.color);
        });
    };

    ColorPickerDialog.prototype.destroy = function () {
        Brightics.VA.Dialogs.Dialog.prototype.destroy.call(this);
        $(window).off('mousedown', this._close);
    };

    Brightics.VA.Dialogs.ColorPickerDialog = ColorPickerDialog;
/* eslint-disable no-invalid-this */
}(this));
