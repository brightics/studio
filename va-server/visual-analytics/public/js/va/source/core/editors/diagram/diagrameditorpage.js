/**
 * Created by sungjin1.kim on 2016-02-01.
 */
/* global IN_DATA, OUT_DATA, FUNCTION_NAME, _ */
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

    var IN_PORT = {
        id: IN_PORT_ID,
        group: 'in:l',
        args: {},
        markup: '<circle class="fnunit-port" r="0"/>',
    };
    var OUT_PORT = {
        id: OUT_PORT_ID,
        group: 'out:r',
        args: {},
        markup: '<circle class="fnunit-port" r="0"/>',
    };

    var DOUBLE_CLICK_INTERVAL = 200;

    function DiagramEditorPage(parentId, options) {
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
        this._selectedLink;
        this.behaviorMode = BEHAVIOR_DEFAULT;
        this.toolItems = {};

        this.retrieveParent();
        this.createControls();
        this.registerDebugListener();
        this.render();
        this.registerCommandEventListener();
        this.registerGoHistoryEventListener();
        this.registerKeyListener();

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

    DiagramEditorPage.prototype.findError = function (problems) {
        var _this = this;
        var errorIds = [];
        var errorFigures = [];
        var tmpProblems = [];

        if (problems) {
            tmpProblems = (problems.constructor == Array) ? problems : [problems];
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

    DiagramEditorPage.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    DiagramEditorPage.prototype.createControls = function () {
        var _this = this;

        this.$mainControl = $('' +
            '<div class="brtc-va-editors-diagram-diagrameditorpage brtc-style-editor-editorpage">' +
            '</div>');
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

        this.cellPointer = {};
    };

    DiagramEditorPage.prototype._createMiniMapControl = function () {
        this.minimap = new Brightics.VA.Core.Editors.Diagram.MinimapBoat(this.$parent.parent('.brtc-va-editors-modeleditor-splitter'), { diagramEditorPage: this });
    };

    DiagramEditorPage.prototype.createExpressionControl = function () {
        if (this.expression) this.expression.destroy();
        if (!this.options.editor.getActiveModel().isMainModel()) {
            this.expression = new Brightics.VA.Core.Editors.Diagram.ExpressionBoat(this.$parent.parent('.brtc-va-editors-modeleditor-splitter'),
                {
                    editor: this.options.editor,
                    resizable: false
                });
        }
    };

    DiagramEditorPage.prototype.getFunctionsLength = function () {
        return this.getModel().functions.length;
    };

    DiagramEditorPage.prototype.createMainPanel = function () {
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
            if (!_this.switchFnUnitDialog) _this.$createCue.css('display', 'none');
        });
    };

    DiagramEditorPage.prototype.ensureCenter = function (figure) {
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

        this.$mainControl.animate({ scrollLeft: scrollLeft, scrollTop: scrollTop }, 500);
    };

    DiagramEditorPage.prototype.ensureVisible = function (figure) {
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

    DiagramEditorPage.prototype.createDiagramPaper = function () {
        var _this = this;

        var connectableFids;

        this.$paperElement = this.$mainControl.find('.brtc-va-editors-diagram-diagrameditorpage-paper');

        this.graph = new joint.dia.Graph();
        this.paper = new joint.dia.Paper({
            el: this.$paperElement,
            width: this.options.width,
            height: this.options.height,
            model: this.graph,
            snapLinks: true,
            linkPinning: true,
            gridSize: 10,
            theme: 'none',
            interactive: function (cellView) {
                if (cellView.model instanceof joint.dia.Link) {
                    return { vertexAdd: false };
                }
                if (_this.cellPointer && _this.cellPointer.state === 'link') {
                    return false;
                }

                return true;
            },
            validateConnection: function (cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
                var figureS, figureT, fnUnitS, fnUnitT,
                    clazz = _this.getModel().type;
                figureS = cellViewS.model;
                figureT = cellViewT.model;
                var result = true;
                if (figureS && figureT) {
                    fnUnitS = _this.getFnUnitById(figureS.attributes.fid);
                    fnUnitT = _this.getFnUnitById(figureT.attributes.fid);
                }

                if (fnUnitS && fnUnitT) {
                    connectableFids = connectableFids || _this._getConnectableFids(figureS.attributes.fid);
                    if (connectableFids.indexOf(figureT.attributes.fid) < 0) {
                        result = false;
                    } else {
                        Brightics.VA.Core.Utils.WidgetUtils.getFunctionLibrary(clazz, fnUnitS.func);
                        Brightics.VA.Core.Utils.WidgetUtils.getFunctionLibrary(clazz, fnUnitT.func);
                    }
                }

                result = FnUnitUtils.isConnectable(fnUnitS, fnUnitT);

                connectableFids = undefined;
                return result;
            },
            linkView: joint.dia.LinkView.extend({
                options: _.defaults({
                    shortLinkLength: 45
                }, joint.dia.LinkView.prototype.options),
                updateToolsPosition: function () {
                    if (!this._V.linkTools) return this;

                    var scale = '';
                    var offset = this.options.linkToolsOffset;
                    var connectionLength = this.getConnectionLength();

                    if (!Number.isNaN(connectionLength)) {

                        /**
                         * sungjin1.kim@samsung.com
                         * Link 길이가 짧은 경우 scale 값 조정
                         */
                        if (connectionLength < 75) { // < this.options.shortLinkLength) {
                            scale = 'scale(.5)';
                            offset *= 0.7;
                        }

                        var toolPosition = this.getPointAtLength(offset);

                        this._toolCache.attr('transform', 'translate(' + toolPosition.x + ', ' + toolPosition.y + ') ' + 'scale(.8)');

                        if (this.options.doubleLinkTools && connectionLength >= this.options.longLinkLength) {

                            var doubleLinkToolsOffset = this.options.doubleLinkToolsOffset || offset;

                            toolPosition = this.getPointAtLength(connectionLength - doubleLinkToolsOffset);
                            this._tool2Cache.attr('transform', 'translate(' + toolPosition.x + ', ' + toolPosition.y + ') ' + scale);
                            this._tool2Cache.attr('visibility', 'visible');

                        } else if (this.options.doubleLinkTools) {

                            this._tool2Cache.attr('visibility', 'hidden');
                        }

                        // ===========================================================================================================================
                    }

                    return this;
                }
            })
        });

        this.paper.on('cell:pointerdown', this.handleCellPointerDown.bind(this));
        this.paper.on('cell:pointerup', this.handleCellPointerUp.bind(this));
        this.paper.on('cell:mouseover', this.handleCellMouseOver.bind(this));
        this.paper.on('cell:mouseout', this.handleCellMouseOut.bind(this));

        this.paper.on('blank:pointerdown', this.handleBlankPointerDown.bind(this));
        this.$paperElement.mousemove(this.handleBlankPointerMove.bind(this));
        this.$paperElement.mouseleave(this.handleBlankMouseLeave.bind(this));
        this.$paperElement.mouseenter(this.handleBlankMouseEnter.bind(this));
        // this.$paperElement.on('mouseup', this.handleBlankPointerUp.bind(this));

        var boundHandleBlankPointerUp = this.handleBlankPointerUp.bind(this);
        Studio.getInstance().getControl().on('mouseup', boundHandleBlankPointerUp);
        this.boundHandleBlankPointerUp = boundHandleBlankPointerUp;

        this.graph.on('change:position', this.handleGraphChangePosition.bind(this));
        this.graph.on('add', this.handleGraphAdd.bind(this));
        this.graph.on('remove', this.handleGraphRemove.bind(this));

        this.makeDroppable();
    };

    DiagramEditorPage.prototype.changeScale = function (scale) {
        this.options.scale = scale;
        if (this.options.scale == 0.8 && !this.$paperElement.hasClass('brtc-va-editors-diagram-diagrameditorpage-paper-scale-normal')) {
            this.$paperElement.removeClass('brtc-va-editors-diagram-diagrameditorpage-paper-scale-small');
            this.$paperElement.addClass('brtc-va-editors-diagram-diagrameditorpage-paper-scale-normal');
            this.paper.scale(this.options.scale);
        } else if (this.options.scale == 0.6 && !this.$paperElement.hasClass('brtc-va-editors-diagram-diagrameditorpage-paper-scale-small')) {
            this.$paperElement.removeClass('brtc-va-editors-diagram-diagrameditorpage-paper-scale-normal');
            this.$paperElement.addClass('brtc-va-editors-diagram-diagrameditorpage-paper-scale-small');
            this.paper.scale(this.options.scale);
        } else if (this.options.scale == 1.0) {
            this.$paperElement.removeClass('brtc-va-editors-diagram-diagrameditorpage-paper-scale-small');
            this.$paperElement.removeClass('brtc-va-editors-diagram-diagrameditorpage-paper-scale-normal');
            this.paper.scale(this.options.scale);
        } else {
            //select same scale twice.
            return;
        }

        var figures = this.graph.getElements();
        for (var i in figures) {
            figures[i].changeScale(this.options.scale);
        }

        this.showSelectionBounds();
        var selected = this.getSelectedFigures();
        if (selected.length > 0) {
            this.ensureCenter(selected[0]);
        } else if (figures.length > 0) {
            this.ensureCenter(figures[0]);
        }

        this.updateMiniMapWindow();
        Brightics.OptModelManager.renderOptModels();
    };

    DiagramEditorPage.prototype.changeTooltipEnabled = function (enabled) {
        this.getEditor().setEditorState(TOOLTIP_ENABLED, enabled);
    };

    DiagramEditorPage.prototype.makeDroppable = function () {
        var _this = this;
        
        /* 다이얼로그의 드래그 이동을 위한 상위 element */
        _this.$mainControl.closest('.brtc-va-editor').droppable({
            accept: '.ui-dialog',
            drop: function(event, ui) {
                /* draggable의 이동시에 intersect되는 모든 droppables의 isover상태가 true가 되기 때문에, drop이 끝난 후 isover를 false로 맞춰주어야 함. */
                $.ui.ddmanager.droppables.default.forEach(d => {
                    d.isover = false;       
                });
            }
        });    
    
        _this.$mainControl.droppable({
            accept: '.brtc-va-studio-dm-draggable',
            activate: function (event, ui) {
                _this.fitToContent();
            },
            deactivate: function (event, ui) {
                if (ui.helper.css('visibility') == 'visible') {
                    _this.fitToContent();
                }
            },
            over: function (event, ui) {
                _this.hideSelectionBounds();
                var figure, x, y, i;
                ui.helper.css('visibility', 'hidden');
                ui.helper.bind('feedback', function (event, eventData) {
                    var pos = _this.paper.clientToLocalPoint({ x: eventData.clientX, y: eventData.clientY });
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
                var pos = _this.paper.clientToLocalPoint({ x: event.clientX, y: event.clientY });

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
                for (i in _this.dropContents.functions) {
                    figure = _this.createFnUnitFigure(_this.dropContents.functions[i]);
                    figure.attributes.dummy = true;
                    _this.dropFigures.push(figure);
                }
                _this.graph.addCells(_this.dropFigures);

                for (i in _this.dropContents.functions) {
                    figure = _this.dropFigures[i];
                    x = pos.x - 50 + _this.dropContents.functions[i].display.diagram.position.x;
                    y = pos.y - 30 + _this.dropContents.functions[i].display.diagram.position.y;
                    figure.position(x, y);
                }

                _this.dropLinks = [];
                for (i in _this.dropContents.links) {
                    var linkFigure = _this.createLinkFigure(_this.dropContents.links[i]);
                    if (linkFigure) {
                        _this.dropLinks.push(linkFigure);
                    }
                }
                _this.graph.addCells(_this.dropLinks);
                $.each(_this.dropLinks, function (index, link) {
                    link.toBack();
                });
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
                _this.showSelectionBounds();
                _this.$parent.trigger('mouseleave');
            },
            drop: function (event, ui) {
                var i, links = [];
                _this.hideGuideBox();

                if (_this.guideMessage) {
                    _this.hideGuideMessage();
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
                    _this.showTools(_this.dropFigures[0]);

                    var commands = new Brightics.VA.Core.CompoundCommand(_this, { label: 'Create a Function' });

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

                    for (let link of links) {
                        commands.add(_this.createConnectFnUnitCommand(link));
                    }
                    _this.fireCommand(commands);
                    _this._rerouteLink();
                }

                _this.dropContents = null;
                _this.dropFigures = [];
                _this.dropLinks = [];

                _this.showSelectionBounds();
            }
        });
    };

    DiagramEditorPage.prototype.handleGraphChangePosition = function (model) {
        var _this = this;
        _this.$createCue.css('display', 'none');

        if (_this.cellPointer.figure == model) {

            var figures = _this.getSelectedFigures();
            if (_this.cellPointer.state === 'Down') {
                figures.forEach(function (fig) {
                    fig.toFront({ deep: true });
                });
            }
            if (_this.cellPointer.state == 'Down' || _this.cellPointer.state == 'Drag') {
                _this.cellPointer.state = 'Drag';
                _this.$parent.trigger('fnUnit:move');
                var prevPosition = model.previousAttributes().position;
                var currPosition = model.attributes.position;

                $.each(figures, function (index, figure) {
                    if (figure !== model) {
                        var xx = figure.attributes.position.x + (currPosition.x - prevPosition.x);
                        var yy = figure.attributes.position.y + (currPosition.y - prevPosition.y);
                        figure.position(xx, yy);
                    }
                });
            }
            $.each(figures, function (index, figure) {
                _this.updateSelectionBox(figure);
                _this.updateErrorBox(figure);
            });

            _this.hideTools(true);
            _this.updateToolsPosition(model);
        } else {
            _this.updateSelectionBox(model);
            _this.updateErrorBox(model);
        }

        _this.updateGuideBox(model);
        _this.hideGuideMessage();

        var messages = _this.validateTranslate([model]);
        for (var cid in messages) {
            _this.showGuideMessage(_this.graph.getCell(cid), messages[cid]);
        }

        _this.fitToContent();
        // Do not reroute the link for performance. by daewon.park
    };

    DiagramEditorPage.prototype.handleGraphAdd = function (model) {
        // Do not reroute the link for performance. by daewon.park
    };

    DiagramEditorPage.prototype.handleGraphRemove = function (model, collection, opt) {
        delete this.translateProblems[model.cid];
        if (model.attributes.type === 'brtc.va.shapes.Link' && opt.ui === true) {
            var link = model;
            model.graph = this.graph;
            var command = this.createDisconnectFnUnitCommand(link);
            this.fireCommand(command);
            this.notification('success', 'The connection was removed.');
        }
        // Do not reroute the link for performance. by daewon.park
    };

    DiagramEditorPage.prototype._rerouteLink = function () {
        var _this = this;
        if (_this.rerouteLinkTask) {
            clearTimeout(_this.rerouteLinkTask);
        }
        _this.rerouteLinkTask = function () {
            var links = _this.graph.getLinks();
            for (var i in links) {
                _this.paper.findViewByModel(links[i]).update();
            }
        };
        setTimeout(_this.rerouteLinkTask, 1000);
    };

    DiagramEditorPage.prototype._clearSelectedLink = function () {
        if (this._selectedLink) {
            this._selectedLink.hideRemoveButton();
            this._selectedLink = undefined;
        }
    };

    DiagramEditorPage.prototype._handleLinkCellPointerDown = function (cellView, evt, x, y) {
        if (!this._isConnectableCell(cellView.model)) {
            this._setBehaviorModeToDefault();
            this._handleDefaultCellPointerDown(cellView, evt, x, y);
            return;
        }

        var fromCell = this._fromCell;
        var toCell = cellView.model;
        var kid = Brightics.VA.Core.Utils.IDGenerator.link.id();
        var link = this._createLinkFigure(kid, fromCell, toCell);
        this.graph.addCells([link]);
        this.paper.findViewByModel(link).update();

        var command = this.createConnectFnUnitCommand(link);
        if (this.fireCommand(command)) {
            link.set('target', { id: cellView.model.id, port: IN_PORT_ID });
        } else {
            link.remove();
            this.notification('warning', 'No connection could be made.');
        }
        cellView.unhighlight();
        this._setBehaviorModeToDefault();
    };

    DiagramEditorPage.prototype._handleDefaultCellPointerDown = function (cellView, evt, x, y) {
        this.cellPointer = {};
        var _this = this;

        if (cellView.model instanceof Brightics.VA.Core.Shapes.FnUnitFigure) {
            setTimeout(function () {
                _this._clearSelectedLink();
            }, 100);
            var figure = cellView.model;

            this.cellPointer.state = 'Down';
            this.cellPointer.figure = figure;

            if (this.getSelectedFigureIds().indexOf(figure.cid) < 0) {
                this.showSelectionBox([figure], false);
            }

            this.hideSelectionBounds();
            this.showGuideBox(figure);
        } else if (cellView.model instanceof Brightics.VA.Core.Shapes.LinkFigure) {
            var selections = this.getSelectedFigureIds();
            for (let selection of selections) {
                var cell = this.graph.getCell(selection);
                if (cell) cell.unselect();
            }
            setTimeout(function () {
                _this._triggerClickOrDoubleClickEvent(selections);
                _this.hideSelectionBounds();
            }, 100);

            cellView.model.toFront();

            var link = cellView.model;
            if (this._selectedLink && link.cid !== this._selectedLink.cid) link.hideRemoveButton();
            link.attributes.action = '';

            if (evt.target.getAttribute('class') == 'marker-arrowhead') {
                link.attributes.action = 'arrowhead-move';
            } else if (evt.target.getAttribute('class') == 'connection-wrap') {
                this._clearSelectedLink();
                this._selectedLink = cellView.model;
                link.showRemoveButton();
            } else {
                try {
                    cellView.model.toFront()
                } catch (ex) {
                    // ignore exception
                }
            }
        }
    };

    DiagramEditorPage.prototype.handleCellPointerDown = function (cellView, evt, x, y) {
        if (this.behaviorMode === BEHAVIOR_LINK) {
            this._handleLinkCellPointerDown(cellView, evt, x, y);
        } else {
            this._handleDefaultCellPointerDown(cellView, evt, x, y);
        }
    };

    DiagramEditorPage.prototype.handleCellPointerUp = function (cellView, evt, x, y) {
        var _this = this, fnUnit, figures;
        _this.hideGuideBox();

        if (cellView.model instanceof Brightics.VA.Core.Shapes.FnUnitFigure) {
            var figure = cellView.model;
            if (_this.cellPointer.state == 'Down') {
                _this.showSelectionBox([figure], true);
            }
            _this.cellPointer.state = 'Up';

            if (_this.guideMessage) {
                // revert position
                _this.hideGuideMessage();

                figures = _this.getSelectedFigures();
                $.each(figures, function (index, f) {
                    _this._revertPosition(f);
                });
            } else {
                var pos = _this.calcGuidePosition(figure);
                figure.position(pos.x, pos.y);

                _this.showTools(figure);

                // fire position changed command
                fnUnit = _this.getFnUnitById(figure.attributes.fid);
                var commands = new Brightics.VA.Core.CompoundCommand(_this, { label: 'Change Position' });
                var prevPosition = fnUnit.display.diagram.position;
                var currPosition = pos;

                figures = _this.getSelectedFigures();
                $.each(figures, function (index, f) {
                    var unit = _this.getFnUnitById(f.attributes.fid);
                    var xx = unit.display.diagram.position.x + (currPosition.x - prevPosition.x);
                    var yy = unit.display.diagram.position.y + (currPosition.y - prevPosition.y);
                    f.position(xx, yy);
                    if (unit.display.diagram.position.x != xx || unit.display.diagram.position.y != yy) {
                        commands.add(_this.createSetFnUnitPositionCommand(f, xx, yy));
                    }
                });

                _this.fireCommand(commands);

                if (figures.length == 1) {
                    setTimeout(function () {
                        _this.ensureCenter(figure);
                    }, 100);
                }
            }

            _this._rerouteLink();
            _this.showSelectionBounds();
            _this.changeCursor(cellView.model, 'pointer');
        } else if (cellView.model instanceof Brightics.VA.Core.Shapes.LinkFigure) {
            var link = cellView.model;
            if (link.attributes.action === 'arrowhead-move') {
                var message = _this.validateConnect([link]);
                if (message) {
                    _this.notification('warning', message);
                    _this._revertLink(link);
                } else {
                    var command = this.createReconnectFnUnitCommand(link);
                    this.fireCommand(command);
                    this._clearSelectedLink();
                }
            }
        }
    };

    DiagramEditorPage.prototype.handleCellMouseOver = function (cellView, evt) {
        if (this.behaviorMode === BEHAVIOR_LINK) {
            for (var i = 0; i < this._connectableFigures.length; i++) {
                if (this._connectableFigures[i].cid === cellView.model.cid) {
                    cellView.highlight();
                }
            }
        } else if (this.$dragSelection.css('display') != 'block' && this.cellPointer.state != 'Drag') {
            this.showTools(cellView.model);
            this.showToolTip(cellView.model);
        }
    };

    DiagramEditorPage.prototype.handleCellMouseOut = function (cellView, evt) {
        if (cellView.model !== this._fromCell) {
            cellView.unhighlight();
        }
        this.hideTools();
        this.hideToolTip();
    };

    DiagramEditorPage.prototype.handleBlankPointerDown = function (evt, x, y) {
        if (evt.button === 0) {
            this.$dragSelection.css({
                display: 'block',
                width: 0,
                height: 0
            });
            this.$dragSelection.attr('start-x', x * this.options.scale);
            this.$dragSelection.attr('start-y', y * this.options.scale);
        }

        if (this.behaviorMode === BEHAVIOR_LINK) {
            this._setBehaviorModeToDefault();
        } else {
            this._clearSelectedLink();
        }

        if (this.getEditor().getSheetEditorPageArea().css('visibility') == 'hidden') {
            var _this = this;
            var selections = this.getSelectedFigureIds();
            for (let selection of selections) {
                var cell = this.graph.getCell(selection);
                if (cell) cell.unselect();
            }
            setTimeout(function () {
                _this._triggerClickOrDoubleClickEvent(selections);
                _this.hideSelectionBox();
            }, 100);
        }
    };

    DiagramEditorPage.prototype.handleBlankPointerMove = function (evt, x, y) {
        var _this = this;
        var paperOffset = this.$paperElement.offset();
        var x = evt.pageX - paperOffset.left, y = evt.pageY - paperOffset.top;
        if (this.$dragSelection.css('display') == 'block') {
            var startX = this.$dragSelection.attr('start-x');
            var startY = this.$dragSelection.attr('start-y');
            this.$dragSelection.css({
                left: Math.min(x, startX),
                top: Math.min(y, startY),
                width: Math.abs(x - startX),
                height: Math.abs(y - startY)
            });
            setTimeout(function () {
                _this._triggerClickOrDoubleClickEvent([]);
            }, 100);
        }

        if (this.$dragSelection.css('display') == 'none' &&
            this.$tools.css('display') == 'none' &&
            this.$guideBox.css('display') == 'none' && y >= 30) {
            var xx = x;
            var yy = y;
            var gap_width = this.GAP_WIDTH || Brightics.VA.Env.Diagram.GAP_WIDTH;
            var gap_height = this.GAP_HEIGHT || Brightics.VA.Env.Diagram.GAP_HEIGHT;
            var total_width = Brightics.VA.Env.Diagram.FIGURE_WIDTH + gap_width;
            var total_height = Brightics.VA.Env.Diagram.FIGURE_HEIGHT + gap_height;
            var differenceX = xx % Number.parseInt(total_width * this.options.scale);
            var differenceY = yy % Number.parseInt(total_height * this.options.scale);
            xx = xx - differenceX;
            xx = xx + Number.parseInt(Brightics.VA.Env.Diagram.PAPER_MARGIN_LEFT * this.options.scale);
            yy = yy - differenceY;
            yy = yy + Number.parseInt(Brightics.VA.Env.Diagram.PAPER_MARGIN_TOP * this.options.scale);
            var models = this.graph.findModelsFromPoint({
                x: xx / this.options.scale,
                y: yy / this.options.scale
            });

            if (models.length == 0) {
                this.$createCue.attr('mousedown', false);
                this.$createCue.css({ display: 'flex', left: xx, top: yy });

                var label = Brightics.VA.SettingStorage.getValue('editor.function.add.doubleclick') !== 'true' ? Brightics.locale.common.click : Brightics.locale.common.doubleClick;
                this.$createCue.find('.brtc-va-editors-diagram-diagrameditorpage-function-cue-create-label').first().text(label);
            }
        }
    };

    DiagramEditorPage.prototype.handleBlankPointerUp = function (evt, x, y) {
        var _this = this;

        if (this.$dragSelection.css('display') == 'block') {
            var width = this.$dragSelection.width();
            var height = this.$dragSelection.height();
            if (width > 10 && height > 10) {
                var pos = this.$dragSelection.position();
                var bounds = new g.rect(pos.left / this.options.scale, pos.top / this.options.scale, width / this.options.scale, height / this.options.scale);
                var models = this.graph.findModelsInArea(bounds);
                if (models.length > 0) {
                    this.showSelectionBox(models);
                    if (models.length == 1) setTimeout(function () {
                        _this.ensureCenter(models[0]);
                    }, 100);
                }
            }

            this.$dragSelection.css({
                display: 'none'
            });
        }
    };


    DiagramEditorPage.prototype.configureSelectionBounds = function (figures) {
        this.$multiTools.toggleClass('single-selected', figures.length === 1);
    };

    DiagramEditorPage.prototype.showSelectionBounds = function () {
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
            var height = ((selectedRect.bottom - selectedRect.top) * this.options.scale);
            if (Brightics.VA.Implementation.DataFlow && this.getModel().type === Brightics.VA.Implementation.DataFlow.Clazz) {
                height += 7;
            }
            this.$selectedBounds.css({ display: 'block', top: top, left: left, width: width, height: height });
        } else {
            this.$selectedBounds.css({
                display: 'none'
            });
        }
        this.getEditor().setEditorState('readonly-figure-selected', readOnlyFigureSelected);
        this.$multiTools
            .toggleClass('readonly-figure-selected',
                readOnlyFigureSelected);
    };

    DiagramEditorPage.prototype.hideSelectionBounds = function () {
        if (this.$selectedBounds) this.$selectedBounds.hide();
    };

    DiagramEditorPage.prototype.showSelectionBox = function (figures, triggerEvent) {
        var _this = this;
        var i;
        var oldSelections = this.getSelectedFigureIds();
        var fnUnitIds = [];
        this.$paperElement.children('.brtc-va-editors-diagram-diagrameditorpage-function-selected').remove();
        for (i in figures) {
            if (figures[i] instanceof Brightics.VA.Core.Shapes.FnUnitFigure) {
                var $selected = $('<div class="brtc-va-editors-diagram-diagrameditorpage-function-selected"></div>');
                $selected.attr('cid', figures[i].cid);
                $selected.css({
                    top: figures[i].attributes.position.y - 1,
                    left: figures[i].attributes.position.x - 2
                });
                this.$paperElement.prepend($selected);

                fnUnitIds.push(figures[i].attributes.fid);
            }
        }

        var newSelections = this.getSelectedFigureIds();
        for (let oldSelection of oldSelections) {
            var cell = this.graph.getCell(oldSelection);
            if (cell) cell.unselect();
        }
        for (i in figures) {
            figures[i].select();
        }

        var fireEvent = false;
        if (triggerEvent == true) {
            fireEvent = true;
        } else if (triggerEvent == false) {
            fireEvent = false;
        } else {
            fireEvent = JSON.stringify(oldSelections) !== JSON.stringify(newSelections);
        }
        if (fireEvent) {
            setTimeout(function () {
                _this._triggerClickOrDoubleClickEvent(fnUnitIds);
            }, 100);
        }

        this.configureSelectionBounds(figures);
        this.showSelectionBounds();
    };

    DiagramEditorPage.prototype.updateSelectionBox = function (figure) {
        if (figure instanceof Brightics.VA.Core.Shapes.FnUnitFigure) {
            var $selected = this.$paperElement.children('.brtc-va-editors-diagram-diagrameditorpage-function-selected[cid="' + figure.cid + '"]');
            $selected.css({
                top: figure.attributes.position.y - 3,
                left: figure.attributes.position.x - 3
            });
        }
    };

    DiagramEditorPage.prototype.hideSelectionBox = function (figure) {
        var oldSelections = this.getSelectedFigureIds();

        if (figure) {
            figure.unselect();

            var $selected = this.$paperElement.children('.brtc-va-editors-diagram-diagrameditorpage-function-selected[cid="' + figure.cid + '"]');
            $selected.remove();
        } else {
            this.$paperElement.children('.brtc-va-editors-diagram-diagrameditorpage-function-selected').remove();
        }

        var newSelections = this.getSelectedFigureIds();
        if (JSON.stringify(oldSelections) !== JSON.stringify(newSelections)) {
            var fnUnitIds = [];
            for (let cid of newSelections) {
                fnUnitIds.push(this.graph.getCell(cid).attributes.fid);
            }

            for (let oldSelection of oldSelections) {
                var cell = this.graph.getCell(oldSelection);
                if (cell) cell.unselect();
            }
            for (let newSelection of newSelections) {
                this.graph.getCell(newSelection).select();
            }

            var _this = this;
            setTimeout(function () {
                _this._triggerClickOrDoubleClickEvent(fnUnitIds);
            }, 100);
        }

        this.showSelectionBounds();
    };

    DiagramEditorPage.prototype._triggerClickOrDoubleClickEvent = function (fnUnitIds) {
        var _this = this;
        var unset = function (obj, path) {
            if (obj[path]) {
                obj[path] = undefined;
                delete obj[path];
            }
        };
        if (fnUnitIds.length == 1) {
            if (this.prvFnUnitSelectTrigger[fnUnitIds[0]]) {
                this.$parent.trigger('fnUnit:dbclick', [fnUnitIds]);
                clearTimeout(_this.prvFnUnitSelectTrigger[fnUnitIds[0]]);
                unset(this.prvFnUnitSelectTrigger, fnUnitIds[0]);
            } else {
                this.prvFnUnitSelectTrigger[fnUnitIds[0]] = setTimeout(function () {
                    _this.$parent.trigger('fnUnit:select', [fnUnitIds]);
                    clearTimeout(_this.prvFnUnitSelectTrigger[fnUnitIds[0]]);
                    unset(_this.prvFnUnitSelectTrigger, fnUnitIds[0]);
                }, DOUBLE_CLICK_INTERVAL);
            }
        } else {
            this.$parent.trigger('fnUnit:select', [fnUnitIds]);
        }
    };

    DiagramEditorPage.prototype.showErrorBox = function (figures) {
        for (var i in figures) {
            if (figures[i] instanceof Brightics.VA.Core.Shapes.FnUnitFigure) {
                figures[i].showError();
            }
        }
    };

    DiagramEditorPage.prototype.updateErrorBox = function (figure) {
    };

    DiagramEditorPage.prototype.hideErrorBox = function () {
        var figures = this.graph.getElements();
        for (var i in figures) {
            figures[i].hideError();
        }
    };

    DiagramEditorPage.prototype.createToolTip = function () {
        this.$validationTooltip = $('<div class="brtc-va-editors-diagram-diagrameditorpage-function-tools-validation-tooltip"></div>');
        this.$tools.append(this.$validationTooltip);
        this.$validationTooltip.css('display', 'none');

    };

    DiagramEditorPage.prototype.showValidationToolTip = function (figure) {
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

    DiagramEditorPage.prototype.hideValidationToolTip = function () {
        if (this.$validationTooltip) this.$validationTooltip.css('display', 'none');
    };

    DiagramEditorPage.prototype.validateTranslate = function (figures) {
        for (var i in figures) {
            var figure = figures[i];
            var message;
            if (this.checkOverPosition(figure) === false) message = 'Can not move over other function.';
            else if (this.checkOutRangePosition(figure) === false) message = 'Can not move out of range.';
            if (message) {
                this.translateProblems[figure.cid] = message;
            } else {
                delete this.translateProblems[figure.cid];
            }
        }

        return this.translateProblems;
    };

    DiagramEditorPage.prototype.validateConnect = function (links) {
        for (var i in links) {
            var link = links[i];
            if (this.checkConnectedLink(link) === false) return 'No connection could be made.';
            else if (this.checkLoopLink(link) === false) return 'No connection could be made because connection loop.';
            else if (this.checkAlreadyExistLink(link) === false) return 'No connection could be made because connection already exists.';

            if (this.checkAlreadyExistLinkByTableId(link) === false) return 'No connection could be made because connection already exists.';
        }
    };

    DiagramEditorPage.prototype.notification = function (template, message) {
        var editor = Brightics.VA.Core.Utils.WidgetUtils.getModelEditorRef(this.$mainControl);
        editor.notification(template, message);
    };

    DiagramEditorPage.prototype.createCue = function () {
        var _this = this;
        var closeHandler = function (dialogResult) {
            if (dialogResult.OK) {
                var fnUnit = _this.getModel().newFnUnit(dialogResult.func);
                var pos = dialogResult.position;
                fnUnit.display.diagram.position = _this.calcGuideLocation(pos.left / _this.options.scale, pos.top / _this.options.scale);
                var figure = _this.createFnUnitFigure(fnUnit);
                _this.graph.addCells([figure]);

                var command = new Brightics.VA.Core.CompoundCommand(_this, { label: 'Create a Function' });
                var links = [];
                if (Brightics.VA.SettingStorage.getValue('editor.diagram.autoconnect') === 'true') links = _this.connectSmartly(figure);
                if (links.length > 0) {
                    command.add(_this.createNewFnUnitCommand(figure, fnUnit));
                    for (let link of links) {
                        command.add(_this.createConnectFnUnitCommand(link));
                    }
                } else {
                    command.add(_this.createNewFnUnitCommand(figure, fnUnit));
                }
                _this.fireCommand(command);
                _this.$createCue.css({ display: 'none' });
                _this.showSelectionBox([figure]);
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
            _this.$createCue.attr('mousedown', true);
            var localPoint = _this.paper.snapToGrid({ x: event.clientX, y: event.clientY });
            _this.$dragSelection.css({
                display: 'block',
                width: 0,
                height: 0
            });
            _this.$dragSelection.attr('start-x', localPoint.x * _this.options.scale);
            _this.$dragSelection.attr('start-y', localPoint.y * _this.options.scale);
        });

        this.$createCue.find('.brtc-va-editors-diagram-diagrameditorpage-function-cue-create-label-wrapper').mouseup(function (event) {
            if (Brightics.VA.SettingStorage.getValue('editor.function.add.doubleclick') === 'true') return;
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

    DiagramEditorPage.prototype.createFnUnitToolbar = function () {
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
        this.createStartRunToolItem();
        this.createCloneAndConnectToolItem();
        this.createConnectToolItem();
        this.createCloneToolItem();
        this.createEnterToolItem();
        this.createPopupToolItem();
        // this.createToolTip();
    };

    DiagramEditorPage.prototype.createEnterToolItem = function () {
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

    DiagramEditorPage.prototype.createPopupToolItem = function () {
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
                case "unloadModel":
                    TargetDialog = Brightics.VA.Core.Dialogs.UnloadModelSettingDialog;
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

    DiagramEditorPage.prototype.createSetDialogFnUnitCommand = function (newFnUnit, oldFnUnit) {
        var commands = new Brightics.VA.Core.CompoundCommand(this, { label: 'Change a Function' });

        var paramCommand = new Brightics.VA.Core.Editors.Diagram.Commands.SetDialogFnUnitCommand(this, {
            fnUnit: oldFnUnit,
            ref: { param: newFnUnit.param }
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

    DiagramEditorPage.prototype.createConfigurationCommand = function (param, fnUnit) {
        var commandOption = {
            fnUnit: fnUnit,
            ref: { param: param }
        };

        var command = new Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitParameterValueCommand(this, commandOption);
        var modelEditorRef = Brightics.VA.Core.Utils.WidgetUtils.getModelEditorRef(this.$mainControl);
        if (modelEditorRef) {
            modelEditorRef.getCommandManager().execute(command);
        }
    };

    DiagramEditorPage.prototype.createRemoveToolItem = function () {
        var _this = this;

        var $remove = $('<div class="brtc-va-editors-diagram-diagrameditorpage-function-tools brtc-va-editors-diagram-diagrameditorpage-function-tools-remove" title="Remove"></div>');
        this.$tools.append($remove);

        $remove.click(function () {
            var cid = _this.$tools.attr('cid');
            var figure = _this.graph.getCell(cid);
            _this.removeFnUnitFigure(figure);
            _this.hideTools(true);
        });
        this.toolItems.remove = $remove;
    };

    DiagramEditorPage.prototype.createClearLinkToolItem = function () {
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

    DiagramEditorPage.prototype.createShiftLeftToolItem = function () {
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
                _this.hideSelectionBounds();
            }
        });
        this.toolItems.shiftLeft = $shiftLeft;
    };

    DiagramEditorPage.prototype.createShiftRightToolItem = function () {
        var _this = this;

        var $shiftRight = $('<div class="brtc-va-editors-diagram-diagrameditorpage-function-tools brtc-va-editors-diagram-diagrameditorpage-function-tools-shiftright brtc-style-flex-center"><i class="fa fa-angle-double-right fa-lg"></i></div>');
        this.$tools.append($shiftRight);

        $shiftRight.click(function () {
            var cid = _this.$tools.attr('cid');
            var figure = _this.graph.getCell(cid);
            var command = _this.createShiftRightCommand(figure);
            _this.fireCommand(command);
            _this.hideSelectionBounds();
        });
        this.toolItems.shiftRight = $shiftRight;
    };

    DiagramEditorPage.prototype.createSwitchToolItem = function () {
        var _this = this;

        var $switch = $('<div class="brtc-va-editors-diagram-diagrameditorpage-function-tools brtc-va-editors-diagram-diagrameditorpage-function-tools-switch" title="Change Function"></div>');
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

    DiagramEditorPage.prototype.createStartRunToolItem = function () {
        //do nothing
    };

    DiagramEditorPage.prototype.createCloneAndConnectToolItem = function () {
        var _this = this;

        var $cloneAndConnect = $('<div class="brtc-va-editors-diagram-diagrameditorpage-function-tools brtc-va-editors-diagram-diagrameditorpage-function-tools-cloneandconnect"><i class="fa fa-random"></i></div>');
        this.$tools.append($cloneAndConnect);
        $cloneAndConnect.click(function () {
            _this.notification('info', 'Click and drag to clone and connect function in one go');
        });

        $cloneAndConnect.draggable({
            appendTo: _this.$paperElement,
            helper: function (event) {
                return $('<div class="brtc-va-editors-diagram-diagrameditorpage-function-tools-clone-helper"></div>');
            },
            start: function (event, ui) {
                var cid = _this.$tools.attr('cid');
                var model = _this.graph.getCell(cid);

                // need to change about 'id' & 'out-table'
                var duplicated = model.clone();
                duplicated.category = model.category;
                duplicated.unselect();

                _this.duplicatedFnUnit = Brightics.VA.Core.Utils.ModelUtils.cloneFnUnit(_this.getFnUnitById(duplicated.attributes.fid));

                duplicated.attributes.dummy = true;
                duplicated.attributes.fid = _this.duplicatedFnUnit.fid;

                var x = ui.position.left - model.attributes.position.x;
                var y = ui.position.top - model.attributes.position.y;
                duplicated.translate(x, y);
                _this.graph.addCells([duplicated]);
                duplicated.toFront({ deep: true });

                ui.helper.attr('cid', duplicated.cid);
                _this.showGuideBox(duplicated);

                if (duplicated.attributes.inputtable) {
                    var linkUnit = {
                        kid: Brightics.VA.Core.Utils.IDGenerator.link.id(),
                        'sourceFid': model.attributes.fid,
                        'targetFid': duplicated.attributes.fid
                    };
                    var link = _this.createLinkFigure(linkUnit);
                    if (link) {
                        _this.graph.addCells([link]);
                        link.toBack();
                        ui.helper.attr('link-cid', link.cid);
                    }
                }
            },
            drag: function (event, ui) {
                var cid = ui.helper.attr('cid');
                var duplicated = _this.graph.getCell(cid);
                var x = ui.position.left - duplicated.attributes.position.x;
                var y = ui.position.top - duplicated.attributes.position.y;
                duplicated.translate(x, y);
            },
            stop: function (event, ui) {
                var cid, duplicated, linkId, link;
                if (_this.guideMessage) {
                    _this.hideGuideBox();
                    _this.hideGuideMessage();

                    cid = ui.helper.attr('cid');
                    linkId = ui.helper.attr('link-cid');
                    if (linkId) {
                        _this.graph.getCell(linkId).remove();
                    }
                    _this.graph.getCell(cid).remove();
                } else {
                    cid = ui.helper.attr('cid');
                    duplicated = _this.graph.getCell(cid);
                    var x = ui.position.left - duplicated.attributes.position.x;
                    var y = ui.position.top - duplicated.attributes.position.y;
                    duplicated.translate(x, y);
                    var pos = _this.calcGuidePosition(duplicated);
                    duplicated.attributes.dummy = false;
                    duplicated.position(pos.x, pos.y);

                    _this.hideGuideBox();

                    var commands = new Brightics.VA.Core.CompoundCommand(_this, { label: 'Clone and Connect' });
                    commands.add(_this.createNewFnUnitCommand(duplicated, _this.duplicatedFnUnit));
                    commands.add(_this.createSetFnUnitPositionCommand(duplicated, pos.x, pos.y));

                    linkId = ui.helper.attr('link-cid');
                    if (linkId) {
                        link = _this.graph.getCell(linkId);
                        commands.add(_this.createConnectFnUnitCommand(link));
                    }

                    _this.fireCommand(commands);

                    var closeHandler = function (dialogResult) {
                        if (dialogResult.OK) {
                            var currUnit = _this.duplicatedFnUnit;
                            if (currUnit.func !== dialogResult.func) {
                                var replaceUnit = _this.getModel().newFnUnit(dialogResult.func);
                                replaceUnit.display.diagram.position = $.extend({}, currUnit.display.diagram.position);
                                var command = _this.createSwitchFnUnitCommand(duplicated, replaceUnit, currUnit);
                                command.event.source = this;
                                _this.fireCommand(command);
                            }
                        }

                        _this.switchFnUnitDialog = null;
                    };
                    _this.switchFnUnitDialog = new Brightics.VA.Core.Dialogs.SwitchFnUnitDialog(ui.helper, {
                        preFnUnit: _this.duplicatedFnUnit,
                        modelType: _this.getModel().type,
                        close: closeHandler
                    });
                }
            }
        });
        this.toolItems.cloneAndConnect = $cloneAndConnect;
    };

    DiagramEditorPage.prototype.setConnectToolItemVisible = function (visibled) {
        var connectTool = this.$tools.find('.brtc-va-editors-diagram-diagrameditorpage-function-tools-connect');
        if (!visibled) {
            connectTool.css('display', 'none');
        } else {
            connectTool.css('display', 'block');
        }
    };

    DiagramEditorPage.prototype._findConnectableFigures = function (fromCell) {
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

        for (var i in _link) {
            connectedCellCids.push(_link[i].getTargetElement().cid);
        }

        for (let connectableFid of connectableFids) {
            figure = this.getFigureByFnUnitId(connectableFid);
            if (fromCell.attributes.connectableFunctions) {
                if (connectedCellCids.indexOf(figure.cid) < 0) {
                    connectableFigures.push(figure);
                    figure.setCursorType('pointer');
                }
            } else {
                if (figure.attributes.inputtable && connectedCellCids.indexOf(figure.cid) < 0) {
                    connectableFigures.push(figure);
                    figure.setCursorType('pointer');
                }
            }
        }

        return connectableFigures;
    };

    DiagramEditorPage.prototype._setBehaviorModeToLink = function () {
        var _this = this;
        this.behaviorMode = BEHAVIOR_LINK;
        var figures = this.graph.getElements();
        for (var i in figures) {
            if (figures[i] instanceof Brightics.VA.Core.Shapes.FnUnitFigure) {
                if (!this._isConnectableCell(figures[i])) {
                    figures[i].setOnShade();
                }
            }
        }

        setTimeout(function () {
            _this._clearSelectedLink();
            _this.hideSelectionBox();
        }, 100);
    };

    DiagramEditorPage.prototype._setBehaviorModeToDefault = function () {
        this.behaviorMode = BEHAVIOR_DEFAULT;
        var figures = this.graph.getElements();
        for (var i in figures) {
            if (figures[i] instanceof Brightics.VA.Core.Shapes.FnUnitFigure) {
                figures[i].setOffShade();
                figures[i].setCursorType('inherit');
            }
        }
        this._connectableFigures = [];
        this._unhighlightAll();
    };


    DiagramEditorPage.prototype._isConnectableCell = function (figure) {
        var isConnectable = false;
        for (var i in this._connectableFigures) {
            if (this._connectableFigures[i] === figure) {
                isConnectable = true;
                break;
            }
        }
        return isConnectable;
    };

    DiagramEditorPage.prototype.createConnectToolItem = function () {
        var _this = this;
        var fromCell, link;
        var $link = $('<div class="brtc-va-editors-diagram-diagrameditorpage-function-tools brtc-va-editors-diagram-diagrameditorpage-function-tools-connect" title="Connect"></div>');
        this.$tools.append($link);

        $link.click(function () {
            _this.cellPointer = {};
            _this.cellPointer.state = 'link';

            var cid = _this.$tools.attr('cid');
            fromCell = _this.graph.getCell(cid);
            var fromCellView = _this.paper.findViewByModel(fromCell);
            _this._highlightedViews.push(fromCellView);
            fromCellView.highlight();
            _this._connectableFigures = _this._findConnectableFigures(fromCell);
            _this._fromCell = fromCell;
            _this._setBehaviorModeToLink();
        });

        $link.draggable({
            appendTo: _this.$paperElement,
            helper: function (event) {
                return $('<div class="brtc-va-editors-diagram-diagrameditorpage-function-tools-link-helper"></div>');
            },
            start: function (event, ui) {
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
                var models = _this.graph.findModelsFromPoint({
                    x: ui.position.left / _this.options.scale,
                    y: ui.position.top / _this.options.scale
                });
                _this._unhighlightAll();

                var sourceModel = fromCell;

                if (models.length > 0 && _this._isConnectableFnUnit(sourceModel, models[0])) {
                    link.set('target', { id: models[0].id, port: IN_PORT_ID });
                    _this.paper.findViewByModel(link).update();
                    var highlightedView = _this.paper.findViewByModel(models[0]);
                    _this._highlightedViews.push(highlightedView);
                    highlightedView.highlight();
                } else {
                    link.set('target', {
                        x: ui.position.left / _this.options.scale,
                        y: ui.position.top / _this.options.scale
                    });
                    _this.paper.findViewByModel(link).update();
                }
            },
            stop: function (event, ui) {
                _this._unhighlightAll();
                var models = _this.graph.findModelsFromPoint({
                    x: ui.position.left / _this.options.scale,
                    y: ui.position.top / _this.options.scale
                });
                if (models.length > 0) {
                    if (link.attributes.source.id == models[0].id) {
                        link.remove();
                        _this.notification('warning', 'No connection could be made because connection loop.');
                    } else {
                        var message = _this.validateConnect([link]);
                        if (message) {
                            _this.notification('warning', message);
                            link.remove();
                        } else {
                            var command = _this.createConnectFnUnitCommand(link);
                            if (_this.fireCommand(command)) {
                                link.set('target', { id: models[0].id, port: IN_PORT_ID });
                                _this.paper.findViewByModel(link).update();
                            } else {
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

    DiagramEditorPage.prototype._isConnectableFnUnit = function (fromCell, targetCell) {

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

    DiagramEditorPage.prototype._unhighlightAll = function () {
        for (var i = 0; i < this._highlightedViews.length; i++) {
            this._highlightedViews[i].unhighlight();
        }
        this._highlightedViews = [];
    };

    DiagramEditorPage.prototype.createCloneToolItem = function () {
        var _this = this;

        var $duplicate = $('<div class="brtc-va-editors-diagram-diagrameditorpage-function-tools brtc-va-editors-diagram-diagrameditorpage-function-tools-clone" title="Duplicate"></div>');
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
                duplicated.toFront({ deep: true });

                ui.helper.attr('cid', duplicated.cid);
                _this.showGuideBox(duplicated);
            },
            drag: function (event, ui) {
                var cid = ui.helper.attr('cid');
                var duplicated = _this.graph.getCell(cid);
                var x = ui.position.left / _this.options.scale - duplicated.attributes.position.x;
                var y = ui.position.top / _this.options.scale - duplicated.attributes.position.y;
                duplicated.translate(x, y);
            },
            stop: function (event, ui) {
                var cid, duplicated;
                if (_this.guideMessage) {
                    _this.hideGuideBox();
                    _this.hideGuideMessage();

                    cid = ui.helper.attr('cid');
                    _this.graph.getCell(cid).remove();
                } else if (_this.getFunctionsLength() + 1 > _this.MAX_FUNC_COUNT) {
                    _this.hideGuideBox();
                    _this.hideGuideMessage();

                    cid = ui.helper.attr('cid');
                    _this.graph.getCell(cid).remove();
                    Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog(_this.MAX_FUNC_MESSAGE);
                } else {
                    cid = ui.helper.attr('cid');
                    duplicated = _this.graph.getCell(cid);
                    var x = ui.position.left / _this.options.scale - duplicated.attributes.position.x;
                    var y = ui.position.top / _this.options.scale - duplicated.attributes.position.y;
                    duplicated.translate(x, y);
                    _this.hideGuideBox();
                    var pos = _this.calcGuidePosition(duplicated);
                    duplicated.position(pos.x, pos.y);
                    duplicated.attributes.dummy = false;

                    var links = [];
                    if (Brightics.VA.SettingStorage.getValue('editor.diagram.autoconnect') === 'true') links = _this.connectSmartly(duplicated);

                    var commands = new Brightics.VA.Core.CompoundCommand(_this, { label: 'Clone a Function' });

                    commands.add(_this.createNewFnUnitCommand(duplicated,
                        _this.duplicatedFnUnit,
                        _this.duplicatedDummyModel));

                    commands.add(_this.createSetFnUnitPositionCommand(duplicated, pos.x, pos.y));
                    for (let link of links) {
                        commands.add(_this.createConnectFnUnitCommand(link));
                    }
                    _this.fireCommand(commands);
                    _this.showSelectionBox([duplicated]);
                }
            }
        });
        this.toolItems.duplicate = $duplicate;
    };

    DiagramEditorPage.prototype.createMultiSelectionToolbar = function () {
        var _this = this;

        this.$multiTools = this.$mainControl.find('.brtc-va-editors-diagram-diagrameditorpage-function-multiselected');
        this.$multiTools.append('' +
            '<div class="brtc-va-editors-diagram-diagrameditorpage-function-multiselected-toolbar">' +
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
            for (let removeLink of removeLinks) {
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

            if (mid != _this.getEditor().activeModel.mid) {
                return Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog(
                    "OPT models cannot be made in inner models."
                );
            }

            var figures = _this.getSelectedFigures();
            var fids = JointConverter.convertFigures2Fids(figures);
            var hash = fids.sort().join("_");

            var optModels = _this.getEditor().activeModel.optModels;
            for (var key in optModels) {
                if (optModels[key].hash == hash) {
                    return Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog(
                        "This OPT model already exists."
                    );
                }
            }

            var command = Brightics.OptModelManager.createNewOptModelCommand(pid, mid, fids);
            _this.fireCommand(command);
        });
    };

    DiagramEditorPage.prototype._collectInnerModels = function (mainModel, model) {
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

    DiagramEditorPage.prototype.makeTemplate = function () {
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
        for (let kid of kids) {
            var linkUnit = this.getLinkUnitById(kid);
            var findCount = 0;
            for (j in template.functions) {
                if (template.functions[j].fid == linkUnit[SOURCE_FID]) findCount++;
                if (template.functions[j].fid == linkUnit[TARGET_FID]) findCount++;
                if (findCount == 2) break;
            }
            if (findCount == 2) {
                template.links.push($.extend(true, {}, linkUnit));
            }
        }

        template.functions.sort(function (a, b) {
            if (a.display.diagram.position.x == b.display.diagram.position.x) {
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
                OUT_DATA
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
                if (isNotProcessFn(fn) && fn[IN_DATA]) {
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
                } else if (isProcessFn(fn)) {
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
                if (isNotProcessFn(fn) && FnUnitUtils.hasInput(fn) && FnUnitUtils.hasMeta(fn)) {
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

    DiagramEditorPage.prototype.createNewFnUnitCommand = function (figure, fnUnit, dummyMainModel) {
        figure.attributes.fid = fnUnit.fid;
        var _this = this;
        var commands = [];

        if (fnUnit[FUNCTION_NAME] !== 'DataViewer' && fnUnit.skip) {
            fnUnit.skip = false;
        }

        commands.push(new Brightics.VA.Core.Editors.Diagram.Commands.NewFnUnitCommand(this, { fnUnit: fnUnit }));

        var options = (function (fnUnit) {
            var ret = [];
            if (fnUnit.func === 'if') {
                ret.push({ mid: fnUnit.param.if.mid, type: fnUnit.func, conditionType: 'if' });
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

    DiagramEditorPage.prototype.getActivityModels = function (fnUnit) {
        var models = Brightics.VA.Core.Utils.NestedFlowUtils
            .getSubModels(this.getEditor().getModel(), fnUnit);

        return _.map(models, function (model) {
            return model.mid;
        });
    };

    DiagramEditorPage.prototype.createRemoveFnUnitCommand = function (figure) {
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

    DiagramEditorPage.prototype.createSetFnUnitPositionCommand = function (figure, x, y) {
        return new Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitPositionCommand(this, {
            fid: figure.attributes.fid,
            position: { x: x, y: y }
        });
    };

    DiagramEditorPage.prototype.createShiftLeftCommand = function (figure) {
        return new Brightics.VA.Core.Editors.Diagram.Commands.ShiftLeftCommand(this, {
            fid: figure.attributes.fid
        });
    };

    DiagramEditorPage.prototype.createShiftRightCommand = function (figure) {
        return new Brightics.VA.Core.Editors.Diagram.Commands.ShiftRightCommand(this, {
            fid: figure.attributes.fid
        });
    };

    DiagramEditorPage.prototype.createSwitchFnUnitCommand = function (figure, fnUnit, prvFnUnit) {
        return new Brightics.VA.Core.Editors.Diagram.Commands.SwitchFnUnitCommand(this, {
            modelType: this.getModel().type,
            fid: figure.attributes.fid,
            fnUnit: fnUnit,
            prvFnUnit: prvFnUnit
        });
    };

    DiagramEditorPage.prototype.createConnectFnUnitCommand = function (link, isMaintainIntable) {
        var commands = new Brightics.VA.Core.CompoundCommand(this, {
            label: 'Connect a Function'
        });

        let connectFnUnit = {
            kid: link.attributes.kid,
            'sourceFid': link.getSourceElement().attributes.fid,
            'targetFid': link.getTargetElement().attributes.fid
        };
        if (isMaintainIntable === true) {
            connectFnUnit.isMaintainIntable = isMaintainIntable;
        }

        commands.add(new Brightics.VA.Core.Editors.Diagram.Commands.ConnectFnUnitCommand(this, connectFnUnit));
        return commands;
    };

    DiagramEditorPage.prototype.createDisconnectFnUnitCommand = function (link) {
        return new Brightics.VA.Core.Editors.Diagram.Commands.DisconnectFnUnitCommand(this, {
            kid: link.attributes.kid,
            'sourceFid': link.getSourceElement().attributes.fid,
            'targetFid': link.getTargetElement().attributes.fid
        });
    };

    DiagramEditorPage.prototype.createReconnectFnUnitCommand = function (link) {
        return new Brightics.VA.Core.Editors.Diagram.Commands.ReconnectFnUnitCommand(this, {
            kid: link.attributes.kid,
            'sourceFid': link.getSourceElement().attributes.fid,
            'targetFid': link.getTargetElement().attributes.fid
        });
    };

    DiagramEditorPage.prototype.fireCommand = function (command) {
        if (command.constructor === Brightics.VA.Core.CompoundCommand) {
            if (command.commandList.length === 0) {
                return false;
            }
        }

        var editor = Brightics.VA.Core.Utils.WidgetUtils.getModelEditorRef(this.$mainControl);
        return editor.getCommandManager().execute(command);
    };

    DiagramEditorPage.prototype.registerDebugListener = function () {
        var _this = this;
        this.debugListener = function (event, eventData) {
            var selected = _this.$mainControl.closest('.brtc-va-editor-wrapper').hasClass('selected');
            if (!selected) return;

            if (eventData.mid == _this.getModel().mid) {
                if (eventData.eventType == 'BEGIN-PROCESS'
                    && eventData.launchOptions.mode !== 'unit') {
                    _this.hideSelectionBox();
                } else if (eventData.eventType == 'END-UNIT') {
                    _this.renderCompletedFnUnit(eventData);
                }
            }
        };

        Studio.getInstance().addDebugListener(this.debugListener);
    };

    DiagramEditorPage.prototype.registerCommandEventListener = function () {
        var _this = this;
        var modelEditorRef = Brightics.VA.Core.Utils.WidgetUtils.getModelEditorRef(this.$mainControl);

        modelEditorRef.addCommandListener(this.onCommand.bind(_this));
    };

    DiagramEditorPage.prototype.onCommand = function (command) {
        if (this.behaviorMode === BEHAVIOR_LINK) {
            this._setBehaviorModeToDefault();
        } else {
            this._clearSelectedLink();
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

    DiagramEditorPage.prototype.onCompoundCommand = function (command) {
        var i;

        // if (command.event.type == 'REDO' ||
        //     command.event.type == 'EXECUTE' && command.event.source !== this) {
        //왜 커맨들 발생시킨 주체와 자기자신을 비교하는지 모르겠어서 일단 풀어봤음
        if (command.event.type == 'REDO' || command.event.type == 'EXECUTE') {

            for (i in command.commandList) {
                this.onCommand(command.commandList[i]);
            }

        } else if (command.event.type == 'UNDO') {

            for (i = command.commandList.length - 1; i > -1; i--) {
                this.onCommand(command.commandList[i]);
            }

        }
    };

    DiagramEditorPage.prototype.onAppendNewFnUnitCommand = function (command) {
        this.onCompoundCommand(command);

        if (command.event.type == 'EXECUTE') {
            var figure = this.getFigureByFnUnitId(command.options.fnUnit.fid);
            this.showSelectionBox([figure]);
        }
    };

    DiagramEditorPage.prototype.onPrependNewFnUnitCommand = function (command) {
        this.onCompoundCommand(command);

        if (command.event.type == 'EXECUTE') {
            var figure = this.getFigureByFnUnitId(command.options.fnUnit.fid);
            this.showSelectionBox([figure]);
        }
    };

    DiagramEditorPage.prototype.onNewFnUnitCommand = function (command) {
        var figure, fnUnit;

        if (command.event.type == 'REDO' ||
            command.event.type == 'EXECUTE' && command.event.source !== this) {

            fnUnit = command.options.fnUnit;
            figure = this.createFnUnitFigure(fnUnit);
            this.graph.addCells([figure]);
            this.ensureVisible(figure);

            if (command.event.type == 'EXECUTE') {
                this.showSelectionBox([figure]);
            }

        } else if (command.event.type == 'UNDO') {

            fnUnit = command.options.fnUnit;
            figure = this.getFigureByFnUnitId(fnUnit.fid);
            this._removeFigure(figure);

        }
    };

    DiagramEditorPage.prototype.onRemoveFnUnitCommand = function (command) {
        var _this = this;
        var figure, fnUnit;

        if (command.event.type == 'REDO' ||
            command.event.type == 'EXECUTE' && command.event.source !== this) {

            figure = this.getFigureByFnUnitId(command.options.fid);
            this._removeFigure(figure);

        } else if (command.event.type == 'UNDO') {

            fnUnit = this.getFnUnitById(command.options.fid);
            figure = this.createFnUnitFigure(fnUnit);
            this.graph.addCells([figure]);

            this.fitToContent();
            this.ensureVisible(figure);

        }

        // _removeFigure에 durtaion이 설정되어 있음.
        setTimeout(function () {
            Brightics.OptModelManager.renderOptModels();
        }, 600);
    };

    DiagramEditorPage.prototype.onConnectFnUnitCommand = function (command) {
        var link;

        if (command.event.type == 'REDO' ||
            command.event.type == 'EXECUTE' && command.event.source !== this) {

            var linkUnit = this.getLinkUnitById(command.options.kid);
            link = this.createLinkFigure(linkUnit);
            if (link) {
                this.graph.addCells([link]);
                link.toBack();
            }

        } else if (command.event.type == 'UNDO') {

            link = this.getLinkFigureByLinkUnitId(command.options.kid);
            this._removeLink(link);

        }
    };

    DiagramEditorPage.prototype.onDisconnectFnUnitCommand = function (command) {
        var link;

        if (command.event.type == 'REDO' ||
            command.event.type == 'EXECUTE' && command.event.source !== this) {

            link = this.getLinkFigureByLinkUnitId(command.options.kid);
            this._removeLink(link);

        } else if (command.event.type == 'UNDO') {

            var linkUnit = this.getLinkUnitById(command.options.kid);
            link = this.createLinkFigure(linkUnit);
            if (link) {
                this.graph.addCells([link]);
                link.toBack();
            }

        }
    };

    DiagramEditorPage.prototype.onReconnectFnUnitCommand = function (command) {
        var link, linkUnit, sourceFigure, targetFigure;

        if (command.event.type == 'REDO' ||
            command.event.type == 'UNDO' ||
            command.event.type == 'EXECUTE' && command.event.source !== this) {

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

    DiagramEditorPage.prototype.onSetFnUnitCommand = function (command) {
        var figure;

        if (command.event.type == 'REDO' ||
            command.event.type == 'UNDO') {

            figure = this.getFigureByFnUnitId(command.options.fnUnit.fid);
            if (figure) {
                this.showSelectionBox([figure]);
            }
        }
    };

    DiagramEditorPage.prototype.onSetDialogFnUnitCommand = function (command) {
        if (command.event.type == 'REDO' ||
            command.event.type == 'UNDO') {
            //현재 아무것도 하지 않지만 뭔가를 화면에서 보여줘야 하는지?
        }
    };

    DiagramEditorPage.prototype.onNewOptModelCommand = function (command) {
        Brightics.OptModelManager.renderOptModels();
    };

    DiagramEditorPage.prototype.onSetOptModelCommand = function (command) {
        Brightics.OptModelManager.renderOptModels();
    };

    DiagramEditorPage.prototype.onRemoveOptModelCommand = function (command) {
        Brightics.OptModelManager.renderOptModels();
    };

    DiagramEditorPage.prototype.onSetFnUnitPositionCommand = function (command) {
        var figure, fnUnit;

        if (command.event.type == 'REDO' ||
            command.event.type == 'UNDO' ||
            command.event.type == 'EXECUTE' && command.event.source !== this) {

            figure = this.getFigureByFnUnitId(command.options.fid);
            fnUnit = this.getFnUnitById(command.options.fid);
            if (fnUnit) {
                figure.position(fnUnit.display.diagram.position.x, fnUnit.display.diagram.position.y);
            }
            this._rerouteLink();
            //Refresh SelectionBounds Position
            this.hideSelectionBounds();
            this.showSelectionBounds();
        }
        Brightics.OptModelManager.renderOptModels();
    };

    DiagramEditorPage.prototype.onShiftCommand = function (command) {
        var fid, figure, fnUnit;
        for (var i in command.options.changed) {
            fid = command.options.changed[i];
            fnUnit = this.getFnUnitById(fid);
            figure = this.getFigureByFnUnitId(fid);
            if (fnUnit && figure) {
                figure.position(fnUnit.display.diagram.position.x, fnUnit.display.diagram.position.y);
            }
        }
        this.hideTools(true);
        Brightics.OptModelManager.renderOptModels();
    };

    DiagramEditorPage.prototype.onRenameFnUnitCommand = function (command) {
        var figure = this.getFigureByFnUnitId(command.options.fid);
        var fnUnit = this.getFnUnitById(command.options.fid);
        if (fnUnit) {
            figure.label(fnUnit.display.label, this.options.scale);

            if (this._hasDescription(fnUnit)) figure.showToolTipIcon();
            else figure.hideToolTipIcon();
        }
    };

    DiagramEditorPage.prototype.getFnUnitById = function (fid) {
        return this.getModel().getFnUnitById(fid);
    };

    DiagramEditorPage.prototype.getLinkUnitById = function (kid) {
        return this.getModel().getLinkUnitById(kid);
    };

    DiagramEditorPage.prototype.getFigureByFnUnitId = function (fid) {
        var figures = this.graph.getElements();
        for (var i in figures) {
            if (figures[i].attributes.fid === fid) {
                return figures[i];
            }
        }
    };

    DiagramEditorPage.prototype.getLinkFigureByLinkUnitId = function (kid) {
        var links = this.graph.getLinks();
        for (var i in links) {
            if (links[i].attributes.kid === kid) {
                return links[i];
            }
        }
    };

    DiagramEditorPage.prototype.getSelectedFigures = function () {
        var _this = this;
        return this.$paperElement.children('.brtc-va-editors-diagram-diagrameditorpage-function-selected').map(function () {
            var cid = $(this).attr('cid');
            return _this.graph.getCell(cid);
        }).toArray();
    };

    DiagramEditorPage.prototype.getSelectedFigureIds = function () {
        var selections = [];
        this.$paperElement.children('.brtc-va-editors-diagram-diagrameditorpage-function-selected').each(function (index, el) {
            selections.push($(this).attr('cid'));
        });
        selections.sort();
        return selections;
    };

    DiagramEditorPage.prototype.selectFunction = function (fid) {
        var _this = this;
        if (_this.behaviorMode === BEHAVIOR_LINK) _this._setBehaviorModeToDefault();
        var figure = this.getFigureByFnUnitId(fid);
        this.showSelectionBox([figure]);
        setTimeout(function () {
            _this.ensureCenter(figure);
        }, 100);
    };

    DiagramEditorPage.prototype.isReadOnlyFigure = function (figure) {
        return (figure.attributes.attrs.category === 'brightics') ? true : false;
    };

    DiagramEditorPage.prototype.calcGuidePosition = function (figure) {
        return this.calcGuideLocation(figure.attributes.position.x, figure.attributes.position.y);
    };

    DiagramEditorPage.prototype.calcGuideLocation = function (x, y) {
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

        return { x: xx, y: yy };
    };

    DiagramEditorPage.prototype.showGuideBox = function (figure) {
        var pos = this.calcGuidePosition(figure);
        this.$guideBox.css({
            top: pos.y * this.options.scale,
            left: pos.x * this.options.scale,
            display: 'block'
        });
    };

    DiagramEditorPage.prototype.updateGuideBox = function (figure) {
        var pos = this.calcGuidePosition(figure);
        this.$guideBox.css({
            top: pos.y * this.options.scale,
            left: pos.x * this.options.scale
        });
    };

    DiagramEditorPage.prototype.hideGuideBox = function () {
        if (this.$guideBox) this.$guideBox.hide();
    };

    DiagramEditorPage.prototype.showGuideMessage = function (figure, message) {
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

    DiagramEditorPage.prototype.hideGuideMessage = function () {
        this.guideMessage = null;
        if (this.$guideMessageBox) this.$guideMessageBox.hide();
    };

    DiagramEditorPage.prototype.renderStartedFnUnit = function (figure) {
        this.ensureCenter(figure);
    };

    DiagramEditorPage.prototype.renderCompletedFnUnit = function (eventData) {
        var figure = this.getFigureByFnUnitId(eventData.fid);
        var date = eventData.end ? new Date(parseInt(eventData.end)) : Date.now();
        if (figure) figure.lastRuntime(date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + '.' + date.getMilliseconds());

        var item = $.extend(true, {}, eventData);
        delete item.launchOptions;
        delete item.originalResponse;

        if (window.sessionStorage) sessionStorage.setItem(item.fid, JSON.stringify(item));
    };

    DiagramEditorPage.prototype.render = function (_editorInput) {
        var editorInput = _editorInput || this.getModel();
        this.$paperElement.children('.brtc-va-editors-diagram-diagrameditorpage-function-selected').remove();

        this.graph.clear();

        var i;
        for (i in editorInput.functions) {
            var fnUnit = editorInput.functions[i];
            var figure = this.createFnUnitFigure(fnUnit);
            this.graph.addCells([figure]);

            if (sessionStorage) {
                var storedEventData = JSON.parse(sessionStorage.getItem(fnUnit.fid) || "{}");
                if (storedEventData && storedEventData.end) {
                    var date = new Date(parseInt(storedEventData.end));
                    figure.lastRuntime(date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + '.' + date.getMilliseconds());
                }
            }
        }
        for (i in editorInput.links) {
            var linkUnit = editorInput.links[i];
            var linkFigure = this.createLinkFigure(linkUnit);
            if (linkFigure) {
                this.graph.addCells([linkFigure]);
            }
        }
        var links = this.graph.getLinks();
        $.each(links, function (index, link) {
            link.toBack();
        });

        this.fitToContent();
        this.hideErrorBox();
        this.showErrorBox(this.findError());
    };

    DiagramEditorPage.prototype.onActivated = function () {
        var links = this.graph.getLinks();
        $.each(links, function (index, link) {
            link.remove();
        });

        var _this = this;
        setTimeout(function () {
            for (var i in _this.getModel().links) {
                var linkUnit = _this.getModel().links[i];
                var linkFigure = _this.createLinkFigure(linkUnit);
                if (linkFigure) {
                    _this.graph.addCells([linkFigure]);
                }
            }
            links = _this.graph.getLinks();
            $.each(links, function (index, link) {
                link.toBack();
            });
        }, 400);
    };

    DiagramEditorPage.prototype.getPaperSize = function () {
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

    DiagramEditorPage.prototype.fitToContent = function () {
        var size = this.getPaperSize();
        var width = size.width;
        var height = size.height;

        this.paper.setDimensions(width, height);

        this.updateMiniMapWindow();

        this.$mainControl.perfectScrollbar('update');
    };

    DiagramEditorPage.prototype.updateMiniMapWindow = function () {
        this.minimap.updateMiniMapWindow();
    };

    DiagramEditorPage.prototype.disableAllFnUnitFigure = function () {
        var cells = this.graph.getCells();
        for (var i in cells) {
            if (cells[i] instanceof Brightics.VA.Core.Shapes.LinkFigure) {
                this.disableLink(cells[i]);
            } else if (cells[i] instanceof Brightics.VA.Core.Shapes.FnUnitFigure) {
                this.disableFnUnit(cells[i]);
            }
        }
    };

    DiagramEditorPage.prototype.enableAllFnUnitFigure = function () {
        var cells = this.graph.getCells();
        for (var i in cells) {
            if (cells[i] instanceof Brightics.VA.Core.Shapes.LinkFigure) {
                this.enableLink(cells[i]);
            } else if (cells[i] instanceof Brightics.VA.Core.Shapes.FnUnitFigure) {
                this.enableFnUnit(cells[i]);
            }
        }
    };

    DiagramEditorPage.prototype.enableFnUnit = function (figure) {
        figure.transition('attrs/rect/opacity', 0.2, this.opacity4transition);
        figure.transition('attrs/circle/opacity', 0.2, this.opacity4transition);
        figure.transition('attrs/text/opacity', 0.2, this.opacity4transition);
        figure.attr('text/font-weight', 'bold');
    };

    DiagramEditorPage.prototype.disableFnUnit = function (figure) {
        figure.attr('rect/opacity', 0.2);
        figure.attr('circle/opacity', 0.2);
        figure.attr('text/opacity', 0.2);
        figure.attr('text/font-weight', '');
    };

    DiagramEditorPage.prototype.enableLink = function (link) {
        link.transition('attrs/path/opacity', 0.2, this.opacity4transition);
    };

    DiagramEditorPage.prototype.disableLink = function (link) {
        link.attr('path/opacity', 0.1);
    };

    DiagramEditorPage.prototype.checkInputtable = function (fnUnit) {
        var isInputtable = false;

        isInputtable = 
            FnUnitUtils.getTotalInRangeCount(fnUnit).min > 0 ? true : false ||
            FnUnitUtils.isBluffNode(fnUnit);

        return isInputtable;
    };

    DiagramEditorPage.prototype.createFnUnitFigure = function (fnUnit) {
        var clazz = this.getModel().type;

        var figure = new Brightics.VA.Core.Shapes.FnUnitFigure({
            colorSet: this.options.editor.getColorSet(),
            position: fnUnit.display.diagram.position,
            size: {
                width: Brightics.VA.Env.Diagram.FIGURE_WIDTH,
                height: Brightics.VA.Env.Diagram.FIGURE_HEIGHT
            },
            fid: fnUnit.fid,
            inputtable: FnUnitUtils.isInputtable(fnUnit),
            outputtable: FnUnitUtils.isOutputtable(fnUnit),
            connectableFunctions: Brightics.VA.Core.Utils.WidgetUtils.getFunctionLibrary(clazz, fnUnit.func)['connectable-functions'],
            acceptableFunctions: Brightics.VA.Core.Utils.WidgetUtils.getFunctionLibrary(clazz, fnUnit.func)['acceptable-functions'],
            ports: {
                groups: {
                    'in:l': {
                        position: {
                            name: 'left',
                        },
                        attrs: {
                            '.fnunit-port': {
                                stroke: 'red'
                            }
                        }
                    },
                    'out:r': {
                        position: {
                            name: 'right',
                        },
                        attrs: {
                            '.fnunit-port': {
                                stroke: 'blue'
                            }
                        }
                    }
                },
                items: [IN_PORT, OUT_PORT]
            }
        });

        figure.label(fnUnit.display.label, this.options.scale);
        figure.attr({
            '.brtc-va-rotatable': { fid: fnUnit.fid }
        });

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

    DiagramEditorPage.prototype._hasDescription = function (fnUnit) {
        return (fnUnit.display.description && fnUnit.display.description !== '<p><br></p>');
    };

    DiagramEditorPage.prototype.createLinkFigure = function (linkUnit) {
        var _this = this;
        var sourceFigure = this.getFigureByFnUnitId(linkUnit[SOURCE_FID]);
        var targetFigure = this.getFigureByFnUnitId(linkUnit[TARGET_FID]);

        if (sourceFigure && targetFigure) {
            var link = new Brightics.VA.Core.Shapes.LinkFigure({
                kid: linkUnit.kid,
                source: {
                    id: sourceFigure.id,
                    port: OUT_PORT_ID
                },
                target: {
                    id: targetFigure.id,
                    port: IN_PORT_ID
                }
            });
            link.on('change', function (link, changed) {
                if (changed.ui && link.attributes.target.id && !link.attributes.target.port) {
                    link.set('target', {
                        id: link.attributes.target.id,
                        port: IN_PORT_ID
                    })
                }
                if (changed.ui && link.attributes.source.id && !link.attributes.source.port) {
                    link.set('source', {
                        id: link.attributes.source.id,
                        port: OUT_PORT_ID
                    })
                }
            });
            return link;
        }
    };

    DiagramEditorPage.prototype._createLinkFigure = function (kid, sourceFigure, targetFigure) {
        var opt = {
            kid: kid,
            source: {
                id: sourceFigure.id,
                port: OUT_PORT_ID
            },
            target: {
                id: targetFigure.id,
                port: IN_PORT_ID
            }
        };

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

        var link = new Brightics.VA.Core.Shapes.LinkFigure(opt);
        link.on('change:source', function () {
        });
        link.on('change:target', function () {
        });

        return link;
    };

    DiagramEditorPage.prototype.updateToolsPosition = function (figure) {
        var _this = this;
        var pos = figure.attributes.position;
        if (pos && figure instanceof Brightics.VA.Core.Shapes.FnUnitFigure && figure.attributes.fid) {
            this.$tools.css({
                top: pos.y * _this.options.scale,
                left: pos.x * _this.options.scale
            });
        }
    };

    DiagramEditorPage.prototype.showTools = function (figure) {
        var _this = this;
        var pos = figure.attributes.position;

        if (pos && figure instanceof Brightics.VA.Core.Shapes.FnUnitFigure && !figure.attributes.dummy) {
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
                _this.$tools.attr('select', figure.attributes.attrs['.brtc-va-outer'].fill != '#FFFFFF');
                _this.$tools.css({
                    top: pos.y * _this.options.scale,
                    left: pos.x * _this.options.scale,
                    display: 'block'
                });
            }, 50);
        }
        this.setConnectToolItemVisible(figure.attributes.outputtable);
    };

    DiagramEditorPage.prototype.clearShowToolsTimer = function () {
        if (this.showToolsTimer) {
            clearTimeout(this.showToolsTimer);
            this.showToolsTimer = null;
        }
    };

    DiagramEditorPage.prototype.hideTools = function (immediately) {
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

    DiagramEditorPage.prototype.clearHideToolsTimer = function () {
        if (this.hideToolsTimer) {
            clearTimeout(this.hideToolsTimer);
            this.hideToolsTimer = null;
        }
    };

    DiagramEditorPage.prototype.showToolTip = function (figure) {
        var _this = this;
        var labelColor;
        var clazz = this.getModel().type;
        var pos = figure.attributes.position;
        if (pos && figure instanceof Brightics.VA.Core.Shapes.FnUnitFigure &&
            !figure.attributes.dummy && this.getEditor().getEditorState(TOOLTIP_ENABLED)) {
            var fnUnit = _this.getFnUnitById(figure.attributes.fid);
            var funcDef = Brightics.VA.Core.Utils.WidgetUtils.getFunctionLibrary(clazz, fnUnit.func);
            // if (figure.resource[funcDef.category]) {
            //     labelColor = figure.resource[funcDef.category].fill;
            // }

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

    DiagramEditorPage.prototype.hideToolTip = function () {
        if (this.$toolTip) this.$toolTip.removeClass('brtc-va-editors-visible');
    };

    DiagramEditorPage.prototype.doEditFunction = function (fid, label, description) {
        var command = new Brightics.VA.Core.Editors.Diagram.Commands.RenameFnUnitCommand(this, {
            fid: fid,
            name: label,
            description: description
        });
        this.fireCommand(command);
    };

    DiagramEditorPage.prototype.removeFnUnitFigure = function (figure) {
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

    DiagramEditorPage.prototype.removeFnUnitFigures = function (figures) {
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
        for (let link of links) {
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

        this.hideSelectionBox();
        this.hideTools(true);

        this.notification('success', figures.length + ' functions were removed.');
        this.fireCommand(commands);
    };

    DiagramEditorPage.prototype.removeFnUnitLink = function (figure) {
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

    DiagramEditorPage.prototype._removeFigure = function (figure) {
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

            this.hideSelectionBox(figure);

            if (figure.cid == this.$tools.attr('cid')) {
                this.hideTools(true);
            }
        }
    };

    DiagramEditorPage.prototype._revertPosition = function (figure) {
        var revert = this.getFnUnitById(figure.attributes.fid).display.diagram.position;
        var pos = figure.position();
        if (revert.x != pos.x || revert.y != pos.y) {
            figure.position(revert.x, revert.y);
        }
    };

    DiagramEditorPage.prototype._revertLink = function (link) {
        var linkUnit = this.getLinkUnitById(link.attributes.kid);
        var sourceFigure = this.getFigureByFnUnitId(linkUnit[SOURCE_FID]);
        var targetFigure = this.getFigureByFnUnitId(linkUnit[TARGET_FID]);
        link.set('source', {
            id: sourceFigure.id,
            port: OUT_PORT_ID
        });
        link.set('target', {
            id: targetFigure.id,
            port: IN_PORT_ID
        });
    };

    DiagramEditorPage.prototype._removeLink = function (link) {
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

    DiagramEditorPage.prototype.connectSmartly = function (figure) {
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
        var inbounds = this.graph.getConnectedLinks(figure, { inbound: true });
        if (inbounds.length === 0 && prev.length > 0 && !prev[0].attributes.connectableFunctions && figure.attributes.inputtable && prev[0].attributes.outputtable && (prev[0].attributes.position.y == y)) {
            linkUnit = {
                kid: Brightics.VA.Core.Utils.IDGenerator.link.id(),
                'sourceFid': prev[0].attributes.fid,
                'targetFid': figure.attributes.fid
            };
            inLink = this.createLinkFigure(linkUnit);
            if (inLink) {
                this.graph.addCells([inLink]);
                inLink.toBack();
                links.push(inLink);
            }
        }
        var outbounds = this.graph.getConnectedLinks(figure, { outbound: true });
        if (!figure.attributes.connectableFunctions && outbounds.length === 0 && next.length > 0 && next[0].attributes.inputtable && figure.attributes.outputtable && (next[0].attributes.position.y == y)) {
            linkUnit = {
                kid: Brightics.VA.Core.Utils.IDGenerator.link.id(),
                'sourceFid': figure.attributes.fid,
                'targetFid': next[0].attributes.fid
            };
            outLink = this.createLinkFigure(linkUnit);
            if (outLink) {
                this.graph.addCells([outLink]);
                outLink.toBack();
                links.push(outLink);
            }
        }

        return links;
    };

    DiagramEditorPage.prototype.checkOverPosition = function (figure) {
        var pos = this.calcGuidePosition(figure);
        var models = this.graph.findModelsFromPoint(pos);
        for (var i in models) {
            if (models[i] != figure) {
                if (models[i].position().x == pos.x && models[i].position().y == pos.y) {
                    return false;
                }
            }
        }
        return true;
    };

    DiagramEditorPage.prototype.checkPreviousPosition = function (figure) {
        var pos = this.calcGuidePosition(figure);
        var inLinks = this.graph.getConnectedLinks(figure, { inbound: true });
        for (var i in inLinks) {
            if (inLinks[i].getSourceElement().position().x >= pos.x) {
                return false;
            }
        }

        return true;
    };

    DiagramEditorPage.prototype.checkNextPosition = function (figure) {
        var pos = this.calcGuidePosition(figure);
        var outLinks = this.graph.getConnectedLinks(figure, { outbound: true });
        for (var i in outLinks) {
            if (outLinks[i].getTargetElement().position().x <= pos.x) {
                return false;
            }
        }

        return true;
    };

    DiagramEditorPage.prototype.checkOutRangePosition = function (figure) {
        var pos = this.calcGuidePosition(figure);
        return pos.x > 0 && pos.y > 0;
    };

    DiagramEditorPage.prototype.checkConnectedLink = function (link) {
        return link.getSourceElement() != null && link.getTargetElement() != null;
    };

    DiagramEditorPage.prototype.checkLoopLink = function (link) {
        var sourceFid = link.getSourceElement().attributes.fid;
        var targetFid = link.getTargetElement().attributes.fid;
        return this._getConnectableFids(sourceFid).indexOf(targetFid) >= 0;
    };

    DiagramEditorPage.prototype._getConnectableFids = function (startFid) {
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

    DiagramEditorPage.prototype.checkLinkPosition = function (link) {
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

    DiagramEditorPage.prototype.checkAlreadyExistLink = function (link) {
        var sourceFid = link.getSourceElement().attributes.fid;
        var targetFid = link.getTargetElement().attributes.fid;
        var links = this.getModel().links;
        for (var i = 0; i < links.length; i++) {
            if (links[i][SOURCE_FID] === sourceFid && links[i][TARGET_FID] === targetFid) return false;
        }
        return true;
    };

    DiagramEditorPage.prototype.checkAlreadyExistLinkByTableId = function (link) {
        var sourceFid = link.getSourceElement().attributes.fid;
        var targetFid = link.getTargetElement().attributes.fid;

        var sourceFnUnit = this.getFnUnitById(sourceFid);
        var targetFnUnit = this.getFnUnitById(targetFid);

        var sourceOutData = FnUnitUtils.getOutData(sourceFnUnit);
        var targetInData = FnUnitUtils.getInData(targetFnUnit);

        for (var sourceIndex in sourceOutData) {
            if (targetInData && targetInData.indexOf(sourceOutData[sourceIndex]) > -1) return false;
        }

        return true;
    };

    DiagramEditorPage.prototype.registerGoHistoryEventListener = function () {
        var _this = this;
        var modelEditorRef = Brightics.VA.Core.Utils.WidgetUtils.getModelEditorRef(this.$mainControl);
        this.onGoHistoryCommand = function (command) {
            _this.hideSelectionBox();
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

    DiagramEditorPage.prototype.updateStatus = function (event) {
        var figure = this.getFigureByFnUnitId(event.fid);
        if (figure) figure.updateStatus(event.status);
    };

    DiagramEditorPage.prototype.destroy = function () {
        Studio.getInstance().removeProblemListener(this.problemsListener);
        Studio.getInstance().removeDebugListener(this.debugListener);
        if (this.boundHandleBlankPointerUp) {
            Studio.getInstance().getControl().off('mouseup', this.boundHandleBlankPointerUp);
        }
    };

    DiagramEditorPage.prototype.registerKeyListener = function () {
    };

    DiagramEditorPage.prototype._addTemplate = function (template) {
        var _this = this;
        this.$copyTemplate.css({
            'top': _this.mouseY,
            'left': _this.mouseX,
            'position': 'absolute',
            'width': $(window).data('function-clipboard-width'),
            'height': $(window).data('function-clipboard-height'),
            'background': 'transparent',
            'border': 'none',
            'padding': 'none',
            'margin': 'none'
        });

        this.$copyTemplate.find('.brtc-va-views-library-template-preview').empty();

        var $paperElement = this.$copyTemplate.find('.brtc-va-views-library-template-preview');
        $paperElement.css('background', 'transparent');

        var graph = new joint.dia.Graph();
        var paper = new joint.dia.Paper({
            el: $paperElement,
            width: '100%',
            height: '100%',
            model: graph,
            interactive: false,
            theme: 'none'
        });
        paper.$el.css('pointer-events', 'none');
        paper.scale(1);

        var i;
        for (i in template.functions) {
            var figure = this._createFnUnitFigure(template.functions[i]);
            graph.addCells([figure]);
        }
        for (i in template.links) {
            var link = this._createLinkFigureCopy(graph, template.links[i]);
            graph.addCells([link]);
        }
        var links = graph.getLinks();
        $.each(links, function (index, link) {
            link.toBack();
        });

        this._draggableTemplate(this.$copyTemplate, template);

        return this.$copyTemplate;
    };

    DiagramEditorPage.prototype._draggableTemplate = function ($template, contents) {
        $('.brtc-va-studio').addClass('brtc-va-studio-dragging');
    };

    DiagramEditorPage.prototype._createFnUnitFigure = function (fnUnit) {
        fnUnit.display.diagram.position.x += Brightics.VA.Env.Diagram.PAPER_MARGIN_LEFT;
        fnUnit.display.diagram.position.y += Brightics.VA.Env.Diagram.PAPER_MARGIN_TOP;

        var figure = new Brightics.VA.Core.Shapes.FnUnitFigure({
            position: fnUnit.display.diagram.position,
            size: {
                width: Brightics.VA.Env.Diagram.FIGURE_WIDTH,
                height: Brightics.VA.Env.Diagram.FIGURE_HEIGHT
            },
            fid: fnUnit.fid,
            ports: {
                groups: {
                    'in:l': {
                        position: {
                            name: 'left'
                        },
                        attrs: {
                            '.fnunit-port': {
                                stroke: 'red'
                            }
                        }
                    },
                    'out:r': {
                        position: {
                            name: 'right',
                        },
                        attrs: {
                            '.fnunit-port': {
                                stroke: 'blue'
                            }
                        }
                    }
                },
                items: [IN_PORT, OUT_PORT]
            }
        });

        figure.label(fnUnit.display.label, 1);

        var funcDef = Brightics.VA.Core.Utils.WidgetUtils.getFunctionLibrary('data', fnUnit.func);
        if (funcDef) {
            figure.tooltip(fnUnit.display.label + ' (' + funcDef.defaultFnUnit.display.label + ')');
            figure.category(funcDef);
        }

        return figure;
    };

    DiagramEditorPage.prototype._createLinkFigureCopy = function (graph, linkUnit) {
        var sourceFigure = this.getFigureByFnUnitIdCopy(graph, linkUnit[SOURCE_FID]);
        var targetFigure = this.getFigureByFnUnitIdCopy(graph, linkUnit[TARGET_FID]);
        return new Brightics.VA.Core.Shapes.LinkFigure({
            kid: linkUnit.kid,
            source: {
                id: sourceFigure.id,
                port: OUT_PORT_ID
            },
            target: {
                id: targetFigure.id,
                port: IN_PORT_ID
            }
        });
    };


    DiagramEditorPage.prototype.getFigureByFnUnitIdCopy = function (graph, fid) {
        var figures = graph.getElements();
        for (var i in figures) {
            if (figures[i].attributes.fid === fid) {
                return figures[i];
            }
        }
    };

    DiagramEditorPage.prototype.setModel = function (model) {
        this.render();
        this.hideAdditionalItems();
    };

    DiagramEditorPage.prototype.hideAdditionalItems = function (model) {
        this.hideValidationToolTip();
        this.hideSelectionBounds();
        this.hideErrorBox();
        this.hideGuideBox();
        this.hideGuideMessage();
        this.hideTools(true);
        this.hideToolTip();
    };

    DiagramEditorPage.prototype.createNewActivityCommand = function (fnUnit) {
        var options = Brightics.VA.Core.Utils.NestedFlowUtils.getNewActivityCommandOptions(fnUnit);
        return _.map(options, function (opt) {
            return new Brightics.VA.Core.Editors.Diagram.Commands.NewActivityCommand(this, opt);
        }.bind(this));
    };

    DiagramEditorPage.prototype.createRemoveConnectedOutDataCommand = function (figures) {
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

    DiagramEditorPage.prototype.getEditorInput = function () {
        return this.getEditor().getEditorInput();
    };

    DiagramEditorPage.prototype.getEditor = function () {
        return this.options.editor;
    };

    DiagramEditorPage.prototype.getModel = function () {
        return this.options.editor.getActiveModel();
    };

    DiagramEditorPage.prototype.isNestedFlow = function () {


        var activeFnUnit = this.getEditor().getActiveFnUnit();
        return activeFnUnit &&
            (activeFnUnit.func === 'if' ||
                activeFnUnit.func === 'forLoop' ||
                activeFnUnit.func === 'whileLoop');
    };

    DiagramEditorPage.prototype.getOptions = function () {
        return this.options;
    };

    DiagramEditorPage.prototype.hasModel = function (categoty, fnUnit) {
        var categoryArr = ['process', 'control'];

        return (categoryArr.indexOf(categoty) > -1 &&
            fnUnit[FUNCTION_NAME] !== 'Flow') ? true : false;
    };

    DiagramEditorPage.prototype.handleBlankMouseLeave = function (evt) {
        /**
         * sungjin1.kim@samsung.com
         * 사용성 점검 조치: Diagram Editor 여백의 'Add' 버튼 클릭시 'Select Function' 팝업이 뜨면서 배경의 'Add' 버튼이 사라져서 사용자가 제대로 된 위치에 버튼을 눌렀는지에 대한 확신을 가지기 어려움
         */
        // this.$createCue.css('display', 'none');
    };

    DiagramEditorPage.prototype.handleBlankMouseEnter = function (evt) {
    };

    DiagramEditorPage.prototype.changeCursor = function (model, cursor) {
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

    DiagramEditorPage.prototype.ensureCenterByFnUnit = function (fnUnit) {
        var figure = this.getFigureByFnUnitId(fnUnit.fid);
        this.ensureCenter(figure);
    };

    DiagramEditorPage.prototype.refresh = function () {
        var figures = this.graph.getElements();
        for (var i in figures) {
            figures[i].refresh();
        }
    };

    Brightics.VA.Core.Editors.Diagram.DiagramEditorPage = DiagramEditorPage;
    /* eslint-disable no-invalid-this */
}).call(this);
