/**
 * hyunseok.oh@samsung.com
 * 2017. 12. 25
 */

/* global _ */
(function () {
    'use strict';
    var Brightics = this.Brightics;

    /**
     * 주의: ModelVersionList안에서 Version Data를 직접 바꾸지 않도록 해야 함 (카피해서 쓰기)
     */
    function ModelVersionList(opt) {
        this.$el = opt.$el;
        this.onItemClick = opt.onItemClick;
        this.$self = $('<div class="brtc-va-version-list-grid"></div>');
        this.emitter = opt.emitter;
        this.columnOptions = [
            {
                name: 'Version',
                key: 'version',
                type: 'string',
                headerAlign: 'center',
                dataAlign: 'center',
                width: 100
            },
            {
                name: 'Name',
                key: 'label',
                type: 'string',
                headerAlign: 'center',
                dataAlign: 'left',
                width: 'auto'
            },
            {
                name: 'Tags',
                key: 'tags',
                type: 'string',
                headerAlign: 'center',
                dataAlign: 'left',
                width: 'auto'
            },
            {
                name: 'Create Time',
                key: 'create_time',
                type: 'date',
                headerAlign: 'center',
                dataAlign: 'center',
                width: 150
            },
            {
                name: 'Update Time',
                key: 'update_time',
                type: 'date',
                headerAlign: 'center',
                dataAlign: 'center',
                width: 150
            }
        ];

        this.listOptions = {
            height: '400px'
        };

        this._initOptions();
        this.baseList = this._createList(this.$self);
        this.$el.append(this.$self);
        this.data = [];

        this.projectId = opt.projectId;
        this.fileId = opt.fileId;

        this.refreshFileVersionList();
    }

    ModelVersionList.prototype.update = function (_data) {
        this.data = _.clone(_data);

        this.data.sort(function (a, b) {
            return b.compareToByVersion(a);
        });

        this.baseList.update(_.map(this.data, function (version) {
            return {
                version: version.getVersion(),
                label: version.getLabel(),
                tags: version.getTags(),
                update_time: version.getUpdateTime(),
                create_time: version.getCreateTime()
            };
        }));

        // this.data = _.map(this.data, function (val) {
        //     val.version = val.major_version + '.' + val.minor_version;
        //     return val;
        // });

        // this.baseList.update(this.data);
    };

    ModelVersionList.prototype._initOptions = function () {
    };

    ModelVersionList.prototype._createList = function ($parent) {
        return new Brightics.VA.Controls.ControlFactory.createListControl($parent, {
            width: '100%',
            height: 'calc(100% - 35px)',
            columns: this.columnOptions,
            listOptions: this.listOptions
        })
            .on('cell-click', _.debounce(function (evt) {
                var data = this.data[evt.index];
                this.openDetailVersionDialog(data.getFileId(), data.getVersionId());
            }.bind(this), 300))
            .render();
    };

    ModelVersionList.prototype.openDetailVersionDialog = function (fileId, versionId) {
        var closeHandler = function (result) {
            // if (result.loadingSuccess) this.$mainControl.dialog('close');
            if (result.edited) this.refreshFileVersionList();
        }.bind(this);

        new Brightics.VA.Core.Dialogs.DetailVersionDialog(this.$mainControl, {
            projectId: this.projectId,
            fileId: fileId,
            versionId: versionId,
            close: closeHandler
        });
    };

    ModelVersionList.prototype.refreshFileVersionList = function () {
        Studio.getResourceManager().fetchVersions(this.projectId, this.fileId)
            .then(function (fileVersions) {
                this.update(fileVersions);
            }.bind(this))
            .catch(this._onError.bind(this));
    };

    ModelVersionList.prototype._onError = function (err) {
        Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(err);
        this.emitter.emit('error', err);
    };

    ModelVersionList.prototype.getControl = function () {
        return this.baseList;
    };

    ModelVersionList.prototype.destroy = function () {
        this.baseList.destroy();
    };

    Brightics.VA.Core.Components.ModelVersionList = ModelVersionList;
    /* eslint-disable no-invalid-this */
}.call(this));
