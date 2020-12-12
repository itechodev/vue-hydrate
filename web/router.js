
export default {
    install: function(Vue, options) {

        // Inject reactive data
        // Other way is to use a global mixin, but then you'll have to use $data.$route
        const vm = new Vue({
            data: {
                path: null,
                params: {}
            }
        });

        function refresh() {
            vm.path = document.location.pathname;
        }

        window.onpopstate = refresh;


        Vue.prototype.$router = {

            get path() {
                return vm.path;
            },

            get params() {
                return vm.params;
            },

            push(url, data) {
                window.history.pushState(data, url, url);
                refresh();
            },

            match(path) {
                // reverse order
                let seg = [];
                for (let p of [...path.matchAll(/:(\w+)/g)].reverse()) {
                    path = path.substr(0, p.index) + "(\\w+)" + path.substr(p.index + p[0].length);
                    seg.unshift(p[1]);
                }

                let match = this.path.match(new RegExp(path));
                if (match != null) {
                    const newSet = {};
                    seg.forEach((s, i) => {
                        newSet[s] = match[i + 1];
                    });
                    vm.params = newSet;
                }
                return false;
            }
        }

        refresh();
    }
}