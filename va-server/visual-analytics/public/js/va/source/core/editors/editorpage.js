/**
 * Created by sungjin1.kim on 2016-01-30.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function EditorPage(parentId, options) {
        this.parentId = parentId;
        this.options = options;
        this.retrieveParent();
        this.createControls();
    }

    EditorPage.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    EditorPage.prototype.createControls = function () {
        // do nothing
    };

    Brightics.VA.Core.Editors.EditorPage = EditorPage;

}).call(this);