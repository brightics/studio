(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    /**************************************************************************
     *                                 FnUnit                                  
     *************************************************************************/
    Brightics.VA.Core.Functions.Library.readFromDb = {
        "category": "io",
        "defaultFnUnit": {
            "func": "readFromDb",
            "name": "brightics.function.io$read_from_db",
            "label": {
                "en": "Read from DB", 
                "ko": "DB 읽기"
            },
            "param": {
                "datasource": {
                    "metadata": "datasource",
                    "datasourceName": ""
                },
                "sql": "SELECT "
            },
            "meta": {
                "table": {
                    "type": "table"
                }
            },
            "context": "python",
            "version": "3.6",
            "outputs": {
                "table": ""
            },
            "display": {
                "label": "Read from DB",
                "diagram": {
                    "position": {
                        "x": 20,
                        "y": 10
                    }
                },
                "sheet": {
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
            "en": "Read data from database.",
            "ko": "데이터베이스에서 데이터를 읽어옵니다."
        },
        "mandatory": [],
        "tags": {
            "en": [
                "Load",
                "DB Reader",
                "DB",
                "Reader",
                "unload",
                "hdfs"
            ],
            "ko": [
                "불러오기",
                "DB 읽기",
                "DB",
                "읽기",
                "내보내기",
                "hdfs"
            ]
        },
        "in-range": {
            "min": 0,
            "max": 0
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
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    var PARAM_META_DATA = 'datasource';
    var PARAM_DATA_SOURCE = 'datasourceName';
    var PARAM_QUERY_STATEMENT = 'sql';

    function ReadFromDBProperties(parentId, options) {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.call(this, parentId, options);
    }

    ReadFromDBProperties.prototype = Object.create(Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype);
    ReadFromDBProperties.prototype.constructor = ReadFromDBProperties;

    ReadFromDBProperties.prototype.createControls = function () {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype.createControls.call(this);
        this.setContentsEditable(false);
    };

    ReadFromDBProperties.prototype.getPrimaryOperation = function () {
        return 'brightics.function.io$read_from_db';
    };

    ReadFromDBProperties.prototype.createContentsAreaControls = function ($parent) {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype.createContentsAreaControls.call(this, $parent);

        this.render = {
            [PARAM_META_DATA]: this.renderDataSource,
            [PARAM_QUERY_STATEMENT]: this.renderQueryStatement
        };

        this.createDataSourceControl();
        this.createQueryStatementControl();
    };
    
    ReadFromDBProperties.prototype.createDataSourceControl = function () {
        var _this = this;
        var source = {
            datatype: 'json',
            datafields: [
                {name: 'datasourceName', type: 'string'},
                {name: 'datasourceType', type: 'string'}
            ],
            url: 'api/va/v2/datasources?type=RDB'
        };
        var dataAdapter = new $.jqx.dataAdapter(source);

        this.addPropertyControl('Data Source', function ($parent) {
            _this.$dataSourceControl = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-combobox"/>');
            $parent.append(_this.$dataSourceControl);

            _this.$dataSourceControl.on('bindingComplete', function (event) {
                _this.setContentsEditable(true);
            });

            _this.createDropDownList(_this.$dataSourceControl, {
                source: dataAdapter,
                displayMember: 'datasourceName',
                valueMember: 'datasourceName',
                placeHolder: 'Select DataSource'
            });
            _this.$dataSourceControl.on('change', function (event) {
                var command = _this.createSetParameterValueCommand('datasource', {
                    metadata: 'datasource',
                    datasourceName: _this.$dataSourceControl.val()
                });
                _this.executeCommand(command);
            });
        }, {mandatory: true});
    };

    ReadFromDBProperties.prototype.createQueryStatementControl = function () {
        var _this = this;

        this.addPropertyControl('Query Statement', function ($parent) {
            var $sqlArea = $('<textarea class="brtc-va-editors-sheet-controls-sqlcontrol"></textarea>');
            $parent.append($sqlArea);

            _this.sqlEditViewer = _this.createTextAreaControl($sqlArea, {
                verifier: new Brightics.VA.Core.Verifier.SqlVerifier(),
                mode: 'text/x-sql',
                theme: 'default',
                indentWithTabs: true,
                smartIndent: true,
                lineNumbers: false,
                matchBrackets: true,
                autofocus: false,
                readOnly: 'nocursor'
            });

            _this.sqlEditViewer.$mainControl.parent().children('.CodeMirror').on('mousedown', function () {
                new Brightics.VA.Core.Dialogs.DBReaderSqlEditorDialog(_this.$mainControl, {
                    mode: 'text/x-sql',
                    additionalHint: _this.hintList,
                    fnUnit: _this.options.fnUnit,
                    statement: _this.sqlEditViewer.codeMirror.getValue(),
                    scriptType: 'SQL Editor',
                    scriptOnly: true,
                    close: function (event) {
                        if (event.OK) {
                            _this.redrawQueryStatement(event.queryStatement);

                            var command = _this.createSetParameterValueCommand(
                                'sql', event.queryStatement, false);
                            if (command) _this.executeCommand(command);

                            // _this.executeCommand(command);
                        }
                    },
                    title: 'Query Statement'
                });

            });
        }, {mandatory: true});
    };

    ReadFromDBProperties.prototype.redrawQueryStatement = function (queryStatement) {
        this.sqlEditViewer.setValue(queryStatement);

        this.selectMarker = this.sqlEditViewer.codeMirror.markText({line: 0, ch: 0}, {line: 0, ch: 7}, {
            readOnly: true,
            inclusiveLeft: true,
            atomic: true
        });
        this.sqlEditViewer.codeMirror.setSize('100%', '300px');
    };

    ReadFromDBProperties.prototype.renderDataSource = function () {
        var dataSource = this.options.fnUnit.param[PARAM_META_DATA][PARAM_DATA_SOURCE];
        if (dataSource) {
            this.$dataSourceControl.jqxDropDownList('val', dataSource);
        } else {
            this.$dataSourceControl.jqxDropDownList('clearSelection');
        }
    };

    ReadFromDBProperties.prototype.renderQueryStatement = function () {
        var queryStatement = this.options.fnUnit.param[PARAM_QUERY_STATEMENT];
        this.redrawQueryStatement(queryStatement);
    };

    ReadFromDBProperties.prototype.renderValidation = function () {
        const paramAreaMap = {
            [PARAM_DATA_SOURCE]: this.$dataSourceControl.parent()
        };
        for (let problem of this.problems) {
            const $area = paramAreaMap[problem.param];
            if ($area) this.showValidation($area, problem);
        }
    };

    Brightics.VA.Core.Functions.Library.readFromDb.propertiesPanel = ReadFromDBProperties;
}).call(this);

/**************************************************************************
 *                               Validator                                 
 *************************************************************************/

(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function readFromDbValidator(fnUnit) {
        Brightics.VA.Core.Validator.BaseValidator.call(this, fnUnit);
    }

    readFromDbValidator.prototype = Object.create(Brightics.VA.Core.Validator.BaseValidator.prototype);
    readFromDbValidator.prototype.constructor = readFromDbValidator;

    readFromDbValidator.prototype.initRules = function () {
        this.addDatasourceRule();
    };

    readFromDbValidator.prototype.addDatasourceRule = function () {
        var _this = this;
        this.addRule(function (fnUnit) {
            var messageInfo = {
                errorCode: 'BR-0033',
                param: 'datasourceName',
                messageParam: ['Data Source']
            };
            return _this._checkStringIsEmpty(messageInfo, fnUnit,
                fnUnit.param.datasource.datasourceName);
        });
    };

    Brightics.VA.Core.Functions.Library.readFromDb.validator = readFromDbValidator;
}).call(this);
