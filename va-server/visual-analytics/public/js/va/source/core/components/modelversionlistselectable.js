/**
 * hyunseok.oh@samsung.com
 * 2018. 01. 03
 */

(function () {
    'use strict';
    var Brightics = this.Brightics;
    var _super = Brightics.VA.Core.Components.ModelVersionList.prototype;

    var CLASS_BUTTON = 'brtc-va-base-list-button';

    function ModelVersionListSelectable(opt) {
        _super.constructor.call(this, opt);
    }

    ModelVersionListSelectable.prototype = Object.create(_super);
    ModelVersionListSelectable.prototype.constructor = ModelVersionListSelectable;

    ModelVersionListSelectable.prototype._initOptions = function () {
        var emitter = this.emitter;
        var _this = this;
        var columnOptions = [
            {
                name: 'Select',
                key: 'select',
                dataRenderer: function (index, value) {
                    var $elem = $('<div>Select</div>');
                    $elem.on('mousedown', function (event) {
                        event.stopPropagation();
                        emitter.emit('select', _this.data[event.index]);
                        // emitter.emit('select', event.data);
                        return false;
                    });
                    $elem.addClass(CLASS_BUTTON);
                    return $elem;
                }
            }
        ];
        this.columnOptions = this.columnOptions.concat(columnOptions);
    };

    ModelVersionListSelectable.prototype.openDetailVersionDialog = function (fileId, versionId) {
        new Brightics.VA.Core.Dialogs.SelectVersionDetailDialog(this.$mainControl, {
            projectId: this.projectId,
            fileId: fileId,
            versionId: versionId
        });
    };

    Brightics.VA.Core.Components.ModelVersionListSelectable = ModelVersionListSelectable;
    /* eslint-disable no-invalid-this */
}.call(this));
