var NodeRSA = require('node-rsa');
var rsaKeyMap = require('../lib/rsakeymap');

exports.decryptRSA = function (encryptedString, req) {
    var decrypted;
    var privateKey;
    if (req && req.session && req.session.privateKey) {
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
    if (req && req.session && req.session.privateKey) {
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

// @Deprecated
// Sample로 남겨둔 코드입니다.
// 나중에 Key를 바꿀 때 필요합니다.
var generateKey = function (req, res, next) {
    // Key 생성 및 Public Key 전달
    var key = new NodeRSA({ b: 512 });

    var privateDer = key.exportKey('pkcs1-private-der');
    var publicDer = key.exportKey('pkcs8-public-der');
    var publicComponents = key.exportKey('components-public');

    req.session.privateDer = privateDer;
    req.session.publicDer = publicDer;
    req.session.privateDer_hex = privateDer.toString('hex');
    req.session.publicDer_hex = publicDer.toString('hex');
    res.json({
        publicN: publicComponents.n.toString('hex'),
        publicE: publicComponents.e.toString(16),
    });

    // Decrypt
    var privateKey = new NodeRSA(new Buffer(req.session.privateDer), 'pkcs1-private-der');
    privateKey.setOptions({ encryptionScheme: 'pkcs1' });
    var decrypted = privateKey.decrypt(new Buffer(req.body.password, 'hex'), 'utf8');
    return decrypted;
};
