/**
 * Created by SDS on 2016-01-28.
 */
(function () {
    'use strict';

    var root = this;
    var CONST = {};
    var crel = brtc_require('crel');
    CONST.USER_INPT_ARR_DELIMETER = '[i]';
    const lang = Brightics.VA.SettingStorage.getCurrentLanguage();

    const _setContents = (content) => {
        if(typeof content === 'undefined') return content;
        if(typeof content === 'string') return content;
        if(typeof content[lang] === 'undefined') return content.en;
        return content[lang];
    }

    root.Brightics.VA.Core.Utils.CommonUtils = {
        getUserBrowserName: function () {
            // Chrome 1+
            if (window.navigator.userAgent.indexOf('Chrome') >= 0) return 'Chrome';
            // if (isChrome) return 'Chrome';
            // Internet Explorer 6-11
            var isIE = /*@cc_on!@*/false || !!document.documentMode;
            if (isIE) return 'Internet Explorer';
            // Opera 8.0+
            var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
            if (isOpera) return 'Opera';
            // Firefox 1.0+
            var isFirefox = typeof InstallTrigger !== 'undefined';
            if (isFirefox) return 'Firefox';
            // Safari 3.0+ "[object HTMLElementConstructor]"
            var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0 || (function (p) {
                    return p.toString() === "[object SafariRemoteNotification]";
                })(!window['safari'] || safari.pushNotification);
            if (isSafari) return 'Safari';
        },
        downloadJsonFile: function (data, fileName) {
            var util = this;
            var browser = util.getUserBrowserName();

            var blobObject = new Blob([data], {type: 'text/json;charset=utf-8;'});
            if (browser === 'Internet Explorer') {
                window.navigator.msSaveBlob(blobObject, fileName + '.json'); // The user only has the option of clicking the Save button.
            } else {
                var fileUrl = URL.createObjectURL(blobObject);
                var anchor = document.createElement('a');
                anchor.setAttribute('href', fileUrl);
                anchor.setAttribute('download', fileName + '.json');

                // document.body.appendChild(anchor);
                anchor.click();
                URL.revokeObjectURL(fileUrl);

                // var ev = document.createEvent("MouseEvents");
                // ev.initMouseEvent("click", true, false, self, 0,0,0,0,0, false, false, false ,false, 0, null);

                // anchor.dispatchEvent(ev);
            }
        },
        numberToStringWithComma: function (number) {
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        getTimeDifferenceFromNow: function (date) {
            var oldDate = new Date(date),
                newDate = new Date();

            var diff = (newDate.getTime() - oldDate.getTime()) / (1000 * 60 * 60);

            return diff;
        },
        transferTimestampToDateString: function (timestampValue) {
            //yyyy-mm-dd HH:MM:SS
            var makeDateString = function (dateVal) {
                return (dateVal < 10) ? '0' + dateVal : dateVal;
            };

            return timestampValue.getFullYear() + '-' + makeDateString((timestampValue.getMonth() + 1)) + '-' + makeDateString(timestampValue.getDate()) + ' ' + makeDateString(timestampValue.getHours()) + ':' + makeDateString(timestampValue.getUTCMinutes()) + ':' + makeDateString(timestampValue.getUTCSeconds());

        },
        convertDataTypeForText: function (type, internalType) {
            // String, Integer, Double, Date,
            // Array(String), Array(Integer), Array(Double), Array(Date),
            // Map, XML
            //
            // => Array의 경우 다음과 같이 축약함
            // Array(S), Array(I), Array(Db), Array(Dt)

            if (type === undefined) {
                return '-';
            } else if (type.indexOf('[') !== -1) {
                var arrayType = internalType.replace('[]', '')
                var arrayTypeAbbreviation;
                switch (arrayType) {
                    case 'String' :
                        arrayTypeAbbreviation = 'S';
                        break;
                    case 'Integer' :
                        arrayTypeAbbreviation = 'I';
                        break;
                    case 'Long' :
                        arrayTypeAbbreviation = 'L';
                        break;
                    case 'Double' :
                        arrayTypeAbbreviation = 'Db';
                        break;
                    case 'Date' :
                        arrayTypeAbbreviation = 'Dt';
                        break;
                    case 'Boolean' :
                        arrayTypeAbbreviation = 'Bl';
                        break;
                    case 'Byte' :
                        arrayTypeAbbreviation = 'Bt';
                        break;
                    default:
                        arrayTypeAbbreviation = arrayType;
                }
                return 'Array(' + arrayTypeAbbreviation + ')';
            } else if (type === 'map') {
                return 'Map';
            } else {
                return internalType;
            }
        },
        convertDataTypeForTitle: function (type, internalType) {
            if (type === undefined) {
                return 'Undefined Type';
            } else if (type.indexOf('[') !== -1) {
                var arrayType = internalType.replace('[]', '');
                return 'Array(' + arrayType + ')'
            } else {
                return internalType;
            }
        },
        getTypes: function () {
            return [{
                type: 'number',
                internalType: 'Integer'
            }, {
                type: 'number',
                internalType: 'Long'
            }, {
                type: 'number',
                internalType: 'Double'
            }, {
                type: 'string',
                internalType: 'Boolean'
            }, {
                type: 'string',
                internalType: 'String'
            }, {
                type: 'number[]',
                internalType: 'Double[]'
            }, {
                type: 'number[]',
                internalType: 'Long[]'
            }, {
                type: 'string[]',
                internalType: 'Boolean[]'
            }, {
                type: 'string[]',
                internalType: 'String[]'
            }, {
                type: 'byte[]',
                internalType: 'Byte[]'
            }, {
                type: 'number[]',
                internalType: 'Double[]'
            }, {
                type: 'number[]',
                internalType: 'Long[]'
            }, {
                type: 'string[]',
                internalType: 'String[]'
            }, {
                type: 'byte[]',
                internalType: 'Byte[]'
            }, {
                type: 'map',
                internalType: 'Map(Integer,Double)'
            }, {
                type: 'map',
                internalType: 'Map(String,Double)'
            }, {
                type: 'map',
                internalType: 'Map(Integer,Double)'
            }, {
                type: 'map',
                internalType: 'Map(String,String)'
            }, {
                type: 'date',
                internalType: 'Date'
            }]
        },
        //Get object data using string
        //example)
        // input:  {
        //     inptStr: 'option.marker.markerSize',
        //     obj: Brightics.OptionCotainer
        // }
        // output: (instance of) Brightics.OptionCotainer.option.marker.markerSize
        fetchFromObject: function (inptStr, obj) {
            if (typeof inptStr === 'undefined' || typeof obj === 'undefined') {
                return;
            }
            try {
                var _index = inptStr.indexOf('.');
                var chkType = inptStr.slice(0, _index);
                var arrDelimeterIdx = chkType.indexOf(CONST.USER_INPT_ARR_DELIMETER);
                if (arrDelimeterIdx > -1) {
                    var rtnArr = [];
                    var arr = obj[inptStr.substring(0, arrDelimeterIdx)];
                    if (arr) {
                        for (var arrIdx = 0; arrIdx < arr.length; arrIdx++) {
                            var elemStr = inptStr.indexOf('.');
                            if (elemStr > -1) {
                                rtnArr.push(this.fetchFromObject(inptStr.substr(arrDelimeterIdx + 4), arr[arrIdx]));
                            }
                        }
                    }
                    return (rtnArr.length > 0) ? rtnArr : arr;
                } else {
                    // var _index = inptStr.indexOf('.');
                    if (_index > -1) {
                        return this.fetchFromObject(inptStr.substr(_index + 1), obj[inptStr.substring(0, _index)]);
                    }
                    return obj[inptStr];
                }
            } catch (e) {
                console.error(inptStr);
                console.error(e);
            }
        },
        isPC : function () {
            var pcChecker = ['win16', 'win32', 'win64', 'macintel', 'mac'];
            var isPC = true;

            if (pcChecker.indexOf(navigator.platform.toLowerCase()) < 0) {
                isPC = false;
            }

            return isPC;
        },
        byteCalculation: function (bytes) {
            var bytes = parseInt(bytes);
            var s = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
            var e = Math.floor(Math.log(bytes)/Math.log(1024));

            if(e == "-Infinity") return "0 "+s[0];
            else return (bytes/Math.pow(1024, Math.floor(e))).toFixed(2)+" "+s[e];
        },
        getQueryString: function (keyVal) {
            var queryString = _.map(keyVal, function (val, key) {
                return key + '=' + val;
            }).join('&');
            return queryString;
        },
        getObjByJsonPath: function (json, path) {
            var reducer = function(accumulator, value, index, array) {
                if (accumulator && accumulator[value]) accumulator = accumulator[value];
                else accumulator = undefined;

                return accumulator;
            };

            var resultVal = (Array.isArray(path))? path.reduce(reducer, json) : json[path];
            var resultObj;

            if(Array.isArray(resultVal)) resultObj = $.extend(true, [], resultVal);
            else if(typeof resultVal === "object") resultObj = $.extend(true, {}, resultVal);
            else resultObj = resultVal;

            return resultObj;
        },
        removeArrayElement: function (sourceArr, targetArr) {
            _.remove(sourceArr, function(source) {
                return (targetArr.indexOf(source) > -1);
            });
        },
        dim: function (_fn, _opt) {
            var opt = _opt || {};
            var $appendTo = $(opt.appendTo || document.body);

            var pr = Promise.resolve()
                .then(function () {
                    return typeof _fn === 'function' ? _fn() : _fn;
                });

            var $dim = $(
                crel('div', {class: 'brtc-dim'},
                    crel('div', {class: 'brtc-dim-text brtc-style-apper-1sendond'},
                        crel('i', {class: 'fa fa-spinner fa-pulse fa-5x fa-fw'})
                    )
                )
            );

            $appendTo.append($dim);

            return pr
                .then(function (arg) {
                    $dim.remove();
                    return arg;
                })
                .catch(function (err) {
                    $dim.remove();
                    throw err;
                });
        },
        progress: function (_fn, _opt) {
            var opt = _opt || {};
            var showPercent = opt.showPercent || false;
            var msg = opt.msg || '';
            var $appendTo = $(opt.appendTo || document.body);

            var pr = Promise.resolve()
                .then(function () {
                    return typeof _fn === 'function' ? _fn() : _fn;
                });

            var $progress = $(
                '   <div class="brtc-va-progress">' +
                '       <div>' +
                '           <span class="brtc-va-progress-loading"/>' +
                '           <p>' + msg + '</p>' +
                (showPercent ? '<p class="brtc-va-progress-percent"></p>' : '') +
                '       </div>' +
                '</div>'
            );
            $progress.css('top', '0');
            $progress.css('left', '0');

            $appendTo.append($progress);

            return pr
                .then(function (arg) {
                    $progress.remove();
                    return arg;
                })
                .catch(function (err) {
                    $progress.remove();
                    throw err;
                });
        },
        configureFn: (fn) => {
            fn.label = _setContents(fn.label)
            fn.tags = _setContents(fn.tags)
            fn.description = _setContents(fn.description)
            fn.summary = _setContents(fn.summary)
            return fn;
        },
        configureFn2: (fn) => {
            fn.tags = _setContents(fn.tags)
            fn.description = _setContents(fn.description)
            if(fn.defaultFnUnit) {
                fn.defaultFnUnit.label = _setContents(fn.defaultFnUnit.label);
                if(fn.defaultFnUnit.display && fn.defaultFnUnit.display.label) {
                    fn.defaultFnUnit.display.label = fn.defaultFnUnit.label;
                }
            }
            return fn;
        },
    };
}).call(this);
