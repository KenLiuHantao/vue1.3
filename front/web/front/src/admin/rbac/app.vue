<script>
    import setManager from './setManager'
    export default{
        components:{
            setManager
        },
        data(){
            return {
                tabCfg:{
                    select: '',
                    tabBarData: [{
                        id: 'tab1',
                        name: '岗位与职能授权',
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
                    serial:true,
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
                actSettingDep:''
            }
        },
        ready(){
            this.getDepList()
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
                //在设置默认选中项前，要先清空该值，不然菜单检测不到值的变化，active不会改变
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
                this.$http.get(__URL.service + 'role/search/related', {params: {departmentCode: item.code}}).then(
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
                    <tab-bar :config="tabCfg"></tab-bar>
                    <tab-container :active="tabCfg.select" class="box">
                        <tab-item id="tab1">
                            <menu  :default-opened="[actDepartment.code]" :default-active="actDepartment.code">
                                <submenu @cb="getDepData(item)" v-for="item in depList" :index="item.code" :has-children="item.children.length>0" >
                                    <template slot="title">
                                        <div class="list-space">
                                            <span>{{item.name}}</span>
                                            <span @click.stop="setManager(item)" class="gray">
                                                ({{item.managerName == null? '设置负责人' :item.managerName}}<i  class="icon-edit"></i>)
                                            </span>
                                        </div>
                                    </template>
                                    <menu-item @cb="getDepData(info)" v-for="info in item.children" :index="info.code">
                                        <div class="secondList">
                                            <span>{{info.name}}</span>
                                            <span @click.stop="setManager(info)" class="gray">
                                                ({{info.managerName == null? '设置负责人' :info.managerName}}<i  class="icon-edit"></i>)
                                            </span>
                                        </div>
                                    </menu-item>
                                </submenu>
                            </menu>
                        </tab-item>
                    </tab-container>
                </div>
            </div>
            <div class="right_item">
                <div class="item_head btn-ic">
                </div>
                <div class="item_body">
                    <vtable :config='tableCfg' :data='depData'  @op="doRoleAuth"></vtable>
                </div>
            </div>
        </div>
        <refer-role-auth :config="roleAuthCfg"  :data="actItem.relatedPostList" @cb="setRoleAuth"></refer-role-auth>
        <set-manager :config="manCfg" :data="actSettingDep" @cb="getDepList"></set-manager>
    </container>
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
.list-space {
    width: calc(~'100% - 40px');
    display: flex;
    justify-content: space-between;
}
.secondList {
    width: calc(~"100% - 16px");
    display: flex;
    justify-content: space-between;
}
</style>