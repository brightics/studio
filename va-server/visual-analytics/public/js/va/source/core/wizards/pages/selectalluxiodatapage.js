/**
 * Created by SDS on 2016-09-01.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function SelectAlluxioDataPage(parentId, options) {
        this.options = options;
        this.options.class = 'selectalluxiodatapage';

        Brightics.VA.Core.Wizards.Pages.WizardPage.call(this, parentId, this.options);

        this.options.wizard.registerEvent('changeData');
    }

    SelectAlluxioDataPage.prototype = Object.create(Brightics.VA.Core.Wizards.Pages.WizardPage.prototype);
    SelectAlluxioDataPage.prototype.constructor = SelectAlluxioDataPage;

    SelectAlluxioDataPage.prototype.init = function () {
        Brightics.VA.Core.Wizards.Pages.WizardPage.prototype.init.call(this);

        this.options.wizard.$btnPrevious.jqxButton({disabled: false});
        this.options.wizard.$btnFinish.jqxButton({disabled: true});
        if (this.options.wizard.result.remotePath) // 파일 있으면
            this.options.wizard.$btnNext.jqxButton({disabled: false});
        else
            this.options.wizard.$btnNext.jqxButton({disabled: true});

        this.options.wizard.result.data = this.options.wizard.result.data || [];
    };

    SelectAlluxioDataPage.prototype.createHeaderArea = function ($parent) {
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
            '       <p class="step disabled"><strong>03</strong>'+Brightics.locale.common.setColumnDataFormat+'</p>' +
            '   </div>');
        $parent.append(this.$wizardHeader);
    };

    SelectAlluxioDataPage.prototype.createContentsArea = function ($parent) {
        $parent.addClass('brtc-va-wizardpage-dataupload');

        var _this = this;

        $parent.append($('' +
            '   <div class="fileselect">' +
            '       <div style="font-size: 13px; font-style: italic; margin-bottom: 20px;">Select data consisting of delimiter-separated values.</div>' +
            '       <div class="header">' +
            '           <span>File: </span>' +
            '               <input type="button" id="fileselect-remote" value="Remote" />' +
            '       </div>' +
            '       <div class="contents filename">' +
            '           <span class="nodata">Select file to upload</span>' +
            '       </div>' +
            '   </div>' +
            '   <div class="uploadtoselect">' +
            '       <div class="header">' +
            '           <span>Add to: </span>' +
            '       </div>' +
            '       <div class="contents">' +
            '           <div class="brtc-va-radio">' +
            '               <div class="brtc-va-radio-button" id="upload-to-shared-alluxio" value="shared">Shared</div>' +
            '           </div>' +
            '           <div class="brtc-va-radio">' +
            '               <div class="brtc-va-radio-button" id="upload-to-userid-alluxio" value="' + Brightics.VA.Core.Utils.WidgetUtils.convertHTMLSpecialChar(Brightics.VA.Env.Session.userId) + '"><span>' + Brightics.VA.Core.Utils.WidgetUtils.convertHTMLSpecialChar(Brightics.VA.Env.Session.userId) + '</span></div>' +
            '           </div>' +
            '       </div>' +
            '   </div>' +
            '   <div class="preview selectdata alluxio">' +
            '       <div class="header">' +
            '           <span>Data preview</span>' +
            '       </div>' +
            '       <div class="contents">' +
            '           <span class="nodata">no data</span>' +
            '       </div>' +
            '   </div>'));

        var $btnRemote = $parent.find('#fileselect-remote');

        $parent.find('#upload-to-shared-alluxio').jqxRadioButton({
            theme: Brightics.VA.Env.Theme,
            height: 25,
            width: 100,
            boxSize: '18px',
            groupName: 'alluxio'
        });
        $parent.find('#upload-to-userid-alluxio').jqxRadioButton({
            theme: Brightics.VA.Env.Theme,
            height: 25,
            width: 100,
            boxSize: '18px',
            groupName: 'alluxio'
        });

        $parent.find('.brtc-va-radio-button').on('checked', function (event) {
            _this.options.wizard.result.uploadTo = this.getAttribute('value');
        });

        $parent.find('#upload-to-userid-alluxio').jqxRadioButton('check');

        $btnRemote.jqxButton({
            theme: Brightics.VA.Env.Theme
        });
        $btnRemote.on('click', function (event) {
            _this.handleRemoteFileSelected(event);
        });
    };

    SelectAlluxioDataPage.prototype.handleRemoteFileSelected = function (event) {
        var _this = this;
        new Brightics.VA.Core.Dialogs.FilePathDialog($(event.target), {
            close: function (dialogResult) {
                if (dialogResult.OK) {
                    var name = dialogResult.name,
                        $fileName = _this.$contentsControl.find('.filename');

                    $fileName.empty();
                    $fileName.append($('' +
                        '<span class="brtc-va-icon brtc-va-dialogs-dataupload file"></span>' +
                        '<span>' + Brightics.VA.Core.Utils.WidgetUtils.convertHTMLSpecialChar(name) + '</span>'));
                    _this.reset();

                    $.ajax({
                        method: "GET",
                        url: 'api/va/v2/data/head?length=20&path=' + name,
                        blocking: true
                    }).done(function (res) {
                        _this.options.wizard.triggerEvent('changeData', true);
                        _this.updateFileSelectPreview(res);
                        _this.refreshButton(true);
                        _this.options.wizard.result.fileName = name.split('/').pop();
                        _this.options.wizard.result.remotePath = name;
                        _this.options.wizard.$btnNext.jqxButton({disabled: false});
                    }).fail(function (err) {
                        // alert(JSON.stringify(err));
                        Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('File does not exist.', function () {
                            _this.refreshButton();
                        });

                        _this.refreshButton();
                    });
                }
            }
        });
    };

    SelectAlluxioDataPage.prototype.updateFileSelectPreview = function (textContent) {
        var contentList = textContent.split('\n'),
            $contentArea = this.$contentsControl.find('.preview.selectdata.alluxio').find('.contents'),
            index = 0;

        this.options.wizard.result.data = [];
        for (var i = 0; i < Math.min(contentList.length, 20); i++) {
            if (!contentList[i].trim()) continue;

            $contentArea.find('.number-column').append($('<li>' + index + '</li>'));
            $contentArea.find('.data-column').append($('<li>' + Brightics.VA.Core.Utils.WidgetUtils.convertHTMLSpecialChar(contentList[i]) + '</li>'));

            this.options.wizard.result.data.push(contentList[i]);
            index++;
        }
        $contentArea.perfectScrollbar();
    };

    SelectAlluxioDataPage.prototype.reset = function () {
        var $preview = this.$parent.find('.preview').find('.contents');

        this.options.wizard.result.fileName = '';
        this.options.wizard.result.data = [];
        $('input[type=file]').val('');

        $preview.empty();
        $preview.append($('<ul class="number-column"></ul>'));
        $preview.append($('<ul class="data-column"></ul>'));
    };

    SelectAlluxioDataPage.prototype.refreshButton = function (status) {
        // this.options.wizard.$btnNext.jqxButton({disabled: !status});
        // this.options.wizard.$btnFinish.jqxButton({disabled: true});
    };

    Brightics.VA.Core.Wizards.Pages.SelectAlluxioDataPage = SelectAlluxioDataPage;

}).call(this);