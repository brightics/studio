/**
 * Created by sds on 2017-07-17.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var Module = window.__module__;
    var TreeNode = Module.DataStructures.TreeNode;

    function NavigatorTree(id, data) {
        this.__root = new TreeNode(id, data);
    }

    NavigatorTree.prototype.getRoot = function () {
        return this.__root;
    };
    
    NavigatorTree.prototype.addChild = function (id, data) {
        return this.getRoot().addChild(id, data);
    };

    NavigatorTree.prototype.getChild = function (id) {
        return this.getRoot().getChild(id);
    };

    NavigatorTree.prototype.deleteChild = function (id) {
        this.getRoot().deleteChild(id);
    };
    
    Brightics.VA.Core.Editors.NavigatorTree = NavigatorTree;
}).call(this);