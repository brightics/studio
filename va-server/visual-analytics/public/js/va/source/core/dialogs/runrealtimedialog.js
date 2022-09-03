/**
 * Created by daewon77.park on 2016-03-24.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function RunRealTimeDialog(parentId, options) {
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

    RunRealTimeDialog.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    RunRealTimeDialog.prototype.createControls = function () {
        this.$mainControl = $('' +
            '<div class="brtc-va-dialogs-main brtc-va-dialogs-run">' +
            // '   <div class="brtc-va-dialogs-header">Variables</div>' +
            '   <div class="brtc-va-dialogs-body">' +
            '       <div class="brtc-va-dialogs-contents">' +
            '       </div>' +
            '       <div class="brtc-va-dialogs-buttonbar">' +
            '           <input type="button" class="brtc-va-dialogs-buttonbar-ok" value="OK" />' +
            '       </div>' +
            '   </div>' +
            '</div>');
        this.$parent.append(this.$mainControl);
        this.$contentsArea = this.$mainControl.find('.brtc-va-dialogs-contents');
        this.$okButton = this.$mainControl.find('.brtc-va-dialogs-buttonbar-ok');

        var _this = this;
        this.$mainControl.dialog({
            theme: Brightics.VA.Env.Theme,
            title: 'Variables',
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

    RunRealTimeDialog.prototype.initContents = function () {
        var _this = this;
        _this.$mainControl.find('.brtc-va-dialogs-contents').addClass('scrollable');
        _this.createDialogContentsArea(_this.$mainControl.find('.brtc-va-dialogs-contents'));

        _this.$okButton.jqxButton({
            theme: Brightics.VA.Env.Theme,
            disabled: false
        });
        _this.$okButton.click(_this.handleOkClicked.bind(_this));
    };


    RunRealTimeDialog.prototype.createDialogContentsArea = function ($parent) {
        var _this = this, variable, variableList = this.analyticsModel['gv-def'] || {};
        this.variableControlList = [];
        this.duration = {};

        var durationValue = {};
        durationValue['Duration'] = {
            'type': 'literal',
            'value': '5',
            'variable-type': 'string'
        };
        var durationOption = {
            button: {
                visible: false
            },
            variable: durationValue
        };

        this.duration = Brightics.VA.Core.Widget.Factory.variableControl($parent, durationOption);

        for (var i = 0; i < Object.keys(variableList).length; i++) {
            variable = {};
            variable[Object.keys(variableList)[i]] = {
                'type': 'literal',
                'value': variableList[Object.keys(variableList)[i]]['value'] || '',
                'variable-type': variableList[Object.keys(variableList)[i]]['variable-type'] || 'string'
            };
            var variableOption = {
                button: {
                    visible: false
                },
                variable: variable
            };
            this.variableControlList.push(Brightics.VA.Core.Widget.Factory.variableControl($parent, variableOption));
        }
        $parent.perfectScrollbar();
    };

    RunRealTimeDialog.prototype.createVariablesList = function () {
        var variableList = {}, variableControl, controlValue;

        for (var i = 0; i < this.variableControlList.length; i++) {
            variableControl = this.variableControlList[i];
            controlValue = variableControl.getFormattedValue();

            var temp;
            if (controlValue['variable-type'] == 'array' && controlValue.value.length == 1) {
                temp = controlValue.value[0];
            } else {
                temp = controlValue.value;
            }

            if (temp) variableList[controlValue.key] = controlValue.value;
        }
        return variableList;
    };

    RunRealTimeDialog.prototype.handleOkClicked = function () {
        this.dialogResult = {
            OK: true,
            Cancel: false,
            'args': this.createVariablesList(),
            'duration': this.duration.getFormattedValue().value
        };
        this.$mainControl.dialog('close');
    };

    Brightics.VA.Core.Dialogs.RunRealTimeDialog = RunRealTimeDialog;

}).call(this);