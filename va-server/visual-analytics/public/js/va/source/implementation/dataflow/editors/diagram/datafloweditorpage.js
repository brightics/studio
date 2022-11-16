/**
 * Created by sungjin1.kim on 2016-02-01.
 */
/* global IN_DATA, OUT_DATA, FUNCTION_NAME, _, brtc_require, joint, Studio */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    var FnUnitUtils = brtc_require('FnUnitUtils');

    var BEHAVIOR_LINK = 'link';
    var BEHAVIOR_DEFAULT = 'default';

    var TOOLTIP_ENABLED = 'tooltip-enabled';

    var IN_PORT_ID = 'in-left';
    var OUT_PORT_ID = 'out-right';

    var checkCursorHold = function (_event) {
        return _event && _event.movementX === 0 && _event.movementY === 0
    }

    function DataFlowEditorPage(parentId, options) {
        this.MAX_FUNC_COUNT = Brightics.VA.SettingStorage.getValue('editor.maxfuncnum');
        this.MAX_FUNC_MESSAGE = 'You can only add up to ' + this.MAX_FUNC_COUNT + '.';

        this.parentId = parentId;
        this.options = options;
        this.options.scale = this.options.scale || 1;
        this.opacity4transition = {
            duration: 1000,
            timingFunction: joint.util.timing.inout,
            valueFunction: function (a, b) {
                return function (t) {
                    return Math.max(0.2, b + t);
                };
            }
        };
        this.translateProblems = {};
        this._highlightedViews = [];
        this._selectedLinkViews = [];
        this._selectedElements = [];
        this.dropContents = null;
        this.dropFigures = [];
        this.dropLinks = [];
        this.behaviorMode = BEHAVIOR_DEFAULT;
        this.toolItems = {};

        this.retrieveParent();
        this.createControls();
        this.registerDebugListener();
        this.render();

        this.registerCommandEventListener();
        this.registerGoHistoryEventListener();

        this.prvFnUnitSelectTrigger = {};

        var figures = this.graph.getElements();
        if (figures.length > 0) {
            var leftMost = figures[0];
            for (var i in figures) {
                if (leftMost.attributes.position.x > figures[i].attributes.position.x) {
                    leftMost = figures[i];
                }
            }
            this.ensureCenter(leftMost);
        }
        this.updateMiniMapWindow();
        Brightics.OptModelManager.renderOptModels(this);
    }

    DataFlowEditorPage.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    DataFlowEditorPage.prototype.createControls = function () {
        this.$mainControl = $('<div class="brtc-va-editors-diagram-diagrameditorpage brtc-style-editor-editorpage"></div>');
        this.$parent.append(this.$mainControl);

        var $paper = $('<div class="brtc-va-editors-diagram-diagrameditorpage-paper"></div>');
        this.$mainControl.append($paper);

        this.createMainPanel();
        this.createDiagramPaper();

        this.$createCue = $('' +
            '<div class="brtc-va-editors-diagram-diagrameditorpage-function-cue-create">' +
            '    <div class="brtc-va-editors-diagram-diagrameditorpage-function-cue-create-label-wrapper">' +
            '        <div class="brtc-va-editors-diagram-diagrameditorpage-function-cue">' +
            '           <div class="brtc-va-editors-diagram-diagrameditorpage-function-cue-create-label">' + Brightics.locale.common.click + '</div>' +
            '       </div>' +
            '       <div class="brtc-va-editors-diagram-diagrameditorpage-function-cue-create-icon"></div>' +
            '    </div>' +
            '</div>');
        this.$selectedBounds = $('<div class="brtc-va-editors-diagram-diagrameditorpage-function-multiselected"></div>');
        this.$toolTip = $('<div class="brtc-va-editors-diagram-diagrameditorpage-function-tooltip"></div>');
        this.$toolbar = $('<div class="brtc-va-editors-diagram-diagrameditorpage-function-toolbar"></div>');
        this.$guideBox = $('<div class="brtc-va-editors-diagram-diagrameditorpage-function-guidebox"></div>');
        this.$guideMessageBox = $('<div class="brtc-va-editors-diagram-diagrameditorpage-function-guidemessage"></div>');
        this.$dragSelection = $('<div class="brtc-va-editors-diagram-diagrameditorpage-function-drag-selection"></div>');

        $paper.append(this.$createCue);
        $paper.append(this.$selectedBounds);
        $paper.append(this.$toolTip);
        $paper.append(this.$toolbar);
        $paper.append(this.$guideBox);
        $paper.append(this.$guideMessageBox);
        $paper.append(this.$dragSelection);

        this.createFnUnitToolbar();
        this.createMultiSelectionToolbar();
        this.createCue();
        this._createMiniMapControl();

        this.changeScale(this.options.scale);
    };

    DataFlowEditorPage.prototype.createMainPanel = function () {
        var _this = this;

        this.$mainControl.perfectScrollbar();

        this.$mainControl.scroll(function () {
            _this.updateMiniMapWindow();
        });

        this.$mainControl.hover(function () {
            _this.fitToContent();
        }, function () {
            _this.fitToContent();
        });

        this.$mainControl.mouseleave(function () {
            if (!_this.switchFnUnitDialog) _this.hideCue();
        });
    };

    DataFlowEditorPage.prototype.createDiagramPaper = function () {
        this.$paperElement = this.$mainControl.find('.brtc-va-editors-diagram-diagrameditorpage-paper');

        this.graph = new joint.dia.Graph();
        this.paper = new joint.dia.Paper({
            sortViews: _.noop,
            el: this.$paperElement,
            width: this.options.width,
            height: this.options.height,
            model: this.graph,
            snapLinks: false,
            markAvailable: false,
            linkPinning: false,
            multiLinks: false,
            gridSize: 10,
            theme: 'none',
            clickThreshold: 3,
            interactive: function (cellView) {
                if (cellView.model instanceof joint.dia.Link) {
                    return {
                        linkMove: false,
                        labelMove: false,
                        arrowheadMove: true,
                        vertexMove: false,
                        vertexAdd: false,
                        vertexRemove: false,
                        useLinkTools: false
                    };
                } else {
                    return {
                        elementMove: false
                    };
                }
            }
        });

        this.paper.on('element:pointerdblclick', this.handleElementPointerDblClick.bind(this));
        this.paper.on('element:pointerclick', this.handleElementPointerClick.bind(this));
        this.paper.on('element:pointermove', this.handleElementPointerMove.bind(this));
        this.paper.on('element:pointerup', this.handleElementPointerUp.bind(this));
        this.paper.on('element:mouseenter', this.handleElementMouseEnter.bind(this));
        this.paper.on('element:mouseleave', this.handleElementMouseLeave.bind(this));

        this.paper.on('link:pointerclick', this.handleLinkPointerClick.bind(this));
        this.paper.on('link:pointermove', this.handleLinkPointerMove.bind(this));
        this.paper.on('link:pointerup', this.handleLinkPointerUp.bind(this));
        this.paper.on('link:mouseenter', this.handleLinkMouseEnter.bind(this));
        this.paper.on('link:mouseleave', this.handleLinkMouseLeave.bind(this));

        this.paper.on('blank:pointerclick', this.handleBlankPointerClick.bind(this));
        this.paper.on('blank:pointermove', this.handleBlankPointerMove.bind(this));
        this.paper.on('blank:pointerup', this.handleBlankPointerUp.bind(this));
        this.paper.on('blank:mousewheel', this.handleBlankMouseWheel.bind(this));
        this.$paperElement.mousemove(this.handleBlankMouseOver.bind(this));

        this.paper.on('render:done', function () {
            console.log('render:done');
        });
        this.graph.on('remove', this.handleGraphRemove.bind(this));

        this.makeDroppable();
    };

    DataFlowEditorPage.prototype.handleElementPointerDblClick = function (elementView, evt, x, y) {
        if (this.behaviorMode === BEHAVIOR_LINK) {
            if (this._isConnectableCell(elementView.model)) {
                this._handleLinkCellPointerClick(elementView, evt, x, y);
            } else {
                this._handleDefaultCellPointerClick(elementView, evt, x, y);
                this._triggerFnUnitDbClick();
            }
            this._setBehaviorModeToDefault();
        } else {
            this._handleDefaultCellPointerClick(elementView, evt, x, y);
            this._triggerFnUnitDbClick();
        }
    };

    DataFlowEditorPage.prototype.handleElementPointerClick = function (elementView, evt, x, y) {
        if (this.behaviorMode === BEHAVIOR_LINK) {
            if (this._isConnectableCell(elementView.model)) {
                this._handleLinkCellPointerClick(elementView, evt, x, y);
            } else {
                this._handleDefaultCellPointerClick(elementView, evt, x, y);
                this._triggerFnUnitSelect();
            }
            this._setBehaviorModeToDefault();
        } else {
            this._handleDefaultCellPointerClick(elementView, evt, x, y);
            this._triggerFnUnitSelect();
        }
    };

    DataFlowEditorPage.prototype._handleLinkCellPointerClick = function (elementView, evt, x, y) {
        var fromCell = this._fromCell;
        var toCell = elementView.model;
        var kid = Brightics.VA.Core.Utils.IDGenerator.link.id();
        var link = this._createLinkFigure(kid, fromCell, toCell);
        this.graph.addCells([link]);

        var command = this.createConnectFnUnitCommand(link);
        if (this.fireCommand(command)) {
            // link.set('target', { id: elementView.model.id, port: IN_PORT_ID });
        } else {
            link.remove();
            this.notification('warning', 'No connection could be made.');
        }
        elementView.unhighlight();
    };

    DataFlowEditorPage.prototype._handleDefaultCellPointerClick = function (elementView, evt, x, y) {
        var figure = elementView.model;
        if (!evt.ctrlKey) {
            this._unselectAllLinkViews();
            this._unselectAllElements();
        }
        this._selectElement(figure);
        this.showSelectionBox();
    };

    DataFlowEditorPage.prototype.handleElementPointerMove = function (elementView, evt, x, y) {
        if (this.behaviorMode === BEHAVIOR_LINK) {
            evt.stopPropagation();
            return;
        }

        var getPointerPositionStr = function (_evt) {
            return `x:${_evt.clientX},y:${_evt.clientY}`;
        };

        let _this = this;
        let figure = elementView.model;

        if (evt.data.dragging) {

            (_.throttle(function () {
                _this.forceScrollTo(evt, x, y);
                var data = evt.data;
                if (data.ghost) {
                    var boxMap = evt.data.boxMap;

                    data.ghost.children().forEach((cell) => {
                        let cellBox = boxMap[cell.id];
                        cell.attr({
                            'x': (x - cellBox.dx),
                            'y': (y - cellBox.dy)
                        });
                    })
                }
            }, 100))();


        } else if (evt.data.originalPositionStr && evt.data.originalPositionStr !== getPointerPositionStr(evt)) {

            evt.data.dragging = true;
            _this.dragging = true;

            if (this._selectedElements.indexOf(figure) === -1) {
                this._unselectAllElements();
                this._selectElement(figure);
            }

            this._configureDragEvent(elementView, evt, x, y);
            this._triggerFnUnitMove();
            this._unselectAllLinkViews();
            this.showGuideBox(figure);
            this.hideCue();
            this.hideGuideMessage();
            this.hideSelectionBox();
            this.hideTools(true);
        } else {
            evt.data.originalPositionStr = evt.data.originalPositionStr || getPointerPositionStr(evt);
        }
    };

    DataFlowEditorPage.prototype._configureDragEvent = function (elementView, evt, x, y) {
        var _this = this;

        var ghost = V('g');
        ghost.appendTo(this.paper.viewport);

        var boxMap = {};
        _this._selectedElements.map((fg) => {
            let fnUnit = V('rect');
            let fnBBox = fg.getBBox();

            fnUnit.attr({
                'x': fnBBox.x,
                'y': fnBBox.y + 6,
                'fill': 'transparent',
                'stroke': fg.getColor(),
                'stroke-dasharray': '4,4',
                'stroke-width': 4,
                width: Brightics.VA.Env.Diagram.FIGURE_WIDTH - 5,
                height: Brightics.VA.Env.Diagram.FIGURE_HEIGHT - 12,
                rx: (Brightics.VA.Env.Diagram.FIGURE_HEIGHT - 12) / 2,
                ry: (Brightics.VA.Env.Diagram.FIGURE_HEIGHT - 12) / 2
            });

            boxMap[fnUnit.id] = fnBBox;
            boxMap[fnUnit.id].dx = x - fnBBox.x;
            boxMap[fnUnit.id].dy = y - fnBBox.y - 6;
            boxMap[fnUnit.id].figure = fg;

            ghost.append(fnUnit);
        });

        evt.data.ghost = ghost;
        evt.data.boxMap = boxMap;
    };


    DataFlowEditorPage.prototype.handleElementPointerUp = function (elementView, evt, x, y) {
        var currentFigure = elementView.model;
        var _this = this;
        if (evt.data.dragging) {
            evt.data.dragging = false;
            _this.dragging = false;

            var figures = [];
            var changedFigures = [];

            var data = evt.data;
            if (data.ghost) {
                data.ghost.remove();

                let box, guideLocation;
                for (var id in data.boxMap) {
                    box = data.boxMap[id];
                    guideLocation = this.calcGuideLocation(x - box.dx, y - box.dy);
                    box.figure.position(guideLocation.x, guideLocation.y);
                    figures.push(box.figure);
                    changedFigures.push({
                        figure: box.figure,
                        position: guideLocation
                    });
                }
            }

            var message = Object.values(this.validateTranslate(figures))[0];
            if (message) {
                this.notification('warning', message);
                $.each(figures, function (index, f) {
                    _this._revertPosition(f);
                });
            } else {
                var commands = new Brightics.VA.Core.CompoundCommand(_this, {label: 'Change Position'});
                $.each(changedFigures, function (index, changedFigure) {
                    var f = changedFigure.figure;
                    var p = changedFigure.position;
                    var unit = _this.getFnUnitById(f.prop('fid'));
                    if (unit.display.diagram.position.x !== p.x || unit.display.diagram.position.y !== p.y) {
                        commands.add(_this.createSetFnUnitPositionCommand(f, p.x, p.y));
                    }
                });
                this.fireCommand(commands);

                if (figures.length == 1) {
                    setTimeout(function () {
                        _this.ensureCenter(currentFigure);
                    }, 100);
                }
                this._rerouteLink();
            }
            this.hideGuideBox();
            this.hideGuideMessage();
            this.showSelectionBox();
            this.showTools(currentFigure);
        }
    };

    DataFlowEditorPage.prototype.handleElementMouseEnter = function (elementView, evt) {
        if (this.behaviorMode === BEHAVIOR_LINK) {
            for (var i = 0; i < this._connectableFigures.length; i++) {
                if (this._connectableFigures[i].cid === elementView.model.cid) {
                    elementView.highlight();
                    break;
                }
            }
        } else {
            this.showTools(elementView.model);
            this.showToolTip(elementView.model);
        }
    };

    DataFlowEditorPage.prototype.handleElementMouseLeave = function (elementView, evt) {
        if (elementView.model !== this._fromCell) {
            elementView.unhighlight();
        }
        this.hideTools();
        this.hideToolTip();
    };

    DataFlowEditorPage.prototype.handleLinkPointerClick = function (linkView, evt, x, y) {
        this._setBehaviorModeToDefault();

        this._unselectAllLinkViews();
        this._unselectAllElements();

        this.hideSelectionBox();
        this.addLinkTools(linkView);
        this._selectLinkView(linkView);

        this._triggerFnUnitSelect();
        if (this.$guideBox) this.$guideBox.hide();
    };

    DataFlowEditorPage.prototype.handleLinkPointerMove = function (linkView, evt, x, y) {
        var getAnchorStr = function (_linkView) {
            return JSON.stringify(_linkView.sourceAnchor) + JSON.stringify(_linkView.targetAnchor);
        };

        var _this = this;
        if (evt.data.dragging) {
            (_.throttle(function () {
                _this.fitToContent();
                _this.forceScrollTo(evt, x, y);
            }, 100))();
        } else if (evt.data.originalAnchorStr && evt.data.originalAnchorStr !== getAnchorStr(linkView)) {
            evt.data.dragging = true;
            this.dragging = true;
            this._triggerFnUnitMove();
            this.hideCue();
        } else {
            evt.data.originalAnchorStr = evt.data.originalAnchorStr || getAnchorStr(linkView);
        }
    };

    DataFlowEditorPage.prototype.handleLinkPointerUp = function (linkView, evt, x, y) {
        if (evt.data.dragging) {
            evt.data.dragging = false;
            this.dragging = false;

            let link = linkView.model;
            var currentSource = link.getSourceElement();
            var currentTarget = link.getTargetElement();
            var currentSourceFid = currentSource.prop('fid');
            var currentTargetFid = currentTarget.prop('fid');
            link.prop({'sourceFid': currentSourceFid, 'targetFid': currentTargetFid});

            var message = this.validateConnect([link]);
            if (message) {
                this.notification('warning', message);
                this._revertLink(link);
            } else {
                link.set({
                    'source': {id: currentSource.id, port: OUT_PORT_ID},
                    'target': {id: currentTarget.id, port: IN_PORT_ID},
                    'sourceFid': currentSourceFid,
                    'targetFid': currentTargetFid,
                });

                var command = this.createReconnectFnUnitCommand(link);
                this.fireCommand(command);
            }
            this._unselectAllLinkViews();
            this._selectLinkView(linkView);
            this.addLinkTools(linkView);
        }
    };

    DataFlowEditorPage.prototype.handleLinkMouseEnter = function (linkView, evt, x, y) {
        // if (linkView.model.prop('selected')) {
        //     this.addLinkTools(linkView);
        // }
    };

    DataFlowEditorPage.prototype.handleLinkMouseLeave = function (linkView, evt, x, y) {
        // linkView.removeTools();
    };

    DataFlowEditorPage.prototype.handleBlankPointerClick = function (evt, x, y) {
        this._unselectAllLinkViews();
        this._setBehaviorModeToDefault();

        if (this.getEditor().getSheetEditorPageArea().css('visibility') === 'hidden'
            || Brightics.VA.SettingStorage.getValue('editor.closePanelOnClick') === 'true') {
            this._unselectAllElements();
            this.hideSelectionBox();
            this._triggerFnUnitSelect();
        }
    };

    DataFlowEditorPage.prototype.handleBlankPointerMove = function (evt, x, y) {
        var _this = this;

        if (evt.data.dragging) {
            (_.throttle(function () {
                var paperOffset = _this.$paperElement.offset();
                var x = evt.pageX - paperOffset.left;
                var y = evt.pageY - paperOffset.top;

                var startX = _this.$dragSelection.attr('start-x');
                var startY = _this.$dragSelection.attr('start-y');
                _this.$dragSelection.css({
                    left: Math.min(x, startX),
                    top: Math.min(y, startY),
                    width: Math.abs(x - startX),
                    height: Math.abs(y - startY),
                });
                _this.forceScrollTo(evt, x, y);
            }, 200))();
        } else {
            if (checkCursorHold(evt.originalEvent)) return;
            evt.data.dragging = true;
            _this.dragging = true;
            this._unselectAllElements();
            this._unselectAllLinkViews();
            this._triggerFnUnitSelect();

            this.hideSelectionBox();
            this.hideTools();
            this.hideToolTip();

            this.$dragSelection.css({
                display: 'block',
                width: 0,
                height: 0
            });
            this.$dragSelection.attr('start-x', x * this.options.scale);
            this.$dragSelection.attr('start-y', y * this.options.scale);
        }
    };

    DataFlowEditorPage.prototype.handleBlankPointerUp = function (evt, x, y) {
        var _this = this;
        if (evt.data.dragging) {
            evt.data.dragging = false;
            _this.dragging = false;

            var width = this.$dragSelection.width();
            var height = this.$dragSelection.height();
            if (width > 10 && height > 10) {
                var pos = this.$dragSelection.position();
                var bounds = new g.rect(pos.left / this.options.scale,
                    pos.top / this.options.scale,
                    width / this.options.scale,
                    height / this.options.scale);
                var models = this.graph.findModelsInArea(bounds);
                if (models.length > 0) {
                    this._selectElements(models);
                    this.showSelectionBox();

                    if (models.length === 1) setTimeout(function () {
                        _this.ensureCenter(models[0]);
                    }, 100);
                }
                this._triggerFnUnitSelect();
            }
            this.$dragSelection.css({display: 'none'});
        }
    };

    DataFlowEditorPage.prototype.handleBlankMouseWheel = function (evt, x, y, delta) {
        if (evt.ctrlKey) {
            var scale = this.options.scale;
            scale += 0.2 * delta
            scale = Math.min(scale, 1.0);
            scale = Math.max(scale, 0.2);
            this.changeScale(parseFloat(scale.toFixed(1)));
            evt.stopPropagation();
            evt.preventDefault();
        }
    };

    DataFlowEditorPage.prototype.handleBlankMouseOver = function (evt, x, y) {
        var _this = this;

        if (this.options.scale < 0.6) return

        (_.throttle(function () {
            if (!_this.dragging && !_this.dropping) {
                var paperOffset = _this.$paperElement.offset();
                var x = evt.pageX - paperOffset.left;
                var y = evt.pageY - paperOffset.top;

                var xx = x;
                var yy = y;
                var gap_width = _this.GAP_WIDTH || Brightics.VA.Env.Diagram.GAP_WIDTH;
                var gap_height = _this.GAP_HEIGHT || Brightics.VA.Env.Diagram.GAP_HEIGHT;
                var total_width = Brightics.VA.Env.Diagram.FIGURE_WIDTH + gap_width;
                var total_height = Brightics.VA.Env.Diagram.FIGURE_HEIGHT + gap_height;
                var differenceX = xx % Number.parseInt(total_width * _this.options.scale);
                var differenceY = yy % Number.parseInt(total_height * _this.options.scale);
                xx = xx - differenceX;
                xx = xx + Number.parseInt(Brightics.VA.Env.Diagram.PAPER_MARGIN_LEFT * _this.options.scale);
                yy = yy - differenceY;
                yy = yy + Number.parseInt(Brightics.VA.Env.Diagram.PAPER_MARGIN_TOP * _this.options.scale);
                var models = _this.graph.findModelsFromPoint({
                    x: xx / _this.options.scale,
                    y: yy / _this.options.scale
                });


                if (models.length === 0 && !checkCursorHold(evt.originalEvent)) {
                    _this.$createCue.attr('mousedown', 'false');
                    _this.$createCue.css({display: 'flex', left: xx, top: yy});

                    var label = Brightics.VA.SettingStorage.getValue('editor.function.add.doubleclick') !== 'true' ? Brightics.locale.common.click : Brightics.locale.common.doubleClick;
                    _this.$createCue.find('.brtc-va-editors-diagram-diagrameditorpage-function-cue-create-label').first().text(label);
                }
            }
        }, 200))();
    };

    DataFlowEditorPage.prototype.handleGraphRemove = function (model, collection, opt) {
        if (model.isLink() && opt.ui === true) {
            var command = this.createDisconnectFnUnitCommand(model);
            this.fireCommand(command);
            this.notification('success', 'The connection was removed.');
        }
        ;
        // Do not reroute the link for performance. by daewon.park
    };

    DataFlowEditorPage.prototype._unselectAllLinkViews = function () {
        if (this._selectedLinkViews.length) {
            this._selectedLinkViews.map(l => {
                l.removeTools();
                l.model.unselect();
            });
            this._selectedLinkViews = [];
        }
    };

    DataFlowEditorPage.prototype._selectLinkViews = function (linkViews) {
        linkViews.map(l => l.model.select());
        this._selectedLinkViews = linkViews;
    };

    DataFlowEditorPage.prototype._selectLinkView = function (linkView) {
        this._selectLinkViews([linkView]);
    };

    DataFlowEditorPage.prototype._unselectAllElements = function () {
        if (this._selectedElements.length) {
            this._selectedElements.map(e => e.unselect());
            this._selectedElements = [];
        }
    };

    DataFlowEditorPage.prototype._unselectElements = function (elements) {
        elements.map(e => e.unselect());
        this._selectedElements = this._selectedElements.filter(e => elements.indexOf(e) === -1);
    };

    DataFlowEditorPage.prototype._unselectElement = function (element) {
        this._unselectElements([element]);
    };

    DataFlowEditorPage.prototype._selectAllElements = function () {
        this._selectedElements = $.extend(true, [], this.graph.getElements());
        this._selectedElements.map(e => e.select());
    }

    DataFlowEditorPage.prototype._selectElements = function (elements) {
        elements.map(e => e.select());
        this._selectedElements = this._selectedElements.concat(elements);
    };

    DataFlowEditorPage.prototype._selectElement = function (element) {
        this._selectElements([element]);
    };

    DataFlowEditorPage.prototype._triggerFnUnitDbClick = function () {
        this.$parent.trigger('fnUnit:dbclick', [this._selectedElements.map(e => e.prop('fid'))]);
    };

    DataFlowEditorPage.prototype._triggerFnUnitSelect = function () {
        this.$parent.trigger('fnUnit:select', [this._selectedElements.map(e => e.prop('fid'))]);
    };

    DataFlowEditorPage.prototype._triggerFnUnitMove = function () {
        this.$parent.trigger('fnUnit:move');
    };

    DataFlowEditorPage.prototype._triggerMouseLeave = function () {
        this.$parent.trigger('mouseleave');
    };

    DataFlowEditorPage.prototype.forceScrollTo = function (evt, x, y) {
        let _this = this;
        let padding = {
            top: 120,
            right: 220,
            bottom: 50,
            left: 220
        };
        (_.throttle(function () {
            let cx = evt.clientX;
            let cy = evt.clientY;

            let scrollLeft = _this.$mainControl.scrollLeft();
            let scrollTop = _this.$mainControl.scrollTop();
            let scrollSpeed = 20;

            let width = document.querySelector('html').clientWidth;
            let height = document.querySelector('html').clientHeight;

            let change = false;
            if (cy < padding.top && scrollTop > 0) {
                change = true;
                scrollTop -= scrollSpeed;
            }
            if (cx > width - padding.right) {
                change = true;
                scrollLeft += scrollSpeed;
            }
            if (cy > height - padding.bottom) {
                change = true;
                scrollTop += scrollSpeed;
            }
            if (cx < padding.left && scrollLeft > 0) {
                change = true;
                scrollLeft -= scrollSpeed;
            }

            if (change) {
                _this.$mainControl.scrollLeft(scrollLeft);
                _this.$mainControl.scrollTop(scrollTop);
            }
        }, 200))();
    };

    DataFlowEditorPage.prototype.createFnUnitToolbar = function () {
        var _this = this;

        this.$tools = this.$mainControl.find('.brtc-va-editors-diagram-diagrameditorpage-function-toolbar');
        this.$tools.hover(function () {
            _this.clearHideToolsTimer();
        }, function () {
            _this.hideTools(false);
        });

        this.createRemoveToolItem();
        this.createClearLinkToolItem();
        this.createShiftLeftToolItem();
        this.createShiftRightToolItem();
        this.createSwitchToolItem();
        this.createConnectToolItem();
        this.createCloneToolItem();
        this.createEnterToolItem();
        this.createPopupToolItem();
    };

    DataFlowEditorPage.prototype.createRemoveToolItem = function () {
        var _this = this;

        var $remove = $('<div class="brtc-va-editors-diagram-diagrameditorpage-function-tools brtc-va-editors-diagram-diagrameditorpage-function-tools-remove" title="'+Brightics.locale.common.remove+'"></div>');
        this.$tools.append($remove);

        $remove.click(function () {
            var cid = _this.$tools.attr('cid');
            var figure = _this.graph.getCell(cid);
            _this._unselectElement(figure);
            _this.removeFnUnitFigure(figure);
            _this._unselectAllLinkViews();
            _this.showSelectionBox();
            _this._triggerFnUnitSelect();
            _this.hideTools(true);
        });
        this.toolItems.remove = $remove;
    };

    DataFlowEditorPage.prototype.createClearLinkToolItem = function () {
        var _this = this;

        var $clearLink = $('<div class="brtc-va-editors-diagram-diagrameditorpage-function-tools brtc-va-editors-diagram-diagrameditorpage-function-tools-clearlink"><i class="fa fa-chain-broken"></i></div>');
        this.$tools.append($clearLink);

        $clearLink.click(function () {
            var cid = _this.$tools.attr('cid');
            var figure = _this.graph.getCell(cid);
            _this.removeFnUnitLink(figure);
        });
        this.toolItems.clearLink = $clearLink;
    };

    DataFlowEditorPage.prototype.createShiftLeftToolItem = function () {
        var _this = this;

        var $shiftLeft = $('<div class="brtc-va-editors-diagram-diagrameditorpage-function-tools brtc-va-editors-diagram-diagrameditorpage-function-tools-shiftleft brtc-style-flex-center"><i class="fa fa-angle-double-left fa-lg"></i></div>');
        this.$tools.append($shiftLeft);

        $shiftLeft.click(function () {
            var cid = _this.$tools.attr('cid');
            var figure = _this.graph.getCell(cid);
            var command = _this.createShiftLeftCommand(figure);
            if (_this.fireCommand(command) === false) {
                _this.notification('warning', command.message);
            } else {
                _this.hideSelectionBox();
                _this.showSelectionBox();
            }
        });
        this.toolItems.shiftLeft = $shiftLeft;
    };

    DataFlowEditorPage.prototype.createShiftRightToolItem = function () {
        var _this = this;

        var $shiftRight = $('<div class="brtc-va-editors-diagram-diagrameditorpage-function-tools brtc-va-editors-diagram-diagrameditorpage-function-tools-shiftright brtc-style-flex-center"><i class="fa fa-angle-double-right fa-lg"></i></div>');
        this.$tools.append($shiftRight);

        $shiftRight.click(function () {
            var cid = _this.$tools.attr('cid');
            var figure = _this.graph.getCell(cid);
            var command = _this.createShiftRightCommand(figure);
            _this.fireCommand(command);
            _this.hideSelectionBox();
            _this.showSelectionBox();
        });
        this.toolItems.shiftRight = $shiftRight;
    };

    DataFlowEditorPage.prototype.createSwitchToolItem = function () {
        var _this = this;

        var $switch = $('<div class="brtc-va-editors-diagram-diagrameditorpage-function-tools brtc-va-editors-diagram-diagrameditorpage-function-tools-switch" title="'+Brightics.locale.common.changeFunction+'"></div>');
        this.$tools.append($switch);

        $switch.click(function (event) {
            var closeHandler = function (dialogResult) {
                if (dialogResult.OK) {
                    var cid = _this.$tools.attr('cid');
                    var figure = _this.graph.getCell(cid);
                    var currUnit = _this.getFnUnitById(figure.attributes.fid);
                    if (currUnit.func !== dialogResult.func) {
                        var replaceUnit = _this.getModel().newFnUnit(dialogResult.func);
                        replaceUnit.display.diagram.position = $.extend({}, currUnit.display.diagram.position);
                        var command = _this.createSwitchFnUnitCommand(figure, replaceUnit, currUnit);
                        command.event.source = this;
                        _this.fireCommand(command);
                    }
                }
                _this.switchFnUnitDialog = null;
            };

            var preCid = _this.$tools.attr('cid');
            var preFigure = _this.graph.getCell(preCid);
            var preFnUnit = _this.getModel().getPrevious(preFigure.attributes.fid);
            _this.switchFnUnitDialog = new Brightics.VA.Core.Dialogs.SwitchFnUnitDialog($(event.target), {
                preFnUnit: _this.getFnUnitById(preFnUnit[0]),
                modelType: _this.getModel().type,
                close: closeHandler
            });
        });
        this.toolItems.switch = $switch;
    };

    DataFlowEditorPage.prototype.createConnectToolItem = function () {
        var _this = this;
        var fromCell, link;
        var $link = $('<div class="brtc-va-editors-diagram-diagrameditorpage-function-tools brtc-va-editors-diagram-diagrameditorpage-function-tools-connect" title="'+Brightics.locale.common.connect+'"></div>');
        this.$tools.append($link);

        $link.click(function () {
            var cid = _this.$tools.attr('cid');
            fromCell = _this.graph.getCell(cid);
            var fromCellView = _this.paper.findViewByModel(fromCell);
            _this._highlightedViews.push(fromCellView);
            fromCellView.highlight();
            _this._connectableFigures = _this._findConnectableFigures(fromCell);
            _this._fromCell = fromCell;
            _this._unselectAllLinkViews();
            _this._unselectAllElements();
            _this.hideSelectionBox();
            _this._setBehaviorModeToLink();
            _this._triggerFnUnitSelect();
        });

        $link.draggable({
            appendTo: _this.$paperElement,
            helper: function (event) {
                return $('<div class="brtc-va-editors-diagram-diagrameditorpage-function-tools-link-helper"></div>');
            },
            start: function (event, ui) {
                _this.dragging = true;
                _this._unselectAllLinkViews();
                var cid = _this.$tools.attr('cid');
                fromCell = _this.graph.getCell(cid);
                var kid = Brightics.VA.Core.Utils.IDGenerator.link.id();
                link = _this._createLinkFigure(kid, fromCell, {
                    x: ui.position.left / _this.options.scale,
                    y: ui.position.top / _this.options.scale
                });
                _this.graph.addCells([link]);
                ui.helper.attr('cid', link.cid);
            },
            drag: function (event, ui) {
                var pointX = event.pageX - _this.$paperElement.offset().left;
                var pointY = event.pageY - _this.$paperElement.offset().top;

                var x = pointX / _this.options.scale;
                var y = pointY / _this.options.scale;

                var models = _this.graph.findModelsFromPoint({
                    x: x,
                    y: y
                });
                _this._unhighlightAll();

                var sourceModel = fromCell;

                if (models.length > 0 && _this._isConnectableFnUnit(sourceModel, models[0])) {
                    link.set('target', {id: models[0].id, port: IN_PORT_ID});

                    var highlightedView = _this.paper.findViewByModel(models[0]);
                    _this._highlightedViews.push(highlightedView);
                    highlightedView.highlight();
                } else {
                    link.set('target', {
                        x: x,
                        y: y
                    });
                }

                (_.throttle(function () {
                    _this.fitToContent();
                    _this.forceScrollTo(event, x, y);
                }, 200))();

            },
            stop: function (event, ui) {
                _this.dragging = false;
                var pointX = event.pageX - _this.$paperElement.offset().left;
                var pointY = event.pageY - _this.$paperElement.offset().top;

                _this._unhighlightAll();
                var models = _this.graph.findModelsFromPoint({
                    x: pointX / _this.options.scale,
                    y: pointY / _this.options.scale
                });
                if (models.length > 0) {
                    if (link.attributes.source.id === models[0].id) {
                        link.remove();
                        _this.notification('warning', 'No connection could be made because connection loop.');
                    } else {
                        link.prop({'targetFid': models[0].prop('fid')});
                        var message = _this.validateConnect([link]);
                        if (message) {
                            _this.notification('warning', message);
                            link.remove();
                        } else {
                            var command = _this.createConnectFnUnitCommand(link);
                            if (!_this.fireCommand(command)) {
                                link.remove();
                                _this.notification('warning', 'No connection could be made because connection already exists.');
                            }
                        }
                    }
                } else {
                    link.remove();
                    _this.notification('warning', 'No connection could be made.');
                }
            },
            scope: 'tasks'
        });
        this.toolItems.connect = $link;
    };

    DataFlowEditorPage.prototype.createCloneToolItem = function () {
        var _this = this;

        var $duplicate = $('<div class="brtc-va-editors-diagram-diagrameditorpage-function-tools brtc-va-editors-diagram-diagrameditorpage-function-tools-clone" title="'+Brightics.locale.common.duplicate+'"></div>');
        this.$tools.append($duplicate);

        $duplicate.click(function () {
            _this.notification('info', 'Click and drag to clone function');
        });

        $duplicate.draggable({
            appendTo: _this.$paperElement,
            helper: function (event) {
                return $('<div class="brtc-va-editors-diagram-diagrameditorpage-function-tools-clone-helper"></div>');
            },
            start: function (event, ui) {
                _this.dragging = true;
                var cid = _this.$tools.attr('cid');
                var model = _this.graph.getCell(cid);

                // need to change about 'id' & 'outData'
                var duplicated = model.clone();
                duplicated.unselect();
                duplicated.resetRuntime();

                var dummy = {
                    functions: [_.cloneDeep(_this.getFnUnitById(duplicated.attributes.fid))],
                    links: [],
                    innerModels: {},
                    type: 'data'
                };
                dummy.innerModels = _this._collectInnerModels(_this.getEditor().getModel(), dummy);

                var dummyModel = Brightics.VA.Core.Utils.ModelUtils.cloneModel(dummy);

                _this.duplicatedFnUnit = dummyModel.functions[0];
                FnUnitUtils.clearInData(_this.duplicatedFnUnit);

                _this.duplicatedDummyModel = dummyModel;

                duplicated.attributes.dummy = true;
                duplicated.attributes.fid = _this.duplicatedFnUnit.fid;

                var x = ui.position.left / _this.options.scale - model.attributes.position.x;
                var y = ui.position.top / _this.options.scale - model.attributes.position.y;
                duplicated.translate(x, y);
                _this.graph.addCells([duplicated]);

                ui.helper.attr('cid', duplicated.cid);
                _this.hideCue();
                _this.showGuideBox(duplicated);
            },
            drag: function (event, ui) {
                var cid = ui.helper.attr('cid');
                var duplicated = _this.graph.getCell(cid);
                var x = ui.position.left / _this.options.scale - duplicated.attributes.position.x;
                var y = ui.position.top / _this.options.scale - duplicated.attributes.position.y;
                duplicated.translate(x, y);
                _this.showGuideBox(duplicated);
            },
            stop: function (event, ui) {
                _this.dragging = false;
                var cid = ui.helper.attr('cid');
                var duplicated = _this.graph.getCell(cid);

                var message = Object.values(_this.validateTranslate([duplicated]))[0];
                if (message) {
                    _this.hideGuideBox();
                    _this.hideGuideMessage();
                    _this.notification('warning', message);

                    duplicated.remove();
                } else if (_this.getFunctionsLength() + 1 > _this.MAX_FUNC_COUNT) {
                    _this.hideGuideBox();
                    _this.hideGuideMessage();

                    duplicated.remove();
                    Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog(_this.MAX_FUNC_MESSAGE);
                } else {
                    var x = ui.position.left / _this.options.scale - duplicated.attributes.position.x;
                    var y = ui.position.top / _this.options.scale - duplicated.attributes.position.y;
                    duplicated.translate(x, y);
                    _this.hideGuideBox();
                    var pos = _this.calcGuidePosition(duplicated);
                    duplicated.position(pos.x, pos.y);
                    duplicated.attributes.dummy = false;

                    var links = [];
                    if (Brightics.VA.SettingStorage.getValue('editor.diagram.autoconnect') === 'true') links = _this.connectSmartly(duplicated);
                    _this.graph.addCells(links);

                    var commands = new Brightics.VA.Core.CompoundCommand(_this, {label: 'Clone a Function'});

                    commands.add(_this.createNewFnUnitCommand(duplicated,
                        _this.duplicatedFnUnit,
                        _this.duplicatedDummyModel));

                    commands.add(_this.createSetFnUnitPositionCommand(duplicated, pos.x, pos.y));
                    for (const link of links) {
                        commands.add(_this.createConnectFnUnitCommand(link));
                    }
                    _this.fireCommand(commands);

                    _this._unselectAllElements();
                    _this._selectElement(duplicated);
                    _this.showSelectionBox();
                    _this._triggerFnUnitSelect();
                }
            }
        });
        this.toolItems.duplicate = $duplicate;
    };

    DataFlowEditorPage.prototype.createEnterToolItem = function () {
        var _this = this;
        var $enter = $('<div class="brtc-va-editors-diagram-diagrameditorpage-function-tools brtc-va-editors-diagram-diagrameditorpage-function-tools-enter" title="Step Into"></div>');
        this.$tools.append($enter);
        $enter.click(function () {
            var cid = _this.$tools.attr('cid');
            var figure = _this.graph.getCell(cid);
            _this.hideTools(true);
            _this.$parent.trigger('fnUnit:dbclick', [[figure.attributes.fid]]);
        });
        this.toolItems.enter = $enter;
    };

    DataFlowEditorPage.prototype.createPopupToolItem = function () {
        var _this = this;
        var $popup = $('<div class="brtc-va-editors-diagram-diagrameditorpage-function-tools brtc-va-editors-diagram-diagrameditorpage-function-tools-popup" title="Popup"></div>');
        this.$tools.append($popup);
        $popup.click(function (event) {
            var cid = _this.$tools.attr('cid');
            var figure = _this.graph.getCell(cid);
            _this.hideTools(true);

            var fnUnit = _this.getFnUnitById(figure.attributes.fid);
            var clonedFnUnit = $.extend(true, {}, fnUnit);
            var func = fnUnit.func;

            var anchorOffset = $(event.target).offset();
            var pos = {
                x: anchorOffset.left - 402 + 26,
                y: anchorOffset.top - 10 + 40
            };

            //원래는 propertiespanel에서 구현된 내용을 그대로 쓰는것으로 컨셉을 잡았으나...
            //일단 dialog로 해결...
            var TargetDialog;
            switch (func) {
                case "setValue":
                    TargetDialog = Brightics.VA.Core.Dialogs.SetValueSettingDialog;
                    break;
                case "import":
                    TargetDialog = Brightics.VA.Core.Dialogs.ImportDataSettingDialog;
                    break;
                case "export":
                    TargetDialog = Brightics.VA.Core.Dialogs.ExportDataSettingDialog;
                    break;
            }

            new TargetDialog(_this.$mainControl, {
                event: event,
                editor: _this.getEditor(),
                fnUnit: clonedFnUnit,
                param: clonedFnUnit.param,
                position: pos,
                title: 'Setting Configuration',
                close: function (dialogResult) {
                    if (dialogResult.OK && dialogResult.results) {
                        _this.createSetDialogFnUnitCommand(dialogResult.results.fnUnit, fnUnit);
                    }
                }
            });

        });
        this.toolItems.popup = $popup;
    };

    DataFlowEditorPage.prototype.createMultiSelectionToolbar = function () {
        var _this = this;

        this.$multiTools = this.$mainControl.find('.brtc-va-editors-diagram-diagrameditorpage-function-multiselected');
        this.$multiTools.append('' +
            '<div class="brtc-va-editors-diagram-diagrameditorpage-function-multiselected-toolbar">' +
            '   <div class="brtc-va-editors-diagram-diagrameditorpage-function-multiselected-tools brtc-va-editors-diagram-diagrameditorpage-function-multiselected-tools-remove" title="'+Brightics.locale.common.remove+'"></div>' +
            '   <div class="brtc-va-editors-diagram-diagrameditorpage-function-multiselected-tools brtc-va-editors-diagram-diagrameditorpage-function-multiselected-tools-add-library" title="'+Brightics.locale.common.addToTemplate+'"></div>' +
            '   <div class="brtc-va-editors-diagram-diagrameditorpage-function-multiselected-tools brtc-va-editors-diagram-diagrameditorpage-function-multiselected-tools-run" title="'+Brightics.locale.common.run+'"></div>' +
            '   <div class="brtc-va-editors-diagram-diagrameditorpage-function-multiselected-tools brtc-va-editors-diagram-diagrameditorpage-function-multiselected-tools-add-clipboard" title="'+Brightics.locale.common.addToClipboard+'"></div>' +
            '   <div class="brtc-va-editors-diagram-diagrameditorpage-function-multiselected-tools brtc-va-editors-diagram-diagrameditorpage-function-multiselected-tools-bind-functions" title="'+Brightics.locale.common.bindForOPT+'"></div>' +
            '</div>');

        var $remove = this.$multiTools.find('.brtc-va-editors-diagram-diagrameditorpage-function-multiselected-tools-remove');
        $remove.click(function () {
            var figures = _this.getSelectedFigures();
            _this.removeFnUnitFigures(figures);
            _this._unselectAllElements();
            _this._unselectAllLinkViews();
            _this._triggerFnUnitSelect();
            _this.hideSelectionBox();
            _this.hideTools(true);
        });

        var $addLibrary = this.$multiTools.find('.brtc-va-editors-diagram-diagrameditorpage-function-multiselected-tools-add-library');
        $addLibrary.click(function () {
            if (_this.getEditor().getEditorState('readonly-figure-selected')) return;
            var template = _this.makeTemplate();

            var editor = Brightics.VA.Core.Utils.WidgetUtils.getModelEditorRef(_this.$mainControl);
            editor.addToLibrary(template);
        });

        var $addClippboard = this.$multiTools.find('.brtc-va-editors-diagram-diagrameditorpage-function-multiselected-tools-add-clipboard');
        $addClippboard.click(function () {
            if (_this.getEditor().getEditorState('readonly-figure-selected')) return;
            var template = _this.makeTemplate();

            var editor = Brightics.VA.Core.Utils.WidgetUtils.getModelEditorRef(_this.$mainControl);
            editor.addToFunctionClipboard(template);
        });

        var $run = this.$multiTools.find('.brtc-va-editors-diagram-diagrameditorpage-function-multiselected-tools-run');
        $run.click(function () {
            var fnUnit, figure;
            var link;
            var original = _this.getModel();
            var virtual = $.extend(true, {}, original);
            virtual.functions = [];
            var figures = _this.getSelectedFigures();
            var fids = [];
            for (var f in figures) {
                figure = figures[f];
                fnUnit = $.extend(true, {}, _this.getFnUnitById(figure.attributes.fid));
                virtual.addFnUnit(fnUnit);
                fids.push(fnUnit.fid);
            }
            var removeLinks = [];
            for (var k in virtual.links) {
                link = virtual.links[k];
                if (fids.indexOf(link[SOURCE_FID]) < 0 || fids.indexOf(link[TARGET_FID]) < 0) {
                    removeLinks.push(link);
                }
            }
            for (const removeLink of removeLinks) {
                virtual.links.splice(virtual.links.indexOf(removeLink), 1);
            }

            var closeHandler = function (dialogResult) {
                if (dialogResult.OK) {
                    Brightics.VA.Core.DataQueryTemplate.removeCache(virtual.mid);
                    Studio.getJobExecutor().launchModel(virtual, dialogResult.args);
                }
            };

            if (Brightics.VA.SettingStorage.getValue('editor.variable.visible') === 'true' &&
                Object.keys(_this.getEditor().getModel().variables).length > 0) {
                new Brightics.VA.Core.Dialogs.RunDataDialog($(this), {
                    close: closeHandler,
                    analyticsModel: _this.getEditor().getModel()
                });
            } else {
                var defaultArgs = {};
                for (var key in _this.getEditor().getModel().variables) {
                    var gvDef = _this.getEditor().getModel().variables[key];
                    var temp;
                    if (_.isArray(gvDef.value) && gvDef.value.length === 1) {
                        temp = gvDef.value[0];
                    } else {
                        temp = gvDef.value;
                    }

                    if (!_.isUndefined(temp)) defaultArgs[key] = gvDef.value;
                }
                closeHandler({
                    OK: true,
                    args: defaultArgs
                });
            }
        });

        var $bindFunctionsButton = this.$multiTools.find('.brtc-va-editors-diagram-diagrameditorpage-function-multiselected-tools-bind-functions');
        $bindFunctionsButton.click(function () {
            var JointConverter = {
                convertFigures2Fids: function (figures) {
                    var fids = [];
                    for (var i = 0; i < figures.length; i++) {
                        fids.push(figures[i].attributes.fid);
                    }
                    return fids;
                }
            };
            var pid = _this.getEditor().getEditorInput().getProjectId();
            var mid = _this.getEditor().getEditorInput().getFileId();

            if (mid !== _this.getEditor().activeModel.mid) {
                return Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog(
                    "OPT models cannot be made in inner models."
                );
            }

            var figures = _this.getSelectedFigures();
            var fids = JointConverter.convertFigures2Fids(figures);
            var hash = fids.sort().join("_");

            var optModels = _this.getEditor().activeModel.optModels;
            for (var key in optModels) {
                if (optModels[key].hash === hash) {
                    return Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog(
                        "This OPT model already exists."
                    );
                }
            }

            var command = Brightics.OptModelManager.createNewOptModelCommand(pid, mid, fids);
            _this.fireCommand(command);

            return undefined;
        });
    };

    DataFlowEditorPage.prototype.createCue = function () {
        var _this = this;
        var closeHandler = function (dialogResult) {
            if (dialogResult.OK) {
                var figures = [];
                var fnUnit = _this.getModel().newFnUnit(dialogResult.func);
                var pos = dialogResult.position;
                fnUnit.display.diagram.position = _this.calcGuideLocation(pos.left / _this.options.scale, pos.top / _this.options.scale);
                var figure = _this.createFnUnitFigure(fnUnit);
                figures.push(figure);
                _this.graph.addCells(figures);

                var command = new Brightics.VA.Core.CompoundCommand(_this, {label: 'Create a Function'});
                var links = [];
                if (Brightics.VA.SettingStorage.getValue('editor.diagram.autoconnect') === 'true') links = _this.connectSmartly(figure);
                _this.graph.addCells(links);

                if (links.length > 0) {
                    command.add(_this.createNewFnUnitCommand(figure, fnUnit));
                    for (const link of links) {
                        command.add(_this.createConnectFnUnitCommand(link));
                    }
                } else {
                    command.add(_this.createNewFnUnitCommand(figure, fnUnit));
                }
                _this.fireCommand(command);
                _this.hideCue();

                _this._unselectAllElements();
                _this._selectElement(figure);
                _this.showSelectionBox();
                _this._triggerFnUnitSelect();
            }

            _this.switchFnUnitDialog = null;
        };

        if (!this.getFunctionsLength()) {
            this.$createCue.css({
                display: 'flex',
                left: '19.5px',
                top: '27px'
            })
        }

        this.$createCue.find('.brtc-va-editors-diagram-diagrameditorpage-function-cue-create-label-wrapper').mousedown(function (event) {
            _this.$createCue.attr('mousedown', 'true');
            var localPoint = _this.paper.snapToGrid({x: event.clientX, y: event.clientY});
            _this.$dragSelection.css({
                display: 'block',
                width: 0,
                height: 0
            });
            _this.$dragSelection.attr('start-x', localPoint.x * _this.options.scale);
            _this.$dragSelection.attr('start-y', localPoint.y * _this.options.scale);
        });

        this.$createCue.find('.brtc-va-editors-diagram-diagrameditorpage-function-cue-create-label-wrapper').mouseup(function (event) {
            if (Brightics.VA.SettingStorage.getValue('editor.closePanelOnClick') === 'true') {
                _this._unselectAllElements();
                _this.hideSelectionBox();
                _this._triggerFnUnitSelect();
            }
            if (Brightics.VA.SettingStorage.getValue('editor.function.add.doubleclick') === 'true') {
                return;
            }
            if (_this.$createCue.attr('mousedown') === 'false') return;

            _this.MAX_FUNC_COUNT = Brightics.VA.SettingStorage.getValue('editor.maxfuncnum');
            _this.MAX_FUNC_MESSAGE = 'You can only add up to ' + _this.MAX_FUNC_COUNT + '.';

            if (_this.getFunctionsLength() + 1 > _this.MAX_FUNC_COUNT) {
                Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog(_this.MAX_FUNC_MESSAGE);
            } else {
                _this.switchFnUnitDialog = new Brightics.VA.Core.Dialogs.SwitchFnUnitDialog($(event.target), {
                    modelType: _this.getModel().type,
                    close: closeHandler,
                    position: _this.$createCue.position()
                });
            }
        });

        this.$createCue.find('.brtc-va-editors-diagram-diagrameditorpage-function-cue-create-label-wrapper').dblclick(function (event) {
            if (Brightics.VA.SettingStorage.getValue('editor.function.add.doubleclick') !== 'true') return;

            if (_this.getFunctionsLength() + 1 > _this.MAX_FUNC_COUNT) {
                Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog(_this.MAX_FUNC_MESSAGE);
            } else {
                _this.switchFnUnitDialog = new Brightics.VA.Core.Dialogs.SwitchFnUnitDialog($(event.target), {
                    modelType: _this.getModel().type,
                    close: closeHandler,
                    position: _this.$createCue.position()
                });
            }
        });
    };

    DataFlowEditorPage.prototype._createMiniMapControl = function () {
        this.minimap = new Brightics.VA.Core.Editors.Diagram.MinimapBoat(this.$parent.parent('.brtc-va-editors-modeleditor-splitter'), {diagramEditorPage: this});
    };

    DataFlowEditorPage.prototype.createExpressionControl = function () {
        if (this.expression) this.expression.destroy();
        if (!this.options.editor.getActiveModel().isMainModel()) {
            this.expression = new Brightics.VA.Core.Editors.Diagram.ExpressionBoat(this.$parent.parent('.brtc-va-editors-modeleditor-splitter'),
                {
                    editor: this.options.editor,
                    resizable: false
                });
        }
    };

    DataFlowEditorPage.prototype.getFunctionsLength = function () {
        return this.getModel().functions.length;
    };

    DataFlowEditorPage.prototype.ensureCenter = function (figure) {
        var centerFigure = figure;
        if (!centerFigure) return;

        var panel = {
            width: this.$mainControl.width(),
            height: this.$mainControl.height(),
            x: this.$mainControl.scrollLeft(),
            y: this.$mainControl.scrollTop()
        };

        var pos = {
            x: centerFigure.attributes.position.x * this.options.scale,
            y: centerFigure.attributes.position.y * this.options.scale
        };

        var xPage = (pos.x / panel.width) | 0;
        var scrollLeft = (xPage * panel.width) + (pos.x % panel.width) - (panel.width / 2) + (Brightics.VA.Env.Diagram.FIGURE_WIDTH * this.options.scale / 2);

        var yPage = (pos.y / panel.height) | 0;
        var scrollTop = (yPage * panel.height) + (pos.y % panel.height) - (panel.height / 2) + (Brightics.VA.Env.Diagram.FIGURE_HEIGHT * this.options.scale / 2);

        this.$mainControl.animate({scrollLeft: scrollLeft, scrollTop: scrollTop}, 500);
    };

    DataFlowEditorPage.prototype.ensureVisible = function (figure) {
        if (!figure) return;

        var panel = {
            width: this.$mainControl.width(),
            heigth: this.$mainControl.height(),
            x: this.$mainControl.scrollLeft(),
            y: this.$mainControl.scrollTop()
        };
        var pos = {
            x: figure.attributes.position.x * this.options.scale,
            y: figure.attributes.position.y * this.options.scale
        };

        if (panel.x > pos.x) {
            this.$mainControl.scrollLeft(pos.x - 10);
        }
        if (panel.y > pos.y) {
            this.$mainControl.scrollTop(pos.y - 10);
        }
        if (panel.x + panel.width < pos.x + 109) {
            this.$mainControl.scrollLeft(pos.x - panel.width + 110);
        }
        if (panel.y + panel.heigth < pos.y + 44) {
            this.$mainControl.scrollTop(panel.y + pos.y - panel.heigth + 45);
        }
    };

    DataFlowEditorPage.prototype.changeScale = function (scale) {
        if (this.options.scale === scale) return

        this.options.scale = scale;
        if (this.options.scale < 0.6) {
            this.controlSmallPaper();
            return;
        }

        if (this.options.scale === 0.8) {
            this.$paperElement.removeClass('brtc-va-editors-diagram-diagrameditorpage-paper-scale-small');
            this.$paperElement.addClass('brtc-va-editors-diagram-diagrameditorpage-paper-scale-normal');
            this.paper.scale(this.options.scale);
        } else if (this.options.scale === 0.6) {
            this.$paperElement.removeClass('brtc-va-editors-diagram-diagrameditorpage-paper-scale-normal');
            this.$paperElement.addClass('brtc-va-editors-diagram-diagrameditorpage-paper-scale-small');
            this.paper.scale(this.options.scale);
        } else if (this.options.scale === 1.0) {
            this.$paperElement.removeClass('brtc-va-editors-diagram-diagrameditorpage-paper-scale-small');
            this.$paperElement.removeClass('brtc-va-editors-diagram-diagrameditorpage-paper-scale-normal');
            this.paper.scale(this.options.scale);
        } else {
            //select same scale twice.
            return;
        }

        this.showSelectionBox();
        var selected = this.getSelectedFigures();
        if (selected.length > 0) {
            this.ensureCenter(selected[0]);
        }

        this.updateMiniMapWindow();
        Brightics.OptModelManager.renderOptModels();
    };

    DataFlowEditorPage.prototype.controlSmallPaper = function () {
        this._unselectAllElements()
        this._unselectAllLinkViews()
        this._triggerFnUnitSelect()
        this.hideSelectionBox()
        this.hideTools()
        this.hideGuideBox()
        this.hideGuideMessage()
        this.hideCue()
        this.$paperElement.removeClass('brtc-va-editors-diagram-diagrameditorpage-paper-scale-normal');
        this.$paperElement.addClass('brtc-va-editors-diagram-diagrameditorpage-paper-scale-small');
        this.paper.scale(this.options.scale)
        this.updateMiniMapWindow()
        Brightics.OptModelManager.renderOptModels()
    };

    DataFlowEditorPage.prototype.changeTooltipEnabled = function (enabled) {
        this.getEditor().setEditorState(TOOLTIP_ENABLED, enabled);
    };

    DataFlowEditorPage.prototype.makeDroppable = function () {
        var _this = this;

        /* 다이얼로그의 드래그 이동을 위한 상위 element */
        _this.$mainControl.closest('.brtc-va-editor').droppable({
            accept: '.ui-dialog',
            drop: function (event, ui) {
                /* draggable의 이동시에 intersect되는 모든 droppables의 isover상태가 true가 되기 때문에, drop이 끝난 후 isover를 false로 맞춰주어야 함. */
                $.ui.ddmanager.droppables.default.forEach(d => {
                    d.isover = false;
                });
            }
        });

        _this.$mainControl.droppable({
            accept: '.brtc-va-studio-dm-draggable',
            activate: function (event, ui) {
                _this.dropping = true;
                _this.fitToContent();
            },
            deactivate: function (event, ui) {
                _this.dropping = false;
                if (ui.helper.css('visibility') === 'visible') {
                    _this.fitToContent();
                }
            },
            over: function (event, ui) {
                _this.hideSelectionBox();
                var figure, x, y;
                ui.helper.css('visibility', 'hidden');
                ui.helper.bind('feedback', function (event, eventData) {
                    var pos = _this.paper.clientToLocalPoint({x: eventData.clientX, y: eventData.clientY});
                    for (var i in _this.dropContents.functions) {
                        figure = _this.dropFigures[i];
                        x = pos.x - 50 + _this.dropContents.functions[i].display.diagram.position.x;
                        y = pos.y - 30 + _this.dropContents.functions[i].display.diagram.position.y;
                        figure.position(x, y);
                    }
                    _this.showGuideBox(_this.dropFigures[0]);
                });

                var templateContents = Brightics.VA.Core.Utils.WidgetUtils.getData(ui.helper, 'template');
                var dragSource = Brightics.VA.Core.Utils.WidgetUtils.getData(ui.helper, 'source');
                var pos = _this.paper.clientToLocalPoint({x: event.clientX, y: event.clientY});

                if (dragSource instanceof Brightics.VA.Core.Views.Palette) {
                    _this.dropContents = {
                        functions: [],
                        links: [],
                        isPalette: true
                    };
                    _this.dropContents.functions.push(_this.getModel().newFnUnit(templateContents.functions[0].func));
                } else {
                    _this.dropContents = templateContents;
                }

                _this.dropFigures = [];
                for (let i in _this.dropContents.functions) {
                    figure = _this.createFnUnitFigure(_this.dropContents.functions[i]);
                    figure.attributes.dummy = true;
                    _this.dropFigures.push(figure);
                }
                for (let i in _this.dropContents.functions) {
                    figure = _this.dropFigures[i];
                    x = pos.x - 50 + _this.dropContents.functions[i].display.diagram.position.x;
                    y = pos.y - 30 + _this.dropContents.functions[i].display.diagram.position.y;
                    figure.position(x, y);
                }

                var tempFigure = _.zipObject(_this.dropFigures.map((obj) => [obj.attributes.fid, obj]));
                _this.dropLinks = [];
                for (let i in _this.dropContents.links) {
                    let linkUnit = _this.dropContents.links[i];
                    let sFid = linkUnit[SOURCE_FID];
                    let tFid = linkUnit[TARGET_FID];

                    var linkFigure = _this.createLinkFigure(linkUnit, tempFigure[sFid], tempFigure[tFid]);
                    if (linkFigure) {
                        _this.dropLinks.push(linkFigure);
                    }
                }

                var cells = _this.dropFigures.concat(_this.dropLinks);
                _this.graph.addCells(cells);
            },
            out: function (event, ui) {
                ui.helper.css('visibility', 'visible');
                ui.helper.unbind('feedback');
                for (var i in _this.dropFigures) {
                    _this.dropFigures[i].remove();
                }
                _this.dropContents = null;
                _this.dropFigures = [];
                _this.dropLinks = [];

                _this.hideGuideBox();
                _this.hideGuideMessage();
                _this.hideTools(true);
                _this.showSelectionBox();
                _this._triggerMouseLeave();
            },
            drop: function (event, ui) {
                var i, links = [];
                _this.hideGuideBox();

                var figures = _this.dropFigures;
                var message = Object.values(_this.validateTranslate(figures))[0];
                if (message) {
                    _this.hideGuideMessage();
                    _this.notification('warning', message);
                    for (i in _this.dropFigures) {
                        _this.dropFigures[i].remove();
                    }
                } else if (_this.getFunctionsLength() + _this.dropFigures.length > _this.MAX_FUNC_COUNT) {
                    _this.hideGuideMessage();
                    for (i in _this.dropFigures) {
                        _this.dropFigures[i].remove();
                    }
                    Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog(_this.MAX_FUNC_MESSAGE);
                } else if (_this.dropFigures.length > 0) {
                    var isMaintainIntable = false;
                    for (i in _this.dropFigures) {
                        var pos = _this.calcGuidePosition(_this.dropFigures[i]);
                        _this.dropFigures[i].position(pos.x, pos.y);
                        _this.dropFigures[i].attributes.dummy = false;
                    }
                    if (_this.dropFigures.length === 1 && Brightics.VA.SettingStorage.getValue('editor.diagram.autoconnect') === 'true') {
                        links = _this.connectSmartly(_this.dropFigures[i]);
                    } else {
                        isMaintainIntable = true;
                    }
                    _this.graph.addCells(links); // ???
                    _this.showTools(_this.dropFigures[0]);

                    var commands = new Brightics.VA.Core.CompoundCommand(_this, {label: 'Create a Function'});

                    for (i in _this.dropFigures) {
                        if (isMaintainIntable !== true) {
                            FnUnitUtils.clearInData(_this.dropContents.functions[i]);
                        }
                        commands.add(_this.createNewFnUnitCommand(_this.dropFigures[i],
                            _this.dropContents.functions[i],
                            _this.dropContents.isPalette ? undefined : _this.dropContents
                        ));
                        commands.add(_this.createSetFnUnitPositionCommand(_this.dropFigures[i], _this.dropFigures[i].attributes.position.x, _this.dropFigures[i].attributes.position.y));
                    }

                    for (i in _this.dropLinks) {
                        commands.add(_this.createConnectFnUnitCommand(_this.dropLinks[i], isMaintainIntable));
                    }

                    for (const link of links) {
                        commands.add(_this.createConnectFnUnitCommand(link));
                    }
                    _this.fireCommand(commands);
                    _this._rerouteLink();

                    _this._unselectAllElements();
                    _this._selectElements(_this.dropFigures);
                    _this.showSelectionBox();
                    _this._triggerFnUnitSelect();
                }

                _this.dropContents = null;
                _this.dropFigures = [];
                _this.dropLinks = [];

                _this.showSelectionBox();
            }
        });
    };

    DataFlowEditorPage.prototype._rerouteLink = function () {
        var _this = this;
        if (_this.rerouteLinkTaskTimeOut) {
            clearTimeout(_this.rerouteLinkTaskTimeOut);
        }
        var rerouteLinkTask = function () {
            var links = _this.graph.getLinks();
            for (var i in links) {
                _this.paper.findViewByModel(links[i]).update();
            }
        };

        _this.rerouteLinkTaskTimeOut = setTimeout(rerouteLinkTask, 1000);
    };

    DataFlowEditorPage.prototype.configureSelectionBounds = function () {
        this.$multiTools.toggleClass('single-selected', this.getSelectedFigures().length === 1);
    };

    DataFlowEditorPage.prototype.showSelectionBounds = function () {
        var selectedRect;
        var figures = this.getSelectedFigures();
        var readOnlyFigureSelected = false;
        if (figures.length > 0) {
            for (var i in figures) {
                readOnlyFigureSelected =
                    readOnlyFigureSelected || this.isReadOnlyFigure(figures[i]);
                if (selectedRect) {
                    selectedRect.top = Math.min(selectedRect.top, figures[i].attributes.position.y);
                    selectedRect.left = Math.min(selectedRect.left, figures[i].attributes.position.x);
                    selectedRect.bottom = Math.max(selectedRect.bottom, figures[i].attributes.position.y + Brightics.VA.Env.Diagram.FIGURE_HEIGHT);
                    selectedRect.right = Math.max(selectedRect.right, figures[i].attributes.position.x + Brightics.VA.Env.Diagram.FIGURE_WIDTH);
                } else {
                    selectedRect = {
                        top: figures[i].attributes.position.y,
                        left: figures[i].attributes.position.x,
                        bottom: figures[i].attributes.position.y + Brightics.VA.Env.Diagram.FIGURE_HEIGHT,
                        right: figures[i].attributes.position.x + Brightics.VA.Env.Diagram.FIGURE_WIDTH
                    };
                }
            }

            var top = (selectedRect.top * this.options.scale);
            var left = (selectedRect.left * this.options.scale) + 3;
            var width = ((selectedRect.right - selectedRect.left) * this.options.scale) - 5;
            var height = ((selectedRect.bottom - selectedRect.top) * this.options.scale) + 7;

            this.$selectedBounds.css({display: 'block', top: top, left: left, width: width, height: height});
        } else {
            this.$selectedBounds.css({
                display: 'none'
            });
        }
        this.getEditor().setEditorState('readonly-figure-selected', readOnlyFigureSelected);
        this.$multiTools.toggleClass('readonly-figure-selected', readOnlyFigureSelected);
    };

    DataFlowEditorPage.prototype.hideCue = function () {
        this.$createCue.css({display: 'none'});
    }

    DataFlowEditorPage.prototype.hideSelectionBounds = function () {
        if (this.$selectedBounds) this.$selectedBounds.hide();
    };

    DataFlowEditorPage.prototype.showSelectionBox = function () {
        if (this.options.scale < 0.6) return
        this.configureSelectionBounds();
        this.showSelectionBounds();
    };

    DataFlowEditorPage.prototype.updateSelectionBox = function (figure) {
    };

    DataFlowEditorPage.prototype.hideSelectionBox = function (figure) {
        this.hideSelectionBounds();
    };

    DataFlowEditorPage.prototype._triggerClickOrDoubleClickEvent = function (fnUnitIds) {
    };

    DataFlowEditorPage.prototype.showErrorBox = function (figures) {
        for (var i in figures) {
            if (figures[i] instanceof Brightics.VA.Implementation.DataFlow.Editors.Diagram.Shapes.FnUnitFigure) {
                figures[i].showError();
            }
        }
    };

    DataFlowEditorPage.prototype.updateErrorBox = function (figure) {
    };

    DataFlowEditorPage.prototype.hideErrorBox = function () {
        var figures = this.graph.getElements();
        for (var i in figures) {
            figures[i].hideError();
        }
    };

    DataFlowEditorPage.prototype.showValidationToolTip = function (figure) {
        this.$validationTooltip.empty();
        for (var i in this.problems) {
            if (this.problems[i].fid === figure.attributes.fid) {
                var $problem = $('<div class="brtc-va-editors-diagram-diagrameditorpage-validation-problem">' +
                    '<i class="fa fa-exclamation-triangle" aria-hidden="true"></i> ' + this.problems[i].message +
                    '</div>');
                this.$validationTooltip.append($problem);
            }
        }
        this.$validationTooltip.css('display', 'block');
    };

    DataFlowEditorPage.prototype.hideValidationToolTip = function () {
        if (this.$validationTooltip) this.$validationTooltip.css('display', 'none');
    };

    DataFlowEditorPage.prototype.validateTranslate = function (figures) {
        this.translateProblems = {};
        for (var i in figures) {
            var figure = figures[i];
            var message;
            if (this.checkOverPosition(figure) === false) message = 'Can not move over other function.';
            else if (this.checkOutRangePosition(figure) === false) message = 'Can not move out of range.';
            if (message) {
                this.translateProblems[figure.cid] = message;
            }
        }
        return this.translateProblems;
    };

    DataFlowEditorPage.prototype.validateConnect = function (links) {
        for (var i in links) {
            var link = links[i];
            if (this.checkConnectedLink(link) === false) return 'No connection could be made.';
            else if (this.checkLoopLink(link) === false) return 'No connection could be made because connection loop.';
            else if (this.checkAlreadyExistLink(link) === false) return 'No connection could be made because connection already exists.';

            // link reconnection undo 버그 있어서 주석 처리
            // if (this.checkAlreadyExistLinkByTableId(link) === false) return 'No connection could be made because connection already exists.';
        }
        return undefined;
    };

    DataFlowEditorPage.prototype.notification = function (template, message) {
        var editor = Brightics.VA.Core.Utils.WidgetUtils.getModelEditorRef(this.$mainControl);
        editor.notification(template, message);
    };

    DataFlowEditorPage.prototype.createSetDialogFnUnitCommand = function (newFnUnit, oldFnUnit) {
        var commands = new Brightics.VA.Core.CompoundCommand(this, {label: 'Change a Function'});

        var paramCommand = new Brightics.VA.Core.Editors.Diagram.Commands.SetDialogFnUnitCommand(this, {
            fnUnit: oldFnUnit,
            ref: {param: newFnUnit.param}
        });

        var renameCommand = new Brightics.VA.Core.Editors.Diagram.Commands.RenameFnUnitCommand(this, {
            fid: newFnUnit.fid,
            name: newFnUnit.display.label,
            description: newFnUnit.display.description
        });

        commands.add(paramCommand);
        commands.add(renameCommand);

        var modelEditorRef = Brightics.VA.Core.Utils.WidgetUtils.getModelEditorRef(this.$mainControl);
        if (modelEditorRef) {
            modelEditorRef.getCommandManager().execute(commands);
        }
    };

    DataFlowEditorPage.prototype.createConfigurationCommand = function (param, fnUnit) {
        var commandOption = {
            fnUnit: fnUnit,
            ref: {param: param}
        };

        var command = new Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitParameterValueCommand(this, commandOption);
        var modelEditorRef = Brightics.VA.Core.Utils.WidgetUtils.getModelEditorRef(this.$mainControl);
        if (modelEditorRef) {
            modelEditorRef.getCommandManager().execute(command);
        }
    };

    DataFlowEditorPage.prototype.setConnectToolItemVisible = function (visibled) {
        var connectTool = this.$tools.find('.brtc-va-editors-diagram-diagrameditorpage-function-tools-connect');
        if (!visibled) {
            connectTool.css('display', 'none');
        } else {
            connectTool.css('display', 'block');
        }
    };

    DataFlowEditorPage.prototype._findConnectableFigures = function (fromCell) {
        var connectableFigures = [];
        var _this = this;

        var connectableFids = this._getConnectableFids(fromCell.attributes.fid);

        if (fromCell.attributes.connectableFunctions) {
            connectableFids = connectableFids.filter(function (fid) {
                var fromFnUnit = _this.getFnUnitById(fid);
                return fromCell.attributes.connectableFunctions.indexOf(fromFnUnit.func) >= 0;
            });
        }

        var figure;

        var connectedCellCids = [];

        var _link = this.graph.getConnectedLinks(fromCell);

        for (let i in _link) {
            connectedCellCids.push(_link[i].getTargetElement().cid);
        }

        for (const connectableFid of connectableFids) {
            figure = this.getFigureByFnUnitId(connectableFid);
            if (fromCell.attributes.connectableFunctions) {
                if (connectedCellCids.indexOf(figure.cid) < 0) {
                    connectableFigures.push(figure);
                }
            } else {
                if (figure.attributes.inputtable && connectedCellCids.indexOf(figure.cid) < 0) {
                    connectableFigures.push(figure);
                }
            }
        }

        return connectableFigures;
    };

    DataFlowEditorPage.prototype._setBehaviorModeToDefault = function () {
        if (this.behaviorMode === BEHAVIOR_DEFAULT) return;

        this.behaviorMode = BEHAVIOR_DEFAULT;
        var figures = this.graph.getElements();
        for (var i in figures) {
            figures[i].setOffShade();
        }
        this._connectableFigures = [];
        this._unhighlightAll();
    };

    DataFlowEditorPage.prototype._setBehaviorModeToLink = function () {
        if (this.behaviorMode === BEHAVIOR_LINK) return;

        this.behaviorMode = BEHAVIOR_LINK;
        var figures = this.graph.getElements();
        for (var i in figures) {
            if (figures[i] instanceof Brightics.VA.Implementation.DataFlow.Editors.Diagram.Shapes.FnUnitFigure) {
                if (!this._isConnectableCell(figures[i])) {
                    figures[i].setOnShade();
                }
            }
        }
    };

    DataFlowEditorPage.prototype._isConnectableCell = function (figure) {
        var isConnectable = false;
        for (var i in this._connectableFigures) {
            if (this._connectableFigures[i] === figure) {
                isConnectable = true;
                break;
            }
        }
        return isConnectable;
    };

    DataFlowEditorPage.prototype._isConnectableFnUnit = function (fromCell, targetCell) {

        var isConnectable = false;
        var connectableFunctions = fromCell.attributes.connectableFunctions;
        var acceptableFunctions = targetCell.attributes.acceptableFunctions;

        if (connectableFunctions) {
            var targetFnUnit = this.getFnUnitById(targetCell.attributes.fid);
            for (var i = 0; i < connectableFunctions.length; i++) {
                if (connectableFunctions[i] === targetFnUnit.func) {
                    isConnectable = true;
                    break;
                }
            }
        } else if (acceptableFunctions) {
            var fromFnUnit = this.getFnUnitById(fromCell.attributes.fid);
            isConnectable = _.indexOf(acceptableFunctions, fromFnUnit.func) >= 0;
        } else if (targetCell.attributes.inputtable) {
            isConnectable = true;
        }

        return isConnectable;
    };

    DataFlowEditorPage.prototype._unhighlightAll = function () {
        for (var i = 0; i < this._highlightedViews.length; i++) {
            this._highlightedViews[i].unhighlight();
        }
        this._highlightedViews = [];
    };

    DataFlowEditorPage.prototype._collectInnerModels = function (mainModel, model) {
        return _.reduce(
            _.map(Brightics.VA.Core.Utils.NestedFlowUtils.getAllSubModelsFromModel(
                mainModel,
                model
            ), function (innerModel) {
                var ret = {};
                ret[innerModel.mid] = innerModel;
                return ret;
            }), _.merge, {});
    };

    DataFlowEditorPage.prototype.makeTemplate = function () {
        var template = {
            functions: [],
            links: [],
            innerModels: {},
            type: 'data'
        };

        var mainModel = this.getEditor().getModel();
        var figures = this.getSelectedFigures();
        var i, j, minX = Number.MAX_VALUE, minY = Number.MAX_VALUE, kids = [];
        for (i in figures) {
            var fnUnit = this.getFnUnitById(figures[i].attributes.fid);
            minX = Math.min(minX, fnUnit.display.diagram.position.x);
            minY = Math.min(minY, fnUnit.display.diagram.position.y);
            template.functions.push($.extend(true, {}, fnUnit));
            var connection = this.graph.getConnectedLinks(figures[i]);
            for (j in connection) {
                if (kids.indexOf(connection[j].attributes.kid) < 0) {
                    kids.push(connection[j].attributes.kid);
                }
            }
        }
        for (i in template.functions) {
            template.functions[i].display.diagram.position.x -= minX;
            template.functions[i].display.diagram.position.y -= minY;
        }
        for (const kid of kids) {
            var linkUnit = this.getLinkUnitById(kid);
            var findCount = 0;
            for (j in template.functions) {
                if (template.functions[j].fid === linkUnit[SOURCE_FID]) findCount++;
                if (template.functions[j].fid === linkUnit[TARGET_FID]) findCount++;
                if (findCount == 2) break;
            }
            if (findCount == 2) {
                template.links.push($.extend(true, {}, linkUnit));
            }
        }

        template.functions.sort(function (a, b) {
            if (a.display.diagram.position.x === b.display.diagram.position.x) {
                return a.display.diagram.position.y - b.display.diagram.position.y;
            } else {
                return a.display.diagram.position.x - b.display.diagram.position.x;
            }
        });

        template.innerModels = this._collectInnerModels(mainModel, template);

        var isProcessFn = Brightics.VA.Core.Utils.NestedFlowUtils.isProcessFunction;
        var isNotProcessFn = _.negate(isProcessFn);

        template = Brightics.VA.Core.Utils.ModelUtils.extendModel(template, true);

        var validTid = _.flatten(
            _.map(
                _.filter(template.functions, isNotProcessFn),
                (fn) => FnUnitUtils.getOutData(fn)
            )
        );

        (function removeInvalidTid(model, validTid) {
            var hash = validTid.reduce(function (acc, tid) {
                return _.merge(acc, _.set({}, tid, true));
            }, {});

            var kv = function (k, v) {
                return _.set({}, k, v);
            };
            var isValidTid = _.partial(_.has, hash);
            var filterTableByValidTid = _.partial(_.filter, _, isValidTid);
            var allOutData = [];

            model.functions = model.functions.map(function (fn) {
                if ((isNotProcessFn(fn) || !FnUnitUtils.isThirdPartyFunction(fn)) && fn[IN_DATA]) {
                    var removedIndex = _.reject(_.map(fn[IN_DATA], function (tid, idx) {
                        return isValidTid(tid) ? -1 : idx;
                    }, _.partial(_.isEqual, -1)));

                    var removeByIndex = function (tids) {
                        return _.reject(tids, function (tid, idx) {
                            return _.indexOf(removedIndex, idx) >= 0;
                        });
                    };
                    var subModels =
                        _.map(Brightics.VA.Core.Utils.NestedFlowUtils.getSubModels(model, fn), IN_DATA);

                    _.forEach(subModels, function (subModel) {
                        subModel[IN_DATA] = removeByIndex(subModel[IN_DATA]);
                    });
                    fn[IN_DATA] = removeByIndex(fn[IN_DATA]);
                } else if (isProcessFn(fn) || FnUnitUtils.isThirdPartyFunction(fn)) {
                    var _fn = _.clone(fn);
                    var int = _.clone(filterTableByValidTid(fn[IN_DATA]));
                    var outt = _.clone(filterTableByValidTid(fn[OUT_DATA]));
                    return _.merge({}, _.omit(_fn, [IN_DATA, OUT_DATA]),
                        kv(IN_DATA, int),
                        kv(OUT_DATA, outt)
                    );
                }

                allOutData = _.union(allOutData, FnUnitUtils.getOutData(fn));

                return fn;
            });

            model.functions = model.functions.map(function (fn) {
                if ((isNotProcessFn(fn) || !FnUnitUtils.isThirdPartyFunction(fn)) && FnUnitUtils.hasInput(fn) && FnUnitUtils.hasMeta(fn)) {
                    var inData = FnUnitUtils.getInData(fn);
                    for (var i in inData) {
                        var tid = inData[i];
                        var type = FnUnitUtils.getTypeByTableId(fn, tid);

                        if (_.indexOf(allOutData, tid) < 0) {
                            FnUnitUtils.removeInData(fn, type, tid);
                        }
                    }
                }
                return fn;
            });

            return model;
        }(template, validTid));
        return template;
    };

    DataFlowEditorPage.prototype.createNewFnUnitCommand = function (figure, fnUnit, dummyMainModel) {
        figure.attributes.fid = fnUnit.fid;
        var _this = this;
        var commands = [];

        if (fnUnit[FUNCTION_NAME] !== 'DataViewer' && fnUnit.skip) {
            fnUnit.skip = false;
        }

        commands.push(new Brightics.VA.Core.Editors.Diagram.Commands.NewFnUnitCommand(this, {fnUnit: fnUnit}));

        var options = (function (fnUnit) {
            var ret = [];
            if (fnUnit.func === 'if') {
                ret.push({mid: fnUnit.param.if.mid, type: fnUnit.func, conditionType: 'if'});
                ret = ret.concat(_.map(fnUnit.param.elseif, function (elseif) {
                    return {
                        mid: elseif.mid,
                        type: fnUnit.func,
                        conditionType: 'elseif'
                    };
                }));
                ret.push({
                    mid: fnUnit.param.else.mid,
                    type: fnUnit.func,
                    conditionType: 'else'
                });
            } else if (fnUnit.func === 'forLoop' ||
                fnUnit.func === 'whileLoop') {
                ret.push({
                    mid: fnUnit.param.mid,
                    type: fnUnit.func
                });
            }
            return ret;
        }(fnUnit));

        commands = commands.concat(_.flatten(_.map(options, function (opt) {
            var opts = (function () {
                if (dummyMainModel) {
                    var model = dummyMainModel.getInnerModel(opt.mid);
                    var models = Brightics.VA.Core.Utils.NestedFlowUtils
                        .getAllSubModelsFromModel(dummyMainModel, model).concat(model);
                    model[IN_DATA] = [];

                    return _.map(models, function (m) {
                        return {
                            contents: m,
                            mid: m.mid
                        };
                    });
                } else {
                    return [opt];
                }
            }());
            return _.map(opts, function (o) {
                return new Brightics.VA.Core.Editors.Diagram.Commands
                    .NewActivityCommand(_this, o);
            });
        })));

        return commands;
    };

    DataFlowEditorPage.prototype.getActivityModels = function (fnUnit) {
        var models = Brightics.VA.Core.Utils.NestedFlowUtils
            .getSubModels(this.getEditor().getModel(), fnUnit);

        return _.map(models, function (model) {
            return model.mid;
        });
    };

    DataFlowEditorPage.prototype.createRemoveFnUnitCommand = function (figure) {
        var compoundCommand = new Brightics.VA.Core.CompoundCommand(this);

        var fnUnit = this.getFnUnitById(figure.attributes.fid);
        var targetModels = this.getActivityModels(fnUnit);

        _.map(targetModels, function (mid) {
            compoundCommand.add(new Brightics.VA.Core.Editors.Diagram.Commands.RemoveActivityCommand(this, {
                mid: mid
            }));
        }.bind(this));

        compoundCommand.add(new Brightics.VA.Core.Editors.Diagram.Commands.RemoveFnUnitCommand(this, {
            fid: figure.attributes.fid
        }));

        return compoundCommand;
    };

    DataFlowEditorPage.prototype.createSetFnUnitPositionCommand = function (figure, x, y) {
        return new Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitPositionCommand(this, {
            fid: figure.attributes.fid,
            position: {x: x, y: y}
        });
    };

    DataFlowEditorPage.prototype.createShiftLeftCommand = function (figure) {
        return new Brightics.VA.Core.Editors.Diagram.Commands.ShiftLeftCommand(this, {
            fid: figure.attributes.fid
        });
    };

    DataFlowEditorPage.prototype.createShiftRightCommand = function (figure) {
        return new Brightics.VA.Core.Editors.Diagram.Commands.ShiftRightCommand(this, {
            fid: figure.attributes.fid
        });
    };

    DataFlowEditorPage.prototype.createSwitchFnUnitCommand = function (figure, fnUnit, prvFnUnit) {
        return new Brightics.VA.Core.Editors.Diagram.Commands.SwitchFnUnitCommand(this, {
            modelType: this.getModel().type,
            fid: figure.attributes.fid,
            fnUnit: fnUnit,
            prvFnUnit: prvFnUnit
        });
    };

    DataFlowEditorPage.prototype.createConnectFnUnitCommand = function (link, isMaintainIntable) {
        var commands = new Brightics.VA.Core.CompoundCommand(this, {
            label: 'Connect a Function'
        });

        var connectFnUnit = {
            kid: link.prop('kid'),
            'sourceFid': link.prop('sourceFid'),
            'targetFid': link.prop('targetFid')
        };
        if (isMaintainIntable === true) {
            connectFnUnit.isMaintainIntable = isMaintainIntable;
        }

        commands.add(new Brightics.VA.Core.Editors.Diagram.Commands.ConnectFnUnitCommand(this, connectFnUnit));
        connectFnUnit = {
            kid: link.prop('kid'),
            'sourceFid': link.prop('sourceFid'),
            'targetFid': link.prop('targetFid')
        };
        if (isMaintainIntable === true) {
            connectFnUnit.isMaintainIntable = isMaintainIntable;
        }
        return commands;
    };

    DataFlowEditorPage.prototype.createDisconnectFnUnitCommand = function (link) {
        return new Brightics.VA.Core.Editors.Diagram.Commands.DisconnectFnUnitCommand(this, {
            kid: link.prop('kid'),
            'sourceFid': link.prop('sourceFid'),
            'targetFid': link.prop('targetFid')
        });
    };

    DataFlowEditorPage.prototype.createReconnectFnUnitCommand = function (link) {
        return new Brightics.VA.Core.Editors.Diagram.Commands.ReconnectFnUnitCommand(this, {
            kid: link.prop('kid'),
            'sourceFid': link.prop('sourceFid'),
            'targetFid': link.prop('targetFid')
        });
    };

    DataFlowEditorPage.prototype.fireCommand = function (command) {
        if (command.constructor === Brightics.VA.Core.CompoundCommand) {
            if (command.commandList.length === 0) {
                return false;
            }
        }

        var editor = Brightics.VA.Core.Utils.WidgetUtils.getModelEditorRef(this.$mainControl);
        return editor.getCommandManager().execute(command);
    };

    DataFlowEditorPage.prototype.registerDebugListener = function () {
        var _this = this;
        this.debugListener = function (event, eventData) {
            var selected = _this.$mainControl.closest('.brtc-va-editor-wrapper').hasClass('selected');
            if (!selected) return;

            if (eventData.mid === _this.getModel().mid) {
                if (eventData.eventType === 'BEGIN-PROCESS'
                    && eventData.launchOptions.mode !== 'unit') {
                    _this._unselectAllElements();
                    _this.hideSelectionBox();
                    _this._triggerFnUnitSelect();
                } else if (eventData.eventType === 'BEGIN-UNIT') {
                    _this.getFigureByFnUnitId(eventData.fid);
                } else if (eventData.eventType === 'END-UNIT') {
                    _this.renderCompletedFnUnit(eventData);
                }
            }
        };

        Studio.getInstance().addDebugListener(this.debugListener);
    };

    DataFlowEditorPage.prototype.registerCommandEventListener = function () {
        var _this = this;
        var modelEditorRef = Brightics.VA.Core.Utils.WidgetUtils.getModelEditorRef(this.$mainControl);

        modelEditorRef.addCommandListener(this.onCommand.bind(_this));
    };

    DataFlowEditorPage.prototype.onCommand = function (command) {
        if (this.behaviorMode === BEHAVIOR_LINK) {
            this._setBehaviorModeToDefault();
        } else {
            this._unselectAllLinkViews();
        }
        if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.AppendNewFnUnitCommand) this.onAppendNewFnUnitCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.PrependNewFnUnitCommand) this.onPrependNewFnUnitCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.NewFnUnitCommand) this.onNewFnUnitCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.RemoveFnUnitCommand) this.onRemoveFnUnitCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.ConnectFnUnitCommand) this.onConnectFnUnitCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.DisconnectFnUnitCommand) this.onDisconnectFnUnitCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.ReconnectFnUnitCommand) this.onReconnectFnUnitCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitCommand) this.onSetFnUnitCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitParameterValueCommand) this.onSetFnUnitCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.ChangeIntableCommand) this.onSetFnUnitCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.ChangeInputsCommand) this.onSetFnUnitCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.AddFnUnitParameterCommand) this.onSetFnUnitCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.RemoveFnUnitParameterCommand) this.onSetFnUnitCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.ReplaceFnUnitParamCommand) this.onSetFnUnitCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitPositionCommand) this.onSetFnUnitPositionCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.ShiftLeftCommand) this.onShiftCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.ShiftRightCommand) this.onShiftCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.RenameFnUnitCommand) this.onRenameFnUnitCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.SetDialogFnUnitCommand) this.onSetDialogFnUnitCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.NewOptModelCommand) this.onNewOptModelCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.SetOptModelCommand) this.onSetOptModelCommand(command);
        else if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.RemoveOptModelCommand) this.onRemoveOptModelCommand(command);
        else if (command instanceof Brightics.VA.Core.CompoundCommand) this.onCompoundCommand(command);

        this.hideGuideMessage();
    };

    DataFlowEditorPage.prototype.onCompoundCommand = function (command) {
        var i;
        if (command.event.type === 'REDO' || command.event.type === 'EXECUTE') {
            for (i in command.commandList) {
                this.onCommand(command.commandList[i]);
            }
        } else if (command.event.type === 'UNDO') {
            for (i = command.commandList.length - 1; i > -1; i--) {
                this.onCommand(command.commandList[i]);
            }
        }
    };

    DataFlowEditorPage.prototype.onAppendNewFnUnitCommand = function (command) {
        this.onCompoundCommand(command);

        if (command.event.type === 'EXECUTE') {
            var figure = this.getFigureByFnUnitId(command.options.fnUnit.fid);
            this._selectElement(figure);
            this.showSelectionBox();
            this._triggerFnUnitSelect();
        }
    };

    DataFlowEditorPage.prototype.onPrependNewFnUnitCommand = function (command) {
        this.onCompoundCommand(command);

        if (command.event.type === 'EXECUTE') {
            var figure = this.getFigureByFnUnitId(command.options.fnUnit.fid);
            this._selectElement(figure);
            this.showSelectionBox();
            this._triggerFnUnitSelect();
        }
    };

    DataFlowEditorPage.prototype.onNewFnUnitCommand = function (command) {
        var figure, fnUnit;
        if (command.event.type === 'REDO' ||
            command.event.type === 'EXECUTE' && command.event.source !== this) {
            this._unselectAllElements();
            this._unselectAllLinkViews();

            fnUnit = command.options.fnUnit;
            figure = this.createFnUnitFigure(fnUnit);
            this.graph.addCells([figure]);
            this.ensureVisible(figure);

            this._selectElement(figure);
            this.showSelectionBox();
            this.showTools(figure);
            this._triggerFnUnitSelect();
        } else if (command.event.type === 'UNDO') {
            fnUnit = command.options.fnUnit;
            figure = this.getFigureByFnUnitId(fnUnit.fid);
            this._removeFigure(figure);
            this._unselectAllElements();
            this._unselectAllLinkViews();
            this.hideSelectionBox();
            this._triggerFnUnitSelect();
            this.hideTools(true);
        }
    };

    DataFlowEditorPage.prototype.onRemoveFnUnitCommand = function (command) {
        var figure, fnUnit;

        if (command.event.type === 'REDO' ||
            command.event.type === 'EXECUTE' && command.event.source !== this) {
            figure = this.getFigureByFnUnitId(command.options.fid);
            this._unselectElement(figure);
            this._removeFigure(figure);
            this.showSelectionBox();
        } else if (command.event.type === 'UNDO') {
            fnUnit = this.getFnUnitById(command.options.fid);
            figure = this.createFnUnitFigure(fnUnit);
            this.graph.addCells([figure]);
            this.showSelectionBox();

            this.fitToContent();
            this.ensureVisible(figure);
        }

        // _removeFigure에 durtaion이 설정되어 있음.
        setTimeout(function () {
            Brightics.OptModelManager.renderOptModels();
        }, 600);
    };

    DataFlowEditorPage.prototype.onConnectFnUnitCommand = function (command) {
        var link;

        if (command.event.type === 'REDO' ||
            command.event.type === 'EXECUTE' && command.event.source !== this) {

            var linkUnit = this.getLinkUnitById(command.options.kid);
            link = this.createLinkFigure(linkUnit);
            if (link) {
                this.graph.addCells([link]);
            }
        } else if (command.event.type === 'UNDO') {
            link = this.getLinkFigureByLinkUnitId(command.options.kid);
            this._removeLink(link);
        }
    };

    DataFlowEditorPage.prototype.onDisconnectFnUnitCommand = function (command) {
        var link;

        if (command.event.type === 'REDO' ||
            command.event.type === 'EXECUTE' && command.event.source !== this) {

            link = this.getLinkFigureByLinkUnitId(command.options.kid);
            this._removeLink(link);
        } else if (command.event.type === 'UNDO') {
            var linkUnit = this.getLinkUnitById(command.options.kid);
            link = this.createLinkFigure(linkUnit);
            if (link) {
                this.graph.addCells([link]);
            }
        }
    };

    DataFlowEditorPage.prototype.onReconnectFnUnitCommand = function (command) {
        var link, linkUnit, sourceFigure, targetFigure;

        if (command.event.type === 'REDO' ||
            command.event.type === 'UNDO' ||
            command.event.type === 'EXECUTE' && command.event.source !== this) {

            linkUnit = this.getModel().getLinkUnitById(command.options.kid);
            sourceFigure = this.getFigureByFnUnitId(linkUnit[SOURCE_FID]);
            targetFigure = this.getFigureByFnUnitId(linkUnit[TARGET_FID]);

            link = this.getLinkFigureByLinkUnitId(linkUnit.kid);
            link.set('source', {
                id: sourceFigure.id,
                port: OUT_PORT_ID
            });
            link.set('target', {
                id: targetFigure.id,
                port: IN_PORT_ID
            });
        }
    };

    DataFlowEditorPage.prototype.onSetFnUnitCommand = function (command) {
        var figure;

        if (command.event.type === 'REDO' ||
            command.event.type === 'UNDO') {

            figure = this.getFigureByFnUnitId(command.options.fnUnit.fid);
            if (figure) {
                this._unselectAllElements();
                this._selectElement(figure);
                this.showSelectionBox();
                this._triggerFnUnitSelect();
            }
        }
    };

    DataFlowEditorPage.prototype.onSetDialogFnUnitCommand = function (command) {
        if (command.event.type === 'REDO' ||
            command.event.type === 'UNDO') {
            //현재 아무것도 하지 않지만 뭔가를 화면에서 보여줘야 하는지?
        }
    };

    DataFlowEditorPage.prototype.onNewOptModelCommand = function (command) {
        Brightics.OptModelManager.renderOptModels();
    };

    DataFlowEditorPage.prototype.onSetOptModelCommand = function (command) {
        Brightics.OptModelManager.renderOptModels();
    };

    DataFlowEditorPage.prototype.onRemoveOptModelCommand = function (command) {
        Brightics.OptModelManager.renderOptModels();
    };

    DataFlowEditorPage.prototype.onSetFnUnitPositionCommand = function (command) {
        var figure, fnUnit;

        if (command.event.type === 'REDO' ||
            command.event.type === 'UNDO' ||
            command.event.type === 'EXECUTE' && command.event.source !== this) {

            figure = this.getFigureByFnUnitId(command.options.fid);
            fnUnit = this.getFnUnitById(command.options.fid);
            if (fnUnit) {
                figure.position(fnUnit.display.diagram.position.x, fnUnit.display.diagram.position.y);
            }
            this._rerouteLink();
            this.showSelectionBox();
        }
        Brightics.OptModelManager.renderOptModels();
    };

    DataFlowEditorPage.prototype.onShiftCommand = function (command) {
        var fid, figure, fnUnit;
        for (var i in command.options.changed) {
            fid = command.options.changed[i];
            fnUnit = this.getFnUnitById(fid);
            figure = this.getFigureByFnUnitId(fid);
            if (fnUnit && figure) {
                figure.position(fnUnit.display.diagram.position.x, fnUnit.display.diagram.position.y);
            }
        }
        this.hideSelectionBox();
        this.hideTools(true);
        this.showSelectionBox();
        Brightics.OptModelManager.renderOptModels();
    };

    DataFlowEditorPage.prototype.onRenameFnUnitCommand = function (command) {
        var figure = this.getFigureByFnUnitId(command.options.fid);
        var fnUnit = this.getFnUnitById(command.options.fid);
        if (fnUnit) {
            figure.label(fnUnit.display.label, this.options.scale);

            if (this._hasDescription(fnUnit)) figure.showToolTipIcon();
            else figure.hideToolTipIcon();
        }
    };

    DataFlowEditorPage.prototype.getFnUnitById = function (fid) {
        return this.getModel().getFnUnitById(fid);
    };

    DataFlowEditorPage.prototype.getLinkUnitById = function (kid) {
        return this.getModel().getLinkUnitById(kid);
    };

    DataFlowEditorPage.prototype.getFigureByFnUnitId = function (fid) {
        var figures = this.graph.getElements();
        for (var i in figures) {
            if (figures[i].attributes.fid === fid) {
                return figures[i];
            }
        }
        return undefined;
    };

    DataFlowEditorPage.prototype.getLinkFigureByLinkUnitId = function (kid) {
        var links = this.graph.getLinks();
        for (var i in links) {
            if (links[i].attributes.kid === kid) {
                return links[i];
            }
        }
        return undefined;
    };

    DataFlowEditorPage.prototype.getSelectedFigureElements = function () {
        return _.toArray(this.$paperElement[0]
            .querySelectorAll('.brtc-va-editors-diagram-diagrameditorpage-function-selected'));
    };

    DataFlowEditorPage.prototype.getSelectedFigures = function () {
        return this._selectedElements;
    };

    DataFlowEditorPage.prototype.getSelectedFigureIds = function () {
        return this.getSelectedFigures().map(_.property('cid')).sort();
    };

    DataFlowEditorPage.prototype.selectFunction = function (fid) {
        var _this = this;
        if (_this.behaviorMode === BEHAVIOR_LINK) _this._setBehaviorModeToDefault();
        var figure = this.getFigureByFnUnitId(fid);
        this._unselectAllElements();
        this._selectElement(figure);
        this.showSelectionBox();
        this._triggerFnUnitSelect();
        setTimeout(function () {
            _this.ensureCenter(figure);
        }, 100);
    };

    DataFlowEditorPage.prototype.isReadOnlyFigure = function (figure) {
        return (figure.attributes.attrs.category === 'brightics') ? true : false;
    };

    DataFlowEditorPage.prototype.calcGuidePosition = function (figure) {
        return this.calcGuideLocation(figure.attributes.position.x, figure.attributes.position.y);
    };

    DataFlowEditorPage.prototype.calcGuideLocation = function (x, y) {
        var gap_width = this.GAP_WIDTH || Brightics.VA.Env.Diagram.GAP_WIDTH;
        var gap_height = this.GAP_HEIGHT || Brightics.VA.Env.Diagram.GAP_HEIGHT;

        var w = (Brightics.VA.Env.Diagram.FIGURE_WIDTH + gap_width);
        var h = (Brightics.VA.Env.Diagram.FIGURE_HEIGHT + gap_height);

        var xx = x - Brightics.VA.Env.Diagram.PAPER_MARGIN_LEFT;
        var minX = Math.floor(xx / w) * w;
        if (xx > minX + w / 2) {
            xx = minX + w;
        } else {
            xx = minX;
        }
        xx += Brightics.VA.Env.Diagram.PAPER_MARGIN_LEFT;

        var yy = y - Brightics.VA.Env.Diagram.PAPER_MARGIN_TOP;
        var minY = Math.floor(yy / h) * h;
        if (yy > minY + h / 2) {
            yy = minY + h;
        } else {
            yy = minY;
        }
        yy += Brightics.VA.Env.Diagram.PAPER_MARGIN_TOP;

        return {x: xx, y: yy};
    };

    DataFlowEditorPage.prototype.showGuideBox = function (figure) {
        if (this.options.scale < 0.6) {
            this.hideGuideBox();
            return;
        }
        var pos = this.calcGuidePosition(figure);
        this.$guideBox.css({
            top: pos.y * this.options.scale,
            left: pos.x * this.options.scale,
            display: 'block'
        });
    };

    DataFlowEditorPage.prototype.updateGuideBox = function (figure) {
        var pos = this.calcGuidePosition(figure);
        this.$guideBox.css({
            top: pos.y * this.options.scale,
            left: pos.x * this.options.scale
        });
    };

    DataFlowEditorPage.prototype.hideGuideBox = function () {
        if (this.$guideBox) this.$guideBox.hide();
    };

    DataFlowEditorPage.prototype.showGuideMessage = function (figure, message) {
        if (this.options.scale < 0.6) {
            this.hideGuideMessage()
            return
        }
        var pos = {
            x: figure.attributes.position.x,
            y: figure.attributes.position.y + Brightics.VA.Env.Diagram.FIGURE_HEIGHT
        };
        this.guideMessage = message;
        this.$guideMessageBox.text(message);
        this.$guideMessageBox.css({
            top: Math.max(0, pos.y * this.options.scale),
            left: Math.max(0, pos.x * this.options.scale),
            display: 'block'
        });
    };

    DataFlowEditorPage.prototype.hideGuideMessage = function () {
        this.guideMessage = null;
        if (this.$guideMessageBox) this.$guideMessageBox.hide();
    };

    DataFlowEditorPage.prototype.renderStartedFnUnit = function (figure) {
        this.ensureCenter(figure);
    };

    DataFlowEditorPage.prototype._getRunningTime = function (runningTime) {
        let result = '(-)';
        if (typeof runningTime !== 'number' || runningTime < 0) return result;

        if (runningTime < 1000) result = (runningTime / 1000).toFixed(1) + 's';
        else if (runningTime < 10000) result = (runningTime / 1000).toFixed(1) + 's';
        else if (runningTime < 120000) result = (runningTime / 1000).toFixed(0) + 's';
        else if (runningTime < 6000000) result = (runningTime / 1000 / 60).toFixed(1) + 'm';
        else result = (runningTime / 1000 / 60 / 60).toFixed(1) + 'h';

        return '(' + result + ')';
    };

    DataFlowEditorPage.prototype.renderCompletedFnUnit = function (eventData) {
        var figure = this.getFigureByFnUnitId(eventData.fid);
        var date = eventData.end ? new Date(parseInt(eventData.end)) : Date.now();

        let runningTime = eventData.end - eventData.begin;

        if (figure) figure.lastRuntime(date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + this._getRunningTime(runningTime));

        var item = $.extend(true, {}, eventData);
        delete item.launchOptions;
        delete item.originalResponse;

        if (window.sessionStorage) sessionStorage.setItem(item.fid, JSON.stringify(item));
    };

    DataFlowEditorPage.prototype.render = function (_editorInput) {
        var editorInput = _editorInput || this.getModel();
        // this.$paperElement.children('.brtc-va-editors-diagram-diagrameditorpage-function-selected').remove();

        var cells = [];
        for (let i in editorInput.functions) {
            let fnUnit = editorInput.functions[i];
            let figure = this.createFnUnitFigure(fnUnit);
            if (sessionStorage) {
                var storedEventData = JSON.parse(sessionStorage.getItem(fnUnit.fid) || "{}");
                if (storedEventData && storedEventData.end) {
                    var date = new Date(parseInt(storedEventData.end));
                    let runningTime = storedEventData.end - storedEventData.begin;
                    figure.lastRuntime(date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + this._getRunningTime(runningTime));
                }
            }
            cells.push(figure);
        }

        var tempFigure = _.zipObject(cells.map((obj) => [obj.attributes.fid, obj]));
        for (let i in editorInput.links) {
            let linkUnit = editorInput.links[i];
            let sFid = linkUnit[SOURCE_FID];
            let tFid = linkUnit[TARGET_FID];
            let linkFigure = this.createLinkFigure(linkUnit, tempFigure[sFid], tempFigure[tFid]);
            if (linkFigure) {
                cells.push(linkFigure);
            }
        }
        this.graph.resetCells(cells);

        this.fitToContent();
    };

    DataFlowEditorPage.prototype.findError = function (problems) {
        var _this = this;
        var errorIds = [];
        var errorFigures = [];
        var tmpProblems = [];

        if (problems) {
            tmpProblems = (problems.constructor === Array) ? problems : [problems];
            $.each(tmpProblems, function (index, element) {
                var figure = _this.getFigureByFnUnitId(element.fid);
                if ($.inArray(element.fid, errorIds) < 0) {
                    if (figure) {
                        errorIds.push(element.fid);
                        errorFigures.push(figure);
                    }
                }
            });
        }
        return errorFigures;
    };

    DataFlowEditorPage.prototype.onActivated = function () {
        // var links = this.graph.getLinks();
        // $.each(links, function (index, link) {
        //     link.remove();
        // });

        // var _this = this;
        // setTimeout(function () {
        //     for (var i in _this.getModel().links) {
        //         var linkUnit = _this.getModel().links[i];
        //         var linkFigure = _this.createLinkFigure(linkUnit);
        //         if (linkFigure) {
        //             _this.graph.addCells([linkFigure]);
        //         }
        //     }
        //     links = _this.graph.getLinks();
        //     $.each(links, function (index, link) {
        //         link.toBack();
        //     });
        // }, 400);
    };

    DataFlowEditorPage.prototype.getPaperSize = function () {
        var size = {};

        var box = this.graph.getBBox(this.graph.getElements());
        if (box) {
            size.width = (box.x + box.width) + 900;
            size.width = size.width + (900 - size.width % 900);
            size.width = Math.max(size.width, this.$mainControl.width());

            size.height = (box.y + box.height) + 50;
            size.height = size.height + (50 - size.height % 50);
            size.height = Math.max(size.height, this.$mainControl.height() - 4);
        } else {
            size.width = this.$mainControl.width();
            size.height = this.$mainControl.height() - 4;
        }

        return size;
    };

    DataFlowEditorPage.prototype.fitToContent = function () {
        // var size = this.getPaperSize();
        // var width = size.width;
        // var height = size.height;

        // this.paper.setDimensions(width, height);

        this.paper.fitToContent({
            gridWidth: 10,
            gridHeight: 10,
            padding: {top: 0, right: 900, bottom: 700, left: 0},
            minWidth: 1840,
            minHeight: 830,
        });

        this.updateMiniMapWindow();

        this.$mainControl.perfectScrollbar('update');
    };

    DataFlowEditorPage.prototype.updateMiniMapWindow = function () {
        this.minimap.updateMiniMapWindow();
    };

    DataFlowEditorPage.prototype.checkInputtable = function (fnUnit) {
        return (FnUnitUtils.getTotalInRangeCount(fnUnit).min > 0)
            ? true : FnUnitUtils.isBluffNode(fnUnit);
    };

    DataFlowEditorPage.prototype.createFnUnitFigure = function (fnUnit) {
        var clazz = this.getModel().type;

        var figure = new Brightics.VA.Implementation.DataFlow.Editors.Diagram.Shapes.FnUnitFigure({
            colorSet: this.options.editor.getColorSet(),
            position: fnUnit.display.diagram.position,
            fid: fnUnit.fid,
            inputtable: FnUnitUtils.isInputtable(fnUnit),
            outputtable: FnUnitUtils.isOutputtable(fnUnit),
            connectableFunctions: Brightics.VA.Core.Utils.WidgetUtils.getFunctionLibrary(clazz, fnUnit.func)['connectable-functions'],
            acceptableFunctions: Brightics.VA.Core.Utils.WidgetUtils.getFunctionLibrary(clazz, fnUnit.func)['acceptable-functions']
        });
        figure.label(fnUnit.display.label, this.options.scale);

        var funcDef = Brightics.VA.Core.Utils.WidgetUtils.getFunctionLibrary(clazz, fnUnit.func);
        if (funcDef) {
            figure.category(funcDef);
            if (funcDef.deprecated) {
                figure.setDeprecated(funcDef['deprecated-message']);
            }
        }

        if (this._hasDescription(fnUnit)) figure.showToolTipIcon();
        else figure.hideToolTipIcon();

        return figure;
    };

    DataFlowEditorPage.prototype._hasDescription = function (fnUnit) {
        return (fnUnit.display.description && fnUnit.display.description !== '<p><br></p>');
    };

    DataFlowEditorPage.prototype.createLinkFigure = function (linkUnit, sourceFigureP, targetFigureP) {
        var sourceFigure = sourceFigureP || this.getFigureByFnUnitId(linkUnit[SOURCE_FID]);
        var targetFigure = targetFigureP || this.getFigureByFnUnitId(linkUnit[TARGET_FID]);

        if (sourceFigure && targetFigure) {
            var link = new Brightics.VA.Implementation.DataFlow.Editors.Diagram.Shapes.LinkFigure({
                source: {
                    id: sourceFigure.id,
                    port: OUT_PORT_ID
                },
                target: {
                    id: targetFigure.id,
                    port: IN_PORT_ID
                },
                kid: linkUnit.kid,
                sourceFid: linkUnit[SOURCE_FID],
                targetFid: linkUnit[TARGET_FID]
            });
            return link;
        }
        return undefined;
    };

    DataFlowEditorPage.prototype._createLinkFigure = function (kid, sourceFigure, targetFigure) {
        var opt = {
            source: {
                id: sourceFigure.id,
                port: OUT_PORT_ID
            },
            target: {
                id: targetFigure.id,
                port: IN_PORT_ID
            },
            kid: kid,
        };
        if (sourceFigure.prop) {
            opt.sourceFid = sourceFigure.prop('fid');
        }
        if (targetFigure.prop) {
            opt.targetFid = targetFigure.prop('fid');
        }

        if (sourceFigure.x && sourceFigure.y) {
            opt.source = {
                x: sourceFigure.x,
                y: sourceFigure.y
            };
        }
        if (targetFigure.x && targetFigure.y) {
            opt.target = {
                x: targetFigure.x,
                y: targetFigure.y
            };
        }

        var link = new Brightics.VA.Implementation.DataFlow.Editors.Diagram.Shapes.LinkFigure(opt);
        return link;
    };

    DataFlowEditorPage.prototype.addLinkTools = function (linkView) {
        var SourceArrowhead = joint.linkTools.SourceArrowhead.extend({
            tagName: 'circle',
            attributes: {
                'cx': 4,
                'r': 8,
                'fill': '#8993DE',
                'stroke': '#8993DE',
                'stroke-width': 1,
                'cursor': 'move'
            }
        });

        var TargetArrowhead = joint.linkTools.TargetArrowhead.extend({
            tagName: 'circle',
            attributes: {
                'cx': -8,
                'r': 8,
                'fill': '#8993DE',
                'stroke': '#8993DE',
                'stroke-width': 1,
                'cursor': 'move'
            }
        });

        var Remove = joint.linkTools.Remove.extend({
            children: [{
                tagName: 'circle',
                selector: 'button',
                attributes: {
                    'r': 9,
                    'fill': '#f6f6f6',
                    'stroke': '#8993DE',
                    'stroke-width': 2,
                    'cursor': 'pointer'
                }
            }, {
                tagName: 'path',
                selector: 'icon',
                attributes: {
                    'd': 'M -4 -4 4 4 M -4 4 4 -4',
                    'fill': 'none',
                    'stroke': '#5755a1',
                    'stroke-width': 4,
                    'pointer-events': 'none'
                }
            }],
        })

        var sourceArrowheadTool = new SourceArrowhead();
        var targetArrowheadTool = new TargetArrowhead();
        var tools = [sourceArrowheadTool, targetArrowheadTool];
        if (linkView.getConnectionLength() > 100) {
            var startPointRemoveButton = new Remove({distance: 33});
            var endPointRemoveButton = new Remove({distance: linkView.getConnectionLength() - 38});
            tools.push(startPointRemoveButton);
            tools.push(endPointRemoveButton);
        } else {
            var removeButton = new Remove({distance: '50%'});
            tools.push(removeButton);
        }
        var toolsView = new joint.dia.ToolsView({tools: tools});
        linkView.addTools(toolsView);
        linkView.showTools();
    };

    DataFlowEditorPage.prototype.showTools = function (figure) {
        var _this = this;
        if (this.options.scale < 0.6) {
            this.hideTools();
            return;
        }

        var pos = figure.attributes.position;
        if (pos && figure instanceof Brightics.VA.Implementation.DataFlow.Editors.Diagram.Shapes.FnUnitFigure && !figure.attributes.dummy) {
            this.clearHideToolsTimer();
            this.clearShowToolsTimer();
            this.showToolsTimer = setTimeout(function () {
                var fid = figure.attributes.fid;

                var fnUnit = _this.options.editor.getActiveModel().getFnUnitById(fid);
                if (!fnUnit) return;

                _this.$tools.attr('has-model',
                    _this.hasModel(figure.attributes.attrs.category, fnUnit));
                _this.$tools.attr('cid', figure.cid);
                _this.$tools.attr('category', figure.attributes.attrs.category);
                _this.$tools.attr('select', figure.attributes.attrs['.brtc-va-outer'].fill !== '#FFFFFF');
                _this.$tools.css({
                    top: pos.y * _this.options.scale,
                    left: pos.x * _this.options.scale,
                    display: 'block'
                });
            }, 50);
        }
        this.setConnectToolItemVisible(figure.attributes.outputtable);
    };

    DataFlowEditorPage.prototype.updateToolsPosition = function (figure) {
        var _this = this;
        var pos = figure.attributes.position;
        this.$tools.css({
            top: pos.y * _this.options.scale,
            left: pos.x * _this.options.scale
        });
    };

    DataFlowEditorPage.prototype.clearShowToolsTimer = function () {
        if (this.showToolsTimer) {
            clearTimeout(this.showToolsTimer);
            this.showToolsTimer = null;
        }
    };

    DataFlowEditorPage.prototype.hideTools = function (immediately) {
        var _this = this;
        if (this.$tools) {
            if (immediately) {
                Brightics.OptModelManager.renderOptModels(_this);
                this.$tools.hide();
            } else {
                this.clearShowToolsTimer();
                this.clearHideToolsTimer();
                this.hideToolsTimer = setTimeout(function () {
                    Brightics.OptModelManager.renderOptModels(_this);
                    _this.$tools.hide();
                }, 200);
            }
        }
    };

    DataFlowEditorPage.prototype.clearHideToolsTimer = function () {
        if (this.hideToolsTimer) {
            clearTimeout(this.hideToolsTimer);
            this.hideToolsTimer = null;
        }
    };

    DataFlowEditorPage.prototype.showToolTip = function (figure) {
        if (this.options.scale < 0.6) {
            this.hideToolTip();
            return;
        }

        var _this = this;
        var labelColor;
        var clazz = this.getModel().type;
        var pos = figure.attributes.position;
        if (pos && figure instanceof Brightics.VA.Implementation.DataFlow.Editors.Diagram.Shapes.FnUnitFigure &&
            !figure.attributes.dummy && this.getEditor().getEditorState(TOOLTIP_ENABLED)) {
            var fnUnit = _this.getFnUnitById(figure.attributes.fid);
            var funcDef = Brightics.VA.Core.Utils.WidgetUtils.getFunctionLibrary(clazz, fnUnit.func);
            labelColor = figure.getColor();
            _this.$toolTip.empty();
            var $tooltipHeaderFunc = $('' +
                '<div class="brtc-va-editors-diagram-diagrameditorpage-function-tooltip-header-func">' +
                '   <label class="brtc-va-editors-diagram-diagrameditorpage-function-tooltip-header-func-label" style="background-color:' + labelColor + '"></label>' +
                '</div>');
            if (funcDef.category === 'udf') {
                $tooltipHeaderFunc.find('.brtc-va-editors-diagram-diagrameditorpage-function-tooltip-header-func-label').text('UDF');
            } else {
                $tooltipHeaderFunc.find('.brtc-va-editors-diagram-diagrameditorpage-function-tooltip-header-func-label').text(funcDef.defaultFnUnit.display.label);
            }
            _this.$toolTip.append($tooltipHeaderFunc);
            var $tooltipHeader = $('<div class="brtc-va-editors-diagram-diagrameditorpage-function-tooltip-header"><p></p></div>');
            $tooltipHeader.find('p').text(fnUnit.display.label);
            _this.$toolTip.append($tooltipHeader);

            _this.$toolTip.addClass('brtc-va-editors-visible');
            _this.$toolTip.css({
                top: (pos.y + Brightics.VA.Env.Diagram.FIGURE_HEIGHT) * _this.options.scale,
                left: (pos.x) * _this.options.scale
            });
            var $container, $contents, $editButton;
            if (_this._hasDescription(fnUnit)) {
                $container = $('<div class="brtc-va-editors-diagram-diagrameditorpage-function-tooltip-contents-container"></div>');
                $contents = $('<div class="brtc-va-editors-diagram-diagrameditorpage-function-tooltip-contents">' + fnUnit.display.description + '</div>');
                $editButton = $('<div class="brtc-va-editors-diagram-diagrameditorpage-function-tooltip-contents-edit"></div>');
                _this.$toolTip.append($container);
                $container.append($contents);
                $container.append($editButton);
                $contents.perfectScrollbar();
            } else {
                $container = $('<div class="brtc-va-editors-diagram-diagrameditorpage-function-tooltip-contents-empty-container"></div>');
                $editButton = $('<div class="brtc-va-editors-diagram-diagrameditorpage-function-tooltip-contents-edit"></div>');
                _this.$toolTip.append($container);
                $container.append($editButton);
                $container.append($editButton);
            }
            $editButton.click(function (event) {
                var dialogOptions = {
                    title: Brightics.locale.common.editFunction,
                    label: fnUnit.display.label,
                    description: fnUnit.display.description || '',
                    close: function (dialogResult) {
                        if (dialogResult.OK) {
                            _this.doEditFunction(fnUnit.fid, dialogResult.label, dialogResult.description);
                        }
                    }
                };
                new Brightics.VA.Core.Dialogs.EditResourceDialog(_this.$mainControl, dialogOptions);
            });
        }
    };

    DataFlowEditorPage.prototype.hideToolTip = function () {
        if (this.$toolTip) this.$toolTip.removeClass('brtc-va-editors-visible');
    };

    DataFlowEditorPage.prototype.doEditFunction = function (fid, label, description) {
        var command = new Brightics.VA.Core.Editors.Diagram.Commands.RenameFnUnitCommand(this, {
            fid: fid,
            name: label,
            description: description
        });
        this.fireCommand(command);
    };

    DataFlowEditorPage.prototype.removeFnUnitFigure = function (figure) {
        var activeModelEditor = Studio.getEditorContainer().getActiveModelEditor();
        var pid = activeModelEditor.getEditorInput().getProjectId();
        var mid = activeModelEditor.getEditorInput().getFileId();

        var fnUnit = this.getFnUnitById(figure.attributes.fid);
        var label = fnUnit.display.label;
        this.notification('success', 'The function [' + label + '] was removed.');

        var commands = new Brightics.VA.Core.CompoundCommand(this, {
            label: 'Remove a Function'
        });

        // Unbind Global Parameter
        for (var paramKey in fnUnit.param) {
            var variable = fnUnit.parent().getVariable(fnUnit.fid, paramKey);
            if (variable) {
                commands.add(new Brightics.VA.Core.Editors.Diagram.Commands.UnBindVariableCommand(this, {
                    fid: fnUnit.fid,
                    paramKey: paramKey,
                    variable: variable
                }));
            }
        }

        var links = this.graph.getConnectedLinks(figure);
        for (var i in links) {
            this._removeLink(links[i]);
            commands.add(this.createDisconnectFnUnitCommand(links[i]));
        }

        this._removeFigure(figure);
        commands.add(this.createRemoveFnUnitCommand(figure));
        commands.add(this.createRemoveConnectedOutDataCommand([figure]));

        var targetOptModelId = Brightics.OptModelManager.getTargetOptModelId(pid, mid, fnUnit.fid);
        if (targetOptModelId) {
            commands.add(Brightics.OptModelManager.createRemoveOptModelCommand(pid, mid, targetOptModelId));
        }

        this.fireCommand(commands);
    };

    DataFlowEditorPage.prototype.removeFnUnitFigures = function (figures) {
        var activeModelEditor = Studio.getEditorContainer().getActiveModelEditor();
        var pid = activeModelEditor.getEditorInput().getProjectId();
        var mid = activeModelEditor.getEditorInput().getFileId();

        var commands = new Brightics.VA.Core.CompoundCommand(this, {
            label: 'Remove functions'
        });

        var fnUnit;
        var fnUnits = [];
        var links = [], linkIds = [];
        var i, j;
        for (i in figures) {
            fnUnit = this.getFnUnitById(figures[i].attributes.fid);
            fnUnits.push(fnUnit);

            var connection = this.graph.getConnectedLinks(figures[i]);
            for (j in connection) {
                if (linkIds.indexOf(connection[j].attributes.kid) < 0) {
                    linkIds.push(connection[j].attributes.kid);
                    links.push(connection[j]);
                }
            }
        }

        // Remove LinkUnit
        for (const link of links) {
            this._removeLink(link);
            commands.add(this.createDisconnectFnUnitCommand(link));
        }

        // Remove FnUnit
        var targetOptModelIds = {};
        for (i in figures) {
            figures[i].remove();
            commands.add(this.createRemoveFnUnitCommand(figures[i]));

            // Unbind Global Parameter
            var variables = fnUnits[i].parent().getVariables(fnUnits[i].fid);
            for (var key in variables) {
                commands.add(new Brightics.VA.Core.Editors.Diagram.Commands.UnBindVariableCommand(this, {
                    fid: fnUnits[i].fid,
                    paramKey: key,
                    variable: variables[key]
                }));
            }

            var targetOptModelId = Brightics.OptModelManager.getTargetOptModelId(pid, mid, fnUnits[i].fid);
            if (targetOptModelId) {
                targetOptModelIds[targetOptModelId] = true;
            }
        }

        for (var optId in targetOptModelIds) {
            commands.add(Brightics.OptModelManager.createRemoveOptModelCommand(pid, mid, optId));
        }

        commands.add(this.createRemoveConnectedOutDataCommand(figures));

        this.notification('success', figures.length + ' functions were removed.');
        this.fireCommand(commands);
    };

    DataFlowEditorPage.prototype.removeFnUnitLink = function (figure) {
        var links = this.graph.getConnectedLinks(figure);
        if (links.length > 0) {
            var fnUnit = this.getFnUnitById(figure.attributes.fid);
            var label = fnUnit.display.label;
            this.notification('success', 'All associated connections to [' + label + '] was removed.');

            var commands = new Brightics.VA.Core.CompoundCommand(this, {});
            for (var i in links) {
                this._removeLink(links[i]);
                commands.add(this.createDisconnectFnUnitCommand(links[i]));
            }
            this.fireCommand(commands);
        } else {
            this.notification('info', 'Already removed all the associated connections to the function');
        }
    };

    DataFlowEditorPage.prototype._removeFigure = function (figure) {
        if (figure) {
            var transition = {
                duration: 200,
                timingFunction: joint.util.timing.inout,
                valueFunction: function (a, b) {
                    return function (t) {
                        return 1 - (b + t);
                    };
                }
            };
            figure.on('transition:end', function () {
                figure.remove();
            });
            figure.transition('attrs/rect.outer/opacity', 0.2, transition);
            figure.transition('attrs/text/opacity', 0.2, transition);
            figure.attributes.dummy = true;

            if (figure.cid === this.$tools.attr('cid')) {
                this.hideTools(true);
            }
        }
    };

    DataFlowEditorPage.prototype._revertPosition = function (figure) {
        var revert = this.getFnUnitById(figure.attributes.fid).display.diagram.position;
        var pos = figure.position();
        if (revert.x !== pos.x || revert.y !== pos.y) {
            figure.position(revert.x, revert.y);
        }
    };

    DataFlowEditorPage.prototype._revertLink = function (link) {
        var linkUnit = this.getLinkUnitById(link.attributes.kid);
        var sourceFigure = this.getFigureByFnUnitId(linkUnit[SOURCE_FID]);
        var targetFigure = this.getFigureByFnUnitId(linkUnit[TARGET_FID]);
        link.set({
            'source': {id: sourceFigure.id, port: OUT_PORT_ID},
            'target': {id: targetFigure.id, port: IN_PORT_ID},
            'sourceFid': sourceFigure.prop('fid'),
            'targetFid': targetFigure.prop('fid'),
        });
    };

    DataFlowEditorPage.prototype._removeLink = function (link) {
        if (link) {
            var transition = {
                duration: 200,
                timingFunction: joint.util.timing.inout,
                valueFunction: function (a, b) {
                    return function (t) {
                        return 1 - (b + t);
                    };
                }
            };
            link.on('transition:end', function () {
                link.remove();
            });
            link.transition('attrs/path/opacity', 0.2, transition);
        }
    };

    DataFlowEditorPage.prototype.connectSmartly = function (figure) {
        var links = [], linkUnit,
            inLink, outLink;
        var x = figure.attributes.position.x;
        var y = figure.attributes.position.y;
        var gap_width = this.GAP_WIDTH || Brightics.VA.Env.Diagram.GAP_WIDTH;

        var prev = this.graph.findModelsFromPoint({
            x: x - gap_width,
            y: y
        });
        var next = this.graph.findModelsFromPoint({
            x: x + Brightics.VA.Env.Diagram.FIGURE_WIDTH + gap_width,
            y: y
        });

        var inbounds = this.graph.getConnectedLinks(figure, {inbound: true});
        if (inbounds.length === 0 && prev.length > 0 && !prev[0].attributes.connectableFunctions && figure.attributes.inputtable && prev[0].attributes.outputtable && (prev[0].attributes.position.y === y)) {
            linkUnit = {
                kid: Brightics.VA.Core.Utils.IDGenerator.link.id(),
                'sourceFid': prev[0].attributes.fid,
                'targetFid': figure.attributes.fid
            };
            inLink = this.createLinkFigure(linkUnit);
            if (inLink) {
                links.push(inLink);
            }
        }
        var outbounds = this.graph.getConnectedLinks(figure, {outbound: true});
        if (!figure.attributes.connectableFunctions && outbounds.length === 0 && next.length > 0 && next[0].attributes.inputtable && figure.attributes.outputtable && (next[0].attributes.position.y === y)) {
            linkUnit = {
                kid: Brightics.VA.Core.Utils.IDGenerator.link.id(),
                'sourceFid': figure.attributes.fid,
                'targetFid': next[0].attributes.fid
            };
            outLink = this.createLinkFigure(linkUnit);
            if (outLink) {
                links.push(outLink);
            }
        }

        if (links.length) {
            this.graph.addCells(links);
        }

        return links;
    };

    DataFlowEditorPage.prototype.checkOverPosition = function (figure) {
        var pos = this.calcGuidePosition(figure);
        var models = this.graph.findModelsFromPoint(pos);
        for (var i in models) {
            if (models[i] !== figure) {
                if (models[i].position().x === pos.x && models[i].position().y === pos.y) {
                    return false;
                }
            }
        }
        return true;
    };

    DataFlowEditorPage.prototype.checkPreviousPosition = function (figure) {
        var pos = this.calcGuidePosition(figure);
        var inLinks = this.graph.getConnectedLinks(figure, {inbound: true});
        for (var i in inLinks) {
            if (inLinks[i].getSourceElement().position().x >= pos.x) {
                return false;
            }
        }

        return true;
    };

    DataFlowEditorPage.prototype.checkNextPosition = function (figure) {
        var pos = this.calcGuidePosition(figure);
        var outLinks = this.graph.getConnectedLinks(figure, {outbound: true});
        for (var i in outLinks) {
            if (outLinks[i].getTargetElement().position().x <= pos.x) {
                return false;
            }
        }

        return true;
    };

    DataFlowEditorPage.prototype.checkOutRangePosition = function (figure) {
        var pos = this.calcGuidePosition(figure);
        return pos.x > 0 && pos.y > 0;
    };

    DataFlowEditorPage.prototype.checkConnectedLink = function (link) {
        return link.getSourceElement() != null && link.getTargetElement() != null;
    };

    DataFlowEditorPage.prototype.checkLoopLink = function (link) {
        var sourceFid = link.prop('sourceFid');
        var targetFid = link.prop('targetFid');
        return this._getConnectableFids(sourceFid).indexOf(targetFid) >= 0;
    };

    DataFlowEditorPage.prototype._getConnectableFids = function (startFid) {
        var _this = this;
        var links = this.options.editor.getActiveModel().links;
        var fids = [];

        this.options.editor.getActiveModel().functions.forEach(function (a) {
            fids.push(a.fid)
        });

        var reverseLinks = {};
        var n = fids.length;
        var m = links.length;
        var i;
        for (i = 0; i < n; i++) {
            reverseLinks[fids[i]] = [];
        }
        for (i = 0; i < m; i++) {
            reverseLinks[links[i]['targetFid']].push(links[i]['sourceFid']);
        }

        var visited = {};
        var dfs = function (cur) {
            visited[cur] = true;
            for (var i = 0; i < reverseLinks[cur].length; i++) {
                var nxt = reverseLinks[cur][i];
                if (!visited[nxt]) {
                    dfs(nxt);
                }
            }
        };

        dfs(startFid);

        var result = [];
        for (i = 0; i < n; i++) {
            if (!visited[fids[i]]) {
                result.push(fids[i]);
            }
        }

        var fnS = this.getFnUnitById(startFid);
        result = result.filter(function (fid) {
            var fnT = _this.getFnUnitById(fid);
            var defT = Brightics.VA.Core.Utils.WidgetUtils.getFunctionLibrary('data', fnT.func);
            return !defT['acceptable-functions'] ||
                defT['acceptable-functions'].indexOf(fnS.func) >= 0;
        });
        return result;
    };

    DataFlowEditorPage.prototype.checkLinkPosition = function (link) {
        var sourceElement = link.getSourceElement();
        var targetElement = link.getTargetElement();
        if (typeof sourceElement.position === 'function' && typeof targetElement.position === 'function') {
            var sourcePos = sourceElement.position();
            var targetPos = targetElement.position();
            return targetPos.x > sourcePos.x;
        } else {
            return true;
        }
    };

    DataFlowEditorPage.prototype.checkAlreadyExistLink = function (link) {
        var sourceFid = link.prop('sourceFid');
        var targetFid = link.prop('targetFid');
        var links = this.getModel().links;
        for (var i = 0; i < links.length; i++) {
            if (links[i][SOURCE_FID] === sourceFid && links[i][TARGET_FID] === targetFid) return false;
        }
        return true;
    };

    DataFlowEditorPage.prototype.checkAlreadyExistLinkByTableId = function (link) {
        var sourceFid = link.prop('sourceFid');
        var targetFid = link.prop('targetFid');

        var sourceFnUnit = this.getFnUnitById(sourceFid);
        var targetFnUnit = this.getFnUnitById(targetFid);

        var sourceOutData = FnUnitUtils.getOutData(sourceFnUnit);
        var targetInData = FnUnitUtils.getInData(targetFnUnit);

        for (var sourceIndex in sourceOutData) {
            if (targetInData && targetInData.indexOf(sourceOutData[sourceIndex]) > -1) return false;
        }

        return true;
    };

    DataFlowEditorPage.prototype.registerGoHistoryEventListener = function () {
        var _this = this;
        var modelEditorRef = Brightics.VA.Core.Utils.WidgetUtils.getModelEditorRef(this.$mainControl);
        this.onGoHistoryCommand = function (command) {
            _this.hideSelectionBox();
            _this._triggerFnUnitSelect();
            _this.render();

            var errorIds = [];
            var errorFigures = [];
            for (var j in _this.problems) {
                if (errorIds[_this.problems[j].fid] === undefined) {
                    errorIds.push(_this.problems[j].fid);
                    errorFigures.push(_this.getFigureByFnUnitId(_this.problems[j].fid));
                }
            }
            _this.hideErrorBox();
            _this.showErrorBox(errorFigures);
        };

        modelEditorRef.addGoHistoryListener(this.onGoHistoryCommand);
    };

    DataFlowEditorPage.prototype.updateStatus = function (event) {
        var figure = this.getFigureByFnUnitId(event.fid);
        if (figure) figure.updateStatus(event.status);
    };

    DataFlowEditorPage.prototype.destroy = function () {
        Studio.getInstance().removeProblemListener(this.problemsListener);
        Studio.getInstance().removeDebugListener(this.debugListener);
    };

    DataFlowEditorPage.prototype.setModel = function (model) {
        this.render();
        this.hideAdditionalItems();
    };

    DataFlowEditorPage.prototype.hideAdditionalItems = function (model) {
        this.hideValidationToolTip();
        this.hideSelectionBox();
        this.hideErrorBox();
        this.hideGuideBox();
        this.hideGuideMessage();
        this.hideTools(true);
        this.hideToolTip();
    };

    DataFlowEditorPage.prototype.createNewActivityCommand = function (fnUnit) {
        var options = Brightics.VA.Core.Utils.NestedFlowUtils.getNewActivityCommandOptions(fnUnit);
        return _.map(options, function (opt) {
            return new Brightics.VA.Core.Editors.Diagram.Commands.NewActivityCommand(this, opt);
        }.bind(this));
    };

    DataFlowEditorPage.prototype.createRemoveConnectedOutDataCommand = function (figures) {
        var _this = this;
        var commands = [];
        var indices = [];
        var activeModel = this.getEditor().getActiveModel();
        _.forEach(figures, function (figure) {
            var fnUnit = _this.getFnUnitById(figure.attributes.fid);
            var outData = FnUnitUtils.getOutData(fnUnit);

            for (var i = 0; outData && i < outData.length; i++) {
                var index = _.indexOf(activeModel[OUT_DATA], outData[i]);
                if (index > -1) {
                    indices.push(index);
                }
            }
        });

        indices.sort(function (a, b) {
            return b - a;
        });

        for (var i = 0; i < indices.length; i++) {
            commands.push(new Brightics.VA.Core.Editors.Diagram.Commands.RemoveOperationCommand(
                this,
                {
                    target: activeModel,
                    path: [OUT_DATA, indices[i]]
                }
            ));
        }

        if (this.isNestedFlow()) {
            var nextFnUnitOutTableSize =
                Brightics.VA.Core.Utils.NestedFlowUtils.calcNextFnUnitOutTableSize(
                    this.getEditor().getModel(),
                    this.getEditor().getActiveFnUnit(),
                    activeModel.mid,
                    -indices.length);

            commands.push(Brightics.VA.Core.Utils.NestedFlowUtils.createAdjustOutTableCommand(
                this,
                this.getEditor().getModel(),
                this.getEditor().getActiveFnUnit(),
                nextFnUnitOutTableSize
            ));
        }
        return _.flatten(commands);
    };

    DataFlowEditorPage.prototype.getEditorInput = function () {
        return this.getEditor().getEditorInput();
    };

    DataFlowEditorPage.prototype.getEditor = function () {
        return this.options.editor;
    };

    DataFlowEditorPage.prototype.getModel = function () {
        return this.options.editor.getActiveModel();
    };

    DataFlowEditorPage.prototype.isNestedFlow = function () {
        var activeFnUnit = this.getEditor().getActiveFnUnit();
        return activeFnUnit &&
            (activeFnUnit.func === 'if' ||
                activeFnUnit.func === 'forLoop' ||
                activeFnUnit.func === 'whileLoop');
    };

    DataFlowEditorPage.prototype.getOptions = function () {
        return this.options;
    };

    DataFlowEditorPage.prototype.hasModel = function (categoty, fnUnit) {
        var categoryArr = ['process', 'control'];

        return (categoryArr.indexOf(categoty) > -1 &&
            fnUnit[FUNCTION_NAME] !== 'Flow') ? true : false;
    };

    DataFlowEditorPage.prototype.changeCursor = function (model, cursor) {
        var clazz = [
            'brtc-style-cursor-pointer',
            'brtc-style-cursor-move'
        ];
        var view = V(this.paper.findViewByModel(model).el);
        clazz.forEach(function (cl) {
            view.removeClass(cl, false);
        });

        if (cursor === 'pointer') {
            view.addClass('brtc-style-cursor-pointer', true);
        } else if (cursor === 'move') {
            view.addClass('brtc-style-cursor-move', true);
        }
    };

    DataFlowEditorPage.prototype.ensureCenterByFnUnit = function (fnUnit) {
        var figure = this.getFigureByFnUnitId(fnUnit.fid);
        this.ensureCenter(figure);
    };

    DataFlowEditorPage.prototype.refresh = function () {
        var figures = this.graph.getElements();
        for (var i in figures) {
            figures[i].refresh();
        }
    };


    Brightics.VA.Implementation.DataFlow.Editors.Diagram.EditorPage = DataFlowEditorPage;
    /* eslint-disable no-invalid-this */

}).call(this);