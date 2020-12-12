import {encodeQuery} from './router.js';

function makeRequest(method, payload, url) {
    return new Promise((resolve, rej) =>
    {
        const request = new XMLHttpRequest();
        request.open(method, url, true);

        request.onload = function () {
            if (request.status >= 200 && request.status < 400) {
                // Success!
                const data = JSON.parse(request.responseText);
                resolve(data);
            } else {
                // We reached our target server, but it returned an error
                rej(request.statusText, request.responseText);
            }
        };

        request.onerror = function() {
            // There was a connection error of some sort
            rej(request.statusText);
        };

        request.send();
    });
}

export default {
    install: function (Vue, options) {
        Vue.prototype.$post = function(url, data) {
            return makeRequest('POST', JSON.stringify(data), url);
        }

        Vue.prototype.$get = function(url, data) {
            return makeRequest('GET', encodeQuery(data), url);
        }
    }
}