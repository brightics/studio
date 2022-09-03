/**
 * Created by ty_tree.kim on 2016-02-11.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    /**
     * reportData
     * [
     *   id: {String},
     *   layout: BOX.TYPE_{number},
     *   type: {Chart or Text},
     *   position: {left : px, top : px}
     *   size: {height: px, width: px}
     *   originData: data
     * ]
     */
    function ReportManager(editorInput) {
        this.editorInput = editorInput;
        this.reportData = editorInput.getContents().report.data || [];
        // this.reportTitle = editorInput.contents.report.title || 'Report';
    }

    /**
     * data structure
     * {
     *  options: {
     *      id: {String},
     *      chartOption: {Object}
     *  },
     *  data: {
     *      mid: {String},
     *      fid: {String}
     *  },
     *  title: {
     *      fnUnitLabel: {String},
     *      panelTitle: {String}
     *  }
     * }
     */
    ReportManager.prototype.addReportData = function (data) {
        var _this = this;
        var isCorrectData = function (data) {
            return data.options.id && data.options.chartOption && data.data.mid && data.data.table;
        };
        return new Promise(function (resolve, reject) {
            if (isCorrectData(data)) {
                var dataIndex = _this.reportData.push(_this.formattedData(data));
                _this.editorInput.getContents().report = {
                    // title: _this.reportTitle,
                    data: _this.reportData
                };
                resolve(dataIndex - 1);
            } else {
                reject("Data are not correct");
            }
        });
    };
    ReportManager.prototype.openDialog = function ($report, closeHandler) {
        var _this = this;
        $report.dialog({
            theme: Brightics.VA.Env.Theme,
            width: 950,
            maxWidth: 950,
            minWidth: 950,
            height: 800,
            minHeight: 400,
            maxHeight: 1200,
            modal: true,
            resizable: false,
            open: function () {
                _this.initReportViewer($report);
                _this.render();
            },
            keyboardCloseKey: ''
        });

        this.$reportWindow.on('close', function () {
            closeHandler();
            $report.dialog('destroy');
        });
    };

    ReportManager.prototype.formattedData = function (data) {
        return {
            id: data.options.id + '-' + data.options.chartOption.chart.type,
            type: 'Chart',
            originData: data
        };
    };

    ReportManager.prototype.removeReportData = function (contentPanelId, chartType) {
        var checkId = id(contentPanelId, chartType);
        for (var index in this.reportData) {
            if (this.reportData[index].id === checkId) {
                this.removeReportDataByIndex(index);
                return;
            }
        }
    };

    ReportManager.prototype.initReportViewer = function ($parent) {
        this.$reportWindow = $parent;

        this.initReportWindowToolbar();
        this.initReportWindowBody();
    };

    ReportManager.prototype.initReportWindowToolbar = function () {
        var _this = this;

        this.$reportWindowBody = this.$reportWindow.find('.brtc-va-editors-modeleditor-report-window-body');
        var $toolBar = $('<div class="brtc-va-editors-modeleditor-report-window-head-tools-container"></div>');
        this.$reportWindowBody.prepend($toolBar);

        var $shareAddButton = $('<div class="brtc-va-editors-modeleditor-report-window-head-tools brtc-va-editors-modeleditor-report-window-head-tools-share fa fa-share-alt" title="Publish"></div>');
        var $textAddButton = $('<div class="brtc-va-editors-modeleditor-report-window-head-tools brtc-va-editors-modeleditor-report-window-head-tools-add" title="Click to add text"></div>');
        var $reportDownloadAllButton = $('<div class="brtc-va-editors-modeleditor-report-window-head-tools brtc-va-editors-modeleditor-report-window-head-tools-report-all" title="Download Report Image"></div>');
        var $reportDownloadEachAllButton = $('<div class="brtc-va-editors-modeleditor-report-window-head-tools brtc-va-editors-modeleditor-report-window-head-tools-report-each" title="Download Report Each Element Image"></div>');
        $toolBar.append($reportDownloadAllButton);
        $toolBar.append($reportDownloadEachAllButton);
        $toolBar.append($textAddButton);
        $toolBar.append($shareAddButton);

        $reportDownloadAllButton.on('click', function () {
            _this.downloadAll();
        });
        $reportDownloadEachAllButton.on('click', function () {
            _this.downloadEachAll();
        });
        $shareAddButton.on('click', function () {
            _this.publishReport();
        });

        $textAddButton.on('click', function () {
            _this.addReportTextBox();
        });
    };

    ReportManager.prototype.publishReport = function () {
        var _this = this;
        if (!this.editorInput.getContents().report.id) {
            this.editorInput.getContents().report.id = Brightics.VA.Core.Utils.IDGenerator.report.id(60);
            var opt = {
                url: '/report',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify({
                    reportId: this.editorInput.getContents().report.id,
                    userId: Brightics.VA.Env.Session.userId,
                    modelId: this.editorInput.id,
                    projectId: this.editorInput.getProjectId()
                })
            };
            $.ajax(opt).done(function () {
                _this.showPublishInfo();
            });
        } else {
            this.showPublishInfo();
        }
    };

    ReportManager.prototype.showPublishInfo = function () {
        var _this = this;
        var opt = {
            url: '/report/publishsite',
            type: 'GET',
            contentType: 'application/json; charset=utf-8'
        };
        $.ajax(opt).done(function (data) {
            var options = {
                title: 'Publish Information'
            };
            options.window = {
                theme: Brightics.VA.Env.Theme,
                width: '600px',
                height: '150px',
                maxWidth: '600px',
                maxHeight: '150px',
                modal: true,
                resizable: false,
                cancelButton: _this.$cancelButton,
                open: function () {
                    _this.createDialogContentsArea($(this.element).find('.brtc-va-dialogs-contents'), data);
                }
            };
            new Brightics.VA.Core.Dialogs.Dialog(_this.$reportWindowBody, options);
        });
    };

    ReportManager.prototype.createDialogContentsArea = function ($contentsArea, serverInfo) {
        var url = 'http://' + serverInfo.ip + ':' + serverInfo.port + '/report?report=' + this.editorInput.getContents().report.id;
        $contentsArea.append('' +
            '<div style="width:100%">' +
            '   <div style="width:10%;float: left">url: </div>' +
            '   <div style="width:70%;float: left"><input class="brtc-va-widget-contents-input-control" value="' + url + '" readonly></div>' +
            '   <div style="width:20%;float: left;display: flex;justify-content: center;"><button class="brtc-va-copy-clipboard-button" type="button"">Copy</button></div>' +
            '</div>');

        var $copyBtn = $contentsArea.find('.brtc-va-copy-clipboard-button');
        $copyBtn.jqxButton({
            theme: Brightics.VA.Env.Theme
        });

        $copyBtn.on('click', function(){
            window.prompt("Copy to clipboard: Ctrl+C", url);
        });
    };


    ReportManager.prototype.initReportWindowBody = function () {

        this.$reportWindowBody.perfectScrollbar();
        this.$reportContentsArea = $('<div class="brtc-va-editors-modeleditor-report-contents-area"></div>');
        this.$reportContainer = this.$reportWindow.find('.brtc-va-editors-modeleditor-report-element-container');
        this.$reportContainer.append(this.$reportContentsArea);

        this.pageHandler = new PageHandler(this.$reportContentsArea);

        this.$processingWindow = $('<div><div>Processing ...</div><div><div class="brtc-va-progress">' +
            '<div><span class="brtc-va-progress-loading"></div>' +
            // '<i class="fa fa-circle-o-notch fa-spin fa-5x"></i>' +
            '</div></div>');
        this.$reportContainer.append(this.$processingWindow);
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

    ReportManager.prototype.addReportTextBox = function () {

        var index = this.reportData.push({
            id: Brightics.VA.Core.Utils.IDGenerator.report.id() + '-Text',
            type: 'Text',
            originData: ''
        });

        this.renderIndexData(index - 1);
    };


    ReportManager.prototype.render = function () {
        var _this = this;

        $(this.$reportWindow).on('open', function () {
            _this.showProcessingWindow();
        });

        // var title = this.$reportTitleArea.find('.brtc-va-editors-modeleditor-report-title-textarea');
        // title.val(this.reportTitle);
        // this.$reportWindowHeadTitle.text(this.reportTitle);

        // this.$reportWindowHeadTitle.parent().css({
        //     'white-space': 'nowrap',
        //     'width': 'calc(100% - 70px)',
        //     'overflow': 'hidden',
        //     'text-overflow': 'ellipsis'
        // });

        // $(title).css('height', '1px').css('height', (20 + $(title).prop('scrollHeight')) + 'px');
        // $(title).css('resize', 'none');

        this.clearReport();

        this.setReportContentsAreaSize();

        var promises = [];
        promises.push(new Promise(function (resolve, reject) {
            $(_this.$processingWindow).on('open', function () {
                resolve();
            });
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

    ReportManager.prototype.renderIndexData = function (dataIndex) {
        if (this.reportData[dataIndex]) {
            var result = this.renderReportElementBox(this.reportData[dataIndex], dataIndex);
            this.attachReportElementBoxHeaderItems(this.reportData[dataIndex], result.elementBox);
            return result.promise;
        }
    };

    ReportManager.prototype.clearReport = function () {
        this.$reportContentsArea.empty();
    };

    ReportManager.prototype.setReportContentsAreaSize = function () {
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

    ReportManager.prototype.containsData = function (contentPanelId, chartType) {
        var checkId = id(contentPanelId, chartType);
        for (var index in this.reportData) {
            if (this.reportData[index].id === checkId) return true;
        }
        return false;
    };

    function id(panelId, type) {
        return panelId + '-' + type;
    }

    ReportManager.prototype.renderReportElementBox = function (target, dataIndex) {
        if (target.type === 'Chart') {
            return this.renderReportChartBox(target, dataIndex);
        } else if (target.type === 'Text') {
            return this.renderReportTextBox(target, dataIndex);
        }
    };

    ReportManager.prototype.renderReportChartBox = function (target, dataIndex) {
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
        if (this.editorInput.getContents().mid && !this.editorInput.getContents().getFnUnitByOutTable(outTable)) {
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

    ReportManager.prototype.setContentsSizeAndPosition = function ($target, size, position, dataIndex) {
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

    ReportManager.prototype.setNewContentsSizeAndPosition = function ($target, targetData) {
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


    ReportManager.prototype.renderReportTextBox = function (target, dataIndex) {
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

    ReportManager.prototype.setResizable = function ($target) {
        var _this = this;
        $target.resizable({
            // containment: this.$reportContentsArea,
            autoHide: true,
            stop: function (event, ui) {
                var index = ui.element.index();
                var position = ui.position;
                var size = {
                    width: ui.element.outerWidth(),
                    height: ui.element.outerHeight()
                };
                size = _this.configureContentSize($target, position, size);
                _this.setPositionToReportDataByIndex(index, position, size);
            },
            resize: function (event, ui) {
                var position = ui.position;
                var size = {
                    width: ui.element.outerWidth(),
                    height: ui.element.outerHeight()
                };
                var bottomPosition = position.top + size.height;
                _this.pageHandler.handlePageHeight(bottomPosition);
            },
            minHeight: 80,
            minWidth: 150
        });
    };

    ReportManager.prototype.setDraggable = function ($target) {
        var _this = this;
        $target.draggable({
            // containment: this.$reportContentsArea,
            handle: _this.$reportContentsArea.find('.brtc-va-editors-modeleditor-report-element-head'),
            stop: function (event, ui) {
                var index = ui.helper.index();
                var position = ui.position;
                var size = {width: ui.helper.outerWidth(), height: ui.helper.outerHeight()};
                position = _this.configureContentPosition($target, position, size);
                _this.setPositionToReportDataByIndex(index, position, size);
            },
            drag: function (event, ui) {
                var position = ui.position;
                var bottomPosition = position.top + ui.helper.height();
                _this.pageHandler.handlePageHeight(bottomPosition + 10);
            }
        });
    };
    ReportManager.prototype.configureContentSize = function ($target, currentPosition, currentSize) {
        var rightPosition = currentPosition.left + currentSize.width,
            contentsAreaWidth = this.$reportContentsArea.width();

        if (rightPosition > contentsAreaWidth) {
            $target.width(contentsAreaWidth - currentPosition.left);
            currentSize.width = (contentsAreaWidth - currentPosition.left);
        }
        return currentSize;
    };

    ReportManager.prototype.configureContentPosition = function ($target, currentPosition, currentSize) {
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
            /**
             * 2016-11-14
             * fid라고 저장하지만 실제의미는 out-table이기 때문에 dataInfo.fid -> dataInfo.table 로 변경
             * sungjin1.kim
             */
            Brightics.VA.Core.DataQueryTemplate.queryTable(dataInfo.mid, dataInfo.table || dataInfo.fid, function (newData) {
                resolve(newData);
            }, function (err) {
                reject(err);
            });
        });
    }

    ReportManager.prototype.attachReportElementBoxHeaderItems = function (target, $reportElementBox) {
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

    ReportManager.prototype.removeReportDataByIndex = function (index) {
        if (index > -1) {
            var reportElements = this.$reportContentsArea.find('.brtc-va-editors-modeleditor-report-element');
            if (reportElements.length > index) {
                reportElements[index].remove();
            }
            this.reportData.splice(index, 1);
        }
    };


    ReportManager.prototype.setPositionToReportDataByIndex = function (index, position, size) {
        this.reportData[index].size = size;
        this.reportData[index].position = position;
    };


    ReportManager.prototype.showProcessingWindow = function () {
        $(this.$processingWindow).dialog('open');
    };

    ReportManager.prototype.hideProcessingWindow = function () {
        $(this.$processingWindow).dialog('close');
    };

    ReportManager.prototype.convertReportLayout = function () {
        var contentsList = this.$reportContentsArea.find('.brtc-va-editors-modeleditor-report-element');
        this.pageHandler.setHeight(this.$reportContentsArea.height());

        for (var i = contentsList.length - 1; i >= 0; i--) {
            this.convertRelativeToAbsolute(i, $(contentsList[i]));
        }

        this.relativeContentsIndexList = [];
    };

    ReportManager.prototype.convertRelativeToAbsolute = function (index, $content) {

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

    ReportManager.prototype.downloadAll = function () {
        this.showProcessingWindow();
        this.changeReportCss(false);
        html2canvas(this.$reportContainer, {
            onrendered: function (canvas) {
                var img = canvas.toDataURL('image/png');
                var a = $('<a>').attr('href', img).attr('download', 'report.png').appendTo('body');
                a[0].click();
                a.remove();
            }
        });
        this.changeReportCss(true);
        this.hideProcessingWindow();
    };

    ReportManager.prototype.downloadEachAll = function () {
        var _this = this;
        this.showProcessingWindow();
        this.changeReportCss(false);
        var elementArray = this.$reportContentsArea.find('.brtc-va-editors-modeleditor-report-element');
        var count = 0;
        downloadEachImage();
        function downloadEachImage() {
            if (count < elementArray.length) {
                html2canvas(elementArray[count], {
                    onrendered: function (canvas) {
                        var img = canvas.toDataURL('image/png');
                        var a = $('<a>').attr('href', img).attr('download', 'report' + count + '.png').appendTo('body');
                        a[0].click();
                        a.remove();
                        count++;
                        downloadEachImage();
                    }
                });
            }
            else {
                _this.changeReportCss(true);
                _this.hideProcessingWindow();
            }
        }
    };

    ReportManager.prototype.changeReportCss = function (revert) {
        if (revert) {
            this.$reportWindowBody.perfectScrollbar();
            this.$reportWindowBody.css({'height': this.reportWindowBodyHeight});
            this.$reportWindow.css({
                'height': this.reportWindowHeight,
                'max-height': this.reportWindowMaxHeight
            });
        }
        else {
            this.$reportWindowBody.perfectScrollbar('destroy');
            this.reportWindowBodyHeight = this.$reportWindowBody.css('height');
            this.$reportWindowBody.css({'height': 'auto'});
            this.reportWindowHeight = this.$reportWindow.css('height');
            this.reportWindowMaxHeight = this.$reportWindow.css('max-height');
            this.$reportWindow.css({
                'max-height': '',
                'height': 'auto'
            });
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


    Brightics.VA.Core.ReportManager = ReportManager;

}).call(this);