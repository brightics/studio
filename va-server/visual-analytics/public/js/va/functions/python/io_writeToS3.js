(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    /**************************************************************************
     *                                 FnUnit                                  
     *************************************************************************/
    Brightics.VA.Core.Functions.Library.writeToS3 = {
        "category": "io",
        "defaultFnUnit": {
            "func": "writeToS3",
            "name": "brightics.function.io$write_to_s3",
            "label": {
                "en": "Write to S3", 
                "ko": "AWS S3에 데이터 쓰기"
            },
            "inputs": {
                "table": ""
            },
            "meta": {
                "table": {
                    "type": "table"
                }
            },
            "param": {
                "datasource": {
                    "metadata": "s3",
                    "datasourceName": ""
                },
                "object_key": ""
            },
            "version": "3.6",
            "context" :"python",
            "display": {
                "label": "Write to S3",
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
            "en": "Write a csv file to Amazon S3.",
            "ko": "CSV 파일을 AWS S3 버킷에 업로드합니다."
        },
        "mandatory": [],
        "tags": {
            "en": [
                "Load",
                "S3",
                "Reader",
                "unload",
                "write"
            ],
            "ko": [
                "불러오기",
                "S3",
                "읽기",
                "내보내기",
                "쓰기"
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
    var PARAM_OBJECT_KEY = 'object_key';

    function WriteToS3Properties(parentId, options) {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.call(this, parentId, options);
    }

    WriteToS3Properties.prototype = Object.create(Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype);
    WriteToS3Properties.prototype.constructor = WriteToS3Properties;

    WriteToS3Properties.prototype.createControls = function () {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype.createControls.call(this);
    };

    WriteToS3Properties.prototype.getPrimaryOperation = function () {
        return 'brightics.function.io$write_to_s3';
    };

    WriteToS3Properties.prototype.createContentsAreaControls = function ($parent) {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype.createContentsAreaControls.call(this, $parent);

        this.render = {
            [PARAM_META_DATA]: this.renderDataSource,
            [PARAM_OBJECT_KEY]: this.renderObjectKey
        };


        this.createDataSourceControl();
        this.createObjectKeyControl();
    };

    WriteToS3Properties.prototype.createDataSourceControl = function () {
        var _this = this;
        var source = {
            datatype: 'json',
            datafields: [
                {name: 'datasourceName', type: 'string'},
                {name: 'datasourceType', type: 'string'}
            ],
            url: 'api/admin/v2/s3'
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
                    metadata: 's3',
                    datasourceName: _this.$dataSourceControl.val()
                });
                _this.executeCommand(command);
            });
        }, {mandatory: true});
    };

    WriteToS3Properties.prototype.createObjectKeyControl = function () {
        var _this = this;
        this.$objectKeyControl = $('<input class="brtc-va-editors-sheet-controls-inputcontrol"/>');
        this.addPropertyControl('Object Key', function ($parent) {
            $parent.append(_this.$objectKeyControl);
            _this.$objectKey = _this.createInput(_this.$objectKeyControl, {
                placeHolder: 'Enter a Object Key.'
            });
            _this.$objectKey.on('change', function () {
                var command = _this.createSetParameterValueCommand(PARAM_OBJECT_KEY, _this.$objectKey.val(), false);
                if (command) _this.executeCommand(command);
            });
        }, {mandatory: true});
    };

    WriteToS3Properties.prototype.renderObjectKey = function () {
        var objectKeyValue = this.options.fnUnit.param[PARAM_OBJECT_KEY];
        this.$objectKey.val(objectKeyValue);
    };

    WriteToS3Properties.prototype.renderDataSource = function () {
        var dataSource = this.options.fnUnit.param[PARAM_META_DATA][PARAM_DATA_SOURCE];
        if (dataSource) {
            this.$dataSourceControl.jqxDropDownList('val', dataSource);
        } else {
            this.$dataSourceControl.jqxDropDownList('clearSelection');
        }
    };

    WriteToS3Properties.prototype.renderValidation = function () {
        const paramAreaMap = {
            [PARAM_DATA_SOURCE]: this.$dataSourceControl.parent(),
            [PARAM_OBJECT_KEY]: this.$objectKeyControl
        };
        for (let problem of this.problems) {
            const $area = paramAreaMap[problem.param];
            if ($area) this.showValidation($area, problem);
        }
    };

    Brightics.VA.Core.Functions.Library.writeToS3.propertiesPanel = WriteToS3Properties;
}).call(this);

/**************************************************************************
 *                               Validator                                 
 *************************************************************************/

(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function WriteToS3Validator(fnUnit) {
        Brightics.VA.Core.Validator.BaseValidator.call(this, fnUnit);
    }

    WriteToS3Validator.prototype = Object.create(Brightics.VA.Core.Validator.BaseValidator.prototype);
    WriteToS3Validator.prototype.constructor = WriteToS3Validator;

    WriteToS3Validator.prototype.initRules = function () {
        this.addDatasourceRule();
        this.addObjectKeyRule();
    };

    WriteToS3Validator.prototype.addDatasourceRule = function () {
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

    WriteToS3Validator.prototype.addObjectKeyRule = function () {
        var _this = this;
        this.addRule(function (fnUnit) {
            var messageInfo = {
                errorCode: 'BR-0033',
                param: 'object_key',
                messageParam: ['Object Key']
            };
            return _this._checkStringIsEmpty(messageInfo, fnUnit, fnUnit.param.object_key);
        });
    };

    Brightics.VA.Core.Functions.Library.writeToS3.validator = WriteToS3Validator;
}).call(this);