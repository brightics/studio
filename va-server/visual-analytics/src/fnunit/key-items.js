function KeyItems() {
}

KeyItems.prototype.create = function (options) {
    return this.createUnit(options);
};

KeyItems.prototype.createUnit = function (unitOptions) {
    var key = unitOptions.key;
    var tableId = unitOptions.tableId;
    var type = unitOptions.type;
    var label = unitOptions.label;
    var func = unitOptions.func

    var $box = this.createBox(key);
    $box.attr('key', key);
    $box.attr('type', type);
    $box.attr('label', label);
    $box.attr('func', func);
    $box.attr('table-id', tableId);

    var $contents = $box.find('.brtc-style-controls-inputselector-box-contents');
    var $figureArea = $contents.find('.brtc-style-controls-inputselector-box-contents-figure');
    var $keyArea = $contents.find('.brtc-style-controls-inputselector-box-key');

    var $funcItem = this.createFuncItem({
        label: label,
        func: func,
        type: type,
        tableId: tableId
    });

    var $keyItem =  this.createKeyItem({key: key, type: type});

    $figureArea.append($funcItem);
    $keyArea.append($keyItem);

    return $box;
};

KeyItems.prototype.bindEvents = function ($box, options) {
    if (typeof options.onClick === 'function') $box.bind('click', options.onClick);
    if (typeof options.onChange === 'function') $box.bind('change', options.onChange);
    if (typeof options.onRemove === 'function') $box.bind('remove', options.onRemove);
};

KeyItems.prototype.getPrevFnUnitByInTableId = function (fnUnit, inTalbeId) {
    if (!fnUnit) return;

    var prevFnUnits = FnUnitUtils.getPreviousFnUnits(fnUnit);

    for (var i in prevFnUnits) {
        var outData = FnUnitUtils.getOutData(prevFnUnits[i]);
        if (outData && outData.indexOf(inTalbeId) > -1) return  prevFnUnits[i];
    }
};

KeyItems.prototype.createBox = function (label) {
    var $boxWrapper = this.createBoxWrapper(label);
    return $boxWrapper;
};

KeyItems.prototype.createBoxWrapper = function (title) {
    var $wrapper = $('<div class="brtc-style-controls-inputselector-box-wrapper"></div>');
    $wrapper.css('width', '100%');
    $wrapper.css('height', '55px');

    var $contents = $('' +
        '<div class="brtc-style-controls-inputselector-box-contents">' +
            '<div class="brtc-style-controls-inputselector-box-contents-figure"></div>' +
            '<div class="brtc-style-controls-inputselector-box-contents-remove"></div>' +
        '</div>'
    );

    var $key = $('<div class="brtc-style-controls-inputselector-box-key"></div>');

    $wrapper.append($contents);
    $contents.append($key);

    return $wrapper;
};

KeyItems.prototype.createFuncItem = function (options) {
    var label = options.label;
    var func = options.func;
    var type = options.type;
    var tableId = options.tableId;

    var $itemWrapper = $('<div class="brtc-va-editors-sheet-controls-inputselector-item"></div>');
    var $item = Brightics.VA.Core.Utils.WidgetUtils.createPaletteBox({func: func, label: label});
    $itemWrapper.append($item);

    $item.find('.brtc-va-views-palette-fnunit-label').text(label);

    $itemWrapper.attr('table-id', tableId);
    $itemWrapper.attr('type', type);

    $item.find('.brtc-va-views-palette-fnunit-label').text(label);
    $item.attr('title', label);
    $item.addClass('item');

    return $itemWrapper;
};

KeyItems.prototype.createKeyItem = function (options) {
    var $wrapper = $('<div class="brtc-style-controls-inputselector-box-key-wrapper"></div>');
    var $type = $('<div class="brtc-style-controls-inputselector-box-key-type"></div>');
    var $label = $('<div class="brtc-style-controls-inputselector-box-key-label"></div>');

    $wrapper.append($type).append($label);

    $label.text(options.key);
    $type.append(this.createTypeIcon());

    return $wrapper;
};

KeyItems.prototype.createTypeIcon = function () {
    return $('<div class="brtc-style-controls-inputselector-box-key-type-icon" type="table"></div>');
};

KeyItems.prototype.createEmptyItem = function (emptyOptions) {
    var label = emptyOptions.label || 'Drop Data';
    var $parent = emptyOptions.parent;
    var type = emptyOptions.type;
    var readOnly = emptyOptions.readOnly;

    var $emptyItem = $('' +
        '<div class="brtc-va-fnunit-input-empty">' +
        '   <div>' + label  + '</div>' +
        '</div>');

    $parent.append($emptyItem);

    if (!readOnly) this.createDropEvent($emptyItem, type);

    return $emptyItem;
};

KeyItems.prototype.getDropFuncTarget = function ($item) {
    return $item.find('.brtc-va-views-palette-fnunit').length == !0 ? $item.find('.brtc-va-views-palette-fnunit') : $item;
};

