/**
 * Created by gy84.bae on 2016-10-07.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function FnUnitDialog(parentId, options) {
        Brightics.VA.Dialogs.Dialog.call(this, parentId, options);
    }

    FnUnitDialog.prototype = Object.create(Brightics.VA.Dialogs.Dialog.prototype);
    FnUnitDialog.prototype.constructor = FnUnitDialog;

    FnUnitDialog.prototype._initOptions = function () {
        Brightics.VA.Dialogs.Dialog.prototype._initOptions.call(this);

        this.dialogOptions.width = 600;
        this.dialogOptions.height = 800;
    };   

    FnUnitDialog.prototype.createControls = function () {
        this.$mainControl = $('' +
            '<div class="brtc-va-dialogs-main">' +
            '   <div class="brtc-va-dialogs-body">' +
            '       <div class="brtc-va-dialogs-title brtc-style-display-flex brtc-style-height-45px"></div>' + 
            '       <div class="brtc-va-dialogs-contents brtc-va-dialogs-fnunit"></div>' +
            '       <div class="brtc-va-dialogs-buttonbar"></div>' +
            '   </div>' +
            '</div>');

        this.$titleArea = this.$mainControl.find('.brtc-va-dialogs-title');
    };

    FnUnitDialog.prototype.initContents = function () {
        Brightics.VA.Dialogs.Dialog.prototype.initContents.call(this);

        this.createTitleArea();
    };

    FnUnitDialog.prototype.createTitleArea = function () {
        this.createLabel();
        this.createHelp();
        this.createContext();

        this.setLabel();
    };

    FnUnitDialog.prototype.createLabel = function () {
        this.$label = $('<div class="brtc-va-dialogs-title-label brtc-style-flex-1"></div>');

        this.$titleArea.append(this.$label);
    };

    FnUnitDialog.prototype.createHelp = function () {
        this.$help = $('' +
            '<div class="brtc-va-dialogs-title-help">' +
            '   <div class="brtc-va-editors-sheet-panels-propertiespanel-header-help" title="' + Brightics.locale.common.help + '"></div>' +
            '</div>'
        );

        this.$titleArea.append(this.$help);

        this.createHelpPopover();
    };
    
    FnUnitDialog.prototype.createContext = function () {
        var _this = this;

        this.$contenxt = $('' +
            '<div class="brtc-va-dialogs-title-contenxt">' +
            '   <div class="brtc-va-editors-sheet-panels-propertiespanel-header-more-menu"></div>' +
            '</div>'
        );

        this.$titleArea.append(this.$contenxt);

        this.createPropertiesContextMenu();

        this.$contenxt.on('click', function (event) {
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
    };

    FnUnitDialog.prototype.setLabel = function (label) {
        var label = (label)? label : this.options.fnUnit.display.label;
        this.$label.text(label);
    };

    FnUnitDialog.prototype.createHelpPopover = function () {
        var _this = this;
        this.$help.click(function () {
            var operation = _this.getPrimaryOperation();
            var context = _this.getFunctionDef().defaultFnUnit.context || 'scala';
            var func = _this.getFunctionDef().defaultFnUnit.func;
            if (_this.getFunctionDef().category === 'process') {
                context = 'common';
            }
            Brightics.VA.Core.Utils.ModelUtils.openFunctionReferencePopup('data', operation, context, func);
        });
    };

    FnUnitDialog.prototype.createPropertiesContextMenu = function () {
        var _this = this;
        var $ctxMenu = $('' +
            '<div class="brtc-va-editors-sheet-panels-propertiespanel-header-ctxmenu">' +
            '   <ul>' +
            '       <li action="rename">Edit</li>' +
            '   </ul>' +
            '</div>');

        this.$titleArea.append($ctxMenu);

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
            if ($el.attr('action') == 'rename') {
                var dialogOptions = {
                    title: Brightics.locale.common.editFunction,
                    label: _this.options.fnUnit.display.label,
                    description: _this.options.fnUnit.display.description || '',
                    close: function (dialogResult) {
                        if (dialogResult.OK) {
                            _this.setLabel(dialogResult.label);
                            _this.options.fnUnit.display.label = dialogResult.label;
                            _this.options.fnUnit.display.description = dialogResult.description;
                        }
                    }
                };
                new Brightics.VA.Core.Dialogs.EditResourceDialog($(document.body), dialogOptions);
            }
        });


        this.ctxMenuCloseHandler = function () {
            _this.$ctxMenu.jqxMenu('close');
        };

        this.$ctxMenu.on('closed', function () {
            $(window).off('resize', _this.ctxMenuCloseHandler);
        });
    };

    FnUnitDialog.prototype.getPrimaryOperation = function () {
        var clazz = this.options.editor.getModel().type;
        return Brightics.VA.Core.Utils.WidgetUtils.getFunctionLibrary(clazz, this.options.fnUnit.func).defaultFnUnit.name;
    };

    FnUnitDialog.prototype.getFunctionDef = function () {
        var clazz = this.options.editor.getModel().type;
        return Brightics.VA.Core.Utils.WidgetUtils.getFunctionLibrary(clazz, this.options.fnUnit.func);
    };

    Brightics.VA.Core.Dialogs.FnUnitDialog = FnUnitDialog;

}).call(this);