import { FnUnitUtils } from './fnunit-utils';

const TYPE_TABLE = 'table';

var PROBLEM_MESSAGE = {
    duplicate: function (label) {
        return '"'+ label +'" is already exist';
    },
    index: function () {
        return 'Should be filled previous element first';
    },
    empty: function () {
        return 'can not switch to "Empty"';
    }
}

function FnUnitInputs() {
}

FnUnitInputs.prototype.render = function (options) {
    this.empty(options);
    this.init(options);
    this.createLayout(options);
    this.createInputs(options);
    this.bindEvents(options);

    return this;
};

FnUnitInputs.prototype.init = function (options) {
    if (FnUnitUtils.hasMeta(options.fnUnit)) this.DATA_TYPE = 'object';
    else this.DATA_TYPE = 'array';
};

FnUnitInputs.prototype.getPrevFnUnitByTableId = function (fnUnit, inTableId) {
    var prevFnUnits = FnUnitUtils.getPreviousFnUnits(fnUnit);
    for (var i in prevFnUnits) {
        var fn = prevFnUnits[i];
        var outData = FnUnitUtils.getOutData(fn);

        if (outData.indexOf(inTableId) > -1) { return fn; }
    };
};

FnUnitInputs.prototype.empty = function (options) {
    options.appendTo.empty();
};

FnUnitInputs.prototype.createLayout = function (options) {
    var $mainControl = $('' +
        '<div class="brtc-va-editors-sheet-controls-input-list">' +
        '   <div class="brtc-va-editors-sheet-controls-input-list-content"/>' +
        '</div>');

    $mainControl.attr('autoArrange', options.autoArrange || false);

    var $container = $('<div class="brtc-va-editors-sheet-controls-input-list-container"></div>');

    $mainControl.append($container);

    options.appendTo.append($mainControl);
};

FnUnitInputs.prototype.createInputs = function (options) {
    var _this = this;
    var inputs = FnUnitUtils.getInputs(options.fnUnit);

    if (FnUnitUtils.hasMeta(options.fnUnit)) {
        _.forEach(inputs, function (tableId, key) {
            var unitOptions = {
                type: FnUnitUtils.getTypeByKey(options.fnUnit, key),
                tableId: tableId,
                key: key,
                fnUnit: options.fnUnit,
                appendTo: options.appendTo,
                emptyLabel: options.emptyLabel,
                readOnly: options.readOnly,
                autoArrange: false
            }
            _this.createInputUnit(unitOptions);
        });
    } else {
        var inRange = FnUnitUtils.getInRange(options.fnUnit)[TYPE_TABLE];
        var max = inRange.max;

        if (FnUnitUtils.isFlexibleFunction(options.fnUnit)) 
            max = FnUnitUtils.getInTable(options.fnUnit).length;

        for (var i=0; i < max; i++) {
            var unitOptions = {
                type: TYPE_TABLE,
                tableId: inputs[i],
                key: '[' + i + ']' + FnUnitUtils.getLabel(options.fnUnit),
                fnUnit: options.fnUnit,
                appendTo: options.appendTo,
                emptyLabel: options.emptyLabel,
                readOnly: options.readOnly,
                autoArrange: true
            }
            _this.createInputUnit(unitOptions);
        }
    }
};

FnUnitInputs.prototype.enableDragEvent = function ($el) {
    var $target = 
        $el.hasClass('brtc-style-controls-inputselector-box-wrapper')? 
            $el : $el.closest('.brtc-style-controls-inputselector-box-wrapper');

    if (this.isDraggable($target)) $target.draggable('enable');
};

FnUnitInputs.prototype.disableDragEvent = function ($el) {
    var $target = 
        $el.hasClass('brtc-style-controls-inputselector-box-wrapper')? 
            $el : $el.closest('.brtc-style-controls-inputselector-box-wrapper');

    if (this.isDraggable($target)) $target.draggable('disable');
};

