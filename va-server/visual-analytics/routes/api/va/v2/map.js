var router = __REQ_express.Router();

var listMaps = function (req, res) {
    var list = [];
    var promises = [];


    var path = 'lib/map';
    var promise = new Promise(function (resolve, reject) {
        __REQ_fs.readdir(path, function (err, files) {
            if (err) {
                // res.send(list);
                reject(Error(err.message));
            } else {
                files.forEach(function (file) {
                    list.push({
                        label: file,
                        value: file,
                    });
                });
                res.send(list);
                resolve('SUCCESS: ' + path);
            }
        });
    });


    promises.push(promise);
    Promise.all(promises).then(function () {
    }, function (error) {
        next(error);
    })
};


var getMap = function (req, res) {

    var mapName = req.params.map;
    var path = 'lib/map/' + mapName;

    new Promise(function (resolve, reject) {
        __REQ_fs.readFile(path, 'utf8', function (err, file) {
            if (err) {
                reject(Error(err.message));
            } else {
                res.json(file);
                resolve('SUCCESS: ' + path);
            }
        });
    });
};


router.get('/', listMaps);
router.get('/:map', getMap);

module.exports = router;