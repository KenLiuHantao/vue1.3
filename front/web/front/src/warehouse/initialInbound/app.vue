<script>




import cfg from './cfg.js'

import newInitialInbound from './newInitialInbound'
import viewInitialInbound from './viewInitialInbound'
import viewInventory from '../../development/inventoryManager/item'


export default {
    components: {
        viewInventory,
        newInitialInbound,
        viewInitialInbound,
    },
    ready() {

    },
    data() {
        return {
            leftItemCfg: cfg.leftItemCfg,
            listObj: cfg.listParam,
            newInitialInboundConfig: {
                show: false,
                width: '100%',
                height: '100%',
                title: '新增期初库存结存单'
            },
            viewInitialInboundConfig:{
                show: false,
                width: '100%',
                height: '100%',
                title: '期初库存结存单',
                data: {}
            },
            viewInventoryConfig: {
                show: false,
                title: '货品档案'
            },
            referInventoryConfig: {
                show: false
            },
            tableData: [],
            docno: '',
            msgCfg: {
                show: true,
                showtime: 2000,
                content: '提示消息'
            }
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
                'startDocDate': '',
                'endDocDate': '',
                'docNo': '',
                'inventoryCode': '',
                'inventoryName': '',
                'pageIndex': 0,
                'pageSize': 0,
                'warehouseCategoryCode': obj.warehouseCategoryCode!=undefined ? obj.warehouseCategoryCode:this.listObj.warehouseCategoryCode,
                'inventoryCategoryCode': obj.inventoryCategoryCode!=undefined ? obj.inventoryCategoryCode:this.listObj.inventoryCategoryCode,
                'yearMonth': obj.yearMonth != undefined ? obj.yearMonth : this.listObj.yearMonth
            }
            return init
        },
        // table返回的操作参数
        operate(type, item) {

        },
        href(item, type) {
            if(type == 'docNo') {
                this.openDetail(item.docNo);
            } else if(type == 'inventoryCode'){
                this.$http.get(__URL.dev + 'inventory/get/' + item.inventoryId).then((res) => {
                    if (res.data.success) {
                        this.viewInventoryConfig.data = res.data.data;
                        this.viewInventoryConfig.show = true
                    }
                });
            }
        },
        getFilter(item,obj) {
            if(obj && obj.warehouseCode){
             item.warehouseCode = obj.warehouseCode;
            }
            if(obj && obj.inventoryCategoryCode){
                item.inventoryCategoryCode = obj.inventoryCategoryCode;
            }
            this.getList(item)
        },
        /* 数据请求 */
        getList(obj) {
             this.$http.post(__URL.warehouse + 'initial/inbound/query/list', obj).then((res) => {
                this.tableData = res.data.data.dataList;
            });
        },
        //打开详情页
        openDetail(docNo) {
            this.docno = docNo;
            this.viewInitialInboundConfig.show = true;
            this.viewInitialInboundConfig.title = '期初库存结存单/' + docNo;
        },
        //打开新增页
        openAdd() {
            this.newInitialInboundConfig.show = true;
        },
        doFillInventory(val) {
            for(var index in this.leftItemCfg.filterCfg){
                if(this.leftItemCfg.filterCfg[index].key == 'inventoryCode'){
                    this.leftItemCfg.filterCfg[index].value = val.inventoryCode;
                }
                if(this.leftItemCfg.filterCfg[index].key == 'inventoryName'){
                    this.leftItemCfg.filterCfg[index].value = val.inventoryName;
                }
            }
        },
        doRefresh() {
            this.newInitialInboundConfig.show = false;
            this.refresh();
        },
        openRef(emit) {
            if (emit == 'inventory') {
                this.referInventoryConfig.show = true;
            }
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
           this.tableData=[];
           return cfg.tableCfg;
        },
        tableParams() {
            let param = {
                'startDocDate': '',
                'endDocDate': '',
                'docNo': '',
                'inventoryCode': '',
                'inventoryName': '',
                'warehouseCategoryCode': this.listObj.warehouseCategoryCode,
                'inventoryCategoryCode': this.listObj.inventoryCategoryCode,
                'pageIndex': 0,
                'pageSize': 0,
                'yearWeek': this.listObj.yearWeek
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
                <new-app :config='leftItemCfg' @tab='clearTable' @cb='getFilter' @add="openAdd" @reference='openRef'></new-app>
            </div>
            <div class="right_item">
                <div class="item_head btn-ic">

                </div>
                <div class="item_body">
                    <vtable  :config='tableCfg' :data='tableData'  @link='href'>
                    </vtable>
                </div>
            </div>
        </div>
    </container>

    <!-- 新增内页-->
    <inner :config='newInitialInboundConfig'>
        <new-initial-inbound :config="newInitialInboundConfig" @refresh='doRefresh'></new-initial-inbound>
    </inner>

    <!-- 详情内页-->
    <inner :config='viewInitialInboundConfig'>
        <view-initial-inbound :docno="docno" :config="viewInitialInboundConfig"></view-initial-inbound>
    </inner>

    <!-- 查看货品详情-->
    <inner :config.sync='viewInventoryConfig'>
        <view-inventory :edit='1' :data='viewInventoryConfig.data' @cb="viewInventoryConfig.show = false"></view-inventory>
    </inner>

    <!--货品参照-->
    <refer-inventory :config="referInventoryConfig" @cb="doFillInventory"></refer-inventory>
</template>
