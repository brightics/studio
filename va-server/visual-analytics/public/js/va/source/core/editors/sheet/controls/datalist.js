
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function DataList(parentId, options) {
        this.parentId = parentId;
        this.options = options;

        this.retrieveParent();
        this.createControls();
    }

    DataList.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    DataList.prototype.createControls = function () {
        this.$mainControl = $('<div class="brtc-va-controls-datatree"></div>');
        this.$treeWrapper = $('<div class="brtc-va-controls-datatree-wrapper"><ul></ul></div>');

        this.$parent.append(this.$mainControl);
        this.$mainControl.append(this.$treeWrapper);

        this.$mainControl.css({
            'width': '200px',
            'height': '100%',
            'border': '1px solid grey',
            'float': 'left',
            'background-color': 'white'
        });

        this.createTree();
    };

    DataList.prototype.createTree = function () {
        var _this = this;
        var $container = this.$treeWrapper.find('ul');

        _.forEach(this.options.source, function (map, funcLabel) {
            _this.createTreeElement($container, funcLabel, map);
        });

        this.$treeWrapper.jqxTree({
            height: '100%',
            width: '100%',
            theme: Brightics.VA.Env.Theme,
            allowDrag: false
        });

        this.addTypeIcon();

        if (_this.options.draggable) _this.createDragEvent();
    };

    DataList.prototype.createTreeElement = function ($container, funcLabel, map) {
        var _this = this;

        var $funcLi = $('<li></li>');

        $container.append($funcLi);

        $funcLi.attr('item-expanded', 'true');
        $funcLi.text(funcLabel);

        _.forEach(map, function (data, tableId) {
            var $li = $('<li class="brtc-va-controls-datatree-li-table"></li>');
            $li.text(data.key);
            $li.attr('key', data.key);
            $li.attr('table-id', tableId);
            $li.attr('type', data.type);

            $funcLi.append('<ul></ul>');
            $funcLi.find('ul').append($li);

            _this.createClickEvent($li);
        });
    };

    DataList.prototype.addTypeIcon = function () {
        var items = this.$treeWrapper.find('.brtc-va-controls-datatree-li-table');

        for (var i=0; i<items.length; i++) {
            var $icon = $('<div class="brtc-va-controls-datatree-type-icon"></div>');
            var iconText = ($(items[i]).attr('type')).substring(0,1).toUpperCase();
            $icon.text(iconText);
            $(items[i]).prepend($icon);
        }
    };

    DataList.prototype.createClickEvent = function ($unit) {
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

    DataList.prototype.createDragEvent = function () {
        var _this = this;

        var items = this.$treeWrapper.find('.brtc-va-controls-datatree-li-table div');

        _.forEach(items, function (item) {
            var $item = $(item);
            $item.draggable({
                helper: 'clone',
                appendTo: _this.options.dragTarget,
                start: function (event, ui) {
                    var $target = $(event.target);
                    var tableId = $target.closest('.brtc-va-controls-datatree-li-table').attr('table-id');

                    ui.helper.attr('table-id', tableId);
                }
            });
        });
    };

    DataList.prototype.getSource = function () {
        return this.options.source;
    };

    Brightics.VA.Core.Editors.Sheet.Controls.DataList = DataList;

}).call(this);
