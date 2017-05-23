<script>
    export default{
        data(){
            return{
                orders:{
                    "header" : {
                      "productTaskDocNo" : "",
                      "inventoryCode" : "",
                      "inventoryName" : "",
                      "inventorySpec" : "",
                      "productTaskQty" : "",
                      "productDocDate" : "",
                      "saleDocNo" : "",
                      "deliveryDate":"",
                      "customerName" : "",
                      "saleEmployeeName" : "",
                      "processName":"",
                      "departmentName":"",
                      "employeeName":"",
                      "processProductQty":"",
                      "srcQuantity":"",
                      "finishedQuantity":""
                    },
                    "dataList" : [
                    {
                        "materialInventoryCode":"",
                        "materialInventoryName":"",
                        "materialInventorySpec":"",
                        "unitName":"",
                        "perUsageQty":"",
                        "orderUsageQty":"",
                        "wasteRate":"",
                        "productUsageQty":"",
                        "pickedQty":"",
                        "returnQty":"",
                        "returnedQty":""
                    }
                    ]
                },
                flowCfg:{
                    data:[

                    ]
                },
            }
        },
        props:['recordId','status'],
        components:{
        },
        ready() {
            this.getData();
        },
        methods:{
            getData(){
                //获取详情信息
                this.$http.get(__URL.manufacture + 'change/deal/detail/'+ this.recordId).then(
                    (res) => {
                        this.orders = res.data.data;
                    }
                )

                this.$http.get(__URL.manufacture + 'workflow/find/list/'+ this.recordId).then(
                    (resp) => {
                        this.flowCfg.data = resp.data.data.dataList
                    }
                )

            },
            close(tips){
                this.$emit('refresh',tips)
            }
        },
        computed: {

        }
    }

</script>
<template>
    <div class="inner-wrapper">
        <workflow :config="flowCfg"></workflow>
        <div class="inner-content">
            <h2 class="tag two-tag"><label>生产订单信息</label><label class="ft-14">生产单号:{{orders.header.productTaskDocNo}}</label></h2>
            <div class="block">
            <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
                <div class="inner-item form-box">
                    <div class="form-group">
                        <label>货品编码:</label>
                        <p class="orderData">{{orders.header.inventoryCode}}</p>
                    </div>
                    <div class="form-group">
                        <label>货品名称:</label>
                        <p class="orderData">{{orders.header.inventoryName}}</p>
                    </div>
                    <div class="form-group">
                        <label>规格:</label>
                        <p class="orderData">{{orders.header.inventorySpec}}</p>
                    </div>
                    <div class="form-group">
                        <label>原生产数量:</label>
                        <p class="orderData">{{orders.header.srcQuantity}}</p>
                    </div>
                    <div class="form-group">
                        <label>变更后生产数量:</label>
                        <p class="orderData">{{orders.header.productTaskQty}}</p>
                    </div>
                    <div class="form-group">
                        <label>销售单号:</label>
                        <p class="orderData">{{orders.header.saleDocNo}}</p>
                    </div>
                    <div class="form-group">
                        <label>客户名称:</label>
                        <p class="orderData">{{orders.header.customerName}}</p>
                    </div>
                    <div class="form-group">
                        <label>下达生产:</label>
                        <p class="orderData">{{orders.header.docDate}}</p>
                    </div>
                    <div class="form-group">
                        <label>客户交期:</label>
                        <p class="orderData">{{orders.header.deliveryDate}}</p>
                    </div>
                    <div class="form-group">
                        <label>业务员:</label>
                        <p class="orderData">{{orders.header.saleEmployeeName}}</p>
                    </div>
                </div>

                <div class="inner-item mt-15">
                    <div class="form-group wd-100">
                        <label>附件:</label>
                        <div class="attachment">
                            <a class='img_item' v-for='imgitem in orders.header.attachments' href="javascript:;">
                                {{imgitem.fileName}}
                            </a>
                        </div>
                    </div>
                </div>

                <div class="bomTree">
                    <div class="table-title">
                        <span>
                            <label>{{orders.header.processName}}</label>
                        </span>
                        <span>
                            <label>生产车间:</label><label>{{orders.header.departmentName}}</label>
                        </span>

                        <span>
                            <label>生产负责人:</label><label>{{orders.header.employeeName}}</label>
                        </span>

                        <span>
                            <label>已完成:</label><label>{{orders.header.finishedQuantity}}</label>
                        </span>
                    </div>

                    <div class="inner-item">

                        <table class="inner-table">
                            <thead>
                            <tr>
                                <th width="30px">序号</th>
                                <th width="15%">货品信息</th>
                                <th width="15%">单位</th>
                                <th width="10%">单位用量</th>
                                <th width="10%">订单用量</th>
                                <th width="10%">损耗率(%)</th>
                                <th width="10%">生产用量</th>
                                <th width="15%">领料数量</th>
                                <th width="15%">待退数量</th>
                                <th width="15%" v-if="status == 1">已退数量</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for='item in orders.dataList'>
                                <td>{{$index + 1}}</td>
                                <td>
                                    <div class="show-wrap">
                                        <p>{{item.materialInventoryCode}}:{{item.materialInventoryName}}</p>
                                        <p>{{item.materialAttributeName}}:{{item.materialInventorySpec}}</p>
                                    </div>
                                </td>
                                <td>
                                    <div class="show-wrap">
                                        <p>{{item.unitName}}</p>
                                    </div>
                                </td>
                                <td>
                                    <div class="show-wrap">
                                        <p>{{item.perUsageQty}}</p>
                                    </div>
                                </td>
                                <td>
                                    <div class="show-wrap">
                                        <p>{{item.orderUsageQty}}</p>
                                    </div>
                                </td>
                                <td>
                                    <div class="show-wrap">
                                        <p>{{item.wasteRate}}</p>
                                    </div>
                                </td>
                                <td>
                                    <div class="show-wrap">
                                        <p>{{item.productUsageQty}}</p>
                                    </div>
                                </td>
                                <td>
                                    <div class="show-wrap">
                                        <p>{{item.pickedQty}}</p>
                                    </div>
                                </td>
                                <td>
                                    <div class="show-wrap">
                                        <p>{{item.returnQty}}</p>
                                    </div>
                                </td>
                                <td v-if="status == 1">
                                    <div class="show-wrap">
                                        <p>{{item.returnedQty}}</p>
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="inner-footer">
        <button @click='close("")' class="btn-xl-def">关闭</button>
    </div>

</template>
<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';


    .table-title {
        font-size: 16px;
        font-weight: normal;
        height: 50px;
        line-height: 50px;
        background: #fafafa;
        margin-bottom: -5px;
        box-sizing: border-box;
        overflow: hidden;
        position: relative;
        span {
            margin-left: 20px;
            padding-right: 100px;
            label {
                padding-right: 10px;
            }
        }
    }
    .bomTree{
        @gray: #f2f3f3;
        margin-top: 20px;

        .table-title {
            border-top: 1px solid @gray;

            span:nth-of-type(n+2) {
                position: relative;
                top: -2px;
                color: #37474f;
                font-size: 12px;
            }
        }

        .inner-item {
            padding: 0;
            border-bottom: none;
        }

        .inner-table {

            thead {
                border: none;
                border-top: 1px solid @gray;
            }

            th {
                background-color: #fff;
                color: #757575;
            }

            td {
                border-left: none;
                border-right: none;

                .show-wrap {
                    align-items: center;
                }
            }
        }
    }
</style>