<script>
import cfg from './cfg.js'
export default {
    components: {

    },
    ready() {
        this.choiceTab(0)
        document.addEventListener('click', () => {
            this.current = -2
        })
    },
    data() {
        return {
            current:-2,
            oldFilterConfig:'',
            tableData: [],
            radioObj: {},
            listDetail:[
            ],
            totalCount:0,
            pageIndex:1,
            msgconfig:{
                type:'warning',
                show:false,
                content:''
            },
            ckdCode:'',
            secCode:'',
            openCode:'',
            activeTab:0,
            dCfg:{
                show:false,
                msg:'',
                subMsg:'',
                type:'success',
                quite:false
            },
            ajaxlock:true,
            newFirstDepCfg:{
                show: false,
                width: '408px',
                height: 'auto',
                header: '新增部门',
                btn: [{
                    name: '取消',
                    className:['btn-xl-def','mgr-10'],
                    emit: 'close',
                }, {
                    name: '确定',
                    className:['btn-xl-imp','mgr-40'],
                    emit: 'sure',
                }],
            },
            newFirstDepDate:{
                name:'',
                manager:''
            },
            newSecDepCfg:{
                show: false,
                width: '408px',
                height: 'auto',
                header: '新增下级部门',
                btn: [{
                    name: '取消',
                    className:['btn-xl-def','mgr-10'],
                    emit: 'close',
                }, {
                    name: '确定',
                    className:['btn-xl-imp','mgr-40'],
                    emit: 'sure',
                }],
            },
            newSecDepDate:{
                name:'',
                manager:'',
                parentCode:''
            },
            changeDepCfg:{
                show: false,
                width: '480px',
                height: 'auto',
                header: '编辑部门',
                btn: [{
                    name: '取消',
                    className:['btn-xl-def','mgr-10'],
                    emit: 'close',
                }, {
                    name: '确定',
                    className:['btn-xl-imp','mgr-40'],
                    emit: 'sure',
                }],
            },
            changeDepDate:{
                "code": "",
                "manager": "",
                "name": "",
                "version": 0
            },
            stopDepCfg:{
                show: false,
                width: '480px',
                height: 'auto',
                header: '停用部门',
                btn: [{
                    name: '取消',
                    className:['btn-xl-def','mgr-10'],
                    emit: 'close',
                }, {
                    name: '确定',
                    className:['btn-xl-imp','mgr-40'],
                    emit: 'sure',
                }],
            },
            stopDepData:{
                "code": "",
                "disableReason": "",
                "version": 0
            },
            changeRoleNameCfg:{
                show: false,
                width: '480px',
                height: 'auto',
                header: '编辑岗位',
                btn: [{
                    name: '取消',
                    className:['btn-xl-def','mgr-10'],
                    emit: 'close',
                }, {
                    name: '确定',
                    className:['btn-xl-imp','mgr-40'],
                    emit: 'sure',
                }],
            },
            changeRole:{
                code:'',
                name:''
            },
            addAlreadyCfg:{
                show: false,
                width: '340px',
                height: 'auto',
                header: '提示',
                btn: [{
                    name: '重新命名',
                    className:['btn-xl-imp','mgr-10'],
                    emit: 'close',
                }, {
                    name: '继续使用',
                    className:['btn-xl-def','mgr-40'],
                    emit: 'sure',
                }],
            },
            addRoleNameCfg:{
                show: false,
                width: '480px',
                height: 'auto',
                header: '新增岗位',
                btn: [{
                    name: '取消',
                    className:['btn-xl-def','mgr-10'],
                    emit: 'close',
                }, {
                    name: '确定',
                    className:['btn-xl-imp','mgr-40'],
                    emit: 'sure',
                }],
            },
            newRole:{
                departmentCode:'',
                roleName:'',
                roleCode:''
            },
            removeRoleCfg:{
                show: false,
                width: '480px',
                height: 'auto',
                header: '移除岗位',
                btn: [{
                    name: '取消',
                    className:['btn-xl-def','mgr-10'],
                    emit: 'close',
                }, {
                    name: '确定',
                    className:['btn-xl-imp','mgr-40'],
                    emit: 'sure',
                }],
            },
            removeRole:{
                departmentCode:'',
                roleCode:'',
                reason:''
            },
            stopRoleCfg:{
                show: false,
                width: '480px',
                height: 'auto',
                header: '停用岗位',
                btn: [{
                    name: '取消',
                    className:['btn-xl-def','mgr-10'],
                    emit: 'close',
                }, {
                    name: '确定',
                    className:['btn-xl-imp','mgr-40'],
                    emit: 'sure',
                }],
            },
            roleModCfg:{
                show: false,
                width: '480px',
                height: 'auto',
                header: '岗位职能',
            },
            stopRole:{
                departmentCode:'',
                roleCode:'',
                reason:''
            },
            departmentRoleCfg:{
                show:false
            },
            funCfg:{
                show:false
            },
            activeRoleCode:'',
            roleList:[]
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
            if(this.activeTab==0){
                if(type=='edit'){
                    this.changeRole.code=item.code;
                    this.changeRole.name=item.name;
                    this.changeRoleNameCfg.show=true;
                }
                else if(type=='remove'){
                    if(!this.secCode){
                        var departmentCode=this.ckdCode;
                    }else{
                        var departmentCode=this.secCode;
                    }
                    this.$http.get(__URL.service + 'role/count/relatedToUsers',{params:{'roleCode':item.code,'departmentCode':departmentCode}}).then(
                        (res) => {
                            if(res.data.data>0){
                                this.dCfg.type='warning'
                                this.dCfg.msg='请先将该岗位已有员工调岗'
                                this.dCfg.show=true
                            }else{
                                if(!this.secCode){
                                    this.removeRole.departmentCode=this.ckdCode;
                                }else{
                                    this.removeRole.departmentCode=this.secCode;
                                }
                                this.removeRole.roleCode=item.code;
                                this.removeRole.reason='';
                                this.removeRoleCfg.show=true;
                            }
                        }
                    )
                }
                else if(type=='stop'){
                    if(!this.secCode){
                        var departmentCode=this.ckdCode;
                    }else{
                        var departmentCode=this.secCode;
                    }
                    this.$http.get(__URL.service + 'role/count/relatedToUsers',{params:{'roleCode':item.code,'departmentCode':departmentCode}}).then(
                        (res) => {
                            if(res.data.data>0){
                                this.dCfg.type='warning'
                                this.dCfg.msg='请先将该岗位已有员工调岗'
                                this.dCfg.show=true
                            }else{
                                this.$http.get(__URL.service + 'role/count/relatedToDepartments',{params:{'roleCode':item.code}}).then(
                                    (res) => {
                                        if(res.data.data!=1){
                                            this.dCfg.type='warning'
                                            this.dCfg.msg='请先将该岗位已有员工调岗'
                                            this.dCfg.show=true
                                        }else{
                                            if(!this.secCode){
                                                this.stopRole.departmentCode=this.ckdCode;
                                            }else{
                                                this.stopRole.departmentCode=this.secCode;
                                            }
                                            this.stopRole.roleCode=item.code;
                                            this.stopRole.reason='';
                                            this.stopRoleCfg.show=true;
                                        }
                                    }
                                )
                            }
                        }
                    )
                }
            }
        },
        href(item, type) {
            if(type=='name'){
                this.$http.post(__URL.service + 'post/search/alter/role','',{params:{roleCode:item.code}}).then(
                    (res) => {
                        if(res.data.success){
                            this.roleList=res.data.data;
                            this.roleModCfg.show=true;
                        }else{
                            
                        }
                    }
                )
            }
        },
        //新增按钮事件
        addNew(){
            this.newFirstDepDate.name=''
            this.newFirstDepCfg.show=true;
        },
        //岗位编辑
        changeRoleNameClose(){
            this.changeRole.code='';
            this.changeRole.name='';
            this.changeRoleNameCfg.show=false;
        },
        changeRoleNameSure(){
            var param={
                roleCode:this.changeRole.code,
                name:this.changeRole.name
            }
            this.$http.post(__URL.service + 'role/modify/name','',{params:param}).then(
                (res) => {
                    if(res.data.success){
                        this.changeRoleNameCfg.show=false
                        this.refresh('修改成功')
                        this.activeRoleCode=this.changeRole.code
                        this.funCfg.show=true
                    }else{
                        this.msgconfig.type='warning'
                        this.msgconfig.show=true
                        this.msgconfig.content=res.data.errMsg
                    }
                }
            )
        },
        //岗位移除
        removeRoleClose(){
            this.removeRole.departmentCode='';
            this.removeRole.roleCode='';
            this.removeRole.reason=''
            this.removeRoleCfg.show=false;
        },
        removeRoleSure(){
            var param={
                departmentCode:this.removeRole.departmentCode,
                roleCode:this.removeRole.roleCode,
                reason:this.removeRole.reason
            }
            this.$http.post(__URL.service + 'role/disable/department','',{params:param}).then(
                (res) => {
                    if(res.data.success){
                        this.removeRoleCfg.show=false
                        this.refresh('移除成功')
                    }else{
                        this.msgconfig.type='warning'
                        this.msgconfig.show=true
                        this.msgconfig.content=res.data.errMsg
                    }
                }
            )
        },
        //岗位停用
        stopRoleClose(){
            this.stopRole.departmentCode='';
            this.stopRole.roleCode='';
            this.stopRole.reason=''
            this.stopRoleCfg.show=false;
        },
        stopRoleSure(){
            var param={
                departmentCode:this.stopRole.departmentCode,
                roleCode:this.stopRole.roleCode,
                reason:this.stopRole.reason
            }
            this.$http.post(__URL.service + 'role/disable','',{params:param}).then(
                (res) => {
                    if(res.data.success){
                        this.stopRoleCfg.show=false
                        this.refresh('停用成功')
                    }else{
                        this.msgconfig.type='warning'
                        this.msgconfig.show=true
                        this.msgconfig.content=res.data.errMsg
                    }
                }
            )
        },
        //新增岗位
        getRoleName(item){
            this.newRole.roleName=item.name;
        },
        addNewRole(){
            if(!this.secCode){
                this.newRole.departmentCode=this.ckdCode;
            }else{
                this.newRole.departmentCode=this.secCode;
            }
            this.newRole.roleName='';
            this.newRole.roleCode='';
            this.addRoleNameCfg.show=true;
        },
        addRoleNameClose(){
            this.newRole.departmentCode='';
            this.newRole.roleName='';
            this.newRole.roleCode='';
            this.addRoleNameCfg.show=false;
        },
        addRoleNameSure(){
            var param={
                name:this.newRole.roleName
            }
            this.$http.get(__URL.service + 'role/search/name',{params:param}).then(
                (res) => {
                    if(res.data.success){
                        if(res.data.data==null){
                            this.addNewRoleName()
                        }else{
                            this.newRole.roleCode=res.data.data.code;
                            this.addAlreadyCfg.show=true
                        }
                    }else{
                        this.msgconfig.type='warning'
                        this.msgconfig.show=true
                        this.msgconfig.content=res.data.errMsg
                    }
                }
            )
        },
        addNewRoleName(code){
            var param={
                departmentCode:this.newRole.departmentCode,
                roleName:this.newRole.roleName
            }
            this.$http.get(__URL.service + 'role/create',{params:param}).then(
                (res) => {
                    if(res.data.success){
                        this.addRoleNameCfg.show=false
                        this.refresh('新增成功')
                        this.activeRoleCode=res.data.data
                        this.funCfg.show=true
                    }else{
                        this.msgconfig.type='warning'
                        this.msgconfig.show=true
                        this.msgconfig.content=res.data.errMsg
                    }
                }
            )
        },
        getNewRoleName(){
            this.departmentRoleCfg.show=true
        },
        addAlreadyClose(){
            this.addAlreadyCfg.show=false;
        },
        addAlreadySure(){
            this.addAlreadyCfg.show=false;
            var param={
                departmentCode:this.newRole.departmentCode,
                roleCode:this.newRole.roleCode
            }
            this.$http.get(__URL.service + 'role/add/department',{params:param}).then(
                (res) => {
                    if(res.data.success){
                        this.addRoleNameCfg.show=false
                        this.refresh('新增成功')
                        this.activeRoleCode=this.newRole.roleCode
                        // this.funCfg.show=true
                    }else{
                        this.msgconfig.type='warning'
                        this.msgconfig.show=true
                        this.msgconfig.content=res.data.errMsg
                    }
                }
            )
        },
        //新增一级部门
        newFirstDepClose(){
            this.newFirstDepDate.name=''
            this.newFirstDepCfg.show=false
        },
        newFirstDepSure(){
            var param={
                "manager": "",
                "name": this.newFirstDepDate.name,
                "parentCode": "",
            }
            this.$http.post(__URL.service + 'department/add',param).then(
                (res) => {
                    if(res.data.success){
                        this.newFirstDepCfg.show=false
                        this.refresh('新增成功')
                    }else{
                        this.msgconfig.type='warning'
                        this.msgconfig.show=true
                        this.msgconfig.content=res.data.errMsg
                    }
                }
            )
        },
        //新增二级部门
        operate_addDept(item){
            this.newSecDepDate.parentCode=item.code;
            this.newSecDepCfg.show=true;
        },
        newSecDepClose(){
            this.newSecDepDate.name='';
            this.newSecDepDate.parentCode='';
            this.newSecDepDate.manager='';
            this.newSecDepCfg.show=false;
        },
        newSecDepSure(){
            var param={
                "manager": "",
                "name": this.newSecDepDate.name,
                "parentCode": this.newSecDepDate.parentCode,
            }
            this.$http.post(__URL.service + 'department/add',param).then(
                (res) => {
                    if(res.data.success){
                        this.newSecDepCfg.show=false
                        this.refresh('新增成功')
                    }else{
                        this.msgconfig.type='warning'
                        this.msgconfig.show=true
                        this.msgconfig.content=res.data.errMsg
                    }
                }
            ) 
        },
        //编辑部门
        operate_editDept(item){
            this.changeDepDate.code=item.code;
            this.changeDepDate.manager=item.manager;
            this.changeDepDate.name=item.name;
            this.changeDepDate.version=item.version;
            this.changeDepCfg.show=true;
        },
        changeDepClose(){
            this.changeDepDate.code='';
            this.changeDepDate.manager='';
            this.changeDepDate.name='';
            this.changeDepDate.version='';
            this.changeDepCfg.show=false;
        },
        changeDepSure(){
            var param={
              "code": this.changeDepDate.code,
              "manager": this.changeDepDate.manager,
              "name": this.changeDepDate.name,
              "version": this.changeDepDate.version
            }
            this.$http.post(__URL.service + 'department/update',param).then(
                (res) => {
                    if(res.data.success){
                        this.changeDepCfg.show=false
                        this.refresh('保存成功')
                    }else{
                        this.msgconfig.type='warning'
                        this.msgconfig.show=true
                        this.msgconfig.content=res.data.errMsg
                    }
                }
            )
        },
        //停用部门
        operate_stopDept(item){
            var param={
                code:item.code
            }
            this.$http.post(__URL.service + 'department/check-disable','',{'params':param}).then(
                (res) => {
                    if(res.data.success){
                        this.stopDepData.code=item.code
                        this.stopDepData.disableReason=''
                        this.stopDepData.version=item.version
                        this.stopDepCfg.show=true
                    }else{
                        this.msgconfig.type='warning'
                        this.msgconfig.show=true
                        this.msgconfig.content=res.data.errMsg
                    }
                }
            )
        },
        stopDepClose(){
            this.stopDepData.code=''
            this.stopDepData.version=''
            this.stopDepData.disableReason=''
            this.stopDepCfg.show=false
        },
        stopDepSure(){
            var param={
                "code": this.stopDepData.code,
                "disableReason": this.stopDepData.disableReason,
                "version": this.stopDepData.version
            }
            this.$http.post(__URL.service + 'department/disable',param).then(
                (res) => {
                    if(res.data.success){
                        this.stopDepCfg.show=false;
                        this.refresh('停用成功')
                    }else{
                        this.msgconfig.type='warning'
                        this.msgconfig.show=true
                        this.msgconfig.content=res.data.errMsg
                    }
                }
            )
        },
        //刷新外页
        refresh(text){
            if(text){
                this.msgconfig.type='success'
                this.msgconfig.show=true
                this.msgconfig.content=text
            }
            this.choiceTab(0)
            this.tableData=[]
        },
        getRefresh(data){
            var roleCode=[];
            for(var i=0;i<data.length;i++){
                roleCode.push(data[i].code)
            }
            this.$http.get(__URL.service + 'role/create/post/refer',{'params':{'roleCode':this.activeRoleCode,'postCodes':roleCode}}).then(
                (res) => {
                    if(res.data.success){
                        this.funCfg.show=false;
                        this.refresh('保存成功')
                    }else{
                        this.msgconfig.type='warning'
                        this.msgconfig.show=true
                        this.msgconfig.content=res.data.errMsg
                    }
                }
            )
        },

        /*
        *下面全是这个页面单独和list有关的内容
        */
        operatingItem(index, index2) {//下拉
            if (index2 != undefined) {
                this.current = index + "-" + index2;
            } else {
                this.current = index;
            }
        },


        choiceTab(index){
            this.activeTab=index;
            this.openCode = ''
            this.ckdCode = ''
            this.secCode = ''
            this.listDetail=[]
            this.tableData=[]
            this.getFirst('refresh')
        },
        getFirst(type){
            if(type=='add'){
                this.pageIndex++;
            }
            if(this.activeTab==0){
                var param={}
                this.$http.post(__URL.service + 'department/enabled-list', param).then(
                    (res) => {
                        if(res.data.success){
                            this.listDetail=res.data.data
                            this.totalCount=res.data.data.length;
                            if(this.listDetail.length>0){
                                this.openFirst(this.listDetail[0])
                            }
                        }else{
                            this.msgconfig.type='warning'
                            this.msgconfig.show=true
                            this.msgconfig.content=res.data.errMsg
                        }
                    }
                )
            }else if(this.activeTab==1){
                var param={}
                this.$http.post(__URL.service + 'department/disable-date',param).then(
                    (res) => {
                        if(res.data.success){
                            this.listDetail=res.data.data
                            this.totalCount=res.data.data.length;
                            if(this.listDetail.length>0){
                                this.openFirst(this.listDetail[0])
                            }
                        }else{
                            this.msgconfig.type='warning'
                            this.msgconfig.show=true
                            this.msgconfig.content=res.data.errMsg
                        }
                    }
                )
            }else if(this.activeTab==2){
                this.$http.get(__URL.service + 'role/search/disabledYearMonth').then(
                    (res) => {
                        if(res.data.success){
                            this.listDetail=res.data.data
                            this.totalCount=res.data.data.length;
                            if(this.listDetail.length>0){
                                this.openFirst(this.listDetail[0])
                            }
                        }else{
                            this.msgconfig.type='warning'
                            this.msgconfig.show=true
                            this.msgconfig.content=res.data.errMsg
                        }
                    }
                )
            }
        },
        loadMore(){
            this.getFirst('add')
        },
        //点击一级
        openFirst(item, index) {
            //选中事件
            if(this.activeTab==0){
                this.ckdCode = item.code;

                //展开事件
                if (this.openCode == item.code) {
                    this.openCode = ''
                } else {
                    this.openCode = item.code
                }
            }else{
                this.ckdCode = item
            }
            this.secCode=''
            this.getTable(item)
        },
        choiceSec(first,sec) {
            this.ckdCode = first.code.toString() + sec.code.toString();
            this.secCode = sec.code.toString();
            this.getTable(sec)
        },
        getTable(item){
            if(this.activeTab==0){
                this.$http.get(__URL.service + 'role/search/departmentCode',{params:{'departmentCode':item.code}}).then(
                    (res) => {
                        if(res.data.success){
                            this.tableData=res.data.data;
                        }else{
                            this.msgconfig.type='warning'
                            this.msgconfig.show=true
                            this.msgconfig.content=res.data.errMsg
                        }
                    }
                )
            }else if(this.activeTab==1){
                this.$http.post(__URL.service + 'department/disabled-list','',{params:{'disableDate':item}}).then(
                    (res) => {
                        if(res.data.success){
                            this.tableData=res.data.data;
                        }else{
                            this.msgconfig.type='warning'
                            this.msgconfig.show=true
                            this.msgconfig.content=res.data.errMsg
                        }
                    }
                )
            }else if(this.activeTab==2){
                this.$http.get(__URL.service + 'role/search/disabled',{params:{'yearMonth':item}}).then(
                    (res) => {
                        if(res.data.success){
                            this.tableData=res.data.data;
                        }else{
                            this.msgconfig.type='warning'
                            this.msgconfig.show=true
                            this.msgconfig.content=res.data.errMsg
                        }
                    }
                )
            }
        },
    },
    computed: {
        /* 参数获取 */
        tableUrl() {
            return cfg.table.baseParams.url
        },
        tableCfg() {
            if(this.activeTab==0){
                return cfg.tableCfg1
            }else if(this.activeTab==1){
                return cfg.tableCfg2
            }else if(this.activeTab==2){
                return cfg.tableCfg3
            }
            
        },
        hasMore:function(){
            if(this.totalCount>this.pageIndex && this.pageIndex<(this.totalCount/20)){
                return true
            }else{
                return false
            }
        }
    },
    filters:{
        managerName:{
            read:function(val){
                if(val==null){
                    val='负责人空缺'
                }
                return val
            }
        }
    }
}
</script>
<template>
    <container>
        <alert  :config="dCfg"></alert>
        <div class="body_item">
            <div class="left_item">
                <div class="item_head between">
                    <a @click='addNew'>
                        <i class="icon-hp_list__add"></i>新增
                    </a>
                </div>
                <div class="item_body">
                    <div class='list_div'>
                        <div class='list_tab' >
                            <a href="javascript:;"  @click='choiceTab(0)' :class="{ckd:0==activeTab}">
                                启用中
                            </a>
                            <a href="javascript:;"  @click='choiceTab(1)' :class="{ckd:1==activeTab}">
                                已停用部门
                            </a>
                            <a href="javascript:;"  @click='choiceTab(2)' :class="{ckd:2==activeTab}">
                                已停用岗位
                            </a>
                        </div>
                        <div class='list_content'>
                            <!--  页签1内容 -->
                            <ul class='listbox' v-if='activeTab==0'>
                                <li class='first_li' v-for='(index,firstLv) in listDetail'>
                                    <a :class='{ckd:firstLv.code==ckdCode}' @click='openFirst(firstLv,index)' href="javascript:;">
                                        <i v-show='firstLv.children.length>0 && firstLv.code!=openCode' class='icon-hp_list__right'></i>
                                        <i v-show='firstLv.children.length>0&& firstLv.code==openCode' class='icon-hp_list__dropdown' :class='{childchoice:firstLv.code!=ckdCode && firstLv.code==openCode}'></i>
                                        <p :class='{childchoice:firstLv.code!=ckdCode&&firstLv.code==openCode}' class='main'>{{firstLv.name}}({{firstLv.managerName | managerName}})</p>
                                    </a>
                                    <div class="moreChangeColor" style="position: absolute;top: 15px;right: 10px;">
                                        <div class="dot-group-wrap">
                                            <div :class='["dot-group" ,"more",{"ckdMor":index == current}]' @click.stop='operatingItem(index)'>
                                                <span></span><span></span><span></span>
                                            </div>
                                            <div class="more-group" v-show='index == current'>
                                                <a @click.stop='operate_editDept(firstLv)' href="javascript:;">编辑部门</a>
                                                <a @click.stop='operate_addDept(firstLv)' href="javascript:;">添加下级部门</a>
                                                <a class='red' @click.stop='operate_stopDept(firstLv)' href="javascript:;">停用部门</a>
                                            </div>
                                        </div>
                                    </div>
                                    <ul v-if='firstLv.children.length>0' v-show='firstLv.code==openCode' class='sec_ul'>
                                        <li @click.stop='choiceSec(firstLv,secLv)' class='sec_li' :class='{hasnumber:firstLv.hasNumber,ckd:firstLv.code.toString()+secLv.code.toString()==ckdCode}' v-for='(index2,secLv) in firstLv.children'>
                                            <!-- <div v-if='firstLv.hasNumber' class='number-title'>{{index+1}}</div> -->
                                            <p class='main'>{{secLv.name}}</p>
                                            <span class='tip_number'>{{secLv.employeeCount}}</span>
                                            <div class="moreChangeColor" style="position: absolute;top: 15px;right: 10px;">
                                                <div class="dot-group-wrap">
                                                    <div :class='["dot-group" ,"more",{"ckdMor":index == current}]' @click.stop='operatingItem(index,index2)'>
                                                        <span></span><span></span><span></span>
                                                    </div>
                                                    <div class="more-group" v-show='index+"-"+index2 == current'>
                                                        <a @click.stop='operate_editDept(secLv)' href="javascript:;">编辑部门</a>
                                                        <a class='red' @click.stop='operate_stopDept(secLv)' href="javascript:;">停用部门</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </li>
                            </ul>

                            <!--  页签2内容 -->
                            <ul class='listbox' v-if='activeTab==1'>
                                <li class='first_li' v-for='(index,firstLv) in listDetail'>
                                    <a :class='{ckd:firstLv==ckdCode}' @click='openFirst(firstLv,index)' href="javascript:;">
                                        <p class='main'>{{firstLv}}</p>
                                    </a>
                                </li>
                            </ul>

                            <!--  页签3内容 -->
                            <ul class='listbox' v-if='activeTab==2'>
                                <li class='first_li' v-for='(index,firstLv) in listDetail'>
                                    <a :class='{ckd:firstLv==ckdCode}' @click='openFirst(firstLv,index)' href="javascript:;">
                                        <p class='main'>{{firstLv}}</p>
                                    </a>
                                </li>
                            </ul>

                        </div>
                        <div class='list_loadmore' v-show='hasMore' @click='loadMore'>
                            加载更多...
                        </div>
                    </div>
                </div>
            </div>
            <div class="right_item">
                <div class="item_head btn-ic">
                    <a href="javascript:;" v-if='activeTab==0' @click='addNewRole'>
                        <i class='icon-product__add'></i>
                        新增岗位
                    </a>
                </div>
                <div class="item_body">
                    <vtable :radio.sync='radioObj' :config='tableCfg' :data='tableData' @op='operate' @link='href'>
                    </vtable>
                </div>
            </div>
        </div>
    </container>
    <warning :config="msgconfig" ></warning>

    <!-- 新增岗位 -->
    <modal :config='addRoleNameCfg' @sure='addRoleNameSure' @close='addRoleNameClose'>
        <div class='form-group'>
            <label><span class="must-point">*</span>岗位名称:</label>
            <div class="s-input ic2">
                <input placeholder='请输入或选择岗位名称'  maxlength=16 type="text" v-model='newRole.roleName'>
                <i @click='getNewRoleName' class="icon-search r1"></i>
            </div>
        </div>
    </modal>

    <modal :config='addAlreadyCfg' @sure='addAlreadySure' @close="addAlreadyClose">
        <div class="item-icon warning" >
            <span ></span>
        </div>
        <div class="main">该岗位名称已存在</div>
        <div class="sub" >您是继续使用该岗位名称或重新命名?</div>
    </modal>

    <!-- 修改岗位名称 -->
    <modal :config='changeRoleNameCfg' @sure='changeRoleNameSure' @close='changeRoleNameClose'>
        <div class='form-group'>
            <label><span class="must-point">*</span>岗位名称:</label>
            <div class="s-input ic2">
                <input placeholder='请输入岗位名称'  maxlength=16 type="text" v-model='changeRole.name'>
            </div>
        </div>
    </modal>

    <!-- 移除岗位 -->
    <modal :config='removeRoleCfg' @sure='removeRoleSure' @close='removeRoleClose'>
        <div class='form-group'>
            <textarea class='text-reason' maxlength=120 placeholder='移除原因...' v-model='removeRole.reason'></textarea>
        </div>
    </modal>

    <!-- 停用岗位 -->
    <modal :config='stopRoleCfg' @sure='stopRoleSure' @close='stopRoleClose'>
        <div class='form-group'>
            <textarea class='text-reason' maxlength=120 placeholder='停用原因...' v-model='stopRole.reason'></textarea>
        </div>
    </modal>

    <!-- 新增一级部门 -->
    <modal :config='newFirstDepCfg' @sure='newFirstDepSure' @close='newFirstDepClose'>
        <div class='form-group' style='margin:30px 0'>
            <label><span class="must-point">*</span>部门名称:</label>
            <div class="s-input ic2">
                <input placeholder='请输入部门名称'  maxlength=16 type="text" v-model='newFirstDepDate.name'>
            </div>
        </div>
    </modal>

    <!-- 新增二级部门 -->
    <modal :config='newSecDepCfg' @sure='newSecDepSure' @close='newSecDepClose'>
        <div class='form-group' style='margin:30px 0'>
            <label><span class="must-point">*</span>部门名称:</label>
            <div class="s-input ic2">
                <input placeholder='请输入部门名称'  maxlength=16 type="text" v-model='newSecDepDate.name'>
            </div>
        </div>
    </modal>

    <!-- 编辑部门 -->
    <modal :config='changeDepCfg' @sure='changeDepSure' @close='changeDepClose'>
        <div class='form-group'>
            <label><span class="must-point">*</span>部门名称:</label>
            <div class="s-input ic2">
                <input placeholder='请输入部门名称'  maxlength=16 type="text" v-model='changeDepDate.name'>
            </div>
        </div>
        <div class='form-group' v-show='changeDepDate.supremacy==true'>
            <div class='topDep'><p>最高行政管理部门</p></div>
        </div>
    </modal>

    <!-- 停用部门 -->
    <modal :config='stopDepCfg' @sure='stopDepSure' @close='stopDepClose'>
        <div class='form-group'>
            <textarea class='text-reason' maxlength=120 placeholder='停用原因...' v-model='stopDepData.disableReason'></textarea>
        </div>
    </modal>

    <!-- 查看岗位职能 -->
    <modal :config='roleModCfg'>
        <ul v-if='roleList.length>0' class='role-mod'>
            <li v-for='item in roleList'>{{item.name}}</li>
        </ul>
        <p style='margin:20px;' v-if='roleList.length==0'>该岗位暂时没有职能!</p>
    </modal>

    <refer-department-role :config='departmentRoleCfg' @cb='getRoleName'></refer-department-role>
    <refer-role-auth :config="funCfg"  @cb="getRefresh" ></refer-role-auth>
