<script>
import cfg from './cfg.js'

import newSupplierQuotation from './newSupplierQuotation'
import editSupplierQuotation from './editSupplierQuotation'
import viewSupplierQuotation from './viewSupplierQuotation'

export default {
    components: {
        newSupplierQuotation,
        editSupplierQuotation,
        viewSupplierQuotation
    },
    ready() {

    },
    data() {
        return {
            leftItemCfg: cfg.leftItemCfg,
            listObj: cfg.listParam,
            newConfig: {
                show: false,
                title: '新增供应商报价'
            },
            editConfig: {
                show: false,
                title: '供应商报价'
            },
            viewConfig: {
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
                this.editConfig.show = true;
            } else if(cfg.leftItemCfg.tabCfg.select == 'tab2') {
                this.viewConfig.show = true;
                this.viewConfig.audit = false;
            } else if(cfg.leftItemCfg.tabCfg.select == 'tab3') {
                this.editConfig.show = true;
            } else {
                this.viewConfig.show = true;
                this.viewConfig.audit = true;
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
            var url = __URL.purchase + 'supplier/quotation/query/list/draft';
            switch(cfg.leftItemCfg.tabCfg.select) {
                case 'tab1':
                    url = __URL.purchase + 'supplier/quotation/query/list/draft';
                    break;
                case 'tab2':
                    url = __URL.purchase + 'supplier/quotation/query/list/unaudit';
                    break;
                case 'tab3':
                    url = __URL.purchase + 'supplier/quotation/query/list/reject';
                    break;
                case 'tab4':
                    url = __URL.purchase + 'supplier/quotation/query/list/audit';
                    break;
            }

            this.$http.post(url, obj).then((res) => {
                this.tableData = res.data.data.dataList;
            });
        },

        openAdd() {
            this.newConfig.show = true;
        },
        //刷新外页
        doRefresh() {
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
                <new-app :config='leftItemCfg' @tab='clearTable' @cb='getFilter' @add="openAdd"></new-app>
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

    <!-- 新增内页-->
    <inner :config='newConfig'>
        <new-supplier-quotation :config="newConfig" @refresh='doRefresh'></new-supplier-quotation>
    </inner>

    <!-- 编辑内页-->
    <inner :config='editConfig'>
        <edit-supplier-quotation :config="editConfig" :docno.sync="docNo" @refresh='doRefresh'></edit-supplier-quotation>
    </inner>

    <!-- 查看内页-->
    <inner :config='viewConfig'>
        <view-supplier-quotation :config="viewConfig" :docno.sync="docNo"></view-supplier-quotation>
    </inner>

</template>
