import {EventEmitter} from '../event-emitter/event-emitter';
import {inherits} from '../utils/inherits';

/* global Brightics */

/* global _ */
const DATA_TYPES = {
    TABLE: 'table',
    MODEL: 'model',
    IMAGE: 'image',
}

const PATH = {
    '1.0': {
        in: {
            data: 'inData'
        },
        out: {
            data: 'outData'
        }
    },
    '3.5': {
        in: {
            data: 'inData'
        },
        out: {
            data: 'outData'
        }
    },
    '3.6': {
        in: {
            data: 'inputs'
        },
        out: {
            data: 'outputs'
        }
    }
};

function FnUnitUtils() {
    EventEmitter.call(this);
}

inherits(FnUnitUtils, EventEmitter);

/**
 * @param {Object} fnUnit
 * @return {Object}
 */
FnUnitUtils.prototype.getMeta = function (fnUnit) {
    return (fnUnit.meta) ? fnUnit.meta : undefined;
};

/**
 * @param {Object} fnUnit
 * @return {String}
 */
FnUnitUtils.prototype.getVersion = function (fnUnit) {
    return (fnUnit.version) ? fnUnit.version : '1.0';
};

FnUnitUtils.prototype._getVersionPath = function (fnUnit) {
    var version = this.getVersion(fnUnit);
    return PATH[version];
};

FnUnitUtils.prototype._getPath = function (fnUnit, inOutType, key) {
    var versionPath = this._getVersionPath(fnUnit);
    return Brightics.VA.Core.Utils.CommonUtils.getObjByJsonPath(versionPath, [inOutType, key]);
};

/**
 * @param {Object} fnUnit
 * @return {Array<String>}
 */
FnUnitUtils.prototype.getInputs = function (fnUnit) {
    var path = this._getPath(fnUnit, 'in', 'data');
    return Brightics.VA.Core.Utils.CommonUtils.getObjByJsonPath(fnUnit, path);
};

/**
 * @param {Object} fnUnit
 * @return {Array<String>}
 */
FnUnitUtils.prototype.getOutputs = function (fnUnit) {
    var path = this._getPath(fnUnit, 'out', 'data');
    return Brightics.VA.Core.Utils.CommonUtils.getObjByJsonPath(fnUnit, path);
};

/**
 * @param {Object} fnUnit
 * @return {Object}
 */
FnUnitUtils.prototype.getInputsToObject = function (fnUnit) {
    if (!fnUnit) return {};

    var rt = {};
    var inputs = this.getInputs(fnUnit);

    if (this.hasMeta(fnUnit)) {
        for (var key in inputs) {
            rt[inputs[key]] = key;
        }
    } else {
        var label = this.getLabel(fnUnit);

        for (var i in inputs) {
            rt[inputs[i]] = '[' + i + ']' + label;
        }
        ;
    }

    return rt;
};

/**
 * @param {Object} fnUnit
 * @return {Object}
 */
FnUnitUtils.prototype.getOutputsToObject = function (fnUnit) {
    if (!fnUnit) return {};

    var rt = {};
    var outputs = this.getOutputs(fnUnit);

    if (this.hasMeta(fnUnit)) {
        for (var key in outputs) {
            if (Array.isArray(outputs[key])) {
                for (var i in outputs[key]) {
                    rt[outputs[key][i]] = key;
                }
            } else {
                rt[outputs[key]] = key;
            }
        }
    } else {
        var label = this.getLabel(fnUnit);

        for (var i in outputs) {
            rt[outputs[i]] = '[' + i + ']' + label;
        }
        ;
    }

    return rt;
};

/**
 * @param {Object} fnUnit
 * @return {Array<String>}
 */
FnUnitUtils.prototype.getInData = function (fnUnit, type) {
    var rt = [];
    var meta = this.getMeta(fnUnit);
    var inData = this.getInputs(fnUnit);
    if (meta) {
        for (var key in inData) {
            if (!inData[key]) continue;

            if (type) {
                if (meta[key].type === type) rt = rt.concat(inData[key]);
            } else {
                rt = rt.concat(inData[key]);
            }
        }
    } else {
        if (type) {
            if (type === DATA_TYPES.TABLE) rt = inData;
        } else {
            rt = inData;
        }
    }

    return rt;
};

