import Vue from 'vue';

(function(Vue) {
    // add Vue to global namespace
    window.Vue = Vue;

    // make vm's accessible through all Vue components 
    Vue.prototype.$instances = {};

    // a list of Vue's life cycle function names
    const vueoptions: string[] = ['watch', 'computed', 'beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestory', 'destroyed'];

    function iterateQuerySelector(on: HTMLElement, query: string, callback: (node: HTMLElement) => void) {
        var list = on.querySelectorAll(query);
        for (var i = 0; i < list.length; i++) {
            var l = list[i];
            if (l.nodeType == Node.ELEMENT_NODE) {
                callback(l as HTMLElement);
            }
        }
    }
    
    // IE 9 compatible document ready
    function ready(fn: () => void) {
        if (document.readyState == 'complete') {
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

    function startsWith(s, n) {
        if (s.startsWith) {
            return s.startsWith(n);
        }
        // ie9 support
        return s.indexOf(n) == 0;
    }

    // wait for document to be ready
    ready(() => {
        
        // Search for declarative vue instances in the dom
        iterateQuerySelector(document.body, '[v-data]', el => {
            // remove all v-hydrated from the dom. Should not be part of the compiler
            iterateQuerySelector(el, '[v-hydrated]', hy => {
                hy.remove();
            });

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
            iterateQuerySelector(document.body, tag, el => {
                var vm = new Vue({el});
                // the vm has only one instance
                addVm(el, vm.$children[0]);
            });
        }
    });
})(Vue);