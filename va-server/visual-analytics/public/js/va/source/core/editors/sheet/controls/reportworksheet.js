/**
 * Created by ng1123.kim on 2016-02-03.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    /**
     * options: {
     *      panel: [],
     *      layout: {},
     *      data: {},
     * }
     *
     * dataInfo: {
     *      mid: {String},
     *      fid: {String},
     *      fnUnitLabel: {String}
     * }
     * @param parentId
     * @param options
     * @constructor
     */
    function ReportWorksheet(parentId, options) {
        this.parentId = parentId;
        this.options = options;
        this.controls = {};

        this.retrieveParent();
        this.createControls();
        this.init();
    }

    ReportWorksheet.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    ReportWorksheet.prototype.init = function () {
        var _this = this;

        return this.getReportOptions()
            .then(this.renderReportWorksheet.bind(this))
            .catch(function (err) {
                console.error(err);
                throw err;
            });
    };

    ReportWorksheet.prototype.textRenderer = function ($parent, options, resolve, reject) {
        $parent.html(options.html);
        resolve();
    };

    ReportWorksheet.prototype.chartRenderer = function ($parent, options, resolve, reject) {
        var tableId = options.source;

        this.options.dataProxy.requestPageData(tableId, function (table) {
            var chartOptions = options;

            chartOptions.source = {
                "dataType": "local",
                "localData": [
                    {
                        "dataType": "rawdata",
                        "columns": table.columns,
                        "data": table.data
                    }
                ]
            };

            $parent.bcharts(chartOptions);

            resolve();
        }, function (err) {
            reject();
        }, 1, 1000)
    };

    ReportWorksheet.prototype.addUnit = function (type) {
        var $unit = $('<div class="brtc-va-editors-sheet-controls-dataworksheet-unit"></div>');
        $unit.css({
            'width': '95%',
            'height': (type === 'text')? 'auto' : '300px',
            'margin-bottom': '15px',
            'margin-left': '10px'
        });
        this.$mainControl.append($unit);

        return $unit;
    };

    ReportWorksheet.prototype.renderReportWorksheet = function (result) {
        var _this = this;

        this.unitRenderer = {
            text: this.textRenderer,
            chart: this.chartRenderer
        };
        var promises = [];

        for (var i in result) {
            var options = result[i].options || result[i].option;

            var $unit = this.addUnit(result[i].type);

            var promise = new Promise(function (resolve, reject) {
                //option, options가 섞여서 넘어옴..
                _this.unitRenderer[result[i].type].bind(_this)($unit, options, resolve, reject);
            });

            promises.push(promise);
        }

        return Promise.all(promises).then(this.$mainControl.perfectScrollbar());
    };

    ReportWorksheet.prototype.getReportOptions = function () {
        var _this = this;

        //sample
        var outTable = this.options.fnUnit[OUT_DATA][0];
        
        var promise = new Promise(function (resolve, reject) {
                _this.options.dataProxy.requestPageData(outTable, function (reportOptions) {
                    var result = JSON.parse((reportOptions.data[0][0]).replace('\'', ''));

                    resolve(result);
                }, function (err) {
                    reject();
                }, 1, 1000)
            })

        return promise;
    };

    ReportWorksheet.prototype.queryTable = function (tableId) {
        var _this = this;
        
        var promise = new Promise(function (resolve, reject) {
                _this.options.dataProxy.requestPageData(tableId, function (data) {
                    resolve(data);
                }, function (err) {
                    reject();
                }, 1, 1000)
            })

        return promise;
    };

    ReportWorksheet.prototype.createControls = function () {
        this.$parent.empty();

        this.$mainControl = $('<div class="brtc-va-editors-sheet-controls-dataworksheet"></div>');
        this.$mainControl.css({
            width: '100%',
            height: '100%'
        });
        this.$parent.append(this.$mainControl);
    };

    ReportWorksheet.prototype.destroy = function () {
    };

    Brightics.VA.Core.Editors.Sheet.Controls.ReportWorksheet = ReportWorksheet;

}).call(this);
