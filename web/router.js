import Vue from 'vue/dist/vue.common.js';


const vm = new Vue ({
    data: {
        path: null
    }
});

const routeComponents = [];

window.onpopstate = function(event) {
    refreshRouters();
}

export default function refreshRouters() {
    vm.path = document.location.pathname;
    // data.path =
    for (const r of routeComponents) {
        r.show = r.url === document.location.pathname;
    }
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
