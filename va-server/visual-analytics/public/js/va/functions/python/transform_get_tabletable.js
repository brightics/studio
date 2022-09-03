(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    Brightics.VA.Core.Functions.Library['brightics.function.transform$get_table'] = {
        "category": "transform",
        "defaultFnUnit": {
            'func': 'brightics.function.transform$get_table',
            'name': 'brightics.function.transform$get_table',
            'context': 'python',
            'version': '3.6',
            'label': {
                'en': 'Get Table', 
                'ko': '테이블 가져오기'
            },
            'param': {
                'key_list': [],
                'index_column': false,
                'index_column_name': ''
            },
            'inputs': {
                'model': ''
            },
            'outputs': {
                'table': ''
            },
            'meta': {
                'model': {
                    'type': 'model'
                },
                'table': {
                    'type': 'table'
                }
            },
            "display": {
                "label": "Get Table",
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
        'mandatory': ['key_list', 'index_column'],
        'description': {
            'en': 'Generate a table from a table element contained in some json object.',
            'ko': 'JSON 객체에서 테이블을 가져옵니다.'
        },
        'tags': {
            'en': [
            ],
            'ko': [
            ]
        },
        'in-range': {
            'min': 1,
            'max': 1
        },
        'out-range': {
            'min': 1,
            'max': 1
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

    var PARAM_GROUP_NAME = 'group_name';
    var PARAM_KEY_LIST = 'key_list';
    var PARAM_INDEX_COLUMN = 'index_column';
    var PARAM_INDEX_COLUMN_NAME = 'index_column_name';
    var PARAM_GROUP_ONLY = 'group_only';

    var _super = Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype;

    function PythonGetTableProperties(parentId, options) {
        _super.constructor.call(this, parentId, options);
    }

    PythonGetTableProperties.prototype = Object.create(_super);
    PythonGetTableProperties.prototype.constructor = PythonGetTableProperties;

    PythonGetTableProperties.prototype.createControls = function () {
        _super.createControls.call(this);
        this.setContentsEditable(false);
    };

    PythonGetTableProperties.prototype.createContentsAreaControls = function ($parent) {
        _super.createContentsAreaControls.call(this, $parent);

        this.tableInModelList = [];
        this.render = {
            [PARAM_GROUP_NAME]: this.renderGroupNameControl,
            [PARAM_KEY_LIST]: this.renderKeyControl,
            [PARAM_INDEX_COLUMN]: this.renderIndexColumn,
            [PARAM_INDEX_COLUMN_NAME]: this.renderIndexColumnName
        };

        this.createIndexColumnControl();
        this.createIndexColumnNameControl();

        var _this = this;

        var doneCallback = function doneCallback(model) {
            _this.model = model;
            if (_this.model._grouped_data) {
                _this.createGroupedControl();
            }
            _this.createKeyControl();
        };

        var tid = this.FnUnitUtils.getInModel(this.options.fnUnit);
        this.options.dataProxy.requestDataForce(tid, doneCallback, () => {
            if (this.model) {
                if (this.model._grouped_data) {
                    this.createGroupedControl();
                }
            }
            this.createKeyControl()
        });
    };

    PythonGetTableProperties.prototype.createGroupedControl = function() {
        var _this = this;
        this.$groupControl = $(
            '<div class="brtc-va-editors-sheet-controls-propertycontrol-combobox"/>'
        );
    
        var source = Object.keys(this.model._grouped_data.data).map(label => {
            return { label, value: label };
        });
        source.splice(0, 0, { label: 'All', value: 'all' });
    
        this.addPropertyControl(
            'Group Name',
            function($parent) {
                $parent.append(_this.$groupControl);
    
                _this.createDropDownList(this.$groupControl, {
                    source: source,
                    placeHolder: 'Select Group Name'
                });
    
                _this.$groupControl.on('change', function() {
                    var value = _this.$groupControl.jqxDropDownList('getSelectedItem')
                        ? _this.$groupControl.jqxDropDownList('getSelectedItem').value
                        : '';
    
                    if (_this.options.isRendered) {
                        const searchValue = value === 'all' ? _this.getFirstGroupKey() : value;
                        _this.$keyControl.jqxDropDownList({ source: _this.tableInModelList.filter(x => x.startsWith('_grouped_data.data.' + searchValue)).map(x => {
                            return { label: x.replace(/(.*\.)/, ''), value: x };
                        }) });
                        _this.$keyControl.jqxDropDownList('clearSelection');
    
                        var compoundCommand = new Brightics.VA.Core.CompoundCommand(_this);
                        compoundCommand.add(_this.createCommonCommand(PARAM_GROUP_ONLY, value !== 'all'));
                        compoundCommand.add(_this.createCommonCommand('group_name', value));
                        compoundCommand.add(_this.createCommonCommand('key_list', []));
                        _this.executeCommand(compoundCommand);
                    }
                });
            },
            { mandatory: true, appendIndex: 1 }
        );
    };

    PythonGetTableProperties.prototype.createKeyControl = function () {
        var _this = this;
        this.$keyControl = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-combobox"/>');

        var source = [];
        if (this.model) {
            this.tableInModelList = [];
            this.deepFilterTable(this.model, '');
            if (this.$groupControl) {
                var groupName = this.options.fnUnit.param[PARAM_GROUP_NAME];
                if (!groupName && this.options.fnUnit.param[PARAM_KEY_LIST].length > 2 && this.options.fnUnit.param[PARAM_KEY_LIST][0] === '_grouped_data') groupName = this.options.fnUnit.param[PARAM_KEY_LIST][2];
                groupName = groupName === 'all' ? this.getFirstGroupKey() : groupName;
                source = groupName ? this.tableInModelList.filter(x => x.startsWith('_grouped_data.data.' + groupName)) : [];
            } else {
                source = this.tableInModelList;
            }
            source = source.map(x => {
                return {label: x.replace(/(.*\.)/, ''), value: x};
            });
        }

        this.addPropertyControl('Key', function ($parent) {
            $parent.append(_this.$keyControl);

            _this.$keyControl.on('bindingComplete', function (event) {
                if (!_this.options.isRendered) {
                    _this.setContentsEditable(true);
                }
            });

            _this.createDropDownList(this.$keyControl, {
                source: source,
                placeHolder: 'Select Key'
            });

            _this.$keyControl.on('change', function () {
                var value = (_this.$keyControl.jqxDropDownList('getSelectedItem')) ? _this.$keyControl.jqxDropDownList('getSelectedItem').value : '';
                var compoundCommand = new Brightics.VA.Core.CompoundCommand(_this);
                if (!_this.$groupControl) compoundCommand.add(_this.createCommonCommand(PARAM_GROUP_ONLY, false));
                compoundCommand.add(_this.createCommonCommand('group_name', '', 'RemoveFnUnitParameterCommand'));
                compoundCommand.add(_this.createCommonCommand('key_list', value.split('.')));
                _this.executeCommand(compoundCommand);
                // var command = _this.createCommonCommand('key_list', value.split('.'));
                // _this.executeCommand(command);
            });
        }, { mandatory: true, appendIndex: (this.$groupControl ? 2 : 1) });
    };

    PythonGetTableProperties.prototype.createIndexColumnControl = function() {
        var _this = this;
        this.$indexColumnControl = $('<div class="brtc-va-editors-sheet-controls-radio-group"/>');
        this.addPropertyControl('Index Column', function ($parent) {
            $parent.append(_this.$indexColumnControl);

            _this.createRadioButtonControl(_this.$indexColumnControl, 'True', 'true', PARAM_INDEX_COLUMN);
            _this.createRadioButtonControl(_this.$indexColumnControl, 'False', 'false', PARAM_INDEX_COLUMN);
        }, {mendatory: true});
    };

    PythonGetTableProperties.prototype.createIndexColumnNameControl = function() {
        var _this = this;
        this.$indexColumnNameControl = $('<input type="text" class="brtc-va-editors-sheet-controls-propertycontrol-input"/>');
        this.$indexColumnNameControlWrapper = this.addPropertyControl('Index Column Name', function ($container) {
            $container.append(_this.$indexColumnNameControl);
            var opt = {"placeHolder": "index"};
            _this.createInput(_this.$indexColumnNameControl, opt);
            _this.$indexColumnNameControl.on('change', function (event) {
                if (!_this.isInputValueChanged(PARAM_INDEX_COLUMN_NAME, $(this).val())) return;
                var command = _this.createCommonCommand(PARAM_INDEX_COLUMN_NAME, $(this).val());
                _this.executeCommand(command);
            });
        }, {mandatory: false});
    };

    PythonGetTableProperties.prototype.createRadioButtonControl = function ($parent, label, value, groupName) {
        var _this = this;
        var $radioButton = $('<div class="brtc-va-editors-sheet-controls-radiocontrol">' + label + '</div>');
        $parent.append($radioButton);

        var additionalClassName = 'brtc-va-editors-sheet-controls-width-12';

        this.createRadioButton($radioButton, {
            groupName: groupName
        }, additionalClassName);

        $radioButton.attr('value', value);

        $parent[label] = $radioButton;

        $radioButton.on('checked', function (event) {
            var value = $(event.target).attr('value') === 'true' ? true : false;

            if (value) {
                _this.$indexColumnNameControlWrapper.show();
            } else {
                _this.$indexColumnNameControl.val('');
                _this.$indexColumnNameControlWrapper.hide();
            }

            var command = _this.createCommonCommand(groupName, value);
            _this.executeCommand(command);
        });
        $parent[label] = $radioButton;
    };

    PythonGetTableProperties.prototype.deepFilterTable = function(data, label) {
        var controlKeys = Object.keys(data);
        var results = {};

        if (data.type === 'table') {
            // if (data.type === 'python object') {
            results = data;
            this.tableInModelList.push(label);
        }

        if (label !== '') {
            label += '.';
        }

        var _this = this;

        controlKeys.filter(function(key) {
            return typeof data[key] === 'object' && data[key] !== null && !Array.isArray(data[key]);
        }).forEach(function(key) {
            results[key] = _this.deepFilterTable(data[key], label + key);
        });

        return results;
    };

    PythonGetTableProperties.prototype.getFirstGroupKey = function() {
        if (this.model && this.model._grouped_data && Object.keys(this.model._grouped_data.group_key_dict).length > 0) {
            return Object.keys(this.model._grouped_data.group_key_dict)[0];
        } else {
            return null;
        }
    };

    PythonGetTableProperties.prototype.createCommonCommand = function(data, value, type) {
        type = type || 'SetFnUnitParameterValueCommand';
        var paramObj = {};
        paramObj[data] = value;
        var commandOption = {
            fnUnit: this.options.fnUnit,
            ref: {param: paramObj}
        };

        var command = new Brightics.VA.Core.Editors.Diagram.Commands[type](this, commandOption);
        return command;
    };

    PythonGetTableProperties.prototype.renderGroupNameControl = function() {
        if (!this.$groupControl) return;
        var param = this.options.fnUnit.param;
    
        if (typeof param[PARAM_GROUP_NAME] === 'undefined' || param[PARAM_GROUP_NAME] === '') {
            if (typeof param[PARAM_KEY_LIST] !== 'undefined' && param[PARAM_KEY_LIST].length > 2 && param[PARAM_KEY_LIST][0] === '_grouped_data') {
                if (param[PARAM_GROUP_ONLY]) {
                    this.$groupControl.jqxDropDownList('selectItem', param[PARAM_KEY_LIST][2]);
                } else {
                    this.$groupControl.jqxDropDownList('selectIndex', 0);
                }
            } else {
                this.$groupControl.jqxDropDownList('selectIndex', -1);
            }
        } else {
            this.$groupControl.jqxDropDownList('selectItem', param[PARAM_GROUP_NAME]);
        }
    };

    PythonGetTableProperties.prototype.renderKeyControl = function () {
        if (!this.$keyControl) return;
        var param = this.options.fnUnit.param;

        if (typeof param[PARAM_KEY_LIST] === 'undefined' || param[PARAM_KEY_LIST].length === 0) {
            this.$keyControl.jqxDropDownList('selectIndex', -1);
        } else {
            this.$keyControl.jqxDropDownList('selectItem', param[PARAM_KEY_LIST].join('.'));
        }
    };

    PythonGetTableProperties.prototype.renderIndexColumn = function () {
        var indexColumn = this.options.fnUnit.param[PARAM_INDEX_COLUMN];

        if (indexColumn === true) {
            indexColumn = "True";
            this.$indexColumnNameControlWrapper.show();
        } else {
            indexColumn = "False";
            this.$indexColumnNameControl.val('');
            this.$indexColumnNameControlWrapper.hide();
        }

        $(this.$indexColumnControl[indexColumn]).jqxRadioButton({checked: true});
    };

    PythonGetTableProperties.prototype.renderIndexColumnName = function () {
        var val = this.options.fnUnit['param'][PARAM_INDEX_COLUMN_NAME];
        this.$indexColumnNameControl.val(val || '');
    };

    Brightics.VA.Core.Functions.Library['brightics.function.transform$get_table'].propertiesPanel = PythonGetTableProperties;

}).call(this);