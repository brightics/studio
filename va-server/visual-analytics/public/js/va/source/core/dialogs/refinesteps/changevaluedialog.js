/**
 * Created by daewon77.park on 2016-08-20.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ChangeValueDialog(parentId, options) {
        Brightics.VA.Core.Dialogs.RefineSteps.StepDialog.call(this, parentId, options);
    }

    ChangeValueDialog.prototype = Object.create(Brightics.VA.Core.Dialogs.RefineSteps.StepDialog.prototype);
    ChangeValueDialog.prototype.constructor = ChangeValueDialog;

    ChangeValueDialog.prototype.getTitle = function () {
        return 'Change Value';
    };

    ChangeValueDialog.prototype.createDialogContentsArea = function ($parent) {
        var _this = this;
        $parent.append('' +
            '<div class="brtc-va-refine-changevalue-newcolumn-container"></div>' +
            '<div class="brtc-va-refine-changevalue-addbutton">+ Add New Column</div>');

        this.render();

        var $addButton = $parent.find('.brtc-va-refine-changevalue-addbutton').jqxButton({
            theme: Brightics.VA.Env.Theme
        });
        $addButton.click(function () {
            _this.createNewChangeValueItem();
            _this.checkValidation();
        });

        $parent.perfectScrollbar();
        $parent.perfectScrollbar('update');
    };

    ChangeValueDialog.prototype.render = function () {
        if (this.options.param) {
            var select = this.options.param.select;
            var res = select.split(' \n');
            if (res[res.length - 1] == '') {
                res.splice(res.length - 1, 1);
            }
            for (var i = 0; i < res.length; i++) {
                if (res[i].slice(-1) == ',') {
                    res[i] = res[i].substring(0, res[i].length - 1);
                }
            }
            var columnNames = $.map(this.options.columns, function (column) {
                return column.name;
            });
            for (var i = 0; i < res.length; i++) {
                if (columnNames[i] !== res[i]) {
                    var pos = res[i].lastIndexOf(' as ');
                    if (pos > -1) {
                        var changedValue = res[i].substring(0, pos).trim();
                        var changedColumn = res[i].substring(pos + 4).trim();
                        changedColumn = changedColumn.replace(/`/gi, '');
                        this.createNewChangeValueItem({
                            name: changedColumn,
                            value: changedValue
                        });
                    }

                }

            }

        } else {
            this.createNewChangeValueItem();
        }
        this.checkValidation();
    };

    ChangeValueDialog.prototype.createNewChangeValueItem = function (option) {
        var _this = this;
        var $parent = this.$mainControl.find('.brtc-va-refine-changevalue-newcolumn-container');
        var $item = $('' +
            '<div class="brtc-va-refine-changevalue-newcolumn-item">' +
            '   <div class="brtc-va-refine-changevalue-newcolumn-name"></div>' +
            '   <div class="brtc-va-refine-changevalue-newcolumn-assignor">= </div>' +
            '   <textarea class="brtc-va-refine-changevalue-newcolumn-value"></textarea>' +
            '   <div class="brtc-va-refine-changevalue-newcolumn-remove"></div>' +
            '</div>');
        $parent.append($item);

        var columnNameArray = $.map(this.options.columns, function (col, i) {
            return col.name;
        });
        var functionArray =
            [
                'ROUND()', 'MAX()', 'MIN()', 'SUM()', 'AVG()', 'OVER()', //Related to NUMBER
                'NVL()', 'CONCAT()', 'LPAD()', 'LTRIM()', 'RPAD()', 'RTRIM()', 'SUBSTR()', 'SUBSTRING()', //Related to STRING
                'FROM_UNIXTIME()', 'YEAR()', 'MONTH()', 'WEEKOFYEAR()' //Related to DATE
            ];
        var cm = CodeMirror.fromTextArea($item.find('.brtc-va-refine-changevalue-newcolumn-value')[0], {
            mode: "brtc-control",
            theme: "default",
            indentWithTabs: true,
            smartIndent: true,
            lineNumbers: false,
            matchBrackets: true,
            scrollbarStyle: "null",
            extraKeys: {"Ctrl-Space": "autocomplete"},
            hintOptions: {list: [].concat(columnNameArray, functionArray)}
        });

        cm.on("beforeChange", function (instance, change) {
            var newtext = change.text.join("").replace(/\n/g, ""); // remove ALL \n !
            if (change.update) change.update(change.from, change.to, [newtext]);
            return true;
        });

        cm.setSize('calc(100% - 190px)', '25px');
        // hint를 close하기 위해 Esc 누르는 경우, dialog가 같이 close되는 것 방지.
        Brightics.VA.Core.Utils.WidgetUtils.adjustCodeMirrorEsc(cm);

        var $columnsComboBox = $item.find('.brtc-va-refine-changevalue-newcolumn-name');
        // ColumnList
        this.data = [];
        this.data = this.options.columns;
        var widgetOptions = {
            rowCount: 1,
            multiple: false,
            showOpener: 'click',
            removable: false,
            fromModal: true
        };


        var columnList = this.createColumnList($columnsComboBox, widgetOptions, 'brtc-va-editors-sheet-controls-width-3', {
            height: '25px',
            'padding-left': '4px'
        });
        columnList.setItems(this.data);
        columnList.columnSelector.$mainControl.attr('isDialog', true);
        $columnsComboBox.data('columnList', columnList);

        $item.find('.brtc-va-refine-changevalue-newcolumn-remove').click(function () {
            $(this).closest('.brtc-va-refine-changevalue-newcolumn-item').remove();
            _this.checkValidation();
        });

        columnList.onChange(function (event, data) {
            _this.checkValidation();
        });

        cm.on('change', function (cMirror) {
            _this.checkValidation();
        });

        if (option) {
            columnList.setSelectedItems([option.name]);
            cm.setValue(option.value);
        }

        //임시
        //columnlist empty unit  불필요 margin 삭제
        $columnsComboBox.find('.brtc-va-editors-sheet-controls-columnselector-columncontainer-element-empty').css({
            'width': '100%',
            'margin-left': '0px'
        });
        // "=" div 위치 조정
        $item.find('.brtc-va-refine-changevalue-newcolumn-assignor').css({
            'text-align': 'left',
            'margin-left': '4px',
            'width': '16px'
        });
        //첫번째 item에 remove버튼 hide 기능
        //this.sortableStopCallback.hideRemoveButton(this, 'brtc-va-refine-changevalue-newcolumn-item', 'brtc-va-refine-changevalue-newcolumn-remove');
    };

    ChangeValueDialog.prototype.getSelectString = function () {
        var parentItem = this.$mainControl.find('.brtc-va-refine-changevalue-newcolumn-item');
        var selectString = '';
        var select = '';
        this.columnNameArray = [];
        this.validationData = [];


        var _this = this, changeColumns = [], selectStrings = [];
        $.each(parentItem, function (key, value) {
            var column = $(parentItem[key]).find('.brtc-va-refine-changevalue-newcolumn-name').data('columnList').getSelectedItems()[0];
            _this.columnNameArray[key] = column;
            var cm = $(parentItem[key]).find('.CodeMirror')[0].CodeMirror;
            var value = cm.getValue();
            selectString = value + ' as `' + column + '`';
            // selectString += (key < parentItem.length - 1) ? (', \n') : (' \n');
            changeColumns.push(column);
            selectStrings.push(selectString);
            _this.validationData.push({
                index: key,
                column: column,
                value: value
            });
        });


        var columnList = $.map(this.data, function (column) {
            return column.name;
        });
        // var columnList = this.getSelectSchema();
        var selectColumns = '';
        for (var i in columnList) {
            var existColumn = false;
            for (const changeColumn of changeColumns) {
                if (columnList[i] === changeColumn) {
                    selectColumns += selectStrings[j];
                    existColumn = true;
                    break;
                }
            }
            if (!existColumn) {
                selectColumns += '`' + columnList[i] + '`';
            }

            selectColumns += (i < columnList.length - 1) ? (', \n') : (' \n');
        }
        // select = selectColumns + selectString;

        return selectColumns;
    };

    ChangeValueDialog.prototype.getSelectSchema = function () {
        var selectColumnList = [];
        for (var i = 0; i < this.data.length; i++) {
            var cnt = 0;
            for (var j = 0; j < this.columnNameArray.length; j++) {
                if (this.data[i].name == this.columnNameArray[j]) {
                    break;
                } else {
                    cnt++;
                    if (cnt == this.columnNameArray.length) {
                        selectColumnList[i] = this.data[i].name;
                    }
                }
            }
        }
        return selectColumnList;
    };

    ChangeValueDialog.prototype.handleOkClicked = function () {
        // TODO
        if (this.problems.length > 0) {
            Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('There is a problem with some values.');
        } else {
            var select = this.getSelectString();
            var additionalQuery = '';

            this.buildFunctionUnit('Change Value', 'changeValue', select, additionalQuery);
            Brightics.VA.Core.Dialogs.RefineSteps.StepDialog.prototype.handleOkClicked.call(this);
        }
    };

    ChangeValueDialog.prototype.buildFunctionUnit = function (label, func, select, additionalQuery) {
        var fnUnit = this.DEFAULT_FN_UNIT;
        fnUnit.fid = this.options.fid ? this.options.fid : Brightics.VA.Core.Utils.IDGenerator.func.id();
        fnUnit.func = func;
        fnUnit.name = this.options.context === 'python' ? 'PythonScript' : 'SQLExecutor';
        fnUnit.inData = this.options.in;
        fnUnit.outData = this.options.out;
        fnUnit.param = {
            'select': select,
            'additional-query': additionalQuery
        };
        if (this.options.context === 'python') {
            fnUnit.param.script = this.buildScript(select, additionalQuery);
            fnUnit.param['out-table-alias'] = ['result'];
        }
        fnUnit.display = {
            'label': label
        };
        this.resultFnUnit = fnUnit;
    };

    ChangeValueDialog.prototype.buildScript = function (select, additionalQuery) {
        var script = this.DEFAULT_SCRIPT;
        var strSelect = select.replace(/\n/g, '');
        var strAdditionalQuery = additionalQuery.replace(/\n/g, '');
        script = script.replace('${SELECT_SQL}', strSelect);
        script = script.replace('${ADDITIONAL_QUERY}', strAdditionalQuery);
        return script;
    };


    ChangeValueDialog.prototype.renderValidation = function () {
        var _this = this;
        $.each(this.problems, function (key, problem) {
            var itemList = _this.$mainControl.find('.brtc-va-refine-changevalue-newcolumn-item');
            if (problem.code == 'BR-0033') {
                _this.createValidationContent($(itemList[problem.paramIndex]), problem);
            } else {
                _this.createValidationContent($(itemList[problem.paramIndex]), problem,
                    problem.param == 'Select column'//'Value'
                        ? $(itemList[problem.paramIndex]).find('.brtc-va-refine-changevalue-newcolumn-name')
                        : $(itemList[problem.paramIndex]).find('.CodeMirror'));
            }
            //임시
            // validation 전체에 margin-left
            _this.$mainControl.find('.brtc-va-refine-step-validation-tooltip').css('margin-left', '8px');

        });
    };

    ChangeValueDialog.prototype.checkValidation = function () {
        var _this = this;
        var itemList = this.$mainControl.find('.brtc-va-refine-changevalue-newcolumn-item');

        this.removeValidation();

        var selectedColumnNames = [];
        $.each(itemList, function (key, value) {
            var column = $(itemList[key]).find('.brtc-va-refine-changevalue-newcolumn-name').data('columnList').getSelectedItems()[0];

            var cm = $(itemList[key]).find('.CodeMirror')[0].CodeMirror;
            var value = cm.getValue();
            if (column === undefined && value === '') {
                _this.addProblem(_this.createProblem({
                    errorCode: 'BR-0033',
                    paramIndex: key,
                    param: 'Select column',
                    messageParam: ['Select column', 'Change value']
                }));
            } else if (column === undefined) {
                _this.addProblem(_this.createProblem({
                    errorCode: 'BR-0033',
                    paramIndex: key,
                    param: 'Select column',
                    messageParam: ['Select column']
                }));
            } else if (value === '') {
                _this.addProblem(_this.createProblem({
                    errorCode: 'BR-0033',
                    paramIndex: key,
                    param: 'Change value',
                    messageParam: ['Change value']
                }));
            }

            if (column) {
                if ($.inArray(column, selectedColumnNames) > -1) {
                    var messageParam = "Select column(s) - '"+ column + "' already exist.";
                    _this.addProblem(_this.createProblem({
                        errorCode: 'BR-0100',
                        paramIndex: key,
                        param: 'Select column',
                        messageParam: [messageParam]
                    }));
                }
                else {
                    selectedColumnNames.push(column);
                }
            }
        });
        this.renderValidation();
    };

    ChangeValueDialog.prototype.destroy = function () {
        this.destroyColumnSelector();
        this.$mainControl.dialog('destroy');
        if (typeof this.options.close == 'function') {
            this.options.close(this.dialogResult);
        }
    };

    Brightics.VA.Core.Dialogs.RefineSteps.ChangeValueDialog = ChangeValueDialog;

}).call(this);