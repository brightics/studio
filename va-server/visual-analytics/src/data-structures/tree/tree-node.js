import { HashMap } from '../hash-map/hash-map';
import { EventEmitter } from '../../event-emitter/event-emitter';
import { inherits } from '../../utils/inherits';
/**
 * hyunseok.oh@samsung.com
 * 2018. 01. 31
 */

/* global _ */

function TreeNode(key, data) {
    EventEmitter.call(this);
    this.key = key;
    this.data = data;
    this.__parentNode = this;
    this.__childrenNodes = [];
    this.__childrenMap = new HashMap();
}

inherits(TreeNode, EventEmitter);

TreeNode.prototype.hasChild = function (key) {
    return this.__childrenMap.has(key);
};

TreeNode.prototype.setData = function (data) {
    this.data = data;
    return this;
};

TreeNode.prototype.getData = function () {
    return this.data;
};

TreeNode.prototype.getKey = function () {
    return this.key;
};

TreeNode.prototype.setParent = function (parent) {
    this.__patrentNode = parent;
};

TreeNode.prototype.getParent = function () {
    return this.__parentNode;
};

TreeNode.prototype.addChild = function (key, data) {
    if (this.__childrenMap.has(key)) {
        return this.__childrenMap.get(key).setData(data);
    } else {
        var child = new TreeNode(key, data);
        child.setParent(this);
        this.__childrenMap.set(key, child);
        this.__childrenNodes.push(child);
        return child;
    }
};

TreeNode.prototype.deleteChild = function (key) {
    var ret = this.__childrenMap.remove(key);
    _.remove(this.__childrenNodes, function (node) {
        return node.getKey() == key;
    });
    return ret;
};

TreeNode.prototype.updateChild = function (key, data) {
    return this.__childrenMap.get(key).setData(data);
};

TreeNode.prototype.getChildren = function () {
    return _.map(this.__childrenNodes, function (node) {
        return node.getData();
    });
};

TreeNode.prototype.getChildrenNodes = function () {
    return this.__childrenNodes;
};

TreeNode.prototype.getChildrenMap = function () {
    return _.forIn(this.__childrenMap.toJSON(), function (e) {
        return e.getData();
    });
};

TreeNode.prototype.go = function (key) {
    return this.__childrenMap.get(key);
};

//사실 go 랑 같은기능인데 이름때문에
TreeNode.prototype.getChild = function (key) {
    return this.__childrenMap.get(key);
};

TreeNode.prototype.findChildNodeBruteForce = function (fn) {
    var idx = _.findIndex(this.__childrenNodes, function (node) {
        return fn(node);
    });
    if (idx > -1) return this.__childrenNodes[idx];
    return null;
};

export { TreeNode };
