/**
 * Created by SkyeTang on 2017/3/21.
 */
import Vue from 'vue';
let MessageConstructor = Vue.extend(require('./main.vue'));
let instances = [];
var Message = function (options) {
    if (instances.length > 0) return
    options = options || {}
    if(typeof  options === 'string'){
        options = {
            message: options
        };
    }
    let instance = new MessageConstructor({
        data: options,
    });
    instance.vm = instance.$mount();
    document.body.appendChild(instance.vm.$el);
    instance.vm.visible = true;
    instances.push(instance);
    return instance.vm
}
export  default  Message