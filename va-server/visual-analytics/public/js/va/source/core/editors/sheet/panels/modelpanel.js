/**
 * Created by gy84.bae on 2016-02-01.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    const MODEL_NAME = '_repr_brtc_';

    function ModelPanel(parentId, options) {
        Brightics.VA.Core.Editors.Sheet.Panels.BasePanel.call(this, parentId, options);
    }

    ModelPanel.prototype = Object.create(Brightics.VA.Core.Editors.Sheet.Panels.BasePanel.prototype);
    ModelPanel.prototype.constructor = ModelPanel;

    ModelPanel.prototype.init = function () {
        this.$mainControl.attr('type', this.options.type);

        this.model = {};
    };

    ModelPanel.prototype.createTopAreaControls = function ($parent) {
        this.$header = $('' +
            '<div class="brtc-va-editors-sheet-panels-basepanel-header">' +
            '   <div class="brtc-va-editors-sheet-worksheet-selector"></div>' +
            '</div>' +
            '');

        this.$selector = this.$header.find('.brtc-va-editors-sheet-worksheet-selector');
        $parent.append(this.$header);

        this.createTopAreaHeaderToolbar();

        return this.$header;
    };

    ModelPanel.prototype.createSelector = function (model) {
        var _this = this;

        this.$selector.jqxDropDownList({
            theme: Brightics.VA.Env.Theme,
            source: model[MODEL_NAME] ? ['MODEL', 'JSON'] : ['JSON'],
            width: 120,
            autoDropDownHeight: true,
            dropDownWidth: 120,
            selectedIndex: 0
        });
        this.$selector.on('change', function (event) {
            var type = $(this).val();

            if (type === 'JSON') {
                _this.showJson();
                _this.renderJson();
            } else {
                _this.showModel();
                _this.renderModel();
            }

            _this.$contentsArea.perfectScrollbar('update');
        });
    };

    ModelPanel.prototype.createControls = function () {
        this.$mainControl = $('<div class="brtc-va-editors-sheet-panels-basepanel brtc-style-display-flex brtc-style-flex-direction-column"/>');
        this.$parent.append(this.$mainControl);

        this.createTopArea();
        this.createContentsArea();
        this.createBottomArea();

        if (this.$topArea) {
            this.createTopAreaControls(this.$topArea);
        }
        if (this.$bottomArea) {
            this.createBottomAreaControls(this.$bottomArea);
        }
        if (this.$contentsArea) {
            this.createContentsAreaControls(this.$contentsArea);
            if (this.$contentsArea.hasClass('brtc-va-editors-sheet-panels-propertiespanel-contents-area')) {
                this.$contentsArea.perfectScrollbar();
            }
        }
    };

    ModelPanel.prototype.createTopAreaHeaderToolbar = function ($parent) {
        var $toolbar = $('' +
            '<div class="brtc-va-editors-sheet-panels-datapanel-toolbar"/>');
        this.$header.append($toolbar);

        this.createPopupToolItem($toolbar);
        this.createMinMaxToolItem($toolbar);
    };

    ModelPanel.prototype.createPopupToolItem = function ($toolbar) {
        var _this = this;
        var $popup = $('<div class="brtc-va-editors-sheet-panels-datapanel-toolitem brtc-va-editors-sheet-panels-datapanel-toolitem-popup" title="Pop up Chart" target="popupChart"></div>');
        $toolbar.append($popup);

        $popup.click(
            function () {
                var modelEditor = Brightics.VA.Core.Utils.WidgetUtils.getModelEditorRef(_this.$mainControl);
                var param = {
                    user: Brightics.VA.Env.Session.userId,
                    pid: modelEditor.options.editorInput.getProjectId(),
                    mid: _this.options.fnUnit.parent().mid,
                    fid: _this.options.fnUnit.fid,
                    tids: _this.FnUnitUtils.getModel(_this.options.fnUnit, _this.options.panelType),
                    offsetArr: [0],
                    limitArr: [1000]
                };

                var params = $.map(param, function (value, key) {
                    return key + '=' + value;
                }).join('&');
                window.open('popupmodel?' + params, 'popupModel');
            }
        );
    };

    ModelPanel.prototype.registerCommandListener = function () {
        var _this = this;
        this.commandListener = function (command) {
            if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.DisconnectFnUnitCommand || command instanceof Brightics.VA.Core.Editors.Diagram.Commands.ConnectFnUnitCommand) {
                if (_this.options.fnUnit.fid === command.options[TARGET_FID]) {
                    _this.handleConnectionCommand(command);
                }
            } else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.ReconnectFnUnitCommand) {
                if (_this.options.fnUnit.fid === command.options[TARGET_FID] || _this.options.fnUnit.fid === command.old[TARGET_FID]) {
                    _this.handleConnectionCommand(command);
                }
            } else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.ChangeOutTableCommand) {
                if (_this.options.fnUnit.fid === command.options.fnUnit.fid) {
                    _this.handleOutTableCommand(command);
                }
            } else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.NewOutTableCommand) {
                if (_this.options.fnUnit.fid === command.options.fnUnit.fid) {
                    _this.handleNewOutTableCommand(command);
                }
            }
            else if (command instanceof Brightics.VA.Core.CompoundCommand) {
                $.each(command.commandList, function (index, com) {
                    if (com instanceof Brightics.VA.Core.Editors.Diagram.Commands.DisconnectFnUnitCommand || com instanceof Brightics.VA.Core.Editors.Diagram.Commands.ConnectFnUnitCommand) {
                        if (_this.options.fnUnit.fid === com.options[TARGET_FID]) {
                            _this.handleConnectionCommand(com);
                        }
                    } else if (com instanceof Brightics.VA.Core.Editors.Diagram.Commands.ReconnectFnUnitCommand) {
                        if (_this.options.fnUnit.fid === com.options[TARGET_FID] || _this.options.fnUnit.fid === com.old[TARGET_FID]) {
                            _this.handleConnectionCommand(com);
                        }
                    } else if (com instanceof Brightics.VA.Core.Editors.Diagram.Commands.ChangeOutTableCommand) {
                        if (_this.options.fnUnit.fid === com.options.fnUnit.fid) {
                            _this.handleOutTableCommand(com);
                        }
                    }
                    else if (com instanceof Brightics.VA.Core.Editors.Diagram.Commands.ChangeIntableCommand) {
                        if (_this.options.fnUnit.fid === com.options.fnUnit.fid) {
                            _this.handleConnectionCommand(com);
                        }
                    }
                    else if (com instanceof Brightics.VA.Core.Editors.Diagram.Commands.NewOutTableCommand) {
                        if (_this.options.fnUnit.fid === com.options.fnUnit.fid) {
                            _this.handleNewOutTableCommand(com);
                        }
                    }
                });
            }
        };
        this.options.modelEditor.addCommandListener(this.commandListener);
    };

    ModelPanel.prototype.handleNewOutTableCommand = function ($parent) {
    };
    ModelPanel.prototype.handleConnectionCommand = function ($parent) {
    };
    ModelPanel.prototype.handleOutTableCommand = function ($parent) {
    };

    ModelPanel.prototype.createContentsAreaControls = function ($parent) {
        var _this = this;

        $parent.addClass('brtc-style-flex-1');

        this.createLayout($parent);

        var doneCallback = function (model) {
            _this.model = model;
            _this.createSelector(_this.model);
            _this.reset();
            _this.render();
        };
        var failCallback = function () {
            _this.showFail();
            _this.renderFail('No Model');
        };

        var tid = this.FnUnitUtils.getModel(this.options.fnUnit, this.options.panelType);
        this.options.dataProxy.requestDataForce(tid, doneCallback, failCallback);
    };

    ModelPanel.prototype.createLayout = function ($parent) {
        this.$jsonContainer = $('<div class="brtc-va-editors-sheet-panels-basepanel-json"></div>');
        this.$modelContainer = $('<div class="brtc-va-editors-sheet-panels-basepanel-model"></div>');
        this.$failContainer = $('<div class="brtc-va-editors-sheet-panels-basepanel-fail"></div>');

        $parent.append(this.$jsonContainer).append(this.$modelContainer).append(this.$failContainer);

        this.$contentsArea.perfectScrollbar();
    };

    ModelPanel.prototype.getRenderType = function () {
        return this.$selector.val();
    };

    ModelPanel.prototype.reset = function () {
        this.renderedJson = false;
        this.renderedModel = false;
    };

    ModelPanel.prototype.showJson = function () {
        this.$jsonContainer.show();
        this.$modelContainer.hide();
        this.$failContainer.hide();
    };

    ModelPanel.prototype.showModel = function () {
        this.$jsonContainer.hide();
        this.$modelContainer.show();
        this.$failContainer.hide();
    };

    ModelPanel.prototype.showFail = function () {
        this.$jsonContainer.hide();
        this.$modelContainer.hide();
        this.$failContainer.show();
    };

    ModelPanel.prototype.render = function () {
        var selector = this.getRenderType();

        if (selector === 'JSON') {
            this.showJson();
            this.renderJson();
        } else {
            this.showModel();
            this.renderModel();
        }
    };

    ModelPanel.prototype.destroy = function () {
        this.$selector.jqxDropDownList('destroy');
        Brightics.VA.Core.Editors.Sheet.Panels.BasePanel.prototype.destroy.call(this);
    };

    ModelPanel.prototype.renderJson = function () {
        if (this.renderedJson) return;

        this.$jsonWrapper = $('' +
            '<div class="brtc-va-editors-sheet-panels-modelpanel-json">' +
            '   <pre></pre>' +
            '</div>');
        this.$jsonContainer.append(this.$jsonWrapper);

        this.$jsonWrapper.find('pre').val(this.model)
        this.$jsonWrapper.find('pre').jsonViewer(this.model);

        this.$contentsArea.perfectScrollbar('update');

        this.renderedJson = true;
    };

    ModelPanel.prototype.renderModel = function () {
        if (this.renderedModel) return;

        if (typeof this.model[MODEL_NAME] === 'undefined') return;
        this[MODEL_NAME] = this.model[MODEL_NAME];
        this.resources = this[MODEL_NAME].resources;

        this.$modelWrapper = $('<div class="brtc-va-editors-sheet-panels-modelpanel-model"></div>');
        this.$modelContainer.append(this.$modelWrapper);

        for (var i in this[MODEL_NAME].contents) {
            var content = this[MODEL_NAME].contents[i];
            this.addContents(this.$modelWrapper, content);
        }

        this.$contentsArea.perfectScrollbar('update');

        this.renderedModel = true;
    };

    ModelPanel.prototype.addContents = function ($parent, content) {
        var type = content.type;

        if (type === 'md') {
            var mdText = '';
            var textArr = content.text.split('\n');

            for (var i in textArr) {
                var text = textArr[i].trim();
                if (_.isEmpty(text)) text = '\n';

                mdText += text + '\n';
            }
            let $content = Brightics.VA.Core.Utils.RenderUtils[type]($parent, mdText);
            this.makeChart($content);
        } else {
            let $content = Brightics.VA.Core.Utils.RenderUtils[type]($parent, content.text);
            this.makeChart($content);
        }


    };

    ModelPanel.prototype.makeChart = function ($target) {
        if (!this.resources || !this.resources.chart) return;

        var chartAreaList = $target.find('.brightics-chart');

        for (var i in chartAreaList) {
            var $chartArea = $(chartAreaList[i]);

            var chartId = $chartArea.attr('id');

            var chartOption = this.getChartOption(chartId);

            Brightics.VA.Core.Utils.RenderUtils.chart($chartArea, chartOption);
        }
    };

    ModelPanel.prototype.getChartOption = function (chartId) {
        var option = {};

        for (var i in this.resources.charts) {
            if (this.resources.charts[i].id === chartId) {
                option = this.resources.charts[i].options;
                option.source = {};
                option.source.dataType = 'local';
                option.source.localData = [{
                    dataType: 'rawdata',
                    columns: this.resources.charts[i].dataSource.columns,
                    data: this.resources.charts[i].dataSource.data
                }];

                return option;
            }
        }
    };

    ModelPanel.prototype.renderFail = function (message) {
        var $fail = $('<div class="brtc-va-editors-sheet-panels-basepanel-fail"><h3></h3></div>');
        this.$failContainer.append($fail);

        $fail.addClass('brtc-style-full').addClass('brtc-style-flex-center');
        $fail.find('h3').text(message);
    };

    Brightics.VA.Core.Editors.Sheet.Panels.ModelPanel = ModelPanel;
}).call(this);
