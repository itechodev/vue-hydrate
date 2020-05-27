# vue-hydrate
This tiny utility will enable you to use Vue in a declarative way in your static markup with some added benefits. No code needed to create and mount a Vue instance - it's all part of your markup. This utility is really small (<100 lines, 1Kb) and doesn't do anything on its own. It's only brings the power of Vue in a another way. 

## Why?
The DOM on its own is never enough. You'll always want some degree of iteraction. But you don't always  want to have webpack or any bundles as a dependencies. Or maybe your page simply doesn't fit a modern PWA model. Or maybe you just want to design interactive mockups or need some interactivity on your static SSR pages. Or maybe you are looking for a Vue-way to replace Jquery.

## Usage
Vue is already bundles in this package. Note you only need to include the packge. Nothing more.
### NPM
```shell
npm install vue-hydrate
```
```js
import 'vue-hydrate';
```

### CDN 
```html
<script src="https://unpkg.com/vue-hydrate@1.0/dist/vue-hydrate-bundle.js"></script>
```

# Features
You can use any of Vue's rich feature sets. Start learning from https://vuejs.org/v2/guide/#Declarative-Rendering. 
Vue-hydate adds the following 4 features:

## v-data
The v-data attribute will create a new Vue instance and start hydration on this element and its children. It can be empty or must be a valid javascript expression resulting in a object. This object will be mapped to the vm's options with the following rules.

- Method names that contains ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestory', 'destroyed'] will be created as a lifecycle method.
- Any other method will be mapped to methods.
- Any other will be added to data.

## Ref
Optional but necessarly to address this instance from outside.

## $instances
An dictionary with name keys and instance values. Accessibly on any vue component.

## Component hydration
You can use any globally registred component on any place - not just inside vue instances. Vue-hydate will mount and hydate this component as a vue instance. The ref attribute and $instances is also usable here.

# Example
```html
<div v-data="{message: 'Hydration works', count: 1}" ref="first">
    <div @click="count++">{{ message }} with count: {{ count }}</div>
</div>

<div v-data="data">
    <div @click="inc">{{ message }} with count: {{ count }}</div>
</div>

<script>

var data = {
    count: 1,
    mounted() {
        console.log('Instance mounted');
    },
    message: 'Increase both',
    inc() {
        this.count++;
        this.$instances.first.count++;
    }
}
</script>
```

# Recommended
Because vue compiler is used to parse the DOM before hydration it is recommended to use Vue's cloak and pre directive for better performance and experience.

Check out Vue's official documentaion:

https://vuejs.org/v2/api/#v-cloak

https://vuejs.org/v2/api/#v-pre


