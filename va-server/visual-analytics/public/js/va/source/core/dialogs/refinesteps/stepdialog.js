/**
 * Created by daewon77.park on 2016-08-20.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function StepDialog(parentId, options) {
        this.parentId = parentId;
        this.options = options;
        this.dialogResult = {
            OK: false,
            Cancel: true,
            // SQLExecutor: {},
            FnUnit: {}
        };
        this.problemFactory = new Brightics.VA.Core.Validator.ProblemFactory();
        this.problems = [];
        this.resultFnUnit = {};
        this.DEFAULT_SCRIPT = 'from pandasql import sqldf\n' +
            'pysqldf = lambda q: sqldf(q, globals())\n' +
            'data = inputs[0]\n' +
            'result = pysqldf(\'SELECT ${SELECT_SQL} FROM data ${ADDITIONAL_QUERY}\')';

        this.DEFAULT_FN_UNIT = {
            'fid': '',
            'func': '',
            'name': 'SQLExecutor',
            'inData': [],
            'outData': [],
            'param': {
                'select': '',
                'additional-query': ''
            },
            'display': {
                'label': ''
            }
        };

        this.retrieveParent();
        this.createControls();
        this.initContents();
    }

    StepDialog.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    StepDialog.prototype.getTitle = function () {
        return '';
    };

    StepDialog.prototype.createControls = function () {
        this.$mainControl = $('' +
            '<div class="brtc-va-dialogs-main">' +
            // '   <div class="brtc-va-dialogs-header">' +'<div class="brtc-va-refine-step-header-help" title="Help"></div></div>' +
            '   <div class="brtc-va-dialogs-body">' +
            '       <div class="brtc-va-dialogs-contents">' +
            '       </div>' +
            '       <div class="brtc-va-dialogs-buttonbar">' +
            '           <input type="button" class="brtc-va-dialogs-buttonbar-ok" value="OK" />' +
            '           <input type="button" class="brtc-va-dialogs-buttonbar-cancel" value="Cancel" />' +
            '       </div>' +
            '   </div>' +
            '</div>');

        this.$okButton = this.$mainControl.find('.brtc-va-dialogs-buttonbar-ok');
        this.$cancelButton = this.$mainControl.find('.brtc-va-dialogs-buttonbar-cancel');

        var jqxOpt = {
            theme: Brightics.VA.Env.Theme,
            title: this.getTitle(),
            width: 600,
            height: 500,
            maxWidth: 600,
            maxHeight: 500,
            modal: true,
            resizable: false,
            close: this.destroy.bind(this)
        };
        this.$mainControl.dialog(jqxOpt);

        this.$mainControl.find('.brtc-va-refine-step-header-help').css('display', 'none');
        this.$mainControl.find('.brtc-va-refine-step-header-help').click(function () {
            var w = window.open('api/va/v2/help/function/sqlfunctionhelp', 'SQL Function Help');
            w.blur();
        });
    };

    StepDialog.prototype.initContents = function () {
        var _this = this;
        _this.createDialogContentsArea(_this.$mainControl.find('.brtc-va-dialogs-contents'));

        _this.$okButton.jqxButton({
            theme: Brightics.VA.Env.Theme
        });
        _this.$okButton.click(_this.handleOkClicked.bind(_this));

        _this.$cancelButton.jqxButton({
            theme: Brightics.VA.Env.Theme
        });
        _this.$cancelButton.click(_this.handleCancelClicked.bind(_this));
    };

    StepDialog.prototype.destroy = function () {
        this.$mainControl.dialog('destroy');
        if (typeof this.options.close == 'function') {
            this.options.close(this.dialogResult);
        }
    };

    StepDialog.prototype.destroyColumnSelector = function () {
        var $columnSelector = $('.brtc-va-editors-sheet-controls-columnselector-editarea');
        if ($columnSelector.length > 0) {
            $columnSelector.dialog('close');
            $columnSelector.dialog('destroy');
        }
    };

    StepDialog.prototype.createDialogContentsArea = function ($parent) {
    };


    StepDialog.prototype.handleOkClicked = function () {
        this.dialogResult.OK = true;
        this.dialogResult.Cancel = false;
        this.dialogResult.force = this.options.force;
        this.dialogResult.FnUnit = this.resultFnUnit;

        this.$mainControl.dialog('close');
    };

    StepDialog.prototype.handleCancelClicked = function () {
        this.dialogResult.OK = false;
        this.dialogResult.Cancel = true;
        this.dialogResult.force = this.options.force;

        this.$mainControl.dialog('close');
    };

    StepDialog.prototype.wrapControl = function ($control) {
        var $wrapper = $('<div class="brtc-va-editors-sheet-controls-wrapper"></div>');
        $control.wrap($wrapper);
    };

    StepDialog.prototype.addClassToWrapper = function ($control, className) {
        if (className) {
            var $wrapper = $control.parent('.brtc-va-editors-sheet-controls-wrapper');
            if ($wrapper) $wrapper.addClass(className);
        }
    };

    StepDialog.prototype.addCssToWrapper = function ($control, cssOptions) {
        if (cssOptions) {
            var $wrapper = $control.parent('.brtc-va-editors-sheet-controls-wrapper');
            if ($wrapper) $wrapper.css(cssOptions);
        }
    };

    StepDialog.prototype.createColumnList = function ($control, widgetOptions, className, additionalCss) {
        this.wrapControl($control);
        var additionalClass = '';
        if (className) {
            additionalClass = additionalClass.concat(' ', className);
        }
        this.addClassToWrapper($control, additionalClass);
        this.addCssToWrapper($control, additionalCss);

        var options = {
            multiple: true,
            rowCount: 1,
            maxRowCount: 5,
            expand: false,
            sort: 'none',
            sortBy: 'name',
            showOpener: 'button',
            removable: true,
            defaultType: '-',
            changed: function (type, data) {

            },
            added: function () {

            },
            removed: function () {

            }
        };

        if (widgetOptions) {
            $.extend(options, widgetOptions);
        }

        return new Brightics.VA.Core.Editors.Sheet.Controls.ColumnList($control, options);
    };
    StepDialog.prototype.createButton = function ($control, jqxOptions, className, additionalCss) {
        this.wrapControl($control);
        var additionalClass = '';
        if (className) {
            additionalClass = additionalClass.concat(' ', className);
        }
        this.addClassToWrapper($control, additionalClass);
        this.addCssToWrapper($control, additionalCss);

        var options = {
            theme: Brightics.VA.Env.Theme
        };
        if (jqxOptions) {
            $.extend(options, jqxOptions);
        }
        $control.jqxButton(options);
    };

    StepDialog.prototype.createSQLExecutor = function (label, func, select, additionalQuery) {
        this.dialogResult.FnUnit = this.resultFnUnit;
        // this.dialogResult.SQLExecutor = {
        //     'fid': this.options.fid ? this.options.fid : Brightics.VA.Core.Utils.IDGenerator.func.id(),
        //     'func': func,
        //     'name': 'SQLExecutor',
        //     'inData': this.options.in,
        //     'outData': this.options.out,
        //     'param': {
        //         'select': select,
        //         'additional-query': additionalQuery
        //     },
        //     'display': {
        //         'label': label
        //     }
        // };
    };

    StepDialog.prototype.addProblem = function (problem) {
        this.problems.push(problem);
    };

    StepDialog.prototype.checkValidation = function () {

    };

    StepDialog.prototype.createValidationContent = function ($parent, problemData, $control) {
        var $problemContent = $('<div class="brtc-va-refine-step-validation-tooltip">' +
            '<i class="fa fa-exclamation-triangle" aria-hidden="true"></i> ' + Brightics.VA.Core.Utils.WidgetUtils.convertHTMLSpecialChar(problemData.message) +
            '</div>');
        $parent.append($problemContent);
        if ($control) {
            $control.addClass('brtc-va-refine-step-validation-error');
        } else {
            $parent.addClass('brtc-va-refine-step-validation-error');
        }

        $problemContent.show();
    };

    StepDialog.prototype.removeValidation = function () {
        this.$mainControl.find('.brtc-va-refine-step-validation-error').removeClass('brtc-va-refine-step-validation-error');
        this.$mainControl.find('.brtc-va-refine-step-validation-tooltip').remove();
        this.problems = [];
    };

    StepDialog.prototype.createProblem = function (checkResult, fid) {
        var _this = this;
        return {
            // level: _this.problemFactory.rule[checkResult.errorCode].level,
            param: checkResult.param,
            paramIndex: checkResult.paramIndex,
            code: checkResult.errorCode,
            message: _this.problemFactory.makeMessage(checkResult)
        };
    };

    StepDialog.prototype.sortableStopCallback = {
        hideRemoveButton: function (dialogControl, itemClass, removeButtonClass) {
            var itemList = dialogControl.$mainControl.find('.' + itemClass);

            for (var i = 0; i < itemList.length; i++) {
                if (i == 0) {
                    $(itemList[i]).find('.' + removeButtonClass).hide();
                } else {
                    $(itemList[i]).find('.' + removeButtonClass).show();
                }
            }
        }

    };

    StepDialog.prototype.sqlFunctionHelpContent = function () {
        var data = $('' +
            '<div class="brtc-va-searcharea" style="float:right; position:fixed; right:10px"><input type="search" class="searchinput" placeholder="Search Key..."/></div>' +
            '<div style="font-family: "Lucida Grande", "Segoe UI", "Apple SD Gothic Neo", "Malgun Gothic", "Lucida Sans Unicode", Helvetica, Arial, sans-serif; font-size: 0.9em; overflow-x: hidden; overflow-y: auto; margin: 0px !important; padding: 5px 20px 26px !important; background-color: rgb(255, 255, 255);font-family: "Hiragino Sans GB", "Microsoft YaHei", STHeiti, SimSun, "Lucida Grande", "Lucida Sans Unicode", "Lucida Sans", "Segoe UI", AppleSDGothicNeo-Medium, "Malgun Gothic", Verdana, Tahoma, sans-serif; padding: 20px;padding: 20px; font-family: "Helvetica Neue", Helvetica, "Hiragino Sans GB", "Microsoft YaHei", STHeiti, SimSun, "Segoe UI", AppleSDGothicNeo-Medium, "Malgun Gothic", Arial, freesans, sans-serif; font-size: 15px; line-height: 1.6; -webkit-font-smoothing: antialiased; background: rgb(255, 255, 255);">' +
            '<h1 id="sql-functions" style="clear: both;font-size: 2.2em; font-weight: bold; margin: 1.5em 0px 1em;margin-top: 0px;"><a name="sql-functions" href="#sql-functions" style="text-decoration: none; vertical-align: baseline;color: rgb(50, 105, 160);"></a>SQL Function Help</h1><h2 id="date-functions" style="clear: both;font-size: 1.8em; font-weight: bold; margin: 1.275em 0px 0.85em;border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(230, 230, 230); line-height: 1.6;"><a name="date-functions" href="#date-functions" style="text-decoration: none; vertical-align: baseline;color: rgb(50, 105, 160);"></a>Date Functions</h2><p style="margin-top: 0px;margin: 1em 0px; word-wrap: break-word;">The following built-in date functions are supported in hive.</p><table style="padding: 0px; border-collapse: collapse; border-spacing: 0px; margin-bottom: 16px;background-color: rgb(250, 250, 250);">' +
            '<thead>' +
            '<tr>' +
            '<th style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;font-weight: bold;border: 1px solid rgb(230, 230, 230);">Return Type</th>' +
            '<th style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;font-weight: bold;border: 1px solid rgb(230, 230, 230);">Name(Signature)</th>' +
            '<th style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;font-weight: bold;border: 1px solid rgb(230, 230, 230);">Example</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody>' +
            '<tr>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">string</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">from_unixtime(bigint unixtime[, string format])</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Converts the number of seconds from unix epoch (1970-01-01 00:00:00 UTC) to a string representing the timestamp of that moment in the current system time zone in the format of "1970-01-01 00:00:00"</td>' +
            '</tr>' +
            '<tr style="background-color: rgb(242, 242, 242);">' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">bigint</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">unix_timestamp()</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Gets current time stamp using the default time zone.</td>' +
            '</tr>' +
            '<tr>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">bigint</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">unix_timestamp(string date)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Converts time string in format yyyy-MM-dd HH:mm:ss to Unix time stamp, return 0 if fail: unix_timestamp(??009-03-20 11:30:01?? = 1237573801</td>' +
            '</tr>' +
            '<tr style="background-color: rgb(242, 242, 242);">' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">bigint</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">unix_timestamp(string date, string pattern)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Convert time string with given pattern to Unix time stamp, return 0 if fail: unix_timestamp(??009-03-20?? ?�yyyy-MM-dd?? = 1237532400</td>' +
            '</tr>' +
            '<tr>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">string</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">to_date(string timestamp)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the date part of a timestamp string: to_date("1970-01-01 00:00:00") = "1970-01-01"</td>' +
            '</tr>' +
            '<tr style="background-color: rgb(242, 242, 242);">' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">int</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">year(string date)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the year part of a date or a timestamp string: year("1970-01-01 00:00:00") = 1970, year("1970-01-01") = 1970</td>' +
            '</tr>' +
            '<tr>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">int</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">month(string date)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the month part of a date or a timestamp string: month("1970-11-01 00:00:00") = 11, month("1970-11-01") = 11</td>' +
            '</tr>' +
            '<tr style="background-color: rgb(242, 242, 242);">' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">int</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">day(string date) dayofmonth(date)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Return the day part of a date or a timestamp string: day("1970-11-01 00:00:00") = 1, day("1970-11-01") = 1</td>' +
            '</tr>' +
            '<tr>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">int</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">hour(string date)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the hour of the timestamp: hour(??009-07-30 12:58:59?? = 12, hour(??2:58:59?? = 12</td>' +
            '</tr>' +
            '<tr style="background-color: rgb(242, 242, 242);">' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">int</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">minute(string date)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the minute of the timestamp</td>' +
            '</tr>' +
            '<tr>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">int</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">second(string date)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the second of the timestamp</td>' +
            '</tr>' +
            '<tr style="background-color: rgb(242, 242, 242);">' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">int</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">weekofyear(string date)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Return the week number of a timestamp string: weekofyear("1970-11-01 00:00:00") = 44, weekofyear("1970-11-01") = 44</td>' +
            '</tr>' +
            '<tr>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">int</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">datediff(string enddate, string startdate)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Return the number of days from startdate to enddate: datediff(??009-03-01?? ??009-02-27?? = 2</td>' +
            '</tr>' +
            '<tr style="background-color: rgb(242, 242, 242);">' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">string</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">date_add(string startdate, int days)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Add a number of days to startdate: date_add(??008-12-31?? 1) = ??009-01-01??/td>' +
            '</tr>' +
            '<tr>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">string</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">date_sub(string startdate, int days)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Subtract a number of days to startdate: date_sub(??008-12-31?? 1) = ??008-12-30??/td>' +
            '</tr>' +
            '<tr style="background-color: rgb(242, 242, 242);">' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">timestamp</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">from_utc_timestamp(timestamp, string timezone)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Assumes given timestamp ist UTC and converts to given timezone (as of Hive 0.8.0)</td>' +
            '</tr>' +
            '<tr>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">timestamp</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">to_utc_timestamp(timestamp, string timezone)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Assumes given timestamp is in given timezone and converts to UTC (as of Hive 0.8.0)</td>' +
            '</tr>' +
            '</tbody>' +
            '</table><h2 id="mathematical-functions" style="clear: both;font-size: 1.8em; font-weight: bold; margin: 1.275em 0px 0.85em;border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(230, 230, 230); line-height: 1.6;">`<a name="mathematical-functions" href="#mathematical-functions" style="text-decoration: none; vertical-align: baseline;color: rgb(50, 105, 160);"></a>Mathematical Functions</h2><p style="margin-top: 0px;margin: 1em 0px; word-wrap: break-word;">The following built-in mathematical functions are supported in hive; most return NULL when the argument(s) are NULL:</p><table style="padding: 0px; border-collapse: collapse; border-spacing: 0px; margin-bottom: 16px;background-color: rgb(250, 250, 250);">' +
            '<thead>' +
            '<tr>' +
            '<th style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;font-weight: bold;border: 1px solid rgb(230, 230, 230);">Return Type</th>' +
            '<th style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;font-weight: bold;border: 1px solid rgb(230, 230, 230);">Name(Signature)</th>' +
            '<th style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;font-weight: bold;border: 1px solid rgb(230, 230, 230);">Example</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody>' +
            '<tr>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">BIGINT</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">round(double a)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the rounded BIGINT value of the double</td>' +
            '</tr>' +
            '<tr style="background-color: rgb(242, 242, 242);">' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">DOUBLE</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">round(double a, int d)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the double rounded to d decimal places</td>' +
            '</tr>' +
            '<tr>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">BIGINT</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">floor(double a)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the maximum BIGINT value that is equal or less than the double</td>' +
            '</tr>' +
            '<tr style="background-color: rgb(242, 242, 242);">' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">BIGINT</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">ceil(double a), ceiling(double a)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the minimum BIGINT value that is equal or greater than the double</td>' +
            '</tr>' +
            '<tr>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">double</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">rand(), rand(int seed)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns a random number (that changes from row to row) that is distributed uniformly from 0 to 1. Specifiying the seed will make sure the generated random number sequence is deterministic.</td>' +
            '</tr>' +
            '<tr style="background-color: rgb(242, 242, 242);">' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">double</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">exp(double a)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns e<sup style="margin-top: 0px;margin-bottom: 0px;">a</sup> where e is the base of the natural logarithm</td>' +
            '</tr>' +
            '<tr>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">double</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">ln(double a)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the natural logarithm of the argument</td>' +
            '</tr>' +
            '<tr style="background-color: rgb(242, 242, 242);">' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">double</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">log10(double a)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the base-10 logarithm of the argument</td>' +
            '</tr>' +
            '<tr>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">double</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">log2(double a)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the base-2 logarithm of the argument</td>' +
            '</tr>' +
            '<tr style="background-color: rgb(242, 242, 242);">' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">double</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">log(double base, double a)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Return the base "base" logarithm of the argument</td>' +
            '</tr>' +
            '<tr>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">double</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">pow(double a, double p), power(double a, double p)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Return a<sup style="margin-top: 0px;margin-bottom: 0px;">p</sup></td>' +
            '</tr>' +
            '<tr style="background-color: rgb(242, 242, 242);">' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">double</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">sqrt(double a)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the square root of a</td>' +
            '</tr>' +
            '<tr>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">string</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">bin(BIGINT a)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the number in binary format</td>' +
            '</tr>' +
            '<tr style="background-color: rgb(242, 242, 242);">' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">string</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">hex(BIGINT a) hex(string a)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">If the argument is an int, hex returns the number as a string in hex format. Otherwise if the number is a string, it converts each character into its hex representation and returns the resulting string.</td>' +
            '</tr>' +
            '<tr>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">string</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">unhex(string a)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Inverse of hex. Interprets each pair of characters as a hexidecimal number and converts to the character represented by the number.</td>' +
            '</tr>' +
            '<tr style="background-color: rgb(242, 242, 242);">' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">string</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">conv(BIGINT num, int from_base, int to_base), conv(STRING num, int from_base, int to_base)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Converts a number from a given base to another</td>' +
            '</tr>' +
            '<tr>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">double</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">abs(double a)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the absolute value</td>' +
            '</tr>' +
            '<tr style="background-color: rgb(242, 242, 242);">' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">int double</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">pmod(int a, int b) pmod(double a, double b)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the positive value of a mod b</td>' +
            '</tr>' +
            '<tr>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">double</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">sin(double a)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the sine of a (a is in radians)</td>' +
            '</tr>' +
            '<tr style="background-color: rgb(242, 242, 242);">' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">double</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">asin(double a)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the arc sin of x if -1&lt;=a&lt;=1 or null otherwise</td>' +
            '</tr>' +
            '<tr>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">double</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">cos(double a)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the cosine of a (a is in radians)</td>' +
            '</tr>' +
            '<tr style="background-color: rgb(242, 242, 242);">' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">double</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">acos(double a)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the arc cosine of x if -1&lt;=a&lt;=1 or null otherwise</td>' +
            '</tr>' +
            '<tr>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">tan(double a)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">tan(double a)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the tangent of a (a is in radians)</td>' +
            '</tr>' +
            '<tr style="background-color: rgb(242, 242, 242);">' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">double</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">atan(double a)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the arctangent of a</td>' +
            '</tr>' +
            '<tr>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">double</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">degrees(double a)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Converts value of a from radians to degrees</td>' +
            '</tr>' +
            '<tr style="background-color: rgb(242, 242, 242);">' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">double</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">radians(double a)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Converts value of a from degrees to radians</td>' +
            '</tr>' +
            '<tr>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">int double</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">positive(int a), positive(double a)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns a</td>' +
            '</tr>' +
            '<tr style="background-color: rgb(242, 242, 242);">' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">int double</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">negative(int a), negative(double a)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns -a</td>' +
            '</tr>' +
            '<tr>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">float</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">sign(double a)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the sign of a as ??.0??or ??1.0??/td>' +
            '</tr>' +
            '<tr style="background-color: rgb(242, 242, 242);">' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">double</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">e()</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the value of e</td>' +
            '</tr>' +
            '<tr>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">double</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">pi()</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the value of pi</td>' +
            '</tr>' +
            '</tbody>' +
            '</table><h2 id="string-functions" style="clear: both;font-size: 1.8em; font-weight: bold; margin: 1.275em 0px 0.85em;border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(230, 230, 230); line-height: 1.6;"><a name="string-functions" href="#string-functions" style="text-decoration: none; vertical-align: baseline;color: rgb(50, 105, 160);"></a>String Functions</h2><p style="margin-top: 0px;margin: 1em 0px; word-wrap: break-word;">The following are built-in String functions are supported in hive</p><table style="padding: 0px; border-collapse: collapse; border-spacing: 0px; margin-bottom: 16px;background-color: rgb(250, 250, 250);">' +
            '<thead>' +
            '<tr>' +
            '<th style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;font-weight: bold;border: 1px solid rgb(230, 230, 230);">Return Type</th>' +
            '<th style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;font-weight: bold;border: 1px solid rgb(230, 230, 230);">Name(Signature)</th>' +
            '<th style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;font-weight: bold;border: 1px solid rgb(230, 230, 230);">Example</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody>' +
            '<tr>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">int</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">ascii(string str)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the numeric value of the first character of str</td>' +
            '</tr>' +
            '<tr style="background-color: rgb(242, 242, 242);">' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">string</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">concat(string, string)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the string or bytes resulting from concatenating the strings or bytes passed in as parameters in order. e.g. concat(?�foo?? ?�bar?? results in ?�foobar?? Note that this function can take any number of input strings.</td>' +
            '</tr>' +
            '<tr>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">array&lt;struct&lt;string,double&gt;&gt;</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">context_ngrams(array&lt;array&gt;, array, int K, int pf)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the top-k contextual N-grams from a set of tokenized sentences, given a string of "context". See StatisticsAndDataMining for more information.</td>' +
            '</tr>' +
            '<tr style="background-color: rgb(242, 242, 242);">' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">string</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">concat_ws(string SEP, string A, string B??</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Like concat() above, but with custom separator SEP.</td>' +
            '</tr>' +
            '<tr>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">string</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">concat_ws(string SEP, array)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Like concat_ws() above, but taking an array of strings. (as of Hive 0.9.0)</td>' +
            '</tr>' +
            '<tr style="background-color: rgb(242, 242, 242);">' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">int</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">find_in_set(string str, string strList)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the first occurance of str in strList where strList is a comma-delimited string. Returns null if either argument is null. Returns 0 if the first argument contains any commas. e.g. find_in_set(?�ab?? ?�abc,b,ab,c,def?? returns 3</td>' +
            '</tr>' +
            '<tr>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">string</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">format_number(number x, int d)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Formats the number X to a format like ??,###,###.##?? rounded to D decimal places, and returns the result as a string. If D is 0, the result has no decimal point or fractional part. (as of Hive 0.10.0)</td>' +
            '</tr>' +
            '<tr style="background-color: rgb(242, 242, 242);">' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">string</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">get_json_object(string json_string, string path)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Extract json object from a json string based on json path specified, and return json string of the extracted json object. It will return null if the input json string is invalid.NOTE: The json path can only have the characters [0-9a-z_], i.e., no upper-case or special characters. Also, the keys <em style="margin-top: 0px;margin-bottom: 0px;">cannot start with numbers.</em> This is due to restrictions on Hive column names.</td>' +
            '</tr>' +
            '<tr>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">boolean</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">in_file(string str, string filename)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns true if the string str appears as an entire line in filename.</td>' +
            '</tr>' +
            '<tr style="background-color: rgb(242, 242, 242);">' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">int</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">instr(string str, string substr)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the position of the first occurence of substr in str</td>' +
            '</tr>' +
            '<tr>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">int</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">length(string A)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the length of the string</td>' +
            '</tr>' +
            '<tr style="background-color: rgb(242, 242, 242);">' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">int</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">locate(string substr, string str[, int pos])</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the position of the first occurrence of substr in str after position pos</td>' +
            '</tr>' +
            '<tr>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">string</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">lower(string A) lcase(string A)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);"></td>' +
            '</tr>' +
            '<tr style="background-color: rgb(242, 242, 242);">' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">string</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">lpad(string str, int len, string pad)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns str, left-padded with pad to a length of len</td>' +
            '</tr>' +
            '<tr>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">string</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">ltrim(string A)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the string resulting from trimming spaces from the beginning(left hand side) of A e.g. ltrim(??foobar ?? results in ?�foobar ??/td>' +
            '</tr>' +
            '<tr style="background-color: rgb(242, 242, 242);">' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">array&lt;struct&lt;string,double&gt;&gt;</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">ngrams(array&lt;array &gt;, int N, int K, int pf)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the top-k N-grams from a set of tokenized sentences, such as those returned by the sentences() UDAF. See StatisticsAndDataMining for more information.</td>' +
            '</tr>' +
            '<tr>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">string</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">parse_url(string urlString, string partToExtract [, string keyToExtract])</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the specified part from the URL. Valid values for partToExtract include HOST, PATH, QUERY, REF, PROTOCOL, AUTHORITY, FILE, and USERINFO. e.g. parse_url(??a href="http://facebook.com/path1/p.php?k1=v1&amp;k2=v2#Ref1" style="text-decoration: none; vertical-align: baseline;margin-top: 0px;color: rgb(50, 105, 160);">http://facebook.com/path1/p.php?k1=v1&amp;k2=v2#Ref1</a>?? ?�HOST?? returns ?�facebook.com?? Also a value of a particular key in QUERY can be extracted by providing the key as the third argument, e.g. parse_url(??a href="http://facebook.com/path1/p.php?k1=v1&amp;k2=v2#Ref1" style="text-decoration: none; vertical-align: baseline;margin-bottom: 0px;color: rgb(50, 105, 160);">http://facebook.com/path1/p.php?k1=v1&amp;k2=v2#Ref1</a>?? ?�QUERY?? ?�k1?? returns ?�v1??</td>' +
            '</tr>' +
            '<tr style="background-color: rgb(242, 242, 242);">' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">string</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">printf(String format, Obj??args)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the input formatted according do printf-style format strings (as of Hive 0.9.0)</td>' +
            '</tr>' +
            '<tr>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">string</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">regexp_extract(string subject, string pattern, int index)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the string extracted using the pattern. e.g. regexp_extract(?�foothebar?? ?�foo(.*?)(bar)?? 2) returns ?�bar.??Note that some care is necessary in using predefined character classes: using ??s??as the second argument will match the letter s; ?�s??is necessary to match whitespace, etc. The ?�index??parameter is the Java regex Matcher group() method index. See docs/api/java/util/regex/Matcher.html for more information on the ?�index??or Java regex group() method.</td>' +
            '</tr>' +
            '<tr style="background-color: rgb(242, 242, 242);">' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">string</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">regexp_replace(string INITIAL_STRING, string PATTERN, string REPLACEMENT)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the string resulting from replacing all substrings in INITIAL_STRING that match the java regular expression syntax defined in PATTERN with instances of REPLACEMENT, e.g. regexp_replace("foobar", "oo|ar", "") returns ?�fb.??Note that some care is necessary in using predefined character classes: using ??s??as the second argument will match the letter s; ?�s??is necessary to match whitespace, etc.</td>' +
            '</tr>' +
            '<tr>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">string</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">repeat(string str, int n)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Repeat str n times</td>' +
            '</tr>' +
            '<tr style="background-color: rgb(242, 242, 242);">' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">string</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">reverse(string A)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the reversed string</td>' +
            '</tr>' +
            '<tr>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">string</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">rpad(string str, int len, string pad)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns str, right-padded with pad to a length of len</td>' +
            '</tr>' +
            '<tr style="background-color: rgb(242, 242, 242);">' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">string</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">rtrim(string A)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the string resulting from trimming spaces from the end(right hand side) of A e.g. rtrim(??foobar ?? results in ??foobar??/td>' +
            '</tr>' +
            '<tr>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">array&lt;array&gt;</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">sentences(string str, string lang, string locale)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Tokenizes a string of natural language text into words and sentences, where each sentence is broken at the appropriate sentence boundary and returned as an array of words. The ?�lang??and ?�locale??are optional arguments. e.g. sentences(?�Hello there! How are you??? returns ( ("Hello", "there"), ("How", "are", "you") )</td>' +
            '</tr>' +
            '<tr style="background-color: rgb(242, 242, 242);">' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">string</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">space(int n)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Return a string of n spaces</td>' +
            '</tr>' +
            '<tr>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">array</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">split(string str, string pat)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Split str around pat (pat is a regular expression)</td>' +
            '</tr>' +
            '<tr style="background-color: rgb(242, 242, 242);">' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">map&lt;string,string&gt;</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">str_to_map(text[, delimiter1, delimiter2])</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Splits text into key-value pairs using two delimiters. Delimiter1 separates text into K-V pairs, and Delimiter2 splits each K-V pair. Default delimiters are ????for delimiter1 and ????for delimiter2.</td>' +
            '</tr>' +
            '<tr>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">string</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">substr(string, int start) substring(string, int start)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the substring or slice of the byte array of A starting from start position till the end of string A e.g. substr(?�foobar?? 4) results in ?�bar??/td>' +
            '</tr>' +
            '<tr style="background-color: rgb(242, 242, 242);">' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">string</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">substr(string, int start, int len) substring(string, int start, int len)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the substring or slice of the byte array of A starting from start position with length len e.g. substr(?�foobar?? 4, 1) results in ?�b??/td>' +
            '</tr>' +
            '<tr>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">string</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">translate(string input, string from, string to)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Translates the input string by replacing the characters present in the from string with the corresponding characters in the to string. This is similar to the translatefunction in PostgreSQL. If any of the parameters to this UDF are NULL, the result is NULL as well (available as of Hive 0.10.0)</td>' +
            '</tr>' +
            '<tr style="background-color: rgb(242, 242, 242);">' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">string</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">trim(string A)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the string resulting from trimming spaces from both ends of A e.g. trim(??foobar ?? results in ?�foobar??/td>' +
            '</tr>' +
            '<tr>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">string</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">upper(string A) ucase(string A)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the string resulting from converting all characters of A to upper case e.g. upper(?�fOoBaR?? results in ?�FOOBAR??/td>' +
            '</tr>' +
            '</tbody>' +
            '</table><h2 id="built-in-aggregate-functions-(udaf)" style="clear: both;font-size: 1.8em; font-weight: bold; margin: 1.275em 0px 0.85em;border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(230, 230, 230); line-height: 1.6;"><a name="built-in-aggregate-functions-(udaf)" href="#built-in-aggregate-functions-(udaf)" style="text-decoration: none; vertical-align: baseline;color: rgb(50, 105, 160);"></a>Built-in Aggregate Functions (UDAF)</h2><p style="margin-top: 0px;margin: 1em 0px; word-wrap: break-word;">The following are built-in aggregate functions are supported in Hive.</p><table style="padding: 0px; border-collapse: collapse; border-spacing: 0px; margin-bottom: 16px;background-color: rgb(250, 250, 250);">' +
            '<thead>' +
            '<tr>' +
            '<th style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;font-weight: bold;border: 1px solid rgb(230, 230, 230);">Return Type</th>' +
            '<th style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;font-weight: bold;border: 1px solid rgb(230, 230, 230);">Name(Signature)</th>' +
            '<th style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;font-weight: bold;border: 1px solid rgb(230, 230, 230);">Example</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody>' +
            '<tr>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">bigint</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">count(*), count(expr), count(DISTINCT expr[, expr_.])</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">count(*) ??Returns the total number of retrieved rows, including rows containing NULL values; count(expr) ??Returns the number of rows for which the supplied expression is non-NULL; count(DISTINCT expr[, expr]) ??Returns the number of rows for which the supplied expression(s) are unique and non-NULL.</td>' +
            '</tr>' +
            '<tr style="background-color: rgb(242, 242, 242);">' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">double</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">sum(col), sum(DISTINCT col)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the sum of the elements in the group or the sum of the distinct values of the column in the group</td>' +
            '</tr>' +
            '<tr>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">double</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">avg(col), avg(DISTINCT col)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the average of the elements in the group or the average of the distinct values of the column in the group</td>' +
            '</tr>' +
            '<tr style="background-color: rgb(242, 242, 242);">' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">double</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">min(col)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the minimum of the column in the group</td>' +
            '</tr>' +
            '<tr>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">double</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">max(col)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the maximum value of the column in the group</td>' +
            '</tr>' +
            '<tr style="background-color: rgb(242, 242, 242);">' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">double</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">variance(col), var_pop(col)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the variance of a numeric column in the group</td>' +
            '</tr>' +
            '<tr>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">double</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">var_samp(col)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the unbiased sample variance of a numeric column in the group</td>' +
            '</tr>' +
            '<tr style="background-color: rgb(242, 242, 242);">' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">double</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">stddev_pop(col)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the standard deviation of a numeric column in the group</td>' +
            '</tr>' +
            '<tr>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">double</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">stddev_samp(col)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the unbiased sample standard deviation of a numeric column in the group</td>' +
            '</tr>' +
            '<tr style="background-color: rgb(242, 242, 242);">' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">double</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">covar_pop(col1, col2)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the population covariance of a pair of numeric columns in the group</td>' +
            '</tr>' +
            '<tr>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">double</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">covar_samp(col1, col2)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the sample covariance of a pair of a numeric columns in the group</td>' +
            '</tr>' +
            '<tr style="background-color: rgb(242, 242, 242);">' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">double</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">corr(col1, col2)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the Pearson coefficient of correlation of a pair of a numeric columns in the group</td>' +
            '</tr>' +
            '<tr>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">double</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">percentile(BIGINT col, p)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the exact p<sup style="margin-top: 0px;margin-bottom: 0px;">th</sup> percentile of a column in the group (does not work with floating point types). p must be between 0 and 1. NOTE: A true percentile can only be computed for integer values. Use PERCENTILE_APPROX if your input is non-integral.</td>' +
            '</tr>' +
            '<tr style="background-color: rgb(242, 242, 242);">' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">array</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">percentile(BIGINT col, array(p1 [, p2]??)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns the exact percentiles p1, p2, ??of a column in the group (does not work with floating point types). pi must be between 0 and 1. NOTE: A true percentile can only be computed for integer values. Use PERCENTILE_APPROX if your input is non-integral.</td>' +
            '</tr>' +
            '<tr>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">double</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">percentile_approx(DOUBLE col, p [, B])</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns an approximate p<sup style="margin-top: 0px;margin-bottom: 0px;">th</sup> percentile of a numeric column (including floating point types) in the group. The B parameter controls approximation accuracy at the cost of memory. Higher values yield better approximations, and the default is 10,000. When the number of distinct values in col is smaller than B, this gives an exact percentile value.</td>' +
            '</tr>' +
            '<tr style="background-color: rgb(242, 242, 242);">' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">array</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">percentile_approx(DOUBLE col, array(p1 [, p2]?? [, B])</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Same as above, but accepts and returns an array of percentile values instead of a single one.</td>' +
            '</tr>' +
            '<tr>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">array</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">histogram_numeric(col, b)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Computes a histogram of a numeric column in the group using b non-uniformly spaced bins. The output is an array of size b of double-valued (x,y) coordinates that represent the bin centers and heights</td>' +
            '</tr>' +
            '<tr style="background-color: rgb(242, 242, 242);">' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">array</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">collect_set(col)</td>' +
            '<td style="text-align:left; border: 1px solid rgb(204, 204, 204); margin: 0px; padding: 6px 13px;border: 1px solid rgb(230, 230, 230);">Returns a set of objects with duplicate elements eliminated</td>' +
            '</tr>' +
            '</tbody>' +
            '</table></div>' +
            '');
        return data;
    };

    Brightics.VA.Core.Dialogs.RefineSteps.StepDialog = StepDialog;

}).call(this);