</template>
<style lang='less' scoped>
@import '../../../../../public/css/variable.less';
.item_head:hover{
    cursor: pointer;
}
.text-reason{
    margin: 0 20px;
    width: 100%;
    height: 60px;
}
.reset_password{
    text-align: center;
    img{
        width: 50px;
        height:50px;
        margin-top: 20px;
    }
    .main{
        padding: 10px 30px;
        color: #212121;
        font-size: 12px;
    }
    .minor{
        padding:10px;
        padding-bottom: 30px;
        color: #757575;
        font-size: 12px;
    }
}
.item-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
    margin-top: 20px;
    span {
        margin-right: 0;
        font-size: 36px;
    }
    &.success {
        color: #91d938;
        span:after {
            content: '\e97f';
        }
    }
    &.failure {
        color: #FE5A00;
        span:after {
            content: '\e980';
        }
    }
    &.warning {
        color: #FFB616;
        span:after {
            content: '\e981';
        }
    }
}
.main {
    line-height: 1.4;
    text-align: center;
}
.sub {
    margin-top: 10px;
    margin-bottom: 10px;
    color: #757575;
    line-height: 1.4;
    text-align: center;
}

/*.first_li:hover > div > .dot-group {
    visibility: visible;
}
.sec_li:hover > div > .dot-group {
    visibility: visible;
}*/
.dot-group-wrap {
    position: relative;
}