FnUnitInputs.prototype.isDraggable = function ($el) {
    var $target = 
    $el.hasClass('brtc-style-controls-inputselector-box-wrapper')? 
        $el : $el.closest('.brtc-style-controls-inputselector-box-wrapper');

    return $target.hasClass('ui-draggable');
};

FnUnitInputs.prototype.createInputUnit = function (unitOptions) {
    var key = unitOptions.key;
    var tableId = unitOptions.tableId;
    var type = unitOptions.type;
    var fnUnit = unitOptions.fnUnit;
    var prevFnUnit = this.getPrevFnUnitByInTableId(fnUnit, tableId);
    var readOnly = unitOptions.readOnly;
    var autoArrange = unitOptions.autoArrange;

    var $box = this.createBox({appendTo: unitOptions.appendTo, label: key, type: type});
    
    if (!unitOptions.readOnly && _.isEqual(this.DATA_TYPE, 'array')) {
        this.createDragEvent(unitOptions.appendTo, $box);
        tableId? this.enableDragEvent($box) : this.disableDragEvent($box);
    }

    if (this.DATA_TYPE === 'array' && !readOnly) {
        $box.css('cursor', 'move');
    }

    $box.attr('key', key);
    $box.attr('type', type);
    $box.attr('table-id', tableId);

    var $contents = $box.find('.brtc-style-controls-inputselector-box-contents');
    var $figureArea = $contents.find('.brtc-style-controls-inputselector-box-contents-figure');
    var $removeArea = $contents.find('.brtc-style-controls-inputselector-box-contents-remove');
    var $keyArea = $contents.find('.brtc-style-controls-inputselector-box-key');
    var $container = unitOptions.appendTo.find('.brtc-va-editors-sheet-controls-input-list-container');

    $container.append($box);

    var $emptyItem = this.createEmptyItem({
        parent: $figureArea,
        type: type,
        label: unitOptions.emptyLabel,
        readOnly: readOnly
    });
    $contents.append($emptyItem);

    var $funcItem = this.createFuncItem({
        label: FnUnitUtils.getLabel(prevFnUnit),
        func: FnUnitUtils.getFunc(prevFnUnit),
        type: FnUnitUtils.getTypeByTableId(prevFnUnit, tableId),
        tableId: tableId
    });
    var outputObject = FnUnitUtils.getOutputsToObject(prevFnUnit);
    var $keyItem =  this.createKeyItem({key: outputObject[tableId], type: type});
    var $removeItem = this.createRemoveButton({autoArrange: autoArrange});

    $figureArea.append($funcItem);
    $keyArea.append($keyItem);
    if (!readOnly) $removeArea.append($removeItem);
    if (!readOnly) this.createDropEvent($box);

    if (tableId) {
        $emptyItem.hide();
        $funcItem.show();
        $keyItem.show();
        $removeItem.show();
    } else {
        $emptyItem.show();
        $funcItem.hide();
        $keyItem.hide();
        $removeItem.hide();
    }

    this.registerRemoveEvent($removeItem);

    return $box;
};

FnUnitInputs.prototype.getPrevFnUnitByInTableId = function (fnUnit, inTalbeId) {
    if (!fnUnit) return;

    var prevFnUnits = FnUnitUtils.getPreviousFnUnits(fnUnit);

    for (var i in prevFnUnits) {
        var outData = FnUnitUtils.getOutData(prevFnUnits[i]);
        if (outData && outData.indexOf(inTalbeId) > -1) return  prevFnUnits[i];
    }
};

FnUnitInputs.prototype.createBox = function (options) {
    var $boxWrapper = this.createBoxWrapper(options.label, options.type);
    return $boxWrapper;
};

FnUnitInputs.prototype.createDragEvent = function ($parent, $item) {
    $item.draggable({
        helper: 'clone',
        appendTo: $parent,
        start: function (e, ui) {
            $item.css('opacity', '.3');
            ui.helper.css({
                'width': '220px',
                'border':'none'
            });
            ui.helper.find('.brtc-style-controls-inputselector-box-title').hide();
        },
        stop: function (e, ui) {
            $item.css('opacity', '1');
        }
    });
};

