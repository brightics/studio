/* -----------------------------------------------------
 *  return-table-sidebar.js
 *  Created by hyunseok.oh@samsung.com on 2018-03-13.
 * ---------------------------------------------------- */

/* global _, OUT_DATA, crel */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var KeyItems = brtc_require('KeyItems');

    var ADD_RETURN_TABLE_OP = 'Add Return Data';
    var CHANGE_RETURN_TABLE_OP = 'Change Return Data';
    var REMOVE_RETURN_TABLE_OP = 'Remove Return Data';

    var className = {
        sideBarArea: 'brtc-va-studio-sidebar-area',
        toolsSideBar: 'brtc-va-tools-sidebar',
        styleSideBar: 'brtc-style-sidebar',
        sSideBar: 'brtc-stype-s-sidebar',
        header: [
            'brtc-style-s-font-size-13',
            'brtc-style-s-font-weight-bold',
            'brtc-style-s-font-faminly-arial',
            'brtc-style-margin-top-10',
            'brtc-style-margin-bottom-10'
        ].join(' '),
        selectedTableWrapper: [
            'brtc-va-editors-sheet-controls-dataselector-contents',
            'brtc-style-display-flex',
            'brtc-style-flex-direction-column'
        ].join(' '),
        selectedTableDataContainer: [
            'brtc-va-editors-sheet-controls-dataselector-contents-wrapper',
            'brtc-style-relative'
        ].join(' '),
        notSelectedItemContainer: [
            'brtc-va-editors-sheet-controls-dataselector-contents-wrapper',
            'brtc-style-full',
            'brtc-style-relative'
        ].join(' '),
        emptyContainer: [
            'brtc-va-editors-sheet-controls-dataselector-empty-wrapper',
            'brtc-style-height-60px',
            'brtc-style-padding-right-20'
        ].join(' '),
        emptyContents: 'brtc-va-editors-sheet-controls-dataselector-empty-contents',
        outTableListWrapper: 'brtc-va-tools-sidebar-out-table-list-wrapper',
        outTableListItemWrapper: 'brtc-va-tools-sidebar-out-table-list-item-wrapper',
        dataSelectorItem: [
            'brtc-va-editors-sheet-controls-dataselector-item',
            'brtc-style-flex-start',
            'brtc-style-padding-right-20'
        ].join(' ')
    };

    function ReturnTableSideBar(parentId, options) {
        Brightics.VA.Core.Tools.SideBar.call(this, parentId, options);
    }

    ReturnTableSideBar.prototype = Object.create(Brightics.VA.Core.Tools.SideBar.prototype);
    ReturnTableSideBar.prototype.constructor = ReturnTableSideBar;

    ReturnTableSideBar.prototype.createContent = function () {
        var _this = this;

        var outerClassName = [
            className.toolsSideBar,
            className.styleSideBar,
            className.sSideBar,
            'brtc-style-display-flex',
            'brtc-style-flex-direction-column'
        ].join(' ');

        var itemContainer = crel('div', {class: className.selectedTableDataContainer});

        this.$selectedTableAndAddableWrapper = $(
            crel('div', {class: 'brtc-style-relative  brtc-style-padding-right-20'}, itemContainer)
        );

        var notSelectedItemContainer =
            crel('div', {class: className.notSelectedItemContainer});

        var selectedTableWrapper = crel('div',
            {class: className.selectedTableWrapper, style: 'height: 47%;'},
            crel('div', {class: className.header}, Brightics.locale.common.selectedData),
            this.$selectedTableAndAddableWrapper[0]
            // itemContainer
        );

        var outTableListWrapper = crel('div', {class: className.outTableListWrapper},
            crel('div', {class: className.header}, Brightics.locale.common.outDataList),
            notSelectedItemContainer
        );

        this.$modelSideBar = $(
            crel('div', {class: outerClassName},
                selectedTableWrapper,
                outTableListWrapper
            )
        );

        this.$parent.find('.brtc-va-studio-sidebar-area').append(this.$modelSideBar);
        this.$itemContainer = $(itemContainer);

        this.$notSelectedItemContainer = $(notSelectedItemContainer);
        this.$outTableContainer = $(outTableListWrapper);
        this.$itemContainer.on('sortstop', function (evt, ui) {
            var tableList = _this.getSelectedTableIds();
            _this.changeSelectedTableOrder(tableList);
        });

        this.$itemContainer.sortable({
            axis: 'y',
            cancel: '.empty'
        });

        this.$selectedTableAndAddableWrapper.append(this.createAddableArea());
        // $(selectedTableWrapper).append(this.createAddableArea());

        this.$notSelectedItemContainer = $(notSelectedItemContainer);
        this.scroll();
        this.refresh();
    };

    ReturnTableSideBar.prototype.scroll = function () {
        this.$notSelectedItemContainer.perfectScrollbar();
        this.$notSelectedItemContainer.perfectScrollbar('update');
        this.$selectedTableAndAddableWrapper.perfectScrollbar();
        this.$selectedTableAndAddableWrapper.perfectScrollbar('update');
    };

    // TODO: 데이터가 있다고 가정하고 만들어보자
    ReturnTableSideBar.prototype.onActivated = function () {
        // 데이터와 화면 동기화
        this.refresh();
        this.renderNotSelectedItems();
    };

    ReturnTableSideBar.prototype.onFnUnitSelect = function (fnUnit) {
        this.renderNotSelectedItems();
    };

    ReturnTableSideBar.prototype.initPreferenceTarget = function () {
        // this.preferenceTarget['scroll'] = this.tabControl.$tabContents.find('.brtc-va-views-palette-navigator-wrapper');
    };

    ReturnTableSideBar.prototype.destroy = function () {
        // this.dataFlowPalette.destroy();
        // this.libraryExplorer.destroy();
        // this.dataExplorer.destroy();
    };

    ReturnTableSideBar.prototype.attachDragEventListener = function ($item) {
        $item.draggable({
            helper: function () {
                var $helper = $(this).clone();
                var width = $(this).width();
                $helper.css({
                    'z-index': 5100,
                    'width': width,
                    'height': '65px',
                    'overflow': 'hidden',
                    'white-space': 'nowrap',
                    'text-overflow': 'ellipsis'
                });
                return $helper;
            },
            appendTo: 'body'
        });
        return $item;
    };

    ReturnTableSideBar.prototype.attachDropEventListener = function ($item, mode) {
        var _this = this;
        $item.droppable({
            accept: '.brtc-style-controls-inputselector-box-wrapper.return-table',
            activate: function (event, ui) {
                var $dropTarget = $(this).find('.brtc-style-controls-dataselector-empty-fnunit');
                $dropTarget.addClass('brtc-style-droppable-active');
            },
            deactivate: function (event, ui) {
                var $dropTarget = $(this).find('.brtc-style-controls-dataselector-empty-fnunit');
                $dropTarget.removeClass('brtc-style-droppable-active');
                $dropTarget.removeClass('brtc-style-droppable-hover');
            },
            over: function (event, ui) {
                var $dropTarget = $(this).find('.brtc-style-controls-dataselector-empty-fnunit');
                $dropTarget.addClass('brtc-style-droppable-hover');
            },
            out: function (event, ui) {
                var $dropTarget = $(this).find('.brtc-style-controls-dataselector-empty-fnunit');
                $dropTarget.removeClass('brtc-style-droppable-hover');
            },
            drop: function (event, ui) {
                var $dropTarget = $(this).find('.brtc-style-controls-dataselector-empty-fnunit');
                var $source = ui.draggable;
                $dropTarget.removeClass('brtc-style-droppable-active');
                $dropTarget.removeClass('brtc-style-droppable-hover');

                if (mode === 'replace') {
                    _this.replaceSelectedTable($source, $(this));
                } else if (mode === 'add') {
                    _this.addSelectedTable($source);
                }
            }
        });
    };

    ReturnTableSideBar.prototype.getDropFuncTarget = function ($itemWrapper) {
        // var ret = $itemWrapper.find('.' + className.dataSelectorItem);
        var ret = $itemWrapper.find('.brtc-style-controls-inputselector-box-wrapper');
        if (ret.length) return ret;
        return $itemWrapper;
    };

    ReturnTableSideBar.prototype.changeSelectedTableOrder = function (tableList) {
        var model = this.getActiveModel();
        var changed = tableList.length !== model[OUT_DATA].length;
        if (!changed) {
            for (var i = 0; i < model[OUT_DATA].length; i++) {
                if (tableList[i] !== model[OUT_DATA][i]) {
                    changed = true;
                    break;
                }
            }
        }

        if (changed) {
            var command = this.createModelOutDataUpdateCommand(model, [OUT_DATA], tableList);
            this.getEditor().getCommandManager().execute(command);
        }
    };

    ReturnTableSideBar.prototype.createModelOutDataUpdateCommand = function (model, path, data) {
        var command = new Brightics.VA.Core.Editors.Diagram.Commands.UpdateOperationCommand(this, {
            target: model,
            path: path,
            value: data,
            label: CHANGE_RETURN_TABLE_OP
        });

        return command;
    };

    ReturnTableSideBar.prototype.createModelOutDataAddCommand = function (model, path, data) {
        var command = new Brightics.VA.Core.CompoundCommand(this, {
            label: ADD_RETURN_TABLE_OP
        });

        // FIXME: 스펙 없어서 임시로 넣은 로직
        if (!model[OUT_DATA]) {
            command.add(new Brightics.VA.Core.Editors.Diagram.Commands.AddOperationCommand(this, {
                target: model,
                path: [OUT_DATA],
                value: []
            }));
        }

        command.add(new Brightics.VA.Core.Editors.Diagram.Commands.AddOperationCommand(this, {
            target: model,
            path: path,
            value: data
        }));

        if (this.isNestedFlow()) {
            var nextTableSize = Brightics.VA.Core.Utils.NestedFlowUtils.calcNextFnUnitOutTableSize(
                this.getEditor().getModel(),
                this.getEditor().getActiveFnUnit(),
                model.mid,
                1
            );
            command.add(this.createAdjustOutTableCommand(nextTableSize));
        }

        return command;
    };

    ReturnTableSideBar.prototype.createModelOutDataRemoveCommand = function (model, path) {
        var command = new Brightics.VA.Core.CompoundCommand(this, {
            label: REMOVE_RETURN_TABLE_OP
        });

        command.add(new Brightics.VA.Core.Editors.Diagram.Commands.RemoveOperationCommand(this, {
            target: model,
            path: path
        }));

        if (this.isNestedFlow()) {
            var nextTableSize = Brightics.VA.Core.Utils.NestedFlowUtils.calcNextFnUnitOutTableSize(
                this.getEditor().getModel(),
                this.getEditor().getActiveFnUnit(),
                model.mid,
                -1
            );
            command.add(this.createAdjustOutTableCommand(nextTableSize));
        }

        return command;
    };

    ReturnTableSideBar.prototype.addSelectedTable = function ($source) {
        var fromTableId = $source.attr('tid');
        var index = this.getModelOutData().length;
        var command = this.createModelOutDataAddCommand(
            this.getActiveModel(),
            [OUT_DATA, index],
            fromTableId);
        this.getEditor().getCommandManager().execute(command);
    };

    ReturnTableSideBar.prototype.removeSelectedTable = function (tid, fid) {
        var index = _.indexOf(this.getModelOutData(), tid);
        var command =
            this.createModelOutDataRemoveCommand(this.getActiveModel(), [OUT_DATA, index]);
        this.getEditor().getCommandManager().execute(command);
    };

    ReturnTableSideBar.prototype.replaceSelectedTable = function ($from, $to) {
        var activeModel = this.getActiveModel();
        var fromTableId = $from.attr('tid');

        var toTableIndex = _.indexOf(this.getModelOutData(), this.getDropFuncTarget($to).attr('tid'));
        var command = this.createModelOutDataUpdateCommand(
            activeModel,
            [OUT_DATA, toTableIndex],
            fromTableId);
        this.getEditor().getCommandManager().execute(command);
        this.renderNotSelectedItems();
    };

    ReturnTableSideBar.prototype.createItem = function (fnUnit, tableId) {
        var outputs = this.FnUnitUtils.getOutputsToObject(fnUnit);
        var type = this.FnUnitUtils.getTypeByTableId(fnUnit, tableId);
        var func = this.FnUnitUtils.getFunc(fnUnit);
        var label = this.FnUnitUtils.getLabel(fnUnit);

        var $item = KeyItems.create({
            key: outputs[tableId],
            tableId: tableId,
            type: type,
            func: func,
            label: label
        });

        $item.attr('tid', tableId);
        $item.addClass('return-table');

        return $item;
    };

    ReturnTableSideBar.prototype.createKeyItem = function (options) {
        var fnUnit = options.fnUnit;
        var tableId = options.tableId;
        var type = options.type;

        var $item = $(crel('div', {class: className.dataSelectorItem}));
        var label = this.getTableItemLabel(fnUnit, tableId);

        var $keyItem = Brightics.VA.Core.Utils.WidgetUtils.createKeyItem({label: label, type: type});

        $item.append($keyItem);

        $item.attr('tid', tableId);
        $item.attr('fid', fnUnit.fid);
        // var index = fnUnit[OUT_DATA].indexOf(tableId);
        var index = this.FnUnitUtils.getOutTable(fnUnit).indexOf(tableId);
        $item.attr('index', index);
        $keyItem.addClass('item');
        return $item;
    };

    ReturnTableSideBar.prototype.createEmptyItem = function () {
        var $item = $(
            crel('div', {class: className.emptyContainer},
                crel('div', {class: className.emptyContents}, Brightics.locale.common.returnTableCreateEmptyItem)
            )
        );
        return $item;
    };

    ReturnTableSideBar.prototype.getFnUnitByTableId = function (tableId) {
        var functions = this.getActiveModel().functions;
        for (var i = 0; i < functions.length; i++) {
            var fnUnit = functions[i];
            if (_.indexOf(this.FnUnitUtils.getOutTable(fnUnit), tableId) > -1) return fnUnit;
            // if (_.indexOf(fnUnit[OUT_DATA], tableId) > -1) return fnUnit;
        }
        return undefined;
    };

    ReturnTableSideBar.prototype.getTableItemLabel = function (fnUnit, tableId) {
        var outputs = this.FnUnitUtils.getOutputsToObject(fnUnit);
        return outputs[tableId];
    };

    ReturnTableSideBar.prototype.createSelectedTableElements = function (tableIds) {
        var _this = this;
        var ret = [];
        _.forEach(tableIds, function (tableId) {
            var fnUnit = _this.getFnUnitByTableId(tableId);
            if (fnUnit) {
                ret.push(_this.createSelectedItem(fnUnit, tableId));
            }
        });
        return ret;
    };

    ReturnTableSideBar.prototype.createSelectedItem = function (fnUnit, tableId) {
        var outputs = this.FnUnitUtils.getOutputsToObject(fnUnit);
        var type = this.FnUnitUtils.getTypeByTableId(fnUnit, tableId);
        var func = this.FnUnitUtils.getFunc(fnUnit);
        var label = this.FnUnitUtils.getLabel(fnUnit);

        var $item = KeyItems.create({
            key: outputs[tableId],
            tableId: tableId,
            type: type,
            func: func,
            label: label
        });

        $item.attr('tid', tableId);

        return this.wrapSelectedItem($item);
    };

    ReturnTableSideBar.prototype.createNotSelectedItem = function (fnUnit, tableId) {
        // var $item = this.createItem(fnUnit, tableId);
        // var $item = this.createKeyItem({
        //     fnUnit: fnUnit,
        //     tableId: tableId,
        //     type: this.FnUnitUtils.getTypeByTableId(fnUnit, tableId)
        // });
        var $item = this.createItem(fnUnit, tableId).css('cursor', 'move');
        return this.wrapNotSelectedItem($item);
    };

    ReturnTableSideBar.prototype.renderEmpty = function () {
        var $item = this.createEmptyItem();
        this.$notSelectedItemContainer.append($item);
    };

    ReturnTableSideBar.prototype.wrapSelectedItem = function ($item) {
        var _this = this;
        var $itemWrapper = $(crel('div', {
            class: 'brtc-style-flex-center brtc-style-relative'
        }));

        var $removeButton = $(crel('span', {
            class: 'brtc-style-editor-content-remove-button'
        }));

        var tid = $item.attr('tid');
        var fid = $item.attr('fid');

        $removeButton.click(function () {
            _this.removeSelectedTable(tid, fid);
            $itemWrapper.remove();
        });

        $itemWrapper.append($item);
        $itemWrapper.append($removeButton);

        this.attachDropEventListener($itemWrapper, 'replace');
        return $itemWrapper;
    };

    ReturnTableSideBar.prototype.wrapNotSelectedItem = function ($item) {
        this.attachDragEventListener($item);
        var $itemWrapper = $(crel('div', {
            class: 'brtc-style-flex-center brtc-style-relative',
            style: 'padding-right: 20px'
        }));

        $itemWrapper.append($item);

        return $itemWrapper;
    };

    ReturnTableSideBar.prototype.getActiveModel = function () {
        return this.getEditor().getActiveModel();
    };

    // activeFnUnit -> 프로퍼티 패널에 뜨고 있는 fnUnit
    ReturnTableSideBar.prototype.getActiveFnUnit = function () {
        return this.getEditor().getActiveFnUnitOnProp();
    };

    ReturnTableSideBar.prototype.renderNotSelectedItems = function () {
        var _this = this;
        var selectedTable = this.getModelOutData();
        var fnUnit = this.getActiveFnUnit();

        this.$notSelectedItemContainer.empty();

        if (fnUnit) {
            // var notSelectedTables = _.filter(fnUnit[OUT_DATA], function (tableId) {
            var notSelectedTables = _.filter(this.FnUnitUtils.getOutTable(fnUnit), function (tableId) {
                return _.indexOf(selectedTable, tableId) === -1;
            });

            _.forEach(notSelectedTables, function (tableId) {
                _this.$notSelectedItemContainer.append(
                    _this.createNotSelectedItem(fnUnit, tableId));
            });
        } else {
            this.renderEmpty();
        }
    };

    ReturnTableSideBar.prototype.getSelectedTableIds = function () {
        return _.map(this.$itemContainer.children(), function (item) {
            // var tid = $(item).find('.' + className.dataSelectorItem).attr('tid');
            var tid = $(item).find('.brtc-style-controls-inputselector-box-wrapper').attr('tid');
            return tid;
        });
    };

    ReturnTableSideBar.prototype.getModelOutData = function () {
        return this.getActiveModel()[OUT_DATA];
    };

    ReturnTableSideBar.prototype.createAddableArea = function () {
        var $el = $(
            crel('div', {class: 'brtc-style-flex-center brtc-va-editors-sheet-controls-empty-fnunit'},
                crel('div', {class: 'brtc-style-controls-dataselector-empty-fnunit'},
                    crel('div', Brightics.locale.common.dropData)
                )
            )
        );
        $el.addClass('empty');
        this.attachDropEventListener($el, 'add');
        return $el;
    };

    ReturnTableSideBar.prototype.onModelChange = function () {
        this.refresh();
        this.renderNotSelectedItems();
    };

    ReturnTableSideBar.prototype.refresh = function () {
        this.$selectedItems = this.createSelectedTableElements(this.getModelOutData());
        this.$itemContainer.empty();
        this.$itemContainer.append(this.$selectedItems);

        this.renderNotSelectedItems();
        this.scroll();
    };

    ReturnTableSideBar.prototype.createAdjustOutTableCommand = function (nextTableLength) {
        // 최대값 따라서 바꿔준다.
        return Brightics.VA.Core.Utils.NestedFlowUtils.createAdjustOutTableCommand(
            this,
            this.getEditor().getModel(),
            this.getEditor().getActiveFnUnit(),
            nextTableLength
        );
    };

    ReturnTableSideBar.prototype.isNestedFlow = function () {
        var activeFnUnit = this.getEditor().getActiveFnUnit();
        return activeFnUnit &&
            (activeFnUnit.func === 'if' ||
                activeFnUnit.func === 'forLoop' ||
                activeFnUnit.func === 'whileLoop');
    };

    Brightics.VA.Core.Tools.SideBar.ReturnTableSideBar = ReturnTableSideBar;
    /* eslint-disable no-invalid-this */
}).call(this);