.dot-group {
    visibility: visible;
    display: flex;
    height: 14px;
    align-items: center;
    flex-direction: row;
    justify-content: center;
    cursor: pointer;
    &.ckdMore span {
        background-color: @link-color;
    }
    span {
        display: flex;
        width: 5px;
        height: 5px;
        margin-right: 3px;
        border-radius: 50%;
        background-color: #ADADAD;
    }
}
.more-group {
    position: absolute;
    top: 40%;
    left: -27px;
    padding: 4px 0;
    margin-top: 14px;
    margin-left: -32px;
    width: 90px;
    z-index: 3;
    background-color: @body-bg;
    border: 1px solid @border-color;
    box-shadow: 0 1px 2px #F2F3F3;
    a {
        display: block;
        text-align: left;
        font-size: 12px;
        padding: 4px 8px;
        text-align: center;
        &:hover {
            background-color: #EBF7FD;
        }
    }
    &:before {
        content: '';
        position: absolute;
        top: -17px;
        left: 75%;
        margin-left: -5px;
        display: inline-block;
        width: 0;
        border: 8px solid transparent;
        border-bottom-color: @border-color;
    }
    &:after {
        content: '';
        position: absolute;
        top: -16px;
        left: 75%;
        margin-left: -5px;
        display: inline-block;
        width: 0;
        border: 8px solid transparent;
        border-bottom-color: @body-bg;
    }
    .blue {
        color: #008AF5;
    }
    .danger {
        color: #FF0700;
    }
    .normal {
        color: #757575;
    }
}
.topDep{
    margin-left:100px; 
    background: #f7f8fc;
    color: #757575;
    border-radius:10px;
    >p{
        padding: 5px;
    }
}   
.role-mod{
    max-height: 400px;
    overflow: auto;
    li{
        margin: 10px 20px;
        background: #FFF9F1;
        font-size: 14px;
        color:#212121;
        padding: 13px;
        position: relative;
    }
    li:before{
        content: '';
        width:10px;
        height: 10px;
        border-radius: 5px;
        background-color: #FFD91A;
        position: absolute;
        top:15px;
        left: -5px;
    }
}
</style>
