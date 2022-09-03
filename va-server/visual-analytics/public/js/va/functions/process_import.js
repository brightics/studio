(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    /**************************************************************************
     *                                 FnUnit                                  
     *************************************************************************/
    Brightics.VA.Core.Functions.Library.import = {
        "category": "process",
        "defaultFnUnit": {
            "func": "import",
            "name": "ImportData",
            "inData": [],
            "outData": [],
            "param": {
                "copy-from": "alluxio",
                "column-type": [],
                "input-path": "",
                "output-path": "/shared/upload/",
                "delimiter": ",",
                "quote": "\"",
                "is-delete": "false",
                "array-delimiter": ":",
                "array-start-string": "[",
                "array-end-string": "]",
                "key-value-delimiter": "=",
                "map-start-string": "{",
                "map-end-string": "}",
                "null-value": "",
                "nan-value": "NaN",
                "table-name": "",
                "datasource-name": "",
                "connection-timeout": "",
                "execution-timeout": ""
            },
            "display": {
                "label": "Import Data",
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
        "mandatory": [
            "delimiter",
            "quote",
            "array-delimiter",
            "array-start-string",
            "array-end-string",
            "key-value-delimiter",
            "map-start-string",
            "map-end-string",
            "null-value",
            "nan-value"
        ],
        "tags": [
            "ImportData",
            "Import Data",
            "alluxio",
            "postgre",
            "load",
            "oracle"
        ],
        "description": "Import data.",
        "in-range": {
            "min": 1,
            "max": 20
        },
        "out-range": {
            "min": 0,
            "max": 10
        }
    };
    
}).call(this);
/**************************************************************************
 *                           Properties Panel                              
 *************************************************************************/
/**
 * Created by daewon77.park on 2016-02-18.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ImportProperties(parentId, options) {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.call(this, parentId, options);
    }

    ImportProperties.prototype = Object.create(Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype);
    ImportProperties.prototype.constructor = ImportProperties;

    ImportProperties.prototype.createControls = function () {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype.createControls.call(this);

        this.renderFlag = true;        
        this.renderValues();
        Studio.getInstance().doValidate(this.options.fnUnit.parent());
        this.options.isRendered = true;
    };

    ImportProperties.prototype.createContentsAreaControls = function ($parent) {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype.createContentsAreaControls.call(this, $parent);

        this.DATA_PARAM = {
            'copy-from': { label: 'Import From', type: 'radio', category: 'source' },
            'input-path': { label: 'Input Path', type: 'code', category: 'source', mandatory: true },
            'ip': { label: 'IP', type: 'code', category: 'source' },
            'port': { label: 'Port', category: 'source' },
            'output-path': { label: 'Output Path', type: 'code', category: 'target', mandatory: true },
            'datasource-name': { label: 'Datasource', type: 'dropDown', category: 'source', mandatory: true },
            'table-name': { label: 'Table Name', type: 'code', category: 'source', mandatory: true },
            'column-type': {
                label: 'Column Type',
                type: 'code',
                category: 'source',
                placeholder: 'ex. Int, String, String',
                mandatory: true
            },
            'delimiter': { label: 'Delimiter', type: 'radio', category: 'source' },
            'quote': { label: 'Quote', type: 'radio', category: 'source' },
            'array-delimiter': { label: 'Array Delimiter', type: 'radio', category: 'source' },
            'array-start-string': { label: 'Array Start', type: 'radio', category: 'source' },
            'array-end-string': { label: 'Array End', type: 'radio', category: 'source' },
            'key-value-delimiter': { label: 'Key Value', type: 'radio', category: 'source' },
            'map-start-string': { label: 'Map Start', type: 'radio', category: 'source' },
            'map-end-string': { label: 'Map End', type: 'radio', category: 'source' },
            'is-delete': { label: 'Overwrite', type: 'radio', category: 'target' },
            'connection-timeout': {
                label: 'Connection Timeout(sec)',
                type: 'number',
                category: 'source',
                placeholder: 'Default: 600',
                max: 3000
            },
            'execution-timeout': {
                label: 'Execution Timeout(sec)', type: 'number', category: 'source',
                placeholder: 'Default: 600',
                max: 3000
            }
        };

        this.RADIO_DATA_PARAM = {
            'copy-from': [
                { label: 'Repository', value: 'alluxio' },
                { label: 'HDFS', value: 'hdfs' },
                { label: 'Relational DB', value: 'jdbc' }
            ],
            'delimiter': [
                { label: 'Comma', value: ',' }, { label: 'Tab', value: '\t' },
                { label: 'Space', value: ' ' }, { label: 'Colon', value: ':' },
                { label: 'Semicolon', value: ';' }, { label: 'Other', value: 'Other' }
            ],
            'quote': [
                { label: 'Double Quotation', value: '"' }, { label: 'Other', value: 'Other' }
            ],
            'array-delimiter': [
                { label: 'Colon', value: ':' }, { label: 'Other', value: 'Other' }
            ],
            'array-start-string': [
                { label: 'Left Square Bracket', value: '[' }, { label: 'Other', value: 'Other' }
            ],
            'array-end-string': [
                { label: 'Right Square Bracket', value: ']' }, { label: 'Other', value: 'Other' }
            ],
            'key-value-delimiter': [
                { label: 'Equal', value: '=' }, { label: 'Other', value: 'Other' }
            ],
            'map-start-string': [
                { label: 'Left Curly Bracket', value: '{' }, { label: 'Other', value: 'Other' }
            ],
            'map-end-string': [
                { label: 'Right Curly Bracket', value: '}' }, { label: 'Other', value: 'Other' }
            ],
            'is-delete': [{ label: 'True', value: 'true' }, { label: 'False', value: 'false' }]
        };

        this.PARAM_VISIBLE = {
            'hdfs': ['copy-from', 'column-type', 'input-path', 'ip', 'port', 'output-path', 'delimiter', 'quote', 'array-delimiter', 'array-start-string', 'array-end-string', 'key-value-delimiter', 'map-start-string', 'map-end-string', 'is-delete'],
            'jdbc': ['copy-from', 'column-type', 'datasource-name', 'output-path', 'is-delete', 'table-name', 'connection-timeout', 'execution-timeout'],
            'alluxio': ['copy-from', 'column-type', 'input-path', 'output-path', 'delimiter', 'quote', 'array-delimiter', 'array-start-string', 'array-end-string', 'key-value-delimiter', 'map-start-string', 'map-end-string', 'is-delete']
        };

        this.createImportDataButtonControl();
        this.createConfigurationControl();
    };

    ImportProperties.prototype.createImportDataButtonControl = function () {
        var _this = this;

        this.addPropertyControl("Setting Configuration", function ($parent) {
            _this.$importDataButton = $('<input class="brtc-va-editors-sheet-panels-properties-button" type="button" value="Setting"/>');
            $parent.append(_this.$importDataButton);

            _this.$importDataButton.jqxButton({
                theme: Brightics.VA.Env.Theme,
                width: '100%',
                height: 25
            });

            _this.$importDataButton.click(function () {
                new Brightics.VA.Core.Dialogs.ImportDataSettingDialog(_this.$mainControl, {
                    param: _this.options.fnUnit.param,
                    close: function (dialogResult) {
                        if (dialogResult.OK && dialogResult.results) {
                            var param = dialogResult.results;
                            _this.createConfigurationCommand(param);
                            _this.renderParameters(param);
                        }
                    },
                    title: 'Setting Configuration'
                });
            });
        });
    };

    ImportProperties.prototype.createConfigurationControl = function () {
        var _this = this;

        this.addPropertyControl("Configuration", function ($parent) {
            _this.$configurationArea = $('<div class="brtc-va-import-data-configuration-area"></div>');
            $parent.append(_this.$configurationArea);
        });
    };

    ImportProperties.prototype.fillControlValues = function () {

    }

    ImportProperties.prototype.renderValues = function (command) {
        var param = this.options.fnUnit.param;
        this.renderParameters(param);
    };

    ImportProperties.prototype.renderParameters = function (param) {
        this.$configurationArea.empty();
        this.createCategoryControl(this.$configurationArea, 'source');
        this.createCategoryControl(this.$configurationArea, 'target');
        this.setParamControlVisible(this.options.fnUnit.param['copy-from']);
    };

    ImportProperties.prototype.createCategoryControl = function ($contents, category) {
        var keyList = Object.keys(this.DATA_PARAM);
        var $argsArea, key;

        $contents.append('<div class="brtc-category-label">' + category + '</div>');

        for (var i = 0; i < keyList.length; i++) {
            key = keyList[i];
            if (this.DATA_PARAM[key].category !== category) continue;

            $argsArea = $('' +
                '<div class="control-row brtc-va-propertiespanel-import-data" control-type="' + key + '">' +
                '   <div class="column-1"><div class="point-icon"/>' + this.DATA_PARAM[key].label + '</div>' +
                '   <div class="column-2"/>' +
                '</div>');
            $argsArea.find('.column-1').addClass(key);
            if (this.DATA_PARAM[key].mandatory) $argsArea.find('.column-1').addClass('mandatory');
            $contents.append($argsArea);

            var param = this.options.fnUnit.param;
            this.createArgumentControl($argsArea, key);
            this.setArgumentValue(key, param[key] || '');
        }
    };

    ImportProperties.prototype.createArgumentControl = function ($parent, key) {
        var $control = $('<input type="text" class="brtc-va-views-properties-pages-controls-propertycontrol-input" param-key="' + key + '"/>');
        $parent.find('.column-2').append($control);
        this.createInput($control, {
            disabled: true
        });
    };

    ImportProperties.prototype.setArgumentValue = function (key, value) {
        var $control = this.$mainControl.find('.brtc-va-views-properties-pages-controls-propertycontrol-input[param-key="' + key + '"]');
        if (key === 'copy-from' || key === 'copy-to') {
            var label;
            for (var i = 0; i < this.RADIO_DATA_PARAM[key].length; i++) {
                if (this.RADIO_DATA_PARAM[key][i].value === value) {
                    label = this.RADIO_DATA_PARAM[key][i].label;
                    break;
                }
            }
            value = label || value;
        }
        $control.val(value);
    };

    ImportProperties.prototype.setParamControlVisible = function (copyFromType) {
        var allControlList = Object.keys(this.DATA_PARAM);
        var visibleControlList = this.PARAM_VISIBLE[copyFromType];
        var controlTr;

        for (var i = 0; i < allControlList.length; i++) {
            controlTr = this.$mainControl.find('div[control-type=' + allControlList[i] + ']');
            if (visibleControlList.indexOf(allControlList[i]) >= 0) {
                controlTr.css('display', '');
            } else {
                controlTr.css('display', 'none');
            }
        }

        if (copyFromType === 'jdbc') {
            this.$mainControl.find('.column-type').removeClass('mandatory');
        } else {
            this.$mainControl.find('.column-type').addClass('mandatory');
        }
    };

    ImportProperties.prototype.renderValidation = function () {
        for (var i in this.problems) {
            if (this.problems[i].param === 'column-type') {
                this.createValidationContent(this.$parent.find("input[param-key='column-type']").parent().parent(), this.problems[i]);
            } else if (this.problems[i].param === 'table-name') {
                this.createValidationContent(this.$parent.find("input[param-key='table-name']").parent().parent(), this.problems[i]);
            } else if (this.problems[i].param === 'datasource-name') {
                this.createValidationContent(this.$parent.find("input[param-key='datasource-name']").parent().parent(), this.problems[i]);
            } else if (this.problems[i].param === 'input-path') {
                this.createValidationContent(this.$parent.find("input[param-key='input-path']").parent().parent(), this.problems[i]);
            } else if (this.problems[i].param === 'output-path') {
                this.createValidationContent(this.$parent.find("input[param-key='output-path']").parent().parent(), this.problems[i]);
            } else if (this.problems[i].param === 'ip') {
                this.createValidationContent(this.$parent.find("input[param-key='ip']").parent().parent(), this.problems[i]);
            } else if (this.problems[i].param === 'port') {
                this.createValidationContent(this.$parent.find("input[param-key='port']").parent().parent(), this.problems[i]);
            }
        }
    };    

    ImportProperties.prototype.createConfigurationCommand = function (param) {
        var commandOption = {
            fnUnit: this.options.fnUnit,
            ref: { param: param }
        };

        var command = new Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitParameterValueCommand(this, commandOption);
        this.executeCommand(command);
    };

    Brightics.VA.Core.Functions.Library.import.propertiesPanel = ImportProperties;
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

    const COLUMN_TYPES = ['int', 'long', 'string', 'double', 'boolean', 'array(double)', 'array(string)', 'map(int,double)', 'map(string,double)'];

    function ImportValidator(fnUnit) {
        Brightics.VA.Core.Validator.BaseValidator.call(this, fnUnit);
    }

    ImportValidator.prototype = Object.create(Brightics.VA.Core.Validator.BaseValidator.prototype);
    ImportValidator.prototype.constructor = ImportValidator;

    ImportValidator.prototype.initRules = function () {
        this.addInputPathRule();
        // this.addColumnTypeRule();
        this.addDataSourceRule();
        this.addTableNameRule();
        this.addIpRule();
        this.addPortRule()
        this.addOutPathRule();
    };

    ImportValidator.prototype.addInputPathRule = function () {
        var _this = this;

        this.addRule(function (unit) {
            return _this.isEmptyValue(unit, 'input-path', unit.param['input-path'], 'Input Path');
        });
    };

    ImportValidator.prototype.addColumnTypeRule = function () {
        var _this = this;

        this.addRule(function (unit) {
            return _this.isEmptyValue(unit, 'column-type', unit.param['column-type'][0], 'Column Type');
        });
        this.addRule(function (unit) {
            var problems = [];
            if (_this.isEmptyCondition(unit.param['column-type'][0])) return;

            for (var i in unit.param['column-type']) {
                var type = unit.param['column-type'][i].toLowerCase().trim();
                if ($.inArray(type, COLUMN_TYPES) < 0) {
                    problems.push(this.problemFactory.createProblem({
                        errorCode: 'ET001',
                        messageParam: ['Column Type'],
                        param: 'column-type'
                    }, unit));
                    break;
                }
            }
            return problems;
        });
    };

    ImportValidator.prototype.addDataSourceRule = function () {
        var _this = this;

        this.addRule(function (unit) {
            return _this.isEmptyValue(unit, 'datasource-name', unit.param['datasource-name'], 'DataSource');
        });
    };

    ImportValidator.prototype.addTableNameRule = function () {
        var _this = this;

        this.addRule(function (unit) {
            return _this.isEmptyValue(unit, 'table-name', unit.param['table-name'], 'Table Name');
        });
    };

    ImportValidator.prototype.addOutPathRule = function () {
        var _this = this;

        this.addRule(function (unit) {
            return _this.isEmptyValue(unit, 'output-path', unit.param['output-path'], 'Output Path');
        });
        this.addRule(function (unit) {
            var problem = _this.isEmptyValue(unit, 'output-path', unit.param['output-path'], 'Output Path');

            var PATH_SHARED = '/shared/upload';
            var PATH_USERS = '/' + Studio.getSession().userId + '/upload';

            if (!problem) {
                if (!unit.param['output-path'].startsWith(PATH_SHARED) && !unit.param['output-path'].startsWith(PATH_USERS)) {
                    return this.problemFactory.createProblem({
                        errorCode: 'EP001',
                        messageParam: ['Output Path'],
                        param: 'output-path'
                    }, unit);
                }
            }
        });
    };

    ImportValidator.prototype.addIpRule = function () {
        var _this = this;

        this.addRule(function (unit) {
            return _this.isEmptyValue(unit, 'ip', unit.param['ip'], 'IP');
        });
    };

    ImportValidator.prototype.addPortRule = function () {
        var _this = this;

        this.addRule(function (unit) {
            return _this.isEmptyValue(unit, 'port', unit.param['port'], 'Port');
        });
    };

    ImportValidator.prototype.isEmptyValue = function (unit, param, value, label) {
        var problems;
        if (this.isEmptyCondition(value)) {
            problems = this.problemFactory.createProblem({
                errorCode: 'BR-0033',
                messageParam: [label],
                param: param
            }, unit)
        }
        return problems;
    };

    ImportValidator.prototype.isEmptyCondition = function (paramValue) {
        return (paramValue === undefined || paramValue === null || paramValue.trim() === '');
    };

    Brightics.VA.Core.Functions.Library.import.validator = ImportValidator;

}).call(this);