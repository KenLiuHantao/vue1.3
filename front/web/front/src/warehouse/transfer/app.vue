<script>
import container from 'nc/frame/container'
import newApp from 'nb/newApp/app'
import vtable from 'nc/table/app'
import filter from 'nc/filter/app'
import cfg from './cfg.js'

import newTransfer from './newTransfer'
import editTransfer from './editTransfer'
import viewTransfer from './viewTransfer'

export default {
    components: {
        newApp,
        vtable,
        container,
        filter,
        newTransfer,
        editTransfer,
        viewTransfer
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
                title: '新建调拨单'
            },
            editConfig: {
                show: false,
                width: '100%',
                height: '100%',
                title: '调拨单'
            },
            viewConfig: {
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
                this.editConfig.show = true;
            } else if(cfg.leftItemCfg.tabCfg.select == 'tab2') {
                this.viewConfig.show = true;
            } else if(cfg.leftItemCfg.tabCfg.select == 'tab3') {
                this.viewConfig.show = true;
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
            var url = __URL.warehouse + 'transfer/query/list/draft';
            switch(cfg.leftItemCfg.tabCfg.select) {
                case 'tab1':
                    url = __URL.warehouse + 'transfer/query/list/draft';
                    break;
                case 'tab2':
                    url = __URL.warehouse + 'transfer/query/list/unaudit';
                    break;
                case 'tab3':
                    url = __URL.warehouse + 'transfer/query/list/audit';
                    break;
            }

            this.$http.post(url, obj).then((res) => {
                this.tableData = res.data.data.dataList
            });
        },
        add() {
            this.newConfig.show = true;
        },
        refresh() {
            let _this = this;
            setTimeout(function() {
                _this.newConfig.show = false;
                _this.editConfig.show = false;
                _this.viewConfig.show = false;
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
            var myCfg = cfg.draftTableCfg;
            switch(cfg.leftItemCfg.tabCfg.select) {
                case 'tab1':
                    myCfg = cfg.draftTableCfg;
                    break;
                case 'tab2':
                    myCfg = cfg.unauditTableCfg;
                    break;
                case 'tab3':
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
                <new-app :config='leftItemCfg' @tab='clearTable' @cb='getFilter' @add="add"></new-app>
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

    <!-- 新增调拨内页-->
    <inner :config='newConfig'>
        <new-transfer :config="newConfig" @refresh='refresh'></new-transfer>
    </inner>

    <!-- 编辑调拨内页-->
    <inner :config='editConfig'>
        <edit-transfer :config="editConfig" :docno.sync="selectedData.docNo" @refresh='refresh'></edit-transfer>
    </inner>

    <!-- 查看调拨内页-->
    <inner :config='viewConfig'>
        <view-transfer :config="viewConfig" :docno.sync="selectedData.docNo"></view-transfer>
    </inner>
</template>
<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';
</style>

