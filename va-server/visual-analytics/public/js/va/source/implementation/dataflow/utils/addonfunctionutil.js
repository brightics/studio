/* global _ */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    const defaultSheetSpec = { 'partial': [{ 'panel': [], 'layout': {} }], 'full': [{ 'panel': [], 'layout': {} }] };
    const numberTypeList = ['Double', 'Integer', 'Long', 'Float'];

    function configureRange(functionSpec, contents) {
        let inRangeLength = Object.keys(contents.inputs).length;
        let outRangeLength = Object.keys(contents.outputs).length;

        functionSpec['in-range'] = {
            min: inRangeLength,
            max: inRangeLength
        };

        functionSpec['out-range'] = {
            min: outRangeLength,
            max: outRangeLength
        };
        return functionSpec;
    }

    function configureDistributedJdbcLoader(functionSpec, addonFunction, contents) {
        if (addonFunction.script_id) {
            if (contents.name === 'DistributedJdbcLoader') {
                functionSpec.defaultFnUnit.param = {
                    'sql': {
                        'metadata': 'sql',
                        'sqlId': addonFunction.script_id,
                        'condition': contents.params.reduce((prev, curr) => { prev[curr.id] = ''; return prev; }, {})
                    },
                    'datasource': {
                        'metadata': 'datasource',
                        'datasourceName': contents.datasourceVisible ? '' : contents.datasource
                    }
                };
                delete contents.context;
                delete contents.version;
                delete functionSpec.defaultFnUnit.context;
                delete functionSpec.defaultFnUnit.meta;
                delete functionSpec.defaultFnUnit.version;
                functionSpec.defaultFnUnit.outData = [];
                functionSpec['in-range'] = {
                    min: 0,
                    max: 0
                };

                functionSpec['out-range'] = {
                    min: 1,
                    max: 1
                };
                functionSpec.defaultFnUnit.persist = false; // for performance-mode or storage-mode
                functionSpec.defaultFnUnit['persist-mode'] = 'false'; // for user-mode
            } else {
                functionSpec.defaultFnUnit.param.script = {
                    'metadata': 'script',
                    'scriptId': addonFunction.script_id
                };
            }
        }
        return functionSpec;
    }


    function configureInputs(functionSpec, contents) {
        var checkInRange = contents.inrange && contents.inrange.min !== 0 && contents.inrange.max !== 0;
        var checkInRangeSpec = functionSpec['in-range'] && functionSpec['in-range'].min !== 0 && functionSpec['in-range'].max !== 0;

        if (contents.version === '3.6' && contents.inputs &&
            JSON.stringify(contents.inputs) !== JSON.stringify({})) {
            functionSpec.defaultFnUnit.display.sheet.in = defaultSheetSpec;
            functionSpec.defaultFnUnit.inputs = contents.inputs;
            functionSpec.defaultFnUnit.meta = contents.meta;
        } else if (checkInRange || checkInRangeSpec) {
            functionSpec.defaultFnUnit.display.sheet.in = defaultSheetSpec;
            if (contents.inputs) {
                functionSpec.defaultFnUnit.inputs = _.merge({}, contents.inputs);
            } else {
                functionSpec.defaultFnUnit.inData = [];
            }
        }
        return functionSpec;
    }

    function configureOutputs(functionSpec, contents) {
        var checkOutRange = contents.outrange && contents.outrange.min !== 0 && contents.outrange.max !== 0;
        var checkOutRangeSpec = functionSpec['out-range'] && functionSpec['out-range'].min !== 0 && functionSpec['out-range'].max !== 0;

        if (contents.version === '3.6' && contents.outputs &&
            JSON.stringify(contents.outputs) !== JSON.stringify({})) {
            functionSpec.defaultFnUnit.display.sheet.out = defaultSheetSpec;
            functionSpec.defaultFnUnit.outputs = contents.outputs;
            functionSpec.defaultFnUnit.meta = contents.meta;
        } else if (checkOutRange || checkOutRangeSpec) {
            functionSpec.defaultFnUnit.display.sheet.out = defaultSheetSpec;
            if (contents.outputs) {
                functionSpec.defaultFnUnit.outputs = _.merge({}, contents.outputs);
            } else {
                functionSpec.defaultFnUnit.outData = [];
            }
        }
        return functionSpec;
    }
    root.Brightics.VA.Implementation.DataFlow.Utils.AddonFunctionUtil = {
        addFunction: function (addonFunction) {
            let contents = typeof addonFunction.contents === 'string' ? JSON.parse(addonFunction.contents) : addonFunction.contents;
            var id = addonFunction.id;
            if (contents.isFunction === false || Brightics.VA.Implementation.DataFlow.Functions[id]) return;

            contents = Brightics.VA.Core.Utils.CommonUtils.configureFn(contents);

            var functionSpec = {
                'category': contents.category,
                'defaultFnUnit': {
                    'func': id,
                    'name': contents.name,
                    'param': {},
                    'display': {
                        'label': contents.label,
                        'diagram': {
                            'position': {'x': 20, 'y': 10}
                        },
                        'sheet': {}
                    },
                    'meta': contents.meta
                },
                'description': contents.description,
                'tags': contents.tags,
                'in-range': contents.inrange,
                'out-range': contents.outrange,
                'summary': contents.summary
            };
            // var defaultSheetSpec = {'partial': [{'panel': [], 'layout': {}}], 'full': [{'panel': [], 'layout': {}}]};
            // if (addonFunction.script_id) {
            //     functionSpec.defaultFnUnit.param.script = {
            //         "metadata": "script",
            //         "scriptId": addonFunction.script_id
            //     };
            // }
            //
            // if (contents.context) {
            //     functionSpec.defaultFnUnit.context = contents.context;
            // }
            //
            // if (contents.version) {
            //     functionSpec.defaultFnUnit.version = contents.version;
            // }
            //
            // if (contents.version === '3.6' && contents.inputs &&
            //     JSON.stringify(contents.inputs) !== JSON.stringify({})) {
            //     functionSpec.defaultFnUnit.display.sheet.in = defaultSheetSpec;
            //     functionSpec.defaultFnUnit.inputs = contents.inputs;
            //     functionSpec.defaultFnUnit.meta = contents.meta;
            // }
            // else if (contents.inrange && contents.inrange.min !== 0 && contents.inrange.max !== 0) {
            //     functionSpec.defaultFnUnit.display.sheet.in = defaultSheetSpec;
            //     if (contents.inputs) {
            //         functionSpec.defaultFnUnit.inputs = $.extend(true, {}, contents.inputs);
            //     } else {
            //         functionSpec.defaultFnUnit.inData = [];
            //     }
            // }
            //
            // if (contents.version === '3.6' && contents.outputs &&
            //     JSON.stringify(contents.outputs) !== JSON.stringify({})) {
            //     functionSpec.defaultFnUnit.display.sheet.out = defaultSheetSpec;
            //     functionSpec.defaultFnUnit.outputs = contents.outputs;
            //     functionSpec.defaultFnUnit.meta = contents.meta;
            // }
            // else if (contents.outrange && contents.outrange.min !== 0 && contents.outrange.max !== 0) {
            //     functionSpec.defaultFnUnit.display.sheet.out = defaultSheetSpec;
            //     if (contents.outputs) {
            //         functionSpec.defaultFnUnit.outputs = $.extend(true, {}, contents.outputs);
            //     } else {
            //         functionSpec.defaultFnUnit.outData = [];
            //     }
            // } else {
            //     // functionSpec['connectable-functions'] = [];
            // }
            //
            // if(contents.deprecated){
            //     functionSpec.deprecated = contents.deprecated;
            //     functionSpec["deprecated-message"] = contents["deprecated-message"] || '';
            // }
            //
            // var param = (contents.specJson ? contents.specJson.params : contents.params) || [];
            // functionSpec = this._setDefaultValues(functionSpec, param);

            functionSpec = configureDistributedJdbcLoader(functionSpec, addonFunction, contents);
            //3.5에서 3.6으로 넘어온 udf
            if (addonFunction.script_id && contents.script) {
                functionSpec = configureRange(functionSpec, contents);
            }

            if (contents.context) {
                functionSpec.defaultFnUnit.context = contents.context;
            }

            if (contents.version) {
                functionSpec.defaultFnUnit.version = contents.version;
            }

            if (contents.func) {
                functionSpec.defaultFnUnit.func_origin = contents.func;
                if (addonFunction.create_time && typeof addonFunction.create_time === 'string') {
                    // if (typeof moment === 'undefined') var moment = require('moment');
                    functionSpec.defaultFnUnit.func_created = moment(addonFunction.create_time).format('YYYY-MM-DD HH:mm:ss');
                }
            }

            functionSpec = configureInputs(functionSpec, contents);
            functionSpec = configureOutputs(functionSpec, contents);

            if (contents.deprecated) {
                functionSpec.deprecated = contents.deprecated;
                functionSpec['deprecated-message'] = contents['deprecated-message'] || '';
            }

            var param = (contents.specJson ? contents.specJson.params : contents.params) || [];
            functionSpec = this._setDefaultValues(functionSpec, param);

            Brightics.VA.Core.Functions.Library[id] = $.extend(true, {}, functionSpec);

            Brightics.VA.Implementation.DataFlow.Functions[id] = $.extend(true, {}, functionSpec);
            Brightics.VA.Implementation.DataFlow.Functions[id].propertiesPanel = this.createPropertiesPanel(contents.params);

            Brightics.VA.Implementation.DataFlow.Functions[id].validator = this.createValidator(contents);
        },
        _setDefaultValues: function (functionSpec, params) {
            // var param;
            // if (params) {
            //     for (var i = 0; i < params.length; i++) {
            //         param = params[i];
            //         if (typeof param.defaultValue !== 'undefined') {
            //             functionSpec.defaultFnUnit.param[param.id] = param.defaultValue;
            //         } else if (param.items && param.items.length > 0) {
            //             const list = param.items
            //                 .filter(item => !!item.default)
            //                 .reduce((state, item) => [...state, item.value], []);
            //             if (list.length === 1 &&
            //                 ['BooleanRadio', 'RadioButton'].some(control => control === param.control)) {
            //                 functionSpec.defaultFnUnit.param[param.id] = list[0];
            //             } else if (param.control === 'CheckBox' && list.length > 0) {
            //                 functionSpec.defaultFnUnit.param[param.id] = list;
            //             } else if (list.length > 1) {
            //                 functionSpec.defaultFnUnit.param[param.id] = list;
            //             }
            //         }
            //     }
            // }
            //
            // return functionSpec;

            var param;
            var target = functionSpec.defaultFnUnit.param;
            const isDataExtractor = functionSpec.defaultFnUnit.name === 'DistributedJdbcLoader';
            if (isDataExtractor) {
                target = functionSpec.defaultFnUnit.param.sql.condition;
            }
            if (params) {
                for (var i = 0; i < params.length; i++) {
                    param = params[i];
                    this._setDefaultValue(param, target, isDataExtractor);
                }
            }

            return functionSpec;
        },
        _checkStringNqAndWrapValue: function (type, value) {
            if (type === 'StringNQ') return { quote: false, value : value };
            return value;
        },
        _setArrayDefaultValue: function (param, target, isDataExtractor) {
            const list = param.items
                .filter(item => !!item.default)
                .reduce((state, item) => [...state, this._checkStringNqAndWrapValue(param.type, item.value)], []);
            if (list.length === 1 &&
                ['DropDownList', 'BooleanRadio', 'RadioButton'].some(control => control === param.control)) {
                target[param.id] = list[0];
            } else if (param.control === 'CheckBox' && list.length > 0) {
                target[param.id] = list;
            } else if (list.length > 1) {
                target[param.id] = list;
            } else {
                if (param.nullValue) {
                    if (isDataExtractor) {
                        target[param.id] = { quote: false, value: param.nullValue };
                    } else {
                        target[param.id] = param.nullValue.split(',');
                        if (param.type && numberTypeList.indexOf(param.type) >= 0) {
                            target[param.id] = target[param.id].map(x => Number(x));
                        }
                    }
                }
            }
        },
        _setDataExtractorDefaultValue: function (param, target) {
            if (['ItemSelector', 'LoadItemSelector', 'InputBox'].some(control => control === param.control)) {
                if (!param.nullValue) {
                    target[param.id] = this._checkStringNqAndWrapValue(param.type, '');
                }
                else target[param.id] = { quote: false, value: param.nullValue };
            } else if (param.control === 'DateTimeInput') {
                // if (typeof moment === 'undefined') var moment = require('moment');
                var defaultDay = param.defaultDate || 0;
                target[param.id] = moment().minutes(0).seconds(0).milliseconds(0).add(defaultDay, 'day').format(param.dateTimeFormat || 'YYYY-MM-DD HH:mm:ss');
                if (param.dateTimeType === 'Range') {
                    target[param.dateTimeToId] = moment().minutes(0).seconds(0).milliseconds(0).add(0, 'day').format(param.dateTimeFormat || 'YYYY-MM-DD HH:mm:ss');
                }
            }
        },
        _setNullDefaultValue: function (param, target) {
            if (param.nullValue) {
                if (['InputBox', 'ArrayInput'].some(control => control === param.control)) {
                    if (param.control === 'InputBox') {
                        if(param.type==='Double' || param.type==='Float' || param.type==='Integer'){
                            target[param.id] = Number(param.nullValue);
                        }else {
                            target[param.id] = param.nullValue;
                        }
                    }
                    else {
                        target[param.id] = param.nullValue.split(',');
                        if (param.type && numberTypeList.indexOf(param.type) >= 0) {
                            target[param.id] = target[param.id].map(x => Number(x));
                        }
                    }
                }
            }
        },
        _setDefaultValue: function (param, target, isDataExtractor) {
            try {
                if (typeof param.defaultValue !== 'undefined' && typeof param.nullValue === 'undefined') {
                    target[param.id] = param.defaultValue;
                } else if (param.items && param.items.length > 0) {
                    this._setArrayDefaultValue(param, target, isDataExtractor);
                } else if (isDataExtractor) {
                    this._setDataExtractorDefaultValue(param, target);
                } else {
                    this._setNullDefaultValue(param, target);
                }
            } catch (e) {
                console.error(e);
            }
        },
        createPropertiesPanel: function (params) {
            function InvokeProperties(parentId, options) {
                Brightics.VA.Implementation.DataFlow.Functions.BaseInvokeProperties.call(this, parentId, options);
            }

            InvokeProperties.prototype = Object.create(Brightics.VA.Implementation.DataFlow.Functions.BaseInvokeProperties.prototype);
            InvokeProperties.prototype.constructor = InvokeProperties;

            InvokeProperties.prototype._getParams = function () {
                return params;
            };

            return InvokeProperties;
        },
        createValidator: function (contents) {
            function InvokeValidator(parentId, options) {
                Brightics.VA.Implementation.DataFlow.Functions.InvokeValidator.call(this, parentId, options);
            }

            InvokeValidator.prototype = Object.create(Brightics.VA.Implementation.DataFlow.Functions.InvokeValidator.prototype);
            InvokeValidator.prototype.constructor = InvokeValidator;

            InvokeValidator.prototype._getContents = function () {
                return contents;
            };

            InvokeValidator.prototype._hasInData = function () {
                if (contents.inrange && contents.inrange.min && contents.inrange.min > 0) return true;
                if (_.isEmpty(contents.inputs)) return true;
                return false;
            };

            return InvokeValidator;
        }
    }
}).call(this);
