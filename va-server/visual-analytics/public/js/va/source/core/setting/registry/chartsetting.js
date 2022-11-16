/* global brtc_require, _ */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var crel = brtc_require('crel');

    var DEBUG = false;

    var debug = function () {
        if (DEBUG) console.log.apply(console, arguments);
    };

    function ChartSetting(parentId, options) {
        Brightics.VA.Setting.BaseSetting.call(this, parentId, options);
    }

    ChartSetting.prototype = Object.create(Brightics.VA.Setting.BaseSetting.prototype);
    ChartSetting.prototype.constructor = ChartSetting;

    ChartSetting.prototype.initSettingId = function ($parent) {
        this.SettingId = {
            use: 'chart.table.formatter.use',
            double: 'chart.table.formatter.double',
            integer: 'chart.table.formatter.integer',
            exponential: 'chart.table.formatter.exponential',
            type: 'chart.table.formatter.type',
            pivot: 'chart.table.formatter.pivot',
            selectedPalette: 'chart.style.selectedColorSet',
            palette: 'chart.style.colorSet'
        };
    };

    ChartSetting.prototype.createContents = function ($parent) {
        Brightics.VA.Setting.BaseSetting.prototype.createContents.call(this, $parent);

        this.createFormatterControl();
        this.createCustomColorPalettes();
    };

    ChartSetting.prototype.createFormatterControl = function () {
        var _this = this;

        var $controlWrapper = $('' +
            '<div class="brtc-va-setting-component-wrapper">' +
            '   <div class="' + this._parseSettingIdToClassName(this.getSettingId('use')) + ' brtc-va-setting-component brtc-style-display-flex brtc-style-align-items-center">' +
            '       <div class="brtc-va-setting-checkbox-content use"></div>' +
            '       <div class="brtc-va-setting-checkbox-label brtc-style-setting-label brtc-style-flex-1">'+Brightics.locale.sentence.S0009+'</div>' +
            '   </div>' +
            '   <div class="' + this._parseSettingIdToClassName(this.getSettingId('number')) + ' brtc-va-setting-component brtc-style-display-flex brtc-style-align-items-center">' +
            '       <div class="brtc-style-display-none" brtc-va-setting-component brtc-style-display-flex brtc-style-align-items-center">' +
            '           <div class="brtc-va-setting-input-content-label">Integer</div>' +
            '           <div class="brtc-va-setting-input-content number integer"></div>' +
            '       </div>' +
            '       <div class="brtc-va-setting-component brtc-style-display-flex brtc-style-align-items-center">' +
            '           <div class="brtc-va-setting-input-content-label" style="width: 100px">'+Brightics.locale.common.decimalPlace+'</div>' +
            '           <div class="brtc-va-setting-input-content number double"></div>' +
            '       </div>' +
            '   </div>' +
            '</div>');

        this.$mainControl.append($controlWrapper);

        this.$useControl = $controlWrapper.find('.brtc-va-setting-checkbox-content.use');
        this.$useControl.jqxCheckBox({
            theme: Brightics.VA.Env.Theme
        });

        var [$numberControl, $integerControl] = [
            '.brtc-va-setting-input-content.double',
            '.brtc-va-setting-input-content.integer'
        ].map((cls) => $controlWrapper.find(cls));
        [this.numberControl, this.integerControl] = [
            $numberControl,
            $integerControl
        ].map(($el) => {
            return this._createNumericInput($el, {
                numberType: 'int',
                min: 0,
                max: 10,
                minus: false,
                placeholder: 'Enter value'
            });
        });

        const els = [this.numberControl, this.integerControl];
        const zipped = _.zip(['double', 'integer'], els);
        this.$useControl.on('change', (event) => {
            var checked = event.args.checked;

            els.forEach((el) => el.setDisabled(!checked));
            if (!checked) {
                Brightics.Chart.Helper.PreferenceUtils.clearTableFormatter();
            }

            this.changeValue(this.getSettingId('use'), checked);
            if (checked) {
                zipped.forEach(([key, el]) => {
                    this.changeValue(this.getSettingId(key), el.getValue());
                });
            }
        });

        zipped.forEach(([key, el]) => {
            el.onChange(() => {
                const val = el.getValue();
                Brightics.Chart.Helper.PreferenceUtils.setTableFormatter([{type: key, digit: 3}]);
                _this.changeValue(_this.getSettingId(key), val);
            });
        });

        this._createEditorTagList(this.$mainControl, ['data', 'visual']);

        this.controlList.push($controlWrapper);
    };

    ChartSetting.prototype.createSingleRowPivotControl = function ($parent) {
        var _this = this;

        var $controlWrapper = $('' +
            '<div class="brtc-va-setting-component-wrapper">' +
            '   <div class="' + this._parseSettingIdToClassName(this.getSettingId('pivot')) + ' brtc-va-setting-component brtc-style-display-flex brtc-style-align-items-center">' +
            '       <div class="brtc-va-setting-checkbox-content pivot"></div>' +
            '       <div class="brtc-va-setting-checkbox-label brtc-style-setting-label brtc-style-flex-1"> Pivot single-row table (will be applied after screen refresh)</div>' +
            '</div>');

        this.$mainControl.append($controlWrapper);

        this.$pivotControl = $controlWrapper.find('.brtc-va-setting-checkbox-content.pivot');
        this.$pivotControl.jqxCheckBox({
            theme: Brightics.VA.Env.Theme
        });

        this.$pivotControl.on('change', function (event) {
            var checked = event.args.checked;

            if (checked) {
                Brightics.Chart.Helper.PreferenceUtils.setTableFormatter([{pivot: 'true'}]);
            } else {
                Brightics.Chart.Helper.PreferenceUtils.setTableFormatter([{pivot: 'false'}]);
            }
            _this.changeValue(_this.getSettingId('pivot'), checked);
        });
    };

    ChartSetting.prototype.createCustomColorPalettes = function () {
        var PALETTE_ITEM = 'brtc-va-setting-component-palette__item';
        var PALETTE_BUTTON = 'brtc-va-setting-component-palette__button';
        var PALETTE_INPUT = 'brtc-va-setting-component-palette__input';
        var PALETTE_SELECTOR = 'brtc-va-setting-component-palette__selecor';
        var PALETTE_BUTTON_WRAPPER = 'brtc-va-setting-component-palette__button-wrapper';
        var PALETTE_WRAPPER = 'brtc-va-setting-component-palette__wrapper';
        var self = this;
        var $controlWrapper = $('' +
            '<div class="brtc-va-setting-component-wrapper" style="margin-top: 20px;">' +
            '   <div class="' + this._parseSettingIdToClassName(this.getSettingId('palette')) + ' brtc-va-setting-component brtc-style-display-flex brtc-style-align-items-center">' +
            '       <div class="brtc-va-setting-checkbox-label brtc-style-setting-label brtc-style-flex-1">'+ Brightics.locale.sentence.S0010 +'</div>' +
            '       <div class="brtc-va-setting-checkbox-content colors"></div>' +
            '</div>');


        var store = this.getPlatteStateStore();

        var $paletteButtonWrapper = $(crel('div', {class: PALETTE_BUTTON_WRAPPER}));
        var $paletteSelector = $(crel('div', {class: PALETTE_SELECTOR}));
        var $saveButton = $(crel('div', {class: PALETTE_BUTTON}, 'Save'));
        var $saveAsButton = $(crel('div', {class: PALETTE_BUTTON}, 'Save As'));
        var $resetButton = $(crel('div', {class: PALETTE_BUTTON}, 'Reset'));
        var $deleteButton = $(crel('div', {class: PALETTE_BUTTON}, 'Delete'));
        var $okButton = $(crel('div', {class: PALETTE_BUTTON}, 'Ok'))
            .jqxButton({theme: Brightics.VA.Env.Theme});
        var $cancelButton = $(crel('div', {class: PALETTE_BUTTON}, 'Cancel'))
            .jqxButton({theme: Brightics.VA.Env.Theme});
        var $input = $(crel('input', {class: PALETTE_INPUT, maxLength: 80}));
        var $palette = $(crel('div', {class: PALETTE_WRAPPER}));

        $paletteButtonWrapper.append(
            $paletteSelector,
            $input,
            $saveButton,
            $saveAsButton,
            $resetButton,
            $deleteButton,
            $okButton,
            $cancelButton
        );

        (function (fn) {
            var last = -1;
            $paletteSelector.on('change', function (e) {
                if (last === e.args.index) return;
                // trigger 'value-change' when a value is actually changed.
                fn(e);
            });
        }(function (e) {
            var index = e.args.index;
            var selectPalette = function (index) {
                store.dispatch({
                    type: 'paletteSelected',
                    index: index
                });
                if (index === -1) return;
            };
            if (index !== store.get('index')) {
                var dirty = store.get('dirty');
                selectPalette(index);
                if (dirty) {
                    Brightics.VA.Core.Utils.WidgetUtils.openConfirmDialog(
                        'Are you sure you want to change palette?',
                        function (result) {
                            if (!result.OK) {
                                store.undo();
                            }
                            renderAll();
                        }
                    );
                } else {
                    renderAll();
                }
            }
        }));

        $input.keyup(function (e) {
            if (e.target.value !== store.get('input')) {
                store.dispatch({
                    type: 'inputChanged',
                    input: e.target.value
                });
                renderButton();
            }
        });

        $saveButton.on('click', function (e) {
            if (e.target.disabled) return;
            store.dispatch({type: 'saveClicked'});
            renderButton();
            renderDropDown();
        });

        $saveAsButton.on('click', function (e) {
            if (e.target.disabled) return;
            store.dispatch({type: 'saveAsClicked'});
            renderAll();
        });

        $resetButton.on('click', function (e) {
            if (e.target.disabled) return;
            store.dispatch({
                type: 'resetClicked'
            });
            renderButton();
            renderPalette();
        });

        $deleteButton.on('click', function (e) {
            if (e.target.disabled) return;
            store.dispatch({
                type: 'deleteClicked'
            });
            renderAll();
        });

        $okButton.on('click', function (e) {
            if (e.target.disabled) return;
            store.dispatch({
                type: 'saveOkClicked'
            });
            renderAll();
        });

        $cancelButton.on('click', function (e) {
            if (e.target.disabled) return;
            store.dispatch({
                type: 'cancelClicked'
            });
            renderAll();
        });

        var renderButton = function () {
            $saveButton.jqxButton({
                disabled: store.get('saveDisabled'),
                theme: Brightics.VA.Env.Theme
            });
            $saveAsButton.jqxButton({
                disabled: store.get('saveAsDisabled'),
                theme: Brightics.VA.Env.Theme
            });
            $deleteButton.jqxButton({
                disabled: store.get('deleteDisabled'),
                theme: Brightics.VA.Env.Theme
            });
            $okButton.jqxButton({
                disabled: !store.get('canSaveAs'),
                theme: Brightics.VA.Env.Theme
            });
            $resetButton.jqxButton({
                disabled: store.get('resetDisabled'),
                theme: Brightics.VA.Env.Theme
            });

            $saveButton.toggle(!store.get('inputActive'));
            $saveAsButton.toggle(!store.get('inputActive'));
            $deleteButton.toggle(!store.get('inputActive'));
            $resetButton.toggle(!store.get('inputActive'));
            $okButton.toggle(store.get('inputActive'));
            $cancelButton.toggle(store.get('inputActive'));
            $input.jqxInput({
                value: store.get('input'),
                width: 150
            });
            $input.toggle(store.get('inputActive'));
        };

        var renderDropDown = function () {
            $paletteSelector.jqxDropDownList({
                source: store.get('colorSet').map(function (e) {
                    return _.escape(e.name);
                }),
                selectedIndex: store.get('index'),
                theme: Brightics.VA.Env.Theme,
                width: 150
            });
            $paletteSelector.toggle(!store.get('inputActive'));
        };

        $palette.on('click', function (e) {
            if (store.get('inputActive')) return;
            if (e.target.classList.contains(PALETTE_ITEM)) {
                var idx = parseInt(e.target.getAttribute('palette-index'), 10);
                var col = e.target.getAttribute('palette-color');
                new Brightics.Chart.Adonis.Component
                    .Dialogs.ColorPickerDialog($(e.target), {
                        windowPosition: 'bottom',
                        close: function (_color) {
                            var toHex = function (v) {
                                return v >= 10 ? String.fromCharCode((v - 10) + 'A'.charCodeAt(0)) : v.toString();
                            };
                            var hexColors = function (colors) {
                                return '#' + ['r', 'g', 'b'].map(function (key) {
                                    var n = parseInt(colors[key], 10);
                                    return [parseInt(n / 16, 10), n % 16].map(toHex).join('');
                                }).join('');
                            };
                            const color = hexColors(_color);
                            if (color !== col) {
                                store.dispatch({
                                    type: 'paletteChanged',
                                    index: idx,
                                    color: color
                                });
                                $(e.target).css('background-color', color);
                                e.target.setAttribute('palette-color', color);
                                renderButton();
                            }
                        },
                        color: col
                    });
            }
        });

        var renderPalette = function () {
            var colors = store.get('tempPalette');
            $palette.empty();
            if (store.get('inputActive')) {
                $palette.addClass('saving');
            } else {
                $palette.removeClass('saving');
            }
            $palette.append(
                colors.map(function (el, idx) {
                    var $el = $(crel('div', {class: PALETTE_ITEM}));
                    $el.css('background-color', el);
                    $el.attr('palette-index', idx);
                    $el.attr('palette-color', el);
                    return $el;
                })
            );
            $palette.perfectScrollbar();
            $palette.perfectScrollbar('update');
        };

        var renderAll = function () {
            renderDropDown();
            renderButton();
            renderPalette();
        };

        renderAll();
        $controlWrapper.append($paletteButtonWrapper, $palette);
        this.$mainControl.append($controlWrapper);
    };

    ChartSetting.prototype.render = function () {
        this.renderNumberControl();
        this.renderUseControl();
    };

    ChartSetting.prototype.getPlatteStateStore = function () {
        var self = this;
        var store = (function () {
            var colorSet = JSON.parse(self.getValue(self.getSettingId('palette')));
            var selectedPalette = self.getValue(self.getSettingId('selectedPalette'));
            var selectedIndex = colorSet.findIndex(function (e) {
                return e.name === selectedPalette;
            });
            var state = {
                inputActive: false,
                input: '',
                colorSet: colorSet,
                index: selectedIndex,
                dirty: false,
                tempPalette: colorSet[selectedIndex].colors.slice()
            };

            var history = [];

            var computed = {
                deleteDisabled: function () {
                    return computed.isDefaultPalette();
                },
                paletteDisabled: function () {
                    return state.inputActive;
                },
                saveDisabled: function () {
                    return !state.dirty || computed.isDefaultPalette();
                },
                saveAsDisabled: function () {
                    return false;
                },
                resetDisabled: function () {
                    return !state.dirty;
                },
                currentPalette: function () {
                    return state.colorSet[state.index];
                },
                canSaveAs: function () {
                    const input = state.input.trim();
                    if(!input)  return false;
                    return state.colorSet.filter(function (e) {
                        return e.name === input;
                    }).length === 0;
                },
                isDefaultPalette: function () {
                    return state.index < 2;
                }
            };

            var get = function (value) {
                if (typeof value !== 'undefined') {
                    if (typeof state[value] !== 'undefined') return state[value];
                    if (typeof computed[value] === 'function') return computed[value]();
                    throw new Error('unexpected state key');
                }
                return state;
            };

            var reducer = function (state, action) {
                debug('[REDUCER]', action.type, action);
                debug('   before: ', state);
                switch (action.type) {
                case 'saveAsClicked':
                    return {
                        inputActive: true,
                        input: computed.currentPalette().name
                    };
                case 'saveClicked':
                    if (get('saveDisabled')) return {};
                    return {
                        inputActive: false,
                        colorSet: state.colorSet.map(function (palette, i) {
                            if (i === state.index) {
                                return {
                                    name: palette.name,
                                    colors: state.tempPalette.slice()
                                };
                            }
                            return palette;
                        }),
                        dirty: false
                    };
                case 'deleteClicked':
                    var nxtColorSet = state.colorSet.filter(function (a, i) {
                        return i !== state.index;
                    });
                    var nxtIndex = Math.min(state.index, nxtColorSet.length - 1);
                    return {
                        colorSet: nxtColorSet,
                        index: nxtIndex,
                        dity: false,
                        tempPalette: nxtColorSet[nxtIndex].colors.slice()
                    };
                case 'paletteSelected':
                    if (state.index === action.index) return {};
                    return {
                        index: action.index,
                        tempPalette: state.colorSet[action.index].colors.slice(),
                        dirty: false
                    };
                case 'paletteChanged':
                    var newPalette = state.tempPalette.map(function (color, i) {
                        if (i === action.index) return action.color;
                        return color;
                    });
                    return {
                        tempPalette: newPalette.slice(),
                        dirty: true
                    };
                case 'cancelClicked':
                    return {inputActive: false};
                case 'inputChanged':
                    return {input: action.input};
                case 'resetClicked':
                    return {
                        tempPalette: computed.currentPalette().colors.slice(),
                        dirty: false
                    };
                case 'saveOkClicked':
                    var newColorSet = state.colorSet.concat([{
                        name: state.input.trim(),
                        colors: state.tempPalette.slice()
                    }]);
                    return {
                        inputActive: false,
                        index: newColorSet.length - 1,
                        colorSet: newColorSet,
                        dirty: false
                    };
                default:
                    throw new Error('unexpected action');
                }
            };

            return {
                dispatch: function (action) {
                    history.push(state);
                    state = _.merge({}, state, reducer(state, action), function (a, b) {
                        if (Array.isArray(b)) return b;
                    });
                    while (history.length > 5) history.shift();
                    debug('   after: ', state);
                    self.changeValue(self.getSettingId('palette'), state.colorSet);
                    self.changeValue(self.getSettingId('selectedPalette'),
                        computed.currentPalette().name);
                },
                get: get,
                undo: function () {
                    if (history.length === 0) throw new Error('cannot undo');
                    debug('[UNDO]');
                    debug('    before: ', state);
                    state = Object.assign({}, history.pop());
                    debug('    after: ', state);
                    self.changeValue(self.getSettingId('palette'), state.colorSet);
                    self.changeValue(self.getSettingId('selectedPalette'),
                        computed.currentPalette().name);
                }
            };
        }());
        return store;
    };

    ChartSetting.prototype.renderUseControl = function () {
        this.$useControl.jqxCheckBox({checked: this.getValue(this.getSettingId('use')) == 'true'});

        if (this.getValue(this.getSettingId('use')) != 'true') {
            [this.numberControl, this.integerControl].forEach((el) => el.setDisabled(true));
        }
    };

    ChartSetting.prototype.renderNumberControl = function () {
        this.numberControl.setValue(this.getValue(this.getSettingId('double')));
        this.integerControl.setValue(this.getValue(this.getSettingId('integer')));
    };

    ChartSetting.prototype.renderPivotControl = function () {
        var _this = this;
        this.$pivotControl.jqxCheckBox({checked: _this.getValue(_this.getSettingId('pivot')) == 'true'});
    };

    ChartSetting.prototype.getIndex = function () {
        return 3;
    };

    ChartSetting.Key = 'setting-chart';
    ChartSetting.Label = Brightics.locale.common.chart;
    ChartSetting.index = 3;

    Brightics.VA.Setting.Registry[ChartSetting.Key] = ChartSetting;
}).call(this);
