/**
 * Created by daewon77.park on 2016-03-24.
 */

/* global _ */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var Utils = Brightics.VA.Core.Utils;

    function SwitchFnUnitDialog(parentId, options) {
        this.parentId = parentId;
        this.options = options;
        this.dialogResult = {
            OK: false,
            Cancel: true,
        };
        this.retrieveParent();
        this.createControls();
        this.initContents();
    }

    SwitchFnUnitDialog.prototype.retrieveParent = function () {
        this.$parent = Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    SwitchFnUnitDialog.prototype.createControls = function () {
        this.$mainControl = $('' +
            '<div class="brtc-va-dialogs-main brtc-va-dialogs-selectfnunit">' +
            '   <div class="brtc-va-dialogs-body brtc-va-dialogs-selectfnunit">' +
            '       <div class="brtc-va-dialogs-contents brtc-va-dialogs-selectfnunit" />' +
            '   </div>' +
            '</div>');
        this.$parent.append(this.$mainControl);

        var _this = this;
        var jqxOpt = {
            theme: Brightics.VA.Env.Theme,
            title: Brightics.locale.common.selectFunction,
            width: 800,
            height: 700,
            modal: true,
            resizable: false,
            close: function () {
                if (typeof _this.options.close === 'function') {
                    _this.options.close(_.merge({position: _this.options.position},
                        _this.dialogResult));
                }
                _this.$mainControl.dialog('destroy');
                _this.$mainControl.remove();
            },
        };
        this.$mainControl.dialog(jqxOpt);
        $('button.ui-dialog-titlebar-close', $(this).parent()).css('right', '1em');
    };

    SwitchFnUnitDialog.prototype.initContents = function () {
        this.createDialogContentsArea(this.$mainControl.find('.brtc-va-dialogs-contents'));
        this._removeTitleBottomBorder();
    };

    SwitchFnUnitDialog.prototype._removeTitleBottomBorder = function () {
        this.$mainControl.prev().css('border', 'initial');
    };

    SwitchFnUnitDialog.prototype.createDialogContentsArea = function ($parent) {
        var _this = this;
        $parent.append('' +
            '<ul>' +
            '     <li>Search Functions</li>' +
            '     <li>All Functions</li>' +
            '</ul>' +
            '<div class="brtc-va-dialogs-selectfnunit-tab-searchfunctions"></div>' +
            '<div class="brtc-va-dialogs-selectfnunit-tab-allfunctions brtc-style-border-box"></div>'
        );

        this.tabControl = Brightics.VA.Core.Widget.Factory.tabControl($parent);

        var $search = $parent.find('.brtc-va-dialogs-selectfnunit-tab-searchfunctions');
        var $all = $parent.find('.brtc-va-dialogs-selectfnunit-tab-allfunctions');

        this.createPalette($all, function () {
            _this.createAllFunctionsArea($all);
            _this.createSearchFunctionsArea($search);
        });

        // var option = {
        //     url: 'api/va/v2/studio/palette/' + this.options.modelType,
        //     type: 'GET',
        //     contentType: 'application/json; charset=utf-8',
        //     blocking: true,
        // };
        //
        // const getPalette = new Promise((resolve) => {
        //     return Promise.resolve($.ajax(option))
        //         .then((data) => resolve(data))
        //         .catch(() => resolve([]));
        // });
        //
        // getPalette.then((data) => {
        //     this.createRecommendArea($search, data);
        //     this.createKeywordArea($search, data);
        //     this.createSearchResultArea($search, data);
        //     this.createAllFunctionsArea($all, data);
        //
        //     $all.perfectScrollbar();
        //     this.$mainControl.find('.brtc-va-dialogs-selectfnunit-keyword-input').jqxInput('focus');
        // });
    };
    SwitchFnUnitDialog.prototype.createPalette = function ($parent, callback) {
        this.palette = new Brightics.VA.Core.Views.Palette($parent, {
            width: '100%',
            height: '100%',
            draggable: false,
            modelType: this.options.modelType,
            fnClickHandler: this.handleClose.bind(this),
            refreshCallback: this.refreshSidebar.bind(this),
            completeCallback: callback
        });
    };
    SwitchFnUnitDialog.prototype.createAllFunctionsArea = function ($parent, data) {
        // var _this = this;
        // this.palette = new Brightics.VA.Core.Views.Palette($parent, {
        //     width: '100%',
        //     height: '100%',
        //     draggable: false,
        //     modelType: _this.options.modelType,
        // });
        //
        // $parent.find('.brtc-va-views-palette-filter-input').hide();
        // $parent.find('.brtc-va-views-palette-navigator').bind('DOMNodeInserted', function (event) {
        //     if ($(event.target).hasClass('brtc-va-views-palette-fnunit-list')) {
        //         $(event.target).find('.brtc-va-views-palette-fnunit').click(function (event) {
        //             const $el = $(this); // eslint-disable-line no-invalid-this
        //             var func = Brightics.VA.Core.Utils.WidgetUtils.getData($el, 'func');
        //             _this.dialogResult = {
        //                 OK: true,
        //                 Cancel: false,
        //                 func: func,
        //             };
        //             _this.$mainControl.dialog('close');
        //         });
        //     }
        // });
        //
        // var $palette = $parent.find('.brtc-va-views-palette');
        // $palette.css('height', '100%');
        //
        // var $navigatorWrapper = $parent.find('.brtc-va-views-palette-navigator-wrapper');
        // $navigatorWrapper.css({
        //     'height': 'calc(100% - 40px)',
        //     'position': 'relative',
        // }).perfectScrollbar();

        var $palette = $parent.find('.brtc-va-views-palette');
        $palette.css('height', '100%');

        var $navigatorWrapper = $parent.find('.brtc-va-views-palette-navigator-wrapper');
        $navigatorWrapper.css({
            'height': 'calc(100% - 80px)',
            'position': 'relative',
            'padding-right': '20px'
        }).perfectScrollbar();

        $parent.perfectScrollbar();
    };

    SwitchFnUnitDialog.prototype.createSearchFunctionsArea = function ($search) {
        this.paletteItems = this.palette.paletteData;
        this.udfItems = this.palette.udfData;
        this.createRecommendArea($search);
        this.createKeywordArea($search);
        this.createSearchResultArea($search);

        this.$mainControl.find('.brtc-va-dialogs-selectfnunit-keyword-input').jqxInput('focus');

    };
    SwitchFnUnitDialog.prototype.createRecommendArea = function ($parent) {
        var _this = this;
        var data = this.paletteItems;
        var $recommendArea = $('' +
            '<div class="brtc-va-dialogs-selectfnunit-recommend">' +
            '   <div class="sub-title">'+Brightics.locale.common.recommendations+'&nbsp<Strong id="count">0</Strong></div>' +
            '   <div class="brtc-va-dialogs-selectfnunit-recommend-list"></div>' +
            '</div>');
        $parent.append($recommendArea);

        var $contents = $recommendArea.find('.brtc-va-dialogs-selectfnunit-recommend-list');

        const findItem = function (d, f) {
            for (let {functions} of d) {
                for (let fn of functions) {
                    if (fn.func === f) return fn.visible;
                }
            }
            return false;
        };

        $contents.append($('<div style="height: 65px; text-align: center; display: block; padding-top: 10px"><span>Recommend item does not exist.</span></div>'));
        if (this.options.preFnUnit) {
            $contents.empty();
            let list = Brightics.VA.Env.Recommend.Next.getList(this.options.preFnUnit.func,
                this.options.modelType);
            $.each(list, function (index, func) {
                if (func === 'load') return;
                else if (findItem(data, func)) {
                    _this.createItem($contents, func);
                }
            });
        } else {
            $contents.empty();
            let list = Brightics.VA.Env.Recommend.Next[this.options.modelType].default;
            $.each(list, function (index, func) {
                if (findItem(data, func)) _this.createItem($contents, func);
            });
        }

        var $count = $recommendArea.find('#count');
        var count = $contents.find('.brtc-va-dialogs-selectfnunit-item').length;
        $count.text(count);

        $contents.perfectScrollbar();
    };

    SwitchFnUnitDialog.prototype.createKeywordArea = function ($parent, data) {
        var _this = this;
        var $keywordArea = $('' +
            '<div class="brtc-va-dialogs-selectfnunit-keyword">' +
            '   <div class="sub-title">'+Brightics.locale.sentence.S0001+': </div>' +
            '   <div class="brtc-va-dialogs-selectfnunit-keyword-list"></div>' +
            '</div>');
        $parent.append($keywordArea);

        var $tagList = $keywordArea.find('.brtc-va-dialogs-selectfnunit-keyword-list');
        for (var key in Brightics.VA.Env.Tags[_this.options.modelType]) {
            var tag = Brightics.VA.Env.Tags[_this.options.modelType][key];
            if (tag !== 'Prescriptive') {
                var $tag = $('<div class="brtc-va-dialogs-selectfnunit-keyword-item">' + tag + '</div>');
                $tag.css('cursor', 'pointer');
                $tagList.append($tag);
            }
        }
        $tagList.find('.brtc-va-dialogs-selectfnunit-keyword-item').click(function (event) {
            const $el = $(this); // eslint-disable-line no-invalid-this
            if ($el.hasClass('selected')) $el.removeClass('selected');
            else $el.addClass('selected');

            _this.refreshResult();
        });

        $keywordArea.find('.brtc-va-dialogs-selectfnunit-keyword-list').slimscroll({
            height: 'calc(100% - 5px)',
        });
    };

    SwitchFnUnitDialog.prototype.createSearchResultArea = function ($parent, data) {

        var _this = this;
        var $searchResultArea = $('' +
            '<div class="brtc-va-dialogs-selectfnunit-searchresult">' +
            '   <div class="sub-title">' +
            '       <span>'+Brightics.locale.sentence.S0002+'?</span>' +
            '       <input type="search" class="brtc-va-dialogs-selectfnunit-keyword-input" />' +
            '   </div>' +
            '   <div class="sub-title">'+ Brightics.locale.common.result +'&nbsp;<strong id="count">0</strong></div>' +
            '   <div class="brtc-va-dialogs-selectfnunit-searchresult-list"></div>' +
            '</div>');
        $parent.append($searchResultArea);
        var $result = $searchResultArea.find('.brtc-va-dialogs-selectfnunit-searchresult-list');

        var $inputControl = $searchResultArea.find('.brtc-va-dialogs-selectfnunit-keyword-input');
        $inputControl.jqxInput({
            height: 29,
            width: 300,
            theme: Brightics.VA.Env.Theme,
            placeHolder: Brightics.locale.common.searchItem,
        });

        $inputControl.on('keyup search', function (event) {
            _this.refreshResult();
        });
        $result.perfectScrollbar();

        // var _this = this;
        // var $searchResultArea = $('' +
        //     '<div class="brtc-va-dialogs-selectfnunit-searchresult">' +
        //     '   <div class="sub-title">' +
        //     '       <span>Any other keywords?</span>' +
        //     '       <input type="search" class="brtc-va-dialogs-selectfnunit-keyword-input" />' +
        //     '   </div>' +
        //     '   <div class="sub-title">Result&nbsp;<strong id="count">0</strong></div>' +
        //     '   <div class="brtc-va-dialogs-selectfnunit-searchresult-list"></div>' +
        //     '</div>');
        // $parent.append($searchResultArea);
        // var $result = $searchResultArea.find('.brtc-va-dialogs-selectfnunit-searchresult-list');
        // const modelTypeMap = {
        //     data: 'DataFlow',
        //     deeplearning: 'DeepLearning',
        //     script: 'Script',
        //     control: 'ControlFlow',
        // };
        //
        // const modelType = modelTypeMap[_this.options.modelType];
        //
        // var functions = Brightics.VA.Implementation[modelType].Functions;
        //
        // if (modelType !== 'Script') {
        //     for (let fn of Object.values(functions)) {
        //         if (!fn.defaultFnUnit) continue;
        //
        //         var func = fn.defaultFnUnit.func;
        //         var category = fn.category;
        //
        //         if (category === 'bigdata') continue;
        //
        //         var exist = false;
        //         var obj = {func: func, visible: true};
        //
        //         for (var c in data) {
        //             if (data[c].key === category) {
        //                 for (var k in data[c].functions) {
        //                     var fnUnit = data[c].functions[k];
        //                     if (fnUnit.func === func) {
        //                         exist = true;
        //                         break;
        //                     }
        //                 }
        //                 if (!exist) data[c].functions.push(obj);
        //             }
        //         }
        //     }
        // }
        //
        // $.each(data, function (index, funcGroup) {
        //     $.each(funcGroup.functions, function (index, funcItem) {
        //         if (_this.options.preFnUnit && funcItem.func === 'load') return;
        //         else if (funcItem.visible) {
        //             var _$item = _this.createItem($result, funcItem.func);
        //             if (_$item) _$item.hide();
        //         }
        //     });
        // });
        // if (_this.options.modelType === Brightics.VA.Implementation.DataFlow.Clazz) {
        //     var udfOpt = {
        //         url: 'api/va/v3/ws/udfs',
        //         type: 'GET',
        //         blocking: false,
        //         contentType: 'application/json; charset=utf-8',
        //     };
        //     $.ajax(udfOpt).done(function (udfItems) {
        //         if (udfItems.length > 0) {
        //             var udfPalette = {
        //                 label: 'UDF',
        //                 visible: true,
        //                 functions: [],
        //             };
        //             for (var i in udfItems) {
        //                 if (Brightics.VA.Core.Utils.WidgetUtils.getFunctionLibrary(_this.options.modelType, udfItems[i].udf_id).category === 'udf') {
        //                     udfPalette.functions.push({
        //                         func: udfItems[i].udf_id,
        //                         visible: true,
        //                     });
        //                 }
        //             }
        //             if (udfPalette.functions.length > 0) {
        //                 $.each(udfPalette.functions, function (index, funcItem) {
        //                     if (funcItem.visible) {
        //                         var _$item = _this.createItem($result, funcItem.func);
        //                         if (_$item) _$item.hide();
        //                     }
        //                 });
        //             }
        //         }
        //     });
        // }
        //
        //
        // var $inputControl = $searchResultArea.find('.brtc-va-dialogs-selectfnunit-keyword-input');
        // $inputControl.jqxInput({
        //     height: 29,
        //     width: 300,
        //     theme: Brightics.VA.Env.Theme,
        //     placeHolder: 'Search Item',
        // });
        //
        // $inputControl.on('keyup search', function (event) {
        //     _this.refreshResult();
        // });
        // $result.perfectScrollbar();
    };

    SwitchFnUnitDialog.prototype.refreshResult = function () {
        var _this = this;
        // key 입력이 빠르게 들어올 수 있기 때문에 DOM의 변경을 같은 Main Event Queue에 넣지 않고 다른 Queue에서 수행될 수 있도록.. (key 입력이 지체되지 않도록)
        setTimeout(function () {
            var $result = _this.$mainControl.find('.brtc-va-dialogs-selectfnunit-searchresult-list');
            var $inputControl = _this.$mainControl.find('.brtc-va-dialogs-selectfnunit-keyword-input');
            var filterValue = $inputControl.jqxInput('val').toLowerCase();

            var selectedTags = $.map(_this.$mainControl.find('.brtc-va-dialogs-selectfnunit-keyword-item.selected'), function (tag) {
                return $(tag).text();
            });

            if (filterValue) selectedTags.push(filterValue.trim());

            var count = 0;
            $result.empty();
            $result.scrollTop(0);
            if (selectedTags.length > 0) {
                var source = Brightics.VA.Core.Functions.Library.getListByTags(selectedTags, _this.options.modelType);
                var list = [];
                _this.paletteItems.reduce(function (prev, curr) {
                    return curr.visible ? prev.concat(curr.functions) : prev;
                }, [])
                    .forEach(function (x) {
                        if (x.visible) {
                            var target = source.find(function (func) {
                                return func === x.func
                            });
                            if (target) list.push(target);
                        }
                    });

                list.forEach(function (func) {
                    _this.createItem($result, func);
                });

                count = list.length;
            }

            _this.$mainControl.find('.brtc-va-dialogs-selectfnunit-searchresult #count').text(count);
            $result.perfectScrollbar('update');
        }, 0);

        // var $result = this.$mainControl.find('.brtc-va-dialogs-selectfnunit-searchresult-list');
        // var $inputControl = this.$mainControl.find('.brtc-va-dialogs-selectfnunit-keyword-input');
        // var filterValue = $inputControl.jqxInput('val').toLowerCase();
        //
        // var selectedTags = $.map(this.$mainControl.find('.brtc-va-dialogs-selectfnunit-keyword-item.selected'), function (tag) {
        //     return $(tag).text();
        // });
        //
        // if (filterValue) selectedTags.push(filterValue.trim());
        // var items = $result.find('.brtc-va-dialogs-selectfnunit-item');
        //
        // var count = 0;
        // $result.scrollTop(0);
        // if (selectedTags.length > 0) {
        //     var list;
        //
        //     if (this.options.modelType === 'deeplearning') {
        //         list = Brightics.VA.Implementation.DeepLearning
        //             .Functions.Library.getListByTags(selectedTags);
        //     } else {
        //         list = Brightics.VA.Core.Functions.Library.getListByTags(selectedTags);
        //     }
        //
        //     $.each(items, function (index, item) {
        //         var func = Brightics.VA.Core.Utils.WidgetUtils.getData($(item).find('.brtc-va-views-palette-fnunit'), 'func');
        //         var matched = $.inArray(func, list) > -1;
        //         if (matched) {
        //             $(item).show();
        //             count++;
        //         } else {
        //             $(item).hide();
        //         }
        //     });
        // } else {
        //     $.each(items, function (index, item) {
        //         $(item).hide();
        //     });
        // }
        //
        // this.$mainControl.find('.brtc-va-dialogs-selectfnunit-searchresult #count').text(count);
        // $result.perfectScrollbar('update');
    };


    SwitchFnUnitDialog.prototype.createItem = function ($parent, func) {
        var _this = this;
        var $item = $('<div class="brtc-va-dialogs-selectfnunit-item"></div>');
        var clazz = this.options.modelType;

        var $fnUnit = Utils.WidgetUtils.createPaletteItem($item, func, clazz);
        var $description;
        try {
            var fnUnitDef = Utils.WidgetUtils.getFunctionLibrary(clazz, func);
            if (fnUnitDef.defaultFnUnit.func === 'unknownFunction') return;

            var description = fnUnitDef.summary || fnUnitDef.description;
            $description = $('<div class="brtc-va-dialogs-selectfnunit-item-description">' +
                '<span></span>' +
                '</div>');
            $description.find('span').attr('title', description).text(description);
            $item.append($description);

            $fnUnit.click(function () {
                _this.handleClose($fnUnit);
            });
            $parent.append($item);
            return $item;
        } catch (e) {
            console.error(e);
        }

        // var _this = this;
        // var $item = $('<div class="brtc-va-dialogs-selectfnunit-item"></div>');
        // var clazz = this.options.modelType;
        //
        // var $fnUnit = Brightics.VA.Core.Utils.WidgetUtils.createPaletteItem($item, func, clazz);
        // var $description;
        // try {
        //     var fnUnitDef = Brightics.VA.Core.Utils.WidgetUtils.getFunctionLibrary(clazz, func);
        //     if (fnUnitDef.defaultFnUnit.func === 'unknownFunction') return;
        //
        //     var description = fnUnitDef.summary || fnUnitDef.description;
        //     $description = $('<div class="brtc-va-dialogs-selectfnunit-item-description">' +
        //         '<span></span>' +
        //         '</div>');
        //     $description.find('span').attr('title', description).text(description);
        //     $item.append($description);
        //
        //     $fnUnit.click(function (event) {
        //         const $el = $(this); // eslint-disable-line no-invalid-this
        //         var func = Brightics.VA.Core.Utils.WidgetUtils.getData($el, 'func');
        //         _this.dialogResult = {
        //             OK: true,
        //             Cancel: false,
        //             func: func,
        //         };
        //         _this.$mainControl.dialog('close');
        //     });
        //     $parent.append($item);
        //     return $item;
        // } catch (e) {
        //     console.error(e);
        // }
    };

    SwitchFnUnitDialog.prototype.handleClose = function (el) {
        const $el = $(el); // eslint-disable-line no-invalid-this
        var func = Utils.WidgetUtils.getData($el, 'func');
        this.dialogResult = {
            OK: true,
            Cancel: false,
            func: func,
        };
        this.$mainControl.dialog('close');
    };

    SwitchFnUnitDialog.prototype.refreshSidebar = function () {
        var activeEditor = Studio.getEditorContainer().getActiveModelEditor();
        activeEditor.getSideBarManager()
        if (activeEditor.getSideBarManager() && activeEditor.getSideBarManager().onActivated) {
            activeEditor.getSideBarManager().onActivated();
        }
    };

    Brightics.VA.Core.Dialogs.SwitchFnUnitDialog = SwitchFnUnitDialog;
}).call(this); // eslint-disable-line no-invalid-this
