import Vue from 'vue'
import App from './src/index'
import VueRouter from 'vue-router'
import Routers from './routes'
import VueResource from 'vue-resource'



/* 弹框提示类组件 */
import Modal from 'nc/modal/modal'
import msg from 'nc/modal/msg'
import Alert from 'nc/modal/alert'
import Warning from 'nc/modal/warning'
/* 内页弹框 */
import Inner from 'nc/modal/innerModal'
/* 主体内容 */
import Container from 'nc/frame/container'
import Workflow from 'nc/workFlow/app'
import Upfile from 'nc/uploadfile/app'

Vue.component('Modal', Modal)
Vue.component('msg', msg)
Vue.component('Alert', Alert)
Vue.component('Warning', Warning)
Vue.component('Inner', Inner)
Vue.component('Container', Container)
Vue.component('Workflow', Workflow)
Vue.component('Upfile', Upfile)



/* 引入公共api接口配置 */
import api from '../../config/api'
window.__URL = api



/* 引入util 公共请求方法 */
import util from '../../components/basic/util/util'
Vue.use(util)



/*验证组件*/
import va from 'nb/validate/va'
Vue.use(va)




/* 注册http插件 */
Vue.use(VueResource)




/* 注册路由插件 */
Vue.use(VueRouter)
/* 实例化路由器 */
const router = new VueRouter()
/* 根据用户是否初始化 重新配置路由映射表 */



initRout(Routers,App)
/* 启动项目 */
function initRout(val,ap) {
    router.map(val)
    router.afterEach(function(r) {
        if (r.to.title) {
            document.title = r.to.title;
        }
    });
    router.start(ap, 'app')
}


