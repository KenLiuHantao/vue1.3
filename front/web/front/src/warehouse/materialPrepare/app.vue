<script>



import cfg from './cfg.js'

import newPrepare from './newPrepare'
import viewPrepare from './viewPrepare'
import viewIssue from './viewIssue'

export default {
    components: {
        newPrepare,
        viewPrepare,
        viewIssue
    },
    ready() {

    },
    data() {
        return {
            leftItemCfg: cfg.leftItemCfg,
            newConfig: {
                show: false,
                width: '100%',
                height: '100%',
                title: '生产备料单'
            },
            viewConfig: {
                show: false,
                width: '100%',
                height: '100%',
                title: '生产备料单'
            },
            viewIssueConfig: {
                show: false,
                width: '100%',
                height: '100%',
                title: '发料单'
            },
            warnConfig: {
                show: false,
                type: 'warning',
                content: '请选择生产单！'
            },
            listObj: cfg.listParam,
            tableData: [],
            radioObj: {},
            checkedData: [],
            selectedData: {}
        }
    },
    methods: {
        /* 重置对象 */
        initListObj(obj) {
            let init = {
                'pageIndex': 0,
                'pageSize': 0,
                'docNo': '',
                'docDate': obj.docDate ? obj.docDate : this.listObj.docDate,
                'startDocDate': '',
                'endDocDate': '',
                'employeeCode': '',
                'salesOrderDocNo': '',
                'srcDocNo': '',
                'inventoryCode': '',
                'inventoryName': '',
                'inventorySpec': ''
            }
            return init
        },
        // table返回的操作参数
        operate(type, item) {

        },
        href(item, type) {
            this.selectedData = item;
            if(cfg.leftItemCfg.tabCfg.select == 'tab1') {
                this.newConfig.show = true;
            } else if(cfg.leftItemCfg.tabCfg.select == 'tab2') {
                this.viewConfig.show = true;
            } else if(cfg.leftItemCfg.tabCfg.select == 'tab3') {
                this.viewIssueConfig.show = true;
            }
        },
        getFilter(item, obj) {
            if(obj && obj.processCode) {
                item.processCode = obj.processCode;
            }
            this.getList(item);
            this.checkedData = [];
        },
        /* 数据请求 */
        getList(obj) {
            var url = __URL.manufacture + 'production/prepare/findList';
            switch(cfg.leftItemCfg.tabCfg.select) {
                case 'tab1':
                    url = __URL.manufacture + 'production/prepare/findList';
                    break;
                case 'tab2':
                    url = __URL.warehouse + 'material/prepare/query/list';
                    break;
                case 'tab3':
                    url = __URL.manufacture + 'prepare/orderList';
                    break;
            }

            this.$http.post(url, obj).then((res) => {
                this.tableData = res.data.data.dataList
            });
        },
        showMsg(type, msg) {
            this.warnConfig.show = true;
            this.warnConfig.type = type;
            this.warnConfig.content = msg;
        },
        refresh() {
            let _this = this;
            setTimeout(function() {
                _this.newConfig.show = false;
                _this.viewConfig.show = false;
                _this.warnConfig.show = false;
                _this.$broadcast('_RESETLIST');
                _this.tableData = [];
            }, 1000);
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
            this.tableData = [];
            var myCfg = cfg.waitPrepareTableCfg;
            switch(cfg.leftItemCfg.tabCfg.select) {
                case 'tab1':
                    myCfg = cfg.waitPrepareTableCfg;
                    break;
                case 'tab2':
                    myCfg = cfg.prepareTableCfg;
                    break;
                case 'tab3':
                    myCfg =  cfg.issueTableCfg;
                    break;
            }
            return myCfg;
        },
        tableParams() {
            let param = {
                'entCode': '',
                'params': {
                    'pageIndex': 0,
                    'pageSize': 0,
                    'docNo': '',
                    'docDate': this.listObj.docDate,
                    'startDocDate': '',
                    'endDocDate': '',
                    'employeeCode': '',
                    'salesOrderDocNo': '',
                    'srcDocNo': '',
                    'inventoryCode': '',
                    'inventoryName': '',
                    'inventorySpec': ''
                },
                'userCode': ''
            }

            return param
        }
    }
}
</script>
<template>
    <container>
        <div class="body_item">
            <div class="left_item">
                <new-app :config='leftItemCfg' @tab='clearTable' @cb='getFilter'></new-app>
            </div>
            <div class="right_item">
                <div class="item_head btn-ic">

                </div>
                <div class="item_body">
                    <vtable :checkbox.sync='checkedData' :config='tableCfg' :data='tableData' @op='operate' @link='href' ></vtable>
                </div>
            </div>
        </div>
    </container>

    <!-- 新增备料内页-->
    <inner :config='newConfig'>
        <new-prepare :checks.sync="selectedData" @refresh='refresh' @close="newConfig.show = false;"></new-prepare>
    </inner>

    <!-- 查看备料内页-->
    <inner :config='viewConfig'>
        <view-prepare :docno.sync="selectedData.docNo" @close="viewConfig.show = false;"></view-prepare>
    </inner>

    <!-- 查看领料内页-->
    <inner :config='viewIssueConfig'>
        <view-issue :docno.sync="selectedData.docNo" @close="viewIssueConfig.show = false;"></view-issue>
    </inner>

    <warning :config="warnConfig"></warning>
</template>
<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';
</style>

