<script>

    import detail from './confirmPayDetail'
    import cfg from './cfg.js'
    import viewInbound from './viewInbound'
    import viewReturnInbound from './viewReturnInbound'

    export default {
        components: {
            detail,
            viewInbound,
            viewReturnInbound,
        },
        data() {
            return {
                leftItemCfg: cfg.leftItemCfg,
                listObj: cfg.listParam,
                tableData: [],
                recConfig: {
                    show: false,
                    title: '应付款确认单'
                },
                docNo: '',
                inbound: true,
                status: 0,
                wCfg: {
                    show: false,
                    content: '',
                    type: 'warning'
                }, viewInboundConfig: {
                    show: false,
                    width: '100%',
                    height: '100%',
                    title: '入库单'
                },
                viewReturnInboundConfig: {
                    show: false,
                    width: '100%',
                    height: '100%',
                    title: '入库退货单'
                },
                viewOscInboundCfg: {
                    show: false,
                    width: '100%',
                    height: '100%',
                    title: '委外采购入库单'
                },
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
                let init = {}
                return init
            },

            operate(type, item) {
                this.docNo = item.docNo;
                this.recConfig.show = true
            },
            closeDetail(){
                //刷新页面
                this.tableData = [];
                this.recConfig.show = false;
                this.refresh()
            },

            refreshOnly(){
                this.$broadcast('_RESETLIST');
            },
            getFilter(item, obj) {
                if (obj && obj.yearWeek != undefined) {
                    item.yearWeek = obj.yearWeek;
                }
                if (obj && obj.supplierCode != undefined) {
                    item.supplierCode = obj.supplierCode;
                }
                this.getList(item)
            },
            /* 数据请求 */
            getList(obj) {
                if (this.status == 0) {
                    this.$http.post(__URL.financial + 'confirm/payable/wait/list', obj).then(
                        (res) => {
                            this.tableData = res.data.data.dataList
                        })
                } else {
                    this.$http.post(__URL.financial + 'confirm/payable/confirm/list', obj).then(
                        (res) => {
                            this.tableData = res.data.data.dataList
                        })
                }
                this.inbound = this.tableData.inbound;
            },
            href(item, type) {
                if (type == 'docNo' && item.inbound) {
                    this.docNo = item.docNo;
                    this.viewInboundConfig.show = true;
                } else if (type == "docNo" && !item.inbound) {
                    this.docNo = item.docNo;
                    this.viewReturnInboundConfig.show = true;
                }

            },
            refresh(type, tips){
                // this.setWarningSuccess(type, tips)
                this.$broadcast('_RESETLIST');
                this.tableData = []
            },
            setWarningSuccess(type, tips){
                this.wCfg.show = true
                this.wCfg.content = tips
                this.wCfg.type = type
            },
            clearTable(uid, obj){
                this.tableData = []
            }
        },

        computed: {
            tableCfg() {
                this.tableData = [];
                var myCfg = cfg.waitTableCfg;
                switch (cfg.leftItemCfg.tabCfg.select) {
                    case 'tab1':
                        myCfg = cfg.waitTableCfg;
                        this.status = 0;
                        break;
                    case 'tab2':
                        myCfg = cfg.confirmTableCfg;
                        this.status = 1;
                        break;
                }
                return myCfg;
            },
        }
    }
</script>
<template>
    <container>
        <div class="body_item">
            <div class="left_item">
                <new-app :config='leftItemCfg' @tab='clearTable' @cb='getFilter' @add='addNew'></new-app>
            </div>
            <div class="right_item">
                <div class="item_head btn-ic">
                </div>
                <div class="item_body">
                    <vtable :config='tableCfg' :data='tableData' @op='operate' @link='href'>
                    </vtable>
                </div>
            </div>
        </div>
    </container>
    <inner :config='recConfig'>
        <detail :doc-no="docNo" :inbound="inbound" :status="status" @refreshonly='refreshOnly' @refresh='closeDetail'
                @close="recConfig.show = false;"></detail>
    </inner>
    <warning :config="wCfg"></warning>

    <!-- 查看入库内页-->
    <inner :config='viewInboundConfig'>
        <view-inbound :doc-no="docNo" @close="viewInboundConfig.show = false;"></view-inbound>
    </inner>

    <!--<inner :config="viewOscInboundCfg">
        <view-osc-inbound :docno.sync="docNo" @close="viewOscInboundCfg.show = false;"></view-osc-inbound>
    </inner>-->

    <!-- 查看入库退货内页-->
    <inner :config='viewReturnInboundConfig'>
        <view-return-inbound :doc-no="docNo" @close="viewReturnInboundConfig.show = false;"></view-return-inbound>
    </inner>
</template>