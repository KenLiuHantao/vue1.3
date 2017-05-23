<script>

    import cfg from './cfg.js'

    import viewInventory from '../../development/inventoryManager/item'

    export default {
        components: {
            viewInventory,
        },
        ready() {

        },
        data() {
            return {
                leftItemCfg: cfg.leftItemCfg,
                listObj: cfg.listParam,
                viewInventoryConfig: {
                    show: false,
                    title: '货品档案'
                },
                referInventoryConfig: {
                    show: false
                },
                tableTotal: 0,
                pageCfg: {
                    'pageSize': 50,
                    'pageIndexName': 'pageIndex',
                    'pageSizeName': 'pageSize',
                    'jump': true
                },
                lastTableParam:{

                },
                tableData: []
            }
        },
        methods: {
            // table返回的操作参数
            operate(type, item) {

            },
            href(item, type) {
                if(type == 'inventoryCode') {
                    this.$http.get(__URL.dev + 'inventory/get/' + item.inventoryId).then((res) => {
                        if (res.data.success) {
                            this.viewInventoryConfig.data = res.data.data;
                            this.viewInventoryConfig.show = true
                        }
                    });
                }
            },
            getFilter(item, obj) {
                if(obj && obj.inventoryId){
                    item.inventoryId = obj.inventoryId;
                }
                this.getList(item)
            },
            /* 数据请求 */
            getList(obj) {
                let params = JSON.stringify(obj);
                params = JSON.parse(params);
                params.pageSize = this.pageCfg.pageSize;
                this.$http.post(__URL.warehouse + 'stock/query/list', params).then((res) => {
                    this.lastTableParam = obj;
                    this.tableTotal=res.data.data.totalCount;
                    this.tableData = res.data.data.dataList;
                });
            },
            changePage(item){
                this.lastTableParam.pageIndex=item.pageIndex;
                this.lastTableParam.pageSize=item.pageSize;
                this.$http.post(__URL.warehouse + 'stock/query/list', this.lastTableParam).then((res) => {
                    this.tableData = res.data.data.dataList;
                });
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
                this.refresh();
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
            <div :class="{'have_footer': tableTotal > pageCfg.pageSize}" class="right_item">
                <div class="item_head btn-ic">

                </div>
                <div class="item_body">
                    <vtable :config='tableCfg' :data='tableData' @link='href'></vtable>
                </div>
                <div v-if="tableTotal > pageCfg.pageSize" class="item_footer">
                    <pagination :total='tableTotal' :config='pageCfg' @cb='changePage'></pagination>
                </div>
            </div>
        </div>
    </container>

    <!-- 查看货品详情-->
    <inner :config.sync='viewInventoryConfig'>
        <view-inventory :edit='1' :data='viewInventoryConfig.data' @cb='viewInventoryConfig.show=false'></view-inventory>
    </inner>

    <!--货品参照-->
    <refer-inventory :config="referInventoryConfig" @cb="doFillInventory"></refer-inventory>
</template>
