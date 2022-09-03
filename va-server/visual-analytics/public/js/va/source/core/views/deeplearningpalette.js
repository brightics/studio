/**
 * Created by gy84.bae on 2016-01-28.
 */
(function () {
    'use strict';

    let root = this;
    let Brightics = root.Brightics;

    function DeepLearningPalette(parentId, options) {
        this.parentId = parentId;
        this.options = options;
        this.retrieveParent();
        this.createControls();
    }

    DeepLearningPalette.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    DeepLearningPalette.prototype.createControls = function () {
        this.$mainControl = $('' +
            '<div class="brtc-va-views-palette brtc-va-tab-contents brtc-style-tab-content">' +
            '   <div class="brtc-va-views-palette-filter brtc-va-searcharea brtc-style-search-area"></div>' +
            '   <div class="brtc-va-views-palette-navigator-wrapper  brtc-va-contentsarea">' +
            '       <div class="brtc-va-views-palette-navigator"></div>' +
            '   </div>' +
            '</div>');
        this.$parent.append(this.$mainControl);

        this.$filter = this.$mainControl.find('.brtc-va-views-palette-filter');
        this.$navigator = this.$mainControl.find('.brtc-va-views-palette-navigator');

        this.createFilterControl();
        this.createNavigatorControl();
        this.$mainControl.find('.brtc-va-views-palette-navigator-wrapper').perfectScrollbar();
    };

    DeepLearningPalette.prototype.createFilterControl = function () {
        let _this = this;

        let $filterInput = $('<input type="search" class="brtc-va-views-palette-filter-input searchinput"/>');
        this.$filter.append($filterInput);

        $filterInput.jqxInput({
            placeHolder: 'Search Item',
            theme: Brightics.VA.Env.Theme
        });
        let applyFilter = function (event) {
            let filterValue = event.target.value.toLowerCase();

            let containers = _this.$mainControl.find('.brtc-va-views-palette-fnunit-list');
            $.each(containers, function (index) {
                _this.$navigator.jqxNavigationBar('expandAt', index);
            });

            let matchedList = Brightics.VA.Implementation.DeepLearning.Functions.Library.getListByTags([filterValue.trim()]);
            let paletteItems = _this.$mainControl.find('.brtc-va-views-palette-fnunit');
            $.each(paletteItems, function (_idx, item) {
                let $funcElement = $(item).parent();
                let funcName = Brightics.VA.Core.Utils.WidgetUtils.getData($funcElement.find('.brtc-va-views-palette-fnunit'), 'func');
                $funcElement.css('display', $.inArray(funcName, matchedList) > -1 ? 'block' : 'none');
            });

            containers = _this.$mainControl.find('.brtc-va-views-palette-fnunit-list');
            $.each(containers, function (_idx, container) {
                let visibleElements = $(container).find('.brtc-va-views-palette-fnunit-content').filter(function () {
                    return $(this).css('display') == 'block';
                });
                $(container).css('display', visibleElements.length > 0 ? 'block' : 'none');
                $(container).prev().css('display', visibleElements.length > 0 ? 'block' : 'none');
            });

            _this.$mainControl.find('.brtc-va-views-palette-navigator-wrapper').perfectScrollbar('update');
        };
        $filterInput.keyup(function (event) {
            applyFilter(event);
        });

        $filterInput.on('search', function () {
            applyFilter(event);
        });
    };

    DeepLearningPalette.prototype.createNavigatorControl = function () {
        let _this = this;

        let option = {
            url: 'api/va/v2/studio/palette/' + this.options.modelType,
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            blocking: false
        };
        $.ajax(option).done(function (data) {
            if (_this.options.additionalGroup) data.push(_this.options.additionalGroup);
            _this.createFunctions(data);


            if (_this.options.modelType !== Brightics.VA.Implementation.DataFlow.Clazz) {
                if (_this.options.draggable) _this.draggablePalette();

                let opt = {
                    theme: Brightics.VA.Env.Theme,
                    expandMode: 'multiple',
                    expandedIndexes: [],
                    width: '100%'
                    // width: 'calc(100% - 20px)'
                };
                for (let idx in data) {
                    opt.expandedIndexes.push(idx);
                }
                _this.$navigator.jqxNavigationBar(opt);

            }
        });

    };

    DeepLearningPalette.prototype.appendFunction = function (funcGroup) {
        let _this = this;
        let $functionListControl = $('<div class = "brtc-va-views-palette-fnunit-list"></div>');
        $.each(funcGroup.functions, function (_idx, funcItem) {
            if (funcItem.visible) {
                let clazz = _this.options.modelType;
                Brightics.VA.Core.Utils.WidgetUtils.createPaletteItem($functionListControl, funcItem.func, clazz);
            }
        });

        // add header
        _this.$navigator.append('' +
            '<div>' +
            '   <div>' +
            '       <div class="brtc-va-views-palette-fnunit-type">' + Brightics.VA.Core.Utils.WidgetUtils.convertHTMLSpecialChar(funcGroup.label) + '</div>' +
            '   </div>' +
            '</div>');
        // add content
        _this.$navigator.append($functionListControl);
    };

    DeepLearningPalette.prototype.createFunctions = function (funcGroupList) {
        let _this = this;

        $.each(funcGroupList, function (_idx, funcGroup) {
            if (funcGroup.visible) {
                _this.appendFunction(funcGroup);
            }
        });
    };

    DeepLearningPalette.prototype.draggablePalette = function () {
        let _this = this;

        this.$navigator.find(".brtc-va-views-palette-fnunit").each(function () {
            $(this).mouseover(function () {
                $(this).toggleClass('brtc-va-views-palette-fnunit-hover');
            }).mouseout(function () {
                $(this).toggleClass('brtc-va-views-palette-fnunit-hover');
            });

            _this._draggableFnUnit($(this));
        });
    };

    DeepLearningPalette.prototype._draggableFnUnit = function ($fnUnitElement) {
        let _this = this;
        $fnUnitElement.draggable({
            appendTo: 'body',
            scroll: false,
            cursor: 'move',
            cursorAt: {left: 5, top: 5},
            helper: function () {
                let $helper = $(this).clone();
                $helper.css({'z-index': 5100});

                let funcType = Brightics.VA.Core.Utils.WidgetUtils.getData($fnUnitElement, 'func');
                let template = {
                    functions: [{func: funcType}],
                    links: []
                };
                Brightics.VA.Core.Utils.WidgetUtils.putData($helper, 'template', template);
                Brightics.VA.Core.Utils.WidgetUtils.putData($helper, 'source', _this);
                return $helper;
            },
            start: function (_event, ui) {
                $('.brtc-va-studio').addClass('brtc-va-studio-dragging');

                $(this).draggable("option", "cursorAt", {
                    left: Math.floor(ui.helper.width() / 2),
                    top: Math.floor(ui.helper.height() / 2)
                });
            },
            drag: function (event, ui) {
                ui.helper.trigger('feedback', [{clientX: event.clientX, clientY: event.clientY}]);
            },
            stop: function () {
                $('.brtc-va-studio').removeClass('brtc-va-studio-dragging');
            }
        });
    };



    Brightics.VA.Core.Views.DeepLearningPalette = DeepLearningPalette;

}).call(this);