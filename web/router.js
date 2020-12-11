
export default {
    install: function(Vue, options) {

        // Inject reactive data
        const vm = new Vue({
            data: {
                path: null
            }
        });

        function refreshRouters() {
            vm.path = document.location.pathname;
        }

        window.onpopstate = function (event) {
            refreshRouters();
        }

        Vue.prototype.$router = {

            get path() {
                return vm.path;
            },

            push(url, data) {
                window.history.pushState(data, url, url);
                refreshRouters();
            },

            match(path) {
                return this.path === path;
            }
        }

        refreshRouters();
    }
}