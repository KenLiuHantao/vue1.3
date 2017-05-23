<script>
    import confirmAuth from './confirmAuth.vue'
    import removeAuth from './removeAuth.vue'
    import infoModal from './info.vue'
    export default{
        components:{
            confirmAuth,removeAuth,infoModal
        },
        data(){
            return {
                tabCfg: {
                    select: '',
                    tabBarData: [{
                        id: '0',
                        name: '待授权',
                    }, {
                        id: '1',
                        name: '已授权',
                    }, {
                        id: '2',
                        name: '待解除',
                    }, {
                        id: '3',
                        name: '已解除',
                    }]
                },
                removeCfg:{
                    show:false,
                    type:'warning',
                    msg:''
                },
                //默认表格配置
                defaultCfg:{
                    operating: [true, 'config-operate',
                        [{
                            type: 'blue',
                            btn: 'roleAuth',
                            text: '授权确认',
                        }]
                    ],
                    serial: true,
                    width: [2, 2, 2, 2, 3, 3], //排除序号，多选，单选，操作栏
                    match: [
                        'jobNumber','employeeName','postDeptName','postRoleName','viceRoleName','phone'
                    ],
                    head: ['工号', '姓名', "部门", '岗位', '兼任岗位', '手机号码'],
                    class: 'rbac'
                },
                //已授权状态表格配置
                hadAuthCfg:{
                    operating: [true, 'config-operate',
                        [{
                            type: 'blue',
                            btn: 'sendMsg',
                            text: '重新通知',
                            show:function (val) {
                                    return val.accountStatus == 0
                            }
                        }]
                    ],
                    serial: true,
                    width: [2, 2, 2, 2, 2, 3, 2], //排除序号，多选，单选，操作栏
                    match: [
                        'jobNumber','employeeName','postDeptName','postRoleName','viceRoleName','phone',
                        function(x){
                            let t = ''
                            if(x.accountStatus == 0){
                                t ='<span style="color:red">未启用</span>'
                            }else if(x.accountStatus == 1){
                                t = '<span style="color:green">已启用</span>'
                            }
                            return t
                        }
                    ],
                    head: ['工号', '姓名', "部门", '岗位', '兼任岗位', '手机号码','帐号状态'],
                    class: 'rbac'
                },
                tableCfg: {},
                confirmAuthCfg:{
                    show:false,
                },
                removeAuthCfg:{
                    show:false,
                },
                infoCfg:{
                    show:false
                },
                //部门列表
                depList: '',
                //员工数据
                employeeData:[],
                //当前选中的哪条数据
                actItem:{},
                //待授权确认数据
                roleAuthData:'',
                //权限管理数据
                postManData:'',
                //默认选中的部门列表
                defaultDep:''

            }
        },
        ready(){
            this.tableCfg = Object.assign({},this.defaultCfg)
            this.getDepartList()
        },
        methods: {
            autoGetData(tab,depcode){
                this.getEmployeeData(tab, depcode)
                this.defaultDep = depcode
            },
            /*
            * 通过tab切换，更改table的config
            * */
            changeTab(id){
                this.employeeData=[]
                switch(id){
                    case '0':
                        this.getDepartList()
                        this.tableCfg = Object.assign({},this.defaultCfg)
                        this.tableCfg.operating = [true, 'config-operate',
                            [{
                                type: 'blue',
                                btn: 'roleAuth',
                                text: '授权确认',
                            }]
                        ]
                        break;
                    case '1':
                        this.getDepartList(1)
                        this.tableCfg = Object.assign({},this.hadAuthCfg)

                        break;
                    case '2':
                        this.getDepartList(2)
                        this.tableCfg = Object.assign({},this.defaultCfg)
                        this.tableCfg.operating = [true, 'config-operate',
                            [{
                                type: 'blue',
                                btn: 'postMan',
                                text: '权限管理',
                            }]
                        ]
                        break;
                    case '3':
                        this.getDepartList(3)
                        this.tableCfg = Object.assign({},this.defaultCfg)
                        this.tableCfg.operating = false
                        break;
                }
            },
            /*
            * 获取部门列表数据
            * */
            getDepartList(val=0){
                //在设置默认选中项前，要先清空该值，不然菜单检测不到值的变化，active不会改变
                this.defaultDep = ''
                let param ={
                    authStatus:val
                }
                this.$http.post(__URL.hr + 'department/auth/list',param).then(
                    res => {
                        if (res.data.success) {
                            this.depList = res.data.data.dataList
                            if(this.depList.length > 0){
                                this.autoGetData(val,this.depList[0].departmentCode)
                            }
                        }else{
                            this.depList=[]
                        }
                    }
                )
            },
            /*
            * 获取人员数据
            * */
            getEmployeeData(val=0,code){
                let param ={
                    "authStatus": val,
                    "departmentCode": code,
                }
                this.$http.post(__URL.hr +'employee/auth/list',param).then(
                    res=>{
                        if(res.data.success){
                            this.employeeData = res.data.data.dataList
                        }
                    }
                )
            },
            /*
            * 获取岗位与职能详情
            * */
            doAuth(type,item){
                this.actItem = item
                //授权确认或者权限管理
                if(type != 'sendMsg'){
                    let param ={
                        "authStatus": item.authStatus,
                        "recordId": item.recordId,
                        "roleStatus": item.roleStatus
                    }
                    this.$http.post(__URL.hr +'employee/role',param).then(
                        res=>{
                            if(res.data.success){
                                if(type == 'roleAuth'){
                                    this.confirmAuthCfg.show = true
                                    this.roleAuthData = res.data.data
                                }else if(type == 'postMan'){
                                    this.removeAuthCfg.show = true
                                    this.postManData = res.data.data
                                }

                            }
                        }
                    )
                //重新通知
                }else{
                    this.infoCfg.show = true
                }
            },
            //授权确认的操作
            doConfirm(){
                let param = {
                    "authStatus": this.actItem.authStatus,
                    "recordId": this.actItem.recordId,
                    "roleStatus":this.actItem.roleStatus
                }
                this.$http.post(__URL.hr +'employee/auth/update',param).then(
                    res=>{
                        if(res.data.success){
                            //刷新重新获取数据
                            this.getDepartList(this.tabCfg.select)
                            this.$warning({'message':'操作成功！','type':'success'})
                        }else{
                            this.$warning({'message':'操作失败！','type':'failure'})
                        }
                    }
                )
            },
            //移除权限操作
            doRemove(data){
                this.removeCfg.show = true
                this.removeCfg.msg = `是否移除${this.actItem.employeeName}的${data.waitEmployeeRoleVo.roleName}职能权限`
            },
            //更新员工信息
            updateInfo(val){
                this.$http.get(__URL.service +'user/remind/sms',{params:{userCode:val.employeeCode}}).then(
                    res=>{
                        if(res.data.success){
                            this.getDepartList(this.tabCfg.select)
                            this.$warning({'message':'通知成功！','type':'success'})
                        }else{
                            this.$warning({'message':'通知失败！','type':'failure'})
                        }
                    }
                )
            }
        }
    }
