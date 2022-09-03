/* -----------------------------------------------------
 *  outline.js
 *  Created by hyunseok.oh@samsung.com on 2018-07-11.
 * ---------------------------------------------------- */


/* global crel */
(function (root) {
    'use strict';

    var Brightics = root.Brightics;

    var DOUBLE_CLICK_TIME = 500;
    
    var assert = function (x) {
        if (_.isUndefined(x)) throw new Error('ASSERT');
    };

    function Outline(options) {
        assert(options.$parent);
        assert(options.projectId);
        assert(options.model);

        var self = this;

        self.$parent = options.$parent;
        self.projectId = options.projectId;
        self.model = options.model;
        self.editor = options.editor;

        self.view = (function ($parent) {
            var $el = $(
                crel('div', {class: 'flow-outline-wrapper', style: 'height: 100%;'},
                    crel('div', {class: 'flow-outline-button-wrapper'}),
                    crel('div', {class: 'flow-outline', style: 'box-sizing: border-box;'}),
                    crel('div', {class: 'flow-outline-error'})
                )
            );

            var $tree = $el.find('.flow-outline').jqxTree({
                width: '100%',
                height: '100%',
                source: [],
                theme: Brightics.VA.Env.Theme,
                allowDrag: false,
                allowDrop: false,
                toggleMode: 'x'
            });

            var $errorBox = $el.find('.flow-outline-error');

            $parent.append($el);

            var $expandAllBtn = $(crel('button', {class: 'flow-outline-expand-all-btn'},
            Brightics.locale.common.expandAll)).jqxButton({theme: Brightics.VA.Env.Theme});
            var $collapseAllBtn = $(crel('button', {class: 'flow-outline-collapse-all-btn'},
            Brightics.locale.common.collapseAll)).jqxButton({theme: Brightics.VA.Env.Theme});

            $el.find('.flow-outline-button-wrapper').append($collapseAllBtn, $expandAllBtn);

            var last = 0;
            var lastId = -1;
            var disabled = false;

            var bind = {
                doubleClickItem: function (handler) {
                    $tree.on('itemClick', function (evt) {
                        if (disabled) return;
                        var cur = Date.now();
                        var curId = evt.args.element.id;

                        if (lastId === curId && cur - last <= DOUBLE_CLICK_TIME) {
                            evt.stopPropagation();
                            last = 0;
                            lastId = -1;
                            handler(evt.args.element.id);
                        } else {
                            lastId = curId;
                            last = cur;
                        }
                    });
                },
                clickExpandAll: function (handler) {
                    $expandAllBtn.on('click', function (evt) {
                        handler();
                    });
                },
                clickCollapseAll: function (handler) {
                    $collapseAllBtn.on('click', function (evt) {
                        handler();
                    });
                }
            };

            var render = {
                error: function (err) {
                    $tree.jqxTree({disabled: true});
                    disabled = true;
                    $errorBox.html(err.message);
                    $el.addClass('error');
                },
                all: function () {
                    var data = self.getData();
                    self.source = data;
                    $tree.jqxTree({source: data, disabled: false});
                    disabled = false;
                    $el.removeClass('error');
                },
                underline: function (id) {
                    var prevElement = $tree.find('.underline');
                    if (prevElement) {
                        prevElement.removeClass('underline');
                    }
                    if (!id) return;
                    var li = $tree.find('#' + id);
                    if (li) {
                        li.children(0).children(0).addClass('underline');
                    }
                },
                navigate: function () {

                },
                expandAll: function () {
                    $tree.jqxTree('expandAll');
                },
                collapseAll: function () {
                    $tree.jqxTree('collapseAll');
                },
                status: function (args) {
                    var editor = Studio.getEditorContainer().getActiveModelEditor();
                    var id = args.fid;
                    var status = args.status;

                    if (!id) return;
                    var li = $tree.find('#' + id);
                    if (li) {
                        $(li).find('.item-status').attr('status', status);
                        editor.showStatus(id, $(li).find('.item-status'));
                    }
                },
            };

            return {
                bind: bind,
                render: render
            };
        }(self.$parent));

        self.view.bind.doubleClickItem(function (id) {
            self.onDoubleClickItem(id);
        });
        self.view.bind.clickExpandAll(function () {
            self.view.render.expandAll();
        });
        self.view.bind.clickCollapseAll(function () {
            self.view.render.collapseAll();
        });

        self.refresh();
    }

    Outline.prototype.onDoubleClickItem = function () {
        throw new Error('not implemented');
    };

    Outline.prototype.getData = function () {
        throw new Error('not implemented');
    };

    Outline.prototype.getProjectId = function () {
        return this.getEditor().getEditorInput().getProjectId();
    };

    Outline.prototype.refresh = function (target, args) {
        try {
            if (target) {
                this.view.render[target](args);
            } else {
                this.view.render.all();
            }
        } catch (e) {
            this.view.render.error(e);
        }
    };

    Brightics.VA.Core.Views.Outline = Outline;
/* eslint-disable no-invalid-this */
}(this));
