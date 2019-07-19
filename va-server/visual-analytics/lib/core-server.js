var request = __REQ_request;

var URI_CORE_SERVER = 'http://localhost:9097';

const
    columnConvertMap = {
        // spark type
        'integertype': {
            type: 'number',
            internalType: 'Integer'
        },
        'longtype': {
            type: 'number',
            internalType: 'Long'
        },
        'doubletype': {
            type: 'number',
            internalType: 'Double'
        },
        'booleantype': {
            type: 'string',
            internalType: 'Boolean'
        },
        'stringtype': {
            type: 'string',
            internalType: 'String'
        },
        'arraytype(doubletype)': {
            type: 'number[]',
            internalType: 'Double[]'
        },
        'arraytype(longtype)': {
            type: 'number[]',
            internalType: 'Long[]'
        },
        'arraytype(booleantype)': {
            type: 'string[]',
            internalType: 'Boolean[]'
        },
        'arraytype(stringtype)': {
            type: 'string[]',
            internalType: 'String[]'
        },
        'arraytype(bytetype)': {
            type: 'byte[]',
            internalType: 'Byte[]'
        },
        'arraytype(doubletype,true)': {
            type: 'number[]',
            internalType: 'Double[]'
        },
        'arraytype(longtype,true)': {
            type: 'number[]',
            internalType: 'Long[]'
        },
        'arraytype(stringtype,true)': {
            type: 'string[]',
            internalType: 'String[]'
        },
        'arraytype(bytetype,true)': {
            type: 'byte[]',
            internalType: 'Byte[]'
        },
        'maptype(integertype,doubletype)': {
            type: 'map',
            internalType: 'Map(Integer,Double)'
        },
        'maptype(stringtype,doubletype)': {
            type: 'map',
            internalType: 'Map(String,Double)'
        },
        'maptype(integertype,doubletype,true)': {
            type: 'map',
            internalType: 'Map(Integer,Double)'
        },
        'maptype(stringtype,doubletype,true)': {
            type: 'map',
            internalType: 'Map(String,Double)'
        },
        'maptype(stringtype,stringtype,true)': {
            type: 'map',
            internalType: 'Map(String,String)'
        },
        'timestamptype': {
            type: 'date',
            internalType: 'Date'
        },
        'timestamp': {
            type: 'date',
            internalType: 'Date'
        },
        'date': {
            type: 'date',
            internalType: 'Date'
        },
        // alluxio type
        'string': {
            type: 'string',
            internalType: 'String'
        },
        'double': {
            type: 'number',
            internalType: 'Double'
        },
        'boolean': {
            type: 'string',
            internalType: 'Boolean'
        },
        'long': {
            type: 'number',
            internalType: 'Long'
        },
        'int': {
            type: 'number',
            internalType: 'Integer'
        },
        'integer': {
            type: 'number',
            internalType: 'Integer'
        },
        'array(string)': {
            type: 'string[]',
            internalType: 'String[]'
        },
        'array(double)': {
            type: 'number[]',
            internalType: 'Double[]'
        },
        'array(long)': {
            type: 'number[]',
            internalType: 'Long[]'
        },
        'array(int)': {
            type: 'number[]',
            internalType: 'Integer[]'
        },
        'array(integer)': {
            type: 'number[]',
            internalType: 'Integer[]'
        },
        'map(integer,double)': {
            type: 'map',
            internalType: 'Map(Integer,Double)'
        },
        'map(string,double)': {
            type: 'map',
            internalType: 'Map(String,Double)'
        },
        'map(int,double)': {
            type: 'map',
            internalType: 'Map(Integer,Double)'
        },

        // workflow 3.5
        'tinyint': {
            type: 'byte',
            internalType: 'Byte'
        },
        'float': {
            type: 'number',
            internalType: 'Float'
        },
        'decimal': {
            type: 'number',
            internalType: 'Decimal'
        },
        'bigint': {
            type: 'number',
            internalType: 'Long'
        },
        'smallint': {
            type: 'short',
            internalType: 'Short'
        },
        'array<string>': {
            type: 'string[]',
            internalType: 'String[]'
        },
        'array<double>': {
            type: 'number[]',
            internalType: 'Double[]'
        },
        'array<long>': {
            type: 'number[]',
            internalType: 'Long[]'
        },
        'array<int>': {
            type: 'number[]',
            internalType: 'Integer[]'
        },
        'array<integer>': {
            type: 'number[]',
            internalType: 'Integer[]'
        },
        'array<tinyint>': {
            type: 'byte[]',
            internalType: 'Byte[]'
        },
        'map<integer,double>': {
            type: 'map',
            internalType: 'Map(Integer,Double)'
        },
        'map<string,double>': {
            type: 'map',
            internalType: 'Map(String,Double)'
        },
        'map<int,double>': {
            type: 'map',
            internalType: 'Map(Integer,Double)'
        },

        // python
        'float64': {
            type: 'number',
            internalType: 'Double'
        },
        'float32': {
            type: 'number',
            internalType: 'Double'
        },
        'image': {
            type: 'image',
            internalType: 'Image'
        }
    };

var convertColumnType = function (originalType) {
    return columnConvertMap[originalType.toLowerCase()] || {
        type: 'string',
        internalType: 'String'
    };
};

var setBearerToken = function (options, token) {
    if (options.auth) {
        options.auth.bearer = token;
    } else {
        options.auth = {
            bearer: token
        }
    }
};

var createRequestOptions = function (method, url, token) {
    var options = {
        url: URI_CORE_SERVER + url,
        method: method,
        proxy: '',
        headers: {
            'User-Agent': 'Brightics VA',
            'Content-Type': 'application/json',
            'authorization': 'Basic YWRtaW46YWRtaW4='
        }
    };
    if (token) {
        setBearerToken(options, token);
    }
    return options;
};

var setBasicAuth = function (options, id, pw) {
    options.headers.authorization = `Basic ${Buffer.from(id + ':' + pw).toString('base64')}`;
};

exports.env = function (options) {
    URI_CORE_SERVER = options['URI'];
};

exports.createRequestOptions = createRequestOptions;
exports.setBearerToken = setBearerToken;
exports.convertColumnType = convertColumnType;
exports.setBasicAuth = setBasicAuth;
