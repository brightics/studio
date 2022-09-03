/**
 * Created by hs79.shin on 2016-10-07.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function SetPropertiesDialog(parentId, options) {
        this.parentId = parentId;
        this.options = options;
        this.dialogResult = {
            OK: false,
            Cancel: true
        };
        this.retrieveParent();
        this.createControls();
        this.initContents();
    }

    SetPropertiesDialog.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    SetPropertiesDialog.prototype.createControls = function () {
        this.$mainControl = $('' +
            '<div class="brtc-va-dialogs-main">' +
            // '   <div class="brtc-va-dialogs-header">Set Properties</div>' +
            '   <div class="brtc-va-dialogs-body">' +
            '       <div class="brtc-va-dialogs-contents">' +
            '       </div>' +
            '       <div class="brtc-va-dialogs-buttonbar">' +
            '           <input type="button" class="brtc-va-dialogs-buttonbar-ok" value="OK" />' +
            '           <input type="button" class="brtc-va-dialogs-buttonbar-cancel" value="Cancel" />' +
            '       </div>' +
            '   </div>' +
            '</div>');
        this.$parent.append(this.$mainControl);

        this.$okButton = this.$mainControl.find('.brtc-va-dialogs-buttonbar-ok');
        this.$cancelButton = this.$mainControl.find('.brtc-va-dialogs-buttonbar-cancel');

        var _this = this;

        var jqxOpt = {
            theme: Brightics.VA.Env.Theme,
            title: 'Set Properties',
            width: 1024,
            height: 600,
            maxWidth: 1024,
            maxHeight: 600,
            modal: true,
            resizable: false,
            close: function () {
                if (typeof _this.options.close == 'function') {
                    _this.options.close(_this.dialogResult);
                }
            }
        };
        this.$mainControl.dialog(jqxOpt);
    };

    SetPropertiesDialog.prototype.initContents = function () {
        var _this = this;
        _this.createDialogContentsArea(_this.$mainControl.find('.brtc-va-dialogs-contents'));

        _this.$okButton.jqxButton({
            theme: Brightics.VA.Env.Theme
        });
        _this.$okButton.click(_this.performFinish.bind(_this));
        _this.$cancelButton.jqxButton({
            theme: Brightics.VA.Env.Theme
        });
    };


    SetPropertiesDialog.prototype.createDialogContentsArea = function ($parent) {
        var _this = this;

        this.$columnGrid = $('<div class="brtc-va-dialog-spreadsheet style="width:98%; height:95%;"></div>');
        $parent.append(this.$columnGrid);

        var cellbeginedit = function (row, datafield, columntype, value) {
            var isBoolean = false;
            var selectedIndexes = _this.$columnGrid.jqxGrid('getselectedrowindexes');
            if (selectedIndexes.length > 0 && datafield != 'column') {
                for (var i in selectedIndexes) {
                    if (row == selectedIndexes[i]) {
                        isBoolean = true;
                    }
                }
            }
            return isBoolean;
        }

        this.$columnGrid.jqxGrid({
            theme: Brightics.VA.Env.Theme,
            width: 'calc(100% - 2px)',
            height: '99%',
            rowsheight: 25,
            filterable: false,
            showfiltercolumnbackground: false,
            showfiltermenuitems: true,
            autoshowfiltericon: true,
            altrows: false,
            sortable: true,
            editable: true,
            showsortcolumnbackground: false,
            columnsresize: true,
            selectionmode: 'checkbox',
            columns: [{
                text: 'Column',
                datafield: 'column',
                width: '80',
                cellbeginedit: cellbeginedit
            }, {
                text: 'analyzer',
                datafield: 'analyzer',
                width: '80',
                cellbeginedit: cellbeginedit,
                columntype: 'textbox'
            }, {
                text: 'boost',
                datafield: 'boost',
                width: '80',
                cellbeginedit: cellbeginedit,
                columntype: 'numberinput',
                cellsalign: 'right',
                initeditor: function (row, cellvalue, editor) {
                    editor.jqxNumberInput({decimalDigits: 0});
                }
            }, {
                text: 'coerce',
                datafield: 'coerce',
                width: '80',
                cellbeginedit: cellbeginedit,
                columntype: 'dropdownlist',
                initeditor: function (row, cellvalue, editor, celltext, cellwidth, cellheight) {
                    var isBoolean = ['', 'True', 'False'];
                    editor.jqxDropDownList({source: isBoolean});
                }
            }, {
                text: 'copyto',
                datafield: 'copyto',
                width: '80',
                cellbeginedit: cellbeginedit
            }, {
                text: 'docvalues',
                datafield: 'docvalues',
                width: '80',
                cellbeginedit: cellbeginedit,
                columntype: 'dropdownlist',
                initeditor: function (row, cellvalue, editor, celltext, cellwidth, cellheight) {
                    var isBoolean = ['', 'True', 'False'];
                    editor.jqxDropDownList({source: isBoolean});
                }
            }, {
                text: 'dynamic',
                datafield: 'dynamic',
                width: '80',
                columntype: 'dropdownlist',
                cellbeginedit: cellbeginedit,
                initeditor: function (row, cellvalue, editor, celltext, cellwidth, cellheight) {
                    var isBoolean = ['', 'True', 'False'];
                    editor.jqxDropDownList({source: isBoolean});
                }
            }, {
                text: 'enabled',
                datafield: 'enabled',
                width: '80',
                cellbeginedit: cellbeginedit,
                columntype: 'dropdownlist',
                initeditor: function (row, cellvalue, editor, celltext, cellwidth, cellheight) {
                    var isBoolean = ['', 'True', 'False'];
                    editor.jqxDropDownList({source: isBoolean});
                }
            }, {
                text: 'fielddata',
                datafield: 'fielddata',
                width: '80',
                cellbeginedit: cellbeginedit
            }, {
                text: 'format',
                datafield: 'format',
                width: '80',
                cellbeginedit: cellbeginedit
            }, {
                text: 'geohash',
                datafield: 'geohash',
                width: '80',
                cellbeginedit: cellbeginedit,
                columntype: 'dropdownlist',
                initeditor: function (row, cellvalue, editor, celltext, cellwidth, cellheight) {
                    var isBoolean = ['', 'True', 'False'];
                    editor.jqxDropDownList({source: isBoolean});
                }
            }, {
                text: 'geohashPrefix',
                datafield: 'geohashprefix',
                width: '100',
                columntype: 'dropdownlist',
                cellbeginedit: cellbeginedit,
                initeditor: function (row, cellvalue, editor, celltext, cellwidth, cellheight) {
                    var isBoolean = ['', 'True', 'False'];
                    editor.jqxDropDownList({source: isBoolean});
                }
            }, {
                text: 'geohashPrecision',
                datafield: 'geohashprecision',
                width: '100',
                cellbeginedit: cellbeginedit,
                columntype: 'numberinput',
                cellsalign: 'right',
                initeditor: function (row, cellvalue, editor) {
                    editor.jqxNumberInput({decimalDigits: 0});
                }
            }, {
                text: 'ignoreAbove',
                datafield: 'ignoreabove',
                width: '80',
                cellbeginedit: cellbeginedit,
                columntype: 'numberinput',
                cellsalign: 'right',
                initeditor: function (row, cellvalue, editor) {
                    editor.jqxNumberInput({decimalDigits: 0});
                }
            }, {
                ext: 'ignoreMalformed',
                datafield: 'ignoremalformed',
                width: '100',
                cellbeginedit: cellbeginedit,
                columntype: 'dropdownlist',
                initeditor: function (row, cellvalue, editor, celltext, cellwidth, cellheight) {
                    var isBoolean = ['', 'True', 'False'];
                    editor.jqxDropDownList({source: isBoolean});
                }
            }, {
                text: 'includeInAll',
                datafield: 'includeinall',
                width: '80',
                cellbeginedit: cellbeginedit,
                columntype: 'dropdownlist',
                initeditor: function (row, cellvalue, editor, celltext, cellwidth, cellheight) {
                    var isBoolean = ['', 'True', 'False'];
                    editor.jqxDropDownList({source: isBoolean});
                }
            }, {
                text: 'index',
                datafield: 'index',
                width: '80',
                cellbeginedit: cellbeginedit,
                columntype: 'dropdownlist',
                initeditor: function (row, cellvalue, editor, celltext, cellwidth, cellheight) {
                    var dropdownList = ['', 'no', 'not_analyzed', 'analyzed'];
                    editor.jqxDropDownList({source: dropdownList});
                }
            }, {
                text: 'indexOptions',
                datafield: 'indexoptions',
                width: '80',
                cellbeginedit: cellbeginedit,
                columntype: 'dropdownlist',
                initeditor: function (row, cellvalue, editor, celltext, cellwidth, cellheight) {
                    var dropdownList = ['', 'docs', 'freqs', 'positions', 'offsets'];
                    editor.jqxDropDownList({source: dropdownList});
                }
            }, {
                text: 'latLon',
                datafield: 'latlon',
                width: '80',
                cellbeginedit: cellbeginedit,
                columntype: 'dropdownlist',
                initeditor: function (row, cellvalue, editor, celltext, cellwidth, cellheight) {
                    var isBoolean = ['', 'True', 'False'];
                    editor.jqxDropDownList({source: isBoolean});
                }
            }, {
                text: 'fields',
                datafield: 'fields',
                width: '80',
                cellbeginedit: cellbeginedit
            }, {
                text: 'normsEnabled',
                datafield: 'normsenabled',
                width: '100',
                cellbeginedit: cellbeginedit,
                columntype: 'dropdownlist',
                initeditor: function (row, cellvalue, editor, celltext, cellwidth, cellheight) {
                    var isBoolean = ['', 'True', 'False'];
                    editor.jqxDropDownList({source: isBoolean});
                }
            }, {
                text: 'normsLoading',
                datafield: 'normsloading',
                width: '100'
            }, {
                text: 'nullValue',
                datafield: 'nullvalue',
                width: '80',
                cellbeginedit: cellbeginedit
            }, {
                text: 'positionIncrementGap',
                datafield: 'positionincrementgap',
                width: '130',
                cellbeginedit: cellbeginedit,
                columntype: 'numberinput',
                cellsalign: 'right',
                initeditor: function (row, cellvalue, editor) {
                    editor.jqxNumberInput({decimalDigits: 0});
                }
            }, {
                text: 'properties',
                datafield: 'properties',
                width: '80',
                cellbeginedit: cellbeginedit
            }, {
                text: 'searchanalyzer',
                datafield: 'searchanalyzer',
                width: '100',
                cellbeginedit: cellbeginedit
            }, {
                text: 'similarity',
                datafield: 'similarity',
                width: '80',
                cellbeginedit: cellbeginedit,
                columntype: 'dropdownlist',
                initeditor: function (row, cellvalue, editor, celltext, cellwidth, cellheight) {
                    var isBoolean = ['', 'TF', 'IDF', 'BM25'];
                    editor.jqxDropDownList({source: isBoolean});
                }
            }, {
                text: 'store',
                datafield: 'store',
                width: '80',
                cellbeginedit: cellbeginedit,
                columntype: 'dropdownlist',
                initeditor: function (row, cellvalue, editor, celltext, cellwidth, cellheight) {
                    var isBoolean = ['', 'True', 'False'];
                    editor.jqxDropDownList({source: isBoolean});
                }
            }, {
                text: 'termvector',
                datafield: 'termvector',
                width: '80',
                cellbeginedit: cellbeginedit,
                columntype: 'dropdownlist',
                initeditor: function (row, cellvalue, editor, celltext, cellwidth, cellheight) {
                    var dropdownList = ['', 'no', 'yes', 'with_positions', 'with_offsets', 'with_positions_offsets'];
                    editor.jqxDropDownList({source: dropdownList});
                }
            }]
        });

        var columnsData = [];
        for (var i in this.options.columns) {
            var column = {};
            column.column = this.options.columns[i].name;

            for (var j in this.options.fnUnit.param['properties-colums']) {
                if (this.options.columns[i].name == this.options.fnUnit.param['properties-colums'][j]) {
                    column.analyzer = this.options.fnUnit.param['properties-analyzer'][j];
                    column.boost = this.options.fnUnit.param['properties-boost'][j];
                    column.coerce = this.options.fnUnit.param['properties-coerce'][j];
                    column.copyto = this.options.fnUnit.param['properties-copy-to'][j];
                    column.docvalues = this.options.fnUnit.param['properties-doc-values'][j];
                    column.dynamic = this.options.fnUnit.param['properties-dynamic'][j];
                    column.enabled = this.options.fnUnit.param['properties-enabled'][j];
                    column.fielddata = this.options.fnUnit.param['properties-fielddata'][j];
                    column.format = this.options.fnUnit.param['properties-format'][j];
                    column.geohash = this.options.fnUnit.param['properties-geohash'][j];
                    column.geohashprefix = this.options.fnUnit.param['properties-geohash-prefix'][j];
                    column.geohashprecision = this.options.fnUnit.param['properties-geohash-precision'][j];
                    column.ignoreabove = this.options.fnUnit.param['properties-ignore-above'][j];
                    column.ignoremalformed = this.options.fnUnit.param['properties-ignore-malformed'][j];
                    column.includeinall = this.options.fnUnit.param['properties-include-in-all'][j];
                    column.index = this.options.fnUnit.param['properties-index'][j];
                    column.indexoptions = this.options.fnUnit.param['properties-index-options'][j];
                    column.latlon = this.options.fnUnit.param['properties-lat-lon'][j];
                    column.fields = this.options.fnUnit.param['properties-fields'][j];
                    column.normsenabled = this.options.fnUnit.param['properties-norms-enabled'][j];
                    column.normsloading = this.options.fnUnit.param['properties-norms-loading'][j];
                    column.nullvalue = this.options.fnUnit.param['properties-null-value'][j];
                    column.positionincrementgap = this.options.fnUnit.param['properties-position-increment-gap'][j];
                    column.properties = this.options.fnUnit.param['properties-properties'][j];
                    column.searchanalyzer = this.options.fnUnit.param['properties-search-analyzer'][j];
                    column.similarity = this.options.fnUnit.param['properties-similarity'][j];
                    column.store = this.options.fnUnit.param['properties-store'][j];
                    column.termvector = this.options.fnUnit.param['properties-term-vector'][j];

                    _this.$columnGrid.jqxGrid('selectrow', parseInt(i));
                }
            }
            columnsData.push(column);
        }

        var source = {
            localdata: columnsData,
            datafields: [{
                name: 'column',
                type: 'string'
            }, {
                name: 'analyzer',
                type: 'string'
            }, {
                name: 'boost',
                type: 'string'
            }, {
                name: 'coerce',
                type: 'string'
            }, {
                name: 'copyto',
                type: 'string'
            }, {
                name: 'docvalues',
                type: 'string'
            }, {
                name: 'dynamic',
                type: 'string'
            }, {
                name: 'enabled',
                type: 'string'
            }, {
                name: 'fielddata',
                type: 'string'
            }, {
                name: 'format',
                type: 'string'
            }, {
                name: 'geohash',
                type: 'string'
            }, {
                name: 'geohashprefix',
                type: 'string'
            }, {
                name: 'geohashprecision',
                type: 'string'
            }, {
                name: 'ignoreabove',
                type: 'string'
            }, {
                name: 'ignoreMalformed',
                type: 'string'
            }, {
                name: 'includeinall',
                type: 'string'
            }, {
                name: 'index',
                type: 'string'
            }, {
                name: 'indexoptions',
                type: 'string'
            }, {
                name: 'latlon',
                type: 'string'
            }, {
                name: 'fields',
                type: 'string'
            }, {
                name: 'normsenabled',
                type: 'string'
            }, {
                name: 'normsloading',
                type: 'string'
            }, {
                name: 'nullvalue',
                type: 'string'
            }, {
                name: 'positionincrementgap',
                type: 'string'
            }, {
                name: 'properties',
                type: 'string'
            }, {
                name: 'searchanalyzer',
                type: 'string'
            }, {
                name: 'similarity',
                type: 'string'
            }, {
                name: 'store',
                type: 'string'
            }],
            datatype: "array"
        };

        var adapter = new $.jqx.dataAdapter(source);
        _this.$columnGrid.jqxGrid('source', adapter);
    };

    SetPropertiesDialog.prototype.performFinish = function () {
        var _this = this;

        var commandOption = {
            fnUnit: this.options.fnUnit,
            ref: {param: {}}
        };

        var selectedIndexes = _this.$columnGrid.jqxGrid('getselectedrowindexes');

        commandOption.ref.param['properties-colums'] = [];
        commandOption.ref.param['properties-analyzer'] = [];
        commandOption.ref.param['properties-boost'] = [];
        commandOption.ref.param['properties-coerce'] = [];
        commandOption.ref.param['properties-copy-to'] = [];
        commandOption.ref.param['properties-doc-values'] = [];
        commandOption.ref.param['properties-dynamic'] = [];
        commandOption.ref.param['properties-enabled'] = [];
        commandOption.ref.param['properties-fielddata'] = [];
        commandOption.ref.param['properties-format'] = [];
        commandOption.ref.param['properties-geohash'] = [];
        commandOption.ref.param['properties-geohash-prefix'] = [];
        commandOption.ref.param['properties-geohash-precision'] = [];
        commandOption.ref.param['properties-ignore-above'] = [];
        commandOption.ref.param['properties-ignore-malformed'] = [];
        commandOption.ref.param['properties-include-in-all'] = [];
        commandOption.ref.param['properties-index'] = [];
        commandOption.ref.param['properties-index-options'] = [];
        commandOption.ref.param['properties-lat-lon'] = [];
        commandOption.ref.param['properties-fields'] = [];
        commandOption.ref.param['properties-norms-enabled'] = [];
        commandOption.ref.param['properties-norms-loading'] = [];
        commandOption.ref.param['properties-null-value'] = [];
        commandOption.ref.param['properties-position-increment-gap'] = [];
        commandOption.ref.param['properties-properties'] = [];
        commandOption.ref.param['properties-search-analyzer'] = [];
        commandOption.ref.param['properties-similarity'] = [];
        commandOption.ref.param['properties-store'] = [];
        commandOption.ref.param['properties-term-vector'] = [];

        for (var i in selectedIndexes) {
            var data = _this.$columnGrid.jqxGrid('getrowdata', selectedIndexes[i])
            commandOption.ref.param['properties-colums'].push(data.column);
            if (data.analyzer) {
                commandOption.ref.param['properties-analyzer'].push(data.analyzer);
            } else {
                commandOption.ref.param['properties-analyzer'].push('');
            }
//
            if (data.boost) {
                commandOption.ref.param['properties-boost'].push(data.boost);
            } else {
                commandOption.ref.param['properties-boost'].push('');
            }

            if (data.coerce) {
                commandOption.ref.param['properties-coerce'].push(data.coerce);
            } else {
                commandOption.ref.param['properties-coerce'].push('');
            }

            if (data.copyto) {
                commandOption.ref.param['properties-copy-to'].push(data.copyto);
            } else {
                commandOption.ref.param['properties-copy-to'].push('');
            }

            if (data.docvalues) {
                commandOption.ref.param['properties-doc-values'].push(data.docvalues);
            } else {
                commandOption.ref.param['properties-doc-values'].push('');
            }

            if (data.dynamic) {
                commandOption.ref.param['properties-dynamic'].push(data.dynamic);
            } else {
                commandOption.ref.param['properties-dynamic'].push('');
            }

            if (data.enabled) {
                commandOption.ref.param['properties-enabled'].push(data.enabled);
            } else {
                commandOption.ref.param['properties-enabled'].push('');
            }

            if (data.fielddata) {
                commandOption.ref.param['properties-fielddata'].push(data.fielddata);
            } else {
                commandOption.ref.param['properties-fielddata'].push('');
            }

            if (data.format) {
                commandOption.ref.param['properties-format'].push(data.format);
            } else {
                commandOption.ref.param['properties-format'].push('');
            }

            if (data.geohash) {
                commandOption.ref.param['properties-geohash'].push(data.geohash);
            } else {
                commandOption.ref.param['properties-geohash'].push('');
            }

            if (data.geohashprefix) {
                commandOption.ref.param['properties-geohash-prefix'].push(data.geohashprefix);
            } else {
                commandOption.ref.param['properties-geohash-prefix'].push('');
            }

            if (data.geohashprecision) {
                commandOption.ref.param['properties-geohash-precision'].push(data.geohashprecision);
            } else {
                commandOption.ref.param['properties-geohash-precision'].push('');
            }

            if (data.ignoreabove) {
                commandOption.ref.param['properties-ignore-above'].push(data.ignoreabove);
            } else {
                commandOption.ref.param['properties-ignore-above'].push('');
            }

            if (data.ignoremalformed) {
                commandOption.ref.param['properties-ignore-malformed'].push(data.ignoremalformed);
            } else {
                commandOption.ref.param['properties-ignore-malformed'].push('');
            }

            if (data.includeinall) {
                commandOption.ref.param['properties-include-in-all'].push(data.includeinall);
            } else {
                commandOption.ref.param['properties-include-in-all'].push('');
            }

            if (data.index) {
                commandOption.ref.param['properties-index'].push(data.index);
            } else {
                commandOption.ref.param['properties-index'].push('');
            }

            if (data.indexoptions) {
                commandOption.ref.param['properties-index-options'].push(data.indexoptions);
            } else {
                commandOption.ref.param['properties-index-options'].push('');
            }

            if (data.latlon) {
                commandOption.ref.param['properties-lat-lon'].push(data.latlon);
            } else {
                commandOption.ref.param['properties-lat-lon'].push('');
            }

            if (data.fields) {
                commandOption.ref.param['properties-fields'].push(data.fields);
            } else {
                commandOption.ref.param['properties-fields'].push('');
            }

            if (data.normsenabled) {
                commandOption.ref.param['properties-norms-enabled'].push(data.normsenabled);
            } else {
                commandOption.ref.param['properties-norms-enabled'].push('');
            }

            if (data.normsloading) {
                commandOption.ref.param['properties-norms-loading'].push(data.normsloading);
            } else {
                commandOption.ref.param['properties-norms-loading'].push('');
            }

            if (data.nullvalue) {
                commandOption.ref.param['properties-null-value'].push(data.nullvalue);
            } else {
                commandOption.ref.param['properties-null-value'].push('');
            }

            if (data.positionincrementgap) {
                commandOption.ref.param['properties-position-increment-gap'].push(data.positionincrementgap);
            } else {
                commandOption.ref.param['properties-position-increment-gap'].push('');
            }

            if (data.properties) {
                commandOption.ref.param['properties-properties'].push(data.properties);
            } else {
                commandOption.ref.param['properties-properties'].push('');
            }

            if (data.searchanalyzer) {
                commandOption.ref.param['properties-search-analyzer'].push(data.searchanalyzer);
            } else {
                commandOption.ref.param['properties-search-analyzer'].push('');
            }

            if (data.similarity) {
                commandOption.ref.param['properties-similarity'].push(data.similarity);
            } else {
                commandOption.ref.param['properties-similarity'].push('');
            }

            if (data.store) {
                commandOption.ref.param['properties-store'].push(data.store);
            } else {
                commandOption.ref.param['properties-store'].push('');
            }

            if (data.termvector) {
                commandOption.ref.param['properties-term-vector'].push(data.termvector);
            } else {
                commandOption.ref.param['properties-term-vector'].push('');
            }
        }

        var command = new Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitParameterValueCommand(this, commandOption);

        _this.dialogResult = {
            OK: true,
            Cancel: false,
            command: command
        };
        _this.$mainControl.dialog('close');
    };

    Brightics.VA.Core.Dialogs.SetPropertiesDialog = SetPropertiesDialog;

}).call(this);