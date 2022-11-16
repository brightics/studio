/**
 * Created by SDS on 2016-09-01.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function SetDownloadDelimiterPage(parentId, options) {
        this.options = options;
        this.options.class = 'setdownloaddelimiterpage';

        Brightics.VA.Core.Wizards.Pages.WizardPage.call(this, parentId, this.options);
    }

    SetDownloadDelimiterPage.prototype = Object.create(Brightics.VA.Core.Wizards.Pages.WizardPage.prototype);
    SetDownloadDelimiterPage.prototype.constructor = SetDownloadDelimiterPage;

    SetDownloadDelimiterPage.prototype.init = function () {
        Brightics.VA.Core.Wizards.Pages.WizardPage.prototype.init.call(this);

        this.options.wizard.result.delimiters = {
            delimiter: ',',
            'array-delimiter': ';',
            'key-value-delimiter': ':',
            'quote-delimiter': '"'
        };
        this.delimiterMap = {
            comma: ',',
            tab: '\t',
            semicolon: ';',
            colon: ':',
            space: ' '
        }
    };

    SetDownloadDelimiterPage.prototype.createHeaderArea = function ($parent) {

    };

    SetDownloadDelimiterPage.prototype.createContentsArea = function ($parent) {
        this.createTableSelectorArea($parent);
        this.createColumnDelimiterArea($parent);
        this.createFileNameArea($parent);
        //this.createQuoteDelimiterArea($parent);
        //this.createArrayDateDelimiterArea($parent);
        //this.createKeyValueDataDelimiterArea($parent);
    };

    SetDownloadDelimiterPage.prototype.createTableSelectorArea = function ($parent) {
        var _this = this;
        $parent.append($('' +
            '<div class="">' +
            '   <div class="header">' +
            '       <span>Table Selector</span>' +
            '    </div>' +
            '    <div class="contents">' +
            '        <div class="table-selector">' +
            '        </div>' +
            '   </div>' +
            '</div>'));

        var tableSelector = $parent.find('.table-selector').jqxDropDownList({
            theme: Brightics.VA.Env.Theme,
            autoDropDownHeight: true,
            width: '611px',
            selectedIndex: 0,
            source: this.options.wizard.options.downloaderOptions.tableObjList
        });
        _this.options.wizard.result.tid = tableSelector.jqxDropDownList('getSelectedItem').value;

        $parent.find('.table-selector').on('change', function (event) {
            _this.options.wizard.result.tid = event.args.item.value;
        });
    };

    SetDownloadDelimiterPage.prototype.createFileNameArea = function ($parent) {
        var _this = this;
        $parent.append($('' +
            '<div class="">' +
            '   <div class="header">' +
            '       <span>File Name</span>' +
            '    </div>' +
            '    <div class="contents">' +
            '        <div class="brtc-va-input-wrapper">' +
            '        <input type="text" class="brtc-va-input-file-name"  maxlength="80"/>' +
            '        </div>' +
            '   </div>' +
            '</div>'));

        $parent.find('.brtc-va-input-wrapper .brtc-va-input-file-name').jqxInput({
            theme: Brightics.VA.Env.Theme,
            width: '611px',
            height: 26,
            placeHolder : _this.options.wizard.options.downloaderOptions.fileName
        });

        $parent.find('.brtc-va-input-wrapper .brtc-va-input-file-name').on('change', function (event) {
            var fileName = $parent.find('.brtc-va-input-wrapper .brtc-va-input-file-name').val().trim();
            _this.options.wizard.result.fileName = fileName.replace(/\s/g, '_');
        });
    };

    SetDownloadDelimiterPage.prototype.createColumnDelimiterArea = function ($parent) {
        var _this = this;
        var oldValue; // column 이외의 delimiter 선택을 없애면서 생긴 delimiter 중복 방지를 위한 어거지 로직
        $parent.append($('' +
            '<div class="delimiterselect brtc-va-column-delimiter">' +
            '   <div class="header">' +
            '       <span>Column Delimiter</span>' +
            '    </div>' +
            '    <div class="contents">' +
            '        <div class="brtc-va-radio">' +
            '            <div class="brtc-va-radio-button selectdelimiter" id="delimiter-comma" value="comma">Comma</div>' +
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
            '            <div class="brtc-va-radio-button selectdelimiter" id="delimiter-other" value="other"><div class="brtc-va-delimiter-input-wrapper"><input type="text" class="brtc-va-delimiter-input"  maxlength="80"/></div></div>' +
            '        </div>' +
            '   </div>' +
            '</div>'));

        $parent.find('.brtc-va-column-delimiter .brtc-va-radio-button').jqxRadioButton({
            theme: Brightics.VA.Env.Theme,
            height: 26,
            width: 103,
            boxSize: '18px',
            groupName: 'delimiter'
        });
        $parent.find('.brtc-va-column-delimiter .brtc-va-radio-button[value=comma]').jqxRadioButton('check');
        $parent.find('.brtc-va-column-delimiter .jqx-radiobutton').on('change', function (event) {
            if (_this.options.wizard.result.delimiters.delimiter) oldValue = _this.options.wizard.result.delimiters.delimiter; // column 이외의 delimiter 선택을 없애면서 생긴 delimiter 중복 방지를 위한 어거지 로직
            if (event.target.tagName == 'INPUT') {
                _this.options.wizard.result.delimiters.delimiter = $parent.find('.brtc-va-column-delimiter .brtc-va-delimiter-input').val();
            } else {
                var checked = event.args.checked;
                if (checked) {
                    var value = event.target.getAttribute('value');
                    if (value == 'other') {
                        _this.options.wizard.result.delimiters.delimiter = $parent.find('.brtc-va-column-delimiter .brtc-va-delimiter-input').val();
                    }
                    else {
                        _this.options.wizard.result.delimiters.delimiter = _this.delimiterMap[value];
                    }
                }
            }

            // column 이외의 delimiter 선택을 없애면서 생긴 delimiter 중복 방지를 위한 어거지 로직
            for (var key in _this.options.wizard.result.delimiters) {
                if(key === 'delimiter') continue;
                if(_this.options.wizard.result.delimiters[key] === _this.options.wizard.result.delimiters.delimiter) _this.options.wizard.result.delimiters[key] = oldValue;
            }
        });

        $parent.find('.brtc-va-column-delimiter .brtc-va-delimiter-input').jqxInput({
            theme: Brightics.VA.Env.Theme,
            width: 73,
            height: 24
        });

        $parent.find('.brtc-va-column-delimiter .brtc-va-radio-button[value=other]').on('checked', function () {
            $parent.find('.brtc-va-column-delimiter .brtc-va-delimiter-input').jqxInput('focus');
        });
    };

    SetDownloadDelimiterPage.prototype.createArrayDateDelimiterArea = function ($parent) {
        var _this = this;
        $parent.append($('' +
            '<div class="delimiterselect brtc-va-array-delimiter">' +
            '   <div class="header">' +
            '       <span>Array Data Delimiter</span>' +
            '    </div>' +
            '    <div class="contents">' +
            '        <div class="brtc-va-radio">' +
            '            <div class="brtc-va-radio-button selectdelimiter" id="array-delimiter-comma" value="comma">Comma</div>' +
            '        </div>' +
            '        <div class="brtc-va-radio">' +
            '            <div class="brtc-va-radio-button selectdelimiter" id="array-delimiter-tab" value="tab"><span>Tab</span></div>' +
            '        </div>' +
            '        <div class="brtc-va-radio">' +
            '            <div class="brtc-va-radio-button selectdelimiter" id="array-delimiter-space" value="space"><span>Space</span></div>' +
            '        </div>' +
            '        <div class="brtc-va-radio">' +
            '            <div class="brtc-va-radio-button selectdelimiter" id="array-delimiter-colon" value="colon"><span>Colon</span></div>' +
            '        </div>' +
            '        <div class="brtc-va-radio">' +
            '            <div class="brtc-va-radio-button selectdelimiter" id="array-delimiter-semicolon" value="semicolon"><span>SemiColon</span></div>' +
            '        </div>' +
            '        <div class="brtc-va-radio">' +
            '            <div class="brtc-va-radio-button selectdelimiter" id="array-delimiter-other" value="other"><div class="brtc-va-delimiter-input-wrapper"><input type="text" class="brtc-va-delimiter-input" maxlength="80"/></div></div>' +
            '        </div>' +
            '   </div>' +
            '</div>'));

        $parent.find('.brtc-va-array-delimiter .brtc-va-radio-button').jqxRadioButton({
            theme: Brightics.VA.Env.Theme,
            height: 26,
            width: 103,
            boxSize: '18px',
            groupName: 'array-delimiter'
        });
        $parent.find('.brtc-va-array-delimiter .brtc-va-radio-button[value=semicolon]').jqxRadioButton('check');
        $parent.find('.brtc-va-array-delimiter .jqx-radiobutton').on('change', function (event) {
            if (event.target.tagName == 'INPUT') {
                _this.options.wizard.result.delimiters['array-delimiter'] = $parent.find('.brtc-va-array-delimiter .brtc-va-delimiter-input').val();
            }
            else {
                var checked = event.args.checked;
                if (checked) {
                    var value = event.target.getAttribute('value');
                    if (value == 'other') {
                        _this.options.wizard.result.delimiters['array-delimiter'] = $parent.find('.brtc-va-array-delimiter .brtc-va-delimiter-input').val();
                    }
                    else {
                        _this.options.wizard.result.delimiters['array-delimiter'] = _this.delimiterMap[value];
                    }
                }
            }
        });

        $parent.find('.brtc-va-array-delimiter .brtc-va-delimiter-input').jqxInput({
            theme: Brightics.VA.Env.Theme,
            width: 73,
            height: 24
        });

        $parent.find('.brtc-va-array-delimiter .brtc-va-radio-button[value=other]').on('checked', function () {
            $parent.find('.brtc-va-array-delimiter .brtc-va-delimiter-input').jqxInput('focus');
        });
    };

    SetDownloadDelimiterPage.prototype.createKeyValueDataDelimiterArea = function ($parent) {
        var _this = this;
        $parent.append($('' +
            '<div class="delimiterselect brtc-va-key-value-delimiter">' +
            '   <div class="header">' +
            '       <span>Key Value Data Delimiter</span>' +
            '    </div>' +
            '    <div class="contents">' +
            '        <div class="brtc-va-radio">' +
            '            <div class="brtc-va-radio-button selectdelimiter" id="key-value-delimiter-comma" value="comma">Comma</div>' +
            '        </div>' +
            '        <div class="brtc-va-radio">' +
            '            <div class="brtc-va-radio-button selectdelimiter" id="key-value-delimiter-tab" value="tab"><span>Tab</span></div>' +
            '        </div>' +
            '        <div class="brtc-va-radio">' +
            '            <div class="brtc-va-radio-button selectdelimiter" id="key-value-delimiter-space" value="space"><span>Space</span></div>' +
            '        </div>' +
            '        <div class="brtc-va-radio">' +
            '            <div class="brtc-va-radio-button selectdelimiter" id="key-value-delimiter-colon" value="colon"><span>Colon</span></div>' +
            '        </div>' +
            '        <div class="brtc-va-radio">' +
            '            <div class="brtc-va-radio-button selectdelimiter" id="key-value-delimiter-semicolon" value="semicolon"><span>SemiColon</span></div>' +
            '        </div>' +
            '        <div class="brtc-va-radio">' +
            '            <div class="brtc-va-radio-button selectdelimiter" id="key-value-delimiter-other" value="other"><div class="brtc-va-delimiter-input-wrapper"><input type="text" class="brtc-va-delimiter-input" maxlength="80"/></div></div>' +
            '        </div>' +
            '   </div>' +
            '</div>'));

        $parent.find('.brtc-va-key-value-delimiter .brtc-va-radio-button').jqxRadioButton({
            theme: Brightics.VA.Env.Theme,
            height: 26,
            width: 103,
            boxSize: '18px',
            groupName: 'key-value-delimiter'
        });
        $parent.find('.brtc-va-key-value-delimiter .brtc-va-radio-button[value=colon]').jqxRadioButton('check');
        $parent.find('.brtc-va-key-value-delimiter .jqx-radiobutton').on('change', function (event) {
            if (event.target.tagName == 'INPUT') {
                _this.options.wizard.result.delimiters['key-value-delimiter'] = $parent.find('.brtc-va-key-value-delimiter .brtc-va-delimiter-input').val();
            }
            else {
                var checked = event.args.checked;
                if (checked) {
                    var value = event.target.getAttribute('value');
                    if (value == 'other') {
                        _this.options.wizard.result.delimiters['key-value-delimiter'] = $parent.find('.brtc-va-key-value-delimiter .brtc-va-delimiter-input').val();
                    }
                    else {
                        _this.options.wizard.result.delimiters['key-value-delimiter'] = _this.delimiterMap[value];
                    }
                }
            }
        });

        $parent.find('.brtc-va-key-value-delimiter .brtc-va-delimiter-input').jqxInput({
            theme: Brightics.VA.Env.Theme,
            width: 73,
            height: 24
        });

        $parent.find('.brtc-va-key-value-delimiter .brtc-va-radio-button[value=other]').on('checked', function () {
            $parent.find('.brtc-va-key-value-delimiter .brtc-va-delimiter-input').jqxInput('focus');
        });
    };

    SetDownloadDelimiterPage.prototype.createQuoteDelimiterArea = function ($parent) {
        var _this = this;
        $parent.append($('' +
            '<div class="delimiterselect brtc-va-quote-delimiter">' +
            '   <div class="header">' +
            '       <span>Quote Delimiter</span>' +
            '    </div>' +
            '    <div class="contents">' +
            '        <div class="brtc-va-radio">' +
            '            <div class="brtc-va-radio-button selectdelimiter" id="quote-delimiter-comma" value="comma">Comma</div>' +
            '        </div>' +
            '        <div class="brtc-va-radio">' +
            '            <div class="brtc-va-radio-button selectdelimiter" id="quote-delimiter-tab" value="tab"><span>Tab</span></div>' +
            '        </div>' +
            '        <div class="brtc-va-radio">' +
            '            <div class="brtc-va-radio-button selectdelimiter" id="quote-delimiter-space" value="space"><span>Space</span></div>' +
            '        </div>' +
            '        <div class="brtc-va-radio">' +
            '            <div class="brtc-va-radio-button selectdelimiter" id="quote-delimiter-colon" value="colon"><span>Colon</span></div>' +
            '        </div>' +
            '        <div class="brtc-va-radio">' +
            '            <div class="brtc-va-radio-button selectdelimiter" id="quote-delimiter-semicolon" value="semicolon"><span>SemiColon</span></div>' +
            '        </div>' +
            '        <div class="brtc-va-radio">' +
            '            <div class="brtc-va-radio-button selectdelimiter" id="quote-delimiter-other" value="other"><div class="brtc-va-delimiter-input-wrapper"><input type="text" class="brtc-va-delimiter-input" maxlength="80"/></div></div>' +
            '        </div>' +
            '   </div>' +
            '</div>'));

        $parent.find('.brtc-va-quote-delimiter .brtc-va-radio-button').jqxRadioButton({
            theme: Brightics.VA.Env.Theme,
            height: 26,
            width: 103,
            boxSize: '18px',
            groupName: 'quote-delimiter'
        });
        $parent.find('.brtc-va-quote-delimiter .brtc-va-radio-button[value=other]').jqxRadioButton('check');
        $parent.find('.brtc-va-quote-delimiter .jqx-radiobutton').on('change', function (event) {
            if (event.target.tagName == 'INPUT') {
                _this.options.wizard.result.delimiters['quote-delimiter'] = $parent.find('.brtc-va-quote-delimiter .brtc-va-delimiter-input').val();
            }
            else {
                var checked = event.args.checked;
                if (checked) {
                    var value = event.target.getAttribute('value');
                    if (value == 'other') {
                        _this.options.wizard.result.delimiters['quote-delimiter'] = $parent.find('.brtc-va-quote-delimiter .brtc-va-delimiter-input').val();
                    }
                    else {
                        _this.options.wizard.result.delimiters['quote-delimiter'] = _this.delimiterMap[value];
                    }
                }
            }
        });

        $parent.find('.brtc-va-quote-delimiter .brtc-va-delimiter-input').jqxInput({
            theme: Brightics.VA.Env.Theme,
            width: 73,
            height: 24,
            value: '"'
        });

        $parent.find('.brtc-va-quote-delimiter .brtc-va-radio-button[value=other]').on('checked', function () {
            $parent.find('.brtc-va-quote-delimiter .brtc-va-delimiter-input').jqxInput('focus');
        });
    };

    SetDownloadDelimiterPage.prototype.destroy = function () {
        this.$parent.find('.table-selector').jqxDropDownList('destroy');
    };

    Brightics.VA.Core.Wizards.Pages.SetDownloadDelimiterPage = SetDownloadDelimiterPage;

}).call(this);