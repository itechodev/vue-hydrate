import Vue from 'vue';

(function(Vue) {
    // add Vue to global namespace
    window.Vue = Vue;

    // make vm's accessible through all Vue components 
    Vue.prototype.$instances = {};
    
    // a list of Vue's life cycle function names
    const vueoptions: string[] = ['watch', 'computed', 'beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestory', 'destroyed'];

    function iterateQuerySelector(query: string, callback: (node: HTMLElement) => void) {
        var list = document.querySelectorAll(query);
        for (var l of list) {
            if (l.nodeType == Node.ELEMENT_NODE) {
                callback(l as HTMLElement);
            }
        }
    }
    
    // IE 9 compatible document ready
    function ready(fn: () => void) {
        if (document.readyState != 'loading'){
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    function addVm(el: HTMLElement, ins: Vue) {
        var ref = el.attributes.getNamedItem("ref");
        if (ref) {
            Vue.prototype.$instances[ref.value] = ins;
        }
    }

    // wait for document to be ready
    ready(() => {
        // Search for declarative vue instances in the dom
        iterateQuerySelector('[v-data]', el => {
            var options = {
                el: el,
                data: {},
                methods: {},
                watch: {},
                computed: {}
            };
            
            var value = el.attributes.getNamedItem("v-data").value;
            var data = {};
            if (value) {
                try {
                    data = (new Function('return ' + value))(this);
                }
                catch (err) {
                    console.error('Could not execute v-data expression. ', err);
                }
            }

            //  now remove the v-data to avoid err
            // [Vue warn]: Failed to resolve directive: data
            el.attributes.removeNamedItem('v-data');

            for (var k in data) {
                var v = data[k];
                if (k.startsWith('watch_')) {
                    // add as a watch
                    options.watch[k.substr(6)] = v;
                    continue; 
                }
                if (k.startsWith('computed_')) {
                    // add as computed
                    options.computed[k.substr(9)] = v;
                    continue;
                }
                if (typeof v == 'function') {
                    if (vueoptions.indexOf(k) != -1) {
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
        for (var tag in (Vue as any).options.components) {
            iterateQuerySelector(tag, el => addVm(el, new Vue({el})));
        }
    });
})(Vue);