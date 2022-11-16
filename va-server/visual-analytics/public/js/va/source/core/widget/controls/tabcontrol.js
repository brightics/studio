/**
 * Created by ji_sung.park on 2017-07-18.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function TabControl(parentId, options) {
        this.parentId = parentId;
        this.options = options;

        this.retrieveParent();
        this.init();
    }

    TabControl.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    TabControl.prototype.init = function () {
        var _this = this;

        this.$tabHeaderWrapper = this.$parent.children('ul');
        this.$tabHeaders = this.$tabHeaderWrapper.children('li');
        this.$tabContents = this.$parent.children('div');

        this.$tabHeaderWrapper.addClass('brtc-style-tab-header-wrapper');
        this.$tabHeaders.addClass('brtc-va-tab-header').addClass('brtc-style-tab-header');
        this.$tabContents.addClass('brtc-style-tab');

        for(let i = 0; i < this.$tabHeaders.length; i++) {
            var $header = this.$tabHeaders.eq(i);
            var text = $header.text();
            var titleWrapper = '<div class="brtc-va-tab-header-titlewrapper brtc-style-tab-header-titlewrapper"></div>';
            $header.html(titleWrapper);
            $header.find('.brtc-va-tab-header-titlewrapper').text(text);
        }

        this.$tabHeaders.eq(0).addClass('selected');
        this.$tabContents.eq(0).addClass('selected');

        this.$tabHeaders.on('click', function(event){
            var index = _this.$tabHeaders.index(this);

            _this.$tabHeaders.removeClass('selected');
            $(this).addClass('selected');

            _this.$tabContents.removeClass('selected');
            _this.$tabContents.eq(index).addClass('selected');

            _this.$parent.trigger('selected', [index]);

            if( $('body').hasClass('scroll-always') && index == 1){
                _this.$parent.find('.brtc-va-dialogs-selectfnunit-tab-allfunctions').perfectScrollbar('update');
            }
        });
    };

    TabControl.prototype.select = function (index) {
        this.$tabHeaders.removeClass('selected');

        $(this.$tabHeaders[index || 0]).addClass('selected');

        this.$tabContents.removeClass('selected');
        this.$tabContents.eq(index).addClass('selected');

        if( $('body').hasClass('scroll-always') && index == 1){
            this.$parent.find('.brtc-va-dialogs-selectfnunit-tab-allfunctions').perfectScrollbar('update');
        }
    };

    Brightics.VA.Core.Widget.Controls.TabControl = TabControl;

}).call(this);