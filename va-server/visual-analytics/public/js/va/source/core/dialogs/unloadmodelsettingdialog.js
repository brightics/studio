/**
 * Created by SDS on 2018-03-15.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    var PARAM_TARGET = 'target';
    var PARAM_PATH = 'path';
    var PARAM_LINKED = 'linked'

    function UnloadModelSettingDialog(parentId, options) {
        Brightics.VA.Core.Dialogs.FnUnitDialog.call(this, parentId, options);
    }

    UnloadModelSettingDialog.prototype = Object.create(Brightics.VA.Core.Dialogs.FnUnitDialog.prototype);
    UnloadModelSettingDialog.prototype.constructor = UnloadModelSettingDialog;

    UnloadModelSettingDialog.prototype._initOptions = function () {
        Brightics.VA.Core.Dialogs.FnUnitDialog.prototype._initOptions.call(this);

        this.dialogOptions.width = 450;
        this.dialogOptions.height = 600;
    };

    UnloadModelSettingDialog.prototype.createControls = function () {
        this.$mainControl = $('' +
            '<div class="brtc-va-dialogs-main brtc-style-minus-40">' +
            '    <div class="brtc-va-dialogs-body">' +
            '        <div class="brtc-va-dialogs-title brtc-style-display-flex brtc-style-height-45px brtc-style-padding-right-20"></div>' +
            '        <div class="brtc-va-dialogs-contents brtc-va-dialogs-fnunit brtc-style-display-flex brtc-style-width-97-p"></div>' +
            '        <div class="brtc-va-dialogs-buttonbar brtc-style-padding-right-30"></div>' +
            '    </div>' +
            '</div>');

        this.$titleArea = this.$mainControl.find('.brtc-va-dialogs-title');
    };

    UnloadModelSettingDialog.prototype.createDialogContentsArea = function ($parent) {
        var _this = this;

        this.$contentsAreaWrapper = $('' +
            '<div class="brtc-va-views-properties-pages brtc-style-width-full rtc-style-overflow-hidden">' +
            '   <div class="contents brtc-style-padding-right-10 brtc-style-relative brtc-style-full"></div>' +
            '</div>');
        this.$contentsAreaWrapper.css({
            width: this.options.width,
            height: this.options.height,
            border: 'none'
        });
        $parent.append(this.$contentsAreaWrapper);
        this.$contentsArea = this.$contentsAreaWrapper.find('.contents');

        this.addPropertyControl('Target', function ($parent) {
            _this.createTargetControl($parent);
        });

        this.addPropertyControl('Path', function ($parent) {
            _this.createModelPathControl($parent);
        }).find('.brtc-va-views-properties-pages-controls-propertycontrol-contents').css({border: 'none'});
    };

    UnloadModelSettingDialog.prototype.createTargetControl = function ($parent) {
        this.$target = $parent;
        var FnUnitUtils = this.FnUnitUtils;
        var targetSource = FnUnitUtils.getPreviousFnUnits(this.options.fnUnit).map(function (fn) {
            return {
                label: FnUnitUtils.getLabel(fn),
                value: FnUnitUtils.getId(fn)
            }
        });

        this.createDropDownList($parent, {
            source: targetSource
        }).val(this.options.fnUnit.param[PARAM_TARGET]);
    };

    UnloadModelSettingDialog.prototype.createModelPathControl = function ($parent) {
        this.$path = $('<input type="text" class="brtc-va-views-properties-pages-controls-propertycontrol-input" />');
        $parent.append(this.$path);
        this.createInput(this.$path).val(this.options.fnUnit.param[PARAM_PATH]);
    };

    UnloadModelSettingDialog.prototype.addPropertyControl = function (label, callback, option) {
        var _this = this,
            $propertyControl = $('' +
                '<div class="brtc-va-views-properties-pages-controls-propertycontrol">' +
                '   <div class="brtc-va-views-properties-pages-controls-propertycontrol-label"></div>' +
                '   <div class="brtc-va-views-properties-pages-controls-propertycontrol-contents">' +
                '</div>');

        this.$contentsArea.append($propertyControl);

        $propertyControl.jqxExpander({
            theme: Brightics.VA.Env.Theme,
            arrowPosition: 'left',
            initContent: function () {
                if (typeof callback === 'function') {
                    callback.call(_this, $propertyControl.find(".brtc-va-views-properties-pages-controls-propertycontrol-contents"), option);
                }
            }
        });
        $propertyControl.jqxExpander('setHeaderContent', label);
        return $propertyControl;
    };

    UnloadModelSettingDialog.prototype.setDropDownControlValue = function (key, value) {
        var $control = this.$mainControl.find('.brtc-va-views-properties-pages-controls-propertycontrol-dropdown[param-key="' + key + '"]');
        if ($control.val() !== value) {
            $control.val(value);
        }
    };

    UnloadModelSettingDialog.prototype.createInput = function ($control) {
        return $control.jqxInput({
            theme: Brightics.VA.Env.Theme,
            width: '100%',
            height: '30px'
        });
    };

    UnloadModelSettingDialog.prototype.createDropDownList = function ($control, options) {
        return $control.jqxDropDownList(_.extend({
            theme: Brightics.VA.Env.Theme,
            width: '100%',
            height: '25px'
        }, options));
    };

    UnloadModelSettingDialog.prototype.setInputControlValue = function (key, value) {
        var $control = this.$mainControl.find('.brtc-va-views-properties-pages-controls-propertycontrol-input[param-key="' + key + '"]');
        if ($control.val() !== value) {
            $control.val(value);
        }
    };

    UnloadModelSettingDialog.prototype.makeInputs = function (lfu) {
        var rt = {}
        var FnUnitUtils = this.FnUnitUtils;

        if (lfu) {
            _.forEach(FnUnitUtils.getOutData(lfu), function (d, i) {
                rt[d] = d;
            })
        }

        return rt;
    };

    UnloadModelSettingDialog.prototype.makeMeta = function (lfu) {
        var rt = {}
        var FnUnitUtils = this.FnUnitUtils;
        if (lfu) {
            _.forEach(FnUnitUtils.getOutData(lfu), function (d, i) {
                var type = FnUnitUtils.getTypeByTableId(lfu, d);
                rt[d] = {type: type};
            })
        }

        // Fix me : default
        rt.model = {type: 'model'}

        return rt;
    };

    UnloadModelSettingDialog.prototype.makeParam = function (lfu) {
        var rt = {};
        rt[PARAM_TARGET] = this.$target.val();
        rt[PARAM_PATH] = this.$path.val();

        if (lfu) {
            rt[PARAM_LINKED] = {
                name: lfu.name,
                param: lfu.param,
                outData: lfu.outData,
                outputs: lfu.outputs
            }
        }

        return rt;
    };

    UnloadModelSettingDialog.prototype.getFunctionByFid = function (fid) {
        return Studio.getActiveEditor().getFunctionByFid(fid);
    };

    UnloadModelSettingDialog.prototype.getTargetTable = function (fid) {
        var rt = {
            model: '',
            meta: ''
        };

        var fu = this.getFunctionByFid(fid);
        rt.model = this.FnUnitUtils.getTrainModel(fu);
        rt.meta = this.FnUnitUtils.getTrainMeta(fu);

        return rt;
    };

    UnloadModelSettingDialog.prototype.handleOkClicked = function () {
        var result = $.extend(true, {}, this.options.fnUnit);
        var lfu = this.getFunctionByFid(this.$target.val());
        result.param = this.makeParam(lfu);
        result.inputs = this.makeInputs(lfu);
        result.meta = _.extend(result.meta, this.makeMeta(lfu));

        this.dialogResult = {
            OK: true,
            Cancel: false,
            results: {fnUnit: result}
        };

        this.$mainControl.dialog('close');
    };

    Brightics.VA.Core.Dialogs.UnloadModelSettingDialog = UnloadModelSettingDialog;

}).call(this);