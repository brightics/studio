/**
 * Created by daewon77.park on 2016-08-27.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function IndexDialog(parentId, options) {
        Brightics.VA.Dialogs.Dialog.call(this, parentId, options);

        this.addListener();
    }

    IndexDialog.prototype = Object.create(Brightics.VA.Dialogs.Dialog.prototype);
    IndexDialog.prototype.constructor = IndexDialog;

    IndexDialog.prototype.addListener = function () {
        var _this = this;
        this.commandListener = function (command) {
            _this.handleCommand(command);
        };

        this.options.editor.addCommandListener(this.commandListener);

        this.activeModelChangeListener = function () {
            _this.refresh();
        };

        this.options.editor.addActiveModelChangeListener(this.activeModelChangeListener);
    };

    IndexDialog.prototype.removeListener = function () {
        this.options.editor.removeCommandListener(this.commandListener);
        this.options.editor.removeActiveModelChangeListener(this.activeModelChangeListener);
    };

    IndexDialog.prototype.handleCommand = function (command) {
        if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.ConnectFnUnitCommand ||
            command instanceof Brightics.VA.Core.Editors.Diagram.Commands.DisconnectFnUnitCommand ||
            command instanceof Brightics.VA.Core.Editors.Diagram.Commands.ReconnectFnUnitCommand ||
            command instanceof Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitCommand ||
            command instanceof Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitParameterValueCommand ||
            command instanceof Brightics.VA.Core.Editors.Diagram.Commands.AddFnUnitParameterCommand) {
            return;
        }

        this.refresh();
    };

    IndexDialog.prototype.getTitle = function () {
        return 'Index';
    };

    IndexDialog.prototype.createControls = function () {
        this.$mainControl = $('' +
            '<div class="brtc-va-dialogs-main brtc-va-dialogs-main-index">' +
            // '   <div class="brtc-va-dialogs-header">' + Brightics.VA.Core.Utils.WidgetUtils.convertHTMLSpecialChar(this.getTitle()) + '</div>' +
            '   <div class="brtc-va-dialogs-body">' +
            '       <div class="brtc-va-dialogs-contents" style="padding-right: 20px;padding-left: 20px;">' +
            '       </div>' +
            '       <div class="brtc-va-dialogs-buttonbar">' +
            '       </div>' +
            '   </div>' +
            '</div>');

        var opts = this._configureDialogOption({
            theme: Brightics.VA.Env.Theme,
            title: this.getTitle(),
            position: {
                my: "left top",
                at: "left bottom",
                of: this.$parent.find('.brtc-style-s-editor-toolitem[item-type=index]')
            },
            width: 400,
            height: 600,
            maxWidth: 400,
            maxHeight: 600,
            modal: false,
            resizable: false,
        });
        this.$mainControl.dialog(opts);
        this.$mainControl.parent().draggable("option", "containment", this.$parent);
        $('.ui-dialog-titlebar.ui-widget-header', $(this).parent()).css('width', 'calc(100% - 60px) !important');
    };

    IndexDialog.prototype.createDialogContentsArea = function ($parent) {
        var $container = $('<div class="brtc-va-dialogs-index-item-container"></div>');
        $parent.append($container);

        this.refresh();
        // this.createIndexItems($container);

        $parent.perfectScrollbar();
    };

    IndexDialog.prototype.createIndexItems = function ($container) {
        // function array copy : cause sort
        
        var functions = this.options.editor.getActiveModel().functions.slice();
        functions.sort(function (a, b) {
            var p1 = a.display.diagram.position;
            var p2 = b.display.diagram.position;
            if (p1.x < p2.x) {
                return -1;
            } else if (p1.x == p2.x) {
                if (p1.y < p2.y) {
                    return -1
                } else if (p1.y == p2.y) {
                    return 0;
                } else {
                    return 1;
                }
            } else {
                return 1;
            }
        });

        for (var i in functions) {
            var clazz = functions[i].parent().type;
            var funcDef = Brightics.VA.Core.Interface.Functions[clazz][functions[i].func];

            var $item = $('' +
                '<div class="brtc-va-dialogs-index-item">' +
                '   <div class="brtc-va-dialogs-index-item-label"></div>' +
                '   <div class="brtc-va-dialogs-index-item-func"></div>' +
                '</div>');
            $item.attr('id', functions[i].fid);
            $item.addClass('brtc-va-fnunit-category-' + funcDef.category);
            $item.find('.brtc-va-dialogs-index-item-label').attr('title', functions[i].display.label);
            $item.find('.brtc-va-dialogs-index-item-label').text(functions[i].display.label);
            $item.find('.brtc-va-dialogs-index-item-func').text(funcDef.defaultFnUnit.display.label);

            $container.append($item);
        }

        var _this = this;
        $container.find('.brtc-va-dialogs-index-item').click(function () {
            if ($(this).hasClass('brtc-va-dialogs-index-item-select')) {
                return;
            }

            $container.children().removeClass('brtc-va-dialogs-index-item-select');
            $(this).addClass('brtc-va-dialogs-index-item-select');
            _this.options.editor.selectFunction($(this).attr('id'));
        });
    };

    IndexDialog.prototype.createDialogButtonBar = function ($parent) {
        // do no create buttons
    };

    IndexDialog.prototype.destroy = function () {
        this.removeListener();

        Brightics.VA.Dialogs.Dialog.prototype.destroy.call(this);
    };

    IndexDialog.prototype.refresh = function () {
        var $container = this.$mainControl.find('.brtc-va-dialogs-index-item-container');
        $container.empty();

        this.createIndexItems($container);
        this.$mainControl.find('.brtc-va-dialogs-contents').perfectScrollbar('update');
    };

    Brightics.VA.Core.Dialogs.IndexDialog = IndexDialog;

}).call(this);