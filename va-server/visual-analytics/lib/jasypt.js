var spawnSync = require('child_process').spawnSync;

var CMD_EXTENSION = /^win/.test(process.platform) ? '.bat' : '.sh';
var JASYPT_HOME;
var JASYPT_CMD_ENCRYPT = JASYPT_HOME + '/bin/encrypt' + CMD_EXTENSION;
var JASYPT_CMD_DECRYPT = JASYPT_HOME + '/bin/decrypt' + CMD_EXTENSION;

if (/^win/.test(process.platform)) {
    require('child_process').exec('chcp 437');
}

var Jasypt = {
    env: function (options) {
        JASYPT_HOME = options['jasypt-home'];
        if (!__REQ_path.isAbsolute(JASYPT_HOME)) {
            JASYPT_HOME = __REQ_path.resolve(JASYPT_HOME);
        }
        JASYPT_CMD_ENCRYPT = JASYPT_HOME + '/bin/encrypt' + CMD_EXTENSION;
        JASYPT_CMD_DECRYPT = JASYPT_HOME + '/bin/decrypt' + CMD_EXTENSION;
    },
    _execute: function (command, options) {
        var args = [];
        for (var key in options) {
            args.push(key + '=' + options[key]);
        }
        return spawnSync(command, args);
    },
    encrypt: function (input, password, options) {
        var opt = options || {};
        opt.input = input;
        opt.password = password;
        opt.verbose = false;
        opt.algorithm = opt.algorithm || 'PBEWithMD5AndDES';
        var result = this._execute(JASYPT_CMD_ENCRYPT, opt);
        if (result.status == 0) {
            var lines = result.stdout.toString().split(/\n/);
            if (lines.length > 0) {
                return lines[0].trim();
            }
        } else {
            console.error(result.stderr.toString());
        }
    },
    decrypt: function (input, password, options) {
        var opt = options || {};
        opt.input = input;
        opt.password = password;
        opt.verbose = false;
        opt.algorithm = opt.algorithm || 'PBEWithMD5AndDES';
        var result = this._execute(JASYPT_CMD_DECRYPT, opt);
        if (result.status == 0) {
            var lines = result.stdout.toString().split(/\n/);
            if (lines.length > 0) {
                return lines[0].trim();
            }
        } else {
            console.error(result.stderr.toString());
        }
    }
};

Jasypt.env({'jasypt-home': '../jasypt'});

module.exports = Jasypt;