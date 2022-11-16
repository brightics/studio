/* -----------------------------------------------------
 *  move-mode-item.js
 *  Created by hyunseok.oh@samsung.com on 2018-07-03.
 * ---------------------------------------------------- */

/* global Studio */

(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function MoveModeItem($parent, options) {
        Brightics.VA.Core.Editors.Toolbar.Item.call(this, $parent, options);

        this.isSelected = false;
    }

    MoveModeItem.prototype = Object.create(Brightics.VA.Core.Editors.Toolbar.Item.prototype);
    MoveModeItem.prototype.constructor = MoveModeItem;

    MoveModeItem.prototype.initOptions = function () {
        this.setOptions(
            {
                'attribute': {
                    'title': Brightics.locale.common.moveMode,
                    'item-type': 'move-mode'
                },
                'action': {
                    'click': this.handleOnClick
                }
            }
        );
    };

    MoveModeItem.prototype.handleOnClick = function (event) {
        var modelEditor = Studio.getEditorContainer()
            .getActiveModelEditor();
        if (this.isSelected) {
            modelEditor.setEditorState('move-mode-enabled', false);
            this.$mainControl.removeClass('status-selected');
        } else {
            modelEditor.setEditorState('move-mode-enabled', true);
            this.$mainControl.addClass('status-selected');
        }
        this.isSelected = !this.isSelected;
    };

    Brightics.VA.Core.Editors.Toolbar.MoveModeItem = MoveModeItem;

/* eslint-disable no-invalid-this */
}.call(this));
