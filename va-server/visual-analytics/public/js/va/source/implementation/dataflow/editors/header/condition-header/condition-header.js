/* -----------------------------------------------------
 *  condition-header.js
 *  Created by hyunseok.oh@samsung.com on 2018-02-19.
 * ----------------------------------------------------*/

(function () {
    'use strict';
    var Brightics = this.Brightics;
    var ClassUtils = this.__module__.ClassUtils;
    var Header = Brightics.VA.Implementation.DataFlow.Editors.Header;
    var _ = this.__module__._;

    function ConditionHeader($parent, _options) {
        var options = _options || {};
        Header.Header.call(this, $parent, options);
        this.$parent = $parent;

        this.$el = $('<div/>', { class: 'brtc-condition-header' });
        this.$el.hide();
        this.$tabBarArea = $('<div/>', { class: 'brtc-condition-header-tab-bar-area' });
        // this.$fieldArea = $('<div/>', { class: 'brtc-condition-header-field-area' });
        this.$el.append(this.$tabBarArea);
        // this.$el.append(this.$fieldArea);

        this.conditionTabBar = new Header.ConditionHeaderTabBar(this.$tabBarArea, {
            tabContextList: this.tabContextList
        });
        this.conditionTabBar.on('tab-add-click', this._handleAddTabClick.bind(this));
        this.conditionTabBar.on('tab-close-click', this._handleCloseTabClick.bind(this));
        this.conditionTabBar.on('tab-click', this._handleTabClick.bind(this));

        this.$parent.append(this.$el);

        this.hide();
    }

    ClassUtils.inherits(ConditionHeader, Header.Header);

    ConditionHeader.prototype.render = function () {
        this.conditionTabBar.setTabContextList(this.tabContextList);
        this.conditionTabBar.render();
    };

    ConditionHeader.prototype.selectTab = function (id) {
        this.conditionTabBar.selectTab(id);
        this.selectedTabId = id;
    };

    ConditionHeader.prototype.unselectTab = function () {
        var selectedTab = this.getSelectedTabContext();
        selectedTab.unselect();
    };

    ConditionHeader.prototype._handleTabClick = function (evt) {
        this.selectedTabId = evt.data.getId();
        this.emit('tab-click', evt);
        return true;
    };

    ConditionHeader.prototype._handleAddTabClick = function (data) {
        this.emit('tab-add-click', data);
        return true;
    };

    ConditionHeader.prototype._handleCloseTabClick = function (data) {
        this.emit('tab-close-click', data);
        return true;
    };

    ConditionHeader.prototype._handleFieldChange = function (data) {
        this.emit('field-change', data);
    };

    ConditionHeader.prototype.setData = function (datas) {
        this.data = datas;
        this.tabContextList = this._toTabContext(datas);
    };

    ConditionHeader.prototype._toTabContext = function (datas) {
        var tabs = [];
        tabs.push(new Header.ConditionHeaderTabContext({
            id: datas.if.mid,
            title: 'If',
            type: 'if',
            field: datas.if.expression
        }));

        tabs = tabs.concat(_.map(datas.elseif, function (data, index) {
            return new Header.ConditionHeaderTabContext({
                id: data.mid,
                title: 'Else-If(' + index + ')',
                type: 'elseif',
                field: data.expression
            });
        }));

        if (datas.else) {
            tabs.push(new Header.ConditionHeaderTabContext({
                id: datas.else.mid,
                title: 'Else',
                type: 'else'
            }));
        }
        return tabs;
    };

    ConditionHeader.prototype._getTabContextById = function (id) {
        var index = _.findIndex(this.tabContextList, function (context) {
            return context.getId() === id;
        });

        if (index > -1) return this.tabContextList[index];
        return null;
    };

    ConditionHeader.prototype.getSelectedTabContext = function () {
        return this._getTabContextById(this.selectedTabId);
    };

    ConditionHeader.prototype.getSelectedConditionId = function () {
        return this.selectedTabId;
    };

    Header.ConditionHeader = ConditionHeader;
/* eslint-disable no-invalid-this */
}.call(this));
/* eslint-disable no-invalid-this */
