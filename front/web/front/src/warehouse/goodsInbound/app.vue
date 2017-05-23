<script>
    import cfg from './cfg.js'

    import viewPurInbound from './viewPurInbound'
    import viewWaitInbound from './viewWaitInbound'
    import viewInbound from './viewInbound'

    export default {
        components: {
            viewPurInbound,
            viewWaitInbound,
            viewInbound
        },
        ready() {

        },
        data() {
            return {
                leftItemCfg: cfg.leftItemCfg,
                viewPurInboundConfig:{
                    show: false,
                    width: '100%',
                    height: '100%',
                    title: '委外/采购单'
                },
                viewWaitInboundConfig:{
                    show: false,
                    width: '100%',
                    height: '100%',
                    title: '入库单'
                },
                viewInboundConfig:{
                    show: false,
                    width: '100%',
                    height: '100%',
                    title: '入库单'
                },
                warnConfig: {
                    show: false,
                    type: 'success',
                    content: '操作成功'
                },
                tableData: [],
                selectedData: {},
                radioObj: {},
                lock: false
            }
        },
        methods: {
            href(item, type) {
                this.selectedData = item;
                this.selectedData.srcDocNo = item.srcDocNo;
                this.selectedData.docNo = item.docNo;
                this.selectedData.warehouseCode = item.warehouseCode;
                this.selectedData.warehouseName = item.warehouseName;
                this.selectedData.docType = item.docType;
                let title = '';
                if(item.srcDocTypeStr == '采购'){
                    title = "采购单";
                }else if(item.srcDocTypeStr == '委外采购'){
                    title = "委外采购单";
                }else if(item.srcDocTypeStr == '生产'){
                    title = "生产单";
                }

                if(cfg.leftItemCfg.tabCfg.select == 'tab1'){
                    this.viewPurInboundConfig.title = title;
                    if(item.srcDocTypeStr == '采购'){
                        this.viewPurInboundConfig.show = true;
                    }else if(item.srcDocTypeStr == '委外采购'){
                        this.viewPurInboundConfig.show = true;
                    }
                }else if(cfg.leftItemCfg.tabCfg.select == 'tab2'){
                    this.viewInboundConfig.show = true;
                }
            },
            getFilter(item, obj) {
                if(obj && obj.supplierCode) {
                    item.supplierCode = obj.supplierCode;
                }
                if(obj && obj.deliveryDate) {
                    item.deliveryDate = obj.deliveryDate;
                }
                this.getList(item)
            },
            getList(obj) {
                var url = __URL.warehouse + '';
                switch(cfg.leftItemCfg.tabCfg.select) {
                    case 'tab1':
                        url = __URL.warehouse + 'wait/inbound/query/list';
                        break;
                    case 'tab2':
                        url = __URL.warehouse + 'inbound/query/list';
                        break;
                }

                this.$http.post(url, obj).then((res) => {
                    this.tableData = res.data.data.dataList
            });
            },
            refresh() {
                let _this = this;
//                setTimeout(function() {
//                    this.viewPurInboundConfig.show = false;
//                    this.viewWaitInboundConfig.show = false;
//                    this.viewInboundConfig.show = false;
                    _this.$broadcast('_RESETLIST');
                    _this.tableData = [];
//                }, 1000);
            },
            forword(){
                this.viewPurInboundConfig.show = false;
                this.viewWaitInboundConfig.show = true;
            },
            clearTable(uid,obj){
                this.tableData = []
            }
        },

        computed: {
            tableCfg() {
                this.tableData = [];
                var myCfg = cfg.waitInboundTableCfg;
                switch(cfg.leftItemCfg.tabCfg.select) {
                    case 'tab1':
                        myCfg = cfg.waitInboundTableCfg;
                        break;
                    case 'tab2':
                        myCfg = cfg.inboundTableCfg;
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
                    <vtable :radio.sync='radioObj' :config='tableCfg' :data='tableData' @op='operate' @link='href' ></vtable>
                </div>
            </div>
        </div>
    </container>

    <warning :config="warnConfig"></warning>


    <!--查看委外/采购单详情-->
    <inner :config='viewPurInboundConfig'>
        <view-pur-inbound :config="viewPurInboundConfig" :selected.sync="selectedData" @forword="forword"></view-pur-inbound>
    </inner>

    <!--查看待入库详情内页面-->
    <inner :config='viewWaitInboundConfig'>
        <view-wait-inbound :config='viewWaitInboundConfig' :selected.sync="selectedData" @refresh="refresh"></view-wait-inbound>
    </inner>

    <!--查看已入库详情-->
    <inner :config='viewInboundConfig'>
        <view-inbound :config='viewInboundConfig' :selected.sync="selectedData" @close="viewInboundConfig.show = false;"></view-inbound>
    </inner>

</template>

<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';
</style>

