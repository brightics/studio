// /**
//  * Created by SDS on 2016-09-05.
//  */
// (function () {
//     'use strict';
//
//     var root = this;
//     var Brightics = root.Brightics;
//
//     function FuncPropertiesSideBar(parentId, options) {
//         Brightics.VA.Core.Tools.SideBar.call(this, parentId, options);
//     }
//
//     FuncPropertiesSideBar.prototype = Object.create(Brightics.VA.Core.Tools.SideBar.prototype);
//     FuncPropertiesSideBar.prototype.constructor = FuncPropertiesSideBar;
//
//     FuncPropertiesSideBar.prototype.createContent = function () {
//         this.$FuncPropertiesSideBar = $('' +
//             '<div class="brtc-va-tools-sidebar brtc-style-sidebar brtc-style-s-sidebar deeplearning">' +
//             '   <div class="brtc-va-tools-sidebar-funcpropertytab" />' +
//             '</div>');
//
//         this.initWidth();
//
//         this.$parent.find('.brtc-va-studio-sidebar-area').append(this.$FuncPropertiesSideBar);
//
//         this.$funcPropertiesArea = this.$FuncPropertiesSideBar.find('.brtc-va-tools-sidebar-funcpropertytab');
//         this.funcProperties = new Brightics.VA.Core.Views.FuncProperties(this.$funcPropertiesArea, {
//             width: '100%',
//             height: '100%',
//             panelFactory: this.getEditor().getPanelFactory(),
//             modelType: Brightics.VA.Implementation.DeepLearning.Clazz
//         });
//     };
//
//     FuncPropertiesSideBar.prototype.initWidth = function () {
//         this.$FuncPropertiesSideBar.width(this.options.width - 40);
//     };
//
//     FuncPropertiesSideBar.prototype.selectionChanged = function (fnUnit) {
//         if (fnUnit.length === 1) {
//             this.show();
//         }
//         this.funcProperties.selectionChanged(fnUnit);
//         this.preferenceTarget['scroll'].perfectScrollbar('update');
//     };
//
//     FuncPropertiesSideBar.prototype.empty = function () {
//         this.funcProperties.empty();
//     };
//
//     FuncPropertiesSideBar.prototype.initPreferenceTarget = function () {
//         this.preferenceTarget['scroll'] = this.$funcPropertiesArea.find('.brtc-va-editors-sheet-panels-basepanel-contents-area');
//     };
//
//     Brightics.VA.Core.Tools.SideBar.FuncPropertiesSideBar = FuncPropertiesSideBar;
// }).call(this);