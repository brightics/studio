/* -----------------------------------------------------
 *  transform-model.js
 *  Created by hyunseok.oh@samsung.com on 2018-07-23.
 * ---------------------------------------------------- */

var ACTION_KEY = '__brtc__model__sync__';

function transformModel(model, operationTree) {
    var keys = Object.keys(operationTree);
    var keyLen = keys.length;
    var action;
    var key;
    var child;

    if (Array.isArray(model)) {
        for (let i = 0; i < keyLen; i++) {
            key = keys[i];
            child = operationTree[key];
            if (child.hasOwnProperty(ACTION_KEY)) {
                action = child.action;
                if (action === 'update') {
                    model[key] = child.val;
                } else if (action === 'remove') {
                    model.pop();
                } else if (action === 'add') {
                    model.push(child.val);
                }
            } else {
                model[key] = transformModel(model[key], child);
            }
        }
    } else {
        for (let i = 0; i < keyLen; i++) {
            key = keys[i];
            child = operationTree[key];
            if (child.hasOwnProperty(ACTION_KEY)) {
                action = child.action;
                if (action === 'update' || action === 'add') {
                    model[key] = child.val;
                } else if (action === 'remove') {
                    delete model[key];
                }
            } else {
                model[key] = transformModel(model[key], child);
            }
        }
    }
    return model;
}

module.exports = transformModel;
