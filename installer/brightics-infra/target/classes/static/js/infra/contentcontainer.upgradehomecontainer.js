/**
 * Created by ty_tree.kim on 2016-05-17.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function UpgradeHomeContainer($parent) {
        this.$parent = $parent;
        this.studio = Brightics.Installer.Utils.WidgetUtils.getStudioRef($('.brtc-installer-studio'));
    }

    UpgradeHomeContainer.prototype.render = function () {
        this.$parent.empty();
        this.createLayout();
    };

    UpgradeHomeContainer.prototype.createLayout = function () {
        var _this = this;
        this.$mainControl = $('' +
            '<div class="cont_area  clearfix">' +
            '   <div class="row-fluid contents_center">' +
            '       <div class="home"><img src="static/images/ic.png"/>' +
            '           <p class="txt_gray">Upgrade data file is exist.</p>' +
            '           <p>Click the button below to begin upgrade.</p>' +
            '       </div>' +
            '       <div class="btn_wrap">' +
            '           <div class="tac">' +
            '               <button class="btnBigGray p40"><span>Upgrade</span></button>' +
            '           </div>' +
            '       </div>' +
            '   </div>' +
            '</div>' +
            '');
        this.$parent.append(this.$mainControl);

        var $content = $('#content');
        var $installButton = $content.find('button.btnBigGray.p40');

        if(Brightics.Installer.Studio.appData.userId != 'admin'){
        	$installButton.addClass('disabled');
        }

        $installButton.on('click', function (event) {
            _this.studio.renderUpgradeStep();
        });
    };

    root.Brightics.Installer.ContentContainer.UpgradeHomeContainer = UpgradeHomeContainer;

}).call(this);