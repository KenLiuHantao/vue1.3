<script>

import cfg from './cfg.js'

import newOutbound from './newOutbound'
import editOutbound from './editOutbound'
import viewOutbound from './viewOutbound'

export default {
    components: {
        newOutbound,
        editOutbound,
        viewOutbound
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
                title: '发货单'
            },
            editConfig: {
                show: false,
                width: '100%',
                height: '100%',
                title: '发货单'
            },
            viewConfig: {
                show: false,
                width: '100%',
                height: '100%',
                title: '发货单'
            },
            listObj: cfg.listParam,
            tableData: [],
            checkedData: [],
            selectedData: {},
            lock: false
        }
    },
    methods: {
        /* 重置对象 */
        initListObj(obj) {
            let init = {
                'pageIndex': 0,
                'pageSize': 0,
                'dispatchDocNo': '',
                'docDate': obj.docDate ? obj.docDate : this.listObj.docDate,
                'startDocDate': '',
                'endDocDate': '',
                'customerCode': obj.customerCode ? obj.customerCode : '',
                'customerName': obj.customerName ? obj.customerName : '',
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
            if(cfg.leftItemCfg.tabCfg.select == 'tab1') {
                this.selectedData.dispatchDocNo = item.docNo;
                this.newConfig.show = true;
            } else if(cfg.leftItemCfg.tabCfg.select == 'tab2') {
                this.editConfig.show = true;
            } else if(cfg.leftItemCfg.tabCfg.select == 'tab3') {
                this.viewConfig.show = true;
            }
        },
        getFilter(item, obj) {
            if(obj && obj.customerCode) {
                item.customerCode = obj.customerCode;
            }

            this.getList(item)
        },
        /* 数据请求 */
        getList(obj) {
            var url = __URL.sale + 'salesSuspenseOutbound/findList';
            switch(cfg.leftItemCfg.tabCfg.select) {
                case 'tab1':
                    url = __URL.sale + 'salesSuspenseOutbound/findList';
                    break;
                case 'tab2':
                    url = __URL.warehouse + 'outbound/query/list/confirm';
                    break;
                case 'tab3':
                    url = __URL.warehouse + 'outbound/query/list/shipped';
                    break;
            }

            this.$http.post(url, obj).then((res) => {
                this.tableData = res.data.data.dataList
            });
        },
        refresh() {
            let _this = this;
            setTimeout(function() {
                _this.newConfig.show = false;
                _this.editConfig.show = false;
                _this.viewConfig.show = false;
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
            var myCfg = cfg.waitDispatchTableCfg;
            switch(cfg.leftItemCfg.tabCfg.select) {
                case 'tab1':
                    myCfg = cfg.waitDispatchTableCfg;
                    break;
                case 'tab2':
                    myCfg = cfg.confirmDispatchTableCfg;
                    break;
                case 'tab3':
                    myCfg =  cfg.shippedDispatchTableCfg;
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
                    'dipatchDocNo': '',
                    'docDate': this.listObj.docDate,
                    'startDocDate': '',
                    'endDocDate': '',
                    'customerCode': this.listObj.customerCode,
                    'customerName': this.listObj.customerName,
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

                </div>
                <div class="item_body">
                    <vtable :checkbox.sync='checkedData' :config='tableCfg' :data='tableData' @op='operate' @link='href' ></vtable>
                </div>
            </div>
        </div>
    </container>

    <!-- 新增内页-->
    <inner :config='newConfig'>
        <new-outbound :selected.sync="selectedData" @refresh='refresh' @close="newConfig.show = false;"></new-outbound>
    </inner>

    <!-- 查看内页-->
    <inner :config='editConfig'>
        <edit-outbound :selected.sync="selectedData" @refresh='refresh' @close="editConfig.show = false;"></edit-outbound>
    </inner>

    <!-- 查看内页-->
    <inner :config='viewConfig'>
        <view-outbound :selected.sync="selectedData" @close="viewConfig.show = false;"></view-outbound>
    </inner>
</template>

