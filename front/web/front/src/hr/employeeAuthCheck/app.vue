<script>
import cfg from './cfg.js'
import checkEmployee from '../employee/checkEmployee'
export default {
    components: {
        cfg,
        checkEmployee,
    },
    ready() {
        this.choiceTab(0)
    },
    data() {
        return {
            /* 列表数据 */
            listData: [],
            // 列表选项卡当前项的索引
            activeTab: 0,
            // 各选项卡选中状态索引
            firstCkdCode: '',
            secondCkdCode: '',
            secondOpen: {
                code: 0,
                state: false,
            },
            secondSonCkdCode: '',
            thirdCkdCode: '',
            thirdOpen: {
                code: 0,
                state: false,
            },
            thirdSonCkdCode: '',
            /* 列表数据 end */

            filterCfg:cfg.leftItemCfg.filterCfg,
            checkConfig:{
                show: false,
                width: '100%',
                height: '100%',
                title: '员工档案',
            },
            filterModCfg:{
                show: false,
                width: '370px',
                height: 'auto',
                header: '筛选',
                btn: [{
                    name: '关闭',
                    emit: 'close',
                }, {
                    name: '确定',
                    emit: 'sure',
                }]
            },
            msgCfg:{
                type:'warning',
                show:false,
                content:''
            },
            tableData: [],
            detailData: '',
            employeeDetail:{},
            listDetail:[],
            tabCount:{},
            totalCount:0,
            pageIndex:1,
            ckdCode:'',
            openCode:'',
        }
    },
    methods: {
        getCount(){
            this.$http.post(__URL.hr + 'employee/auth/findTabCount', {}).then(
                (res) => {
                    if(res.data.success){
                        this.tabCount = res.data.data
                    }else{
                        this.msgCfg.show=true
                        this.msgCfg.content=res.data.errMsg
                    }
                }
            )
        },
        href(item, type) {
            const code = item.employeeCode || item.code
            if(type === 'employeeName' || type === 'name') {
                this.$http.get(__URL.hr + 'employee/find/code/' + code).then(
                    (res) => {
                        if(res.data.success){
                            this.employeeDetail=res.data.data
                            this.checkConfig.show=true
                        }else{
                            this.warningFunc('warning', true, res.data.errMsg)
                        }
                    }
                )
            }
        },
        //关闭查看页面
        closeCheckEmployee(){
            this.checkConfig.show=false
        },
        getFirst(type){
            var param={
                //"pageIndex": this.pageIndex,
                "pageIndex": 0,
                "pageSize": 0,
                "recordStatus": this.recordStatus,
            }
            this.$http.post(__URL.arc + 'process/department/list', param).then(
                (res) => {
                    if(res.data.success){
                        if (type == 'refresh') {
                            this.listDetail.splice(0, this.listDetail.length);
                        }
                        for(var i=0;i<res.data.data.dataList.length;i++){
                            this.listDetail.push(res.data.data.dataList[i])
                        }
                        this.totalCount=res.data.data.totalCount;
                        if(this.listDetail.length>0){
                            this.openFirst(this.listDetail[0])
                        }
                    }else{
                        this.msgCfg.show=true
                        this.msgCfg.content=res.data.errMsg
                    }
                }
            )
        },
        loadMore(){
            this.getFirst('add')
        },

        // warning 弹窗
        warningFunc (type, state, msg) {
            this.msgCfg.type = type
            this.msgCfg.show = state
            this.msgCfg.content = msg
        },

        /* 列表方法 */
        // 列表选项卡切换
        choiceTab (index) {
            this.initListCfg()
            this.tableData = []
            this.activeTab = index
            if (this.activeTab === 0) {
                this.firstCkdCode = 0
            } else if (this.activeTab === 1) {
                this.secondCkdCode = 0
            } else if (this.activeTab === 2) {
                this.thirdCkdCode = 0
            }
            this.getTabData(this.activeTab)
        },
        // 清除选中状态的配置
        initListCfg () {
            this.firstCkdCode = ''
            this.secondCkdCode = ''
            this.secondOpen = {
                code: 0,
                state: false,
            }
            this.secondSonCkdCode = ''
            this.thirdCkdCode = ''
            this.thirdOpen = {
                code: 0,
                state: false,
            }
            this.thirdSonCkdCode = ''
        },
        // 列表选中项事件
        openFirst (index, activeTab, item) {
            if (activeTab === 1) {
                this.secondOpen.code = index
                if (this.secondCkdCode === this.secondOpen.code) {
                    this.secondOpen.state = !this.secondOpen.state
                    if (this.secondOpen.state === false) this.secondSonCkdCode = ''
                } else {
                    this.secondOpen.state = true
                }
                this.secondCkdCode = index
            } else if (activeTab === 2) {
                this.thirdOpen.code = index
                if (this.thirdCkdCode === this.thirdOpen.code) {
                    this.thirdOpen.state = !this.thirdOpen.state
                    if (this.thirdOpen.state === false) this.thirdSonCkdCode = ''
                } else {
                    this.thirdOpen.state = true
                }
                this.thirdCkdCode = index
            }
            this.loadTabFirstTable(activeTab, item)
        },
        // 获取列表的数据
        getTabData (activeTab) {
            this.getCount()
            let url
            let params
            if (activeTab === 0) {
                url = 'employee/unauth'
                params = {}
            } else if (activeTab === 1) {
                url = 'employee/find/department/list'
                params = {
                    pageIndex: 0,
                    pageSize: 0,
                    working: 1,
                    authStatus: 1,
                }
            } else if (activeTab === 2) {
                url = 'employee/find/department/list'
                params = {
                    pageIndex: 0,
                    pageSize: 0,
                    working: 1,
                    authStatus: 1,
                    accountStatus: 1,
                }
            }
            this.$http.post(__URL.hr + url, params).then(
                (res) => {
                    if (res.data.success) {
                        if (activeTab === 0) {
                            this.listData = res.data.data
                            this.firstLoadTabTable(0)
                        } else {
                            this.listData = res.data.data.dataList
                            this.loadTabFirstTable(activeTab, this.listData[0])
                        }
                    } else {
                        this.warningFunc('warning', true, res.data.errMsg)
                    }
                }
            )
        },
        // 点击列表选项加载一级选项卡的数据
        loadTabFirstTable (activeTab, item) {
            if (!item) return
            let params
            if (activeTab === 1) {
                params = {
                    pageIndex: 0,
                    pageSize: 0,
                    working: 1,
                    authStatus: 1,
                    departmentCode: item.departmentCode,
                }
            } else if (activeTab === 2) {
                params = {
                    pageIndex: 0,
                    pageSize: 0,
                    working: 1,
                    authStatus: 1,
                    accountStatus: 1,
                    departmentCode: item.departmentCode,
                }
            }
            this.$http.post(__URL.hr + 'employee/find/detail/list', params).then(
                (res) => {
                    if (res.data.success) {
                        this.tableData = res.data.data.dataList
                    } else {
                        this.warningFunc('warning', true, res.data.errMsg)
                    }
                }
            )
        },
        // 点击列表选项加载表格数据
        firstLoadTabTable (index) {
            this.firstCkdCode = index
            let params
            switch (index) {
                case 0:
                    params = {
                        pageIndex: 0,
                        pageSize: 0,
                        authStatus: 0,
                        roleStatus: 1,
                        isNew: 1,
                    }
                    break
                case 1:
                    params = {
                        pageIndex: 0,
                        pageSize: 0,
                        roleStatus: 0,
                        isNew: 0,
                        authStatusList: [0, 2],
                    }
                    break
                case 2:
                    params = {
                        pageIndex: 0,
                        pageSize: 0,
                        authStatus: 0,
                        roleStatus: 1,
                        isNew: 0,
                    }
                    break
                case 3:
                    params = {
                        pageIndex: 0,
                        pageSize: 0,
                        authStatus: 2,
                        roleStatus: 1,
                        isNew: 1,
                    }
                    break
            }
            this.$http.post(__URL.hr + 'employee/auth/list', params).then(
                (res) => {
                    if (res.data.success) {
                        this.tableData = res.data.data.dataList
                    } else {
                        this.warningFunc('warning', true, res.data.errMsg)
                    }
                }
            )
        },
        loadTabTable (activeTab, index, item, fatherIndex) {
            if (!item) return
            let status
            if (activeTab === 1) {
                this.secondCkdCode = fatherIndex
                this.secondSonCkdCode = index
                status = ''
            } else if (activeTab === 2) {
                this.thirdCkdCode = fatherIndex
                this.thirdSonCkdCode = index
                status = 1
            }
            const params = {
                departmentCode: item.departmentCode,
                pageIndex: 0,
                pageSize: 0,
                working: 1,
                authStatus: 1,
                accountStatus: status,
            }
            this.$http.post(__URL.hr + 'employee/find/detail/list', params).then(
                (res) => {
                    if (res.data.success) {
                        this.tableData = res.data.data.dataList
                    } else {
                        this.warningFunc('warning', true, res.data.errMsg)
                    }
                }
            )
        },
        /* 列表方法 end */
    },
    computed: {
        tableCfg() {
            return cfg.tableCfg
        },
        lookTableCfg() {
            return cfg.lookTableCfg
        },
        hasMore:function(){
            if(this.totalCount>this.pageIndex && this.pageIndex<(this.totalCount/20)){
                return true
            }else{
                return false
            }
        }
    }
}
</script>
<template>
    <container>
        <div class="body_item">
            <div class="left_item">
                <div class="item_head between">
                    <a @click=''>
                        <!--<i class="icon-hp_list__add"></i>新增-->
                    </a>
                    <a href="javascript:;"  @click=''>
                        <!--<i class="icon-filter-two"></i>筛选-->
                    </a>
                </div>

                <div class="item_body">
                    <div class="list_div">
                        <div class="list_tab">
                            <a @click="choiceTab(0)" :class="{ 'ckd': activeTab === 0 }" href="javascript:;">未授权({{tabCount.oneEmployeeCount}})</a>
                            <a @click="choiceTab(1)" :class="{ 'ckd': activeTab === 1 }" href="javascript:;">已授权({{tabCount.twoEmployeeCount}})</a>
                            <a @click="choiceTab(2)" :class="{ 'ckd': activeTab === 2 }" href="javascript:;">已启用({{tabCount.threeEmployeeCount}})</a>
                        </div>
                        <div class="list_content">
                            <!-- 页签1 -->
                            <ul v-if="activeTab === 0" class="listbox">
                                <li v-for="(index, item) in listData" class="first_li">
                                    <a @click="firstLoadTabTable(index)"
                                       :class="{'ckd': firstCkdCode === index}" href="javascript:;">
                                        <p class="main">{{ item.status }}</p>
                                        <p class="main">{{ item.count }}</p>
                                    </a>
                                </li>
                            </ul>

                            <!-- 页签2 -->
                            <ul v-if="activeTab === 1" class="listbox">
                                <li v-for="(index, item) in listData" class="first_li">
                                    <a @click="openFirst(index, activeTab, item)"
                                       :class="{'ckd': secondCkdCode === index && secondSonCkdCode === ''}" href="javascript:;">
                                        <template v-if="item.children && item.children.length">
                                            <i v-show="secondOpen.code === index && secondOpen.state" class="icon-hp_list__dropdown childchoice"></i>
                                            <i v-else class="icon-hp_list__right"></i>
                                        </template>
                                        <span :class="{'childchoice': secondCkdCode === index}" class="main">{{ item.departmentName }}</span>
                                        <span :class="{'childchoice': secondCkdCode === index}" class="main">{{ item.employeeCount }}</span>
                                    </a>
                                    <ul v-if="item.children && item.children.length"
                                        v-show="secondOpen.code === index && secondOpen.state" class="sec_ul">
                                        <li v-for="(sonIndex, sonItem) in item.children" @click="loadTabTable(activeTab, sonIndex, sonItem, index)"
                                            :class="{'ckd': secondSonCkdCode === sonIndex}" class="sec_li">
                                            <p class="main">{{ sonItem.departmentName }}</p>
                                            <p class="main">{{ sonItem.employeeCount }}</p>
                                        </li>
                                    </ul>
                                </li>
                            </ul>

                            <!-- 页签3 -->
                            <ul v-if="activeTab === 2" class="listbox">
                                <li v-for="(index, item) in listData" class="first_li">
                                    <a @click="openFirst(index, activeTab, item)"
                                       :class="{'ckd': thirdCkdCode === index && thirdSonCkdCode === ''}" href="javascript:;">
                                        <template v-if="item.children && item.children.length">
                                            <i v-show="thirdOpen.code === index && thirdOpen.state" class="icon-hp_list__dropdown childchoice"></i>
                                            <i v-else class="icon-hp_list__right"></i>
                                        </template>
                                        <span :class="{'childchoice': thirdCkdCode === index}" class="main">{{ item.departmentName }}</span>
                                        <span :class="{'childchoice': thirdCkdCode === index}" class="main">{{ item.employeeCount }}</span>
                                    </a>
                                    <ul v-if="item.children && item.children.length"
                                        v-show="thirdOpen.code === index && thirdOpen.state" class="sec_ul">
                                        <li v-for="(sonIndex, sonItem) in item.children" @click="loadTabTable(activeTab, sonIndex, sonItem, index)"
                                            :class="{'ckd': thirdSonCkdCode === sonIndex}" class="sec_li">
                                            <p class="main">{{ sonItem.departmentName }}</p>
                                            <p class="main">{{ sonItem.employeeCount }}</p>
                                        </li>
                                    </ul>
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
                <div class="item_head btn-ic"></div>
                <div class="item_body">
                    <vtable v-if="activeTab === 0" :config='tableCfg' :data='tableData' @link='href'></vtable>
                    <vtable v-else :config='lookTableCfg' :data='tableData' @link='href'></vtable>
                </div>
            </div>
        </div>
    </container>

    <!--筛选弹框 -->
    <modal :config.sync='filterModCfg' @sure='filterSure' @close='filterClose'>
        <filter :config.sync='filterCfg' @cb=''></filter>
    </modal>

    <!--查看内页-->
    <inner :config='checkConfig'>
        <check-employee :employee-detail='employeeDetail' @refresh='closeCheckEmployee'></check-employee>
    </inner>

    <warning :config="msgCfg" ></warning>
</template>

<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';

    .item_head:hover{
        cursor: pointer;
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

</style>