/**
 * @param {Object} fnUnit
 * @return {Array<String>}
 */
FnUnitUtils.prototype.getOutData = function (fnUnit, type) {
    var rt = [];
    var meta = this.getMeta(fnUnit);
    var outData = this.getOutputs(fnUnit);
    if (meta) {
        for (var key in outData) {
            if (!outData[key]) continue;
            if (type) {
                if (meta[key].type === type) rt = rt.concat(outData[key]);
            } else {
                rt = rt.concat(outData[key]);
            }
        }
    } else {
        if (type) {
            if (type === DATA_TYPES.TABLE) rt = outData;
        } else {
            rt = outData;
        }
    }

    return rt;
};

FnUnitUtils.prototype._getData = function (fnUnit) {
    var a = (o) => {
        if (_.isUndefined(o)) return [];
        if (_.isString(o)) return [o];
        if (_.isArray(o)) return o.map((x) => a(x));
        return Object.values(o).map((x) => a(x));
    };
    return _.compact(_.flattenDeep([a(fnUnit.inputs || []), a(fnUnit.outputs || [])]));
};

FnUnitUtils.prototype.getAllData = function (fnUnit) {
    return _.union(this.getInData(fnUnit),
        this.getOutData(fnUnit),
        this._getData(fnUnit));
};
/**
 * @param {Object} fnUnit
 * @param {String} inOutType in / out
 * @return {Array<String>}
 */
FnUnitUtils.prototype.getData = function (fnUnit, inOutType) {
    return (inOutType === 'in') ? this.getInData(fnUnit) : this.getOutData(fnUnit);
};

/**
 * @param {Object} fnUnit
 * @return {Array<String>}
 */
FnUnitUtils.prototype.getInputTypes = function (fnUnit) {
    var meta = this.getMeta(fnUnit);

    if (!meta) return [DATA_TYPES.TABLE];

    var types = [];
    var inputs = this.getInputs(fnUnit);

    for (var key in inputs) {
        if (types.indexOf(meta[key].type) < 0) types.push(meta[key].type);
    }

    return types;
};

/**
 * @param {Object} fnUnit
 * @return {Array<String>}
 */
FnUnitUtils.prototype.getOutputTypes = function (fnUnit) {
    var meta = this.getMeta(fnUnit);

    if (!meta) return [DATA_TYPES.TABLE];

    var types = [];
    var outputs = this.getOutputs(fnUnit);

    for (var key in outputs) {
        if (types.indexOf(meta[key].type) < 0) types.push(meta[key].type);
    }

    return types;
};

/**
 * @param {Object} fnUnit
 * @param {String} inOutType in / out
 * @return {Array<String>}
 */
FnUnitUtils.prototype.getTypes = function (fnUnit, inOutType) {
    return (inOutType === 'in') ? this.getInputTypes(fnUnit) : this.getOutputTypes(fnUnit);
};

/**
 * @param {Object} fnUnit
 * @param {String} tid 테이블 ID
 * @return {String}
 */
FnUnitUtils.prototype.getKeyByTableId = function (fnUnit, tid) {
    if (!fnUnit) return '';

    var meta = this.getMeta(fnUnit);

    if (!meta) return '';

    var puts = _.assign({}, this.getInputs(fnUnit), this.getOutputs(fnUnit));

    for (var key in puts) {
        if ((puts[key]).indexOf(tid) > -1) {
            return key;
        }
    }
};

/**
 * @param {Object} fnUnit
 * @param {String} tid 테이블 ID
 * @return {String}
 */
FnUnitUtils.prototype.getTypeByTableId = function (fnUnit, tid) {
    if (!fnUnit) return '';

    var meta = this.getMeta(fnUnit);

    if (!meta) return DATA_TYPES.TABLE;

    var puts = _.assign({}, this.getInputs(fnUnit), this.getOutputs(fnUnit));

    for (var key in puts) {
        if ((puts[key]).indexOf(tid) > -1) {
            return meta[key].type;
        }
    }

    return '';
};

