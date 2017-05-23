<script>
    import cfg from './cfg.js'
    export default {
        ready() {

        },
        data() {
            return {
                leftItemCfg: cfg.leftItemCfg,
                listObj: cfg.listParam,
                tableTotal:0,
                pageCfg:{
                    'pageSize': 50,
                    'pageIndexName': 'pageIndex',
                    'pageSizeName': 'pageSize',
                    'jump':true
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

            },
            getFilter(item, obj) {
                if(obj && obj.inventoryCategoryCode){
                    item.inventoryCategoryCode = obj.inventoryCategoryCode;
                }
                this.getList(item)
            },
            /* 数据请求 */
            getList(obj) {
                let params = JSON.stringify(obj);
                params = JSON.parse(params);
                params.pageSize = this.pageCfg.pageSize;
                this.$http.post(__URL.warehouse + 'init/stock/take/product/query/list/audit', params).then((res) => {
                    this.lastTableParam=obj;
                    this.tableTotal=res.data.data.totalCount;
                    this.tableData = res.data.data.dataList;
                });
            },
            changePage(item){
                this.lastTableParam.pageIndex=item.pageIndex;
                this.lastTableParam.pageSize=item.pageSize;
                this.$http.post(__URL.warehouse + 'init/stock/take/product/query/list/audit', this.lastTableParam).then((res) => {
                    this.tableData = res.data.data.dataList;
                });
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
            <div class="right_item have_footer">
                <div class="item_head btn-ic">

                </div>
                <div class="item_body">
                    <vtable  :config='tableCfg' :data='tableData'  @link='href'></vtable>
                </div>
                <div class="item_footer">
                    <pagination  :total='tableTotal' :config='pageCfg' @cb='changePage'></pagination>
                    <button v-if='enter' class="btn-xl-imp" @click="$router.go('/init/supplierInitBatchImport')">下一步</button>
                </div>
            </div>
        </div>
    </container>
</template>

<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';
</style>

