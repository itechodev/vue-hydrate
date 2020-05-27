var compiler = require('vue-template-compiler');

var res = compiler.compile('<div class="red" otherattr="1" :hasDyn="true"><ul @click="clickFunc"><li v-for="i in list" v-show="!i == 4" v-if="i > 2">{{i}}</li></ul></div>');

function generateAttrs(attrs) {
    if (!attrs) {
        return;
    }
    var r = [];
    for (var k in attrs) {
        if (attrs[k]) {
            r.push(`${k}="${attrs[k]}"`);
        }
    }
    return r.join(' ');
}


function generateHtml(node) {
    // empty node
    if (node == null) {
        return '';
    }
    // text node
    if (node.text) {
        return node.text
    }
    var str = `<${node.name}`;
    // node.attrs = {staticClass, attrs, directives}
    if (node.attrs) {
        var attrs = generateAttrs({...node.attrs.attrs, ['class']: node.attrs.staticClass});
        if (attrs) {
            str += ' ' + attrs;
        }
    }

    var selfclosing = node.name == 'img';
    if (selfclosing) {
        // cannot contain any children or text
        return '/>'
    }
    str += '>';
    if (node.children) {
        node.children.forEach(child => {
            
            str += generateHtml(child);
        });
    }
    return str + `</${node.name}>`;
}


var obj = {
    list: [1,2,3,4],
    clickFunc() {

    }
}

_e = function() {
    return null;
}

// render helper functions to be declared globally
_v = function(value) {
    return {
        text: value
    }
}

_s = function(value) {
    return value.toString();
}

 _c = function(node, a, b, normalizationType) {
    // console.log('_c', node, attrs, children, normalizationType)
    // create vNodes
    if (!b) {
        // node, children
        return {
            name: node,
            attrs: {},
            children: a
        };
    }
    // node, attrs, children, 
    return {
        name: node,
        attrs: a,
        children: b
    };
}

_l = function(arr, callback) {
    var r = [];
    for (var k in arr) {
        r.push(callback(arr[k], k));
    }
    return r;
}

console.log(res.render);

var func = new Function(res.render);
var nodes = func.call(obj);

console.log(JSON.stringify(nodes));

console.log(generateHtml(nodes));

// console.log('VNodes geneated:', nodes.children[0].children);

/*
// _c is internal that accepts `normalizationType` optimization hint
  _c: (
    vnode?: VNode,
    data?: VNodeData,
    children?: VNodeChildren,
    normalizationType?: number
  ) => VNode | void;

  // renderStatic
  _m: (index: number, isInFor?: boolean) => VNode | VNodeChildren;
  // markOnce
  _o: (vnode: VNode | Array<VNode>, index: number, key: string) => VNode | VNodeChildren;
  // toString
  _s: (value: mixed) => string;
  // text to VNode
  _v: (value: string | number) => VNode;
  // toNumber
  _n: (value: string) => number | string;
  // empty vnode
  _e: () => VNode;
  // loose equal
  _q: (a: mixed, b: mixed) => boolean;
  // loose indexOf
  _i: (arr: Array<mixed>, val: mixed) => number;
  // resolveFilter
  _f: (id: string) => Function;
  // renderList
  _l: (val: mixed, render: Function) => ?Array<VNode>;
  // renderSlot
  _t: (name: string, fallback: ?Array<VNode>, props: ?Object) => ?Array<VNode>;
  // apply v-bind object
  _b: (data: any, tag: string, value: any, asProp: boolean, isSync?: boolean) => VNodeData;
  // apply v-on object
  _g: (data: any, value: any) => VNodeData;
  // check custom keyCode
  _k: (eventKeyCode: number, key: string, builtInAlias?: number | Array<number>, eventKeyName?: string) => ?boolean;
  // resolve scoped slots
  _u: (scopedSlots: ScopedSlotsData, res?: Object) => { [key: string]: Function };
*/
