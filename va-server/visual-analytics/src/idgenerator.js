/**
 * Created by SDS on 2016-01-28.
 */
'use strict';

var ALPHABET = '23456789abcdefghjkmnpqrstuvwxyz';
var ID_LENGTH = 16;

var nextChar = function (str) {
    return str.charAt(Math.floor(Math.random() * str.length));
};

var nextId = function (length) {
    var size = length || ID_LENGTH;
    var rtn = '';
    for (var i = 0; i < size; i++) {
        rtn += nextChar(ALPHABET);
    }
    return rtn;
};

var IDGenerator = {
    project: {
        id: function () {
            return 'p' + nextId(15);
        }
    },
    model: {
        id: function () {
            return 'm' + nextId(15);
        }
    },
    control: {
        id: function () {
            return 'c' + nextId(15);
        }
    },
    func: {
        id: function () {
            return 'f' + nextId(15);
        }
    },
    table: {
        id: function () {
            return 't' + nextId(15);
        }
    },
    link: {
        id: function () {
            return 'k' + nextId(15);
        }
    },
    template: {
        id: function () {
            return 't' + nextId(15);
        }
    },
    notice: {
        id: function () {
            return 'n' + nextId(15);
        }
    },
    send: {
        id: function () {
            return 's' + nextId(39);
        }
    },
    report: {
        id: function (length) {
            var idLength = length || 8;
            return 'r' + nextId(idLength);
        }
    },
    schedule: {
        id: function () {
            return 'j' + nextId(15);
        }
    },
    file: {
        id: function () {
            return 'f' + nextId(8);
        }
    },
    reportPage: {
        id: function () {
            return 'rp' + nextId(14);
        }
    },
    reportContent: {
        id: function () {
            return 'rc' + nextId(14);
        }
    },
    dataSource: {
        id: function () {
            return 'ds' + nextId(14);
        }
    },
    udf: {
        id: function (prefix) {
            return 'udf_' + prefix + '_' + nextId(8);
        }
    },
    uuid: {
        id: function (length) {
            return nextId(length);
        }
    },
    importedFile: {
        id: function (prefix) {
            return 'importedFile_' + nextId(8);
        }
    },
    version: {
        id: function (length) {
            return 'v' + nextId(length || 15);
        }
    }
};

// export { IDGenerator };
module.exports = IDGenerator;
