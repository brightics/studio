/**
 * Created by ty_tree.kim on 2016-05-17.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function UserConfiguration($parent) {
        this.$parent = $parent;   //#content
        this.studio = Brightics.Installer.Utils.WidgetUtils.getStudioRef($('.brtc-installer-studio'));
    }

    UserConfiguration.prototype.render = function () {
        this.$parent.empty();
        this.createLayout();
        this.renderChangePassword();
        //this.bindButtonEvent();
    };

    UserConfiguration.prototype.createLayout = function () {
        var _this = this;

        this.$mainControl = $('' +
            '<div class="h2_title"><span>Change Password</span></div>' +
            '<div class="location">' +
            '    <a href="#">User setting</a> <img src="static/images/ico_path.gif" alt="" /> <strong>Change password</strong>' +
            '</div>' +
            '<div class="cont_area clearfix">' +
            '   <div class="row-fluid rowlast mt22">' +
            '       <div class="row_fiuld_des"></div>' +
            '       <div id="table-area"></div>' +
            '       <div class="btn_wrap hrtop">' +
            '           <div class="fl_r">' +
            '               <button class="btnBigBlue"><span>Save</span></button>' +
            '           </div>' +
            '       </div>' +
            '   </div>' +
            '</div>');

        this.$parent.append(this.$mainControl);
        this.$tableArea = this.$mainControl.find('#table-area');
        this.$buttonArea = this.$mainControl.find('.btn_wrap button');

        this.$buttonArea.click(function(){
            var passValidation = true;

            var target = _this.$tbody.find('input');
            for (var i=0; i<target.length; i++) {
                if ($(target[i]).val()) {
                    $(target[i]).removeClass('has-error');
                    $(target[i]).siblings().css({'display':'none'});
                } else {
                    $(target[i]).addClass('has-error');
                    $(target[i]).siblings().css({'display':'block'});
                    passValidation = false;
                }
            }

            if (_this.$tbody.find('#change-password').val() != _this.$tbody.find('#confirm-password').val()) {
                passValidation = false;
                $('#change-password-label').show();
                $('#confirm-password-label').show();
                $('#change-password-label').text('[change password] and [confirm password] should be equal');
                $('#confirm-password-label').text('[change password] and [confirm password] should be equal');
            }

            if (passValidation) {
                var data = {
                    prePassword: $('#previous-password').val(),
                    newPassword: $('#change-password').val()
                };

                console.log(data);

                $.ajax({
                    method: 'PUT',
                    contentType: 'application/json; charset=utf-8',
                    url: '/api/v1/user',
                    data: JSON.stringify(data),
                    success: function (response) {
                        if (response.status == 'fail') {
                            _this.studio.showPopup({
                                title: 'Error',
                                mode: 'alert',
                                message: [response.message],
                                hasCheckBox: false,
                                checkBoxMessage: ''
                            });
                        } else {
                            _this.studio.showPopup({
                                title: 'Change Password',
                                mode: 'alert',
                                message: ['Changed Password'],
                                hasCheckBox: false,
                                checkBoxMessage: '',
                                callback: function (isChecked) {
                                    window.location.href = '/';
                                }
                            });
                        }
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        console.error(xhr);
                    }
                });
            }
        });
    };

    UserConfiguration.prototype.renderChangePassword = function () {
        var _this = this;

        var $table = $('<table class="board-view01"></table>');
        var $colGroup = $('' +
            '<colgroup>' +
            '   <col class="w11" />' +
            '   <col class="w360"/>' +
            '   <col/>' +
            '</colgroup>');

        $table.append($colGroup);

        this.$tbody = $('' +
            '<tbody>' +
            '   <tr>' +
            '       <th><span>Previous Password </span>' +
            '       </th>' +
            '       <td>' +
            '           <input type="password" id="previous-password" name="" placeholder="Previous Password" class="normal password  " title="" value="">' +
            '           <label style="display:none" id="previous-password-label" class="help-block has-error" for="">Previous Password is not entered</label>' +
            '       </td>' +
            '   </tr>' +
            '   <tr>' +
            '       <th><span>Change Password </span>' +
            '       </th>' +
            '       <td>' +
            '           <input type="password" id="change-password" name="" placeholder="Change Password" class="normal password " title="" value="">' +
            '           <label style="display:none" id="change-password-label" class="help-block has-error" for="">Change Password is not entered</label>' +
            '       </td>' +
            '   </tr>' +
            '   <tr>' +
            '       <th><span>Confirm Password </span>' +
            '       </th>' +
            '       <td>' +
            '           <input type="password" id="confirm-password" name="" placeholder="Confirm Password" class="normal password " title="" value="">' +
            '           <label style="display:none" id="confirm-password-label" class="help-block has-error" for="">Confirm Password is not entered</label>' +
            '       </td>' +
            '   </tr>' +
            '</tbody>');
        $table.append(this.$tbody);

        this.$mainControl.find('#table-area').append($table);
    };

    root.Brightics.Installer.ContentContainer.UserConfiguration = UserConfiguration;

}).call(this);