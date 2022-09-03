/**
 * Created by SDS on 2016-09-01.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function SelectUploadTypePage(parentId, options) {
        this.options = options;
        this.options.class = 'selectuploadtypepage';
        this.options.showNextButton = true;

        Brightics.VA.Core.Wizards.Pages.WizardPage.call(this, parentId, this.options);
    }

    SelectUploadTypePage.prototype = Object.create(Brightics.VA.Core.Wizards.Pages.WizardPage.prototype);
    SelectUploadTypePage.prototype.constructor = SelectUploadTypePage;

    SelectUploadTypePage.prototype.init = function () {
        Brightics.VA.Core.Wizards.Pages.WizardPage.prototype.init.call(this);

        this.options.wizard.result.copyFrom  = 'local';

        this.options.wizard.$btnFinish.jqxButton({disabled: true});
        this.options.wizard.$btnPrevious.jqxButton({disabled: true});
        this.options.wizard.$btnNext.jqxButton({disabled: false});
    };

    SelectUploadTypePage.prototype.createHeaderArea = function ($parent) {
    };

    SelectUploadTypePage.prototype.createContentsArea = function ($parent) {
        Brightics.VA.Core.Wizards.Pages.WizardPage.prototype.createContentsArea.call(this, $parent);
        var _this = this;

        this.$local = $('' +
            '<div class="selector" value="local">' +
            '   <span class="brtc-va-icon file"></span>' +
            '   <span class="brtc-va-label">Local</span>' +
            '</div>');

        this.$alluxio = $('' +
            '<div class="selector" value="alluxio">' +
            '   <span class="brtc-va-icon file"></span>' +
            '   <span class="brtc-va-label">Remote</span>' +
            '</div>');

        this.$jdbc = $('' +
            '<div class="selector" value="jdbc">' +
            '   <span class="brtc-va-icon grid"></span>' +
            '   <span class="brtc-va-label">Relational Database</span>' +
            '</div>');
        
        $parent.append(this.$local);
        $parent.append(this.$alluxio);
        $parent.append(this.$jdbc);

        this.$local.jqxRadioButton({
            width: '100%',
            height: 50,
            theme: Brightics.VA.Env.Theme,
            groupName: "Group",
            checked: true
        });
        this.$alluxio.jqxRadioButton({
            width: '100%',
            height: 50,
            theme: Brightics.VA.Env.Theme,
            groupName: "Group"
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

    SelectUploadTypePage.prototype.refreshSelection = function (type) {
        this.options.wizard.result.copyFrom = type;
        this.options.wizard.$btnNext.jqxButton({disabled: false});
    };

    SelectUploadTypePage.prototype.getParam = function () {
        return {
            copyFrom: 
                _.isEqual(this.$local.val(), true)? 'local' : 
                _.isEqual(this.$alluxio.val(), true)? 'alluxio' : 'jdbc'
        }
    };

    Brightics.VA.Core.Wizards.Pages.SelectUploadTypePage = SelectUploadTypePage;

}).call(this);