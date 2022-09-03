/**
 * Created by SDS on 2016-09-05.
 */

(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function OptSettingSideBar(parentId, options) {
        Brightics.VA.Core.Tools.SideBar.call(this, parentId, options);
    }

    OptSettingSideBar.prototype = Object.create(Brightics.VA.Core.Tools.SideBar.prototype);
    OptSettingSideBar.prototype.constructor = OptSettingSideBar;

    OptSettingSideBar.prototype.createContent = function () {
        var _this = this;

        this.commandListener = function (command) {
            _this.handleCommand(command);
        };
        this.options.manager.editor.addCommandListener(this.commandListener);
        this.options.manager.editor.addGoHistoryListener(this.commandListener);

        var unbindButtonStyle = `
            width: 100%;
            height: 30px;
            background-color: #6c79e9;
            color: #fff;
            text-align: center;
            line-height: 30px;
            margin: 10px 0;
            cursor: pointer;
        `;

        var contentsWrapperStyle = `
            overflow: hidden;
            height: 100%;
            position: relative;
            padding-right: 20px;
        `;

        var contentsWrapperDivStyle = `
            width: 100%;
            height: auto;
            margin-bottom: 10px;
        `;

        this.$modelSideBar = $(`
            <div class="brtc-va-tools-sidebar brtc-style-sidebar brtc-style-s-sidebar dataflow optsidebar">
               <div class="brtc-va-tools-sidebar-contents-wrapper" style="${contentsWrapperStyle}">
                   <div style="${contentsWrapperDivStyle}">
                       <div class="brtc-opt-model-dropdownlist"></div>
                       <div class="brtc-opt-model-delete-button" style="${unbindButtonStyle}">
                       Unbind OPT</div>
                       <div class="brtc-opt-model-detail-view"></div>
                   </div>
               </div>
            </div>`);
        this.$parent.find('.brtc-va-studio-sidebar-area').append(this.$modelSideBar);
        this.$modelSideBar.find('.brtc-va-tools-sidebar-contents-wrapper').perfectScrollbar();

        this.createOptModelDropDownList();
        this.createOptModelDeleteButton();

        this.createDetailView();
        this.render();
    };

    OptSettingSideBar.prototype.createOptModelDropDownList = function () {
        var _this = this;
        var source = this._getDropDownListSource();

        this.$dropdownList = this.$modelSideBar.find('.brtc-opt-model-dropdownlist');
        this.$dropdownList.jqxDropDownList({
            theme: Brightics.VA.Env.Theme,
            source: source,
            selectedIndex: 0,
            checkboxes: false,
            width: 325,
            height: 25,
            openDelay: 0,
            closeDelay: 0,
            autoDropDownHeight: true,
            displayMember: 'text',
            valueMember: 'value'
        });

        this.$dropdownList.on('select', function (event) {
            var args = event.args;
            if (args) {
                var item = args.item;
                var value = item.value;
                if (args.type === "mouse" || args.type === "keyboard") {
                    _this.createDetailView(value);
                    _this.render(value);
                }
            }
        });
    };

    OptSettingSideBar.prototype._getDropDownListSource = function () {
        var activeModelEditor = Studio.getEditorContainer().getActiveModelEditor();
        var pid = activeModelEditor.getEditorInput().getProjectId();
        var mid = activeModelEditor.getEditorInput().getFileId();
        var optModels = Brightics.OptModelManager.getOptModels(pid, mid);
        var source = [];
        if (optModels[0]) {
            for (var i = 0; i < optModels.length; i++) {
                source.push({
                    'text': optModels[i].label,
                    'value': optModels[i]['optId']
                })
            }
        }
        return source;
    };

    OptSettingSideBar.prototype.createOptModelDeleteButton = function () {
        var _this = this;
        this.$optModelDeleteButton = this.$modelSideBar.find('.brtc-opt-model-delete-button');
        this.$optModelDeleteButton.click(function () {
            var message = 'Are you sure you want to unbind this optimization model?';
            Brightics.VA.Core.Utils.WidgetUtils.openConfirmDialog(message, function (dialogResult) {
                if (dialogResult.OK) {
                    var activeModelEditor = Studio.getEditorContainer().getActiveModelEditor();
                    var pid = activeModelEditor.getEditorInput().getProjectId();
                    var mid = activeModelEditor.getEditorInput().getFileId();
                    var optId = _this.$dropdownList.val();
                    if (optId && Brightics.OptModelManager.getOptModel(pid, mid, optId)) {
                        var commandManager = activeModelEditor.getCommandManager();
                        var command = Brightics.OptModelManager.createRemoveOptModelCommand(pid, mid, optId);
                        commandManager.execute(command);
                    }
                }
            });
        });
    };

    OptSettingSideBar.prototype.createDetailView = function (optId) {
        this.$detailView = this.$modelSideBar.find(".brtc-opt-model-detail-view");
        this.$detailView.empty();

        var activeModelEditor = Studio.getEditorContainer().getActiveModelEditor();
        var pid = activeModelEditor.getEditorInput().getProjectId();
        var mid = activeModelEditor.getEditorInput().getFileId();

        if (!optId) {
            var models = Brightics.OptModelManager.getOptModels(pid, mid);
            if (models[0]) {
                optId = models[0]['optId'];
            }
        }

        this.optModel = Brightics.OptModelManager.getOptModel(pid, mid, optId);
        if (this.optModel) {
            this.createDetailViewControls(this.$detailView);
        } else {
            this.resetDropDownList();
        }
    };

    OptSettingSideBar.prototype.createDetailViewControls = function ($parent) {
        this.$controls = {
            'options': {
                'objective': {
                    'functionLabel': null,
                    'tableLabel': null,
                    'row': null,
                    'column': null,
                    'sense': null
                },
                'maxEvaluations': null,
                'method': null
            }
        };

        var controlsStyle = `
            margin-bottom:30px;
        `;
        var $controls = $(`<div style="${controlsStyle}"></div>`);
        this.$detailViewControls = $controls;

        $parent.append($controls);
        $controls.append(`
            <style>
                .brtc-opt-model-detail-view .jqx-expander-header-content-office {
                    margin-left: 0 !important;
                }

                .brtc-va-tools-sidebar .brtc-opt-model-selected-function-controls-area div.jqx-expander-header-expanded {
                    border: none;
                }

                .brtc-va-tools-sidebar .brtc-opt-model-selected-function-controls-area .jqx-expander-arrow {
                    margin-top: 6px !important;
                }

                .brtc-va-tools-sidebar .brtc-opt-model-selected-function-controls-area div.jqx-expander-content {
                    margin-bottom: 0;
                }
                    
                .brtc-opt-model-selected-function-controls-area .jqx-expander-arrow-top-office {
                    background-image: url(/css/plugins/aui-package/images/office-icon-right.png);
                }
                
                .brtc-opt-model-selected-function-controls-area .jqx-expander-arrow-bottom-office {
                    background-image: url(/css/plugins/aui-package/images/office-icon-down.png);
                }

                .brtc-opt-param-label-row .jqx-checkbox-default-office {
                    margin-right: 5px;
                    margin-left: 0;
                }

                .brtc-opt-objective-data {
                    width: 235px;
                    height: 26px;
                    font-family: Arial, helvetica, sans-serif;
                    border: 1px solid #d4d4d4;
                    line-height: 24px;
                    padding-left: 10px;
                    padding-right: 10px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    box-sizing: border-box;
                    color: rgba(0, 0, 0, .8);
                    cursor: default;
                    background-color: #fff;
                    opacity: .55;
                }

                .brtc-opt-function-select-button {
                    display: inline-block;
                    box-sizing: border-box;
                    text-align: center;
                    cursor: pointer;
                    float: left;
                    font-weight: normal;
                    font-size: 12px;

                    width: 55px;
                    height: 24px;

                    border: 1px solid #656eea;

                    background-color: #fff;
                    color: #656eea;
                }

                .brtc-opt-function-select-button.selected {
                    background-color: #656eea;
                    color: #FFFFFF;
                }

                .brtc-opt-function-select-button + .brtc-opt-function-select-button {
                    border-left: none;
                }
            </style>
        `);

        // TODO
        // this.createLabelControl($controls);
        // this.createDescriptionControl($controls);
        // this.createContinueControl($controls);
        this.createObjectiveControl($controls);
        this.createSelectedFunctionsControl($controls);
        this.createAdvancedSettingControl($controls);
    };

    OptSettingSideBar.prototype.createLabelControl = function ($parent) {
        var _this = this;
        var $area = $('<div></div>');
        $parent.append($area);

        var $title = $('<div style="margin-bottom: 3px;">Label</div>');
        $area.append($title);

        var $control = $('<input type="text"/>');
        $area.append($control);
        $control.jqxInput({
            placeHolder: 'Enter label',
            theme: Brightics.VA.Env.Theme,
            width: '100%',
            height: 25
        });
        $control.val(this.optModel.label);

        $control.on('change', function (event) {
            var args = event.args;
            if (args && args.type != null) {
                var value = $(this).val();
                _this.executeSetOptModelCommand({
                    label: value
                });
            }
        });
    };

    OptSettingSideBar.prototype.createDescriptionControl = function ($parent) {
        var _this = this;
        var $area = $('<div></div>');
        $parent.append($area);

        var $title = $('<div style="margin: 7px 0 3px 0;">Description</div>');
        $area.append($title);

        var $control = $('<input type="text"/>');
        $area.append($control);
        $control.jqxInput({
            placeHolder: 'Enter description',
            theme: Brightics.VA.Env.Theme,
            width: '100%',
            height: 25
        });
        $control.val(this.optModel.description);

        $control.on('change', function (event) {
            var args = event.args;
            if (args && args.type != null) {
                var value = $(this).val();
                _this.executeSetOptModelCommand({
                    description: value
                });
            }
        });
    };

    OptSettingSideBar.prototype.createContinueControl = function ($parent) {
        var _this = this;
        var $area = $('<div></div>');
        $parent.append($area);

        var controlStyle =
            'margin-top: 11px;';
        var $control = $(`<div style="${controlStyle}">Continue from saved model</div>`);
        $area.append($control);
        $control.jqxCheckBox({
            theme: Brightics.VA.Env.Theme
        });
        var useSavedModel = (this.optModel.options.useSavedModel === "true");
        $control.jqxCheckBox('val', useSavedModel);

        $control.on('change', function (event) {
            var checked = event.args.checked;
            var useSavedModel = (checked) ? ("true") : ("false");
            if (_this.optModel.options.useSavedModel != useSavedModel) {
                _this.optModel.options.useSavedModel = useSavedModel;

                _this.executeSetOptModelCommand({
                    options: _this.optModel.options
                }, { key: 'useSavedModel' });
            }
        });
    };

    OptSettingSideBar.prototype.createObjectiveControl = function ($parent) {
        var _this = this;
        var $area = $('<div></div>');
        $parent.append($area);

        var titleStyle = `
            font-weight: bold;
            height: 17px;
            line-height: 17px;
            margin-left: 0;
        `;
        var $title = $(`<div style="${titleStyle}">Objective</div>`);
        $area.append($title);

        var $controls = $('<div style="padding-top:8px;"></div>');
        $area.append($controls);

        this.createSelectObjectiveButton($controls);

        var controlsContainerStyle = `
            margin-top: 10px;
            margin-bottom: 10px;
        `;
        var $controlsContainer = $(`<div style="${controlsContainerStyle}"></div>`);
        $controls.append($controlsContainer);

        this.createFunctionLabelControl($controlsContainer);
        this.createTableLabelControl($controlsContainer);
        this.createRowControl($controlsContainer);
        this.createColumnControl($controlsContainer);
        this.createSenseControl($controlsContainer);

        $area.jqxExpander({
            theme: Brightics.VA.Env.Theme,
            arrowPosition: 'right',
            expanded: true
        });
        $area.on('expanded', function () {
            _this.$modelSideBar.find('.brtc-va-tools-sidebar-contents-wrapper').perfectScrollbar('update');
        });
        $area.on('collapsed', function () {
            _this.$modelSideBar.find('.brtc-va-tools-sidebar-contents-wrapper').perfectScrollbar('update');
        });
    };

    OptSettingSideBar.prototype.createSelectObjectiveButton = function ($parent) {
        var _this = this;
        var $button = $('<input type="button" value="+ Select Objective"/>');
        $parent.append($button);

        $button.jqxButton({
            theme: Brightics.VA.Env.Theme,
            width: '100%',
            height: 30
        });

        $button.on('click', this.openOptSelectObjectiveDialog.bind(_this));

        this.$selectObjectiveButton = $button;
    };

    OptSettingSideBar.prototype.openOptSelectObjectiveDialog = function (event) {
        var _this = this;
        new Brightics.VA.Core.Dialogs.OptSelectObjectiveDialog(_this, {
            functions: _this.getFunctionsInfo(),
            objective: $.extend(true, {}, _this.optModel.options.objective),
            close: function (dialogResult) {
                if (dialogResult.OK) {
                    _this.optModel.options.objective = dialogResult.objective;
                    _this.executeSetOptModelCommand({
                        options: _this.optModel.options
                    }, { key: 'objective' });
                }
            }
        });
    };

    OptSettingSideBar.prototype.appendObjectiveParamRow = function ($parent, label) {
        var labelRowStyle = `
            display: flex;
            margin-bottom: 5px;
        `;
        var $labelRow = $(`<div style="${labelRowStyle}"></div>`);
        $parent.append($labelRow);

        var labelStyle = `
            margin: 0 0 4px 0;
            width: 95px;
            line-height: 22px;
        `;
        var $label = $(`<div style="${labelStyle}">${label}</div>`);
        $labelRow.append($label);

        var $labelControl = $(`<div class="brtc-opt-objective-data"></div>`);
        $labelRow.append($labelControl);

        return $labelControl;
    };

    OptSettingSideBar.prototype.createFunctionLabelControl = function ($parent) {
        this.$controls.options.objective.functionLabel =
            this.appendObjectiveParamRow($parent, 'Function');
    };

    OptSettingSideBar.prototype.createTableLabelControl = function ($parent) {
        this.$controls.options.objective.tableLabel =
            this.appendObjectiveParamRow($parent, 'Table Name');
    };

    OptSettingSideBar.prototype.createRowControl = function ($parent) {
        this.$controls.options.objective.row =
            this.appendObjectiveParamRow($parent, 'Row Number');
    };

    OptSettingSideBar.prototype.createColumnControl = function ($parent) {
        this.$controls.options.objective.column =
            this.appendObjectiveParamRow($parent, 'Column Name');
    };

    OptSettingSideBar.prototype.createSenseControl = function ($parent) {
        this.$controls.options.objective.sense =
            this.appendObjectiveParamRow($parent, 'Sense');
    };

    OptSettingSideBar.prototype.createSelectedFunctionsControl = function ($parent) {
        var _this = this;
        var activeModelEditor = Studio.getEditorContainer().getActiveModelEditor();
        var contents = activeModelEditor.getEditorInput().getContents();

        this.$controls.optFunctions = {};
        if (this.$functionsArea) {
            this.$functionsArea.remove();
        }

        var $area = $('<div></div>');
        $parent.append($area);
        this.$functionsArea = $area;

        var titleStyle = `
            font-weight: bold;
            height: 17px;
            line-height: 17px;
            margin-left: 0;
        `;
        var $title = $(`<div style="${titleStyle}">Parameters</div>`);
        $area.append($title);

        var $controls = $(`
            <div class="brtc-opt-model-selected-function-controls-area" style="padding-top:8px;">
            </div>`);
        $area.append($controls);

        var optFunctions = this.optModel.optFunctions;
        for (var i = 0; i < optFunctions.length; i++) {
            if (optFunctions[i].optSelected === 'none') continue;
            var originalFuction = contents.getFnUnitById(optFunctions[i].fid);            
            if (!originalFuction || !originalFuction.display) continue;
            if (!Brightics.VA.Core.Functions.Library[originalFuction.func]) continue;

            (function (optFunctions, i) {
                var fid = optFunctions[i].fid;
                var functionControlWrapperStyle = `
                    margin-bottom: 0;
                `;
                var $functionControlWrapper = $(`<div style="${functionControlWrapperStyle}"></div>`);
                $functionControlWrapper.attr('fid', fid);
                $controls.append($functionControlWrapper);

                var $functionInfoRow = $('<div style="display:flex;"></div>');
                $functionControlWrapper.append($functionInfoRow);

                var originalFuction = contents.getFnUnitById(fid);                
                var functionLabel = originalFuction.display.label;
                var functionCategory = Brightics.VA.Core.Functions.Library[originalFuction.func].category;
                _this.createFunctionLabel($functionInfoRow, functionLabel, fid, functionCategory);
                _this.createFunctionSelectControl($functionInfoRow, optFunctions, i);

                var paramInfoWrapperStyle = `
                    padding-top: 10px;
                `;
                var $paramInfoWrapper = $(`<div style="${paramInfoWrapperStyle}"></div>`);
                $functionControlWrapper.append($paramInfoWrapper);
                var optParam = optFunctions[i].optParam;
                for (var param in optParam) {
                    (function (optParam, param) {
                        var paramControlStyle = `                            
                            margin-bottom: 10px;
                            margin-left: 18px;
                        `;
                        var $paramControl = $(`<div style="${paramControlStyle}"></div>`);
                        $paramControl.attr('fid', fid);
                        $paramInfoWrapper.append($paramControl);

                        var rowStyle = `
                            display: flex;
                            margin-bottom: 4px;
                        `;
                        var $paramLabelRow = $(`<div class="brtc-opt-param-label-row" style="${rowStyle}"></div>`);
                        $paramControl.append($paramLabelRow);

                        _this.createParamSelectControl($paramLabelRow, i, fid, param);
                        _this.createParamLabel($paramLabelRow, param);

                        var containerStyle = `
                            padding: 10px 10px 5px 10px;
                            background-color: #f2f2f2;
                        `
                        var $div = $(`<div style="${containerStyle}"></div>`);
                        $paramControl.append($div)

                        _this.createParamTypeControl($div, fid, param);
                        _this.createParamInitValueControl($div, fid, param);

                        if (optParam[param].type === 'DISCRETE_RANGE'
                            || optParam[param].type === 'CONTINUOUS') {
                            _this.createParamMinControl($div, fid, param);
                            _this.createParamMaxControl($div, fid, param);
                        } else {
                            // case: DISCRETE_SET_INTEGER, DISCRETE_SET_STRING
                            _this.createParamSetControl($div, fid, param);
                        }

                    })(optParam, param);
                }
                $functionControlWrapper.jqxExpander({
                    theme: Brightics.VA.Env.Theme,
                    arrowPosition: 'left',
                    expanded: false
                });
                $functionControlWrapper.on('expanded', function () {
                    _this.$modelSideBar.find('.brtc-va-tools-sidebar-contents-wrapper').perfectScrollbar('update');
                });
                $functionControlWrapper.on('collapsed', function () {
                    _this.$modelSideBar.find('.brtc-va-tools-sidebar-contents-wrapper').perfectScrollbar('update');
                });
            })(optFunctions, i);
        }

        $area.jqxExpander({
            theme: Brightics.VA.Env.Theme,
            arrowPosition: 'right',
            expanded: true
        });
        $area.on('expanded', function () {
            _this.$modelSideBar.find('.brtc-va-tools-sidebar-contents-wrapper').perfectScrollbar('update');
        });
        $area.on('collapsed', function () {
            _this.$modelSideBar.find('.brtc-va-tools-sidebar-contents-wrapper').perfectScrollbar('update');
        });
    };

    OptSettingSideBar.prototype.createFunctionLabel = function ($parent, label, fid, category) {
        category = category || 'io';

        var labelStyle = `
            box-sizing: border-box;
            width: 190px;
            height: 32px;
            line-height: 32px;
            font-size: 12px;            
            font-family: Arial, Dotum, Tahoma, sans-serif;
            font-weight: bold;            
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-right: 8px;
            margin-left: 16px;
            display: flex;
        `;

        var labelStyle2 = `       
            width: 223px;   
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        `;

        var $functionLabel = $(`
            <div class="brtc-va-fnunit-category-${category}" style="${labelStyle}">
                <div class="brtc-style-views-palette-fnunit-icon" style="margin-top: 5px;"></div>
                <div class="brtc-opt-function-label" style="${labelStyle2}"></div>
            </div>
        `);

        $functionLabel.find('.brtc-opt-function-label').text(label);
        $functionLabel.attr('title', label);
        $parent.append($functionLabel);
    };

    OptSettingSideBar.prototype.createFunctionSelectControl = function ($parent, optFunctions, i) {
        var _this = this;
        var functionSelectedStyle = `
            width: 110px;
            margin-top: 5px;
        `;

        var $optSelectedControl = $(`
            <div style="${functionSelectedStyle}">
                <button class="brtc-opt-function-select-button" value="true">Use</button>
                <button class="brtc-opt-function-select-button" value="false">Unuse</button>
            </div>`);
        $parent.append($optSelectedControl);

        var fid = optFunctions[i].fid;

        this.$controls.optFunctions[fid] =
            this.$controls.optFunctions[fid] ||
            {
                'optSelected': null,
                'optParam': {}
            };

        this.$controls.optFunctions[fid].optSelected = $optSelectedControl;

        $optSelectedControl.find('button').click(function (event) {
            var _optSelected = $(this).attr('value');

            var target = _this.optModel.optFunctions[i];
            if (target.optSelected != _optSelected) {
                target.optSelected = _optSelected;
                _this.executeSetOptModelCommand({
                    optFunctions: _this.optModel.optFunctions
                }, { fid: fid, key: 'optSelected' });
            }
            event.stopPropagation();
        });
    };

    OptSettingSideBar.prototype.createParamLabel = function ($parent, param) {
        var paramLabelStyle = `
            text-transform: capitalize;
            margin-right: 3px;
            padding-top: 2px;
            width: 100%;
        `;
        var $paramLabel = $(`<div style="${paramLabelStyle}"></div>`);
        $paramLabel.text(param.replace(/-/g, ' '));
        $parent.append($paramLabel);
    };

    OptSettingSideBar.prototype.createParamSelectControl = function ($parent, index, fid, param) {
        var _this = this;
        var paramSelectStyle = ``;
        var $paramSelectControl = $(`<div style="${paramSelectStyle}"></div>`);
        $parent.append($paramSelectControl);

        this.$controls.optFunctions[fid].optParam[param] =
            this.$controls.optFunctions[fid].optParam[param] ||
            {
                'optParamSelected': null
            };

        this.$controls.optFunctions[fid].optParam[param].optParamSelected =
            $paramSelectControl.jqxCheckBox({
                theme: Brightics.VA.Env.Theme
            });

        $paramSelectControl.click(function (event) {
            event.stopPropagation();
        });

        $paramSelectControl.on('change', function (event) {
            var checked = event.args.checked;
            var _paramSelected = (checked) ? ("true") : ("false");

            var target = _this.optModel.optFunctions[index].optParam[param];
            if (target.optParamSelected != _paramSelected) {
                target.optParamSelected = _paramSelected;
                _this.executeSetOptModelCommand({
                    optFunctions: _this.optModel.optFunctions
                }, { fid: fid, param: param, key: 'optParamSelected' });
            }
        });
    };

    OptSettingSideBar.prototype.appendFunctionParamRow = function ($parent, label, placeholder, disabled) {
        var $div = $(`<div style="display: flex; margin-bottom: 5px;"></div>`);
        $parent.append($div);

        var labelStyle = `
            height: 25px;
            line-height: 25px;
            width: 75px;
        `;
        var $label = $(`<div style="${labelStyle}">${label}</div>`);
        $div.append($label);

        var $control = $(`<input type="text"/>`);
        $div.append($control);

        $control.jqxInput({
            placeHolder: placeholder,
            theme: Brightics.VA.Env.Theme,
            width: 214,
            height: 25,
            disabled: disabled
        });
        return $control;
    };

    OptSettingSideBar.prototype.createParamTypeControl = function ($parent, fid, param) {
        var $control = this.appendFunctionParamRow($parent, 'Type', 'Enter type', true);
        this.$controls.optFunctions[fid].optParam[param].type = $control;
    };

    OptSettingSideBar.prototype.createParamInitValueControl = function ($parent, fid, param) {
        var _this = this;
        var $control = this.appendFunctionParamRow($parent, 'Initial Value', 'Enter initial value');
        $control.on('change', function (event) {
            var args = event.args;
            if (args && args.type != null) {
                var value = $(this).val();
                for (var i in _this.optModel.optFunctions) {
                    if (_this.optModel.optFunctions[i].fid === fid) {
                        _this.optModel.optFunctions[i].optParam[param].value = value;
                        break;
                    }
                }
                _this.executeSetOptModelCommand({
                    optFunctions: _this.optModel.optFunctions
                }, { fid: fid, param: param, key: 'value' });
            }
        });

        this.$controls.optFunctions[fid].optParam[param].value = $control;
    };

    OptSettingSideBar.prototype.createParamMinControl = function ($parent, fid, param) {
        var _this = this;
        var $control = this.appendFunctionParamRow($parent, 'Min', 'Enter min');
        $control.on('change', function (event) {
            var args = event.args;
            if (args && args.type != null) {
                var value = $(this).val();
                for (var i in _this.optModel.optFunctions) {
                    if (_this.optModel.optFunctions[i].fid === fid) {
                        _this.optModel.optFunctions[i].optParam[param].min = value;
                        break;
                    }
                }
                _this.executeSetOptModelCommand({
                    optFunctions: _this.optModel.optFunctions
                }, { fid: fid, param: param, key: 'min' });
            }
        });

        this.$controls.optFunctions[fid].optParam[param].min = $control;
    };

    OptSettingSideBar.prototype.createParamMaxControl = function ($parent, fid, param) {
        var _this = this;
        var $control = this.appendFunctionParamRow($parent, 'Max', 'Enter max');
        $control.on('change', function (event) {
            var args = event.args;
            if (args && args.type != null) {
                var value = $(this).val();
                for (var i in _this.optModel.optFunctions) {
                    if (_this.optModel.optFunctions[i].fid === fid) {
                        _this.optModel.optFunctions[i].optParam[param].max = value;
                        break;
                    }
                }
                _this.executeSetOptModelCommand({
                    optFunctions: _this.optModel.optFunctions
                }, { fid: fid, param: param, key: 'max' });
            }
        });

        this.$controls.optFunctions[fid].optParam[param].max = $control;
    };

    OptSettingSideBar.prototype.createParamSetControl = function ($parent, fid, param) {
        var _this = this;
        var $control = this.appendFunctionParamRow($parent, 'Value Set', 'Enter value set');
        $control.on('change', function (event) {
            var args = event.args;
            if (args && args.type != null) {
                var value = $(this).val();
                var set = value.split(',').map(function (a) {
                    return a.replace(/ /g, '')
                });
                for (var i in _this.optModel.optFunctions) {
                    if (_this.optModel.optFunctions[i].fid === fid) {
                        _this.optModel.optFunctions[i].optParam[param].set = set;
                        break;
                    }
                }
                _this.executeSetOptModelCommand({
                    optFunctions: _this.optModel.optFunctions
                }, { fid: fid, param: param, key: 'set' });
            }
        });

        this.$controls.optFunctions[fid].optParam[param].set = $control;
    };

    OptSettingSideBar.prototype.createAdvancedSettingControl = function ($parent) {
        var _this = this;
        var $area = $('<div></div>');
        $parent.append($area);

        var titleStyle = `
            font-weight: bold;
            height: 17px;
            line-height: 17px;
            margin-left: 0;
        `;
        var $title = $(`<div style="${titleStyle}">Advanced Settings</div>`);
        $area.append($title);

        var $controls = $('<div style="padding-top:8px; margin-bottom: 80px;"></div>');
        $area.append($controls);

        this.createMethodControl($controls);
        this.createMaxEvaluationsControl($controls);

        $area.jqxExpander({
            theme: Brightics.VA.Env.Theme,
            arrowPosition: 'right',
            expanded: false
        });
        $area.on('expanded', function () {
            _this.$modelSideBar.find('.brtc-va-tools-sidebar-contents-wrapper').perfectScrollbar('update');
        });
        $area.on('collapsed', function () {
            _this.$modelSideBar.find('.brtc-va-tools-sidebar-contents-wrapper').perfectScrollbar('update');
        });
    };

    OptSettingSideBar.prototype.createMethodControl = function ($parent) {
        var _this = this;
        $parent.append('<div style="margin: 3px 0 4px 0;">Method</div>');
        var $methodControl = $('<div style="width:"></div>');
        $parent.append($methodControl);

        var source = [
            { 'text': 'Soga', 'value': 'SOGA' },
            { 'text': 'Coliny Cobyla', 'value': 'COLINY_COBYLA' },
            { 'text': 'Coliny Direct', 'value': 'COLINY_DIRECT' },
            { 'text': 'Conmin MFD', 'value': 'CONMIN_MFD' },            
            { 'text': 'Mesh Adaptive Search', 'value': 'MESH_ADAPTIVE_SEARCH' }
        ];

        this.$controls.options.method = $methodControl.jqxDropDownList({
            theme: Brightics.VA.Env.Theme,
            source: source,
            checkboxes: false,
            width: 325,
            height: 25,
            openDelay: 0,
            closeDelay: 0,
            autoDropDownHeight: true,
            displayMember: 'text',
            valueMember: 'value'
        });

        $methodControl.on('select', function (event) {
            var args = event.args;
            if (args) {
                var item = args.item;
                var value = item.value;
                if (args.type === 'mouse' || args.type === 'keyboard') {
                    _this.optModel.options.method = value;
                    _this.executeSetOptModelCommand({
                        options: _this.optModel.options
                    }, { key: 'method' });
                }
            }
        });
    };

    OptSettingSideBar.prototype.createMaxEvaluationsControl = function ($parent) {
        var _this = this;
        $parent.append('<div style="margin: 10px 0 4px 0;">Max Evaluations</div>');
        var $maxEvaluationsControl = $('<div></div>');
        $parent.append($maxEvaluationsControl);

        var widgetOptions = {
            numberType: 'int',
            min: 1,
            max: 9999,
            minus: false,
            placeholder: 'Enter max evaluations'
        };

        this.$controls.options.maxEvaluations =
            new Brightics.VA.Core.Editors.Sheet.Controls.NumericInput(
                $maxEvaluationsControl, widgetOptions);

        this.$controls.options.maxEvaluations.onChange(function (value) {
            _this.optModel.options.maxEvaluations = value;
            _this.executeSetOptModelCommand({
                options: _this.optModel.options
            }, { key: 'maxEvaluations' });
        });
    };

    OptSettingSideBar.prototype.render = function (optId) {
        var activeModelEditor = Studio.getEditorContainer().getActiveModelEditor();
        var pid = activeModelEditor.getEditorInput().getProjectId();
        var mid = activeModelEditor.getEditorInput().getFileId();

        if (!optId) {
            var models = Brightics.OptModelManager.getOptModels(pid, mid);
            if (models[0]) {
                optId = models[0]['optId'];
            }
        }

        this.optModel = Brightics.OptModelManager.getOptModel(pid, mid, optId);
        if (this.optModel) {
            this.resetDropDownList();
            this.renderOptModelDropDownList(optId);
            this.renderDetailViewControls();
            this.renderValidation();
        }
    };

    OptSettingSideBar.prototype.renderOptModelDropDownList = function (optId) {
        this.$dropdownList.val(optId);
    };

    OptSettingSideBar.prototype.renderDetailViewControls = function () {
        var optModel = this.optModel;
        this.$detailViewControls.attr('opt-id', optModel['optId']);

        this.renderObjectiveControl();
        this.renderSelectedFunctionsControl();
        this.renderAdvancedSettingControl();
    };

    OptSettingSideBar.prototype.renderObjectiveControl = function () {
        this.renderFunctionLabelControl();
        this.renderTableLabelControl();
        this.renderRowControl();
        this.renderColumnControl();
        this.renderSenseControl();
    };

    OptSettingSideBar.prototype.renderObjectiveParamRow = function ($control, data, placeholder) {
        if (data) {
            $control.text(data);
            $control.attr('title', data);
        } else {
            $control.text(placeholder);
        }
    };

    OptSettingSideBar.prototype.renderFunctionLabelControl = function () {
        var fid = this.optModel.options.objective.fid;
        var activeModelEditor = Studio.getEditorContainer().getActiveModelEditor();
        var contents = activeModelEditor.getEditorInput().getContents();
        var fnUnit = contents.getFnUnitById(fid);
        var functionLabel = (fnUnit) ? (fnUnit.display.label) : ("");
        var $control = this.$controls.options.objective.functionLabel;
        this.renderObjectiveParamRow($control, functionLabel, '');
    };

    OptSettingSideBar.prototype.renderTableLabelControl = function () {
        var fid = this.optModel.options.objective.fid;
        var tableId = this.optModel.options.objective.tableName;
        var activeModelEditor = Studio.getEditorContainer().getActiveModelEditor();
        var contents = activeModelEditor.getEditorInput().getContents();
        var fnUnit = contents.getFnUnitById(fid);
        var functionLabel = (fnUnit) ? (fnUnit.display.label) : ("");
        var tableLabel;
        if (fnUnit) {
            var outData = fnUnit['outData'];
            for (var i in outData) {
                if (outData[i] === tableId) {
                    tableLabel = functionLabel + '-' + (Number(i) + 1);
                    break;
                }
            }
        }
        var $control = this.$controls.options.objective.tableLabel;
        this.renderObjectiveParamRow($control, tableLabel, '');
    };

    OptSettingSideBar.prototype.renderRowControl = function () {
        var data = this.optModel.options.objective.row;
        var $control = this.$controls.options.objective.row;
        this.renderObjectiveParamRow($control, data, '');
    };

    OptSettingSideBar.prototype.renderColumnControl = function () {
        var data = this.optModel.options.objective.column;
        var $control = this.$controls.options.objective.column;
        this.renderObjectiveParamRow($control, data, '');
    };

    OptSettingSideBar.prototype.renderSenseControl = function () {
        var sense = this.optModel.options.objective.sense;
        var data = sense.charAt(0).toUpperCase() + sense.slice(1);
        var $control = this.$controls.options.objective.sense;
        this.renderObjectiveParamRow($control, data, '');
    };

    OptSettingSideBar.prototype.renderSelectedFunctionsControl = function () {
        var _this = this;
        var optFunctions = this.optModel.optFunctions;
        for (var i = 0; i < optFunctions.length; i++) {
            if (optFunctions[i].optSelected === 'none') continue;
            (function (optFunctions, i) {
                var optFunction = optFunctions[i];
                _this.renderFunctionSelectControl(optFunction);

                var optParam = optFunction.optParam;
                for (var param in optParam) {
                    (function (param) {
                        _this.renderParamSelectControl(optFunction, param);
                        _this.renderParamTypeControl(optFunction, param);
                        _this.renderParamInitValueControl(optFunction, param);

                        var type = optFunction.optParam[param].type;
                        if (type === 'DISCRETE_RANGE' || type === 'CONTINUOUS') {
                            _this.renderParamMinControl(optFunction, param);
                            _this.renderParamMaxControl(optFunction, param);
                        } else {
                            // type == 'DISCRETE_SET_INTEGER', 'DISCRETE_SET_STRING'
                            _this.renderParamSetControl(optFunction, param);
                        }
                    })(param);
                }
            })(optFunctions, i);
        }
    };

    OptSettingSideBar.prototype.renderFunctionSelectControl = function (optFunction) {
        var fid = optFunction.fid;
        var data = optFunction.optSelected;

        if (this.$controls.optFunctions[fid]) {
            var $control = this.$controls.optFunctions[fid].optSelected;
            $control.find('button').removeClass('selected');
            $control.find(`button[value=${data}]`).addClass('selected');
        }
    };

    OptSettingSideBar.prototype.renderParamSelectControl = function (optFunction, param) {
        var fid = optFunction.fid;
        var data = (optFunction.optParam[param].optParamSelected === "true");

        if (this.$controls.optFunctions[fid]) {
            var $control = this.$controls.optFunctions[fid].optParam[param].optParamSelected;
            $control.jqxCheckBox('val', data);
        }
    };

    OptSettingSideBar.prototype.renderFunctionParamControl = function (fid, param, key, data) {
        if (this.$controls.optFunctions[fid]) {
            var $control = this.$controls.optFunctions[fid].optParam[param][key];
            $control.val(data);
        }
    };

    OptSettingSideBar.prototype.renderParamTypeControl = function (optFunction, param) {
        var fid = optFunction.fid;
        var data = optFunction.optParam[param].type.replace(/_/g, ' ');
        this.renderFunctionParamControl(fid, param, 'type', data);
    };

    OptSettingSideBar.prototype.renderParamInitValueControl = function (optFunction, param) {
        var fid = optFunction.fid;
        var data = optFunction.optParam[param].value;
        this.renderFunctionParamControl(fid, param, 'value', data);
    };

    OptSettingSideBar.prototype.renderParamMinControl = function (optFunction, param) {
        var fid = optFunction.fid;
        var data = optFunction.optParam[param].min;
        this.renderFunctionParamControl(fid, param, 'min', data);
    };

    OptSettingSideBar.prototype.renderParamMaxControl = function (optFunction, param) {
        var fid = optFunction.fid;
        var data = optFunction.optParam[param].max;
        this.renderFunctionParamControl(fid, param, 'max', data);
    };

    OptSettingSideBar.prototype.renderParamSetControl = function (optFunction, param) {
        var fid = optFunction.fid;
        var setValue = optFunction.optParam[param].set;
        var data = ($.isArray(setValue)) ? (setValue.toString()) : (setValue);
        this.renderFunctionParamControl(fid, param, 'set', data);
    };

    OptSettingSideBar.prototype.renderAdvancedSettingControl = function () {
        this.renderMethodControl();
        this.renderMaxEvaluationsControl();
    };

    OptSettingSideBar.prototype.renderMethodControl = function () {
        var data = this.optModel.options.method;
        this.$controls.options.method.val(data);
    };

    OptSettingSideBar.prototype.renderMaxEvaluationsControl = function () {
        var data = this.optModel.options.maxEvaluations;
        this.$controls.options.maxEvaluations.setValue(data);
    };

    OptSettingSideBar.prototype.renderValidation = function () {
        var optModel = this.optModel;
        this.renderObjectiveValidation(optModel);
        this.renderOptFunctionsValidation(optModel);
    };

    OptSettingSideBar.prototype.renderObjectiveValidation = function (optModel) {
        var isValidObject = Brightics.OptModelManager.isValidObjective(optModel);
        var borderColor = '#d4d4d4';
        if (!isValidObject) {
            borderColor = '#ea3539';
        }
        this.$selectObjectiveButton.css('border-color', borderColor);
    };

    OptSettingSideBar.prototype.renderOptFunctionsValidation = function () {
        for (var fid in this.$controls.optFunctions) {
            for (var key in this.$controls.optFunctions[fid].optParam) {
                for (var userInput in this.$controls.optFunctions[fid].optParam[key]) {
                    var $control = this.$controls.optFunctions[fid].optParam[key][userInput];
                    if ($control) {
                        if ($control.val()) {
                            // hide validation
                            $control.css('border-color', '#d4d4d4');
                        } else {
                            $control.css('border-color', '#ea3539');
                            // show validation
                        }
                    }
                }
            }
        }
    };

    OptSettingSideBar.prototype.getFunctionsInfo = function () {
        var activeModelEditor = Studio.getEditorContainer().getActiveModelEditor();
        var contents = activeModelEditor.getEditorInput().getContents();

        var optFunctions = this.optModel.optFunctions;
        var functionsInfo = [];
        for (var i = 0; i < optFunctions.length; i++) {
            var fid = optFunctions[i].fid;
            var fnUnit = contents.getFnUnitById(fid);
            functionsInfo.push($.extend(true, {}, fnUnit));
        }
        return functionsInfo;
    };

    OptSettingSideBar.prototype.resetDropDownList = function () {
        this.$dropdownList.jqxDropDownList('clear');
        this.$dropdownList.jqxDropDownList('clearSelection');
        this.$dropdownList.jqxDropDownList({ source: this._getDropDownListSource() });
    };

    OptSettingSideBar.prototype.handleCommand = function (command) {
        if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.GoHistoryCommand) {
            for (var i in command.options.commands) {
                this.handleCommand(command.options.commands[i]);
            }
        }
        else if (command instanceof Brightics.VA.Core.CompoundCommand) this.handleCompoundCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.NewOptModelCommand) this.handleNewOptModelCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.SetOptModelCommand) this.handleSetOptModelCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.RemoveOptModelCommand) this.handleRemoveOptModelCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.RenameFnUnitCommand) this.handleRenameFnUnitCommand(command);
    };

    OptSettingSideBar.prototype.handleCompoundCommand = function (command) {
        var i;
        if (command.event.type == 'REDO' || command.event.type == 'EXECUTE') {
            for (i in command.commandList) {
                this.handleCommand(command.commandList[i]);
            }
        } else if (command.event.type == 'UNDO') {
            for (i = command.commandList.length - 1; i > -1; i--) {
                this.handleCommand(command.commandList[i]);
            }
        }
    };

    OptSettingSideBar.prototype.handleNewOptModelCommand = function (command) {
        if (command.event.type === 'UNDO') {
            this.createDetailView();
            this.render();
        } else {
            this.show();

            var optId = command.options.optModel['optId'];
            this.createDetailView(optId);
            this.render(optId);
        }
    };

    OptSettingSideBar.prototype.handleSetOptModelCommand = function (command) {
        this.show();

        var optId = command.options.optId;
        if (this.optModel.optId != optId) {
            this.createDetailView(optId);
        }
        this.render(optId);
    };

    OptSettingSideBar.prototype.handleRemoveOptModelCommand = function (command) {
        if (command.event.type === 'UNDO') {
            this.show();

            var optId = command.options.optId;
            this.createDetailView(optId);
            this.render(optId);
        } else {
            this.createDetailView();
            this.render();
        }
    };

    OptSettingSideBar.prototype.handleRenameFnUnitCommand = function (command) {
        var targetFid = command.options.fid;
        var activeModelEditor = Studio.getEditorContainer().getActiveModelEditor();
        var contents = activeModelEditor.getActiveModel();
        var fnUnit = contents.getFnUnitById(targetFid);
        var functionLabel = fnUnit.display.label;

        if (this.$controls && this.$controls.optFunctions[targetFid]) {
            var $target = this.$controls.optFunctions[targetFid].optSelected.prev();
            $target.attr('title', functionLabel);
            $target.find('.brtc-opt-function-label').text(functionLabel);
        }

        if (this.optModel && this.optModel.options.objective.fid == targetFid) {
            this.renderFunctionLabelControl();
            this.renderTableLabelControl();
        }
    };

    OptSettingSideBar.prototype.executeSetOptModelCommand = function (options, target) {
        var activeModelEditor = Studio.getEditorContainer().getActiveModelEditor();
        var pid = activeModelEditor.getEditorInput().getProjectId();
        var mid = activeModelEditor.getEditorInput().getFileId();
        var optId = this.$dropdownList.val();

        if (optId && Brightics.OptModelManager.getOptModel(pid, mid, optId)) {
            var commandManager = activeModelEditor.getCommandManager();
            var command = Brightics.OptModelManager.createSetOptModelCommand(pid, mid, optId, options, target);
            commandManager.execute(command);
        }
    };

    OptSettingSideBar.prototype.initPreferenceTarget = function () {
        this.preferenceTarget['scroll'] = this.$modelSideBar.find('.brtc-va-tools-sidebar-contents-wrapper');
    };

    OptSettingSideBar.prototype.destroy = function () {
        //Brightics.VA.Core.Utils.WidgetUtils.destroyJqxControl(this.propertyControls[target])
    };

    Brightics.VA.Core.Tools.SideBar.OptSettingSideBar = OptSettingSideBar;

}).call(this);