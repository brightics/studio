/**
 * Created by daewon77.park on 2016-03-24.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function RunControlDialog(parentId, options) {
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

    RunControlDialog.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    RunControlDialog.prototype.createControls = function () {
        this.$mainControl = $('' +
            '<div class="brtc-va-dialogs-main brtc-va-dialogs-run">' +
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

    RunControlDialog.prototype.initContents = function () {
        var _this = this;
        _this.$mainControl.find('.brtc-va-dialogs-contents').addClass('scrollable');

        _this.createDialogContentsArea(_this.$mainControl.find('.brtc-va-dialogs-contents'));

        _this.$okButton.jqxButton({
            theme: Brightics.VA.Env.Theme,
            disabled: false
        });
        _this.$okButton.click(_this.handleOkClicked.bind(_this));
    };

    RunControlDialog.prototype.createDialogContentsArea = function ($parent) {
        var _this = this, variable, variableList = this.analyticsModel['variables'] || [];
        this.variableControlList = [];

        for (var i = 0; i < variableList.length; i++) {
            variable = {};
            variable[variableList[i].name] = {
                'type': 'literal',
                'value': variableList[i].value || '',
                'variable-type': variableList[i].type
            };
            var variableOption = {
                button: {
                    visible: false
                },
                variable: variable,
                label: variableList[i].name
            };
            this.variableControlList.push(Brightics.VA.Core.Widget.Factory.variableControl($parent, variableOption));
        }
        $parent.perfectScrollbar();
    };

    RunControlDialog.prototype.createVariablesList = function () {
        var variableList = {}, variableControl, controlValue;

        for (var i = 0; i < this.variableControlList.length; i++) {
            variableControl = this.variableControlList[i];
            controlValue = variableControl.getFormattedValue();
            variableList[controlValue.key] = controlValue.value;
        }
        return variableList;
    };

    RunControlDialog.prototype.handleOkClicked = function () {
        this.dialogResult = {
            OK: true,
            Cancel: false,
            'args': this.createVariablesList()
        };
        this.$mainControl.dialog('close');
    };

    Brightics.VA.Core.Dialogs.RunControlDialog = RunControlDialog;

}).call(this);