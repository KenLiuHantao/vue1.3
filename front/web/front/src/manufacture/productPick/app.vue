<script>

    import cfg from './cfg.js'
    import orderDetail from './orderDetail'
    import orderAdd from './orderAdd'
    import supplyOrder from './supplyOrder'
    import supplyPick from './supplyPickOrder'
    import pickDetail from './pickDetail'

    export default {
        components: {
            orderDetail,
            orderAdd,
            supplyOrder,
            supplyPick,
            pickDetail
        },
        ready() {
        },
        data() {
            return {
                leftItemCfg: cfg.leftItemCfg,
                listObj: cfg.listParam,
                tableData: [],
                warnConfig: {
                    show: false,
                    type: 'success',
                    content: '保存成功',
                    //显示时间，以毫秒为单位 选填
                    showTime:'2000'
                },
                addConfig: {
                    show: false,
                    title: "生产领料"
                },
                pickDetailCfg: {
                    show: false,
                    title: "生产领料"
                },
                detailConfig: {
                    show: false,
                    title: "生产订单",
                },
                supplyDetail: {
                    show: false,
                    title: "生产补料单",
                },
                supplyPickDetail: {
                    show: false,
                    title: "生产补料单",
                },
                order: '',
                tabIndex: ''
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
                    "pageIndex": 0,
                    "pageSize": 0,
                    "processCode": obj.processCode,
                    "yearWeek": obj.yearWeek != undefined ? obj.yearWeek : this.listObj.yearWeek
                }
                return init
            },
            href(item, type) {
                if (type == 'srcDocNo') {
                    this.order = item;
                    if (item.sourceType == 1 || item.srcDocType == 0) {
                        this.openOrderDetail();
                    } else if (item.sourceType == 2 || item.srcDocType == 1) {
                        this.tabIndex = 1;
                        this.openSupplyDetail();
                    }
                }
                if (type == 'docNo') {
                    this.docNo = item.docNo;
                    this.order = item;
                    if (item.srcDocType == 0) {
                        this.openOrderAdd()
                    } else if (item.srcDocType == 1) {
                        this.tabIndex = 2;
                        this.openSupplyPickDetail();
                    }
                }
                if (type == 'pickDocNo') {
                    this.order = item;
                    if (item.sourceType == 1) {
                        this.openPickDetail();
                    } else if (item.sourceType == 2) {
                        this.tabIndex = 3;
                        this.openSupplyDetail();
                    }
                }
            },
            getFilter(item, obj) {
                if (obj && obj.yearWeek) {
                    item.yearWeek = obj.yearWeek;
                }
                this.getList(item)
            },
            /* 数据请求 */
            getList(obj) {
                this.tableData = [];
                if (cfg.leftItemCfg.tabCfg.select == 'tab1') {
                    this.$http.post(__URL.manufacture + 'waitPick/orderList', obj).then(
                        (res) => {
                            this.tableData = res.data.data.dataList
                        }
                    )
                } else if (cfg.leftItemCfg.tabCfg.select == 'tab2') {
                    this.$http.post(__URL.warehouse + 'wait/picking/query/list', obj).then(
                        (res) => {
                            this.tableData = res.data.data.dataList
                        }
                    )
                } else {
                    this.$http.post(__URL.manufacture + 'picked/orderList', obj).then(
                        (res) => {
                            this.tableData = res.data.data.dataList
                        }
                    )
                }
            },
            //打开补料详情页
            openSupplyDetail(){
                this.supplyDetail.show = true;
            },

            openSupplyPickDetail(){
                this.supplyPickDetail.show = true;
            },
            //打开详情页
            openOrderDetail(){
                this.detailConfig.show = true;
            },
            //关闭详情页面
            closeOrderDetail(tips){
                this.detailConfig.show = false;
                this.supplyDetail.show = false;
                this.supplyPickDetail.show = false;
                this.refresh(tips)
            },
            //打开新增页
            openOrderAdd(){
                this.addConfig.show = true;
            },
            //关闭新增页面
            closeOrderAdd(tips){
                this.addConfig.show = false;
                this.refresh(tips)
            },
            openPickDetail(){
                this.pickDetailCfg.show = true;
            },
            //关闭新增页面
            closePickDetail(){
                this.pickDetailCfg.show = false;
                this.refresh()
            },
            clearTable(uid, obj){
                this.tableData = []
            },
            refresh(tips){
                if (tips != undefined && tips != null && tips != '') {
                    this.warnConfig.show = true;
                    this.warnConfig.type = 'success';
                    this.warnConfig.content = tips;
                }
                this.$broadcast('_RESETLIST');
            }
        },
        computed: {
            /* 参数获取 */
            tableUrl() {
                return cfg.table.baseParams.url
            },
            tableCfg() {
                this.tableData = [];
                if (cfg.leftItemCfg.tabCfg.select == 'tab1') {
                    return cfg.waitTableCfg
                } else if (cfg.leftItemCfg.tabCfg.select == 'tab2') {
                    return cfg.canTableCfg
                } else {
                    return cfg.pickedTableCfg
                }
            },
            tableParams() {
                let param = {
                    "processCode": this.listObj.processCode,
                    "yearWeek": this.listObj.yearWeek,
                    "pageIndex": 0,
                    "pageSize": 0
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
                </div>
                <div class="item_body">
                    <vtable :config='tableCfg' :data='tableData' @link='href'>
                    </vtable>
                </div>
            </div>
        </div>
    </container>

    <!-- 新增领料内页-->
    <inner :config='addConfig'>
        <order-add :add-config="addConfig" :doc-no="docNo" @refresh='closeOrderAdd'></order-add>
    </inner>

    <!-- 详情内页-->
    <inner :config='detailConfig'>
        <order-detail :order="order" :config='detailConfig' @refresh='closeOrderDetail'></order-detail>
    </inner>

    <!-- 生产补料单-->
    <inner :config='supplyDetail'>
        <supply-order :order="order" :tab-index="tabIndex" @refresh='closeOrderDetail'></supply-order>
    </inner>

    <!---->
    <inner :config='supplyPickDetail'>
        <supply-pick :order="order" :pick-config="supplyPickDetail" :tab-index="tabIndex"
                     @refresh='closeOrderDetail'></supply-pick>
    </inner>

    <!---->
    <inner :config='pickDetailCfg'>
        <pick-detail :order="order" @refresh='closePickDetail'></pick-detail>
    </inner>


    <warning :config="warnConfig"></warning>

</template>
