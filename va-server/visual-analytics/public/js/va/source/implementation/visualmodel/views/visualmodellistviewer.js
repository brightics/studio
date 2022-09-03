/**
 * Created by daewon.park on 2016-10-17.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function VisualModelListViewer(parentId, options) {
        this.parentId = parentId;
        this.options = options;
        this.options.multiple = true;
        this.$selectedItems = [];
        this.retrieveParent();
        this.createControls();
    }

    VisualModelListViewer.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    VisualModelListViewer.prototype.createControls = function () {
        this.$mainControl = $('' +
            '<div class="brtc-va-controls-visualmodellist-viewer brtc-style-list-viewer visualmodel">' +
            '   <div class="brtc-va-controls-visualmodellist-viewer-list-profile brtc-style-list-profile"></div>' +
            '   <div class="brtc-va-controls-visualmodellist-viewer-list-container brtc-style-list-container"></div>' +
            '</div>');

        this.$parent.append(this.$mainControl);

        this.createListProfileControl(this.$mainControl.find('.brtc-va-controls-visualmodellist-viewer-list-profile'));
        this.createListBoxControl(this.$mainControl.find('.brtc-va-controls-visualmodellist-viewer-list-container'));
    };

    VisualModelListViewer.prototype.destroy = function () {

    };

    VisualModelListViewer.prototype.createListProfileControl = function ($control) {
        this.$listProfile = $control;
        var $container = this.$listProfile;

        if (this.options.visualModels && this.options.visualModels.length) {
            var project = {
                id: this.options.projectId,
                label: this.options.projectLabel
            };

            var $projectContent = $('' +
                '<div class="brtc-va-workspace-model-list-header">' +
                '   <div class="brtc-va-workspace-model-list-title"></div>' +
                '   <div class="brtc-va-workspace-model-list-selected">' +
                '       <div class="brtc-va-workspace-model-list-selected-label">Selected</div>' +
                '       <div class="brtc-va-workspace-model-list-selected-value">0</div>' +
                '   </div>' +
                '   <div class="brtc-va-workspace-model-list-slash">/</div>' +
                '   <div class="brtc-va-workspace-model-list-count">' +
                '       <div class="brtc-va-workspace-model-list-count-label">Total</div>' +
                '       <div class="brtc-va-workspace-model-list-count-value">' + this.options.visualModels.length + '</div>' +
                '   </div>' +
                '</div>'
            );
            $projectContent.find('.brtc-va-workspace-model-list-title').text(project.label).attr('title', project.label);
            $container.append($projectContent);
        }
    };

    VisualModelListViewer.prototype.createListBoxControl = function ($control) {
        this.$listBox = $control;

        if (this.options.visualModels) {
            this.setSource(this.options.visualModels);
        }
    };

    VisualModelListViewer.prototype.setSource = function (models) {
        this.source = models;
        this.render();
    };

    VisualModelListViewer.prototype.render = function () {
        var _this = this;
        var $target = this.$listBox;
        $target.empty();

        var models = _this.source;
        for (var i in models) {
            //var $item = $('<div class="brtc-va-controls-page-visualmodellist-list-item brtc-style-list-item" title="+' + models[i].label + '+">' + models[i].label + '</div>');
            var model = models[i];
            var $item = $('' +
                '<div class="brtc-va-workspace-model-list-cell">' +
                '   <div class="brtc-va-workspace-model-list-item" id="' + model.getFileId() + '" model-type="' + model.getType() + '">' +
                '       <div class="brtc-va-workspace-model-list-item-title">' +
                '           <div class="brtc-va-workspace-model-list-item-icon"></div>' +
                '           <div class="brtc-va-workspace-model-list-item-type">Report</div>' +
                '       </div>' +
                '           <div class="brtc-va-workspace-model-list-item-label"></div>' +
                    //'       <div class="brtc-va-workspace-model-list-item-updatetime">' +
                    //'           <span>Updated on </span><span>' + moment(model.update_time).format('YYYY-MM-DD HH:mm:ss') + '</span><span> by </span><span>' + Brightics.VA.Core.Utils.WidgetUtils.convertHTMLSpecialChar(model.updater) + '</span>' +
                    //'       </div>' +
                    //'       <div class="brtc-va-workspace-model-list-item-createtime">' +
                    //'           <span>Created on </span><span>' + moment(model.create_time).format('YYYY-MM-DD HH:mm:ss') + '</span><span> by </span><span>' + Brightics.VA.Core.Utils.WidgetUtils.convertHTMLSpecialChar(model.creator) + '</span>' +
                    //'       </div>' +
                '       <div class="brtc-va-workspace-model-list-item-description">' + model.getDescription() +
                '       </div>' +
                '   </div>' +
                '</div>'
            );
            $item.find('.brtc-va-workspace-model-list-item-label').attr('title', model.getLabel()).text(model.getLabel());

            $item.data('model', models[i]);

            $item.click(function (event) {

                if (_this.options.multiple) {
                    if ($(this).hasClass('brtc-style-list-item-selected')) {
                        for (var i in _this.$selectedItems) {
                            if ($(this).data('model').id === _this.$selectedItems[i].data('model').id) {
                                _this.$selectedItems.splice(i, 1);
                                break;
                            }
                        }
                    } else {
                        _this.$selectedItems.push($(this));
                    }
                    $(this).toggleClass('brtc-style-list-item-selected');
                }
                else {
                    if ($(this).hasClass('brtc-style-list-item-selected')) {
                        for (var i in _this.$selectedItems) {
                            if ($(this).data('model').id === _this.$selectedItems[i].data('model').id) {
                                _this.$selectedItems.splice(i, 1);
                                break;
                            }
                        }
                        $(this).removeClass('brtc-style-list-item-selected');
                    } else {
                        $(this).parent().find('.brtc-va-controls-page-visualmodellist-list-item').removeClass('brtc-style-list-item-selected');
                        $(this).addClass('brtc-style-list-item-selected');
                        _this.$selectedItems = [$(this)];
                    }
                }

                _this.$listProfile.find('.brtc-va-workspace-model-list-selected-value').text(_this.$selectedItems.length);
                event.stopPropagation();
            });

            $target.append($item);
        }

        $target.perfectScrollbar();
    };

    VisualModelListViewer.prototype.getSelectedModels = function () {
        var ret = [];

        for (var i in this.$selectedItems) {
            ret.push(this.$selectedItems[i].data('model'));
        }

        return ret;
    };

    Brightics.VA.Implementation.Visual.Views.VisualModelListViewer = VisualModelListViewer;

}).call(this);