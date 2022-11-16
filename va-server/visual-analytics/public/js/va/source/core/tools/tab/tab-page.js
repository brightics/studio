(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function TabPage(parentId, options) {
        this.options = options;
        this.parentId = parentId;

        _retrieveParent.bind(this)();

        this.init();
        this.createControls();
    }

    var _retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    TabPage.prototype.init = function () {
        this.pages = [];
    };

    TabPage.prototype.destroy = function () {
        for(var i = 0; i<this.pages.length; i++){
            this.options.pages[i].destroy(this.pages[i]);
        }
    };

    TabPage.prototype.createControls = function () {
        this.$mainControl = $('<div class="brtc-va-tools-tab-pages-wrapper"></div>');

        this.$parent.append(this.$mainControl);

        this.createPages();
    };

    TabPage.prototype.createPages = function () {
        for (var i in this.options.pages) {
            var $page = $('<div class="brtc-va-tools-tab-page" isRendered="false"></div>');
            $page.attr('tabIndex', i);
            this.pages.push($page);

            this.$mainControl.append($page);
        }
    };

    TabPage.prototype.select = function (index) {
        var renderedIndexes = this.getRenderedIndexes();

        this.active(index);
        if (renderedIndexes.indexOf(index) < 0) {
            this.render(index);
        }
    };

    TabPage.prototype.render = function (index) {
        var renderer = this.options.pages[index].renderer;
        // var type = this.options.pages[index].label;
        // type = (type === 'table')? 'outData' : type;
        var $page = this.pages[index];
        $page.attr('isRendered', 'true');

        renderer(this.pages[index], this.options.pages[index].type);
        // renderer(this.pages[index]);
    };

    TabPage.prototype.active = function (index) {
        this.$mainControl.find('.brtc-va-tools-tab-page').hide();
        
        var $page = this.pages[index];
        $page.show();
    };

    TabPage.prototype.getRenderedIndexes = function () {
        var indexes = [];
        for (var i=0; i<this.pages.length; i++) {
            var $page = this.pages[i];
            if ($page.attr('isRendered') === 'true') indexes.push(i);
        }

        return indexes;
    };

    Brightics.VA.Core.Tools.TabPage = TabPage;

}).call(this);