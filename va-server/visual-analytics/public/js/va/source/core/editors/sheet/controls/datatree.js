
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function DataTree(parentId, options) {
        this.parentId = parentId;
        this.options = options;

        this.retrieveParent();
        this.createControls();
    }

    DataTree.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    DataTree.prototype.createControls = function () {
        this.$mainControl = $('<div class="brtc-va-controls-datatree"></div>');
        this.$treeWrapper = $('<div class="brtc-va-controls-datatree-wrapper"></div>');

        this.$parent.append(this.$mainControl);
        this.$mainControl.append(this.$treeWrapper);

        this.$mainControl.css({
            'width': '100%',
            'height': '100%',
            'float': 'left',
            'background-color': 'white'
        });

        (this.isEmpty())? this.createEmpty() : this.createTree();
    };

    DataTree.prototype.isEmpty = function () {
        var source = this.options.source;

        if (!source || Object.keys(source).length === 0) return true;
        return false; 
    };

    DataTree.prototype.createEmpty = function () {
        var $empty = $('' +
            '<div class="brtc-va-controls-datatree-empty">' +
                '<div class="brtc-va-controls-datatree-empty-contents">No Inputs</div>' +
            '</div>'
            );
        this.$treeWrapper.append($empty);
    };

    DataTree.prototype.createTree = function () {
        var _this = this;

        var $container = $('<ul></ul>');
        this.$treeWrapper.append($container);

        _.forEach(this.options.source, function (map, fid) {
            _this.createTreeElement($container, fid, map);
        });

        this.$treeWrapper.jqxTree({
            height: '100%',
            width: '100%',
            theme: Brightics.VA.Env.Theme,
            allowDrag: false
        });

        this.makeFunctionItem();
        this.addEllipsisClass();
        this.addTypeIcon();

        if (_this.options.draggable) _this.createDragEvent();
    };

    DataTree.prototype.makeFunctionItem = function () {
        var functions = this.$treeWrapper.find('.brtc-va-controls-datatree-li-function');
        
        for (var i=0; i<functions.length; i++) {
            var $function = $(functions[i]); 
            var $oldItem = $function.children('div');
            var $arrow = $function.children('span');
            $arrow.addClass('brtc-style-height-22px');
            var func = $function.attr('func');
            var label = $oldItem.text();

            $oldItem.hide();

            var $newItem = Brightics.VA.Core.Utils.WidgetUtils.createPaletteBox({
                func: func,
                label: label
            });

            $newItem.find('.brtc-va-views-palette-fnunit-label').addClass('brtc-style-ellipsis');

            $oldItem.replaceWith($newItem);
        };
    };

    DataTree.prototype.addTypeIcon = function () {
        var items = this.$treeWrapper.find('.brtc-va-controls-datatree-li-table');

        for (var i=0; i<items.length; i++) {
            var $icon = $('<div class="brtc-va-controls-datatree-li-table-icon"></div>');
            $icon.attr('type', $(items[i]).attr('type'));
            $(items[i]).prepend($icon);
        }
    };

    DataTree.prototype.addEllipsisClass = function () {
        var target = this.$treeWrapper.find('.brtc-va-controls-datatree-li-table > div');
        for (var i = 0; i < target.length; ++i) {
            const $target = $(target[i]);
            $target.addClass('brtc-style-ellipsis');
            $target.css('width', '100%');
            $target.attr('title', target[i].innerHTML);
        }
    };

    DataTree.prototype.createTreeElement = function ($container, fid, map) {
        var _this = this;
        var funcLabel = map.label;
        var $funcLi = $('<li class="brtc-va-controls-datatree-li-function">'+ funcLabel +'</li>');

        $container.append($funcLi);

        $funcLi.attr('item-expanded', 'true');

        _.forEach(map.data, function (data, tableId) {
            var $li = $('<li class="brtc-va-controls-datatree-li-table"></li>');
            
            $li.text(data.label);
            $li.attr('key', data.key);
            $li.attr('table-id', tableId);
            $li.attr('type', data.type);
            $li.attr('func', data.func);
            $li.attr('label', funcLabel);

            $funcLi.text(data.funcLabel);
            $funcLi.append('<ul></ul>');
            $funcLi.find('ul').append($li);
            $funcLi.attr('func', data.func);   

            _this.createClickEvent($li);
        });
    };

    DataTree.prototype.createClickEvent = function ($unit) {
        var _this = this;

        $unit.click(function () {
            if (typeof _this.options.onClick === 'function') {
                var key = $(this).attr('key');
                var tableId = $(this).attr('table-id');

                _this.options.onClick({
                    key: key,
                    tableId: tableId
                });
            }
        });
    };

    DataTree.prototype.createDragEvent = function () {
        var _this = this;

        var items = this.$treeWrapper.find('.brtc-va-controls-datatree-li-table .jqx-tree-item');

        _.forEach(items, function (item) {
            var $item = $(item);
            $item.draggable({
                helper: function () {
                    var $helper = $(this).clone();
                    var width = $(this).width();
                    $helper.css({
                        'z-index': 5100,
                        'width': width,
                        'height': '30px',
                        'line-height': '30px',
                        'overflow': 'hidden',
                        'white-space': 'nowrap',
                        'text-overflow': 'ellipsis'
                    }); 
                    return $helper;
                },
                appendTo: _this.options.dragTarget,
                start: function (event, ui) {
                    var $target = $(event.target);
                    var tableId = $target.closest('.brtc-va-controls-datatree-li-table').attr('table-id');

                    ui.helper.attr('table-id', tableId);
                }
            });
        });
    };

    DataTree.prototype.getSource = function () {
        return this.options.source;
    };

    Brightics.VA.Core.Editors.Sheet.Controls.DataTree = DataTree;

}).call(this);
