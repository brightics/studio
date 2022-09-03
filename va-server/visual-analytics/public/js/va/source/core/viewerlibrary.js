(function () {
    'use strict';

    var root = this;
    root.Brightics.VA.Core.Functions.Viewer = {
        kmeans2: {
            'in': ['data'],
            'out': ['data', 'model', 'image']
        },
        sort: {
            'in': ['data', 'model'],
            'out': ['data', 'model', 'image', 'html']
        },
        load: {
            'out': ['data']
        },
        load2: {
            'out': ['model']
        }
    };
}).call(this);