</script>

<template>
    <container>
        <div class="body_item">
            <div class="left_item">
                <div class="item_head between">
                </div>
                <div class="item_body">
                    <tab-bar :config="tabCfg" @cb="changeTab"></tab-bar>
                    <menu :default-opened="[defaultDep]" :default-active="defaultDep">
                        <submenu v-for="item in depList"
                                 :index="item.departmentCode"
                                 :has-children="item.children.length>0"
                                 @cb="getEmployeeData(tabCfg.select,item.departmentCode)">
                            <template slot="title">{{item.departmentName}}</template>
                            <menu-item v-for="info in item.children"
                                       :index="info.departmentCode"
                                       @cb="getEmployeeData(tabCfg.select,info.departmentCode)">
                                {{info.departmentName}}
                            </menu-item>
                        </submenu>
                    </menu>
                </div>
            </div>
            <div class="right_item">
                <div class="item_head btn-ic">
                </div>
                <div class="item_body">
                    <vtable :config='tableCfg' :data='employeeData' @op="doAuth"></vtable>
                </div>
            </div>
        </div>
    </container>

    <!--授权确认弹框-->
    <confirm-auth :config="confirmAuthCfg" :data="roleAuthData" @cb="doConfirm"></confirm-auth>
    <!--权限管理弹框-->
    <remove-auth :config="removeAuthCfg" :data="postManData" @cb="doRemove"></remove-auth>
    <!--移除确认弹框-->
    <alert :config="removeCfg" @cb="doConfirm"></alert>
    <!--员工详情弹框-->
    <info-modal :config="infoCfg" :data="actItem" @cb="updateInfo"></info-modal>
</template>

<style lang="less" scoped>


</style>