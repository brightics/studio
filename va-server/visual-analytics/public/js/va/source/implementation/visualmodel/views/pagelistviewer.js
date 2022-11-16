/**
 * Created by daewon.park on 2016-10-17.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function PageListViewer(parentId, options) {
        this.parentId = parentId;
        this.options = options;
        this.retrieveParent();
        this.createControls();
    }

    PageListViewer.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    PageListViewer.prototype.createControls = function () {
        this.$mainControl = $('' +
            '<div class="brtc-va-controls-page-viewer brtc-style-list-viewer page">' +
                //'   <input  class="brtc-va-controls-page-viewer-search brtc-style-search-input" type="search">' +
                // '   <div    class="brtc-va-controls-page-viewer-more brtc-style-more-button"></div>' +
            '   <button class="brtc-va-controls-page-viewer-addpage brtc-style-addpage-button"><i class="fa fa-plus" aria-hidden="true"></i> Add Page</button>' +
                //'   <button class="brtc-va-controls-page-viewer-refresh brtc-style-refresh-button"><div class="brtc-style-refresh-button-icon"></div>Refresh</button>' +
            '   <div    class="brtc-va-controls-page-viewer-list-container brtc-style-list-container page"></div>' +
            '   <div    class="brtc-va-controls-page-viewer-context-menu"></div>' +
            '</div>');

        this.$parent.append(this.$mainControl);

        //this.createSearchControl(this.$mainControl.find('.brtc-va-controls-page-viewer-search'));
        //this.createRefreshButton(this.$mainControl.find('.brtc-va-controls-page-viewer-refresh'));
        this.createAddPageButton(this.$mainControl.find('.brtc-va-controls-page-viewer-addpage'));
        // this.createMoreButton(this.$mainControl.find('.brtc-va-controls-page-viewer-more'));
        this.createListBoxControl(this.$mainControl.find('.brtc-va-controls-page-viewer-list-container'));
        this.createContextMenu(this.$mainControl.find('.brtc-va-controls-page-viewer-context-menu'));

        var _this = this;
        var blurItems = function (event) {
            if (!$(event.target).hasClass('brtc-va-controls-page-viewer-more')
                && !$(event.target).parents('.brtc-va-controls-page-viewer-context-menu').length
                && !$(event.target).parents('.brtc-va-dialogs-main').length) {
                _this.$selectedItem = undefined;
                _this.$mainControl.find('.brtc-va-controls-page-viewer-list-item').removeClass('brtc-style-list-item-selected');
            }
        };

        $(window).click(blurItems.bind(this));
    };

    PageListViewer.prototype.destroy = function () {

    };

    PageListViewer.prototype.createSearchControl = function ($control) {
        var _this = this;
        this.$searchControl = $control.jqxInput({
            placeHolder: 'Search Item',
            theme: Brightics.VA.Env.Theme
        });
        this.$searchControl.keyup(function (event) {
            _this.applyFilter();
        });
        this.$searchControl.on('search', function (event) {
            _this.applyFilter();
        });
    };

    PageListViewer.prototype.applyFilter = function () {
        $(window).trigger('resize');
    };

    PageListViewer.prototype.createRefreshButton = function ($control) {
        var _this = this;
        this.$refreshButton = $control.jqxButton({
            theme: Brightics.VA.Env.Theme
        });
        this.$refreshButton.click(function (event) {

        });
    };

    PageListViewer.prototype.createAddPageButton = function ($control) {
        var _this = this;
        this.$uploadButton = $control.jqxButton({
            theme: Brightics.VA.Env.Theme
        });
        this.$uploadButton.click(function (event) {
            _this.addNewPage('append');
        });
    };

    PageListViewer.prototype.createMoreButton = function ($control) {
        var _this = this;
        $control.click(function (event) {
            _this.openContextMenu($(event.currentTarget));
        });
    };

    PageListViewer.prototype.openContextMenu = function ($target) {
        var left = $target.offset().left + $target.width() - 2;
        var top = $target.offset().top + $target.height() + 10;

        this.$ctxMenu.jqxMenu('open', left, top);
    };

    PageListViewer.prototype.createListBoxControl = function ($control) {
        this.$listBox = $control;
        this.$listBox.perfectScrollbar();
    };

    PageListViewer.prototype.setSource = function (pages) {
        this.render(pages);
    };

    PageListViewer.prototype.render = function (pages) {
        var $target = this.$listBox;
        $target.empty();

        for (var i in pages) {
            var pageIndex = (Number(i) + 1);
            var $item = this.createItemElement(pages[i].id, pageIndex + ' Page');
            $target.append($item);
        }
        this.$listBox.perfectScrollbar('update');
    };

    PageListViewer.prototype.createContextMenu = function ($control) {
        var _this = this;

        $control.append('' +
            '<ul>' +
            '   <li action="prepend">Prepend Page</li>' +
            '   <li action="append">Append Page</li>' +
            '   <li action="insert">Insert After Selected</li>' +
            '   <li action="delete">Delete</li>' +
            '</ul>');

        this.$ctxMenu = $control.jqxMenu({
            theme: Brightics.VA.Env.Theme,
            width: '150px',
            height: '20px',
            autoOpenPopup: false,
            popupZIndex: 50000,
            mode: 'popup',
            animationHideDuration: 0,
            animationShowDuration: 0
        });

        this.$ctxMenu.on('itemclick', function (event) {
            var $el = $(event.args);
            var selectedItem = _this.$selectedItem;
            if ($el.attr('action') === 'prepend') {
                _this.addNewPage('prepend');
            } else if ($el.attr('action') === 'append') {
                _this.addNewPage('append');
            } else if ($el.attr('action') === 'insert') {
                _this.addNewPage('insert');
            } else if ($el.attr('action') === 'delete') {
                if (selectedItem) {
                    _this.openDeleteDialog();
                } else {
                    Brightics.VA.Core.Utils.WidgetUtils.openInformationDialog('There is no selected page.');
                }
            }
        });
    };

    PageListViewer.prototype.addNewPage = function (type) {
        var activeEditor = this.options.pageExplorer.activeEditor;
        var model = activeEditor.options.editorInput.getContents();

        type = (type) ? (type) : ('append');
        var pageIndex;
        switch (type) {
            case 'append':
                pageIndex = undefined;
                break;
            case 'prepend':
                pageIndex = 0;
                break;
            case 'insert':
                if (this.$selectedItem) {
                    var pageId = this.$selectedItem.data('id');
                    var targetIndex = model.getPageIndex(pageId);

                    pageIndex = (Number(targetIndex) + 1);
                }
                else {
                    pageIndex = undefined;
                }
                break;
            default:
                pageIndex = undefined;
        }
        var newPage = model.newPage();
        var command = new Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.NewPageCommand(this, {
            page: newPage,
            pageIndex: pageIndex
        });
        var commandManager = activeEditor.getCommandManager();
        commandManager.execute(command);
    };

    PageListViewer.prototype.openDeleteDialog = function () {
        var _this = this;
        var file = this.options.pageExplorer.editorInput;
        var model = file.contents;

        var pageId = this.$selectedItem.data('id');
        var targetIndex = model.getPageIndex(pageId) + 1;
        var message = 'Are you sure you want to delete "' + targetIndex + '" page?';

        Brightics.VA.Core.Utils.WidgetUtils.openConfirmDialog(message, function (dialogResult) {
            if (dialogResult.OK) {
                var resourceManager = Studio.getResourceManager();

                model.removePage(pageId);
                resourceManager.updateFile(file);

                _this.$selectedItem.remove();
                _this.$selectedItem = undefined;
            }
        });
    };

    PageListViewer.prototype.removePage = function (pageId) {
        var $pageElement = $('#page-item-' + pageId);
        $pageElement.remove();
        this.$listBox.perfectScrollbar('update');
    };

    PageListViewer.prototype.addPage = function (page, index) {
        var $target = this.$listBox;

        var pageIndex = (Number(index) + 1);
        var $item = this.createItemElement(page.id, pageIndex + ' Page');
        if (index) {
            if (index == 0) {
                $target.prepend($item);
            } else {
                $target.find('div:nth-child(' + (index) + ')').after($item);
            }
        }
        else {
            $target.append($item);
        }

        this.$listBox.perfectScrollbar('update');
    };

    PageListViewer.prototype.createItemElement = function (id, label) {
        var _this = this;
        var $item = $('<div id="page-item-' + id + '" data-id="' + id + '" class="brtc-va-controls-page-viewer-list-item brtc-style-list-item">' + label + '</div>');
        $item.click(function (event) {
            $(this).parent().find('.brtc-va-controls-page-viewer-list-item').removeClass('brtc-style-list-item-selected');
            $(this).addClass('brtc-style-list-item-selected');
            _this.$selectedItem = $(this);

            var activeEditor = _this.options.pageExplorer.activeEditor;
            activeEditor.showPage($(this).data('id'));

            event.stopPropagation();
        });
        return $item;
    };

    Brightics.VA.Implementation.Visual.Views.PageListViewer = PageListViewer;

}).call(this);