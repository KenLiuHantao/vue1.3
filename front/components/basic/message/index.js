/**
 * Created by SkyeTang on 2017/3/21.
 */
import Vue from 'vue';
let MessageConstructor = Vue.extend(require('./main.vue'));
let instancesr = []
let seed=1
let instance
var Message = function (options) {
    options = options || {}
    if(typeof  options === 'string'){
        options = {
            message: options
        };
    }
    let sid = 'Message_'+ seed++
    let usrCallBack = options.callback
    options.callback = function () {
        Message.close(sid,usrCallBack)
    }
    instance = new MessageConstructor({
        data: options,
    });
    instance.id = sid
    instance.vm = instance.$mount();
    document.body.appendChild(instance.vm.$el);
    instance.vm.visible = true;
    instancesr.push(instance);
    return instance.vm
}
Message.close = function(id, usrCallBack) {
    for (let i = 0, len = instancesr.length; i < len; i++) {
        if (id === instancesr[i].id) {
            if (typeof usrCallBack === 'function') {
                usrCallBack(instancesr[i]);
            }
            instancesr.splice(i, 1);
            break;
        }
    }
};
export  default  Message