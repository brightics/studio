/**
 * Created by SDS on 2016-06-02.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function DataAdditionWizard(parentId, options) {
        this.parentId = parentId;
        this.options = options;
        this.options.title = Brightics.locale.common.newData;
        this.options.class = 'dataadditionwizard';
        this.dialogResult = {
            OK: false,
            Cancel: true
        };

        Brightics.VA.Core.Wizards.Wizard.call(this, parentId, this.options);
    }

    DataAdditionWizard.prototype = Object.create(Brightics.VA.Core.Wizards.Wizard.prototype);
    DataAdditionWizard.prototype.constructor = DataAdditionWizard;

    DataAdditionWizard.prototype.createContentsArea = function ($parent) {
        //this.selectDataTypePage = new Brightics.VA.Implementation.Visual.Wizards.Pages.SelectDataTypePage($parent, {
        //    wizard: this,
        //    showPreviousButton: true,
        //    showNextButton: true,
        //    showFinishButton: true
        //});
        //this.addPage(this.selectDataTypePage);
        this.selectExplorerDataPage = new Brightics.VA.Implementation.Visual.Wizards.Pages.SelectExplorerDataPage($parent, {
            wizard: this,
            showPreviousButton: true,
            showNextButton: true,
            showFinishButton: true
        });
        this.addPage(this.selectExplorerDataPage);
        //this.selectLocalDataPage = new Brightics.VA.Core.Wizards.Pages.SelectLocalDataPage($parent, {
        //    wizard: this,
        //    showPreviousButton: true,
        //    showNextButton: true,
        //    showFinishButton: true
        //});
        //this.addPage(this.selectLocalDataPage);
        //this.selectJdbcDataPage = new Brightics.VA.Core.Wizards.Pages.SelectJdbcDataPage($parent, {
        //    wizard: this,
        //    showPreviousButton: true,
        //    showNextButton: true,
        //    showFinishButton: true
        //});
        //this.addPage(this.selectJdbcDataPage);
        //this.selectDelimiterPage = new Brightics.VA.Core.Wizards.Pages.SelectDelimiterPage($parent, {
        //    wizard: this,
        //    showPreviousButton: true,
        //    showNextButton: true,
        //    showFinishButton: true
        //});
        //this.addPage(this.selectDelimiterPage);
        //this.setColumnDataTypePage = new Brightics.VA.Core.Wizards.Pages.SetColumnDataTypePage($parent, {
        //    wizard: this,
        //    showPreviousButton: true,
        //    showNextButton: true,
        //    showFinishButton: true
        //});
        //this.addPage(this.setColumnDataTypePage);
        //this.dataAdditionLoadingPage = new Brightics.VA.Implementation.Visual.Wizards.Pages.DataAdditionLoadingPage($parent, {
        //    wizard: this,
        //    showPreviousButton: false,
        //    showNextButton: false,
        //    showFinishButton: false,
        //    loadingText: 'Preparing...'
        //});
        //this.addPage(this.dataAdditionLoadingPage);
    };

    DataAdditionWizard.prototype.getNextPage = function (currentPage) {
        //if (currentPage === this.selectDataTypePage) {
        //    if (this.result.dataFrom === 'loadFromAlluxio') {
        //        return this.selectExplorerDataPage;
        //    }
        //    if (this.result.dataFrom === 'loadFromLocal') {
        //        //return this.selectLocalDataPage;
        //    }
        //    if (this.result.dataFrom === 'loadFromRbd') {
        //        //return this.selectJdbcDataPage;
        //    }
        //    if (this.result.dataFrom === 'loadFromHdfs') {
        //        //return this.selectHdfsDataPage;
        //    }
        //    if (this.result.dataFrom === 'loadFromStaging') {
        //        //return this.selectDataflowDataPage;
        //    }
        //}
        if (currentPage === this.selectExplorerDataPage) {
            return null;
        }
        //if (currentPage === this.selectLocalDataPage) {
        //    return this.selectDelimiterPage;
        //}
        //if (currentPage === this.selectJdbcDataPage) {
        //    return this.setColumnDataTypePage;
        //}
        //if (currentPage === this.selectDelimiterPage) {
        //    return this.setColumnDataTypePage;
        //}
        //if (currentPage === this.setColumnDataTypePage) return null;
    };
    DataAdditionWizard.prototype.getPreviousPage = function (currentPage) {
        if (currentPage === this.selectExplorerDataPage) return null;
        //if (currentPage === this.selectDataTypePage) return null;
        //if (currentPage === this.selectExplorerDataPage) return this.selectDataTypePage;
        //if (currentPage === this.selectLocalDataPage) return this.selectDataTypePage;
        //if (currentPage === this.selectJdbcDataPage) return this.selectDataTypePage;
        //if (currentPage === this.selectDelimiterPage) {
        //    if (this.result.dataFrom === 'local') {
        //        return this.selectLocalDataPage;
        //    }
        //}
        //if (currentPage === this.setColumnDataTypePage) {
        //    if (this.result.dataFrom === 'local') {
        //        return this.selectDelimiterPage;
        //    }
        //    if (this.result.dataFrom === 'jdbc') {
        //        return this.selectJdbcDataPage;
        //    }
        //}
    };

    DataAdditionWizard.prototype.handleFinish = function () {
        this.selectExplorerDataPage.doFinish();
    };

    DataAdditionWizard.prototype.setFocus = function () {
        this.$mainControl.find('.brtc-va-controls-repository-viewer-search').focus();
    };

    DataAdditionWizard.prototype.close = function () {
        this.selectExplorerDataPage.destroy();
        Brightics.VA.Core.Wizards.Wizard.prototype.close.call(this);
    };

    Brightics.VA.Implementation.Visual.Wizards.DataAdditionWizard = DataAdditionWizard;

}).call(this);