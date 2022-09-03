/**
 * Created by gy84.bae on 2016-11-09.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function SelectExportDelimiterPage(parentId, options) {
        this.options = options;
        this.options.class = 'selectexportdelimiterpage';

        Brightics.VA.Core.Wizards.Pages.WizardPage.call(this, parentId, this.options);
    }

    SelectExportDelimiterPage.prototype = Object.create(Brightics.VA.Core.Wizards.Pages.WizardPage.prototype);
    SelectExportDelimiterPage.prototype.constructor = SelectExportDelimiterPage;

    SelectExportDelimiterPage.prototype.init = function () {
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
        if (this.options.wizard.result.delimiter) {
            // delimiters 있으면
            this.options.wizard.$btnNext.jqxButton({disabled: true});
            this.options.wizard.$btnFinish.jqxButton({disabled: false});
        }
        else {
            this.options.wizard.$btnFinish.jqxButton({disabled: true});
            this.options.wizard.$btnNext.jqxButton({disabled: true});
        }
    };

    SelectExportDelimiterPage.prototype.createHeaderArea = function ($parent) {
        //$parent.addClass('brtc-va-wizardpage-dataupload');
        //this.$wizardHeader = $('' +
        //    '   <div class="step01">' +
        //    '       <span class="brtc-va-icon step disabled"></span>' +
        //    '       <p class="step disabled"><strong>01</strong> Select Data</p>' +
        //    '   </div>' +
        //    '   <div class="step02">' +
        //    '       <span class="brtc-va-icon step normal selected"></span>' +
        //    '       <p class="step normal selected"><strong>02</strong> Set Delimiter</p>' +
        //    '   </div>' +
        //    '   <div class="step03">' +
        //    '       <span class="brtc-va-icon step disabled"></span>' +
        //    '       <p class="step disabled"><strong>03</strong> Set Column Data Format</p>' +
        //    '   </div>');
        //$parent.append(this.$wizardHeader);
    };

    SelectExportDelimiterPage.prototype.createContentsArea = function ($parent) {

        //Brightics.VA.Core.Wizards.Pages.WizardPage.prototype.createContentsArea.call(this, $parent);
        $parent.addClass('brtc-va-wizardpage-dataexport');
        var _this = this;
        this.$progress = $('' +
            '   <div class="brtc-va-progress">' +
            '       <div>' +
            '           <span class="brtc-va-progress-loading"/>' +
            '           <p>Exporting...</p>' +
            '       </div>' +
            '</div>');
        $parent.append(this.$progress);
        this.$progress.hide();


        $parent.append($('' +
            '<div class="fileselect">' +
            '   <div class="header">' +
            '       <span>'+ Brightics.locale.common.exportFile +'</span>' +
            '    </div>' +
            '       <div class="contents filename">' +
            '           <span class="nodata">Select file to upload</span>' +
            '       </div>' +
            '</div>' +

            //this.createColumnDelimiterArea($parent);
            //this.createArrayDateDelimiterArea($parent);
            //this.createKeyValueDataDelimiterArea($parent);

            '<div class="delimiterselect brtc-va-column-delimiter">' +
            '   <div class="header">' +
            '       <span>'+Brightics.locale.common.delimiters+'</span>' +
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
            '            <div class="brtc-va-radio-button selectdelimiter" id="delimiter-other" value="other"><div class="brtc-va-delimiter-input-wrapper"><input type="text" class="brtc-va-delimiter-input" maxlength="80"/></div></div>' +
            '        </div>' +
            '   </div>' +
            '</div>'));

        $parent.css({
            height: '400px'
        });


        $parent.find('.brtc-va-radio-button').jqxRadioButton({
            theme: Brightics.VA.Env.Theme,
            height: 28,
            width: 102,
            boxSize: '18px',
            groupName: 'delimiter'
        });
        //$parent.find('.brtc-va-column-delimiter .brtc-va-radio-button[value=comma]').jqxRadioButton('check');
        $parent.find('.brtc-va-column-delimiter .brtc-va-delimiter-input').jqxInput({
            theme: Brightics.VA.Env.Theme,
            width: 77,
            height: 25
        });

        $parent.find('.brtc-va-column-delimiter .jqx-radiobutton').on('change', function (event) {
            if (event.target.tagName == 'INPUT') {
                _this.options.wizard.result.delimiter = $parent.find('.brtc-va-column-delimiter .brtc-va-delimiter-input').val();
            } else {
                var checked = event.args.checked;
                if (checked) {
                    var value = event.target.getAttribute('value');
                    if (value == 'other') {
                        _this.options.wizard.result.delimiter = $parent.find('.brtc-va-column-delimiter .brtc-va-delimiter-input').val();
                    }
                    else {
                        _this.options.wizard.result.delimiter = _this.delimiterMap[value];
                    }
                }
            }
            if (_this.options.wizard.result.delimiter) {
                _this.options.wizard.$btnFinish.jqxButton({disabled: false});
            } else {
                _this.options.wizard.$btnFinish.jqxButton({disabled: true});
            }
        });

        $parent.find('.brtc-va-column-delimiter .brtc-va-radio-button[value=other]').on('checked', function () {
            $parent.find('.brtc-va-column-delimiter .brtc-va-delimiter-input').jqxInput('focus');
        });


        _this.handleExportFileSelected();
    };

    SelectExportDelimiterPage.prototype.handleExportFileSelected = function () {
        var _this = this;

        var wizardOption = _this.options.wizard;

        var $fileName = this.$contentsControl.find('.filename');
        $fileName.empty();
        $fileName.append($('' +
            '<span class="brtc-va-icon brtc-va-wizardpage-dataupload file"></span>' +
            '<span>' + Brightics.VA.Core.Utils.WidgetUtils.convertHTMLSpecialChar(wizardOption.options.name) + '</span>'));

    };

    SelectExportDelimiterPage.prototype.doFinish = function () {
        var _this = this;
        _this.progress(true, 'Exporting...');
        var downloader = Brightics.VA.Core.Utils.DownLoader;
        if (this.options.wizard.result.copyFrom === 'local') {
            var fileName = _this.options.wizard.options.name;
            var delimiter = _this.options.wizard.result.delimiter;
            var delimiters = {};
            delimiters.delimiter = delimiter;
            var path = _this.options.wizard.options.path;

            downloader.runStartWithExport(fileName, path, delimiters, function () {
                _this.progress(false);
            }, function (err) {
                Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(err, function () {
                    _this.$parent.parent().dialog('destroy');
                });
            });
        }
    };

    SelectExportDelimiterPage.prototype.progress = function (status, label) {
        var _this = this;
        if (status) {
            this.$progress.show();
            this.options.wizard.$btnFinish.jqxButton({disabled: status});
        }
        else {
            this.$progress.hide();
            if (label) {
                Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog(label, function () {
                    _this.$parent.parent().dialog('destroy');
                });
            } else {
                Brightics.VA.Core.Utils.WidgetUtils.openInformationDialog('Data Export preparation has been successfully completed. File Download will start.', function () {
                    _this.$parent.parent().dialog('destroy');
                });
            }
        }
        this.options.wizard.$btnPrevious.jqxButton({disabled: status});
    };

    Brightics.VA.Core.Wizards.Pages.SelectExportDelimiterPage = SelectExportDelimiterPage;

}).call(this);