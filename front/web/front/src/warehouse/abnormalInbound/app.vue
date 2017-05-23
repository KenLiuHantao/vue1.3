<script>

    import cfg from './cfg.js'

    import newInbound from './newInbound'
    import editInbound from './editInbound'
    import viewInbound from './viewInbound'

    export default {
        components: {
            newInbound,
            editInbound,
            viewInbound
        },
        ready() {

        },
        data() {
            return {
                leftItemCfg: cfg.leftItemCfg,
                listObj: cfg.listParam,
                newConfig: {
                    show: false,
                    width: '100%',
                    height: '100%',
                    title: '新增非正常入库单'
                },
                editConfig: {
                    show: false,
                    width: '100%',
                    height: '100%',
                    title: '非正常入库单'
                },
                viewConfig: {
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
                if(obj && obj.warehouseCode){
                    item.warehouseCode = obj.warehouseCode;
                }
                this.getList(item)
            },
            /* 数据请求 */
            getList(obj) {
                var url = __URL.warehouse + 'abnormal/inbound/query/list/draft';
                switch(cfg.leftItemCfg.tabCfg.select) {
                    case 'tab1':
                        url = __URL.warehouse + 'abnormal/inbound/query/list/draft';
                        break;
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

    <!-- 新增非正常入库单内页-->
    <inner :config='newConfig'>
        <new-inbound :config="newConfig"  @refresh='refresh'></new-inbound>
    </inner>

    <!-- 编辑非正常入库单内页-->
    <inner :config='editConfig'>
        <edit-inbound :config="editConfig" :docno.sync="selectedData.docNo" @refresh='refresh'></edit-inbound>
    </inner>

    <!-- 查看非正常入库单内页-->
    <inner :config='viewConfig'>
        <view-inbound :config="viewConfig" :docno.sync="selectedData.docNo" @refresh='refresh'></view-inbound>
    </inner>


</template>

<style lang='less' scoped>

</style>