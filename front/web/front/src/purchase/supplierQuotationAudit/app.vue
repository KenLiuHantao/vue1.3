<script>
import cfg from './cfg.js'

import auditSupplierQuotation from './auditSupplierQuotation'
import unauditSupplierQuotation from './unauditSupplierQuotation'

export default {
    components: {
        auditSupplierQuotation,
        unauditSupplierQuotation
    },
    ready() {

    },
    data() {
        return {
            leftItemCfg: cfg.leftItemCfg,
            listObj: cfg.listParam,
            auditConfig: {
                show: false,
                title: '供应商报价'
            },
            unauditConfig: {
                show: false,
                title: '供应商报价'
            },
            tableData: [],
            radioObj: {},
            docNo: ''
        }
    },
    methods: {
        /* 重置对象 */
        initListObj(obj) {
            let init = {
                'pageIndex': 0,
                'pageSize': 0,
                'docNo': '',
                'startDocDate': '',
                'endDocDate': '',
                'supplierCode': this.listObj.supplierCode,
                'employeeCode': '',
                'inventoryId': ''
            }
            return init
        },
        // table返回的操作参数
        operate(type, item) {

        },
        href(item, type) {
            this.docNo = item.docNo
            if(cfg.leftItemCfg.tabCfg.select == 'tab1') {
                this.unauditConfig.show = true;
            } else if(cfg.leftItemCfg.tabCfg.select == 'tab2') {
                this.auditConfig.show = true;
            }
        },
        getFilter(item,obj) {
            if(obj && obj.supplierCode){
             item.supplierCode = obj.supplierCode;
            }

            this.getList(item)
        },

        /* 数据请求 */
        getList(obj) {
            var url = __URL.purchase + 'supplier/quotation/query/list/unaudit';
            switch(cfg.leftItemCfg.tabCfg.select) {
                case 'tab1':
                    url = __URL.purchase + 'supplier/quotation/query/list/unaudit';
                    break;
                case 'tab2':
                    url = __URL.purchase + 'supplier/quotation/query/list/audit';
                    break;
            }

            this.$http.post(url, obj).then((res) => {
                this.tableData = res.data.data.dataList;
            });
        },

        //刷新外页
        doRefresh() {
            let _this = this;
            setTimeout(function() {
                _this.auditConfig.show = false;
                _this.unauditConfig.show = false;
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

            return cfg.tableCfg;
        },
        tableParams() {
            let param = {
                'pageIndex': 0,
                'pageSize': 0,
                'docNo': '',
                'startDocDate': '',
                'endDocDate': '',
                'supplierCode': this.listObj.supplierCode,
                'employeeCode': '',
                'inventoryId': ''
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
                <new-app :config='leftItemCfg' @tab='clearTable' @cb='getFilter' ></new-app>
            </div>
            <div class="right_item">
                <div class="item_head btn-ic">
                </div>
                <div class="item_body">
                    <vtable :radio.sync='radioObj' :config='tableCfg' :data='tableData' @op='operate' @link='href'>
                    </vtable>
                </div>
            </div>
        </div>
    </container>

    <!-- 审核内页-->
    <inner :config='auditConfig'>
        <audit-supplier-quotation :config="auditConfig" :docno.sync="docNo" @refresh='doRefresh'></audit-supplier-quotation>
    </inner>

    <!-- 未审核内页-->
    <inner :config='unauditConfig'>
        <unaudit-supplier-quotation :config="unauditConfig" :docno.sync="docNo" @refresh='doRefresh'></unaudit-supplier-quotation>
    </inner>

</template>
