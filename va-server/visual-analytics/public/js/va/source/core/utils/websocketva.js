/**
 * Created by gy84.bae on 2016-09-02.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function WebSocketVA() {
        this.initWebSocket();
    }

    WebSocketVA.prototype.initWebSocket = function () {
        var _this = this;

        $.ajax({url: 'api/v1/websocket', type: 'GET', blocking: false}).done(function (result) {
            _this.createWebSocket(result.address);
        });
    };

    WebSocketVA.prototype.createWebSocket = function (address) {
        var _this = this;


        if (!('WebSocket' in window)) {
            console.log('no WebSocket');
        } else {

            try {
                var socket = _this.socket = new WebSocket(address + '/' + Brightics.VA.Env.Session.userId);
                socket.onopen = function () {
                    console.log("Socket has been opened!");
                    var socketSend = {
                        socketAPI: "checkDuplicate",
                        userId: Brightics.VA.Env.Session.userId
                    };
                    socket.send(JSON.toString(socketSend));
                };

                socket.onerror = function (error) {
                };

                socket.onmessage = function (message) {
                    try {
                        //로그아웃해
                        console.log(message);

                    } catch (e) {
                        console.log('This doesn\'t look like a valid JSON: ', message);
                        return;
                    }
                };

                socket.onclose = function () {
                    console.log('socket is closed.')
                }

            } catch (exception) {

            }
        }
    };
    WebSocketVA.prototype.send = function (message) {
        this.socket.send(message);
    };

    

    Brightics.VA.Core.WebSocketVA = WebSocketVA;

}).call(this);
