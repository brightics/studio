(function () {
    'use strict';

    /*
     options = {
     fnUnit: fnUnit,
     rowHeaderType: 'number' or 'custom'
     rowHeaderList: ['aaa', 'bbb'] -> only rowHeaderType is 'custom'
     rowHeaderWidth: 30 -> default 20
     }
     */
    var root = this;
    var Brightics = root.Brightics;
    var FnUnitUtils = brtc_require('FnUnitUtils');
    var FnUnitInputs = brtc_require('FnUnitInputs');

    function InputSelector(parentId, options) {
        this.parentId = parentId;
        this.options = options;
        this.keyMap = {};

        this.retrieveParent();
        this.createControls();
        this.initContents();
    }

    InputSelector.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    InputSelector.prototype.createControls = function () {
        var _this = this;

        this.$mainControl = $('' +
            '<div class="brtc-va-editors-sheet-controls-inputselector-editarea">' +
            '   <div class="brtc-style-controls-inputselector-content"/>' +
            '</div>');

        var jqxOptions = {
            theme: Brightics.VA.Env.Theme,
            position: {
                my: "left top",
                at: "right top",
                of: this.$parent
                // of: this.$parent.find('.brtc-va-editors-sheet-controls-dataselector-contents')
            },
            appendTo: 'body',
            width: 600,
            height: 550,
            title: 'Set Inputs',
            modal: false,
            showAnimationDuration: 50,
            minHeight: 250,
            open: function () {
                $('.ui-dialog-titlebar.ui-widget-header', $(this).parent()).css({
                    'width': 'calc(100% - 40px) !important',
                    'padding-left': '0px !important',
                    'padding-right': '0px !important',
                    'margin-left': '20px !important'
                });
            }
        };
        if (!this.options.multiple) {
            jqxOptions.height -= 33;
        }

        $.extend(jqxOptions, this.options);

        this.$mainControl.dialog(jqxOptions);
        this.$mainControl.css({
            'width': '-webkit-fill-available',
            'min-height': '50px',
            'max-height': '600px',
            'min-width': '100px',
            'max-width': '800px'
        });
        this.$mainControl.parent().find('.ui-resizable-handle:not(.ui-resizable-s)').hide();

        this.closeHandler = function (event) {
            var $target = $(event.target);

            if ($target.attr('class')) {
                if ($target.attr('class').indexOf('ui-dialog') > -1) return;
            }

            if (_this.$mainControl.has(event.target).length === 0) {
                _this.$mainControl.dialog('close');
            }
        };
        _this.$mainControl.on('dialogclose', function (event) {
            $(window).off('mousedown', this.closeHandler);
            _this.$mainControl.dialog('destroy');
        });

        _this.$mainControl.parent().on('mousedown', function (event) {
            event.stopPropagation();
        });

        $(window).on('mousedown', _this.closeHandler);
    };

    InputSelector.prototype.reset = function () {
        this.initContents();
    };

    InputSelector.prototype.initContents = function () {
        var $contentControl = this.$mainControl.find('.brtc-style-controls-inputselector-content');
        $contentControl.empty();

        var $sourceWrapper = $('<div class="brtc-style-controls-inputselector-content-source-wrapper brtc-style-margin-right-10"></div>');
        var $inputWrapper = $('<div class="brtc-style-controls-inputselector-content-inputs-wrapper"></div>');

        this.$sourceArea = $('<div class="brtc-style-controls-inputselector-content-source"></div>');
        this.$inputArea = $('<div class="brtc-style-controls-inputselector-content-input"></div>');

        $sourceWrapper.append(this.$sourceArea);
        $inputWrapper.append(this.$inputArea);

        $contentControl.append($sourceWrapper).append($inputWrapper);

        this.createSourceContainer(this.$sourceArea);
        this.createInputContainer(this.$inputArea);
    };

    InputSelector.prototype.getDropFuncTarget = function ($item) {
        return $item.find('.brtc-va-views-palette-fnunit').length == !0 ? $item.find('.brtc-va-views-palette-fnunit') : $item;
    };

    InputSelector.prototype.createDropEvent = function ($item) {
        var _this = this;
        $item.droppable({
            accept: '.brtc-va-controls-datatree-li-table .ui-draggable',
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
                $dropTarget.removeClass('brtc-style-droppable-active');
                $dropTarget.removeClass('brtc-style-droppable-hover');

                _this.switchData($source, $(this));
                _this.destroyDragEvent($source);
                _this.onChange();
            }
        });
    };
    InputSelector.prototype.switchData = function ($source, $target) {
        var sourceKey = $source.closest('li').attr('key');
        var sourceTableId = $source.closest('li').attr('table-id');
        var sourceType = $source.closest('li').attr('type');

        var $tableItem = this.createTableItem({
            fnUnit: this.options.fnUnit,
            label: sourceKey,
            value: sourceTableId,
            type: sourceType
        });

        var isEmptyTarget =
            ($target.hasClass('brtc-style-controls-inputselector-empty-fnunit'))? true : false;

        // var $newCloneSource = $source.clone();
        // $newCloneSource.removeClass('ui-draggable').removeClass('ui-draggable-handle');

        var $contents = $target.closest('.brtc-style-controls-inputselector-box-contents');
        var $emptyItem = $contents.find('.brtc-va-editors-sheet-controls-empty-fnunit');
        var $removeButton = $contents.find('.brtc-style-editor-content-remove-button');

        $removeButton.show();
        // $tableItem.remove();
        $emptyItem.hide();

        this.createDropEvent($tableItem);

        (isEmptyTarget)? $contents.prepend($tableItem): $target.replaceWith($tableItem);
    };

    InputSelector.prototype.createTreeSource = function (fn) {
        var rt = {};
        var el = {
            label: '',
            data: {}
        };

        var outputs = FnUnitUtils.getOutputsToObject(fn);
        var funcLabel = FnUnitUtils.getLabel(fn);
        var id = FnUnitUtils.getId(fn);
        $.extend(this.keyMap, outputs) ;
        

        var data = {};
        for (var tableId in outputs) {
            data[tableId] = {};
            data[tableId]['key'] = outputs[tableId];
            data[tableId]['type'] = FnUnitUtils.getTypeByTableId(fn, tableId);
            data[tableId]['func'] = FnUnitUtils.getFunc(fn);
            // data[tableId]['funcLabel'] = funcLabel;
            data[tableId]['label'] = FnUnitUtils.getKeyLabel(fn, outputs[tableId]) || outputs[tableId];
        }

        el.label = funcLabel;
        el.data = data;
        // source[id] = el;
        rt[id] = el;
        return rt;
    };

    InputSelector.prototype.createSourceContainer = function () {
        var _this = this;

        var source = {};

        var prevFnUnits = this.getPreviousFnUnits(this.options.fnUnit);
        var model = FnUnitUtils.getParent(this.options.fnUnit);

        _.forEach(prevFnUnits, function (fn) {
            if (FnUnitUtils.isProcessFunction(fn)) {
                var tmpFnUnits = model.getAllPreviousFnUnits(FnUnitUtils.getId(fn));
                _.forEach(tmpFnUnits, function (tmpFn) {
                    source = _.assign(source, _this.createTreeSource(tmpFn));
                });
            } else {
                source = _.assign(source, _this.createTreeSource(fn));
            }
        });

        var options = {
            draggable: true,
            dragTarget: this.$mainControl,
            source: source,
            onClick: function (data) {
                console.log(data);
            }
        }
        new Brightics.VA.Core.Editors.Sheet.Controls.DataTree(this.$sourceArea, options);
    };

    InputSelector.prototype.createInputContainer = function () {
        var options = {
            appendTo: this.$inputArea,
            fnUnit: this.options.fnUnit,
            onChange: this.onChange.bind(this),
            onError: this.onError.bind(this),
            autoArrange: FnUnitUtils.hasMeta(this.options.fnUnit)? false : true,
            // readOnly: FnUnitUtils.isFlexibleFunction(this.options.fnUnit)? true : false
            // readOnly: !hasMeta && !_.isEqual(inRange.table.max, inRange.table.min)? true : false
        };

        this.inputsList = FnUnitInputs.render(options);
        var $inputWrapper = 
            this.$inputArea.closest('.brtc-style-controls-inputselector-content-inputs-wrapper');
        $inputWrapper.perfectScrollbar();
    };

    InputSelector.prototype.createRemoveButton = function () {
        var _this = this;

        var $removeButton = $('<span class="brtc-style-editor-content-remove-button"></span>');

        $removeButton.click(function () {
            var $box = $(this).closest('.brtc-style-controls-inputselector-box-wrapper');
            var tableId = $box.attr('table-id');
            var key = $box.attr('key');

            var $tableItem = $box.find('.brtc-va-editors-sheet-controls-dataselector-item');
            var $emptyItem = $box.find('.brtc-va-editors-sheet-controls-empty-fnunit');
            var $removeButton = $box.find('.brtc-style-editor-content-remove-button');

            $removeButton.hide();
            $tableItem.remove();
            $emptyItem.show();

            _this.handleRemove(key, tableId);

        });

        return $removeButton;
    };

    InputSelector.prototype.handleRemove = function (key, tableId) {
        console.log(tableId);
        console.log(key);
        this.onChange();
    };

    InputSelector.prototype.createBoxWrapper = function (title) {
        var $wrapper = $(''+
            '<div class="brtc-style-controls-inputselector-box-wrapper">' +
            '</div>'
        );

        var $header = $('<div class="brtc-style-controls-inputselector-box-header"></div>');
        var $contents = $('<div class="brtc-style-controls-inputselector-box-contents"></div>');

        $wrapper.append($header).append($contents);

        $header.text(title);

        return $wrapper;
    };

    InputSelector.prototype.createBox = function (label) {
        var $boxWrapper = this.createBoxWrapper(label);
        return $boxWrapper;
    };

    InputSelector.prototype.createTableItem = function (options) {
        var label = options.label;
        var value = options.value;

        var $itemWrapper = $('<div class="brtc-va-editors-sheet-controls-dataselector-item single"></div>'),
            $item = Brightics.VA.Core.Utils.WidgetUtils.createTableItem($itemWrapper, {
                label: options.label,
                id: options.value,
                type: options.type
            });

        $itemWrapper.attr('table-id', value);
        $itemWrapper.attr('type', options.type);

        $item.find('.brtc-va-views-palette-fnunit-label').addClass('brtc-style-ellipsis');
        $item.find('.brtc-va-views-palette-fnunit-label').text(label);
        $item.attr('title', label);
        $item.addClass('item');

        return $itemWrapper;
    };

    InputSelector.prototype.createEmptyContainer = function (message) {
        var $emptyContainer = $('<div class="brtc-style-controls-inputselector-content-empty"></div>');
        $emptyContainer.text(message);

        return $emptyContainer;
    };

    InputSelector.prototype.createEmptyItem = function () {
        var $emptyItem = $('' +
            '<div class="brtc-style-flex-center brtc-va-editors-sheet-controls-empty-fnunit">' +
            '   <div class="brtc-style-controls-inputselector-empty-fnunit">' +
            '       <div>Drop Data</div>' +
            '   </div>' +
            '</div>');

        return $emptyItem;
    };

    InputSelector.prototype.getPreviousFnUnits = function () {
        var fnUnits = [];

        var model = this.options.fnUnit.parent();
        var prevFids = model.getPrevious(this.options.fnUnit.fid);

        _.forEach(prevFids, function (fid) {
            fnUnits.push(model.getFnUnitById(fid));
        });
        return fnUnits;
    };

    InputSelector.prototype.destroyDragEvent = function ($item) {
        $item.on('dragstop', function (event, ui) {
            if ($item.hasClass('ui-draggable') && ui.helper.attr('table-id') !== event.target.getAttribute('table-id')) {
                $item.draggable('destroy');
            }
        });
    };

    InputSelector.prototype.onChange = function (e, inputs) {
        if (typeof this.options.onChange === 'function') {
            this.options.onChange(inputs);
        }
    };

    InputSelector.prototype.onError = function (e, message) {
        if (typeof this.options.onError === 'function') {
            this.options.onError(message);
        }
    };

    Brightics.VA.Core.Editors.Sheet.Controls.InputSelector = InputSelector;


}).call(this);
