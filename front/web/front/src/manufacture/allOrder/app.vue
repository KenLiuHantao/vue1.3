<script>



import cfg from './cfg.js'
import item from './item'

export default {
    components: {
        item
    },
    data() {
        return {
            leftItemCfg: cfg.leftItemCfg,
            listObj: cfg.listParam,
            tableData: [],
            // 货品编码
            innerCfg: {
                show: false,
                title: '生产订单'
            },
            status:0,
            productOrder:"",
        }
    },
    watch: {

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
        // table返回的操作参数
        href(item, type) {
            if(type == 'demandDocNo'){
               this.productOrder =  item;
               this.innerCfg.show = true;
            }
        },
        getFilter(item, obj) {
            if (obj !== undefined) {
                item.customerCode = obj.customerCode;
            }
            this.getList(item)
        },
        close() {
            this.innerCfg.show = false
        },
        /* 数据请求 */
        getList(obj) {
            let url = '';
            if(cfg.leftItemCfg.tabCfg.select == 'tab1'){
                url = __URL.manufacture + 'productOrder/detailList';
            } else{
                url = __URL.manufacture + 'productOrder/detailList/task';
            }
            this.$http.post(url, obj).then(
                (res) => {
                    this.tableData = res.data.data.dataList
                }
            )
        },
        clearTable(uid,obj){
            this.tableData = []
        },
        refresh(){
            this.innerCfg.show = false
            this.tableData = [];
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
             if(cfg.leftItemCfg.tabCfg.select == 'tab1'){
                 this.status = 0;
                 return cfg.tableCfg
             } else if(cfg.leftItemCfg.tabCfg.select == 'tab2'){
                 this.status = 1;
                 return cfg.tableCfg2
             } else {
                 this.status = 2;
                 return cfg.tableCfg3
             }
        },
        tableParams() {
            let param = {
                "pageIndex": 0,
                "pageSize": 0,
                "customerCode": this.listObj.customerCode,
                "yearWeek": this.listObj.yearWeek
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
                    <vtable :config='tableCfg' :data='tableData'  @link='href'>
                    </vtable>
                </div>
            </div>
        </div>
    </container>

    <inner :config='innerCfg'>
        <item :product-order="productOrder" :status="status" :config="innerCfg" @refresh="refresh"></item>
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

    .right-arr {

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
    }

    .check-wrap {
        position: relative;
        height: auto;
        min-height: 300px;
        margin-bottom: 0;

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

        .right-wrap {
            border-bottom: none;
            border-left: 1px solid #e1e1e1 !important;
        }
    }

    .left-wrap,
    .right-wrap {
        height: auto !important;
        min-height: 100%;
    }
</style>