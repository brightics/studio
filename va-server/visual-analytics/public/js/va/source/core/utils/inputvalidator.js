/**
 * Created by SDS on 2016-01-28.
 */
(function () {
    'use strict';

    var root = this;

    // IE와 Chrome이 달라서 IE Event.key -> Chrome Event.key
    // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
    var getKey = function (evt) {
        var map = {
            'Spacebar': ' ',
            'Up': 'ArrowUp',
            'Down': 'ArrowDown',
            'Left': 'ArrowLeft',
            'Right': 'ArrowRight'
        };
        return map[evt.key] || evt.key;
    };

    root.Brightics.VA.Core.Utils.InputValidator = {

        isDefaultKeyCode: function (keyEvent) {
            var keyCode = keyEvent.keyCode,
                isCtrlKey = keyEvent.ctrlKey;
            // Allow: backspace, delete, tab, escape, enter
            if ($.inArray(keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
                // Allow: Ctrl + anythig
                (isCtrlKey) ||
                // Allow: Shift, Ctrl
                (keyCode === 16 || keyCode === 17) ||
                // Allow: home, end, left, right, down, up
                (keyCode >= 35 && keyCode <= 40)) {
                return true;
            } else {
                return false
            }
        },
        isNotInsertKeyCode: function (keyEvent) {
            var keyCode = keyEvent.keyCode,
                isCtrlKey = keyEvent.ctrlKey;
            // Allow: backspace, escape, delete, delete(Mozilla)
            if ($.inArray(keyCode, [8, 27, 46, 110]) !== -1 ||
                // Allow: Ctrl + 'a', 'c', 'x', 'z'
                (isCtrlKey && $.inArray(keyCode, [65, 67, 88, 90]) !== -1 ) ||
                // Allow: home, end, left, right, down, up
                (keyCode >= 35 && keyCode <= 40)) {
                return true;
            } else {
                return false
            }
        },
        isValid: {
            // true: 0-9, a-z, A-Z, _
            type1: function (str) {
                var reg = new RegExp('^[a-zA-Z0-9_]+$');
                return reg.test(str);
            },
            // true: 0-9, a-z, A-Z, _, space
            type2: function (str) {
                var reg = new RegExp('^[a-zA-Z0-9_\\s]+$');
                return reg.test(str);
            },
            // true: 0-9, a-z, A-Z, _, space, {, } ,$
            type3: function (str) {
                var reg = new RegExp('^[a-zA-Z0-9_{}\\$]+$');
                return reg.test(str);
            },
            // true: 0-9, a-z, A-Z, _, .
            type4: function (str) {
                var reg = new RegExp('^[a-zA-Z0-9_\\.]+$');
                return reg.test(str);
            },
            // true: start with _, 0-9
            type5: function (str) {
                var reg = new RegExp('^[0-9_]');
                return reg.test(str);
            },
            // true: only alphabet and space (User Name)
            type6: function (str) {
                var reg = new RegExp('^[a-zA-Z ]+$');
                return reg.test(str);
            },
            // true: not start with "0-9"
            columnNameType: function (str) {
                var reg = new RegExp('^[0-9]+');
                return !reg.test(str);
            },
            integerType: function (str) {
                var reg = new RegExp('^[0-9]+$');
                return reg.test(str);
            },
            startWithSpace: function (str) {
                var reg = new RegExp('^\\s');
                return reg.test(str);
            },
            endWithSpace: function (str) {
                var reg = new RegExp('\\s$');
                return reg.test(str);
            },
            cronType: function (str) {
                var reg = new RegExp('^[A-Z0-9-?*/,# ]+$');
                return reg.test(str);
            },
            // true: . - ~ 만 허용
            rangeType: function (str) {
                var reg = new RegExp('^[0-9_.-~]+$');
                return reg.test(str);
            },
            // true: 숫자 . ~ 만 허용
            featureEncodingRangeType: function (str) {
                var reg = new RegExp('^[0-9_.~]+$');
                return reg.test(str);
            },
            fileNameType: function (str) {
                var reg = new RegExp('^[a-zA-Z0-9_./@]+$');
                return reg.test(str);
            },
            renamefileType: function (str) {
                var reg = new RegExp('^[a-zA-Z0-9_.]+$');
                return reg.test(str);
            }
        },
        replaceKoreanToEmpty: function (str) {
            return str.replace(/[ㄱ-ㅎㅏ-ㅣ가-힣]/g, '');
        },
        appendValidationCondition: function ($control) {
            var validator = this;
            if ($control.attr('valid-type')) {
                var validType = $control.attr('valid-type');

                $control.on('paste', function (e) {
                    var pastedString =
                        (e.originalEvent.clipboardData || window.clipboardData).getData('Text');

                    if (!validator.isValid[validType](pastedString)) {
                        e.preventDefault();
                        var message = '※ This pasted string is NOT allowed.';
                        Brightics.VA.Core.Widget.Factory.createFadeOutMessage($control, {message: message});
                    }
                });

                $control.keydown(function (e) {
                    if (validator.isDefaultKeyCode(e)) {
                        return;
                    }
                    var key = getKey(e);
                    // FIXME: IE에서 한영키가 안잡힘.
                    if (!validator.isValid[validType](key) && key === 'Process') {
                        let message = '※ Korean character is NOT allowed.';
                        Brightics.VA.Core.Widget.Factory.createFadeOutMessage($control, {message: message});

                        var replacedValue = validator.replaceKoreanToEmpty($control.val());

                        if (validator.replaceKoreanToEmptyTimeout) {
                            clearTimeout(validator.replaceKoreanToEmptyTimeout);
                        }
                        validator.replaceKoreanToEmptyTimeout = setTimeout(function () {
                            $control.val(replacedValue);
                        }, 100);


                    } else if (!validator.isValid[validType](key)) {
                        e.preventDefault();
                        let message = '※ This character( ' + key + ' ) is NOT allowed.';
                        Brightics.VA.Core.Widget.Factory.createFadeOutMessage($control, {message: message});
                    }

                })
            }

        }
    }

}).call(this);