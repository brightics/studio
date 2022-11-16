/**
 * Created by sds on 2016-12-09.
 */

(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function IndexColumnDialog(parentId, options) {
        Brightics.VA.Core.Dialogs.RefineSteps.StepDialog.call(this, parentId, options);
    }

    IndexColumnDialog.prototype = Object.create(Brightics.VA.Core.Dialogs.RefineSteps.StepDialog.prototype);
    IndexColumnDialog.prototype.constructor = IndexColumnDialog;

    IndexColumnDialog.prototype.getTitle = function () {
        return 'Index Column';
    };

    IndexColumnDialog.prototype.createControls = function () {
        Brightics.VA.Core.Dialogs.RefineSteps.StepDialog.prototype.createControls.call(this);
        var jqxOpt = {
            height: 550,
            maxHeight: 550
        };
        this.$mainControl.dialog(jqxOpt);
    };
    IndexColumnDialog.prototype.createDialogContentsArea = function ($parent) {
        var _this = this;
        $parent.append('' +
            '<div class="brtc-va-refine-indexcolumn-column-contents">' +
            '   <div class="brtc-va-refine-indexcolumn-newcolumn-name-contents"><span>New Column Name</span><input type="text" style="margin-left: 83px; " class="brtc-va-refine-indexcolumn-newcolumn-name"/></div>' +
            '   <div class="brtc-va-refine-indexcolumn-newcolumn-lagvalue-contents"><span>Lag Value</span></div>' +
            '   <div style="width: 510px; height:130px; margin-top: 10px;"><div>Partition By</div>' +
            '       <div><div class="brtc-va-refine-indexcolumn-group-columns"></div></div>' +
            '   </div>' +
            '</div>' +
            '   <div style="margin-top: 10px;"><div style="margin-left: 10px; margin-bottom: 7px">Order By</div>' +
            '       <div class="brtc-va-refine-indexcolumn-newcolumn-container" style="margin-left: 3px;"></div>' +
            '       <div class="brtc-va-refine-indexcolumn-addbutton" >+ Add New Column</div>' +
            '</div>');

        // new column name
        $parent.find('.brtc-va-refine-indexcolumn-newcolumn-name').jqxInput({
            theme: Brightics.VA.Env.Theme,
            placeHolder: Brightics.locale.placeHolder.enterName,
            width: 295
        });

        $parent.find('.brtc-va-refine-indexcolumn-newcolumn-name').on('change', function (event) {
            _this.checkValidation();
        });

        var $lagValue = $parent.find('.brtc-va-refine-indexcolumn-newcolumn-lagvalue-contents');
        this.$lagValueInput = new Brightics.VA.Core.Widget.Controls.NumericInput($lagValue, {
            numberType: 'int',
            min: undefined,
            max: undefined,
            minus: false,
            placeHolder: Brightics.locale.placeHolder.enterValue,
        });

        // partition by columns
        var $groupColumns = $parent.find('.brtc-va-refine-indexcolumn-group-columns');
        this.data = [];
        this.data = this.options.columns;
        var widgetOptions = {
            maxRowCount: 3,
            multiple: true,
            showOpener: 'click',
            removable: true,
            fromModal: true
        };
        var groupColumnsControl = this.createColumnList($groupColumns, widgetOptions, '', {
            width: '510px'
        });

        groupColumnsControl.setItems(this.data);
        $groupColumns.data('columnList', groupColumnsControl);

        // order by columns sort
        $parent.find('.brtc-va-refine-indexcolumn-newcolumn-container').sortable({
            axis: 'y',
            containment: '.brtc-va-refine-indexcolumn-newcolumn-container',
            helper: function (event, ui) {
                var $clone = $(ui).clone();
                $clone.css('position', 'absolute');
                return $clone.get(0);
            },
            handle: ".brtc-va-refine-indexcolumn-column-sort",
            //stop 할때 remove 버튼 hide() 추가 : stepdialog에 구현
            stop: function (event, ui) {
                // _this.sortableStopCallback.hideRemoveButton(_this, 'brtc-va-refine-indexcolumn-column-item', 'brtc-va-refine-indexcolumn-column-remove');
            }
        });
        $parent.find('.brtc-va-refine-indexcolumn-newcolumn-container').disableSelection();

        this.render();

        var $addButton = $parent.find('.brtc-va-refine-indexcolumn-addbutton').jqxButton({
            theme: Brightics.VA.Env.Theme
        });
        $addButton.click(function () {
            _this.createNewSortItem();
            _this.checkValidation();
        });

        $parent.perfectScrollbar();
        $parent.perfectScrollbar('update');
    };

    IndexColumnDialog.prototype.render = function () {
        var groupColumns = this.$mainControl.find('.brtc-va-refine-indexcolumn-group-columns');
        var groupColumnList = $(groupColumns).data('columnList');

        if (this.options.param) {
            var select = this.options.param.select;

            var res = select.replace(/ \n/gi, '\n').split("\n");

            // lag value 없는 경우
            if (res[0].startsWith('*, ROW_NUMBER() OVER(')) {
                res.splice(0, 1);

                let groupList = [];
                // Get Group Column
                if (res[0] == 'PARTITION BY') {
                    res.splice(0, 1);

                    for (var i = 0; i < res.length; i++) {
                        if (res[i].startsWith('ORDER BY') || res[i].startsWith(') as ')) {
                            res.splice(0, i);
                            groupColumnList.setSelectedItems(groupList);
                            break;
                        }
                        groupList.push(res[i].replace(',', ''));
                    }
                }

                // Get Sort Column
                if (res[0] == 'ORDER BY') {
                    res.splice(0, 1);

                    for (var i = 0; i < res.length; i++) {
                        if (!res[i].startsWith(') as ')) {
                            let splitData = res[i].replace(',', '').split(' ');

                            let name = splitData[0].replace(' ', '');
                            let sortMode = splitData[1].replace(' ', '');

                            this.createNewSortItem({
                                'name': name,
                                'sort-mode': sortMode
                            });
                        } else {
                            res.splice(0, i);
                            break;
                        }
                    }
                }

                // Get New Column
                if (res[res.length - 1].startsWith(') as ')) {
                    let alias = res[res.length - 1].replace(') as ', '');
                    this.$mainControl.find('.brtc-va-refine-indexcolumn-newcolumn-name').val(alias);
                }
            } else if (res[0].startsWith('*, zeroIfNeg(ROW_NUMBER() OVER(')) { // lag value 있는 경우
                res.splice(0, 1);

                let groupList = [];
                // Get Group Column
                if (res[0] == 'PARTITION BY') {
                    res.splice(0, 1);

                    for (var i = 0; i < res.length; i++) {
                        if (res[i].startsWith('ORDER BY') || res[i].startsWith(') -')) {
                            res.splice(0, i);
                            groupColumnList.setSelectedItems(groupList);
                            break;
                        }
                        groupList.push(res[i].replace(',', ''));
                    }
                }

                // Get Sort Column
                if (res[0] == 'ORDER BY') {
                    res.splice(0, 1);

                    for (var i = 0; i < res.length; i++) {
                        if (!res[i].startsWith(') - ')) {
                            let splitData = res[i].replace(',', '').split(' ');

                            let name = splitData[0].replace(' ', '');
                            let sortMode = splitData[1].replace(' ', '');

                            this.createNewSortItem({
                                'name': name,
                                'sort-mode': sortMode
                            });
                        } else {
                            res.splice(0, i);
                            break;
                        }
                    }
                }

                // Get Lag Value
                if (res[0].startsWith(') - ')) {
                    var lagValue = res[0].replace(') - ', '');
                    this.$lagValueInput.setValue(lagValue);
                }

                // Get New Column
                if (res[res.length - 1].startsWith(') as ')) {
                    let alias = res[res.length - 1].trim().replace(') as ', '');
                    this.$mainControl.find('.brtc-va-refine-indexcolumn-newcolumn-name').val(alias);
                }
            }
        } else {
            this.createNewSortItem();
        }
        this.checkValidation();
    };

    IndexColumnDialog.prototype.createNewSortItem = function (selectedColumns) {
        var _this = this;
        var $parent = this.$mainControl.find('.brtc-va-refine-indexcolumn-newcolumn-container');

        var $item = $('' +
            '<div class="brtc-va-refine-indexcolumn-column-item">' +
            '   <div class="brtc-va-refine-indexcolumn-column-sort" style="cursor: pointer;"><i class="fa fa-bars"></i></div>' +
            '   <div class="brtc-va-refine-indexcolumn-column-name"></div>' +
            '   <div class="brtc-va-refine-indexcolumn-column-propertycontrol-button"><i class="fa fa-sort"></i></div>' +
            '   <div class="brtc-va-refine-indexcolumn-column-remove"></div>' +
            '</div>');
        $parent.append($item);

        var $columnsComboBox = $item.find('.brtc-va-refine-indexcolumn-column-name');
        // ColumnList
        var widgetOptions = {
            rowCount: 1,
            multiple: false,
            showOpener: 'click',
            removable: false,
            fromModal: true
        };
        var columnList = this.createColumnList($columnsComboBox, widgetOptions, 'brtc-va-editors-sheet-controls-width-10', {
            height: '25px',
            'padding-left': '4px'
        });
        columnList.setItems(this.options.columns);
        columnList.columnSelector.$mainControl.attr('isDialog', true);
        $item.data('columnList', columnList);

        var $toggleButton = $item.find('.brtc-va-refine-indexcolumn-column-propertycontrol-button');

        // Toggle Button
        this.createButton($toggleButton, {width: '19px', height: '19px'}, '', {float: 'left', 'margin-left': '3px'});
        $toggleButton.data('sort-mode', 'ASC');
        $toggleButton.on('click', function () {
            var selectedItem = columnList.getSelectedItems();
            var selectedColumn = $.grep(_this.options.columns, function (element, index) {
                return element.name === selectedItem[0];
            });
            if (selectedColumn) {
                if (selectedColumn.length > 0) {
                    var currentVal = $toggleButton.data('sort-mode');
                    if (currentVal === 'ASC') {
                        $toggleButton.data('sort-mode', 'DESC');
                    } else {
                        $toggleButton.data('sort-mode', 'ASC');
                    }
                    _this.updateSortModeIcon($toggleButton, columnList);
                }
            }
        });

        columnList.onChange(function (event, data) {
            _this.updateSortModeIcon($toggleButton, columnList);
            _this.checkValidation();
        });

        //delete button
        $item.find('.brtc-va-refine-indexcolumn-column-remove').click(function () {
            $(this).closest('.brtc-va-refine-indexcolumn-column-item').remove();
            _this.checkValidation();
        });

        if (selectedColumns) {
            columnList.setSelectedItems([selectedColumns.name]);

            $toggleButton.data('sort-mode', selectedColumns['sort-mode']);
            this.updateSortModeIcon($toggleButton, columnList);
        }

        //임시
        $item.find('.brtc-va-refine-indexcolumn-column-sort').css('margin-bottom', '5px');
        //첫번째 item에 remove버튼 hide 기능
        // this.sortableStopCallback.hideRemoveButton(this, 'brtc-va-refine-indexcolumn-column-item', 'brtc-va-refine-indexcolumn-column-remove');
    };

    IndexColumnDialog.prototype.handleOkClicked = function () {
        if (this.problems.length > 0) {
            Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('There is a problem with some values.');
        } else {
            var select = this.createAdditionalQuery();
            var additionalQuery = '';

            this.createSQLExecutor('Index Column', 'indexColumnByRefine', select, additionalQuery);

            Brightics.VA.Core.Dialogs.RefineSteps.StepDialog.prototype.handleOkClicked.call(this);
        }
    };

    IndexColumnDialog.prototype.createAdditionalQuery = function () {
        var additionalQuery = '';
        var orderByQuery = '';
        var partitionByQuery = '';

        var groupColumns = this.$mainControl.find('.brtc-va-refine-indexcolumn-group-columns');
        var groupColumnList = $(groupColumns).data('columnList');
        var selecetedGroupColumns = groupColumnList.getSelectedItems();

        if (selecetedGroupColumns.length) {
            partitionByQuery = 'PARTITION BY\n';
            $.each(groupColumnList.getSelectedItems(), function (idx, columnName) {
                partitionByQuery += columnName;
                partitionByQuery += (idx < selecetedGroupColumns.length - 1) ? (',\n') : ('\n');
            });
        }

        var $container = this.$mainControl.find('.brtc-va-refine-indexcolumn-newcolumn-container');
        var $target = $container.find('.brtc-va-refine-indexcolumn-column-item');
        if ($target.length > 0) {
            orderByQuery = 'ORDER BY\n';
        }
        $target.each(function (index, element) {
            var columnList = $(element).data('columnList');
            var sortModeButton = $(element).find('.brtc-va-refine-indexcolumn-column-propertycontrol-button');

            var selectedColumns = columnList.getSelectedItems();
            if (selectedColumns.length) {
                var sortMode = sortModeButton.data('sort-mode');

                orderByQuery += selectedColumns[0] + ' ' + sortMode;
                orderByQuery += (index < $target.length - 1) ? (',\n') : ('\n');
            } else {
                orderByQuery = '';
            }
        });

        var newColumn = this.$mainControl.find('.brtc-va-refine-indexcolumn-newcolumn-name').val();
        var lagValue = this.$lagValueInput.getValue();

        if (lagValue === '') {
            additionalQuery = '*, ROW_NUMBER() OVER(\n' + partitionByQuery + orderByQuery + ') as ' + newColumn;
        } else {
            additionalQuery = '*, zeroIfNeg(ROW_NUMBER() OVER(\n' + partitionByQuery + orderByQuery + ') - ' + lagValue + '\n) as ' + newColumn;
        }

        return additionalQuery;
    };

    IndexColumnDialog.prototype.renderValidation = function () {
        var _this = this;

        var $newColumnName = this.$mainControl.find('.brtc-va-refine-indexcolumn-newcolumn-name-contents');
        var $container = this.$mainControl.find('.brtc-va-refine-indexcolumn-newcolumn-container');
        var $target = $container.find('.brtc-va-refine-indexcolumn-column-item');

        $.each(_this.problems, function (key, problem) {
            if (problem.paramIndex == -1) {
                //_this.createValidationContent($($container), problem);
                // //임시
                // // 1개의 problem만 있으므로 무조건 하나의 brtc-va-refine-step-validation-tooltip 찾아서 css변경
                // $($container).find('.brtc-va-refine-step-validation-tooltip').css({
                //     'clear': '',
                //     'float': 'left',
                //     'margin-top': '0px'
                // });
            }
            else if (problem.param == 'New column name') {
                _this.createValidationContent($($newColumnName), problem)

            } else if (problem.param == 'Select column') {
                // _this.createValidationContent($($target[problem.paramIndex]), problem); //, $($target[problem.paramIndex]).find('.brtc-va-editors-sheet-controls-columnlist'));
                //임시
                // 1개의 problem만 있으므로 무조건 하나의 brtc-va-refine-step-validation-tooltip 찾아서 css변경
                $($target[problem.paramIndex]).find('.brtc-va-refine-step-validation-tooltip').css({
                    'clear': '',
                    'float': 'left',
                    'margin-top': '0px',
                    'margin-bottom': '10px',
                    'margin-left': '35px'
                });
            }
        });
    };

    IndexColumnDialog.prototype.checkValidation = function () {
        var _this = this;
        this.removeValidation();

        var newColumn = this.$mainControl.find('.brtc-va-refine-indexcolumn-newcolumn-name').val();
        var $container = this.$mainControl.find('.brtc-va-refine-indexcolumn-newcolumn-container');
        var $target = $container.find('.brtc-va-refine-indexcolumn-column-item');

        if (newColumn === '') {
            _this.addProblem(_this.createProblem({
                errorCode: 'BR-0033',
                param: 'New column name',
                messageParam: ['New Column Name']
            }));
        }
        else if (!(Brightics.VA.Core.Utils.InputValidator.isValid.columnNameType(newColumn))) {
            _this.addProblem(_this.createProblem({
                errorCode: 'BR-0045',
                param: 'New Column Name'
            }));
        }

        var selectedColumnNames = [];
        if ($target.length) {
            $target.each(function (index, element) {
                var columnList = $(element).data('columnList');
                var selectedColumns = columnList.getSelectedItems();
                if (selectedColumns.length) {
                    if ($.inArray(selectedColumns[0], selectedColumnNames) > -1) {
                        var messageParam = "Select column(s) - '"+ selectedColumns[0] + "' already exist.";
                        _this.addProblem(_this.createProblem({
                            errorCode: 'BR-0100',
                            paramIndex: index,
                            param: 'Select column',
                            messageParam: [messageParam]
                        }));
                    }
                    else {
                        selectedColumnNames.push(selectedColumns[0]);
                    }
                } else {
                    _this.addProblem(_this.createProblem({
                        errorCode: 'BR-0033',
                        paramIndex: index,
                        param: 'Select column',
                        messageParam: ['Select column']
                    }));
                }
            });
        }
        else {
            this.addProblem(_this.createProblem({
                errorCode: 'BR-0033',
                paramIndex: -1,
                param: 'Column',
                messageParam: ['Column']
            }));
        }

        this.renderValidation();
    };

    IndexColumnDialog.prototype.updateSortModeIcon = function ($sortButton, columnList) {
        var _this = this;
        var selectedItem = columnList.getSelectedItems();
        var selectedColumn = $.grep(_this.options.columns, function (element, index) {
            return element.name === selectedItem[0];
        });
        var sortMode = $sortButton.data('sort-mode');

        if (selectedColumn) {
            if (selectedColumn.length > 0) {
                var selectedColumnType = selectedColumn[0].type;

                $sortButton.find('i').removeClass();
                var className;
                if (selectedColumnType === 'string') {
                    className = 'fa fa-sort-alpha-' + sortMode.toLowerCase();
                    $sortButton.find('i').addClass(className);
                }
                else if (selectedColumnType === 'number' || selectedColumnType === 'date') {
                    className = 'fa fa-sort-numeric-' + sortMode.toLowerCase();
                    $sortButton.find('i').addClass(className);
                }
                else {
                    className = 'fa fa-sort';
                    $sortButton.find('i').addClass(className);
                }
            }
        }
    };

    IndexColumnDialog.prototype.destroy = function () {
        this.destroyColumnSelector();
        this.$mainControl.dialog('destroy');
        if (typeof this.options.close == 'function') {
            this.options.close(this.dialogResult);
        }
    };

    Brightics.VA.Core.Dialogs.RefineSteps.IndexColumnDialog = IndexColumnDialog;

}).call(this);