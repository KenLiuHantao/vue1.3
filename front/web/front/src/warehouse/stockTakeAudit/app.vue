<script>
    import cfg from './cfg.js'

    import auditStockTake from './auditStockTake'
    import unauditStockTake from './unauditStockTake'

    export default {
        components: {
            auditStockTake,
            unauditStockTake
        },
        ready() {
            this.$http.get(__URL.warehouse + 'stock/take/material/query/one/' + this.docno, {}).then((res) => {
                this.tableData = res.data.data;
                this.lock=false;
        });
        },
        data() {
            return {
                leftItemCfg: cfg.leftItemCfg,
                listObj: cfg.listParam,
                auditConfig: {
                    show: false,
                    width: '100%',
                    height: '100%',
                    title: '盘点单'
                },
                unauditConfig: {
                    show: false,
                    width: '100%',
                    height: '100%',
                    title: '盘点单'
                },
                warCfg: {
                    show: false,
                    type:'failure',
                    content: '',
                    showTime: '2000'
                },
                stockQueryVo:{
                    warehouseCode: '',
                    inventoryCategoryCode: '',
                    inventoryId: ''
                },
                selectWarehouse:{
                    code:''
                },
                errMsg:{
                    warehouse: ['仓库不能为空', '仓库不存在']
                },
                warehouseListData: '',
                selectedData: {docNo: ''},
                tableData: []
            }
        },
        methods: {
            // table返回的操作参数
            operate(type, item) {

            },
            href(item, type) {
                this.selectedData = item;
                if(cfg.leftItemCfg.tabCfg.select == 'tab2') {
                    this.auditConfig.show = true;
                } else if(cfg.leftItemCfg.tabCfg.select == 'tab3') {
                    this.unauditConfig.show = true;
                }
            },
            getFilter(item, obj) {
                if(obj && obj.inventoryCategoryCode){
                    item.inventoryCategoryCode = obj.inventoryCategoryCode;
                }
                this.getList(item)
            },
            /* 数据请求 */
            getList(obj) {
                var url = __URL.warehouse + 'stock/take/material/query/list/unaudit';
                switch(cfg.leftItemCfg.tabCfg.select) {
                    case 'tab2':
                        url = __URL.warehouse + 'stock/take/material/query/list/unaudit';
                        break;
                    case 'tab3':
                        url = __URL.warehouse + 'stock/take/material/query/list/audit';
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
            },
            showMsg(type, msg) {
                this.warCfg.show = true;
                this.warCfg.type = type;
                this.warCfg.content = msg;
            },
            verifyParams() {
                if(this.selectWarehouse.code == '') {
                    this.showMsg('failure', this.errMsg.warehouse[0]);
                    return false;
                }
                return true;
            },
            //获取表头选择默认数据
                    getSelectList(){
                        this.getInitSelectData(__URL.warehouse + 'stock/query/warehouses', 'warehouseListData');
                    },
                    getInitSelectData(url, val){
                        this.$http.post(url,this.stockQueryVo).then((res) => {
                            if (res.data.success) {
                            this[val] = res.data.data.dataList
                        } else {
                            this.showMsg('failure', res.data.errMsg);
                }
            });
            }
        },
        computed: {
            /* 参数获取 */
            tableUrl() {
                return cfg.table.baseParams.url
            },
            tableCfg() {
                this.tableData = [];
                var myCfg = cfg.waitTableCfg;
                switch(cfg.leftItemCfg.tabCfg.select) {
                    case 'tab2':
                        myCfg = cfg.unauditTableCfg;
                        break;
                    case 'tab3':
                        myCfg =  cfg.auditTableTableCfg;
                        break;
                }
                return myCfg;
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
                    <vtable  :config='tableCfg' :data='tableData'  @link='href'></vtable>
                </div>
            </div>
        </div>
    </container>

    <!-- 审核调拨内页-->
    <inner :config='auditConfig'>
        <audit-stock-take :config="auditConfig" :docno.sync="selectedData.docNo" @refresh='refresh'></audit-stock-take>
    </inner>

    <!-- 弃审调拨内页-->
    <inner :config='unauditConfig'>
        <unaudit-stock-take :config="unauditConfig" :docno.sync="selectedData.docNo" @refresh='refresh'></unaudit-stock-take>
    </inner>


</template>

<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';
</style>

