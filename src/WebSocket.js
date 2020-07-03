import {RealtimeGenerator} from "./realtimeGenerator.js";

export function webSocket(url, timeout, divId) {
    let realtimeGenerator = new RealtimeGenerator(divId)
    let chart = realtimeGenerator.divGenerator()
    var socket = new WebSocket(url);
    socket.onopen = function (event) {
    };
    socket.onmessage = function (event) {
        //console.log('Received data: ' + event.data);
        realtimeGenerator.dataGenerator(event.data, chart)
        return false;
    };
    socket.onerror = function(err) {
        socket.close();
    };
    socket.onclose = function(err){
        setTimeout(function() {
            webSocket(url,timeout);
        }, timeout);    };
}