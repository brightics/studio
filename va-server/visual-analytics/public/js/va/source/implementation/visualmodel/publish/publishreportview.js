/**
 * Created by SDS on 2017-05-12.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function PublishReportView(parentId, options) {
        this.parentId = parentId;
        this.initOptions(options);

        this.retrieveParent();
        this.createControls();

        this.initPages();
        // this.registerContentEventListener();
        this.initContent();
    }

    PublishReportView.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    PublishReportView.prototype.initOptions = function (options) {
        var _this = this;

        var options = $.extend(true, {}, options);

        var opt = {
            url: 'publish/'+ options.publishId,
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(options),
            async: false
        };

        $.ajax(opt).done(function (result) {
            Brightics.VA.Env.Session.userId = result.userId;
            var reportOption = result.reportContent;
            for (var i in reportOption.contents.functions) {
                reportOption.contents.functions[i] = $.extend(true, {
                    display: {
                        label: ''
                    }
                }, reportOption.contents.functions[i]);
            }

            options.contents = Brightics.VA.Core.Utils.ModelUtils.extendModel(reportOption.contents);
        
            if (!Brightics.VA.Core.Utils.CommonUtils.isPC()) {
                var _pages = $.extend(true, [], options.contents.report.pages);
                options.contents.report.pages = _this.makeMobilePage(_pages);
            }

            if (options.contents.preference) new window.Brightics.VA.Preference(options.contents.preference);

            _this.options = {
                width: '100%',
                height: '100%',
                clazz: 'visual',
                editorInput: options.contents,
                publishId: options.publishId
            };
        });
    };

    PublishReportView.prototype.getToolItem = function () {
    };

    PublishReportView.prototype.createControls = function () {
        this.$mainControl = $('' +
            '<div class="brtc-va-editors-visualeditor brtc-va-editor brtc-style-editor">' +
            '       <div class="brtc-style-editor-visualeditorpage-paper-container" style="display: flex; flex-flow: wrap" />' +
            '</div>'
        );
        this.$mainControl.css({
            width: this.options.width,
            height: this.options.height
        });
        this.$parent.append(this.$mainControl);

        Brightics.VA.Core.Utils.WidgetUtils.putEditorRef(this.$mainControl, this);

        this.commandManager = new Brightics.VA.Core.CommandManager(this.options.editorInput.getContents());

        this.getPageContainer().perfectScrollbar();
    };

    PublishReportView.prototype.initPages = function () {
        var pages = this.options.editorInput.getPages();

        this.controls = {};
        var $pageContainer = this.getPageContainer();

        $pageContainer.empty();

        for (var i = 0; i < pages.length; i++) {
            var pageIndex = this.options.editorInput.getPageIndex(pages[i].id);
            this.controls[pages[i].id] = new Brightics.VA.Implementation.Visual.Editors.Diagram.Figures.PaperUnit($pageContainer, {
                page: pages[i],
                pageIndex: pageIndex,
                'background-color': this.options.editorInput.report.display.backgroundColor,
                publish: true,
                publishId: this.options.publishId
            });

            this.setPageView();
        }
    };

    PublishReportView.prototype.setPageView = function () {
        var $pages = this.$mainControl.find('.brtc-va-visual-page');

        $pages.css('display', 'block');
        $pages.css('position', 'relative');

        this.$mainControl.find('.brtc-va-visual-content-toolitem-area').css({
            display: 'none'
        });
    };

    PublishReportView.prototype.initContent = function () {
        var pages = this.options.editorInput.getPages();
        for (var i = 0; i < pages.length; i++) {
            this.controls[pages[i].id].render();
        }

        this.controls[pages[0].id].$mainControl.focus();

        if (!Brightics.VA.Core.Utils.CommonUtils.isPC()) {
            this.$mainControl.find('.brtc-style-editor-visualeditorpage-paper-container').css('display', 'block');
            this.$mainControl.find('.brtc-va-visual-page').css('margin', 'auto');
        }

        this.$mainControl.find('.brtc-style-editor-visualeditorpage-paper-container').scrollTop(0);

    };

    PublishReportView.prototype.registerSelectableEventListener = function () {
        var _this = this;
        // this.getPageContainer().selectable({
        //     filter: '.brtc-style-content-wrapper',
        //     stop: function (event, ui) {
        //         var selected = [],
        //             page = _this.controls[_this.selectedPageId],
        //             $selected = page.$mainControl.find('.ui-selected');
        //
        //         for (var i = 0; i < $selected.length; i++) {
        //             selected.push($($selected[i]).attr('content-id'));
        //         }
        //
        //         page.setSelection(selected);
        //     },
        //     cancel: '.bchart-container, .note-editing-area',
        //     tolerance: 'fit'
        // });

        this.setSelection([_this.options.editorInput.getPages()[0].id]);
    };

    PublishReportView.prototype.registerContentEventListener = function () {
        var _this = this;

        this.getPageContainer().bind('loadComplete', function (e, data) {
            var $page = _this.controls[data.pageId].$mainControl,
                $clone = $page.clone();

            var $canvas = $page.find('canvas');
            var $clonedCanvas = $clone.find('canvas');

            setTimeout(function () {
                for (var i = 0; i < $canvas.length; i++) {
                    var $originalCanvas = $canvas[i];
                    var $newCanvas = $clonedCanvas[i];
                    var newCanvasContext = $newCanvas.getContext('2d');
                    newCanvasContext.drawImage($originalCanvas, 0, 0, $newCanvas.width, $newCanvas.height);
                }
            }, 1000);
        });
    };

    PublishReportView.prototype.getPageContainer = function () {
        return this.$mainControl.find('.brtc-style-editor-visualeditorpage-paper-container');
    };

    PublishReportView.prototype.getCommandManager = function () {
        return this.commandManager;
    };

    PublishReportView.prototype.addCommandListener = function (callback) {
        this.commandManager.registerCallback(callback);
    };

    PublishReportView.prototype.getModel = function () {
        return this.options.editorInput;
    };

    PublishReportView.prototype.makeMobilePage = function (pages) {
        var mobilePages = [];
        var sortedArr = [];

        for (var pageIndex in pages) {
            var _contents = pages[pageIndex].contents;
            var tempArr = [];

            for (var key in _contents) {tempArr.push({key:key, obj: _contents[key]})}

            tempArr.sort(function (a, b) {
                return a.obj.position.top < b.obj.position.top ? -1 : a.obj.position.top > b.obj.position.top ? 1 : 0;
            });

            sortedArr = sortedArr.concat(tempArr);
        }

        var targetPage = {};

        for (var i=0; i<sortedArr.length; i++ ) {
            var extra = (i%4);
            if (extra === 0) {
                var id = 'mobile-'+ i;
                var newPage = {id: id, contents: {}};

                mobilePages.push(newPage);
                targetPage = newPage;
            }
            var content = sortedArr[i];

            content.obj.position.top = 20 + (extra * 260);
            content.obj.position.left = 40;

            content.obj.size.height = '240px';
            content.obj.size.width = '90%';

            targetPage.contents[content.key] = {};
            targetPage.contents[content.key] = content.obj;
        }

        return mobilePages;
    };

    PublishReportView.prototype.getContentOutlineStatus = function () {
        return false;
    };

    Brightics.VA.Implementation.Visual.PublishReportView = PublishReportView;
}).call(this);