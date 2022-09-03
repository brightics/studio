/**
 * Created by daewon77.park on 2016-03-27.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    /**
     * options : {
     *      fid : ''
     *      fnUnit : {}
     * }
     *
     * @param options
     * @constructor
     */
    function ChangePageSizeCommand(eventSource, options) {
        Brightics.VA.Core.CompoundCommand.call(this, eventSource, options);
    }

    ChangePageSizeCommand.prototype = Object.create(Brightics.VA.Core.CompoundCommand.prototype);
    ChangePageSizeCommand.prototype.constructor = ChangePageSizeCommand;

    ChangePageSizeCommand.prototype.execute = function () {
        this.commandList = [];
        var report = this.event.source.report;

        this.add(new Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.SetPageDisplayOptionsCommand(this.event.source, {
            report: report,
            display: this.options.display
        }));

        var newPageSize = this._getPageSize(this.options.display);
        var currentPageSize = this._getPageSize(this.event.source.report.display);



        var pages = this.event.source.report.pages;
        var page, contents, content;
        for (var i = 0; i < pages.length; i++) {
            page = pages[i];
            contents = page.contents;
            for (var j in contents) {
                content = contents[j];
                this.add(new Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.SetContentFigureCommand(this, {
                    content: content,
                    figure: this._getContentFigure(newPageSize, currentPageSize, content)
                }));
            }
        }

        Brightics.VA.Core.CompoundCommand.prototype.execute.call(this);
    };

    ChangePageSizeCommand.prototype._getContentFigure = function (newPageSize, currentPageSize, content) {
        var width = (content.size.width + '').replace('px', '') * 1;
        var height = (content.size.height + '').replace('px', '') * 1;
        var left = content.position.left;
        var top = content.position.top;

        var horizontalScale = newPageSize.width / currentPageSize.width;
        var verticalScale = newPageSize.height / currentPageSize.height;

        var newFigure = {
            size: {
                width: Number.parseInt(width * horizontalScale),
                height: Number.parseInt(height * verticalScale)
            },
            position: {
                left: Number.parseInt(left* horizontalScale),
                top: Number.parseInt(top * verticalScale)
            }
        };


        if(newFigure.size.width < 100){
            let gap = 100 - newFigure.size.width;
            newFigure.size.width = 100;
            if(newFigure.position.left - gap < 1){
                newFigure.position.left = 1;
            }else if(newFigure.position.left + 100 > newPageSize.width){
                newFigure.position.left = newPageSize.width - newFigure.size.width - 14;
            }
        }

        if(newFigure.size.height < 100){
            let gap = 100 - newFigure.size.height;
            newFigure.size.height = 100;

            if(newFigure.position.top - gap < 1){
                newFigure.position.top = 1;
            }else if(newFigure.position.top + 100 > newPageSize.height){
                newFigure.position.top = newPageSize.height - newFigure.size.height - 14;
            }
        }

        newFigure.size.width += 'px';
        newFigure.size.height += 'px';

        return newFigure;
    };

    ChangePageSizeCommand.prototype._getPageSize = function (display) {
        var pageSize;
        if (display['page-type'] === 'a4-vertical') {
            pageSize = {
                width: 795,
                height: 1125
            }
        } else if (display['page-type'] === 'a4-horizontal') {
            pageSize = {
                width: 1125,
                height: 795
            }
        } else if (display['page-type'] === 'custom') {
            pageSize = {
                width: display.width,
                height: display.height
            }
        }
        return pageSize;
    };


    ChangePageSizeCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.changepagesizecommand';
    };

    ChangePageSizeCommand.prototype.getLabel = function () {
        return 'Change a Page Size';
    };

    Brightics.VA.Core.Editors.Diagram.Commands.ChangePageSizeCommand = ChangePageSizeCommand;

}).call(this);