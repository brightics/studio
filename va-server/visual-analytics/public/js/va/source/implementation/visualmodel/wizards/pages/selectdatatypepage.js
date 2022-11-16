/**
 * Created by SDS on 2016-09-01.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function SelectDataTypePage(parentId, options) {
        this.options = options;
        this.options.class = 'selectdatatypepage';

        Brightics.VA.Core.Wizards.Pages.WizardPage.call(this, parentId, this.options);
    }

    SelectDataTypePage.prototype = Object.create(Brightics.VA.Core.Wizards.Pages.WizardPage.prototype);
    SelectDataTypePage.prototype.constructor = SelectDataTypePage;

    SelectDataTypePage.prototype.init = function () {
        Brightics.VA.Core.Wizards.Pages.WizardPage.prototype.init.call(this);

        this.options.wizard.$btnFinish.jqxButton({disabled: true});
        this.options.wizard.$btnPrevious.jqxButton({disabled: true});
        if (this.$contentsControl.find('.selected').length < 1) {
            this.options.wizard.$btnNext.jqxButton({disabled: true});
        }
        else {
            this.options.wizard.$btnNext.jqxButton({disabled: false});
        }
    };

    SelectDataTypePage.prototype.createHeaderArea = function ($parent) {
    };

    SelectDataTypePage.prototype.createContentsArea = function ($parent) {
        Brightics.VA.Core.Wizards.Pages.WizardPage.prototype.createContentsArea.call(this, $parent);
        var _this = this;

        $parent.append($('' +
            '<div class="brtc-va-label">Select data position:</div>' +
            '<div class="selector" value="loadFromAlluxio">' +
            '   <span class="brtc-va-icon file"></span>' +
            '   <span class="brtc-va-label">Data Explorer</span>' +
            '</div>' +
            '<div class="selector disabled" value="loadFromLocal">' +
            '   <span class="brtc-va-icon file"></span>' +
            '   <span class="brtc-va-label">Local</span>' +
            '</div>' +
            '<div class="selector disabled" value="loadFromRdb">' +
            '   <span class="brtc-va-icon grid"></span>' +
            '   <span class="brtc-va-label">Relational Database</span>' +
            '</div>' +
            '<div class="selector disabled" value="loadFromHdfs">' +
            '   <span class="brtc-va-icon file"></span>' +
            '   <span class="brtc-va-label">Hadoop File System</span>' +
            '</div>' +
            '<div class="selector disabled" value="loadFromStaging">' +
            '   <span class="brtc-va-icon file"></span>' +
            '   <span class="brtc-va-label">Data Flow</span>' +
            '</div>'));

        $parent.find('.selector').on('click', function () {
            if($(this).hasClass('disabled')) {
                Brightics.VA.Core.Utils.WidgetUtils.openInformationDialog('We are preparing this service for you.');
            }
            else {
                _this.refreshSelection(this);
            }
        });

        $parent.perfectScrollbar();
    };

    SelectDataTypePage.prototype.refreshSelection = function (selector) {
        this.options.wizard.result.dataFrom = $(selector).attr('value');

        if (this.options.wizard.result.dataFrom == 'loadFromAlluxio') {
            this.options.wizard.$btnNext.jqxButton({disabled: false});
        }
        else {
            this.options.wizard.$btnNext.jqxButton({disabled: true});
        }

        this.$contentsControl.find('.selector').removeClass('selected');
        if(!$(selector).hasClass('disabled')) $(selector).addClass('selected');
    };

    Brightics.VA.Implementation.Visual.Wizards.Pages.SelectDataTypePage = SelectDataTypePage;

}).call(this);