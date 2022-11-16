/**
 * Created by daewon77.park on 2016-03-24.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function SwitchUnitDialog(parentId, options) {
        this.parentId = parentId;
        this.options = options;
        this.dialogResult = {
            OK: false,
            Cancel: true
        };
        this.retrieveParent();
        this.createControls();
        this.initContents();
    }

    SwitchUnitDialog.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    SwitchUnitDialog.prototype.createControls = function () {
        this.$mainControl = $('' +
            '<div class="brtc-va-dialogs-main brtc-va-dialogs-selectfnunit">' +
            '   <div class="brtc-va-dialogs-body brtc-va-dialogs-selectfnunit">' +
            '       <div class="brtc-va-dialogs-contents brtc-va-dialogs-selectfnunit" />' +
            '   </div>' +
            '</div>');
        this.$parent.append(this.$mainControl);

        var _this = this,
            jqxOpt = {
                theme: Brightics.VA.Env.Theme,
                title: 'Insert Unit',
                width: 780,
                height: 700,
                modal: true,
                resizable: false,
                close: function () {
                    if (typeof _this.options.close == 'function') {
                        _this.options.close(_this.dialogResult);
                    }
                    _this.$mainControl.dialog('destroy');
                    _this.$mainControl.remove();
                }
            };

        this.$mainControl.dialog(jqxOpt);
        this.$mainControl.parent().find('.brtc-va-dialogs-selectfnunit-tab-allfunctions').css('padding-left', '14px');
    };

    SwitchUnitDialog.prototype.initContents = function () {
        this.createDialogContentsArea(this.$mainControl.find('.brtc-va-dialogs-contents'));

        this._removeTitleBottomBorder();
    };

    SwitchUnitDialog.prototype._removeTitleBottomBorder = function () {
        this.$mainControl.prev().css('border', 'initial');
    };


    SwitchUnitDialog.prototype.createDialogContentsArea = function ($parent) {
        $parent.append('' +
            '<ul>' +
            '     <li>All Units</li>' +
            '</ul>' +
            '<div class="brtc-va-dialogs-selectfnunit-tab-allfunctions brtc-style-border-box"></div>'
        );

        $parent.jqxTabs({
            theme: Brightics.VA.Env.Theme,
            width: this.options.width || '100%',
            position: 'top',
            scrollable: false
        });

        var $all = $parent.find('.brtc-va-dialogs-selectfnunit-tab-allfunctions');
        this.createAllFunctionsArea($all);
        $all.perfectScrollbar();
        $parent.jqxTabs('focus');
        $parent.find('.jqx-tabs-titleContentWrapper').css('margin-top', '4.5px');
    };

    SwitchUnitDialog.prototype.createAllFunctionsArea = function ($parent) {
        var _this = this;

        var dataFlowGroup = {
            'label': 'DataFlow',
            'visible': true,
            'functions': []
        };

        for (var i in _this.options.dataFlowList) {
            dataFlowGroup.functions.push({
                'func': {
                    func: 'dataFlow',
                    category: 'DataFlow',
                    label: _this.options.dataFlowList[i].getLabel(),
                    mid: _this.options.dataFlowList[i].getFileId()
                },
                'label': _this.options.dataFlowList[i].getLabel(),
                'visible': true
            });
        }

        this.palette = new Brightics.VA.Core.Views.Palette($parent, {
            width: '100%',
            height: '100%',
            draggable: false,
            modelType: _this.options.modelType,
            additionalGroup: dataFlowGroup
        });

        $parent.find('.brtc-va-views-palette-filter-input').hide();
        $parent.find('.brtc-va-views-palette-navigator').bind('DOMNodeInserted', function (event) {
            if ($(event.target).hasClass('brtc-va-views-palette-fnunit-list')) {
                $(event.target).find('.brtc-va-views-palette-fnunit').click(function (event) {
                    var func = Brightics.VA.Core.Utils.WidgetUtils.getData($(this), 'func');
                    var unit = {};
                    if (func && func.category && func.category == 'DataFlow') {
                        unit.func = func.func;
                        unit.mid = func.mid;
                    } else {
                        unit.func = func;
                    }
                    _this.dialogResult = {
                        OK: true,
                        Cancel: false,
                        unit: unit
                    };
                    _this.$mainControl.dialog('close');
                })
            }
        });
    };

    Brightics.VA.Core.Dialogs.SwitchUnitDialog = SwitchUnitDialog;

}).call(this);