import Vue from 'vue/dist/vue.common.js';
import Router from './router';
import Ajax from './ajax.js';

Vue.use(Router);
Vue.use(Ajax);

// make vm's accessible through all Vue components
Vue.prototype.$instances = {};

// a list of Vue`s life cycle function names
const lifecycles = ['data', 'watch', 'computed', 'beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed'];

function iterateQuerySelector(on, query, callback) {
    const list = on.querySelectorAll(query);
    for (let i = 0; i < list.length; i++) {
        const l = list[i];
        if (l.nodeType === Node.ELEMENT_NODE) {
            callback(l);
        }
    }
}

// IE 9 compatible document ready
function ready(fn) {
    if (document.readyState === 'complete') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

function addVm(el, ins) {
    const ref = el.attributes.getNamedItem("ref");
    if (ref) {
        Vue.prototype.$instances[ref.value] = ins;
    }
}

function startsWith(s, n) {
    // ie9 support
    return s.indexOf(n) === 0;
}




// wait for document to be ready
ready(() => {

    // Search for declarative vue instances in the dom
    iterateQuerySelector(document.body, '[v-data]', el => {
        // remove all v-hydrated from the dom. Should not be compiled
        iterateQuerySelector(el, '[v-hydrated]', hy => {
            hy.remove();
        });
        
        // No real value here to use type safety
        // var options: ComponentOptions<Vue> = {  
        const options = {
            el: el,
            data: {},
            methods: {},
            watch: {},
            computed: {}
        };

        const value = el.attributes.getNamedItem("v-data").value;
        let data = {};

        if (value) {
            try {
                data = (new Function('return ' + value)).call(window);
            }
            catch (err) {
                console.error('Could not execute v-data expression. ', err);
            }
        }
        
        //  now remove the v-data to avoid err
        // [Vue warn]: Failed to resolve directive: data
        el.attributes.removeNamedItem('v-data');

        for (const k in data) {
            const v = data[k];
            if (startsWith(k, 'watch_')) {
                // add as a watch
                options.watch[k.substr(6)] = v;
                continue; 
            }
            if (startsWith(k, 'computed_')) {
                // add as computed
                options.computed[k.substr(9)] = v;
                continue;
            }
            if (typeof v == 'function') {
                if (lifecycles.indexOf(k) !== -1) {
                    options[k] = v;
                    continue;
                }
                options.methods[k] = v;
                continue;
            }
            // else it is data
            options.data[k] = v;
        }
        addVm(el, new Vue(options));
    });

    // hydrate all registered vue components through Vue.component
    for (const tag in Vue.options.components) {
        iterateQuerySelector(document.body, tag, el => {
            const vm = new Vue({el});
            // the vm has only one instance
            addVm(el, vm.$children[0]);
        });
    }
});

