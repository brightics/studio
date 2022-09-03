/* -----------------------------------------------------
 *  condition-header-tab-bar.js
 *  Created by hyunseok.oh@samsung.com on 2018-02-19.
 * ----------------------------------------------------*/

(function () {
    'use strict';
    var Brightics = this.Brightics;
    var ClassUtils = this.__module__.ClassUtils;
    var EventEmitter = this.__module__.EventEmitter;
    var _ = this.__module__._;
    var Header = Brightics.VA.Implementation.DataFlow.Editors.Header;

    function ConditionHeaderTabBar($parent, _options) {
        var options = _options || {};
        this.$template = $([
            '<div class="brtc-condition-header-tab-bar">',
            '  <div class="brtc-condition-header-tab-bar-list">',
            '  </div>',
            '  <div class="brtc-condition-header-tab-bar-add">',
            '+',
            '  </div>',
            '</div>'
        ].join('\n'));

        this.$tabListArea = this.$template.find('.brtc-condition-header-tab-bar-list');
        this.$addBtn = this.$template.find('.brtc-condition-header-tab-bar-add');
        this.$addBtn.click(this._handleAddClick.bind(this));
        this.$parent = $parent;
        this.$parent.append(this.$template);
        this.tabContextList = options.tabContextList || [];
        this.uselectedTabId = 0;
    }

    ClassUtils.inherits(ConditionHeaderTabBar, EventEmitter);

    ConditionHeaderTabBar.prototype.addTabContext = function (tabContext) {
        this.tabContextList.push(tabContext);
    };

    ConditionHeaderTabBar.prototype.removeTabContext = function (index) {
        this.tabContextList.splice(index, 1);
    };

    ConditionHeaderTabBar.prototype.setTabContextList = function (context) {
        this.tabContextList = context;
    };

    ConditionHeaderTabBar.prototype.getTabContextList = function () {
        return this.tabContextList;
    };

    ConditionHeaderTabBar.prototype.render = function () {
        var _this = this;
        this.$tabListArea.empty();
        this.tabRefList = _.map(this.tabContextList, function (tabContext) {
            var tab = _this._newTab(_this.$tabListArea,
                tabContext, _this.selectedTabId == tabContext.getId());
            return tab;
        });
    };

    ConditionHeaderTabBar.prototype._getTabById = function (id) {
        var index = _.findIndex(this.tabContextList, function (context) {
            return context.getId() == id;
        });
        if (index > -1) return this.tabRefList[index];
        return null;
    };

    ConditionHeaderTabBar.prototype.selectTab = function (id) {
        if (id == this.selectedTabId) return;
        _.forEach(this.tabRefList, function (tab) {
            return tab.unselect();
        });
        this.unselectTab();
        var tab = this._getTabById(id);
        if (tab) {
            this.selectedTabId = id;
            tab.select();
        }
        return true;
    };

    ConditionHeaderTabBar.prototype.closeTab = function (index) {
        if (!this._isValidIndex(index)) return false;
        this.removeTabContext(index);
        var target = this.tabContextList.length > index ? index : this.tabContextList.length - 1;
        if (target == -1) {
            this.unselectTab();
        } else {
            this.selectTab(target);
        }
        return true;
    };

    ConditionHeaderTabBar.prototype.unselectTab = function () {
        this.selectedTabId = -1;
        return true;
    };

    ConditionHeaderTabBar.prototype._newTab = function ($parent, tabContext, selected) {
        var _this = this;

        var tab = new Header.ConditionHeaderTab($parent, {
            tabContext: tabContext,
            selected: selected
        });

        tab.on('tab-click', function (evt) {
            _this.selectTab(evt.data.getId());
            _this.emit('tab-click', evt);
        });

        tab.on('tab-close-click', function (data) {
            _this.emit('tab-close-click', data);
        });

        return tab;
    };

    ConditionHeaderTabBar.prototype._handleAddClick = function (data) {
        this.emit('tab-add-click', data);
    };

    Header.ConditionHeaderTabBar = ConditionHeaderTabBar;
/* eslint-disable no-invalid-this */
}.call(this));
/* eslint-disable no-invalid-this */
