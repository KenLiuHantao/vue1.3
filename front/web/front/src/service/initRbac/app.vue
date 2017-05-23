<script>
    import setManager from '../../admin/rbac/setManager'
    import initedPage from '../customerInitBatchImport/initedTipPage.vue'
    export default{
        components:{
            setManager,
            initedPage
        },
        data(){
            return {
                tabCfg:{
                    select: '',
                    tabBarData: [{
                        id: 'tab1',
                        name: '岗位与职能授权',
                    },{
                        id:'tab2',
                        name:'待授权职能'
                    }]
                },
                tableCfg: {
                    operating: [true, 'config-operate',
                        [{
                            type: 'blue',
                            btn: 'edit',
                            text: '岗位授权'
                        }]
                    ],
                    serial:false,
                    width: [3,4,11,2], //排除序号，多选，单选，操作栏
                    match: [
                        'name',
                        function(x){
                            return x.relatedPostList.map(function(o){
                                return o.name;
                            }).join('<br><br>')
                        },
                        function(x){
                            return x.users.map(function(o){
                                return o.name;
                            }).join(" / ")
                        },
                    ],
                    head: ['岗位名称', '职能权限', "员工名单"],
                    class:'rbac'
                },
                successCfg:{
                    show:false,
                    type:'success',
                    width:'597',
                    msg:'恭喜您！您已完成系统初始化操作，请点击确认完成',
                    subMsg:'系统将自动向人事档案中的所有员工发送开户短信通知。完成初始化操作后，即可进入管理员的系统操作页面。(页面如未及时跳转，请尝试重新登录)',
                    quite: false,
                    sname: '确认完成',
                },
                warnCfg:{
                    show:false,
                    type:'warning',
                    width:'359',
                    quite:false,
                    msg:'无法进入下一步',
                    subMsg:'您还有未授权分配完的职能项，请点击 “待授权职能”，进行职能授权分配操作。'
                },
                warnSetCfg:{
                    show:false,
                    type:'warning',
                    width:'359',
                    quite:false,
                    msg:'无法进入下一步',
                    subMsg:'您还未设置完部门负责人或未设置最高行政部门'
                },
                //设置部门负责人配置
                manCfg:{
                    show:false
                },
                //岗位授权配置
                roleAuthCfg:{
                    show:false
                },
                //部门列表
                depList:[],
                //部门下的数据详情列表
                depData:[],
                //当前选中的详情的某条数据
                actItem:'',
                //当前选中的部门
                actDepartment:'',
                //当前设置的部门
                actSettingDep:'',

                /*
                * 待授权职能相关
                * */
                waitAuthData:[],
                waitAuthList:[],
                actPost:'',
                actPostDepartment:'',
                postAuthCfg:{
                    show:false
                },
                waitTabCfg:{
                    operating: [true, 'config-operate',
                        [{
                            type: 'blue',
                            btn: 'edit',
                            text: '职能授权'
                        }]
                    ],
                        serial:false,
                        width: [1,19], //排除序号，多选，单选，操作栏
                        match: ['','postName',],
                        head: ['','职能权限'],
                        class:'rbac'
                },
                //是否初始化完成
                isInited:'xxx'

            }
        },
        ready(){
            this.$http.post(__URL.hr + 'enterpriseInitialized/check').then(
                res=>{
                    if(res.data.success){
                        if(res.data.data.step == 0){
                            this.isInited = true
                        }else{
                            this.isInited =false
                            this.getDepList()
                            this.getWaitList()
                        }
                    }
                }
            )

        },
        methods:{
            /*
            * 自动获取第一栏的数据
            * */
            autoGetData(val){
                this.getDepData(val)
                this.actDepartment = val
            },
            /*
             * 获取列表数据
             * */
            getDepList(){
                //在重新设置默认选中的值前先清空
                this.actDepartment = ''
                this.$http.post(__URL.service+'department/enabled-list').then(
                    res=>{
                        if(res.data.success){
                            this.depList = res.data.data
                            if(this.depList.length >0){
                                //自动获取数据
                                this.autoGetData(this.depList[0])
                            }
                        }
                    }
                )
            },
            /*
             * 获取详情数据
             * */
            getDepData(item){
                this.$http.get(__URL.service + 'role/search', {params: {departmentCode: item.code}}).then(
                    res =>{
                        if(res.data.success){
                            this.depData = res.data.data
                        }
                    }
                )
            },
            /*
             * 进行授权操作，弹出参照框
             * */
            doRoleAuth(type,item){
                this.actItem = item
                this.roleAuthCfg.show = true
            },
            /*
             * 设置部门负责人
             * */
            setManager(val){
                this.manCfg.show = true
                this.actSettingDep = val
            },
            /*
             * 传递数据，完成岗位授权操作
             * */
            setRoleAuth(val){
                let param ={
                    'roleCode':this.actItem.code,
                    'postCodes':val.map(item=>item.code)
                }
                this.$http.post(__URL.service + 'role/create/post',{},{params:param}).then(
                    res =>{
                        if(res.data.success){
                            this.$warning({'message':'岗位授权成功','type':'success'})
                            this.getDepList()
                        }else{
                            this.$warning({'message':'岗位授权失败','type':'failure'})
                        }
                    }
                )
            },
            /*
            * 待授权职能相关方法  -------------------------------------
            * */
            autoGetWaitData(val){
                this.getWaitData(val)
                this.actPostDepartment = val
            },

            getWaitList(){
                this.waitAuthData = []
                //在设置默认选中项之前，要先清空该值
                this.actPostDepartment = ''
                this.$http.post(__URL.service +'post/search/departmentTemplate/unrelated').then(
                    res=>{
                        if(res.data.success){
                            this.waitAuthList = res.data.data
                            if(this.waitAuthList.length>0){
                                this.autoGetWaitData(this.waitAuthList[0])
                            }
                        }
                    }
                )
            },
            getWaitData(val){
                this.waitAuthData = []
                if(val.roles && val.roles.length > 0){
                    val.roles.forEach(item=>{
                        this.waitAuthData = this.waitAuthData.concat(item.posts)
                    })
                }else{
                    this.waitAuthData = val.posts
                }
            },
            doPostAuth(type,item){
                this.actPost = item
                this.postAuthCfg.show= true
            },
            setPostAuth(val){
                let param = {
                    params: {
                        'roleCodes': val.map(item => item.code),
                        'postCode': this.actPost.postCode,
                    }
                }
                this.$http.post(__URL.service + 'post/create/role', null, param).then(
                    (res) => {
                        if (res.data.success) {
                           this.$warning({'message':'授权成功！','type':'success'})
                            this.getWaitList()
                        } else {
                            this.$warning({'message':'授权失败！','type':'failure'})
                        }
                    }
                )
            },


            /*
            * 切换Tab处理的方法  --------------------------
            * */
            changeTab(id){
                if(id=='tab1'){
                    this.getDepList()
                }else if(id == 'tab2'){
                    this.getWaitList()
                }
            },



            /*
            * 点击下一步，进行初始化完成相关方法-------------------------------
            * */
            nextStep(){
                this.$http.post(__URL.service +'department/check-init-rbac').then(
                    res=>{
                        if(res.data.success){
                            if(!res.data.data.isSetManager){
                                this.warnSetCfg.show = true
                                this.warnSetCfg.subMsg='您还有部门未设置负责人'
                            }else if(!res.data.data.isSetSupremacy){
                                this.warnSetCfg.show = true
                                this.warnSetCfg.subMsg='您还未设置最高行政部门'
                            }else{
                                this.checkPostAudit()
                            }
                        }else{
                            this.$warning({type:'warning','message':res.data.errMsg})
                        }
                    }
                )
            },
            /*
            * 检测是否授权完成
            * */
            checkPostAudit(){
                this.$http.post(__URL.service +'post/search/departmentTemplate/unrelated').then(
                    res=>{
                        if(res.data.success){
                            if(res.data.data.length>0){
                                this.warnCfg.show = true
                            }else{
                                this.initDone()
                            }
                        }else{
                            this.$warning({type:'warning','message':res.data.errMsg})
                        }
                    }
                )
            },
            /*
            *初始化完成
            * */
            initDone(){
                this.$http.post(__URL.hr+'enterpriseRoleSetDone').then(
                    res=>{
                        if(res.data.success){
                            this.successCfg.show = true
                        }else{
                            this.$warning({type:'warning','message':res.data.errMsg})
                        }
                    }
                )

            },
            goAnotherPage(){
                this.$router.go('/a/entInfo')
            }
        },
    }
