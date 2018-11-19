/* -----------------------------------------------------
 *  merge-palette.js
 *  Created by hyunseok.oh@samsung.com on 2018-05-18.
 * ---------------------------------------------------- */

var getOrder = function (a, b, key) {
    var aHas = a.reduce(function (acc, x, idx) {
        acc[x[key]] = idx + 1;
        return acc;
    }, {});

    var intersect = b.reduce(function (acc, x, idx) {
        if (aHas[x[key]]) acc[x[key]] = idx + 1;
        return acc;
    }, {});

    var onlyBHas = b.reduce(function (acc, x, idx) {
        if (!intersect[x[key]]) acc[x[key]] = idx + 1;
        return acc;
    }, {});

    var sortByIdx = function (set) {
        var arr = [];
        for (var key in set) {
            arr.push({
                key: key,
                idx: set[key]
            });
        }
        arr.sort(function (a, b) {
            return a.idx - b.idx;
        });
        return arr;
    };

    var order = [aHas, onlyBHas].map(sortByIdx)
        .reduce(function (a, b) {
            return a.concat(b);
        }, [])
        .map(function (x) {
            return x.key;
        });
    return order;
};

var mergeFunction = function (a, b) {
    var fns = a.concat(b).reduce(function (acc, fn) {
        acc[fn.func] = fn;
        return acc;
    }, {});
    var order = getOrder(a, b, 'func');
    return order.map(function (key) {
        return fns[key];
    });
};

var mergeCategory = function (_a, b) {
    var a = _a || {
        label: '',
        key: '',
        visible: false,
        functions: []
    };

    return {
        label: b.label,
        key: b.key,
        visible: b.visible,
        functions: mergeFunction(a.functions, b.functions)
    };
};

var checkLegacy = function (_palette) {
    var palette = _palette || [];
    return palette.filter(function (category) {
        if (!category.key) return true;
    }).length > 0;
};

var labelToKey = function (label) {
    return label.split('').filter(function (chr) {
        var rejected = '-_/ ';
        return rejected.indexOf(chr) === -1;
    })
        .map(function (chr) {
            return chr.toLowerCase();
        })
        .join('');
};

var migrateLegacy = function (_palette) {
    var palette = _palette || [];
    return palette.map(function (category) {
        var key = category.key || category.category || labelToKey(category.label);
        delete category.category;
        category.key = key;
        return category;
    });
};

var getPalette = function (path) {
    try {
        var palette = JSON.parse(__REQ_fs.readFileSync(path, 'utf8'));
        if (checkLegacy(palette)) {
            var newPalette = migrateLegacy(palette);
            __REQ_fs.writeFileSync(path, JSON.stringify(newPalette, null, 4), 'utf8');
            return newPalette;
        }
        return palette;
    } catch (e) {
        return [];
    }
};

var mergePalette = function (def, _conf) {
    var conf = _conf || [];

    var categ = {};
    def.forEach(function (cat, idx) {
        categ[cat.key] = cat;
    });

    conf.forEach(function (cat, idx) {
        categ[cat.key] = mergeCategory(categ[cat.key], cat);
    });

    var order = getOrder(def, conf, 'key');
    var palette = order.map(function (key) {
        return categ[key];
    });
    return palette;
};

var getPaletteByModelType = function (modelType) {
    var defaultPalette = getPalette('./public/static/palette/' + modelType + '/palette.default.json');
    var customPalette = getPalette('./public/static/palette/' + modelType + '/palette.json');
    var palette = mergePalette(defaultPalette, customPalette);
    return palette;
};

module.exports = getPaletteByModelType;
