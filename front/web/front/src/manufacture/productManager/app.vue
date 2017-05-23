<script>

import cfg from './cfg.js'
import orderDetail from './orderDetail'

export default {
    components: {
        orderDetail,
    },
    ready() {

    },
    data() {
        return {
            leftItemCfg: cfg.leftItemCfg,
            listObj: cfg.listParam,
            tableData: [],
            inventoryCfg: {
                show: false
            },
            detailConfig: {
                show: false,
                title: "生产订单",
            },
            tabIndex: 0,
            tipsCfg:{
                type:'success',
                show:false,
                content:''
            },
            order:'',
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
                "productDocNo": '',
                "inventoryCode": "",
                "deliveryBeginDate": "",
                "deliveryEndDate": "",
                "pageIndex": 0,
                "pageSize": 0,
                "processCode": obj.processCode != undefined ? obj.processCode : this.listObj.processCode,
                "yearWeek": obj.yearWeek != undefined ? obj.yearWeek : this.listObj.yearWeek,
                "tabIndex": obj.tabIndex != undefined ? obj.tabIndex : this.listObj.tabIndex
            }
            return init
        },
        href(item, type) {
            if (type == 'docNo') {
                this.item = item;
                if (cfg.leftItemCfg.tabCfg.select == 'tab1') {
                    this.tabIndex = 1;
                } else if (cfg.leftItemCfg.tabCfg.select == 'tab2') {
                    this.tabIndex = 2;
                } else {
                    this.tabIndex = 3;
                }
                this.item.tabIndex = this.tabIndex;
                this.order = item;
                this.openOrderDetail();
            }
        },
        getFilter(item, obj) {
            if (obj && obj.processCode) {
                item.processCode = obj.processCode;
            }
            this.getList(item)
        },
        /* 数据请求 */
        getList(obj) {
            this.tableData = [];
            this.$http.post(__URL.manufacture + 'production/manager/findList', obj).then(
                (res) => {
                    if(res.data.success){
                        this.tableData = res.data.data.dataList
                    }else{
                        this.errTips(res.data.errMsg);
                    }
                }
            )
        },
        //打开详情页
        openOrderDetail() {
            this.detailConfig.show = true;
        },
        //关闭详情页面
        closeOrderDetail(tips) {
            this.detailConfig.show = false;
            this.refresh(tips)
        },
        reset() {
            this.$broadcast('_RESETLIST');
            this.tableData = [];
        },
        errTips(msg){
            this.tipsCfg.type = "failure";
            this.tipsCfg.show = true;
            this.tipsCfg.content = msg;
        },
        clearTable(uid,obj){
            this.tableData = []
        },
        refresh(tips){
            if (tips && tips != null) {
                this.tipsCfg.content = tips;
                this.tipsCfg.show = true;
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
            if (cfg.leftItemCfg.tabCfg.select == 'tab2') {
                return cfg.proTableCfg;
            } else if (cfg.leftItemCfg.tabCfg.select == 'tab3') {
                return cfg.completeTableCfg;
            } else {
                return cfg.waitTableCfg;
            }
        },
        tableParams() {
            let param = {
                "productDocNo": '',
                "processCode": this.listObj.processCode,
                "inventoryCode": "",
                "deliveryBeginDate": "",
                "deliveryEndDate": "",
                "yearWeek": this.listObj.yearWeek,
                "pageIndex": 0,
                "pageSize": 0,
                "tabIndex": this.listObj.tabIndex
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

    <warning :config="tipsCfg"></warning>

    <!-- 详情内页-->
    <inner :config='detailConfig'>
        <order-detail :order="order" @refresh='closeOrderDetail'></order-detail>
    </inner>


</template>
<style lang="less" scoped>
    @import '../../../../../public/css/variable.less';
    @import '../../../../../public/css/referCommon.less';

    .modal-ul {
        li {
            position: relative;
            display: flex;
            justify-content: space-between;
            height: 39px;
            padding-right: 20px;
            border-bottom: none;
        }
    }

    .check-wrap {
        position: relative;
        height: auto;
        min-height: 300px;
        margin-bottom: 0;
        &::before {
            content: "";
            position: absolute;
            left: 269px;
            top: 127px;
            width: 20px;
            height: 20px;
            background-color: #fff;
            border: 1px solid #e1e1e1;
            border-radius: 4px;
            transform: rotate(45deg);
            z-index: 100;
        }
        &::after {
            content: "";
            position: absolute;
            left: 279px;
            top: 124px;
            width: 16px;
            height: 28px;
            background-color: #fff;
            z-index: 100;
        }
        &.arrowTop::before {
            top: 88px;
        }
        &.arrowTop::after {
            top: 85px;
        }

        .modal-table {
            tbody {
                tr:hover {
                    background-color: #fff;
                }
                tr:hover:nth-of-type(2n+1) {
                    background-color: #FAFAFA;
                }
            }
        }
    }

    .right-wrap {
        border-left: 1px solid #e1e1e1 !important;
    }

    .left-wrap,
    .right-wrap {
        height: auto !important;
        min-height: 100%;
    }

</style>
