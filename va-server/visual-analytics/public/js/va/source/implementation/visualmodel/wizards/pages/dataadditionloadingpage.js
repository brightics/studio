/**
 * Created by SDS on 2016-09-01.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function DataAdditionLoadingPage(parentId, options) {
        this.options = options;
        this.options.class = 'dataadditionloadingpage';

        Brightics.VA.Core.Wizards.Pages.WizardPage.call(this, parentId, this.options);
    }

    DataAdditionLoadingPage.prototype = Object.create(Brightics.VA.Core.Wizards.Pages.WizardPage.prototype);
    DataAdditionLoadingPage.prototype.constructor = DataAdditionLoadingPage;

    DataAdditionLoadingPage.prototype.init = function () {
        Brightics.VA.Core.Wizards.Pages.WizardPage.prototype.init.call(this);

        this.doFinish();
    };

    DataAdditionLoadingPage.prototype.createHeaderArea = function ($parent) {

    };

    DataAdditionLoadingPage.prototype.createContentsArea = function ($parent) {
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

    DataAdditionLoadingPage.prototype.doFinish = function () {
        var _this = this;
        //TODO
        //setTimeout(function(){
        //    _this.options.wizard.$mainControl.trigger('close');
        //}, 1000)
    };

    Brightics.VA.Implementation.Visual.Wizards.Pages.DataAdditionLoadingPage = DataAdditionLoadingPage;

}).call(this);