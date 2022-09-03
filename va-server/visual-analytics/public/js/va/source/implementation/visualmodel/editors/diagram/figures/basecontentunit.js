/**
 * Created by SDS on 2016-09-05.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    const ZOOM = {
        large: 1,
        normal: 0.8,
        small: 0.6
    };

    function BaseContentUnit(parentId, options) {
        this.parentId = parentId;
        this.options = options;
        this.retrieveParent();

        this.init();
        this.createControls();
        this.bindEvents();
    }

    BaseContentUnit.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    BaseContentUnit.prototype.init = function () {
        var _this = this;
        this.editor = Brightics.VA.Core.Utils.WidgetUtils.getEditorRef(this.$parent);
        this.model = this.editor.getModel();
        this.content = this.options.content;
        this.commandListener = function (command) {
            _this.onCommand(command);
        };
        this.editor.addCommandListener(this.commandListener);
    };

    BaseContentUnit.prototype.createControls = function () {
        this.$mainControl = $('' +
            '<div class="brtc-va-visual-content-wrapper brtc-style-content-wrapper">' +
            '   <div class="brtc-va-visual-content-toolitem-area brtc-style-content-toolitem-area" type="' + this.options.content.type + '">' +
            '       <div class="brtc-va-content-move-button brtc-style-content-move-button" title="Move Content" />' +
            '   </div>' +
            '   <div class="brtc-va-visual-content brtc-style-content" type="' + this.options.content.type + '"></div>' +
            '</div>');
        this.$mainControl.attr('content-id', this.options.content.id);
        this.$mainControl.attr('type', this.options.content.type);
        this.$parent.append(this.$mainControl);

        var contentOutlineStatus = this.editor.getContentOutlineStatus();
        if (!contentOutlineStatus) this.$mainControl.addClass('disable-outline');

        this.setContentPosition(this.options.content.position);
        this.setContentSize(this.options.content.size);

        this.$content = this.$mainControl.find('.brtc-va-visual-content');
        this.createToolbar(this.$mainControl.find('.brtc-va-visual-content-toolitem-area'));

        var _this = this;
        this.$mainControl.on('mousedown', function (event) {
            if (!event.ctrlKey) {
                _this.$parent.find('.ui-selected').removeClass('ui-selected');
                _this.$mainControl.addClass('ui-selected');
            } else if (_this.$mainControl.hasClass('ui-selected')) {
                _this.$mainControl.removeClass('ui-selected');
            } else {
                _this.$mainControl.addClass('ui-selected');
            }
            // exportpdfview 예외처리
            if (_this.$parent.closest('.ui-selectable').data('ui-selectable')) {
                _this.$parent.closest('.ui-selectable').data('ui-selectable')._mouseStop(event);
            }
        });
    };

    BaseContentUnit.prototype._fireSelectionChanged = function (force) {
        this.options.paper.setSelection([this.content.id], force);
    };

    BaseContentUnit.prototype.createToolbar = function ($parent) {
        this.createRemoveContentToolItem($parent);
    };

    BaseContentUnit.prototype.createRemoveContentToolItem = function ($parent) {
        var _this = this;
        var $removeButton = $('<div class="brtc-va-content-remove-button brtc-style-content-remove-button" title="'+Brightics.locale.common.removeContent+'" />');
        $parent.append($removeButton);

        $removeButton.click(function () {
            var command = _this.createRemoveContentCommand(_this.options.content.id);
            _this.executeCommand(command);
        });
    };

    BaseContentUnit.prototype.setContentPosition = function (position) {
        this.$mainControl.css('left', position.left);
        this.$mainControl.css('top', position.top);
        if (position['z-index']) this.$mainControl.css('z-index', position['z-index']);
    };

    BaseContentUnit.prototype.setContentSize = function (size) {
        this.$mainControl.css('width', size.width);
        this.$mainControl.css('height', size.height);
    };

    BaseContentUnit.prototype.setContentBackground = function (background) {
        if (this.$unitControl && background) {
            this.$unitControl.find('.panel').css('background', background);
            this.$unitControl.find('.note-editable').css('background', background);
        }
    };

    BaseContentUnit.prototype.setContentArrange = function (index) {
        if (index) {
            this.$mainControl.css('z-index', index);
        }
    };

    BaseContentUnit.prototype.bindEvents = function () {
        this.bindDraggableEvent();
        this.bindResizableEvent();
    };

    BaseContentUnit.prototype.bindDraggableEvent = function () {
        var _this = this;
        var MIN_DISTANCE = 5; // minimum distance to "snap" to a guide
        var guides = []; // no guides available ...
        var click = {x: 0, y: 0};
        var zoomType, zoomValue;

        this.$mainControl.draggable({
            // containment: 'parent',
            handle: '.brtc-va-visual-content-toolitem-area',
            cancel: '.brtc-va-visual-content',
            // grid: [10, 10],

            start: function (event, ui) {
                _this.blur();

                click.x = event.clientX;
                click.y = event.clientY;
                zoomType = _this.$mainControl.closest('.brtc-style-editor-visualeditorpage').attr('zoom-type');
                zoomValue = ZOOM[zoomType] || 1;
                guides = $.map(_this.$parent.find('.brtc-va-visual-content-wrapper').not(this), computeGuidesForElement);
                guides.push({
                    type: "h",
                    left: 0,
                    top: _this.$parent.height() / 2,
                    right: _this.$parent.width()
                });
                guides.push({
                    type: "v",
                    left: _this.$parent.width() / 2,
                    top: 0,
                    bottom: _this.$parent.height()
                });

                _this.$mainControl.closest('.brtc-style-editor-visualeditorpage-paper-container').perfectScrollbar('destroy');
            },
            drag: function (event, ui) {
                _this.$parent.find('.brtc-va-figure-guide-v, .brtc-va-figure-guide-h').hide();
                ui.position.top = calcTop((event.clientY - click.y + ui.originalPosition.top) / zoomValue);
                ui.position.left = calcWidth((event.clientX - click.x + ui.originalPosition.left) / zoomValue);
                if (event.altKey) return;

                // iterate all guides, remember the closest h and v guides
                var chosenGuides = {top: {dist: MIN_DISTANCE + 1}, left: {dist: MIN_DISTANCE + 1}};
                var $t = $(this);
                var pos = {top: ui.position.top, left: ui.position.left};
                var w = $t.outerWidth();
                var h = $t.outerHeight();
                var elemGuides = computeGuidesForElement(null, pos, w, h);
                $.each(guides, function (i, guide) {
                    $.each(elemGuides, function (i, elemGuide) {
                        if (guide.type == elemGuide.type) {
                            var prop = guide.type == "h" ? "top" : "left";
                            var d = Math.abs(elemGuide[prop] - guide[prop]);
                            if (d < chosenGuides[prop].dist) {
                                chosenGuides[prop].dist = d;
                                chosenGuides[prop].offset = elemGuide[prop] - pos[prop];
                                chosenGuides[prop].guide = guide;
                            }
                        }
                    });
                });

                var top, bottom, left, right;
                if (chosenGuides.top.dist <= MIN_DISTANCE) {
                    top = chosenGuides.top.guide.top;
                    left = ui.position.left < chosenGuides.top.guide.left ? ui.position.left : chosenGuides.top.guide.left;
                    // right = ((ui.position.left + ui.helper.context.offsetWidth) > chosenGuides.top.guide.right ? (ui.position.left + ui.helper.context.offsetWidth) : chosenGuides.top.guide.right);
                    right = ((ui.position.left + ui.helper.width()) > chosenGuides.top.guide.right ? (ui.position.left + ui.helper.width()) : chosenGuides.top.guide.right);

                    ui.position.top = chosenGuides.top.guide.top - chosenGuides.top.offset;
                    _this.$parent.find(".brtc-va-figure-guide-h").css("top", top).css("left", left - 10).css('width', right - left + 20).show();
                }
                else {
                    _this.$parent.find(".brtc-va-figure-guide-h").hide();
                    //ui.position.top = calcTop((event.clientY - click.y + ui.originalPosition.top) / zoom);
                }

                if (chosenGuides.left.dist <= MIN_DISTANCE) {
                    left = chosenGuides.left.guide.left;
                    top = ui.position.top < chosenGuides.left.guide.top ? ui.position.top : chosenGuides.left.guide.top;
                    bottom = ((ui.position.top + ui.helper.height()) > chosenGuides.left.guide.bottom ? (ui.position.top + ui.helper.height()) : chosenGuides.left.guide.bottom);

                    ui.position.left = chosenGuides.left.guide.left - chosenGuides.left.offset;
                    _this.$parent.find(".brtc-va-figure-guide-v").css("left", left).css('top', top - 10).css('height', bottom - top + 20).show();
                }
                else {
                    _this.$parent.find(".brtc-va-figure-guide-v").hide();
                    //ui.position.left = calcWidth((event.clientX - click.x + ui.originalPosition.left) / zoom);
                }

                // var currentScrollTop = _this.$parent.closest('.ps-container').scrollTop(),
                //     topHelper = ui.position.top,
                //     delta = topHelper - currentScrollTop;
                // setTimeout(function () {
                //     if (delta < 0) {
                //         _this.$parent.closest('.ps-container').scrollTop(currentScrollTop + delta);
                //     }
                // }, 5);
            },
            stop: function (event, ui) {
                _this.$parent.find('.brtc-va-figure-guide-v, .brtc-va-figure-guide-h').hide();
                var figureInfo = {
                    left: ui.position.left,
                    top: ui.position.top,
                    width: this.style.width,
                    height: this.style.height
                };

                _this.$mainControl.closest('.brtc-style-editor-visualeditorpage-paper-container').perfectScrollbar();

                if (figureInfo.top == _this.options.content.position.top && figureInfo.left == _this.options.content.position.left) return;
                _this.setContentSize(figureInfo);
                _this.setContentPosition(figureInfo);

                var command = _this.createSetContentFigureCommand(figureInfo);
                _this.executeCommand(command);
            }
        });

        function calcTop(top) {
            if (top < 1) return 1;
            if (top > _this.$parent.outerHeight() - _this.$mainControl.outerHeight() - 1) return _this.$parent.outerHeight() - _this.$mainControl.outerHeight() - 1;
            else return top;
        }

        function calcWidth(left) {
            if (left < 1) return 1;
            if (left > _this.$parent.outerWidth() - _this.$mainControl.outerWidth() - 1) return _this.$parent.outerWidth() - _this.$mainControl.outerWidth() - 1;
            else return left;
        }

        function computeGuidesForElement(elem, pos, w, h) {
            var zoomType = _this.$mainControl.closest('.brtc-style-editor-visualeditorpage').attr('zoom-type');
            var zoomValue = ZOOM[zoomType] || 1, top, left;

            if (elem != null) {
                var $t = $(elem);
                pos = $t.position();
                w = $t.outerWidth();
                h = $t.outerHeight();
                top = pos.top / zoomValue;
                left = pos.left / zoomValue;
            } else {
                top = pos.top;
                left = pos.left;
            }

            return [
                {type: "h", left: left, top: top, right: left + w},
                {type: "h", left: left, top: top + h, right: left + w},
                {type: "v", left: left, top: top, bottom: top + h},
                {type: "v", left: left + w, top: top, bottom: top + h},
                // you can add _any_ other guides here as well (e.g. a guide 10 pixels to the left of an element)
                {type: "h", left: left, top: top + h / 2, right: left + w},
                {type: "v", left: left + w / 2, top: top, bottom: top + h}
            ];
        }
    };

    BaseContentUnit.prototype.bindResizableEvent = function () {
        var _this = this;
        var MIN_DISTANCE = 5; // minimum distance to "snap" to a guide
        var guides = []; // no guides available ...
        var click = {x: 0, y: 0};

        this.$mainControl.resizable({
            autoHide: true,
            containment: 'parent',
            cancel: '.cancel-resize',
            minHeight: (this.options.content.type === Brightics.VA.Implementation.Visual.CONTENT_TYPE.TEXT) ? (50) : (100),
            minWidth: 100,
            // grid: [10, 10],
            // handles: 'all',
            start: function (event, ui) {
                _this.blur();

                click.x = event.clientX;
                click.y = event.clientY;
                guides = $.map(_this.$parent.find('.brtc-va-visual-content-wrapper').not(this), computeGuidesForElement);
                guides.push({
                    type: "h",
                    left: 30,
                    top: 30 + _this.$parent.height() / 2,
                    right: 30 + _this.$parent.width()
                });
                guides.push({
                    type: "v",
                    left: 30 + _this.$parent.width() / 2,
                    top: 30,
                    bottom: 30 + _this.$parent.height()
                });

                _this.$mainControl.closest('.brtc-style-editor-visualeditorpage-paper-container').perfectScrollbar('destroy');
            },
            resize: function (event, ui) {
                _this.$parent.find('.brtc-va-figure-guide-v, .brtc-va-figure-guide-h').hide();
                // ui.size.height = ui.originalSize.height + (ui.size.height - ui.originalSize.height) / zoomValue;
                // $(this).height(ui.originalSize.height + ($(this).height() - ui.originalSize.height) / zoomValue);
                // ui.size.width = ui.originalSize.width + (ui.size.width - ui.originalSize.width) / zoomValue;
                // $(this).width(ui.originalSize.width + ($(this).width() - ui.originalSize.width) / zoomValue);
                if (event.altKey) return;

                // iterate all guides, remember the closest h and v guides
                var chosenGuides = {top: {dist: MIN_DISTANCE + 1}, left: {dist: MIN_DISTANCE + 1}};
                var $t = $(this);
                var pos = {top: ui.position.top, left: ui.position.left};
                var padding = $t.outerWidth() - $t.width();
                var elemGuides = computeGuidesForResizeElement(pos, $t.outerWidth(), $t.outerHeight());
                $.each(guides, function (i, guide) {
                    $.each(elemGuides, function (i, elemGuide) {
                        if (guide.type == elemGuide.type) {
                            var prop = guide.type == "h" ? "top" : "left";
                            var d = Math.abs(elemGuide[prop] - guide[prop]);
                            if (d < chosenGuides[prop].dist) {
                                chosenGuides[prop].dist = d;
                                chosenGuides[prop].offset = elemGuide[prop] - guide[prop];
                                chosenGuides[prop].guide = guide;
                            }
                        }
                    });
                });

                if (chosenGuides.top.dist <= MIN_DISTANCE) {
                    var left = ui.position.left < chosenGuides.top.guide.left ? ui.position.left : chosenGuides.top.guide.left;
                    var right = (ui.position.left + ui.helper.width()) > chosenGuides.top.guide.right ? (ui.position.left + ui.helper.width()) : chosenGuides.top.guide.right;

                    _this.$parent.find(".brtc-va-figure-guide-h").css("top", chosenGuides.top.guide.top).css("left", left - 10).css('width', right - left + 20).show();

                    ui.size.height = chosenGuides.top.guide.top - pos.top - padding;
                    $(this).height(chosenGuides.top.guide.top - pos.top - padding);
                }
                else {
                    _this.$parent.find(".brtc-va-figure-guide-h").hide();
                    // ui.size.height = h;
                }

                if (chosenGuides.left.dist <= MIN_DISTANCE) {
                    var top = ui.position.top < chosenGuides.left.guide.top ? ui.position.top : chosenGuides.left.guide.top;
                    var bottom = (ui.position.top + ui.helper.height()) > chosenGuides.left.guide.bottom ? (ui.position.top + ui.helper.height()) : chosenGuides.left.guide.bottom;

                    _this.$parent.find(".brtc-va-figure-guide-v").css("left", chosenGuides.left.guide.left).css('top', top - 10).css('height', bottom - top + 20).show();

                    ui.size.width = chosenGuides.left.guide.left - pos.left - padding;
                    $(this).width(chosenGuides.left.guide.left - pos.left - padding);
                }
                else {
                    _this.$parent.find(".brtc-va-figure-guide-v").hide();
                    // ui.size.width = w;
                }
            },
            stop: function (event, ui) {
                _this.$parent.find('.brtc-va-figure-guide-v, .brtc-va-figure-guide-h').hide();
                var figureInfo = {
                    width: ui.size.width,
                    height: ui.size.height,
                    left: ui.position.left,
                    top: ui.position.top
                };

                if (figureInfo.width == _this.options.content.size.width && figureInfo.height == _this.options.content.size.height) return;

                _this.setContentSize(figureInfo);

                var command = _this.createSetContentFigureCommand(figureInfo);
                _this.executeCommand(command);

                $(window).trigger('resize');

                _this.$mainControl.closest('.brtc-style-editor-visualeditorpage-paper-container').perfectScrollbar();
            }
        });

        function computeGuidesForElement(elem, pos, w, h) {
            var zoomType = _this.$mainControl.closest('.brtc-style-editor-visualeditorpage').attr('zoom-type');
            var zoomValue = ZOOM[zoomType] || 1, top, left;

            if (elem != null) {
                var $t = $(elem);
                pos = $t.position();
                w = $t.outerWidth();
                h = $t.outerHeight();
                top = pos.top / zoomValue;
                left = pos.left / zoomValue;
            }

            return [
                {type: "h", left: left, top: top, right: left + w},
                {type: "h", left: left, top: top + h, right: left + w},
                {type: "v", left: left, top: top, bottom: top + h},
                {type: "v", left: left + w, top: top, bottom: top + h},
                // you can add _any_ other guides here as well (e.g. a guide 10 pixels to the left of an element)
                {type: "h", left: left, top: top + h / 2, right: left + w},
                {type: "v", left: left + w / 2, top: top, bottom: top + h}
            ];
        }

        function computeGuidesForResizeElement(pos, w, h) {
            return [
                {type: "h", top: pos.top + h},
                {type: "v", left: pos.left + w}
            ]
        }
    };

    BaseContentUnit.prototype.createSetContentFigureCommand = function (figureInfo) {
        delete this.options.content.options.data;
        delete this.options.content.options.column;

        return new Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.SetContentFigureCommand(this, {
            content: this.options.content,
            figure: {
                size: {width: figureInfo.width, height: figureInfo.height},
                position: {left: figureInfo.left, top: figureInfo.top}
            }
        });
    };

    BaseContentUnit.prototype.createRemoveContentCommand = function (contentId) {
        return new Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.RemoveContentCommand(this, {
            contentId: contentId
        });
    };

    BaseContentUnit.prototype.focus = function () {
    };

    BaseContentUnit.prototype.blur = function () {
    };

    BaseContentUnit.prototype.destroy = function () {
        this.editor.removeCommandListener(this.commandListener);
        this.$content.off('mousedown');
        this.$mainControl.remove();
    };

    BaseContentUnit.prototype.show = function () {

    };

    BaseContentUnit.prototype.hide = function () {

    };

    BaseContentUnit.prototype.triggerChangedContentStatus = function (status) {
        this.$parent.trigger('contentStatusChanged', [this.options.content.id, status]);
    };

    BaseContentUnit.prototype.onCommand = function (command) {
        if (command instanceof Brightics.VA.Core.CompoundCommand) this.onCompoundCommand(command);

        if (command instanceof Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.SetContentOptionCommand) this.onSetContentOptionsCommand(command);
        if (command instanceof Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.SetContentFigureCommand) this.onSetContentFigureCommand(command);
        if (command instanceof Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.SetContentStyleCommand) this.onSetContentStyleCommand(command);
    };

    BaseContentUnit.prototype.onCompoundCommand = function (command) {
        if (command.event.type == 'REDO' ||
            command.event.type == 'EXECUTE' && command.event.source !== this) {
            for (var i in command.commandList) {
                this.onCommand(command.commandList[i]);
            }
        } else if (command.event.type == 'UNDO') {
            for (var j = command.commandList.length - 1; j > -1; j--) {
                this.onCommand(command.commandList[j]);
            }
        }
    };

    BaseContentUnit.prototype.onSetContentOptionsCommand = function (command) {
        if (command.options.content.id === this.options.content.id) {
            if (command.event.type == 'REDO' || command.event.type == 'UNDO') {
                this.show();
            }
            this.triggerChangedContentStatus('rendered');
        }
    };

    BaseContentUnit.prototype.onSetContentFigureCommand = function (command) {
        if (command.options.content.id === this.options.content.id) {
            if (command.event.type == 'REDO' ||
                command.event.type == 'EXECUTE' && command.event.source !== this) {
                this.setContentPosition(command.options.figure.position);
                this.setContentSize(command.options.figure.size);
            } else if (command.event.type == 'UNDO') {
                this.setContentPosition(command.old.figure.position);
                this.setContentSize(command.old.figure.size);
            }

            this.triggerChangedContentStatus('rendered');
        }
    };

    BaseContentUnit.prototype.onSetContentStyleCommand = function (command) {
        if (command.options.content.id === this.options.content.id) {
            if (command.event.type == 'REDO' ||
                command.event.type == 'EXECUTE' && command.event.source !== this) {
                    this.setContentBackground(command.options.changedStyle.background);
                    this.setContentArrange(command.options.changedStyle['z-index']);
            } else if (command.event.type == 'UNDO') {
                this.setContentBackground(command.old.style.background);
                this.setContentArrange(command.old.style['z-index']);
            }

            this.triggerChangedContentStatus('rendered');
        }
    };

    BaseContentUnit.prototype.executeCommand = function (command) {
        var commandManager = this.editor.getCommandManager();
        if (command.constructor === Brightics.VA.Core.CompoundCommand) {
            if (command.commandList.length === 0) {
                return false;
            }
        }
        return commandManager.execute(command);
    };

    BaseContentUnit.prototype.getZIndex = function () {
        return Number.parseInt(this.$mainControl.css('z-index'));
    };

    BaseContentUnit.prototype.getId = function () {
        return this.options.content.id;
    };

    BaseContentUnit.prototype.getPaper = function () {
        return this.options.paper;
    };

    BaseContentUnit.prototype.adjustArrange = function () {
        if (this.options.content.style && this.options.content.style['z-index']) {
            this.setContentArrange(this.options.content.style['z-index']);
        }
    };

    BaseContentUnit.prototype.adjustBackground = function () {
        if (this.options.content.style && this.options.content.style.background) {
            this.setContentBackground(this.options.content.style.background);
        }
    };

    Brightics.VA.Implementation.Visual.Editors.Diagram.Figures.BaseContentUnit = BaseContentUnit;

}).call(this);