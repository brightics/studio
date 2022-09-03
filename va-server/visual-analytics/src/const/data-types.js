
const DATA_TYPES = {
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
    }
};

export { DATA_TYPES };
