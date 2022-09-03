/* -----------------------------------------------------
 *  publish-dao.js
 *  Created by hyunseok.oh@samsung.com on 2018-02-12.
 * ----------------------------------------------------*/

import { ajaxGet, ajaxPost } from '../../../../../../src/utils/ajax2promise';
import { Publish } from '../vomodels/publish';

/* global _ */

var transform = function (publish) {
    return new Publish(publish);
};

var transformEach = function (publishes) {
    return _.map(publishes, transform);
};


var PublishDao = (function () {
    var getPublishes = function () {
        var url = 'publishreports';
        return ajaxGet(url).then(transformEach);
    };

    // var getPublish = function (publishId) {
    //     var url = '/publishreports/' + publishId;
    //     return ajaxGet(url).then(function (data) {
    //         return data.length ? transform(data[0]) : null;
    //     });
    // };

    var addPublish = function (publish) {
        var url = 'publishreports/';
        return ajaxPost(url, publish).then(function () {
            return publish;
        });
    };

    // var updatePublish = function (publish) {
    //     var url = '/publishreports/' + publish.getPublishId() + '/update';
    //     return ajaxPost(url, publish).then(function () {
    //         return publish;
    //     });
    // };

    var deletePublish = function (publishId) {
        var url = 'publishreports/' + publishId + '/delete';
        return ajaxPost(url);
    };
    return {
        getPublishes: getPublishes,
        // getPublish: getPublish,
        addPublish: addPublish,
        // updatePublish: updatePublish,
        deletePublish: deletePublish
    };
}());

export { PublishDao };

