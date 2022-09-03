/* -----------------------------------------------------
 *  local-outline.js
 *  Created by hyunseok.oh@samsung.com on 2018-07-12.
 * ---------------------------------------------------- */

/* global _, crel */
(function (Brightics) {
    let Outline = Brightics.VA.Core.Views.Outline;


    function LocalOutline(options) {
        Outline.call(this, options);
    }

    LocalOutline.prototype = _.create(Outline.prototype);
    LocalOutline.prototype.constructor = LocalOutline;

    LocalOutline.prototype.onDoubleClickItem = function (id) {
        let currentItem = this.id2item[id];
        let parentItem = currentItem.parent;

        if (currentItem.type === 'fn') {
            // change active model & select fnunit
            this.editor.changeEditorContext(parentItem.id,
                parentItem.parent ? parentItem.parent.fn : undefined);
            this.editor.showFunctionProperty(currentItem.id);
        } else {
            // change active model
            this.editor.changeEditorContext(currentItem.id,
                parentItem ? parentItem.fn : undefined);
        }
    };

    let transform = function (item) {
        let status = self.editor.getStatus(item.type === 'fn' ? item.fn.fid : item.model.mid);
        let ret = {
            type: item.type,
            id: id,
            items: item.items.map(function (_item) {
                return transform(_item);
            })
        };

        if (item.model) ret.model = item.model;
        else ret.fn = item.fn;

        ret.html = [
            crel('div', {
                class: 'item-status',
                status: status && status.status? status.status : 'READY',
                title: status && status.message? status.message : '',
                type: item.type
            }).outerHTML,
            crel('span', {
                class: [item.active ? 'active' : '', item.selected ? 'underline' : ''].join(' '),
                title: item.label
            }, item.label).outerHTML
        ].join('');

        ret.items.forEach(function (child) {
            child.parent = ret;
        });

        self.id2item[ret.id] = ret;
        return ret;
    };

    LocalOutline.prototype.getData = function () {
        let self = this;
        let activeModel = self.editor.getActiveModel();
        let activeFid = self.editor.getActiveFnUnitOnProp() ?
            self.editor.getActiveFnUnitOnProp().fid : undefined;
        let localOutline = Brightics.VA.Core.Utils.NestedFlowUtils
            .getLocalOutline(self.model, activeModel, activeFid);

        self.id2item = {};

        return [transform(localOutline)];
    };

    LocalOutline.prototype.refresh = function (target, args) {
        try {
            if (target) {
                this.view.render[target](args);
            } else {
                this.view.render.all();
            }
        } catch (e) {
            this.view.render.error(e);
        }
    };

    Brightics.VA.Core.Views.LocalOutline = LocalOutline;
}(window.Brightics));
