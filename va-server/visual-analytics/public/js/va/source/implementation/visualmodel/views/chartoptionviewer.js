/**
 * Created by daewon.park on 2016-10-17.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var crel = brtc_require('crel');

    function ChartOptionViewer(parentId, options) {
        Brightics.VA.Implementation.Visual.Views.BaseOptionViewer.call(this, parentId, options);
    }

    ChartOptionViewer.prototype = Object.create(Brightics.VA.Implementation.Visual.Views.BaseOptionViewer.prototype);
    ChartOptionViewer.prototype.constructor = ChartOptionViewer;

    ChartOptionViewer.prototype.init = function () {
        Brightics.VA.Implementation.Visual.Views.BaseOptionViewer.prototype.init.call(this);

        this.chartOptionControlMap = {};
    };

    ChartOptionViewer.prototype.createControls = function () {
        Brightics.VA.Implementation.Visual.Views.BaseOptionViewer.prototype.createControls.call(this);

        this.createLayout();

        this.createArrangeControl();

        this.$mainControl.find('.brtc-va-controls-options-panel').perfectScrollbar();
    };

    ChartOptionViewer.prototype.showOption = function (contentUnit) {
        Brightics.VA.Implementation.Visual.Views.BaseOptionViewer.prototype.showOption.call(this, contentUnit);

        this.refresh();
    };

    ChartOptionViewer.prototype.refresh = function () {
        if (!this.contentUnit) return;

        var _this = this,
            id = this.contentUnit.options.content.id;

        var newChartOption = {
            chartOption: $.extend(true, {}, this.contentUnit.getChartOption()),
            //TODO: biplot 개발완료후 chartTypeList삭제해야함.
            chartTypeList: function(){
                var reportChartTypeList = Object.keys(Brightics.Chart.Registry).slice();
                reportChartTypeList.splice(reportChartTypeList.indexOf('biplot'), 1);
                return reportChartTypeList;
            }(),
            chartTypeSelectable: true,
            callBack: {
                onChartOptionChanged: function () {
                    _this.contentUnit.onChartOptionChanged.apply(_this.contentUnit, arguments);
                },
                onChartTypeChanged: function () {
                    _this.contentUnit.onChartTypeChanged.apply(_this.contentUnit, arguments);
                },
                onDataSourceChanged: function () {
                    _this.contentUnit.onDataSourceChanged.apply(_this.contentUnit, arguments);
                }
            },
            dataSource: {
                selectable: true,
                getDataSourceList: function () {
                    return _this.getDataSourceList();
                },
                getDataSourceColumnList: function (id) {
                    return _this.getDataSourceColumnList(id);
                }
            }
        };

        if (typeof this.chartOptionControlMap[id] === 'undefined') {
            var $wrapper = $(crel('div', {class: 'brtc-bcharts-option__wrapper'}));
            this.$properties.append($wrapper);
            this.chartOptionControlMap[id] = $wrapper.bchartsOption(newChartOption);
        } else {
            this.chartOptionControlMap[id].show();
            this.chartOptionControlMap[id].bchartsOption('show');
            this.chartOptionControlMap[id].bchartsOption('setChartOptions', newChartOption.chartOption);
        }

        this.$mainControl.find('.brtc-va-controls-options-panel').perfectScrollbar('update');
    };

    ChartOptionViewer.prototype.hideOption = function () {
        Brightics.VA.Implementation.Visual.Views.BaseOptionViewer.prototype.hideOption.call(this);

        for (var key in this.chartOptionControlMap) {
            this.chartOptionControlMap[key].hide();
            this.chartOptionControlMap[key].bchartsOption('hide');
        }
    };

    ChartOptionViewer.prototype.getDataSourceList = function () {
        var list = [];
        for (var i in this.getEditor().options.editorInput.getContents().getDataSources()) {
            var dataSource = this.getEditor().options.editorInput.getContents().getDataSources()[i];
            list.push({
                value: dataSource.fid,
                label: dataSource.display.label || ''
            })
        }
        return list;
    };

    ChartOptionViewer.prototype.getDataSourceColumnList = function (id) {
        var list = [];
        for (var i in this.getEditor().options.editorInput.getContents().getDataSources()) {
            var dataSource = this.getEditor().options.editorInput.getContents().getDataSources()[i];
            if (dataSource.fid == id) {
                for (var j in dataSource.display.columns) {
                    list.push(dataSource.display.columns[j]);
                }
            }
        }
        return list;
    };

    ChartOptionViewer.prototype.destroy = function () {
        var id = this.contentUnit ? this.contentUnit.options.content.id : '';
        if (this.chartOptionControlMap[id]) this.chartOptionControlMap[id].bchartsOption('destroy');
        this.$mainControl.remove();
    };

    Brightics.VA.Implementation.Visual.Views.OptionViewer['chart'] = ChartOptionViewer;

}).call(this);