/* -----------------------------------------------------
 *  tab-channel.js
 *  Created by hyunseok.oh@samsung.com on 2018-08-08.
 * ---------------------------------------------------- */

/* global _ */
import {EventEmitter} from '../event-emitter/event-emitter';

var TAB_CHANNEL_PREFIX = '_TAB_CH_';
var DEFAULT_TIMEOUT = 5000;

export function TabChannel(connectionKey) {
    this.ee = new EventEmitter();
    this.connectionKey = connectionKey;

    window.addEventListener('storage', (function (ee) {
        return function (storageEvent) {
            var key = storageEvent.key;
            var newValue = (JSON.parse(storageEvent.newValue) || {});
            ee.emit(key, newValue);
        };
    }(this.ee)));
}

TabChannel.prototype.request = function (topic, data, _opt) {
    var self = this;
    var timeout = (_opt || {}).timeout || DEFAULT_TIMEOUT;
    return new Promise(function (resolve, reject) {
        var cur = Date.now();
        var requestKey = 'req_' + cur;
        var done = function (res) {
            if (res.connectionKey !== self.connectionKey) return;
            if (res.requestKey === requestKey) {
                resolve(res.value);
                self.off(topic, done);
            }
        };
        self.on(topic, done);
        // TODO : (request시작 -> 응답이 timeout인데,
        //         request시작 -> request의 timeout으로 변경 필요
        //         현재는 request 받는데 성공했지만 response까지의 시간이 길경우 TIMEOUT error를 띄움
        setTimeout(function () {
            reject(new Error('TIMEOUT'));
            self.off(topic, done);
        }, timeout);

        self.emit(topic, {
            timestamp: cur,
            requestKey: 'req_' + cur,
            connectionKey: self.connectionKey,
            value: data,
            timeout: timeout
        });
    });
};

TabChannel.prototype.setConnectionKey = function (connectionKey) {
    this.connectionKey = connectionKey;
};

TabChannel.prototype.getConnectionKey = function () {
    return this.connectionKey;
};

TabChannel.prototype.listen = function (topic, cb) {
    var self = this;
    self.on(topic, function (req) {
        if (req.connectionKey !== self.connectionKey) return;
        var cur = Date.now();
        if (cur - req.timestamp >= req.timeout) return;
        self.emit(topic, _.assign({}, req, {
            value: cb(req),
            timestamp: cur,
            responseKey: 'res_' + cur
        }));
    });
};

TabChannel.prototype.on = function (topic, cb) {
    this.ee.on(TAB_CHANNEL_PREFIX + topic, cb);
};

TabChannel.prototype.off = function (topic, cb) {
    this.ee.off(TAB_CHANNEL_PREFIX + topic, cb);
};

TabChannel.prototype.emit = function (topic, data) {
    localStorage.setItem(TAB_CHANNEL_PREFIX + topic, JSON.stringify(data));
};
