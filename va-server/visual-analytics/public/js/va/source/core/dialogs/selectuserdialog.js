/**
 * Created by daewon77.park on 2016-03-24.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function SelectUserDialog(parentId, options) {
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

    SelectUserDialog.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    SelectUserDialog.prototype.createControls = function () {
        this.$mainControl = $('' +
            '<div class="brtc-va-dialogs-main brtc-va-dialogs-newfiledialog">' +
            // '   <div class="brtc-va-dialogs-header">Select User</div>' +
            '   <div class="brtc-va-dialogs-body">' +
            '       <div class="brtc-va-dialogs-contents">' +
            '       </div>' +
            '       <div class="brtc-va-dialogs-buttonbar">' +
            '           <input type="button" class="brtc-va-dialogs-buttonbar-ok" value="Send" />' +
            '       </div>' +
            '   </div>' +
            '</div>');
        this.$parent.append(this.$mainControl);

        this.$okButton = this.$mainControl.find('.brtc-va-dialogs-buttonbar-ok');
        this.$cancelButton = this.$mainControl.find('.brtc-va-dialogs-buttonbar-cancel');

        var _this = this;

        var jqxOpt = {
            theme: Brightics.VA.Env.Theme,
            title: 'Select User',
            width: 600,
            height: 470,
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

    SelectUserDialog.prototype.initContents = function () {
        var _this = this;
        _this.createDialogContentsArea(_this.$mainControl.find('.brtc-va-dialogs-contents'));

        _this.$okButton.jqxButton({
            theme: Brightics.VA.Env.Theme,
            disabled: true
        });
        _this.$okButton.click(_this.sendModelInformation.bind(_this));
    };


    SelectUserDialog.prototype.createDialogContentsArea = function ($parent) {
        var _this = this;

        $parent.append('' +
            '<div class="brtc-va-dialogs-contents-label-main">Name</div>' +
            '<input type="search" class="brtc-va-dialogs-selectuser-name-input" />' +
            '<div class="brtc-va-dialogs-selectuser-result-label">User</div>' +
            '<div class="brtc-va-dialogs-selectuser-result-list"></div>' +
            '');


        $parent.find('.brtc-va-dialogs-selectuser-name-input').jqxInput({
            placeHolder: 'Search User',
            theme: Brightics.VA.Env.Theme,
            height: '23px',
            width: '250px'
        });

        $parent.find('.brtc-va-dialogs-selectuser-result-list').perfectScrollbar();

        $parent.find('.brtc-va-dialogs-selectuser-name-input').focus();

        $parent.find('.brtc-va-dialogs-selectuser-name-input').keyup(function (event) {
            var name = event.target.value || '';
            name.trim();
            if (event.keyCode === 13 && name !== '') {
                _this.searchUserByName(name);
            }
        });
    };

    SelectUserDialog.prototype.searchUserByName = function (userName) {
        var _this = this;
        $.ajax({
            method: 'get',
            url: 'api/admin/v2/users?pattern=' + encodeURIComponent(userName) + '&name=true',
            blocking: true
        }).done(function (userList) {
            _this.reset();
            _this.fillUserList(userList);
        }).fail(function (err) {
        })
    };

    SelectUserDialog.prototype.reset = function () {
        var $userListContainer = this.$mainControl.find('.brtc-va-dialogs-selectuser-result-list');
        $userListContainer.empty();
        this.selectedUserId = '';
        this.$okButton.jqxButton({
            disabled: true
        });
    };

    SelectUserDialog.prototype.createUserListHeader = function () {
        var $userListContainer = this.$mainControl.find('.brtc-va-dialogs-selectuser-result-list');
        $userListContainer.append('<table class="brtc-va-dialogs-selectuser-table">' +
            '   <tr class="brtc-va-dialogs-selectuser-table-header">' +
            '       <th>name</th>' +
            '       <th>id</th>' +
            '       <th>email</th>' +
            '   </tr>' +
            '</table>');
    };

    SelectUserDialog.prototype.fillUserList = function (userList) {
        var $userListContainer = this.$mainControl.find('.brtc-va-dialogs-selectuser-result-list'), user, $userTable;

        if (userList.length === 0) {
            $userListContainer.text('Your search did not match any person.');
        } else {
            this.createUserListHeader();
            $userTable = $userListContainer.find('table');
            for (var i = 0; i < userList.length; i++) {
                user = userList[i];
                $userTable.append($('' +
                    '   <tr class="brtc-va-dialogs-selectuser-table-tr" userId="' + user.id + '">' +
                    '       <td>' + user.name + '</td>' +
                    '       <td>' + user.id + '</td>' +
                    '       <td>' + user.email + '</td>' +
                    '   </tr>'));
            }

            this.createUserSelectEvent($userTable);
        }
    };
    SelectUserDialog.prototype.createUserSelectEvent = function ($table) {
        var $userRows = $table.find('.brtc-va-dialogs-selectuser-table-tr'), $userRow, _this = this, $targetRow;
        for (var i = 0; i < $userRows.length; i++) {
            $userRow = $($userRows[i]);
            $userRow.click(function (event) {
                $userRows.removeClass('selected');
                $targetRow = $(event.target).closest('tr');

                $targetRow.addClass('selected');
                _this.selectedUserId = $targetRow.attr('userId');
                _this.$okButton.jqxButton({
                    disabled: false
                });

            })
        }
        this.openConfirmDialog();
    };

    SelectUserDialog.prototype.sendModelInformation = function () {
        var _this = this;
        var data = {
            sendId: Brightics.VA.Core.Utils.IDGenerator.send.id(),
            userId: this.selectedUserId,
            fromUserId: Brightics.VA.Env.Session.userId,
            sendMessage: '',
            projectId: this.options.projectId,
            fileId: this.options.fileId
        };
        $.ajax({
            url: 'api/v1/ws/send/file/create',
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json; charset=utf-8',
            blocking: true
        }).done(function (data) {
            Brightics.VA.Core.Utils.WidgetUtils.openInformationDialog('Success.', function () {
                _this.$mainControl.dialog('close');
            });
        });
    };

    Brightics.VA.Core.Dialogs.SelectUserDialog = SelectUserDialog;

}).call(this);