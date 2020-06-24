import {RealtimeGenerator} from "/src/realtimeGenerator.js";

export function webSocket(url, timeout, divId) {
    let realtimeGenerator = new RealtimeGenerator(divId)
    let chart = realtimeGenerator.divGenerator()
    var socket = new WebSocket(url);
    socket.onopen = function (event) {
        console.log('Connected!');
    };
    socket.onmessage = function (event) {
        //console.log('Received data: ' + event.data);
        realtimeGenerator.dataGenerator(event.data, chart)
        return false;
    };
    socket.onerror = function(err) {
        console.error('Socket encountered error: ', err.message, 'Closing socket');
        socket.close();
    };
    socket.onclose = function(err){
        console.log('Socket is closed. Reconnect will be attempted in 1 second.', err.reason);
        setTimeout(function() {
            console.log("Reconnect......")
            webSocket(url,timeout);
        }, timeout);    };
}