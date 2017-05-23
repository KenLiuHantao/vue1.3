<script>
import cfg from './cfg.js'
import info from './infoAndEdit.vue'
export default {
    components: {
        info,
    },
    ready() {
    },
    data() {
        return {
            leftItemCfg: cfg.leftItemCfg,
            listObj: cfg.listParam,
            tableData: [],
            actItem:'',
            isAdd:false,
            isEdit:false,
            infoCfg:{
                show:false,
                header:'编辑修改',
                width:'576px',
                btn:[{
                    name:'取消',
                    emit:'quite'
                },{
                    name:'确定',
                    emit:'sure'
                }]
            },
            importCfg:{
                show:false,
                header:'导入客户档案',
                width:'408px',
                btn:[{
                    name:'取消',
                    emit:'quite'
                },{
                    name:'确认导入',
                    emit:'sure'
                }]
            },
            customerCfg:{
                    show:false
                },
            delCfg:{
                show:false,
                type:'warning',
                msg:'是否删除此行记录'
            },
            delAllCfg:{
                show:false,
                type:'warning',
                msg:'是否删除此行记录'
            },
            warnCfg:{
                show:false,
                type:'success',
                content:''
            },
            imCfg:{
                show:false,
                title:'客户档案',
                url:__URL.arc + 'customer/upload',
                tmpUrl:__URL.arc + 'customer/download'
            },
            lockRepeatSubmit:false,
            checkData:[],
            importCategoryData: {
                name: '',
                code: ''
            },
            // 留存 newApp 最后一次操作
            paramSave: {},
        }
    },
    methods: {
        //获取列表
        getList(param) {
            this.$http.post(__URL.arc + 'customer/upload/list',param).then(
                res=>{
                    if(res.data.success){
                        // 保存 param
                        this.paramSave = param;
                        this.tableData = res.data.data.dataList;
                    }
                }
            )
        },
        getInfo(item){
            this.$http.get(__URL.arc+'customer/upload/detail/'+item.recordId).then(
                res=>{
                    if(res.data.success){
                        this.actItem = res.data.data;
                        this.infoCfg.show = true;
                    }else{
                        console.log(res.data.errMsg);
                    }
                }
            )
        },
        //详情信息
        openInfo(item){
            this.isEdit = false
            this.getInfo(item)
        },
        //新增
        addOrder(){
            this.imCfg.show = true
            this.isEdit = false
        },
        // 新增批量导入
        addSuccess (param) {
            this.getList(param);
            this.setWarningSuccess('success','导入成功');
        },
        operating(type,item){
            if(type == 'edit'){
                this.edit(item)
            }else if(type == 'delete'){
                this.del(item)
            }
        },
        //编辑
        edit(item){
            this.isEdit = true
            this.getInfo(item)
        },
        //删除提示框
        del(item){
            this.actItem = item
            this.delCfg.show = true
        },
        //删除数据
        deleteData(){
            this.$http.get(__URL.arc+'customer/upload/delete/'+this.actItem.recordId).then(
                res=>{
                    if(res.data.success){
                        this.$broadcast('_RESETLIST');
                        this.setWarningSuccess('success',res.data.data);
                        // 操作完成，重新拉取数据
                        this.getList(this.paramSave);
                    }else{
                        this.setWarningSuccess('failure',res.data.errMsg)
                    }
                }
            )
        },
        deleteAll(){
            this.delAllCfg.show = true
            if(this.checkData.length > 0 ){
                this.delAllCfg.msg = '确定要删除所选的' + this.checkData.length + '条记录吗？删除后不可恢复。'
            }else{
                this.delAllCfg.msg = '请至少选择一条记录'
            }
        },
        deleteAllData(){
            if(this.checkData.length <1) return
            let idArr = this.checkData.map(item=>{
                return item.recordId
            })
            this.$http.post(__URL.arc + 'customer/upload/delete/batch',{"recordIdArr": idArr}).then(
                res=>{
                    if(res.data.success){
                        this.$broadcast('_RESETLIST');
                        this.setWarningSuccess('success',res.data.data);
                        // 操作完成，重新拉取数据
                        this.getList(this.paramSave);
                    }else{
                        this.setWarningSuccess('failure',res.data.errMsg)
                    }
                }
            )
        },
        //设置提示信息
        setWarningSuccess(type,data){
            this.warnCfg.show = true
            this.warnCfg.content = data
            this.warnCfg.type = type
        },
        quite(){
            this.infoCfg.show =false
        },
        sure(){
            if(this.isEdit){
               if(!this.lockRepeatSubmit) this.saveData(__URL.arc + 'customer/upload/update',this.actItem)
            }else{
                this.infoCfg.show = false
            }
        },
        //保存数据
        saveData(url,param){
            if(!this.check()) return
            this.lockRepeatSubmit = true
            this.$http.post(url,param).then(
                res=>{
                    if(res.data.success){
                        this.infoCfg.show = false
                        this.$broadcast('_RESETLIST')
                        this.tableData = []
                        this.setWarningSuccess('success',res.data.data)
                        // 操作完成，重新拉取数据
                        this.getList(this.paramSave);
                    }else{
                        this.setWarningSuccess('failure',res.data.errMsg)
                    }
                    this.lockRepeatSubmit = false
                }
            )
        },
        check(){
            if(this.actItem.customerName.trim() == ''){
                this.setWarningSuccess('failure','客户名称不能为空')
                return false
            }
            if(this.actItem.industryCategoryName.trim() == ''){
                this.setWarningSuccess('failure','行业分类不能为空')
                return false
            }
            if(this.actItem.customerCategoryName == ''){
                this.setWarningSuccess('failure','客户分类不能为空')
                return false
            }
            if(this.actItem.employeeName == ''){
                this.setWarningSuccess('failure','业务员不能为空')
                return false
            }
            if(this.actItem.currencyName == ''){
                this.setWarningSuccess('failure','币种不能为空')
                return false
            }
            if(this.actItem.taxRateVal === ''){
                this.setWarningSuccess('failure','税率不能为空')
                return false
            }
            if(this.actItem.contactName == ''){
                this.setWarningSuccess('failure','联系人不能为空')
                return false
            }
            if(this.actItem.contactDuty == ''){
                this.setWarningSuccess('failure','职务不能为空')
                return false
            }
            return true
        },
        //正式导入
        importAll(){
            if(this.checkData.length < 1 ){
                this.delAllCfg.show = true
                this.delAllCfg.msg = '请至少选择一条记录'
            }else{
                this.importCfg.show = true
            }
        },
        //客户分类弹框
        customerModal(){
            this.customerCfg.show = true
        },
        //清除数据
        customerClear(){
            this.importCategoryData.name = this.importCategoryData.code = ''
        },
        //确认选择的客户分类
        customerSure(val){
            this.importCategoryData.name = val.customerCategoryName
            this.importCategoryData.code = val.customerCategoryCode
        },
        //确认导入
        sureImport(){
             if(this.importCategoryData.name == ''){
                this.setWarningSuccess('failure','请选择客户分类')
                return false
             }
             let idArr = this.checkData.map(item=>{
                return item.recordId
             })
             this.$http.post(__URL.arc + 'customer/upload/import',{"customerCategoryCode": this.importCategoryData.code,"recordIdArr": idArr })
             .then(
                res=>{
                    if(res.data.success){
                         this.$broadcast('_RESETLIST');
                         this.tableData = [];
                         this.importCfg.show = false;
                         this.setWarningSuccess('success',res.data.data);
                         // 操作完成，重新拉取数据
                         this.getList(this.paramSave);
                    }else{
                        this.setWarningSuccess('failure',res.data.errMsg)
                    }
                }
             )
        },
        quiteImport(){
            this.importCfg.show = false
        },
        clearTable(uid,obj){
            this.tableData = []
        }
    },
    computed: {
        tableCfg() {
            return cfg.tableCfg
        },
    },
}
</script>
<template>
    <container>
        <div class="body_item">
            <div class="left_item">
                <new-app :config='leftItemCfg' @tab='clearTable' @add="addOrder" @cb='getList'></new-app>
            </div>
            <div class="right_item">
                <div class="item_head btn-ic">
                    <a href="javascript:;" @click="importAll">
                        <i class='icon-in'></i>上传数据
                    </a>
                    <a href="javascript:;" @click="deleteAll">
                        <i class='icon-delete__batch'></i>批量删除
                    </a>
                </div>
                <div class="item_body">
                    <vtable :checkbox="checkData"  :config='tableCfg' @op="operating" :data='tableData' @link="openInfo"></vtable>
                </div>
            </div>
        </div>
        <!--详情弹框-->
        <modal :config="infoCfg" @quite="quite" @sure="sure">
            <info :data='actItem' :add="isAdd" :edit="isEdit"></info>
        </modal>
        <!--批量导入表弹框-->
        <vimport :config="imCfg" @cb='addSuccess'></vimport>
        <!--删除提示组件-->
        <alert :config="delCfg" @cb="deleteData"></alert>
        <!--批量删除提示-->
        <alert :config="delAllCfg" @cb="deleteAllData"></alert>
        <!--状态消息提示-->
        <warning :config="warnCfg"></warning>
        <!--确认导入分类选择弹框-->
        <modal :config="importCfg" @quite="quiteImport" @sure="sureImport">
            <div class="form-group wd-100">
                <label><span class="must-point">*</span>客户分类:</label>
                <input-group :data="importCategoryData.name" :config="{icon:'icon-reference',disabled:true}" @modal="customerModal" @clear="customerClear"></input-group>
            </div>
        </modal>
        <!--客户分类参照-->
        <category-customer :config='customerCfg' @cb='customerSure'></category-customer>
    </container>
</template>

<style lang="less" scoped>
</style>