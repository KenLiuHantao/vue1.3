<script>
import cfg from './cfg.js'
import auditTransfer from './auditTransfer'
import unauditTransfer from './unauditTransfer'

export default {
    components: {
        auditTransfer,
        unauditTransfer
    },
    ready() {

    },
    data() {
        return {
            leftItemCfg: cfg.leftItemCfg,
            auditConfig: {
                show: false,
                width: '100%',
                height: '100%',
                title: '调拨单'
            },
            unauditConfig: {
                show: false,
                width: '100%',
                height: '100%',
                title: '调拨单'
            },
            listObj: cfg.listParam,
            tableData: [],
            radioObj: {},
            checkedData: [],
            selectedData: {docNo: ''}
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
                'outWarehouseCode': '',
                'inWarehouseCode': '',
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
                this.auditConfig.show = true;
            } else if(cfg.leftItemCfg.tabCfg.select == 'tab2') {
                this.unauditConfig.show = true;
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
            var url = __URL.warehouse + 'transfer/query/list/unaudit';
            switch(cfg.leftItemCfg.tabCfg.select) {
                case 'tab1':
                    url = __URL.warehouse + 'transfer/query/list/unaudit';
                    break;
                case 'tab2':
                    url = __URL.warehouse + 'transfer/query/list/audit';
                    break;
            }

            this.$http.post(url, obj).then((res) => {
                this.tableData = res.data.data.dataList
            });
        },
        refresh() {
            let _this = this;
            setTimeout(function() {
                _this.auditConfig.show = false;
                _this.unauditConfig.show = false;
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
            var myCfg = cfg.unauditTableCfg;
            switch(cfg.leftItemCfg.tabCfg.select) {
                case 'tab1':
                    myCfg = cfg.unauditTableCfg;
                    break;
                case 'tab2':
                    myCfg =  cfg.auditTableCfg;
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
                    'outWarehouseCode': '',
                    'inWarehouseCode': '',
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
                    <vtable :checkbox.sync='checkedData' :config='tableCfg' :data='tableData' @op='operate' @link='href'></vtable>
                </div>
            </div>
        </div>
    </container>

    <!-- 审核调拨内页-->
    <inner :config='auditConfig'>
        <audit-transfer :config="auditConfig" :docno.sync="selectedData.docNo" @refresh='refresh'></audit-transfer>
    </inner>

    <!-- 弃审调拨内页-->
    <inner :config='unauditConfig'>
        <unaudit-transfer :config="unauditConfig" :docno.sync="selectedData.docNo" @refresh='refresh'></unaudit-transfer>
    </inner>
</template>
<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';
</style>

