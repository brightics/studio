/**
 * Created by SDS on 2016-06-02.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    const useSpark = root.useSpark === 'false' ? false : true;

    function DataUploadWizard(parentId, options) {
        this.parentId = parentId;
        this.options = options;
        this.options.title = Brightics.locale.common.addData;
        this.options.class = 'datauploadwizard';
        this.options.height = 600;
        this.dialogResult = {
            OK: false,
            Cancel: true
        };
        this.eventList = {};
        this.eventListener = {};

        Brightics.VA.Core.Wizards.Wizard.call(this, parentId, this.options);
        if (!useSpark) this.handleNext();
    }

    DataUploadWizard.prototype = Object.create(Brightics.VA.Core.Wizards.Wizard.prototype);
    DataUploadWizard.prototype.constructor = DataUploadWizard;

    DataUploadWizard.prototype.createContentsArea = function ($parent) {
        this.selectUploadTypePage = new Brightics.VA.Core.Wizards.Pages.SelectUploadTypePage($parent, {
            wizard: this,
            showPreviousButton: true,
            showNextButton: true,
            showFinishButton: true
        });
        this.addPage(this.selectUploadTypePage);
        this.selectLocalDataPage = new Brightics.VA.Core.Wizards.Pages.SelectLocalDataPage($parent, {
            wizard: this,
            showPreviousButton: useSpark,
            showNextButton: true,
            showFinishButton: true
        });
        this.addPage(this.selectLocalDataPage);
        this.selectAlluxioDataPage = new Brightics.VA.Core.Wizards.Pages.SelectAlluxioDataPage($parent, {
            wizard: this,
            showPreviousButton: true,
            showNextButton: true,
            showFinishButton: true
        });

        this.addPage(this.selectAlluxioDataPage);
        this.selectJdbcDataPage = new Brightics.VA.Core.Wizards.Pages.SelectJdbcDataPage($parent, {
            wizard: this,
            showPreviousButton: true,
            showNextButton: true,
            showFinishButton: true
        });
        this.addPage(this.selectJdbcDataPage);
        this.selectDelimiterPage = new Brightics.VA.Core.Wizards.Pages.SelectDelimiterPage($parent, {
            wizard: this,
            showPreviousButton: true,
            showNextButton: true,
            showFinishButton: true
        });
        this.addPage(this.selectDelimiterPage);
        this.setColumnDataTypePage = new Brightics.VA.Core.Wizards.Pages.SetColumnDataTypePage($parent, {
            wizard: this,
            showPreviousButton: true,
            showNextButton: true,
            showFinishButton: true
        });
        this.addPage(this.setColumnDataTypePage);
    };

    DataUploadWizard.prototype.getNextPage = function (currentPage) {
        if (currentPage === this.selectUploadTypePage) {
            var copyFrom = this.selectUploadTypePage.getParam()['copyFrom'];

            if (copyFrom === 'local') {
                return this.selectLocalDataPage;
            }
            if (copyFrom === 'alluxio') {
                return this.selectAlluxioDataPage;
            }
            if (copyFrom === 'jdbc') {
                return this.selectJdbcDataPage;
            }
        }
        if (currentPage === this.selectLocalDataPage) {
            return this.selectDelimiterPage;
        }
        if (currentPage === this.selectAlluxioDataPage) {
            return this.selectDelimiterPage;
        }
        if (currentPage === this.selectJdbcDataPage) {
            return this.setColumnDataTypePage;
        }
        if (currentPage === this.selectDelimiterPage) {
            return this.setColumnDataTypePage;
        }
        if (currentPage === this.setColumnDataTypePage) return null;
    };

    DataUploadWizard.prototype.getPreviousPage = function (currentPage) {
        if (currentPage === this.selectUploadTypePage) return null;
        if (currentPage === this.selectLocalDataPage) return this.selectUploadTypePage;
        if (currentPage === this.selectAlluxioDataPage) return this.selectUploadTypePage;
        if (currentPage === this.selectJdbcDataPage) return this.selectUploadTypePage;
        if (currentPage === this.selectDelimiterPage) {
            if (this.result.copyFrom === 'local') {
                return this.selectLocalDataPage;
            }
            if (this.result.copyFrom === 'alluxio') {
                return this.selectAlluxioDataPage;
            }
        }
        if (currentPage === this.setColumnDataTypePage) {
            if (this.result.copyFrom === 'local') {
                return this.selectDelimiterPage;
            }
            if (this.result.copyFrom === 'alluxio') {
                return this.selectDelimiterPage;
            }
            if (this.result.copyFrom === 'jdbc') {
                return this.selectJdbcDataPage;
            }
        }
    };

    DataUploadWizard.prototype.handleFinish = function () {
        this.setColumnDataTypePage.doFinish();
    };

    DataUploadWizard.prototype.registerEvent = function (eventId) {
        var _this = this;

        if (!this.eventList[eventId]) {
            this.$mainControl.on(eventId, function (event, eventData) {
                if (_this.eventListener[eventId]) {
                    for (var i in _this.eventListener[eventId]) {
                        if (_this.eventListener[eventId][i] && typeof _this.eventListener[eventId][i] === 'function') {
                            _this.eventListener[eventId][i](event, eventData);
                        }
                    }
                }
            });
            this.eventList[eventId] = true;
        }
    };

    DataUploadWizard.prototype.addEventListener = function (eventId, listenCallback) {
        if (!this.eventListener[eventId]) {
            this.eventListener[eventId] = [];
        }
        this.eventListener[eventId].push(listenCallback);
    };

    DataUploadWizard.prototype.triggerEvent = function (eventId, eventData) {
        this.$mainControl.trigger(eventId, [eventData]);
    };

    DataUploadWizard.prototype.close = function () {
        this.selectJdbcDataPage.destroy();
        this.selectAlluxioDataPage.destroy();
        this.selectDelimiterPage.destroy();
        this.selectLocalDataPage.destroy();
        this.selectUploadTypePage.destroy();
        this.setColumnDataTypePage.destroy();
        Brightics.VA.Core.Wizards.Wizard.prototype.close.call(this);
    };

    Brightics.VA.Core.Wizards.DataUploadWizard = DataUploadWizard;

}).call(this);