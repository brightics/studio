/* -----------------------------------------------------
 *  datasource-management.js
 *  Created by hyunseok.oh@samsung.com on 2018-10-16.
 * ---------------------------------------------------- */

/* global RSAKey, brtc_require */
(function (root) {
    const Brightics = root.Brightics;
    const dim = (...args) => Brightics.VA.Core.Utils.CommonUtils.dim(...args);
    const crel = brtc_require('crel');
    const theme = Brightics.VA.Env.Theme;
    const {DB, Cloud} = brtc_require('Dao').DatasourceDao;
    const {getDatasources, addDatasource,
        updateDatasource, deleteDatasource, getDbTypes} = DB;
    const {getS3s, addS3, updateS3, deleteS3} = Cloud;

    const ITEM_HEIGHT = 25;
    const MAX_DROPDOWN_HEIGHT = 150;
    const DEBUG = false;

    const S3 = 'Amazon S3';

    let dbTypes = [];

    const getRSA = function () {
        return Promise.resolve($.ajax({
            type: 'GET',
            url: 'api/va/v2/rsa/publickey'
        })).then(({publicN, publicE}) => {
            const rsa = new RSAKey();
            rsa.setPublic(publicN, publicE);
            return rsa;
        });
    };

    const getEncryptedDatasource = function (datasource) {
        return getRSA().then((rsa) => {
            if (datasource.datasourceType === 'RDB') {
                return Object.assign({}, datasource, {
                    password: rsa.encrypt(datasource.password)
                });
            } else {
                return Object.assign({}, datasource, {
                    secretAccessKey: rsa.encrypt(datasource.secretAccessKey)
                });
            }
        });
    };

    const DatasourceTree = (function () {
        function DatasourceTree($parent, options) {
            this.data = options.data;
            this.handler = options.handler;
            this.$control = $(
                crel('div', 'datasource-management-view__tree')
            );

            this.$control.jqxTree({
                theme: Brightics.VA.Env.Theme,
                source: this.getTreeSourceFromData(options.data),
                height: '100%',
                width: '100%',
                allowDrag: false,
                allowDrop: false
            });

            this.$control.on('itemClick', (e) => {
                const item = this.$control.jqxTree('getItem', e.args.element);
                const data = this.getDataByItem(item);
                this.handler.itemClick(data);
            });
            $parent.append(this.$control);
        }

        DatasourceTree.prototype.destroy = function () {
            this.$control.jqxTree('destroy');
        };

        DatasourceTree.prototype.getTreeSourceFromData = function (data) {
            return data.map(({label, items}, id) => {
                return {
                    html: `
                        <i
                            class="fa fa-${label === 'DB' ? 'database' : 'cloud'}"
                            aria-hidden="true"
                        ></i> ${_.escape(label)}`,
                    expanded: false,
                    items: items.map((_el, _id) => {
                        const label = `${_el.datasourceName} (${_el.dbType || (_el.cloudType || S3)})`;
                        return {
                            html: `
                                <span
                                    class="datasource-management-view__tree-item brtc-style-ellipsis"
                                    ds-type="${_el.datasourceType === 'RDB' ? 'RDB' : 'Cloud'}"
                                    ds-name="${_el.datasourceName}"
                                    title="${label}"
                                >${_.escape(label)}</span>
                            `,
                            items: []
                        };
                    })
                };
            });
        };

        DatasourceTree.prototype.render = function (data) {
            this.setData(data);
            this.$control.jqxTree({
                theme: Brightics.VA.Env.Theme,
                source: this.getTreeSourceFromData(this.data)
            });
            this.$control.jqxTree('refresh');
        };

        DatasourceTree.prototype.select = function ({datasourceName, datasourceType} = {}) {
            const item = this.getItemByLabelAndType(datasourceName, datasourceType);
            this.$control.jqxTree('selectItem', item);
            if (!item) return;
            const parent = this.getItemByElement(item.parentElement);
            if (parent) this.$control.jqxTree('expandItem', parent);
        };

        DatasourceTree.prototype.getItemByElement = function (el) {
            const items = this.$control.jqxTree('getItems');
            for (let item of items) {
                if (item.element === el) return item;
            }
            return null;
        };

        DatasourceTree.prototype.getItemByLabelAndType = function (label, datasourceType) {
            var items = this.$control.jqxTree('getItems');
            for (let item of items) {
                const span = item.element.querySelector('span');
                if (span &&
                    span.getAttribute('ds-name') === label &&
                    span.getAttribute('ds-type') === datasourceType) return item;
            }
            return null;
        };

        DatasourceTree.prototype.setData = function (data) {
            this.data = data;
        };

        DatasourceTree.prototype.deleteById = function ({datasourceName, datasourceType = 'Cloud'}) {
            var item = this.getItemByLabelAndType(datasourceName, datasourceType);
            if (item) {
                this.$control.jqxTree('removeItem', item.element);
            }
        };

        DatasourceTree.prototype.getDataByItem = function (item) {
            const span = item.element.querySelector('span');
            if (span) {
                const datasourceName = span.getAttribute('ds-name');
                const datasourceType = span.getAttribute('ds-type');
                for (let p of this.data) {
                    for (let q of p.items) {
                        if (q.datasourceName === datasourceName &&
                            (q.datasourceType || 'Cloud') === datasourceType) return q;
                    }
                }
                return null;
            }
        };
        return DatasourceTree;
    }());

    const DatasourceManagementViewForm = (function () {
        function DatasourceManagementViewForm($parent, _options) {
            var options = _options || {};
            this.options = options;
            this.handler = options.handler || {};
            var $control = $(crel('div', {class: 'datasource-management-view__form'}));
            this.$control = $control;
            $parent.append($control);
        }

        DatasourceManagementViewForm.prototype.getAllValidationMessage = function () {
            return this.view.map(({validate}) => validate()).filter((v) => v);
        };

        DatasourceManagementViewForm.prototype.focusFirstInvalidInput = function () {
            const firstInvalid = this.view.find(({validate}) => validate());
            firstInvalid && firstInvalid.focus();
        };

        DatasourceManagementViewForm.prototype.validate = function () {
            return this.view.forEach((v) => v.validate());
        };

        DatasourceManagementViewForm.prototype.isDirty = function () {
            return this.view.some(({getValue, key}) => {
                return getValue() !== this.data[key];
            });
        };

        DatasourceManagementViewForm.prototype.getJSON = function () {
            const obj = this.view.reduce((acc, e) => {
                return Object.assign(acc, {
                    [e.key]: e.getValue()
                });
            }, {});

            if (this.data.datasourceType === 'RDB') {
                return Object.assign({datasourceType: 'RDB'}, obj);
            }
            return Object.assign({datasourceType: 'Cloud'}, obj);
        };

        DatasourceManagementViewForm.prototype.setData = function (data) {
            this.data = data;
            if (!data) return;
            if (data.datasourceType !== 'RDB') {
                this.data = Object.assign({cloudType: S3}, data);
            }
        };

        DatasourceManagementViewForm.prototype.render = function (data, readOnly) {
            this.setData(data);
            this.$control.empty();
            if (!data) return;

            const wrap = (label, el) => {
                return crel('div', {class: 'datasource-management-view__input-row'},
                    crel('div', {class: 'datasource-management-view__input-wrapper'},
                        crel('div', {class: 'datasource-management-view__label-wrapper'},
                            crel('label', label,
                                crel('span', {class: 'datasource-management-view__required-star'},
                                    '*'))
                        ),
                        el
                    ),
                    crel('div', {class: 'datasource-management-view__validation-area'})
                );
            };

            const requiredValidator = (val) => {
                if (val.trim().length === 0) return Brightics.locale.common.requiredInputs;
                return '';
            };

            const createInputPair = (key, label, value,
                    {validator = requiredValidator, option = {}} = {}) => {
                const inp = crel('input',
                    Object.assign({
                        class: 'datasource-management-view__input',
                        value: value,
                        maxlength: 80,
                        title: option.disabled ? value : ''
                    }, option));
                const $pair = $(wrap(label, inp));
                const $inp = $(inp).jqxInput({
                    theme,
                    value,
                    disabled: option.disabled,
                    height: '100%',
                    width: '300px'
                });
                const $v = $pair.find('.datasource-management-view__validation-area');
                const getValue = () => $inp.jqxInput('val');
                const focus = () => $inp.focus();
                const validate = () => {
                    const val = $inp.jqxInput('val');
                    const msg = validator ? validator(val) : '';
                    $pair.toggleClass('datasource-management-view__input-row--error', !!msg);
                    $v.html(msg);
                    return msg;
                };
                $inp.on('keyup', () => this.handler.valueChange());
                $inp.on('focusout', () => {
                    validate();
                });
                return {
                    $el: $pair,
                    getValue,
                    validate,
                    focus,
                    key
                };
            };

            const createDropdownPair = (key, label, items, value, option) => {
                const div = crel('div',
                    Object.assign({class: 'datasource-management-view__dropdown'}, option));


                const index = Math.max(0, items.indexOf(value));

                const calcDropdownHeight = (num) => {
                    return Math.min(ITEM_HEIGHT * num, MAX_DROPDOWN_HEIGHT) + 'px';
                };

                const $dropdown = $(div).jqxDropDownList({
                    theme,
                    source: items,
                    selectedIndex: index,
                    height: '100%',
                    width: '300px',
                    dropDownHeight: calcDropdownHeight(items.length)
                });

                $dropdown.on('change', () => this.handler.handleValueChange());

                const getValue = () => $dropdown.jqxDropDownList('val');
                const validate = () => '';

                const $pair = $(wrap(label, div));
                return {
                    $el: $pair,
                    getValue,
                    validate,
                    key
                };
            };

            const viewTarget = data.datasourceType === 'RDB' ? 'RDB' : 'Cloud';
            const viewMap = {
                RDB: [
                    createInputPair('datasourceName', Brightics.locale.common.name, data.datasourceName, {
                        option: {
                            disabled: readOnly
                        }
                    }),
                    createInputPair('ip', Brightics.locale.datasource.ip, data.ip),
                    createInputPair('port', Brightics.locale.datasource.port, data.port, {
                        validator: (val) => {
                            const num = '01234567890';
                            if (requiredValidator(val)) return requiredValidator(val);
                            const length = val.length;
                            for (let i = 0; i < length; i++) {
                                if (num.indexOf(val[i]) === -1) return 'Number type is required.';
                            }
                            return '';
                        }
                    }),
                    createDropdownPair('dbType', Brightics.locale.datasource.dbType, dbTypes, data.dbType),
                    createInputPair('dbName', Brightics.locale.datasource.dbName, data.dbName),
                    createInputPair('userName', Brightics.locale.common.userName, data.userName),
                    createInputPair('password', Brightics.locale.common.password, data.password, {option: {type: 'password'}})
                ],
                Cloud: [
                    createInputPair('datasourceName', Brightics.locale.common.name, data.datasourceName, {
                        option: {
                            disabled: readOnly
                        }
                    }),
                    createDropdownPair('cloudType', Brightics.locale.datasource.cloudType, [
                        S3
                    ], data.cloudType || S3),
                    createInputPair('accessKeyId', Brightics.locale.datasource.accessKeyId, data.accessKeyId),
                    createInputPair('secretAccessKey', Brightics.locale.datasource.secretAccessKey, data.secretAccessKey, {
                        option: {
                            type: 'password'
                        }
                    }),
                    createInputPair('bucketName', Brightics.locale.datasource.bucketName, data.bucketName)
                ]
            };

            const view = viewMap[viewTarget];

            this.view = view;

            this.$control.append(view.map((x) => x.$el));
            return;
        };
        return DatasourceManagementViewForm;
    }());

    const DatasourceDetail = (function () {
        function DatasourceDetail($parent, _options) {
            var options = _options || {};
            this.handler = options.handler;
            var $control = $(
                crel('div', {class: 'datasource-management-view__detail'},
                    crel('div', {class: 'datasource-management-view__form-area'}),
                    crel('div', {class: 'datasource-management-view__button-area'},
                        crel('div', {class: 'datasource-management-view__left-button-area'},
                            crel('button', {class: 'datasource-management-view__delete-button'},
                                Brightics.locale.common.delete)
                        ),
                        crel('div', {class: 'datasource-management-view__right-button-area'},
                            crel('button', {class: 'datasource-management-view__cancel-button'},
                                Brightics.locale.common.cancel),
                            crel('button', {class: 'datasource-management-view__save-button'},
                                Brightics.locale.common.save)
                        )
                    )
                )
            );
            this.data = options.item;
            this.$control = $control;
            this.$formArea = this.$control.find('.datasource-management-view__form-area');
            this.dmvForm = new DatasourceManagementViewForm(
                this.$formArea,
                {
                    item: this.item,
                    handler: {
                        valueChange: this.handleValueChange.bind(this)
                    }
                }
            );
            this.$formArea.perfectScrollbar();
            $parent.append($control);

            const defBtnOpt = {
                theme,
                width: 100,
                height: 30
            };

            this.$buttonArea = this.$control.find('.datasource-management-view__button-area');
            this.$saveButton = this.$buttonArea.find('.datasource-management-view__save-button')
                .jqxInput(defBtnOpt);
            this.$cancelButton = this.$buttonArea.find('.datasource-management-view__cancel-button')
                .jqxInput(defBtnOpt);
            this.$deleteButton = this.$buttonArea.find('.datasource-management-view__delete-button')
                .jqxInput(defBtnOpt);

            this.$saveButton.click((e) => {
                this.handler.saveClick(this.getDataByType());
            });
            this.$cancelButton.click((e) => {
                this.render(this.data, this.lastReadOnly);
            });
            this.$deleteButton.click((e) => {
                if (this.data) this.handler.deleteClick(this.data);
            });

            this.$buttonArea.hide();
        }

        DatasourceDetail.prototype.isValid = function () {
            return this.dmvForm.getAllValidationMessage().length === 0;
        };

        DatasourceDetail.prototype.focusFirstInvalidInput = function () {
            return this.dmvForm.focusFirstInvalidInput();
        };

        DatasourceDetail.prototype.getDataByType = function () {
            return this.dmvForm.getJSON();
        };

        DatasourceDetail.prototype.handleValueChange = function () {
            this.$saveButton.jqxInput({
                disabled: !this.dmvForm.isDirty()
            });
        };

        DatasourceDetail.prototype.render = function (data, readOnly) {
            this.data = data;
            this.dmvForm.render(data, readOnly);
            this.lastReadOnly = readOnly;
            this.$buttonArea.toggle(!!data);
            this.$deleteButton.toggle(!!(data && data.datasourceName));
            if (data) {
                this.$saveButton.jqxInput({
                    disabled: !this.dmvForm.isDirty()
                });
            }
        };

        DatasourceDetail.prototype.getDatasourceName = function () {
            return this.data ? this.data.datasourceName : '';
        };
        return DatasourceDetail;
    }());

    function DatasourceManagementView(parentId, options) {
        this.parentId = parentId;
        this.options = options;
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
        this.$control = this._createControl(this.$parent);
        this.data = [
            {
                label: 'Cloud Datasource',
                items: []
            },
            {
                label: 'DB',
                items: []
            }
        ];

        this.fetched = false;
        dim(() => {
            return this._fetchData()
                .then((data) => this._init(data));
        }, {appendTo: this.$parent})
            .catch((err) => {
                console.error(err);
            });
    }

    DatasourceManagementView.prototype._createControl = function ($parent) {
        var $control = $(
            crel('div', {class: 'datasource-managemenet-view__wrapper'},
                crel('div', {class: 'datasource-management-view__upper-button-area'},
                    crel('button', {class: 'datasource-management-view__new-connection-button'},
                    Brightics.locale.datasource.newConnection + '▼')
                ),
                crel(
                    'div', {class: 'datasource-managemenet-view'},
                        crel('div', {class: 'datasource-management-view__left-panel'}),
                        crel('div', {class: 'datasource-management-view__right-panel'})
                )
            )
        );
        this.$dmvLeftPanel = $control.find('.datasource-management-view__left-panel');
        this.$dmvRightPanel = $control.find('.datasource-management-view__right-panel');
        this.$addNew = $control.find('.datasource-management-view__new-connection-button')
            .jqxInput({
                theme,
                width: 120,
                height: 30
            });

        this.$newConnectionMenu = $(
            crel('div', {class: 'datasource-management-view__add-connection-menu'},
                crel('ul',
                    crel('li', {action: 'cloud'}, 'Cloud'),
                    crel('li', {action: 'db'}, 'DB')
                )
            )
        );

        this.$newConnectionMenu.jqxMenu({
            theme: Brightics.VA.Env.Theme,
            width: '100px',
            height: '180px',
            autoOpenPopup: false,
            mode: 'popup',
            animationHideDuration: 0,
            animationShowDuration: 0
        });

        this.$newConnectionMenu.on('itemclick', (e) => {
            var action = e.args.getAttribute('action');
            this._handleNewConnectionClick(action);
        });

        this.$addNew.click((e) => {
            const {top, left} = this.$addNew.offset();
            this.$newConnectionMenu.jqxMenu('open',
                left - this.$newConnectionMenu.outerWidth() + this.$addNew.outerWidth(),
                top + this.$addNew.outerHeight());
        });

        $parent.append($control);
        return $control;
    };

    DatasourceManagementView.prototype.getElement = function () {
        return this.$control;
    };

    DatasourceManagementView.prototype._fetchData = function () {
        this.fetched = true;
        const fetchDB = getDatasources();
        const fetchCloud = getS3s();
        const fetchDbTypes = getDbTypes();

        return Promise.all([fetchDB, fetchCloud, fetchDbTypes])
            .then(([db, cloud, _dbTypes]) => {
                dbTypes = _dbTypes;
                return new Promise((resolve, reject) => {
                    resolve([
                        {
                            label: 'Cloud Datasource',
                            items: cloud
                        },
                        {
                            label: 'DB',
                            items: db
                        }
                    ]);
                });
            });
    };

    DatasourceManagementView.prototype._init = function (data) {
        this.data = data;
        this.datasourceTree = new DatasourceTree(this.$dmvLeftPanel, {
            data,
            handler: {
                itemClick: this._handleItemClick.bind(this)
            }
        });

        this.datasourceDetail = new DatasourceDetail(this.$dmvRightPanel, {
            item: null,
            handler: {
                saveClick: this._handleSaveClick.bind(this),
                cancelClick: this._handleCancelClick.bind(this),
                deleteClick: this._handleDeleteClick.bind(this)
            }
        });
    };

    DatasourceManagementView.prototype._handleSaveClick = function (data) {
        if (this.datasourceDetail.isValid()) {
            if (!this.selected) {
                dim(() => {
                    const newData = getEncryptedDatasource(data).then((_data) => {
                        return _data.datasourceType === 'RDB' ?
                            addDatasource(_data) :
                            addS3(_data);
                    });
                    return newData
                        .then(() => {
                            this._new(data)
                                .then(() => {
                                    this.selected = data;
                                    this.datasourceTree.select(data);
                                    this.datasourceDetail.render(data, true);
                                });
                        })
                        .catch((err) => {
                            if (err.responseText) {
                                Brightics.VA.Core.Utils.WidgetUtils
                                    .openErrorDialog(JSON.parse(err.responseText));
                            } else {
                                Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog(err);
                            }
                        });
                });
            } else {
                dim(() => {
                    const updateData = getEncryptedDatasource(data).then((_data) => {
                        return _data.datasourceType === 'RDB' ?
                            updateDatasource(_data) :
                            updateS3(_data);
                    });
                    return updateData.then(() => {
                        this._modify(this.selected, data);
                        return;
                    });
                });
            }
        } else {
            this.datasourceDetail.focusFirstInvalidInput();
        }
    };

    DatasourceManagementView.prototype._new = function (data) {
        return Promise.resolve(data)
            .then((_d) => {
                const d = _d || data;
                if (d.datasourceType === 'RDB') {
                    const t = this.data.find((el) => {
                        return el.label === 'DB';
                    });
                    if (t) {
                        t.items = t.items.concat(Object.assign({}, d, {password: ''}));
                    }
                } else {
                    const t = this.data.find((el) => {
                        return el.label === 'Cloud Datasource';
                    });
                    if (t) {
                        t.items = t.items.concat(Object.assign({}, d, {secretAccessKey: ''}));
                    }
                }
                this.datasourceTree.render(this.data);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    DatasourceManagementView.prototype._modify = function (target, data) {
        const {datasourceName} = target;
        const prev = [];
        if (datasourceName === data.datasourceName) {
            this.data = this.data.map(({label, items}) => {
                return {
                    label,
                    items: items.map((item) => {
                        return item.datasourceName === datasourceName ? data : item;
                    })
                };
            });
            this.datasourceTree.setData(this.data);
            this.datasourceDetail.render(data, true);
        }
        prev.reduce((acc, c) => {
            return acc.then(c);
        }, Promise.resolve())
            .then(() => {
                this.datasourceTree.select(data);
                this.selected = data;
            })
            .catch((err) => {
                console.error(err);
            });
    };

    DatasourceManagementView.prototype._handleCancelClick = function () {
    };

    DatasourceManagementView.prototype._delete = function ({datasourceName, datasourceType = 'Cloud'}) {
        this.data = this.data.map(({label, items}) => {
            return {
                label,
                items: items.filter((item) => {
                    return !((item.datasourceType || 'Cloud') === datasourceType &&
                        item.datasourceName === datasourceName);
                })
            };
        });
    };

    DatasourceManagementView.prototype._handleDeleteClick = function (data) {
        const { datasourceName, datasourceType } = data;
        dim(() => {
            const deleteData = datasourceType === 'RDB' ?
                deleteDatasource(datasourceName) :
                deleteS3(datasourceName);
            return deleteData
                .then(() => {
                    this._delete(data);
                    this.datasourceTree.deleteById(data);
                    this.datasourceTree.setData(this.data);
                    this.datasourceDetail.render(null);
                });
        });
    };

    DatasourceManagementView.prototype._handleNewConnectionClick = function (e) {
        this.selected = null;

        const newData = e === 'cloud' ?
            {
                datasourceName: '',
                datasourceType: 'Cloud',
                accessKeyId: '',
                secretAccessKey: '',
                bucketName: ''
            } : {
                datasourceName: '',
                datasourceType: 'RDB',
                deploy: false,
                ip: '',
                port: '',
                userName: '',
                password: '',
                dbType: 'postgre',
                dbName: ''
            };
        this.datasourceDetail.render(newData);
        this.datasourceTree.select();
    };

    DatasourceManagementView.prototype._handleItemClick = function (data) {
        this.selected = data;
        this.datasourceDetail.render(data, true);
    };

    DatasourceManagementView.prototype.destroy = function () {
        if (this.datasourceTree) {
            this.datasourceTree.destroy();
            this.datasourceTree = null;
        }
    };

    Brightics.VA.Core.Views.DatasourceManagementView = DatasourceManagementView;
/* eslint-disable no-invalid-this */
}(this));
