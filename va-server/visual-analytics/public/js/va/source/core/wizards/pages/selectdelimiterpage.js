/**
 * Created by SDS on 2016-09-01.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function SelectDelimiterPage(parentId, options) {
        this.options = options;
        this.options.class = 'selectdelimiterpage';

        Brightics.VA.Core.Wizards.Pages.WizardPage.call(this, parentId, this.options);

        var _this = this;
        this.options.wizard.registerEvent('changeDelimiter');
        this.options.wizard.addEventListener('changeData', function (event, eventData) {
            if (eventData) {
                _this.options.wizard.result.delimiter = undefined;
            }
        });
    }

    SelectDelimiterPage.prototype = Object.create(Brightics.VA.Core.Wizards.Pages.WizardPage.prototype);
    SelectDelimiterPage.prototype.constructor = SelectDelimiterPage;

    SelectDelimiterPage.prototype.init = function () {
        Brightics.VA.Core.Wizards.Pages.WizardPage.prototype.init.call(this);

        this.delimiterMap = {
            comma: ',',
            tab: '\t',
            semicolon: ';',
            colon: ':',
            space: ' '
        };

        this.options.wizard.$btnPrevious.jqxButton({disabled: false});
        this.options.wizard.$btnFinish.jqxButton({disabled: true});
        if (this.options.wizard.result.delimiter) // delimiters 있으면
            this.options.wizard.$btnNext.jqxButton({disabled: false});
        else
            this.options.wizard.$btnNext.jqxButton({disabled: true});

        if (this.options.wizard.result.delimiter === undefined) {
            this.$mainControl.find('.brtc-va-radio-button[value=comma]').val(true);
        } else {
            this.splitData(this.options.wizard.result.delimiter);
        }
    };

    SelectDelimiterPage.prototype.createHeaderArea = function ($parent) {
        $parent.addClass('brtc-va-wizardpage-dataupload');
        this.$wizardHeader = $('' +
            '   <div class="step01">' +
            '       <span class="brtc-va-icon step disabled"></span>' +
            '       <p class="step disabled"><strong>01</strong>' + Brightics.locale.common.selectData + '</p>' +
            '   </div>' +
            '   <div class="step02">' +
            '       <span class="brtc-va-icon step normal selected"></span>' +
            '       <p class="step normal selected"><strong>02</strong>' + Brightics.locale.common.setDelimiter + '</p>' +
            '   </div>' +
            '   <div class="step03">' +
            '       <span class="brtc-va-icon step disabled"></span>' +
            '       <p class="step disabled"><strong>03</strong>' + Brightics.locale.common.setColumnDataType + '</p>' +
            '   </div>');
        $parent.append(this.$wizardHeader);
    };

    SelectDelimiterPage.prototype.createContentsArea = function ($parent) {
        var _this = this;
        $parent.append($('' +
            '<div class="delimiterselect brtc-va-column-delimiter">' +
            '   <div style="font-size: 13px; font-style: italic; margin-bottom: 20px;">Choose a delimiter for separating data.</div>' +
            '   <div class="header">' +
            '       <span>'+Brightics.locale.common.delimiters+': </span>' +
            '    </div>' +
            '    <div class="contents">' +
            '        <div class="brtc-va-radio">' +
            '            <div class="brtc-va-radio-button selectdelimiter" id="delimiter-comma" value="comma" aria-checked="true">Comma</div>' +
            '        </div>' +
            '        <div class="brtc-va-radio">' +
            '            <div class="brtc-va-radio-button selectdelimiter" id="delimiter-tab" value="tab"><span>Tab</span></div>' +
            '        </div>' +
            '        <div class="brtc-va-radio">' +
            '            <div class="brtc-va-radio-button selectdelimiter" id="delimiter-space" value="space"><span>Space</span></div>' +
            '        </div>' +
            '        <div class="brtc-va-radio">' +
            '            <div class="brtc-va-radio-button selectdelimiter" id="delimiter-colon" value="colon"><span>Colon</span></div>' +
            '        </div>' +
            '        <div class="brtc-va-radio">' +
            '            <div class="brtc-va-radio-button selectdelimiter" id="delimiter-semicolon" value="semicolon"><span>SemiColon</span></div>' +
            '        </div>' +
            '        <div class="brtc-va-radio">' +
            '            <div class="brtc-va-radio-button selectdelimiter" id="delimiter-other" value="other"><div class="brtc-va-delimiter-input-wrapper"><input type="text" class="brtc-va-delimiter-input" maxlength="80"/></div></div>' +
            '        </div>' +
            '   </div>' +
            '</div>' +
            '<div class="column-preview selectdelimiter">' +
            '   <div class="header"><span class="column-row-length">0</span>'+Brightics.locale.common.columns+'</div>' +
            '   <div class="contents">' +
            '       <div class="delimiter-table"></div>' +
            '   </div>' +
            '</div>'));

        $parent.find('.brtc-va-radio-button').jqxRadioButton({
            theme: Brightics.VA.Env.Theme,
            height: 25,
            width: 95,
            boxSize: '18px',
            groupName: 'delimiter'
        });

        $parent.find('.brtc-va-column-delimiter .brtc-va-delimiter-input').jqxInput({
            theme: Brightics.VA.Env.Theme,
            width: '70px',
            height: '24px'
        });

        $parent.find('.brtc-va-column-delimiter .jqx-radiobutton').on('change', function (event) {
            _this.options.wizard.triggerEvent('changeDelimiter', true);
            if (event.target.tagName == 'INPUT') {
                _this.options.wizard.result.delimiter = $parent.find('.brtc-va-column-delimiter .brtc-va-delimiter-input').val();
                _this.splitData(_this.options.wizard.result.delimiter);
            } else {
                var checked = event.args.checked;
                if (checked) {
                    var value = event.target.getAttribute('value');
                    if (value == 'other') {
                        _this.options.wizard.result.delimiter = $parent.find('.brtc-va-column-delimiter .brtc-va-delimiter-input').val();
                        _this.splitData(_this.options.wizard.result.delimiter);
                    } else {
                        _this.options.wizard.result.delimiter = _this.delimiterMap[value];
                        _this.splitData(_this.options.wizard.result.delimiter);
                    }
                }
            }
            if (_this.options.wizard.result.delimiter && _this.options.wizard.result.data.length > 1) {
                _this.options.wizard.$btnNext.jqxButton({disabled: false});
            } else {
                _this.options.wizard.$btnNext.jqxButton({disabled: true});
                return;
            }

            _this.options.wizard.$btnNext.jqxButton({disabled: false});
        });

        this.createColumnGrid();
    };

    SelectDelimiterPage.prototype.getColumnNameList = function () {
        var columnNameList = [];
        if (this.options.wizard.result.data[0])
            columnNameList = this.options.wizard.result.data[0].split(this.options.wizard.result.delimiter || ',');

        return columnNameList;
    };

    SelectDelimiterPage.prototype.splitData = function (value) {
        var columns = [];
        var data = [];
        if (this.options.wizard.result.data[0]) {
            columns = this.options.wizard.result.data[0].split(value || this.options.wizard.result.delimiter);
            if (this.options.wizard.result.data[1]) {
                data = this.options.wizard.result.data[1].split(value || this.options.wizard.result.delimiter);
            }
        }

        this.setColumnGridData(columns, data);
    };

    SelectDelimiterPage.prototype.createColumnGrid = function () {
        var $parent = this.$mainControl.find('.column-preview .contents .delimiter-table');
        var $grid = $('<div class="brtc-va-selectdelimiter-preview-column-grid"></div>');
        $parent.append($grid);

        var dataAdapter = this._getFormattedGridData([]);
        this.$grid = $grid.jqxGrid({
            theme: Brightics.VA.Env.Theme,
            width: 619,
            height: 265,
            rowsheight: 25,
            source: dataAdapter,
            selectionmode: 'none',
            columnsresize: true,
            columns: [
                {
                    text: 'No.', sortable: false, filterable: false, editable: false,
                    groupable: false, draggable: false, resizable: false,
                    datafield: '', columntype: 'number', width: 50,
                    cellsrenderer: function (row, column, value) {
                        return '<div style="margin:4px;">' + (value + 1) + '</div>';
                    }
                },
                {
                    text: 'Column Name', datafield: 'column',
                    cellsrenderer: function (row, datafield, value) {
                        var $cell = $('<div class="jqx-grid-cell-left-align" style="margin-top: 5.5px;"></div>');
                        $cell.attr('title', value);
                        $cell.text(value);
                        return $('<div>').append($cell.clone()).html();
                    }
                },
                {
                    text: 'First Data', datafield: 'column-data',
                    cellsrenderer: function (row, datafield, value) {
                        var $cell = $('<div class="jqx-grid-cell-left-align" style="margin-top: 5.5px;"></div>');
                        $cell.attr('title', value);
                        $cell.text(value);
                        return $('<div>').append($cell.clone()).html();
                    }
                }
            ]
        });
    };

    SelectDelimiterPage.prototype.setColumnGridData = function (columns, data) {
        var dataAdapter = this._getFormattedGridData(columns, data);
        this.$grid.jqxGrid({
            source: dataAdapter
        });
        this.$mainControl.find('.column-row-length').text(columns.length);
    };

    SelectDelimiterPage.prototype._getFormattedGridData = function (columns, data) {
        var _data = [];
        for (var i = 0; i < columns.length; i++) {
            var row = {};
            row['column'] = columns[i];
            row['column-data'] = data[i];
            _data[i] = row;
        }
        var source = {
            localdata: _data,
            datatype: 'array',
            datafields: [
                {name: 'column', type: 'string'},
                {name: 'column-data', type: 'string'}
            ]
        };
        return new $.jqx.dataAdapter(source);
    };

    SelectDelimiterPage.prototype.destroy = function () {
        this.$grid.jqxGrid('destroy');
    };

    Brightics.VA.Core.Wizards.Pages.SelectDelimiterPage = SelectDelimiterPage;

}).call(this);