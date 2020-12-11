import Vue from 'vue/dist/vue.common.js';

const routeComponents = [];

window.onpopstate = function(event) {
    refreshRouters();
}

export default function refreshRouters() {
    for (const r of routeComponents) {
        r.show = r.url === document.location.pathname;
    }
}

Vue.component('v-route', {
    props: {
        url: String
    },
    created() {
        routeComponents.push(this);
    },
    beforeDestroy() {
        routeComponents.splice(routeComponents.indexOf(this), 1)
    },
    data() {
        return { show: false}
    },
    render(h) {
        if (this.show)
            return h('div', this.$slots.default);

        return null;
    }
});


Vue.prototype.$router = {
    push(url, data) {
        window.history.pushState(data, url, url);
        refreshRouters();
    }
}
