var rsaKeyMap = {};

var addKey = function (key) {
    rsaKeyMap[key.publicKey] = key.privateKey;
};

var deleteKey = function (publicKey) {
    delete rsaKeyMap[publicKey];
};

var getPrivateKey = function (publicKey) {
    return rsaKeyMap[publicKey];
};

var show = function () {
    console.log(JSON.stringify(rsaKeyMap));
};

exports.addKey = addKey;
exports.deleteKey = deleteKey;
exports.getPrivateKey = getPrivateKey;
exports.show = show;
