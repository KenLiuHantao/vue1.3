<script>
import cfg from './cfg.js'
import newcustomer from './newCustomer'
import customerDetail from './customerDetail'
export default {
    components: {
        newcustomer,
        customerDetail,
    },
    ready() {

    },
    data() {
        return {
            leftItemCfg: cfg.leftItemCfg,
            listObj: cfg.listCfg,
            tableData: [],
            checkboxArr: [],
            addConfig:{
                show: false,
                width: '100%',
                height: '100%',
                title: '新增客户档案',
            },
            detailConfig:{
                show:false,
                width:'100%',
                height:'100%',
                title:'客户档案详情'
            },
            customerdetail:{},
            dCfg:{
                show:false,
                msg:'',
                subMsg:'',
                type:'success',
                quite:false
            },
            importCfg:{
                show:false,
                title:'客户档案',
                url:__URL.arc +'customer/upload',
                tmpUrl:__URL.arc+'customer/download',
            },
            msgconfig:{
                show:false,
                content:''
            },
            cdCfg:{
                show:false,
                msg:'是否删除此客户档案？',
                subMsg:'',
                type:'failure'
            },
            deleteItem:{},
            edit : false
        }
    },
    methods: {
        /* 公用方法 */
        assign(base, target) {
            let tk = Object.keys(target)

            for (let i in base) {
                if (tk.indexOf(i) != -1) {
                    target[i] = base[i]
                }
            }
        },
        /* 重置对象 */
        initListObj(obj) {
            let init = {
                "customerCategoryCode": obj.customerCategoryCode?obj.customerCategoryCode:'',
                "customerContact": obj.customerContact?obj.customerContact:'',
                "customerName": obj.customerName?obj.customerName:'',
                "employeeCode": obj.employeeCode?obj.employeeCode:'',
                "employeeName": obj.employeeName?obj.employeeName:'',
                "keyWord": obj.keyWord?obj.keyWord:'',
                "pageIndex": 0,
                "pageSize": 0
            }
            return init
        },
        // table返回的操作参数
        operate(type, item) {
            if('edit' == type){
                this.$http.get(__URL.arc+'customer/detail/'+item.customerCode).then(
                    (res) => {
                        this.customerdetail=res.data.data;
                        this.detailConfig.show=true;
                        this.edit = true;
                    }
                )
            }else if('delete' == type){
                this.deleteItem=item;
                this.cdCfg.show=true;
            }
        },
        href(item, type) {
            if(type=='customerName'){
                this.$http.get(__URL.arc+'customer/detail/'+item.customerCode).then(
                    (res) => {
                        this.customerdetail=res.data.data;
                        this.detailConfig.show=true;
                        this.edit = false;
                    }
                )
            }
        },
        getFilter(item) {
            this.listObj = this.initListObj(item)
            this.getList()
        },
        /* 数据请求 */
        getList() {
            this.$http.post(__URL.arc + 'customer/list', this.tableParams).then(
                (res) => {
                    this.tableData = res.data.data.dataList
                }
            )
        },
        //新增按钮事件
        addNew(){
            this.addConfig.show=true;
        },
        //关闭新增页面
        closeNewCustomer(text){
            this.addConfig.show=false;
            this.refresh(text)
        },
        //关闭详情页面
        closeCustomerDetail(text){
            this.detailConfig.show=false;
            this.refresh(text)
        },
        //刷新外页
        refresh(text){
            // this.tableData=[];
            // this.getList()
            if(text){
                this.dCfg.msg=text;
                this.dCfg.show=true;
            }
            this.$broadcast('_RESETLIST')
            this.tableData=[]
        },
        //导入导出
        // inputData(){
        //     this.importCfg.show=true
        // },
        // outputData(){
        //     if(this.listObj){
        //         this.$exportData(__URL.arc + 'customer/download/list',this.tableParams)
        //     }
        // },
        // inputcb(val){
        //     if(val.ok==true){
        //         this.dCfg.msg='导入成功';
        //         this.dCfg.show=true;
        //     }
        // }
        sureDeleteCustomer(){
            this.$http.get(__URL.arc+'customer/delete/'+this.deleteItem.customerCode).then(
                (res) => {
                    if(res.data.success){
                        this.refresh('删除成功')
                    }else{
                        this.msgconfig.type='warning';
                        this.msgconfig.content=res.data.errMsg;
                        this.msgconfig.show=true;
                    }
                }
            )
        },
        clearTable(uid,obj){
            this.tableData = []
        }
    },
    computed: {
        /* 参数获取 */
        tableUrl() {
            return cfg.table.baseParams.url
        },
        tableCfg() {
            return cfg.tableCfg
        },
        tableParams() {
            let param = {
                "customerCategoryCode": this.listObj.customerCategoryCode,
                "customerContact": this.listObj.customerContact,
                "customerName": this.listObj.customerName,
                "employeeCode": this.listObj.employeeCode,
                "employeeName": this.listObj.employeeName,
                "keyWord": this.listObj.keyWord,
                "pageIndex": 0,
                "pageSize": 0
            }

            return param
        }
    }
}
</script>
<template>
    <container>
        <alert @cb='sureDeleteCustomer' :config="cdCfg"></alert>
        <alert  :config="dCfg"></alert>  
        <div class="body_item">
            <div class="left_item">
                <new-app :config='leftItemCfg' @tab='clearTable' @cb='getFilter' @add='addNew'></new-app>
            </div>
            <div class="right_item">
                <div class="item_head btn-ic">
                    <!-- <a @click='batchDelete' href="javascript:;">
                        <i class='icon-delete'></i>批量删除
                    </a>
                    <a  href="javascript:;">
                        <i class='icon-out'></i>导出
                    </a> -->
                </div>
                <div class="item_body">
                    <vtable :checkbox.sync='checkboxArr' :config='tableCfg' :data='tableData' @op='operate' @link='href'>
                    </vtable>
                </div>
            </div>
        </div>
    </container>
    <!-- 新增内页-->
    <inner :config='addConfig'>
        <newcustomer @refresh='closeNewCustomer'></newcustomer>
    </inner>
    <!-- 详情内页-->
    <inner :config='detailConfig'>
        <customer-detail :detail='customerdetail' @refresh='closeCustomerDetail' :edit='edit'></customer-detail>
    </inner>
    <v-import :config="importCfg" @cb="inputcb"></v-import>
    <warning :config="msgconfig" ></warning>
</template>
<style lang='less' scoped>
@import '../../../../../public/css/variable.less';
.body_item .item_head.btn-ic a{
    width: 80px;
}
</style>
