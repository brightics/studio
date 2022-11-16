/**
 * Created by daewon.park on 2016-09-12.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function MemberManagementDialog(parentId, options) {
        Brightics.VA.Dialogs.Dialog.call(this, parentId, options);
    }

    MemberManagementDialog.prototype = Object.create(Brightics.VA.Dialogs.Dialog.prototype);
    MemberManagementDialog.prototype.constructor = MemberManagementDialog;

    MemberManagementDialog.prototype._initOptions = function () {
        Brightics.VA.Dialogs.Dialog.prototype._initOptions.call(this);

        this.dialogOptions.width = 700;
        this.dialogOptions.height = 600;
        this.dialogOptions.maxWidth = 700;
        this.dialogOptions.maxHeight = 600;
    };

    MemberManagementDialog.prototype.createSearchControl = function ($parent) {
        var _this = this;
        this.$searchControl = $parent.find('.brtc-va-dialogs-member-management-search').jqxInput({
            placeHolder: Brightics.locale.common.searchForNameId,
            theme: Brightics.VA.Env.Theme
        });

        this.$searchControl.keyup(function (event) {
            _this.applySearchFilter(_this.$searchControl.val().trim());
        });

        this.$searchControl.on('search', function () {
            _this.applySearchFilter(_this.$searchControl.val().trim());
        });
    };

    MemberManagementDialog.prototype.applySearchFilter = function (filterValue) {
        if (filterValue) {
            var orOperator = 1;

            var nameFilterGroup = new $.jqx.filter();
            var nameFilter = nameFilterGroup.createfilter('stringfilter', filterValue, 'contains');
            nameFilterGroup.addfilter(orOperator, nameFilter);

            var idFilterGroup = new $.jqx.filter();
            idFilterGroup.operator = 'or';
            var idFilter = nameFilterGroup.createfilter('stringfilter', filterValue, 'contains');
            idFilterGroup.addfilter(orOperator, idFilter);

            this.$memberGrid.jqxGrid('addfilter', 'user_name', nameFilterGroup);
            this.$memberGrid.jqxGrid('addfilter', 'user_id', idFilterGroup);

            this.$memberGrid.jqxGrid('applyfilters');
        } else {
            this.$memberGrid.jqxGrid('clearfilters');
        }

        this.$memberGrid.jqxGrid('clearselection');
    };

    MemberManagementDialog.prototype.createInviteButton = function ($parent) {
        var _this = this;

        this.$inviteButton = $parent.find('.brtc-va-dialogs-member-management-invite').jqxButton({
            theme: Brightics.VA.Env.Theme
        });
        this.$inviteButton.click(function () {
            new Brightics.VA.Core.Dialogs.InviteMemberDialog($parent, {
                members: _this.$memberGrid.jqxGrid('getrows'),
                projectId: _this.options.projectId,
                close: function () {
                    _this.$memberGrid.jqxGrid('updatebounddata');
                    _this.$memberGrid.jqxGrid('clearselection');
                },
                title: Brightics.locale.common.inviteMember
            });
        });
    };

    MemberManagementDialog.prototype.createMemberGrid = function ($parent) {
        var source = {
            datatype: 'json',
            datafields: [
                {name: 'user_name', type: 'string'},
                {name: 'user_id', type: 'string'},
                {name: 'role_id', type: 'string'},
                {name: 'role_category', type: 'string'},
                {name: 'role_label', type: 'string'},
                {name: 'joined_time', type: 'date'}
            ],
            url: 'api/va/v2/ws/projects/' + this.options.projectId + '/members'
        };

        var dataAdapter = new $.jqx.dataAdapter(source);
        this.$memberGrid = $parent.find('.brtc-va-dialogs-member-management-grid').jqxGrid({
            theme: Brightics.VA.Env.Theme,
            source: dataAdapter,
            width: '100%',
            height: 'calc(100% - 160px)',
            altrows: false,
            filterable: false,
            sortable: false,
            columnsresize: true,
            columnsheight: 34,
            rowsheight: 34,
            selectionmode: 'checkbox',
            showfiltercolumnbackground: false,
            enabletooltips: true,
            columns: [
                {
                    text: 'Name', datafield: 'user_name', width: 120,
                    cellsrenderer: function (row, column, value) {
                        return '<div class="jqx-grid-cell-left-align" style="margin-top: 10px;">' + Brightics.VA.Core.Utils.WidgetUtils.convertHTMLSpecialChar(value) + '</div>';
                    }
                },
                {text: 'ID', datafield: 'user_id', width: 240},
                {text: 'Authority', datafield: 'role_label', width: 110},
                {text: 'Joined Date', datafield: 'joined_time', cellsformat: 'yyyy-MM-dd HH:mm'}
            ]
        });
    };

    MemberManagementDialog.prototype.createAuthorityCombo = function ($parent) {
        this.$authorityCombo = $parent.find('.brtc-va-dialogs-member-management-authority').jqxDropDownList({
            theme: Brightics.VA.Env.Theme,
            autoDropDownHeight: true,
            source: [
                {id: 'role_10002', label: Brightics.locale.common.asOrganizer},
                {id: 'role_10003', label: Brightics.locale.common.asMember},
                {id: 'role_10004', label: Brightics.locale.common.asReporter}
            ],
            displayMember: 'label',
            valueMember: 'id',
            itemHeight: 29,
            dropDownWidth: 118,
            selectedIndex: 1
        });
    };

    MemberManagementDialog.prototype.createApplyAuthorityButton = function ($parent) {
        var _this = this;
        var member;

        this.$applyButton = $parent.find('.brtc-va-dialogs-member-management-apply-authority').jqxButton({
            theme: Brightics.VA.Env.Theme
        });
        this.$applyButton.click(function () {
            var indexes = _this.$memberGrid.jqxGrid('getselectedrowindexes');
            if (indexes.length == 0) {
                Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('At least one member must be selected.');
            } else {
                if (indexes.length == 1) {
                    member = _this.$memberGrid.jqxGrid('getrowdata', indexes[0]);
                    if (member.role_id == 'role_10001') {
                        Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('Can not change authority of owner.');
                        return;
                    }
                }
                var item = _this.$authorityCombo.jqxDropDownList('getSelectedItem');
                var role_id = item.value;
                var options = {
                    members: []
                };
                for (var i in indexes) {
                    member = _this.$memberGrid.jqxGrid('getrowdata', indexes[i]);
                    options.members.push({
                        user_id: member.user_id,
                        role_id: role_id
                    });
                }
                var opt = {
                    url: 'api/va/v2/ws/projects/' + _this.options.projectId + '/members/authority',
                    type: 'POST',
                    contentType: "application/json; charset=utf-8",
                    blocking: true,
                    data: JSON.stringify(options)
                };
                $.ajax(opt).done(function (result) {
                    Brightics.VA.Core.Utils.WidgetUtils.openInformationDialog('Changed ' + result + ' member\'s authority.', function () {
                        _this.$memberGrid.jqxGrid('updatebounddata');
                        _this.$memberGrid.jqxGrid('clearselection');
                    });
                }).fail(function (error) {
                    Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(error);
                });
            }
        });
    };

    MemberManagementDialog.prototype.createWithdrawButton = function ($parent) {
        var _this = this;

        this.$withdrawButton = $parent.find('.brtc-va-dialogs-member-management-withdraw').jqxButton({
            theme: Brightics.VA.Env.Theme
        });
        this.$withdrawButton.click(function () {
            var indexes = _this.$memberGrid.jqxGrid('getselectedrowindexes');
            if (indexes.length == 0) {
                Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('At least one member must be selected.');
            } else {
                var self;
                for (var i in indexes) {
                    var row = _this.$memberGrid.jqxGrid('getrowdata', indexes[i]);
                    if (row.role_id == 'role_10001') {
                        Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('Can not change authority of owner.');
                        return;
                    }

                    if (row.user_id == Brightics.VA.Env.Session.userId) {
                        self = true;
                    }
                }

                if (self) {
                    Brightics.VA.Core.Utils.WidgetUtils.openConfirmDialog('Are you sure you want to leave the project?', function (dialogResult) {
                        if (dialogResult.OK) {
                            _this.withdraw();
                        }
                    });
                } else {
                    Brightics.VA.Core.Utils.WidgetUtils.openConfirmDialog('Are you sure you want to withdraw the member(s)?', function (dialogResult) {
                        if (dialogResult.OK) {
                            _this.withdraw();
                        }
                    });
                }
            }
        });
    };

    MemberManagementDialog.prototype.withdraw = function () {
        var options = {
                members: []
            },
            _this = this,
            indexes = this.$memberGrid.jqxGrid('getselectedrowindexes');
        for (var i in indexes) {
            var member = this.$memberGrid.jqxGrid('getrowdata', indexes[i]);
            options.members.push({
                user_id: member.user_id,
                role_id: member.role_id
            });
        }
        var opt = {
            url: 'api/va/v2/ws/projects/' + _this.options.projectId + '/members/withdraw',
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            blocking: true,
            data: JSON.stringify(options)
        };
        $.ajax(opt).done(function (result) {
            Brightics.VA.Core.Utils.WidgetUtils.openInformationDialog('Withdraw ' + result + ' members.', function () {
                if (options.members.length == 1 && options.members[0].user_id == Brightics.VA.Env.Session.userId) {
                    _this.handleOkClicked();
                } else {
                    _this.$memberGrid.jqxGrid('updatebounddata');
                    _this.$memberGrid.jqxGrid('clearselection');
                }
            });
        }).fail(function (error) {
            Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(error);
        });
    };

    MemberManagementDialog.prototype.createDialogContentsArea = function ($parent) {
        $parent.append('' +
            '<input type="search" class="brtc-va-dialogs-member-management-search">' +
            '<input type="button" class="brtc-va-dialogs-member-management-invite" value="' + Brightics.locale.common.inviteMembers + '">' +
            '<div class="brtc-va-dialogs-member-management-grid"></div>' +
            '<input type="button" class="brtc-va-dialogs-member-management-withdraw" value="' + Brightics.locale.common.withdraw + '">' +
            '<input type="button" class="brtc-va-dialogs-member-management-apply-authority" value="' + Brightics.locale.common.applyAuthority + '">' +
            '<div class="brtc-va-dialogs-member-management-authority"></div>' +
            '');

        this.createSearchControl($parent);
        this.createInviteButton($parent);
        this.createMemberGrid($parent);
        this.createAuthorityCombo($parent);
        this.createApplyAuthorityButton($parent);
        this.createWithdrawButton($parent);
    };

    MemberManagementDialog.prototype.createDialogButtonBar = function ($parent) {
        Brightics.VA.Dialogs.Dialog.prototype.createDialogButtonBar.call(this, $parent);

        this.$okButton.val('Close');
        this.$cancelButton.css({display: 'none'});
    };

    MemberManagementDialog.prototype.handleOkClicked = function () {
        var _this = this;

        Brightics.VA.Dialogs.Dialog.prototype.handleOkClicked.call(this);
    };

    Brightics.VA.Core.Dialogs.MemberManagementDialog = MemberManagementDialog;

}).call(this);