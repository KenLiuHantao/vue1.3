import Vue from 'vue'
import App from './src/index'
import VueRouter from 'vue-router'
import Routers from './routes'
import vueResource from 'vue-resource'

/* input输入框 */
import InputNumber from 'nc/input/app'
import InputGroup from 'nc/input/sInput'
/* button按钮 */
import AjaxButton from 'nc/button/button'
/* 弹框提示类组件 */
import Modal from 'nc/modal/modal'
import Message from 'nc/modal/msg'
import Alert from 'nc/modal/alert'
import Loading from 'nc/modal/loading'
import Warning from 'nc/modal/warning'
/* 内页弹框 */
import Inner from 'nc/modal/innerModal'
/* 筛选 */
import Filter from 'nc/filter/app'
/* 主体内容 */
import Container from 'nc/frame/container'
/* 外页 */
import NewApp from 'nb/newApp/app'
/* 表格 */
import Vtable from 'nc/table/app'
/* 翻页 */
import Pagination from 'nc/nav/pagination'
/* treeTable */
import TreeTable from 'nb/treeTable/box.js'
import TreeTableForProduce from 'nb/treeTableForProduct/box.js'
/* 上传 */
import Upfile from 'nc/uploadfile/app'
import UpfileGroup from 'nb/uploadGroup/app'
/* tab切换 */
import TabBar from 'nc/tab/tab-bar'
import TabContainer from 'nc/tab/tab-container'
import TabItem from 'nc/tab/tab-container-item'
/* 日期选择器 */
import DatePicker from 'nc/calendar/app'
/* 可输可选参照 */
import FuzzyCustomer from 'nb/fuzzy/customer.vue'
import FuzzyEmployee from 'nb/fuzzy/employee.vue'
import FuzzyInventory from 'nb/fuzzy/inventory.vue'
import FuzzySupplier from 'nb/fuzzy/supplier.vue'
/* 单独选择的参照 */
import ReferCurrency from 'nb/refer/currency.vue'
import ReferCustomer from 'nb/refer/customer.vue'
import ReferEmployee from 'nb/refer/employee.vue'
import ReferInventory from 'nb/refer/inventory'
import ReferProcess from 'nb/refer/process.vue'
import ReferSale from 'nb/refer/sale'
import ReferSupplier from 'nb/refer/supplier'
import ReferDepartment from 'nb/refer/department.vue'
import ReferMultiDepartment from 'nb/refer/departmentMulit.vue'
import ReferEmployeeDepartment from 'nb/refer/departmentForEmployee.vue'
import ReferDepartmentRole from 'nb/refer/departmentRole.vue'
import ReferPostAuth from 'nb/refer/postAuth.vue'
import ReferRoleAuth from 'nb/refer/roleAuth.vue'
import ReferGoodsPrice from 'nb/refer/goodsPrice.vue'
/* 分类参照 */
import CategoryCustomer from 'nb/referCategory/customer.vue'
import CategoryIndustry from 'nb/referCategory/industry.vue'
import CategorySupplier from 'nb/referCategory/supplier.vue'
import CategoryInventory from 'nb/referCategory/inventory.vue'
/* 导入 */
import Vimport from 'nb/import/app'
/* 工作流 */
import Workflow from 'nc/workFlow/app'
/* menu组件 */
import Menu from 'nc/menu/menu.vue'
import Submenu from 'nc/menu/submenu.vue'
import MenuItem from 'nc/menu/menuItem.vue'
Vue.component('InputNumber', InputNumber)
Vue.component('InputGroup', InputGroup)
Vue.component('AjaxButton', AjaxButton)
Vue.component('Modal', Modal)
Vue.component('Message', Message)
Vue.component('Alert', Alert)
Vue.component('Loading', Loading)
Vue.component('Warning', Warning)
Vue.component('Inner', Inner)
Vue.component('Filter', Filter)
Vue.component('Container', Container)
Vue.component('NewApp', NewApp)
Vue.component('Vtable', Vtable)
Vue.component('Pagination', Pagination)
Vue.component('Tret', TreeTable)
Vue.component('Tret1', TreeTableForProduce)
Vue.component('Upfile', Upfile)
Vue.component('UpfileGroup', UpfileGroup)
Vue.component('TabBar', TabBar)
Vue.component('TabContainer', TabContainer)
Vue.component('TabItem', TabItem)
Vue.component('DatePicker', DatePicker)
Vue.component('FuzzyCustomer', FuzzyCustomer)
Vue.component('FuzzyEmployee', FuzzyEmployee)
Vue.component('FuzzyInventory', FuzzyInventory)
Vue.component('FuzzySupplier', FuzzySupplier)
Vue.component('ReferCurrency', ReferCurrency)
Vue.component('ReferCustomer', ReferCustomer)
Vue.component('ReferEmployee', ReferEmployee)
Vue.component('ReferInventory', ReferInventory)
Vue.component('ReferProcess', ReferProcess)
Vue.component('ReferSale', ReferSale)
Vue.component('ReferSupplier', ReferSupplier)
Vue.component('ReferDepartment', ReferDepartment)
Vue.component('ReferMultiDepartment', ReferMultiDepartment)
Vue.component('ReferEmployeeDepartment', ReferEmployeeDepartment)
Vue.component('ReferDepartmentRole',ReferDepartmentRole)
Vue.component('ReferPostAuth',ReferPostAuth)
Vue.component('ReferRoleAuth',ReferRoleAuth)
Vue.component('ReferGoodsPrice',ReferGoodsPrice)
Vue.component('CategoryCustomer', CategoryCustomer)
Vue.component('CategoryIndustry', CategoryIndustry)
Vue.component('CategorySupplier', CategorySupplier)
Vue.component('CategoryInventory', CategoryInventory)
Vue.component('Vimport', Vimport)
Vue.component('Workflow', Workflow)
Vue.component('Menu', Menu)
Vue.component('Submenu', Submenu)
Vue.component('MenuItem', MenuItem)

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
Vue.use(vueResource)
/* 处理过期问题 */
Vue.http.interceptors.push((request, next) => {
    request.url = request.url + '.json'
     next((response) => {
         if (response.data.errCode == 'unlogin') {
             window.location.href = '/ierp/logout'
         }
         if(response.data.errCode == 'exception'){
             Vue.prototype.$confirm({
                 message:'网络错误，请刷新后重试',
                 showCancel:false,
                 confirmName:'刷新',
                 callback:(val)=>{
                     window.location.reload()
                 }
             })
         }
     });
 });



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
            document.title ='我的经管-'+r.to.title;
        }
    });
    router.start(ap, 'app')
}


