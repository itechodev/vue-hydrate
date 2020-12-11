
export default {
    install: function(Vue, options) {

        // Inject reactive data
        // Other way is to use a global mixin, but then you'll have to use $data.$route
        const vm = new Vue({
            data: {
                path: null
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

            push(url, data) {
                window.history.pushState(data, url, url);
                refresh();
            },

            match(path) {
                return this.path === path;
            }
        }

        refresh();
    }
}