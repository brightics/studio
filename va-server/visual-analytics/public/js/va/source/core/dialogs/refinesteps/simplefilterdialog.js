/**
 * Created by daewon77.park on 2016-08-20.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    function SimpleFilterDialog(parentId, options) {
        Brightics.VA.Core.Dialogs.RefineSteps.StepDialog.call(this, parentId, options);
    }

    SimpleFilterDialog.prototype = Object.create(Brightics.VA.Core.Dialogs.RefineSteps.StepDialog.prototype);
    SimpleFilterDialog.prototype.constructor = SimpleFilterDialog;

    SimpleFilterDialog.prototype.getTitle = function () {
        return 'Simple Filter';
    };

    SimpleFilterDialog.prototype.createDialogContentsArea = function ($parent) {
        $parent.append('<div class="brtc-va-refine-simplefilter-contents"></div>');

        this.render();

        $parent.perfectScrollbar();
        $parent.perfectScrollbar('update');
    };

    SimpleFilterDialog.prototype.parseSql = function (sql) {
        var option = {};
        var firstBlankIndex = sql.indexOf(' ');
        option.name = sql.substring(0, firstBlankIndex).trim();

        var conditionAndValue = sql.substring(firstBlankIndex).trim();
        var secondBlankIndex = conditionAndValue.indexOf(' ');
        option.condition = conditionAndValue.substring(0, secondBlankIndex).trim();
        option.columnValue = conditionAndValue.substring(secondBlankIndex).trim();
        return option;
    };

    SimpleFilterDialog.prototype.render = function () {
        var firstOption;
        var secondOption;
        var type = 'and';

        if (this.options.param) {
            var additionalQuery = this.options.param['additional-query'];
            var filterSqls = additionalQuery.split(' \n');
            for (var i in filterSqls) {
                if (filterSqls[i].startsWith('WHERE')) {
                    var firstFilterSql = filterSqls[i].replace('WHERE ', '').trim();
                    firstOption = this.parseSql(firstFilterSql);
                    firstOption.name = firstOption.name.replace(/`/gi, '');
                } else {
                    type = filterSqls[i].startsWith('and') ? 'and' : 'or';
                    var secondFilterSql = filterSqls[i].replace(type, '').trim();
                    secondOption = this.parseSql(secondFilterSql);
                    secondOption.name = secondOption.name.replace(/`/gi, '');
                }
            }
        }

        this.createColumnItem(firstOption);
        this.createSimplefilterRadioButton({type: type});
        this.createColumnItem(secondOption);

        this.checkValidation();
    };

    SimpleFilterDialog.prototype.createSimplefilterRadioButton = function (option) {
        var $parent = this.$mainControl.find('.brtc-va-refine-simplefilter-contents');

        var $item = $('' +
            '<div class="brtc-va-dialogs-simplefilter-type">' +
            '   <div class="brtc-va-dialogs-simplefilter-type-and">And</div>' +
            '   <div class="brtc-va-dialogs-simplefilter-type-or">Or</div>' +
            '</div>');
        // $item.css('background-color', 'blue');
        $parent.append($item);

        $parent.find('.brtc-va-dialogs-simplefilter-type-and').jqxRadioButton({
            checked: (option.type == 'and'),
            theme: Brightics.VA.Env.Theme
        });

        $parent.find('.brtc-va-dialogs-simplefilter-type-or').jqxRadioButton({
            checked: (option.type == 'or'),
            theme: Brightics.VA.Env.Theme
        });

    };

    SimpleFilterDialog.prototype.createColumnItem = function (option) {
        var _this = this;
        var $parent = this.$mainControl.find('.brtc-va-refine-simplefilter-contents');
        var $item = $('' +
            '<div class="brtc-va-refine-simplefilter-column-item">' +
            '   <div class="brtc-va-refine-simplefilter-column-name"></div>' +
            '   <div class="brtc-va-refine-simplefilter-condition"></div>' +
            '   <input type="text" class="brtc-va-refine-simplefilter-column-value"/>' +
            '</div>');
        $parent.append($item);

        var $columnsComboBox = $item.find('.brtc-va-refine-simplefilter-column-name');
        // ColumnList
        this.data = [];
        this.data = this.options.columns;
        var widgetOptions = {
            rowCount: 1,
            multiple: false,
            showOpener: 'click',
            removable: false,
            fromModal: true
        };
        var columnList = this.createColumnList($columnsComboBox, widgetOptions, 'brtc-va-editors-sheet-controls-width-3', {
            height: '25px',
            'padding-left': '4px'
        });
        columnList.setItems(this.data);
        $columnsComboBox.data('columnList', columnList);

        var source = ['', '=', '<>', '>', '>=', '<', '<='];
        $item.find('.brtc-va-refine-simplefilter-condition').jqxDropDownList({
            theme: Brightics.VA.Env.Theme,
            source: source,
            width: 150,
            //height: 25
        });

        var columnNameArray = $.map(this.options.columns, function (col, i) {
            return col.name;
        });

        var cm = CodeMirror.fromTextArea($item.find('.brtc-va-refine-simplefilter-column-value')[0], {
            mode: "brtc-control",
            theme: "default",
            indentWithTabs: true,
            smartIndent: true,
            lineNumbers: false,
            matchBrackets: true,
            scrollbarStyle: "null",
            extraKeys: {"Ctrl-Space": "autocomplete"},
            hintOptions: {list: [].concat(columnNameArray, Brightics.VA.Env.SQLFunctions)}
        });

        cm.on("beforeChange", function (instance, change) {
            var newtext = change.text.join("").replace(/\n/g, ""); // remove ALL \n !
            if (change.update) change.update(change.from, change.to, [newtext]);
            return true;
        });

        cm.setSize('calc(100% - 310px)', '25px');
        // hint를 close하기 위해 Esc 누르는 경우, dialog가 같이 close되는 것 방지.
        Brightics.VA.Core.Utils.WidgetUtils.adjustCodeMirrorEsc(cm);

        cm.on("beforeChange", function (instance, change) {
            var newtext = change.text.join("").replace(/\n/g, ""); // remove ALL \n !
            if (change.update) change.update(change.from, change.to, [newtext]);
            return true;
        });


        if (option) {
            columnList.setSelectedItems([option.name]);
            $item.find('.brtc-va-refine-simplefilter-condition').val(option.condition);
            cm.setValue(option.columnValue);
        }

        columnList.onChange(function (event, data) {
            _this.checkValidation();
        });

        $item.find('.brtc-va-refine-simplefilter-condition').on('change', function () {
            _this.checkValidation();
        });

        cm.on('change', function (cMirror) {
            _this.checkValidation();
        });

        //임시
        //columnlist empty unit  불필요 margin 삭제
        $columnsComboBox.find('.brtc-va-editors-sheet-controls-columnselector-columncontainer-element-empty').css({
            'width': '100%',
            'margin-left': '0px'
        });
    };

    SimpleFilterDialog.prototype.getAdditionalQueryString = function () {
        var parentItem = this.$mainControl.find('.brtc-va-refine-simplefilter-column-item');
        var whereString = 'WHERE ';
        var additionalQueryString = '';
        var type = this.getRadioButtonValue();

        var simpleFilterQuery = [];
        $.each(parentItem, function (key, value) {
            var column = $(parentItem[key]).find('.brtc-va-refine-simplefilter-column-name').data('columnList').getSelectedItems()[0];
            let operator, textValue;
            if (column !== undefined) {
                operator = $(parentItem[key]).find('.brtc-va-refine-simplefilter-condition').val();
                var cm = $(parentItem[key]).find('.CodeMirror')[0].CodeMirror;
                textValue = cm.getValue();
                simpleFilterQuery[key] = '`'+ column + '` ' + operator + ' ' + textValue + ' ';
            }
        });

        if (simpleFilterQuery[1])
            additionalQueryString = whereString + simpleFilterQuery[0] + '\n' + type + ' ' + simpleFilterQuery[1];
        else
            additionalQueryString = whereString + simpleFilterQuery[0];

        return additionalQueryString;
    };

    SimpleFilterDialog.prototype.getRadioButtonValue = function () {
        var val = '';
        var andButton = this.$mainControl.find('.brtc-va-dialogs-simplefilter-type-and');
        var orButton = this.$mainControl.find('.brtc-va-dialogs-simplefilter-type-or');

        if (andButton.jqxRadioButton('checked')) {
            val = "and";
        }
        else if (orButton.jqxRadioButton('checked')) {
            val = "or";
        }

        return val;
    };

    SimpleFilterDialog.prototype.handleOkClicked = function () {
        if (this.problems.length > 0) {
            Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('There is a problem with some values.');
        } else {
            var select = '*';
            var additionalQuery = this.getAdditionalQueryString();

            this.buildFunctionUnit('Simple Filter', 'simpleFilter', select, additionalQuery);
            Brightics.VA.Core.Dialogs.RefineSteps.StepDialog.prototype.handleOkClicked.call(this);
        }
    };

    SimpleFilterDialog.prototype.buildFunctionUnit = function (label, func, select, additionalQuery) {
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

    SimpleFilterDialog.prototype.buildScript = function (select, additionalQuery) {
        var script = this.DEFAULT_SCRIPT;
        var strSelect = select.replace(/\n/g, '');
        var strAdditionalQuery = additionalQuery.replace(/\n/g, '');
        script = script.replace('${SELECT_SQL}', strSelect);
        script = script.replace('${ADDITIONAL_QUERY}', strAdditionalQuery);
        return script;
    };


    SimpleFilterDialog.prototype.renderValidation = function () {
        // var _this = this;
        // var parentItem = this.$mainControl.find('.brtc-va-refine-simplefilter-column-item');

        // $.each(this.problems, function (key, problem) {
        //     _this.createValidationContent($(parentItem[problem.paramIndex]), problem);
        // });
        // var _this = this;
        // var $items = this.$mainControl.find('.brtc-va-refine-simplefilter-contents > .brtc-va-refine-simplefilter-column-item');

        // $.each(this.problems, function (key, problem) {
        //     _this.createValidationContent($($items[problem.paramIndex]), problem);
        //     //임시 
        //     // 1개의 problem만 있으므로 무조건 하나의 brtc-va-refine-step-validation-tooltip 찾아서 css변경
        //     $($items[problem.paramIndex]).find('.brtc-va-refine-step-validation-tooltip').css({
        //         'clear': '',
        //         'float': 'left',
        //         'margin-left': '8px'
        //     });
        // });
    };

    SimpleFilterDialog.prototype.checkValidation = function () {
        var _this = this;
        this.removeValidation();

        var parentItem = this.$mainControl.find('.brtc-va-refine-simplefilter-column-item');

        $.each(parentItem, function (key, value) {
            var column = $(parentItem[key]).find('.brtc-va-refine-simplefilter-column-name').data('columnList').getSelectedItems()[0];
            var operator, textValue;

            if (key == 0 && column == undefined) {
                _this.addProblem(_this.createProblem({
                    errorCode: 'BR-0033',
                    paramIndex: key,
                    param: 'Column',
                    messageParam: ['Column']
                }));
            }

            else if (key == 0 || (key == 1 && column != undefined)) {
                operator = $(parentItem[key]).find('.brtc-va-refine-simplefilter-condition').val();
                // textValue = $(parentItem[key]).find('.brtc-va-refine-simplefilter-column-value').val();
                var cm = $(parentItem[key]).find('.CodeMirror')[0].CodeMirror;
                textValue = cm.getValue();

                if (operator == '') {
                    _this.addProblem(_this.createProblem({
                        errorCode: 'BR-0033',
                        paramIndex: key,
                        param: 'Operator',
                        messageParam: ['Operator']
                    }));
                }
                else if (textValue == '') {
                    _this.addProblem(_this.createProblem({
                        errorCode: 'BR-0033',
                        paramIndex: key,
                        param: 'Value',
                        messageParam: ['Value']
                    }));
                }
            }
        });

        this.renderValidation();
    };

    SimpleFilterDialog.prototype.destroy = function () {
        this.destroyColumnSelector();
        this.destroyDropDownList();
        this.$mainControl.dialog('destroy');
        if (typeof this.options.close == 'function') {
            this.options.close(this.dialogResult);
        }
    };

    SimpleFilterDialog.prototype.destroyDropDownList = function () {
        var $dropDownList = $('.brtc-va-refine-simplefilter-condition');
        if ($dropDownList.length > 0) {
            $dropDownList.jqxDropDownList('destroy');
        }
    };

    Brightics.VA.Core.Dialogs.RefineSteps.SimpleFilterDialog = SimpleFilterDialog;

}).call(this);