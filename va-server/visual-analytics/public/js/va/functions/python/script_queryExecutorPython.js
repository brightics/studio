(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    /**************************************************************************
     *                                 FnUnit
     *************************************************************************/
    Brightics.VA.Core.Functions.Library.queryExecutorPython = {
        "category": "script",
        "defaultFnUnit": {
            "func": "queryExecutorPython",
            "name": "brightics.function.transform$sql_execute",
            "label": {
                "en": "Query Executor", 
                "ko": "쿼리 실행기"
            },
            "context": "python",
            "version": "3.6",
            "param": {
                "query": "SELECT "
            },
            "inputs": {
                "tables": []
            },
            "outputs": {
                "out_table": ""
            },
            "meta": {
                "tables": {
                    "type": "table", 'range':{'min':1, 'max':10}
                },
                "out_table": {
                    "type": "table"
                }
            },
            "display": {
                "label": "Query Executor",
                "diagram": {
                    "position": {
                        "x": 20,
                        "y": 10
                    }
                },
                "sheet": {
                    "in": {
                        "partial": [
                            {
                                "panel": [],
                                "layout": {}
                            }
                        ],
                        "full": [
                            {
                                "panel": [],
                                "layout": {}
                            }
                        ]
                    },
                    "out": {
                        "partial": [
                            {
                                "panel": [],
                                "layout": {}
                            }
                        ],
                        "full": [
                            {
                                "panel": [],
                                "layout": {}
                            }
                        ]
                    }
                }
            }
        },
        "description": {
            "en": "This function returns value for executed SQL Query.",
            "ko": "실행된 SQL 쿼리에 대한 값을 반환합니다."
        },
        "tags": {
            "en": [
                "SQL Executor",
                "SQLExecutor",
                "SQL",
                "Query",
                "Preprocessing",
                "Filter",
                "Missing Values",
                "Manipulation",
                "Column Extraction",
                "Table Schema Transform",
                "Query Executor"
            ],
            "ko": [
                "SQL 실행기",
                "SQL실행기",
                "SQL",
                "쿼리",
                "전처리",
                "필터",
                "결측치",
                "열 추출",
                "테이블 스키마 변환",
                "쿼리 실행기"
            ]
        },
        "in-range": {
            "min": 1,
            "max": 8
        },
        "out-range": {
            "min": 1,
            "max": 1
        }
    };

}).call(this);
/**************************************************************************
 *                           Properties Panel
 *************************************************************************/
