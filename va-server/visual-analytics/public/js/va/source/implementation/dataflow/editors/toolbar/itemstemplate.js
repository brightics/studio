/**
 * Created by jmk09.jung on 2018-02-13.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    Brightics.VA.Implementation.DataFlow.Toolbar.ItemsTemplate = [
        {"class": Brightics.VA.Implementation.DataFlow.Toolbar.RunItem},
        {"class": Brightics.VA.Core.Editors.Toolbar.Separator},

        {"class": Brightics.VA.Core.Editors.Toolbar.VariableItem},
        {"class": Brightics.VA.Core.Editors.Toolbar.Separator},

        {"class": Brightics.VA.Core.Editors.Toolbar.ClipboardItem},
        {"class": Brightics.VA.Core.Editors.Toolbar.HistoryItem},
        {"class": Brightics.VA.Core.Editors.Toolbar.RedoItem},
        {"class": Brightics.VA.Core.Editors.Toolbar.UndoItem},
        {"class": Brightics.VA.Core.Editors.Toolbar.Separator},

        // {"class": Brightics.VA.Core.Editors.Toolbar.IndexItem},
        {"class": Brightics.VA.Core.Editors.Toolbar.ZoomItem},
        {"class": Brightics.VA.Core.Editors.Toolbar.Separator},

        {"class": Brightics.VA.Core.Editors.Toolbar.MoveModeItem},
        {"class": Brightics.VA.Core.Editors.Toolbar.TooltipItem},
        {"class": Brightics.VA.Core.Editors.Toolbar.Separator},

        {"class": Brightics.VA.Core.Editors.Toolbar.DatasourceItem},
        {"class": Brightics.VA.Core.Editors.Toolbar.ScheduleItem},
        {"class": Brightics.VA.Core.Editors.Toolbar.VersionItem},
        {"class": Brightics.VA.Core.Editors.Toolbar.Separator},

        {"class": Brightics.VA.Implementation.DataFlow.Toolbar.FunctionhelpItem},
        {"class": Brightics.VA.Core.Editors.Toolbar.ModelInfoItem}
    ];

}).call(this);