</script>

<template>
    <container v-if="isInited == false">
        <div class="body_item">
            <div class="left_item">
                <div class="item_head between">
                </div>
                <div class="item_body">
                    <tab-bar :config="tabCfg" @cb="changeTab"></tab-bar>
                    <tab-container :active="tabCfg.select" class="box">
                        <tab-item id="tab1">
                            <menu  :default-opened="[actDepartment.code]" :default-active="actDepartment.code">
                                <submenu @cb="getDepData(item)" v-for="item in depList" :index="item.code" :has-children="item.children.length>0">
                                    <template slot="title">
                                        <div class="list-space">
                                            <div>
                                                {{item.name}}
                                                <span @click.stop="setManager(item)" class="gray">
                                                ({{item.managerName == null? '设置负责人' :item.managerName}}<i  class="icon-edit"></i>)
                                                </span>
                                            </div>
                                        </div>
                                    </template>
                                    <menu-item @cb="getDepData(info)" v-for="info in item.children" :index="info.code">
                                        {{info.name}}
                                        <span @click.stop="setManager(info)" class="gray">
                                                ({{info.managerName == null? '设置负责人' :info.managerName}}<i  class="icon-edit"></i>)
                                                </span>
                                    </menu-item>
                                </submenu>
                            </menu>
                        </tab-item>
                        <tab-item id="tab2">
                            <menu  :default-opened="[actPostDepartment.departmentCode]" :default-active="actPostDepartment.departmentCode">
                                <submenu @cb="getWaitData(item)" v-for="item in waitAuthList" :index="item.departmentCode" :has-children="item.roles.length>0">
                                    <template slot="title">
                                        <div class="list-space">
                                            <div>
                                                {{item.departmentName}}
                                            </div>
                                            <div>
                                                {{item.roles.length}}
                                            </div>
                                        </div>
                                    </template>
                                    <menu-item @cb="getWaitData(info)" v-for="info in item.roles" :index="info.roleCode">
                                            {{info.roleName}}
                                    </menu-item>
                                </submenu>
                            </menu>
                        </tab-item>
                    </tab-container>
                </div>
            </div>
            <div class="right_item">
                <div class="item_head btn-ic">
                    <button class="btn-xl-imp" @click="nextStep">下一步</button>
                </div>
                <div class="item_body">
                    <vtable v-if="tabCfg.select == 'tab1'" :config='tableCfg' :data='depData'  @op="doRoleAuth"></vtable>
                    <vtable v-if="tabCfg.select == 'tab2'" :config='waitTabCfg' :data='waitAuthData'  @op="doPostAuth"></vtable>
                </div>
            </div>
        </div>
        <!--岗位授权-->
        <refer-role-auth :config="roleAuthCfg" :data="actItem.relatedPostList" @cb="setRoleAuth"></refer-role-auth>
        <!--设置部门负责人-->
        <set-manager :config="manCfg" :data="actSettingDep" :init="true" @cb="getDepList"></set-manager>
        <!--职能授权-->
        <refer-post-auth :config="postAuthCfg" :data="" @cb="setPostAuth"></refer-post-auth>
        <!--成功提示框-->
        <alert :config="successCfg" @cb="goAnotherPage"></alert>
        <!--授权职能错误提示框-->
        <alert :config="warnCfg"></alert>
        <!--负责人未设置完成提示框-->
        <alert :config="warnSetCfg"></alert>

    </container>
    <inited-page v-if="isInited == true"></inited-page>
</template>

<style lang="less" scoped>
    .box{
        height: calc(~"100% - 52px");
        overflow: auto;
    }
    .gray{
        color: #757575;
        margin-left: 10px;
        i{
            margin-left: 5px;
        }
        &:hover{
            color: #008af5;
        }
    }
    .list-space{
        width:calc(~'100% - 40px') ;
        display: flex;
        justify-content: space-between;
    }
</style>