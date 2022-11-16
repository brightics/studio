/**
 * Created by daewon.park on 2016-01-27.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ModelSelector(parentId, options) {
        this.parentId = parentId;
        this.options = options || {};
        this.retrieveParent();
        this.createControls();
    }

    ModelSelector.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    ModelSelector.prototype.createControls = function () {
        this.$mainControl = $('<div class="brtc-va-tools-modelselector"></div>');
        this.$parent.append(this.$mainControl);

        this.$mainControl.css({
            width: '100%',
            height: '100%'
        });

        this.createModelControl();
    };

    ModelSelector.prototype.createModelControl = function () {
        var _this = this;

        this.$modelArea = $('<div class="brtc-va-tools-modelselector-model"></div>');
        this.$mainControl.append(this.$modelArea);

        var source = [];

        if (this.options.projectId) {
            var models = this.getModels(this.options.projectId);

            _.map(models, function (model) {
                if (model.getType() === (_this.options.type || 'data')) {
                    source.push({
                        text: model.getLabel(),
                        value:  model.getFileId()
                    })
                }
            });
        }
        
        this.createDropdownList(this.$modelArea, {
            placeHolder: 'Report',
            source: source,
            disabled: this.options.disabled
        });

        this.$modelArea.val(this.options.modelId);
    };

    ModelSelector.prototype.createDropdownList = function ($target, options) {
        var _this = this;
        
        var defaultOptions = {
            theme: Brightics.VA.Env.Theme,
            enableBrowserBoundsDetection: true,
            animationType: 'none',
            width: '100%',
            height: '25px',
            openDelay: 0,
            dropDownHeight: 120,
            disabled: this.options.disabled,
            displayMember: 'text',
            valueMember: 'value'
        };

        $.extend(true, defaultOptions, options);
        
        $target.jqxDropDownList(defaultOptions);

        $target.change(function () {
            var modelId = $(this).val();

            if (_this.options.onChange) _this.options.onChange(modelId);
        });
    };

    ModelSelector.prototype.getModels = function (projectId) {
        return Studio.getResourceManager().getFiles(projectId);
    };

    ModelSelector.prototype.getModelId = function () {
        return this.$modelArea.val();
    };

    ModelSelector.prototype.setSource = function (source) {
        return this.$modelArea.jqxDropDownList('source', source);
    };

    Brightics.VA.Core.Tools.ModelSelector = ModelSelector;

}).call(this);
