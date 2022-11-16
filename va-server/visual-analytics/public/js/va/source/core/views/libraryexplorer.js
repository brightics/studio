/**
 * Created by daewon.park on 2016-09-19.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var SCALE = .5;

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

    function LibraryExplorer(parentId, options) {
        this.parentId = parentId;
        this.options = options;
        this.templates = [];
        this.retrieveParent();
        this.createControls();
    }

    LibraryExplorer.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    LibraryExplorer.prototype.createControls = function () {
        var _this = this;

        this.$mainControl = $('' +
            '<div class="brtc-va-views-library brtc-va-tab-contents">' +
            '   <div class="brtc-va-views-library-group">' +
            '       <div class="brtc-va-views-library-group-selector"></div>' +
            '   </div>' +
            '   <div class="brtc-va-views-library-separator"></div>' +
            '   <div class="brtc-va-views-library-totalcount"><span>'+Brightics.locale.common.total+'</span><span>0</span></div>' +
            '   <div class="brtc-va-views-library-container"></div>' +
            '   <div class="brtc-va-views-library-template-ctxmenu">' +
            '       <ul>' +
            '           <li action="edit">Edit</li>' +
            '           <li action="delete">Delete</li>' +
            '       </ul>' +
            '   </div>' +
            '</div>');
        this.$parent.append(this.$mainControl);

        this.$mainControl.find('.brtc-va-views-library-container').perfectScrollbar();

        var source =
            {
                datatype: 'json',
                datafields: [
                    {name: 'id'},
                    {name: 'label'}
                ],
                url: 'api/va/v2/ws/libraries',
                async: true
            };
        var dataAdapter = new $.jqx.dataAdapter(source);
        this.$librarySelector = this.$parent.find('.brtc-va-views-library-group-selector').jqxDropDownList({
            theme: Brightics.VA.Env.Theme,
            source: dataAdapter,
            displayMember: 'label',
            valueMember: 'id',
            placeHolder: 'Choose Template',
            width: '100%',
            // width: 'calc(100% - 20px)',
            height: '30px',
            itemHeight: 30
        });
        this.$librarySelector.on('select', function (event) {
            _this.fillTemplates(event.args.item.value);
        });

        this.$ctxMenu = this.$mainControl.find('.brtc-va-views-library-template-ctxmenu').jqxMenu({
            theme: Brightics.VA.Env.Theme,
            width: '140px',
            height: '150px',
            autoOpenPopup: false,
            mode: 'popup',
            animationHideDuration: 0,
            animationShowDuration: 0
        });
        this.$ctxMenu.on('itemclick', function (event) {
            var $el = $(event.args);
            var libraryId = $el.closest('.brtc-va-views-library-template-ctxmenu').attr('library-id');
            var templateId = $el.closest('.brtc-va-views-library-template-ctxmenu').attr('template-id');
            if ($el.attr('action') == 'edit') {
                _this.editTemplate(libraryId, templateId);
            }
            else if ($el.attr('action') == 'delete') {
                _this.deleteTemplate(libraryId, templateId);
            }
        });
    };

    LibraryExplorer.prototype.activate = function () {
        var item = this.$librarySelector.jqxDropDownList('getSelectedItem');
        if (item) {
            // 선택된 라이브러리가 있으므로 그냥 진행
        } else {
            // 선택된 라이브러리가 없으므로 첫번째 라이브러리 선택
            var items = this.$librarySelector.jqxDropDownList('getItems');
            if (items && items.length > 0) {
                this.selectLibrary(items[0].value);
            }
        }
    };

    LibraryExplorer.prototype.editTemplate = function (libraryId, templateId) {
        var _this = this;
        new Brightics.VA.Core.Dialogs.EditResourceDialog(this.$mainControl, {
            title: 'Edit Template',
            label: _this.templates[templateId].label,
            description: _this.templates[templateId].description,
            close: function (dialogResult) {
                if (dialogResult.OK) {
                    var opt = {
                        url: 'api/va/v2/ws/libraries/' + libraryId + '/templates/' + templateId + '/update',
                        type: 'POST',
                        contentType: 'application/json; charset=utf-8',
                        data: JSON.stringify({
                            label: dialogResult.label,
                            description: dialogResult.description
                        }),
                        blocking: true
                    };
                    $.ajax(opt).done(function (result) {
                        _this.selectLibrary(libraryId);
                    }).fail(function (error) {
                        Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(error);
                    });
                }
            }
        });
    };

    LibraryExplorer.prototype.deleteTemplate = function (libraryId, templateId) {
        var _this = this;
        Brightics.VA.Core.Utils.WidgetUtils.openConfirmDialog('Are you sure you want to delete ?', function (dialogResult) {
            if (dialogResult.OK) {
                var opt = {
                    url: 'api/va/v2/ws/libraries/' + libraryId + '/templates/' + templateId + '/delete',
                    type: 'POST',
                    contentType: 'application/json; charset=utf-8',
                    blocking: true
                };
                $.ajax(opt).done(function (result) {
                    _this.selectLibrary(libraryId);
                }).fail(function (error) {
                    Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(error);
                });
            }
        });
    };

    LibraryExplorer.prototype.selectLibrary = function (libraryId) {
        var item = this.$librarySelector.jqxDropDownList('getSelectedItem');
        if (item && item.value == libraryId) {
            this.fillTemplates(libraryId);
        } else {
            var items = this.$librarySelector.jqxDropDownList('getItems');
            for (var i in items) {
                if (items[i].value == libraryId) {
                    this.$librarySelector.jqxDropDownList('selectItem', items[i]);
                    break;
                }
            }
        }
    };

    LibraryExplorer.prototype.appendTemplate = function (template) {
        var _this = this;
        template.id = Brightics.VA.Core.Utils.IDGenerator.template.id();
        var opt = {
            url: 'api/va/v2/ws/libraries/' + template.library_id + '/templates',
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(template),
            blocking: true
        };
        $.ajax(opt).done(function (result) {
            var item = _this.$librarySelector.jqxDropDownList('getSelectedItem');
            if (item && item.value == template.library_id) {
                _this.fillTemplates(template.library_id);
            }
        }).fail(function (error) {
            Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(error);
        });
    };

    LibraryExplorer.prototype.fillTemplates = function (libraryId) {
        var _this = this;
        var opt = {
            url: 'api/va/v2/ws/libraries/' + libraryId + '/templates',
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            blocking: true
        };
        $.ajax(opt).done(function (templates) {
            _this.$mainControl.find('.brtc-va-views-library-container').empty();
            _this.$mainControl.find('.brtc-va-views-library-totalcount > span:nth-child(2)').text('0');
            _this.templates = {};

            templates.sort(function (a, b) {
                if (a.label.toLowerCase() < b.label.toLowerCase()) return -1;
                if (a.label.toLowerCase() > b.label.toLowerCase()) return 1;
                return 0;
            });
            _this.$mainControl.find('.brtc-va-views-library-totalcount > span:nth-child(2)').text(templates.length);
            for (var i in templates) {
                _this._addTemplate(templates[i]);
                _this.templates[templates[i].id] = templates[i];
            }
        }).fail(function (error) {
            Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(error);
        });
    };

    LibraryExplorer.prototype._addTemplate = function (template) {
        var _this = this;
        var $item = $('' +
            '<div class="brtc-va-views-library-template">' +
            '   <div class="brtc-va-views-library-template-label brtc-va-studio-dm-draggable">GalaxyS7 Preprocessing</div>' +
            '   <div class="brtc-va-views-library-template-author"><span>' + Brightics.locale.common.createdon + '</span><span></span><span> by </span><span></span></div>' +
            '   <div class="brtc-va-views-library-template-edit"></div>' +
            '   <div class="brtc-va-views-library-template-preview"></div>' +
            '</div>');

        this.$mainControl.find('.brtc-va-views-library-container').append($item);

        $item.find('.brtc-va-views-library-template-label').text(template.label);
        // $item.find('.brtc-va-views-library-template-label').attr('title', Brightics.VA.Core.Utils.WidgetUtils.convertHTMLSpecialChar(template.label));
        $item.find('.brtc-va-views-library-template-label').attr('title', template.label);
        $item.find('.brtc-va-views-library-template-author > span:nth-child(2)').text(moment(template.create_time).format('YYYY-MM-DD HH:mm'));
        $item.find('.brtc-va-views-library-template-author > span:nth-child(4)').text(template.creator);

        $item.find('.brtc-va-views-library-template-edit').click(function () {
            var left = $(this).offset().left + $(this).width() - 140 - 2;
            var top = $(this).offset().top + $(this).height();
            _this.$ctxMenu.attr('library-id', template.library_id);
            _this.$ctxMenu.attr('template-id', template.id);
            _this.$ctxMenu.jqxMenu('open', left, top);
        });

        var $paperElement = $item.find('.brtc-va-views-library-template-preview');

        var graph = new joint.dia.Graph();
        var paper = new joint.dia.Paper({
            el: $paperElement,
            width: '100%',
            height: 'calc(100% - 53px)',
            model: graph,
            theme: 'none',
            interactive: false
        });
        paper.$el.css('pointer-events', 'none');
        paper.scale(SCALE);

        var i;
        for (i in template.contents.functions) {
            var figure = this._createFnUnitFigure(template.contents.functions[i]);
            graph.addCells([figure]);
        }
        for (i in template.contents.links) {
            var link = this._createLinkFigure(graph, template.contents.links[i]);
            graph.addCells([link]);
        }
        var links = graph.getLinks();
        $.each(links, function (index, link) {
            link.toBack();
        });

        this._draggableTemplate($item, template.contents);

        return $item;
    };

    LibraryExplorer.prototype._draggableTemplate = function ($template, contents) {
        var _this = this;
        $template.find('.brtc-va-views-library-template-label').draggable({
            appendTo: 'body',
            scroll: false,
            cursor: 'move',
            cursorAt: {left: 5, top: 5},
            helper: function (event) {
                var $helper = $template.clone();
                $helper.css({width: 410, background: '#FFFFFF', 'z-index': 5100});
                var cloned = Brightics.VA.Core.Utils.ModelUtils.cloneModel(contents);
                Brightics.VA.Core.Utils.WidgetUtils.putData($helper, 'template', cloned);
                Brightics.VA.Core.Utils.WidgetUtils.putData($helper, 'source', _this);
                return $helper;
            },
            start: function (event, ui) {
                $('.brtc-va-studio').addClass('brtc-va-studio-dragging');

                $(this).draggable('option', 'cursorAt', {
                    left: Math.floor(ui.helper.width() / 2),
                    top: Math.floor(ui.helper.height() / 2)
                });
            },
            drag: function (event, ui) {
                ui.helper.trigger('feedback', [{clientX: event.clientX, clientY: event.clientY}]);
            },
            stop: function (event, ui) {
                $('.brtc-va-studio').removeClass('brtc-va-studio-dragging');
            }
        });
    };

    LibraryExplorer.prototype._createFnUnitFigure = function (fnUnit) {
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

        figure.label(fnUnit.display.label, SCALE);

        var clazz = this.options.modelType;
        var funcDef = Brightics.VA.Core.Interface.Functions[clazz][fnUnit.func];
        if (funcDef) {
            figure.tooltip(fnUnit.display.label + ' (' + funcDef.defaultFnUnit.display.label + ')');
            figure.category(funcDef);
        }

        return figure;
    };

    LibraryExplorer.prototype._createLinkFigure = function (graph, linkUnit) {
        var sourceFigure = this.getFigureByFnUnitId(graph, linkUnit[SOURCE_FID]);
        var targetFigure = this.getFigureByFnUnitId(graph, linkUnit[TARGET_FID]);
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

    LibraryExplorer.prototype.getFigureByFnUnitId = function (graph, fid) {
        var figures = graph.getElements();
        for (var i in figures) {
            if (figures[i].attributes.fid === fid) {
                return figures[i];
            }
        }
    };

    LibraryExplorer.prototype.refresh = function () {
        var libraryId = this.getSelectedLibraryId();
        if (libraryId) this.fillTemplates(libraryId);
    };

    LibraryExplorer.prototype.getSelectedLibraryId = function () {
        return this.$librarySelector.val();
    };

    LibraryExplorer.prototype.destroy = function () {
        this.$librarySelector.jqxDropDownList('destroy');
        this.$ctxMenu.jqxMenu('destroy');
    };

    Brightics.VA.Core.Views.LibraryExplorer = LibraryExplorer;

}).call(this);