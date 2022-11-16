/**
 * Created by daewon.park on 2016-09-21.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function InviteMemberDialog(parentId, options) {
        Brightics.VA.Dialogs.Dialog.call(this, parentId, options);
    }

    InviteMemberDialog.prototype = Object.create(Brightics.VA.Dialogs.Dialog.prototype);
    InviteMemberDialog.prototype.constructor = InviteMemberDialog;

    InviteMemberDialog.prototype._initOptions = function () {
        Brightics.VA.Dialogs.Dialog.prototype._initOptions.call(this);

        this.dialogOptions.width = 600;
        this.dialogOptions.height = 700;
        this.dialogOptions.maxWidth = 600;
        this.dialogOptions.maxHeight = 700;
        this.dialogOptions.create = function () {
            $('.ui-widget-content').css('border','none');
        }
    };

    InviteMemberDialog.prototype.createDialogContentsArea = function ($parent) {
        $parent.addClass('brtc-va-dialogs-invite-member-contents');

        $parent.append('' +
            '<input type="search" class="brtc-va-dialogs-invite-member-search">' +
            '<div class="brtc-va-dialogs-invite-member-search-user-label"><span>Total</span><span>0</span></div>' +
            '<div class="brtc-va-dialogs-invite-member-search-user-grid"></div>' +
            '<div class="brtc-va-dialogs-invite-member-register-member-authority"></div>' +
            '<div class="brtc-va-dialogs-invite-member-register-member-remove"></div>' +
            '<div class="brtc-va-dialogs-invite-member-register-member-label"><span>Total</span><span>0</span></div>' +
            '<div class="brtc-va-dialogs-invite-member-register-member-grid"></div>' +
            '');

        this.createSearchControl($parent);
        this.createUserGrid($parent);
        this.createAuthorityCombo($parent);
        this.createRemoveMemberButton($parent);
        this.createMemberGrid($parent);
    };

    InviteMemberDialog.prototype.updateUserCount = function () {
        if (this.$userGrid) {
            var rows = this.$userGrid.jqxGrid('getrows');
            this.$mainControl.find('.brtc-va-dialogs-invite-member-search-user-label > span:nth-child(2)').text(rows.length);
        }
    };

    InviteMemberDialog.prototype.updateMemberCount = function () {
        if (this.$memberGrid) {
            var rows = this.$memberGrid.jqxGrid('getrows');
            this.$mainControl.find('.brtc-va-dialogs-invite-member-register-member-label > span:nth-child(2)').text(rows.length);
        }
    };

    InviteMemberDialog.prototype.createSearchControl = function ($parent) {
        var _this = this;
        this.$searchControl = $parent.find('.brtc-va-dialogs-invite-member-search').jqxInput({
            placeHolder: Brightics.locale.common.searchForNameId,
            theme: Brightics.VA.Env.Theme
        });
        this.$searchControl.keypress(function (event) {
            if (event.keyCode == 13) {
                _this.searchUser(_this.$searchControl.val());
            }
        });
        this.$searchControl.focus();
    };

    InviteMemberDialog.prototype.searchUser = function (pattern) {
        var source = this._createUserGridSource();
        this.$userGrid.jqxGrid('source', source);
    };

    InviteMemberDialog.prototype._createUserGridSource = function () {
        var source = {
            datatype: 'json',
            datafields: [
                {name: 'name', type: 'string'},
                {name: 'id', type: 'string'}
            ]
        };
        if (this.$searchControl.val().trim()) {
            source.url = 'api/admin/v2/users?pattern=' + encodeURIComponent(this.$searchControl.val());
        } else {
            source.localdata = [];
        }
        return new $.jqx.dataAdapter(source);
    };

    InviteMemberDialog.prototype.createUserGrid = function ($parent) {
        var _this = this;

        $parent.find('.brtc-va-dialogs-invite-member-search-user-grid').on('bindingcomplete', function () {
            _this.updateUserCount();
        });

        var source = this._createUserGridSource();
        this.$userGrid = $parent.find('.brtc-va-dialogs-invite-member-search-user-grid').jqxGrid({
            theme: Brightics.VA.Env.Theme,
            source: source,
            width: '100%',
            rowsheight: 25,
            height: 'calc(50% - 80px)',
            altrows: false,
            filterable: false,
            sortable: false,
            columnsresize: true,
            enabletooltips: true,
            columns: [
                {
                    text: 'Name', datafield: 'name', width: 240,
                    cellsrenderer: function (row, column, value) {
                        return '<div class="jqx-grid-cell-left-align" style="margin-top: 4px;">' + Brightics.VA.Core.Utils.WidgetUtils.convertHTMLSpecialChar(value) + '</div>';
                    }
                },
                {text: 'ID', datafield: 'id'}
            ]
        });
        this.$userGrid.on('rowclick', function (event) {
            var item = _this.$authorityCombo.jqxDropDownList('getSelectedItem');
            var role_id = item.value;
            var role_label = item.label;

            var args = event.args;
            var user = _this.$userGrid.jqxGrid('getrowdata', args.rowindex);
            var member = {
                user_name: user.name,
                user_id: user.id,
                role_id: role_id,
                role_label: role_label
            };
            var isSelected = false,
                isInvitedAlready = false;


            var rows = _this.$memberGrid.jqxGrid('getrows');
            for (var i in rows) {
                if (rows[i].user_id == user.id) {
                    isSelected = true;
                }
            }

            for (var i in _this.options.members) {
                if (_this.options.members[i].user_id == user.id) {
                    isInvitedAlready = true;
                }
            }

            if (!isSelected) {
                if (isInvitedAlready) {
                    Brightics.VA.Core.Utils.WidgetUtils.openWarningDialog(user.id + ' is invited already.', function () {
                    });
                } else {
                    _this.$memberGrid.jqxGrid('addrow', null, member);
                    _this.updateMemberCount();
                }

            }
        });
    };

    InviteMemberDialog.prototype.createRemoveMemberButton = function ($parent) {
        var _this = this;
        $parent.find('.brtc-va-dialogs-invite-member-register-member-remove').click(function () {
            var uids = [];
            var indexes = _this.$memberGrid.jqxGrid('getselectedrowindexes');
            for (var i in indexes) {
                var row = _this.$memberGrid.jqxGrid('getrowdata', indexes[i]);
                uids.push(row.uid);
            }
            _this.$memberGrid.jqxGrid('deleterow', uids);
            _this.updateMemberCount();
        });
    };

    InviteMemberDialog.prototype.createMemberGrid = function ($parent) {
        var _this = this;

        $parent.find('.brtc-va-dialogs-invite-member-register-member-grid').on('bindingcomplete', function () {
            _this.updateMemberCount();
        });

        var source = {
            datatype: 'local',
            datafields: [
                {name: 'user_name', type: 'string'},
                {name: 'user_id', type: 'string'},
                {name: 'role_id', type: 'string'},
                {name: 'role_label', type: 'string'}
            ],
            localdata: [],
            addrow: function (rowid, rowdata, position, commit) {
                commit(true);
            },
            deleterow: function (rowid, commit) {
                commit(true);
            }
        };
        var dataAdapter = new $.jqx.dataAdapter(source);
        this.$memberGrid = $parent.find('.brtc-va-dialogs-invite-member-register-member-grid').jqxGrid({
            theme: Brightics.VA.Env.Theme,
            source: dataAdapter,
            width: '100%',
            height: 'calc(50% - 80px)',
            rowsheight: 25,
            altrows: false,
            filterable: false,
            sortable: false,
            columnsresize: true,
            selectionmode: 'multiplerowsextended',
            enabletooltips: true,
            columns: [
                {
                    text: 'Name', datafield: 'user_name', width: 240,
                    cellsrenderer: function (row, column, value) {
                        return '<div class="jqx-grid-cell-left-align" style="margin-top: 4px;">' + Brightics.VA.Core.Utils.WidgetUtils.convertHTMLSpecialChar(value) + '</div>';
                    }
                },
                {text: 'ID', datafield: 'user_id', width: 240},
                {text: 'Authority', datafield: 'role_label'}
            ]
        });
    };

    InviteMemberDialog.prototype.createAuthorityCombo = function ($parent) {
        this.$authorityCombo = $parent.find('.brtc-va-dialogs-invite-member-register-member-authority').jqxDropDownList({
            theme: Brightics.VA.Env.Theme,
            autoDropDownHeight: true,
            source: [
                {id: 'role_10002', label: 'as Organizer'},
                {id: 'role_10003', label: 'as Member'},
                {id: 'role_10004', label: 'as Reporter'}
            ],
            displayMember: 'label',
            valueMember: 'id',
            itemHeight: 29,
            dropDownWidth: 118,
            selectedIndex: 1
        });
    };

    InviteMemberDialog.prototype.handleOkClicked = function () {
        var _this = this;
        var rows = this.$memberGrid.jqxGrid('getrows');
        if (rows.length == 0) {
            Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('At least one member must be selected.');
        } else {
            var options = {
                members: []
            };
            for (var i in rows) {
                var member = rows[i];
                options.members.push({
                    user_id: member.user_id,
                    role_id: member.role_id
                });
            }
            var opt = {
                url: 'api/va/v2/ws/projects/' + _this.options.projectId + '/members/invite',
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                blocking: true,
                data: JSON.stringify(options)
            };
            $.ajax(opt).done(function (result) {
                Brightics.VA.Core.Utils.WidgetUtils.openInformationDialog('Invited ' + result + ' members.', function () {
                    Brightics.VA.Dialogs.Dialog.prototype.handleOkClicked.call(_this);
                });
            }).fail(function (error) {
                Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(error);
            });
        }
    };

    Brightics.VA.Core.Dialogs.InviteMemberDialog = InviteMemberDialog;

}).call(this);