KeyItems.prototype.createDropEvent = function ($item) {
    var _this = this;
    // var type = $item.attr('type');

    $item.droppable({
        // accept: '.key-items-draggable .ui-draggable',
        accept: '.key-items-draggable',
        activate: function (event, ui) {
            var $dropTarget = _this.getDropFuncTarget($(this));
            $dropTarget.addClass('brtc-style-droppable-active');
        },
        deactivate: function (event, ui) {
            var $dropTarget = _this.getDropFuncTarget($(this));
            $dropTarget.removeClass('brtc-style-droppable-active');
            $dropTarget.removeClass('brtc-style-droppable-hover');
        },
        over: function (event, ui) {
            var $dropTarget = _this.getDropFuncTarget($(this));
            $dropTarget.addClass('brtc-style-droppable-hover');
        },
        out: function (event, ui) {
            var $dropTarget = _this.getDropFuncTarget($(this));
            $dropTarget.removeClass('brtc-style-droppable-hover');
        },
        drop: function (event, ui) {
            var $source = ui.draggable;
            var $dropTarget = _this.getDropFuncTarget($(this));
            var $mainControl = _this.getMainArea($(this));

            $dropTarget.removeClass('brtc-style-droppable-active');
            $dropTarget.removeClass('brtc-style-droppable-hover');

            _this.switchData($source, $(this));

            var inputs = _this.getItems($mainControl);
            $mainControl.trigger('change', [inputs]);
        }
    });
};

KeyItems.prototype.switchData = function ($source, $target) {
    var sourceKey = $source.closest('li').attr('key');
    var sourceLabel = $source.closest('li').attr('label');
    var sourceType = $source.closest('li').attr('type');
    var sourceFunc = $source.closest('li').attr('func');
    var sourceTableId = $source.closest('li').attr('table-id');

    var $funcItem = this.createFuncItem({
        label: sourceLabel,
        func: sourceFunc,
        type: sourceType,
        tableId: sourceTableId
    });
    var $keyItem =  this.createKeyItem({key: sourceKey, type: sourceType});

    var $box = $target.closest('.brtc-style-controls-inputselector-box-wrapper');
    var $contents = $box.find('.brtc-style-controls-inputselector-box-contents');
    var $targetFuncItem = $contents.find('.brtc-va-editors-sheet-controls-inputselector-item');
    var $targetKeyItem = $contents.find('.brtc-style-controls-inputselector-box-key-wrapper');
    var $emptyItem = $contents.find('.brtc-va-fnunit-input-empty');
    var $removeButton = $contents.find('.brtc-va-tools-sidebar-variable-remove');

    $emptyItem.hide();
    $target.show();
    $targetKeyItem.show();
    $removeButton.show();

    $targetFuncItem.replaceWith($funcItem);
    $targetKeyItem.replaceWith($keyItem);

    this.createDropEvent($box);
};

KeyItems.prototype.createRemoveButton = function () {
    var _this = this;

    var $removeButton = $('<span class="brtc-va-tools-sidebar-variable-remove"></span>');

    $removeButton.click(function () {
        var $box = $(this).closest('.brtc-style-controls-inputselector-box-wrapper');

        var $tableItem = $box.find('.brtc-va-editors-sheet-controls-inputselector-item');
        var $keyItem = $box.find('.brtc-style-controls-inputselector-box-key-wrapper');
        var $emptyItem = $box.find('.brtc-va-fnunit-input-empty');
        var $removeButton = $box.find('.brtc-va-tools-sidebar-variable-remove');

        $removeButton.hide();
        $keyItem.hide();
        $tableItem.hide();
        $emptyItem.show();

        _this.handleRemove($(this));

    });

    return $removeButton;
};

KeyItems.prototype.handleRemove = function ($removeButton) {
    var $mainControl = this.getMainArea($removeButton);
    $mainControl.trigger('change',[this.getItems($removeButton)]);
};

KeyItems.prototype.getPreviousFnUnits = function (fnUnit) {
    var fnUnits = [];

    var model = fnUnit.parent();
    var prevFids = model.getPrevious(FnUnitUtils.getId(fnUnit));

    _.forEach(prevFids, function (fid) {
        fnUnits.push(model.getFnUnitById(fid));
    });
    return fnUnits;
};
KeyItems.prototype.getMainArea = function ($el) {
    return $el.closest('.brtc-va-editors-sheet-controls-input-list') || $el;
};

KeyItems.prototype.getItems = function ($el) {
    var $mainControl = this.getMainArea($el);
    var inputs = $mainControl.find('.brtc-style-controls-inputselector-box-wrapper');
    var rt = {};

    _.forEach(inputs, function (input) {
        var $input = $(input);
        var $table = $input.find('.brtc-va-editors-sheet-controls-inputselector-item');

        var key = $input.attr('key');
        var tableId = ($table.is(':visible'))? $table.attr('table-id') : '';
        rt[key] = tableId;
    });

    return rt;
};

KeyItems.prototype.destroyDragEvent = function ($item) {
    $item.on('dragstop', function (event, ui) {
        if ($item.hasClass('ui-draggable') && ui.helper.attr('table-id') !== event.target.getAttribute('table-id')) {
            $item.draggable('destroy');
        }
    });
};

var keyItems = new KeyItems();

export { keyItems as KeyItems };