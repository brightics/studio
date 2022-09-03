/**
 * Created by gy84.bae on 2016-01-28.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var Utils = Brightics.VA.Core.Utils;

    function Palette(parentId, options) {
        var _this = this;
        this.parentId = parentId;
        this.options = options;
        this.retrieveParent();
        this.setupVariables();
        this.createControls();
        this.createFilterControl();
        var promises = [];
        promises.push(this.getPaletteData());
        promises.push(this.getUdfData());
        promises.push(this.getFunctionFavorite());

        Promise.all(promises).then(function () {
            _this.createNavigatorControl();
            _this.bindEvents();
            if (_this.options.completeCallback) {
                _this.options.completeCallback();
            }
        });

        this.searchValue = '';
        this.favorite = false;
        this.functionsList = [];
        this.functionFavorite = new Set();
    }
    Palette.prototype.retrieveParent = function () {
        this.$parent = Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    Palette.prototype.setupVariables = function () {
        this.filterInputPlaceHolder = this.options.filterPlaceHolder || Brightics.locale.common.searchItem;
        this.sidebarFnName = 'func';
    };

    Palette.prototype.createControls = function () {
        var _this = this;

        this.$mainControl = $('' +
            '<div class="brtc-va-views-palette brtc-va-tab-contents brtc-style-tab-content">' +
            '   <div class="brtc-va-views-palette-context brtc-va-contextarea"></div>' +
            '   <div class="brtc-va-views-palette-filter brtc-va-searcharea brtc-style-search-area"></div>' +
            '   <div class="brtc-va-views-palette-navigator-wrapper  brtc-va-contentsarea">' +
            '       <div class="brtc-va-views-palette-navigator"></div>' +
            '   </div>' +
            '</div>');
        this.$parent.append(this.$mainControl);

        this.$context = this.$mainControl.find('.brtc-va-views-palette-context');
        this.$filter = this.$mainControl.find('.brtc-va-views-palette-filter');
        this.$navigator = this.$mainControl.find('.brtc-va-views-palette-navigator');
        this.$mainControl.find('.brtc-va-views-palette-navigator-wrapper').perfectScrollbar();
    };

    Palette.prototype.applyFilter = function () {
        var _this = this;

        var containers = this.$mainControl.find('.brtc-va-views-palette-fnunit-list');
        var tabs = this.$mainControl.find('div[role="tab"]');

        $.each(containers, function (index, _container) {
            _this.$navigator.jqxNavigationBar('expandAt', index);
        });

        var matchedList = this.getMatchedList(this.searchValue.trim());
        if(this.favorite) {
            matchedList = matchedList.filter(func => _this.favoriteMap.has(func));
        }
        var paletteItems = this.$mainControl.find('.brtc-va-views-palette-fnunit');
        $.each(paletteItems, function (_index, item) {
            var $funcElement = $(item).parent();
            var funcName = Utils.WidgetUtils.getData($funcElement.find('.brtc-va-views-palette-fnunit'), 'func');
            $funcElement.css('display', _this._inArray(funcName, matchedList) > -1 ? 'block' : 'none');
        });

        containers = this.$mainControl.find('.brtc-va-views-palette-fnunit-list');
        var expandedIndexes = this.$navigator.jqxNavigationBar('expandedIndexes');
        $.each(containers, function (index, container) {
            var visibleElements = $(container).find('.brtc-va-views-palette-fnunit-content').filter(function () {
                return $(this).css('display') === 'block';
            });
            var expanded = expandedIndexes.indexOf(index) >= 0;
            var title = $(tabs[index]).find('.brtc-va-views-palette-fnunit-type');
            title = title && title.length > 0 ? $($(tabs[index]).find('.brtc-va-views-palette-fnunit-type')[0]).text() : ''
            if ( title.trim() === 'UDF') return;
            $(container).css('display', expanded && visibleElements.length > 0 ? 'block' : 'none');
            $(container).prev().css('display', visibleElements.length > 0 ? 'block' : 'none');
        });

        this.$mainControl.find('.brtc-va-views-palette-navigator-wrapper').perfectScrollbar('update');
    };

    Palette.prototype._inArray = function (funcName, funcList) {
        return $.inArray(funcName, funcList);
    };

    Palette.prototype.checkExpanded = function () {
        return true;
    };

    Palette.prototype.checkUDFTitle = function () {
        return false;
    };

    Palette.prototype.getMatchedList = function (searchStr) {
        return Brightics.VA.Core.Functions.Library.getListByTags([searchStr]);
    };

    Palette.prototype.getContextList = function () {
        var rt = [];
        var passCategory = ['control', 'process', 'deeplearning', 'opt', 'ad'];

        _.forEach(this.functionsList, function ($fn) {
            var context = $fn.attr('context');
            var category = $fn.attr('category');
            if (_.isEmpty(context) ||
                _.indexOf(passCategory, category) > -1) return;
            rt = _.union(rt, [context]);
        })

        return rt;
    };

    Palette.prototype.createFavoriteMenu = function () {
        const _this = this;
        const $header = this.$mainControl.find('.brtc-va-editors-sheet-panels-propertiespanel-header');
        const $ctxMenu = $('' +
            '<div class="brtc-va-editors-sheet-panels-propertiespanel-header-ctxmenu">' +
            '   <ul>' +
            '       <li action="edit">Edit</li>' +
            '   </ul>' +
            '</div>');
        $header.append($ctxMenu);

        this.$ctxMenu = $ctxMenu.jqxMenu({
            theme: Brightics.VA.Env.Theme,
            width: '120px',
            height: '120px',
            autoOpenPopup: false,
            mode: 'popup',
            animationHideDuration: 0,
            animationShowDuration: 0
        });

        this.$ctxMenu.on('itemclick', function (event) {
            var $el = $(event.args);
            if ($el.attr('action') == 'edit') {
                new Brightics.VA.Core.Dialogs.FunctionFavoriteDialog($(document.body), {
                    title: 'Edit Function Favorite',
                    paletteData: _this.paletteData,
                    modelType: _this.options.modelType,
                    favorites: _this.favoriteMap,
                    close: function () {
                        _this.getFunctionFavorite();
                    }
                });
            }
        });

        this.ctxMenuCloseHandler = function () {
            _this.$ctxMenu.jqxMenu('close');
        };

        this.$ctxMenu.on('closed', function () {
            $(window).off('resize', _this.ctxMenuCloseHandler);
        });
    };

    Palette.prototype.createContextControl = function () {
        const _this = this;

        const $favorite_label = $(`
            <div class="brtc-va-views-palette-favorite-label">
                <div class="brtc-va-views-palette-favorite-icon" type="favorite_off"></div>
                <div class="brtc-va-views-palette-favorite-text">Favorite</div>
            </div>
        `);
        const $favorite_menu = $(`<div class="brtc-va-views-palette-favorite-icon" type="menu"></div>`);

        $favorite_label.find('.brtc-va-views-palette-favorite-icon').click(function () {
            if (this.getAttribute('type') === 'favorite_on') {
                this.setAttribute('type', 'favorite_off');
                _this.favorite = false;
                _this.applyFilter();
            } else {
                this.setAttribute('type', 'favorite_on');
                _this.favorite = true;
                _this.applyFilter();
            }
        });

        this.createFavoriteMenu();
        $favorite_menu.on('click', function (event) {
            var scrollTop = $(window).scrollTop();
            var scrollLeft = $(window).scrollLeft();
            var left = parseInt(event.clientX) + scrollLeft;

            var diffPosition = $(window).width() - event.clientX;
            if (diffPosition < 100) {
                left = left - 130;
            }
            var top = parseInt(event.clientY) + scrollTop;
            top += 5;

            _this.$ctxMenu.jqxMenu('open', left, top);
            $(window).on('resize', _this.ctxMenuCloseHandler);
        });

        this.$context.append($favorite_label);
        this.$context.append($favorite_menu);
    };

    Palette.prototype.showByContext = function (context) {
        _.forEach(this.functionsList, function ($fn) {
            if (_.isEqual(context, $fn.attr('context')) &&
                !_.isEqual('none', $fn.attr('title')))
                $fn.removeClass('brtc-style-display-none-important')
                    .addClass('brtc-style-display-flex-important');
        })
    };

    Palette.prototype.hideByContext = function (context) {
        var passCategory = ['control', 'process', 'deeplearning', 'opt', 'ad'];

        _.forEach(this.functionsList, function ($fn) {
            if (_.isEqual(context, $fn.attr('context')) &&
                _.indexOf(passCategory, $fn.attr('category')) == -1)
                $fn.removeClass('brtc-style-display-flex-important')
                    .addClass('brtc-style-display-none-important');
        })
    };

    Palette.prototype.createFilterControl = function () {
        var _this = this;

        var $filterInput = $('<input type="search" class="brtc-va-views-palette-filter-input searchinput"/>');
        this.$filter.append($filterInput);

        this.$filterInput = $filterInput;

        $filterInput.jqxInput({
            placeHolder: Brightics.locale.common.searchItem,
            theme: Brightics.VA.Env.Theme
        });
        $filterInput.keyup(function (event) {
            _this.searchValue = event.target.value.toLowerCase();
            _this.applyFilter();
        });

        $filterInput.on('search', function () {
            _this.searchValue = event.target.value.toLowerCase();
            _this.applyFilter();
        });
    };


    Palette.prototype.getPaletteData = function () {
        var _this = this;
        var option = {
            url: 'api/va/v2/studio/palette/' + this.options.modelType,
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            blocking: false
        };

        return new Promise(function (resolve, _reject) {
            $.ajax(option).done(function (data) {
                _this.paletteData = data.filter(function (x) {
                    return x.visible === true
                });
                resolve(data);
            }).fail(function () {
                resolve([])
            });
        });
    };

    Palette.prototype.getUdfData = function () {
        var _this = this;
        var option = {
            url: 'api/va/v3/ws/udfs',
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            blocking: false
        };

        return new Promise(function (resolve, _reject) {
            $.ajax(option).done(function (data) {
                _this.udfData = data;
                resolve(data);
            }).fail(function () {
                resolve([])
            });
        });
    };

    Palette.prototype.getFunctionFavorite = function () {
        var _this = this;
        var option = {
            url: 'api/vastudio/v3/functions/favorite',
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            blocking: false
        };

        return new Promise(function (resolve, _reject) {
            $.ajax(option).done(function (data) {
                _this.favoriteMap = new Set();
                for(const favorite of data) {
                    _this.favoriteMap.add(favorite.id);
                    _this.applyFilter();
                }
                resolve(data);
            }).fail(function () {
                resolve([])
            });
        });
    };

    Palette.prototype.setupJqxNavigation = function (data) {
        var opt = {
            theme: Brightics.VA.Env.Theme,
            expandMode: 'multiple',
            expandedIndexes: [],
            width: '100%'
            // width: 'calc(100% - 20px)'
        };
        for (var idx in data) {
            opt.expandedIndexes.push(parseInt(idx, 10));
        }
        this.$navigator.jqxNavigationBar(opt);
    };

    Palette.prototype.setupNavigator = function (data) {
        if (this.options.draggable) this.draggablePalette();
        this.setupJqxNavigation(data);

        this.$navigator.on('collapsedItem', function (_event) {
            this.$mainControl.find('.ps-container').perfectScrollbar('update');
        });
        this.$navigator.on('expandedItem', function (_event) {
            this.$mainControl.find('.ps-container').perfectScrollbar('update');
        });
        this.$mainControl.find('.brtc-va-views-palette-navigator-wrapper').perfectScrollbar();
    };

    Palette.prototype.createNavigatorControl = function () {
        var data = JSON.parse(JSON.stringify(this.paletteData));
        if (this.options.additionalGroup) data.push(this.options.additionalGroup);
        data = this.setupFunctions(data);
        data = this.createFunctions(data);

        this.createContextControl();
        this.setupNavigator(data);
    };

    Palette.prototype.makeHeaderButton = function ($parent) {
        var _this = this;
        var $udfButtonControl = $('' +
            '   <div class="brtc-va-views-palette-header-button">' +
            '       <button class="brtc-va-controls-palette-create"><div class="brtc-va-icon"></div>Create UDF</button>' +
            '       <button class="brtc-va-controls-palette-import"><div class="brtc-va-icon"></div>Import UDF</button>' +
            '   </div>');

        $parent.append($udfButtonControl);
        var $createUDFButton = $udfButtonControl.find('.brtc-va-controls-palette-create')
        var $importUDFButton = $udfButtonControl.find('.brtc-va-controls-palette-import')

        $createUDFButton.jqxButton({
            theme: Brightics.VA.Env.Theme
        })

        $createUDFButton.on('click', function () {
            var toolKitUrl = window.location.origin + '/toolkit/udf-generator/spec-generator';
            window.open(toolKitUrl, 'Brightics ToolKit')
        })

        $importUDFButton.jqxButton({
            theme: Brightics.VA.Env.Theme
        })

        $importUDFButton.on('click', function () {
            // import Dialog 생성
            new Brightics.VA.Core.Dialogs.ImportUDFDialog(_this.$mainControl, {
                fileType: 'AddonFunction',
                title: 'Import UDF',
                close: function (result) {
                    if (result.OK) {
                        Utils.WidgetUtils.openInformationDialog('Imported successfully new UDF');
                        _this.refreshControl();
                        var activeEditor = Studio.getEditorContainer().getActiveModelEditor();
                        var mid = activeEditor.getEditorInput().getFileId();
                        activeEditor.getModelLayoutManager().openActivity(mid);
                        // _this.options.editor.diagramEditorPage.render();
                        // _this.options.editor.resetSheetEditorPage();
                    }
                }
            });
        })
    };

    Palette.prototype._appendUdfFunctions = function ($functionListControl, functions) {
        var _this = this;
        functions.forEach(function (funcItem, index) {
            if (funcItem.visible) {
                var clazz = _this.options.modelType;
                var closeCallBack = _this._deleteUdfCallBack.bind(_this, funcItem);
                if (funcItem.deletable)
                    Utils.WidgetUtils.createPaletteUDFItem($functionListControl, funcItem.func, clazz, closeCallBack);
                else
                    Utils.WidgetUtils.createPaletteItem($functionListControl, funcItem.func, clazz);
            }
        });
    };

    Palette.prototype.appendFunction = function (funcGroup) {
        var _this = this;
        var $functionListControl = $('<div class = "brtc-va-views-palette-fnunit-list"></div>');

        if (funcGroup.key === 'udf') { // udf func list 일때 --> button control 추가.
            this.makeHeaderButton($functionListControl);
        }

        var functions = funcGroup.functions;

        if (funcGroup.key === 'udf') {
            this._appendUdfFunctions($functionListControl, functions);
        } else {
            $.each(functions, function (_index, funcItem) {
                if (funcItem.visible) {
                    var clazz = _this.options.modelType;
                    var $item;
                    if (funcItem.deletable) {
                        var closeCallBack = _this._deleteUdfCallBack.bind(_this, funcItem);
                        $item = Utils.WidgetUtils.createPaletteUDFItem($functionListControl, funcItem.func, clazz, closeCallBack);
                    } else {
                        $item = Utils.WidgetUtils.createPaletteItem($functionListControl, funcItem.func, clazz);
                    }
                    //kill me
                    if (!_.isEqual($item.attr('title'), 'none')) {
                        _this.functionsList.push($item);
                    }
                }
            });
        }

        var totalCount = $functionListControl.find('.brtc-va-views-palette-fnunit-content').length;
        var hiddenCount = $functionListControl.find('.brtc-va-views-palette-fnunit.brtc-va-fnunit-category-none').length;

        var $navBar = $('' +
            '<div>' +
            '   <div>' +
            '       <div class="brtc-va-views-palette-fnunit-type">' + Utils.WidgetUtils.convertHTMLSpecialChar(funcGroup.label) + '</div>' +
            '   </div>' +
            '</div>');
        if (funcGroup.key !== 'udf' &&
            totalCount === hiddenCount) {
            $navBar.addClass('brtc-va-palette-display-none');
            $functionListControl.addClass('brtc-va-palette-display-none');
        }

        // add header
        _this.$navigator.append($navBar);
        // add content
        _this.$navigator.append($functionListControl);
    };

    Palette.prototype.setupFunctions = function (data) {
        return data;
    };

    Palette.prototype.createFunctions = function (funcGroupList) {
        var _this = this;
        var visibleFuncGroupList = [];

        $.each(funcGroupList, function (index, funcGroup) {
            if (funcGroup.visible) {
                _this.appendFunction(funcGroup);
                visibleFuncGroupList.push(funcGroup);
            }
        });
        return visibleFuncGroupList;
    };

    Palette.prototype.draggablePalette = function () {
        var _this = this;

        this.$navigator.find(".brtc-va-views-palette-fnunit").each(function () {
            $(this).mouseover(function () {
                $(this).toggleClass('brtc-va-views-palette-fnunit-hover');
            }).mouseout(function () {
                $(this).toggleClass('brtc-va-views-palette-fnunit-hover');
            });

            _this._draggableFnUnit($(this));
        });
    };

    Palette.prototype._draggableFnUnit = function ($fnUnitElement) {
        var _this = this;
        $fnUnitElement.draggable({
            appendTo: 'body',
            scroll: false,
            cursor: 'move',
            cursorAt: {left: 5, top: 5},
            helper: function (event) {
                var $helper = $(this).clone();
                $helper.css({'z-index': 5100});

                var funcType = Utils.WidgetUtils.getData($fnUnitElement, 'func');
                var template = {
                    functions: [{func: funcType}],
                    links: []
                };
                Utils.WidgetUtils.putData($helper, 'template', template);
                Utils.WidgetUtils.putData($helper, 'source', _this);
                return $helper;
            },
            start: function (event, ui) {
                $('.brtc-va-studio').addClass('brtc-va-studio-dragging');

                $(this).draggable("option", "cursorAt", {
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

    Palette.prototype.udfChanged = function () {
        this.refreshControl();
    };

    Palette.prototype._deleteUdfCallBack = function (item, dialogResult) {
        var _this = this;
        if (dialogResult.OK) {
            //DELETE UDF
            var udfid = item && item.func ? item.func : '';
            $.ajax({
                url: 'api/va/v3/ws/udfs/' + udfid,
                type: 'DELETE',
                contentType: 'application/json; charset=utf-8',
                blocking: true
            }).done(function (data) {
                if (data === 'OK') {
                    _this.refreshControl();
                    if (udfid === '') Utils.WidgetUtils.openErrorDialog('Sorry! UDF has been Deleted! Try again');
                    else {
                        var clazz = _this.options.modelType;
                        delete Brightics.VA.Core.Interface.Functions[clazz][udfid];
                        var activeEditor = Studio.getEditorContainer().getActiveModelEditor();
                        var mid = activeEditor.getEditorInput().getFileId();
                        activeEditor.getModelLayoutManager().openActivity(mid);
                    }
                }
            }).fail(function (err) {
                Utils.WidgetUtils.openBadRequestErrorDialog(err);
            });
        }
    };

    Palette.prototype.refreshControl = function () {
        var _this = this;
        Studio.getInstance().reloadResource();
        this.$context.empty();
        this.$navigator.jqxNavigationBar('destroy');
        this.$mainControl.find('.brtc-va-views-palette-navigator-wrapper').append('<div class="brtc-va-views-palette-navigator"></div>');
        this.$navigator = this.$mainControl.find('.brtc-va-views-palette-navigator');

        var promises = [];
        promises.push(this.getPaletteData());
        promises.push(this.getUdfData());

        Promise.all(promises).then(function () {
            // _this.createControls();
            // _this.createFilterControl();
            _this.createNavigatorControl();
            _this.bindEvents();
            _this.searchValue = _this.$filterInput.val().toLowerCase();
            _this.applyFilter();
            if (_this.options.refreshCallback) {
                _this.options.refreshCallback();
            }
        })
    }

    Palette.prototype.bindEvents = function () {
        var _this = this;
        if (this.options.fnClickHandler) {
            this.$navigator.find('.brtc-va-views-palette-fnunit').each(function () {
                $(this).click(function (e) {
                    _this.options.fnClickHandler(this)
                });
            });
        }
    };

    Palette.prototype.destroy = function () {
    };

    Brightics.VA.Core.Views.Palette = Palette;

}).call(this);
