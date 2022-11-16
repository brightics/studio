/**
 * Created by ty_tree.kim on 2016-02-11.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ReportStandAlone($parent, contents) {
        this.contents = contents;
        this.reportData = contents.report.data || [];

        this.$parent = $parent;
        this.initReport();
    }


    ReportStandAlone.prototype.initReport = function () {
        this.initReportViewer();
        this.render();
    };


    ReportStandAlone.prototype.formattedData = function (data) {
        return {
            id: data.options.id + '-' + data.options.chartOption.chart.type,
            type: 'Chart',
            originData: data
        };
    };

    ReportStandAlone.prototype.removeReportData = function (contentPanelId, chartType) {
        var checkId = id(contentPanelId, chartType);
        for (var index in this.reportData) {
            if (this.reportData[index].id === checkId) {
                this.removeReportDataByIndex(index);
                return;
            }
        }
    };

    ReportStandAlone.prototype.initReportViewer = function () {
        this.$reportWindow = this.$parent;

        this.initReportWindowBody();
    };

    ReportStandAlone.prototype.initReportWindowBody = function () {

        this.$reportContentsArea = $('<div class="brtc-va-editors-modeleditor-report-contents-area"></div>');
        this.$reportWindow.append(this.$reportContentsArea);

        this.pageHandler = new PageHandler(this.$reportContentsArea);

        this.$processingWindow = $('<div><div>Processing ...</div><div><div class="brtc-va-progress">' +
            '<div><span class="brtc-va-progress-loading"></div>' +
            // '<i class="fa fa-circle-o-notch fa-spin fa-5x"></i>' +
            '</div></div>');
        this.$parent.append(this.$processingWindow);
        $(this.$processingWindow).dialog({
            width: 300,
            height: 200,
            theme: Brightics.VA.Env.Theme,
            showCloseButton: false,
            autoOpen: false,
            modal: true,
            resizable: false,
            keyboardCloseKey: ''
        });
    };

    ReportStandAlone.prototype.addReportTextBox = function () {

        var index = this.reportData.push({
            id: Brightics.VA.Core.Utils.IDGenerator.report.id() + '-Text',
            type: 'Text',
            originData: ''
        });

        this.renderIndexData(index - 1);
    };


    ReportStandAlone.prototype.render = function () {
        var _this = this;
        _this.showProcessingWindow();

        this.clearReport();

        this.setReportContentsAreaSize();

        var promises = [];
        promises.push(new Promise(function (resolve, reject) {
            resolve();
        }));
        for (var index in this.reportData) {
            var promise = this.renderIndexData(index);
            promises.push(promise);
        }

        Promise.all(promises).then(function () {
            _this.hideProcessingWindow();

            //relatePosition to absolutePosition
            _this.convertReportLayout();
        }, function (error) {
            _this.hideProcessingWindow();
        });
    };

    ReportStandAlone.prototype.renderIndexData = function (dataIndex) {
        if (this.reportData[dataIndex]) {
            var result = this.renderReportElementBox(this.reportData[dataIndex], dataIndex);
            this.attachReportElementBoxHeaderItems(this.reportData[dataIndex], result.elementBox);
            return result.promise;
        }
    };

    ReportStandAlone.prototype.clearReport = function () {
        this.$reportContentsArea.empty();
    };

    ReportStandAlone.prototype.setReportContentsAreaSize = function () {
        var dataList = this.reportData;
        var maxHeight = 0;
        this.relativeContentsIndexList = [];
        for (var i = 0; i < dataList.length; i++) {
            if (!dataList[i].position) {
                this.relativeContentsIndexList.push(i);
                continue;
            }
            maxHeight = Math.max(maxHeight, dataList[i].position.top + dataList[i].size.height + 5);
        }

        var additionalHeight = this.relativeContentsIndexList.length * 300;
        this.$reportContentsArea.css('height', maxHeight + additionalHeight);
    };

    function id(panelId, type) {
        return panelId + '-' + type;
    }

    ReportStandAlone.prototype.renderReportElementBox = function (target, dataIndex) {
        if (target.type === 'Chart') {
            return this.renderReportChartBox(target, dataIndex);
        } else if (target.type === 'Text') {
            return this.renderReportTextBox(target, dataIndex);
        }
    };

    ReportStandAlone.prototype.renderReportChartBox = function (target, dataIndex) {
        var _this = this;

        var $reportChartBox = $('' +
            '<div class="brtc-va-editors-modeleditor-report-element" content-type="' + target.type + '">' +
            '   <div class="brtc-va-editors-modeleditor-report-element-head">' +
            '       <div class="brtc-va-editors-modeleditor-report-element-head-label" title="' + Brightics.VA.Core.Utils.WidgetUtils.convertHTMLSpecialChar(makeTitle(target.originData)) + '">'
            + Brightics.VA.Core.Utils.WidgetUtils.convertHTMLSpecialChar(makeTitle(target.originData)) + '</div>' +
            '   </div>' +
            '   <div class="brtc-va-editors-modeleditor-report-element-body"></div>' +
            '</div>');
        _this.$reportContentsArea.append($reportChartBox);

        this.setContentsSizeAndPosition($reportChartBox, target.size, target.position, dataIndex);

        this.setResizable($reportChartBox);
        this.setDraggable($reportChartBox);

        var outTable = target.originData.data.table || target.originData.data.fid,
            functionRemoved = false;
        if (this.contents.mid && !this.getFnUnitByOutTable(outTable)) {
            var $label = $reportChartBox.find('.brtc-va-editors-modeleditor-report-element-head-label');
            $label.text('Function has been removed.');
            $label.addClass('function-removed');
            functionRemoved = true;
        }

        var promise = new Promise(function (resolve, reject) {
            queryTable(target.originData.data).then(function (data) {
                var chartOptions = $.extend({}, target.originData.options.chartOption, data);
                if (functionRemoved) {
                    chartOptions.columns = [];
                    chartOptions.data = [];
                }
                $reportChartBox.find('.brtc-va-editors-modeleditor-report-element-body').BrighticsChart(chartOptions);
                resolve();
            }, function (err) {
                reject(err);
            });
        });

        return {elementBox: $reportChartBox, promise: promise};
    };

    ReportStandAlone.prototype.setContentsSizeAndPosition = function ($target, size, position, dataIndex) {
        if (size && position) {
            $target.css({
                position: 'absolute',
                top: position.top,
                left: position.left,
                width: size.width,
                height: size.height
            });
        } else {
            var reportContentsAreaHeight = this.$reportContentsArea.height();
            var additionalContentsLength = this.relativeContentsIndexList.length;
            var additionalContentsIndex = this.relativeContentsIndexList.indexOf(parseInt(dataIndex));

            $target.css({
                position: 'absolute',
                top: reportContentsAreaHeight - 300 * (additionalContentsLength - additionalContentsIndex),
                left: 15,
                width: 900,
                height: 290
            });
        }
    };

    ReportStandAlone.prototype.setNewContentsSizeAndPosition = function ($target, targetData) {
        var reportContentsAreaHeight = this.$reportContentsArea.height();
        var top = reportContentsAreaHeight,
            left = 15,
            width = 300,
            height = 290;
        this.pageHandler.increasePageHeight(height);
        $target.css({
            position: 'absolute',
            top: reportContentsAreaHeight,
            left: 15,
            width: 300,
            height: 290
        });
        targetData.position = {
            top: top,
            left: left
        };
        targetData.size = {
            width: width,
            height: height
        }
    };


    ReportStandAlone.prototype.renderReportTextBox = function (target, dataIndex) {
        var $reportTextBox = $('' +
            '<div class="brtc-va-editors-modeleditor-report-element" content-type="' + target.type + '">' +
            '   <div class="brtc-va-editors-modeleditor-report-element-head">' +
            '       <div class="brtc-va-editors-modeleditor-report-element-head-label"></div>' +
            '   </div>' +
            '   <div class="brtc-va-editors-modeleditor-report-element-body">' +
            '       <div class="brtc-va-editors-modeleditor-report-element-body-contents"></div>' +
            '   </div>' +
            '</div>');
        this.$reportContentsArea.append($reportTextBox);

        this.setContentsSizeAndPosition($reportTextBox, target.size, target.position);

        this.setResizable($reportTextBox);
        this.setDraggable($reportTextBox);

        var $reportTextBody = $reportTextBox.find('textarea.brtc-va-editors-modeleditor-report-element-body-textarea');
        $reportTextBody.val(target.originData);
        $reportTextBody.on('blur', function () {
            target.originData = $(this).val().trim();
        });

        $reportTextBox.find('.brtc-va-editors-modeleditor-report-element-body-contents').append(target.originData);

        return {elementBox: $reportTextBox, promise: Promise.resolve()};
    };

    ReportStandAlone.prototype.setResizable = function ($target) {
    };

    ReportStandAlone.prototype.setDraggable = function ($target) {
    };

    ReportStandAlone.prototype.configureContentSize = function ($target, currentPosition, currentSize) {
        var rightPosition = currentPosition.left + currentSize.width,
            contentsAreaWidth = this.$reportContentsArea.width();

        if (rightPosition > contentsAreaWidth) {
            $target.width(contentsAreaWidth - currentPosition.left);
            currentSize.width = (contentsAreaWidth - currentPosition.left);
        }
        return currentSize;
    };

    ReportStandAlone.prototype.configureContentPosition = function ($target, currentPosition, currentSize) {
        var rightPosition = currentPosition.left + currentSize.width,
            contentsAreaWidth = this.$reportContentsArea.width();

        if (currentPosition.top < 5) currentPosition.top = 5;
        if (currentPosition.left < 5) currentPosition.left = 5;

        if (rightPosition > contentsAreaWidth) {
            currentPosition.left = currentPosition.left - (rightPosition - contentsAreaWidth);
        }

        $target.css({top: currentPosition.top, left: currentPosition.left});

        return currentPosition;
    };


    function makeTitle(target) {
        var title = "Title";
        var fnUnitLabel = target.title.fnUnitLabel;

        if (fnUnitLabel !== null && fnUnitLabel !== undefined) {
            title = '[' + fnUnitLabel + '] ';
        }

        if (target.title.panelTitle !== undefined) {
            title += target.title.panelTitle;
        }

        return title;
    }

    function queryTable(dataInfo) {
        return new Promise(function (resolve, reject) {
            Brightics.VA.Core.DataQueryTemplate.queryTableForReport(dataInfo.mid, dataInfo.table || dataInfo.fid, function (newData) {
                resolve(newData);
            }, function (err) {
                reject(err);
            });
        });
    }

    ReportStandAlone.prototype.attachReportElementBoxHeaderItems = function (target, $reportElementBox) {
        var _this = this;
        var $elementHead = $reportElementBox.find('.brtc-va-editors-modeleditor-report-element-head');

        if (target.type === 'Text') {
            var $editButton = $('<div class="brtc-va-editors-modeleditor-report-element-toolbar brtc-va-editors-modeleditor-report-element-toolbar-edit">' +
                '<i class="fa fa-pencil-square-o" aria-hidden="true"></i></div>');
            $elementHead.append($editButton);
            $editButton.click(function () {
                var $reportTextBox = $(this).parents('.brtc-va-editors-modeleditor-report-element');
                var $contents = $reportTextBox.find('.brtc-va-editors-modeleditor-report-element-body-contents');

                var options = {
                    contents: $contents.html(),
                    save: function (markupStr) {
                        target.originData = markupStr;
                        $reportTextBox.attr('content-type', 'Text');
                        $contents.empty();
                        $contents.append(markupStr);
                    }
                };
                new Brightics.VA.Core.Dialogs.NoteDialog($(this).closest('.brtc-va-editors-modeleditor-report-element-body'), options);
            });

            if (!target.position) {
                this.setNewContentsSizeAndPosition($reportElementBox, target);
            }

        }

        var $removeButton = $('<div class="brtc-va-editors-modeleditor-report-element-toolbar brtc-va-editors-modeleditor-report-element-toolbar-remove"></div>');
        $elementHead.append($removeButton);

        $removeButton.click(function () {
            var $target = $(this).parents('.brtc-va-editors-modeleditor-report-element');
            var position = $target.index();

            Brightics.VA.Core.Utils.WidgetUtils.openConfirmDialog('Are you sure you want to delete this graph?', function (dialogResult) {
                if (dialogResult.OK) {
                    _this.removeReportDataByIndex(position);
                }
            });
        });
    };

    ReportStandAlone.prototype.removeReportDataByIndex = function (index) {
        if (index > -1) {
            var reportElements = this.$reportContentsArea.find('.brtc-va-editors-modeleditor-report-element');
            if (reportElements.length > index) {
                reportElements[index].remove();
            }
            this.reportData.splice(index, 1);
        }
    };


    ReportStandAlone.prototype.setPositionToReportDataByIndex = function (index, position, size) {
        this.reportData[index].size = size;
        this.reportData[index].position = position;
    };


    ReportStandAlone.prototype.showProcessingWindow = function () {
        $(this.$processingWindow).dialog('open');
    };

    ReportStandAlone.prototype.hideProcessingWindow = function () {
        $(this.$processingWindow).dialog('close');
    };

    ReportStandAlone.prototype.convertReportLayout = function () {
        var contentsList = this.$reportContentsArea.find('.brtc-va-editors-modeleditor-report-element');
        this.pageHandler.setHeight(this.$reportContentsArea.height());

        for (var i = contentsList.length - 1; i >= 0; i--) {
            this.convertRelativeToAbsolute(i, $(contentsList[i]));
        }

        this.relativeContentsIndexList = [];
    };

    ReportStandAlone.prototype.convertRelativeToAbsolute = function (index, $content) {

        var height, width, position;

        position = $content.position();
        height = $content.outerHeight();
        width = $content.outerWidth();

        $content.css({
            position: 'absolute',
            width: width,
            height: height,
            left: position.left,
            top: position.top
        });

        this.setPositionToReportDataByIndex(index, position, {width: width, height: height});
    };


    ReportStandAlone.prototype.changeReportCss = function (revert) {
        
    };

    ReportStandAlone.prototype.getFnUnitByOutTable = function (table) {

        for (var i in this.contents.functions) {
            var fnUnit = this.contents.functions[i];
            if ($.inArray(table, fnUnit[OUT_DATA]) > -1) {
                return fnUnit;
            }
        }
    };

    function PageHandler($controlArea) {
        this.$controlArea = $controlArea;
    }

    PageHandler.prototype.setHeight = function (height) {
        this.$controlArea.height(height);
    };

    PageHandler.prototype.increasePageHeight = function (increaseSize) {
        increaseSize = increaseSize || 50;
        var preHeight = this.$controlArea.height() || 0;

        this.$controlArea.height(preHeight + increaseSize);
    };

    PageHandler.prototype.handlePageHeight = function (bottomPosition) {
        if (bottomPosition + 10 > this.$controlArea.height()) {
            this.$controlArea.height(bottomPosition + 10);
        }
    };


    Brightics.VA.Core.ReportStandAlone = ReportStandAlone;

}).call(this);