/**
 * @param {Object} fnUnit
 * @param {String} tid 테이블 ID
 * @return {String}
 */
FnUnitUtils.prototype.getTypeByKey = function (fnUnit, key) {
    if (!fnUnit) return '';

    var meta = this.getMeta(fnUnit);

    if (!meta) return DATA_TYPES.TABLE;

    return meta[key].type;

};

/**
 * @param {Object} fnUnit
 * @return {Array<String>}
 */
FnUnitUtils.prototype.getInTable = function (fnUnit) {
    var tables = [];
    var meta = this.getMeta(fnUnit);
    if (!meta) {
        tables = fnUnit[IN_DATA];
    } else {
        var inputs = this.getInputs(fnUnit);

        for (var key in inputs) {
            if (!inputs[key]) continue;
            if (meta[key].type === DATA_TYPES.TABLE && inputs[key]) {
                tables = tables.concat(inputs[key]);
            }
        }
    }

    return tables;
};

/**
 * @param {Object} fnUnit
 * @return {Array<String>}
 */
FnUnitUtils.prototype.getInTableByKeys = function (fnUnit, keys) {
    var tables = [];
    var meta = this.getMeta(fnUnit);
    if (meta) {
        var inputs = this.getInputs(fnUnit);
        var key;

        for (let i = 0; i < keys.length; i++) {
            key = keys[i];
            if (!inputs[key]) continue;
            if (meta[key].type === DATA_TYPES.TABLE && inputs[key]) {
                tables = tables.concat(inputs[key]);
            }
        }
    }

    return tables;
};

/**
 * @param {Object} fnUnit
 * @return {Array<String>}
 */
FnUnitUtils.prototype.getOutTable = function (fnUnit) {
    var tables = [];
    var meta = this.getMeta(fnUnit);
    if (!meta) {
        tables = fnUnit[OUT_DATA];
    } else {
        var outputs = this.getOutputs(fnUnit);

        for (var key in outputs) {
            if (!outputs[key]) continue;
            if (meta[key].type === DATA_TYPES.TABLE && outputs[key]) {
                tables = tables.concat(outputs[key]);
            }
        }
    }

    return tables;
};

/**
 * @param {Object} fnUnit
 * @return {Array<String>}
 */
FnUnitUtils.prototype.getInModel = function (fnUnit) {
    var models = [];
    var meta = this.getMeta(fnUnit);
    if (meta) {
        var inputs = this.getInputs(fnUnit);

        for (var key in inputs) {
            if (!inputs[key]) continue;
            if (meta[key].type === DATA_TYPES.MODEL && inputs[key]) {
                models = models.concat(inputs[key]);
            }
        }
    }

    return models;
};

/**
 * @param {Object} fnUnit
 * @return {Array<String>}
 */
FnUnitUtils.prototype.getOutModel = function (fnUnit) {
    var models = [];
    var meta = this.getMeta(fnUnit);
    if (meta) {
        var outputs = this.getOutputs(fnUnit);

        for (var key in outputs) {
            if (!outputs[key]) continue;
            if (meta[key].type === DATA_TYPES.MODEL && outputs[key]) {
                models = models.concat(outputs[key]);
            }
        }
    }

    return models;
};

/**
 * @param {Object} fnUnit
 * @return {Array<String>}
 */
FnUnitUtils.prototype.getInImage = function (fnUnit) {
    var images = [];
    var meta = this.getMeta(fnUnit);
    if (meta) {
        var inputs = this.getInputs(fnUnit);

        for (var key in inputs) {
            if (!inputs[key]) continue;
            if (meta[key].type === DATA_TYPES.IMAGE && inputs[key]) {
                images = images.concat(inputs[key]);
            }
        }
    }

    return images;
};

/**
 * @param {Object} fnUnit
 * @return {Array<String>}
 */