FnUnitInputs.prototype.createBoxWrapper = function (title, type) {
    var $wrapper = $('<div class="brtc-style-controls-inputselector-box-wrapper"></div>');

    var $title = $('' +
        '<div class="brtc-style-controls-inputselector-box-title brtc-style-ellipsis">' +
            '<div class="icon"></div>' +
            '<div class="brtc-label"></div>' +
        '</div>'
        );

    var $contents = $('' +
        '<div class="brtc-style-controls-inputselector-box-contents">' +
        '<div class="brtc-style-controls-inputselector-box-contents-figure"></div>' +
        '<div class="brtc-style-controls-inputselector-box-contents-remove"></div>' +
        '</div>'
    );

    var $key = $('<div class="brtc-style-controls-inputselector-box-key"></div>');

    $wrapper.append($title).append($contents);
    $contents.append($key);
    $title.find('.icon').attr('type', type);
    $title.find('.brtc-label').text(title);

    return $wrapper;
};

FnUnitInputs.prototype.createFuncItem = function (options) {
    var label = options.label;
    var func = options.func;
    var type = options.type;
    var tableId = options.tableId;

    var $itemWrapper = $('<div class="brtc-va-editors-sheet-controls-inputselector-item"></div>');
    var $item = Brightics.VA.Core.Utils.WidgetUtils.createPaletteBox({func: func, label: label});
    $itemWrapper.append($item);
    $item.find('.brtc-va-views-palette-fnunit-label').addClass('brtc-style-ellipsis');

    $item.find('.brtc-va-views-palette-fnunit-label').text(label);

    $itemWrapper.attr('table-id', tableId);
    $itemWrapper.attr('type', type);

    $item.find('.brtc-va-views-palette-fnunit-label').text(label);
    $item.attr('title', label);
    $item.addClass('item');

    return $itemWrapper;
};

FnUnitInputs.prototype.createKeyItem = function (options) {
    var $wrapper = $('<div class="brtc-style-controls-inputselector-box-key-wrapper"></div>');
    var $type = $('<div class="brtc-style-controls-inputselector-box-key-type"></div>');
    var $label = $('<div class="brtc-style-ellipsis brtc-style-controls-inputselector-box-key-label"></div>');

    $wrapper.append($type).append($label);

    $label.text(options.key);
    $label.attr('title', options.key);
    $type.append(this.createTypeIcon(options.type));

    return $wrapper;
};

FnUnitInputs.prototype.createTypeIcon = function (type) {
    return $('<div class="brtc-style-controls-inputselector-box-key-type-icon"></div>').attr('type', type);
};

