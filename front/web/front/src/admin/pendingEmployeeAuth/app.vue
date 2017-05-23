<script>
    import cfg from './cfg.js'
    import referRoleAuth from 'nb/refer/roleAuth.vue'
    import referPostAuth from 'nb/refer/postAuth.vue'

    export default {
        components: {
            referRoleAuth,
            referPostAuth,
        },
        data() {
            return {
                // 列表数据
                listData: [],
                // 列表选项卡当前项的索引
                activeTab: 0,
                // 表格数据
                tableData: [],
                // 岗位授权参照配置
                employeeModalCfg: {
                    show: false,
                },
                // 职能授权参照配置
                functionModalCfg: {
                    show: false,
                },
                // 岗位参照数据
                employeeModalData: [],
                // 职能参照数据
                functionModalData: [],
                // 参照选择对象的code
                referObjCode: '',
                actDepartment: '',
            }
        },
        computed: {
            // 列表组件配置
            tabCfg () {
                return {
                    select: 'tab' + (this.activeTab + 1),
                    tabBarData: [{
                        id: 'tab1',
                        name: '待授权岗位',
                    },{
                        id:'tab2',
                        name: '待授权职能',
                    }],
                }
            },
            // 表格配置
            tableCfg () {
                if (this.activeTab === 0) {
                    return cfg.employeeTableCfg
                } else if (this.activeTab === 1) {
                    return cfg.functionTableCfg
                }
            },
        },
        methods: {
            // 列表选项卡切换
            changeTab (id) {
                if(id === 'tab1'){
                    this.choiceTab(0)
                } else if (id === 'tab2') {
                    this.choiceTab(1)
                }
            },
            choiceTab (index) {
                this.tableData = []
                this.activeTab = index
                this.getTabData()
            },
            // 自动获取第一栏的数据
            autoGetData (item) {
                this.getDepData(item)
                this.actDepartment = item
                console.log(item)
            },
            // 获取列表的数据
            getTabData () {
                this.actDepartment = ''
                let url
                let params
                if (this.activeTab === 0) {
                    url = __URL.service + 'department/dept-role-count-list'
                    params = {
                        params: {
                            authorized: false,
                        }
                    }
                } else if (this.activeTab === 1) {
                    url = __URL.service + 'post/search/departmentTemplate/unrelated'
                    params = {
                        params: {}
                    }
                }
                this.$http.post(url, null, params).then(
                    (res) => {
                        if (res.data.success) {
                            this.listData = res.data.data
                            if (this.listData.length) this.autoGetData(this.listData[0])
                        } else {
                            this.$warning({'type': 'warning','message': res.data.errMsg})
                        }
                    }
                )
            },
            // 获取选项的表格数据
            getDepData (item) {
                if (this.activeTab === 0) {
                    this.loadEmployeeTable(item)
                } else if (this.activeTab === 1) {
                    this.loadFunctionTable(item)
                }
            },
            // 不同tab加载表格数据的方法
            loadEmployeeTable (item) {
                if (!item) return
                const params = {
                    params: {
                        departmentCode: item.code,
                    }
                }
                this.$http.get(__URL.service + 'role/search/unrelated', params).then(
                    (res) => {
                        if (res.data.success) {
                            this.tableData = res.data.data
                        } else {
                            this.$warning({'type': 'warning','message': res.data.errMsg})
                        }
                    }
                )
            },
            loadFunctionTable (item) {
                if (item && item.posts) {
                    this.tableData = item.posts
                } else {
                    this.tableData = []
                }
            },
            // 表格操作类型判断
            operating (type, item) {
                if (type === 'employee') this.employeeModalOpen(item)
                if (type === 'function') this.functionModalOpen(item)
            },
            // 岗位授权 modal open/cb 事件
            employeeModalOpen (item) {
                this.employeeModalCfg.show = true
                this.referObjCode = item.code
            },
            updateEmployeeModalData (val) {
                this.employeeModalData = []
                const params = {
                    params: {
                        roleCode: this.referObjCode,
                        postCodes: val.map(obj => obj.code),
                    }
                }
                this.$http.post(__URL.service + 'role/create/post', null, params).then(
                    (res) => {
                        if (res.data.success) {
                            this.$warning({'type': 'success','message': '岗位授权成功'})
                        } else {
                            this.$warning({'type': 'warning','message': res.data.errMsg})
                        }
                    }
                )
                this.choiceTab(0)
            },
            // 职能授权 modal open/cb 事件
            functionModalOpen (item) {
                this.functionModalCfg.show = true
                this.referObjCode = item.postCode
            },
            updateFunctionModalData (val) {
                this.functionModalData = []
                const params = {
                    params: {
                        roleCodes: val.map(obj => obj.code),
                        postCode: this.referObjCode,
                    }
                }
                this.$http.post(__URL.service + 'post/create/role', null, params).then(
                    (res) => {
                        if (res.data.success) {
                            this.$warning({'type': 'success','message': '职能授权成功'})
                        } else {
                            this.$warning({'type': 'warning','message': res.data.errMsg})
                        }
                    }
                )
                this.choiceTab(1)
            },
        },
        ready() {
            this.choiceTab(0)
        },
    }
