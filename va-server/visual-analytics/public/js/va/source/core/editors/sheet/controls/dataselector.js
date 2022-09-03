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

    function DataSelector(parentId, options) {
        this.parentId = parentId;
        this.options = options;

        this.inTargetList = $.extend(true, [], FnUnitUtils.getInTable(this.options.fnUnit));
        this.linkedTargetList = this.getAllTableList(this.options.fnUnit);
        this.command = new Brightics.VA.Core.CompoundCommand(this, {});
        this.retrieveParent();
        this.createControls();
        this.initContents();
    }

    DataSelector.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    DataSelector.prototype.createInputUnit = function (unitOptions) {
        var key = unitOptions.key;
        var tableId = unitOptions.tableId;
        var type = unitOptions.type;
        var fnUnit = unitOptions.fnUnit;
        var prevFnUnit = this.getPrevFnUnitByInTableId(fnUnit, tableId);
        var readOnly = unitOptions.readOnly;
    
        var $box = this.createBox(key);
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
        var $removeItem = this.createRemoveButton();
    
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
    };
    
    DataSelector.prototype.createSingleTypeItem = function (fnUnit) {
        var clazz = fnUnit.parent().type,
            $item = $('<div class="brtc-va-editors-sheet-controls-dataselector-item single"></div>'),
            $selectedItem = Brightics.VA.Core.Utils.WidgetUtils.createPaletteItem($item, fnUnit.func, clazz),
            outTable = FnUnitUtils.getOutTable(fnUnit)[0];

        if (!outTable) return;

        $selectedItem.find('.brtc-va-views-palette-fnunit-label').text(fnUnit.display.label);
        $selectedItem.find('.brtc-va-views-palette-fnunit-label').attr('title', fnUnit.display.label);
        $item.attr('value', outTable);
        $item.attr('fid', fnUnit['fid']);
        $selectedItem.addClass('item');

        if (this.inTargetList.indexOf(outTable) >= 0) {
            this.usedDataMap = this.usedDataMap || {};
            this.usedDataMap[outTable] = $.extend(true, {}, $item);
        }
        else {
            this.notUsedDataMap = this.notUsedDataMap || {};
            this.notUsedDataMap[outTable] = $.extend(true, {}, $item);
        }
    };

    DataSelector.prototype.createMultiTypeItem = function (fnUnit, inputTableList) {
        for (var i in FnUnitUtils.getOutTable(fnUnit)) {
            var clazz = fnUnit.parent().type,
                $item = $('<div class="brtc-va-editors-sheet-controls-dataselector-item single"></div>'),
                label = fnUnit.display.label + '-' + (parseInt(i) + 1),
                $selectedItem = Brightics.VA.Core.Utils.WidgetUtils.createPaletteItem($item, fnUnit.func, clazz);


            $selectedItem.find('.brtc-va-views-palette-fnunit-label').text(label);
            $selectedItem.attr('title', label);
            $item.attr('value', FnUnitUtils.getOutTable(fnUnit)[i]);
            $item.attr('fid', fnUnit['fid']);
            $selectedItem.addClass('item');

            if (inputTableList.indexOf(FnUnitUtils.getOutTable(fnUnit)[i]) < 0) {

                this.notUsedDataMap = this.notUsedDataMap || {};
                this.notUsedDataMap[FnUnitUtils.getOutTable(fnUnit)[i]] = $.extend(true, {}, $item);
            } else {
                this.usedDataMap = this.usedDataMap || {};
                this.usedDataMap[FnUnitUtils.getOutTable(fnUnit)[i]] = $.extend(true, {}, $item);
            }

        }
    };
    // DataSelector.prototype.getLinkedTableList = function () {
    //     var model = this.options.fnUnit.parent();
    //     var previousFnUnitList = model.getPrevious(this.options.fnUnit.fid);
    //     var linkedTableList = [];
    //     previousFnUnitList.forEach(function (fid) {
    //         var tableList = model.getFnUnitById(fid)[OUT_DATA];
    //         if (tableList) {
    //             linkedTableList = linkedTableList.concat(tableList)
    //         }
    //     });
    //     return linkedTableList;
    // };

    DataSelector.prototype.insertUsedDataContainer = function () {
        for (var i = 0; i < this.inTargetList.length; i++) {
            this.appendUsedDataItem(this.usedDataMap[this.inTargetList[i]]);
        }
    };

    DataSelector.prototype.appendUsedDataItem = function ($item, index) {
        var _this = this;
        var $itemWrapper = $('<div class="brtc-style-flex-center" style="padding-left: 10px"></div>');
        var $removeButton = $('<span class="brtc-style-editor-content-remove-button"></span>');
        $itemWrapper.append($item);
        $itemWrapper.append($removeButton);

        if (typeof index === 'undefined') {
            this.$selectedContents.append($itemWrapper);
        } else {
            $(this.$selectedContents.children()[index]).after($itemWrapper);
        }
        this.createDropEvent($item);

        $removeButton.click(function () {
            var $removeItem = $item.detach();
            _this.appendNotUsedDataItem($removeItem);
            $itemWrapper.remove();
            _this.setAddableDataContainer();
            _this.configureRowHeader();
            _this.onChangeInputTable();
        });
    };


    DataSelector.prototype.insertNotUsedDataContainer = function () {
        for (var dataKey in this.notUsedDataMap) {
            this.appendNotUsedDataItem(this.notUsedDataMap[dataKey]);
        }
    };

    DataSelector.prototype.appendNotUsedDataItem = function ($item) {
        this.$notUsedDataContainer = this.$notUsedDataContainer || this.getNotUsedDataContainer();
        this.$notUsedDataContainer.append($item);
        this.createNotUsedDataDragEvent($item);
        if ($item.hasClass('ui-droppable')) {
            $item.droppable('destroy');
        }

    };
    DataSelector.prototype.createNotUsedDataDragEvent = function ($item) {
        var _this = this;

        $item.draggable({
            helper: 'clone',
            // start: function () {
            //     var targetList = _this.$selectedContents.find('.brtc-va-editors-sheet-controls-dataselector-item');
            // },
            appendTo: _this.$dataContainer
        });
    };
    DataSelector.prototype.destroyDragEvent = function ($item) {
        $item.on('dragstop', function (event, ui) {
            if ($item.hasClass('ui-draggable') && ui.helper.attr('value') !== event.target.getAttribute('value')) {
                $item.draggable('destroy');
            }
        });
    };
    DataSelector.prototype.getDropFuncTarget = function ($item) {
        return $item.find('.brtc-va-views-palette-fnunit').length == !0 ? $item.find('.brtc-va-views-palette-fnunit') : $item;
    };


    DataSelector.prototype.createDropEvent = function ($item) {
        var _this = this;
        $item.droppable({
            accept: '.brtc-va-editors-sheet-controls-notused-dataselector-contents-wrapper .brtc-va-editors-sheet-controls-dataselector-item, ',
            activate: function (event, ui) {
                console.log(event, ui);
                var $dropTarget = _this.getDropFuncTarget($(this));
                $dropTarget.addClass('brtc-style-droppable-active');
            },
            deactivate: function (event, ui) {
                console.log(event, ui);
                var $dropTarget = _this.getDropFuncTarget($(this));
                $dropTarget.removeClass('brtc-style-droppable-active');
                $dropTarget.removeClass('brtc-style-droppable-hover');
            },
            over: function (event, ui) {
                console.log(event, ui);
                var $dropTarget = _this.getDropFuncTarget($(this));
                $dropTarget.addClass('brtc-style-droppable-hover');
            },
            out: function (event, ui) {
                console.log(event, ui);
                var $dropTarget = _this.getDropFuncTarget($(this));
                $dropTarget.removeClass('brtc-style-droppable-hover');
            },
            drop: function (event, ui) {
                var $dropTarget = _this.getDropFuncTarget($(this));
                $dropTarget.removeClass('brtc-style-droppable-active');
                $dropTarget.removeClass('brtc-style-droppable-hover');

                var tableId = $(this).attr('value');
                var $source = ui.draggable;
                if (tableId) {
                    _this.switchData($source, $(this));
                } else {
                    _this.appendUsedDataItem($source);
                    $source.closest('.brtc-va-editors-sheet-controls-notused-dataselector-contents-wrapper').remove();
                    _this.setAddableDataContainer();
                    _this.configureRowHeader();
                }
                _this.destroyDragEvent($source);

                _this.onChangeInputTable();
                _this.$selectedContents.find('.brtc-style-droppable-active').removeClass('brtc-style-droppable-active');
            }
        });
    };
    DataSelector.prototype.switchData = function ($source, $target) {
        var targetIndex = $target.parent().index();
        this.appendUsedDataItem($source, targetIndex);
        this.appendNotUsedDataItem($target);
        $(this.$selectedContents.children()[targetIndex]).remove();
    };


    DataSelector.prototype.getNotUsedDataContainer = function () {
        var $notUsedDataContainer = $('' +
            '<div class="brtc-va-editors-sheet-controls-notused-dataselector-contents brtc-style-controls-notused-dataselector-contents brtc-style-display-flex brtc-style-flex-direction-column">' +
            '   <div>Connected Table</div>' +
            '</div>');
        var $contentsWrapper = $('<div class="brtc-va-editors-sheet-controls-notused-dataselector-contents-wrapper brtc-style-full brtc-style-relative"></div>');
        this.$dataContainer.append($notUsedDataContainer);
        $notUsedDataContainer.append($contentsWrapper);

        return $contentsWrapper;
    };


    DataSelector.prototype.createRowHeaderContents = function () {
        var $parent = this.$dataContainer.find('.brtc-va-editors-sheet-controls-dataselector-contents-wrapper');
        var headerList = [];
        if (this.options.rowHeaderType === 'number') {
            $.each(this.getUsedDataList(), function (index, com) {
                headerList.push(index + 1);
            });
        } else if (this.options.rowHeaderType === 'custom') {
            headerList = this.options.rowHeaderList;
        }

        if (headerList.length === 0) return;

        var rowHeaderWidth = this.options.rowHeaderWidth || 20;

        this.$rowHeaderContentsArea = $('<div class="brtc-style-dataselecter-rowheader-container"></div>');
        $parent.prepend(this.$rowHeaderContentsArea);
        this.$rowHeaderContentsArea.width(rowHeaderWidth);
        for (var i = 0; i < headerList.length; i++) {
            this.$rowHeaderContentsArea.append($('<div class="brtc-style-height-45px brtc-style-flex-center">' + headerList[i] + '</div>'));
        }
    };

    DataSelector.prototype.configureRowHeader = function () {
        if (this.$rowHeaderContentsArea) {
            this.$rowHeaderContentsArea.remove();
        }
        this.createRowHeaderContents();
    };

    DataSelector.prototype.createContents = function ($parent) {
        var allTableList = this.linkedTargetList;
        var inputTableList = FnUnitUtils.getInTable(this.options.fnUnit);

        this.$selectedContentsContainer = $('<div class="brtc-style-col-12" />');
        this.$selectedContents = $('<div class="brtc-style-col-12" />');

        $parent.append(this.$selectedContentsContainer);
        this.$selectedContentsContainer.append(this.$selectedContents);

        var fnUnits = this.getAllPrevFnUnits(this.options.fnUnit);


        for (var i in allTableList) {
            var fnUnit = _.find(fnUnits, function (fn) {
                return _.indexOf(FnUnitUtils.getOutTable(fn), allTableList[i]) >= 0;
            });

            if (fnUnit && FnUnitUtils.getOutTable(fnUnit).length > 1) {
                this.createMultiTypeItem(fnUnit, inputTableList);
            }
            else if (fnUnit) this.createSingleTypeItem(fnUnit);
        }

        this.insertUsedDataContainer();
        if (this.notUsedDataMap) {
            this.insertNotUsedDataContainer();
        }

        this.setAddableDataContainer();
    };


    DataSelector.prototype.createDataContainer = function ($parent) {
        var _this = this;
        this.$dataContainer = $('' +
            '<div class="brtc-va-editors-sheet-controls-dataselector-container brtc-style-editors-sheet-controls-dataselector-container">' +
            '   <div class="brtc-va-editors-sheet-controls-dataselector-contents brtc-style-display-flex brtc-style-flex-1 brtc-style-flex-direction-column">' +
            '       <div>Selected Table</div>' +
            '       <div class="brtc-va-editors-sheet-controls-dataselector-contents-wrapper brtc-style-full brtc-style-display-flex brtc-style-relative"></div>' +
            '   </div>' +
            '</div>');
        $parent.append(this.$dataContainer);

        this.createContents(this.$dataContainer.find('.brtc-va-editors-sheet-controls-dataselector-contents-wrapper'));

        this.$selectedContents.sortable({
            axis: 'y',
            cancel: '.empty'
        });
        this.$selectedContents.on('sortstop', function () {
            _this.inTargetList = _this.$selectedContents.sortable('toArray', {attribute: 'value'});
            _this.onChangeInputTable();
        });

        this.createRowHeaderContents();

        this.$dataContainer.find('.brtc-va-editors-sheet-controls-dataselector-contents-wrapper').perfectScrollbar();
        this.$dataContainer.find('.brtc-va-editors-sheet-controls-notused-dataselector-contents-wrapper').perfectScrollbar();

    };


    DataSelector.prototype.createControls = function () {
        var _this = this;

        this.$mainControl = $('<div class="brtc-va-editors-sheet-controls-dataselector-editarea">' +
            // '   <div class="brtc-style-dialogs-header brtc-style-slim-header" />' +
            '   <div class="brtc-style-controls-dataselector-content"/>' +
            '</div>');
        this.$parent.append(this.$mainControl);

        // var jqxOptions = {
        //     theme: Brightics.VA.Env.Theme,
        //     position: {
        //         my: "right top",
        //         at: "left top",
        //         of: this.$parent.find('.brtc-va-editors-sheet-controls-dataselector-contents')
        //     },
        //     width: this.options.width,
        //     height: this.options.height,
        //     title: 'Select Table',
        //     modal: false,
        //     showAnimationDuration: 50,
        //     minHeight: 250,
        //     open: function () {
        //         $('.ui-dialog-titlebar.ui-widget-header', $(this).parent()).css({
        //             'width': 'calc(100% - 40px) !important',
        //             'padding-left': '0px !important',
        //             'padding-right': '0px !important',
        //             'margin-left': '20px !important'
        //         });
        //     }
        // };
        // if (!this.options.multiple) {
        //     jqxOptions.height -= 33;
        // }
        // this.$mainControl.dialog(jqxOptions);
        // this.$mainControl.css({
        //     'width': '-webkit-fill-available',
        //     'min-height': '50px',
        //     'max-height': '600px',
        //     'min-width': '100px',
        //     'max-width': '800px'
        // });
        // this.$mainControl.parent().find('.ui-resizable-handle:not(.ui-resizable-s)').hide();

        // this.closeHandler = function (event) {
        //     var $target = $(event.target);

        //     if ($target.attr('class')) {
        //         if ($target.attr('class').indexOf('ui-dialog') > -1) return;
        //     }

        //     if (_this.$mainControl.has(event.target).length === 0) {
        //         _this.$mainControl.dialog('close');
        //     }
        // };
        // _this.$mainControl.on('close', function (event) {
        //     $(window).off('mousedown', this.closeHandler);
        //     _this.$mainControl.dialog('destroy');
        // });

        // _this.$mainControl.parent().on('mousedown', function (event) {
        //     event.stopPropagation();
        // });

        // $(window).on('mousedown', _this.closeHandler);
    };

    DataSelector.prototype.initContents = function () {
        var $contentControl = this.$mainControl.find('.brtc-style-controls-dataselector-content');
        this.createDataContainer($contentControl);
    };

    DataSelector.prototype.onChangeInputTable = function () {
        var _this = this;
        if (typeof _this.options.onChangedHandler === 'function') {
            _this.options.onChangedHandler(_this.getUsedDataList(), this.options.type);
        }
    };

    DataSelector.prototype.getFunctionDef = function (fnUnit) {
        return Brightics.VA.Core.Interface.Functions['data'][fnUnit.func];
    };

    DataSelector.prototype.setAddableDataContainer = function () {
        var selectedDataList = this.getUsedDataList();
        // var funcDefinition = Brightics.VA.Core.Interface.Functions[model.type][this.options.fnUnit.func];
        // var inRange = funcDefinition['in-range'];
        var inRange = FnUnitUtils.getInRange(this.options.fnUnit).table;

        if (selectedDataList.length < inRange.max &&
            this.$selectedContentsContainer.find('.brtc-va-editors-sheet-controls-empty-fnunit').length === 0) {
            var $emptyItemContainer = $('' +
                '<div class="brtc-style-flex-center brtc-va-editors-sheet-controls-empty-fnunit">' +
                '   <div class="brtc-style-controls-dataselector-empty-fnunit">' +
                '       <div>Drop Data</div>' +
                '   </div>' +
                '</div>');
            this.$selectedContentsContainer.append($emptyItemContainer);
            this.createDropEvent($emptyItemContainer.find('.brtc-style-controls-dataselector-empty-fnunit'));
        } else if (selectedDataList.length >= inRange.max &&
            this.$selectedContentsContainer.find('.brtc-va-editors-sheet-controls-empty-fnunit').length === 1) {
            this.$selectedContentsContainer.find('.brtc-va-editors-sheet-controls-empty-fnunit').remove();
        }
    };

    DataSelector.prototype.getUsedDataList = function () {
        var itemList = this.$selectedContents.find('.brtc-va-editors-sheet-controls-dataselector-item');
        var dataList = [];
        for (var i = 0; i < itemList.length; i++) {
            dataList.push($(itemList[i]).attr('value'));
        }
        return dataList;
    };

    DataSelector.prototype.getAllPrevFnUnits = function (fnUnit) {
        var model = fnUnit.parent();
        var fnUnits = model.getAllPreviousFnUnits(fnUnit.fid);
        return fnUnits;
    };

    DataSelector.prototype.getAllTableList = function (fnUnit) {
        return _.flatten(this.getAllPrevFnUnits(fnUnit)
            .filter(function (fn) {
                return !Brightics.VA.Core.Utils.NestedFlowUtils.isProcessFunction(fn);
            })
            .map(function (fn) {
                return FnUnitUtils.getOutTable(fn) || [];
            }));
    };


    Brightics.VA.Core.Editors.Sheet.Controls.DataSelector = DataSelector;


}).call(this);
