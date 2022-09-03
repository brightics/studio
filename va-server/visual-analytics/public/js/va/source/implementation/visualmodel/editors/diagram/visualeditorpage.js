/**
 * Created by SDS on 2016-09-05.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    const MAX_PAGE_COUNT = 10;

    function VisualEditorPage(parentId, options) {
        this.parentId = parentId;
        this.options = options;

        this.retrieveParent();
        this.createControls();

        this.initPages();
    }

    VisualEditorPage.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    VisualEditorPage.prototype.createControls = function () {
        this.$mainControl = $('' +
            '<div class="brtc-style-editor-visualeditorpage brtc-style-editor-editorpage">' +
            '   <div class="brtc-style-editor-visualeditorpage-paper-area" layout="normal-view">' +
            '       <div class="brtc-va-editor-visualeditorpage-toolbar-area brtc-style-editor-toolbar-area brtc-style-s-editor-toolbar-area" />' +
            '       <div class="brtc-style-editor-visualeditorpage-paper-container" />' +
            '   </div>' +
            '</div>'
        );
        this.$mainControl.css({
            width: this.options.width,
            height: this.options.height
        });
        this.$parent.append(this.$mainControl);

        this.createToolbar(this.$mainControl.find('.brtc-va-editor-visualeditorpage-toolbar-area'));
        this.getPageContainer().perfectScrollbar();
    };

    VisualEditorPage.prototype.destroy = function () {
        for (var key in this.controls) {
            this.controls[key].destroy();
        }
    };

    VisualEditorPage.prototype.createToolbar = function ($parent) {
        var $pageSelector = $('' +
            // '<div class="brtc-style-editor-toolitem brtc-style-s-editor-toolitem brtc-style-s-background-image-none brtc-style-margin-0" item-type="prev-page">' +
            // '   <i class="fa fa-caret-left" aria-hidden="true"></i>' +
            // '</div>' +
            '<div class="brtc-style-editor-toolitem brtc-style-s-editor-toolitem brtc-style-s-background-image-none" item-type="page-selector">' +
            '   <span class="brtc-va-editors-visualeditor-currentpage">1</span>' +
            '   <span>/</span>' +
            '   <span class="brtc-va-editors-visualeditor-totalpages">2</span>' +
            '   <span>page</span>' +
            '   <span><i class="fa fa-sort-desc" aria-hidden="true"></i></span>' +
            '</div>' +
            // '<div class="brtc-style-editor-toolitem brtc-style-s-editor-toolitem brtc-style-s-background-image-none brtc-style-margin-0" item-type="next-page">' +
            // '   <i class="fa fa-caret-right" aria-hidden="true"></i>' +
            // '</div>' +
            '<div class="brtc-style-editor-toolitem brtc-style-s-editor-toolitem brtc-style-s-background-image-none brtc-style-margin-0" item-type="add-page">' +
            '   <div class="brtc-style-s-background-image-icon-paper"></div>' +
            '   <div class="brtc-style-editor-toolitem-label">'+Brightics.locale.common.addPage+'</div>' +
            '</div>' +
            '<div class="brtc-style-editor-toolitem brtc-style-s-editor-toolitem brtc-style-s-background-image-none brtc-style-margin-0" item-type="delete-page">' +
            '   <div class="brtc-style-s-background-image-icon-paper-x"></div>' +
            '   <div class="brtc-style-editor-toolitem-label">'+Brightics.locale.common.deletePage+'</div>' +
            '</div>'
        );

        $parent.append($pageSelector);

        this.createPageThumbnailToolItem($parent);
        this.createAddPageToolItem($parent);
        this.createDeletePageToolItem($parent);
    };

    VisualEditorPage.prototype.createPageThumbnailToolItem = function ($parent) {
        var _this = this,
            closeDialog = function () {
                $thumbnailDialog.find('.brtc-style-figure-thumbnailwrapper').off('click');
                $('.brtc-va-editor-visualeditorpage-thumbnail .closebtn').click();
                $(window).off('mousedown', closeDialog);

            },
            $thumbnailDialog = $('' +
                '<div class="brtc-va-editor-visualeditorpage-thumbnail brtc-style-popup brtc-style-height-800px">' +
                '   <span class="icon tooltip"></span>' +
                '   <span class="btn close closebtn"></span>' +
                '   <div class="brtc-va-editor-visualeditorpage-thumbnail-area brtc-style-popup-content" layout="normal-view"></div>' +
                '</div>');
        $parent.append($thumbnailDialog);

        $parent.find('.brtc-style-editor-toolitem[item-type=page-selector]').on('click', function () {
            event.stopPropagation();

            $thumbnailDialog.find('.brtc-style-figure-thumbnailwrapper').off('click');
            $thumbnailDialog.find('.brtc-style-figure-thumbnailwrapper').on('click', function () {
                _this.setSelection([$(this).attr('page-id')]);
                _this.render();
            });
            $thumbnailDialog.toggle();
            $thumbnailDialog.find('.brtc-style-popup-content').sortable({
                containment: 'parent',
                tolerance: 'pointer',
                stop: function (event, ui) {
                    var ids = $thumbnailDialog.find('.brtc-style-popup-content').sortable('toArray');
                    var command = _this.createSortPageCommand(ids);
                    if (command) _this.executeCommand(command);
                },
                handle: '.brtc-style-btn-drag'
            });
            $(window).on('mousedown', closeDialog);

        });

        var $pageSelector = this.$mainControl.find('.brtc-style-editor-toolitem[item-type=page-selector]');
        var left = $pageSelector.position().left + $pageSelector.width() / 2 - $thumbnailDialog.width() / 2;
        $thumbnailDialog.css('left', left + 'px');

        $thumbnailDialog.find('.btn').jqxButton({
            theme: Brightics.VA.Env.Theme,
            height: 31
        });

        $thumbnailDialog.find('.closebtn').click(function () {
            $thumbnailDialog.hide();
            $(window).off('mousedown', closeDialog);
        });

        $thumbnailDialog.on('mousedown', function (event) {
            event.stopPropagation();
        });

        $thumbnailDialog.hide();
    };

    VisualEditorPage.prototype.createAddPageToolItem = function ($parent) {
        var _this = this;
        var $addPage = $parent.find('.brtc-style-editor-toolitem[item-type=add-page]');
        $addPage.click(function () {
            if (_this.options.editor.getModel().getPages().length == MAX_PAGE_COUNT) {
                Brightics.VA.Core.Utils.WidgetUtils.openInformationDialog('Maximum number of pages is ' + MAX_PAGE_COUNT + '.');
                return;
            }
            var command = new Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.NewPageCommand(_this.diagramEditorPage, {
                page: _this.options.editor.getModel().newPage()
            });
            _this.executeCommand(command);
        });
    };

    VisualEditorPage.prototype.createDeletePageToolItem = function ($parent) {
        var _this = this;
        var $deletePage = $parent.find('.brtc-style-editor-toolitem[item-type=delete-page]');
        $deletePage.click(function () {
            if (_this.options.editor.getModel().getPages().length === 1) {
                Brightics.VA.Core.Utils.WidgetUtils.openInformationDialog('At least one page must exist on report.');
                return;
            }

            var closeHandler = function (dialogResult) {
                if (dialogResult.OK) {
                    var $selected = $parent.find('.brtc-style-figure-thumbnailwrapper.ui-selected');
                    if ($selected.length > 0) {
                        var id = $($selected).attr('page-id');
                        _this.executeCommand(_this.createRemovePageCommand(id));
                    }
                }
            };
            Brightics.VA.Core.Utils.WidgetUtils.openConfirmDialog('Do you want to delete page?', closeHandler);
        });
    };

    VisualEditorPage.prototype.changeContentOutline = function (status) {
        this.$mainControl.find('.brtc-style-content-wrapper').toggleClass('disable-outline', !status);
    };

    VisualEditorPage.prototype.changeScale = function (scale) {
        this.options.scale = scale;

        var $pageContainer = this.getPageContainer();
        if (this.options.scale == 0.8) {
            this.$mainControl.attr('zoom-type', 'normal');
        } else if (this.options.scale == 0.6) {
            this.$mainControl.attr('zoom-type', 'small');
        } else {
            this.$mainControl.attr('zoom-type', 'large');
        }

        $pageContainer.perfectScrollbar('update');
        $pageContainer.animate({
            scrollTop: 0
        }, 500);
    };

    VisualEditorPage.prototype.initPages = function () {
        var pages = this.options.editor.getModel().getPages();

        this.controls = {};
        this.thumbnails = {};
        this.getPageContainer().empty();

        for (var i = 0; i < pages.length; i++) {
            this.addPage(pages[i]);
            this._createThumbnail(pages[i].id);
        }

        this.initEventListeners();
        this.updatePageIndexes();
        this.setSelection([this.options.editor.getModel().getPages()[0].id]);
    };

    VisualEditorPage.prototype.initEventListeners = function () {
        this.registerResizeEventListener();
        this.registerCommandEventListener();
        this.registerContentEventListener();
        this.registerSelectableEventListener();
    };

    VisualEditorPage.prototype.registerResizeEventListener = function () {
        $(window).on('resize', this.onResize.bind(this));
    };

    VisualEditorPage.prototype.registerSelectableEventListener = function () {
        var _this = this;
        this.getPageContainer().selectable({
            filter: '.brtc-style-content-wrapper',
            stop: function (event, ui) {
                var selected = [],
                    page = _this.controls[_this.selectedPageId],
                    $selected = page.$mainControl.find('.ui-selected');

                for (var i = 0; i < $selected.length; i++) {
                    selected.push($($selected[i]).attr('content-id'));
                }
                if (selected.length === 0) {
                    page.setSelection();
                } else {
                    page.setSelection(selected);
                }
                Studio.getActiveEditor().handleSelectionChanged(selected);
            },
            cancel: '.bcharts-pagination, .bcharts-container, .note-editing-area',
            tolerance: 'fit'
        });
    };

    VisualEditorPage.prototype.registerContentEventListener = function () {
        var _this = this;

        this.getPageContainer().bind('loadComplete', function (e, data) {
            _this._createThumbnail(data.pageId, 1500);
        });
    };

    VisualEditorPage.prototype._createThumbnail = function (pageId, delay) {
        if (!this.controls[pageId]) return;

        var _this = this;
        this.thumbnailJob = this.thumbnailJob || {};
        if (this.thumbnailJob[pageId]) clearTimeout(this.thumbnailJob[pageId]);
        this.thumbnailJob[pageId] = setTimeout(function () {
            var $page = _this.controls[pageId].$mainControl,
                $clone = $page.clone();

            var $canvas = $page.find('canvas');
            var $clonedCanvas = $clone.find('canvas');

            for (var i = 0; i < $canvas.length; i++) {
                var $originalCanvas = $canvas[i];
                var $newCanvas = $clonedCanvas[i];
                var newCanvasContext = $newCanvas.getContext('2d');
                newCanvasContext.drawImage($originalCanvas, 0, 0, $newCanvas.width, $newCanvas.height);
            }

            if (_this.thumbnails[pageId]) _this.thumbnails[pageId].setThumbnail($clone);
            _this.thumbnailJob[pageId] = null;
        }, delay || 300);
    };

    VisualEditorPage.prototype.onResize = function () {
        var $pageContainer = this.getPageContainer();
        $pageContainer.perfectScrollbar('update');
    };

    VisualEditorPage.prototype.registerCommandEventListener = function () {
        this.options.editor.addCommandListener(this.onCommand.bind(this));
    };

    VisualEditorPage.prototype.addPage = function (page) {
        var $thumbnail = this.getThumbnailArea(),
            $pageContainer = this.getPageContainer();

        var pageIndex = this.getPageIndex(page.id);
        this.controls[page.id] = new Brightics.VA.Implementation.Visual.Editors.Diagram.Figures.PaperUnit($pageContainer, {
            page: page,
            pageIndex: pageIndex,
            'background-color': this.options.editor.getModel().report.display.backgroundColor,
            editor: this.options.editor
        });
        this.thumbnails[page.id] = new Brightics.VA.Implementation.Visual.Editors.Diagram.PaperThumbnailUnit($thumbnail, {
            page: page,
            pageIndex: pageIndex,
            editor: this.options.editor
        });

        $thumbnail.perfectScrollbar('update');
    };

    VisualEditorPage.prototype.updatePageIndexes = function () {
        this.getTotalPageControl().text(Object.keys(this.controls).length);
        var pages = this.options.editor.getModel().getPages();
        for (var i in pages) {
            var id = pages[i].id;
            this.thumbnails[id].updatePageIndex(this.getPageIndex(id));
        }

        this.getCurrentPageControl().text(this.getPageIndex(this.selectedPageId) + 1);
    };

    VisualEditorPage.prototype.getPageIndex = function (id) {
        return this.options.editor.getModel().getPageIndex(id);
    };

    VisualEditorPage.prototype.removePage = function (id) {
        var $thumbnail = this.getThumbnailArea();
        var index = this.thumbnails[id].options.pageIndex,
            pages = this.options.editor.getModel().getPages();

        this.thumbnails[id].destroy();
        delete this.thumbnails[id];

        this.controls[id].destroy();
        delete this.controls[id];

        var selection = (pages[index]) ? (pages[index].id) : ((pages[index - 1]) ? (pages[index - 1].id) : (pages[0] ? pages[0].id : ''));
        this.setSelection([selection]);
        this.render();

        $thumbnail.perfectScrollbar('update');
    };

    VisualEditorPage.prototype.setSelection = function (selectedPageIds) {
        var $thumbnail = this.getThumbnailArea(),
            pageId = selectedPageIds[0]; //Temp Code

        for (var key in this.controls) {
            this.controls[key].hide();
        }

        $thumbnail.find('.brtc-style-figure-thumbnailwrapper.ui-selectee').removeClass('ui-selected');
        $thumbnail.find('.brtc-style-figure-thumbnailwrapper[page-id="' + pageId + '"].ui-selectee').addClass('ui-selected');
        this.getCurrentPageControl().text(0);

        if (pageId && this.controls[pageId]) {
            this.selectedPageId = pageId;

            this.controls[pageId].show();
            this.getCurrentPageControl().text(this.options.editor.getModel().getPageIndex(pageId) + 1);
        }

        $(window).trigger('resize');
    };

    VisualEditorPage.prototype.render = function (selectedPageIds) {
        if (selectedPageIds) this.controls[selectedPageIds].render();
        else this.controls[this.selectedPageId].render();
    };

    VisualEditorPage.prototype.reloadData = function (selectedPageIds) {
        if (selectedPageIds) this.controls[selectedPageIds].reloadData();
        else this.controls[this.selectedPageId].reloadData();
    };

    VisualEditorPage.prototype.executeCommand = function (command) {
        var commandManager = this.options.editor.getCommandManager();
        if (command.constructor === Brightics.VA.Core.CompoundCommand) {
            if (command.commandList.length === 0) {
                return false;
            }
        }
        return commandManager.execute(command);
    };

    VisualEditorPage.prototype.createSetPageDisplayOptionsCommand = function (options) {
        return new Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.SetPageDisplayOptionsCommand(this, {
            report: this.options.editor.getModel().report,
            display: options
        });
    };

    VisualEditorPage.prototype.createRemovePageCommand = function (id) {
        return new Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.RemovePageCommand(this, {
            pageId: id
        });
    };

    VisualEditorPage.prototype.createSortPageCommand = function (ids) {
        var pages = [];
        for (var i in this.options.editor.getModel().getPages()) {
            pages.push(this.options.editor.getModel().getPages()[i].id);
        }
        if (JSON.stringify(pages) != JSON.stringify(ids)) {
            return new Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.SortPageCommand(this, {
                pageIds: ids
            });
        } else {
            return;
        }
    };

    VisualEditorPage.prototype.onCommand = function (command) {
        if (command instanceof Brightics.VA.Core.CompoundCommand) this.onCompoundCommand(command);
        if (command instanceof Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.NewPageCommand) this.onNewPageCommand(command);
        if (command instanceof Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.RemovePageCommand) this.onRemovePageCommand(command);
        if (command instanceof Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.SortPageCommand) this.onSortPageCommand(command);
        if (command instanceof Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.SetPageDisplayOptionsCommand) this.onSetPageDisplayOptionsCommand(command);
    };

    VisualEditorPage.prototype.onCompoundCommand = function (command) {
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

    VisualEditorPage.prototype.onActivated = function () {
        this.setSelection([this.selectedPageId]);
        this.render();
    };

    VisualEditorPage.prototype.onSetPageDisplayOptionsCommand = function (command) {
        var _this = this;
        var pages = this.options.editor.getModel().getPages();
        for (var i = 0; i < pages.length; i++) {
            this._createThumbnail(pages[i].id);
        }
        setTimeout(function () {
            _this.getPageContainer().perfectScrollbar('update');
        }, 1000);
    };

    VisualEditorPage.prototype.onNewPageCommand = function (command) {
        if (command.event.type == 'REDO' || command.event.type == 'EXECUTE') {
            this.addPage(command.options.page);
            this.setSelection([command.options.page.id]);
            this._createThumbnail(command.options.page.id);
        } else if (command.event.type == 'UNDO') {
            this.removePage([command.options.page.id]);
        }

        this.updatePageIndexes();
    };

    VisualEditorPage.prototype.onRemovePageCommand = function (command) {
        if (command.event.type == 'REDO' || command.event.type == 'EXECUTE') {
            this.removePage([command.options.pageId]);
        } else if (command.event.type == 'UNDO') {
            this.addPage(command.old.page);
            this.setSelection([command.old.page.id]);
        }

        this.updatePageIndexes();
    };

    VisualEditorPage.prototype.onSortPageCommand = function (command) {
        this.updatePageIndexes();
    };

    VisualEditorPage.prototype.getPageContainer = function () {
        return this.$mainControl.find('.brtc-style-editor-visualeditorpage-paper-container');
    };

    VisualEditorPage.prototype.getThumbnailArea = function () {
        return this.$mainControl.find('.brtc-va-editor-visualeditorpage-thumbnail-area');
    };

    VisualEditorPage.prototype.getTotalPageControl = function () {
        return this.$mainControl.find('.brtc-va-editors-visualeditor-totalpages');
    };

    VisualEditorPage.prototype.getCurrentPageControl = function () {
        return this.$mainControl.find('.brtc-va-editors-visualeditor-currentpage');
    };

    VisualEditorPage.prototype.getSelectedPage = function () {
        return this.controls[this.selectedPageId];
    };

    VisualEditorPage.prototype.getSelectedObjects = function () {
        var objects = [];
        var page = this.getSelectedPage();
        var ids = page.getSelectedContentIds();

        _.forEach(ids, function (id) {
            objects.push(page.getContent(id));
        });

        return objects;
    };

    VisualEditorPage.prototype.pasteObjects = function (objects) {
        var compoundCommand = new Brightics.VA.Core.CompoundCommand(this);
        var page = this.getSelectedPage();
        _.forEach(objects, function(content) {
            compoundCommand.add(page.createPasteContentCommand(content));
            
        });
        page.executeCommand(compoundCommand);
    };

    VisualEditorPage.prototype.removeObjects = function (objects) {
        var compoundCommand = new Brightics.VA.Core.CompoundCommand(this);
        var page = this.getSelectedPage();
        _.forEach(objects, function(content) {
            compoundCommand.add(page.createRemoveContentCommand(content.id));
            
        });
        page.executeCommand(compoundCommand);
    };

    Brightics.VA.Implementation.Visual.Editors.Diagram.EditorPage = VisualEditorPage;
}).call(this);