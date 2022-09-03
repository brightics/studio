/**
 * Created by daewon77.park on 2016-08-20.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function SortDialog(parentId, options) {
        Brightics.VA.Core.Dialogs.RefineSteps.StepDialog.call(this, parentId, options);
    }

    SortDialog.prototype = Object.create(Brightics.VA.Core.Dialogs.RefineSteps.StepDialog.prototype);
    SortDialog.prototype.constructor = SortDialog;

    SortDialog.prototype.getTitle = function () {
        return 'Sorter';
    };

    SortDialog.prototype.createDialogContentsArea = function ($parent) {
        var _this = this;
        $parent.append('' +
            '<div class="brtc-va-refine-sortcolumn-newcolumn-container"></div>' +
            '<div class="brtc-va-refine-sortcolumn-addbutton">+ Add New Column</div>');


        $parent.find('.brtc-va-refine-sortcolumn-newcolumn-container').sortable({
            axis: 'y',
            containment: '.brtc-va-refine-sortcolumn-newcolumn-container',
            helper: function (event, ui) {
                var $clone = $(ui).clone();
                $clone.css('position', 'absolute');
                return $clone.get(0);
            },
            handle: ".brtc-va-refine-sortcolumn-column-sort",
            //stop 할때 remove 버튼 hide() 추가 : stepdialog에 구현
            stop: function (event, ui) {
                //_this.sortableStopCallback.hideRemoveButton(_this,'brtc-va-refine-sortcolumn-column-item', 'brtc-va-refine-sortcolumn-column-remove');
            }
        });
        $parent.find('.brtc-va-refine-sortcolumn-newcolumn-container').disableSelection();

        this.render();

        var $addButton = $parent.find('.brtc-va-refine-sortcolumn-addbutton').jqxButton({
            theme: Brightics.VA.Env.Theme
        });
        $addButton.click(function () {
            _this.createNewSortItem();
            _this.checkValidation();
        });

        $parent.perfectScrollbar();
        $parent.perfectScrollbar('update');
    };

    SortDialog.prototype.render = function () {
        if (this.options.param) {
            var additionalQuery = this.options.param['additional-query'];

            var res = additionalQuery.replace(/ \n/gi, '\n').split("\n");
            if (res[0].startsWith('ORDER BY')) {
                res.splice(0, 1);
            }
            if (res[res.length - 1] == '') {
                res.splice(res.length - 1, 1);
            }

            for (var i = 0; i < res.length; i++) {
                var splitData = res[i].replace(/`/gi, '').replace(',', '').split(' ');

                var name = splitData[0].replace(' ', '');
                var sortMode = splitData[1].replace(' ', '');

                this.createNewSortItem({
                    'name': name,
                    'sort-mode': sortMode
                });
            }
        } else {
            this.createNewSortItem();
        }
        this.checkValidation();
    };

    SortDialog.prototype.createNewSortItem = function (selectedColumns) {
        var _this = this;
        var $parent = this.$mainControl.find('.brtc-va-refine-sortcolumn-newcolumn-container');

        var $item = $('' +
            '<div class="brtc-va-refine-sortcolumn-column-item">' +
            '   <div class="brtc-va-refine-sortcolumn-column-sort" style="cursor: pointer;"><i class="fa fa-bars"></i></div>' +
            '   <div class="brtc-va-refine-sortcolumn-column-name"></div>' +
            '   <div class="brtc-va-refine-sortcolumn-column-propertycontrol-button"><i class="fa fa-sort"></i></div>' +
            '   <div class="brtc-va-refine-sortcolumn-column-remove"></div>' +
            '</div>');
        $parent.append($item);

        var $columnsComboBox = $item.find('.brtc-va-refine-sortcolumn-column-name');
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
        $item.data('columnList', columnList);

        var $toggleButton = $item.find('.brtc-va-refine-sortcolumn-column-propertycontrol-button');

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
        $item.find('.brtc-va-refine-sortcolumn-column-remove').click(function () {
            $(this).closest('.brtc-va-refine-sortcolumn-column-item').remove();
            _this.checkValidation();
        });

        if (selectedColumns) {
            columnList.setSelectedItems([selectedColumns.name]);

            $toggleButton.data('sort-mode', selectedColumns['sort-mode']);
            this.updateSortModeIcon($toggleButton, columnList);
        }

        //임시 
        $item.find('.brtc-va-refine-sortcolumn-column-sort').css('margin-bottom', '5px');
        //첫번째 item에 remove버튼 hide 기능
        //this.sortableStopCallback.hideRemoveButton(this, 'brtc-va-refine-sortcolumn-column-item', 'brtc-va-refine-sortcolumn-column-remove');
    };

    SortDialog.prototype.createAdditionalQuery = function () {
        var additionalQuery = 'ORDER BY \n';
        var $container = this.$mainControl.find('.brtc-va-refine-sortcolumn-newcolumn-container');

        var $target = $container.find('.brtc-va-refine-sortcolumn-column-item');
        $target.each(function (index, element) {
            var columnList = $(element).data('columnList');
            var sortModeButton = $(element).find('.brtc-va-refine-sortcolumn-column-propertycontrol-button');

            var selectedColumns = columnList.getSelectedItems();
            if (selectedColumns.length) {
                var sortMode = sortModeButton.data('sort-mode');

                additionalQuery += '`' + selectedColumns[0] + '`' + ' ' + sortMode;
                additionalQuery += (index < $target.length - 1) ? (', \n') : (' \n');
            }
        });

        return additionalQuery;
    };

    SortDialog.prototype.handleOkClicked = function () {
        if (this.problems.length > 0) {
            Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('There is a problem with some values.');
        } else {
            var select = '*';
            var additionalQuery = this.createAdditionalQuery();

            this.buildFunctionUnit('Sort', 'sortByRefine', select, additionalQuery);
            Brightics.VA.Core.Dialogs.RefineSteps.StepDialog.prototype.handleOkClicked.call(this);
        }
    };

    SortDialog.prototype.buildFunctionUnit = function (label, func, select, additionalQuery) {
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

    SortDialog.prototype.buildScript = function (select, additionalQuery) {
        var script = this.DEFAULT_SCRIPT;
        var strSelect = select.replace(/\n/g, '');
        var strAdditionalQuery = additionalQuery.replace(/\n/g, '');
        script = script.replace('${SELECT_SQL}', strSelect);
        script = script.replace('${ADDITIONAL_QUERY}', strAdditionalQuery);
        return script;
    };

    SortDialog.prototype.renderValidation = function () {
        var _this = this;

        var $container = this.$mainControl.find('.brtc-va-refine-sortcolumn-newcolumn-container');
        var $target = $container.find('.brtc-va-refine-sortcolumn-column-item');

        $.each(this.problems, function (key, problem) {
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
            else {
                _this.createValidationContent($($target[problem.paramIndex]), problem); //, $($target[problem.paramIndex]).find('.brtc-va-editors-sheet-controls-columnlist'));
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

    SortDialog.prototype.checkValidation = function () {
        var _this = this;
        this.removeValidation();

        var $container = this.$mainControl.find('.brtc-va-refine-sortcolumn-newcolumn-container');
        var $target = $container.find('.brtc-va-refine-sortcolumn-column-item');

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

    SortDialog.prototype.updateSortModeIcon = function ($sortButton, columnList) {
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

    SortDialog.prototype.destroy = function () {
        this.destroyColumnSelector();
        this.$mainControl.dialog('destroy');
        if (typeof this.options.close == 'function') {
            this.options.close(this.dialogResult);
        }
    };

    Brightics.VA.Core.Dialogs.RefineSteps.SortDialog = SortDialog;

}).call(this);