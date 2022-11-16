/**
 * Created by daewon.park on 2016-09-19.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var SCALE = .5;

    function ClipboardExplorer(parentId, options) {
        Brightics.VA.Core.Views.LibraryExplorer.call(this, parentId, options);
    }

    ClipboardExplorer.prototype = Object.create(Brightics.VA.Core.Views.LibraryExplorer.prototype);
    ClipboardExplorer.prototype.constructor = ClipboardExplorer;

    ClipboardExplorer.prototype.createControls = function () {
        this.$mainControl = $('' +
            '<div class="brtc-va-views-library brtc-va-tab-contents">' +
            '   <div class="brtc-va-views-library-container brtc-style-margin-0"></div>' +
            '</div>');
        this.$parent.append(this.$mainControl);

        this.fillTemplates();
    };

    ClipboardExplorer.prototype.fillTemplates = function () {
        var _this = this;
        for (var i in this.options.functionList) {
            _this._addTemplate(this.options.functionList[i]);
        }
    };

    ClipboardExplorer.prototype._addTemplate = function (template) {
        var $item = $('' +
            '<div class="brtc-va-views-library-template" uid="' + template.uid + '">' +
            '   <div class="brtc-va-views-library-template-label brtc-va-studio-dm-draggable"></div>' +
            '   <div class="brtc-va-views-library-template-preview"></div>' +
            '</div>');

        this.$mainControl.find('.brtc-va-views-library-container').append($item);

        this._addTemplateLabel($item.find('.brtc-va-views-library-template-label'), template);

        var $paperElement = $item.find('.brtc-va-views-library-template-preview');

        var graph = new joint.dia.Graph();
        var paper = new joint.dia.Paper({
            el: $paperElement,
            width: '100%',
            height: 'calc(100% - 43px)',
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

    ClipboardExplorer.prototype._removeTemplate = function (template) {
        var $item = this.$mainControl.find('.brtc-va-views-library-template[uid=' + template.uid + ']');
        $item.remove();
    };


    ClipboardExplorer.prototype._addTemplateLabel = function ($parent, template) {
        var functions = template.contents.functions;
        var labelText = functions.length === 1 ? '1 ' + Brightics.locale.clipboard.function : functions.length + ' ' + Brightics.locale.clipboard.functions;
        var size = template.width + ' x ' + template.height;

        $parent.append(labelText + '<br>' + size);
    };

    ClipboardExplorer.prototype.updateFunctionList = function (newFunctionList) {

        for (var i in newFunctionList) {
            var newFunction = newFunctionList[i];
            if (!this._isInTargetFunctionList(newFunction, this.options.functionList)) {
                this._addTemplate(newFunction);
            }
        }

        for (var i in this.options.functionList) {
            var currentFunction = this.options.functionList[i];
            if (!this._isInTargetFunctionList(currentFunction, newFunctionList)) {
                this._removeTemplate(newFunction);
            }
        }
        this.options.functionList = $.extend(true, [], newFunctionList);
    };


    ClipboardExplorer.prototype._isInTargetFunctionList = function (func, targetList) {
        var isExist = false;
        for (var i in targetList) {
            var currentFunction = targetList[i];
            if (func.uid === currentFunction.uid) {
                isExist = true;
                break;
            }
        }
        return isExist;
    };


    Brightics.VA.Core.Views.ClipboardExplorer = ClipboardExplorer;

}).call(this);
