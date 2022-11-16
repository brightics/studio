/**
 * Created by SDS on 2016-09-05.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    const CONTENT_INIT_TOP = 30;
    const CONTENT_INIT_LEFT = 30;

    const CONTENT_INIT_WIDTH = 520;
    const CONTENT_INIT_HEIGHT = 250;
    var Logger = new Brightics.VA.Log('PaperUnit');

    function PaperUnit(parentId, options) {
        this.parentId = parentId;
        this.options = options;

        this.retrieveParent();

        this.init();
        this.createControls();
        this.createContents();
    }

    PaperUnit.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    PaperUnit.prototype.init = function () {
        this.editor = Brightics.VA.Core.Utils.WidgetUtils.getEditorRef(this.$parent);
        this.contentLoading = {};
        this.contentList = {};

        var _this = this;
        this.commandListener = function (command) {
            _this.onCommand(command);
        };
        this.editor.addCommandListener(this.commandListener);

        this.contentTop = CONTENT_INIT_TOP;
        this.contentLeft = CONTENT_INIT_LEFT;
    };

    PaperUnit.prototype.destroy = function () {
        this.setSelection();
        for (var key in this.contentList) {
            this.contentList[key].destroy();
        }
        this.contentList = {};
        this.contentLoading = {};

        this.editor.removeCommandListener(this.commandListener);
        this.$mainControl.remove();
    };

    PaperUnit.prototype.createControls = function () {
        this.$mainControl = $('' +
            '<div class="brtc-va-visual-page-wrapper brtc-style-transform-origin-left brtc-style-inline-flex-center brtc-style-min-full">' +
            '   <div class="brtc-va-visual-page brtc-style-page" page-type="a4-vertical" tabindex="1">' +
            '       <div class="brtc-va-figure-guide-h brtc-style-figure-guide brtc-style-s-figure-guide-h"></div>' +
            '       <div class="brtc-va-figure-guide-v brtc-style-figure-guide brtc-style-s-figure-guide-v"></div>' +
            '   </div>' +
            '</div>');
        this.$parent.append(this.$mainControl);

        this.$page = this.$mainControl.children('.brtc-va-visual-page');
        this.$page.attr('page-id', this.options.page.id);
        this.$page.css({
            'background-color': this.options['background-color']
        });

        var model = this.editor.getModel();

        if (model.report.display['page-type']) {
            this._setPageSize(model.report.display);
        } else {
            this._setPageSize(Brightics.VA.Implementation.Visual.CONST.DEFAULT_REPORT_SIZE);
        }
    };


    PaperUnit.prototype.render = function (contentId) {
        if (contentId) {
            this.contentList[contentId].show();
        } else {
            for (var i in this.contentList) {
                this.contentList[i].show(true);
            }
        }
    };

    PaperUnit.prototype.refresh = function () {
        for (var i in this.contentList) {
            this.contentList[i].show();
        }
    };

    PaperUnit.prototype.reloadData = function () {
        for (var i in this.contentList) {
            this.contentList[i].show(true);
        }
    };

    PaperUnit.prototype.createContents = function () {
        this.bindEvents();
        for (var key in this.options.page.contents) {
            this.addContent(this.options.page.contents[key]);
        }
    };

    PaperUnit.prototype.bindEvents = function () {
        this.bindCreatedContentEvent();
    };

    PaperUnit.prototype.executeCommand = function (command) {
        var commandManager = this.editor.getCommandManager();
        if (command.constructor === Brightics.VA.Core.CompoundCommand) {
            if (command.commandList.length === 0) {
                return false;
            }
        }
        return commandManager.execute(command);
    };

    PaperUnit.prototype.bindCreatedContentEvent = function () {
        var _this = this;
        this.$page.on('contentStatusChanged', function (event, contentId, status) {
            _this.contentLoading[contentId] = status;
            _this.fireLoadComplete();
        })
    };

    PaperUnit.prototype.onCommand = function (command) {
        if (command instanceof Brightics.VA.Core.CompoundCommand) this.onCompoundCommand(command);

        if (command.event.type == 'REDO' || command.event.type == 'UNDO') this.setSelection();

        if (command instanceof Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.NewContentCommand) this.onNewContentCommand(command);
        if (command instanceof Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.RemoveContentCommand) this.onRemoveContentCommand(command);
        // if (command instanceof Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.SetContentOptionCommand) this.onSetContentOptionCommand(command);
        if (command instanceof Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.SetContentFigureCommand) this.onSetContentFigureCommand(command);
        // if (command instanceof Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.SetContentChartTypeCommand) this.onSetContentChartTypeCommand(command);
        if (command instanceof Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.SetContentDataSourceCommand) this.onSetContentDataSourceCommand(command);
        if (command instanceof Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.SetPageDisplayOptionsCommand) this.onSetPageDisplayOptionsCommand(command);

    };

    PaperUnit.prototype.onCompoundCommand = function (command) {
        var i;
        if (command.event.type == 'REDO' ||
            command.event.type == 'EXECUTE' && command.event.source !== this) {
            for (i in command.commandList) {
                this.onCommand(command.commandList[i]);
            }
        } else if (command.event.type == 'UNDO') {
            for (i = command.commandList.length - 1; i > -1; i--) {
                this.onCommand(command.commandList[i]);
            }
        }
    };

    PaperUnit.prototype.onSetPageDisplayOptionsCommand = function (command) {
        if (command.event.type == 'REDO' || command.event.type == 'EXECUTE') {
            this._setBackGroundColor(command.options.display);
            this._setPageSize(command.options.display);
        } else {
            this._setBackGroundColor(command.options.old);
            this._setPageSize(command.options.old);
        }

        if (command.event.type == 'REDO' || command.event.type == 'UNDO') {
            this.fireSelectionChanged();
        }
    };

    PaperUnit.prototype._setBackGroundColor = function (display) {
        if (display['backgroundColor']) {
            this.$page.css({'background-color': display['backgroundColor']});
        }
    };

    PaperUnit.prototype._setPageSize = function (display) {
        if (display['page-type']) {
            this.$page.attr('page-type', display['page-type']);
            this.$page.css('width', display.width + 'px');
            this.$page.css('height', display.height + 'px');

            if (display['page-type'] === 'custom') {
                var parentWidth = parseInt(display.width) + 200;
                this.$page.parent().css('width', parentWidth + 'px');
            } else {
                this.$page.parent().css('width', '100%');
            }
            this._setInitContentSize();
        }
    };

    PaperUnit.prototype._setInitContentSize = function () {
        this.initContentWidth = CONTENT_INIT_WIDTH <= this.$page.width() - 60 ? CONTENT_INIT_WIDTH : this.$page.width() - 60;
        this.initContentHeight = CONTENT_INIT_HEIGHT <= this.$page.height() - 60 ? CONTENT_INIT_HEIGHT : this.$page.height() - 60;
    };


    PaperUnit.prototype.onNewContentCommand = function (command) {
        if (command.options.pageId !== this.options.page.id) return;

        if (command.event.type == 'REDO' || command.event.type == 'EXECUTE') {
            this.addContent(command.options.content);
            this.render(command.options.content.id);
            this.$parent.selectable('refresh');
            this.setSelection([command.options.content.id]);
        } else if (command.event.type == 'UNDO') {
            this.removeContent(command.options.content.id);
        }
    };

    PaperUnit.prototype.onRemoveContentCommand = function (command) {
        if (command.old.pageId !== this.options.page.id) return;

        if (command.event.type == 'REDO' || command.event.type == 'EXECUTE') {
            this.removeContent(command.options.contentId);
        } else if (command.event.type == 'UNDO') {
            this.addContent(command.old.content);
            this.render(command.old.content.id);
            this.$parent.selectable('refresh');
            this.setSelection([command.old.content.id]);
        }
    };

    // PaperUnit.prototype.onSetContentOptionCommand = function (command) {
    //     if (command.event.type == 'REDO' || command.event.type == 'UNDO' || command.event.type == 'EXECUTE') {
    //         if (this.contentList[command.options.content.id]) {
    //             // this.setSelection([command.options.content.id]);
    //             // this.render(command.event.source.options.content.id);
    //         }
    //     }
    // };

    PaperUnit.prototype.onSetContentFigureCommand = function (command) {
        if (command.event.type == 'REDO' || command.event.type == 'UNDO') {
            if (this.contentList[command.options.content.id]) {
                this.setSelection([command.options.content.id]);
            }
        }
    };

    // PaperUnit.prototype.onSetContentChartTypeCommand = function (command) {
    //     if (this.contentList[command.options.content.id]) {
    //         this.setSelection([command.options.content.id]);
    //     }
    // };

    PaperUnit.prototype.onSetContentDataSourceCommand = function (command) {
        if (this.contentList[command.options.content.id]) {
            // this.setSelection([command.options.content.id]);
        }
    };

    PaperUnit.prototype.getNewContentPosition = function () {
        this.contentLeft = this.contentLeft + CONTENT_INIT_TOP + this.initContentWidth + 7 > this.$page.width() - 30 ? CONTENT_INIT_LEFT - 7 : this.contentLeft + CONTENT_INIT_LEFT;
        this.contentTop = this.contentTop + CONTENT_INIT_TOP + this.initContentHeight + 7 > this.$page.height() - 30 ? CONTENT_INIT_TOP - 7 : this.contentTop + CONTENT_INIT_TOP;
        return {
            left: this.contentLeft,
            top: this.contentTop,
            'z-index': 100 + Object.keys(this.options.page.contents).length
        }
    };

    PaperUnit.prototype.createNewTextContentCommand = function () {
        if (Object.keys(this.options.page.contents).length >= 50) {
            Brightics.VA.Core.Utils.WidgetUtils.openInformationDialog('Maximum number of contents to create is 50.');
            return;
        }

        var content = this.editor.getModel().newContent({
            type: Brightics.VA.Implementation.Visual.CONTENT_TYPE.TEXT,
            options: {'html': ''},
            position: this.getNewContentPosition(),
            size: {
                width: this.initContentWidth,
                height: this.initContentHeight
            }
        });
        return new Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.NewContentCommand(this, {
            content: content,
            pageId: this.options.page.id
        });
    };

    PaperUnit.prototype.createNewChartContentCommand = function (type, options) {
        var chartOptions = options.chartOption || {chart: {type: type}};
        chartOptions.chart.type = type;

        if (Object.keys(this.options.page.contents).length >= 50) {
            Brightics.VA.Core.Utils.WidgetUtils.openInformationDialog('Maximum number of contents to create is 50.');
            return;
        }

        var content = this.editor.getModel().newContent({
            type: Brightics.VA.Implementation.Visual.CONTENT_TYPE.CHART,
            options: chartOptions,
            position: this.getNewContentPosition(),
            size: {
                width: this.initContentWidth,
                height: this.initContentHeight
            },
            dataSourceId: options.dataSourceId
        });
        return new Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.NewContentCommand(this, {
            content: content,
            pageId: this.options.page.id
        });
    };

    PaperUnit.prototype.createPasteContentCommand = function (content) {
        var newContent = _.cloneDeep(content);
        newContent.id = Brightics.VA.Core.Utils.IDGenerator.reportContent.id();
        newContent.position = this.getNewContentPosition();

        return new Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.NewContentCommand(this, {
            content: newContent,
            pageId: this.options.page.id
        });
    };

    PaperUnit.prototype.removeContent = function (contentId) {
        delete this.contentLoading[contentId];
        this.contentList[contentId].destroy();
        delete this.contentList[contentId];
        this.setSelection();

        this.fireLoadComplete();
    };

    PaperUnit.prototype.addContent = function (content) {
        this.contentLoading[content.id] = 'init';
        try {
            this.contentList[content.id] = new Brightics.VA.Implementation.Visual.Editors.Diagram.Figures.ContentUnit[content.type](this.$page, {
                content: content,
                publish: this.options.publish,
                paper: this
            });
        } catch (e) {
            Logger.error(e.stack, {category: 'Chart'});
        }

        this.contentLoading[content.id] = 'rendered';
        this.fireLoadComplete();
    };

    PaperUnit.prototype.setSelection = function (selection, force) {
        var selectedContentIds = selection || [];
        if (this.$page.css('display') == 'none') return;

        this.$page.find('.ui-selectee').addClass('cancel-resize');
        var $selectee = this.$page.find('.brtc-style-content-wrapper.ui-selectee');
        for (var i = 0; i < $selectee.length; i++) {
            var match = false;
            for (var j in selectedContentIds) {
                if ($($selectee[i]).attr('content-id') === selectedContentIds[j]) {
                    match = true;
                    break;
                }
            }
            if (selectedContentIds.length === 1) {
                if (!match) {
                    $($selectee[i]).removeClass('ui-selected');
                    this.contentList[$($selectee[i]).attr('content-id')].blur();
                }
            } else {
                this.contentList[$($selectee[i]).attr('content-id')].blur();
            }
        }

        if (selectedContentIds.length === 1) {
            this.contentList[selectedContentIds[0]].focus();
            var contentId = selectedContentIds[0];

            this.$page.find('.brtc-style-content-wrapper[content-id="' + contentId + '"].ui-selectee').addClass('ui-selected');
            this.$page.find('.ui-selected').removeClass('cancel-resize');
        }

        if (selectedContentIds.length === 0) this.$page.find('.ui-selectee').removeClass('ui-selected');

        if (JSON.stringify(this.selectedContentIds) !== JSON.stringify(selectedContentIds) || !selection || force) this.fireSelectionChanged(selectedContentIds);

        this.selectedContentIds = selectedContentIds;
    };

    PaperUnit.prototype.getSelectedContentIds = function () {
        return this.selectedContentIds;
    };

    PaperUnit.prototype.fireLoadComplete = function () {
        var _this = this, isCompleted = true;
        for (var contentId in this.contentLoading) {
            if (this.contentLoading[contentId] !== 'rendered') {
                isCompleted = false;
                break;
            }
        }
        if (isCompleted) {
            this.$parent.trigger('loadComplete', [{
                pageId: _this.options.page.id
            }]);
        }
    };

    PaperUnit.prototype.fireSelectionChanged = function (selectedContentIds) {
        var selectedContentUnits = [];
        for (var k in selectedContentIds) {
            for (var id in this.contentList) {
                if (selectedContentIds[k] === id) {
                    selectedContentUnits.push(this.contentList[id]);
                    break;
                }
            }
        }
        this.$parent.closest('.brtc-va-editor').trigger("editorSelectionChanged", [selectedContentUnits]);
    };

    PaperUnit.prototype.show = function () {
        this.$mainControl.show();

        this.setSelection();
    };

    PaperUnit.prototype.hide = function () {
        for (var i in this.contentList) {
            this.contentList[i].hide();
        }

        this.$mainControl.hide();
    };

    PaperUnit.prototype.getMaxZIndex = function () {
        var max = 1;

        for (var i in this.contentList) {
            var content = this.contentList[i];
            var index = Number.parseInt(content.$mainControl.css('z-index'));

            if (max < index) max = index;
        }
        return max;
    };

    PaperUnit.prototype.getMinZIndex = function () {
        var min = Number.MAX_SAFE_INTEGER;

        for (var i in this.contentList) {
            var content = this.contentList[i];
            var index = Number.parseInt(content.$mainControl.css('z-index'));

            if (min > index) min = index;
        }
        return min;
    };

    PaperUnit.prototype.getArrangeFrontIndex = function () {
        //max+1
        // var contentUnit = this.contentList[unitId];
        var maxIndex = this.getMaxZIndex();

        // contentUnit.setZIndex(maxIndex + 1);

        return maxIndex + 1;
    };

    PaperUnit.prototype.setArrangeBackendIndex = function (unitId) {
        //1. min 값을 구하고 2.나머지 uni을 전부 +1 하고 3.타켓을 min값으로 셋팅
        for (var id in this.contentList) {
            var contentUnit = this.contentList[id];
            var currentZIndex = contentUnit.getZIndex();

            // if (id === unitId) contentUnit.setZIndex(minIndex);
            // else contentUnit.setZIndex(currentZIndex + 1);
        }

        return currentZIndex + 1;
    };

    PaperUnit.prototype.setArrangePlusIndex = function (unitId) {
        // +1
        var contentUnit = this.contentList[unitId];
        var currentZIndex = contentUnit.getZIndex();
        contentUnit.setZIndex(currentZIndex + 1);

        return currentZIndex + 1;
    };

    PaperUnit.prototype.setArrangeMinusIndex = function (unitId) {
        // -1
        var contentUnit = this.contentList[unitId];
        var currentZIndex = contentUnit.getZIndex();
        contentUnit.setZIndex(currentZIndex - 1);

        return currentZIndex - 1;
    };

    PaperUnit.prototype.getContent = function (unitId) {
        return this.contentList[unitId].options.content;
    };

    PaperUnit.prototype.createRemoveContentCommand = function (unitId) {
        return new Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.RemoveContentCommand(this, {
            contentId: unitId
        });
    };

    Brightics.VA.Implementation.Visual.Editors.Diagram.Figures.PaperUnit = PaperUnit;
}).call(this);
