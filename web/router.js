
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

            // /book/12 match /:book/:id

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
                // convert /:book/:id to regex /\/(\w+)\/(\w+)/

                return false;
            }
        }

        refresh();
    }
}