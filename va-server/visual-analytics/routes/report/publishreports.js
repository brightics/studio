var ip = require('ip');

exports.embed = function (req, res) {
    var _path = __REQ_path.join(__dirname, '../../public/static/embed/embed-code.html');

    fs.readFile(_path, function (err, content) {
        console.log(content);
        res.send(content);
    });
};

exports.ip = function (req, res) {
    res.send(ip.address() + ':' + __BRTC_CONF.port);
};