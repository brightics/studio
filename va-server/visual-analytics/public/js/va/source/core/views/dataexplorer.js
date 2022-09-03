/**
 * Created by ng1123.kim on 2016-05-04.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function DataExplorer(parentId, options) {
        this.parentId = parentId;
        this.options = options;
        this.retrieveParent();
        this.createControls();
    }

    DataExplorer.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    DataExplorer.prototype.createControls = function () {
        this.$mainControl = $('<div class="brtc-va-views-dataexplorer brtc-va-tab-contents">' +
            // '   <div class="brtc-va-views-dataexplorer-repostiory brtc-style-s-sidebar-background"></div>' +
            '   <div class="brtc-va-views-dataexplorer-repostiory"></div>' +
            '</div>');
        this.$parent.append(this.$mainControl);

        this.repositoryViewer = new Brightics.VA.Core.Controls.RepositoryViewer(this.$mainControl.find('.brtc-va-views-dataexplorer-repostiory'));
    };

    DataExplorer.prototype.destroy = function () {
        this.repositoryViewer.destroy();
    };

    DataExplorer.prototype.render = function () {
        this.repositoryViewer.render();
    };

    Brightics.VA.Core.Views.DataExplorer = DataExplorer;

}).call(this);