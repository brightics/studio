(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    /**************************************************************************
     *                                 FnUnit                                  
     *************************************************************************/
    Brightics.VA.Core.Functions.Library.readFromS3 = {
        "category": "io",
        "defaultFnUnit": {
            "func": "readFromS3",
            "name": "brightics.function.io$read_from_s3",
            "label": {
                "en": "Read from S3", 
                "ko": "AWS S3에서 읽기"
            },
            "outputs": {
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
                "label": "Read from S3",
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
            "en": "Read a csv file from Amazon S3.",
            "ko": "AWS S3에 있는 csv 파일을 읽어옵니다."
        },
        "mandatory": [],
        "tags": {
            "en": [
                "Load",
                "S3",
                "Reader",
                "unload"
            ],
            "ko": [
                "읽기",
                "S3",
                "불러오기",
                "내보내기"
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
    var PARAM_OBJECT_KEY = 'object_key';

    function ReadFromS3Properties(parentId, options) {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.call(this, parentId, options);
    }

    ReadFromS3Properties.prototype = Object.create(Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype);
    ReadFromS3Properties.prototype.constructor = ReadFromS3Properties;

    ReadFromS3Properties.prototype.createControls = function () {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype.createControls.call(this);
    };

    ReadFromS3Properties.prototype.getPrimaryOperation = function () {
        return 'brightics.function.io$read_from_s3';
    };

    ReadFromS3Properties.prototype.createContentsAreaControls = function ($parent) {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype.createContentsAreaControls.call(this, $parent);

        this.render = {
            [PARAM_META_DATA]: this.renderDataSource,
            [PARAM_OBJECT_KEY]: this.renderObjectKey
        };

        this.createDataSourceControl();
        this.createObjectKeyControl();
    };

    ReadFromS3Properties.prototype.createDataSourceControl = function () {
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

    ReadFromS3Properties.prototype.createObjectKeyControl = function () {
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

    ReadFromS3Properties.prototype.renderObjectKey = function () {
        var objectKeyValue = this.options.fnUnit.param[PARAM_OBJECT_KEY];
        this.$objectKey.val(objectKeyValue);
    };

    ReadFromS3Properties.prototype.renderDataSource = function () {
        var dataSource = this.options.fnUnit.param.datasource[PARAM_DATA_SOURCE];
        if (dataSource) {
            this.$dataSourceControl.jqxDropDownList('val', dataSource);
        } else {
            this.$dataSourceControl.jqxDropDownList('clearSelection');
        }
    };

    ReadFromS3Properties.prototype.renderValidation = function () {
        const paramAreaMap = {
            [PARAM_DATA_SOURCE]: this.$dataSourceControl.parent(),
            [PARAM_OBJECT_KEY]: this.$objectKeyControl
        };
        for (let problem of this.problems) {
            const $area = paramAreaMap[problem.param];
            if ($area) this.showValidation($area, problem);
        }
    };

    Brightics.VA.Core.Functions.Library.readFromS3.propertiesPanel = ReadFromS3Properties;
}).call(this);

/**************************************************************************
 *                               Validator                                 
 *************************************************************************/

(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ReadFromS3Validator(fnUnit) {
        Brightics.VA.Core.Validator.BaseValidator.call(this, fnUnit);
    }

    ReadFromS3Validator.prototype = Object.create(Brightics.VA.Core.Validator.BaseValidator.prototype);
    ReadFromS3Validator.prototype.constructor = ReadFromS3Validator;

    ReadFromS3Validator.prototype.initRules = function () {
        this.addDatasourceRule();
        this.addObjectKeyRule();
    };

    ReadFromS3Validator.prototype.addDatasourceRule = function () {
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

    ReadFromS3Validator.prototype.addObjectKeyRule = function () {
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

    Brightics.VA.Core.Functions.Library.readFromS3.validator = ReadFromS3Validator;
}).call(this);