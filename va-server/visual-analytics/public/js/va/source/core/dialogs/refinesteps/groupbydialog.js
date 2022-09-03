/**
 * Created by daewon77.park on 2016-08-20.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function GroupByDialog(parentId, options) {
        Brightics.VA.Core.Dialogs.RefineSteps.StepDialog.call(this, parentId, options);
    }

    GroupByDialog.prototype = Object.create(Brightics.VA.Core.Dialogs.RefineSteps.StepDialog.prototype);
    GroupByDialog.prototype.constructor = GroupByDialog;

    GroupByDialog.prototype.getTitle = function () {
        return 'Group-by';
    };

    GroupByDialog.prototype.createDialogContentsArea = function ($parent) {
        $parent.append('' +
            '<div class="brtc-va-refine-groupby-container">' +
            '   <textarea class="brtc-va-refine-select-sqleditor"></textarea>' +
            '</div>');

        $parent.append('' +
            '<div class="brtc-va-refine-groupby-container">' +
            '   <textarea class="brtc-va-refine-groupby-sqleditor"></textarea>' +
            '</div>');

        this.render($parent);
    };

    GroupByDialog.prototype.render = function ($parent) {
        var _this = this;
        var tables = {};
        for (var i = 0; i < this.options.columns.length; i++) {
            tables[this.options.columns[i].name] = [this.options.columns[i].name];
        }
        this.selectCM = CodeMirror.fromTextArea($parent.find('.brtc-va-refine-select-sqleditor')[0], {
            mode: "text/x-sql",
            theme: "default",
            indentWithTabs: true,
            smartIndent: true,
            lineNumbers: true,
            matchBrackets: true,
            extraKeys: {"Ctrl-Space": "autocomplete"},
            hintOptions: {
                'tables': tables
            }
        });
        this.selectCM.setSize('100%', '80%');
        // hint를 close하기 위해 Esc 누르는 경우, dialog가 같이 close되는 것 방지.
        Brightics.VA.Core.Utils.WidgetUtils.adjustCodeMirrorEsc(this.selectCM);

        this.groupbyCM = CodeMirror.fromTextArea($parent.find('.brtc-va-refine-groupby-sqleditor')[0], {
            mode: "text/x-sql",
            theme: "default",
            indentWithTabs: true,
            smartIndent: true,
            lineNumbers: true,
            matchBrackets: true,
            extraKeys: {"Ctrl-Space": "autocomplete"},
            hintOptions: {
                'tables': tables
            }
        });
        this.groupbyCM.setSize('100%', '80%');
        // hint를 close하기 위해 Esc 누르는 경우, dialog가 같이 close되는 것 방지.
        Brightics.VA.Core.Utils.WidgetUtils.adjustCodeMirrorEsc(this.groupbyCM);

        if (this.options.param) {
            this.selectCM.setValue('SELECT ' + this.options.param['select']);
            this.groupbyCM.setValue(this.options.param['additional-query']);
        } else {
            this.selectCM.setValue('SELECT ');
            this.groupbyCM.setValue('GROUP BY ');
        }

        this.selectMarker = this.selectCM.markText({line: 0, ch: 0}, {line: 0, ch: 7}, {readOnly: true});
        this.groupByMarker = this.groupbyCM.markText({line: 0, ch: 0}, {line: 0, ch: 9}, {readOnly: true});

        this.checkValidation();

        this.selectCM.on('change', function (cMirror) {
            _this.checkValidation();
        });
        this.groupbyCM.on('change', function (cMirror) {
            _this.checkValidation();
        });
    };

    GroupByDialog.prototype.getAdditionalQueryString = function () {
        var groupByString = this.groupbyCM.getValue();
        return groupByString;
    };

    GroupByDialog.prototype.getSelectQueryString = function () {
        var selectRange = this.selectMarker.find();
        var lastLine = this.selectCM.getDoc().lastLine();
        var lastCh = this.selectCM.getDoc().getLine(lastLine).length;
        var selectValue = this.selectCM.getDoc().getRange(selectRange.to, {line: lastLine, ch: lastCh});

        var selectString = selectValue;
        return selectString;
    };

    GroupByDialog.prototype.handleOkClicked = function () {
        if (this.problems.length > 0) {
            Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('Please check the query statement.');
        } else {
            var select = this.getSelectQueryString();
            var additionalQuery = this.getAdditionalQueryString();

            this.buildFunctionUnit('Group By', 'groupBy', select, additionalQuery);
            Brightics.VA.Core.Dialogs.RefineSteps.StepDialog.prototype.handleOkClicked.call(this);
        }
    };

    GroupByDialog.prototype.buildFunctionUnit = function (label, func, select, additionalQuery) {
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

    GroupByDialog.prototype.buildScript = function (select, additionalQuery) {
        var script = this.DEFAULT_SCRIPT;
        var strSelect = select.replace(/\n/g, '');
        var strAdditionalQuery = additionalQuery.replace(/\n/g, '');
        script = script.replace('${SELECT_SQL}', strSelect);
        script = script.replace('${ADDITIONAL_QUERY}', strAdditionalQuery);
        return script;
    };

    GroupByDialog.prototype.checkValidation = function () {
        var _this = this;
        this.removeValidation();

        var selectRange = this.selectMarker.find();
        var lastLine1 = this.selectCM.getDoc().lastLine();
        var lastCh1 = this.selectCM.getDoc().getLine(lastLine1).length;
        var selectValue = this.selectCM.getDoc().getRange(selectRange.to, {line: lastLine1, ch: lastCh1});
        if (selectValue === '') {
            _this.addProblem(_this.createProblem({
                errorCode: 'BR-0033',
                paramIndex: 0,
                param: 'SELECT',
                messageParam: ['SELECT statement']
            }));
        }


        var groupByRange = this.groupByMarker.find();
        var lastLine = this.groupbyCM.getDoc().lastLine();
        var lastCh = this.groupbyCM.getDoc().getLine(lastLine).length;
        var groupbyValue = this.groupbyCM.getDoc().getRange(groupByRange.to, {line: lastLine, ch: lastCh});
        if (groupbyValue === '') {
            _this.addProblem(_this.createProblem({
                errorCode: 'BR-0033',
                paramIndex: 1,
                param: 'GROUP BY',
                messageParam: ['GROUP BY statement']
            }));
        }

        this.renderValidation();
    };

    GroupByDialog.prototype.renderValidation = function () {
        var _this = this;
        $.each(this.problems, function (key, problem) {
            var contents = _this.$mainControl.find('.brtc-va-refine-groupby-container');
            _this.createValidationContent($(contents[problem.paramIndex]), problem);
            //problem.param == 'SELECT'
            //? $(contents[problem.paramIndex]).find('.CodeMirror')
            //: $(contents[problem.paramIndex]).find('.CodeMirror'));
        });
    };

    Brightics.VA.Core.Dialogs.RefineSteps.GroupByDialog = GroupByDialog;

}).call(this);