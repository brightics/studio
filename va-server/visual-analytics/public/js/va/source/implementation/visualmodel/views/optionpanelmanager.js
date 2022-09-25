/**
 * Created by ng1123.kim on 2016-05-04.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function OptionPanelManager(parentId, options) {
        this.parentId = parentId;
        this.options = options;

        this.retrieveParent();
        this.createControls();

        this.resourceManager = Studio.getResourceManager();
    }

    OptionPanelManager.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    OptionPanelManager.prototype.createControls = function () {
        this.$mainControl = $('<div class="brtc-va-views-optionpanel brtc-style-tab-contents">' +
            '   <div class="brtc-va-views-optionpanel-area brtc-style-tab-contents-area brtc-style-s-sidebar-background"></div>' +
            '</div>');
        this.$parent.append(this.$mainControl);

        this.createViewer(this.$mainControl.find('.brtc-va-views-optionpanel-area'));

        this._createOptionPanel();
        this.selectionChanged([]);
    };

    OptionPanelManager.prototype.createViewer = function ($parent) {
        var _this = this;
        this.$objectControl = $('' +
            '<div>' +
            '   <div class="brtc-va-controls-options-viewer brtc-style-option-viewer brtc-style-s-option-viewer" viewer-type="object" />' +
            '</div>');
        $parent.append(this.$objectControl);

        var title = 'scatter', chartType = 'scatter';
        var $btnAddChart = $('' +
            '<div class="brtc-va-editor-toolitem brtc-style-editor-toolitem brtc-style-editor-toolitem-large brtc-style-s-editor-toolitem brtc-style-s-background-image-none brtc-style-display-flex" tool-type="multi-selector">' +
            '   <div class="brtc-va-editor-toolitem brtc-style-editor-toolitem brtc-style-s-editor-toolitem brtc-style-margin-0 brtc-style-s-background-image-none" title="Add ' + title + '" item-type="add-chart">' +
            '       <div class="brtc-va-editor-toolitem-chart-type" chart-type="' + chartType + '"></div>' +
            '   </div>' +
            '   <div class="brtc-va-editor-toolitem-selector-parent brtc-style-col-12 brtc-style-display-flex brtc-style-align-items-center brtc-style-justify-content-center brtc-style-text-align-end brtc-style-cursor-pointer">' +
            '      <span class="brtc-style-s-font-size-11 brtc-style-s-font-faminly-arial">' + title + '</span>' +
            '      <span class="brtc-style-cursor-pointer brtc-style-editor-toolitem-selector brtc-style-s-editor-toolitem-selector"></span>' +
            '   </div>' +
            '</div>' +
            '');
        this.$objectControl.find('.brtc-va-controls-options-viewer[viewer-type=object]').append($btnAddChart);

        $btnAddChart.find('.brtc-va-editor-toolitem-chart-type').click(function () {
            if (!_this.options.editor.diagramEditorPage.selectedPageId) return;

            var selectedPage = _this.options.editor.diagramEditorPage.controls[_this.options.editor.diagramEditorPage.selectedPageId];
            var command = selectedPage.createNewChartContentCommand($(this).attr('chart-type'), {});
            if (command) selectedPage.executeCommand(command);
        });

        var reportChartTypeList = Object.keys(Brightics.Chart.Registry).slice();
        reportChartTypeList.splice(reportChartTypeList.indexOf('biplot'), 1);

        $btnAddChart.find('.brtc-va-editor-toolitem-selector-parent').click(function () {
            new Brightics.Chart.Adonis.Component.Dialogs.ChartTypeSelectorDialog($btnAddChart, {
                value: $btnAddChart.find('.brtc-va-editor-toolitem-chart-type').attr('chart-type'),
                windowPosition: 'bottom',
                chartTypeList: reportChartTypeList.sort(),
                close: function (changedValue) {
                    _this.setToolItemSelection(changedValue);
                    if (!_this.options.editor.diagramEditorPage.selectedPageId) return;

                    var selectedPage = _this.options.editor.diagramEditorPage.controls[_this.options.editor.diagramEditorPage.selectedPageId];
                    selectedPage.executeCommand(selectedPage.createNewChartContentCommand(changedValue, {}));
                }
            });
        });

        var $btnAddText = $('' +
            '<div class="brtc-va-editor-toolitem brtc-style-editor-toolitem brtc-style-editor-toolitem-large brtc-style-s-editor-toolitem brtc-style-s-background-image-none" title="Add Text" item-type="add-text">' +
            '    <div class="brtc-va-editor-toolitem-text-type" chart-type="text"></div>' +
            '    <span class="brtc-style-s-font-size-11 brtc-style-s-font-faminly-arial">text</span>' +
            '</div>' +
            '');
        this.$objectControl.find('.brtc-va-controls-options-viewer[viewer-type=object]').append($btnAddText);

        $btnAddText.find('.brtc-va-editor-toolitem-text-type').click(function () {
            if (!_this.options.editor.diagramEditorPage.selectedPageId) return;

            var selectedPage = _this.options.editor.diagramEditorPage.controls[_this.options.editor.diagramEditorPage.selectedPageId];
            var command = selectedPage.createNewTextContentCommand();
            if (command) selectedPage.executeCommand(command);
        });

        this.setToolItemSelection(chartType);
    };

    OptionPanelManager.prototype._createOptionPanel = function () {
        this.optionViewer = {};
        for (var key in Brightics.VA.Implementation.Visual.CONTENT_TYPE) {
            var type = Brightics.VA.Implementation.Visual.CONTENT_TYPE[key];

            this.optionViewer[type] = new Brightics.VA.Implementation.Visual.Views.OptionViewer[type](this.$mainControl.find('.brtc-va-views-optionpanel-area'), {
                optionPanelManager: this
            });
            this.optionViewer[type].hideOption();
        }
    };

    OptionPanelManager.prototype.selectionChanged = function (selection) {
        if (this.$objectControl.find('.brtc-style-popup').css('display') != 'none') this.$objectControl.find('.brtc-style-popup').hide();
        if (!Array.isArray(selection) || selection.length != 1) {
            for (var key in Brightics.VA.Implementation.Visual.CONTENT_TYPE) {
                let type = Brightics.VA.Implementation.Visual.CONTENT_TYPE[key];
                if (this.optionViewer[type]) this.optionViewer[type].hideOption();
            }

            if (!this.optionViewer['page']) this.optionViewer['page'] = new Brightics.VA.Implementation.Visual.Views.OptionViewer['page'](this.$mainControl.find('.brtc-va-views-optionpanel-area'), {
                optionPanelManager: this
            });
            else this.optionViewer['page'].showOption();

            this.setToolItemSelection('scatter');
            this.selection = null;
            return;
        }

        if (selection[0] instanceof Brightics.VA.Implementation.Visual.Editors.Diagram.Figures.BaseContentUnit) {

            for (const type in Brightics.VA.Implementation.Visual.CONTENT_TYPE) {
                if (this.optionViewer[type]) this.optionViewer[type].hideOption();
            }
            if (!this.optionViewer[selection[0].options.content.type])
                this.optionViewer[selection[0].options.content.type] = new Brightics.VA.Implementation.Visual.Views.OptionViewer[selection[0].options.content.type](this.$mainControl.find('.brtc-va-views-optionpanel-area'), {
                    optionPanelManager: this
                });
            this.optionViewer[selection[0].options.content.type].showOption(selection[0]);

            let type = selection[0].options.content.type;
            if (selection[0].options.content.type == 'chart') {
                type = selection[0].options.content.options.chart.type;
            }

            this.setToolItemSelection(type);

            this.selection = selection[0];
        }
    };

    OptionPanelManager.prototype.setToolItemSelection = function (type) {
        if (type != 'text') this.$objectControl.find('.brtc-va-editor-toolitem[tool-type=multi-selector] > .brtc-va-editor-toolitem[item-type=add-chart] div').attr('chart-type', type);
        if (type != 'text') this.$objectControl.find('.brtc-va-editor-toolitem[tool-type=multi-selector] > .brtc-va-editor-toolitem-selector-parent span:first-child').text(Brightics.Chart.Registry[type].Label);
        if (type != 'text') this.$objectControl.find('.brtc-va-editor-toolitem[tool-type=multi-selector] > .brtc-va-editor-toolitem-selector-parent span:first-child').attr('title', Brightics.Chart.Registry[type].Label);
    };

    OptionPanelManager.prototype.destroy = function () {
        for (var key in Brightics.VA.Implementation.Visual.CONTENT_TYPE) {
            var type = Brightics.VA.Implementation.Visual.CONTENT_TYPE[key];
            if (this.optionViewer && this.optionViewer[type]) {
                this.optionViewer[type].destroy();
                this.optionViewer[type] = null;
            }
        }
    };

    OptionPanelManager.prototype.getEditor = function () {
        return this.options.editor;
    };

    OptionPanelManager.prototype.handleStyleChanged = function (content, style) {
        if (this.isStyleChanged(content, style)) {
            var command = new Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.SetContentStyleCommand(this, {
                content: content,
                changedStyle: style
            });
            this.options.editor.getCommandManager().execute(command);
        }
    };

    OptionPanelManager.prototype.isStyleChanged = function (content, style) {
        return (_.isEqual(content.style, style))? false : true;
    };

    Brightics.VA.Implementation.Visual.Views.OptionPanelManager = OptionPanelManager;

}).call(this);