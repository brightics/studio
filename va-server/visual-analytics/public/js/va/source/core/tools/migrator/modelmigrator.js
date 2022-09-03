/* global _, FUNCTION_NAME */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var FnUnitUtils = brtc_require('FnUnitUtils');

    function ModelMigratorExecutor(options) {
        this.options = options || {};
        this.ruleList = {};
        this.addRule();
        this.chartMigrator = new Brightics.VA.Core.Tools.ChartMigrator();
    }

    ModelMigratorExecutor.prototype.addRule = function () {
        for (var rule in Brightics.VA.Core.Tools.ModelMigrator.RuleList) {
            this.ruleList[rule] = new Brightics.VA.Core.Tools.ModelMigrator.RuleList[rule]();
        }
    };

    ModelMigratorExecutor.prototype.migrate = function (contents) {
        this._doModelMigration(contents);

        if (typeof contents.functions === 'undefined') return;
        for (var i = 0; i < contents.functions.length; i++) {
            var func = contents.functions[i];
            if (!func) continue;

            this._doFunctionMigration(func);
            if (func[FUNCTION_NAME] === "Subflow") {
                this.migrate(func.param);
            }
        }
    };

    ModelMigratorExecutor.prototype._doModelMigration = function (model) {
        var _this = this;
        var variables;
        if (model.type == 'control') {
            variables = model.variables;

            for (var i in variables) {
                if (variables[i]['type'] == 'string' || variables[i]['type'] == 'number') variables[i]['type'] = 'literal';
            }
        } else if (model.type == 'data' || model.type == 'realtime') {
            // TODO : 임시로직임 코어에서 바꾸도록 해야함
            model[IN_DATA] = model[IN_DATA] || [];
            model[OUT_DATA] = model[OUT_DATA] || [];
            _.forIn(model.innerModels, function (m) {
                _this.migrate(m);
                // m[IN_DATA] = m[IN_DATA] || [];
                // m[OUT_DATA] = m[OUT_DATA] || [];
            });

            model = this._migrateDiagram(model);
            this._migrateModelOutdata(model);

            variables = model['gv-def'];

            for (var i in variables) {
                if (variables[i]['variable-type'] == 'string' || variables[i]['variable-type'] == 'number') variables[i]['variable-type'] = 'literal';
            }
        } else if (model.type == 'visual') {
            if (typeof model.report.display == 'undefined') {
                model.report.display = {};
            }
            if (!model.report.display['page-type']) {
                model.report.display['page-type'] = 'a4-vertical';
                model.report.display['height'] = '1125';
                model.report.display['width'] = '795';
            }
        }


        var migrateVariable = function (variable) {
            return {
                type: variable.type,
                value: variable.type === 'calculation' && _.isArray(variable.value) ?
                    variable.value[0] : variable.value
            };
        };

        if (model.type === 'data') {
            model.variables = (function (variables) {
                return _.reduce(
                    _.keys(variables), function (acc, key) {
                        var variable = variables[key];
                        return _.merge({}, acc, _.set({}, key, migrateVariable(variable)));
                    }, {});
            }(model.variables));

            var models = [model].concat(_.toArray(model.innerModels));
            _.forEach(models, function (m) {
                m.functions = _.map(m.functions, function (fn) {
                    if (fn[FUNCTION_NAME] === 'Flow') {
                        return _.merge({}, _.omit(fn, 'param.variables'),
                            _.set({},
                                'param.variables',
                                _.mapValues(fn.param.variables, migrateVariable)
                            ));
                    }
                    return fn;
                });
            });
        }
    };
    
    ModelMigratorExecutor.prototype._migrateDiagram = function (model) {
        if (typeof model.diagram === 'undefined' || model.diagram != Brightics.VA.Env.Diagram) {
            try {
                var fnUnitIndex, fnUnit, position;
                for (fnUnitIndex in model.functions) {
                    fnUnit = model.functions[fnUnitIndex];
                    position = fnUnit.display.diagram.position;
                    fnUnit.display.diagram.position = this._configureDiagramPosition(position, model.diagram);
                }
            } catch (e) {
                // TODO : 임시로직임 코어에서 바꾸도록 해야함
                for (var i = 0; i < model.functions.length; i++) {
                    model.functions[i].display = model.functions[i].display || {};
                    model.functions[i].display.diagram = model.functions[i].display.diagram || {};
                    model.functions[i].display.diagram.position = this._getPositionByIndex(i + 1, 1);
                }
            }
            model.diagram = $.extend(true, {}, Brightics.VA.Env.Diagram);
        }
        return model;
    };

    ModelMigratorExecutor.prototype._getPositionByIndex = function (xDiagramIndex, yDiagramIndex) {
        var currentDiagram = Brightics.VA.Env.Diagram;
        return {
            x: currentDiagram.PAPER_MARGIN_LEFT +
                xDiagramIndex * (currentDiagram.FIGURE_WIDTH + currentDiagram.GAP_WIDTH),
            y: currentDiagram.PAPER_MARGIN_TOP +
                yDiagramIndex * (currentDiagram.FIGURE_HEIGHT + currentDiagram.GAP_HEIGHT)
        };
    };

    ModelMigratorExecutor.prototype._configureDiagramPosition = function (position, diagramInit) {
        diagramInit = diagramInit || Brightics.VA.Env.DiagramInit;
        var xDiagramIndex =
            (position.x - diagramInit.PAPER_MARGIN_LEFT) /
            (diagramInit.FIGURE_WIDTH + diagramInit.GAP_WIDTH);
        var yDiagramIndex =
            (position.y - diagramInit.PAPER_MARGIN_TOP) /
            (diagramInit.FIGURE_HEIGHT + diagramInit.GAP_HEIGHT);

        return this._getPositionByIndex(xDiagramIndex, yDiagramIndex);
    };

    ModelMigratorExecutor.prototype._doFunctionMigration = function (func) {
        if (func.display && func.display.sheet) {
            this.chartMigrator.migrate(func.display.sheet);
        }

        if (typeof func.parent !== 'undefined' && typeof func.parent().type !== 'undefined') {
            var target = Brightics.VA.Core.Utils.WidgetUtils.getFunctionLibrary(func.parent().type, func.func);
            if (target && target.name === 'UDF') {
                this.ruleList['udf'].migrate(func);
            }
        }

        var targetFuncName = ['edictedict', 'traintrain', 'json_json', 'tabletable'];
        for(const name of targetFuncName){
            var newFuncName = name.substring(0, name.length-5);
            if (func.func.includes(name)) {
                func.func = func.func.replace(name, newFuncName);
                break;
            }
        }

        // TODO : 임시로직
        if (_.indexOf(['Flow', 'If', 'ForLoop', 'WhileLoop'], func[FUNCTION_NAME]) > -1) {
            func[IN_DATA] = func[IN_DATA] || [];
            func[OUT_DATA] = func[OUT_DATA] || [];
            func.display.sheet = func.display.sheet || {
                'in': { 'partial': [{ 'panel': [], 'layout': {} }], 'full': [{ 'panel': [], 'layout': {} }] },
                'out': { 'partial': [{ 'panel': [], 'layout': {} }], 'full': [{ 'panel': [], 'layout': {} }] }
            };
        }

        var rule = this.ruleList[func.func];
        if (!rule) return;
        rule.migrate(func);
    };

    ModelMigratorExecutor.prototype._migrateModelOutdata = function (model) {
        var functionOutTables = [];
        _.forEach(model.functions, function (f) {
            functionOutTables = functionOutTables.concat(FnUnitUtils.getOutTable(f));
        })
        model.outData = _.intersection(model.outData, functionOutTables);
    };

    Brightics.VA.Core.Tools.ModelMigrator.Executor = ModelMigratorExecutor;

}).call(this);