/**
 * Created by daewon77.park on 2016-08-20.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function SelectColumnDialog(parentId, options) {
        Brightics.VA.Core.Dialogs.RefineSteps.StepDialog.call(this, parentId, options);
    }

    SelectColumnDialog.prototype = Object.create(Brightics.VA.Core.Dialogs.RefineSteps.StepDialog.prototype);
    SelectColumnDialog.prototype.constructor = SelectColumnDialog;

    SelectColumnDialog.prototype.getTitle = function () {
        return 'Select Column';
    };

    SelectColumnDialog.prototype.createControls = function () {
        this.$mainControl = $('' +
            '<div class="brtc-va-dialogs-main">' +
            // '   <div class="brtc-va-dialogs-header">' +'<div class="brtc-va-refine-step-header-help" title="Help"></div></div>' +
            '   <div class="brtc-va-dialogs-body">' +
            '       <div class="brtc-va-dialogs-contents">' +
            '       </div>' +
            '       <div class="brtc-va-dialogs-buttonbar">' +
            '           <input type="button" class="brtc-va-dialogs-buttonbar-ok" value="OK" />' +
            '           <input type="button" class="brtc-va-dialogs-buttonbar-cancel" value="Cancel" />' +
            '       </div>' +
            '   </div>' +
            '</div>');

        this.$okButton = this.$mainControl.find('.brtc-va-dialogs-buttonbar-ok');
        this.$cancelButton = this.$mainControl.find('.brtc-va-dialogs-buttonbar-cancel');

        this.$mainControl.find('.brtc-va-refine-step-header-help').css('display', 'none');
        this.$mainControl.find('.brtc-va-refine-step-header-help').click(function () {
            var w = window.open('api/va/v2/help/function/sqlfunctionhelp', 'SQL Function Help');
            w.blur();
        });
    };


    SelectColumnDialog.prototype.createDialogContentsArea = function ($parent) {
        var _this = this;
        $parent.addClass('brtc-va-dataflow-refine-select-column-dialog');

        this.createAliasHelper($parent);

        $parent.append('' +
            '<div class="brtc-va-refine-selectcolumn-header">' +
            '   <div class="brtc-va-refine-selectcolumn-header-check"></div>' +
            '   <div class="brtc-va-refine-selectcolumn-header-column-sort"></div>' +
            '   <div class="brtc-va-refine-selectcolumn-header-name">Name</div>' +
            '   <div class="brtc-va-refine-selectcolumn-header-alias">New Name</div>' +
            '   <div class="brtc-va-refine-selectcolumn-column-alias-setting-wrapper"><div class="brtc-va-refine-selectcolumn-column-alias-setting-button"></div></div>' +
            '   <div class="brtc-va-refine-selectcolumn-column-alias-reset-wrapper"><div class="brtc-va-refine-selectcolumn-column-reset"></div></div>' +
            '   <div class="brtc-va-refine-selectcolumn-header-type">Type</div>' +
            '   <div class="brtc-va-refine-selectcolumn-column-type-reset-wrapper"><div class="brtc-va-refine-selectcolumn-column-reset"></div></div>' +
            //'   <div class="brtc-va-refine-selectcolumn-column-reset-all-wrapper"><div class="brtc-va-refine-selectcolumn-column-reset"></div></div>' +
            '</div>' +
            '<div class="brtc-va-refine-selectcolumn-contents"></div>');

        var jqxOpt = {
            theme: Brightics.VA.Env.Theme,
            title: this.getTitle(),
            width: 600,
            height: 500,
            maxWidth: 600,
            maxHeight: 500,
            modal: true,
            resizable: false,
            close: this.destroy.bind(this)
        };
        this.$mainControl.dialog(jqxOpt);

        //헤더 체크박스
        this.$headerCheckBox = $($parent.find('.brtc-va-refine-selectcolumn-header-check'));
        this.$headerCheckBox.jqxCheckBox({
            theme: Brightics.VA.Env.Theme,
            width: 23,
            height: 27,
            checked: true
        });

        this.$headerCheckBox.on('checked', function (event) {
            _this.checkAllItems('check');
            _this.$okButton.jqxButton({ disabled: false });
        });
        this.$headerCheckBox.on('unchecked', function (event) {
            _this.checkAllItems('uncheck');
            _this.$okButton.jqxButton({ disabled: true });
        });

        this.render();

        $parent.find('.brtc-va-refine-selectcolumn-contents').sortable({
            axis: 'y',
            //scrollSensitivitiy: 100,
            helper: function (event, ui) {
                var $clone = $(ui).clone();
                $clone.css('position', 'absolute');
                return $clone.get(0);
            },
            //containment: '.brtc-va-refine-selectcolumn-contents',
            items: '.brtc-va-refine-selectcolumn-column-item',
            cancel: '.brtc-va-refine-selectcolumn-column-item.sort-disabled',
            handle: '.brtc-va-refine-selectcolumn-column-sort',
            update: function (event, ui) {
                _this.checkValidation();
            }
        }, "refreshPositions");
        $parent.find('.brtc-va-refine-selectcolumn-contents').disableSelection();
        $parent.perfectScrollbar();
        $parent.perfectScrollbar('update');

        var $aliasSettingButton = $('.brtc-va-refine-selectcolumn-column-alias-setting-button');
        $aliasSettingButton.click(function () {
            $('.brtc-va-refine-selectcolumn-alias-helper').toggleClass('setting-active');
            $(this).toggleClass('setting-active');
        });

        var $aliasResetButton = $('.brtc-va-refine-selectcolumn-column-alias-reset-wrapper .brtc-va-refine-selectcolumn-column-reset');
        $aliasResetButton.click(function () {
            var $items = _this.$mainControl.find('.brtc-va-refine-selectcolumn-contents > .brtc-va-refine-selectcolumn-column-item');

            $items.each(function (index, element) {
                var checkBox = $(element).find('.brtc-va-refine-selectcolumn-column-check');
                if (checkBox.val()) {
                    var aliasInput = $(element).find('.brtc-va-refine-selectcolumn-column-alias');
                    aliasInput.val(aliasInput.data('default-alias'));
                }
            });
        });

        var $typeResetButton = $('.brtc-va-refine-selectcolumn-column-type-reset-wrapper .brtc-va-refine-selectcolumn-column-reset');
        $typeResetButton.click(function () {
            var $items = _this.$mainControl.find('.brtc-va-refine-selectcolumn-contents > .brtc-va-refine-selectcolumn-column-item');

            $items.each(function (index, element) {
                var checkBox = $(element).find('.brtc-va-refine-selectcolumn-column-check');
                if (checkBox.val()) {
                    var typeSelectBox = $(element).find('.brtc-va-refine-selectcolumn-column-type');
                    typeSelectBox.val(typeSelectBox.data('default-type'));
                }
            });
        });

        //var $allResetButton = $('.brtc-va-refine-selectcolumn-column-reset-all-wrapper .brtc-va-refine-selectcolumn-column-reset');
        //$allResetButton.click(function () {
        //    var $items = _this.$mainControl.find('.brtc-va-refine-selectcolumn-contents > .brtc-va-refine-selectcolumn-column-item');
        //
        //    $items.each(function (index, element) {
        //        var checkBox = $(element).find('.brtc-va-refine-selectcolumn-column-check');
        //        if (checkBox.val()) {
        //            var aliasInput = $(element).find('.brtc-va-refine-selectcolumn-column-alias');
        //            var typeSelectBox = $(element).find('.brtc-va-refine-selectcolumn-column-type');
        //
        //            aliasInput.val(aliasInput.data('default-alias'));
        //            typeSelectBox.val(typeSelectBox.data('default-type'));
        //        }
        //    });
        //});

        this.checkValidation();
    };

    SelectColumnDialog.prototype.checkAllItems = function (checkStatus) {
        var itemList = this.$mainControl.find('.brtc-va-refine-selectcolumn-column-item');

        for (var i = 0; i < itemList.length; i++) {
            var checkBox = $(itemList[i]).find('.brtc-va-refine-selectcolumn-column-check');
            $(checkBox).jqxCheckBox(checkStatus);
        }
    };

    SelectColumnDialog.prototype.isUncheckedAllItems = function () {
        var itemList = this.$mainControl.find('.brtc-va-refine-selectcolumn-column-item');
        for (var i = 0; i < itemList.length; i++) {
            var checkBox = $(itemList[i]).find('.brtc-va-refine-selectcolumn-column-check');
            if ($(checkBox).jqxCheckBox('checked')) return;
        }
        this.$okButton.jqxButton({ disabled: true });
    };

    SelectColumnDialog.prototype.render = function () {
        var _this = this;
        if (this.options.param) {
            var select = this.options.param.select;

            var res = select.replace(/, \n/gi, '\n').split("\n");
            if (res[res.length - 1] == '') {
                res.splice(res.length - 1, 1);
            }

            var selectedName = [];
            var selectedColumns = [];
            for (var i = 0; i < res.length; i++) {
                var splitData;// = res[i].replace('cast(', '').replace(') as ', ' ').replace(' as ', ' ').split(' ');
                var name, type, alias;

                if (res[i].startsWith('cast(')) {
                    splitData = res[i].replace(/`/gi, '').replace('cast(', '').replace(') as ', ' ').replace(' as ', ' ').split(' ');
                    name = splitData[0].replace(' ', '');
                    type = splitData[1].replace(' ', '');
                    alias = splitData[2].replace(' ', '');
                }
                else {
                    splitData = res[i].replace(/`/gi, '').replace(' as ', ' ').split(' ');
                    name = splitData[0].replace(' ', '');
                    type = '';
                    alias = splitData[1].replace(' ', '');
                }

                selectedName.push(name);
                selectedColumns.push({
                    name: name,
                    alias: alias,
                    type: type
                });
            }

            for (var j = 0; j < selectedColumns.length; j++) {
                let options = {
                    checked: true,
                    name: selectedColumns[j].name,
                    alias: selectedColumns[j].alias,
                    type: selectedColumns[j].type
                };
                this.createColumnItem(options);
            }

            let columns = this.options.columns;
            var unselectedColumns = [];
            for (var k = 0; k < columns.length; k++) {
                if ($.inArray(columns[k].name, selectedName) == -1) {
                    unselectedColumns.push(columns[k]);
                }
            }

            for (const unselectedColumn of unselectedColumns) {
                let options = {
                    checked: false,
                    name: unselectedColumn.name,
                    alias: unselectedColumn.name,
                    type: _this.convertInternalTypeToHiveGrammar(unselectedColumn.internalType)
                };
                this.createColumnItem(options);
            }
        } else {
            let columns = this.options.columns;
            for (var index in columns) {
                this.createColumnItem({
                    checked: true,
                    name: columns[index].name,
                    alias: columns[index].name,
                    type: _this.convertInternalTypeToHiveGrammar(columns[index].internalType)
                });
            }
        }
    };

    SelectColumnDialog.prototype.convertInternalTypeToHiveGrammar = function (internalType) {
        var result = '';
        switch (internalType) {
            case 'String':
                result = 'string';
                break;
            case 'Integer':
                result = 'int';
                break;
            case 'Double':
                result = 'double';
                break;
            case 'Long':
                result = 'bigint';
                break;
            case 'Boolean':
                result = 'boolean';
                break;
        }
        return result;
    };

    SelectColumnDialog.prototype.createColumnItem = function (column) {
        var _this = this;
        var $parent = this.$mainControl.find('.brtc-va-refine-selectcolumn-contents');
        var $item = $('' +
            '<div class="brtc-va-refine-selectcolumn-column-item">' +
            '   <div class="brtc-va-refine-selectcolumn-column-check"></div>' +
            '   <div class="brtc-va-refine-selectcolumn-column-sort"><i class="fa fa-bars"></i></div>' +
            '   <input type="text" class="brtc-va-refine-selectcolumn-column-name" readonly="readonly"/>' +
            '   <input type="text" class="brtc-va-refine-selectcolumn-column-alias" valid-type="type1"/>' +
            '   <div class="brtc-va-refine-selectcolumn-column-type"></div>' +
            '   <div class="brtc-va-refine-selectcolumn-column-reset-wrapper"><div class="brtc-va-refine-selectcolumn-column-reset"></div></div>' +
            '</div>');
        $parent.append($item);

        $item.find('.brtc-va-refine-selectcolumn-column-check').jqxCheckBox({
            theme: Brightics.VA.Env.Theme,
            width: 23,
            height: 27,
            checked: column.checked
        });

        $item.find('.brtc-va-refine-selectcolumn-column-check').on('checked', function () {
            $item.removeClass('sort-disabled');
            $item.find('.brtc-va-refine-selectcolumn-column-sort').css({ 'opacity': '', 'cursor': 'pointer' });
            $item.find('.brtc-va-refine-selectcolumn-column-name').jqxInput({ disabled: false });
            $item.find('.brtc-va-refine-selectcolumn-column-alias').jqxInput({ disabled: false });
            $item.find('.brtc-va-refine-selectcolumn-column-type').jqxDropDownList({ disabled: false });
            $item.find('.brtc-va-refine-selectcolumn-column-reset').css({ 'opacity': '', 'cursor': 'pointer' });
            _this.checkValidation();

            _this.$okButton.jqxButton({ 'disabled': false });
        });

        $item.find('.brtc-va-refine-selectcolumn-column-check').on('unchecked', function () {
            $item.addClass('sort-disabled');
            $item.find('.brtc-va-refine-selectcolumn-column-sort').css({ 'opacity': '0.5', 'cursor': 'default' });
            $item.find('.brtc-va-refine-selectcolumn-column-name').jqxInput({ disabled: true });
            $item.find('.brtc-va-refine-selectcolumn-column-alias').jqxInput({ disabled: true });
            $item.find('.brtc-va-refine-selectcolumn-column-type').jqxDropDownList({ disabled: true });
            $item.find('.brtc-va-refine-selectcolumn-column-reset').css({ 'opacity': '0.5', 'cursor': 'default' });

            _this.isUncheckedAllItems();

            _this.checkValidation();
        });

        $item.find('.brtc-va-refine-selectcolumn-column-name').val(column.name);
        $item.find('.brtc-va-refine-selectcolumn-column-name').jqxInput({
            theme: Brightics.VA.Env.Theme,
            width: '172px',
            height: '27px'
        });
        root.Brightics.VA.Core.Utils.InputValidator.appendValidationCondition($item.find('.brtc-va-refine-selectcolumn-column-name'));
        $item.find('.brtc-va-refine-selectcolumn-column-name').on('change', function () {
            _this.checkValidation();
        });

        $item.find('.brtc-va-refine-selectcolumn-column-alias').data('default-alias', column.alias);
        $item.find('.brtc-va-refine-selectcolumn-column-alias').val(column.alias);
        $item.find('.brtc-va-refine-selectcolumn-column-alias').jqxInput({
            theme: Brightics.VA.Env.Theme,
            width: '182px',
            height: '27px'
        });
        root.Brightics.VA.Core.Utils.InputValidator.appendValidationCondition($item.find('.brtc-va-refine-selectcolumn-column-alias'));
        $item.find('.brtc-va-refine-selectcolumn-column-alias').on('change', function () {
            _this.checkValidation();
        });

        var source = [{ display: 'String', value: 'string' }, { display: 'Integer', value: 'int' }, {
            display: 'Double',
            value: 'double'
        }, { display: 'Long', value: 'bigint' }, { display: 'Boolean', value: 'boolean' }];
        $item.find('.brtc-va-refine-selectcolumn-column-type').jqxDropDownList({
            theme: Brightics.VA.Env.Theme,
            source: source,
            width: 90,
            height: 25,
            animationType: 'none',
            openDelay: 0,
            displayMember: 'display',
            valueMember: 'value',
            autoDropDownHeight: true
        });

        // FIXME: 아래 두줄은 jQuery UI의 버그를 해결하기 위한 임시방편. 후에 jQuery UI를 업데이트하면 삭제해야함
        var itemId = $item.find('.brtc-va-refine-selectcolumn-column-type').attr('id');
        $('#listBox' + itemId).insertBefore($item.closest('.ui-dialog'));

        if (column.type) {
            $item.find('.brtc-va-refine-selectcolumn-column-type').data('default-type', column.type);
            $item.find('.brtc-va-refine-selectcolumn-column-type').val(column.type);
        }
        else {
            $item.find('.brtc-va-refine-selectcolumn-column-type').jqxDropDownList({ disabled: true });
        }

        $item.find('.brtc-va-refine-selectcolumn-column-reset').on('click', function () {
            if ($item.find('.brtc-va-refine-selectcolumn-column-check').val()) {
                $item.find('.brtc-va-refine-selectcolumn-column-type').val(column.type);
                $item.find('.brtc-va-refine-selectcolumn-column-alias').val(column.alias);
            }
        });

        if (column.checked) {
            $item.find('.brtc-va-refine-selectcolumn-column-sort').css({ 'opacity': '', 'cursor': 'pointer' });
            $item.find('.brtc-va-refine-selectcolumn-column-reset').css({ 'opacity': '', 'cursor': 'pointer' });
        }
        else {
            $item.addClass('sort-disabled');
            $item.find('.brtc-va-refine-selectcolumn-column-sort').css({ 'opacity': '0.5', 'cursor': 'default' });
            $item.find('.brtc-va-refine-selectcolumn-column-name').jqxInput({ disabled: true });
            $item.find('.brtc-va-refine-selectcolumn-column-alias').jqxInput({ disabled: true });
            $item.find('.brtc-va-refine-selectcolumn-column-type').jqxDropDownList({ disabled: true });
            $item.find('.brtc-va-refine-selectcolumn-column-reset').css({ 'opacity': '0.5', 'cursor': 'default' });
        }
    };

    SelectColumnDialog.prototype.createSelect = function () {
        var _this = this;
        var select = '';
        var $items = this.$mainControl.find('.brtc-va-refine-selectcolumn-contents > .brtc-va-refine-selectcolumn-column-item');

        var checkedItems = [];
        $items.each(function (index, element) {
            var checkBox = $(element).find('.brtc-va-refine-selectcolumn-column-check');
            if (checkBox.val()) {
                checkedItems.push(element);
            }
        });

        $(checkedItems).each(function (index, element) {
            var nameInput = $(element).find('.brtc-va-refine-selectcolumn-column-name');
            var aliasInput = $(element).find('.brtc-va-refine-selectcolumn-column-alias');
            var typeSelectBox = $(element).find('.brtc-va-refine-selectcolumn-column-type');

            if (typeSelectBox.val()) {
                select += 'cast(`' + nameInput.val() + '` as ' + typeSelectBox.val() + ')' + ' as `' + aliasInput.val() + '`';
            }
            else {
                select += '`' + nameInput.val() + '` as `' + aliasInput.val() + '`';
            }
            select += (index < checkedItems.length - 1) ? (', \n') : (' \n');
        });

        return select;
    };


    SelectColumnDialog.prototype.handleOkClicked = function () {
        if (this.problems.length > 0) {
            Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('There is a problem with some values.');
        } else {
            var select = this.createSelect();
            var additionalQuery = '';

            this.buildFunctionUnit('Select Column', 'selectColumn', select, additionalQuery);
            Brightics.VA.Core.Dialogs.RefineSteps.StepDialog.prototype.handleOkClicked.call(this);
        }
    };

    SelectColumnDialog.prototype.buildFunctionUnit = function (label, func, select, additionalQuery) {
        var fnUnit = this.DEFAULT_FN_UNIT;
        fnUnit.fid = this.options.fid ? this.options.fid : Brightics.VA.Core.Utils.IDGenerator.func.id();
        fnUnit.func = func;
        fnUnit.name = this.options.context === 'python' ? 'PythonScript' : 'SQLExecutor';
        fnUnit.inData = this.options.in;
        fnUnit.outData = this.options.out;
        fnUnit.param = {
            'select': select,
            'additional-query': additionalQuery
        };
        if (this.options.context === 'python') {
            fnUnit.param.script = this.buildScript(select, additionalQuery);
            fnUnit.param['out-table-alias'] = ['result'];
        }
        fnUnit.display = {
            'label': label
        };
        this.resultFnUnit = fnUnit;
    };

    SelectColumnDialog.prototype.buildScript = function (select, additionalQuery) {
        var script = this.DEFAULT_SCRIPT;
        var strSelect = select.replace(/\n/g, '');
        var strAdditionalQuery = additionalQuery.replace(/\n/g, '');
        script = script.replace('${SELECT_SQL}', strSelect);
        script = script.replace('${ADDITIONAL_QUERY}', strAdditionalQuery);
        return script;
    };

    SelectColumnDialog.prototype.renderValidation = function () {
        var _this = this;
        var $items = this.$mainControl.find('.brtc-va-refine-selectcolumn-contents > .brtc-va-refine-selectcolumn-column-item');

        $.each(this.problems, function (key, problem) {
            var $control;
            if (problem.param === 'Name') {
                $control = $($items[problem.paramIndex]).find('.brtc-va-refine-selectcolumn-column-name');
            } else if (problem.param === 'Alias') {
                $control = $($items[problem.paramIndex]).find('.brtc-va-refine-selectcolumn-column-alias');
            }
            _this.createValidationContent($($items[problem.paramIndex]), problem, $control);
            // validation 전체에 margin-left
            _this.$mainControl.find('.brtc-va-refine-step-validation-tooltip').css({
                'width': '465px',
                'margin-left': '45px'
            });
        });
    };

    SelectColumnDialog.prototype.checkValidation = function () {
        var _this = this;
        this.removeValidation();

        var $items = this.$mainControl.find('.brtc-va-refine-selectcolumn-contents > .brtc-va-refine-selectcolumn-column-item');
        var aliasNames = [];
        var checkedFlag = false;
        $items.each(function (index, element) {
            var checkBox = $(element).find('.brtc-va-refine-selectcolumn-column-check');
            if (checkBox.val()) {
                checkedFlag = true;
                var nameInput = $(element).find('.brtc-va-refine-selectcolumn-column-name');
                var name = nameInput.val();
                // _this.options.columns에 없는 column입니다.
                // if ($.inArray(name, columnNameArray) === -1) {
                //     _this.addProblem(_this.createProblem({
                //         errorCode: 'EX005',
                //         paramIndex: index,
                //         param: 'Name',
                //         messageParam: [name]
                //     }));
                // }
                if (name == '') {
                    _this.addProblem(_this.createProblem({
                        errorCode: 'BR-0033',
                        paramIndex: index,
                        param: 'Name',
                        messageParam: ['Name']
                    }));
                }

                var aliasInput = $(element).find('.brtc-va-refine-selectcolumn-column-alias');
                var alias = aliasInput.val();
                if (alias == '') {
                    _this.addProblem(_this.createProblem({
                        errorCode: 'BR-0033',
                        paramIndex: index,
                        param: 'Alias',
                        messageParam: ['Alias']
                    }));
                } else {
                    if ($.inArray(alias, aliasNames) > -1) {
                        var messageParam = "Alias - '" + alias + "' already exist.";
                        _this.addProblem(_this.createProblem({
                            errorCode: 'BR-0100',
                            paramIndex: index,
                            param: 'Alias',
                            messageParam: [messageParam]
                        }));
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

        this.renderValidation();
    };

    SelectColumnDialog.prototype.createAliasHelper = function ($parent) {
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
        root.Brightics.VA.Core.Utils.InputValidator.appendValidationCondition($fixInput);
        root.Brightics.VA.Core.Utils.InputValidator.appendValidationCondition($findInput);
        root.Brightics.VA.Core.Utils.InputValidator.appendValidationCondition($replaceInput);

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
            var $items = _this.$mainControl.find('.brtc-va-refine-selectcolumn-contents > .brtc-va-refine-selectcolumn-column-item');

            $items.each(function (index, element) {
                var checkBox = $(element).find('.brtc-va-refine-selectcolumn-column-check');
                if (checkBox.val()) {
                    var aliasInput = $(element).find('.brtc-va-refine-selectcolumn-column-alias');
                    var aliasValue = aliasInput.val();
                    aliasInput.val(aliasValue.toUpperCase());
                }
            });
        });

        $lowercaseButton.click(function () {
            var $items = _this.$mainControl.find('.brtc-va-refine-selectcolumn-contents > .brtc-va-refine-selectcolumn-column-item');

            $items.each(function (index, element) {
                var checkBox = $(element).find('.brtc-va-refine-selectcolumn-column-check');
                if (checkBox.val()) {
                    var aliasInput = $(element).find('.brtc-va-refine-selectcolumn-column-alias');
                    var aliasValue = aliasInput.val();
                    aliasInput.val(aliasValue.toLowerCase());
                }
            });
        });

        $firstUppercaseButton.click(function () {
            var $items = _this.$mainControl.find('.brtc-va-refine-selectcolumn-contents > .brtc-va-refine-selectcolumn-column-item');

            $items.each(function (index, element) {
                var checkBox = $(element).find('.brtc-va-refine-selectcolumn-column-check');
                if (checkBox.val()) {
                    var aliasInput = $(element).find('.brtc-va-refine-selectcolumn-column-alias');
                    var aliasValue = aliasInput.val();
                    aliasInput.val(aliasValue.charAt(0).toUpperCase() + aliasValue.slice(1));
                }
            });
        });

        $prefixButton.click(function () {
            var $items = _this.$mainControl.find('.brtc-va-refine-selectcolumn-contents > .brtc-va-refine-selectcolumn-column-item');

            var prefix = $('.brtc-va-refine-selectcolumn-column-fix-input').val();

            $items.each(function (index, element) {
                var checkBox = $(element).find('.brtc-va-refine-selectcolumn-column-check');
                if (checkBox.val()) {
                    var aliasInput = $(element).find('.brtc-va-refine-selectcolumn-column-alias');
                    var aliasValue = aliasInput.val();
                    aliasInput.val(prefix + aliasValue);
                }
            });
        });

        $suffixButton.click(function () {
            var $items = _this.$mainControl.find('.brtc-va-refine-selectcolumn-contents > .brtc-va-refine-selectcolumn-column-item');

            var suffix = $('.brtc-va-refine-selectcolumn-column-fix-input').val();

            $items.each(function (index, element) {
                var checkBox = $(element).find('.brtc-va-refine-selectcolumn-column-check');
                if (checkBox.val()) {
                    var aliasInput = $(element).find('.brtc-va-refine-selectcolumn-column-alias');
                    var aliasValue = aliasInput.val();
                    aliasInput.val(aliasValue + suffix);
                }
            });
        });

        $prefixIndexButton.click(function () {
            var $items = _this.$mainControl.find('.brtc-va-refine-selectcolumn-contents > .brtc-va-refine-selectcolumn-column-item');
            var count = 1;
            $items.each(function (index, element) {
                var checkBox = $(element).find('.brtc-va-refine-selectcolumn-column-check');
                if (checkBox.val()) {
                    var aliasInput = $(element).find('.brtc-va-refine-selectcolumn-column-alias');
                    var aliasValue = aliasInput.val();
                    aliasInput.val((count++) + aliasValue);
                }
            });
        });

        $suffixIndexButton.click(function () {
            var $items = _this.$mainControl.find('.brtc-va-refine-selectcolumn-contents > .brtc-va-refine-selectcolumn-column-item');
            var count = 1;
            $items.each(function (index, element) {
                var checkBox = $(element).find('.brtc-va-refine-selectcolumn-column-check');
                if (checkBox.val()) {
                    var aliasInput = $(element).find('.brtc-va-refine-selectcolumn-column-alias');
                    var aliasValue = aliasInput.val();
                    aliasInput.val(aliasValue + (count++));
                }
            });
        });

        $replaceButton.click(function () {
            var $items = _this.$mainControl.find('.brtc-va-refine-selectcolumn-contents > .brtc-va-refine-selectcolumn-column-item');

            var findValue = $('.brtc-va-refine-selectcolumn-column-find-input').val();
            var replaceValue = $('.brtc-va-refine-selectcolumn-column-replace-input').val();

            $items.each(function (index, element) {
                var checkBox = $(element).find('.brtc-va-refine-selectcolumn-column-check');
                if (checkBox.val()) {
                    var aliasInput = $(element).find('.brtc-va-refine-selectcolumn-column-alias');
                    var aliasValue = aliasInput.val();
                    aliasInput.val(aliasValue.split(findValue).join('' + replaceValue));
                }
            });
        });
    };

    SelectColumnDialog.prototype.destroy = function () {
        this.destroyDropDownList();
        this.$mainControl.dialog('destroy');
        if (typeof this.options.close == 'function') {
            this.options.close(this.dialogResult);
        }
    };

    SelectColumnDialog.prototype.destroyDropDownList = function () {
        var $dropDownList = $('.brtc-va-refine-selectcolumn-column-type');
        if ($dropDownList.length > 0) {
            $dropDownList.jqxDropDownList('destroy');
        }
    };

    Brightics.VA.Core.Dialogs.RefineSteps.SelectColumnDialog = SelectColumnDialog;

}).call(this);