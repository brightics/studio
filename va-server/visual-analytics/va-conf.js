/**
 * Created by daewon.park on 2016-03-23.
 */
var fs = require('fs');
var ip = require('ip');
var jasypt = require('./lib/jasypt');
var path = require('path');

var env = process.env.NODE_ENV || 'development';
var conf_file_path = {
    production: './conf.json',
    development: './conf_dev.json'
};

var conf = JSON.parse(fs.readFileSync(conf_file_path[env], 'utf8'));
conf.env = env;
conf['mail-ip'] = 'http://' + ip.address() + ':' + conf.port;

if (conf['jasypt-home']) {
    jasypt.env({'jasypt-home': conf['jasypt-home']});
}

if (conf['meta-db'] && conf['meta-db'].type === 'sqlite') {
    conf['meta-db'].url = path.resolve(__dirname, conf['meta-db'].url);
}

console.log('--- BEGIN DECRYPT CONFIG ---');

var decrypt = function (obj) {
    var k;
    if (obj instanceof Object) {
        for (k in obj) {
            if (obj.hasOwnProperty(k)) {
                if (obj[k] instanceof Object) {
                    //recursive call to scan property
                    decrypt(obj[k]);
                } else {
                    var val = obj[k];
                    if (typeof val === 'string') {
                        var matched = val.match(/ENC\([^\(]+\)/g);
                        if (matched) {
                            console.log('DECRYPT ' + k + ': ' + val);
                            for (var i in matched) {
                                var input = matched[i].substring(4, matched[i].length - 1);
                                var decrypted = jasypt.decrypt(input, 'BRTC_PASS');
                                if (decrypted) {
                                    console.log('> SUCCESS DECRYPT : ' + input);
                                    val = val.replace(matched[i], decrypted);
                                } else {
                                    console.log('> FAIL DECRYPT');
                                }
                            }
                            obj[k] = val;
                        }
                    }
                }
            }
        }
    }
};

decrypt(conf);

console.log('--- END DECRYPT CONFIG ---');

if (process.env.NODE_ENV == 'development') {
    conf['callback-host'] = 'http://' + ip.address() + ':' + conf.port;
}

module.exports = conf;
