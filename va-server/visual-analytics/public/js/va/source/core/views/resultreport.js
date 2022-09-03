/**
 * Created by SDS on 2018-02-26.
 */
/**
 * Created by sds on 2018-02-26.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ResultReport(parentId, options) {
        this.parentId = parentId;
        this.options = options || {};

        this.retrieveParent();
        this.createControls();
        this.initialReport();
    }

    ResultReport.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    ResultReport.prototype.createControls = function () {
        this.$parent.empty();

        this.$mainControl = $('<div class="brtc-va-views-report-result-contents"></div>');
        this.$mainControl.css({
            'width': '100%',
            'height': '100%',
            'margin-left': '10px'
        });
        this.$parent.append(this.$mainControl)

        $(document).bind('contextmenu', function (e) {
            return false;
        });
    };

    ResultReport.prototype.initialReport = function () {
        var _this = this;

        Brightics.VA.Env.Session.userId = this.options.userId;

        var resulReportContent = this.options.html;
        let chartInfos = JSON.parse(this.options.chartOptions);

        for (var i in chartInfos.charts) {
            let chartId = chartInfos.charts[i].id;
            var replace = "<code>{&quot;chart&quot;:&quot;" + chartId + "&quot;}<\/code>";
            var re = new RegExp(replace, "g");

            resulReportContent = resulReportContent.toString().replace(re, '<div id="' + chartId + '" class="' + chartId + '" style="width: 600px; height: 400px"></div>')
        }
        this.$mainControl.html(resulReportContent);

        this.dataProxy = new Brightics.VA.Core.Editors.Sheet.DataProxy(this.$mainControl, this.options.mid);

        chartInfos = JSON.parse(this.options.chartOptions);
        for (var i in chartInfos.charts) {
            let chartId = chartInfos.charts[i].id;
            var chartOptions = chartInfos.charts[i].options;

            var source = chartInfos.charts[i].options.source;

            var $chartUnit = this.$mainControl.find('.' + chartId);
            $chartUnit.css({
                'width': '580px',
                'height': '400px',
                'margin-bottom': '15px'
            });

            this.chartRenderer($chartUnit, chartOptions, source);
        }

        this.$parent.perfectScrollbar();
    };

    ResultReport.prototype.chartRenderer = function ($chartUnit, options, source) {
        this.dataProxy.requestData(source, function (table) {
            options.source = {
                "dataType": "local",
                "localData": [
                    {
                        "dataType": "rawdata",
                        "columns": table.columns,
                        "data": table.data
                    }
                ]
            };

            $chartUnit.bcharts(options);
        }, function (err) {
        });
    };

    Brightics.VA.Core.Views.ResultReport = ResultReport;

}).call(this);