FnUnitUtils.prototype.getOutImage = function (fnUnit) {
    var images = [];
    var meta = this.getMeta(fnUnit);
    if (meta) {
        var outputs = this.getOutputs(fnUnit);

        for (var key in outputs) {
            if (!outputs[key]) continue;
            if (meta[key].type === DATA_TYPES.IMAGE && outputs[key]) {
                images = images.concat(outputs[key]);
            }
        }
    }

    return images;
};

/**
 * @param {Object} fnUnit
 * @param {String} inOutType in / out
 * @return {Array<String>}
 */
FnUnitUtils.prototype.getPreviousFnUnits = function (fnUnit) {
    var _this = this;

    var fnUnits = [];

    var model = this.getParent(fnUnit);
    var prevFids = model.getPrevious(fnUnit.fid);

    _.forEach(prevFids, function (fid) {
        var fnUnit = model.getFnUnitById(fid);
        var tmpUnits = _this.isProcessFunction(fnUnit) ?
            model.getAllPreviousFnUnits(fnUnit.fid) :
            [fnUnit];

        fnUnits = _.union(fnUnits, tmpUnits);
    });

    return fnUnits;
};

/**
 * @param {Object} fnUnit
 * @return {Array<String>}
 */
FnUnitUtils.prototype.getLinkedTable = function (fnUnit) {
    var _this = this;

    var tables = [];
    var fnUnits = this.getPreviousFnUnits(fnUnit);

    _.forEach(fnUnits, function (fn) {
        tables = tables.concat(_this.getOutTable(fn));
    });

    return tables;
};

/**
 * @param {Object} fnUnit
 * @param {String} inOutType in / out
 * @return {Array<String>}
 */
FnUnitUtils.prototype.getTable = function (fnUnit, inOutType) {
    return (inOutType === 'in') ? this.getInTable(fnUnit) : this.getOutTable(fnUnit);
};

/**
 * @param {Object} fnUnit
 * @param {String} inOutType in / out
 * @return {Array<String>}
 */
FnUnitUtils.prototype.getModel = function (fnUnit, inOutType) {
    return (inOutType === 'in') ? this.getInModel(fnUnit) : this.getOutModel(fnUnit);
};

/**
 * @param {Object} fnUnit
 * @param {String} inOutType in / out
 * @return {Array<String>}
 */
FnUnitUtils.prototype.getImage = function (fnUnit, inOutType) {
    return (inOutType === 'in') ? this.getInImage(fnUnit) : this.getOutImage(fnUnit);
};

/**
 * @param {Object} fnUnit
 * @return {Boolean}
 */
FnUnitUtils.prototype.hasMeta = function (fnUnit) {
    return (fnUnit.meta) ? true : false;
};

/**
 * @param {Object} fnUnit
 * @return {Boolean}
 */
FnUnitUtils.prototype.hasInput = function (fnUnit) {
    var path = this._getPath(fnUnit, 'in', 'data');
    return (Brightics.VA.Core.Utils.CommonUtils.getObjByJsonPath(fnUnit, path)) ? true : false;
};

/**
 * @param {Object} fnUnit
 * @return {Boolean}
 */
FnUnitUtils.prototype.hasOutput = function (fnUnit) {
    var path = this._getPath(fnUnit, 'out', 'data');
    return (Brightics.VA.Core.Utils.CommonUtils.getObjByJsonPath(fnUnit, path)) ? true : false;
};

/**
 * @param {Object} fnUnit
 * @return {Object}
 */
FnUnitUtils.prototype.getInRange = function (fnUnit) {
    var range = {};

    var meta = this.getMeta(fnUnit);

    if (meta) {
        var inputs = this.getInputs(fnUnit);
        for (var key in inputs) {
            var type = meta[key].type;
            if (!range[type]) range[type] = {min: 0, max: 0};

            if (meta[key].range) {
                range[type].min += meta[key].range.min;
                range[type].max += meta[key].range.max;
            } else {
                range[type].min += 1;
                range[type].max += 1;
            }
        }

    } else {
        var functionDef = Brightics.VA.Core.Utils.WidgetUtils.getFunctionLibrary('data', fnUnit.func);
        range[DATA_TYPES.TABLE] = functionDef['in-range'];
    }

    return range;
};

