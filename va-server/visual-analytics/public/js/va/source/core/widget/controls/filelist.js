/**
 * Created by ty0314.kim on 2016-01-27.
 */

(function () {
    "use strict";

    var root = this;
    var Brightics = root.Brightics;

    function FileList(parentId, options) {
        this.parentId = parentId;

        this.defaultOptions = {
            multiple: true,
            fileType: ['json']
        };

        this.options = $.extend(true, this.defaultOptions, options);
        this.files = {};

        this.retrieveParent();
        this.createControls();
    }

    FileList.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    FileList.prototype.createControls = function () {
        var _this = this;

        this.$mainControl = $('' +
            '<div class="brtc-va-widget-controls-fileList">' +
            '   <div class="brtc-va-widget-controls-fileList-toolbar"></div>' +
            '   <div class="brtc-va-widget-controls-fileList-list-wrapper">' +
            '       <div class="brtc-va-widget-controls-fileList-list"></div>' +
            '   </div>' +
            '</div>' +
            '');

        this.$toolbarArea = this.$mainControl.find('.brtc-va-widget-controls-fileList-toolbar');
        this.$listArea = this.$mainControl.find('.brtc-va-widget-controls-fileList-list');
        this.$mainControl.find('.brtc-va-widget-controls-fileList-list-wrapper').perfectScrollbar();

        this.$parent.append(this.$mainControl);

        this.renderToolbarArea(this.$toolbarArea);
        this.renderListArea(this.$listArea);
    };

    FileList.prototype.renderToolbarArea = function ($parent) {
        this.createSumArea($parent);
        this.createDeleteFileButton($parent);
        this.createSelectFileButton($parent);
    };

    FileList.prototype.renderListArea = function ($parent) {
        var _this = this;
        $parent.append($('<div class="brtc-va-dialogs-publish-management-grid"></div>'));

        var source = {
            localdata: [],
            datafields: [
                {name: 'name', type: 'string'},
                {name: 'size', type: 'string'},
                {name: 'lastModifiedDate', type: 'date'},
                {name: 'lastModified', type: 'timestamp'},
                {name: 'type', type: 'string'},
                {name: 'webkitRelativePath', type: 'string'},
                {name: 'fileKey', type: 'string'}
            ],
            datatype: "json"
        };

        var adapter = new $.jqx.dataAdapter(source);

        this.$fileListGrid = $parent.find('.brtc-va-dialogs-publish-management-grid').jqxGrid({
            theme: Brightics.VA.Env.Theme,
            width: '100%',
            height: 'calc(100% - 45px)',
            altrows: false,
            filterable: false,
            source: adapter,
            sortable: false,
            columnsresize: true,
            selectionmode: 'checkbox',
            showfiltercolumnbackground: false,
            rowsheight: 53,
            columns: [
                {
                    text: Brightics.locale.common.name,
                    datafield: 'name',
                    align: 'center',
                    cellclassname: 'brtc-grid-cell',
                    cellsrenderer: _this.renderer,
                    renderer: _this.gridV2Renderer,
                    width: '50%'
                },
                {
                    text: Brightics.locale.common.size,
                    datafield: 'size',
                    align: 'center',
                    cellclassname: 'brtc-grid-cell',
                    cellsrenderer: _this.fileSizeRenderer,
                    renderer: _this.gridV2Renderer,
                    width: 80
                },
                {
                    text: Brightics.locale.common.lastModifiedDate,
                    datafield: 'lastModifiedDate',
                    align: 'center',
                    cellclassname: 'brtc-grid-cell',
                    renderer: _this.gridV2Renderer,
                    cellsalign: 'center',
                    cellsformat: 'yyyy-MM-dd h:mm:ss'
                },
                {
                    text: 'fileKey',
                    datafield: 'fileKey',
                    hidden: true
                },
                {
                    text: 'lastModified',
                    datafield: 'lastModified',
                    hidden: true
                },
                {
                    text: 'type',
                    datafield: 'type',
                    hidden: true
                },
                {
                    text: 'webkitRelativePath',
                    datafield: 'webkitRelativePath',
                    hidden: true
                }
            ]
        });

        this.setGridStyleV2(this.$fileListGrid);

        var selectCallback = function () {
            var selectedIndexes = _this.$fileListGrid.jqxGrid('getselectedrowindexes');
            if (selectedIndexes.length > 0) {
                _this.$deleteButton.jqxButton({disabled: false});
                _this.$deleteButton.css('cursor', 'pointer');
            } else {
                _this.$deleteButton.jqxButton({disabled: true});
                _this.$deleteButton.css('cursor', 'default');
            }
        };

        this.$fileListGrid.on('rowselect', selectCallback.bind(_this));
        this.$fileListGrid.on('rowunselect', selectCallback.bind(_this));
    };

    FileList.prototype.fileSizeRenderer = function (row, column, value) {
        var styleText = '' +
            'float: right;' +
            'height:53px;' +
            'line-height:53px;' +
            'text-overflow: ellipsis;' +
            'white-space: nowrap;' +
            'overflow: hidden;' +
            'width: calc(100% - 15px); ';

        var size = '1.00 KB';
        if (value > 1024) size = Brightics.VA.Core.Utils.CommonUtils.byteCalculation(value);

        return '<div index="'+ row +'" style="'+ styleText +'">'+ size +'</div>';
    };

    FileList.prototype.renderer = function (row, column, value, tag, options, rowData) {
        var _this = this;

        var titleText = '';
        var styleText = '' +
            'float: left;' +
            'margin-left: 15px;' +
            'height:53px;' +
            'line-height:53px;' +
            'text-overflow: ellipsis;' +
            'white-space: nowrap;' +
            'overflow: hidden;' +
            'width: calc(100% - 15px); ';

        if (rowData.errorMessage)  {
            styleText += 'color:red;';
            titleText = rowData.errorMessage;
        } else {
            titleText = value;
        }

        return '<div title="'+ titleText +'" fileKey="'+ rowData.fileKey +'" index="'+ row +'" style="'+ styleText +'">'+ value +'</div>';
    };

    FileList.prototype.gridV2Renderer = function (value) {
        return '<div style="opacity:0.8; font-family: Arial; font-size: 16px; font-weight: bold; text-align: center; color: rgba(0, 0, 0, 0.8);">' + value + '</div>';
    };

    FileList.prototype.setGridStyleV2 = function ($grid) {
        $grid.addClass('GridStyleV2');

        $grid.css({
            'height': 'calc(100% - 35px) !important',
            'margin-top': '15px !important',
            'margin-bottom': '20px !important'
        });

        this.$mainControl.find('input[type=button]').width(100);
    };

    FileList.prototype.createSumArea = function ($parent) {
        this.$sumArea = $('' +
            '<div class="brtc-va-widget-controls-fileList-toolbar-sum">' +
            '   <span>' + Brightics.locale.project.total + '<strong class="brtc-va-widget-controls-fileList-toolbar-sum-count">0</strong></span>' +
            '</div>');
        $parent.append(this.$sumArea);
    };

    FileList.prototype.createSelectFileButton = function ($parent) {
        var _this = this;

        var $selectFileButtonWrapper = $('' +
            '<div class="brtc-va-widget-controls-fileList-toolbar-selectfile">' +
            '   <input for="brtc-va-widget-controls-fileList-toolbar-selectfile-button" type="button" id="fileselect-local" value="' + Brightics.locale.common.selectFile + '" />' +
            '   <input type="file" id="brtc-va-widget-controls-fileList-toolbar-selectfile-file" name="fileToUpload" accept=".json">' +
            '</div>');

        $parent.append($selectFileButtonWrapper);

        var $btnLocal = $selectFileButtonWrapper.find('#fileselect-local');
        var $fileSelect = $selectFileButtonWrapper.find('#brtc-va-widget-controls-fileList-toolbar-selectfile-file');

        if (this.options.multiple) $fileSelect.attr('multiple', true);
        $fileSelect.hide();

        $btnLocal.jqxButton({
            theme: Brightics.VA.Env.Theme
        });

        $btnLocal.on('click', function () {
            $fileSelect.click();
        });

        $fileSelect.on('input', function (event) {
            var files = $(this)[0].files;

            if (_this.isJsonFile(files)) {
                var keyFiles = _this.addFileKey(files);
                var omitted = _this.renderFiles(keyFiles);
                _this.$parent.trigger('addFile', [keyFiles, omitted]);
            } else {
                Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('.json file can be imported only');
            }
            $fileSelect.val(null);
        });
    };

    FileList.prototype.setTotalCount = function () {
        this.$sumArea.find('.brtc-va-widget-controls-fileList-toolbar-sum-count').text(this.$fileListGrid.jqxGrid('getRows').length);
    };

    FileList.prototype.addFileKey = function (files) {
        var newFiles = {};

        for (var i=0; i<files.length; i++) {
            var fileKey = Brightics.VA.Core.Utils.IDGenerator.importedFile.id();
            newFiles[fileKey] = files[i];
        }
        return newFiles;
    };

    FileList.prototype.createDeleteFileButton = function ($parent) {
        var _this = this;

        var $deleteFileButtonWrapper = $('' +
            '<div class="brtc-va-widget-controls-fileList-toolbar-deletefile">' +
            '   <input class="brtc-va-widget-controls-fileList-toolbar-deletefile-button" type="button" value="'+ Brightics.locale.common.deleteFile+'" />' +
            '</div>');

        $parent.append($deleteFileButtonWrapper);

        this.$deleteButton = $deleteFileButtonWrapper.find('.brtc-va-widget-controls-fileList-toolbar-deletefile-button');

        this.$deleteButton.jqxButton({
            theme: Brightics.VA.Env.Theme,
            disabled: true
        });

        this.$deleteButton.on('click', function () {
            var removedFileKeys = [];

            var selectedIndexes = _this.$fileListGrid.jqxGrid('getselectedrowindexes').sort(function (a, b) {
                return a - b;
            });

            for (var i=selectedIndexes.length-1; i>=0; i--) {
                var data = _this.$fileListGrid.jqxGrid('getrowdata', selectedIndexes[i]);

                removedFileKeys.push(data.fileKey);
                delete _this.files[data.fileKey];

                var id = _this.$fileListGrid.jqxGrid('getrowid', selectedIndexes[i]);
                _this.$fileListGrid.jqxGrid('deleterow', id);

            }
            _this.$parent.trigger('removeFile', [removedFileKeys]);

            _this.setTotalCount();

            _this.$deleteButton.jqxButton({disabled: true});
        });
    };

    FileList.prototype.makeGridSource = function (fileKey, file) {
        var gridSources = [];

        var addedFile = $.extend(true, {}, file);

        addedFile.fileKey = fileKey;
        this.files[fileKey] = addedFile;
        gridSources.push(addedFile);

        return gridSources;
    };

    FileList.prototype.equal = function (file1, file2) {
        return file1.name === file2.name &&
            file1.size === file2.size &&
            file1.lastModified === file2.lastModified;
    };

    FileList.prototype.renderFiles = function (files) {
        var omitted = {};
        for (var key in files) {
            var duplicated = false;
            for (var f in this.files) {
                if (this.equal(this.files[f], files[key])) {
                    omitted[key] = true;
                    duplicated = true;
                    break;
                }
            }
            if (!duplicated) {
                this.$fileListGrid.jqxGrid('addrow', null, this.makeGridSource(key, files[key]));
            }
        }

        this.setTotalCount();
        return omitted;
    };

    FileList.prototype.isJsonFile = function (files) {
        for (var i=0; i<files.length; i++) {
            var fileNameArr = files[i].name.split('.');
            if (this.options.fileType.indexOf(fileNameArr[fileNameArr.length - 1]) < 0) {
                return false;
            }
        }
        return true;
    };

    FileList.prototype.getFiles = function () {
        return this.files;
    };

    FileList.prototype.setDisableFile = function (key, message) {
        var rowId = -1;
        var rows = this.$fileListGrid.jqxGrid('getRows');
        var newRow;

        for (var i in rows) {
            if (rows[i].fileKey === key) {
                rowId = i;
                newRow = rows[i];
                newRow.errorMessage = message;
                break;
            }
        }

        this.$fileListGrid.jqxGrid('updaterow', rowId, newRow);
    };

    Brightics.VA.Core.Widget.Controls.FileList = FileList;

}).call(this);
