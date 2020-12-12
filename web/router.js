function decodeQuery(queryString) {
    const query = {};
    const pairs = (queryString.charAt(0) === '?' ? queryString.substr(1) : queryString).split('&');
    for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
}

export function encodeQuery(query) {
    let q = [];
    for (let k in query) {
        if (query.hasOwnProperty(k))
            q.push(k + '=' + encodeURIComponent(query[k]));
    }
    return q.join();
}


export default {
    install: function(Vue, options) {

        // Inject reactive data
        // Other way is to use a global mixin, but then you'll have to use $data.$route
        const vm = new Vue({
            data: {
                path: null,
                params: {},
                query: {}
            }
        });


        function refresh() {
            vm.path = document.location.pathname;
            vm.query = decodeQuery(document.location.search);
        }


        window.onpopstate = refresh;


        Vue.prototype.$router = {

            get path() {
                return vm.path;
            },

            get params() {
                return vm.params;
            },

            get query() {
                return vm.query;
            },

            push(url, query) {
                if (query && typeof query === 'object')
                    url += '?' + encodeQuery(query)
                window.history.pushState(null, null, url);
                refresh();
            },

            match(path) {
                // reverse order
                let seg = [];
                for (let p of [...path.matchAll(/:(\w+)/g)].reverse()) {
                    path = path.substr(0, p.index) + "(\\w+)" + path.substr(p.index + p[0].length);
                    seg.unshift(p[1]);
                }

                let match = vm.path.match(new RegExp(path));
                if (match != null) {
                    const newSet = {};
                    seg.forEach((s, i) => {
                        newSet[s] = match[i + 1];
                    });
                    vm.params = newSet;
                    return true;
                }
                return false;
            }
        }

        refresh();
    }
}