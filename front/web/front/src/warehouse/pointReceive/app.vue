<script>
    import cfg from './cfg.js'

    import viewPurWaitReceive from './viewPurWaitReceive'
    import viewProWaitReceive from './viewProWaitReceive'
    import viewPurWaitQuality from './viewPurWaitQuality'
    import viewPurQuality from './viewPurQuality'

    export default {
        components: {
            viewPurWaitReceive,
            viewProWaitReceive,
            viewPurWaitQuality,
            viewPurQuality
        },
        ready() {

        },
        data() {
            return {
                leftItemCfg: cfg.leftItemCfg,
                viewPurWaitReceiveConfig: {
                    show: false,
                    width: '100%',
                    height: '100%',
                    title: '委外/采购单'
                },
                viewPurWaitQualityConfig: {
                    show: false,
                    width: '100%',
                    height: '100%',
                    title: '委外/采购单'
                },
                viewPurQualityConfig: {
                    show: false,
                    width: '100%',
                    height: '100%',
                    title: '委外/采购单'
                },
                viewProWaitReceiveConfig: {
                    show: false,
                    width: '100%',
                    height: '100%',
                    title: '生产单'
                },
                tableData: [],
                selectedData: {},
                newData: [],
                radioObj: {},
                lock: false
            }
        },
        methods: {
            // table返回的操作参数
            operate(type, item) {
            },
            href(item, type) {
                this.selectedData = item;
                this.selectedData.srcDocNo = item.docNo;
                this.selectedData.warehouseCode = item.warehouseCode;
                let title = '';
                if(item.docTypeStr == '采购' || item.srcDocTypeStr == '采购'){
                    title = "采购单";
                }else if(item.docTypeStr == '委外采购' || item.srcDocTypeStr == '委外采购'){
                    title = "委外采购单";
                }else if(item.docTypeStr == '生产' ||  item.srcDocTypeStr == '生产'){
                    title = "生产单";
                }
                if(cfg.leftItemCfg.tabCfg.select == 'tab1'){
                    if(item.docTypeStr == '采购'){
                        this.viewPurWaitReceiveConfig.title = title;
                        this.viewPurWaitReceiveConfig.show = true;
                    }else if(item.docTypeStr == '委外采购'){
                        this.viewPurWaitReceiveConfig.title = title;
                        this.viewPurWaitReceiveConfig.show = true;
                    }else if(item.docTypeStr == '生产'){
                        this.viewProWaitReceiveConfig.title = title;
                        this.viewProWaitReceiveConfig.show = true;
                    }
                }else if(cfg.leftItemCfg.tabCfg.select == 'tab2'){
                    this.viewPurWaitQualityConfig.title = title;
                    this.viewPurWaitQualityConfig.show = true;
                }else if(cfg.leftItemCfg.tabCfg.select == 'tab3'){
                    this.viewPurQualityConfig.title =  title;
                    this.viewPurQualityConfig.show = true;
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
                        url = __URL.warehouse + 'wait/receive/query/list';
                        break;
                    case 'tab2':
                        url = __URL.warehouse + 'receive/query/list';
                        break;
                    case 'tab3':
                        url = __URL.warehouse + 'quality/check/query/list';
                        break;
                }

                this.$http.post(url, obj).then((res) => {
                    this.tableData = res.data.data.dataList
            });
            },
            refresh() {
                let _this = this;
//                setTimeout(function() {
//                  _this.receiptModalCfg.show = false;
//                  _this.viewPurWaitReceiveConfig.show = false;
//                  _this.viewPurWaitQualityConfig.show = false;
//                  _this.viewPurQualityConfig.show = false;
//                  _this.viewProWaitReceiveConfig.show = false;
                  _this.$broadcast('_RESETLIST');
                  _this.tableData = [];
                  _this.newData = [];
//                }, 1000);
            },
            clearTable(uid,obj){
                this.tableData = []
            }
        },
        computed: {
            tableCfg() {
                this.tableData = [];
                var myCfg = cfg.waitReceiveTableCfg;
                switch(cfg.leftItemCfg.tabCfg.select) {
                    case 'tab1':
                        myCfg = cfg.waitReceiveTableCfg;
                        break;
                    case 'tab2':
                        myCfg = cfg.waitQualityCheckTableCfg;
                        break;
                    case 'tab3':
                        myCfg =  cfg.qualityCheckTableCfg;
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
                    <vtable :radio.sync='radioObj' :config='tableCfg' :data='tableData' @op='operate' @link='href'></vtable>
                </div>
            </div>
        </div>
    </container>
    


    <!--查看[待收货]采购/委外单内页-->
    <inner :config='viewPurWaitReceiveConfig'>
        <view-pur-wait-receive :config='viewPurWaitReceiveConfig' :selected.sync="selectedData" @close="viewPurWaitReceiveConfig.show = false;" @refresh='refresh'></view-pur-wait-receive>
    </inner>

    <!--查看[待收货]自制单内页-->
    <inner :config='viewProWaitReceiveConfig'>
        <view-pro-wait-receive :config='viewProWaitReceiveConfig' :selected.sync="selectedData" @close="viewProWaitReceiveConfig.show = false;" @refresh="refresh"></view-pro-wait-receive>
    </inner>

    <!--查看[未品检]采购/委外单内页-->
    <inner :config='viewPurWaitQualityConfig'>
        <view-pur-wait-quality :config='viewPurWaitQualityConfig' :selected.sync="selectedData" @close="viewPurWaitQualityConfig.show = false;"></view-pur-wait-quality>
    </inner>

    <!--查看[已品检]采购/委外单内页-->
    <inner :config='viewPurQualityConfig'>
        <view-pur-quality :config='viewPurQualityConfig' :selected.sync="selectedData" @close="viewPurQualityConfig.show = false;"></view-pur-quality>
    </inner>

    <warning :config="warnConfig"></warning>

</template>

<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';
</style>

