/**
 * Created by sds on 2017-07-17.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ModelLayoutManager(editor, options) {
        Brightics.VA.Core.Editors.ModelLayoutManager.call(this, editor, options);
    }

    ModelLayoutManager.prototype = Object.create(Brightics.VA.Core.Editors.ModelLayoutManager.prototype);
    ModelLayoutManager.prototype.constructor = ModelLayoutManager;

    ModelLayoutManager.prototype.getSplitter = function () {
        return this.editor.getMainArea().find('.brtc-style-editor-visualeditorpage');
    };

    ModelLayoutManager.prototype.handleExpandStatusChanged = function () {
    };

    Brightics.VA.Implementation.Visual.ModelLayoutManager = ModelLayoutManager;
}).call(this);