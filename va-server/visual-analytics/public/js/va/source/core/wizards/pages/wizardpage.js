/**
 * Created by SDS on 2016-09-01.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function WizardPage(parentId, options) {
        this.parentId = parentId;
        this.options = $.extend({}, options || {
                showPreviousButton: true,
                showNextButton: true,
                showFinishButton: true
            });
        this.retrieveParent();
        this.createControls();
        this.initPermission();
    }

    WizardPage.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    WizardPage.prototype.initPermission = function () {
        this.permissions = [
            'data_upload_shared'
        ];

        this.checkPermission();
    };

    WizardPage.prototype.checkPermission = function () {
        Brightics.VA.Core.Utils.PermissionUtils.check(this.$mainControl, this.permissions);
    };

    WizardPage.prototype.init = function () {
        $(':focus').blur();
        this.options.wizard.$btnPrevious.removeClass('jqx-fill-state-hover').removeClass('jqx-fill-state-hover-office');
        this.options.wizard.$btnNext.removeClass('jqx-fill-state-hover').removeClass('jqx-fill-state-hover-office');
        this.options.wizard.$btnFinish.removeClass('jqx-fill-state-hover').removeClass('jqx-fill-state-hover-office');

        this.options.wizard.$btnPrevious.jqxButton({disabled: false});
        this.options.wizard.$btnNext.jqxButton({disabled: false});
        this.options.wizard.$btnFinish.jqxButton({disabled: false});

        this.$mainControl.find('.preview').find('.contents').perfectScrollbar('update');
    };

    WizardPage.prototype.createControls = function () {
        this.$mainControl = $('' +
            '<div class="brtc-va-wizardpage">' +
            '   <div class="brtc-va-wizardpage-header"></div>' +
            '   <div class="brtc-va-wizardpage-content"></div>' +
            '</div>');
        this.$mainControl.css({
            width: this.options.width,
            height: this.options.height
        });
        this.$parent.append(this.$mainControl);

        this.$mainControl.addClass(this.options.class);

        this.$headerControl = this.$mainControl.find('.brtc-va-wizardpage-header');
        this.$headerControl.addClass(this.options.class);
        this.createHeaderArea(this.$headerControl);
        this.$contentsControl = this.$mainControl.find('.brtc-va-wizardpage-content');
        this.$contentsControl.addClass(this.options.class);
        this.createContentsArea(this.$contentsControl);
    };

    WizardPage.prototype.createHeaderArea = function ($parent) {
    };

    WizardPage.prototype.createContentsArea = function ($parent) {
    };

    WizardPage.prototype.show = function () {
        this.$mainControl.show();
    };

    WizardPage.prototype.hide = function () {
        this.$mainControl.hide();
    };

    WizardPage.prototype.doFinish = function (callback) {
        callback();

    };

    WizardPage.prototype.findActivatedInput = function (inputs) {
        for (var i in inputs) {
            if ($(inputs[i]).hasClass('jqx-fill-state-focus')) {
                return $(inputs[i]);
            }
        }
        return undefined;
    };

    WizardPage.prototype.destroy = function () {
    };

    Brightics.VA.Core.Wizards.Pages.WizardPage = WizardPage;

}).call(this);