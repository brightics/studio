var router = __REQ_express.Router();

var NodeRSA = require('node-rsa');
var rsaKeyMap = require('../../../../lib/rsakeymap');

var getPublicKey = function (req, res, next) {
    var key;
    key = new NodeRSA({b: 1024});
    var privateKey = key.exportKey('pkcs8-private');
    var publicKey = key.exportKey('pkcs8-public-pem');

    if (req.query.type && req.query.type === 'pem') {
        rsaKeyMap.addKey({
            publicKey: publicKey,
            privateKey: privateKey
        });

        res.json({
            publicKey: publicKey
        });
    }
    else {
        req.session.publicKey = publicKey;
        req.session.privateKey = privateKey;

        var publicComponents = key.exportKey('components-public');
        res.json({
            publicN: publicComponents.n.toString('hex'),
            publicE: publicComponents.e.toString(16)
        });
    }
};

router.get('/publickey', getPublicKey);

module.exports = router;