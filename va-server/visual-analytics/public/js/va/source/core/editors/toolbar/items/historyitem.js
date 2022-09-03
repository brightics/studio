/**
 * Created by jmk09.jung on 2018-02-13.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function HistoryItem($parent, options) {
        Brightics.VA.Core.Editors.Toolbar.Item.call(this, $parent, options);
    }

    HistoryItem.prototype = Object.create(Brightics.VA.Core.Editors.Toolbar.Item.prototype);
    HistoryItem.prototype.constructor = HistoryItem;

    HistoryItem.prototype.initOptions = function () {
        this.setOptions(
            {
                "attribute": {
                    "title": Brightics.locale.common.history,
                    "item-type": "history"
                },
                "action": {
                    'click': this.handleOnClick
                }
            }
        );
    };

    HistoryItem.prototype.handleOnClick = function (event) {
        this.closeHistoryDialog();
        this.openHistoryDialog(event);
    };

    HistoryItem.prototype.closeHistoryDialog = function () {
        if (this.historySelector) {
            this.historySelector.close();
        }
        this.historySelector = null;
    };

    HistoryItem.prototype.openHistoryDialog = function (event) {
        var editor = Studio.getEditorContainer().getActiveModelEditor();
        var commandManager = editor.getCommandManager();

        var stacks = commandManager.getStacks();
        var source = [];
        var description;
        for (var i in stacks) {
            if (stacks[i].option && stacks[i].option.fnUnit) {
                description = stacks[i].getLabel() + " - " + stacks[i].options.fnUnit.display.label;
            }
            else {
                description = stacks[i].getLabel();
            }

            source.push({
                name: stacks[i].getLabel(),
                description: description
            });
        }
        var goHistoryHandler = function (dialogResult) {
            if (dialogResult.OK) {
                commandManager.go(dialogResult.goHistory);
            }
        };
        this.historySelector = new Brightics.VA.Core.Dialogs.HistorySelector(editor.$mainControl, {
            selectHistory: goHistoryHandler,
            stackIndex: commandManager.index,
            source: source,
            editor: editor
        });
    };

    Brightics.VA.Core.Editors.Toolbar.HistoryItem = HistoryItem;

}).call(this);