</script>
<template>
    <container>
        <div class="body_item">
            <div class="left_item">
                <div class="item_head between"></div>

                <div class="item_body">
                    <tab-bar :config="tabCfg" @cb="changeTab"></tab-bar>
                    <menu :default-opened="[actDepartment.code]" :default-active="actDepartment.code">
                        <template v-if="activeTab === 0">
                            <submenu v-for="(index, item) in listData" @cb="getDepData(item)"
                                     :index="item.code" :has-children="item.children && item.children.length > 0">
                                <template slot="title">
                                    <div class="list-space">
                                        <div>{{item.name}}</div>
                                        <div>{{item.roleCount}}</div>
                                    </div>
                                </template>
                                <menu-item v-for="sonItem in item.children" @cb="getDepData(sonItem)"
                                           :index="sonItem.code">
                                    <div class="list-space son">
                                        <div>{{sonItem.name}}</div>
                                        <div>{{sonItem.roleCount}}</div>
                                    </div>
                                </menu-item>
                            </submenu>
                        </template>
                        <template v-if="activeTab === 1">
                            <submenu v-for="(index, item) in listData" @cb="getDepData(item)"
                                     :index="item.code" :has-children="item.roles && item.roles.length > 0">
                                <template slot="title">
                                    <div class="list-space">
                                        <div>{{item.departmentName}}</div>
                                        <div>{{item.count}}</div>
                                    </div>
                                </template>
                                <menu-item v-for="sonItem in item.roles" @cb="getDepData(sonItem)"
                                           :index="sonItem.code">
                                    <div class="list-space son">
                                        <div>{{sonItem.roleName}}</div>
                                        <div>{{sonItem.count}}</div>
                                    </div>
                                </menu-item>
                            </submenu>
                        </template>
                    </menu>
                </div>
            </div>

            <div class="right_item">
                <div class="item_head btn-ic"></div>
                <div class="item_body">
                    <vtable :config='tableCfg' :data='tableData' @op="operating"></vtable>
                </div>
            </div>
        </div>

        <!-- 岗位授权 -->
        <refer-role-auth :config="employeeModalCfg" :data="employeeModalData"
                         :role-code="referObjCode" @cb="updateEmployeeModalData"></refer-role-auth>

        <!-- 职能授权 -->
        <refer-post-auth :config="functionModalCfg" :data="functionModalData"
                         :role-code="referObjCode" @cb="updateFunctionModalData"></refer-post-auth>
    </container>
</template>

<style lang="less" scoped>
    .list-space {
        width:calc(~'100% - 40px');
        display: flex;
        justify-content: space-between;

        &.son {
            width:calc(~'100% - 16px');
        }
    }
</style>
