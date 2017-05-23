<script>



import cfg from './cfg.js'
import orderDetail from './orderDetail'

export default {
    components: {
        orderDetail
    },
    ready() {

    },
    data() {
        return {
            leftItemCfg: cfg.leftItemCfg,
            listObj: cfg.listParam,
            tableData: [],
            recordId:'',
            docNo:'',
            inventoryCfg: {
                show: false
            },
            detailConfig: {
                show: false,
                title: "生产订单",
            },
            tabIndex: 0,
            workflow: {},
            registerLists:[],
            tipsCfg:{
                type:'success',
                show:false,
                content:''
            },
            repeatSubmit:false,
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
        // table返回的操作参数
        operate(type, item) {
        },
        href(item, type) {
            if (type == 'docNo') {
                this.order = item;
                if (cfg.leftItemCfg.tabCfg.select == 'tab1') {
                    this.order.status = 0;
                } else {
                    this.order.status = 1;
                }
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
        closeOrderDetail() {
            this.detailConfig.show = false;
            this.refresh()
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
                return cfg.pickedTableCfg;
            } else {
                return cfg.canTableCfg;
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
                <new-app :config='leftItemCfg' @tab='clearTable' @cb='getFilter' @reference='openRef'></new-app>
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

    <!--货品参照-->
    <refer-inventory :config="inventoryCfg" @cb="inventorySure"></refer-inventory>

    <!-- 详情内页-->
    <inner :config='detailConfig'>
        <order-detail :order="order" @refresh='closeOrderDetail'></order-detail>
    </inner>

</template>
<style lang="less" scoped>

</style>