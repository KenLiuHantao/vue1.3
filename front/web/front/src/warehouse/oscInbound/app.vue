<script>



import cfg from './cfg.js'

import newInbound from './newInbound'
import viewInbound from './viewInbound'
import viewQualityCheck from './viewQualityCheck'

export default {
    components: {
        newInbound,
        viewInbound,
        viewQualityCheck
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
                title: '新建委外入库单'
            },
            viewConfig: {
                show: false,
                width: '100%',
                height: '100%',
                title: '委外入库单'
            },
            viewQualityCheckConfig: {
                show: false,
                width: '100%',
                height: '100%',
                title: '品质检验单'
            },
            warnConfig: {
                show: false,
                type: 'warning',
                content: '请选择品质检验单！'
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
                'purchaseDocNo': '',
                'docDate': obj.docDate ? obj.docDate : this.listObj.docDate,
                'startDocDate': '',
                'endDocDate': '',
                'purchaseEmployeeCode': '',
                'supplierCode': obj.supplierCode ? obj.supplierCode : '',
                'supplierName': obj.supplierName ? obj.supplierName : '',
                'salesOrderDocNo': '',
                'customerDocNo': '',
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
                        this.viewQualityCheckConfig.show = true;
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
            if(obj && obj.date) {
                item.date = obj.date;
            }
            this.getList(item)
        },
        /* 数据请求 */
        getList(obj) {
            var url = __URL.warehouse + 'osc/wait/inbound/query/list';
            switch(cfg.leftItemCfg.tabCfg.select) {
                case 'tab1':
                    url = __URL.warehouse + 'osc/wait/inbound/query/list';
                    break;
                case 'tab2':
                    url = __URL.warehouse + 'osc/inbound/query/list';
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
                    'purchaseDocNo': '',
                    'docDate': this.listObj.docDate,
                    'startDocDate': '',
                    'endDocDate': '',
                    'purchaseEmployeeCode': '',
                    'supplierCode': this.listObj.supplierCode,
                    'supplierName': this.listObj.supplierName,
                    'salesOrderDocNo': '',
                    'customerDocNo': '',
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

    <!-- 查看品质检验内页-->
    <inner :config='viewQualityCheckConfig'>
        <view-quality-check :docno.sync="selectedData.docNo" @close="viewQualityCheckConfig.show = false;"></view-quality-check>
    </inner>

    <warning :config="warnConfig"></warning>
</template>

