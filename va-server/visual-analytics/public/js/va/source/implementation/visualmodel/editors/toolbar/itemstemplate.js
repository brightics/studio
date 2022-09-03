/**
 * Created by jmk09.jung on 2018-02-13.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    Brightics.VA.Implementation.Visual.Toolbar.ItemsTemplate = [
        {"class": Brightics.VA.Core.Editors.Toolbar.RedoItem},
        {"class": Brightics.VA.Core.Editors.Toolbar.UndoItem},
        {"class": Brightics.VA.Core.Editors.Toolbar.Separator},

        {"class": Brightics.VA.Core.Editors.Toolbar.ZoomItem},
        {"class": Brightics.VA.Core.Editors.Toolbar.Separator},

        {"class": Brightics.VA.Implementation.Visual.Toolbar.ContentOutlineItem},
        {"class": Brightics.VA.Core.Editors.Toolbar.Separator},

        {"class": Brightics.VA.Implementation.Visual.Toolbar.PublishItem},
        {"class": Brightics.VA.Implementation.Visual.Toolbar.RefreshItem},
        {"class": Brightics.VA.Implementation.Visual.Toolbar.ExportPDFItem},
        {"class": Brightics.VA.Core.Editors.Toolbar.Separator},

        {"class": Brightics.VA.Implementation.Visual.Toolbar.CopyItem},
        {"class": Brightics.VA.Implementation.Visual.Toolbar.CutItem},
        {"class": Brightics.VA.Implementation.Visual.Toolbar.PasteItem},
        {"class": Brightics.VA.Core.Editors.Toolbar.Separator},

        {"class": Brightics.VA.Implementation.Visual.Toolbar.DeleteItem}
    ];

}).call(this);