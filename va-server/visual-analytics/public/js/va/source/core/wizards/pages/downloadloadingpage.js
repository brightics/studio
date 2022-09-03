/**
 * Created by SDS on 2016-09-01.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function DownloadLoadingPage(parentId, options) {
        this.options = options;
        this.options.class = 'downloadloadingpage';

        Brightics.VA.Core.Wizards.Pages.WizardPage.call(this, parentId, this.options);
    }

    DownloadLoadingPage.prototype = Object.create(Brightics.VA.Core.Wizards.Pages.WizardPage.prototype);
    DownloadLoadingPage.prototype.constructor = DownloadLoadingPage;

    DownloadLoadingPage.prototype.init = function () {
        Brightics.VA.Core.Wizards.Pages.WizardPage.prototype.init.call(this);

        //this.options.wizard.$btnPrevious.jqxButton({disabled: false});
        //this.options.wizard.$btnFinish.jqxButton({disabled: true});
        //if (this.options.wizard.result.delimiter) // delimiters 있으면
        //    this.options.wizard.$btnNext.jqxButton({disabled: false});
        //else
        //    this.options.wizard.$btnNext.jqxButton({disabled: true});
        this.doFinish();
    };

    DownloadLoadingPage.prototype.createHeaderArea = function ($parent) {
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

    DownloadLoadingPage.prototype.createContentsArea = function ($parent) {
        var loadingText = this.options.loadingText || 'Preparing...';
        $parent.append($('' +
            '<div class="brtc-va-loading-page-contents-area">' +
            '   <div class="brtc-va-loading-page-text-area">' +
            '       <div class="brtc-va-loading-page-text-wrapper">' +
            '           <span>' + loadingText + '</span>' +
            '       </div>' +
            '    </div>' +
            '    <div class="brtc-va-loading-page-spinner-area">' +
            '        <div class="brtc-va-loading-page-spinner-wrapper">' +
            '            <div class="brtc-va-loading-page-spin-icon">' +
            '               <div class="brtc-va-progress-loading"></div>' +
            '           </div>' +
            '        </div>' +
            '   </div>' +
            '</div>'));
    };

    DownloadLoadingPage.prototype.doFinish = function () {
        var _this = this;
        var downloader = Brightics.VA.Core.Utils.DownLoader;
        var options = this.options.wizard.options.downloaderOptions;

        var userId = options.userId;
        var mid = options.mid;
        var tid = this.options.wizard.result.tid;
        // var fileName = options.fileName;
        // input 파일명이 없으면 default 파일명 setting
        var fileName = this.options.wizard.result.fileName || options.fileName;
        var delimiters = this.options.wizard.result.delimiters;

        downloader.run(userId, mid, tid, fileName, delimiters, function () {
            _this.options.wizard.$mainControl.dialog('destroy');
        }, function (err) {
            Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(err, function () {
                _this.options.wizard.$mainControl.dialog('destroy');
            });
        });
    };

    Brightics.VA.Core.Wizards.Pages.DownloadLoadingPage = DownloadLoadingPage;

}).call(this);