/**
 * @param {Object} fnUnit
 * @return {Object}
 */
FnUnitUtils.prototype.getOutRange = function (fnUnit) {
    var range = {};

    var meta = this.getMeta(fnUnit);

    if (meta) {
        var outputs = this.getOutputs(fnUnit);
        for (var key in outputs) {
            var type = meta[key].type;
            if (!range[type]) range[type] = {min: 1, max: 1};

            if (meta[key].range) {
                range[type].min = meta[key].range.min;
                range[type].max = meta[key].range.max;
            }
        }

    } else {
        var functionDef = Brightics.VA.Core.Utils.WidgetUtils.getFunctionLibrary('data', fnUnit.func);
        range[DATA_TYPES.TABLE] = functionDef['out-range'];
    }

    return range;
};

FnUnitUtils.prototype.getTotalInRangeCount = function (fnUnit) {
    var count = {min: 0, max: 0};

    var range = this.getInRange(fnUnit);

    for (var key in range) {
        count.min += range[key].min;
        count.max += range[key].max;
    }

    return count;
};

FnUnitUtils.prototype.getTotalOutRangeCount = function (fnUnit) {
    var count = {min: 0, max: 0};

    var range = this.getOutRange(fnUnit);

    for (var key in range) {
        count.min += range[key].min;
        count.max += range[key].max;
    }

    return count;
};

FnUnitUtils.prototype.getKeyByType = function (fnUnit, type, inOutType) {
    var meta = this.getMeta(fnUnit);
    if (!meta) return undefined;

    var puts = (inOutType === 'in') ? this.getInputs(fnUnit) : this.getOutputs(fnUnit);

    for (var key in puts) {
        if (meta[key].type === type) return key;
    }

    return undefined;
};

FnUnitUtils.prototype.isProcessFunction = function (fnUnit) {
    var funcList = ['SetValue', 'ImportData', 'ExportData', 'brightics.function.io$unload_model'];
    var isProcessFunction = false;

    isProcessFunction = funcList.indexOf(fnUnit[FUNCTION_NAME]) >= 0;

    return isProcessFunction;
};

FnUnitUtils.prototype.isSkip = function (fnUnit) {
    return fnUnit.skip && _.isEqual(fnUnit.skip, true);
};

FnUnitUtils.prototype.getDefinition = function (type, func) {
    return Brightics.VA.Core.Utils.WidgetUtils.getFunctionLibrary(type, func);
};

FnUnitUtils.prototype.isExist = function (sourceFnUnit, targetFnUnit) {
    var sourceOutData = this.getOutData(sourceFnUnit);
    var targetInData = this.getInData(targetFnUnit);

    _.forEach(sourceOutData, function (sourceData) {
        _.forEach(targetInData, function (targetData) {
            if (sourceData === targetData) return true;
        });
    });
    return false;
};

FnUnitUtils.prototype.isConnectable = function (sourceFnUnit, targetFnUnit) {
    // 1. connectable-functions
    var sourceDef = this.getDefinition('data', sourceFnUnit.func);
    var targetDef = this.getDefinition('data', targetFnUnit.func);

    if (sourceDef['connectable-functions']) {
        if (sourceDef['connectable-functions'].indexOf(targetFnUnit.func) < 0) {
            return false;
        }
    } else if (targetDef['acceptable-functions']) {
        if (targetDef['acceptable-functions'].indexOf(sourceFnUnit.func) < 0) {
            return false;
        }
    }

    // 2. Data Type 체크
    var sourceOutTypes = this.getOutputTypes(sourceFnUnit);
    var targetInTypes = this.getInputTypes(targetFnUnit);
    var typeCount = 0;

    for (var sourceType of sourceOutTypes) {
        if (targetInTypes.indexOf(sourceType) > -1) typeCount++;
    }
    if (typeCount === 0) return false;

    // 3. 갯수 체크
    var targetInRange = this.getInRange(targetFnUnit);
    var connectableCount = 0;

    for (var type in targetInRange) {
        var inMax = targetInRange[type].max;
        var inData = this.getInData(targetFnUnit, type);

        if (inData.length < inMax) connectableCount++;
    }

    if (connectableCount === 0) return false;

    return true;
};

