/**
 * Created by SDS on 2016-09-01.
 */

/* global crel */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function SetColumnDataTypePage(parentId, options) {
        this.options = options;
        this.options.class = 'setcolumndatatypepage';
        this.columnType = {
            'double': 'Double',
            'string': 'String',
            'integer': 'Integer',
            'long': 'Long',
            'boolean': 'Boolean'
        };
        Brightics.VA.Core.Wizards.Pages.WizardPage.call(this, parentId, this.options);

        var _this = this;
        this.options.wizard.addEventListener('changeData', function (event, eventData) {
            if (eventData) {
                _this.options.wizard.result.columnName = [];
                _this.options.wizard.result.columnType = [];
                if (_this.$grid) {
                    _this.clearGridColumnSelection();
                    _this.clearSearchInput();
                    _this.removeGridColumnFilter();
                }
            }
        });

        this.options.wizard.addEventListener('changeDelimiter', function (event, eventData) {
            if (eventData) {
                _this.options.wizard.result.columnName = [];
                _this.options.wizard.result.columnType = [];
                if (_this.$grid) {
                    _this.clearGridColumnSelection();
                    _this.clearSearchInput();
                    _this.removeGridColumnFilter();
                }
            }
        });
    }

    SetColumnDataTypePage.prototype = Object.create(Brightics.VA.Core.Wizards.Pages.WizardPage.prototype);
    SetColumnDataTypePage.prototype.constructor = SetColumnDataTypePage;

    SetColumnDataTypePage.prototype.createHeaderArea = function ($parent) {
        Brightics.VA.Core.Wizards.Pages.WizardPage.prototype.createHeaderArea.call(this, $parent);

        $parent.addClass('brtc-va-wizardpage-dataupload');
        $parent.append($('' +
            '   <div class="step01">' +
            '       <span class="brtc-va-icon step disabled"></span>' +
            '       <p class="step disabled"><strong>01</strong>'+Brightics.locale.common.selectData+'</p>' +
            '   </div>' +
            '   <div class="step02">' +
            '       <span class="brtc-va-icon step disabled"></span>' +
            '       <p class="step disabled"><strong>02</strong>'+Brightics.locale.common.setDelimiter+'</p>' +
            '   </div>' +
            '   <div class="step03">' +
            '       <span class="brtc-va-icon step normal selected"></span>' +
            '       <p class="step normal selected"><strong>03</strong>'+Brightics.locale.common.setColumnDataType+'</p>' +
            '   </div>'));
    };

    SetColumnDataTypePage.prototype.createContentsArea = function ($parent) {
        Brightics.VA.Core.Wizards.Pages.WizardPage.prototype.createContentsArea.call(this, $parent);

        this.createProgressSpinnerArea($parent);
        this.createChangeInputArea($parent);
        this.createGridArea($parent);
        this.createInvalidColumnNameDetailArea();
        this.createNotification();
    };

    SetColumnDataTypePage.prototype.createProgressSpinnerArea = function ($parent) {
        this.$progress = $('' +
            '   <div class="brtc-va-progress">' +
            '       <div>' +
            '           <span class="brtc-va-progress-loading"/>' +
            '           <p>Adding data...</p>' +
            '           <p class="brtc-va-progress-percent"></p>' +
            '       </div>' +
            '</div>');
        $parent.append(this.$progress);
        this.$progress.hide();
    };

    SetColumnDataTypePage.prototype.createChangeInputArea = function ($parent) {
        $parent.append($('' +
            '   <div style="font-size: 13px; font-style: italic; margin-bottom: 20px;">Select the column and apply your changes. After you complete the changes, click the "Finish" button to upload all the columns.</div>' +
            '   <div class="header">' +
            '       <span>'+Brightics.locale.common.columnnameandtype+': </span>' +
            '    </div>' +
            '   <div class="brtc-va-change-input-area">' +
            '       <div class="contents">' +
            '           <div class="brtc-va-change-name-row">' +
            '               <div class="brtc-va-change-name-label-wrapper">' +
            '                  <div class="brtc-va-change-name-label">'+Brightics.locale.common.name+'</div>' +
            '               </div>' +
            '               <div class="brtc-va-change-name-search-input-wrapper">' +
            '                   <input type="search" class="brtc-va-change-name-search-input" tabIndex="101"/>' +
            '               </div>' +
            '               <div class="brtc-va-change-name-find-input-wrapper">' +
            '                   <input type="text" class="brtc-va-change-name-find-input" tabIndex="102"/>' + //jqxGrid에 데이터가 생성될때 내부적으로 tabindex = "1", "2"를 만들기 때문에 훨씬 큰 수로 적용하였음. 2017. 09. 27
            '               </div>' +
            '               <div class="brtc-va-change-name-replace-input-wrapper">' +
            '                   <input type="text" class="brtc-va-change-name-replace-input" tabIndex="103"/>' +
            '               </div>' +
            '               <div class="brtc-va-change-name-replace-button-wrapper">' +
            '                   <input type="button" value="Replace" class="brtc-va-change-name-replace-button" tabIndex="104"/>' +
            '               </div>' +
            '           </div>' +
            '           <div class="brtc-va-change-type-row">' +
            '               <div class="brtc-va-change-type-label-wrapper">' +
            '                   <div class="brtc-va-change-type-label">'+Brightics.locale.common.type+'</div>' +
            '               </div>' +
            '               <div class="brtc-va-change-type-search-input-wrapper">' +
            '                   <input type="search" class="brtc-va-change-type-search-input" tabIndex="105"/>' +
            '               </div>' +
            '               <div class="brtc-va-change-type-button-area">' +
            '                  <div class="brtc-va-button-wrapper">' +
            '                      <input type="button" class="brtc-va-change-button" value="String"/>' +
            '                   </div>' +
            '                   <div class="brtc-va-button-wrapper">' +
            '                       <input type="button" class="brtc-va-change-button" value="Double"/>' +
            '                   </div>' +
            '                   <div class="brtc-va-button-wrapper">' +
            '                       <input type="button" class="brtc-va-change-button" value="Integer"/>' +
            '                   </div>' +
            '                   <div class="brtc-va-button-wrapper">' +
            '                       <input type="button" class="brtc-va-change-button" value="Long"/>' +
            '                   </div>' +
            '                   <div class="brtc-va-button-wrapper">' +
            '                       <input type="button" class="brtc-va-change-button last" value="Boolean"/>' +
            '                   </div>' +
            '               </div>' +
            '           </div>' +
            '       </div>' +
            '   </div>'));
        this.createChangeNameArea($parent);
        this.createChangeTypeArea($parent);
    };

    /** Create Change Name Area **/
    SetColumnDataTypePage.prototype.createChangeNameArea = function ($parent) {
        this.createColumnSearchInput($parent);
        this.createColumnFindInput($parent);
        this.createColumnReplaceInput($parent);
        this.createColumnReplaceButton($parent);
    };

    SetColumnDataTypePage.prototype.createColumnSearchInput = function ($parent) {
        var _this = this;
        this.$columnSearchInput = $parent.find('.brtc-va-change-name-search-input');
        this.$columnSearchInput.jqxInput({
            theme: Brightics.VA.Env.Theme,
            width: 255,
            height: 28,
            placeHolder: Brightics.locale.common.searchName
        });

        this.$columnSearchInput.on('change', function (event) {
            if (event.args && event.args.type && event.args.type === 'keyboard') {
                _this.applyGridColumnNameFilter();
            }
        });
    };

    SetColumnDataTypePage.prototype.createColumnFindInput = function ($parent) {
        this.$columnFindInput = $parent.find('.brtc-va-change-name-find-input');
        this.$columnFindInput.jqxInput({
            theme: Brightics.VA.Env.Theme,
            width: 125,
            height: 28,
            placeHolder: Brightics.locale.common.find
        });
    };

    SetColumnDataTypePage.prototype.createColumnReplaceInput = function ($parent) {
        this.$columnReplaceInput = $parent.find('.brtc-va-change-name-replace-input');
        this.$columnReplaceInput.jqxInput({
            theme: Brightics.VA.Env.Theme,
            width: 125,
            height: 28,
            placeHolder: Brightics.locale.common.replace
        });
    };

    SetColumnDataTypePage.prototype.createColumnReplaceButton = function ($parent) {
        var _this = this;
        this.$columnReplaceButton = $parent.find('.brtc-va-change-name-replace-button');
        this.$columnReplaceButton.jqxButton({
            theme: Brightics.VA.Env.Theme,
            width: 60,
            height: 28
        });

        this.$columnReplaceButton.on('click', function (event) {
            _this.replaceColumnName();
        });
    };

    SetColumnDataTypePage.prototype.replaceColumnName = function () {
        var selectedrowindex = this.$grid.jqxGrid('getselectedrowindexes');
        // 선택한 것이 있는 경우
        if (selectedrowindex.length) {
            var findValue = this.$columnFindInput.val();
            var replaceValue = this.$columnReplaceInput.val();

            if (findValue) {
                var regexp = new RegExp(findValue, 'g');
                for (var i = 0; i < selectedrowindex.length; i++) {
                    if (selectedrowindex[i] >= 0) {
                        this.options.wizard.result.columnName[selectedrowindex[i]] = this.options.wizard.result.columnName[selectedrowindex[i]].replace(regexp, replaceValue);
                    }
                }
                // updaterow method보다 jqxGrid에 source를 다시 넣어버리는 것이 훨씬 빠르다.
                this.fillColumnGrid();
                this.checkColumnNameValidation();
                this.refreshGridColumnFilter();
                this.showSuccessNotification('Column names were updated successfully.');
            } else {
                Brightics.VA.Core.Utils.WidgetUtils.openWarningDialog('Please enter "Find" word.');
            }
        } else {
            Brightics.VA.Core.Utils.WidgetUtils.openWarningDialog('There is no selected column.');
        }
    };

    /** Create Change Type Area **/
    SetColumnDataTypePage.prototype.createChangeTypeArea = function ($parent) {
        this.createSearchTypeInput($parent);
        this.createChangeTypeButtons($parent);
    };

    SetColumnDataTypePage.prototype.createSearchTypeInput = function ($parent) {
        var _this = this;
        this.$typeSearchInput = $parent.find('.brtc-va-change-type-search-input');

        this.$typeSearchInput.jqxInput({
            theme: Brightics.VA.Env.Theme,
            width: 255,
            height: 28,
            placeHolder: Brightics.locale.common.searchType
        });

        this.$typeSearchInput.on('change', function (event) {
            if (event.args && event.args.type && event.args.type === 'keyboard') {
                _this.applyGridColumnTypeFilter();
            }
        });
    };

    SetColumnDataTypePage.prototype.createChangeTypeButtons = function ($parent) {
        var _this = this;
        this.$typeChangeButtons = $parent.find('.brtc-va-change-button');

        this.$typeChangeButtons.jqxButton({
            theme: Brightics.VA.Env.Theme,
            width: 60,
            height: 28
        });

        this.$typeChangeButtons.on('click', function (event) {
            _this.changeColumnType($(this).attr('value'));
        });
    };

    SetColumnDataTypePage.prototype.changeColumnType = function (value) {
        var selectedrowindex = this.$grid.jqxGrid('getselectedrowindexes');
        // 선택한 것이 있는 경우만
        if (selectedrowindex.length) {
            for (var i = 0; i < selectedrowindex.length; i++) {
                if (selectedrowindex[i] >= 0) {
                    this.options.wizard.result.columnType[selectedrowindex[i]] = value;
                }
            }
            // updaterow method보다 jqxGrid에 source를 다시 넣어버리는 것이 훨씬 빠르다.
            this.fillColumnGrid();
            this.refreshGridColumnFilter();
            this.showSuccessNotification('Column types were updated successfully.');
        } else {
            Brightics.VA.Core.Utils.WidgetUtils.openWarningDialog('There is no selected column.');
        }
    };

    SetColumnDataTypePage.prototype.clearSearchInput = function () {
        this.clearColumnSearchInput();
        this.clearFindInput();
        this.clearReplaceInput();
        this.clearTypeSearchInput();
    };

    SetColumnDataTypePage.prototype.clearColumnSearchInput = function () {
        this.$columnSearchInput.val('');
    };

    SetColumnDataTypePage.prototype.clearFindInput = function () {
        this.$columnFindInput.val('');
    };

    SetColumnDataTypePage.prototype.clearReplaceInput = function () {
        this.$columnReplaceInput.val('');
    };

    SetColumnDataTypePage.prototype.clearTypeSearchInput = function () {
        this.$typeSearchInput.val('');
    };

    /** Create Grid Area **/
    SetColumnDataTypePage.prototype.createGridArea = function ($parent) {
        $parent.append($('' +
            '   <div class="brtc-va-grid-area">' +
            '       <div class="contents">' +
            '           <div class="columns-table" tabIndex="-1"></div>' +
            '       </div>' +
            '       <div class="brtc-va-wizard-message-area">' +
            '           <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>' +
            '           <div class="brtc-va-wizard-message-label"></div>' +
            '           <div class="brtc-va-wizard-message-show-detail">Detail</div>' +
            '       </div>' +
            '   </div>'));
        this.$messageArea = $parent.find('.brtc-va-wizard-message-area');
        this.$messageDetailArea = $parent.find('.brtc-va-wizard-message-show-detail');
        this.createColumnGrid($parent);
    };

    SetColumnDataTypePage.prototype.createColumnGrid = function ($parent) {
        var _this = this;
        this._invalidConlumnNameMap = {};
        var $grid = $('<div class="brtc-va-setcolumndatatype-preview-column-grid" tabIndex="-1"></div>');
        $parent.find('.columns-table').append($grid);

        var dataAdapter = this._getGridDataAdapter();
        this.dataAdapter = dataAdapter;
        this.$grid = $grid.jqxGrid({
            theme: Brightics.VA.Env.Theme,
            width: 619,
            height: 215,
            rowsheight: 25,
            source: this.dataAdapter,
            selectionmode: 'checkbox',
            filterable: false,
            editable: true,
            keyboardnavigation: false,
            columnsresize: true,
            columns: [
                {
                    text: 'No.', sortable: false, filterable: false, editable: false,
                    groupable: false, draggable: false, resizable: false,
                    datafield: '', columntype: 'number', width: 50,
                    cellsrenderer: function (row, column, value) {
                        return '<div style="margin:4px;">' + (row + 1) + '</div>';
                    }
                },
                {
                    text: 'Name', datafield: 'column-name', filtertype: 'input', editable: true, filterable: false,
                    cellsrenderer: function (row, datafield, value) {
                        var $cell = $('<div class="jqx-grid-cell-left-align" style="margin-top: 5.5px;"></div>');
                        $cell.attr('title', value);
                        $cell.text(value);
                        var invalidList = _this._invalidConlumnNameMap[row];
                        if (invalidList.length > 0) {
                            $cell.css('color', 'rgba(194, 6, 17, .65)');
                        } else {
                            $cell.css('color', '#000');
                        }
                        return $('<div>').append($cell.clone()).html();
                    }
                },
                {
                    text: 'Type',
                    datafield: 'column-type',
                    displayfield: 'column-type-dropdown',
                    columntype: 'dropdownlist',
                    filtertype: 'checkedlist',
                    filterable: false,
                    editable: true,
                    createeditor: function (row, value, editor) {
                        editor.jqxDropDownList({
                            source: _this._getDropDownAdapter(),
                            displayMember: 'label',
                            valueMember: 'value'
                        });
                        editor.css('margin-left', '1px');
                        editor.css('margin-top', '1px');
                        editor.css('height', (editor.height - 2) + 'px');
                    }
                },
                {
                    text: 'First Data', datafield: 'column-data', editable: false, filterable: false,
                    cellsrenderer: function (row, datafield, value) {
                        var $cell = $('<div class="jqx-grid-cell-left-align" style="margin-top: 5.5px;"></div>');
                        $cell.attr('title', value);
                        $cell.text(value);
                        return $('<div>').append($cell.clone()).html();
                    }
                },
                {
                    text: 'Error Message',
                    datafield: 'column-name-invalid',
                    editable: false,
                    filterable: false,
                    hidden: true,
                    cellsrenderer: function (row, datafield, value) {
                        if (_this._invalidConlumnNameMap[row].length === 0) return '';
                        var $cell = $('<div class="jqx-grid-cell-left-align" style="margin-top: 5.5px;"></div>');
                        $cell.attr('title', value);
                        $cell.text(_this._invalidConlumnNameMap[row].join(' '));
                        return $('<div>').append($cell.clone()).html();
                    }
                }
            ]
        });

        this.$grid.on('cellendedit', function (event) {
            var rowIndex = event.args.rowindex;
            if (event.args.datafield === 'column-name') {
                if (_this.options.wizard.result.columnName[rowIndex] != event.args.value) {
                    _this.options.wizard.result.columnName[rowIndex] = event.args.value;

                    _this._createCountOfColumnNameMap();
                    _this._setInvalidColumnNameMapByRow(rowIndex, event.args.value);

                    _this.$grid.jqxGrid({
                        source: _this._getGridDataAdapter()
                    });
                    setTimeout(function () {
                        _this.checkColumnNameValidation();
                        _this.refreshGridColumnFilter();
                        _this.showSuccessNotification('Column name was updated successfully.');
                    }, 300);
                }
            } else if (event.args.datafield === 'column-type') {
                if (_this.options.wizard.result.columnType[rowIndex] != event.args.value['value']) {
                    _this.options.wizard.result.columnType[rowIndex] = event.args.value['value'];
                    setTimeout(function () {
                        _this.refreshGridColumnFilter();
                        _this.showSuccessNotification('Column type was updated successfully.');
                    }, 300);
                }
            }
        });

        // 선택된 것 중 display되지 않는 것은 unselect 한다.
        this.$grid.on('filter', function (event) {
            var displayRows = _this.$grid.jqxGrid('getdisplayrows');
            if (displayRows.length) {
                var displayRowsHashMap = {};
                var displaySelectedRows = [];
                var selectedRowIndexes = $.extend(true, [], _this.$grid.jqxGrid('getselectedrowindexes'));

                // create HashMap: inArray 대신 hasOwnProperty로 비교하기 위해 HashMap 생성
                displayRows.forEach(function (element) {
                    displayRowsHashMap[element.uid] = true;
                });

                // get displaySelectedRows
                for (var i = 0; i < selectedRowIndexes.length; i++) {
                    // filter 적용 후 display된 row 중, selected 되어 있는 row만 displaySelectedRows에 push
                    if (displayRowsHashMap.hasOwnProperty(selectedRowIndexes[i])) {
                        displaySelectedRows.push(selectedRowIndexes[i]);
                    }
                }
                _this.$grid.jqxGrid({selectedrowindexes: displaySelectedRows});
            } else {
                _this.clearGridColumnSelection();
            }
            _this.$grid.jqxGrid('refreshdata');
        });

        // Tab을 계속 누르고 있으면 Grid가 자동으로 scroll 되어버려서
        // Grid 아래 부분이 이상하게 깨지는 버그 때문에 javascript 로직으로 처리하였음.
        // 다른 방법이 있으면 수정 필요.
        // 2017. 09. 27
        this.$grid.on('keydown', function (event) {
            // Tab (keyCode: 9)
            if (event.keyCode == 9) {
                // Grid에서 Tab이 입력되면 event 막기
                if ($(event.target).parents('.brtc-va-setcolumndatatype-preview-column-grid').length
                    || $(event.target).hasClass('brtc-va-setcolumndatatype-preview-column-grid')) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
        });
    };

    /** init **/
    SetColumnDataTypePage.prototype.init = function () {
        Brightics.VA.Core.Wizards.Pages.WizardPage.prototype.init.call(this);

        this.options.wizard.$btnPrevious.jqxButton({disabled: false});
        this.options.wizard.$btnNext.jqxButton({disabled: true});
        this.options.wizard.$btnFinish.jqxButton({disabled: false});

        this.options.wizard.result.columnName = this.options.wizard.result.columnName || [];
        this.options.wizard.result.columnType = this.options.wizard.result.columnType || [];
        this.extractColumnName();
        this.checkColumnNameValidation();
        this.extractColumnType();
        this.fillColumnGrid();
    };

    SetColumnDataTypePage.prototype.extractColumnName = function () {
        if (this.options.wizard.result.columnName && this.options.wizard.result.columnName.length === 0 && this.options.wizard.result.data[0]) {
            var data = this.options.wizard.result.data;
            if (data[0].length) {
                var columns;
                if ($.isArray(data[0])) {
                    columns = data[0];
                } else {
                    columns = data[0].split(this.options.wizard.result.delimiter || ',');
                }
                this.options.wizard.result.columnName = columns;
            }
        }
    };

    SetColumnDataTypePage.prototype.extractColumnType = function () {
        if (this.options.wizard.result.columnName && this.options.wizard.result.columnName.length !== 0) {
            var columns = this.options.wizard.result.columnName;
            var columnType = this.options.wizard.result.columnType;
            var data = this.options.wizard.result.data;
            this.dataArray = undefined;

            if ($.isArray(data[0])) {
                this.dataArray = data[1] || [];
            } else {
                this.dataArray = [];
                if (this.options.wizard.result.data[1]) {
                    this.dataArray = this.options.wizard.result.data[1].split(this.options.wizard.result.delimiter || ',');
                }
            }

            for (var i = 0; i < columns.length; i++) {
                if (columnType[i] === undefined) {
                    columnType[i] = this.columnType.string;
                    if (this.dataArray[i] && $.isNumeric(this.dataArray[i])) {
                        columnType[i] = this.columnType.double;
                    }
                }
            }
        }
    };

    SetColumnDataTypePage.prototype.fillColumnGrid = function () {
        var dataAdapter = this._getGridDataAdapter();
        this.$grid.jqxGrid({
            source: dataAdapter
        });
    };

    SetColumnDataTypePage.prototype._getGridDataAdapter = function () {
        var data = this._getGridData();
        var columnTypeAdapter = this._getDropDownAdapter();
        var source = {
            localdata: data,
            datatype: 'array',
            datafields: [
                {name: 'column-name', type: 'string'},
                {name: 'column-type', type: 'string'},
                {name: 'column-data', type: 'string'},
                {
                    name: 'column-type-dropdown',
                    value: 'column-type',
                    values: {source: columnTypeAdapter.records, value: 'value', name: 'label'}
                },
                {name: 'column-name-invalid', type: 'string'},
            ]
        };
        return new $.jqx.dataAdapter(source);
    };

    SetColumnDataTypePage.prototype._getGridData = function () {
        var data = [];
        var _this = this;
        if (this.dataArray && this.options.wizard.result.columnName && this.options.wizard.result.columnName.length !== 0) {
            var columns = this.options.wizard.result.columnName;
            var columnType = this.options.wizard.result.columnType;
            var dataArray = this.dataArray;

            this._createCountOfColumnNameMap();

            data = $.map(columns, function (columnName, index) {
                _this._setInvalidColumnNameMapByRow(index, columnName);
                return {
                    'column-name': columnName,
                    'column-type': columnType[index],
                    'column-data': dataArray[index],
                    'column-name-invalid': (_this._invalidConlumnNameMap[index].length > 0) ? _this._invalidConlumnNameMap[index] : ''
                }
            });
        }
        return data;
    };
    SetColumnDataTypePage.prototype._setInvalidColumnNameMapByRow = function (row, value) {

        this._invalidConlumnNameMap[row] = [];
        var invalidList = this._invalidConlumnNameMap[row];
        if (this._isColumnNameEmpty(value)) {
            invalidList.push('Column name cannot be empty.');
        } else {
            if (this._hasSpaceChar(value)) {
                invalidList.push('Column name cannot ues white space.');
            }
            if (this._hasInvalidChar(value)) {
                invalidList.push('You can use alphabet, number, and \'_\' only.');
            }
            if (this._isStartedNumber(value)) {
                invalidList.push('Column name should start with alphabet characters.');
            }
            if (this._hasDuplicatedColumnName(value)) {
                invalidList.push('Some columns have same name.');
            }
        }
    };

    SetColumnDataTypePage.prototype._createCountOfColumnNameMap = function () {
        this._countOfColumnNameMap = {};
        var columnNames = this.options.wizard.result.columnName;

        for (var i = 0; i < columnNames.length; i++) {
            this._countOfColumnNameMap[columnNames[i]] = this._countOfColumnNameMap[columnNames[i]] + 1 || 1;
        }
    };

    SetColumnDataTypePage.prototype._getDropDownAdapter = function () {
        var columnType = [
            {value: 'Double', label: 'Double'},
            {value: 'String', label: 'String'},
            {value: 'Integer', label: 'Integer'},
            {value: 'Long', label: 'Long'},
            {value: 'Boolean', label: 'Boolean'}
        ];
        var columnTypeSource = {
            datatype: 'array',
            datafields: [
                {name: 'label', type: 'string'},
                {name: 'value', type: 'string'}
            ],
            localdata: columnType
        };
        return new $.jqx.dataAdapter(columnTypeSource, {autoBind: true});
    };

    SetColumnDataTypePage.prototype.getColumnNameArray = function () {
        this.options.wizard.result.columnName = [];
        this.$grid.jqxGrid('removefilter', 'column-name');
        this.$grid.jqxGrid('removefilter', 'column-type');
        var rows = this.$grid.jqxGrid('getrows');
        for (var i = 0; i < rows.length; i++) {
            this.options.wizard.result.columnName.push((rows[i]['column-name']).trim());
        }
        return this.options.wizard.result.columnName;
    };

    SetColumnDataTypePage.prototype.getColumnTypeArray = function () {
        this.options.wizard.result.columnType = [];
        this.$grid.jqxGrid('removefilter', 'column-name');
        this.$grid.jqxGrid('removefilter', 'column-type');
        var rows = this.$grid.jqxGrid('getrows');
        for (var i = 0; i < rows.length; i++) {
            this.options.wizard.result.columnType.push(rows[i]['column-type']);
        }
        return this.options.wizard.result.columnType;
    };

    SetColumnDataTypePage.prototype.clearGridColumnSelection = function () {
        this.$grid.jqxGrid('clearselection');
    };

    SetColumnDataTypePage.prototype.refreshGridColumnFilter = function () {
        this.$grid.jqxGrid('applyfilters');
        this.$grid.jqxGrid('refresh');
    };

    SetColumnDataTypePage.prototype.removeGridColumnFilter = function () {
        this.removeGridColumnNameFilter();
        this.removeGridColumnTypeFilter();
    };

    SetColumnDataTypePage.prototype.removeGridColumnNameFilter = function () {
        var datafield = 'column-name';
        this.$grid.jqxGrid('removefilter', datafield);
    };

    SetColumnDataTypePage.prototype.removeGridColumnTypeFilter = function () {
        var datafield = 'column-type';
        this.$grid.jqxGrid('removefilter', datafield);
    };

    SetColumnDataTypePage.prototype.removeInvalidColumnNameFilter = function () {
        var datafield = 'column-name-invalid';
        this.$grid.jqxGrid('removefilter', datafield);
    };

    SetColumnDataTypePage.prototype.applyGridColumnNameFilter = function () {
        this.removeGridColumnNameFilter();
        var value = this.$contentsControl.find('.brtc-va-change-name-search-input').val();
        if (value) {
            var datafield = 'column-name';
            var filtergroup = this.getGridFilterGroup(value);
            this.$grid.jqxGrid('addfilter', datafield, filtergroup);
            this.$grid.jqxGrid('applyfilters');
        }
    };

    SetColumnDataTypePage.prototype.applyGridColumnTypeFilter = function () {
        this.removeGridColumnTypeFilter();
        var value = this.$contentsControl.find('.brtc-va-change-type-search-input').val();
        if (value) {
            var datafield = 'column-type';
            var filtergroup = this.getGridFilterGroup(value);
            this.$grid.jqxGrid('addfilter', datafield, filtergroup);
            this.$grid.jqxGrid('applyfilters');
        }
    };

    SetColumnDataTypePage.prototype.applyInvalidColumnNameFilter = function () {

        this.removeInvalidColumnNameFilter();

        this.dataAdapter = this._getGridDataAdapter();
        this.dataAdapter.dataBind();
        this.$grid.jqxGrid('updatebounddata');

        var datafield = 'column-name-invalid';
        var filtergroup = this.getGridEmptyFilterGroup();
        this.$grid.jqxGrid('addfilter', datafield, filtergroup);
        this.$grid.jqxGrid('applyfilters');
    };

    SetColumnDataTypePage.prototype.getGridEmptyFilterGroup = function () {
        var filtergroup = new $.jqx.filter();
        var filtertype = 'stringfilter';
        var filter_or_operator = 1;
        var filtervalue = '';
        var filtercondition = 'NOT_EMPTY';
        var filter = filtergroup.createfilter(filtertype, filtervalue, filtercondition);
        filtergroup.addfilter(filter_or_operator, filter);
        return filtergroup;
    };

    SetColumnDataTypePage.prototype.getGridFilterGroup = function (value) {
        var filtergroup = new $.jqx.filter();
        var filtertype = 'stringfilter';
        var filter_or_operator = 1;
        var filtervalue = value;
        var filtercondition = 'contains';
        var filter = filtergroup.createfilter(filtertype, filtervalue, filtercondition);
        filtergroup.addfilter(filter_or_operator, filter);
        return filtergroup;
    };

    SetColumnDataTypePage.prototype.handleError = function (err) {
        var _this = this;
        Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(err, function () {
            _this.$progress.hide();
            _this.options.wizard.$btnFinish.jqxButton({disabled: false});
            _this.options.wizard.$btnPrevious.jqxButton({disabled: false});
        });
    };
    SetColumnDataTypePage.prototype.createInvalidColumnNameDetailArea = function () {
        var _this = this;
        this.$messageDetailArea.jqxCheckBox({
            theme: Brightics.VA.Env.Theme
        });
        this.$messageDetailArea.on('change', function (event) {
            if (event.args.checked) {
                _this.$grid.jqxGrid('hidecolumn', 'column-data');
                _this.$grid.jqxGrid('showcolumn', 'column-name-invalid');
                _this.applyInvalidColumnNameFilter();
            } else {
                _this.$grid.jqxGrid('hidecolumn', 'column-name-invalid');
                _this.$grid.jqxGrid('showcolumn', 'column-data');
                _this.removeInvalidColumnNameFilter();
            }

        });
    };


    SetColumnDataTypePage.prototype.checkColumnNameValidation = function () {
        this.validationMessage = '';
        this.$messageArea.hide();

        this.checkColumnEmpty();
        this.checkColumnNameEmpty();
        this.checkColumnNameCharacter();

        this._createCountOfColumnNameMap();
        this.checkDuplicatedColumnName();

        if (this.validationMessage) {
            this.$messageArea.find('.brtc-va-wizard-message-label').text(this.validationMessage);
            this.$messageArea.show();
        }
        return this.validationMessage;
    };

    SetColumnDataTypePage.prototype.checkColumnEmpty = function () {
        if (!this.validationMessage) {
            if (this.options.wizard.result.columnName.length === 0) {
                this.validationMessage = 'There is no column. Please check column.';
            }
        }
    };

    SetColumnDataTypePage.prototype._isColumnNameEmpty = function (str) {
        return !str;
    };

    SetColumnDataTypePage.prototype.checkColumnNameEmpty = function () {
        if (!this.validationMessage) {

            for (var i in this.options.wizard.result.columnName) {
                if (this._isColumnNameEmpty(this.options.wizard.result.columnName[i])) {
                    this.validationMessage = 'Column name cannot be empty. Please check column name.';
                    break;
                }
            }
        }
    };
    SetColumnDataTypePage.prototype._isInvalidChar = function (str) {
        var reg1 = new RegExp('^[가-힣a-zA-Z0-9_]+$');
        var reg2 = new RegExp('^[0-9]+');
        return (!reg1.test(str) || reg2.test(str));
    };

    SetColumnDataTypePage.prototype._hasSpaceChar = function (str) {
        var reg = new RegExp(' +');
        return reg.test(str);
    };
    SetColumnDataTypePage.prototype._hasInvalidChar = function (str) {
        var reg = new RegExp('^[가-힣a-zA-Z0-9_ ]+$');
        return (!reg.test(str));
    };
    SetColumnDataTypePage.prototype._isStartedNumber = function (str) {
        var reg = new RegExp('^[0-9]+');
        return (reg.test(str));
    };

    SetColumnDataTypePage.prototype.checkColumnNameCharacter = function () {
        if (!this.validationMessage) {

            for (var i in this.options.wizard.result.columnName) {
                if (this._isInvalidChar(this.options.wizard.result.columnName[i])) {
                    this.validationMessage = "All column names should start with alphabet characters. You can use alphabet, number, and '_' only.";
                    break;
                }
            }
        }
    };


    SetColumnDataTypePage.prototype._hasDuplicatedColumnName = function (str) {
        return this._countOfColumnNameMap[str] > 1;
    };

    SetColumnDataTypePage.prototype.checkDuplicatedColumnName = function () {
        if (!this.validationMessage) {
            for (var i in this.options.wizard.result.columnName) {
                if (this._hasDuplicatedColumnName(this.options.wizard.result.columnName[i])) {
                    this.validationMessage = 'Some columns have same name. Please column name.';
                    break;
                }
            }
        }
    };

    SetColumnDataTypePage.prototype.showSuccessNotification = function (message) {
        this.notification('success', message);
    };
    
    SetColumnDataTypePage.prototype.createNotification = function () {
        this.$notificationContainer =
            $(crel('div', {class: 'brtc-va-dialogs-notification-container'}));
        this.$notificationContent =
            $(crel('div', {class: 'brtc-va-dialogs-notification-content'}));
        this.$notification = $(
            crel('div', {class: 'brtc-va-dialogs-notification'},
                this.$notificationContent[0]
            )
        );
        this.$parent.append(this.$notificationContainer, this.$notification);
        this.$notification.jqxNotification({
            theme: Brightics.VA.Env.Theme,
            appendContainer: this.$notificationContainer,
            autoOpen: false,
            animationOpenDelay: 800,
            autoClose: true,
            autoCloseDelay: 3000,
            template: 'info'
        });
    };

    SetColumnDataTypePage.prototype.notification = function (template, message) {
        this.$notificationContainer.empty();
        this.$notificationContent.html(message);
        this.$notification.jqxNotification({template: template});
        this.$notification.jqxNotification('open');
    };

    SetColumnDataTypePage.prototype.doFinish = function () {
        var _this = this;
        var columnName = this.getColumnNameArray();
        var columnType = this.getColumnTypeArray();
        if (this.checkColumnNameValidation()) {
            Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog(this.validationMessage, function () {
            });
            return;
        }

        _this.progress(true, 'Adding data...');
        this.path = '';
        if (_this.options.wizard.result.uploadTo === 'shared') {
            this.path = '/' + _this.options.wizard.result.uploadTo + '/upload/' + _this.options.wizard.result.fileName;
        } else {
            this.path = '/' + Brightics.VA.Env.Session.userId + '/upload/' + _this.options.wizard.result.fileName;
        }

        if (this.options.wizard.result.copyFrom === 'local') {

            var $pregressTextArea = this.$progress.find('.brtc-va-progress-percent');

            var formData = new FormData();
            formData.append('column-name', '["' + columnName.join('\",\"') + '"]');
            formData.append('column-type', '["' + columnType.join('\",\"') + '"]');
            formData.append('delimiter', '"' + _this.options.wizard.result.delimiter + '"');
            formData.append('path', this.path);
            formData.append('attach', this.options.wizard.result.file);

            $.ajax({
                url: 'api/va/v2/data/upload',
                type: 'POST',
                mimeType: 'multipart/form-data',
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                blocking: false, //progress 함수가 이미 dim 처리 하고 있음.
                xhr: function () {
                    var xhr = $.ajaxSettings.xhr();
                    xhr.upload.onprogress = function (evt) {
                        var percent = evt.loaded / evt.total * 100;
                        $pregressTextArea.text(percent.toFixed(1) + ' %');
                    };
                    return xhr;
                },
            }).done(function (res) {
                _this.progress(false);
            }).fail(function (err) {
                _this.handleError(err);
            });
        }

        if (this.options.wizard.result.copyFrom === 'alluxio') {
            var options = {
                'inputpath': this.options.wizard.result.remotePath,
                'path': this.path,
                'columnname': columnName,
                'columntype': columnType,
                'delimiter': this.options.wizard.result.delimiter
            };
            var opt = {
                url: 'api/va/v2/data/import',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(options),
                blocking: false //progress 함수가 이미 dim 처리 하고 있음.
            };

            $.ajax(opt).done(function () {
                _this.progress(false);
            }).fail(function (err) {
                _this.handleError(err);
            });
        }

        if (this.options.wizard.result.copyFrom === 'jdbc') {
            this.uploadFormattedAlluxio({});
        }
    };

    SetColumnDataTypePage.prototype.uploadFormattedAlluxio = function (option) {
        var _this = this;
        var options = this.createImportDataOption(option);
        var checkTimer = function (jid) {
            _this._checkProgress(options.user, jid).done(function (result) {
                if (result.status == 'PROCESSING') {
                    setTimeout(checkTimer.bind(_this, jid), 3000);
                } else if (result.status == 'SUCCESS') {
                    _this.progress(false);
                } else {
                    _this.progress(false, result.message || 'Failed to upload.');
                }
            }).fail(function (err) {
                _this.handleError(err);
            });
        };

        var opt = {
            url: 'api/va/v2/analytics/jobs/execute',
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(options),
            blocking: false //progress 함수가 이미 dim 처리 하고 있음.
        };

        $.ajax(opt).done(function (results) {
            var _results = JSON.parse(results);
            var jid = _results.result;
            setTimeout(checkTimer.bind(_this, jid), 3000);
        }).fail(function (err) {
            _this.handleError(err);
        });
    };

    SetColumnDataTypePage.prototype.createImportDataOption = function () {
        var outputPath = (this.options.wizard.result.uploadTo === 'shared') ? ('/shared/upload/') : ('/' + Brightics.VA.Env.Session.userId + '/upload/');
        var columnName = this.getColumnNameArray();
        var columnType = this.getColumnTypeArray();

        var jid = 'va_mimportdata_' + moment(Date.now()).format('YYYYMMDDHHmmssSSS');
        var fnUnit = {
            'fid': 'fimportdata',
            'func': 'importData',
            'name': 'ImportData',
            'label': 'Import Data',
            'persist': true,
            'persist-mode': 'auto'
        };

        fnUnit.param = {
            'copy-from': 'jdbc',
            'columns': columnName.join(','),
            'column-type': columnType,
            'ip': this.options.wizard.result.jdbc.host,
            'port': this.options.wizard.result.jdbc.port,
            'output-path': outputPath + this.options.wizard.result.jdbc.tablename,
            'db-type': this.options.wizard.result.jdbc.dbtype.toLowerCase(),
            'username': this.options.wizard.result.jdbc.username,
            'password': this.options.wizard.result.jdbc.password,
            'db-name': this.options.wizard.result.jdbc.service,
            'table-name': this.options.wizard.result.jdbc.tablename,
            'socket-timeout': this.options.wizard.result.jdbc.sorckettimeout,
            'lock-timeout': this.options.wizard.result.jdbc.locktimeout,
            'delimiter': '\u0001'
        };

        return Brightics.VA.Core.Utils.RunnableFactory.createForDummy(fnUnit, jid, Brightics.VA.Env.Session.userId);
    };

    SetColumnDataTypePage.prototype._checkProgress = function (userId, jobId) {
        var option = {
            url: 'api/va/v2/analytics/jobs/' + jobId,
            type: 'GET',
            blocking: false //progress 함수가 이미 dim 처리 하고 있음.
        };
        return $.ajax(option);
    };

    SetColumnDataTypePage.prototype.progress = function (status, label) {
        var _this = this;
        if (status) {
            this.$progress.show();
            this.options.wizard.$btnFinish.jqxButton({disabled: status});
        }
        else {
            this.$progress.hide();
            if (label) {
                Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog(label, function () {
                    _this.options.wizard.$btnFinish.jqxButton({disabled: status});
                });
            } else {
                Brightics.VA.Core.Utils.WidgetUtils.openInformationDialog('Add data success!', function () {
                    _this.options.wizard.dialogResult.OK = true;
                    _this.options.wizard.dialogResult.Cancel = false;
                    _this.options.wizard.dialogResult.path = _this.path;
                    _this.$parent.parent().dialog('close');
                });
            }
        }
        this.options.wizard.$btnPrevious.jqxButton({disabled: status});
    };

    SetColumnDataTypePage.prototype.destroy = function () {
        var $dropDownList = this.$grid.find('.jqx-dropdownlist-state-normal');
        $dropDownList.each(function () {
            $(this).jqxDropDownList('destroy');
        });
        this.$grid.jqxGrid('destroy');
    };

    Brightics.VA.Core.Wizards.Pages.SetColumnDataTypePage = SetColumnDataTypePage;

}).call(this);