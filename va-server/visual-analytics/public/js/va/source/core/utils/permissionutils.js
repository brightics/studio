/**
 * Created by ji_sung.park on 2017-05-22.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    Brightics.VA.Core.Utils.PermissionUtils = {
        check: function ($target, permissions) {
            var _this = this;

            _.map(permissions, function (permission) {
                if (!_this.validate(permission)) _this[permission]($target);
            });
        },
        validate: function (permission) {            
            if (this[permission] && !this.hasPermission(permission)) return false;
            return true;
        },
        hasPermission: function (permission) {
            for (var i in Brightics.VA.Env.Session.permissions) {
                if (Brightics.VA.Env.Session.permissions[i].permission_id === permission) {
                    return true;
                }
            }   
            return false; 
        },
        'data_upload_shared': function ($target) {
            var checkUploadData = function ($target) {
                var selectors = [
                    '#upload-to-shared-local',
                    '#upload-to-shared-jdbc',
                    '#upload-to-shared-alluxio'
                ];

                _.map(selectors, function (selector) {
                    var targets = $target.find(selector);

                    if (targets.length > 0) {
                        _.map(targets, function (target) {
                            $(target).jqxRadioButton({disabled: true});
                        });
                    }
                });
            };
            checkUploadData($target);
        }
    };

}).call(this);