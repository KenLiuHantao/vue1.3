<script>

export default {
    components:{
    },
    data() {
        return {
            inboundDetail:{
                "docNo":"",
                "inventoryName":"",
                "productionQuantity":0,
                "waitInboundQuantity":0,
                "inboundTotalQuantity":0
            },
            productInboundLists:[]
        }
    },
    props: ['taskId'],
    ready() {
        this.getData();
    },
    methods: {
        getData(){
            this.$http.get(__URL.manufacture + 'production/manager/go/inbound/' + this.taskId).then(
                (res) => {
                    if(res.data.success){
                        this.inboundDetail = res.data.data.header;
                        this.productInboundLists = res.data.data.dataList;
                    }
                }
            );
        }
    },
    computed:{
    }
}
</script>


<template>
    <div :class="arrowTop" class="check-wrap">
        <div class="left-wrap">
            <ul class="left-content modal-ul">
                <li>
                    <span>生产数量:</span><span>{{inboundDetail.productionQuantity}}</span>
                </li>
                <li>
                    <span>已完工数量:</span><span>{{inboundDetail.finishedProductQuantity}}</span>
                </li>
                <li>
                    <span>已入库数量:</span><span>{{inboundDetail.inboundTotalQuantity}}</span>
                </li>
                <li>
                    <span>待入库数量:</span><span>{{inboundDetail.waitInboundQuantity}}</span>
                </li>
            </ul>
        </div>
        <div class="right-wrap">
            <div class="left-content">
                <table class="modal-table">
                    <thead>
                    <th width="30%">入库日期</th>
                    <th width="30%">入库数量</th>
                    <th width="20%">物料员</th>
                    <th width="20%">仓管员</th>
                    </thead>
                    <tbody>
                    <tr v-for='it in productInboundLists'>
                        <td>
                            {{it.inboundDate}}
                        </td>
                        <td>
                            {{it.quantity}}
                        </td>
                        <td>
                            {{it.materialEmployeeName}}
                        </td>
                        <td>
                            {{it.employeeName}}
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
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
