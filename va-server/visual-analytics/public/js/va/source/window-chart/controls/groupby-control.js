/**
 * Created by sds on 2017-09-26.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var BaseControl = Brightics.Chart.Adonis.Component.Controls.BaseControl;
    var Widgets = Brightics.Chart.Adonis.Component.Widgets;

    const DEFAULT_WIDTH = '33';

    function GroupByControl(parentId, options, headerKey) {
        BaseControl.call(this, parentId, options, headerKey);
        this.renderProblem(this._validate(this.options.propOpt.groupBy));
    }

    GroupByControl.prototype = Object.create(BaseControl.prototype);
    GroupByControl.prototype.constructor = GroupByControl;

    GroupByControl.prototype._init = function () {
        BaseControl.prototype._init.call(this);
        this.titleOption = this.options.chartOption.title;
    };

    GroupByControl.prototype._createContents = function ($parent) {
        BaseControl.prototype._createContents.call(this, $parent);

        var headerOption = {
            label: 'Group By'
        };
        this.createComponentHeader(headerOption);
        this.createComponentContents();
    };

    GroupByControl.prototype.createComponentContents = function (contentsOption) {
        BaseControl.prototype.createComponentContents.call(this, contentsOption);
        this._createChartSizeWidget();
        this._createColumnSelectorWidget();
    };

    GroupByControl.prototype._createChartSizeWidget = function () {
        var _this = this;

        this.$sizeContent = $('' +
            '<div class="bos-display-flex bos-flex-direction-column">' +
            '   <div class="bo-widget-width bos-display-flex-center"></div>' +
            '   <div class="bo-widget-width-validation"></div>' +
            '   <div class="bo-widget-height bos-display-flex-center"></div>' +
            '   <div class="bo-widget-height-validation"></div>' +
            '</div>');

        this.$controlContents.append(this.$sizeContent);

        this.widthInput = Widgets.Factory.createNumberInputWidget(this.$sizeContent.find('.bo-widget-width'), {
            label: 'Width',
            width: '170px',
            value: _this.options.propOpt.width.replace(/[^0-9.]/g, ''),
            onChanged: function (value) {
                if (Number.isNaN(value)) {
                    value = Number(this.$inputControl.val().replace(/[^0-9.]/g, ''));
                } else if (value < 1) {
                    value = 1;
                } else if ((!_this.options.propOpt.widthUnit || _this.options.propOpt.widthUnit === '%') && value > 100) {
                    value = 100;
                }
                if (!_this.options.propOpt.widthUnit) _this.options.propOpt.widthUnit = _this.options.propOpt.width.replace(/[0-9]/g, '');
                _this.options.propOpt.widthValue = value;
                _this.options.propOpt.width = _this.options.propOpt.widthValue + _this.options.propOpt.widthUnit;
                this.render(value);
                this.$inputControl.trigger('blur');
            }
        });

        this.widthUnitSwitchButton = Widgets.Factory.createSwitchButtonWidget(this.$sizeContent.find('.bo-widget-width'), {
            width: '20px',
            height: '27px',
            internalLabel: 'Width',
            value: _this.options.propOpt.width.replace(/[0-9]/g, ''),
            itemList: [
                {value: 'px', label: 'Px'},
                {value: '%', label: '%'}
            ],
            onChanged: function (changedUnit) {
                if (changedUnit === '%' && _this.options.propOpt.widthValue && _this.options.propOpt.widthValue > 100) {
                    _this.widthInput.render(100);
                    _this.widthInput.trigger('blur');
                }
                if (!_this.options.propOpt.widthValue) _this.options.propOpt.widthValue = DEFAULT_WIDTH;
                _this.options.propOpt.widthUnit = changedUnit;
                _this.options.propOpt.width = _this.options.propOpt.widthValue + _this.options.propOpt.widthUnit;
            }
        });

        this.widthUnitSwitchButton.addCSSInMainControl({
            'border-left': 'none'
        });

        this.heightInput = Widgets.Factory.createNumberInputWidget(this.$sizeContent.find('.bo-widget-height'), {
            label: 'Height',
            width: '170px',
            value: _this.options.propOpt.height.replace(/[^0-9.]/g, ''),
            onChanged: function (value) {
                if (Number.isNaN(value)) {
                    value = Number(this.$inputControl.val().replace(/[^0-9.]/g, ''));
                } else {
                    if (value > 1000) value = 1000;
                    if (value < 1) value = 1;
                }
                _this.options.propOpt.height = value + 'px';
                this.render(value);
                this.$inputControl.trigger('blur');
            }
        });

        this.heightUnitSwitchButton = Widgets.Factory.createSwitchButtonWidget(this.$sizeContent.find('.bo-widget-height'), {
            width: '20px',
            height: '27px',
            value: _this.options.propOpt.height.replace(/[0-9]/g, ''),
            internalLabel: 'Height',
            itemList: [
                {value: 'px', label: 'Px'},
            ],
            onChanged: function (changedUnit) {
                _this.options.propOpt.heightUnit = changedUnit;
            }
        });

        this.heightUnitSwitchButton.addCSSInMainControl({
            'border-left': 'none'
        });
    };

    GroupByControl.prototype._createColumnSelectorWidget = function () {
        var _this = this;
        var widgetOptions = {
            aggregationEnabled: false,
            aggregationMap: {},
            chartOption: {},
            getAllColumns: function () {
                return _this.options.datasource.columns;
            },
            getColumns: function () {
                return _this.options.datasource.columns;
            },
            label: 'Group By',
            multiple: true,
            problemKeyList: ['custom-axis-001'],
            onChanged: function (columns) {
                // _this.options.onChanged('onChartOptionChanged', {groupBy: columns});
                _this.renderProblem(_this._validate(columns));
                _this.options.propOpt.groupBy = columns;
                if(typeof _this.options.propOpt.columnChanged === 'function') {
                    _this.options.propOpt.columnChanged(columns);
                }
            },
            selected: this.options.propOpt.groupBy
        };
        var columnSelectorWidget = Brightics.Chart.Adonis.Component.Widgets.Factory.createColumnSelectorWidget(this.$controlContents, widgetOptions);
        this._widgetList.push(columnSelectorWidget);
    };

    GroupByControl.prototype._validate = function (arrayVal) {
        if (!arrayVal || arrayVal.length == 0 || !arrayVal.some(function (value) {
                return !(!value)
            })) {
            return [{key: 'custom-axis-001', target: 'Group By'}];
        }
    };

    GroupByControl.prototype.renderProblem = function (problems) {
        var _this = this;

        this._widgetList.forEach(function (widget) {
            widget.renderProblem(problems);
        });
    };

    GroupByControl.prototype._notifyMessage = function (message) {
        var $target = this.$parent.closest('.brtc-mchart-main-container');
        $target.trigger('message:notify', [message]);
    };


    Brightics.Chart.Adonis.Component.Controls.GroupByControl = GroupByControl;

}).call(this);