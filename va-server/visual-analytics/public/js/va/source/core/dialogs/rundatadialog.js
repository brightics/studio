/**
 * Created by daewon77.park on 2016-03-24.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function RunDataDialog(parentId, options) {
        this.parentId = parentId;
        this.options = options;
        this.dialogResult = {
            OK: false,
            Cancel: true
        };

        this.analyticsModel = this.options.analyticsModel;

        this.retrieveParent();
        this.createControls();
        this.initContents();
    }

    RunDataDialog.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    RunDataDialog.prototype.createControls = function () {
        this.$mainControl = $('' +
            '<div class="brtc-va-dialogs-main brtc-va-dialogs-run">' +
            // '   <div class="brtc-va-dialogs-header">Variables</div>' +
            '   <div class="brtc-va-dialogs-body">' +
            '       <div class="brtc-va-dialogs-contents">' +
            '       </div>' +
            '       <div class="brtc-va-dialogs-buttonbar">' +
            '           <input type="button" class="brtc-va-dialogs-buttonbar-ok" value="'+Brightics.locale.common.ok+'" />' +
            '       </div>' +
            '   </div>' +
            '</div>');
        this.$parent.append(this.$mainControl);
        this.$contentsArea = this.$mainControl.find('.brtc-va-dialogs-contents');
        this.$okButton = this.$mainControl.find('.brtc-va-dialogs-buttonbar-ok');

        var _this = this;
        this.$mainControl.dialog({
            theme: Brightics.VA.Env.Theme,
            title: Brightics.locale.common.variables,
            width: 450,
            height: 630,
            modal: true,
            resizable: false,
            draggable: true,
            close: function () {
                if (typeof _this.options.close == 'function') {
                    _this.options.close(_this.dialogResult);
                }
            }
        });
    };

    RunDataDialog.prototype.initContents = function () {
        var _this = this;
        _this.$mainControl.find('.brtc-va-dialogs-contents').addClass('scrollable');
        _this.createDialogContentsArea(_this.$mainControl.find('.brtc-va-dialogs-contents'));

        _this.$okButton.jqxButton({
            theme: Brightics.VA.Env.Theme,
            disabled: false
        });
        _this.$okButton.click(_this.handleOkClicked.bind(_this));
    };


    RunDataDialog.prototype.createDialogContentsArea = function ($parent) {
        var _this = this, variable, variableList = this.analyticsModel.variables || {};
        this.variableControlList = [];

        var variablesKeys = Object.keys(variableList);

        for (var i = 0; i < variablesKeys.length; i++) {
            variable = {};
            variable[variablesKeys[i]] = {
                // 'type': 'literal',
                'value': variableList[variablesKeys[i]].value || '',
                'variable-type': variableList[variablesKeys[i]].type || 'string'
            };
            var variableOption = {
                button: {
                    visible: false
                },
                variable: variable,
                label: variablesKeys[i]
            };
            this.variableControlList.push(Brightics.VA.Core.Widget.Factory.variableControl($parent, variableOption));
        }
        $parent.perfectScrollbar();
    };

    RunDataDialog.prototype.createVariablesList = function () {
        var variableList = {}, variableControl, controlValue;

        for (var i = 0; i < this.variableControlList.length; i++) {
            variableControl = this.variableControlList[i];
            controlValue = variableControl.getFormattedValue();
            variableList[controlValue.key] = controlValue.value;
        }
        return variableList;
    };

    RunDataDialog.prototype.handleOkClicked = function () {
        this.dialogResult = {
            OK: true,
            Cancel: false,
            'args': this.createVariablesList()
        };
        this.$mainControl.dialog('close');
    };

    Brightics.VA.Core.Dialogs.RunDataDialog = RunDataDialog;

}).call(this);