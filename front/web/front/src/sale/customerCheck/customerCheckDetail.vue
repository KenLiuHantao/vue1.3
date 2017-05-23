<script>
    export default{
        props:['orderdetail','customercheckcfg'],
        data(){
            return {

            }
        },
        ready(){

        },
        methods:{
        },
        computed:{

        }
    }

</script>
<template :config="detailConfig">
    <div class="inner-wrapper" id="inner-orderdetail">
        <div class="inner-content">

            <h2 class="tag">客户对账信息</h2>

            <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
            <div class="inner-item form-box">
                <div class="form-group">
                    <label>客户名称:</label>
                    <p class="orderData">{{orderdetail.header.customerName}}</p>
                </div>
                <div class="form-group">
                    <label>会计期间:</label>
                    <p class="orderData">{{orderdetail.header.yearMonthStr}}</p>
                </div>
                <div class="form-group">
                    <label>对账日期:</label>
                    <p class="orderData">{{orderdetail.header.checkDate}}</p>
                </div>

            </div>

            <div class="inner-item">
                <tabcont>
                    <containeritem>
                        <table class="inner-table mt-15">
                            <thead>
                            <tr>
                                <th width="5%">序号</th>
                                <th width="13%">销售单号</th>
                                <th width="12%">发/退货单号</th>
                                <th width="13%">货品信息</th>
                                <th width="5%">单位</th>
                                <th width="11%">发/退货数量</th>
                                <th width="11%">金额</th>
                                <th width="10%">币种</th>
                                <th width="10%">税率(%)</th>
                                <th width="10%">税额</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(index,item) in orderdetail.dataList"  :class="{'red':item.dispatchAndReturnDocType == 'return'}">
                                <td>{{index+1}}</td>
                                <td>{{item.saleDocNo}}</td>
                                <td>{{item.dispatchAndReturnDocNo}}</td>
                                <td>
                                    <div class="show-wrap">
                                    <p class="line">{{item.inventoryCode}}</p>
                                    <p class="line">{{item.inventoryName}}</p>
                                    <p class="line">{{item.inventorySpec}}</p>
                                    </div>
                                </td>
                                <td>{{item.unitName}}</td>
                                <td>{{item.outboundReturnQuantityShowValue}}</td>
                                <td>
                                    <div class="show-wrap">
                                    <p class="line">{{item.taxUnitPrice}}</p>
                                    <p class="line">{{item.taxAmountsShowValue}}</p>
                                    </div>
                                </td>
                                <td>
                                    <div class="show-wrap">
                                        <p class="line">{{item.currencyName}}</p>
                                    </div>
                                </td>
                                <td>
                                    <div class="show-wrap">
                                        <p class="line">{{item.taxRate}}</p>
                                    </div>
                                </td>
                                <td>{{item.taxShowValue}}</td>
                            </tr>
                            <tr>
                                <td width="5%">合计</td>
                                <td width="13%"></td>
                                <td width="12%"></td>
                                <td width="13%"></td>
                                <td width="5%"></td>
                                <td width="11%">{{orderdetail.dataList[0].totalInboundReturnQuantity}}</td>
                                <td width="11%">{{orderdetail.dataList[0].totalTaxAmount}}</td>
                                <td width="7%"></td>
                                <td width="8%"></td>
                                <td width="10%">{{orderdetail.dataList[0].totalTax}}</td>
                            </tr>
                            </tbody>
                        </table>
                    </containeritem>
                </tabcont>
            </div>
        </div>
    </div>
</template>
<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';

</style>