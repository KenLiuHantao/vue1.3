<script>
    import cfg from './cfg.js'

    import viewValidQuotation from './viewValidQuotation'
    import viewInvalidQuotation from './viewInvalidQuotation'
    import viewValidPrice from './viewValidPrice'
    import viewInvalidPrice from './viewInvalidPrice'

    export default {
        components: {
            viewValidQuotation,
            viewInvalidQuotation,
            viewValidPrice,
            viewInvalidPrice
        },
        ready() {

    },
    data() {
        return {
            leftItemCfg: cfg.leftItemCfg,
            listObj: cfg.listParam,
            viewValidQuotationCfg: {
                show: false,
                title: '供应商报价'
            },
            viewInvalidQuotationCfg: {
                show: false,
                title: '供应商报价'
            },
            viewValidPriceCfg: {
                show: false,
                title: '采购价格表'
            },
            viewInvalidPriceCfg: {
                show: false,
                title: '采购失效价格表'
            },
            tableData: [],
            radioObj: {},
            docNo: '',
            inventoryId: ''
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
            this.docNo = item.docNo;
            this.inventoryId = item.inventoryId;
            if(cfg.leftItemCfg.tabCfg.select == 'tab1') {
                this.viewValidQuotationCfg.show = true;
            } else if(cfg.leftItemCfg.tabCfg.select == 'tab2') {
                this.viewInvalidQuotationCfg.show = true;
            } else if(cfg.leftItemCfg.tabCfg.select == 'tab3') {
                this.viewValidPriceCfg.show = true;
            } else {
                this.viewInvalidPriceCfg.show = true;
            }
        },
        getFilter(item,obj) {
            console.log(item);
            if(obj && obj.inventoryCategoryCode){
                item.firstInventoryCategoryCode = obj.inventoryCategoryCode;
            }
            if(obj && obj.secondInventoryCategoryCode){
                item.secondInventoryCategoryCode = obj.secondInventoryCategoryCode;
            }

            this.getList(item)
        },

        /* 数据请求 */
        getList(obj) {
            var url = __URL.purchase + 'price/list/valid/quotation';
            switch(cfg.leftItemCfg.tabCfg.select) {
                case 'tab1':
                    url = __URL.purchase + 'price/list/valid/quotation';
                    break;
                case 'tab2':
                    url = __URL.purchase + 'price/list/invalid/quotation';
                    break;
                case 'tab3':
                    url = __URL.purchase + 'price/list/valid';
                    break;
                case 'tab4':
                    url = __URL.purchase + 'price/list/invalid';
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
                _this.viewValidQuotationCfg.show = false;
                _this.viewInvalidQuotationCfg.show = false;
                _this.viewValidPriceCfg.show = false;
                _this.viewInvalidPriceCfg.show = false;
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

            var myCfg = cfg.supplierTableCfg;
            switch(cfg.leftItemCfg.tabCfg.select) {
                case 'tab1':
                    myCfg = cfg.supplierTableCfg;
                    break;
                case 'tab2':
                    myCfg = cfg.supplierTableCfg;
                    break;
                case 'tab3':
                    myCfg = cfg.inventoryTableCfg;
                    break;
                case 'tab4':
                    myCfg = cfg.inventoryTableCfg;
                    break;
            }
            return myCfg;
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

    <!-- 查看有效报价内页-->
    <inner :config='viewValidQuotationCfg'>
        <view-valid-quotation :config="viewValidQuotationCfg" :docno.sync="docNo"></view-valid-quotation>
    </inner>

    <!-- 查看失效报价内页-->
    <inner :config='viewInvalidQuotationCfg'>
        <view-invalid-quotation :config="viewInvalidQuotationCfg" :docno.sync="docNo"></view-invalid-quotation>
    </inner>

    <!-- 查看有效价格表内页-->
    <inner :config='viewValidPriceCfg'>
        <view-valid-price :config="viewValidPriceCfg" :inventoryid.sync="inventoryId"></view-valid-price>
    </inner>

    <!-- 查看失效价格表内页-->
    <inner :config='viewInvalidPriceCfg'>
        <view-invalid-price :config="viewInvalidPriceCfg" :inventoryid.sync="inventoryId"></view-invalid-price>
    </inner>

</template>
