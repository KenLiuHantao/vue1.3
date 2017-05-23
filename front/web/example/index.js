import Vue from 'vue'
import _ from 'lodash'
import App from './src/index'
import VueRouter from 'vue-router'
import Routers from './routes'
import VueResource from 'vue-resource'
import Validate from 'nb/validate/va.js'

/** 1.全局注册通用公共组件 **/

import Modal from 'nc/modal/modal'
import Inner from 'nc/modal/innerModal'
import Msg from 'nc/modal/msg'
import Alert from 'nc/modal/alert'
import Tret from 'nb/treeTable/box.js'
import Container from 'nc/frame/container'
import Pagination from 'nc/nav/pagination'

Vue.component('Modal', Modal)
Vue.component('Container', Container)
Vue.component('Msg', Msg)
Vue.component('Alert', Alert)
Vue.component('Inner', Inner)
Vue.component('Tret', Tret)
Vue.component('Pagination', Pagination)
/* 引入公共api接口配置 */
import api from '../../config/api'
window.__URL = api

/* 引入util 公共请求方法 */
import util from '../../components/basic/util/util'
Vue.use(util)

/* 注册http插件 */
Vue.use(Validate)

Vue.use(VueResource)

/* 处理过期问题 */
// Vue.http.interceptors.push((request, next) => {
//     next((response) => {
//         if (response.data.errCode == 'unlogin') {
//             window.location.href = 'logout?service=' + window.location.href
//         }
//     });
// });


/* 注册路由插件 */

Vue.use(VueRouter)

/* 实例化路由器 */

const router = new VueRouter()

/* 配置路由映射表 */

Routers(router)

/* 设置页面title */

router.afterEach(function(r) {
    if (r.to.title) {
        document.title = r.to.title;
    }
});
router.start(App, 'app')
