/**
 * Created by SDS on 2016-09-05.
 */

/* global crel */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function Tab(parentId, options) {
        this.options = options;
        this.parentId = parentId;

        _retrieveParent.bind(this)();

        this.createControls();
    }

    var _retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    Tab.prototype.init = function () {
        this.renderedIndexes = [];
    };

    Tab.prototype.destroy = function () {
        if(this.pages){
            this.pages.destroy();
        }
    };

    Tab.prototype.createControls = function () {
        this.$mainControl = $('<div class="brtc-va-tools-tab"></div>');

        this.$pageArea = $('<div class="brtc-va-tools-tab-pages"></div>');
        this.$navigatorArea = $('<div class="brtc-va-tools-tab-navigator"></div>');

        this.$parent.append(this.$mainControl);
        this.$mainControl.append(this.$pageArea).append(this.$navigatorArea);

        this.createPages(this.$pageArea);
        this.createNavigator(this.$navigatorArea);

        this.select(0); 
    };

    Tab.prototype.createPages = function ($parent) {
        this.pages = new Brightics.VA.Core.Tools.TabPage($parent, {
            pages: this.options.pages
        });
    };

    Tab.prototype.createNavigator = function ($parent) {
        var _this = this;

        var labels = _.map(this.options.pages, function (page) {
            return page.label;
        })
        this.navigator = new Brightics.VA.Core.Tools.TabNavigator($parent, {
            elements: labels,
            onClick: function (index) {
                _this.select(index);
            }
        });
    };

    Tab.prototype.select = function (index) {
        this.navigator.select(index);
        this.pages.select(index);
    };

    Brightics.VA.Core.Tools.Tab = Tab;

}).call(this);