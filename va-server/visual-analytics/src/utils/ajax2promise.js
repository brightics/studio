/**
 * hyunseok.oh@samsung.com
 * 2018. 01. 30
 */

/**
 * @param {Object} options 옵션
 * @return {Promise<Object>}
 */
var ajax2Promise = function (options) {
    return Promise.resolve($.ajax(options));
};

/**
 * 해당 URL로 GET 요청
 * @param {String} url 요청 url
 * @return {Promise<Object>}
 */
var get = function (url) {
    var options = {
        type: 'GET',
        url: url
    };
    return ajax2Promise(options);
};

/**
 * 해당 URL로 POST 요청
 * @param {String} url 요청url
 * @return {Promise<Object>}
 */
var post = function (url, data) {
    var options = {
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json; charset=utf-8',
        url: url
    };
    return ajax2Promise(options);
};

var getSync = function (url) {
    var options = {
        type: 'GET',
        url: url,
        async: false
    };
    return ajax2Promise(options);
};

var postSync = function (url, data) {
    var options = {
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json; charset=utf-8',
        url: url,
        async: false
    };
    return ajax2Promise(options);
};

export { get as ajaxGet, post as ajaxPost, getSync as ajaxGetSync, postSync as ajaxPostSync };
