(function () {
    'use strict';

    var root = this;
    const currentLang = Brightics.VA.SettingStorage.getCurrentLanguage();
    root.Brightics.VA.Core.Functions.Library = {
        init: function () {
            for (const [fnId, fn] of Object.entries(this)) {
                if(typeof fn === 'object' && fn.defaultFnUnit) {
                    this[fnId] = Brightics.VA.Core.Utils.CommonUtils.configureFn2(fn);
                }
            }
        },
        getListByTags: function (tags) {
            var list = [];
            for (var key in this) {
                var findFlag = false;
                var fnUnitTags = this[key].tags;
                if (fnUnitTags) {
                    var temp = $.grep(fnUnitTags, function (tag) {
                        var matched = false;
                        for (var i in tags) {
                            if (tag.toLowerCase().indexOf(tags[i].toLowerCase()) > -1) matched = true;
                        }
                        return matched;
                    });
                    if (temp.length > 0) {
                        findFlag = true;
                        list.push(key);
                    }
                }

                // Tag로 못 찾은 경우, Label로 한번 더 검색 (UDF의 경우 ver로 검색이 안되기 때문에 로직 추가)
                if (!findFlag && this[key] && this[key].defaultFnUnit && this[key].defaultFnUnit.display && this[key].defaultFnUnit.display.label) {
                    let displayLabel = (this[key].defaultFnUnit.label && this[key].defaultFnUnit.label[currentLang]) ? this[key].defaultFnUnit.label[currentLang] : this[key].defaultFnUnit.display.label;

                    for (let i in tags) {
                        if (displayLabel.toLowerCase().indexOf(tags[i].toLowerCase()) > -1) {
                            list.push(key);
                            break;
                        }
                    }
                }
            }
            return list;
        },
        getFunction: function (func) {
            return $.extend(true, {}, this[func]);
        },
        extendFunctions: function (funcList) {
            const functions = {};
            let clone;
            for (let i = 0; i < funcList.length; i++) {
                clone = $.extend(true, {}, this[funcList[i]]);
                functions[funcList[i]] = Brightics.VA.Core.Utils.CommonUtils.configureFn2(clone);
            }
            return functions;
        },
        addFunction: function (key, func) {
            this[key] = func;
        },
        getFunctionViewer: function (func, inOutType) {
            var viewerLists = [];

            if (Brightics.VA.Core.Functions.Viewer[func]) {
                viewerLists = Brightics.VA.Core.Functions.Viewer[func][inOutType];
            } else {
                viewerLists.push('data');
            }

            return viewerLists;
        }
    };
}).call(this);
