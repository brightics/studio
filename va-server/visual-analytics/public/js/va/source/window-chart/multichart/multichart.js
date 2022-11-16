/**
 * Created by sds on 2017-07-24.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var WindowCommonUtils = Brightics.VA.Window.Utils.CommonUtils;
    var TabChannel = brtc_require('TabChannel');

    function MultiChart(parentId, options) {
        this.parentId = parentId;
        this.options = options || {};
        this.properties = {
            MultiChartSettings: {}
        };
        this.init();
        this.retrieveParent();
        this.createLayout();
        this.createControls();
        this.createNotification();
    }

    MultiChart.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    MultiChart.prototype.init = function () {
        this.executor = new Brightics.VA.Window.MultiChartExecutor();


        this.params = {
            user: Brightics.VA.Window.Utils.CommonUtils.getParameterByName('user', this.options.url),
            pid: Brightics.VA.Window.Utils.CommonUtils.getParameterByName('pid', this.options.url),
            mid: Brightics.VA.Window.Utils.CommonUtils.getParameterByName('mid', this.options.url),
            fid: Brightics.VA.Window.Utils.CommonUtils.getParameterByName('fid', this.options.url),
            tid: Brightics.VA.Window.Utils.CommonUtils.getParameterByName('tid', this.options.url),
            cid: Brightics.VA.Window.Utils.CommonUtils.getParameterByName('cid', this.options.url),
            ch: parseInt(Brightics.VA.Window.Utils.CommonUtils.getParameterByName('ch', this.options.url))
        };

        //multichart 에서 지원하지않는 차트 filtering
        //TODO: params에 안붙이게ㅠㅠ 수정필요.
        this.params.chartTypeList = Object.keys(Brightics.Chart.Registry).filter(function (chartStr) {
            return !['table', 'dendrogram', 'biplot', 'decisionTree'].includes(chartStr)
        });

        this.tabChannel = new TabChannel(this.params.ch);
    };

    MultiChart.prototype.createLayout = function () {
        this.$mainControl = $('' +
            '<div class="brtc-mchart-main-container">' +
            '   <div class="brtc-notification-container"/>' +
            '   <div class="brtc-left-contents"></div>' +
            '   <div class="brtc-right-properties"/>' +
            '</div>'
        );
        this.$parent.append(this.$mainControl);
    };


    MultiChart.prototype.createControls = function () {
        $(document).bind('contextmenu', function (e) {
            return false;
        });

        this.executor.setTarget(this.$parent.find('.brtc-left-contents'));
        this.createProperties(this.$parent.find('.brtc-right-properties'));
        this.createGenerator();
        this.createApplyBtn();
        this.createStatus();
    };


    MultiChart.prototype.createNotification = function () {
        var _this = this;
        this.$notification = this.$mainControl.find(".brtc-notification-container");
        this.$notification.jqxNotification({
            theme: Brightics.VA.Env.Theme,
            width: "auto",
            position: "top-left",
            opacity: 0.9,
            autoOpen: false,
            autoClose: true,
            template: "info"
        });

        this.$mainControl.bind('message:notify', function (e, message) {
            _this.notification(message);
        });
    };

    MultiChart.prototype.notification = function (message) {
        this.$notification.text(message);
        this.$notification.jqxNotification("open");
    };


    MultiChart.prototype.createProperties = function ($parent) {
        var _this = this;
        WindowCommonUtils.retrieveFile(_this.params).done(function () {
            WindowCommonUtils.retrieveDataSource(_this.params).done(function () {
                _this._configureDefaultOption();
                for (var propertyClazz in _this.properties) {
                    if (Brightics.VA.Window.Property[propertyClazz]) {
                        _this.properties[propertyClazz] =
                            new Brightics.VA.Window.Property[propertyClazz]($parent, _this.params);
                    }
                }
            });
        });

    };

    MultiChart.prototype._configureDefaultOption = function () {
        if (!this.params.chartOption) {
            this.params.chartOption = {
                chart: {
                    type: 'scatter'
                }
            }
        }
    };

    MultiChart.prototype.createGenerator = function () {
        var $generatorBtn = $('' +
            '   <div class="brtc-mc-generator">' +
            '       <i class="fa fa-play-circle fa-5x" aria-hidden="true"></i>' +
            '   </div>'
        );
        this.$parent.append($generatorBtn);

        var _this = this;
        $generatorBtn.click(function () {
            var _that = this;
            var executeParam = $.extend(true, {}, _this.params);
            for (var propertyClazz in _this.properties) {
                if (_this.properties[propertyClazz] instanceof Brightics.VA.Window.Property) {
                    $.extend(true, executeParam, _this.properties[propertyClazz].getPropertyOption());
                }
            }
            if ($(this).hasClass('disable')) {
                return;
            } else {
                $(this).addClass('disable');
                var callBack = function () {
                    $(_that).removeClass('disable');
                };
                _this.executor.execute(executeParam, callBack);

            }

        });
    };

    MultiChart.prototype.createApplyBtn = function () { 
        var $applyBtn = $([
            '<div class="brtc-mc-apply">',
            '   <i class="fa fa-save fa-5x" aria-hidden="true"></i>',
            '</div>'
        ].join(''));
        var self = this;
        this.$parent.append($applyBtn);
        (function ($applyBtn, channel) {
            $applyBtn.click(function (e) {
                var multiChartOption = self.buildMultiChartOption();
                channel
                    .request('multi-chart', {
                        fid: self.params.fid,
                        cid: self.params.cid,
                        multiChartOption: multiChartOption
                    })
                    .then(function (res) {
                        if (res.success) {
                            self.notification('Multi chart option is successfully saved.');
                        } else {
                            throw new Error('Multi chart option saving failed.');
                        }
                    })
                    .catch(function (err) {
                        self.notification('Multi chart option saving failed.');
                    });
            });
        }($applyBtn, this.tabChannel));
    };

    MultiChart.prototype.createStatus = function () {
        var $progressControl = $('  ' +
            '<div class="brtc-mc-progress">' +
            '   <span></span>' +
            '</div>'
        );
        this.$parent.append($progressControl);

        var $messageControl = $('  ' +
            '<div class="brtc-mc-message">' +
            '   <span></span>' +
            '</div>'
        );
        this.$parent.append($messageControl);

    };

    MultiChart.prototype.buildMultiChartOption = function () {
        var executeParam = {};
        for (var propertyClazz in this.properties) {
            if (this.properties[propertyClazz] instanceof Brightics.VA.Window.Property) {
                $.extend(true, executeParam, this.properties[propertyClazz].getPropertyOption());
            }
        }
        return executeParam;
    };
    root.Brightics.VA.Window.MultiChart = MultiChart;

}).call(this);