FnUnitInputs.prototype.createEmptyItem = function (emptyOptions) {
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

FnUnitInputs.prototype.getDropFuncTarget = function ($item) {
    return $item.find('.brtc-style-controls-inputselector-box-contents');
    // return $item.find('.brtc-va-views-palette-fnunit').length == !0 ? $item.find('.brtc-va-views-palette-fnunit') : $item;
};

FnUnitInputs.prototype.getDroppableCssSelector = function () {
    return [
        '.brtc-va-fnunit-input-empty',
        '.brtc-va-editors-sheet-controls-inputselector-item',
        '.brtc-va-tools-sidebar-variable-remove',
        '.brtc-style-controls-inputselector-box-key-wrapper',
    ].join(',');
};
FnUnitInputs.prototype.addActivateClass = function ($item) {
    $item.find(this.getDroppableCssSelector()).addClass('brtc-style-droppable-active');
};
FnUnitInputs.prototype.removeActivateClass = function ($item) {
    $item.find(this.getDroppableCssSelector()).removeClass('brtc-style-droppable-active');
};
FnUnitInputs.prototype.addHoverClass = function ($item) {
    $item.find(this.getDroppableCssSelector()).addClass('brtc-style-droppable-hover');
};
FnUnitInputs.prototype.removeHoverClass = function ($item) {
    $item.find(this.getDroppableCssSelector()).removeClass('brtc-style-droppable-hover');
};

FnUnitInputs.prototype.createDropEvent = function ($item) {
    var _this = this;
    var type = $item.attr('type');

    $item.droppable({
        accept: '.brtc-va-controls-datatree-li-table[type='+ type +'] .ui-draggable, .brtc-style-controls-inputselector-box-wrapper',
        activate: function (event, ui) {
            _this.addActivateClass($(this));
        },
        deactivate: function (event, ui) {
            _this.removeActivateClass($(this));
            _this.removeHoverClass($(this));
        },
        over: function (event, ui) {
            _this.addHoverClass($(this));
        },
        out: function (event, ui) {
            _this.removeHoverClass($(this));
        },
        drop: function (event, ui) {
            var $source = ui.draggable;
            var $mainControl = _this.getMainArea($(this));
            var label =  $source.text();

            var problem = _this.validate($source, $(this));

            if (_.isEmpty(problem)) {
                _this.removeActivateClass($(this));
                _this.removeHoverClass($(this));
                _this.switchData($source, $(this));
                _this.handleChange($(this));

            } else {
                _this.handleError($mainControl, PROBLEM_MESSAGE[problem.type](label)); 
            }
        }
    });
};

FnUnitInputs.prototype.validate = function ($source, $target) {
    if (this.checkDuplicated($source, $target)) return {type: 'duplicate'};
    if (this.checkIndex($source, $target)) return {type: 'index'};
    if (this.checkEmpty($source, $target)) return {type: 'empty'};
    return undefined;
};

FnUnitInputs.prototype.checkDuplicated = function ($source, $target) {
    var inputs = this.getInputs(this.getMainArea($target));
    var tableId = $source.closest('li').attr('table-id');

    for (var key in inputs) {
        if (_.isEqual(inputs[key], tableId)) return true;
    }

    return false;
};

FnUnitInputs.prototype.checkIndex = function ($source, $target) {
    if (this.DATA_TYPE === 'object') return false;
    
    var $prev = $target.prev();

    if (!_.isEmpty($prev) && this.isEmptyBox($prev)) return true;
    return false;
};

FnUnitInputs.prototype.checkEmpty = function ($source, $target) {
    if ($source.hasClass('jqx-tree-item')) return false;
    if (this.isEmptyBox($source) || this.isEmptyBox($target)) return true;
    return false;
};

FnUnitInputs.prototype.switchData = function ($source, $target) {
    var isSelf = $source.hasClass('brtc-style-controls-inputselector-box-wrapper');

    if (isSelf) {
        var $sourceBox = $source.closest('.brtc-style-controls-inputselector-box-wrapper');
        var $sourceContents = $sourceBox.find('.brtc-style-controls-inputselector-box-contents');
        var $sourceClone = $sourceContents.clone();

        var $targetBox = $target.closest('.brtc-style-controls-inputselector-box-wrapper');
        var $targetContents = $targetBox.find('.brtc-style-controls-inputselector-box-contents');
        var $targetClone = $targetContents.clone();

        $targetContents.replaceWith($sourceClone);
        $sourceContents.replaceWith($targetClone);

        this.registerRemoveEvent($sourceClone.find('.brtc-va-tools-sidebar-variable-remove'));
        this.registerRemoveEvent($targetClone.find('.brtc-va-tools-sidebar-variable-remove'));

        this.isEmptyBox($sourceClone)? this.disableDragEvent($sourceClone) : this.enableDragEvent($sourceClone);
        this.isEmptyBox($targetClone)? this.disableDragEvent($targetClone) : this.enableDragEvent($targetClone);

        return $targetClone;
    } else {
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

        this.registerRemoveEvent($removeButton);
    
        $targetFuncItem.replaceWith($funcItem);
        $targetKeyItem.replaceWith($keyItem);
    
        this.enableDragEvent($funcItem);

        this.createDropEvent($box);
    }
};

FnUnitInputs.prototype.createRemoveButton = function (options) {
    var $removeButton = $('<span class="brtc-va-tools-sidebar-variable-remove"></span>');
    return $removeButton;
};

FnUnitInputs.prototype.registerRemoveEvent = function ($removeButton) {
    var _this = this;

    $removeButton.off('click');
    $removeButton.click(function () {
        var $mainControl = _this.getMainArea($(this));
        var $box = $(this).closest('.brtc-style-controls-inputselector-box-wrapper');

        var $tableItem = $box.find('.brtc-va-editors-sheet-controls-inputselector-item');
        var $keyItem = $box.find('.brtc-style-controls-inputselector-box-key-wrapper');
        var $emptyItem = $box.find('.brtc-va-fnunit-input-empty');
        var $removeButton = $box.find('.brtc-va-tools-sidebar-variable-remove');

        $removeButton.hide();
        $keyItem.hide();
        $tableItem.hide();
        $emptyItem.show();

        _this.disableDragEvent($box);

        if ($mainControl.attr('autoArrange') === 'true') _this.autoArrange($box);

        _this.handleRemove($mainControl);
    });
};

FnUnitInputs.prototype.autoArrange = function ($box) {
    var $nextBox = $box.next();
    if (_.isEmpty($nextBox) || this.isEmptyBox($nextBox)) return;
    
    var $target = this.switchData($nextBox, $box);
    
    this.autoArrange($target);
};

FnUnitInputs.prototype.isEmptyBox = function ($el) {
    var $target = 
        $el.hasClass('brtc-style-controls-inputselector-box-wrapper')? 
            $el : $el.closest('.brtc-style-controls-inputselector-box-wrapper');
    return $target.find('.brtc-va-fnunit-input-empty').is(':visible');
};

FnUnitInputs.prototype.handleChange = function ($el) {
    var $mainControl = this.getMainArea($el);
    $mainControl.trigger('change',[this.getInputs($el)]);
};

FnUnitInputs.prototype.handleRemove = function ($el) {
    var $mainControl = this.getMainArea($el);
    $mainControl.trigger('change',[this.getInputs($el)]);
};

FnUnitInputs.prototype.handleError = function ($el, message) {
    var $mainControl = this.getMainArea($el);
    $mainControl.trigger('error',[message]);
};

FnUnitInputs.prototype.getPreviousFnUnits = function (fnUnit) {
    var fnUnits = [];

    var model = fnUnit.parent();
    var prevFids = model.getPrevious(FnUnitUtils.getId(fnUnit));

    _.forEach(prevFids, function (fid) {
        fnUnits.push(model.getFnUnitById(fid));
    });
    return fnUnits;
};
FnUnitInputs.prototype.getMainArea = function ($el) {
    return $el.closest('.brtc-va-editors-sheet-controls-input-list') || $el;
};

FnUnitInputs.prototype.getInputs = function ($el) {
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

FnUnitInputs.prototype.destroyDragEvent = function ($item) {
    $item.on('dragstop', function (event, ui) {
        if ($item.hasClass('ui-draggable') && ui.helper.attr('table-id') !== event.target.getAttribute('table-id')) {
            $item.draggable('destroy');
        }
    });
};

FnUnitInputs.prototype.bindEvents = function (options) {
    var $parent = options.appendTo;
    var $target = $parent.find('.brtc-va-editors-sheet-controls-input-list');

    if (typeof options.onClick === 'function') $target.bind('click', options.onClick);
    if (typeof options.onChange === 'function') $target.bind('change', options.onChange);
    if (typeof options.onError === 'function') $target.bind('error', options.onError);
};

var fnUnitInputs = new FnUnitInputs();

export { fnUnitInputs as FnUnitInputs };