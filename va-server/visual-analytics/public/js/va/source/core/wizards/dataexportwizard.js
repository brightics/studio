/**
 * Created by SDS on 2016-06-02.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    const useSpark = root.useSpark === 'false' ? false : true;

    function DataExportWizard(parentId, options) {
        this.parentId = parentId;
        this.options = options;
        this.options.title = Brightics.locale.common.dataExport;
        this.options.class = 'dataexportwizard';
        this.options.height = 640;
        this.options.maxHeight = 640;
        this.dialogResult = {
            OK: false,
            Cancel: true
        };

        Brightics.VA.Core.Wizards.Wizard.call(this, parentId, this.options);
        if (!useSpark) this.handleNext();
    }

    DataExportWizard.prototype = Object.create(Brightics.VA.Core.Wizards.Wizard.prototype);
    DataExportWizard.prototype.constructor = DataExportWizard;

    DataExportWizard.prototype.createContentsArea = function ($parent) {
        $parent.css({'padding-left': '19px', 'padding-right': '19px'});
        this.selectExportTypePage = new Brightics.VA.Core.Wizards.Pages.SelectExportTypePage($parent, {
            wizard: this,
            showPreviousButton: true,
            showNextButton: true,
            showFinishButton: true
        });
        this.addPage(this.selectExportTypePage);
        //this.selectExportDataPage = new Brightics.VA.Core.Wizards.Pages.SelectExportDataPage($parent, {
        //    wizard: this,
        //    showPreviousButton: true,
        //    showNextButton: true,
        //    showFinishButton: true
        //});
        //this.addPage(this.selectExportDataPage);
        this.selectJdbcDataPage = new Brightics.VA.Core.Wizards.Pages.SelectExportJdbcPage($parent, {
            wizard: this,
            showPreviousButton: true,
            showNextButton: false,
            showFinishButton: true
        });
        this.addPage(this.selectJdbcDataPage);
        this.selectExportDelimiterPage = new Brightics.VA.Core.Wizards.Pages.SelectExportDelimiterPage($parent, {
            wizard: this,
            showPreviousButton: useSpark,
            showNextButton: false,
            showFinishButton: true
        });
        this.addPage(this.selectExportDelimiterPage);
    };

    DataExportWizard.prototype.getNextPage = function (currentPage) {
        if (currentPage === this.selectExportTypePage) {
            var copyFrom = this.selectExportTypePage.getParam()['copyFrom'];
            if (copyFrom === 'local') {
                return this.selectExportDelimiterPage;
            }
            if (copyFrom === 'jdbc') {
                return this.selectJdbcDataPage;
            }
        }
    };

    DataExportWizard.prototype.getPreviousPage = function (currentPage) {
        if (currentPage === this.selectExportTypePage) return null;
        if (currentPage === this.selectExportDelimiterPage) return this.selectExportTypePage;
        if (currentPage === this.selectJdbcDataPage) return this.selectExportTypePage;
    };

    DataExportWizard.prototype.handleFinish = function (currentPage) {
        this.handleNext();
    };

    DataExportWizard.prototype.close = function () {
        this.selectExportDelimiterPage.destroy();
        this.selectExportTypePage.destroy();
        this.selectJdbcDataPage.destroy();
        Brightics.VA.Core.Wizards.Wizard.prototype.close.call(this);
    };

    Brightics.VA.Core.Wizards.DataExportWizard = DataExportWizard;

}).call(this);