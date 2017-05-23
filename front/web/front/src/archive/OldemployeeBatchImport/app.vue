<script>
import cfg from './cfg.js'
import changeEmployee from './changeEmployee'
export default {
    components: {
        changeEmployee,
    },
    ready() {

        //获取筛选参照
        this.$http.post(__URL.arc + 'employee/upload/department/ref',{}).then(
            (res) => {
                if(res.data.success){
                    let _data=res.data.data.dataList;
                    for(let i=0;i<_data.length;i++){
                        cfg.leftItemCfg.filterCfg[3].option.push(_data[i])
                    }
                }else{
                    this.msgconfig.type='warning';
                    this.msgconfig.show=true
                    this.msgconfig.content=res.data.errMsg
                }
            }
        )
        this.$http.post(__URL.arc + 'employee/upload/role/ref',{}).then(
            (res) => {
                if(res.data.success){
                    let _data=res.data.data.dataList;
                    for(let i=0;i<_data.length;i++){
                        cfg.leftItemCfg.filterCfg[4].option.push(_data[i])
                    }
                }else{
                    this.msgconfig.type='warning';
                    this.msgconfig.show=true
                    this.msgconfig.content=res.data.errMsg
                }
            }
        )
    },
    data() {
        return {
            msgconfig:{
                type:'warning',
                show:false,
                content:''
            },
            leftItemCfg: cfg.leftItemCfg,
            listObj: cfg.listCfg,
            tableData: [],
            checkboxObj: [],
            customerdetail:{},
            dCfg:{
                show:false,
                msg:'',
                subMsg:'',
                type:'success',
                quite:false
            },
            importAlertCfg:{
                show:false,
                msg:'',
                subMsg:'',
                type:'success',
                quite:false
            },
            changeModCfg:{
                show: false,
                width: '575px',
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
            importModCfg:{
                show: false,
                width: '400px',
                height: 'auto',
                header: '导入人事档案',
                btn: [{
                    name: '关闭',
                    emit: 'close',
                }, {
                    name: '确认导入',
                    emit: 'sure',
                }],
            },
            changeData:{
                "recordId" : "",
                "recordVersion" : 1,
                "jobNumber" : "",
                "name" : "",
                "sex" : "",
                "phone" : "",
                "idCard" : "",
                "email" : "",
                "departmentName" : "",
                "roleName" : "",
                "enterDate" : "",
                "status" : 0,
                "message" : ""
            },
            deleteData:{},
            singleDeleteCfg:{
                show:false,
                type:'warning',
                msg:'',
                subMsg:''
            },
            importCfg:{
                show:false,
                title:'人事档案',
                url:__URL.arc +'employee/upload/wait',
                tmpUrl:__URL.arc+'employee/download',
            },
            batchDeleteCfg:{
                show:false,
                type:'warning',
                msg:'',
                subMsg:''
            },
            importDepartment:'',
            importDepartmentSave:'',
            departmentCfg:{
                show:false,
                data:{}
            },
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
                "departmentName": obj.departmentName?obj.departmentName:'',
                "employeeName": obj.employeeName?obj.employeeName:'',
                "endDate": obj.endDate?obj.endDate:'',
                "flag": 0,
                "jobNumber": obj.jobNumber?obj.jobNumber:'',
                "pageIndex": 0,
                "pageSize": 0,
                "phone": obj.phone?obj.phone:'',
                "roleName": obj.roleName?obj.roleName:'',
                "startDate": obj.startDate?obj.startDate:''
            }
            return init
        },
        // table返回的操作参数
        operate(type, item) {
            if('edit' == type){
                this.changeData=item;
                this.changeModCfg.show=true;
            }else if('delete' == type){
                this.deleteData=item;
                this.singleDelete();
            }
        },
        href(item, type) {

        },
        getFilter(item) {
            this.listObj = this.initListObj(item);
            this.getList();
            /* bug2326 导入档案-确认部门中，默认部门更改为当前选择数据的部门 */
            this.checkboxObj = [];
            this.importDepartment = this.listObj.departmentName;
            if (this.importDepartment != '') this.importDepartmentSave = this.importDepartment;
        },
        /* 数据请求 */
        getList() {
            if(this.tableParams.departmentName=='(无部门)' && this.tableParams.roleName=='(无岗位)'){
                this.tableParams.roleName=''
                this.tableParams.departmentName=''
                this.flag=3
            }else if(this.tableParams.departmentName=='(无部门)'){
                this.tableParams.flag=1;
                this.tableParams.departmentName=''
            }else if(this.tableParams.roleName=='(无岗位)'){
                this.tableParams.flag=2;
                this.tableParams.roleName=''
            }
            this.$http.post(__URL.arc + 'employee/upload/list', this.tableParams).then(
                (res) => {
                    if(res.data.success){
                        this.tableData = res.data.data.dataList
                        // for(let i=0;i<this.tableData.length;i++){
                        //     if(this.tableData[i].status==0){
                        //         this.tableData[i].status='未通过'
                        //     }else if(this.tableData[i].status==1){
                        //         this.tableData[i].status='已通过'
                        //     }
                        // }
                    }else{
                        this.msgconfig.type='warning';
                        this.msgconfig.show=true
                        this.msgconfig.content=res.data.errMsg
                    }
                }
            )
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
        //正式导入
        importData(){
            /* 未选择部门和人员时，点击导入触发 warning */
            if(this.importDepartmentSave == '' || this.checkboxObj.length == 0){
                this.msgconfig.type='warning';
                this.msgconfig.content='请选择部门和人员后，再进行导入操作';
                this.msgconfig.show=true;
                return
            }
            this.importDepartment = this.checkboxObj[0].departmentName || this.importDepartmentSave;
            this.importModCfg.show=true;
        },
        importSure(){
            if(this.importDepartment==''){
                this.msgconfig.type='warning';
                this.msgconfig.content='请选择部门';
                this.msgconfig.show=true;
                return
            }
            if(this.checkboxObj.length==0){
                this.msgconfig.type='warning';
                this.msgconfig.content='请选择人员';
                this.msgconfig.show=true;
                return
            }
            this.$http.get(__URL.arc + 'employee/upload/check/department/'+this.importDepartment).then(
                (res) => {
                    if(res.data.success){
                        this.afterCheck()
                    }else{
                        this.msgconfig.type='warning';
                        this.msgconfig.show=true
                        this.msgconfig.content=res.data.errMsg
                    }
                }
            )
        },
        afterCheck(){
            let param=JSON.parse(JSON.stringify(this.checkboxObj));
            // for(let i=0;i<param.length;i++){
            //     if(param[i].status=='未通过'){
            //         param[i].status=0
            //     }else if(param[i].status=='已通过'){
            //         param[i].status=1
            //     }
            // }
            this.$http.post(__URL.arc + 'employee/upload',param).then(
                (res) => {
                    this.importModCfg.show=false;
                    this.importAlertCfg.msg=res.data.data;
                    this.importAlertCfg.show=true;
                    this.refresh();
                }
            )
        },
        importClose(){
            this.importModCfg.show=false;
        },
        clearDepartment(){
            this.importDepartment=''
        },
        getDepartment(){
            this.departmentCfg.show=true;
        },
        chioceDepartment(val){
            this.importDepartment=val.departmentName;
            this.departmentCfg.show=false;
        },
        //批量删除
        batchDelete(){
            if(this.checkboxObj.length==0){
                this.msgconfig.type='warning';
                this.msgconfig.show=true
                this.msgconfig.content='请先选择需要删除的记录'
            }else{
                this.batchDeleteCfg.msg='确认删除勾选的'+this.checkboxObj.length+'行记录吗？'
                this.batchDeleteCfg.subMsg='删除后不可以恢复！'
                this.batchDeleteCfg.show=true;
            }
        },
        batchDeleteSure(){
            let param=[
                // {
                //   "recordId": "",
                //   "recordVersion": 0,
                //   "seqNo": 0
                // }
            ]
            for(let i=0;i<this.checkboxObj.length;i++){
                param.push({
                    'recordId':this.checkboxObj[i].recordId,
                    'recordVersion':this.checkboxObj[i].recordVersion
                })
            }
            this.$http.post(__URL.arc + 'employee/upload/delete/batch',param).then(
                (res) => {
                    if(res.data.success){
                        this.refresh('删除成功!')
                    }else{
                        this.msgconfig.type='warning';
                        this.msgconfig.show=true
                        this.msgconfig.content=res.data.errMsg
                    }
                    
                }
            )
        },
        addNew(){
            this.importCfg.show=true;
        },
        //修改回调
        changeSure(){
            this.$http.post(__URL.arc + 'employee/upload/update',this.changeData).then(
                (res) => {
                    if(res.data.success){
                        this.changeModCfg.show=false;
                        this.refresh('保存成功')
                    }else{
                        this.msgconfig.type='warning';
                        this.msgconfig.show=true
                        this.msgconfig.content=res.data.errMsg
                    }
                }
            )
        },
        changeClose(){
            this.changeModCfg.show=false;
            this.getList();
        },
        //单个删除
        singleDelete(){
            this.singleDeleteCfg.msg='确认删除该条记录吗？'
            this.singleDeleteCfg.subMsg='删除后不可以恢复！'
            this.singleDeleteCfg.show=true;
        },
        singleDeleteSure(){
            let param={
                "recordId": this.deleteData.recordId,
                "recordVersion": this.deleteData.recordVersion
            }
            this.$http.post(__URL.arc + 'employee/upload/delete',param).then(
                (res) => {
                    if(res.data.success){
                        this.changeModCfg.show=false;
                        this.refresh('删除成功')
                    }else{
                        this.msgconfig.type='warning';
                        this.msgconfig.show=true;
                        this.msgconfig.content=res.data.errMsg
                    }
                }
            )
        },
        //去除数组中含有未通过的(需求改了)
        // checkStatus(){
        //     for(let i=0;i<this.checkboxObj.length;i++){
        //         if(this.checkboxObj[i].status=='未通过'){
        //             this.checkboxObj.splice(i,1)
        //         }
        //     }
        // }
        inputcb(){
            this.importCfg.show=false;
            this.msgconfig.type='success';
            this.msgconfig.show=true;
            this.msgconfig.content='上传成功';
            this.refresh();
        },
        clearTable(uid,obj){
            this.tableData = []
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
            if(cfg.leftItemCfg.tabCfg.select=='tab1'){
                return cfg.tableCfg1
            }else if(cfg.leftItemCfg.tabCfg.select=='tab2'){
                return cfg.tableCfg2
            }else{
                return cfg.tableCfg1
            }
        },
        tableParams() {
            let param = {
                "departmentName": this.listObj.departmentName,
                "employeeName": this.listObj.employeeName,
                "endDate": this.listObj.endDate,
                "flag": 0,
                "jobNumber": this.listObj.jobNumber,
                "pageIndex": 0,
                "pageSize": 0,
                "phone": this.listObj.phone,
                "roleName": this.listObj.roleName,
                "startDate": this.listObj.startDate
            }
            return param
        }
    },
    //关于这个的需求改了
    // watch:{
    //     checkboxObj: {
    //         deep: true,
    //         handler(val, old) {
    //             if(val.length>0){
    //                 this.checkStatus();
    //             }
    //         }
    //     }
    // }
}
</script>
<template>
    <container>
        <alert  :config='importAlertCfg'></alert>
        <alert  :config="dCfg"></alert>
        <div class="body_item">
            <div class="left_item">
                <new-app :config='leftItemCfg' @tab='clearTable' @cb='getFilter' @tab='clearTable' @add='addNew'></new-app>
            </div>
            <div class="right_item">
                <div class="item_head btn-ic">
                    <a @click='importData' href="javascript:;">
                        <i class='icon-in-person'></i>上传数据
                    </a>
                    <a @click='batchDelete' href="javascript:;">
                        <i class='icon-delete'></i>批量删除
                    </a>
                </div>
                <div class="item_body">
                    <vtable :checkbox.sync='checkboxObj' :config='tableCfg' :data='tableData' @op='operate' @link='href'></vtable>
                </div>
            </div>
        </div>
    </container>
    <modal :config='changeModCfg' @sure='changeSure' @close='changeClose'>
        <change-employee :detail.sync='changeData'></change-employee>
    </modal>
    <modal :config='importModCfg' @sure='importSure' @close='importClose'>
        <div class='form-group'>
            <label><span class="must-point">*</span>确认部门:</label>
            <div class="s-input ic2">
                <input placeholder='请选择部门'  disabled type="text" v-model='importDepartment'>
                <i @click='clearDepartment' v-show='importDepartment' class="icon-close__round r2" ></i>
                <i @click='getDepartment' class="icon-search r1"></i>
            </div>
        </div>
    </modal>
    <alert :config='singleDeleteCfg' @cb='singleDeleteSure' ></alert>
    <alert :config='batchDeleteCfg' @cb='batchDeleteSure' ></alert>
    <warning :config="msgconfig" ></warning>
    <vimport :config="importCfg" @cb="inputcb"></vimport>
    <refer-department :config='departmentCfg' @cb='chioceDepartment'></refer-department>
</template>
<style lang='less' scoped>
@import '../../../../../public/css/variable.less';
.body_item .item_head.btn-ic a{
    width: 80px;
}
</style>
