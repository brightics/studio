/**
 * Created by SDS on 2016-09-01.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function SelectExportTypePage(parentId, options) {
        this.options = options;
        this.options.class = 'selectexporttypepage';

        Brightics.VA.Core.Wizards.Pages.WizardPage.call(this, parentId, this.options);
    }

    SelectExportTypePage.prototype = Object.create(Brightics.VA.Core.Wizards.Pages.WizardPage.prototype);
    SelectExportTypePage.prototype.constructor = SelectExportTypePage;

    SelectExportTypePage.prototype.init = function () {
        Brightics.VA.Core.Wizards.Pages.WizardPage.prototype.init.call(this);

        this.options.wizard.result.copyFrom  = 'local';

        this.options.wizard.$btnFinish.jqxButton({disabled: true});
        this.options.wizard.$btnPrevious.jqxButton({disabled: true});
        this.options.wizard.$btnNext.jqxButton({disabled: false});
    };

    SelectExportTypePage.prototype.createHeaderArea = function ($parent) {
    };

    SelectExportTypePage.prototype.createContentsArea = function ($parent) {
        Brightics.VA.Core.Wizards.Pages.WizardPage.prototype.createContentsArea.call(this, $parent);
        var _this = this;

        this.$local = $('' +
            '<div class="selector" value="local">' +
            '   <span class="brtc-va-icon file"></span>' +
            '   <span class="brtc-va-label">Local</span>' +
            '</div>');

        this.$jdbc = $('' +
            '<div class="selector" value="jdbc">' +
            '   <span class="brtc-va-icon grid"></span>' +
            '   <span class="brtc-va-label">Relational Database</span>' +
            '</div>');

        $parent.append(this.$local);
        $parent.append(this.$jdbc);

        this.$local.jqxRadioButton({
            width: '100%',
            height: 50,
            theme: Brightics.VA.Env.Theme,
            groupName: "Group",
            checked: true
        });
        this.$jdbc.jqxRadioButton({
            width: '100%',
            height: 50,
            theme: Brightics.VA.Env.Theme,
            groupName: "Group"
        });

        $parent.find('.selector').on('checked', function () {
            _this.refreshSelection($(this).attr('value'));
        });

        $parent.perfectScrollbar();
    };

    SelectExportTypePage.prototype.refreshSelection = function (type) {
        this.options.wizard.result.copyFrom = type;
        this.options.wizard.$btnNext.jqxButton({disabled: false});
    };

    SelectExportTypePage.prototype.getParam = function () {
        return {
            copyFrom: _.isEqual(this.$local.val(), true)? 'local' : 'jdbc'
        }
    };

    Brightics.VA.Core.Wizards.Pages.SelectExportTypePage = SelectExportTypePage;

}).call(this);