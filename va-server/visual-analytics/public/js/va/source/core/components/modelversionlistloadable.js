/* -----------------------------------------------------
 *  modelversionlistloadable.js
 *  Created by hyunseok.oh@samsung.com on 2018-01-03.
 * ----------------------------------------------------*/

(function () {
    'use strict';
    var Brightics = this.Brightics;
    var _super = Brightics.VA.Core.Components.ModelVersionList.prototype;

    var CLASS_BUTTON = 'brtc-va-base-list-button';

    function ModelVersionListLoadable(opt) {
        _super.constructor.call(this, opt);
    }

    ModelVersionListLoadable.prototype = Object.create(_super);
    ModelVersionListLoadable.prototype.constructor = ModelVersionListLoadable;

    ModelVersionListLoadable.prototype._initOptions = function () {
        var emitter = this.emitter;
        var _this = this;
        var columnOptions = [
            {
                name: 'Load',
                key: 'load',
                dataRenderer: function (index, value) {
                    var $elem = $('<div>Load</div>');
                    $elem.on('mousedown', function (event) {
                        
                        emitter.emit('load', _this.data[event.index]);
                        // emitter.emit('load', event.data);
                        event.stopPropagation();
                        
                        return false;
                    });
                    $elem.addClass(CLASS_BUTTON);
                    return $elem;
                }
            }
        ];
        this.columnOptions = this.columnOptions.concat(columnOptions);
    };

    Brightics.VA.Core.Components.ModelVersionListLoadable = ModelVersionListLoadable;
/* eslint-disable no-invalid-this */
}.call(this));
