/**
 * Created by SDS on 2018-07-09.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function UdfInvokeControlRenderer(udfInvokeProperties) {
        this._super = udfInvokeProperties;
    }

    UdfInvokeControlRenderer.prototype.createInvokeRenderer = function (spec) {
        if (spec.control === 'ColumnSelector') {
            return this.createColumnSelectorRenderer(spec);
        } else if (spec.control === 'InputBox') {
            return this.createInputBoxRenderer(spec);
        } else if (spec.control === 'DropDownList') {
            return this.createDropDownListRenderer(spec);
        } else if (spec.control === 'RadioButton' ||
                    spec.control === 'BooleanRadio') {
            return this.createRadioButtonRenderer(spec);
        } else if (spec.control === 'CheckBox') {
            return this.createCheckBoxRenderer(spec);
        } else if (spec.control === 'ArrayInput') {
            return this.createArrayInputRenderer(spec);
        } else if (spec.control === 'Expression') {
            return this.createExpressionRenderer(spec);
        } else if (spec.control === 'FileSelector') {
            return this.createLocalFileSelectorRenderer(spec);
        }
    };

    UdfInvokeControlRenderer.prototype._getValueByParamId = function (id) {
        return this._super.options.fnUnit.param[id];
    };

    UdfInvokeControlRenderer.prototype._getControlByParamId = function (id) {
        return this._super.controls[id];
    };


    UdfInvokeControlRenderer.prototype.createColumnSelectorRenderer = function (spec) {
        const _this = this;
        const id = spec.id;
        let renderer = function () {
            const control = _this._getControlByParamId(id);
            if(spec.multiple){
                const value = _this._getValueByParamId(id) || [];
                control.setSelectedItems(value);
            } else {
                const value = _this._getValueByParamId(id) || "";
                control.setSelectedItems([value]);
            }
        };
        return renderer;
    };

    UdfInvokeControlRenderer.prototype.createArrayInputRenderer = function (spec) {
        var _this = this;
        var id = spec.id;

        var renderer = function () {
            var value = _this._getValueByParamId(id) || [];
            var control = _this._getControlByParamId(id);
            control.setValue(value);
        };
        return renderer;
    };

    UdfInvokeControlRenderer.prototype.createInputBoxRenderer = function (spec) {
        var _this = this;
        var id = spec.id;

        var renderer = function () {
            var value = _this._getValueByParamId(id);
            var control = _this._getControlByParamId(id);
            if (typeof control.val === 'function') {
                control.val(value || '');
            } else {
                control.setValue(value || '');
            }
        };
        return renderer;
    };

    UdfInvokeControlRenderer.prototype.createLocalFileSelectorRenderer = function (spec) {
        var _this = this;
        var id = spec.id;

        var renderer = function () {
            var value = _this._getValueByParamId(id);
            var control = _this._getControlByParamId(id);
            var val = Array.isArray(value) ? value[0] : value;
            if (typeof control.val === 'function') {
                control.val(val || '');
            } else {
                control.setValue(val || '');
            }
        };
        return renderer;
    };

    UdfInvokeControlRenderer.prototype.createDropDownListRenderer = function (spec) {
        var _this = this;
        var id = spec.id;

        var renderer = function () {
            var value = _this._getValueByParamId(id);
            var control = _this._getControlByParamId(id);

            if (typeof value === 'undefined' || value === '') {
                control.jqxDropDownList('selectIndex', -1);
            } else {
                control.jqxDropDownList('selectItem', value);
            }

        };
        return renderer;
    };

    UdfInvokeControlRenderer.prototype.createRadioButtonRenderer = function (spec) {
        var _this = this;
        var id = spec.id;

        var renderer = function () {
            var value = _this._getValueByParamId(id);
            var controlMap = _this._getControlByParamId(id);

            if (controlMap[value]) {
                controlMap[value].jqxRadioButton({checked: true});
            }

        };
        return renderer;
    };

    UdfInvokeControlRenderer.prototype.createCheckBoxRenderer = function (spec) {
        var _this = this;
        var id = spec.id;

        var renderer = function () {
            var value = _this._getValueByParamId(id);
            var controlMap = _this._getControlByParamId(id);


            if (typeof value !== 'undefined') {
                for (let index in controlMap) {
                    if ($.inArray(controlMap[index].data('tag'), value) > -1) {
                        controlMap[index].jqxCheckBox({checked: true});
                    }
                    else {
                        controlMap[index].jqxCheckBox({checked: false});
                    }
                }
            } else {
                for (let index in controlMap) {
                    controlMap[index].jqxCheckBox({checked: false});
                }
            }

        };
        return renderer;
    };


    UdfInvokeControlRenderer.prototype.createExpressionRenderer = function (spec) {
        var _this = this;
        var id = spec.id;

        var renderer = function () {
            var value = _this._getValueByParamId(id) || '';
            var control = _this._getControlByParamId(id);

            control.setValue(value);

        };
        return renderer;
    };


    Brightics.VA.Implementation.DataFlow.UdfInvokeControlRenderer = UdfInvokeControlRenderer;

}).call(this);
