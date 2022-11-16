(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    /**************************************************************************
     *                                 FnUnit
     *************************************************************************/
    Brightics.VA.Core.Functions.Library['merge'] = {
        "category": "transform",
        "defaultFnUnit": {
            "context": "python",
            "func": "merge",
            "name": "brightics.function.transform$join",
            "label": {
                "en": "Join", 
                "ko": "조인"
            },
            "version": "3.6",
            "inputs": {
                "left_table": "",
                "right_table": ""
            },
            "outputs": {
                "table": ""
            },
            "meta": {
                "left_table": {
                    "type": "table"
                },
                "right_table": {
                    "type": "table"
                },
                "table": {
                    "type": "table"
                }
            },
            "param": {
                "left_on": [
                ],
                "right_on": [
                ],
                "how": "outer",
                "lsuffix": "",
                "rsuffix": "",
                "sort": "false"
            },
            "display": {
                "label": "Join",
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
            "en": "Merge DataFrame objects by performing a database-style join operation by columns.",
            "ko": "데이터프레임 객체들을 데이터베이스 방식의 열 기준 조인 연산을 수행하여 합칩니다."
        },
        "tags": {
            "en": [
                "join",
                "left",
                "right",
                "inner",
                "outer",
                "merge"
            ],
            "ko": [
                "조인",
                "왼쪽",
                "오른쪽",
                "내부",
                "외부",
                "병합"
            ]
        }
    };

}).call(this);
/**************************************************************************
 *                           Properties Panel
 *************************************************************************/
/**
 * Created by jmk09.jung on 2016-03-24.
 */
