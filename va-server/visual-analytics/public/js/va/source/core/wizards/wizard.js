/**
 * Created by SDS on 2016-09-01.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function Wizard(parentId, options) {
        this.parentId = parentId;
        this.options = options;
        this.pages = [];
        this.result = {};

        this.retrieveParent();
        this.createControls();
    }

    Wizard.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    Wizard.prototype.createControls = function () {
        var _this = this;
        this.$mainControl = $('' +
            '<div class="brtc-va-wizard-main">' +
            // '   <div class="brtc-va-wizard-header">' + this.options.title + '</div>' +
            '   <div class="brtc-va-wizard-body">' +
            '</div>');
        this.$mainControl.css({
            width: this.options.width,
            height: this.options.height
        });

        this.$mainControl.dialog({
            theme: Brightics.VA.Env.Theme,
            title: this.options.title,
            width: 675,
            height: this.options.height || 620,
            maxHeight: this.options.maxHeight,
            modal: true,
            resizable: false,
            closeOnEscape: false,
            close: function () {
                if (typeof _this.options.close == 'function') {
                    _this.options.close(_this.dialogResult);
                }
                _this.close();
            },
            keyboardCloseKey: ''
        });

        this.$mainControl.addClass(this.options.class);
        this.$mainControl.attr('name', this.$mainControl.parent().find('span.ui-dialog-title').text());

        this.initContents();
        this.initPage();
        this.setFocus();
    };

    Wizard.prototype.close = function () {
        this.$mainControl.dialog('destroy');
        this.$mainControl.remove();
    };

    Wizard.prototype.initContents = function () {
        this.createContentsArea(this.$mainControl.find('.brtc-va-wizard-body'));
        this.createButtonArea(this.$mainControl.find('.brtc-va-wizard-body'));
    };

    Wizard.prototype.initPage = function () {
        if (this.pages.length > 0) {
            this.pages[0].show();
            this.currentPage = this.pages[0];
            this.currentPage.init();
            for (var i = 1; i < this.pages.length; i++) {
                this.pages[i].hide();
            }
        }
        this.initButton(this.currentPage);
    };

    Wizard.prototype.addPage = function (wizardPage) {
        this.pages.push(wizardPage);
    };

    Wizard.prototype.setFocus = function () {
        // Do Nothing
    };

    Wizard.prototype.createButtonArea = function ($parent) {
        var _this = this;
        this.$buttonArea = $('' +
            '<div class="brtc-va-wizard-buttonarea">' +
            '   <input type="button" class="finish" value="'+Brightics.locale.common.finish+'"/>' +
            '   <input type="button" class="next" value="'+Brightics.locale.common.next+'"/>' +
            '   <input type="button" class="previous" value="'+Brightics.locale.common.previous+'"/>' +
            '</div>');
        $parent.append(this.$buttonArea);

        this.$buttonArea.find(':button').jqxButton({
            theme: Brightics.VA.Env.Theme
        });

        this.$btnPrevious = this.$buttonArea.find('.previous');
        this.$btnPrevious.on('click', function () {
            _this.handlePrevious();
        });
        this.$btnPrevious.hide();

        this.$btnNext = this.$buttonArea.find('.next');
        this.$btnNext.on('click', function () {
            _this.handleNext();
        });
        this.$btnNext.hide();

        this.$btnFinish = this.$buttonArea.find('.finish');
        this.$btnFinish.on('click', function () {
            _this.handleFinish();
        });
        this.$btnFinish.hide();
    };

    Wizard.prototype.handlePrevious = function () {
        if (this.currentPage) {
            this.currentPage.hide();
            this.currentPage = this.getPreviousPage(this.currentPage);
            this.currentPage.show();
            this.currentPage.init();
            this.initButton(this.currentPage);
        }
    };

    Wizard.prototype.handleNext = function () {
        var _this = this;
        this.currentPage.doFinish(function () {
            if (_this.currentPage) {
                _this.currentPage.hide();
                _this.currentPage = _this.getNextPage(_this.currentPage);
                _this.currentPage.show();
                _this.currentPage.init();
                _this.initButton(_this.currentPage);
            }
        });
    };

    Wizard.prototype.handleFinish = function () {
    };

    Wizard.prototype.initButton = function (page) {
        var pageOptions = page ? page.options : {
            showPreviousButton: false,
            showNextButton: false,
            showFinishButton: false
        };
        pageOptions.showPreviousButton ? this.$btnPrevious.show() : this.$btnPrevious.hide();
        pageOptions.showNextButton ? this.$btnNext.show() : this.$btnNext.hide();
        pageOptions.showFinishButton ? this.$btnFinish.show() : this.$btnFinish.hide();
    };

    Wizard.prototype.getNextPage = function (currentPage) {
        var index = this.pages.indexOf(currentPage);
        if (index < this.pages.length - 1) {
            return this.pages[index + 1];
        } else {
            return null;
        }
    };

    Wizard.prototype.getPreviousPage = function (currentPage) {
        var index = this.pages.indexOf(currentPage);
        if (index > 0) {
            return this.pages[index - 1];
        } else {
            return null;
        }
    };

    Brightics.VA.Core.Wizards.Wizard = Wizard;

}).call(this);