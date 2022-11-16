/* global IN_DATA, OUT_DATA */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    var FnUnitUtils = brtc_require('FnUnitUtils');

    function PublishReportDialog(parentId, options, editorInput) {
        this.editorInput = editorInput;
        Brightics.VA.Dialogs.Dialog.call(this, parentId, options);
    }

    PublishReportDialog.prototype = Object.create(Brightics.VA.Dialogs.Dialog.prototype);
    PublishReportDialog.prototype.constructor = PublishReportDialog;

    PublishReportDialog.prototype._initOptions = function () {
        Brightics.VA.Dialogs.Dialog.prototype._initOptions.call(this);

        this.dialogOptions.width = 1200;
        this.dialogOptions.height = 640;
        this.dialogOptions.closeOnEscape = false;
    };

    PublishReportDialog.prototype.createNewButton = function ($parent) {
        var _this = this;
        $parent.append($('<input type="button" class="brtc-va-dialogs-publish-management-new" value="'+Brightics.locale.common.new+'">'));

        this.$newButton = $parent.find('.brtc-va-dialogs-publish-management-new').jqxButton({
            theme: Brightics.VA.Env.Theme
        });
        this.$newButton.click(function () {
            new Brightics.VA.Implementation.Visual.Dialogs.NewPublishReportDialog($parent, {
                close: function (event) {
                    if (event.OK) {
                        var opt = {
                            label: event.label,
                            publishReportId: event.id,
                            url: event.url
                            // publishReportId: Brightics.VA.Core.Utils.IDGenerator.report.id(14)
                        };

                        Brightics.VA.Core.Utils.CommonUtils.progress(_this.preparePublish(
                            _this.getContentUnits(),
                            _this.getDataSources(),
                            _this.editorInput.data.id,
                            event.id
                        ),
                        {
                            msg: 'Preparing publish...'
                        })
                            .then(function () {
                                return _this.publishReport(opt);
                            })
                            .catch(function (err) {
                                Brightics.VA.Core.Utils.WidgetUtils
                                    .openBadRequestErrorDialog(err);
                                console.error(err);
                            });
                    }

                        // var promises = [];

                        /* eslint-disable */
                    //     for (var i in  _this.editorInput.getContents().functions) {
                    //         if (_this.editorInput.getContents().functions[i].func === Brightics.VA.Implementation.Visual.DATASOURCE_TYPE.ALLUXIO) {
                    //             var promise = new Promise(function (resolve, reject) {
                    //                 var func = _this.editorInput.getContents().functions[i];
                    //                 var modelId = _this.editorInput.data.id;
                    //                 var tableId = func[OUT_DATA];

                    //                 var sourceFilePath = '/' + Brightics.VA.Env.Session.userId + '/' + modelId + '/' + tableId;
                    //                 var targetFilePath = '/' + opt.publishReportId + '/' + modelId + '/' + tableId;

                    //                 Brightics.VA.RepositoryQueryTemplate.copy(sourceFilePath, targetFilePath, {blocking: true}).done(function () {
                    //                     resolve();
                    //                 }).fail(function (err) {
                    //                     reject(err);
                    //                 });
                    //             });
                    //             promises.push(promise);
                    //         } else if (_this.editorInput.getContents().functions[i].func === Brightics.VA.Implementation.Visual.DATASOURCE_TYPE.STAGING) {
                    //             if (!(_this.editorInput.getContents().functions[i].param.scheduleId)) {
                    //                 var promise = new Promise(function (resolve, reject) {
                    //                     var func = _this.editorInput.getContents().functions[i];
                    //                     var modelId = func.param.modelId;
                    //                     var tableId = func.param.tableId;

                    //                     var sourceFilePath = '/' + Brightics.VA.Env.Session.userId + '/' + modelId + '/' + tableId;
                    //                     var targetFilePath = '/' + opt.publishReportId + '/' + modelId + '/' + tableId;

                    //                     Brightics.VA.RepositoryQueryTemplate.copy(sourceFilePath, targetFilePath, {blocking: true}).done(function () {
                    //                         resolve();
                    //                     }).fail(function (err) {
                    //                         reject(err);
                    //                     });
                    //                 });
                    //                 promises.push(promise);
                    //             }
                    //         }
                    //     }
                    //     /* eslint-enable */

                    //     Promise.all(promises).then(function () {
                    //         _this.publishReport(opt);
                    //     }, function (error) {
                    //         Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(error)
                    //     });
                    // }
                },
                title: Brightics.locale.common.newPublishing
            })
        });
    };

    PublishReportDialog.prototype.updatePublishReport = function (opt) {
        var _this = this;

        var publishContents = $.extend(true, {}, opt.publishContents);
        for (var p in publishContents.data.contents.report.pages) {
            for (var c in publishContents.data.contents.report.pages[p].contents) {
                delete publishContents.data.contents.report.pages[p].contents[c].options.source;
            }
        }
        for (var i in  publishContents.data.contents.functions) {
            var datasource = publishContents.data.contents.functions[i];
            if (datasource.func === Brightics.VA.Implementation.Visual.DATASOURCE_TYPE.ALLUXIO) {
                datasource.param.publishId = opt.publishReportId;
            } else if (datasource.func === Brightics.VA.Implementation.Visual.DATASOURCE_TYPE.STAGING) {
                if (!(datasource.param.scheduleId)) {
                    datasource.param.publishId = opt.publishReportId;
                }
            }
        }

        publishContents.data.contents.preference = localStorage;

        var options = {
            url: 'publishreports/'+ opt.publishReportId + '/update',
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            blocking: true,
            data: JSON.stringify({
                publishId: opt.publishReportId,
                publishingTitle: opt.label,
                publisher: Brightics.VA.Env.Session.userId,
                projectId: opt.publishContents.data.project_id,
                modelId: opt.publishContents.data.id,
                publishContents: publishContents,
                url: opt.url
            })
        };
        $.ajax(options).done(function () {
            _this.showPublishInfo();
        });
    };

    PublishReportDialog.prototype.publishReport = function (opt) {
        var _this = this;

        var publishContents = $.extend(true, {}, this.editorInput);
        for (var p in publishContents.data.contents.report.pages) {
            for (var c in publishContents.data.contents.report.pages[p].contents) {
                delete publishContents.data.contents.report.pages[p].contents[c].options.source;
            }
        }
        for (var i in  publishContents.data.contents.functions) {
            var datasource = publishContents.data.contents.functions[i];
            if (datasource.func === Brightics.VA.Implementation.Visual.DATASOURCE_TYPE.ALLUXIO) {
                datasource.param.publishId = opt.publishReportId;
            } else if (datasource.func === Brightics.VA.Implementation.Visual.DATASOURCE_TYPE.STAGING) {
                if (!(datasource.param.scheduleId)) {
                    datasource.param.publishId = opt.publishReportId;
                }
            }
        }

        publishContents.data.contents.preference = localStorage;

        var options = {
            url: 'publishreports',
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            blocking: true,
            data: JSON.stringify({
                publishId: opt.publishReportId,
                publishingTitle: opt.label,
                publisher: Brightics.VA.Env.Session.userId,
                projectId: this.editorInput.data.project_id,
                modelId: this.editorInput.data.id,
                publishContents: publishContents,
                url: opt.url
            })
        };
        $.ajax(options).done(function () {
            _this.showPublishInfo();
        });
    };

    PublishReportDialog.prototype.createModifyButton = function ($parent) {
        var _this = this;

        $parent.append($('<input type="button" class="brtc-va-dialogs-publish-management-modify" value="'+Brightics.locale.common.modify+'">'));

        this.$modifyButton = $parent.find('.brtc-va-dialogs-publish-management-modify').jqxButton({
            disabled: true,
            theme: Brightics.VA.Env.Theme
        });

        this.$modifyButton.click(function () {
            var selectedIndexes = _this.$publishGrid.jqxGrid('getselectedrowindexes');
            var rowData = _this.$publishGrid.jqxGrid('getrowdata', selectedIndexes[0]);
           
            _this.updateContents($parent, rowData.publish_id);
        });
    };

    PublishReportDialog.prototype.createDeleteButton = function ($parent) {
        var _this = this;

        $parent.append($('<input type="button" class="brtc-va-dialogs-publish-management-delete" value="'+Brightics.locale.common.delete+'">'));

        this.$deleteButton = $parent.find('.brtc-va-dialogs-publish-management-delete').jqxButton({
            disabled: true,
            theme: Brightics.VA.Env.Theme
        });
        this.$deleteButton.click(function () {
            var closeHandler = function (dialogResult) {
                if (dialogResult.OK) {
                    var selectedIndexes = _this.$publishGrid.jqxGrid('getselectedrowindexes');
                    for (var i in selectedIndexes) {
                        var data = _this.$publishGrid.jqxGrid('getrowdata', selectedIndexes[i]);
                        var opt = {
                            url: 'publishreports/' + data.publish_id + '/delete',
                            type: 'POST',
                            contentType: 'application/json; charset=utf-8',
                            data: JSON.stringify(data),
                            blocking: true
                        };
                        $.ajax(opt).done(function () {
                            _this.showPublishInfo();
                        });
                    }
                }
            };

            var options = {
                contentText: 'Are you sure you want to delete these items?',
                close: closeHandler,
                isCancel: true
            };
            Brightics.VA.Core.Utils.WidgetUtils.createCommonConfirmDialog($parent, options);
        });
    };

    PublishReportDialog.prototype.scheduleHeaderRenderer = function (value) {
        return '' +
            '<div style="margin-left: 30px; opacity:0.8; font-family: Arial; font-size: 16px; font-weight: bold; text-align: center; color: rgba(0, 0, 0, 0.8); float: left;" title="Error / Active / Inactive">' + value + '</div>' +
            '<div class="brtc-va-dialogs-schedule-icon-help" style="margin-top: 16px;" title="Error / Active / Inactive"></div>';
    };

    PublishReportDialog.prototype.createPublishGrid = function ($parent) {
        var _this = this;
        $parent.append($('<div class="brtc-va-dialogs-publish-management-grid"></div>'));

        this.$publishGrid = $parent.find('.brtc-va-dialogs-publish-management-grid').jqxGrid({
            theme: Brightics.VA.Env.Theme,
            // source: dataAdapter,
            width: '100%',
            height: 'calc(100% - 38px)',
            altrows: false,
            filterable: false,
            sortable: false,
            columnsresize: false,
            selectionmode: 'checkbox',
            showfiltercolumnbackground: false,
            rowsheight: 53,
            enabletooltips: true,
            columns: [
                {
                    text: 'ID',
                    datafield: 'publish_id',
                    align: 'center',
                    cellclassname: 'brtc-grid-cell-bold',
                    hidden: true
                },
                {
                    text: 'Publishing Title',
                    datafield: 'publishing_title',
                    renderer: _this.gridV2Renderer,
                    align: 'center',
                    cellclassname: 'brtc-grid-cell-bold',
                    width: '20%',
                    cellsrenderer: _this.titleRenderer.bind(this)
                },
                {
                    text: 'Publishing Date',
                    datafield: 'publishing_date',
                    renderer: _this.gridV2Renderer,
                    align: 'center',
                    width: '20%',
                    cellsalign: 'center',
                    cellclassname: 'brtc-grid-cell-bold',
                    cellsformat: 'yyyy-MM-dd HH:mm:ss'
                },
                {
                    text: 'Publisher',
                    datafield: 'publisher',
                    renderer: _this.gridV2Renderer,
                    align: 'center',
                    cellsalign: 'center',
                    cellclassname: 'brtc-grid-cell-bold',
                    width: '20%'
                },
                {
                    text: 'Schedule',
                    datafield: 'schedule',
                    renderer: _this.scheduleHeaderRenderer,
                    cellsrenderer: _this.scheduleRenderer,
                    align: 'center',
                    cellsalign: 'center',
                    cellclassname: 'brtc-grid-cell-bold',
                    width: 'auto'
                },
                {
                    text: 'Embed Code',
                    datafield: 'embed_code',
                    renderer: _this.gridV2Renderer,
                    align: 'center',
                    cellclassname: 'brtc-grid-cell-bold',
                    width: '12%',
                    cellsrenderer: _this.buttonRenderer,
                    sortable: false,
                    menu: false
                },
                {
                    text: 'Link',
                    datafield: 'link',
                    renderer: _this.gridV2Renderer,
                    align: 'center',
                    cellclassname: 'brtc-grid-cell-bold',
                    width: '12%',
                    cellsrenderer: _this.buttonRenderer,
                    sortable: false,
                    menu: false
                }
            ]
        });

        this.$publishGrid.on('cellclick', function (event) {
            event.preventDefault();
            if (!$(event.args.originalEvent.target).hasClass('brtc-va-publish-button')) return;
            var _rowData = _this.$publishGrid.jqxGrid('getrowdata', event.args.rowindex);
            var link = '';
            var dialogLabel = '';
            var subPathUrl = '';

            if(Brightics.VA.Env.Session.subPath){
                subPathUrl = '/' + Brightics.VA.Env.Session.subPath;
            }

            var id = (_rowData.url)? _rowData.url : _rowData.publish_id;

            if (event.args.datafield === 'embed_code') {
                link = '<iframe style="width:900px; height:600px;" src="' + location.origin + subPathUrl + "/publish/" + id + '?title=' + _rowData.publishing_title + '"></iframe>';
                dialogLabel = 'Embed Code';

                _this.copy(link, dialogLabel);

            } else if (event.args.datafield === 'link') {
                link = location.origin + subPathUrl + '/publish/' + id + '?title=' + _rowData.publishing_title;
                dialogLabel = 'Link';

                _this.copy(link, dialogLabel);

            } 
        });

        this.showPublishInfo($parent);

        this.setGridStyleV2(this.$publishGrid);

        var selectCallback = function () {
            var selectedIndexes = _this.$publishGrid.jqxGrid('getselectedrowindexes');
            if (selectedIndexes.length > 0) {
                if (selectedIndexes.length === 1) _this.$modifyButton.jqxButton({disabled: false});
                else _this.$modifyButton.jqxButton({disabled: true});
                _this.$deleteButton.jqxButton({disabled: false});
                _this.$deleteButton.css('cursor', 'pointer');
            } else {
                _this.$modifyButton.jqxButton({disabled: true});
                _this.$deleteButton.jqxButton({disabled: true});
                _this.$deleteButton.css('cursor', 'default');
            }
        };

        this.$publishGrid.on('rowselect', selectCallback.bind(_this));
        this.$publishGrid.on('rowunselect', selectCallback.bind(_this));
    };

    PublishReportDialog.prototype.updateContents = function ($parent, id) {
        var _this = this;

        new Brightics.VA.Implementation.Visual.Dialogs.UpdateContentsDialog($parent, {
            publish_id: id,
            title: Brightics.locale.common.updateContents,
            close: function (event) {
                if (event.OK) {
                    var opt = {
                        modelId: event.modelId,
                        projectId: event.projectId,
                        publishReportId: event.publish_id,
                    };

                    var promises = [];

                    var report = Studio.getResourceManager().getFile(opt.projectId, opt.modelId);

                    for (var i in  report.getContents().functions) {
                        if (report.getContents().functions[i].func === Brightics.VA.Implementation.Visual.DATASOURCE_TYPE.ALLUXIO) {
                            var promise = new Promise(function (resolve, reject) {
                                var func = report.getContents().functions[i];
                                var modelId = report.data.id;
                                var tableId = func[OUT_DATA];

                                var sourceFilePath = '/' + Brightics.VA.Env.Session.userId + '/' + modelId + '/' + tableId;
                                var targetFilePath = '/' + opt.publishReportId + '/' + modelId + '/' + tableId;

                                Brightics.VA.RepositoryQueryTemplate.copy(sourceFilePath, targetFilePath, {blocking: true}).done(function () {
                                    resolve();
                                }).fail(function (err) {
                                    reject(err);
                                });
                            });
                            promises.push(promise);
                        } else if (report.getContents().functions[i].func === Brightics.VA.Implementation.Visual.DATASOURCE_TYPE.STAGING) {
                            if (!(report.getContents().functions[i].param.scheduleId)) {
                                var promise = new Promise(function (resolve, reject) {
                                    var func = report.getContents().functions[i];
                                    var modelId = func.param.modelId;
                                    var tableId = func.param.tableId;

                                    var sourceFilePath = '/' + Brightics.VA.Env.Session.userId + '/' + modelId + '/' + tableId;
                                    var targetFilePath = '/' + opt.publishReportId + '/' + modelId + '/' + tableId;

                                    Brightics.VA.RepositoryQueryTemplate.copy(sourceFilePath, targetFilePath, {blocking: true}).done(function () {
                                        resolve();
                                    }).fail(function (err) {
                                        reject(err);
                                    });
                                });
                                promises.push(promise);
                            }
                        }
                    }

                    opt.publishContents = report;

                    Promise.all(promises).then(function () {
                        _this.updatePublishReport(opt);
                        // _this.publishReport(opt);
                    }, function (error) {
                        Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(error)
                    });
                }
            }
        });
    };

    PublishReportDialog.prototype.copy = function (link, label) {
        var agent = navigator.userAgent.toLowerCase();

        if (agent.indexOf('chrome') != -1) {
            try {
                var textField = document.createElement('textarea');
                textField.innerText = link;
                document.body.appendChild(textField);
                textField.focus();
                document.execCommand('selectAll');
                document.execCommand('copy');
                textField.style.display = 'none';
                Brightics.VA.Core.Utils.WidgetUtils.openInformationDialog(label + ' Copied to clipboard.', function () {
                    textField.remove();
                });
            } catch (err) {
                Brightics.VA.Core.Utils.WidgetUtils.openInformationDialog('Cannot copy to clipboard - System Error');
            }
        } else if (agent.indexOf('msie') != -1 || agent.indexOf('trident') != -1) {
            try {
                window.clipboardData.setData("Text", link);
                Brightics.VA.Core.Utils.WidgetUtils.openInformationDialog(label + ' Copied to clipboard.');
            } catch (err) {
                Brightics.VA.Core.Utils.WidgetUtils.openInformationDialog('Cannot copy to clipboard - System Error');
            }
        }
    };

    PublishReportDialog.prototype.showPublishInfo = function ($parent) {
        var _this = this;
        var option = {
            url: 'publishreports',
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            blocking: false
        };
        $.ajax(option).done(function (data) {
            var callback = function (ip) {
                _this.ip = ip;

                _this.getSchedule(data);
            };
            _this.getIp(callback);

        }).fail(function (err) {
            Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(err);
        });
    };

    PublishReportDialog.prototype.getSchedule = function (publishData) {
        var _this = this;
        var option = {
            url: 'api/va/v2/schedules',
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            blocking: false
        };
        $.ajax(option).done(function (scheduleData) {
            _this.data = publishData;

            var AddScheduleStatusToPublishData = function (publishData, scheduleData) {
                for (var pIndex in publishData) {
                    var scheduleCount = 0,
                        errorCount = 0,
                        activeCount = 0,
                        inactiveCount = 0,
                        scheduleStatus = '';

                    var pFunctions = JSON.parse(publishData[pIndex].publishing_contents).contents.functions;

                    for (var fIndex in pFunctions) {
                        if (pFunctions[fIndex].param.scheduleId && pFunctions[fIndex].param.scheduleId != '') {
                            scheduleCount++;

                            var scheduleId = pFunctions[fIndex].param.scheduleId;
                            for (var sIndex in scheduleData) {
                                var schedule = scheduleData[sIndex];
                                if (scheduleId === schedule.scheduleId) {
                                    if ((schedule.scheduleStatus).toLowerCase() === 'error') errorCount++;
                                    else if ((schedule.isActive).toLowerCase() === 'y') activeCount++;
                                    else  inactiveCount++;
                                }
                            }
                        }
                    }

                    scheduleStatus = errorCount + '/' + activeCount + '/' + inactiveCount;

                    publishData[pIndex].schedule = scheduleStatus;
                }
                return publishData;
            };

            var source = {
                localdata: AddScheduleStatusToPublishData(publishData, scheduleData),
                datafields: [
                    {name: 'publish_id', type: 'string'},
                    {name: 'publishing_title', type: 'string'},
                    {name: 'publishing_date', type: 'date'},
                    {name: 'publisher', type: 'string'},
                    {name: 'schedule', type: 'string'},
                    {name: 'embed_code', type: 'string'},
                    {name: 'link', type: 'string'},
                    {name: 'project_id', type: 'string'},
                    {name: 'model_id', type: 'string'},
                    {name: 'url', type: 'string'}
                ],
                datatype: "json"
            };

            var adapter = new $.jqx.dataAdapter(source, {
                beforeLoadComplete: function (records) {
                    for (var r in records) {
                        records[r]['publishing_title'] = Brightics.VA.Core.Utils.WidgetUtils.convertHTMLSpecialChar(records[r]['publishing_title']);
                    }
                }
            });

            _this.$publishGrid.jqxGrid('source', adapter);
            _this.$publishGrid.jqxGrid('clearselection');

            _this.$headerAera.find('.brtc-admin-total-count').text(_this.data.length);

        }).fail(function (err) {
            Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(err);
        });
    };

    PublishReportDialog.prototype.getIp = function (callBack) {
        var option = {
            url: 'publishreports/ip',
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            blocking: false
        };
        $.ajax(option).done(function (data) {
            callBack(data);

        }).fail(function (err) {
            Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(err);
        });
    };

    PublishReportDialog.prototype.scheduleRenderer = function (row, column, value) {
        var valArr = value.split('/');
        var error = valArr[0],
            active = valArr[1],
            inactive = valArr[2];

        return '' +
            '<div style="float: left; margin-left: 45px; height:53px; line-height:53px; color:red;">' + error + '</div>' +
            '<div style="float: left; margin-left: 5px; margin-right: 5px; height:53px; line-height:53px;"> / </div>' +
            '<div style="float: left; height:53px; line-height:53px; color:green;">' + active + '</div>' +
            '<div style="float: left; margin-left: 5px; margin-right: 5px; height:53px; line-height:53px;"> / </div>' +
            '<div style="float: left; height:53px; line-height:53px; color:grey;">' + inactive + '</div>';
    };

    PublishReportDialog.prototype.buttonRenderer = function (row, datafield, value) {
        if (datafield === 'embed_code') {
            return '<div class="brtc-float-left" index="' + row + '"><div class="brtc-va-publish-button code">Copy</div></div>';
        } else {
            return '<div class="brtc-float-left" index="' + row + '"><div class="brtc-va-publish-button link">Copy</div></div>';
        }
    };

    PublishReportDialog.prototype.titleRenderer = function (row, datafield, value) {
        var _this = this;
        var _rowData = _this.$publishGrid.jqxGrid('getrowdata', row);

        var isNew = false;
        isNew = _this.checkNew(_rowData.publishing_date);

        var domStr = '' +
            '<div class="brtc-style-flex-center">' +
            '   <div class="brtc-va-publish-title" style="float: left" index="' + row + '" title="' + value + '">' + value + '</div>';

        if (isNew) {
            var makeNewIcon = _this.addNewIcon(domStr);
            makeNewIcon += '</div>';
            return makeNewIcon;
        } else {
            domStr += '</div>';
            return domStr;
        }
    };

    PublishReportDialog.prototype.checkNew = function (p_date) {
        if (Brightics.VA.Core.Utils.CommonUtils.getTimeDifferenceFromNow(p_date) < 24) {
            return true;
        }
        return false;
    };

    PublishReportDialog.prototype.addNewIcon = function (domStr) {
        domStr += '   <div class="brtc-va-publish-title-new"></div>';
        return domStr;
    };

    PublishReportDialog.prototype.createDialogContentsArea = function ($parent) {
        $parent.append('' +
            '<div class="brtc-va-dialogs-publish-management-header"></div>' +
            '<div class="brtc-va-dialogs-publish-management-body"></div>' +
            '');

        this.$headerAera = $parent.find('.brtc-va-dialogs-publish-management-header');
        this.$bodyAera = $parent.find('.brtc-va-dialogs-publish-management-body');

        this.createSumArea(this.$headerAera);
        this.createDeleteButton(this.$headerAera);
        this.createModifyButton(this.$headerAera);
        this.createNewButton(this.$headerAera);
        this.createPublishGrid(this.$bodyAera);
    };

    PublishReportDialog.prototype.createSumArea = function ($parent) {
        var _this = this;
        var $sumArea = $('' +
            '<div class="brtc-va-dialogs-publish-management-header-sum">' +
            '   <span>Total<strong class="brtc-admin-total-count"></strong></span>' +
            '</div>');
        $parent.append($sumArea);
    };


    PublishReportDialog.prototype.setGridStyleV2 = function ($grid) {
        $grid.addClass('GridStyleV2');

        $grid.css({
            'height': 'calc(100% - 35px) !important',
            'margin-top': '15px !important',
            'margin-bottom': '20px !important'
        });

        this.$mainControl.find('input[type=button]').width(100);
    };

    PublishReportDialog.prototype.gridV2Renderer = function (value) {
        return '<div style="opacity:0.8; font-family: Arial; font-size: 16px; font-weight: bold; text-align: center; color: rgba(0, 0, 0, 0.8);">' + value + '</div>';
    };

    PublishReportDialog.prototype.createDialogButtonBar = function ($parent) {
        Brightics.VA.Dialogs.Dialog.prototype.createDialogButtonBar.call(this, $parent);

        this.$okButton.val(Brightics.locale.common.done);
        this.$cancelButton.css({display: 'none'});
    };

    PublishReportDialog.prototype.handleOkClicked = function () {
        var _this = this;

        Brightics.VA.Dialogs.Dialog.prototype.handleOkClicked.call(this);
    };

    PublishReportDialog.prototype.getContentUnits = function () {
        return this.editorInput.getContents().report.pages.reduce(function (acc, cur) {
            return acc.concat(Object.values(cur.contents));
        }, []);
    };

    PublishReportDialog.prototype.getDataSources = function () {
        return this.editorInput.getContents().functions.slice();
    };

    PublishReportDialog.prototype.preparePublish = function (
            contentUnits,
            dataSources,
            modelId,
            publishId) {
        var _this = this;
        var staticChartContentUnits = contentUnits.filter(function (unit) {
            var dataSource = getDataSource(unit, dataSources);
            return unit.type === 'chart' && !dataSource.param.scheduleId
        });

        function launchBigDataJob(_opt) {
            return new Promise(function (resolve, reject) {
                var opt = _opt || {};
                var model = opt.model;
                var modelLauncher = opt.modelLauncher;
                var launchOptions = opt.launchOptions;

                var listeners = {
                    'success': function (res) {
                        resolve(res);
                    },
                    'fail': function (err) {
                        reject(err);
                    },
                    'catch': function (err) {
                        Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(err);
                        reject(err);
                    }
                };
                modelLauncher.launchModel(model, {}, launchOptions, listeners);
            });
        }

        function copyTable(source, destination) {
            return new Promise(function (resolve, reject) {
                Brightics.VA.RepositoryQueryTemplate.copy(source, destination, {
                    blocking: true
                }).done(function () {
                    resolve();
                }).fail(function (err) {
                    reject(err);
                });
            });
        }

        function deleteTable(target) {
            return new Promise(function (resolve, reject) {
                Brightics.VA.RepositoryQueryTemplate.delete(target, {
                    blocking: true
                }).done(function () {
                    resolve();
                }).fail(function (err) {
                    reject(err);
                });
            });
        }

        function getDataSource(contentUnit, dataSources) {
            return dataSources.find(function (ds) {
                return ds.fid === contentUnit.dataSourceId;
            });
        }

        function filterAsync(arr, asyncFn) {
            return Promise
                .all(arr.map(function (e, i) {
                    return Promise
                        .resolve()
                        .then(function () {
                            return asyncFn(e, i);
                        })
                        .then(function (res) {
                            return res ? e : undefined;
                        });
                }))
                .then(function (res) {
                    return res.filter(function (x) {
                        return typeof x !== 'undefined';
                    });
                });
        }

        function isStaging(dataSource) {
            return dataSource.func === Brightics.VA.Implementation.Visual.DATASOURCE_TYPE.STAGING;
        }

        function isBigData(chartContentUnit) {
            var dataSource = getDataSource(chartContentUnit, dataSources);
            var tid = getTidFromDataSource(dataSource);
            return Brightics.VA.Core.Utils.FullRenderingUtils.isBigData({
                modelId: modelId,
                tableId: tid,
                user: Brightics.VA.Env.Session.userId,
                isPublish: false
            });
        }

        function getMidFromDataSource(dataSource) {
            return isStaging(dataSource) ? dataSource.param.modelId : modelId; 
        }

        function getTidFromDataSource(dataSource) {
            var tid = FnUnitUtils.getOutTable(dataSource) ? FnUnitUtils.getOutTable(dataSource)[0] : '';
            if (isStaging(dataSource)) tid = dataSource.param.tableId;
            return tid;
        }

        function makeBigDataFnUnit(chartContentUnit, dataSource) {
            var options = chartContentUnit.options;
            var fn = Brightics.VA.Core.Utils.FullRenderingUtils.getFnUnit(options);
            Brightics.VA.Core.Utils.ModelUtils.extendParent(_this.editorInput.getContents(), fn);
            var inTid = getTidFromDataSource(dataSource);
            fn[IN_DATA][0] = inTid;
            fn[OUT_DATA][0] = inTid + fn.fid;
            return fn;
        }

        function copyAll(tids) {
            return tids.reduce(function (acc, tmp) {
                var source = tmp[0];
                var target = tmp[1];
                return acc.then(function () {
                    return copyTable(source, target);
                });
            }, Promise.resolve());
        }

        function deleteAll(tids) {
            return tids.reduce(function (acc, target) {
                return acc.then(function () {
                    return deleteTable(target);
                });
            }, Promise.resolve());
        }

        var stagingDataSources = dataSources.filter(isStaging);
        var pathForStagingCopy = stagingDataSources.map(function (ds) {
            var mid = getMidFromDataSource(ds);
            var tid = getTidFromDataSource(ds);
            return [
                ['', Brightics.VA.Env.Session.userId, mid, tid].join('/'),
                ['', Brightics.VA.Env.Session.userId, modelId, tid].join('/')
            ];
        });

        var copyStaging = copyAll(pathForStagingCopy);

        var prepareLaunch = copyStaging
            .then(function () {
                return filterAsync(staticChartContentUnits, isBigData);
            })
            .then(function (big) {
                var bigFnUnits = big
                    .map(function (bigUnit) {
                        var dataSource = getDataSource(bigUnit, dataSources);
                        var bigDataFnUnit = makeBigDataFnUnit(bigUnit, dataSource);
                        return [bigUnit, bigDataFnUnit];
                    })
                    .filter(function (x) {
                        return x[1].func !== 'dummy';
                    });

                var dummyModel = {
                    mid: modelId, 
                    links: [],
                    innerModels: {},
                    type: 'data',
                    title: 'Preparing publish...',
                    functions: bigFnUnits.map(function (e) {
                        return e[1];
                    })
                }
                return [bigFnUnits, dummyModel];
            });

        var getBigFnUnits = prepareLaunch
            .then(function (arg) {
                var bigFnUnits = arg[0];
                var dummyModel = arg[1];
                if (bigFnUnits.length === 0) {
                    return bigFnUnits;
                }
                return launchBigDataJob({
                    model: Brightics.VA.Core.Utils.ModelUtils.extendModel(dummyModel),
                    modelLauncher: Studio.getJobExecutor(),
                    launchOptions: {
                        user: Brightics.VA.Env.Session.userId,
                        mid: modelId,
                        hideDialog: true
                    }
                }).then(function () {
                    // permission error..
                    // return deleteAll(pathForStagingCopy.map(function (path) {
                    //     return path[1];
                    // }));
                    return true;
                }).then(function () {
                    return bigFnUnits;
                });
            });

        var getSourceTargets = getBigFnUnits
            .then(function (bigFnUnits) {
                return bigFnUnits.map(function (tmp) {
                    var content = tmp[0];
                    var fn = tmp[1];
                    var dataSource = getDataSource(content, dataSources);
                    var mid = getMidFromDataSource(dataSource);
                    var inTid = fn[OUT_DATA][0];
                    var outTid = Brightics.VA.Core.Utils
                        .FullRenderingUtils.getBigDataTargetTid(content, fn[IN_DATA][0]);
                    return [modelId, mid, inTid, outTid];
                })
                    .concat(dataSources.map(function (ds) {
                        var mid = getMidFromDataSource(ds);
                        var tid = getTidFromDataSource(ds);
                        return [mid, mid, tid, tid];
                    }))
                    .map(function (ids) {
                        return [
                            ['', Brightics.VA.Env.Session.userId, ids[0], ids[2]].join('/'),
                            ['', publishId, ids[1], ids[3]].join('/')
                        ];
                    });
            });

        return getSourceTargets.then(copyAll);
    };

    Brightics.VA.Implementation.Visual.Dialogs.PublishReportDialog = PublishReportDialog;

}).call(this);