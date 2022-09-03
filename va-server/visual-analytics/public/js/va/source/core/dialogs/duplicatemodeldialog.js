/**
 * Created by daewon.park on 2016-10-27.
 */

/* global _ */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function DuplicateModelDialog(parentId, options) {
        Brightics.VA.Dialogs.Dialog.call(this, parentId, options);
    }

    DuplicateModelDialog.prototype = Object.create(Brightics.VA.Dialogs.Dialog.prototype);
    DuplicateModelDialog.prototype.constructor = DuplicateModelDialog;

    DuplicateModelDialog.prototype._initOptions = function () {
        Brightics.VA.Dialogs.Dialog.prototype._initOptions.call(this);

        this.dialogOptions.width = 600;
        this.dialogOptions.height = 300;
    };

    DuplicateModelDialog.prototype.createDialogContentsArea = function ($parent) {
        var includeDataFlowMessage = 'Include the data flow(s) that belongs to the ';
        includeDataFlowMessage = includeDataFlowMessage +  (this.options.files[0].type === 'control' ? 'control flow.' : 'report.');
        $parent.append('' +
            '<div class="brtc-va-dialogs-row-flex-layout">' +
            '   <div class="brtc-va-dialogs-contents-label brtc-va-dialogs-duplicate-model-newname-label">' + Brightics.locale.common.newName + '</div>' +
            '   <input type="text" class="brtc-va-dialogs-duplicate-model-newname-input" maxlength="80">' +
            '</div>' +
            '<div class="brtc-va-dialogs-row-flex-layout">' +
            '   <div class="brtc-va-dialogs-contents-label brtc-va-dialogs-duplicate-model-targetproject-label">' + Brightics.locale.common.toProject + '</div>' +
            '   <div class="brtc-va-dialogs-duplicate-model-targetproject-input"></div>' +
            '</div>' +
            '<div class="brtc-va-dialogs-row-flex-layout">' +
            '   <div class="brtc-va-dialogs-duplicate-model-include-dataflow">' + includeDataFlowMessage + '</div>' +
            '</div>' +
            '');

        this.createNewNameControl($parent.find('.brtc-va-dialogs-duplicate-model-newname-input'));
        this.createTargetProjectControl($parent.find('.brtc-va-dialogs-duplicate-model-targetproject-input'));
        this.createOptionControl($parent.find('.brtc-va-dialogs-duplicate-model-include-dataflow'));
        this.$nameControl.focus();
    };

    DuplicateModelDialog.prototype.createOptionControl = function ($control) {
        this.$includeControl = $control.jqxCheckBox({
            theme: "office",
            height: 25,
            checked: true,
            boxSize: "17px"
        });
        if (this.options.files[0].type !== 'control' && this.options.files[0].type !== 'visual') {
            this.$includeControl.css('display', 'none');
        }
    };

    DuplicateModelDialog.prototype.createNewNameControl = function ($control) {
        this.$nameControl = $control.jqxInput({
            placeHolder: Brightics.locale.placeHolder.enterName,
            theme: Brightics.VA.Env.Theme
        });
        if (this.options.files[0]) {
            this.$nameControl.val(this.options.files[0].getLabel() + '_copy');
        }
    };

    DuplicateModelDialog.prototype.createTargetProjectControl = function ($control) {
        var _this = this;

        var source = {
            datatype: 'json',
            datafields: [
                {name: 'id'},
                {name: 'label'}
            ],
            url: 'api/va/v2/ws/projects',
            async: true
        };
        var dataAdapter = new $.jqx.dataAdapter(source, {
            beforeLoadComplete: function (records) {
                for (var r in records) {
                    records[r].originLabel = records[r].label;
                    records[r].label = Brightics.VA.Core.Utils.WidgetUtils.convertHTMLSpecialChar(records[r].label);
                }
            }
        });
        this.$targetProjectControl = $control.jqxDropDownList({
            theme: Brightics.VA.Env.Theme,
            autoDropDownHeight: true,
            placeHolder: Brightics.locale.common.chooseProject,
            source: dataAdapter,
            displayMember: 'label',
            valueMember: 'id',
            itemHeight: 30,
            dropDownWidth: 418
        });

        this.$targetProjectControl.on('bindingComplete', function () {
            if (_this.options.files[0]) {
                var $item = $control.jqxDropDownList('getItemByValue', _this.options.files[0].getProjectId());
                $control.jqxDropDownList('selectItem', $item);
            }
            var items = $control.jqxDropDownList('getItems');
            if (items.length > 4) {
                $control.jqxDropDownList('autoDropDownHeight', false);
                $control.jqxDropDownList('dropDownHeight', 120);
            }
        }).on('select', function (event) {
            var args = event.args;
            if (args && args.item) {
                $control.attr('title', args.item.originalItem.originLabel);
            }
        });


    };

    DuplicateModelDialog.prototype.searchDataFlowFile = function (projectId, functions, flowList) {
        var _this = this;

        for (var i in functions) {
            if (functions[i].param.functions) {
                _this.searchDataFlowFile(projectId, functions[i].param.functions, flowList);
            }

            var isDuplicateFlag = false;
            if (functions[i][FUNCTION_NAME] === 'DataFlow') {
                for (var j in flowList) {
                    if (functions[i].param.mid === flowList[j].mid) {
                        isDuplicateFlag = true;
                    }
                }
                if (!isDuplicateFlag) {
                    var dataFlowFile = Studio.getResourceManager().getFile(projectId, functions[i].param.mid);

                    if (dataFlowFile == undefined) {
                        return '"' + functions[i].display.label + '" dataflow was deleted or format is invalid in selected controlflow';
                    } else {
                        flowList.push(dataFlowFile.contents);
                    }
                }
            }
        }
    };

    DuplicateModelDialog.prototype.changeModelId = function (modelInfo, functions) {
        for (var i in functions) {
            if (functions[i].param.functions) {
                this.changeModelId(modelInfo, functions[i].param.functions);
            }

            if (modelInfo.oldMid === functions[i].param.mid) {
                functions[i].param.mid = modelInfo.newMid;
            }
        }
    };

    DuplicateModelDialog.prototype.handleOkClicked = function () {
        var _this = this;
        var newName = this.$nameControl.val().trim();
        if (newName.length > 80) {
            Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('"New Name" should be 80 characters or less.', function () {
                // _this.$mainControl.dialog('focus');
            });
            return false;
        } else if (!newName) {
            Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('"New Name" should not be empty or blank.', function () {
                // _this.$mainControl.dialog('focus');
            });
            return false;
        }

        if (this.options.files[0].type === 'control' && this.$includeControl.jqxCheckBox('checked')) {
            var flowList = [];
            var errorMessage = this.searchDataFlowFile(this.options.files[0].project_id, this.options.files[0].contents.functions, flowList);

            if (errorMessage) {
                Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog(errorMessage, function () {
                });
                return false;
            }
        }

        var sourceProjectId = this.options.files[0].getProjectId();
        var targetProjectId = this.$targetProjectControl.val();
        var file = this.options.files[0];

        var doneCallback = function () {
            this.dialogResult.projectId = sourceProjectId;
            Brightics.VA.Dialogs.Dialog.prototype.handleOkClicked.call(this);
        }.bind(this);

        var errCallback = function (error) {
            Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(error);
        };

        var rs = Studio.getResourceService();
        rs.duplicateFile(file.getFileId(),
                sourceProjectId,
                targetProjectId,
                true,
                file.getLabel(),
                newName)
            .then(doneCallback)
            .catch(errCallback);
    };

    Brightics.VA.Core.Dialogs.DuplicateModelDialog = DuplicateModelDialog;
}).call(this);
