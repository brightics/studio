/**
 * Created by ng1123.kim on 2016-03-23.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    const COLUMN_ALIAS_SELECTOR = '.brtc-va-refine-selectcolumn-column-alias';
    const COLUMN_ITEM_SELECTOR = '.brtc-va-refine-selectcolumn-column-item';

    function VirtualColumnSelector(parentId, options) {
        this.parentId = parentId;
        this.options = this.setOptions(options);
        this.problemFactory = new Brightics.VA.Core.Validator.ProblemFactory();

        this.retrieveParent();
        this.createColumnItems();
        this.createControls();
        return this;
    };

    VirtualColumnSelector.prototype._getCurrentColumn = function (column) {
        return this.columnItems.find(x => x._index === column._index);
    };

    VirtualColumnSelector.prototype._resetCurrentColumn = function (column) {
        var item = this._getCurrentColumn(column);
        item.alias = item._alias;
        item.type = item._type;
    };

    VirtualColumnSelector.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };


    VirtualColumnSelector.prototype.setOptions = function (options) {
        var defaultOption = {};
        return $.extend(true, defaultOption, options)

    };

    VirtualColumnSelector.prototype._createHeaderControls = function () {
        let _this = this;
        let $parent = this.$parent;

        //헤더 체크박스
        this.$headerCheckBox = $parent.find('.brtc-va-refine-selectcolumn-header-check');
        this.$headerCheckBox.jqxCheckBox({
            theme: Brightics.VA.Env.Theme,
            width: 19,
            height: 19,
            checked: true
        });

        this.$headerCheckBox.on('change', function (event) {
            if (!_this.skipEvent) {
                _this.setCheckConditionAllItems(event.args.checked);
                _this.virtualRender();
                _this.checkValidation();
            }
            _this.skipEvent = false;
        });
    };

    VirtualColumnSelector.prototype.createColumnItems = function () {
        var checkSelected = this.options.selectedColumns instanceof Array && this.options.selectedColumns.length > 0;
        var selectedItems = checkSelected ? this.options.selectedColumns.map((y, j) => $.extend(true, { _selectedIndex: j }, y)) : null;
        this.columnItems = this.options.columns.map((x, i) => {
            var selected = selectedItems ? selectedItems.find(y => y.name === x.name) : null;
            x._index = i;
            x._type = this.convertInternalTypeToSql(x.internalType);
            x._alias = x.name;
            x.checked = checkSelected ? !!selected : true;
            x.type = selected ? selected.type : x._type;
            x.alias = selected ? selected.alias : x._alias;
            x._selectedIndex = selected ? selected._selectedIndex : Number.MAX_SAFE_INTEGER;
            return x;
        });
        this.columnItems.sort((a, b) => {
            if (a.checked && !b.checked) {
                return -1;
            } else if (!a.checked && b.checked) {
                return 1;
            } else {
                if (a._selectedIndex > b._selectedIndex) {
                    return 1;
                } else if (a._selectedIndex < b._selectedIndex) {
                    return -1;
                }
            }
            return 0;
        });
        this.filteredColumnItems = this.columnItems;
    };
    
    VirtualColumnSelector.prototype.getInternalTypeMap = function (internalType) {
        const defaultInternalTypeMap = {
            'String': 'string',
            'Integer': 'int',
            'Double': 'double',
            'Long': 'bigint',
            'Boolean': 'boolean'
        };

        let internalTypeMap = this.options.internalTypeMap || defaultInternalTypeMap;
        return internalTypeMap;
    };

    VirtualColumnSelector.prototype.convertInternalTypeToSql = function (internalType) {
        let internalTypeMap = this.getInternalTypeMap();
        return internalTypeMap[internalType];
    };
    
    VirtualColumnSelector.prototype.createItemShell = function (column, $item) {
        let _this = this;

        $item.append($('<div><div class="brtc-va-refine-selectcolumn-column-check"></div></div>'));
        $item.append($('<div class="brtc-va-refine-selectcolumn-column-sort"><i class="fa fa-bars"></i></div>'));
        $item.append($('<input type="text" class="brtc-va-refine-selectcolumn-column-name brtc-style-flex-1" readonly="readonly"/>'));
        $item.append($('<input type="text" class="brtc-va-refine-selectcolumn-column-alias" valid-type="type1"/>'));
        $item.append($('<div class="brtc-va-refine-selectcolumn-column-type"></div>'));
        $item.append($('<div class="brtc-va-refine-selectcolumn-column-reset-wrapper"><div class="brtc-va-refine-selectcolumn-column-reset"></div></div>'));

        $item.find('.brtc-va-refine-selectcolumn-column-check').jqxCheckBox({
            theme: Brightics.VA.Env.Theme,
            animationShowDelay: 0,
            animationHideDelay: 0,
            width: 19,
            height: 19,
            checked: column.checked
        });

        $item.find('.brtc-va-refine-selectcolumn-column-name').jqxInput({
            theme: Brightics.VA.Env.Theme,
            // width: '172px',
            height: '27px',
            disabled: true
        });

        $item.find(COLUMN_ALIAS_SELECTOR).jqxInput({
            theme: Brightics.VA.Env.Theme,
            width: '182px',
            height: '27px'
        });
        let internalTypeMap = this.getInternalTypeMap();

        let optionString = `
            <option class="brtc-style-selectbox-option" value="${internalTypeMap['String']}">String</option>
            <option class="brtc-style-selectbox-option" value="${internalTypeMap['Integer']}">Integer</option>
            <option class="brtc-style-selectbox-option" value="${internalTypeMap['Double']}">Double</option>
            <option class="brtc-style-selectbox-option" value="${internalTypeMap['Long']}">Long</option>
            <option class="brtc-style-selectbox-option" value="${internalTypeMap['Boolean']}">Boolean</option>`

        if (column.type.indexOf('[]') > 0) {
            optionString = `
                <option class="brtc-style-selectbox-option" value="${internalTypeMap['String[]']}">String[]</option>
                <option class="brtc-style-selectbox-option" value="${internalTypeMap['Int[]']}">Int[]</option>
                <option class="brtc-style-selectbox-option" value="${internalTypeMap['Long[]']}">Long[]</option>
                <option class="brtc-style-selectbox-option" value="${internalTypeMap['Double[]']}">Double[]</option>
                <option class="brtc-style-selectbox-option" value="${internalTypeMap['Boolean[]']}">Boolean[]</option>
            `
        }

        let $selectBox = $(`<select class="brtc-va-refine-selectbox brtc-style-selectbox" style="width: 90px; height: 28px;">${optionString}</select>`);
        $item.find('.brtc-va-refine-selectcolumn-column-type').append($selectBox);
        $selectBox.val(column.type);

        $item.find('.brtc-va-refine-selectcolumn-column-reset').on('click', function () {
            let currentColumn = _this._getCurrentColumn(column);
            if (currentColumn.checked) {
                _this._resetCurrentColumn(currentColumn);
                _this.virtualRender();
                _this.checkValidation();
            }
        });

        if (column.checked) {
            this.setColumnItemChecked($item);
        } else {
            this.setColumnItemUnchecked($item);
        }
    };

    VirtualColumnSelector.prototype.setColumnItemChecked = function ($item) {
        $item.removeClass('sort-disabled');
        $item.find('.brtc-va-refine-selectcolumn-column-sort').css({ 'opacity': '', 'cursor': 'pointer' });
        $item.find('.brtc-va-refine-selectcolumn-column-name').jqxInput({ disabled: true });
        $item.find(COLUMN_ALIAS_SELECTOR).jqxInput({ disabled: false });
        $item.find('.brtc-style-selectbox').attr('disabled', false);
        $item.find('.brtc-va-refine-selectcolumn-column-reset').css({ 'opacity': '', 'cursor': 'pointer' });
    };

    VirtualColumnSelector.prototype.setColumnItemUnchecked = function ($item) {
        $item.addClass('sort-disabled');
        $item.find('.brtc-va-refine-selectcolumn-column-sort').css({ 'opacity': '0.5', 'cursor': 'default' });
        $item.find('.brtc-va-refine-selectcolumn-column-name').jqxInput({ disabled: true });
        $item.find(COLUMN_ALIAS_SELECTOR).jqxInput({ disabled: true });
        $item.find('.brtc-style-selectbox').attr('disabled', true);
        $item.find('.brtc-va-refine-selectcolumn-column-reset').css({ 'opacity': '0.5', 'cursor': 'default' });
    };

    VirtualColumnSelector.prototype.createColumnItem = function ($item, column) {
        if (typeof column === 'undefined') return;
        this.createItemShell(column, $item);
        $item.find('.brtc-va-refine-selectcolumn-column-name').val(column.name);
        Brightics.VA.Core.Utils.InputValidator.appendValidationCondition($item.find('.brtc-va-refine-selectcolumn-column-name'));
        $item.find(COLUMN_ALIAS_SELECTOR).val(column.alias);
        Brightics.VA.Core.Utils.InputValidator.appendValidationCondition($item.find(COLUMN_ALIAS_SELECTOR));
        this.createColumnItemEvents(column, $item);
    };

    VirtualColumnSelector.prototype.createValidationContent = function ($parent, problemData, $control) {
        var $problemContent = $('<div class="brtc-va-refine-step-validation-tooltip">' +
            '<i class="fa fa-exclamation-triangle" aria-hidden="true"></i> ' + Brightics.VA.Core.Utils.WidgetUtils.convertHTMLSpecialChar(problemData.message) +
            '</div>');
        $parent.append($problemContent);
        if ($control) {
            $control.addClass('brtc-va-refine-step-validation-error');
        } else {
            $parent.addClass('brtc-va-refine-step-validation-error');
        }

        $problemContent.show();
    };

    VirtualColumnSelector.prototype.getProblemFromItem = function ($item) {
        return $item.data('problem');
    };

    VirtualColumnSelector.prototype.renderItemValidation = function ($item) {
        let problem = this.getProblemFromItem($item);
        if (typeof problem === 'undefined') return;
        let $control;
        if (problem.param === 'Name') {
            $control = $item.find('.brtc-va-refine-selectcolumn-column-name');
        } else if (problem.param === 'Alias') {
            $control = $item.find(COLUMN_ALIAS_SELECTOR);
        }
        this.createValidationContent($item, problem, $control);
        // validation 전체에 margin-left
        this.$mainControl.find('.brtc-va-refine-step-validation-tooltip').css({
            'width': '465px',
            'margin-left': '45px'
        });
    };

    VirtualColumnSelector.prototype.createColumnItemEvents = function (column, $item) {
        $item.find('.brtc-va-refine-selectcolumn-column-check').on('checked', () => {
            this.setColumnItemChecked($item);
            this._getCurrentColumn(column).checked = true;
            this.checkValidation();
        });

        $item.find('.brtc-va-refine-selectcolumn-column-check').on('unchecked', () => {
            this.setColumnItemUnchecked($item);
            this.isUncheckedAllItems();
            this._getCurrentColumn(column).checked = false;
            this.checkValidation();
        });

        $item.find(COLUMN_ALIAS_SELECTOR).on('change', (evt) => {
            let item = this._getCurrentColumn(column);
            if (item.alias !== evt.currentTarget.value) {
                item.alias = evt.currentTarget.value;
                this.checkValidation();
            }
        });

        $item.find('.brtc-va-refine-selectbox').on('change', (evt) => {
            this._getCurrentColumn(column).type = evt.currentTarget.value;
        });
    };

    VirtualColumnSelector.prototype.virtualRender = function () {
        var _this = this;
        let $parent = this.$contentsContainer;
        let $items = this.getFilteredColumnItems();

        let config = {
            itemHeight: 30,
            total: $items.length,
            generate(index) {
                let item = $items[index];

                let $item = $('<div class="brtc-va-refine-selectcolumn-column-item"></div>');
                $item.attr('data-index', item._index);

                _this.createColumnItem($item, item);
                _this.renderItemValidation($item, item);

                return $item[0];
            }
        };

        if ($items.find(x => !x.checked)) {
            this.skipEvent = true;
            this.$headerCheckBox.jqxCheckBox('val', false);
        } else {
            this.skipEvent = true;
            this.$headerCheckBox.jqxCheckBox('val', true);
        }

        if (!this.list) {
            this.$contentsContainer.css('position', 'relative');
            this.list = HyperList.create($parent[0], config);
        } else {
            this.list.refresh($parent[0], config);
        }
    };

    VirtualColumnSelector.prototype.isUncheckedAllItems = function () {
        if (!this.columnItems.find(x => x.checked)) this.$okButton.jqxButton({ disabled: true });
    };

    VirtualColumnSelector.prototype.setCheckConditionAllItems = function (checked) {
        this.getFilteredColumnItems().forEach(x => x.checked = checked);
    };

    VirtualColumnSelector.prototype.createSortableEvent = function () {
        let _this = this;
        this.$contentsContainer.sortable({
            axis: 'y',
            helper: function (event, ui) {
                var $clone = $(ui).clone();
                let currentColumn = _this.columnItems[$(ui).data('index')];
                $clone.find('select').val(currentColumn.type);
                return $clone.get(0);
            },
            items: COLUMN_ITEM_SELECTOR,
            cancel: '.brtc-va-refine-selectcolumn-column-item.sort-disabled',
            handle: '.brtc-va-refine-selectcolumn-column-sort',
            update: function (event, ui) {
                _this.checkValidation();
            },
            stop: function (event, ui) {
                var _index = ui.item.data('index');
                var originalIndex = _this.columnItems.findIndex(x => x._index === _index);
                var nextItem = $('.brtc-va-refine-selectcolumn-contents').find('.brtc-va-refine-selectcolumn-column-item.vrow[data-index='+_index+']').next();
                var _toIndex, targetIndex;
                if (nextItem.length > 0) {
                    _toIndex = nextItem.data('index');
                    targetIndex = _this.columnItems.findIndex(x => x._index === _toIndex) - 1;
                } else {
                    targetIndex = _this.columnItems.length - 1;
                }
                _this.columnItems.splice(targetIndex, 0, _this.columnItems.splice(originalIndex, 1)[0]);
                _this.virtualRender();
            }
        });
        this.$contentsContainer.sortable('refreshPositions');
        this.$contentsContainer.disableSelection();
    };

    VirtualColumnSelector.prototype.removeValidation = function () {
        this.$mainControl.find('.brtc-va-refine-selectcolumn-column-alias').removeClass('brtc-va-refine-selectcolumn-column-problem-item');
        this.problems = [];
    };

    VirtualColumnSelector.prototype.checkValidation = function () {
        var _this = this;
        this.removeValidation();

        var aliasNames = [];
        var checkedFlag = false;
        this.columnItems.forEach(currentColumn => {
            if (currentColumn.checked) {
                checkedFlag = true;
                var alias = currentColumn.alias;
                if (alias === '') {
                    let problem = _this.createProblem({
                        errorCode: 'BR-0033',
                        paramIndex: currentColumn._index,
                        param: 'Alias',
                        messageParam: ['Alias']
                    });
                    let element = this.$contentsContainer.find(COLUMN_ITEM_SELECTOR+`[data-index=${currentColumn._index}]`);
                    if (element) _this.addProblemToItem($(element), problem);
                    _this.addProblem(problem);
                } else {
                    if ($.inArray(alias, aliasNames) > -1) {
                        var messageParam = 'Alias - \'' + alias + '\' already exist.';
                        let problem = _this.createProblem({
                            errorCode: 'BR-0100',
                            paramIndex: currentColumn._index,
                            param: 'Alias',
                            messageParam: [messageParam]
                        });
                        let element = this.$contentsContainer.find(COLUMN_ITEM_SELECTOR+`[data-index=${currentColumn._index}]`);
                        if (element) _this.addProblemToItem($(element), problem);
                        _this.addProblem(problem);
                    } else {
                        aliasNames.push(alias);
                    }
                }
            }
        });

        if (!checkedFlag) {
            this.addProblem(_this.createProblem({
                errorCode: 'BR-0001',
                paramIndex: -1,
                param: 'Column',
                messageParam: ['Column']
            }));
        }

        this.onValidate();
    };

    VirtualColumnSelector.prototype.onValidate = function () {
        if (typeof this.options.onValidate === 'function') {
            let isValid = true;
            if (this.problems && this.problems.length > 0) {
                isValid = false;
            }
            this.options.onValidate(isValid);
        }
    };

    VirtualColumnSelector.prototype.addProblem = function (problem) {
        this.problems.push(problem);
    };

    VirtualColumnSelector.prototype.createProblem = function (checkResult, fid) {
        var _this = this;
        return {
            param: checkResult.param,
            paramIndex: checkResult.paramIndex,
            code: checkResult.errorCode,
            message: _this.problemFactory.makeMessage(checkResult)
        };
    };

    VirtualColumnSelector.prototype._createHeaderEvents = function () {
        let _this = this;
        let $parent = this.$parent;

        var $nameFilterButton = $parent.find('.brtc-va-refine-selectcolumn-column-name-filter-button');
        var $nameResetButton = $parent.find('.brtc-va-refine-selectcolumn-column-name-reset-wrapper .brtc-va-refine-selectcolumn-column-reset');
        var $aliasSettingButton = $parent.find('.brtc-va-refine-selectcolumn-column-alias-setting-button');
        var $aliasResetButton = $parent.find('.brtc-va-refine-selectcolumn-column-alias-reset-wrapper .brtc-va-refine-selectcolumn-column-reset');
        var $typeResetButton = $parent.find('.brtc-va-refine-selectcolumn-column-type-reset-wrapper .brtc-va-refine-selectcolumn-column-reset');
        var $sortResetButton = $parent.find('.brtc-va-refine-selectcolumn-header-column-sort .brtc-va-refine-selectcolumn-column-reset');

        $sortResetButton.click(function () {
            _this.columnItems.sort((a, b) => a._index - b._index);
            _this.virtualRender();
        });

        $nameFilterButton.click(function () {
            $parent.find('.brtc-va-refine-selectcolumn-name-helper').toggleClass('setting-active');
            $(this).toggleClass('setting-active');
            if ($parent.find('.brtc-va-refine-selectcolumn-name-helper').hasClass('setting-active')) {
                _this.$contentsContainerWrapper.height(270);
            } else {
                _this.$contentsContainerWrapper.height(320);
            }

            if ($aliasSettingButton.hasClass('setting-active')) {
                $aliasSettingButton.toggleClass('setting-active');
                $parent.find('.brtc-va-refine-selectcolumn-alias-helper').toggleClass('setting-active');
            }
        });

        $nameResetButton.click(function () {
            $('.brtc-va-refine-selectcolumn-name-helper .brtc-va-refine-selectcolumn-column-find-name-input').val('');
            $('.brtc-va-refine-selectcolumn-name-helper .brtc-va-refine-selectcolumn-column-find-name-input').trigger('change');
        });

        $aliasSettingButton.click(function () {
            $parent.find('.brtc-va-refine-selectcolumn-alias-helper').toggleClass('setting-active');
            $(this).toggleClass('setting-active');
            if (_this.$contentsContainerWrapper.height() > 170) {
                _this.$contentsContainerWrapper.height(170);
            } else {
                _this.$contentsContainerWrapper.height(320);
            }

            if ($nameFilterButton.hasClass('setting-active')) {
                $nameFilterButton.toggleClass('setting-active');
                $parent.find('.brtc-va-refine-selectcolumn-name-helper').toggleClass('setting-active');
            }
        });

        $aliasResetButton.click(function () {
            _this.columnItems.forEach(x => {
                if (x.checked) {
                    x.alias = x._alias;
                }
            });
            _this.virtualRender();
            _this.checkValidation();
        });

        $typeResetButton.click(function () {
            _this.columnItems.forEach(x => {
                if (x.checked) {
                    x.type = x._type;
                }
            });
            _this.virtualRender();
        });
    };

    VirtualColumnSelector.prototype.createControls = function () {

        let $parent = this.$parent;
        $parent.addClass('brtc-va-dataflow-refine-select-column-dialog');

        this.createNameHelper($parent);
        this.createAliasHelper($parent);

        this.$mainControl = $('<div>' +
            '   <div class="brtc-va-refine-selectcolumn-header">' +
            '      <div style="padding-top:5px;"><div class="brtc-va-refine-selectcolumn-header-check"></div></div>' +
            '      <div class="brtc-va-refine-selectcolumn-header-column-sort" style="cursor:pointer;"><div class="brtc-va-refine-selectcolumn-column-reset" style="margin-left: 2px;margin-right:unset;"></div></div>' +
            '      <div class="brtc-va-refine-selectcolumn-header-name">Name</div>' +
            '      <div class="brtc-va-refine-selectcolumn-column-name-setting-wrapper"><div class="brtc-va-refine-selectcolumn-column-name-filter-button"></div></div>' +
            '      <div class="brtc-va-refine-selectcolumn-column-name-reset-wrapper"><div class="brtc-va-refine-selectcolumn-column-reset"></div></div>' +
            '      <div class="brtc-va-refine-selectcolumn-header-alias">New Name</div>' +
            '      <div class="brtc-va-refine-selectcolumn-column-alias-setting-wrapper"><div class="brtc-va-refine-selectcolumn-column-alias-setting-button"></div></div>' +
            '      <div class="brtc-va-refine-selectcolumn-column-alias-reset-wrapper"><div class="brtc-va-refine-selectcolumn-column-reset"></div></div>' +
            '      <div class="brtc-va-refine-selectcolumn-header-type">Type</div>' +
            '      <div class="brtc-va-refine-selectcolumn-column-type-reset-wrapper"><div class="brtc-va-refine-selectcolumn-column-reset"></div></div>' +
            '   </div>' +
            '   <div class="brtc-va-refine-selectcolumn-contents-warpper" style="height: 320px; position:relative;">' +
            '       <div class="brtc-va-refine-selectcolumn-contents"></div>' +
            '   </div>' +
            '</div>');

        $parent.append(this.$mainControl);
        this.$contentsContainerWrapper = $parent.find('.brtc-va-refine-selectcolumn-contents-warpper');
        this.$contentsContainer = $parent.find('.brtc-va-refine-selectcolumn-contents');

        this._createHeaderControls();
        this.virtualRender();
        this.createSortableEvent();

        this._createHeaderEvents();
        this.checkValidation();
    };

    VirtualColumnSelector.prototype.addProblemToItem = function ($row, problem) {
        var $item = $row.find('.brtc-va-refine-selectcolumn-column-alias');
        if (problem) {
            $item.addClass('brtc-va-refine-selectcolumn-column-problem-item');
            $item.attr('title', problem.message);
            $item.data('problem', problem);
        } else {
            $item.removeClass('brtc-va-refine-selectcolumn-column-problem-item');
            $item.removeData('problem');
            $item.removeAttr('title');
        }
    };

    VirtualColumnSelector.prototype.createNameHelper = function ($parent) {
        var _this = this;
        var $nameHelper = $('' +
            '<div class="brtc-va-refine-selectcolumn-name-helper">' +
            '   <div class="brtc-va-refine-selectcolumn-name-helper-title">Name Filter</div>' +
            '   <div class="brtc-va-refine-selectcolumn-find-input-button-container">' +
            '       <input class="brtc-va-refine-selectcolumn-column-find-name-input" type="text" placeholder="Search name" valid-type="type1"/>' +
            '   </div>' +
            '</div>');

        $parent.append($nameHelper);

        var $findInput = $nameHelper.find('.brtc-va-refine-selectcolumn-column-find-name-input');
        $findInput.jqxInput({ theme: Brightics.VA.Env.Theme });

        $findInput.change(function () {
            _this.filterValue = $('.brtc-va-refine-selectcolumn-name-helper .brtc-va-refine-selectcolumn-column-find-name-input').val();

            _this.virtualRender();
        });
    };

    VirtualColumnSelector.prototype.getFilteredColumnItems = function() {
        return this.columnItems.filter(x => !this.filterValue || x.name.indexOf(this.filterValue) >= 0);
    };

    VirtualColumnSelector.prototype.createAliasHelper = function ($parent) {
        var _this = this;
        var $aliasHelper = $('' +
            '<div class="brtc-va-refine-selectcolumn-alias-helper">' +
            '   <div class="brtc-va-refine-selectcolumn-alias-helper-title">Alias Setting</div>' +
            '   <div class="brtc-va-refine-selectcolumn-upper-lower-button-container">' +
            '       <button class="brtc-va-refine-selectcolumn-column-uppercase-button">UPPERCASE</button>' +
            '       <button class="brtc-va-refine-selectcolumn-column-lowercase-button">lowercase</button>' +
            '       <button class="brtc-va-refine-selectcolumn-column-firstuppercase-button">Uppercase first letter</button>' +
            '   </div>' +
            '   <div class="brtc-va-refine-selectcolumn-fix-input-button-container">' +
            '       <input class="brtc-va-refine-selectcolumn-column-fix-input" type="text" placeholder="Pre, Suffix" valid-type="type1"/>' +
            '       <button class="brtc-va-refine-selectcolumn-column-prefix-button">Prefix</button>' +
            '       <button class="brtc-va-refine-selectcolumn-column-suffix-button">Suffix</button>' +
            '       <button class="brtc-va-refine-selectcolumn-column-prefix-index-button">Pre. Index</button>' +
            '       <button class="brtc-va-refine-selectcolumn-column-suffix-index-button">Suf. Index</button><br>' +
            '   </div>' +
            '   <div class="brtc-va-refine-selectcolumn-find-replace-button-container">' +
            '       <input class="brtc-va-refine-selectcolumn-column-find-input" type="text" placeholder="Find" valid-type="type1"/>' +
            '       <input class="brtc-va-refine-selectcolumn-column-replace-input" type="text" placeholder="Replace" valid-type="type1"/>' +
            '       <button class="brtc-va-refine-selectcolumn-column-replace-button">Replace</button>' +
            '   </div>' +
            '</div>');

        $parent.append($aliasHelper);

        var $fixInput = $aliasHelper.find('.brtc-va-refine-selectcolumn-column-fix-input');
        var $findInput = $aliasHelper.find('.brtc-va-refine-selectcolumn-column-find-input');
        var $replaceInput = $aliasHelper.find('.brtc-va-refine-selectcolumn-column-replace-input');
        $fixInput.jqxInput({ theme: Brightics.VA.Env.Theme });
        $findInput.jqxInput({ theme: Brightics.VA.Env.Theme });
        $replaceInput.jqxInput({ theme: Brightics.VA.Env.Theme });
        Brightics.VA.Core.Utils.InputValidator.appendValidationCondition($fixInput);
        Brightics.VA.Core.Utils.InputValidator.appendValidationCondition($findInput);
        Brightics.VA.Core.Utils.InputValidator.appendValidationCondition($replaceInput);

        var $uppercaseButton = $aliasHelper.find('.brtc-va-refine-selectcolumn-column-uppercase-button');
        var $lowercaseButton = $aliasHelper.find('.brtc-va-refine-selectcolumn-column-lowercase-button');
        var $firstUppercaseButton = $aliasHelper.find('.brtc-va-refine-selectcolumn-column-firstuppercase-button');
        var $prefixButton = $aliasHelper.find('.brtc-va-refine-selectcolumn-column-prefix-button');
        var $suffixButton = $aliasHelper.find('.brtc-va-refine-selectcolumn-column-suffix-button');
        var $prefixIndexButton = $aliasHelper.find('.brtc-va-refine-selectcolumn-column-prefix-index-button');
        var $suffixIndexButton = $aliasHelper.find('.brtc-va-refine-selectcolumn-column-suffix-index-button');
        var $replaceButton = $aliasHelper.find('.brtc-va-refine-selectcolumn-column-replace-button');
        $uppercaseButton.jqxButton({ theme: Brightics.VA.Env.Theme });
        $lowercaseButton.jqxButton({ theme: Brightics.VA.Env.Theme });
        $firstUppercaseButton.jqxButton({ theme: Brightics.VA.Env.Theme });
        $prefixButton.jqxButton({ theme: Brightics.VA.Env.Theme });
        $suffixButton.jqxButton({ theme: Brightics.VA.Env.Theme });
        $prefixIndexButton.jqxButton({ theme: Brightics.VA.Env.Theme });
        $suffixIndexButton.jqxButton({ theme: Brightics.VA.Env.Theme });
        $replaceButton.jqxButton({ theme: Brightics.VA.Env.Theme });

        $uppercaseButton.click(function () {
            _this.columnItems.forEach(x => {
                if (x.checked) {
                    x.alias = x.alias.toUpperCase();
                }
            });
            _this.virtualRender();
            _this.checkValidation();
        });

        $lowercaseButton.click(function () {
            _this.columnItems.forEach(x => {
                if (x.checked) {
                    x.alias = x.alias.toLowerCase();
                }
            });
            _this.virtualRender();
            _this.checkValidation();
        });

        $firstUppercaseButton.click(function () {
            _this.columnItems.forEach(x => {
                if (x.checked) {
                    let aliasValue = x.alias;
                    x.alias = aliasValue.charAt(0).toUpperCase() + aliasValue.slice(1);
                }
            });
            _this.virtualRender();
            _this.checkValidation();
        });

        $prefixButton.click(function () {
            var prefix = $('.brtc-va-refine-selectcolumn-column-fix-input').val();
            _this.columnItems.forEach(x => {
                if (x.checked) {
                    x.alias = prefix + x.alias;
                }
            });
            _this.virtualRender();
            _this.checkValidation();
        });

        $suffixButton.click(function () {
            var suffix = $('.brtc-va-refine-selectcolumn-column-fix-input').val();
            _this.columnItems.forEach(x => {
                if (x.checked) {
                    x.alias = x.alias + suffix;
                }
            });
            _this.virtualRender();
            _this.checkValidation();
        });

        $prefixIndexButton.click(function () {
            var count = 1;
            _this.columnItems.forEach(x => {
                if (x.checked) {
                    x.alias = (count++) + x.alias;
                }
            });
            _this.virtualRender();
            _this.checkValidation();
        });

        $suffixIndexButton.click(function () {
            var count = 1;
            _this.columnItems.forEach(x => {
                if (x.checked) {
                    x.alias = x.alias + (count++);
                }
            });
            _this.virtualRender();
            _this.checkValidation();
        });

        $replaceButton.click(function () {
            var findValue = $('.brtc-va-refine-selectcolumn-column-find-input').val();
            var replaceValue = $('.brtc-va-refine-selectcolumn-column-replace-input').val();
            _this.columnItems.forEach(x => {
                if (x.checked) {
                    x.alias = x.alias.split(findValue).join('' + replaceValue);
                }
            });
            _this.virtualRender();
            _this.checkValidation();
        });
    };

    VirtualColumnSelector.prototype.getCheckedColumns = function () {
        return this.columnItems.filter(x => x.checked);
    };

    Brightics.VA.Core.Widget.Controls.VirtualColumnSelectorControl = VirtualColumnSelector;

}).call(this);