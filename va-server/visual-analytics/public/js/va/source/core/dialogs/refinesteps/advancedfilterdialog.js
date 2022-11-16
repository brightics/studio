/**
 * Created by daewon77.park on 2016-08-20.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function AdvancedFilterDialog(parentId, options) {
        Brightics.VA.Core.Dialogs.RefineSteps.StepDialog.call(this, parentId, options);
    }

    AdvancedFilterDialog.prototype = Object.create(Brightics.VA.Core.Dialogs.RefineSteps.StepDialog.prototype);
    AdvancedFilterDialog.prototype.constructor = AdvancedFilterDialog;

    AdvancedFilterDialog.prototype.getTitle = function () {
        return 'Advanced Filter';
    };

    AdvancedFilterDialog.prototype.createDialogContentsArea = function ($parent) {
        $parent.append('' +
            '<div class="brtc-va-refine-advanced-filter-container">' +
            '   <textarea class="brtc-va-refine-filter-conditioneditor"></textarea>' +
            '</div>');

        this.render($parent);
    };

    AdvancedFilterDialog.prototype.render = function ($parent) {
        var _this = this;
        var tables = {};
        for (var i = 0; i < this.options.columns.length; i++) {
            tables[this.options.columns[i].name] = [this.options.columns[i].name];
        }
        this.cm = CodeMirror.fromTextArea($parent.find('.brtc-va-refine-filter-conditioneditor')[0], {
            mode: 'text/x-sql',
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
        this.cm.setSize('100%', 'calc(100% - 20px)');
        // hint를 close하기 위해 Esc 누르는 경우, dialog가 같이 close되는 것 방지.
        Brightics.VA.Core.Utils.WidgetUtils.adjustCodeMirrorEsc(this.cm);

        if (this.options.param) {
            this.cm.setValue(this.options.param['additional-query']);
        } else {
            this.cm.setValue('WHERE ');
        }
        this.cmMarker = this.cm.markText({line: 0, ch: 0}, {line: 0, ch: 6}, {readOnly: true, inclusiveLeft:true});
        this.checkValidation();

        this.cm.on('change', function () {
            _this.checkValidation();
        });
    };

    AdvancedFilterDialog.prototype.getAdditionalQueryString = function () {
        var advancedFilterString = this.cm.getValue();
        return advancedFilterString;
    };

    AdvancedFilterDialog.prototype.handleOkClicked = function () {

        if (this.problems.length > 0) {
            Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('Please check the query statement.');
        } else {
            var select = '*';
            var additionalQuery = this.getAdditionalQueryString();
            this.buildFunctionUnit('Advanced Filter', 'advancedFilter', select, additionalQuery);
            Brightics.VA.Core.Dialogs.RefineSteps.StepDialog.prototype.handleOkClicked.call(this);
        }
    };

    AdvancedFilterDialog.prototype.buildFunctionUnit = function (label, func, select, additionalQuery) {
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

    AdvancedFilterDialog.prototype.buildScript = function (select, additionalQuery) {
        var script = this.DEFAULT_SCRIPT;
        var strSelect = select.replace(/\n/g, '');
        var strAdditionalQuery = additionalQuery.replace(/\n/g, '');
        script = script.replace('${SELECT_SQL}', strSelect);
        script = script.replace('${ADDITIONAL_QUERY}', strAdditionalQuery);
        return script;
    };

    AdvancedFilterDialog.prototype.checkValidation = function () {
        var _this = this;
        this.removeValidation();

        var whereRange = this.cmMarker.find();
        var lastLine = this.cm.getDoc().lastLine();
        var lastCh = this.cm.getDoc().getLine(lastLine).length;
        var whereValue = this.cm.getDoc().getRange(whereRange.to, {line: lastLine, ch: lastCh});
        if (whereValue === '') {
            _this.addProblem(_this.createProblem({
                errorCode: 'BR-0033',
                paramIndex: 0,
                param: 'Filter',
                messageParam: ['Filter statement']
            }));
        }

        this.renderValidation();
    };

    AdvancedFilterDialog.prototype.renderValidation = function () {
        var contents = this.$mainControl.find('.brtc-va-refine-advanced-filter-container');
        if (this.problems.length)
            this.createValidationContent($(contents), this.problems[0]);
    };


    Brightics.VA.Core.Dialogs.RefineSteps.AdvancedFilterDialog = AdvancedFilterDialog;

}).call(this);