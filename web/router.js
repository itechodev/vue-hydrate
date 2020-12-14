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
                query: {},
                hit: {}
            }
        });

        const cache = [];

        function parsePath(path) {
            // reverse order
            let seg = [];
            for (let p of [...path.matchAll(/:(\w+)/g)].reverse()) {
                path = path.substr(0, p.index) + "(\\w+)" + path.substr(p.index + p[0].length);
                seg.unshift(p[1]);
            }
            return {seg, pattern: path};
        }

        function matchRoute(route) {
            let match = vm.path.match(new RegExp(route.pattern));
            if (match != null) {
                const newSet = {};
                route.seg.forEach((s, i) => {
                    newSet[s] = match[i + 1];
                });
                vm.params = newSet;
                Vue.set(vm.hit, route.path, true)
            } else
                Vue.set(vm.hit, route.path, false)
        }

        function refresh() {
            vm.path = document.location.pathname;
            vm.query = decodeQuery(document.location.search);

            for (let obj of cache) {
                matchRoute(obj);
            }
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
                let hit = vm.hit[path];
                if (hit === undefined) {
                    let {pattern, seg} = parsePath(path);
                    let route = { path,  pattern,  seg };
                    cache.push(route);
                    matchRoute(route);
                    return false;
                }
                return hit;
            }
        }

        // initial path query params
        refresh();
    }
}