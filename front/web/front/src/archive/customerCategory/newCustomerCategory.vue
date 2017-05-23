<script>
import cfg from './cfg.js'
export default {
    ready() {

    },
    data() {
        return {
            leftItemCfg: cfg.leftItemCfg,
            listObj: cfg.listParam,
            tableData: [],
            checkboxObj: [],
            // detailConfig:{
            //     show:false,
            //     width:'100%',
            //     height:'100%',
            //     title:'订单BOM详情'
            // },
            bomDetail:{},
            msgconfig:{
                type:'warning',
                show:false,
                content:''
            },
            dCfg:{
                show:false,
                msg:'',
                subMsg:'',
                type:'success',
                quite:false
            },
            newModCfg:{
                show: false,
                width: '410px',
                height: 'auto',
                header: '新增',
                btn: [{
                    name: '关闭',
                    emit: 'close',
                }, {
                    name: '确定',
                    emit: 'sure',
                }],
            },
            changeModCfg:{
                show: false,
                width: '410px',
                height: 'auto',
                header: '编辑修改',
                btn: [{
                    name: '关闭',
                    emit: 'close',
                }, {
                    name: '确定',
                    emit: 'sure',
                }],
            },
            deleteCfg:{
                show:false,
                type:'warning',
                msg:'是否删除此行记录？',
                subMsg:''
            },
            type:1,
            newCustomerCattegory:{
                customerCategoryName:'',
                remark:''
            },
            changeCustomerCattegory:{
                customerCategoryName:'',
                remark:''
            },
            deleteCustomerCatrgoryCode:''
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
        // table返回的操作参数
        operate(type, item) {
            if('edit' == type){
                this.changeCustomerCattegory=item;
                this.changeModCfg.show=true;
            }else if('delete' == type){
                this.deleteCustomerCatrgoryCode=item.customerCategoryCode;
                this.deleteCfg.show=true;
            }
        },
        href(item, type) {
            if(type=='customerCategoryName'){
                this.changeCustomerCattegory=item;
                this.changeModCfg.show=true;
            }
        },
        getFilter(item,obj) {
            if(item && obj){
                item.customerCategoryCode=obj.customerCategoryCode;
                // item.customerCategoryName=obj.customerCategoryName;
            }
            this.getList(item)
        },
        /* 数据请求 */
        getList(obj) {
            obj.showAll=0
            this.$http.post(__URL.arc + 'customer/category/search', obj).then(
                (res) => {
                    this.tableData = res.data.data.dataList
                }
            )
        },
        // closeBomDetail(text){
        //     this.detailConfig.show=false;
        //     this.refresh(text)
        // },
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
        //新增
        newAdd(){
            this.newModCfg.show=true;
        },
        newSure(){
            this.$http.post(__URL.arc + 'customer/category/insert',this.newCustomerCattegory).then(
                (res) => {
                    if(res.data.success){
                        this.newCustomerCattegory={
                            customerCategoryName:'',
                            remark:''
                        }
                        this.newModCfg.show=false;
                        this.refresh('新增成功')
                    }else{
                        this.msgconfig.show=true
                        this.msgconfig.content=res.data.errMsg
                    }
                }
            )
        },
        newClose(){
            this.newModCfg.show=false;
        },
        //修改
        changeSure(){
            this.$http.post(__URL.arc + 'customer/category/update',this.changeCustomerCattegory).then(
                (res) => {
                    if(res.data.success){
                        this.newCustomerCattegory={
                            customerCategoryName:'',
                            remark:''
                        }
                        this.changeModCfg.show=false;
                        this.refresh('修改成功')
                    }else{
                        this.msgconfig.show=true
                        this.msgconfig.content=res.data.errMsg
                    }
                }
            )
        },
        changeClose(){
            this.changeModCfg.show=false;
        },
        //删除
        singleDeleteSure(){
            this.$http.get(__URL.arc + 'customer/category/delete/'+this.deleteCustomerCatrgoryCode).then(
                (res) => {
                    if(res.data.success){
                        this.deleteCustomerCatrgoryCode=''
                        this.deleteCfg.show=false;
                        this.refresh('删除成功')
                    }else{
                        this.msgconfig.show=true
                        this.msgconfig.content=res.data.errMsg
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
        }
    }
}
</script>
<template>
    <alert  :config="dCfg"></alert> 
    <div class="body_item">
        <div class="left_item">
            <new-app :config='leftItemCfg' @tab='clearTable' @cb='getFilter' @add='newAdd'></new-app>
        </div>
        <div class="right_item">
            <div class="item_head btn-ic">
                <!-- <a href="javascript:;">
                    <i class='icon-hp_list__add'></i>test
                </a> -->
            </div>
            <div class="item_body">
                <vtable :checkbox.sync='checkboxObj' :config='tableCfg' :data='tableData' @op='operate' @link='href'>
                </vtable>
            </div>
        </div>
    </div>
    <modal :config='newModCfg' @sure='newSure' @close='newClose'>
        <div class='form-group'>
            <label><span class="must-point">*</span>客户分类:</label>
            <div class="s-input ic2">
                <input placeholder='请输入客户分类' type="text" v-model='newCustomerCattegory.customerCategoryName'>
            </div> 
        </div>
        <div class='form-group'>
            <label><span class="must-point" style='visibility: hidden;'>*</span>备注:</label>
            <div class="s-input ic2">
                <input placeholder='请输入备注' type="text" v-model='newCustomerCattegory.remark'>
            </div> 
        </div>
    </modal>
    <modal :config='changeModCfg' @sure='changeSure' @close='changeClose'>
        <div class='form-group'>
            <label><span class="must-point">*</span>客户分类:</label>
            <div class="s-input ic2">
                <input placeholder='请输入客户分类' type="text" v-model='changeCustomerCattegory.customerCategoryName'>
            </div> 
        </div>
        <div class='form-group'>
            <label><span class="must-point" style='visibility: hidden;'>*</span>备注:</label>
            <div class="s-input ic2">
                <input placeholder='请输入备注' type="text" v-model='changeCustomerCattegory.remark'>
            </div> 
        </div>
    </modal>
    <alert :config='deleteCfg' @cb='singleDeleteSure' ></alert>
    <warning :config="msgconfig" ></warning>
</template>
<style lang='less' scoped>
@import '../../../../../public/css/variable.less';
</style>