FnUnitUtils.prototype.connect = function (sourceFnUnit, targetFnUnit) {
    var sourceOutData = this.getOutData(sourceFnUnit);
    var targetInputTypes = this.getInputTypes(targetFnUnit);

    var sourceType = {
        table: [],
        model: [],
        image: [],
    }

    for (var i in sourceOutData) {
        var tid = sourceOutData[i];

        let type = this.getTypeByTableId(sourceFnUnit, tid);

        sourceType[type].push(tid);
    }

    for (let type in sourceType) {
        if (sourceType[type].length === 0) continue;
        if (targetInputTypes.indexOf(type) > -1) this.addInData(targetFnUnit, type, sourceType[type]);
    }
};

FnUnitUtils.prototype.disconnect = function (sourceFnUnit, targetFnUnit) {
    var sourceOutData = this.getOutData(sourceFnUnit);

    var sourceType = {
        table: [],
        model: [],
        image: [],
    }

    //source에서 모든 tid를 찾아서 target에서 지워준다.
    for (var i in sourceOutData) {
        var tid = sourceOutData[i];

        let type = this.getTypeByTableId(sourceFnUnit, tid);

        sourceType[type].push(tid);
    }

    for (let type in sourceType) {
        if (sourceType[type].length === 0) continue;

        this.removeInData(targetFnUnit, type, sourceType[type]);
    }
};

FnUnitUtils.prototype.addInData = function (fnUnit, type, tids) {
    var _this = this;

    if (tids.length === 0) return;

    if (type === DATA_TYPES.TABLE) {

        var meta = this.getMeta(fnUnit);
        if (meta) {
            let inputs = this.getInputs(fnUnit);
            _.forEach(inputs, function (input, key) {
                if (_.isArray(input) && _.isEqual(type, _this.getTypeByKey(fnUnit, key))) {
                    fnUnit.inputs[key] = _.union([], input, tids);
                } else {
                    if (_.isEmpty(input) &&
                        _.isEqual(type, _this.getTypeByKey(fnUnit, key)) &&
                        _.isEmpty(_this.getKeyByTableId(fnUnit, tids[0]))) {
                        fnUnit.inputs[key] = tids[0];
                    }
                }

            });
        } else {
            fnUnit[IN_DATA].push(tids[0]);
        }

    } else if (type === 'model') {
        let inputs = this.getInputs(fnUnit);
        _.forEach(inputs, function (input, key) {
            if (_.isArray(input) && _.isEqual(type, _this.getTypeByKey(fnUnit, key))) {
                fnUnit.inputs[key] = _.union([], input, tids);
            } else {
                if (_.isEmpty(input) &&
                    _.isEqual(type, _this.getTypeByKey(fnUnit, key)) &&
                    _.isEmpty(_this.getKeyByTableId(fnUnit, tids[0]))) {
                    fnUnit.inputs[key] = tids[0];
                }
            }
        });
    } else if (type === 'image') {
        let inputs = this.getInputs(fnUnit);
        _.forEach(inputs, function (input, key) {
            if (_.isArray(input) && _.isEqual(type, _this.getTypeByKey(fnUnit, key))) {
                fnUnit.inputs[key] = _.union([], input, tids);
            } else {
                if (_.isEmpty(input) &&
                    _.isEqual(type, _this.getTypeByKey(fnUnit, key)) &&
                    _.isEmpty(_this.getKeyByTableId(fnUnit, tids[0]))) {
                    fnUnit.inputs[key] = tids[0];
                }
            }
        });
    }
};

FnUnitUtils.prototype.removeInData = function (fnUnit, type, tids) {
    if (tids.length === 0) return;

    var tids = (Array.isArray(tids)) ? tids : [tids];
    var meta = this.getMeta(fnUnit);
    if (meta) {
        _.forEach(this.getInputs(fnUnit), function (input, key) {
            _.forEach(tids, function (tid) {
                if (_.isArray(input) && _.indexOf(input, tid) > -1) {
                    _.remove(input, function (id) {
                        return id == tid;
                    });
                    fnUnit.inputs[key] = input;
                } else if (_.isEqual(input, tid)) {
                    fnUnit.inputs[key] = '';
                }
            });
        });
    } else {
        Brightics.VA.Core.Utils.CommonUtils.removeArrayElement(fnUnit[IN_DATA], tids);
    }
};

