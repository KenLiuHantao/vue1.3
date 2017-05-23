<script>

    import cfg from './cfg.js'

    import auditInbound from './auditInbound'
    import unauditInbound from './unauditInbound'

    export default {
        components: {
            auditInbound,
            unauditInbound
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
                    title: '非正常入库单'
                },
                unauditConfig: {
                    show: false,
                    width: '100%',
                    height: '100%',
                    title: '非正常入库单'
                },
                tableData: [],
                selectedData: {docNo: ''}
            }
        },
        methods: {
            href(item, type) {
                this.selectedData = item;
                if(cfg.leftItemCfg.tabCfg.select == 'tab2') {
                    this.auditConfig.show = true;
                } else if(cfg.leftItemCfg.tabCfg.select == 'tab3') {
                    this.unauditConfig.show = true;
                }
            },
            getFilter(item, obj) {
                if(obj && obj.warehouseCode){
                    item.warehouseCode = obj.warehouseCode;
                }
                this.getList(item)
            },
            /* 数据请求 */
            getList(obj) {
                var url = __URL.warehouse + 'abnormal/inbound/query/list/draft';
                switch(cfg.leftItemCfg.tabCfg.select) {
                    case 'tab2':
                        url = __URL.warehouse + 'abnormal/inbound/query/list/unaudit';
                        break;
                    case 'tab3':
                        url = __URL.warehouse + 'abnormal/inbound/query/list/audit';
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
            tableCfg() {
                this.tableData = [];
                var myCfg = cfg.unauditTableCfg;
                switch(cfg.leftItemCfg.tabCfg.select) {
                    case 'tab2':
                        myCfg = cfg.unauditTableCfg;
                        break;
                    case 'tab3':
                        myCfg =  cfg.auditTableCfg;
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
                <new-app :config='leftItemCfg' @tab='clearTable' @cb='getFilter' @add="add"></new-app>
            </div>
            <div class="right_item">
                <div class="item_head btn-ic">

                </div>
                <div class="item_body">
                    <vtable :config='tableCfg' :data='tableData' @op='operate' @link='href'></vtable>
                </div>
            </div>
        </div>
    </container>


    <!-- 审核调拨内页-->
    <inner :config='auditConfig'>
        <audit-inbound :config="auditConfig" :docno.sync="selectedData.docNo" @refresh='refresh'></audit-inbound>
    </inner>

    <!-- 弃审调拨内页-->
    <inner :config='unauditConfig'>
        <unaudit-inbound :config="unauditConfig" :docno.sync="selectedData.docNo" @refresh='refresh'></unaudit-inbound>
    </inner>

</template>

<style lang='less' scoped>

</style>