/* -----------------------------------------------------
 *  condition-header-tab.js
 *  Created by hyunseok.oh@samsung.com on 2018-02-19.
 * ----------------------------------------------------*/

(function () {
    'use strict';
    var Brightics = this.Brightics;
    var ClassUtils = this.__module__.ClassUtils;
    var EventEmitter = this.__module__.EventEmitter;

    var className = {
        tab: 'brtc-condition-header-tab',
        title: 'brtc-condition-header-tab-title',
        closeBtn: 'brtc-condition-header-tab-close-btn',
        tabSelected: 'brtc-condition-header-tab-selected'
    };

    function ConditionHeaderTab($parent, _options) {
        var options = _options || {};
        this.$parent = $parent;
        this.tabContext = options.tabContext;
        this.selected = options.selected || false;

        this.$el = $('<div/>', { class: className.tab });
        this.$titleArea = $('<div/>', { class: className.title });
        this.$closeButton = $('<div/>', { class: className.closeBtn});

        this.$el.append(this.$titleArea);

        if (this.selected) {
            this.select();
        }

        this.$titleArea.html(this.tabContext.getTitle());
        this.$titleArea.click(function (evt) {
            this.emit('tab-click', {
                data: this.tabContext
            });
        }.bind(this));

        if (this.tabContext.getType() == 'elseif') {
            this.$el.append(this.$closeButton);
            this.$closeButton.click(function (evt) {
                evt.stopPropagation();
                this.emit('tab-close-click', {
                    data: this.tabContext
                });
            }.bind(this));
        }

        this.$parent.append(this.$el);
    }

    ClassUtils.inherits(ConditionHeaderTab, EventEmitter);

    ConditionHeaderTab.prototype.select = function () {
        this.$el.addClass(className.tabSelected);
    };

    ConditionHeaderTab.prototype.unselect = function (params) {
        this.$el.removeClass(className.tabSelected);
    };


    Brightics.VA.Implementation.DataFlow.Editors.Header.ConditionHeaderTab = ConditionHeaderTab;
/* eslint-disable no-invalid-this */
}.call(this));
/* eslint-disable no-invalid-this */
