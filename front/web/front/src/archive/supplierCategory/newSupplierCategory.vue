<script>


import cfg from './cfg.js'

export default {
    components: {
    },
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
                width: '576px',
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
            newSupplierCattegory:{
                supplierCategoryName:'',
                remark:''
            },
            changeSupplierCattegory:{
                supplierCategoryName:'',
                remark:''
            },
            deleteSupplierCatrgoryCode:''
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
            if(type=='edit'){
                this.changeSupplierCattegory=JSON.parse(JSON.stringify(item));
                this.changeModCfg.show=true;
            }else if(type=='delete'){
                this.deleteSupplierCatrgoryCode=item.supplierCategoryCode;
                this.deleteCfg.show=true;
            }
        },
        href(item, type) {
            if(type=='supplierCategoryName'){
                this.changeSupplierCattegory=JSON.parse(JSON.stringify(item));
                this.changeModCfg.show=true;
            }
        },
        getFilter(item,obj) {
            if(item && obj){
                item.supplierCategoryCode=obj.supplierCategoryCode;
            }
            this.getList(item)
        },
        /* 数据请求 */
        getList(obj) {
            obj.showAll=0
            this.$http.post(__URL.arc + 'supplier/category/search', obj).then(
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
            this.$broadcast('_RESETLIST');
            this.tableData=[];
        },
        //新增
        newAdd(){
            this.newModCfg.show=true;
        },
        newSure(){
            this.$http.post(__URL.arc + 'supplier/category/insert',this.newSupplierCattegory).then(
                (res) => {
                    if(res.data.success){
                        this.newSupplierCattegory={
                            supplierCategoryName:'',
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
            this.$http.post(__URL.arc + 'supplier/category/update',this.changeSupplierCattegory).then(
                (res) => {
                    if(res.data.success){
                        this.newSupplierCattegory={
                            supplierCategoryName:'',
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
            this.$http.get(__URL.arc + 'supplier/category/delete/'+this.deleteSupplierCatrgoryCode).then(
                (res) => {
                    if(res.data.success){
                        this.deleteSupplierCatrgoryCode=''
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
        <div class="pd-10">
            <div class='form-group'>
                <label><span class="must-point">*</span>供应商分类:</label>
                <div class="s-input ic2">
                    <input placeholder='请输入供应商分类'   type="text" v-model='newSupplierCattegory.supplierCategoryName'>
                </div>
            </div>
            <div class='form-group'>
                <label><span class="must-point" style='visibility: hidden;'>*</span>备注:</label>
                <div class="s-input ic2">
                    <input placeholder='请输入备注'   type="text" v-model='newSupplierCattegory.remark'>
                </div>
            </div>
        </div>
    </modal>
    <modal :config='changeModCfg' @sure='changeSure' @close='changeClose'>
        <div class="pd-10">
            <div class='form-group'>
                <label><span class="must-point">*</span>供应商分类:</label>
                <div class="s-input ic2">
                    <input placeholder='请输入供应商分类'   type="text" v-model='changeSupplierCattegory.supplierCategoryName'>
                </div>
            </div>
            <div class='form-group'>
                <label><span class="must-point" style='visibility: hidden;'>*</span>备注:</label>
                <div class="s-input ic2">
                    <input placeholder='请输入备注'   type="text" v-model='changeSupplierCattegory.remark'>
                </div>
            </div>
        </div>
    </modal>
    <alert :config='deleteCfg' @cb='singleDeleteSure' ></alert>
    <warning :config="msgconfig" ></warning>
</template>
<style lang='less' scoped>
@import '../../../../../public/css/variable.less';
.body_item .item_head.btn-ic a{
    width: 80px;
}
.pd-10 {
    padding: 10px;
}
</style>