/**
 * Created by daewon77.park on 2016-08-19.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function queryExecutorPythonProperties(parentId, options) {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.call(this, parentId, options);
    }

    queryExecutorPythonProperties.prototype = Object.create(Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype);
    queryExecutorPythonProperties.prototype.constructor = queryExecutorPythonProperties;

    queryExecutorPythonProperties.prototype.createContentsAreaControls = function ($parent) {
        Brightics.VA.Core.Editors.Sheet.Panels.BasePanel.prototype.createContentsAreaControls.call(this, $parent);

        this.FnUnitInputs = brtc_require('FnUnitInputs');

        this.PARAM_FULL_QUERY = 'query';

        this.render = {
            'query': this.renderQueryStatement
        };

        this.createSelectControl();
        this.customizeElementClass();
    };

    queryExecutorPythonProperties.prototype.fillControlValues = function () {
        var _this = this;
        this.columnData = this.dataMap ? this.FnUnitUtils.getInTable(this.options.fnUnit)[0] ? this.dataMap[this.FnUnitUtils.getInTable(this.options.fnUnit)[0]].columns : [] : [];
        this.hintList = [];

        for (var i in this.FnUnitUtils.getInTable(this.options.fnUnit)) {
            this.hintList.push('#{DF(' + i + ')}');
        }

        for (var i in this.columnData) {
            this.hintList.push(this.columnData[i].name);
        }

        var option = {
            url: 'api/va/v3/ws/functions/' + this.options.fnUnit.func,
            type: 'GET',
            blocking: false,
            contentType: 'application/json; charset=utf-8'
        };
        $.ajax(option).done(function (data) {
            var list = data.hintList;
            for(var i in list) {
                _this.hintList.push(list[i])
            }
        }).fail(function (err) {
            Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(err);
        });
    };

    queryExecutorPythonProperties.prototype.createControls = function () {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype.createControls.call(this);

        this.retrieveTableInfo(this.FnUnitUtils.getInTable(this.options.fnUnit));
    };

    queryExecutorPythonProperties.prototype.createContentsAreaControls = function ($parent) {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype.createContentsAreaControls.call(this, $parent);

        this.PARAM_FULL_QUERY = 'query';

        this.render = {
            'query': this.renderQueryStatement
        };

        this.createSelectControl();
        this.customizeElementClass();
    };

    queryExecutorPythonProperties.prototype.createSelectControl = function () {
        var _this = this;

        this.addPropertyControl('SQL', function ($parent) {
            var $sqlArea = $('<textarea class="brtc-va-editors-sheet-controls-sqlcontrol"></textarea>');
            $parent.append($sqlArea);

            _this.sqlEditViewer = _this.createTextAreaControl($sqlArea, {
                verifier: new Brightics.VA.Core.Verifier.SqlVerifier(),
                mode: "text/x-sql",
                theme: "default",
                indentWithTabs: true,
                smartIndent: true,
                lineNumbers: false,
                matchBrackets: true,
                autofocus: false,
                readOnly: 'nocursor'
            });

            _this.sqlEditViewer.$mainControl.parent().children('.CodeMirror').on('mousedown', function () {
                $(window).trigger('mousedown');

                new Brightics.VA.Core.Dialogs.SqlEditorDialog(_this.$mainControl, {
                    title: "SQL",
                    window: {
                        width: 1400,
                        height: 700,
                        minWidth: 700,
                        minHeight: 400,
                        maxWidth: 1400,
                        maxHeight: 700,
                        resizable: true
                    },
                    mode: "text/x-sql",
                    additionalHint: _this.hintList,
                    fnUnit: _this.options.fnUnit,
                    statement: _this.sqlEditViewer.codeMirror.getValue(),
                    tables: _this.getInputTables(),
                    scriptType: 'SQL Editor',
                    close: function (event) {
                        if (event.OK) {
                            _this.redrawQueryStatement(event.queryStatement);

                            var command = _this.createQueryStatementCommand(event.queryStatement);
                            _this.executeCommand(command);
                        }
                    }
                });

            });
        }, {mandatory: true});
    };

    queryExecutorPythonProperties.prototype.getInputTables = function () {
        var model = this.options.fnUnit.parent();
        var fid = this.options.fnUnit.fid;
        var tables = [];
        var previous = model.getPrevious(fid);
        for (var i in previous) {
            var prevFnUnit = model.getFnUnitById(previous[i]);
            for (var j in prevFnUnit[OUT_DATA]) {
                var table = {
                    name: prevFnUnit[OUT_DATA][j],
                    label: 'Out of ' + prevFnUnit.display.label,
                    columns: []
                };
                if (prevFnUnit[OUT_DATA].length > 1) {
                    table.label = (parseInt(j) + 1) + 'th ' + table.label;
                }
                if (this.dataMap[table.name]) {
                    table.columns = this.dataMap[table.name].columns;
                }
                tables.push(table);
                break;
            }
        }
        return tables;
    };

    queryExecutorPythonProperties.prototype.renderQueryStatement = function () {
        var queryStatement = this.options.fnUnit.param[this.PARAM_FULL_QUERY];

        this.redrawQueryStatement(queryStatement);
    };

    queryExecutorPythonProperties.prototype.renderAliasNames = function () {

    };

    queryExecutorPythonProperties.prototype.redrawQueryStatement = function (queryStatement) {
        this.sqlEditViewer.setValue(queryStatement);

        this.selectMarker = this.sqlEditViewer.codeMirror.markText({line: 0, ch: 0}, {line: 0, ch: 7}, {
            readOnly: true,
            inclusiveLeft: true,
            atomic: true
        });
        this.sqlEditViewer.codeMirror.setSize('100%', '100%');
    };

    queryExecutorPythonProperties.prototype.customizeElementClass = function () {
        var _this = this;
        _this.$mainControl.find('.brtc-va-editors-sheet-panels-basepanel-contents-area').addClass('flex');
        var $propertyControl = _this.$mainControl.find('.brtc-va-editors-sheet-controls-propertycontrol').addClass('sql');
        var $propertyControlContents = $propertyControl.find('.brtc-va-editors-sheet-controls-propertycontrol-contents').addClass('sql-contents');
        $propertyControlContents.find('.brtc-va-editors-sheet-controls-wrapper').addClass('sql-wrapper');
    };

    queryExecutorPythonProperties.prototype.createQueryStatementCommand = function (queryStatement) {
        var commandOption = {
            fnUnit: this.options.fnUnit,
            ref: {param: {}}
        };

        commandOption.ref.param[this.PARAM_FULL_QUERY] = queryStatement;

        return new Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitParameterValueCommand(this, commandOption);
    };

    queryExecutorPythonProperties.prototype.renderValidation = function () {
        for (var i in this.problems) {
            if (this.problems[i].param == 'query') {
                this.createValidationContent(this.scalaScriptViewer.$mainControl.parent(), this.problems[i])
            }
        }
    };

    Brightics.VA.Core.Functions.Library.queryExecutorPython.propertiesPanel = queryExecutorPythonProperties;
}).call(this);
/**************************************************************************
 *                               Validator
 *************************************************************************/
/**
 * Created by ng1123.kim on 2016-03-21.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function queryExecutorPythonValidator() {
        this.PARAM_COLUMNS = 'columns';

        Brightics.VA.Core.Validator.SingleInputValidator.call(this);
    }

    queryExecutorPythonValidator.prototype = Object.create(Brightics.VA.Core.Validator.SingleInputValidator.prototype);
    queryExecutorPythonValidator.prototype.constructor = queryExecutorPythonValidator;

    queryExecutorPythonValidator.prototype.initRules = function () {
        Brightics.VA.Core.Validator.SingleInputValidator.prototype.initRules.call(this);

        this.addColumnsRule();
    };

    queryExecutorPythonValidator.prototype.addColumnsRule = function () {
        var _this = this;
        this.addRule(function (fnUnit) {
            var problems = [];

            if (fnUnit.param.script == '') {
                problems.push(_this.problemFactory.createProblem({
                    errorCode: 'BR-0033',
                    param: 'script',
                    messageParam: ['Script']
                }, fnUnit));
            }
            return problems;
        });
    };

    queryExecutorPythonValidator.prototype.addLinkRule = function () {
        var _this = this;
        this.addRule(function (fnUnit) {
            return _this.checkLinkIsConnected(fnUnit);
        });
    };

    queryExecutorPythonValidator.prototype.checkLinkIsConnected = function (fnUnit) {
        var messageInfo = {
            errorCode: 'EL001',
            messageParam: [fnUnit.display.label]
        };
        if (!this._hasPrevious(fnUnit)) return this.problemFactory.createProblem(messageInfo, fnUnit);
    };

    Brightics.VA.Core.Functions.Library.queryExecutorPython.validator = queryExecutorPythonValidator;

}).call(this);