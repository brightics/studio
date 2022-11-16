/**
 * Created by jhoon80.park on 2016-01-27.
 */
(function () {
    "use strict";

    var root = this;
    var Brightics = root.Brightics;

    function DistributedJdbcLoaderProperties(parentId, options) {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.call(this, parentId, options);
    }

    DistributedJdbcLoaderProperties.prototype = Object.create(Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype);
    DistributedJdbcLoaderProperties.prototype.constructor = DistributedJdbcLoaderProperties;

    DistributedJdbcLoaderProperties.prototype.createContentsAreaControls = function ($parent) {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype.createContentsAreaControls.call(this, $parent);
        this.$elements = {};
        this.controls = {};
    };

    DistributedJdbcLoaderProperties.prototype.renderValidation = function () {
        var _this = this;
        for (var i in _this.problems) {
            var key = _this.problems[i].param;
            if (_this.$elements[key]) {
                _this.createValidationContent(_this.$elements[key], _this.problems[i]);
            }
        }
    };

    DistributedJdbcLoaderProperties.prototype.changeCallback = function (changedParam) {

    };

    DistributedJdbcLoaderProperties.prototype.setValues = function (conditionObj) {
        var keys = Object.keys(conditionObj);
        for (const key of keys) {
            this.changeCallback(key)
        }
    };

    DistributedJdbcLoaderProperties.prototype.getQueryResult = function ($control, sqlId, options, controlType, inputType) {
        inputType = inputType || 'String';
        var opt = {
            url: 'api/va/v2/datasources/jdbcloader/query/' + sqlId,
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(options || {}),
            blocking: true,
            async: false
        };
        $.ajax(opt).done(function (result) {
            var resultData = [];
            if (inputType === 'Integer' || inputType === 'Double') {
                for (var i = 0; i < result.data.length; i++) {
                    var d = result.data[i];
                    if (d[0]) result.data[i][0] = Number(d[0]);
                }
            }
            if (controlType === 'DropDownList') {
                for (var i = 0; i < result.data.length; i++) {
                    var d = result.data[i];
                    if (d[0]) resultData.push({label: d[0], value: d[0]});
                }
                $control.jqxDropDownList({source: resultData});
            }
            else if (controlType === 'ItemSelector') {
                for (var i = 0; i < result.data.length; i++) {
                    var d = result.data[i];
                    if (d[0]) resultData.push({item: d[0], description: d[1]});
                }
                $control.setItems(resultData);
            }
        }).fail(function () {
            if (controlType === 'DropDownList') $control.jqxDropDownList({source: []});
            else if (controlType === 'ItemSelector') $control.setItems([]);
        });
    };

    DistributedJdbcLoaderProperties.prototype.createSetParameterValueJdbcLoaderCommand = function (paramName, paramValue) {
        var commandOption = {
            fnUnit: this.options.fnUnit,
            ref: {
                param: {
                    sql: {
                        metadata: 'sql',
                        sqlId: this.options.fnUnit.param.sql.sqlId,
                        condition: $.extend(true, {}, this.options.fnUnit.param.sql.condition)
                    }
                }
            }
        };

        commandOption.ref.param.sql.condition[paramName] = paramValue;

        return new Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitParameterValueCommand(this, commandOption);
    };

    DistributedJdbcLoaderProperties.prototype.createSetDataSourceParamValueJdbcLoaderCommand = function (paramName, paramValue) {
        var commandOption = {
            fnUnit: this.options.fnUnit,
            ref: {
                param: {
                    datasource: {
                        metadata: 'datasource',
                        datasourceId: this.options.fnUnit.param.datasource.datasourceId                    }
                }
            }
        };

        commandOption.ref.param.datasource[paramName] = paramValue;

        return new Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitParameterValueCommand(this, commandOption);
    };


    Brightics.VA.Core.Editors.Sheet.Panels.DistributedJdbcLoaderProperties = DistributedJdbcLoaderProperties;

}).call(this);
