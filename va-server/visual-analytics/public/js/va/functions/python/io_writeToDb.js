(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    /**************************************************************************
     *                                 FnUnit                                  
     *************************************************************************/
    Brightics.VA.Core.Functions.Library.writeToDb = {
        "category": "io",
        "defaultFnUnit": {
            "func": "writeToDb",
            "name": "brightics.function.io$write_to_db",
            "label": {
                "en": "Write to DB", 
                "ko": "DB에 쓰기"
            },
            "param": {
                "datasource": {
                    "metadata": "datasource",
                    "datasourceName": ""
                },
                "tableName": "",
                "ifExists": "fail"
            },
            "meta": {
                "table": {
                    "type": "table"
                }
            },
            "context": "python",
            "version": "3.6",
            "inputs": {
                "table": ""
            },
            "display": {
                "label": "Write to DB",
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
                    }
                }
            }
        },
        "description": {
            "en": "Write data to database.",
            "ko": "데이터를 DB에 저장합니다."
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
            "min": 1,
            "max": 1
        },
        "out-range": {
            "min": 0,
            "max": 0
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
    var PARAM_TABLE_NAME = 'tableName';
    var PARAM_IF_EXISTS = 'ifExists';

    function writeToDbProperties(parentId, options) {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.call(this, parentId, options);
    }

    writeToDbProperties.prototype = Object.create(Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype);
    writeToDbProperties.prototype.constructor = writeToDbProperties;

    writeToDbProperties.prototype.createControls = function () {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype.createControls.call(this);
        this.setContentsEditable(false);
    };

    writeToDbProperties.prototype.getPrimaryOperation = function () {
        return 'brightics.function.io$write_to_db';
    };

    writeToDbProperties.prototype.createContentsAreaControls = function ($parent) {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype.createContentsAreaControls.call(this, $parent);

        this.render = {
            [PARAM_META_DATA]: this.renderDataSource,
            [PARAM_TABLE_NAME]: this.renderTableName,
            [PARAM_IF_EXISTS]: this.renderIfExists
        };

        this.createDataSourceControl();
        this.createTableNameControl();
        this.createIfExistsControl();
    };
    
    writeToDbProperties.prototype.createDataSourceControl = function () {
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

    
    writeToDbProperties.prototype.createTableNameControl = function () {
        var _this = this;
        this.$tableNameControl = $('<input class="brtc-va-editors-sheet-controls-inputcontrol"/>');
        this.addPropertyControl('Table Name', function ($parent) {
            $parent.append(_this.$tableNameControl);
            _this.$tableName = _this.createInput(_this.$tableNameControl, {
                placeHolder: 'Enter a Table Name.'
            });
            _this.$tableName.on('change', function () {
                var command = _this.createSetParameterValueCommand(PARAM_TABLE_NAME, _this.$tableName.val(), false);
                if (command) _this.executeCommand(command);
            });
        }, {mandatory: true});
    };

    writeToDbProperties.prototype.createIfExistsControl = function () {
        var _this = this;

        this.$IfExistsFailControl = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-radiobutton">Fail</div>');
        this.$IfExistsReplaceControl = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-radiobutton">Replace</div>');
        this.$IfExistsAppendControl = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-radiobutton">Append</div>');

        this.addPropertyControl('If Exists', function ($parent) {
            var $controls = [
                _this.$IfExistsFailControl,
                _this.$IfExistsReplaceControl,
                _this.$IfExistsAppendControl
            ];
            $parent.append($controls);
            $controls.forEach(($control) => {
                _this.createRadioButton($control, {width: '80', groupName: 'Group'});
            });

            _.zip($controls, ['fail', 'replace', 'append'])
                .forEach(([$control, value]) => {
                    $control.on('checked', (evt) => {
                        var command = _this.createSetParameterValueCommand(PARAM_IF_EXISTS, value);
                        _this.executeCommand(command);
                    });
                });
        }, {mandatory: true});
    };

    writeToDbProperties.prototype.renderDataSource = function () {
        var dataSource = this.options.fnUnit.param[PARAM_META_DATA][PARAM_DATA_SOURCE];
        if (dataSource) {
            this.$dataSourceControl.jqxDropDownList('val', dataSource);
        } else {
            this.$dataSourceControl.jqxDropDownList('clearSelection');
        }
    };

    writeToDbProperties.prototype.renderTableName = function () {
        var tableNameValue = this.options.fnUnit.param[PARAM_TABLE_NAME];
        this.$tableName.val(tableNameValue);
    };

    writeToDbProperties.prototype.renderIfExists = function () {
        var ifExistsValue = this.options.fnUnit.param[PARAM_IF_EXISTS];
        var target = ({
            'fail': this.$IfExistsFailControl,
            'replace': this.$IfExistsReplaceControl,
            'append': this.$IfExistsAppendControl
        })[ifExistsValue];
        if (target) target.jqxRadioButton('check');
    };

    writeToDbProperties.prototype.renderValidation = function () {
        const paramAreaMap = {
            [PARAM_DATA_SOURCE]: this.$dataSourceControl.parent(),
            [PARAM_TABLE_NAME]: this.$tableNameControl
        };
        for (let problem of this.problems) {
            const $area = paramAreaMap[problem.param];
            if ($area) this.showValidation($area, problem);
        }
    };

    Brightics.VA.Core.Functions.Library.writeToDb.propertiesPanel = writeToDbProperties;
}).call(this);

/**************************************************************************
 *                               Validator                                 
 *************************************************************************/

(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function writeToDbValidator(fnUnit) {
        Brightics.VA.Core.Validator.BaseValidator.call(this, fnUnit);
    }

    writeToDbValidator.prototype = Object.create(Brightics.VA.Core.Validator.BaseValidator.prototype);
    writeToDbValidator.prototype.constructor = writeToDbValidator;

    writeToDbValidator.prototype.initRules = function () {
        this.addDatasourceRule();
        this.addTableNameRule();
    };

    writeToDbValidator.prototype.addDatasourceRule = function () {
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

    writeToDbValidator.prototype.addTableNameRule = function () {
        var _this = this;
        this.addRule(function (fnUnit) {
            var messageInfo = {
                errorCode: 'BR-0033',
                param: 'tableName',
                messageParam: ['Table Name']
            };
            return _this._checkStringIsEmpty(messageInfo, fnUnit,
                fnUnit.param.tableName);
        });
    };

    Brightics.VA.Core.Functions.Library.writeToDb.validator = writeToDbValidator;
}).call(this);