/*
 validate check list
 - [columns]
 1. 필수입력
 -[ratio]
 1. 0~1 사이
 -[number]
 1.필수입력
 2. 자연수
 3. in-data의 rowcount 보다 작거나 같아야 한다.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function MergeProperties(parentId, options) {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.call(this, parentId, options);
    }

    MergeProperties.prototype = Object.create(Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype);
    MergeProperties.prototype.constructor = MergeProperties;

    MergeProperties.prototype.createControls = function () {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype.createControls.call(this);

        this.retrieveTableInfo(this.FnUnitUtils.getInTable(this.options.fnUnit));
    };

    MergeProperties.prototype.createContentsAreaControls = function ($parent) {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype.createContentsAreaControls.call(this, $parent);

        this.options.joinTypes = ['outer', 'left', 'right', 'inner', 'left_exclude', 'right_exclude'];

        this.render = {
            'how': this.renderJoinTypeValue,
            'left_on': this.renderLeftOn,
            'right_on': this.renderRightOn,
            'lsuffix': this.renderLsuffix,
            'rsuffix': this.renderRsuffix,
            'sort': this.renderSort
        };

        this.renderError = {
            'left_on': this.renderErrorLeftOn,
            'right_on': this.renderErrorRightOn
        };

        this.createJoinTypeControl();
        this.createLeftOnControl();
        this.createRightOnControl();
        this.createLsuffixControl();
        this.createRsuffixControl();
        this.createSortControl();
    };

    MergeProperties.prototype.createLeftOnControl = function ($parent) {
        var _this = this;

        this.$leftOnColumns = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-columnlist"/>');

        this.addPropertyControl('Left Keys', function ($parent) {
            $parent.append(this.$leftOnColumns);
            var widgetOptions = {
                rowCount: 3,
                multiple: true,
                changed: function (type, data) {
                    _this.createColumnListCommand('left_on', data.items);
                },
                added: function (data) {
                },
                removed: function (data) {
                }
            };
            _this.leftColumnsControl = _this.createColumnList(_this.$leftOnColumns, widgetOptions);
        }, {mandatory: true});
    };

    MergeProperties.prototype.createRightOnControl = function ($parent) {
        var _this = this;

        this.$rightOnColumns = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-columnlist"/>');

        this.addPropertyControl('Right Keys', function ($parent) {
            $parent.append(this.$rightOnColumns);
            var widgetOptions = {
                rowCount: 3,
                multiple: true,
                changed: function (type, data) {
                    _this.createColumnListCommand('right_on', data.items);
                },
                added: function (data) {
                },
                removed: function (data) {
                }
            };
            _this.rightColumnsControl = _this.createColumnList(_this.$rightOnColumns, widgetOptions);
        }, {mandatory: true});
    };

    MergeProperties.prototype.createJoinTypeControl = function ($parent) {
        var _this = this;

        this.$joinTypeControl = $('' +
            '<ul  class="brtc-va-editors-sheet-panels-properties-joinproperties-buttoncontainer">' +
            '<li> <div class="join-type">' +
            ' <div class="brtc-va-editors-sheet-panels-properties-joinproperties-icon" type = "outer" title="Full Outer Join"/>' +
            '</div></li>' +
            '<li> <div class="join-type">' +
            ' <div class="brtc-va-editors-sheet-panels-properties-joinproperties-icon" type = "leftouter" title="Left Join"/>' +
            '</div></li>' +
            '<li> <div class="join-type">' +
            ' <div class="brtc-va-editors-sheet-panels-properties-joinproperties-icon" type = "rightouter" title="Right Join"/>' +
            '</div></li>' +
            '<li> <div class="join-type">' +
            ' <div class="brtc-va-editors-sheet-panels-properties-joinproperties-icon" type = "inner" title="Inner Join"/>' +
            '</div></li>' +
            '<li> <div class="join-type">' +
            ' <div class="brtc-va-editors-sheet-panels-properties-joinproperties-icon" type = "leftexcluding" title="Left Excluding Join"/>' +
            '</div></li>' +
            '<li> <div class="join-type">' +
            ' <div class="brtc-va-editors-sheet-panels-properties-joinproperties-icon" type = "rightexcluding" title="Right Excluding Join"/>' +
            '</div></li>' +
            ' </ul>');

        this.addPropertyControl('Join Type', function ($parent) {
            $parent.append(this.$joinTypeControl);
        }, {mandatory: true});

        this.$joinTypeControl.jqxButtonGroup({
            mode: 'radio',
            theme: Brightics.VA.Env.Theme
        });
        this.$joinTypeControl.jqxButtonGroup('setSelection', 0);


        this.$joinTypeControl.on('selected', function (event) {
            var clickedButton = event.args.button;
            var compoundCommand = new Brightics.VA.Core.CompoundCommand(_this, {});

            _this.$joinTypeControl.find('.brtc-va-editors-sheet-panels-properties-joinproperties-icon').removeClass('brtc-va-editors-sheet-panels-properties-joinproperties-icon-selected');
            clickedButton.find('.brtc-va-editors-sheet-panels-properties-joinproperties-icon').addClass('brtc-va-editors-sheet-panels-properties-joinproperties-icon-selected');

            var leftType = $(clickedButton[0]).find('[type="leftexcluding"]');
            var rightType = $(clickedButton[0]).find('[type="rightexcluding"]');
            if (leftType.attr('type') === "leftexcluding") {
                compoundCommand.add(_this.createJoinTypeCommand());
                _this.executeCommand(compoundCommand);
            } else if (rightType.attr('type') === "rightexcluding") {
                compoundCommand.add(_this.createJoinTypeCommand());
                _this.executeCommand(compoundCommand);
            }
            else {
                _this.executeCommand(_this.createJoinTypeCommand());
            }
        });
    };

    MergeProperties.prototype.createLsuffixControl = function ($parent) {
        var _this = this;

        this.$lsuffixControl = $('<input type="text" class="brtc-va-editors-sheet-controls-propertycontrol-input" valid-type="type1"/>');
        this.$lsuffixControlWrapper = this.addPropertyControl('Left Suffix', function ($parent) {
            $parent.append(this.$lsuffixControl);

            _this.createInput(_this.$lsuffixControl, {"placeHolder": "_left"});
            _this.$lsuffixControl.on('change', function (event) {
                if (!_this.isInputValueChanged('lsuffix', $(this).val())) return;

                _this.createInputCommand('lsuffix', $(this).val())
            });
        });
    };

    MergeProperties.prototype.createRsuffixControl = function ($parent) {
        var _this = this;

        this.$rsuffixControl = $('<input type="text" class="brtc-va-editors-sheet-controls-propertycontrol-input" valid-type="type1"/>');
        this.$rsuffixControlWrapper = this.addPropertyControl('Right Suffix', function ($parent) {
            $parent.append(this.$rsuffixControl);

            _this.createInput(_this.$rsuffixControl, {"placeHolder": "_right"});
            _this.$rsuffixControl.on('change', function (event) {
                if (!_this.isInputValueChanged('rsuffix', $(this).val())) return;

                _this.createInputCommand('rsuffix', $(this).val())
            });
        });
    };

    MergeProperties.prototype.createSortControl = function ($parent) {
        var _this = this;

        this.$sortTrueControl = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-radiobutton">True</div>');
        this.$sortFalseControl = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-radiobutton">False</div>');

        this.addPropertyControl('Sort', function ($parent) {
            $parent.append(this.$sortTrueControl).append(this.$sortFalseControl);
            _this.createRadioButton(_this.$sortTrueControl, {width: '80', groupName: 'Group'});
            _this.createRadioButton(_this.$sortFalseControl, {width: '80', groupName: 'Group'});

            _this.$sortTrueControl.on('checked', function (event) {
                _this.createRadioButtonCommand('sort', 'true');
            });

            _this.$sortFalseControl.on('checked', function (event) {
                _this.createRadioButtonCommand('sort', 'false');
            });
        });
    };

    MergeProperties.prototype.fillControlValues = function ($parent) {
        var _this = this;
        var leftData = [];
        var rightData = [];

        var inputs = this.FnUnitUtils.getInputs(this.options.fnUnit);
        leftData = this.dataMap ? inputs['left_table'] ? this.dataMap[inputs['left_table']].columns : [] : [];
        rightData = this.dataMap ? inputs['right_table'] ? this.dataMap[inputs['right_table']].columns : [] : [];

        this.leftColumnsControl.setItems(leftData);
        this.rightColumnsControl.setItems(rightData);

        this.$sortFalseControl.jqxRadioButton('check');
    };

    MergeProperties.prototype.renderJoinTypeValue = function () {
        var joinType = this.options.fnUnit.param['how'];
        this.$joinTypeControl.jqxButtonGroup('setSelection', this.options.joinTypes.indexOf(joinType));
    };

    MergeProperties.prototype.renderLeftOn = function () {
        var param = this.options.fnUnit.param;
        this.leftColumnsControl.setSelectedItems(param['left_on']);
    };

    MergeProperties.prototype.renderRightOn = function () {
        var param = this.options.fnUnit.param;
        this.rightColumnsControl.setSelectedItems(param['right_on']);
    };

    MergeProperties.prototype.renderLsuffix = function () {
        this.$lsuffixControl.val(this.options.fnUnit.param.lsuffix || '');
    };

    MergeProperties.prototype.renderRsuffix = function () {
        this.$rsuffixControl.val(this.options.fnUnit.param.rsuffix || '');
    };

    MergeProperties.prototype.renderSort = function () {
        var param = this.options.fnUnit.param;
        if (param.sort === undefined) {
            this.$sortFalseControl.jqxRadioButton('check');
        } else {
            if (param.sort === 'true') this.$sortTrueControl.jqxRadioButton('check');
            if (param.sort === 'false') this.$sortFalseControl.jqxRadioButton('check');
        }
    };

    MergeProperties.prototype.renderValidation = function () {
        if (this.problems.length > 0) {
            for (var i in this.problems) {
                if (this.problems[i].param === 'left_on') this.createValidationContent(this.$leftOnColumns, this.problems[i]);
                if (this.problems[i].param === 'right_on') this.createValidationContent(this.$rightOnColumns, this.problems[i]);
            }
        }
    };

    MergeProperties.prototype.renderErrorLeftOn = function (problem) {
        this.createValidationContent(this.$leftOnColumns, problem);
    };

    MergeProperties.prototype.renderErrorRightOn = function (problem) {
        this.createValidationContent(this.$rightOnColumns, problem);
    };

    MergeProperties.prototype.createColumnListCommand = function (controlName, data) {
        var commandOption = {
            fnUnit: this.options.fnUnit,
            ref: {param: {}}
        };

        commandOption.ref.param[controlName] = [];
        if (data) {
            commandOption.ref.param[controlName] = data;
        }

        var command = new Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitCommand(this, commandOption);
        this.executeCommand(command);
    };

    MergeProperties.prototype.createNumericInputCommand = function (controlName, data) {
        var commandOption = {
            fnUnit: this.options.fnUnit,
            ref: {param: {}}
        };

        commandOption.ref.param[controlName] = '';
        if (data) {
            commandOption.ref.param[controlName] = data;
        }

        var command = new Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitCommand(this, commandOption);
        this.executeCommand(command);
    };

    MergeProperties.prototype.createRadioButtonCommand = function (colName, data) {
        var commandOption = {
            fnUnit: this.options.fnUnit,
            ref: {param: {}}
        };
        commandOption.ref.param[colName] = data;

        var command = new Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitCommand(this, commandOption);
        this.executeCommand(command);
    };

    MergeProperties.prototype.createInputCommand = function (controlName, data) {
        var commandOption = {
            fnUnit: this.options.fnUnit,
            ref: {param: {}}
        };

        commandOption.ref.param[controlName] = '';
        if (data) {
            commandOption.ref.param[controlName] = data;
        }

        var command = new Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitCommand(this, commandOption);
        this.executeCommand(command);
    };

    MergeProperties.prototype.createColumnsCommand = function () {
        var leftOutputColumns = this.leftColumnsControl.getSelectedItems(),
            rightOutputColumns = this.rightColumnsControl.getSelectedItems();

        if (leftOutputColumns.length === 0) leftOutputColumns[0] = '';
        if (rightOutputColumns.length === 0) rightOutputColumns[0] = '';

        var command = new Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitParameterValueCommand(this, {
            fnUnit: this.options.fnUnit,
            ref: {
                param: {
                    'columns': [leftOutputColumns, rightOutputColumns]
                }
            }
        });
        return command;
    };

    MergeProperties.prototype.createJoinTypeCommand = function () {
        var joinType = this.options.joinTypes[this.$joinTypeControl.jqxButtonGroup('getSelection')] || "inner";
        var command = new Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitParameterValueCommand(this, {
            fnUnit: this.options.fnUnit,
            ref: {
                param: {
                    'how': joinType
                }
            }
        });
        return command;
    };

    Brightics.VA.Core.Functions.Library['merge'].propertiesPanel = MergeProperties;
}).call(this);


/**************************************************************************
 *                               Validator
 *************************************************************************/