FnUnitUtils.prototype.createOutData = function (type, func) {
    var funcDefinition = this.getDefinition('data', func);
    var fnUnit = $.extend(true, {}, funcDefinition.defaultFnUnit);

    var outData = {};
    var meta = fnUnit.meta;

    if (meta) {
        outData['outputs'] = fnUnit['outputs'];

        for (var key in outData['outputs']) {
            if (Array.isArray(outData['outputs'][key])) {
                outData['outputs'][key].push(Brightics.VA.Core.Utils.IDGenerator.table.id());
            } else {
                outData['outputs'][key] = Brightics.VA.Core.Utils.IDGenerator.table.id();
            }
        }

    } else {
        outData[OUT_DATA] = fnUnit[OUT_DATA];

        var outRange = funcDefinition['out-range'];
        for (var i = 0; i < outRange.min; i++) {
            outData[OUT_DATA].push(Brightics.VA.Core.Utils.IDGenerator.table.id());
        }
    }

    return outData;
};

FnUnitUtils.prototype.wrapInputs = function (inputs) {
    if (Array.isArray(inputs)) return {inData: inputs};
    else return {inputs: inputs};
};

FnUnitUtils.prototype.clearInData = function (fnUnit) {
    if (this.hasInput(fnUnit)) {
        var meta = this.getMeta(fnUnit);
        if (meta) {
            for (var key in fnUnit['inputs']) {
                var newInputs = (Array.isArray(fnUnit['inputs'][key])) ? [] : '';
                fnUnit['inputs'][key] = newInputs;
            }
        } else {
            fnUnit[IN_DATA] = [];
        }
    }
};

FnUnitUtils.prototype.isArray = function (target) {
    return Array.isArray(target);
};

FnUnitUtils.prototype.getFunc = function (fnUnit) {
    return (fnUnit) ? fnUnit.func : '';
};

FnUnitUtils.prototype.getName = function (fnUnit) {
    return (fnUnit) ? fnUnit.name : '';
};

FnUnitUtils.prototype.getLabel = function (fnUnit) {
    return (fnUnit) ? fnUnit.display.label : '';
};

FnUnitUtils.prototype.getId = function (fnUnit) {
    return (fnUnit) ? fnUnit.fid : '';
};

FnUnitUtils.prototype.getParam = function (fnUnit) {
    return (fnUnit) ? fnUnit.param : {};
};

FnUnitUtils.prototype.getKeyLabel = function (fnUnit, key) {
    var meta = this.getMeta(fnUnit);
    return _.isEmpty(meta) ? '' : meta[key]['label'] ? meta[key]['label'] : key;
};

FnUnitUtils.prototype.getCategory = function (fnUnit) {
    var def = this.getDefinition('data', fnUnit.func);
    return def.category;
};

FnUnitUtils.prototype.getContext = function (fnUnit) {
    return fnUnit.context || 'scala';
};

FnUnitUtils.prototype.isFlexibleFunction = function (fnUnit) {
    if (this.getCategory(fnUnit) === 'control'
        || this.getCategory(fnUnit) === 'script'
        || this.getFunc(fnUnit) === 'rowAppend') {
        return true;
    }
    return false;
};

FnUnitUtils.prototype.inputChangable = function (fnUnit) {
    if (this.getCategory(fnUnit) === 'script'
        || this.getFunc(fnUnit) === 'rowAppend') {
        return false;
    }
    return true;
};

FnUnitUtils.prototype.getDataPanel = function (fnUnit, inOutType) {
    var panel = Brightics.VA.Core.Editors.Sheet.Panels.DataPanel;
    if (inOutType === 'out') {
        var func = this.getFunc(fnUnit);
        panel =
            (Brightics.VA.Implementation.DataFlow.Functions[func] &&
                Brightics.VA.Implementation.DataFlow.Functions[func].DataPanel) || panel;
    }

    return panel;
};

