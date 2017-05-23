<script>



import cfg from './cfg.js'

import newInbound from './newInbound'
import viewInbound from './viewInbound'
import viewPurchase from '../../purchase/purOrder/viewPurchase'
import viewOscPurchase from '../../purchase/outsource/viewPurchase'
import viewProduction from '../../manufacture/allOrder/checkOrder'

export default {
    components: {
        newInbound,
        viewInbound,
        viewPurchase,
        viewOscPurchase,
        viewProduction
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
                title: '新建成品入库单'
            },
            viewConfig: {
                show: false,
                width: '100%',
                height: '100%',
                title: '成品入库单'
            },
            viewPurchaseConfig: {
                show: false,
                width: '100%',
                height: '100%',
                title: '采购单'
            },
            viewOscPurchaseConfig: {
                show: false,
                width: '100%',
                height: '100%',
                title: '委外采购单'
            },
            viewProductionConfig: {
                show: false,
                width: '100%',
                height: '100%',
                title: '生产单',
                workflow: {
                    no: 0,
                    name: ''
                }
            },
            warnConfig: {
                show: false,
                type: 'warning',
                content: '请选择来源单！'
            },
            listObj: cfg.listParam,
            tableData: [],
            checkedData: [],
            selectedData: null
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
                'pageIndex': 0,
                'pageSize': 0,
                'docNo': '',
                'yearWeek': obj.yearWeek ? obj.yearWeek : this.listObj.yearWeek,
                'startDocDate': '',
                'endDocDate': '',
                'employeeCode': '',
                'srcDocNo': '',
                'startSrcDocDate': '',
                'endSrcDocDate': '',
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
            switch(cfg.leftItemCfg.tabCfg.select) {
                case 'tab1':
                    switch(item.docType) {
                        case 1:
                            this.viewPurchaseConfig.show = true;
                            break;
                        case 2:
                            this.viewOscPurchaseConfig.show = true;
                            break;
                        case 3:
                            this.viewProductionConfig.show = true;
                            this.viewProductionConfig.workflow.no = 5;
                            this.viewProductionConfig.workflow.name = '待入库';
                            break;
                    }
                    break;
                case 'tab2':
                    this.viewConfig.show = true;
                    break;
            }
        },
        getFilter(item, obj) {
            if(obj && obj.supplierCode) {
                item.supplierCode = obj.supplierCode;
            }
            if(obj && obj.yearWeek) {
                item.yearWeek = obj.yearWeek;
            }
            this.getList(item)
        },
        /* 数据请求 */
        getList(obj) {
            var url = __URL.warehouse + 'product/receipt/query/list';
            switch(cfg.leftItemCfg.tabCfg.select) {
                case 'tab1':
                    url = __URL.warehouse + 'product/receipt/query/list';
                    break;
                case 'tab2':
                    url = __URL.warehouse + 'product/inbound/query/list';
                    break;
            }

            this.$http.post(url, obj).then((res) => {
                this.tableData = res.data.data.dataList
            });
        },
        doInbound() {
            if(!this.checkedData.length) {
                this.warnConfig.show = true;
                return;
            }
            this.newConfig.show = true;
        },
        refresh() {
            let _this = this;
            setTimeout(function() {
                _this.newConfig.show = false;
                _this.viewConfig.show = false;
                _this.warnConfig.show = false;
                _this.$broadcast('_RESETLIST');
                _this.tableData = [];
            }, 1500);
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
            var myCfg = cfg.waitInboundTableCfg;
            switch(cfg.leftItemCfg.tabCfg.select) {
                case 'tab1':
                    myCfg = cfg.waitInboundTableCfg;
                    break;
                case 'tab2':
                    myCfg = cfg.inboundTableCfg;
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
                    'yearWeek': this.listObj.yearWeek,
                    'startDocDate': '',
                    'endDocDate': '',
                    'employeeCode': '',
                    'srcDocNo': '',
                    'startSrcDocDate': '',
                    'endSrcDocDate': '',
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
                    <a href="javascript:;" v-if="leftItemCfg.tabCfg.select == 'tab1'" @click="doInbound">
                        <i class='icon-store__import'></i>入库
                    </a>
                </div>
                <div class="item_body">
                    <vtable :checkbox.sync='checkedData' :config='tableCfg' :data='tableData' @op='operate' @link='href'></vtable>
                </div>
            </div>
        </div>
    </container>

    <!-- 新增入库内页-->
    <inner :config='newConfig'>
        <new-inbound :checks.sync="checkedData" @refresh='refresh' @close="newConfig.show = false;"></new-inbound>
    </inner>

    <!-- 查看入库内页-->
    <inner :config='viewConfig'>
        <view-inbound :docno.sync="selectedData.docNo" @close="viewConfig.show = false;"></view-inbound>
    </inner>

    <!-- 查看采购单内页-->
    <inner :config='viewPurchaseConfig'>
        <view-purchase :docno="selectedData.docNo" @refresh='viewPurchaseConfig.show = false;' :detailconfig="viewPurchaseConfig"></view-purchase>
    </inner>

    <!-- 查看委外采购单内页-->
    <inner :config='viewOscPurchaseConfig'>
        <view-osc-purchase :docno="selectedData.docNo" @refresh='viewOscPurchaseConfig.show = false;' :detailconfig="viewOscPurchaseConfig"></view-osc-purchase>
    </inner>

    <!-- 查看生产单内页-->
    <inner :config='viewProductionConfig'>
        <view-production :docno="selectedData.docNo" :workflow='viewProductionConfig.workflow' @close='viewProductionConfig.show = false;'></view-production>
    </inner>

    <warning :config="warnConfig"></warning>
</template>

