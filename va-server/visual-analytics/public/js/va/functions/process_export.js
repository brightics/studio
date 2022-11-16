(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    /**************************************************************************
     *                                 FnUnit                                  
     *************************************************************************/
    Brightics.VA.Core.Functions.Library.export = {
        "category": "process",
        "defaultFnUnit": {
            "func": "export",
            "name": "ExportData",
            "inData": [],
            "outData": [],
            "param": {
                "copy-to": "alluxio",
                "input-path": "/shared/upload/",
                "output-path": "",
                "delimiter": ",",
                "header": "true",
                "quote": "\"",
                "array-delimiter": ":",
                "array-start-string": "[",
                "array-end-string": "]",
                "key-value-delimiter": "=",
                "map-start-string": "{",
                "map-end-string": "}",
                "null-value": "",
                "table-name": "",
                "datasource-name": "",
                "is-delete": "true",
                "is-append": "false",
                "connection-timeout": "",
                "login-timeout": "",
                "socket-timeout": "",
                "lock-timeout": ""
            },
            "display": {
                "label": "Export Data",
                "description": "",
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
        "mandatory": [
            "delimiter",
            "quote",
            "array-delimiter",
            "array-start-string",
            "array-end-string",
            "key-value-delimiter",
            "map-start-string",
            "map-end-string",
            "null-value"
        ],
        "tags": [
            "ExportData",
            "Export Data",
            "unload",
            "file"
        ],
        "description": "Export data.",
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

    function ExportProperties(parentId, options) {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.call(this, parentId, options);
    }

    ExportProperties.prototype = Object.create(Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype);
    ExportProperties.prototype.constructor = ExportProperties;

    ExportProperties.prototype.createControls = function () {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype.createControls.call(this);

        this.renderFlag = true;
        this.renderValues();
        Studio.getInstance().doValidate(this.options.fnUnit.parent());
        this.options.isRendered = true;
    };

    ExportProperties.prototype.createContentsAreaControls = function ($parent) {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype.createContentsAreaControls.call(this, $parent);

        this.DATA_PARAM = {
            'input-path': {label: 'Input Path', type: 'code', category: 'source', mandatory: true},
            'copy-to': {label: 'Export To', type: 'radio', category: 'target'},
            'ip': {label: 'IP', type: 'code', category: 'target', mandatory: true},
            'port': {label: 'Port', category: 'target', mandatory: true},
            'output-path': {label: 'Output Path', type: 'code', category: 'target', mandatory: true},
            'delimiter': {label: 'Delimiter', type: 'radio', category: 'target'},
            'header': {label: 'Header', type: 'radio', category: 'target'},
            'quote': {label: 'Quote', type: 'radio', category: 'target'},
            'array-delimiter': {label: 'Array Delimiter', type: 'radio', category: 'target'},
            'array-start-string': {label: 'Array Start', type: 'radio', category: 'target'},
            'array-end-string': {label: 'Array End', type: 'radio', category: 'target'},
            'key-value-delimiter': {label: 'Key Value', type: 'radio', category: 'target'},
            'map-start-string': {label: 'Map Start', type: 'radio', category: 'target'},
            'map-end-string': {label: 'Map End', type: 'radio', category: 'target'},
            'datasource-name': {label: 'Datasource', type: 'dropDown', category: 'target', mandatory: true},
            'table-name': {label: 'Table Name', type: 'code', category: 'target', mandatory: true},
            'is-delete': {label: 'Overwrite', type: 'radio', category: 'target'},
            'connection-timeout': {
                label: 'Connection Timeout(sec)',
                type: 'number',
                category: 'target',
                placeholder: 'Default: 600',
                max: 3000
            },
            'login-timeout': {
                label: 'Login Timeout(sec)', type: 'number', category: 'target',
                placeholder: 'Default: 600',
                max: 3000
            },
            'socket-timeout': {
                label: 'Socket Timeout(sec)', type: 'number', category: 'target',
                placeholder: 'Default: 600',
                max: 3000
            },
            'lock-timeout': {
                label: 'Lock Timeout(sec)', type: 'number', category: 'target',
                placeholder: 'Default: 600',
                max: 3000
            }
        };

        this.RADIO_DATA_PARAM = {
            'copy-to': [
                {label: 'Repository', value: 'alluxio'},
                {label: 'HDFS', value: 'hdfs'},
                {label: 'Relational DB', value: 'jdbc'}
            ],
            'delimiter': [
                {label: 'Comma', value: ','}, {label: 'Tab', value: '\t'},
                {label: 'Space', value: ' '}, {label: 'Colon', value: ':'},
                {label: 'Semicolon', value: ';'}, {label: 'Other', value: 'Other'}
            ],
            'header': [{label: 'True', value: 'true'}, {label: 'False', value: 'false'}],
            'quote': [
                {label: 'Double Quotation', value: '"'}, {label: 'Other', value: 'Other'}
            ],
            'array-delimiter': [
                {label: 'Colon', value: ':'}, {label: 'Other', value: 'Other'}
            ],
            'array-start-string': [
                {label: 'Left Square Bracket', value: '['}, {label: 'Other', value: 'Other'}
            ],
            'array-end-string': [
                {label: 'Right Square Bracket', value: ']'}, {label: 'Other', value: 'Other'}
            ],
            'key-value-delimiter': [
                {label: 'Equal', value: '='}, {label: 'Other', value: 'Other'}
            ],
            'map-start-string': [
                {label: 'Left Curly Bracket', value: '{'}, {label: 'Other', value: 'Other'}
            ],
            'map-end-string': [
                {label: 'Right Curly Bracket', value: '}'}, {label: 'Other', value: 'Other'}
            ],
            'is-delete': [{label: 'True', value: 'true'}, {label: 'False', value: 'false'}]
        };

        this.PARAM_VISIBLE = {
            'hdfs': ['copy-to', 'input-path', 'ip', 'port', 'output-path', 'delimiter', 'header', 'quote', 'array-delimiter', 'array-start-string', 'array-end-string', 'key-value-delimiter', 'map-start-string', 'map-end-string', 'is-delete'],
            'jdbc': ['copy-to', 'datasource-name', 'input-path', 'is-delete', 'table-name', 'connection-timeout', 'login-timeout', 'socket-timeout', 'lock-timeout'],
            'alluxio': ['copy-to', 'input-path', 'output-path', 'delimiter', 'header', 'quote', 'array-delimiter', 'array-start-string', 'array-end-string', 'key-value-delimiter', 'map-start-string', 'map-end-string', 'is-delete']
        };

        this.createExportDataButtonControl();
        this.createConfigurationControl();
    };

    ExportProperties.prototype.createExportDataButtonControl = function () {
        var _this = this;

        this.addPropertyControl("Setting Configuration", function ($parent) {
            _this.$exportDataButton = $('<input class="brtc-va-editors-sheet-panels-properties-button" type="button" value="Setting"/>');
            $parent.append(_this.$exportDataButton);

            _this.$exportDataButton.jqxButton({
                theme: Brightics.VA.Env.Theme,
                width: '100%',
                height: 25
            });

            _this.$exportDataButton.click(function () {
                new Brightics.VA.Core.Dialogs.ExportDataSettingDialog(_this.$mainControl, {
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

    ExportProperties.prototype.createConfigurationControl = function () {
        var _this = this;

        this.addPropertyControl("Configuration", function ($parent) {
            _this.$configurationArea = $('<div class="brtc-va-export-data-configuration-area"></div>');
            $parent.append(_this.$configurationArea);
        });
    };

    ExportProperties.prototype.fillControlValues = function () {

    }

    ExportProperties.prototype.renderValues = function (command) {
        var param = this.options.fnUnit.param;
        this.renderParameters(param);
    };

    ExportProperties.prototype.renderParameters = function (param) {
        this.$configurationArea.empty();
        this.createCategoryControl(this.$configurationArea, 'source');
        this.createCategoryControl(this.$configurationArea, 'target');
        this.setParamControlVisible(this.options.fnUnit.param['copy-to']);
    };

    ExportProperties.prototype.createCategoryControl = function ($contents, category) {
        var keyList = Object.keys(this.DATA_PARAM);
        var $argsArea, key;

        $contents.append('<div class="brtc-category-label">' + category + '</div>');

        for (var i = 0; i < keyList.length; i++) {
            key = keyList[i];
            if (this.DATA_PARAM[key].category !== category) continue;

            $argsArea = $('' +
                '<div class="control-row brtc-va-propertiespanel-export-data" control-type="' + key + '">' +
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

    ExportProperties.prototype.createArgumentControl = function ($parent, key) {
        var $control = $('<input type="text" class="brtc-va-views-properties-pages-controls-propertycontrol-input" param-key="' + key + '"/>');
        $parent.find('.column-2').append($control);
        this.createInput($control, {
            disabled: true
        });
    };

    ExportProperties.prototype.setArgumentValue = function (key, value) {
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

    ExportProperties.prototype.setParamControlVisible = function (copyFromType) {
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

    ExportProperties.prototype.renderValidation = function () {
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

    ExportProperties.prototype.createConfigurationCommand = function (param) {
        var commandOption = {
            fnUnit: this.options.fnUnit,
            ref: { param: param }
        };

        var command = new Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitParameterValueCommand(this, commandOption);
        this.executeCommand(command);
    };

    Brightics.VA.Core.Functions.Library.export.propertiesPanel = ExportProperties;

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

    function ExportValidator(fnUnit) {
        Brightics.VA.Core.Validator.BaseValidator.call(this, fnUnit);
    }

    ExportValidator.prototype = Object.create(Brightics.VA.Core.Validator.BaseValidator.prototype);
    ExportValidator.prototype.constructor = ExportValidator;

    ExportValidator.prototype.initRules = function () {
        this.addInputPathRule();
        this.addDataSourceRule();
        this.addTableNameRule();
        this.addIpRule();
        this.addPortRule();
        this.addOutPathRule();
    };

    ExportValidator.prototype.addInputPathRule = function () {
        var _this = this;

        this.addRule(function (unit) {
            return _this.isEmptyValue(unit, 'input-path', unit.param['input-path'], 'Input Path');
        });
    };

    ExportValidator.prototype.addDataSourceRule = function () {
        var _this = this;

        this.addRule(function (unit) {
            return _this.isEmptyValue(unit, 'datasource-name', unit.param['datasource-name'], 'DataSource');
        });
    };

    ExportValidator.prototype.addTableNameRule = function () {
        var _this = this;

        this.addRule(function (unit) {
            return _this.isEmptyValue(unit, 'table-name', unit.param['table-name'], 'Table Name');
        });
    };

    ExportValidator.prototype.addOutPathRule = function () {
        var _this = this;

        this.addRule(function (unit) {
            return _this.isEmptyValue(unit, 'output-path', unit.param['output-path'], 'Output Path');
        });
        this.addRule(function (unit) {
            var problem = _this.isEmptyValue(unit, 'output-path', unit.param['output-path'], 'Output Path');

            var PATH_SHARED = '/shared/upload';
            var PATH_USERS = '/' + Studio.getSession().userId + '/upload';

            if (!problem) {
                if (unit.param['output-path'].startsWith(PATH_SHARED) || unit.param['output-path'].startsWith(PATH_USERS)) {
                    return this.problemFactory.createProblem({
                        errorCode: 'EP002',
                        messageParam: ['Output Path'],
                        param: 'output-path'
                    }, unit);
                }
            }
        });
    };

    ExportValidator.prototype.addIpRule = function () {
        var _this = this;

        this.addRule(function (unit) {
            return _this.isEmptyValue(unit, 'ip', unit.param['ip'], 'IP');
        });
    };

    ExportValidator.prototype.addPortRule = function () {
        var _this = this;

        this.addRule(function (unit) {
            return _this.isEmptyValue(unit, 'port', unit.param['port'], 'Port');
        });
    };

    ExportValidator.prototype.isEmptyValue = function (unit, param, value, label) {
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

    ExportValidator.prototype.isEmptyCondition = function (paramValue) {
        return (paramValue === undefined || paramValue === null || paramValue.trim() === '');
    };

    Brightics.VA.Core.Functions.Library.export.validator = ExportValidator;

}).call(this);