/**
 * Created by sds on 2018-02-20.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var _super = Brightics.VA.Core.Dialogs.ScriptEditorDialog.prototype;

    function OptScriptEditorDialog(parentId, options) {
        _super.constructor.call(this, parentId, options);
    }

    OptScriptEditorDialog.prototype = Object.create(_super);
    OptScriptEditorDialog.prototype.constructor = OptScriptEditorDialog;

    OptScriptEditorDialog.prototype._initOptions = function () {
        _super._initOptions.call(this);
        this.controls = {};
        this.columnControlList = [];
    };

    OptScriptEditorDialog.prototype.createLayout = function ($parent, useTable) {
        _super.createLayout.call(this);
        this.$controlWrapper = $('<div class="brtc-va-dialogs-controlwrapper">');
        this.$controlWrapper.css('display', 'flex');
        this.$infoArea.append(this.$controlWrapper);
    };

    OptScriptEditorDialog.prototype.renderInfoArea = function ($parent, useTable) {
        this.createColumnControls();
        this.fillControlValues();
    };


    OptScriptEditorDialog.prototype.createColumnControls = function ($parent) {
        var controlList = ['parameters', 'constraints-column', 'objectives-column'];
        for (var ctrlIdx = 0; ctrlIdx < controlList.length; ctrlIdx++) {
            var controlNm = controlList[ctrlIdx];
            var paramVal = (this.options.fnUnit.param[controlNm]) ? this.options.fnUnit.param[controlNm] : this.options.fnUnit.param[controlNm.replace('-column', '')];
            this.controls[controlNm] = new Brightics.VA.Core.Editors.Sheet.Controls.Optimization[controlNm](this, {
                value: paramVal
            })
        }
    };

    OptScriptEditorDialog.prototype.renderColumnControls = function ($parent) {
        var controlList = ['parameters', 'constraints-column', 'objectives-column'];
        for (var ctrlIdx = 0; ctrlIdx < controlList.length; ctrlIdx++) {
            this.controls[controlList[ctrlIdx]].renderControl();
        }
    };

    OptScriptEditorDialog.prototype.addPropertyControl = function (label, callback, option) {
        var _this = this;
        if (option.mandatory) label = '<div style="display:inline-block;">' + label + ' <div class="brtc-va-editors-sheet-controls-propertycontrol-mandatory">*</div></div>';
        var $controlHeader = $('<div class="brtc-va-dialogs-scalaeditor-alias-header">' + label + '</div>');
        var $controlBody = $('<div class="brtc-va-dialogs-scalaeditor-alias-body space"></div>');
        $controlHeader.append($controlBody);
        this.$controlWrapper.append($controlHeader).append($controlBody);

        if (typeof callback === 'function') {
            callback.call(this, $controlBody);
        }

        return $controlBody;
    };

    OptScriptEditorDialog.prototype.createColumnList = function ($control, widgetOptions) {
        var $wrapper = $('<div class="brtc-va-editors-sheet-controls-wrapper"></div>');
        $control.wrap($wrapper);

        var options = {
            placeHolder: 'No Columns',
            multiple: true,
            rowCount: 1,
            maxRowCount: 5,
            expand: false,
            sort: 'none',
            sortBy: 'name',
            showOpener: 'none',
            removable: false,
            defaultType: '-',
            changed: function (type, data) {

            },
            added: function () {

            },
            removed: function () {

            }
        };

        if (widgetOptions) {
            $.extend(options, widgetOptions);
        }

        return new Brightics.VA.Core.Editors.Sheet.Controls.ColumnList($control, options);
    };

    OptScriptEditorDialog.prototype.registerColumnControl = function ($control) {
        this.columnControlList.push($control);
    };

    OptScriptEditorDialog.prototype.fillControlValues = function () {
        var columns = [], _this = this;
        if (this.options.fnUnit[IN_DATA][0]) {
            this.options.dataProxy.requestSchema(this.options.fnUnit[IN_DATA][0],
                function (result) {
                    columns = result.columns;
                    if (_this.columnControlList) {
                        for (var controlIdx = 0; controlIdx < _this.columnControlList.length; controlIdx++) {
                            _this.columnControlList[controlIdx].setItems(columns);
                        }
                    }
                    _this.renderColumnControls();
                },
                function (result) {
                }
            );
        } else {
            _this.renderColumnControls();
        }
    };

    OptScriptEditorDialog.prototype.getTitle = function () {
        return 'Python';
    };


    Brightics.VA.Core.Dialogs.OptScriptEditorDialog = OptScriptEditorDialog;

}).call(this);