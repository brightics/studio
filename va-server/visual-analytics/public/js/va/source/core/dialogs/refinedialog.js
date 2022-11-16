/**
 * Created by daewon77.park on 2016-07-28.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var MAX_STEP_LENGTH = 20;
    var ADDITIONAL_STEP_LENGTH = 0;
    var REFINE_STEPS = {
        'addColumnByRefine': {clazz: 'AddColumnDialog', validator: 'AddColumnValidator'},
        'selectColumn': {clazz: 'SelectColumnDialog', validator: 'AddColumnValidator'},
        'changeValue': {clazz: 'ChangeValueDialog', validator: 'AddColumnValidator'},
        'groupBy': {clazz: 'GroupByDialog', validator: 'AddColumnValidator'},
        'simpleFilter': {clazz: 'SimpleFilterDialog', validator: 'AddColumnValidator'},
        'advancedFilter': {clazz: 'AdvancedFilterDialog', validator: 'AddColumnValidator'},
        'sortByRefine': {clazz: 'SortDialog', validator: 'AddColumnValidator'}
    };

    function RefineDialog(parentId, options) {
        ADDITIONAL_STEP_LENGTH = 0;
        this.parentId = parentId;
        this.options = options;
        this.dialogResult = {
            OK: false,
            Cancel: true,
            param: {
                'functions': $.extend(true, [], options.fnUnit.param.functions)
            }
        };
        this.dialogResult.param.functions.splice(this.dialogResult.param.functions.length - 1, 1);
        this.retrieveParent();
        this.createControls();
        this.initContents();
        this.render();
    }

    RefineDialog.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    RefineDialog.prototype.createControls = function () {
        this.$mainControl = $('' +
            '<div class="brtc-va-dialogs-main">' +
            '   <div class="brtc-va-dialogs-body">' +
            '       <div class="brtc-va-dialogs-contents brtc-va-dialogs-refine-contents">' +
            '       </div>' +
            '       <div class="brtc-va-dialogs-buttonbar">' +
            '           <input type="button" class="brtc-va-dialogs-buttonbar-ok" value="OK" />' +
            '           <input type="button" class="brtc-va-dialogs-buttonbar-cancel" value="Cancel" />' +
            '       </div>' +
            '   </div>' +
            '</div>');

        this.$okButton = this.$mainControl.find('.brtc-va-dialogs-buttonbar-ok');
        this.$cancelButton = this.$mainControl.find('.brtc-va-dialogs-buttonbar-cancel');

        var _this = this;
        var jqxOpt = {
            theme: Brightics.VA.Env.Theme,
            title: 'Refine Data',
            width: 1024,
            height: 800,
            maxWidth: 1024,
            maxHeight: 800,
            modal: true,
            resizable: false,
            create: function () {
                $('.ui-dialog-titlebar-close', $(this).parent()).hide();
            },
            close: function () {
                _this.$mainControl.dialog('destroy');
                if (typeof _this.options.close == 'function') {
                    _this.options.close(_this.dialogResult);
                }
            }
        };
        this.$mainControl.dialog(jqxOpt);
    };

    RefineDialog.prototype.initContents = function () {
        var _this = this;
        _this.createDialogContentsArea(_this.$mainControl.find('.brtc-va-dialogs-contents'));

        _this.$okButton.jqxButton({
            theme: Brightics.VA.Env.Theme
        });
        _this.$okButton.click(_this.handleOkClicked.bind(_this));

        _this.$cancelButton.jqxButton({
            theme: Brightics.VA.Env.Theme
        });
        _this.$cancelButton.click(_this.handleCancelClicked.bind(_this));
    };

    RefineDialog.prototype.handleOkClicked = function () {
        var _this = this;
        var waringList = this.$mainControl.find('.brtc-va-refine-step-warning');
        if (waringList.length > 0) {
            var closeHandler = function (confirmResult) {
                if (confirmResult.OK) {
                    _this.dialogResult.OK = true;
                    _this.dialogResult.Cancel = false;
                    _this.$mainControl.dialog('close');
                }
            };
            var message = 'The steps you need to check exists. Do you want to continue?';
            Brightics.VA.Core.Utils.WidgetUtils.openConfirmDialog(message, closeHandler);
        } else {
            this.dialogResult.OK = true;
            this.dialogResult.Cancel = false;
            this.$mainControl.dialog('close');
        }

    };

    RefineDialog.prototype.handleCancelClicked = function () {
        var _this = this;
        _this.dialogResult.OK = false;
        _this.dialogResult.Cancel = true;
        this.$mainControl.dialog('close');
    };


    RefineDialog.prototype.createDialogContentsArea = function ($parent) {
        $parent.append('' +
            '<div class="brtc-va-dialogs-refine-toolbar-area">' +
            '   <div class="brtc-va-dialogs-refine-toolitem brtc-va-dialogs-refine-toolitem-addcolumn">Add Column</div>' +
            '   <div class="brtc-va-dialogs-refine-toolitem brtc-va-dialogs-refine-toolitem-changevalue">Change Value</div>' +
            '   <div class="brtc-va-dialogs-refine-toolitem brtc-va-dialogs-refine-toolitem-selectcolumn">Select Column</div>' +
            '   <div class="brtc-va-dialogs-refine-toolitem brtc-va-dialogs-refine-toolitem-simplefilter">Simple Filter</div>' +
            '   <div class="brtc-va-dialogs-refine-toolitem brtc-va-dialogs-refine-toolitem-advancedfilter">Advanced Filter</div>' +
            '   <div class="brtc-va-dialogs-refine-toolitem brtc-va-dialogs-refine-toolitem-sorter">Sorter</div>' +
            '   <div class="brtc-va-dialogs-refine-toolitem brtc-va-dialogs-refine-toolitem-groupby">Group-by</div>' +
            '</div>' +
            '<div class="brtc-va-dialogs-refine-left-area">' +
            '</div>' +
            '<div class="brtc-va-dialogs-refine-right-area">' +
            '   <div class="brtc-va-refine-step-container">' +
            '       <div class="brtc-va-refine-step-container-header">Applied Steps</div>' +
            '       <div class="brtc-va-refine-step-container-body">' +
            '       </div>' +
            '   </div>' +
            '</div>');

        $parent.find('.brtc-va-refine-step-container-body').perfectScrollbar();
        $parent.find('.brtc-va-refine-step-container-body').perfectScrollbar('update');

        var $openStep = $('' +
            '<div class="brtc-va-refine-step-open">' +
            '   <div class="brtc-va-refine-step-header-open">' +
            '       <div class="brtc-va-refine-step-label-open" id="open">Open</div>' +
            '   </div>' +
            '</div>'
        );
        $openStep.find('.brtc-va-refine-step-header-open').click(function () {
            _this.refreshData(-1);
        });

        $parent.find('.brtc-va-refine-step-container-body').append($openStep);
        $parent.find('.brtc-va-dialogs-refine-toolitem').jqxButton({
            theme: Brightics.VA.Env.Theme
        });

        var _this = this;
        var checkMaxStepLength = function (callback) {
            if (ADDITIONAL_STEP_LENGTH >= MAX_STEP_LENGTH) {
                Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('The maximum number of steps that can be added to refine data is ' + MAX_STEP_LENGTH + '.');
                return;
            }
            callback();
        };
        $parent.find('.brtc-va-dialogs-refine-toolitem-addcolumn').on('click', function () {
            var callback = function () {
                var doneCallBack = function (result) {
                    var options = {
                        func: 'addColumnByRefine',
                        in: _this.getInput(),
                        out: [Brightics.VA.Core.Utils.IDGenerator.table.id()],
                        columns: $.extend(true, [], result),
                        close: _this.dialogClosed.bind(_this),
                        force: false,
                        context : _this.options.context
                    };
                    _this.openStepDialog(options);
                };
                _this.getSchema(doneCallBack);
            };
            checkMaxStepLength(callback);
        });
        $parent.find('.brtc-va-dialogs-refine-toolitem-changevalue').on('click', function () {
            var callback = function () {
                var doneCallBack = function (result) {
                    var options = {
                        func: 'changeValue',
                        in: _this.getInput(),
                        out: [Brightics.VA.Core.Utils.IDGenerator.table.id()],
                        columns: $.extend(true, [], result),
                        close: _this.dialogClosed.bind(_this),
                        force: false,
                        context : _this.options.context
                    };
                    _this.openStepDialog(options);
                };
                _this.getSchema(doneCallBack);
            };
            checkMaxStepLength(callback);
        });
        $parent.find('.brtc-va-dialogs-refine-toolitem-selectcolumn').on('click', function () {
            var callback = function () {
                var doneCallBack = function (result) {
                    var options = {
                        func: 'selectColumn',
                        in: _this.getInput(),
                        out: [Brightics.VA.Core.Utils.IDGenerator.table.id()],
                        columns: $.extend(true, [], result),
                        close: _this.dialogClosed.bind(_this),
                        force: false,
                        context : _this.options.context
                    };
                    _this.openStepDialog(options);
                };
                _this.getSchema(doneCallBack);
            };
            checkMaxStepLength(callback);
        });
        $parent.find('.brtc-va-dialogs-refine-toolitem-simplefilter').on('click', function () {
            var callback = function () {
                var doneCallBack = function (result) {
                    var options = {
                        func: 'simpleFilter',
                        in: _this.getInput(),
                        out: [Brightics.VA.Core.Utils.IDGenerator.table.id()],
                        columns: $.extend(true, [], result),
                        close: _this.dialogClosed.bind(_this),
                        force: false,
                        context : _this.options.context
                    };
                    _this.openStepDialog(options);
                };
                _this.getSchema(doneCallBack);
            };
            checkMaxStepLength(callback);
        });
        $parent.find('.brtc-va-dialogs-refine-toolitem-advancedfilter').on('click', function () {
            var callback = function () {
                var doneCallBack = function (result) {
                    var options = {
                        func: 'advancedFilter',
                        in: _this.getInput(),
                        out: [Brightics.VA.Core.Utils.IDGenerator.table.id()],
                        columns: $.extend(true, [], result),
                        close: _this.dialogClosed.bind(_this),
                        force: false,
                        context : _this.options.context
                    };
                    _this.openStepDialog(options);
                };
                _this.getSchema(doneCallBack);
            };
            checkMaxStepLength(callback);
        });
        $parent.find('.brtc-va-dialogs-refine-toolitem-sorter').on('click', function () {
            var callback = function () {
                var doneCallBack = function (result) {
                    var options = {
                        func: 'sortByRefine',
                        in: _this.getInput(),
                        out: [Brightics.VA.Core.Utils.IDGenerator.table.id()],
                        columns: $.extend(true, [], result),
                        close: _this.dialogClosed.bind(_this),
                        force: false,
                        context : _this.options.context
                    };
                    _this.openStepDialog(options);
                };
                _this.getSchema(doneCallBack);
            };
            checkMaxStepLength(callback);
        });
        $parent.find('.brtc-va-dialogs-refine-toolitem-groupby').on('click', function () {
            var callback = function () {
                var doneCallBack = function (result) {
                    var options = {
                        func: 'groupBy',
                        in: _this.getInput(),
                        out: [Brightics.VA.Core.Utils.IDGenerator.table.id()],
                        columns: $.extend(true, [], result),
                        close: _this.dialogClosed.bind(_this),
                        force: false,
                        context : _this.options.context
                    };
                    _this.openStepDialog(options);
                };
                _this.getSchema(doneCallBack);
            };
            checkMaxStepLength(callback);
        });

    };

    RefineDialog.prototype.fillSpreadsheet = function ($parent, table, force) {
        $parent.empty();
        var _this = this;
        var doneCallback = function (result) {
            _this.$spreadsheet = $('<div class="brtc-va-refine-spreadsheet"></div>');
            $parent.empty();
            $parent.append(_this.$spreadsheet);

            var source = {
                localdata: result.data,
                datatype: 'array',
                datafields: $.map(result.columns, function (column, index) {
                    return {
                        name: '__' + column.name,
                        type: column.type,
                        map: '' + index
                    };
                })
            };

            var tableColumns = $.map(result.columns, function (column, index) {
                var col = {
                    text: column.name,
                    datafield: '__' + column.name,
                    width: 80
                };
                if (column.type == 'date') {
                    col.cellsformat = 'yyyy-MM-dd HH:mm:ss:fff';
                } else if (column.type == 'number') {
                    col.cellsformat = 'd';
                    col.cellsalign = 'right';
                } else if (column.type == 'string') {
                    col.cellsrenderer = function (row, column, value) {
                        var styleText = 'overflow:hidden; text-overflow:ellipsis; padding-bottom:2px; margin-right: 2px; margin-left: 4px; margin-top: 4px;';

                        var cellValue = this.owner.source.records[row][column];

                        if (cellValue === undefined || cellValue === '' || cellValue === null) {
                            var _localdata = this.owner.source._source.localdata[row],
                                _datafields = this.owner.source._source.datafields,
                                _objIndex = 0;

                            for (var i in _datafields) {
                                if (_datafields[i].name === column) {
                                    _objIndex = Number(_datafields[i].map);
                                    break;
                                }
                            }

                            if (_localdata[_objIndex] === undefined) {
                                return '<div style="' + styleText + 'color: #ff3333">undefined</div>';
                            } else if (_localdata[_objIndex] === null) {
                                return '<div align="right" style="' + styleText + 'color: #ff3333">null</div>';
                            } else if (_localdata[_objIndex] === '') {
                                return '<div align="right" style="' + styleText + '"></div>';
                            }
                        } else {
                            return '<div style="' + styleText + '">' + Brightics.VA.Core.Utils.WidgetUtils.convertHTMLSpecialChar(value) + '</div>';
                        }
                    }
                }
                return col;
            });
            tableColumns.unshift({
                text: 'No', sortable: false, menu: false, editable: false, groupable: false, draggable: false,
                datafield: '', width: 40,
                columntype: 'number',
                renderer: function (value) {
                    return '<div class="brtc-va-refine-spreadsheet-rownum-column">' + value + '</div>';
                },
                cellsformat: 'd', cellsalign: 'right',
                cellclassname: 'brtc-va-refine-spreadsheet-rownum-cell',
                cellsrenderer: function (row, column, value) {
                    return '<div align="right" style="margin:4px;">' + (value + 1) + '</div>';
                }
            });

            var dataAdapter = new $.jqx.dataAdapter(source);
            _this.$spreadsheet.jqxGrid({
                theme: Brightics.VA.Env.Theme,
                width: '100%',
                height: '100%',
                rowsheight: 25,
                source: dataAdapter,
                altrows: false,
                filterable: false,
                sortable: false,
                columnsresize: true,
                selectionmode: 'multiplecellsextended',
                columns: tableColumns
            });

            _this.$spreadsheet.on("columnclick", function (event) {
                if (event.args.column.text == "No") {
                    $(this).jqxGrid('autoresizecolumns');
                }
            });
        };
        var failCallback = function (err) {
            _this.$spreadsheet = $('<div class="brtc-va-refine-spreadsheet"></div>');
            $parent.empty();
            $parent.append(_this.$spreadsheet);
            _this.$spreadsheet.jqxGrid({
                theme: Brightics.VA.Env.Theme,
                width: '100%',
                height: '100%',
                rowsheight: 25,
                altrows: false,
                filterable: false,
                sortable: false,
                columnsresize: true,
                selectionmode: 'multiplecellsextended'
            });
        };
        if (force) {
            this.options.dataProxy.requestDataForce(table, doneCallback, failCallback);
        } else {
            this.options.dataProxy.requestData(table, doneCallback, failCallback);
        }


    };

    RefineDialog.prototype.dialogClosed = function (dialogResult) {
        var _this = this;
        if (dialogResult.OK) {
            _this.callFunction(dialogResult.FnUnit, dialogResult.force);
        }
    };

    RefineDialog.prototype.addStep = function (result) {
        var _this = this;
        var hasFnUnit = true;
        $.each(_this.dialogResult.param.functions, function (key, fnUnit) {
            if (fnUnit.fid && fnUnit.fid == result.fid) {
                _this.dialogResult.param.functions[key] = $.extend(true, {}, result);
                hasFnUnit = false;
                return;
            }
        });
        if (hasFnUnit) {
            _this.appendFnUnit(result);
            _this.appendStep(result);
        }

    };

    RefineDialog.prototype.callFunction = function (fnUnit, force) {
        var _this = this;
        fnUnit.parent = function () {
            var parent = $.extend(true, {}, _this.options.fnUnit.parent());
            parent.functions = [fnUnit];
            parent.links = [];
            return parent;
        };

        var newFnUnit = $.extend(true, {}, fnUnit);
        newFnUnit.param['additional-query'] = fnUnit.param['additional-query'];
        _this.addStep(fnUnit);
        var index = $.inArray(fnUnit.fid, $.map(_this.dialogResult.param.functions, function (fnUnit) {
            return fnUnit.fid;
        }));

        var listener = {
            'success': function (res) {
                _this.refreshData(index, force);
                _this.renderWarningStep(index + 1);
            },
            'catch': function (err) {
                Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog(err);
                _this.refreshData(index, force);
                _this.renderWarningStep(index);
            }
        };
        Studio.getJobExecutor().launchUnit(newFnUnit, {}, {}, listener)
    };

    RefineDialog.prototype.getInput = function () {
        if (this.$mainControl.find('.brtc-va-refine-step').length == 0) {
            return this.options.fnUnit[IN_DATA];
        } else {
            return this.dialogResult.param.functions[this.dialogResult.param.functions.length - 1][OUT_DATA];
        }
    };

    RefineDialog.prototype.getSchema = function (doneCallback, index) {
        var _this = this;
        var columns = [];

        if (this.$mainControl.find('.brtc-va-refine-step').length == 0) {
            columns = _this.options.columns;
            doneCallback(columns);
        } else {
            if (typeof index !== 'undefined') {
                if (index == 0) {
                    columns = _this.options.columns;
                    doneCallback(columns);
                } else {
                    this.options.dataProxy.requestSchema(_this.dialogResult.param.functions[index - 1][OUT_DATA][0],
                        function (result) {
                            columns = result.columns;
                            doneCallback(columns);
                        }, function (err) {
                        });
                }
            } else {
                this.options.dataProxy.requestSchema(_this.dialogResult.param.functions[this.dialogResult.param.functions.length - 1][OUT_DATA][0],
                    function (result) {
                        columns = result.columns;
                        doneCallback(columns);
                    }, function (err) {
                    });
            }

        }
        return columns;
    };

    RefineDialog.prototype.appendFnUnit = function (result) {
        this.dialogResult.param.functions.push(result);
    };

    RefineDialog.prototype.render = function () {
        var _this = this;
        if (this.dialogResult.param.functions.length) {
            var subFnUnits = this.dialogResult.param.functions;
            $.each(subFnUnits, function (key, value) {
                _this.appendStep(subFnUnits[key]);
            });
        }
        if (this.options.stepIdx != undefined)
            this.refreshData(this.options.stepIdx);
        else
            this.refreshData();
    };

    RefineDialog.prototype.refreshData = function (index, force) {
        var functions = this.dialogResult.param.functions;
        var $parent = this.$mainControl.find('.brtc-va-dialogs-refine-left-area');

        if (typeof index != 'undefined') {
            if (functions.length == 0) {
                this.fillSpreadsheet($parent, this.options.fnUnit[IN_DATA][0], force);
            } else {
                this.fillSpreadsheet($parent, index !== -1 ? functions[index][OUT_DATA][0] : this.options.fnUnit[IN_DATA][0], force);
            }
        } else {
            if (functions.length == 0) {
                this.fillSpreadsheet($parent, this.options.fnUnit[IN_DATA][0], force);
            } else {
                if (functions[functions.length - 1].fid) {
                    this.fillSpreadsheet($parent, functions[functions.length - 1][OUT_DATA][0], force);
                }
                else {
                    this.fillSpreadsheet($parent, this.options.fnUnit[IN_DATA][0], force);
                }
            }
        }
        this.renderSelectionStep(index);


    };

    RefineDialog.prototype.appendStep = function (fnUnit) {
        var _this = this;
        var $step = $('' +
            '<div class="brtc-va-refine-step">' +
            '   <div class="brtc-va-refine-step-header">' +
            '       <div class="brtc-va-refine-step-label">' + Brightics.VA.Core.Utils.WidgetUtils.convertHTMLSpecialChar(fnUnit.display.label) +
            '       </div>' +
            '   </div>' +
            '   <div class="brtc-va-refine-step-remove-button"></div>' +
            '   <div class="brtc-va-refine-step-open-button"></div>' +
            '</div>'
        );
        $step.find('.brtc-va-refine-step-header').click(function () {
            var $target = $(this).parents('.brtc-va-refine-step');
            var targetIndex = $target.prevAll('.brtc-va-refine-step').length;
            _this.refreshData(targetIndex);
        });
        $step.find('.brtc-va-refine-step-open-button').click(function (event) {
            event.stopPropagation();

            var $target = $(this).parents('.brtc-va-refine-step');
            var targetIndex = $target.prevAll('.brtc-va-refine-step').length;
            var functionsArray = _this.dialogResult.param.functions;
            var fnUnit = functionsArray[targetIndex];
            var doneCallBack = function (result) {
                var options = {
                    func: fnUnit.func,
                    fid: fnUnit.fid,
                    in: fnUnit[IN_DATA],
                    out: fnUnit[OUT_DATA],
                    columns: $.extend(true, [], result),
                    close: _this.dialogClosed.bind(_this),
                    param: fnUnit.param,
                    force: true,
                    context : _this.options.context
                }
                _this.openStepDialog(options);
            };
            _this.getSchema(doneCallBack, targetIndex);

        });
        this.$mainControl.find('.brtc-va-refine-step-container-body').append($step);

        $step.find('.brtc-va-refine-step-remove-button').click(function (event) {
            event.stopPropagation();
            var $target = $(this).parents('.brtc-va-refine-step');
            var targetIndex = $target.prevAll('.brtc-va-refine-step').length;

            _this.removeStep($target);
            _this.removeFnUnit(targetIndex);
            _this.refreshData(targetIndex - 1);
            _this.renderWarningStep(targetIndex);
        });
        ADDITIONAL_STEP_LENGTH++;

    };

    RefineDialog.prototype.renderSelectionStep = function (index) {
        var steps = this.$mainControl.find('.brtc-va-refine-step-header');
        var openStep = this.$mainControl.find('.brtc-va-refine-step-header-open')[0];
        $(steps).removeClass('brtc-va-refine-step-select');
        $(openStep).removeClass('brtc-va-refine-step-select');
        if (typeof index !== 'undefined') {
            if (index === -1) {
                $(openStep).addClass('brtc-va-refine-step-select');
            } else {
                $(steps[index]).addClass('brtc-va-refine-step-select');
            }
        } else {
            $(this.$mainControl.find('.brtc-va-refine-step-header')).last().addClass('brtc-va-refine-step-select');
        }


    };

    RefineDialog.prototype.renderWarningStep = function (index) {
        var steps = this.$mainControl.find('.brtc-va-refine-step-header');
        $(steps).removeClass('brtc-va-refine-step-warning');
        for (var i = index; i < steps.length; i++) {
            $(steps[i]).addClass('brtc-va-refine-step-warning');
        }

    };

    RefineDialog.prototype.openStepDialog = function (options) {
        var clazz = REFINE_STEPS[options.func].clazz;
        new Brightics.VA.Core.Dialogs.RefineSteps[clazz](this.$mainControl, options);
    };

    RefineDialog.prototype.removeStep = function ($target) {
        $target.remove();
        ADDITIONAL_STEP_LENGTH--;
    };

    RefineDialog.prototype.removeFnUnit = function (index) {
        var functionsArray = this.dialogResult.param.functions;

        if (index != functionsArray.length - 1) {
            functionsArray[index + 1][IN_DATA] = $.extend(true, [], functionsArray[index][IN_DATA]);
        }
        functionsArray.splice(index, 1);
    };

    Brightics.VA.Core.Dialogs.RefineDialog = RefineDialog;

}).call(this);