FnUnitUtils.prototype.getParent = function (fnUnit) {
    return typeof fnUnit.parent === 'function' ? fnUnit.parent() :
        Studio.getEditorContainer().getActiveModelEditor().getActiveModel();
};

FnUnitUtils.prototype.hasTable = function (fnUnit) {
    var types = this.getTypes(fnUnit);
    return types.indexOf(DATA_TYPES.TABLE) > -1;
};

FnUnitUtils.prototype.changeData = function (fnUnit, oldData, newData) {
    if (this.hasMeta(fnUnit)) {
        var inputs = this.getInputs(fnUnit);
        var outputs = this.getOutputs(fnUnit);

        _.forEach(inputs, function (tid, key) {
            if (_.isEqual(tid, oldData)) fnUnit.inputs[key] = newData;
        })

        _.forEach(outputs, function (tid, key) {
            if (_.isEqual(tid, oldData)) fnUnit.outputs[key] = newData;
        })

        var a = (x) => {
            if (_.isString(x)) {
                return _.isEqual(x, oldData) ? newData : x;
            }
            if (_.isArray(x)) {
                return x.map((e) => a(e));
            }
            if (_.isObject(x)) {
                return _.zipObject(Object.entries(x).map((kv) => {
                    var k = kv[0];
                    var v = kv[1];
                    return [k, a(v)];
                }));
            }
        };

        if (fnUnit.inputs) {
            fnUnit.inputs = a(fnUnit.inputs);
        }
        if (fnUnit.outputs) {
            fnUnit.outputs = a(fnUnit.outputs);
        }
    } else {
        _.forEach(fnUnit.inData, function (tid, index) {
            if (_.isEqual(tid, oldData)) fnUnit.inData[index] = newData;
        })

        _.forEach(fnUnit.outData, function (tid, index) {
            if (_.isEqual(tid, oldData)) fnUnit.outData[index] = newData;
        })
    }
};

FnUnitUtils.prototype.isDustNode = function (fnUnit) {
    var dustList = ['brightics'];

    if (dustList.indexOf(this.getCategory(fnUnit)) > -1) return true;
    return false;
};

FnUnitUtils.prototype.isBluffNode = function (fnUnit) {
    if (!(fnUnit.inData ||
        fnUnit.outData ||
        fnUnit.inputs ||
        fnUnit.outputs)) return true;
    return false;
};

FnUnitUtils.prototype.isInputtable = function (fnUnit) {
    var isInputtable = false;

    isInputtable =
        this.getTotalInRangeCount(fnUnit).min > 0 ? true : false ||
            this.isBluffNode(fnUnit);

    return isInputtable;
};

FnUnitUtils.prototype.isOutputtable = function (fnUnit) {
    var isOutputtable = false;

    isOutputtable =
        Brightics.VA.Core.Utils.WidgetUtils.getFunctionLibrary('data', fnUnit.func)['out-node'] ? false : true ||
            this.isBluffNode(fnUnit);

    return isOutputtable;
};

FnUnitUtils.prototype.isSkippable = function (fnUnit) {
    return this.isBluffNode(fnUnit) || this.isProcessFunction(fnUnit);
};

FnUnitUtils.prototype.isAvailable = function (fnUnit) {
    var func = this.getFunc(fnUnit);
    return !_.isUndefined(Brightics.VA.Core.Interface.Functions['data'][func]);
};

FnUnitUtils.prototype.isThirdPartyFunction = function (fnUnit) {
    var funcList = ['DataFrameExportForTableau', 'DataFrameExportForMSTR', 'DataFrameExportForQlikSense'];
    var isThirdPartyFunction = false;
    isThirdPartyFunction = funcList.indexOf(fnUnit[FUNCTION_NAME]) >= 0;
    return isThirdPartyFunction;
};

var fnUnitUtils = new FnUnitUtils();

export {fnUnitUtils as FnUnitUtils};
