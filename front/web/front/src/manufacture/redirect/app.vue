<script>
import orderDetail from './orderDetail'
import cfg from './cfg.js'

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
            order:'',
            detailConfig:{
                show:false,
                title:"生产订单",
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
        /* 重置对象 */
        initListObj(obj) {
            let init = {
                "status":0,
                "pageIndex": 0,
                "pageSize": 0,
                "processCode": obj.processCode,
                "yearWeek": obj.yearWeek != undefined ? obj.yearWeek : this.listObj.yearWeek
            }
            return init
        },
        // table返回的操作参数
        operate(type, item) {
            console.log('app', type)
        },
        href(item, type) {
            if(type == 'docNo'){
                this.order = item;
                 if(cfg.leftItemCfg.tabCfg.select == 'tab1'){
                    this.order.status = 0;
                }else if(cfg.leftItemCfg.tabCfg.select == 'tab2'){
                    this.order.status = 1;
                }
                this.detailConfig.show = true;
            }
        },
        getFilter(item,obj) {
            if(obj && obj.processCode){
                item.processCode = obj.processCode;
            }
            this.getList(item)
        },
        /* 数据请求 */
        getList(obj) {
           this.tableData = [];
           if(cfg.leftItemCfg.tabCfg.select == 'tab1'){
               obj.status = 0;
           }else if(cfg.leftItemCfg.tabCfg.select == 'tab2'){
               obj.status = 1;
           }
           this.$http.post(__URL.manufacture + 'redirect/list', obj).then(
                (res) => {
                    this.tableData = res.data.data.dataList
                }
           )
        },
        //打开详情页
        openOrderDetail(){
            this.detailConfig.show=true;
        },
        //关闭详情页面
        closeOrderDetail(){
            this.detailConfig.show=false;
            this.refresh()
        },
        alertCb(){
            this.alertCfg.show=false;
        },
        clearTable(uid,obj){
            this.tableData = []
        },
        refresh(){
            this.$broadcast('_RESETLIST');
        }
    },
    computed: {
        /* 参数获取 */
        tableUrl() {
            return cfg.table.baseParams.url
        },
        tableCfg() {
            if(cfg.leftItemCfg.tabCfg.select == 'tab1'){
                return cfg.tableCfg
            }
            else{
                return cfg.newTableCfg
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
                    <vtable :config='tableCfg' :data='tableData' @op='operate'
                            @link='href'>
                    </vtable>
                </div>
            </div>
        </div>


    </container>

    <!-- 详情内页-->
    <inner :config='detailConfig'>
        <order-detail :order="order"  @refresh='closeOrderDetail'></order-detail>
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
        height: 100%;
        min-height: 300px;
        &.arrow {
            &::before {
                background-color: #fafafa;
            }
            &::after {
                background-color: #fafafa;
            }
        }

        .modal-table {
            tbody {
                tr td:nth-of-type(3n) {
                    border-right: 1px solid #f2f3f3 !important;
                }
                tr:hover {
                    background-color: #fff;
                }
                tr:hover:nth-of-type(2n+1) {
                    background-color: #FAFAFA;
                }
            }
        }
    }
</style>