/**
 * Created by SDS on 2016-08-19.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function SqlEditorDialog(parentId, options) {
        Brightics.VA.Core.Dialogs.ScriptEditorDialog.call(this, parentId, options);
    }

    SqlEditorDialog.prototype = Object.create(Brightics.VA.Core.Dialogs.ScriptEditorDialog.prototype);

    SqlEditorDialog.prototype.createLayout = function () {
        this.$contentArea = this.$mainControl.find('.brtc-va-dialogs-contents');

        var scriptOnly = (this.options.scriptOnly)? this.options.scriptOnly : false;

        this.$editorArea = $('' +
            '<div class="brtc-va-dialogs-contents-statement sql" script-only="'+ scriptOnly +'">' +
            '   <textarea></textarea>' +
            '   <div class="brtc-va-dialogs-contents-statement-error">Up to ' + Brightics.VA.Core.Utils.CommonUtils.numberToStringWithComma(this.scriptEditorOptions.maxLength) + ' characters can be entered.</div>' +
            '</div>' +
            '');
        this.$errorArea = this.$editorArea.find('.brtc-va-dialogs-contents-statement-error');
        this.$infoArea = $('<div class="brtc-va-dialogs-contents-info sql" script-only="'+ scriptOnly +'">');
        this.$resultArea = $('<div class="brtc-va-dialogs-result sql">');
        this.$contentArea.append(this.$editorArea).append(this.$infoArea).append(this.$resultArea);
        this.$infoArea.perfectScrollbar();

        var _this = this;
        this.$mainControl.on('resized', function (event) {
            _this.$infoArea.perfectScrollbar('update');
        });
    };

    SqlEditorDialog.prototype.renderInfoArea = function ($parent, useTable) {
        this.renderTableAlias(this.$infoArea);
    };

    SqlEditorDialog.prototype.createInTableAlias = function ($parent) {
        var _this = this;
        var model = this.FnUnitUtils.getParent(this.options.fnUnit)

        var inTableList = this.FnUnitUtils.getInTable(this.options.fnUnit),
            inFunctionList = [];

        for (let i in inTableList) {
            inFunctionList.push(model.getFnUnitByOutTable(inTableList[i]));
        }
        this.tableAlias = [];
        //실제 in-table 목록만큼 그린다.
        for (let fnUnit of inFunctionList) {
            var label =   '#{DF(' + i + ')}';
            this.tableAlias.push('#{DF(' + i + ')}');

            var $aliasElement = $('' +
                '<div class="brtc-va-dialogs-scalaeditor-alias-element">' +
                '   <div class="brtc-va-dialogs-scalaeditor-alias-element-label">'+label+'</div>' +
                '</div>');

            var clazz = fnUnit.parent().type;
            var $item = $('<div class="brtc-va-editors-sheet-controls-dataselector-item single brtc-va-dialogs-scalaeditor-alias-element-item"></div>'),
                $selectedItem = Brightics.VA.Core.Utils.WidgetUtils.createPaletteItem($item, fnUnit.func, clazz);

            $selectedItem.find('.brtc-va-views-palette-fnunit-label')
                .text(fnUnit.display.label)
                .attr('variable', label);

            $item.attr('value', this.FnUnitUtils.getOutTable(this.options.fnUnit));

            $selectedItem.addClass('item');
            $aliasElement.append($item);

            $parent.append($aliasElement);

            $aliasElement.find('.brtc-va-views-palette-fnunit').click(function(){
                var addedText = $(this).find('.brtc-va-views-palette-fnunit-label').attr('variable');

                _this.codeMirror.setValue(_this.codeMirror.getValue()+' '+addedText);

                _this.selectMarker = _this.codeMirror.markText({line: 0, ch: 0}, {line: 0, ch: 7}, {
                    readOnly: true,
                    inclusiveLeft: true,
                    atomic: true
                });
            });
        }
    }

    SqlEditorDialog.prototype._getInTableLabel = function (index) {
        return `#{DF(${index})}`;
    };

    SqlEditorDialog.prototype.renderTableAlias = function ($parent) {
        var $inTableAlias = $('<div class="brtc-va-dialogs-reditor-alias-in"></div>');
        $parent.append($inTableAlias);
        var $inTableAliasBody = this.addPropertyControl('In Table Variable', $inTableAlias);
        this.createInTableAlias($inTableAliasBody);
    };

    SqlEditorDialog.prototype.addPropertyControl = function (label, $parent) {
        var $controlHeader = $('<div class="brtc-va-dialogs-reditor-alias-header">' + label + '</div>');
        var $controlBody = $('<div class="brtc-va-dialogs-reditor-alias-body"></div>');
        $parent.append($controlHeader).append($controlBody);
        return $controlBody;
    };

    SqlEditorDialog.prototype.setEditorStatement = function (statement) {
        this.codeMirror.setValue(statement);
        this.codeMirror.clearHistory();
        this.selectMarker = this.codeMirror.markText({line: 0, ch: 0}, {line: 0, ch: 7}, {
            readOnly: true,
            inclusiveLeft: true,
            atomic: true
        });
    };

    SqlEditorDialog.prototype.renderEditorArea = function () {
        var _this = this;
        this.codeMirror = CodeMirror.fromTextArea(this.$editorArea.find('textarea')[0], {
            mode: this.scriptEditorOptions.mode,
            theme: "default",
            indentWithTabs: true,
            smartIndent: true,
            lineNumbers: true,
            matchBrackets: true,
            autofocus: false,
            extraKeys: {
                "Ctrl-Space": "autocomplete",
                "Ctrl-Enter": function () {
                    _this.tempFnUnit = $.extend(true, {}, _this.options.fnUnit);
                    if (_this.tempFnUnit.func === 'queryExecutorPython') {
                        _this.tempFnUnit.outputs.out_table = _this.FnUnitUtils.getOutputs(_this.options.fnUnit).out_table;
                        _this.tempFnUnit.param.query = _this.codeMirror.getValue();
                    } else {
                        _this.tempFnUnit.outData = _this.FnUnitUtils.getOutputs(_this.options.fnUnit);
                        _this.tempFnUnit.param['full-query'] = _this.codeMirror.getValue();
                        _this.tempFnUnit.param['alias-names'] = _this.tableAlias;
                    }

                    Studio.getJobExecutor().launchUnit(_this.tempFnUnit, {}, {}, {
                        'catch': function _catch(err) {
                            Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(err);
                        },
                        'success': function _success(res) {
                            _this.refreshResult();
                        }
                    });
                }
            },
            hintOptions: {
                list: this.scriptEditorOptions.additionalHint
            }
        });

        // hint를 close하기 위해 Esc 누르는 경우, dialog가 같이 close되는 것 방지.
        Brightics.VA.Core.Utils.WidgetUtils.adjustCodeMirrorEsc(this.codeMirror);

        Brightics.VA.Core.Utils.WidgetUtils.setCodeMirrorMaxLength(this.codeMirror);

        this.setEditorStatement(this.options.statement);

        this.codeMirror.setSize('100%', '100%');
        this.codeMirror.setOption('maxLength', this.scriptEditorOptions.maxLength);
    };

    SqlEditorDialog.prototype.renderResultArea = function () {
        var _this = this;
        var testResultPanel = $('' +
            '<div class="brtc-va-dialogs-result-sql"></div>' +
            '<div class="brtc-va-dialogs-sql-test-button-area brtc-s-style-dialogs-sql-test-button-area">' +
            '   <input type="button" class="brtc-va-dialogs-sql-test-button brtc-s-style-dialogs-sql-test-button" value="Run" />' +
            '</div>');
        testResultPanel.find('.brtc-va-dialogs-sql-test-button').click(function () {
            _this.handleTestClicked();
        });
        this.$contentArea.find('.brtc-va-dialogs-result').append(testResultPanel);
    };

    SqlEditorDialog.prototype.handleTestClicked = function () {
        var _this = this;
        _this.tempFnUnit = $.extend(true, {}, _this.options.fnUnit);
        if (_this.tempFnUnit.func === 'queryExecutorPython' || _this.tempFnUnit.func === 'queryExecutorPython2') {
            _this.tempFnUnit.outputs.out_table = _this.FnUnitUtils.getOutputs(_this.options.fnUnit).out_table;
            _this.tempFnUnit.param.query = _this.codeMirror.getValue();
        } else {
            _this.tempFnUnit.outData = _this.FnUnitUtils.getOutputs(_this.options.fnUnit);
            _this.tempFnUnit.param['full-query'] = _this.codeMirror.getValue();
            _this.tempFnUnit.param['alias-names'] = _this.tableAlias;
        }

        Studio.getJobExecutor().launchUnit(_this.tempFnUnit, {}, {}, {
            'catch': function _catch(err) {
                Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(err);
            },
            'success': function _success(res) {
                _this.refreshResult(res);
            }
        });
    };

    SqlEditorDialog.prototype.refreshResult = function () {
        //Show Result
        var _this = this;

        for (var i in this.$resultPanelContent) {
            this.$resultPanelContent[i].remove();
        }

        this.$resultPanelContent = {};
        this.$resultSheet = {};

        var outTable = this.FnUnitUtils.getOutputs(_this.tempFnUnit);
        if (_this.tempFnUnit.func === 'queryExecutorPython' || _this.tempFnUnit.func === 'queryExecutorPython2') {
            outTable = outTable.out_table;
        } else {
            outTable = outTable[0];
        }
        Brightics.VA.Core.DataQueryTemplate.queryData(this.options.fnUnit.parent().mid, outTable, 0, 1000, function (data, tableId) {
            _this.createResultPanelContent(outTable, data);
        }, function (err) {
            Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(err);
        }, false);
    };

    SqlEditorDialog.prototype.createResultPanelContent = function (tableId, data) {
        this.$resultPanelContent[tableId] = $('' +
            '<div class="brtc-va-dialogs-result-sql-panel-content">' +
            '</div>');

        this.$mainControl.find('.brtc-va-dialogs-result-sql').append(this.$resultPanelContent[tableId]);

        this.createResultContents(this.$resultPanelContent[tableId], tableId, data);
    };

    SqlEditorDialog.prototype.createResultContents = function ($parent, tableId, data) {

        this.$resultSheet[tableId] = $('' +
            '<div>' +
            '   <div class="brtc-va-dialogs-result-sql-panel-content-chart-area"></div>' +
            '</div>');
        $parent.append(this.$resultSheet[tableId]);
        this.createResultGrid(tableId, data);
    };

    SqlEditorDialog.prototype.createResultGrid = function (tableId, result) {
        var $spreadsheet = $('<div class="brtc-va-dialogs-result-sql-panel-spreadsheet"></div>');
        this.$resultSheet[tableId].find('.brtc-va-dialogs-result-sql-panel-content-chart-area').append($spreadsheet);

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
            if (column.type === 'date') {
                col.cellsformat = 'yyyy-MM-dd HH:mm:ss:fff';
            } else if (column.type === 'number') {
                col.cellsformat = 'd';
                col.cellsalign = 'right';
            } else if (column.type === 'string') {
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

                    return undefined;
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
        $spreadsheet.jqxGrid({
            theme: Brightics.VA.Env.Theme,
            width: '100%',
            height: '200',
            rowsheight: 25,
            source: dataAdapter,
            altrows: false,
            filterable: false,
            sortable: false,
            columnsresize: true,
            selectionmode: 'multiplecellsextended',
            columns: tableColumns
        });

        $spreadsheet.on("columnclick", function (event) {
            if (event.args.column.text === "No") {
                $(this).jqxGrid('autoresizecolumns');
            }
        });
    }

    SqlEditorDialog.prototype.destroy = function () {
        Brightics.VA.Dialogs.Dialog.prototype.destroy.call(this);
    };

    SqlEditorDialog.prototype.getTitle = function () {
        return 'SQL';
    };

    Brightics.VA.Core.Dialogs.SqlEditorDialog = SqlEditorDialog;

}).call(this);