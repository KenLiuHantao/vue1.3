<script>



    import cfg from './cfg.js'
    import sendorder from './sendOrder.vue'
    import saleorder from '../saleOrder/infoAndEdit.vue'

    export default {
        components: {
            sendorder,
            saleorder
        },
        ready() {

        },
        data() {
            return {
                leftItemCfg: cfg.leftItemCfg,
                listObj: cfg.listParam,
                tableData: [],
                sendOrderInfo: "",
                checkboxArray: [],
                isAdd: false,
                actId:'',
                addSendOrder: {
                    show: false,
                    width: '100%',
                    height: '100%',
                    title: '发货通知单',
                },
                saleOrder: {
                    show:false,
                    title:'销售订单'
                },
                operate: "发货",
                wCfg: {
                    show: false,
                    content: '',
                    type: 'warning'
                },
                salesDispatchGeneratorReqVos:{
                    ids: []
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
            href(item, type) {
                this.actId = item.docNo;
                this.saleOrder.show = true;
            },

            getFilter(item,obj) {
                if (obj && obj.yearWeek != undefined) {
                    item.yearWeek = obj.yearWeek;
                }
                if (obj && obj.customerCode != undefined) {
                    item.customerCode = obj.customerCode;
                }
                this.listObj = this.initListObj(item)
                this.getList(item)
            },
            /* 数据请求 */
            getList(item) {
                this.$http.post(__URL.sale + 'salesSuspenseDispatch/findList', item).then(
                    (res) => {
                        this.tableData = res.data.data.dataList
                    }
                )
                this.checkboxArray = [];
            },

            /* 重置对象 */
            initListObj(obj) {
                let init = {
                    "customerName": obj.customerName?obj.customerName:'',
                    "customerCode": obj.customerCode?obj.customerCode:'',
                    "docNo": obj.docNo?obj.docNo:'',
                    "endDeliveryDate": obj.endDeliveryDate?obj.endDeliveryDate:'',
                    "inventoryCode": obj.inventoryCode?obj.inventoryCode:'',
                    "inventoryName": obj.inventoryName?obj.inventoryName:'',
                    "inventorySpec": obj.inventorySpec?obj.inventorySpec:'',
                    "startDeliveryDate": obj.startDeliveryDate?obj.startDeliveryDate:'',
                    "yearWeek": obj.yearWeek?obj.yearWeek:'',
                    "pageIndex": 0,
                    "pageSize": 0
                }
                return init
            },

            refresh() {
                this.$broadcast('_RESETLIST')
                this.tableData=[]
            },

            //发货按钮事件
            sendOrderEvent(){
                if (this.checkboxArray.length <= 0) {
                    console.log("没有选中明细行");
                    this.wCfg.content = "请选择需要发货的销售单";
                    this.wCfg.type = "failure";
                    this.wCfg.show = true;
                    return;
                }
                let recordIds = [];
                this.checkboxArray.forEach((item) => {
                    recordIds.push(item.recordId);
                })
                this.salesDispatchGeneratorReqVos.ids = recordIds;

                this.$http.post(__URL.sale + 'salesSuspenseDispatch/createSalesDispatch', this.salesDispatchGeneratorReqVos).then(
                    (res) => {
                        this.sendOrderInfo = res.data.data;
                        //判断是否出错
                        if (res && res.data.success) {
                            this.addSendOrder.show = true;
                        } else {
                            console.log(res.data.errMsg);
                            this.wCfg.content = res.data.errMsg;
                            this.wCfg.type = "failure";
                            this.wCfg.show = true;
                        }
                    }
                )
            },
            //关闭新增页面
            closeSendOrder(){
                this.addSendOrder.show = false;
                this.refresh()
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
                return cfg.tableCfg
            },
            tableParams() {
                let param = {
                    "params": {
                        "customerName": this.listObj.customerName,
                        "customerCode": this.listObj.customerCode,
                        "docNo": this.listObj.docNo,
                        "endDeliveryDate": this.listObj.endDeliveryDate,
                        "inventoryCode": this.listObj.inventoryCode,
                        "inventoryName": this.listObj.inventoryName,
                        "inventorySpec": this.listObj.inventorySpec,
                        "startDeliveryDate": this.listObj.startDeliveryDate,
                        "yearWeek": this.listObj.yearWeek,
                        "pageIndex": 0,
                        "pageSize": 0,
                    }
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
                <new-app :config='leftItemCfg' @tab='clearTable' @cb='getFilter'></new-app>
            </div>
            <div class="right_item">
                <div class="item_head btn-ic">
                    <a href="javascript:" @click='sendOrderEvent'>
                        <i class='icon-goods__cend'></i>{{operate}}
                    </a>
                </div>
                <div class="item_body">
                    <vtable :checkbox.sync='checkboxArray' :config='tableCfg' :data='tableData' @link='href'>
                    </vtable>
                </div>
            </div>
        </div>
    </container>
    <warning :config="wCfg"></warning>
    <inner :config='addSendOrder'>
        <sendorder :orderdetail="sendOrderInfo" :addsendorder="addSendOrder" @refresh='closeSendOrder'></sendorder>
    </inner>
    <inner :config="saleOrder">
        <saleorder :show="saleOrder" :id="actId" :add="isAdd"></saleorder>
    </inner>
</template>

