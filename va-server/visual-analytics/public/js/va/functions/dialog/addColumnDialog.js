/**
 * Created by sds on 2018-12-20.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var _super = Brightics.VA.Core.Dialogs.PropertiesPanelDialog.prototype;

    function AddColumnDialog(parentId, options) {
        _super.constructor.call(this, parentId, options);
    }

    AddColumnDialog.prototype = Object.create(_super);
    AddColumnDialog.prototype.constructor = AddColumnDialog;

    AddColumnDialog.prototype.createContentsAreaControls = function ($parent) {
        this.createAddColumnInfoControl()
        this.createAddButtonControl();
    };

    AddColumnDialog.prototype.renderValues = function () {
        this.renderAddColumn();
    };

    AddColumnDialog.prototype.createAddColumnInfoControl = function () {
        this.$columnInfoArea = $('' +
            '<div class="brtc-va-refine-addcolumn-newcolumn-container"></div>');// +

        this.popupProperty.$contentsArea.append(this.$columnInfoArea);

        this.$columnInfoArea.sortable({
            axis: 'y',
            helper: function (event, ui) {
                var $clone = $(ui).clone();
                $clone.css('position', 'absolute');
                return $clone.get(0);
            },
            containment: '.brtc-va-refine-addcolumn-newcolumn-container',
            handle: ".brtc-va-refine-addcolumn-newcolumn-sort",
            //stop 할때 remove 버튼 hide() 추가 : stepdialog에 구현
            stop: function (event, ui) {
                //_this.sortableStopCallback.hideRemoveButton(_this, 'brtc-va-refine-addcolumn-newcolumn-item', 'brtc-va-refine-addcolumn-newcolumn-remove');
            }
        });
        this.$columnInfoArea.disableSelection();

        this.popupProperty.$contentsArea.perfectScrollbar();
        this.popupProperty.$contentsArea.perfectScrollbar('update');
    };

    AddColumnDialog.prototype.createAddButtonControl = function () {
        var _this = this;
        var $addConditionButton = $('<input type="button" class="brtc-va-conditional-update-property add-else-if-button" value="+ Add New Column"/>');
        this.popupProperty.$contentsArea.append($addConditionButton);
        $addConditionButton.jqxButton({
            theme: Brightics.VA.Env.Theme,
            width: '100%',
            height: 25
        });

        $addConditionButton.click(function () {
            _this.createNewColumnItem();
        });
    };

    AddColumnDialog.prototype.createNewColumnItem = function (newColumn, value) {
        var $item = $('' +
            '<div class="brtc-va-refine-addcolumn-newcolumn-item">' +
            '   <div class="brtc-va-refine-addcolumn-newcolumn-sort"><i class="fa fa-bars"></i></div>' +
            '   <input type="text" class="brtc-va-refine-addcolumn-newcolumn-name" valid-type="type1"/>' +
            '   <div class="brtc-va-refine-addcolumn-newcolumn-assignor">=</div>' +
            '   <textarea class="brtc-va-refine-addcolumn-newcolumn-value"></textarea>' +
            '   <div class="brtc-va-refine-addcolumn-newcolumn-remove"></div>' +
            '</div>');
        this.$columnInfoArea.append($item);

        $item.find('.brtc-va-refine-addcolumn-newcolumn-name').jqxInput({
            theme: Brightics.VA.Env.Theme,
            placeHolder: Brightics.locale.placeHolder.enterName,
            width: '122px',
            height: 27
        });
        root.Brightics.VA.Core.Utils.InputValidator.appendValidationCondition($item.find('.brtc-va-refine-addcolumn-newcolumn-name'));

        if (newColumn) {
            $item.find('.brtc-va-refine-addcolumn-newcolumn-name').val(newColumn);
        }

        var columnNameArray = $.map(this.options.columns, function (col, i) {
            return col;
        });

        var functionArray =
            [
                'ROUND()', 'MAX()', 'MIN()', 'SUM()', 'AVG()', 'OVER()', //Related to NUMBER
                'NVL()', 'CONCAT()', 'LPAD()', 'LTRIM()', 'RPAD()', 'RTRIM()', 'SUBSTR()', 'SUBSTRING()', //Related to STRING
                'FROM_UNIXTIME()', 'YEAR()', 'MONTH()', 'WEEKOFYEAR()' //Related to DATE
            ];

        var cm = CodeMirror.fromTextArea($item.find('.brtc-va-refine-addcolumn-newcolumn-value')[0], {
            mode: "text/x-sql",
            theme: "default",
            indentWithTabs: true,
            smartIndent: true,
            lineNumbers: false,
            matchBrackets: false,
            scrollbarStyle: "null",
            extraKeys: {"Ctrl-Space": "autocomplete"},
            hintOptions: {list: this.options.additionalHint.concat(columnNameArray, functionArray)}
        });
        cm.setSize('calc(100% - 200px)', $item.find('.brtc-va-refine-addcolumn-newcolumn-name').height());
        // hint를 close하기 위해 Esc 누르는 경우, dialog가 같이 close되는 것 방지.
        Brightics.VA.Core.Utils.WidgetUtils.adjustCodeMirrorEsc(cm);

        cm.on("beforeChange", function (instance, change) {
            var newtext = change.text.join("").replace(/\n/g, ""); // remove ALL \n !
            if (change.update) change.update(change.from, change.to, [newtext]);
            return true;
        });

        if (value) {
            cm.setValue(value);
        }
        $item.find('.brtc-va-refine-addcolumn-newcolumn-name').on('change', function (event) {
            // _this.checkValidation();
        });
        cm.on('change', function (cMirror) {
            // _this.checkValidation();
        });

        $item.find('.brtc-va-refine-addcolumn-newcolumn-remove').click(function () {
            $(this).closest('.brtc-va-refine-addcolumn-newcolumn-item').remove();
            // _this.checkValidation();
        });

        //첫번째 item에 remove버튼 hide 기능
        //this.sortableStopCallback.hideRemoveButton(this, 'brtc-va-refine-addcolumn-newcolumn-item', 'brtc-va-refine-addcolumn-newcolumn-remove');
    };

    AddColumnDialog.prototype.createSelect = function () {
        var itemList = this.$mainControl.find('.brtc-va-refine-addcolumn-newcolumn-item');
        var select = 'SELECT *';
        var cnt = 0;
        $.each(itemList, function (key, value) {
            if (cnt < itemList.length) {
                select += ', \n';
                cnt++;
            }
            var newColumn = $(itemList[key]).find('.brtc-va-refine-addcolumn-newcolumn-name').val();
            var cm = $(itemList[key]).find('.CodeMirror')[0].CodeMirror;
            var newValue = cm.getValue();
            select += newValue + ' as `' + newColumn + '`';
        });
        select = select + '\nFROM #{DF(0)}';

        return {query: select};
    };

    AddColumnDialog.prototype.handleOkClicked = function () {
        this.dialogResult.param = this.createSelect();
        Brightics.VA.Dialogs.Dialog.prototype.handleOkClicked.call(this);
    };

    AddColumnDialog.prototype.fillControlValues = function () {
        this.columnData = this.popupProperty.getColumnsOfInTable(0, ["number", "string"]).map(function (col) {
            return col.name;
        });
    };

    AddColumnDialog.prototype.renderAddColumn = function () {
        if (this.options.fnUnit.param) {
            var select = this.options.fnUnit.param.query;
            var res = select.split("\n");
            if (res[res.length - 1].endsWith('FROM #{DF(0)}')) {
                res.splice(res.length - 1, 1);
            }
            if (res[0].startsWith('SELECT *')) {
                res.splice(0, 1);
            }

            for (var i = 0; i < res.length; i++) {
                var pos = res[i].lastIndexOf(' as ');
                var newValue = res[i].substring(0, pos).trim();
                var newColumn = res[i].substring(pos + 4).trim();
                newColumn = newColumn.replace(/`/gi, '');
                if (newColumn.slice(-1) == ',') {
                    newColumn = newColumn.substring(0, newColumn.length - 1);
                }

                this.createNewColumnItem(newColumn, newValue);
            }
        } else {
            this.createNewColumnItem();
        }
        // this.checkValidation();
    };

    AddColumnDialog.prototype.checkValidation = function () {
        var _this = this;
        var itemList = this.$mainControl.find('.brtc-va-refine-addcolumn-newcolumn-item');

        // this.removeValidation();

        var newColumnNames = [];
        $.each(itemList, function (key, value) {
            var newColumn = $(itemList[key]).find('.brtc-va-refine-addcolumn-newcolumn-name').val();
            var cm = $(itemList[key]).find('.CodeMirror')[0].CodeMirror;
            var newValue = cm.getValue();
            if (newColumn === '' && newValue === '') {
                _this.addProblem(_this.createProblem({
                    errorCode: 'BR-0033',
                    paramIndex: key,
                    param: 'New column name',
                    messageParam: ['New column name', 'Value']
                }));
            } else if (newColumn === '') {
                _this.addProblem(_this.createProblem({
                    errorCode: 'BR-0033',
                    paramIndex: key,
                    param: 'New column name',
                    messageParam: ['New column name']
                }));
            } else if ($.inArray(newColumn, newColumnNames) > -1) {
                let messageParam = "New column name(s) - '" + newColumn + "' already exist.";
                _this.addProblem(_this.createProblem({
                    errorCode: 'BR-0100',
                    paramIndex: key,
                    param: 'New column name',
                    messageParam: [messageParam]
                }));
            } else if ($.inArray(newColumn, $.map(_this.options.columns, function (column) {
                return column.name
            })) > -1) {
                let messageParam = "New column name(s) - '" + newColumn + "' already exist.";
                _this.addProblem(_this.createProblem({
                    errorCode: 'BR-0100',
                    paramIndex: key,
                    param: 'New column name',
                    messageParam: [messageParam]
                }));
            }
            else {
                if (newValue === '') {
                    _this.addProblem(_this.createProblem({
                        errorCode: 'BR-0033',
                        paramIndex: key,
                        param: 'Value',
                        messageParam: ['Value']
                    }));
                }
                newColumnNames.push(newColumn);
            }

        });
        this.renderValidation();
    };

    AddColumnDialog.prototype.renderValidation = function () {
        var _this = this;
        $.each(this.problems, function (key, problem) {
            var itemList = _this.$mainControl.find('.brtc-va-refine-addcolumn-newcolumn-item');
            if (problem.code == 'BR-0033') {
                _this.createValidationContent($(itemList[problem.paramIndex]), problem);
            } else {
                _this.createValidationContent($(itemList[problem.paramIndex]), problem,
                    problem.param == 'New column name'//'Value'
                        ? $(itemList[problem.paramIndex]).find('.brtc-va-refine-addcolumn-newcolumn-name')
                        : $(itemList[problem.paramIndex]).find('.CodeMirror'));
            }
            // validation 전체에 margin-left
            _this.$mainControl.find('.brtc-va-refine-step-validation-tooltip').css({
                'width': '465px',
                'margin-left': '30px'
            });
        });
    };

    Brightics.VA.Core.Dialogs.FunctionProperties.AddColumnDialog = AddColumnDialog;

}).call(this);