/**
 * Created by SDS on 2017-05-12.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ExportPDFView(parentId, options) {
        this.parentId = parentId;
        this.retrieveParent();
        this.initOptions(options);
    }

    ExportPDFView.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    ExportPDFView.prototype.initOptions = function (options) {
        var _this = this;
        this._showProgress();
        var opt = {
            url: 'api/va/v2/ws/projects/' + options.pid + '/files/' + options.mid,
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            blocking: true
        };

        $.ajax(opt).done(function (data) {
            _this._hideProgress();
            var migrator = new Brightics.VA.Core.Tools.ModelMigrator.Executor();
            var file = data[0];
            if (!file) {
                alert('Could not found model.');
                return;
            }
            migrator.migrate(file.contents);
            var contents = Brightics.VA.Core.Utils.ModelUtils.extendModel(file.contents);
            _this.options = {
                width: '100%',
                height: '100%',
                clazz: 'visual',
                editorInput: contents
            };
            _this.createControls();

            _this.initPages();
            _this.initContent();

        }).fail(function (err) {
        });
    };

    ExportPDFView.prototype.getToolItem = function () {
    };

    ExportPDFView.prototype.createControls = function () {
        var _this = this;
        this.$mainControl = $('' +
            '<div class="brtc-va-editors-visualeditor brtc-va-editor brtc-style-editor">' +
            '   <button type="button" class="brtc-va-editor-visualeditor-export-pdf-button" title="Download PDF" value="Download PDF">Print PDF</button>' +
            '       <div class="brtc-style-editor-visualeditorpage-export-pdf-paper-container" />' +
            '</div>'
        );

        this.$mainControl.css({
            width: this.options.width,
            height: this.options.height
        });
        this.$parent.append(this.$mainControl);
        this.$mainControl.find('.brtc-va-editor-visualeditor-export-pdf-button').jqxButton({
            theme: Brightics.VA.Env.Theme,
            height: 31
        });

        Brightics.VA.Core.Utils.WidgetUtils.putEditorRef(this.$mainControl, this);

        this.commandManager = new Brightics.VA.Core.CommandManager(this.options.editorInput.contents);
        this.$mainControl.find('.brtc-va-editor-visualeditor-export-pdf-button').click(function () {
            var pageSplitters = _this.$mainControl.find('.brtc-va-editors-visualeditor-page-wrapper-splitter');
            for (let idx = 0; idx < pageSplitters.length; idx++) {
                $(pageSplitters[idx]).addClass('hide-splitter');
            }
            window.print();
            for (let idx = 0; idx < pageSplitters.length; idx++) {
                $(pageSplitters[idx]).removeClass('hide-splitter');
            }
        });

        this.$mainControl.perfectScrollbar();
    };

    ExportPDFView.prototype.initPages = function () {
        var pages = this.options.editorInput.getPages();

        this.controls = {};
        var $pageContainer = this.getPageContainer();

        $pageContainer.empty();

        for (var i = 0; i < pages.length; i++) {
            var pageIndex = this.options.editorInput.getPageIndex(pages[i].id);
            var $pageSplitter = $('<div class="brtc-va-editors-visualeditor-page-wrapper-splitter"></div>');
            var $pageWrapper = $('<div class="brtc-va-editors-visualeditor-page-wrapper"></div>');
            $pageContainer.append($pageSplitter);
            $pageContainer.append($pageWrapper);
            this.controls[pages[i].id] = new Brightics.VA.Implementation.Visual.Editors.Diagram.Figures.PaperUnit($pageWrapper, {
                page: pages[i],
                pageIndex: pageIndex,
                'background-color': this.options.editorInput.report.display.backgroundColor
            });
            var tar = $('.brtc-va-visual-page')[i];
            if(tar.getAttribute('page-type') == "a4-horizontal" ) {
                tar.style.height = "793px";
                tar.style.width = "1122px";
                $('head').append('<style type="text/css"> @page{size:landscape;} .brtc-va-editors-visualeditor-page-wrapper,.brtc-va-visual-page-wrapper{height:793px} </style>');
            }
            else if(tar.getAttribute('page-type') == "a4-vertical" ) {
                tar.style.height = "1122px";
                tar.style.width = "793px";
                $('head').append('<style type="text/css"> @page{size:A4;} .brtc-va-editors-visualeditor-page-wrapper,.brtc-va-visual-page-wrapper{height:1122px} </style>');
            }
            else {
                $('.brtc-va-editor-visualeditor-export-pdf-button').hide();
            }
            this.setPageView();
        }
    };

    ExportPDFView.prototype.setPageView = function () {
        var $pages = this.$mainControl.find('.brtc-va-visual-page');

        $pages.css('display', 'block');
        $pages.css('position', 'relative');

        this.$mainControl.find('.brtc-va-visual-content-toolitem-area').css({
            display: 'none'
        });
    };

    ExportPDFView.prototype.initContent = function () {
        var pages = this.options.editorInput.getPages();
        for (var i = 0; i < pages.length; i++) {
            this.controls[pages[i].id].render();
        }

        this.controls[pages[0].id].$mainControl.focus();
        // this.getPageContainer().perfectScrollbar();
    };

    ExportPDFView.prototype.registerSelectableEventListener = function () {
        var _this = this;

        this.setSelection([_this.options.editorInput.getPages()[0].id]);
    };

    ExportPDFView.prototype.registerContentEventListener = function () {
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

    ExportPDFView.prototype.getPageContainer = function () {
        return this.$mainControl.find('.brtc-style-editor-visualeditorpage-export-pdf-paper-container');
    };

    ExportPDFView.prototype.getCommandManager = function () {
        return this.commandManager;
    };

    ExportPDFView.prototype.addCommandListener = function (callback) {
        this.commandManager.registerCallback(callback);
    };

    ExportPDFView.prototype.getModel = function () {
        return this.options.editorInput;
    };

    ExportPDFView.prototype._hideProgress = function () {
        this.$parent.find('.brtc-va-progress').hide();
    };

    ExportPDFView.prototype._showProgress = function () {
        this.$parent.find('.brtc-va-progress').show();
    };

    ExportPDFView.prototype.getContentOutlineStatus = function () {
        return false;
    };

    Brightics.VA.Implementation.Visual.ExportPDFView = ExportPDFView;
}).call(this);