/**
 * Created by daewon.park on 2016-10-17.
 */
/* global _ */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var PATH_ROOT = '';
    var PATH_SHARED = PATH_ROOT + '/shared/upload';
    var ELEMENT_HIDE = 'brtc-va-controls-repository-viewer-element-hide';

    function RepositoryViewer(parentId, options) {
        this.parentId = parentId;
        this.options = options;
        this.loadedFolders = {};
        this.retrieveParent();
        this.createControls();
    }

    RepositoryViewer.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    RepositoryViewer.prototype.createControls = function () {
        this.$mainControl = $('' +
            '<div class="brtc-va-controls-repository-viewer">' +
            '   <input  class="brtc-va-controls-repository-viewer-search" type="search">' +
            '   <div    class="brtc-va-controls-repository-viewer-more"></div>' +
            '   <button class="brtc-va-controls-repository-viewer-upload"><div class="brtc-va-icon"></div>' + Brightics.locale.common.add + '</button>' +
            '   <button class="brtc-va-controls-repository-viewer-refresh"><div class="brtc-va-icon"></div>' + Brightics.locale.common.refresh + '</button>' +
            '   <div    class="brtc-va-controls-repository-viewer-tree"></div>' +
            '   <div    class="brtc-va-controls-repository-viewer-context-menu"></div>' +
            '</div>');

        this.$parent.append(this.$mainControl);

        this.createSearchControl(this.$mainControl.find('.brtc-va-controls-repository-viewer-search'));
        this.createRefreshButton(this.$mainControl.find('.brtc-va-controls-repository-viewer-refresh'));
        this.createUploadButton(this.$mainControl.find('.brtc-va-controls-repository-viewer-upload'));
        this.createMoreButton(this.$mainControl.find('.brtc-va-controls-repository-viewer-more'));
        this.createTreeControl(this.$mainControl.find('.brtc-va-controls-repository-viewer-tree'));
        this.createContextMenu(this.$mainControl.find('.brtc-va-controls-repository-viewer-context-menu'));
        this.$searchControl.focus();
    };

    RepositoryViewer.prototype.destroy = function () {
        this.$ctxMenu.jqxMenu('destroy');
        this.$tree.jqxTree('destroy');
    };

    RepositoryViewer.prototype.createSearchControl = function ($control) {
        var _this = this;
        this.$searchControl = $control.jqxInput({
            placeHolder: Brightics.locale.common.searchItem,
            theme: Brightics.VA.Env.Theme
        });

        this.throttledApplyFilter = _.throttle(function () {
            _this.applyFilter();
        }, 500);
        this.$searchControl.keyup(function (evt) {
            _this.throttledApplyFilter();
        });
        this.$searchControl.on('search', function (event) {
            _this.throttledApplyFilter();
        });
    };

    RepositoryViewer.prototype.applyFilter = function () {
        var _this = this;
        var filterValue = this.$searchControl.val().toLowerCase().trim();
        if (filterValue.length > 0) {
            _.forEach(_this.$tree[0].querySelectorAll('li'), function (el) {
                el.classList.add(ELEMENT_HIDE);
            });
            var items = _this.$tree.jqxTree('getItems');
            $.each(items, function (index, item) {
                if (item.value) {
                    var path = item.value;
                    var idx = path.lastIndexOf('/');
                    var parent = path.substring(0, idx);
                    if (parent == PATH_SHARED || parent.indexOf('/' + Brightics.VA.Env.Session.userId + '/upload') == 0) {
                        var file = path.substring(idx + 1).toLowerCase();
                        if (file.indexOf(filterValue) > -1) {
                            item.element.classList.remove(ELEMENT_HIDE);
                            var parentElement = item.parentElement;
                            while (parentElement) {
                                parentElement.classList.remove(ELEMENT_HIDE);
                                var parentItem = _this.$tree.jqxTree('getItem', parentElement);
                                parentElement = parentItem.parentElement;
                            }
                        }
                    }
                }
            });
        } else {
            _.forEach(_this.$tree[0].querySelectorAll('li'), function (el) {
                el.classList.remove(ELEMENT_HIDE);
            });
        }

        this.debouncedTriggerResize = this.debouncedTriggerResize || _.debounce(function () {
            $(window).trigger('resize');
        }, 1000);
        this.debouncedTriggerResize();

        if (_this.$tree.find('.brtc-va-controls-repository-viewer-loading').length > 0) {
            _this.$tree.jqxTree('expandAll');
            _this.throttledApplyFilter();
        }
    };

    RepositoryViewer.prototype.createRefreshButton = function ($control) {
        var _this = this;
        this.$refreshButton = $control.jqxButton({
            theme: Brightics.VA.Env.Theme
        });
        this.$refreshButton.click(function (event) {
            _this.$searchControl.val('');
            _this.initRootItem();
            _this.loadedFolders = {};
            Brightics.VA.RepositoryQueryTemplate.browse(PATH_ROOT, true, {blocking: true});
        });
    };

    RepositoryViewer.prototype.createUploadButton = function ($control) {
        var _this = this;
        this.$uploadButton = $control.jqxButton({
            theme: Brightics.VA.Env.Theme
        });
        this.$uploadButton.click(function (event) {
            new Brightics.VA.Core.Wizards.DataUploadWizard(_this.$mainControl, {
                mode: 'open',
                close: function (dialogResult) {
                    if (dialogResult.OK) {
                        if (dialogResult.path) {
                            _this.addItem(dialogResult.path);
                            _this.selectItem(dialogResult.path, true);
                        }
                        _this.$searchControl.val('');
                        Brightics.VA.RepositoryQueryTemplate.browse(PATH_ROOT, true, {blocking: true});
                    }
                }
            });
        });
    };

    RepositoryViewer.prototype.createMoreButton = function ($control) {
        var _this = this;
        $control.click(function (event) {
            _this.openContextMenu($(event.currentTarget));
        });
    };

    RepositoryViewer.prototype.createTreeControl = function ($control) {
        var _this = this;

        this.$tree = $control.jqxTree({
            theme: Brightics.VA.Env.Theme,
            width: 'calc(100% - 2px)',
            height: 'calc(100% - 82px)',
            allowDrag: false,
            allowDrop: false
        });

        this.initRootItem();

        this.$tree.on('select', function () {
            _this.pended = null;
        });

        this.$tree.on('expand', function (event) {
            var loader = false;
            var loaderItem = null;
            var $element = $(event.args.element);
            var children = $element.find('ul:first').children();
            $.each(children, function () {
                var item = _this.$tree.jqxTree('getItem', this);
                if (item && !item.value) {
                    // item ??value 가 ?�으�?(loading...) ?�다.
                    loaderItem = item;
                    loader = true;
                    return false;
                }
            });
            if (loader && !_this.loadedFolders[$element.attr('id')]) {
                _this.loadedFolders[$element.attr('id')] = true;
                var path = _this.$tree.jqxTree('getItem', $element[0]).value;
                Brightics.VA.RepositoryQueryTemplate.browse(path, false, {blocking: false}).done(function (files) {
                    _this.$tree.jqxTree('removeItem', loaderItem.element);

                    if (files.length > 0) {
                        var items = files.filter(function (file) {
                            if (file.path.indexOf(path) == 0) {
                                return file;
                            }
                        }).map(function (file) {
                            var idx = file.path.lastIndexOf('/');
                            var parent = file.path.substring(0, idx);
                            if (parent == '/' + Brightics.VA.Env.Session.userId + '/upload/') {
                                return _this.createFolderItem(file.path);
                            } else {
                                return _this.createFileItem(file.path);
                            }
                        });

                        if (items.length > 0) {
                            _this.$tree.jqxTree('addTo', items, $element[0]);
                        }
                        _this.$tree.jqxTree('refresh');
                        if (_this.pended) {
                            _this.selectItem(_this.pended);
                        }
                        _this._updateTooltip();
                    }
                }).fail(function (err) {
                    _this.$tree.jqxTree('removeItem', loaderItem.element);
                    Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(err);
                });
            }
        });
    };

    RepositoryViewer.prototype.openContextMenu = function ($target) {
        var left = $target.offset().left + $target.width() - 140 - 2;
        var top = $target.offset().top + $target.height() + 10;

        this.$ctxMenu.jqxMenu('open', left, top);
    };

    RepositoryViewer.prototype.createContextMenu = function ($control) {
        var _this = this;

        $control.append('' +
            '<ul>' +
            '   <li action="rename">'+Brightics.locale.common.rename+'</li>' +
            '   <li action="delete">'+Brightics.locale.common.delete+'</li>' +
            '   <li action="export">'+Brightics.locale.common.export+'</li>' +
            '</ul>');

        this.$ctxMenu = $control.jqxMenu({
            theme: Brightics.VA.Env.Theme,
            width: '140px',
            height: '20px',
            autoOpenPopup: false,
            popupZIndex: 50000,
            mode: 'popup',
            animationHideDuration: 0,
            animationShowDuration: 0
        });

        this.$ctxMenu.on('itemclick', function (event) {
            var path;
            var $el = $(event.args);
            if ($el.attr('action') === 'rename') {
                path = _this.getSelectedFile();
                if (path) {
                    _this.openRenameDialog(path);
                } else {
                    Brightics.VA.Core.Utils.WidgetUtils.openInformationDialog('There is no selected file.');
                }
            } else if ($el.attr('action') === 'delete') {
                path = _this.getSelectedFile();
                if (path) {
                    _this.openDeleteDialog(path);
                } else {
                    Brightics.VA.Core.Utils.WidgetUtils.openInformationDialog('There is no selected file.');
                }
            } else {
                path = _this.getSelectedFile();
                if (path) {
                    _this.openExportDialog(path);
                } else {
                    Brightics.VA.Core.Utils.WidgetUtils.openInformationDialog('There is no selected file.');
                }
            }
        });
    };

    RepositoryViewer.prototype.openExportDialog = function (path) {
        var _this = this;
        var userId = Brightics.VA.Env.Session.userId;

        var offset = path.lastIndexOf('/');
        var name = path.substring(offset + 1);
        new Brightics.VA.Core.Wizards.DataExportWizard(_this.$mainControl, {
            name: name,
            path: path,
            mode: 'open',
            close: function (dialogResult) {
                if (dialogResult.OK) {
                    _this.initRootItem();
                    Brightics.VA.RepositoryQueryTemplate.browse(PATH_ROOT, true, {blocking: true});
                }
            },
            userid: userId
        });
    };

    RepositoryViewer.prototype.openRenameDialog = function (path) {
        var _this = this;
        var offset = path.lastIndexOf('/');
        var dir = path.substring(0, offset);
        var name = path.substring(offset + 1);
        new Brightics.VA.Core.Dialogs.RenameDialog(this.$mainControl, {
            name: name,
            close: function (dialogResult) {
                if (dialogResult.OK) {
                    Brightics.VA.RepositoryQueryTemplate.move(path, dir + '/' + dialogResult.newName, {blocking: true}).done(function () {
                        _this.$searchControl.val('');
                        _this.initRootItem();
                        Brightics.VA.RepositoryQueryTemplate.browse(PATH_ROOT, true, {blocking: false});
                    }).fail(function (err) {
                        Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(err);
                    });
                }
            },
            title: Brightics.locale.common.rename
        });
    };

    RepositoryViewer.prototype.openDeleteDialog = function (path) {
        var _this = this;
        var offset = path.lastIndexOf('/');
        var name = path.substring(offset + 1);
        var message = 'Are you sure you want to delete "' + name + '"?';
        Brightics.VA.Core.Utils.WidgetUtils.openConfirmDialog(message, function (dialogResult) {
            if (dialogResult.OK) {
                Brightics.VA.RepositoryQueryTemplate.delete(path, {blocking: true}).done(function () {
                    _this.initRootItem();
                    Brightics.VA.RepositoryQueryTemplate.browse(PATH_ROOT, true, {blocking: false});
                }).fail(function (err) {
                    Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(err);
                });
            }
        });
    };

    RepositoryViewer.prototype.createLoadingItem = function () {
        return {
            html: '<div class="brtc-va-controls-repository-viewer-loading"><div class="brtc-va-icon"></div> Loading...</div>'
        };
    };

    RepositoryViewer.prototype.createFolderItem = function (path) {
        var idx = path.lastIndexOf('/');
        return {
            html: '<i class="fa fa-folder" aria-hidden="true"></i>' + _.escape(path.substring(idx + 1)),
            value: path,
            items: [this.createLoadingItem()]
        };
    };

    RepositoryViewer.prototype.createFileItem = function (path) {
        var idx = path.lastIndexOf('/');
        return {
            html: '<i class="fa fa-file-o" aria-hidden="true"></i>' + _.escape(path.substring(idx + 1)),
            value: path,
            items: []
        };
    };

    RepositoryViewer.prototype._updateTooltip = function () {
        var items = this.$tree.jqxTree('getItems');
        $.each(items, function () {
            $(this.titleElement).attr('title', this.label);
        });
    };

    RepositoryViewer.prototype.initRootItem = function () {
        this.$tree.jqxTree('clear');

        var items = [{
            html: '<i class="fa fa-folder" aria-hidden="true"></i>shared',
            value: '/shared',
            expanded: true,
            items: [{
                html: '<i class="fa fa-folder" aria-hidden="true"></i>upload',
                value: '/shared/upload',
                items: [this.createLoadingItem()]
            }]
        },
            {
                html: '<i class="fa fa-folder" aria-hidden="true"></i>' + Brightics.VA.Env.Session.userId,
                value: '/' + Brightics.VA.Env.Session.userId,
                expanded: true,
                items: [{
                    html: '<i class="fa fa-folder" aria-hidden="true"></i>upload',
                    value: '/' + Brightics.VA.Env.Session.userId + '/upload',
                    items: [this.createLoadingItem()]
                }]
            }];

        this.$tree.jqxTree('addTo', items, this.$tree[0]);
        this._updateTooltip();
    };

    RepositoryViewer.prototype.getSelectedPath = function () {
        var item = this.$tree.jqxTree('getSelectedItem');
        return item ? item.value : undefined;
    };

    RepositoryViewer.prototype.render = function () {
        this.$tree.jqxTree('render');
    };

    RepositoryViewer.prototype.getSelectedFile = function () {
        var item = this.$tree.jqxTree('getSelectedItem');
        if (item && item.value && item.value.indexOf(PATH_SHARED + '/') == 0) {
            return item.value;
        } else if (item && item.value && item.value.indexOf('/' + Brightics.VA.Env.Session.userId + '/upload/') == 0) {
            // '/brtc/repo/users/daewon77.park@samsung.com/iris.csv'.split('/') ?�면 결과??
            // ["", "brtc", "repo", "users", "daewon77.park@samsung.com", "iris.csv"] ?�렇�??�온??
            // �? 배열 ?�기가 6 ?�어?��? ?�일 path ??것이??
            var segments = item.value.split('/');
            if (segments.length == 4) {
                return item.value;
            }
        }
    };

    RepositoryViewer.prototype.getSelectedFileType = function () {
        var selected = this.$tree.jqxTree('getSelectedItem');
        if (selected) {
            var el = _.get(selected, 'element');
            var div = el.querySelector('div');
            if (div && div.children[0]) {
                return div.children[0].classList.contains('fa-folder') ? 'folder' : 'file';
            }
        }
        return undefined;
    };

    RepositoryViewer.prototype.addItem = function (path) {
        var repo = path.split('/')[1];
        var fname = path.split('/')[3];
        var repoItem = this.getRepo(repo);
        var uploadFolderItem = this.getChildren(repoItem)[0];
        var files = this.getChildren(uploadFolderItem);
        if (files.length > 0 && !files[0].value) return;
        var idx = 0;
        while (idx < files.length && files[idx].label.localeCompare(fname) < 0) {
            idx++;
        }
        if (idx < files.length && files[idx].label.localeCompare(fname) === 0) {
            return;
        }
        var newFile = this.createFileItem(path);
        if (idx >= files.length) {
            this.$tree.jqxTree('addTo', newFile, uploadFolderItem);
        } else {
            this.$tree.jqxTree('addBefore', newFile, files[idx]);
        }
    };

    RepositoryViewer.prototype.getChildren = function (parItem) {
        var items = this.$tree.jqxTree('getItems');
        if (!parItem) {
            return items.filter(function (item) {
                return !item.parentElement;
            });
        }
        return items.filter(function (item) {
            return item.parentElement === parItem.element;
        });
    };

    RepositoryViewer.prototype.getRepo = function (name) {
        var items = this.getChildren();
        return items.find(function (item) {
            return item.label === name;
        });
    };

    RepositoryViewer.prototype.selectItem = function (path, pending) {
        var _this = this;
        var repo = path.split('/')[1];
        var repoItem = this.getRepo(repo);
        var uploadFolderItem = this.getChildren(repoItem)[0];
        var select = function () {
            var files = _this.getChildren(uploadFolderItem);
            var target = files.find(function (file) {
                return file.value === path;
            });
            if (target) {
                _this.$tree.jqxTree('selectItem', target.element);
                return true;
            }
            return false;
        };
        this.$tree.jqxTree('expandItem', uploadFolderItem.element);
        if (select()) return;
        if (pending) this.pended = path;
    };

    Brightics.VA.Core.Controls.RepositoryViewer = RepositoryViewer;

}).call(this);
