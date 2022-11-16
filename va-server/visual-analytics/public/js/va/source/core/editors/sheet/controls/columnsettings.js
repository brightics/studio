/**
 * Created by ty0314.kim on 2016-01-27.
 */
(function () {
    "use strict";

    var root = this;
    var Brightics = root.Brightics;

    /**
     * {
     *      source: [],
     *      width: 250,
     *      height: 320,
     *      resizable: false,
     *      title: '',
     *      multiple: true, // if true multi select
     *      changed: Function
     * }
     * @param parentId
     * @param options
     * @constructor
     */
    function ColumnSettings(parentId, options) {
        this.parentId = parentId;
        this.options = options;

        this.initOptions();
        this.retrieveParent();
        this.createControl();
    };

    ColumnSettings.prototype.initOptions = function () {
        var defaultOptions = {
            source: [],
            width: 300,
            height: 320,
            resizable: false,
            fromModal: false
        };

        this.options = $.extend(true, defaultOptions, this.options);
    };

    ColumnSettings.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    ColumnSettings.prototype.createControl = function () {
        var _this = this;

        this.$mainControl = $('<div class="brtc-va-editors-sheet-controls-columnsettings-editarea">' +
            '   <div class="brtc-va-editors-sheet-controls-columnsettings-header" />' +
            '   <div class="brtc-va-editors-sheet-controls-columnsettings-content brtc-style-full brtc-style-display-flex brtc-style-flex-direction-column" />' +
            '</div>');

        var $contentControl = this.$mainControl.find('.brtc-va-editors-sheet-controls-columnsettings-content');

        this.createColumnIndexRangeArea($contentControl);
        this.createColumnIndexArea($contentControl);
        this.createColumnNameArea($contentControl);
        this.createButtonArea($contentControl);

        var dialogOptions = {
            theme: Brightics.VA.Env.Theme,
            width: this.options.width || 300,
            height: this.options.height,
            resizable: false,
            title: 'Column Settings',
            autoOpen: false,
            modal: false,
            showAnimationDuration: 50,
            minHeight: 285,
            minWidth: 307,
            close: function () {
                $(window).off('mousedown', _this.closeHandler);
            },
            destroy: function () {
                _this.$mainControl.dialog('destroy');
            }
        };

        this.$mainControl.dialog(dialogOptions);
        this.$mainControl.attr('name', dialogOptions.title);
        this.$mainControl.parent().find('.ui-dialog-titlebar.ui-widget-header').css({'border-bottom': 'none !important;'});
        this.$mainControl.parent().find('button.ui-dialog-titlebar-close').attr('style', 'right: -38px !important;');

        this.closeHandler = function (event) {
            if (_this.$mainControl.closest('.ui-dialog').has(event.target).length === 0) {
                _this.$mainControl.dialog('close');
            }
        };
    };

    ColumnSettings.prototype.createColumnIndexRangeArea = function ($parent) {
        var _this = this;
        $parent.append($('' +
            '<div class="">' +
            '   <div class="header">' +
            '       <div class="column-range-check">Column Index Range</div>' +
            '    </div>' +
            '    <div class="contents">' +
            '        <div class="column-index-start">' +
            '        </div> ~ ' +
            '        <div class="column-index-end">' +
            '        </div>' +
            '   </div>' +
            '   <div class="column-range-error error">' +
            '       <span></span>' +
            '   </div>' +
            '</div>'));

        this.columnRangeCheck = $parent.find('.column-range-check').jqxCheckBox({
            theme: Brightics.VA.Env.Theme,
            checked: false,
            boxSize: '17px'
        });
        this.columnRangeCheck.on('change', function(event) {
            var checked = event.args.checked;
            if (checked) {
                _this.columnIndexStart.jqxNumberInput('disabled', false);
                _this.columnIndexEnd.jqxNumberInput('disabled', false);
            } else {
                _this.columnIndexStart.jqxNumberInput('disabled', true);
                _this.columnIndexEnd.jqxNumberInput('disabled', true);
            }
        });
        this.columnIndexStart = $parent.find('.column-index-start').jqxNumberInput({
            theme: Brightics.VA.Env.Theme,
            inputMode: 'simple',
            min: 1,
            max: 1000000,
            decimalDigits: 0,
            spinButtons: false,
            height: 22,
            width: '100px'
        });
        this.columnIndexEnd = $parent.find('.column-index-end').jqxNumberInput({
            theme: Brightics.VA.Env.Theme,
            inputMode: 'simple',
            min: 1,
            max: 1000000,
            decimalDigits: 0,
            spinButtons: false,
            height: 22,
            width: '100px'
        });
        $parent.find('.column-range-error').hide();
    };

    ColumnSettings.prototype.createColumnIndexArea = function ($parent) {
        var _this = this;
        $parent.append($('' +
            '<div class="">' +
            '   <div class="header">' +
            '       <div class="column-index-check">Column Indexes</div>' +
            '    </div>' +
            '    <div class="contents">' +
            '        <div class="brtc-va-input-wrapper">' +
            '           <input type="text" class="column-indexes"  maxlength="80"/>' +
            '        </div>' +
            '   </div>' +
            '   <div class="column-index-error error">' +
            '       <span></span>' +
            '   </div>' +
            '</div>'));

        this.columnIndexCheck = $parent.find('.column-index-check').jqxCheckBox({
            theme: Brightics.VA.Env.Theme,
            checked: false,
            boxSize: '17px'
        });
        this.columnIndexCheck.on('change', function(event) {
            var checked = event.args.checked;
            if (checked) {
                _this.columnIndexes.jqxInput('disabled', false);
            } else {
                _this.columnIndexes.jqxInput('disabled', true);
            }
        });
        this.columnIndexes = $parent.find('.column-indexes').jqxInput({
            theme: Brightics.VA.Env.Theme,
            width: '270px',
            height: 24,
            placeHolder : 'Enter indexes separated by , (comma)'
        });
        $parent.find('.column-index-error').hide();
    };

    ColumnSettings.prototype.createColumnNameArea = function ($parent) {
        var _this = this;
        $parent.append($('' +
            '<div class="">' +
            '   <div class="header">' +
            '       <div class="column-name-check">Column Names</div>' +
            '    </div>' +
            '    <div class="contents">' +
            '        <div class="brtc-va-input-wrapper">' +
            '           <input type="text" class="column-names"  maxlength="80"/>' +
            '        </div>' +
            '   </div>' +
            '   <div class="column-name-error error">' +
            '       <span></span>' +
            '   </div>' +
            '</div>'));

        this.columnNameCheck = $parent.find('.column-name-check').jqxCheckBox({
            theme: Brightics.VA.Env.Theme,
            checked: false,
            boxSize: '17px'
        });
        this.columnNameCheck.on('change', function(event) {
            var checked = event.args.checked;
            if (checked) {
                _this.columnNames.jqxInput('disabled', false);
            } else {
                _this.columnNames.jqxInput('disabled', true);
            }
        });
        this.columnNames = $parent.find('.column-names').jqxInput({
            theme: Brightics.VA.Env.Theme,
            width: '270px',
            height: 24,
            placeHolder : Brightics.locale.common.enterNameSeparatedBy,
        });
        $parent.find('.column-name-error').hide();
    };

    ColumnSettings.prototype.createButtonArea = function ($parent) {
        var _this = this;
        $parent.append($('' +
            '<div class="brtc-va-editors-sheet-controls-columnsettings-buttonarea">' +
            '   <input type="button" class="clear" value="Clear"/>' +
            '   <input type="button" class="apply" value="Apply"/>' +
            '</div>'));

        $parent.find(':button').jqxButton({
            theme: Brightics.VA.Env.Theme
        });

        var $btnClear = $parent.find('.clear');
        $btnClear.on('click', () => {
            this.columnIndexStart.jqxNumberInput('val', 1);
            this.columnIndexEnd.jqxNumberInput('val', 1000);
            this.columnIndexes.jqxInput('val', '');
            this.columnNames.jqxInput('val', '');

            this.columnRangeCheck.jqxCheckBox('val', true);
            this.columnIndexCheck.jqxCheckBox('val', false);
            this.columnNameCheck.jqxCheckBox('val', false);
        });

        var $btnFinish = $parent.find('.apply');
        $btnFinish.on('click', function () {
            var settings = {
                start: _this.columnIndexStart.jqxNumberInput('val'),
                end: _this.columnIndexEnd.jqxNumberInput('val'),
                indexes: _this.columnIndexes.jqxInput('val').split(',').reduce((p, c) => { !!c.trim() && p.push(c.trim()); return p; }, []),
                names: _this.columnNames.jqxInput('val').split(',').reduce((p, c) => { !!c.trim() && p.push(c.trim()); return p; }, []),
                useRange: _this.columnRangeCheck.jqxCheckBox('val'),
                useIndex: _this.columnIndexCheck.jqxCheckBox('val'),
                useName: _this.columnNameCheck.jqxCheckBox('val'),
                integratedIndexes: []
            }
            var okCallback = () => {
                _this.options.changed('close', { columns: settings, tableId: _this.tableId });
                _this.close();
            };
            
            if (_this.validateSettings(settings)) {
                let columnCount = 0;
                if (settings.useIndex) settings.integratedIndexes = settings.integratedIndexes.concat(settings.indexes.map(s => Number(s) - 1));
                if (settings.useName) settings.integratedIndexes = settings.integratedIndexes.concat(settings.names.map(n => _this.allColumns.findIndex(a => a.name === n)));
                settings.integratedIndexes = _.unique(settings.integratedIndexes);
                settings.integratedIndexes.sort((a, b) => a - b);
                columnCount += settings.integratedIndexes.length;
                if (settings.useRange) columnCount += settings.end - settings.start + 1;

                if (_this.rowCount === 0 || _this.allColumns.length === 0 || _this.approxSize * (Math.min(_this.pageSize, _this.rowCount) / _this.rowCount) * (columnCount / _this.allColumns.length) / 1024 / 1024 < 10) { 
                    okCallback();
                } else {
                    Brightics.VA.Core.Utils.WidgetUtils.openConfirmDialog('The estimated data capacity exceeds 10MB, which may affect the system performance.\nAre you sure you want to continue?'
                    , function (dialogResult) {
                        if (dialogResult.OK) {
                            okCallback();
                        }
                    });
                }
            }
        });
    };

    ColumnSettings.prototype.validateSettings = function (settings) {
        var _this = this;
        var validateFlag = true;
        var validateMsg = '';
        var errorValue;
        this.$mainControl.find('.error').hide();

        var checkIndexes = function() {
            errorValue = settings.indexes.find(x => isNaN(x) || x > _this.columnIndexStart.jqxNumberInput('max') || x < _this.columnIndexStart.jqxNumberInput('min'));
            return !errorValue;
        }
        var checkNames = function() {
            errorValue = settings.names.find(x => _this.allColumns.findIndex(y => y.name === x) < 0);
            return !errorValue;
        }

        if (settings.useRange && settings.start > settings.end) {
            validateFlag = false;
            validateMsg = `Column Index Range [${settings.end}] is invalid.`;
            const errorDiv = this.$mainControl.find('.column-range-error');
            errorDiv.find('> span').text(validateMsg);
            errorDiv.show();
        } else if (settings.useIndex && !checkIndexes()) {
            validateFlag = false;
            validateMsg = `Column Index [${errorValue}] is invalid.`;
            const errorDiv = this.$mainControl.find('.column-index-error');
            errorDiv.find('> span').text(validateMsg);
            errorDiv.show();
        } else if (settings.useName && !checkNames()) {
            validateFlag = false;
            validateMsg = `Column Name [${errorValue}] is invalid.`;
            const errorDiv = this.$mainControl.find('.column-name-error');
            errorDiv.find('> span').text(validateMsg);
            errorDiv.show();
        }
        return validateFlag;
    };

    ColumnSettings.prototype.open = function (position, schema, options) {
        this.pageSize = schema.pageSize;
        this.getAllColumns(schema, options);
        this.render(schema, options);
        this.$mainControl.dialog({
            position: {my: "left top", at: "right+5 top", of: position}
        });

        this.$mainControl.parent().find('.ui-dialog-titlebar.ui-widget-header').attr('style', 'border: none !important; margin-left: 11px !important');
        this.$mainControl.dialog('open');
        $(window).on('mousedown', this.closeHandler);
    };

    ColumnSettings.prototype.getAllColumns = function (schema, options) {
        var _this = this;
        var userId = Brightics.VA.Env.Session.userId;
        var key =  `/${userId}/${options.dataProxy.mid}/${schema.tableId}`;
        var opt = {
            url: 'api/va/v2/data/staging/schema?key=' + key,
            type: 'GET',
            blocking: false,
            contentType: 'application/json; charset=utf-8'
        };
        return $.ajax(opt).done(function (data) {
            _this.allColumns = data.columns;
            _this.approxSize = data.bytes;
            _this.rowCount = data.count;
        });
    };

    ColumnSettings.prototype.render = function (schema, options) {
        this.columnIndexStart.jqxNumberInput({ max: schema.columnLength });
        this.columnIndexEnd.jqxNumberInput({ max: schema.columnLength });
        this.tableId = schema.tableId;
        var settings = null;
        
        if (options.fnUnit.display.columns) {
             settings = options.fnUnit.display.columns[schema.tableId];
             if (settings) {
                this.columnIndexStart.jqxNumberInput('val', settings.start);
                this.columnIndexEnd.jqxNumberInput('val', settings.end);
                this.columnIndexes.jqxInput('val', settings.indexes.join(','));
                this.columnNames.jqxInput('val', settings.names.join(','));

                this.columnRangeCheck.jqxCheckBox('val', settings.useRange);
                this.columnIndexCheck.jqxCheckBox('val', settings.useIndex);
                this.columnNameCheck.jqxCheckBox('val', settings.useName);
             }
        } 

        if (!settings) {
            this.columnIndexStart.jqxNumberInput('val', 1);
            this.columnIndexEnd.jqxNumberInput('val', 1000);
            this.columnIndexes.jqxInput('val', '');
            this.columnNames.jqxInput('val', '');

            this.columnRangeCheck.jqxCheckBox('val', true);
            this.columnIndexCheck.jqxCheckBox('val', false);
            this.columnNameCheck.jqxCheckBox('val', false);
        }
    };

    ColumnSettings.prototype.close = function (source) {
        this.$mainControl.dialog('close');
    };

    Brightics.VA.Core.Editors.Sheet.Controls.ColumnSettings = ColumnSettings;

}).call(this);
