/**
 * Created by gy84.bae on 2016-10-07.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function InputDataFrameEditorDialog(parentId, options) {
        Brightics.VA.Dialogs.Dialog.call(this, parentId, options);
    }

    InputDataFrameEditorDialog.prototype = Object.create(Brightics.VA.Dialogs.Dialog.prototype);
    InputDataFrameEditorDialog.prototype.constructor = InputDataFrameEditorDialog;

    InputDataFrameEditorDialog.prototype.createDialogContentsArea = function ($parent) {
        this.PARAM_COLUMN_NAMES = 'column-names';
        this.PARAM_TYPE_ARRAY = 'column-types';
        this.PARAM_DATA_ARRAY = 'data-array';

        if (this.options.context) {
            this.PARAM_COLUMN_NAMES = 'col_names';
            this.PARAM_TYPE_ARRAY = 'type_array';
            this.PARAM_DATA_ARRAY = 'data_array';
        }

        $parent.append($('<div class="brtc-va-dialogs-contents-grid-info">Max 36 columns, 100 rows</div>'));

        this.$gridArea = $('' +
            '<div class="brtc-va-dialogs-contents-grid-area">' +
            '   <div class="brtc-va-dialogs-contents-grid" style="width:100%; height:100%; box-sizing: border-box;"></div>' +
            '</div>');
        $parent.append(this.$gridArea);

        this.createGridArea(this.$gridArea.find('.brtc-va-dialogs-contents-grid'));
    };

    InputDataFrameEditorDialog.prototype.createGridArea = function ($parent) {
        var $tableWrapper = $('<div></div>');
        $parent.append($tableWrapper);
        var data = this.getLocalData();
        if (!data.length) data = [[]];
        this.handsontable = new Handsontable($tableWrapper.get(0), {
            data: data,
            width: 1340,
            height: 510,
            colWidths: 55,
            rowHeights: 23,
            rowHeaders: function (index) {
                if (index === 0) {
                    return '<span title="Column Name">Name</span>';
                } else {
                    return index;
                }
            },
            colHeaders: true,
            manualColumnResize: true,
            minCols: 36,
            minRows: 101,
            maxCols: 36,
            maxRows: 101,
            minSpareCols: 10,
            minSpareRows: 100,
            fixedRowsTop: 1,
            redo: false,
            undo: false,
            contextMenu: [
                'row_above',
                'row_below',
                '---------',
                'col_left',
                'col_right',
                '---------',
                'remove_row',
                'remove_col'
            ]
        });
    };

    InputDataFrameEditorDialog.prototype.getLocalData = function () {
        var _this = this;
        var localData = [];
    
        var columnNames = _this.options.fnUnit.param[_this.PARAM_COLUMN_NAMES];
        var dataArray = _this.options.fnUnit.param[_this.PARAM_DATA_ARRAY];
    
        if (columnNames.length) {
            localData.push($.extend(true, [], columnNames));
            localData = localData.concat($.extend(true, [], dataArray));
        }
        return localData;
    };

    InputDataFrameEditorDialog.prototype.getFormattedLocalData = function () {
        var _this = this;
        var localData = [];

        var columnNames = _this.options.fnUnit.param[_this.PARAM_COLUMN_NAMES];
        var dataArray = _this.options.fnUnit.param[_this.PARAM_DATA_ARRAY];

        if (columnNames.length > 0) {
            localData[0] = {};
            for (let i = 0; i < columnNames.length; i++) {
                localData[0][String.fromCharCode(i + 'A'.charCodeAt(0))] = columnNames[i];
            }

            for (let i = 0; i < dataArray.length; i++) {
                localData[(i + 1)] = {};
                for (var j = 0; j < dataArray[i].length; j++) {
                    localData[(i + 1)][String.fromCharCode(j + 'A'.charCodeAt(0))] = dataArray[i][j];
                }
            }
        }
        return localData;
    };

    InputDataFrameEditorDialog.prototype.handleOkClicked = function () {
        try {
            this.setRows();
            this.setColumnNames(this.getRows());
            this.setDataArray(this.getRows());
    
            this.dialogResult[this.PARAM_COLUMN_NAMES] = this.getColumnNames();
            this.dialogResult[this.PARAM_DATA_ARRAY] = this.getDataArray();
    
            this.dialogResult.OK = true;
            this.dialogResult.Cancel = false;
    
            this.$mainControl.dialog('close');
        }
        catch (err) {
            Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog(err.message);
        }
    };

    InputDataFrameEditorDialog.prototype.setRows = function () {
        var rows;
        if (this.handsontable) {
            rows = this.handsontable.getData();
        }
        if (this.jqxGrid) {
            rows = this.jqxGrid.jqxGrid('getrows');
        }
        this.rows = rows;
    };

    InputDataFrameEditorDialog.prototype.getRows = function () {
        return this.rows;
    };

    InputDataFrameEditorDialog.prototype.setColumnNames = function (rows) {
        if (this.isValidColumnNames(rows[0])) {
            var columnNames = [];
            if (Array.isArray(rows[0])) {
                for (var i = 0; i < rows[0].length; i++) {
                    if (rows[0][i]) columnNames.push(rows[0][i]);
                    else break;
                }
            } else {
                for (var key = 'A'; key <= 'Z'; key = String.fromCharCode((key).charCodeAt(0) + 1)) {
                    if (rows[0][key]) columnNames.push(rows[0][key]);
                    else break;
                }
            }
            this.columnNames = columnNames;
        } else {
            throw new Error(this.getValidationErrorMessage());
        }
    };

    InputDataFrameEditorDialog.prototype.getColumnNames = function () {
        return this.columnNames;
    };

    function _setHandsonDataArray(rows, dataArray, lastRowIndex) {
        var columnLength = this.getColumnNames().length;
        for (var i = 1; i < rows.length; i++) {
            dataArray[(i - 1)] = [];
            for (var j = 0; j < columnLength; j++) {
                if (rows[i][j]) lastRowIndex = i;
                if (rows[i][j] === undefined || rows[i][j] === null) {
                    dataArray[(i - 1)].push('');
                } else {
                    dataArray[(i - 1)].push(rows[i][j]);
                }
            }
        }
        return lastRowIndex;
    }

    InputDataFrameEditorDialog.prototype.setDataArray = function (rows) {
        var dataArray = [];
        var lastRowIndex = -1;

        if (rows[1]) {
            if (Array.isArray(rows[1])) {
                lastRowIndex = _setHandsonDataArray.call(this, rows, dataArray, lastRowIndex);
            } else {
                var lastKeyAscii ='A'.charCodeAt(0) + this.getColumnNames().length - 1;
                // String.fromCharCode('A'.charCodeAt(0) + this.getColumnNames().length - 1);

                for (var i = 1; i < rows.length; i++) {
                    dataArray[(i - 1)] = [];
                    for (var key = 'A'.charCodeAt(0); key <= lastKeyAscii; key = (key).charCodeAt(0) + 1) {
                        let keyStr = String.fromCharCode(key);
                        if (rows[i][keyStr]) lastRowIndex = i;
                        if (rows[i][keyStr] === undefined || rows[i][keyStr] === null) {
                            dataArray[(i - 1)].push('');
                        } else {
                            dataArray[(i - 1)].push(rows[i][keyStr]);
                        }
                    }
                }
            }
        }

        if (this.isValidDataArray(lastRowIndex)) {
            dataArray.splice(lastRowIndex, dataArray.length - lastRowIndex);
            this.dataArray = dataArray;
        } else {
            throw new Error(this.getValidationErrorMessage());
        }
    };

    InputDataFrameEditorDialog.prototype.getDataArray = function () {
        return this.dataArray;
    };

    InputDataFrameEditorDialog.prototype.isValidDataArray = function (lastRowIndex) {
        var isValid = true;
        if (lastRowIndex === -1) {
            this.validationErrorMessage = 'There is no data. Please input data.';
            isValid = false;
        }
        return isValid;
    };

    InputDataFrameEditorDialog.prototype.isValidColumnNames = function (columnNameData) {
        var isValid = true;

        var isExists = this.isExistsColumns(columnNameData);
        if (!isExists) {
            this.validationErrorMessage = 'There is no column. Please input column names in the first row.';
            return false;
        }

        var emptyColumns = this.getInvalidEmptyColumns(columnNameData);
        if (emptyColumns.length) {
            this.validationErrorMessage = 'All column names should be given but the column names of ' + JSON.stringify(emptyColumns) + ' are not given. Please check the input.';
            return false;
        }

        var invalidColumns = this.getInvalidColumnNames(columnNameData);
        if (invalidColumns.length) {
            this.validationErrorMessage = "All column names should start with alphabet characters. You can use alphabet, number, and '_' only. Please check the input in " + JSON.stringify(invalidColumns) + ".";
            return false;
        }

        var duplicatedColumns = this.getDuplicatedColumnNames(columnNameData);
        if (duplicatedColumns.length) {
            this.validationErrorMessage = 'There are columns of the same name. Column names do not distinguish upper and lower cases. Please check the column names. ' + JSON.stringify(duplicatedColumns) + '.';
            return false;
        }

        return isValid;
    };

    InputDataFrameEditorDialog.prototype.isExistsColumns = function (columnNameData) {
        var isExists = false;
    
        if (Array.isArray(columnNameData)) {
            for (const columnName of columnNameData) {
                if (columnName) {
                    isExists = true;
                    break;
                }
            }
        } else {
            for (var key = 'A'; key <= 'Z'; key = String.fromCharCode((key).charCodeAt(0) + 1)) {
                if (columnNameData[key]) {
                    isExists = true;
                    break;
                }
            }
        }
        return isExists;
    };

    InputDataFrameEditorDialog.prototype.getInvalidEmptyColumns = function (columnNameData) {
        var isEmpty = false;
    
        var lastElementIndex = -1;
        var emptyColumns = [];
    
        if (Array.isArray(columnNameData)) {
            for (let i = columnNameData.length - 1; i >= 0; i--) {
                let columnName = columnNameData[i];
                if (columnName) {
                    lastElementIndex = i;
                    break;
                }
            }
            for (let i = 0; i < lastElementIndex; i++) {
                let columnName = columnNameData[i];
                if (!columnName) {
                    var columnKey = this.convertIndex2ColumnKey(i);
                    emptyColumns.push(columnKey);
                }
            }
        } else {
            for (var key = 'A'; key <= 'Z'; key = String.fromCharCode((key).charCodeAt(0) + 1)) {
                if (columnNameData[key]) {
                    lastElementIndex = (key).charCodeAt(0) - 'A'.charCodeAt(0); //get ASCII code
                } else {
                    if (!isEmpty) {
                        isEmpty = true;
                    }
                    emptyColumns.push(key);
                }
            }
    
            emptyColumns = $.grep(emptyColumns, function (el, index) {
                return (((el).charCodeAt(0) - 'A'.charCodeAt(0)) < lastElementIndex);
            });
        }
        return emptyColumns;
    };

    InputDataFrameEditorDialog.prototype.getInvalidColumnNames = function (columnNameData) {
        var invalidColumnNames = [];
        if (Array.isArray(columnNameData)) {
            let reg1 = new RegExp('^[가-힣一-龥a-zA-Z0-9_]+$');
            let reg2 = new RegExp('^[0-9]+');
            for (const columnName of columnNameData) {
                if (columnName) {
                    var columnKey = this.convertIndex2ColumnKey(i);
                    if (!reg1.test(columnName) || reg2.test(columnName)) {
                        invalidColumnNames.push(columnKey);
                    }
                }
            }
        } else {
            for (var key = 'A'; key <= 'Z'; key = String.fromCharCode((key).charCodeAt(0) + 1)) {
                var target = columnNameData[key];
                if (target) {
                    let reg1 = new RegExp('^[가-힣一-龥a-zA-Z0-9_]+$');
                    let reg2 = new RegExp('^[0-9]+');
                    if (!reg1.test(target) || reg2.test(target)) {
                        invalidColumnNames.push(key);
                    }
                }
            }
        }
        return invalidColumnNames;
    };

    InputDataFrameEditorDialog.prototype.getDuplicatedColumnNames = function (columnNameData) {
        var duplicatedColumnNames = [];
        var hashMap = {};
    
        if (Array.isArray(columnNameData)) {
            for (const columnName of columnNameData) {
                if (columnName) {
                    let hasKey = columnName.toLowerCase();
                    var columnKey = this.convertIndex2ColumnKey(i);
                    if (hashMap[hasKey]) {
                        hashMap[hasKey].push(columnKey);
                    } else {
                        hashMap[hasKey] = [columnKey];
                    }
                }
            }
        } else {
            for (var key = 'A'; key <= 'Z'; key = String.fromCharCode((key).charCodeAt(0) + 1)) {
                let columnName = columnNameData[key];
                if (columnName) {
                    let hasKey = columnName.toLowerCase();
                    if (hashMap[hasKey]) {
                        hashMap[hasKey].push(key);
                    } else {
                        hashMap[hasKey] = [key];
                    }
                }
            }
        }
    
        for (var columnName in hashMap) {
            if (hashMap[columnName].length > 1) {
                duplicatedColumnNames = hashMap[columnName];
                break;
            }
        }
        return duplicatedColumnNames;
    };

    InputDataFrameEditorDialog.prototype.convertIndex2ColumnKey = function (index) {
        var columnKey = [];
        if (typeof index === 'string') index = parseInt(index);
        index = index + 1;
        while (index > 0) {
            var mod = (index - 1) % 26;
            columnKey.unshift(String.fromCharCode(65 + mod));
            index = parseInt((index - mod) / 26);
        }
        return columnKey.join('');
    };

    InputDataFrameEditorDialog.prototype.getValidationErrorMessage = function () {
        return this.validationErrorMessage;
    };

    Brightics.VA.Core.Dialogs.InputDataFrameEditorDialog = InputDataFrameEditorDialog;

}).call(this);