(function () {
    'use strict';
    var root = this;
    var dataflow = root.Brightics.VA.Implementation.DataFlow;
    var clazz = dataflow.Clazz;

    var Interface = root.Brightics.VA.Core.Interface;

    Interface.Clazz[clazz] = clazz;
    Interface.Label[clazz] = dataflow.Label;
    Interface.Validator[clazz] = dataflow.Validator;
    Interface.Editor[clazz] = dataflow.Editor;
    Interface.Toolbar[clazz] = dataflow.Toolbar;
    Interface.SideBarManager[clazz] = dataflow.Tools.Manager.SideBarManager;
    Interface.Launcher[clazz] = dataflow.DataFlowLauncher;
    Interface.Functions[clazz] = dataflow.Functions;
    Interface.WidgetUtils[clazz] = dataflow.Utils.WidgetUtils;
    Interface.DefaultModel[clazz] = dataflow.defaultModel;
    Interface.AddonFunctionUtil[clazz] = dataflow.Utils.AddonFunctionUtil;
    Interface.ProjectContextMenuList[clazz] = [
        'duplicate',
        'export',
        'deploy',
        'exportAsRunnable',
        'version'
    ];
    Interface.Clipboard[clazz] = true;
    Interface.ModelLayoutManager[clazz] = dataflow.ModelLayoutManager;
    Interface.RunnableFactory[clazz] = dataflow.Utils.RunnableFactory;

}).call(this);