/**
 * Created by SDS on 2016-09-01.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var LineNavigator = root.LineNavigator;

    function SelectLocalDataPage(parentId, options) {
        this.options = options;
        this.options.class = 'selectlocaldatapage';
        Brightics.VA.Core.Wizards.Pages.WizardPage.call(this, parentId, this.options);

        this.options.wizard.registerEvent('changeData');
    }

    SelectLocalDataPage.prototype = Object.create(Brightics.VA.Core.Wizards.Pages.WizardPage.prototype);
    SelectLocalDataPage.prototype.constructor = SelectLocalDataPage;

    SelectLocalDataPage.prototype.init = function () {
        Brightics.VA.Core.Wizards.Pages.WizardPage.prototype.init.call(this);

        this.options.wizard.$btnPrevious.jqxButton({disabled: false});
        this.options.wizard.$btnFinish.jqxButton({disabled: true});
        if (this.options.wizard.result.fileName) // 파일 있으면
            if (!Brightics.VA.Core.Utils.InputValidator.isValid.type4(this.options.wizard.result.fileName)) {
                this.options.wizard.$btnNext.jqxButton({disabled: true});
            } else {
                this.options.wizard.$btnNext.jqxButton({disabled: false});
            }
        else
            this.options.wizard.$btnNext.jqxButton({disabled: true});

        this.options.wizard.result.data = this.options.wizard.result.data || [];
    };

    SelectLocalDataPage.prototype.createHeaderArea = function ($parent) {
        $parent.addClass('brtc-va-wizardpage-dataupload');
        this.$wizardHeader = $('' +
            '   <div class="step01">' +
            '       <span class="brtc-va-icon step normal selected"></span>' +
            '       <p class="step normal selected"><strong>01</strong>'+Brightics.locale.common.selectData+'</p>' +
            '   </div>' +
            '   <div class="step02">' +
            '       <span class="brtc-va-icon step disabled"></span>' +
            '       <p class="step disabled"><strong>02</strong>'+Brightics.locale.common.setDelimiter+'</p>' +
            '   </div>' +
            '   <div class="step03">' +
            '       <span class="brtc-va-icon step disabled"></span>' +
            '       <p class="step disabled"><strong>03</strong>'+Brightics.locale.common.setColumnDataType+'</p>' +
            '   </div>');
        $parent.append(this.$wizardHeader);
    };

    SelectLocalDataPage.prototype.createContentsArea = function ($parent) {
        $parent.addClass('brtc-va-wizardpage-dataupload');

        var _this = this;
        this.options.wizard.result.uploadTo = 'shared';

        $parent.append($('' +
            '   <div class="fileselect">' +
            '       <div style="font-size: 13px; font-style: italic; margin-bottom: 20px;">'+ Brightics.locale.sentence.S0021 +'</div>' +
            '       <div class="header">' +
            '           <span>'+Brightics.locale.common.file+': </span>' +
            '               <input for="brtc-va-wizardpage-dataupload-contents-fileselectpage-ex-filename" type="button" id="fileselect-local" value="'+Brightics.locale.common.local+'" />' +
            '               <input type="file" id="brtc-va-wizardpage-dataupload-contents-fileselectpage-ex-filename" name="fileToUpload" accept=".csv,.txt">' +
            '       </div>' +
            '       <div class="contents filename">' +
            '           <span class="nodata">'+Brightics.locale.common.selectfiletoupload+'</span>' +
            '       </div>' +
            '   </div>' +
            '   <div class="uploadtoselect">' +
            '       <div class="header">' +
            '           <span>Add to: </span>' +
            '       </div>' +
            '       <div class="contents">' +
            '           <div class="brtc-va-radio">' +
            '               <div class="brtc-va-radio-button" id="upload-to-shared-local" value="shared">Shared</div>' +
            '           </div>' +
            '           <div class="brtc-va-radio">' +
            '               <div class="brtc-va-radio-button" id="upload-to-userid-local" value="' + Brightics.VA.Core.Utils.WidgetUtils.convertHTMLSpecialChar(Brightics.VA.Env.Session.userId) + '"><span>' + Brightics.VA.Core.Utils.WidgetUtils.convertHTMLSpecialChar(Brightics.VA.Env.Session.userId) + '</span></div>' +
            '           </div>' +
            '       </div>' +
            '   </div>' +
            '   <div class="preview selectdata local">' +
            '       <div class="header">' +
            '           <span>' +Brightics.locale.common.dataPreview+ '</span>' +
            '       </div>' +
            '       <div class="contents">' +
            '           <span class="nodata">'+Brightics.locale.common.noData+'</span>' +
            '       </div>' +
            '   </div>'));

        var $btnLocal = $parent.find('#fileselect-local');
        var fileSelect = $parent.find('#brtc-va-wizardpage-dataupload-contents-fileselectpage-ex-filename');


        $parent.find('#upload-to-shared-local').jqxRadioButton({
            theme: Brightics.VA.Env.Theme,
            height: 25,
            width: 100,
            boxSize: '18px',
            groupName: 'local'
        });
        $parent.find('#upload-to-userid-local').jqxRadioButton({
            theme: Brightics.VA.Env.Theme,
            height: 25,
            width: 200,
            boxSize: '18px',
            groupName: 'local',
            checked: true
        });

        $parent.find('.brtc-va-radio-button').on('checked', function (event) {
            _this.options.wizard.result.uploadTo = this.getAttribute('value');
        });

        $btnLocal.jqxButton({
            theme: Brightics.VA.Env.Theme
        });

        $btnLocal.on('click', function () {
            fileSelect.click();
        });

        fileSelect.on('change', function (event) {
            if ($(this)[0] && $(this)[0].files[0]) {
                _this.options.wizard.triggerEvent('changeData', true);
                _this.options.wizard.result.file = $(this)[0].files[0];

                _this.options.wizard.result.fileName = _this.options.wizard.result.file.name;
                if (!window.FileReader) {
                    _this.options.wizard.result.fileName = $(this).val().split('/').pop().split('\\').pop();  // 파일명만 추출
                }

                if (!Brightics.VA.Core.Utils.InputValidator.isValid.type4(_this.options.wizard.result.fileName)) {
                    _this.alertInvalid();
                    _this.options.wizard.$btnNext.jqxButton({disabled: true});
                } else {
                    _this.handleLocalFileSelected(event);
                    _this.options.wizard.$btnNext.jqxButton({disabled: false});
                }
            }
        });
    };

    SelectLocalDataPage.prototype.alertInvalid = function () {
        var $fileName = this.$contentsControl.find('.filename');
        $fileName.empty();

        var message = '※ File Name allows only the following characters: "a-z", "A-Z", "0-9", "_", ".".';

        $fileName.append($('' +
            '<span class="brtc-va-wizard-invalid-file-icon"></span>' +
            '<span class="brtc-va-wizard-invalid-file-name">' + message + '</span>'));
        this.reset();
        this.refreshButton();
    };

    SelectLocalDataPage.prototype.handleLocalFileSelected = function () {
        var _this = this;

        var $fileName = this.$contentsControl.find('.filename');
        $fileName.empty();
        $fileName.append($('' +
            '<span class="brtc-va-icon brtc-va-wizardpage-dataupload file"></span>' +
            '<span>' + Brightics.VA.Core.Utils.WidgetUtils.convertHTMLSpecialChar(this.options.wizard.result.fileName) + '</span>'));

        try {
            var chunkSize = (function (browserName) {
                if (browserName === 'Chrome') {
                    return 1024 * 1024 * 100; // 100MB
                } else {
                    return 1024 * 1024 * 16; // 16MB
                }
            }(Brightics.VA.Core.Utils.CommonUtils.getUserBrowserName()));
            var navigator = new LineNavigator(this.options.wizard.result.file, {
                chunkSize: chunkSize
            });
            navigator.readLines(0, 20, function (err, index, lines, isEof, progress) {
                _this.reset();
                _this.updateFileSelectPreview(lines);
            });
        } catch (err) {
            _this.refreshButton();
        }
    };

    SelectLocalDataPage.prototype.updateFileSelectPreview = function (lines) {
        var $contentArea = this.$contentsControl.find('.preview.selectdata.local').find('.contents');
        var index = 0;
        for (var i = 0; i < lines.length; i++) {
            if (!lines[i].trim()) continue;

            $contentArea.find('.number-column').append($('<li>' + (index + 1) + '</li>'));
            $contentArea.find('.data-column').append($('<li>' + Brightics.VA.Core.Utils.WidgetUtils.convertHTMLSpecialChar(lines[i]) + '</li>'));

            if (index == 0 || index == 1) this.options.wizard.result.data.push(lines[i]);  //Column과 첫번째 데이터만 Data에 넣기
            index++;
        }
        this.$parent.find('.preview').find('.contents').perfectScrollbar();
    };

    SelectLocalDataPage.prototype.reset = function () {
        var $preview = this.$parent.find('.preview').find('.contents');

        this.options.wizard.result.data = [];
        $('input[type=file]').val('');

        $preview.empty();
        $preview.append($('<ul class="number-column"></ul>'));
        $preview.append($('<ul class="data-column"></ul>'));
    };

    SelectLocalDataPage.prototype.refreshButton = function (status) {
        // this.options.wizard.$btnNext.jqxButton({disabled: !status});
        // this.options.wizard.$btnFinish.jqxButton({disabled: true});
    };

    Brightics.VA.Core.Wizards.Pages.SelectLocalDataPage = SelectLocalDataPage;

}).call(this);
