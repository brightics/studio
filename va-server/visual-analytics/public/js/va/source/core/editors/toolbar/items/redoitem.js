/**
 * Created by jmk09.jung on 2018-02-13.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function RedoItem($parent, options) {
        Brightics.VA.Core.Editors.Toolbar.Item.call(this, $parent, options);

        this.refresh();
        this.addCommandListener();
        this.addGoHistoryListener();
    }

    RedoItem.prototype = Object.create(Brightics.VA.Core.Editors.Toolbar.Item.prototype);
    RedoItem.prototype.constructor = RedoItem;

    RedoItem.prototype.initOptions = function () {
        this.setOptions(
            {
                "attribute": {
                    "title": Brightics.locale.common.redo,
                    "item-type": "redo"
                },
                "action": {
                    'click': this.handleOnClick
                }
            }
        );
    };

    RedoItem.prototype.refresh = function () {
        this.refreshEnable();
        this.refreshTitle();
    };

    RedoItem.prototype.refreshEnable = function () {
        var commandManager = Studio.getEditorContainer().getActiveModelEditor().getCommandManager();

        if (commandManager.canRedo()) {
            this.$mainControl.removeClass('status-disabled');
        } else {
            this.$mainControl.addClass('status-disabled');
        }
    };

    RedoItem.prototype.refreshTitle = function () {
        var commandManager = Studio.getEditorContainer().getActiveModelEditor().getCommandManager();

        var commandStack = commandManager.stack, index = commandManager.index;
        var redoLabel = commandStack[index + 1] ? commandStack[index + 1].getLabel() : '';
        this.$mainControl.attr('title', Brightics.locale.common.redo + redoLabel);
    };

    RedoItem.prototype.addCommandListener = function () {

        var _this = this;
        Studio.getEditorContainer().getActiveModelEditor().addCommandListener(function (command) {
            _this.refresh();
        })
    };

    RedoItem.prototype.addGoHistoryListener = function () {
        var _this = this;
        Studio.getEditorContainer().getActiveModelEditor().addGoHistoryListener(function (command) {
            _this.refresh();
        })
    };

    RedoItem.prototype.handleOnClick = function (event) {
        Studio.getEditorContainer().getActiveModelEditor().getCommandManager().redo();
    };

    Brightics.VA.Core.Editors.Toolbar.RedoItem = RedoItem;

}).call(this);