/**
 * Created by SDS on 2016-06-02.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function DataDownloadWizard(parentId, options) {
        this.parentId = parentId;
        this.options = options;
        this.options.title = 'Data Download';
        this.options.class = 'datadownloadwizard';
        this.dialogResult = {
            OK: false,
            Cancel: true
        };

        Brightics.VA.Core.Wizards.Wizard.call(this, parentId, this.options);
    }

    DataDownloadWizard.prototype = Object.create(Brightics.VA.Core.Wizards.Wizard.prototype);
    DataDownloadWizard.prototype.constructor = DataDownloadWizard;

    DataDownloadWizard.prototype.createContentsArea = function ($parent) {
        $parent.css({'padding-left': '19px', 'padding-right': '19px'});
        this.setDownloadDelimiterPage = new Brightics.VA.Core.Wizards.Pages.SetDownloadDelimiterPage($parent, {
            wizard: this,
            showPreviousButton: false,
            showNextButton: false,
            showFinishButton: true
        });
        this.addPage(this.setDownloadDelimiterPage);
        this.downloadLoadingPage = new Brightics.VA.Core.Wizards.Pages.DownloadLoadingPage($parent, {
            wizard: this,
            showPreviousButton: false,
            showNextButton: false,
            showFinishButton: false,
            loadingText: 'Preparing...'
        });
        this.addPage(this.downloadLoadingPage);
    };

    DataDownloadWizard.prototype.getNextPage = function (currentPage) {
        if (currentPage === this.setDownloadDelimiterPage) {
            return this.downloadLoadingPage;
        }
        if (currentPage === this.downloadLoadingPage) return null;
    };

    DataDownloadWizard.prototype.getPreviousPage = function (currentPage) {
        if (currentPage === this.setDownloadDelimiterPage) return null;
        if (currentPage === this.downloadLoadingPage) return this.setDownloadDelimiterPage;
    };

    DataDownloadWizard.prototype.handleFinish = function () {
        var selectedDelimiters = this.setDownloadDelimiterPage.options.wizard.result.delimiters;
        var delimiter = selectedDelimiters.delimiter;
        var defaultFilename = this.setDownloadDelimiterPage.options.wizard.options.downloaderOptions.fileName;
        var inputFilename = this.setDownloadDelimiterPage.options.wizard.result.fileName;
        var fileName = inputFilename || defaultFilename;
        // var rgExp = /[~!@\#$%^&*\()\[\]\{\}\-=+'";:?`|\\/]/gi;
        var rgExp = /[~!@\#$%^&*\()\[\]\{\}=+'";:?`|\\/]/gi;  
        /*var arrayDelimiter = selectedDelimiters['array-delimiter'];
        var keyValueDelimiter = selectedDelimiters['key-value-delimiter'];
        var quoteDelimiter = selectedDelimiters['quote-delimiter'];*/

        if (!delimiter) {
            Brightics.VA.Core.Utils.WidgetUtils.openInformationDialog('Delimiter should not be empty.');
        }
        /*else if ((delimiter == arrayDelimiter) || (delimiter == keyValueDelimiter) || (delimiter == quoteDelimiter) || (arrayDelimiter == keyValueDelimiter) || (arrayDelimiter == quoteDelimiter) || (keyValueDelimiter == quoteDelimiter)) {
            Brightics.VA.Core.Utils.WidgetUtils.openInformationDialog('Each delimiter must be different.');
        }*/
        else if (rgExp.test(fileName)) {
            Brightics.VA.Core.Utils.WidgetUtils.openInformationDialog('File names can not contain special characters.');          
        } 
        else {
            this.handleNext();
        }
    };

    DataDownloadWizard.prototype.close = function () {
        this.setDownloadDelimiterPage.destroy();
        Brightics.VA.Core.Wizards.Wizard.prototype.close.call(this);
    };

    Brightics.VA.Core.Wizards.DataDownloadWizard = DataDownloadWizard;

}).call(this);