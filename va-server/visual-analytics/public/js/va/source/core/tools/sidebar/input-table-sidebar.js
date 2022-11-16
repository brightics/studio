/* -----------------------------------------------------
 *  input-table-sidebar.js
 *  Created by hyunseok.oh@samsung.com on 2018-03-22.
 * ---------------------------------------------------- */

/* global _, crel, IN_DATA, OUT_DATA */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var KeyItems = brtc_require('KeyItems');

    var ADD_RETURN_TABLE_OP = 'Add Input Data';
    var CHANGE_RETURN_TABLE_OP = 'Change Input Data';
    var REMOVE_RETURN_TABLE_OP = 'Remove Input Data';

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
            'brtc-style-margin-bottom-10',
            'brtc-style-padding-right-30'
        ].join(' '),
        selectedTableWrapper: [
            'brtc-va-tools-sidebar-selected-table',
            'brtc-va-editors-sheet-controls-dataselector-contents',
            'brtc-style-display-flex',
            'brtc-style-flex-direction-column'
        ].join(' '),
        selectedTableDataContainer: [
            'brtc-va-editors-sheet-controls-dataselector-contents-wrapper',
            'brtc-va-editors-sheet-controls-dataselector-item-container',
            'brtc-style-relative'
        ].join(' '),
        notSelectedItemContainer: [
            'brtc-va-editors-sheet-controls-dataselector-contents-wrapper',
            'brtc-va-editors-sheet-controls-dataselector-item-container',
            'brtc-style-relative'
        ].join(' '),
        emptyContainer: [
            'brtc-va-editors-sheet-controls-dataselector-empty-wrapper',
            'brtc-style-height-60px',
            'brtc-style-padding-right-20'
        ].join(' '),
        emptyContents: 'brtc-va-editors-sheet-controls-dataselector-empty-contents',
        inTableListWrapper: [
            'brtc-va-tools-sidebar-out-table-list-wrapper',
            'brtc-va-editors-sheet-controls-dataselector-contents-wrapper'
        ].join(' '),
        inTableListItemWrapper: 'brtc-va-tools-sidebbar-out-table-list-item-wrapper',
        dataSelectorItem: [
            'brtc-va-editors-sheet-controls-dataselector-item',
            'brtc-style-flex-start',
            'brtc-style-padding-left-20'
        ].join(' '),
        refresh: ['bcharts-ds-refresh-button', 'brtc-style-float-right'].join(' ')
    };

    function InputTableSideBar(parentId, options) {
        Brightics.VA.Core.Tools.SideBar.call(this, parentId, options);
    }

    InputTableSideBar.prototype = Object.create(Brightics.VA.Core.Tools.SideBar.prototype);
    InputTableSideBar.prototype.constructor = InputTableSideBar;

    InputTableSideBar.prototype.createContent = function () {
        var _this = this;

        var outerClassName = [
            className.toolsSideBar,
            className.styleSideBar,
            className.sSideBar,
            'brtc-style-display-flex',
            'brtc-style-flex-direction-column'
        ].join(' ');

        var itemContainer = crel('div', {class: className.selectedTableDataContainer});

        var notSelectedItemContainer = crel('div', {class: className.notSelectedItemContainer});

        this.$itemContainerAndAddableWrapper = $(
            crel('div',  {class: 'brtc-style-relative brtc-style-padding-right-20'}, itemContainer)
        );

        var selectedTableWrapper = crel('div', {class: className.selectedTableWrapper},
            crel('div', {class: className.header}, Brightics.locale.common.selectedData),
            this.$itemContainerAndAddableWrapper[0]
        );

        var inTableListWrapper = crel('div', {class: className.inTableListWrapper},
            crel('div', {class: className.header}, Brightics.locale.common.inDataList),
            notSelectedItemContainer
        );
        this.$inTableListWrapper = $(inTableListWrapper);

        this.$modelSideBar = $(
            crel('div', {class: outerClassName},
                selectedTableWrapper,
                inTableListWrapper
            )
        );

        this.$parent.find('.brtc-va-studio-sidebar-area').append(this.$modelSideBar);
        this.$itemContainer = $(itemContainer);

        this.$notSelectedItemContainer = $(notSelectedItemContainer);
        this.$inTableContainer = $(inTableListWrapper);
        this.$itemContainer.on('sortstop', function (evt, ui) {
            var tableList = _this.getSelectedTableIds();
            _this.changeSelectedTableOrder(tableList);
        });

        this.$itemContainer.sortable({
            axis: 'y',
            cancel: '.empty',
            helper: 'clone',
            appendTo: this.$modelSideBar
        });

        this.$itemContainerAndAddableWrapper.append(this.createAddableArea());
        this.$itemContainerAndAddableWrapper.perfectScrollbar();
        this.refresh();
    };

    InputTableSideBar.prototype.onActivated = function () {
        this.refresh();
    };

    InputTableSideBar.prototype.onFnUnitSelect = function (fnUnit) {
    };

    InputTableSideBar.prototype.initPreferenceTarget = function () {
    };

    InputTableSideBar.prototype.destroy = function () {
    };

    InputTableSideBar.prototype.getFnUnitByTableId = function (tableId) {
        var _this = this;

        var mainModel = this.getEditor().getModel();
        var rec = function (model) {
            var fns = model.functions;
            for (var i = 0; i < fns.length; i++) {
                var fn = fns[i];
                if (_.indexOf(_this.FnUnitUtils.getOutData(fn), tableId) > -1) return fn;
                var subModels = Brightics.VA.Core.Utils.NestedFlowUtils.getSubModels(mainModel, fn);
                for (var j = 0; j < subModels.length; j++) {
                    var subModel = subModels[j];
                    var x = rec(subModel);
                    if (x) {
                        return x;
                    }
                }
            }
            return undefined;
        };
        return rec(mainModel);
    };

    InputTableSideBar.prototype.getModelByTableId = function (tableId) {
        var mainModel = this.getEditor().getModel();
        var rec = function (model) {
            var fns = model.functions;
            for (var i = 0; i < fns.length; i++) {
                var fn = fns[i];
                if (_.indexOf(fn[OUT_DATA], tableId) > -1) return fn;
                var subModels = Brightics.VA.Core.Utils.NestedFlowUtils.getSubModels(mainModel, fn);
                for (var j = 0; j < subModels.length; j++) {
                    var subModel = subModels[j];
                    var x = rec(subModel);
                    if (x) {
                        return x;
                    }
                }
            }
            return undefined;
        };
        return rec(mainModel);
    };

    InputTableSideBar.prototype.getActiveModel = function () {
        return this.getEditor().getActiveModel();
    };

    // activeFnUnit -> 프로퍼티 패널에 뜨고 있는 fnUnit
    InputTableSideBar.prototype.getActiveFnUnit = function () {
        return this.getEditor().getActiveFnUnitOnProp();
    };

    InputTableSideBar.prototype.onModelChange = function () {
        this.refresh();
    };

    InputTableSideBar.prototype.getModelInData = function () {
        return this.getActiveModel()[IN_DATA];
    };

    InputTableSideBar.prototype.createSelectedTableElements = function (tableIds) {
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

    InputTableSideBar.prototype.createNotSelectedTableElements = function (tableIds) {
        if (this.isNestedFlow()) return;

        var _this = this;
        var ret = [];
        _.forEach(tableIds, function (tableId) {
            var fnUnit = _this.getFnUnitByTableId(tableId);
            if (fnUnit) {
                ret.push(_this.createNotSelectedItem(fnUnit, tableId));
            }
        });

        if (ret.length === 0) ret.push(_this.createEmptyItem());
        return ret;
    };

    InputTableSideBar.prototype.createEmptyItem = function () {
        var $item = $(
            crel('div', {class: className.emptyContainer},
                crel('div', {class: className.emptyContents}, Brightics.locale.common.inputTableCreateEmptyItem)
            )
        );
        return $item;
    };


    InputTableSideBar.prototype.createSelectedItem = function (fnUnit, tableId) {
        var $item = this.isNestedFlow() ? this.createItemForNested(fnUnit, tableId) : this.createItem(fnUnit, tableId);
        return this.isNestedFlow() ? this.wrapSelectedItemForNested($item) : this.wrapSelectedItem($item);
    };

    InputTableSideBar.prototype.createNotSelectedItem = function (fnUnit, tableId) {
        var $item = this.createItem(fnUnit, tableId).css('cursor', 'move');
        return this.wrapNotSelectedItem($item);
    };

    InputTableSideBar.prototype.createKeyItem = function (options) {
        var fnUnit = options.fnUnit;
        var tableId = options.tableId;
        var type = options.type;

        var $item = $(crel('div', {class: className.dataSelectorItem}));
        var label = this.getTableItemLabel(fnUnit, tableId);

        var $keyItem = Brightics.VA.Core.Utils.WidgetUtils.createKeyItem({label: label, type:type});
        
        $item.append($keyItem);

        $item.attr('tid', tableId);
        $item.attr('fid', fnUnit.fid);
        // var index = fnUnit[OUT_DATA].indexOf(tableId);
        var index = this.FnUnitUtils.getOutData(fnUnit).indexOf(tableId);
        $item.attr('index', index);
        $keyItem.addClass('item');
        return $item;
    };

    InputTableSideBar.prototype.wrapSelectedItemForNested = function ($item) {
        var _this = this;
        var $itemWrapper = $(crel('div', {
            class: 'brtc-style-flex-center brtc-style-relative'
        }));

        $itemWrapper.append($item);

        this.attachDragEventListenerForNested($item.find('.brtc-va-studio-dm-draggable'));
        return $itemWrapper;
    };

    InputTableSideBar.prototype.wrapSelectedItem = function ($item) {
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

    InputTableSideBar.prototype.wrapNotSelectedItem = function ($item) {
        this.attachDragEventListener($item);
        var $itemWrapper = $(crel('div', {
            class: 'brtc-style-flex-center brtc-style-relative',
            style: 'padding-right: 20px'
        }));

        $itemWrapper.append($item);

        return $itemWrapper;
    };

    InputTableSideBar.prototype.attachDropEventListener = function ($item, mode) {
        var _this = this;
        $item.droppable({
            accept: '.brtc-style-controls-inputselector-box-wrapper.input-table',
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

    InputTableSideBar.prototype.replaceSelectedTable = function ($from, $to) {
        var fromTableId = $from.attr('tid');
        var toTableId = this.getDropFuncTarget($to).attr('tid');
        var toTableIndex = _.indexOf(this.getModelInData(), toTableId);

        var command = this.createModelInDataUpdateCommand(
            this.getTargetModel(),
            [IN_DATA, toTableIndex],
            fromTableId);

        command.add(this.createSetSkipPropertyByTid(fromTableId, true));
        command.add(this.createSetSkipPropertyByTid(toTableId, false));

        this.getEditor().getCommandManager().execute(command);
        this.refresh();
    };

    InputTableSideBar.prototype.refresh = function () {
        if (this.isNestedFlow()) {
            this.createNestedFlowInputDataControls();
            this.$modelSideBar.find('.brtc-va-editors-sheet-controls-empty-fnunit').hide();
            this.$inTableListWrapper.hide();
            this.$itemContainer.sortable('disable');
            this.$itemContainerAndAddableWrapper.perfectScrollbar();
            this.$itemContainerAndAddableWrapper.perfectScrollbar('update');
            this.$notSelectedItemContainer.perfectScrollbar();
            this.$notSelectedItemContainer.perfectScrollbar('update');
            this.$modelSideBar.addClass('inner-flow');
        } else {
            this.createModelInputDataControls();
            this.$modelSideBar.find('.brtc-va-editors-sheet-controls-empty-fnunit').show();
            this.$inTableListWrapper.show();
            this.$itemContainer.sortable('enable');
            this.$itemContainerAndAddableWrapper.perfectScrollbar();
            this.$itemContainerAndAddableWrapper.perfectScrollbar('update');
            this.$notSelectedItemContainer.perfectScrollbar();
            this.$notSelectedItemContainer.perfectScrollbar('update');
            this.$modelSideBar.removeClass('inner-flow');
        }
    };

    InputTableSideBar.prototype.createNestedFlowInputDataControls = function () {
        this.createTableLink(this.getModelInData());
    };

    InputTableSideBar.prototype.createModelInputDataControls = function () {
        this.$selectedItems = this.createSelectedTableElements(this.getModelInData());
        this.$notSelectedItems = this.createNotSelectedTableElements(this.getInFunctions());

        this.$itemContainer.empty();
        this.$notSelectedItemContainer.empty();

        this.$itemContainer.append(this.$selectedItems);
        this.$notSelectedItemContainer.append(this.$notSelectedItems);
    };

    InputTableSideBar.prototype.createTableLink = function (tableList) {
        var _this = this;

        var activeModel = _this.getActiveModel();
        var mainModel = activeModel.getMainModel();
        var parentModel = Brightics.VA.Core.Utils.NestedFlowUtils.getParentModel(mainModel, activeModel);

        var body = {links: []};

        for (var i in tableList) {
            body.links.push({
                source: '/' + Brightics.VA.Env.Session.userId + '/' + parentModel.mid + '/' + tableList[i],
                alias: '/' + Brightics.VA.Env.Session.userId + '/' + activeModel.mid + '/' + tableList[i]
            });
        }

        var opt = {
            url: 'api/va/v2/data/link/create',
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(body),
            blocking: true
        };

        console.log(body);

        $.ajax(opt).done(function (link) {
            _this.$selectedItems = _this.createSelectedTableElements(_this.getModelInData());
            _this.$itemContainer.empty();
            _this.$notSelectedItemContainer.empty();

            _this.$itemContainer.append(_this.$selectedItems);
        }).fail(function (error) {
            Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(error);
        });
    };

    InputTableSideBar.prototype.getTableItemLabel = function (fnUnit, tableId) {
        var outputs = this.FnUnitUtils.getOutputsToObject(fnUnit);
        return outputs[tableId];
    };

    InputTableSideBar.prototype.createItemForNested = function (fnUnit, tableId) {
        var clazz = 'data';
        var $item = $(crel('div', {class: className.dataSelectorItem}));
        var $paletteItem =
            Brightics.VA.Core.Utils.WidgetUtils.createPaletteItem($item, fnUnit.func, clazz);
        var $fnUnitLabel = $paletteItem.find('.brtc-va-views-palette-fnunit-label');
        // $fnUnitLabel.text(this.getTableItemLabel(fnUnit, tableId));
        $fnUnitLabel.text(this.FnUnitUtils.getLabel(fnUnit));
        $paletteItem.addClass('item');

        Brightics.VA.Core.Utils.WidgetUtils.putData($paletteItem, 'template', fnUnit);
        return $item;
    };

    InputTableSideBar.prototype.createItem = function (fnUnit, tableId) {
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

        $item.attr('tid',tableId);
        $item.addClass('input-table');

        return $item;
    };

    InputTableSideBar.prototype.getActiveModel = function () {
        return this.getEditor().getActiveModel();
    };

    InputTableSideBar.prototype.createModelInDataUpdateCommand = function (model, path, data) {
        var command = new Brightics.VA.Core.CompoundCommand(this, {
            label: CHANGE_RETURN_TABLE_OP
        });
        command.add(new Brightics.VA.Core.Editors.Diagram.Commands.UpdateOperationCommand(this, {
            target: model,
            path: path,
            value: data
        }));
        return command;
    };

    InputTableSideBar.prototype.createModelInDataAddCommand = function (model, path, data) {
        var command = new Brightics.VA.Core.CompoundCommand(this, {
            label: ADD_RETURN_TABLE_OP
        });

        // FIXME: 스펙 없어서 임시로 넣은 로직
        if (!model[IN_DATA]) {
            command.add(new Brightics.VA.Core.Editors.Diagram.Commands.AddOperationCommand(this, {
                target: model,
                path: [IN_DATA],
                value: []
            }));
        }

        command.add(new Brightics.VA.Core.Editors.Diagram.Commands.AddOperationCommand(this, {
            target: model,
            path: path,
            value: data
        }));

        return command;
    };

    InputTableSideBar.prototype.createModelInDataRemoveCommand = function (model, path) {
        var command = new Brightics.VA.Core.CompoundCommand(this, {
            label: REMOVE_RETURN_TABLE_OP
        });

        command.add(new Brightics.VA.Core.Editors.Diagram.Commands.RemoveOperationCommand(this, {
            target: model,
            path: path
        }));

        return command;
    };

    InputTableSideBar.prototype.createAddableArea = function () {
        if (!this.$addableArea) {
            var $el = $(
                crel('div', {class: 'brtc-style-flex-center brtc-va-editors-sheet-controls-empty-fnunit'},
                    crel('div', {class: 'brtc-style-controls-dataselector-empty-fnunit'},
                        crel('div', Brightics.locale.common.dropData)
                    )
                )
            );
            $el.addClass('empty');
            this.attachDropEventListener($el, 'add');
            this.$addableArea = $el;
        }
        return this.$addableArea;
    };

    InputTableSideBar.prototype.isAcceptable = function (fn) {
        return _.isEqual(this.FnUnitUtils.getCategory(fn), 'io') 
            && !this.FnUnitUtils.hasInput(fn)
            && this.FnUnitUtils.hasOutput(fn)
            && this.FnUnitUtils.hasTable(fn);
    };

    InputTableSideBar.prototype.getInFunctions = function () {
        var _this = this;

        var ret = [];
        var mainModel = this.getEditor().getModel();
        var model = this.getEditor().getActiveModel();
        var fns = _.filter(model.functions, function (fn) {
            return _this.isAcceptable(fn);
        });
        _.forEach(fns, function (fn) {
            var outData = _this.FnUnitUtils.getOutData(fn);
            ret.push(_.filter(outData, function (tableId) {
                return _.indexOf(mainModel[IN_DATA], tableId) === -1;
            }));
        });

        return _.flatten(ret);
    };

    InputTableSideBar.prototype.attachDragEventListenerForNested = function ($item) {
        var _this = this;
        $item.draggable({
            appendTo: 'body',
            scroll: false,
            cursor: 'move',
            cursorAt: {left: 5, top: 5},
            helper: function (event) {
                var $helper = $(this).clone();
                $helper.css({'z-index': 5100});

                var activeModel = _this.getActiveModel();
                var mainModel = activeModel.getMainModel();
                var parentModel = Brightics.VA.Core.Utils.NestedFlowUtils.getParentModel(mainModel, activeModel);

                var funcType = Brightics.VA.Core.Utils.WidgetUtils.getData($item, 'template');
                var fnUnit = Brightics.VA.Core.Utils.WidgetUtils.getFunctionLibrary('data', 'dataViewer').defaultFnUnit;
                fnUnit.display.label = funcType.display.label;
                fnUnit.outData = _this.FnUnitUtils.getOutTable(funcType);
                fnUnit.fid = Brightics.VA.Core.Utils.IDGenerator.func.id();
                fnUnit.display.diagram.position.x = 20;
                fnUnit.display.diagram.position.y = 10;

                fnUnit.param.mid = parentModel.mid;
                fnUnit.param.fid = funcType.fid;

                console.log(fnUnit);
                var template = {
                    functions: [fnUnit],
                    links: []
                };
                Brightics.VA.Core.Utils.WidgetUtils.putData($helper, 'template', $.extend(true, {}, template));
                Brightics.VA.Core.Utils.WidgetUtils.putData($helper, 'source', _this);
                return $helper;
            },
            start: function (event, ui) {
                $('.brtc-va-studio').addClass('brtc-va-studio-dragging');

                $(this).draggable('option', 'cursorAt', {
                    left: Math.floor(ui.helper.width() / 2),
                    top: Math.floor(ui.helper.height() / 2)
                });
            },
            drag: function (event, ui) {
                ui.helper.trigger('feedback', [{clientX: event.clientX, clientY: event.clientY}]);
            },
            stop: function (event, ui) {
                $('.brtc-va-studio').removeClass('brtc-va-studio-dragging');
            }
        });
    };

    InputTableSideBar.prototype.attachDragEventListener = function ($item) {
        $item.draggable({
            helper: function () {
                var $helper = $(this).clone();
                var width = $(this).width();
                $helper.css({
                    'z-index': 5100,
                    'width': width,
                    'height': '65px',
                    // 'line-height': '30px',
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

    InputTableSideBar.prototype.createSetSkipPropertyByTid = function (tid, value) {
        var fnUnit = this.getFnUnitByTableId(tid);
        if (!fnUnit) return;
        var command = new Brightics.VA.Core.Editors.Diagram.Commands.UpdateOperationCommand(this, {
            target: fnUnit,
            path: ['skip'],
            value: value
        });
        return command;
    };

    InputTableSideBar.prototype.addSelectedTable = function ($source) {
        var fromTableId = $source.attr('tid');
        var index = this.getModelInData().length;
        var command = this.createModelInDataAddCommand(
            this.getTargetModel(),
            [IN_DATA, index],
            fromTableId);
        command.add(this.createSetSkipPropertyByTid(fromTableId, true));
        this.getEditor().getCommandManager().execute(command);
    };

    InputTableSideBar.prototype.removeSelectedTable = function (tid, fid) {
        var index = _.indexOf(this.getModelInData(), tid);
        var command = this.createModelInDataRemoveCommand(this.getTargetModel(), [IN_DATA, index]);
        command.add(this.createSetSkipPropertyByTid(tid, false));
        this.getEditor().getCommandManager().execute(command);
    };

    InputTableSideBar.prototype.getTargetModel = function () {
        return this.getEditor().getModel();
    };

    InputTableSideBar.prototype.getSelectedTableIds = function () {
        return _.map(this.$itemContainer.children(), function (item) {
            var tid = $(item).find('.' + className.dataSelectorItem).attr('tid');
            return tid;
        });
    };

    InputTableSideBar.prototype.changeSelectedTableOrder = function (tableList) {
        var model = this.getTargetModel();
        var changed = tableList.length !== model[IN_DATA].length;
        if (!changed) {
            for (var i = 0; i < model[IN_DATA].length; i++) {
                if (tableList[i] !== model[IN_DATA][i]) {
                    changed = true;
                    break;
                }
            }
        }

        if (changed) {
            var command = this.createModelInDataUpdateCommand(model, [IN_DATA], tableList);
            this.getEditor().getCommandManager().execute(command);
        }
    };

    InputTableSideBar.prototype.getDropFuncTarget = function ($itemWrapper) {
        var ret = $itemWrapper.find('.' + className.dataSelectorItem);
        if (ret.length) return ret;
        return $itemWrapper;
    };

    InputTableSideBar.prototype.isNestedFlow = function () {
        var activeFnUnit = this.getEditor().getActiveFnUnit();
        return activeFnUnit &&
            (activeFnUnit.func === 'if' ||
            activeFnUnit.func === 'forLoop' ||
            activeFnUnit.func === 'whileLoop');
    };

    Brightics.VA.Core.Tools.SideBar.InputTableSideBar = InputTableSideBar;
    /* eslint-disable no-invalid-this */
}).call(this);
