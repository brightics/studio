(function () {
    'use strict';
    var root = this;
    var visual = root.Brightics.VA.Implementation.Visual;
    var clazz = visual.Clazz;
    var Interface = root.Brightics.VA.Core.Interface;

    Interface.Clazz[clazz] = clazz;
    Interface.Label[clazz] = visual.Label;
    Interface.Editor[clazz] = visual.Editor;
    Interface.Toolbar[clazz] = visual.Toolbar;
    Interface.DefaultModel[clazz] = visual.defaultModel;
    Interface.Validator[clazz] = visual.Validator;
    Interface.SideBarManager[clazz] = visual.Tools.Manager.SideBarManager;
    Interface.Launcher[clazz] = visual.VisualModelLauncher;
    Interface.Functions[clazz] = visual.Functions;
    Interface.ProjectContextMenuList[clazz] = ['duplicate', 'export', 'version'];
    Interface.ModelLayoutManager[clazz] = visual.ModelLayoutManager;
    Interface.RunnableFactory[clazz] = visual.Utils.RunnableFactory;
    
}).call(this);