/**
 * Created by jmk09.jung on 2016-03-21.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function MergeValidator() {
        this.PARAM_LEFT_ON = 'left_on';
        this.PARAM_RIGHT_ON = 'right_on';

        Brightics.VA.Core.Validator.SingleInputValidator.call(this);
    }

    MergeValidator.prototype = Object.create(Brightics.VA.Core.Validator.SingleInputValidator.prototype);
    MergeValidator.prototype.constructor = MergeValidator;

    MergeValidator.prototype.initRules = function () {
        Brightics.VA.Core.Validator.SingleInputValidator.prototype.initRules.call(this);

        this.addLeftOnRule();
        this.addRightOnRule();
    };

    MergeValidator.prototype.addLeftOnRule = function () {
        var _this = this;
        this.addRule(function (fnUnit) {
            return _this.checkColumnIsEmpty(fnUnit, _this.PARAM_LEFT_ON, fnUnit.param[_this.PARAM_LEFT_ON], 'Left Columns');
        });
    };

    MergeValidator.prototype.addRightOnRule = function () {
        var _this = this;
        this.addRule(function (fnUnit) {
            return _this.checkColumnIsEmpty(fnUnit, _this.PARAM_RIGHT_ON, fnUnit.param[_this.PARAM_RIGHT_ON], 'Right Columns');
        });
    };

    Brightics.VA.Core.Functions.Library['merge'].validator = MergeValidator;

}).call(this);