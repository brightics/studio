var NodeRSA = require('node-rsa');
var rsaKeyMap = require('../lib/rsakeymap');

exports.decryptRSA = function (encryptedString, req) {
    var decrypted;
    var privateKey;
    if (req.session && req.session.privateKey) {
        privateKey = new NodeRSA(req.session.privateKey, 'pkcs8-private');
        privateKey.setOptions({ encryptionScheme: 'pkcs1' });
        decrypted = privateKey.decrypt(new Buffer(encryptedString, 'hex'), 'utf-8');
    } else {
        if (req.body.publicKey) {
            privateKey = new NodeRSA(rsaKeyMap.getPrivateKey(req.body.publicKey), 'pkcs8-private');
            decrypted = privateKey.decrypt(encryptedString, 'utf-8');
            rsaKeyMap.deleteKey(req.body.publicKey);
        } else {
            console.error('ERROR: /lib/rsa.js');
            console.error('ERROR: decryptRSA - THERE IS NO PUBLICKEY IN REQUEST');
        }
    }
    return decrypted;
};

exports.decryptRSAForArray = function (encryptedStrings, req) {
    var decrypted = [];
    var privateKey;
    if (req.session && req.session.privateKey) {
        privateKey = new NodeRSA(req.session.privateKey, 'pkcs8-private');
        privateKey.setOptions({ encryptionScheme: 'pkcs1' });
        for (let i in encryptedStrings) {
            decrypted.push(privateKey.decrypt(new Buffer(encryptedStrings[i], 'hex'), 'utf-8'));
        }
    } else {
        if (req.body.publicKey) {
            privateKey = new NodeRSA(rsaKeyMap.getPrivateKey(req.body.publicKey), 'pkcs8-private');
            for (let i in encryptedStrings) {
                decrypted = privateKey.decrypt(encryptedStrings[i], 'utf-8');
            }
            rsaKeyMap.deleteKey(req.body.publicKey);
        } else {
            console.error('ERROR: /lib/rsa.js');
            console.error('ERROR: decryptRSA - THERE IS NO PUBLICKEY IN REQUEST');
        }
    }
    return decrypted;
};