/**
 * Created by sungjin1.kim on 2016-03-24.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function SettingVariableDialog(parentId, options) {
        this.parentId = parentId;
        this.options = options;
        this.dialogResult = {
            OK: false,
            Cancel: true,
            command: new Brightics.VA.Core.CompoundCommand(this, {})
        };

        this.analyticsModel = this.options.fnUnit.parent();
        this.mainModel = this.analyticsModel.getMainModel();
        if (this.options.param.index > -1 && this.options.fnUnit.param.functions) {
            this.options.fnUnit = this.options.fnUnit.param.functions[this.options.param.index];
        }
        this.retrieveParent();
        this.createControls();
        this.initContents();
    }

    SettingVariableDialog.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    SettingVariableDialog.prototype.createControls = function () {
        var _this = this;
        this.$mainControl = $('' +
            '<div class="brtc-va-dialogs-main brtc-va-setting-variable-dialogs-main">' +
            // '   <div class="brtc-va-dialogs-header"></div>' +
            '   <div class="brtc-va-dialogs-body">' +
            '       <div class="brtc-va-dialogs-contents" style="display: initial">' +
            '       </div>' +
            '   </div>' +
            '</div>');

        this.$parent.append(this.$mainControl);

        this.$mainControl.dialog({
            theme: Brightics.VA.Env.Theme,
            modal: false,
            width: 200,
            resizable: false,
            showAnimationDuration: 50,
            position: {my: "left top", at: "right top", of: this.$mainControl.parent()},
            open: function () {
                _this.$mainControl.parent().find('.ui-dialog-titlebar.ui-widget-header').remove()
            },
            close: function () {
                $(window).off('mousedown', _this.closeHandler);
                $(window).off('resize', _this.closeHandler);

                if (typeof _this.options.close == 'function') {
                    _this.options.close(_this.dialogResult);
                }
            }
        });

        this.closeHandler = function (event) {
            if (_this.$mainControl.has(event.target).length === 0 && _this.$mainControl.dialog('isOpen')) {
                _this.$mainControl.dialog('close');
            }
        };

        $(window).on('mousedown', this.closeHandler);
        $(window).on('resize', this.closeHandler);
    };

    SettingVariableDialog.prototype.initContents = function () {
        this.createDialogContentsArea(this.$mainControl.find('.brtc-va-dialogs-contents'));
    };


    SettingVariableDialog.prototype.createDialogContentsArea = function ($parent) {
        var _this = this;
        this.$contents = $(
            '<div class="brtc-va-setting-variable-dialogs-contents">' +
            '   <div class="brtc-va-global-variable-set element-wrapper">' +
            '       <div class="element">'+Brightics.locale.common.setAsVariable+'</div>' +
            '       <hr>' +
            '   </div>' +
            '   <div class="brtc-va-global-variable-list element-wrapper">' +
            '   </div>' +
            '   <div class="brtc-va-global-variable-unset element-wrapper">' +
            '       <hr>' +
            '       <div class="element">Unset variable</div>' +
            '   </div>' +
            '</div>');
        $parent.append(this.$contents);

        this.createGlobalVariableList();
        this.bindSetGlobalVariable();
        this.bindUnsetGlobalVariable();
    };

    SettingVariableDialog.prototype.createGlobalVariableList = function () {
        var _this = this;
        this.variableList = Object.keys(this.getModel().variables);
        var variable = this.getModel().getVariable(this.options.fnUnit.fid, this.options.param.key);
        if (variable) {
            this.$contents.find('.brtc-va-global-variable-set').hide();
        }
        else {
            this.$contents.find('.brtc-va-global-variable-unset').hide();
        }

        for (var index in this.variableList) {
            var $variableElement = $(`<div class="element"> ${Brightics.locale.common.setTo} ${this.variableList[index]}</div>`);
            $variableElement.attr('title', this.variableList[index]);
            $variableElement.attr('type', this.getModel().variables[this.variableList[index]]['variable-type']);
            this.$contents.find('.brtc-va-global-variable-list.element-wrapper').append($variableElement);
            $variableElement.data('variable', this.variableList[index]);
            if (variable === this.variableList[index]) {
                $variableElement.addClass('set');
            }

            $variableElement.click(function () {
                _this.dialogResult.OK = true;
                _this.dialogResult.command.add(new Brightics.VA.Core.Editors.Diagram.Commands.BindVariableCommand(_this, {
                    fid: _this.options.fnUnit.fid,
                    paramKey: _this.options.param.key,
                    variable: $(this).data('variable'),
                    subFnUnitIndex: _this.options.param.index
                }));
                _this.$mainControl.dialog('close');
            });
        }

        this.$contents.find('.brtc-va-global-variable-list').perfectScrollbar();
    };
    
    SettingVariableDialog.prototype.bindSetGlobalVariable = function () {
        var _this = this;
        this.$contents.find('.brtc-va-global-variable-set').click(function () {
            var variableName = _this.options.param.label.toLowerCase().replace(/ /gi, '_');            
            var isArray = (_this.options.param.type.toLowerCase().indexOf('array') > -1);

            var variable = {
                name: variableName,
                type: (isArray) ? ('array[string]') : ('string'),
                value: (isArray) ? (['']) : ('')
            };
            var command = new Brightics.VA.Core.Editors.Diagram.Commands.AddVariableDefCommand(_this, {
                name: variable.name,
                ref: {
                    type: variable.type,
                    value: variable.value
                },
                variable: variable
            });

            var modelEditorRef = Brightics.VA.Core.Utils.WidgetUtils.getModelEditorRef(_this.$parent);
            modelEditorRef.getCommandManager().execute(command);

            _this.dialogResult.OK = true;
            _this.dialogResult.command.add(new Brightics.VA.Core.Editors.Diagram.Commands.BindVariableCommand(_this, {
                fid: _this.options.fnUnit.fid,
                paramKey: _this.options.param.key,
                variable: variable.name,
                subFnUnitIndex: _this.options.param.index
            }));
            _this.$mainControl.dialog('close');
        });
    };

    SettingVariableDialog.prototype.bindUnsetGlobalVariable = function () {
        var _this = this;
        var variable = this.getModel().getVariable(this.options.fnUnit.fid, this.options.param.key);
        this.$contents.find('.brtc-va-global-variable-unset').click(function () {
            _this.dialogResult.command.add(new Brightics.VA.Core.Editors.Diagram.Commands.UnBindVariableCommand(_this, {
                fid: _this.options.fnUnit.fid,
                paramKey: _this.options.param.key,
                variable: variable,
                subFnUnitIndex: _this.options.param.index
            }));
            if (typeof _this.options.remove == 'function') {
                _this.options.remove(_this.dialogResult);
            }
            _this.$mainControl.dialog('close');
        });
    };

    SettingVariableDialog.prototype.getModel = function () {
        return this.mainModel;
    };

    Brightics.VA.Core.Dialogs.SettingVariableDialog = SettingVariableDialog;

}).call(this);