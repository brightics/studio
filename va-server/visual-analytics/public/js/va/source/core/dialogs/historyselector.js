/**
 * Created by jhoon80.park on 2016-04-06.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function HistorySelector(parentId, options) {
        this.parentId = parentId;
        this.options = options;
        this.dialogResult = {
            OK: false,
            Cancel: true
        };
        this.retrieveParent();
        this.createControls();
        this.initContents();
        this.registerCommandListener();
    }

    HistorySelector.prototype.registerCommandListener = function () {
        var _this = this;
        this.commandListener = function (command, modelDiff) {
            _this.handleCommand(command, modelDiff);
        };
        this.options.editor.addCommandListener(this.commandListener);
        this.options.editor.addGoHistoryListener(this.commandListener);
    };

    HistorySelector.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    HistorySelector.prototype.createControls = function () {
        var _this = this;
        this.$mainControl = $('' +
            '<div class="brtc-va-dialogs-main brtc-va-dialogs-main-history">' +
            '   <div class="brtc-va-dialogs-body">' +
            '   </div>' +
            '</div>');

        this.$mainControl.dialog({
            title: Brightics.locale.common.history,
            appendTo: this.$parent,
            position: { my: "left top", at: "left bottom", of: this.$parent.find('.brtc-style-s-editor-toolitem[item-type=history]') },
            width: 400,
            height: 600,
            maxWidth: 400,
            maxHeight: 600,
            modal: false,
            resizable: false
        });
        this.$mainControl.parent().draggable( "option", "containment", this.$parent );
    };

    HistorySelector.prototype.initContents = function () {
        this.createDialogContentsArea(this.$mainControl.find('.brtc-va-dialogs-body'));
    };

    HistorySelector.prototype.createDialogContentsArea = function ($parent) {
        this.$historyList = $('<div class="brtc-va-dialogs-body-historylist" style="padding-right: 0px; padding-top: 5px;"></div>');
        $parent.append(this.$historyList);

        var _this = this;

        this.options.source.unshift({
            name: 'Open',
            description: 'Init history'
        });

        $.each(this.options.source, function (index, history) {
            _this.addHistory(history);
        });

        this.setSelect();
        this.$historyList.perfectScrollbar();

    };

    HistorySelector.prototype.close = function () {
        this.$mainControl.dialog('close');
        this.options.editor.removeCommandListener(this.commandListener);
        this.options.editor.removeGoHistoryListener(this.commandListener);
        this.$mainControl.dialog('destroy');
    };

    HistorySelector.prototype.setSelect = function () {
        this.changeBackGround(this.options.stackIndex + 1);
    };

    HistorySelector.prototype.changeBackGround = function (commandIndex) {
        var histories = this.$historyList.find(".brtc-va-dialogs-body-historylist-history");
        $.each(histories, function (idx, hist) {
            if (idx > commandIndex) {
                $(hist).addClass("brtc-va-dialogs-body-historylist-history-gray");
                $(hist).removeClass("brtc-va-dialogs-body-historylist-history-highlight");
            } else if (idx < commandIndex) {
                $(hist).removeClass("brtc-va-dialogs-body-historylist-history-gray");
                $(hist).removeClass("brtc-va-dialogs-body-historylist-history-highlight");
            } else {
                $(hist).removeClass("brtc-va-dialogs-body-historylist-history-gray");
                $(hist).addClass("brtc-va-dialogs-body-historylist-history-highlight");
            }
        });
    };

    HistorySelector.prototype.handelselectedItem = function (selectedDiv) {
        var _this = this;

        var histories = _this.$historyList.find(".brtc-va-dialogs-body-historylist-history");
        var commandIndex = $.inArray(selectedDiv, histories);

        this.changeBackGround(commandIndex);

        var his = {};
        his.label = $(selectedDiv).text();
        his.index = commandIndex - 1;
        _this.handleSelect(his);
    };

    HistorySelector.prototype.handleCommand = function (command, modelDiff) {
        if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.GoHistoryCommand) {
            this.options.editor.save(command, modelDiff);
        } else if (command.event.type == 'EXECUTE') {
            var description;
            if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitCommand ||
                command instanceof Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitParameterValueCommand ||
                command instanceof Brightics.VA.Core.Editors.Diagram.Commands.AddFnUnitParameterCommand ||
                command instanceof Brightics.VA.Core.Editors.Diagram.Commands.RemoveFnUnitParameterCommand ||
                command instanceof Brightics.VA.Core.Editors.Diagram.Commands.ReplaceFnUnitParamCommand) {
                description = command.getLabel() + " - " + command.options.fnUnit.display.label;
            } else {
                description = command.getLabel();
            }

            var histories = this.$historyList.find(".brtc-va-dialogs-body-historylist-history");
            if (this.options.editor.getCommandManager().index + 1 !== histories.length) {
                for (var j = this.options.editor.getCommandManager().index + 1; j < histories.length; j++) {
                    $(histories[j]).remove();
                }
            }
            this.addHistory({name: command.getLabel(), description: description});
            this.changeBackGround(this.options.editor.getCommandManager().index + 1);
            this.$historyList.scrollTop(this.$historyList.prop('scrollHeight'));
        } else if (command.event.type == 'UNDO' || command.event.type == 'REDO') {
            this.changeBackGround(this.options.editor.getCommandManager().index + 1);
        }
    };


    HistorySelector.prototype.addHistory = function (history) {

        var histories = this.$historyList.find(".brtc-va-dialogs-body-historylist-history"), _this = this;
        $.each(histories, function (idx, hist) {
            $(hist).removeClass("brtc-va-dialogs-body-historylist-history-highlight");
            $(hist).removeClass("brtc-va-dialogs-body-historylist-history-gray");
        });
        var $commandHistory = $('' +
            '<div class="brtc-va-dialogs-body-historylist-history">' +
            '   <div class="brtc-va-dialogs-body-history-icon"></div>' +
            '   <div class="brtc-va-dialogs-body-history-label">' + Brightics.VA.Core.Utils.WidgetUtils.convertHTMLSpecialChar(history.name) + '</div>' +
            '</div>');
        if (history.name) {
            if (history.name.indexOf('Create') == 0 || history.name.indexOf('Clone') == 0) {
                $commandHistory.find('.brtc-va-dialogs-body-history-icon').addClass('brtc-va-dialogs-body-history-create');
            }
            else if (history.name.indexOf('Remove') == 0) {
                $commandHistory.find('.brtc-va-dialogs-body-history-icon').addClass('brtc-va-dialogs-body-history-remove');
            }
            else if (history.name.indexOf('Create') == 0 || history.name.indexOf('Clone') == 0) {
                $commandHistory.find('.brtc-va-dialogs-body-history-icon').addClass('brtc-va-dialogs-body-history-open');
            }
            else {
                $commandHistory.find('.brtc-va-dialogs-body-history-icon').addClass('brtc-va-dialogs-body-history-edit');
            }
        }
        $commandHistory.on('click', function (event) {
            _this.handelselectedItem(this);
        });

        if (histories.length === 0) {
            this.$historyList.append($commandHistory);
        } else {
            $(histories[histories.length - 1]).after($commandHistory);
        }

    };

    HistorySelector.prototype.handleSelect = function (history) {
        this.dialogResult = {
            OK: true,
            Cancel: false,
            goHistory: {
                index: history.index,
                name: history.label,
                eventType: history.eventType
            }
        };

        if (typeof this.options.selectHistory == 'function') {
            this.options.selectHistory(this.dialogResult);
        }
    };


    Brightics.VA.Core.Dialogs.HistorySelector = HistorySelector;

}).call(this);