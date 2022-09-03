/**
 * hyunseok.oh@samsung.com
 * 2017. 12. 25
 */

/* global */
(function () {
    'use strict';
    var Brightics = this.Brightics;

    function ModelVersionDetail(opt) {
        this.$el = opt.$el;
        var html = [
            '<div class="brtc-va-version-detail-body">',
            '   <div class="brtc-va-version-detail-row">',
            '      <div class="brtc-va-version-detail-label">' + Brightics.locale.common.name + '</div>',
            '      <input readonly type="text" class="brtc-va-version-detail-label-input brtc-style-flex-1" maxlength="80"/>',
            '   </div>',
            '   <div class="brtc-va-version-detail-row">',
            '      <div class="brtc-va-version-detail-label">' + Brightics.locale.common.description + '</div>',
            '      <div readonly class="brtc-va-version-detail-description-input brtc-style-flex-1">',
            '      </div>',
            '   </div>',
            '   <div class="brtc-va-version-detail-row">',
            '      <div class="brtc-va-version-detail-label">' + Brightics.locale.common.tags + '</div>',
            '      <input readonly type="text" class="brtc-va-version-detail-tags-input brtc-style-flex-1" maxlength="80"/>',
            '   </div>',
            '</div>'
        ].join('\n');

        this.$self = $(html);
        this.$el.append(this.$self);
        this._init();
    }

    ModelVersionDetail.prototype._init = function () {
        this.$labelInput = this.$self.find('.brtc-va-version-detail-label-input')
            .jqxInput({theme: Brightics.VA.Env.Theme, disabled: true});
        this.$tagsInput = this.$self.find('.brtc-va-version-detail-tags-input')
            .jqxInput({theme: Brightics.VA.Env.Theme, disabled: true});
        this.$descriptionInput = this.$self.find('.brtc-va-version-detail-description-input');
        this.$descriptionInput.perfectScrollbar();
    };

    ModelVersionDetail.prototype._render = function () {
        this.$labelInput.val(this.data.getLabel());
        this.$tagsInput.val(this.data.getTags());
        this.$descriptionInput.html(this.data.getDescription());
        this.$descriptionInput.perfectScrollbar('update');
    };

    ModelVersionDetail.prototype.update = function (data) {
        this.data = data;
        this._render();
    };

    Brightics.VA.Core.Components.ModelVersionDetail = ModelVersionDetail;
/* eslint-disable no-invalid-this */
}.call(this));
