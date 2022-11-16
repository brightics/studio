(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function TabNavigator(parentId, options) {
        this.options = options;
        this.parentId = parentId;

        _retrieveParent.bind(this)();

        this.createControls();
    }

    var _retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    TabNavigator.prototype.init = function () {
        this.selectedIndex = 0;
    };

    TabNavigator.prototype.createControls = function () {
        this.$mainControl = $('<div class="brtc-va-tools-tab-navigator-wrapper"></div>');

        this.$parent.append(this.$mainControl);

        this.createNavigator();
    };

    TabNavigator.prototype.createNavigator = function () {
        var _this = this;

        for (var i in this.options.elements) {
            var $navigator = $('<div class="brtc-va-tools-tab-navigator-element"></div>');
            $navigator.text(this.options.elements[i]);
            $navigator.attr('tabIndex', i);
            $navigator.click(function () {
                var tabIndex = $(this).attr('tabIndex');
                _this.select(tabIndex);
            });

            this.$mainControl.append($navigator);
        }
    };

    TabNavigator.prototype.select = function (index) {
        if (this.getSelectedIndex() != index) {
            this.active(index);
            this.options.onClick(index);
        }
    };

    TabNavigator.prototype.active = function (index) {
        this.setSelectedIndex(index);
        
        this.$mainControl.find('.brtc-va-tools-tab-navigator-element').removeClass('selected');
        this.$mainControl.find('.brtc-va-tools-tab-navigator-element[tabIndex=' + index + ']').addClass('selected');
    };

    TabNavigator.prototype.getSelectedIndex = function () {
        return this.selectedIndex;
    };

    TabNavigator.prototype.setSelectedIndex = function (index) {
        this.selectedIndex = index;
    };

    Brightics.VA.Core.Tools.TabNavigator = TabNavigator;

}).call(this);