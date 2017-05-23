<script>
    export default{
        props:['orderdetail','customercheckcfg'],
        data(){
            return {
                wCfg: {
                    show: false,
                    type:'failure',
                    content: '',
                    showTime: '2000'
                },
                revokeCb:true,
                dig:2,
                delCfg: {
                    show: false,
                    msg: '确认要删除该数据吗',
                    type: 'failure'
                },
                checkCfg: {
                    show: false,
                    msg: '确认要删除该数据吗',
                    type: 'failure'
                },
                tempIndex:0,
            }
        },


        ready(){

            for(let i = 0; i < this.orderdetail.dataList.length;i++){
                this.orderdetail.dataList[i].lastChange = 1;
            }

            //请求精度
            this.$http.post(__URL.arc + 'parameter/digital/list').then(
                res => {
                    let dataList =  res.data.data.dataList
                    dataList.forEach((data)=>{
                        if(data.code == 'amount'){
                            this.dig = data.decimal;
                        }
                    })
                }
            )
        },
        methods:{
            checkCancel(){
                this.customercheckcfg.show = false;
            },
            checkConfirm(){
                var datadetail = this.orderdetail;
                var params = {
                    header: datadetail.header,
                    dataList: datadetail.dataList
                };
                if (this.revokeCb == false)return
                this.revokeCb = false
                this.$http.post(__URL.sale + 'customer/check/uncheck/confirmcheck', params).then(
                    (res) => {
                        if (res.data.success) {
                            this.$emit('refresh','success',"已完成对账")
                        } else {
                            this.setWarningSuccess('failure', res.data.errMsg)
                        }
                        this.revokeCb  = true;
                    }
                );
            },
            showMsg(type, msg) {
                this.wCfg.show = true;
                this.wCfg.type = type;
                this.wCfg.content = msg;
            },
            checkAlert(){
                this.checkCfg.show = true;
                this.checkCfg.msg =  '是否进行此次客户对账';
                this.checkCfg.type = 'warning';
            },
            delRow(){
                if (this.orderdetail.dataList.length == 1) {
                    this.showMsg('warning','明细至少要有一行');
                    return;
                }
                this.orderdetail.dataList.splice(this.tempIndex, 1);
            },
            setWarningSuccess(type, data){
                this.wCfg.show = true
                this.wCfg.content = data
                this.wCfg.type = type
            },
            del(index){
                this.delCfg.show = true;
                this.delCfg.msg =  '确认要删除该数据吗';
                this.delCfg.type  = 'failure';
                this.tempIndex = index;
            },
            getAmountsAndTax(index){
                let d = this.orderdetail.dataList[index];
                var data = {
                    "inventoryId":d.inventoryId,
                    "inventoryName":d.inventoryName,
                    "taxUnitPrice":d.taxUnitPrice,
                    "quantity":d.outboundReturnQuantity,
                    "taxRate":d.taxRate,
                    "exchangeRate":d.exchRate,
                };
                d.taxAmounts = d.taxUnitPrice * d.outboundReturnQuantity;

//                this.$http.post(__URL.sale + 'priceTaxCombined/updateQuantity',data).then(
//                        (res) => {
//                            d.taxAmounts= res.data.taxAmounts;
//                            d.tax = res.data.tax;
//                        }
//                )
            },
            getQuantityAndTax(index){
                let d = this.orderdetail.dataList[index];
                var data = {
                    "inventoryId":d.inventoryId,
                    "inventoryName":d.inventoryName,
                    "taxUnitPrice":d.taxUnitPrice,
                    "quantity":d.outboundReturnQuantity,
                    "taxRate":d.taxRate,
                    "exchangeRate":d.exchRate,
                };
                d.outboundReturnQuantity = d.taxAmounts / d.taxUnitPrice
            }

        },
        computed:{

        },
        filters :{
            //同步计算价税总计
            setTaxt:{
                write(val,oldval,x,index){
                    let d = this.orderdetail.dataList[index]
                    if(d[x] != ''){
                        d.taxAmounts = (val * d[x]).toFixed(this.dig)
                    }

                    //计算税额
                    if(d.deductionTypeCode == 'BU0110001'){
                        //税额 = (价税合计 / (1 + 税率 / 100)) * (税率 / 100)
                        d.tax = (d.taxAmounts/(1 + d.taxRate/100))*(d.taxRate /100);
                    }
                    else{
                        d.amounts = d.unitPrice * d.outboundReturnQuantity;
                        d.tax = d.taxAmounts - d.amounts;
                    }
                    d.tax = d.tax.toFixed(this.dig);
                    if(d.dispatchAndReturnDocType == 'return'){
                        d.taxAmountsShowValue = Math.abs(d.taxAmounts).toFixed(this.dig);
                        d.tax = Math.abs(d.tax).toFixed(this.dig);
                        d.outboundReturnQuantity = - val;
                    }
                    //合计变化
                    let sumQuantity = 0,sumTaxAmount = 0,sumTax = 0;
                    for(let i = 0; i < this.orderdetail.dataList.length;i++){
                        sumQuantity +=  Number(this.orderdetail.dataList[i].outboundReturnQuantity);
                        sumTaxAmount += Number(this.orderdetail.dataList[i].taxAmounts);
                        sumTax += Number(this.orderdetail.dataList[i].tax);
                        this.orderdetail.dataList[i].lastChange = 1;
                    }
                    this.orderdetail.dataList[0].totalInboundReturnQuantity = Number(sumQuantity).toFixed(this.dig);
                    this.orderdetail.dataList[0].totalTaxAmount = Number(sumTaxAmount).toFixed(this.dig);
                    this.orderdetail.dataList[0].totalTax = Number(sumTax).toFixed(this.dig);

                    return val
                }
            },
            calc:{
                write(val,oldval,x,index){
                    let d = this.orderdetail.dataList[index];
                    d.outboundReturnQuantity =(val / d[x]).toFixed(this.dig)


                    //计算税额
                    if(d.deductionTypeCode == 'BU0110001'){
                        //税额 = (价税合计 / (1 + 税率 / 100)) * (税率 / 100)
                        d.tax = (d.taxAmounts/(1 + d.taxRate/100))*(d.taxRate /100);
                    }
                    else{
                        d.amounts = d.unitPrice * d.outboundReturnQuantity;
                        d.tax = d.taxAmounts - d.amounts;
                    }

                    if(d.dispatchAndReturnDocType == 'return'){
                        d.outboundReturnQuantityShowValue = Math.abs(d.outboundReturnQuantity).toFixed(this.dig);
                        d.tax = Math.abs(d.tax).toFixed(this.dig);
                        d.taxAmounts = - val;
                    }

                    //合计变化
                    let sumQuantity = 0,sumTaxAmount = 0,sumTax = 0;
                    for(let i = 0; i < this.orderdetail.dataList.length;i++){
                        sumQuantity +=  Number(this.orderdetail.dataList[i].outboundReturnQuantity);
                        sumTaxAmount += Number(this.orderdetail.dataList[i].taxAmounts);
                        sumTax += Number(this.orderdetail.dataList[i].tax);
                        this.orderdetail.dataList[i].lastChange = 2;
                    }
                    this.orderdetail.dataList[0].totalInboundReturnQuantity = Number(sumQuantity).toFixed(this.dig);
                    this.orderdetail.dataList[0].totalTaxAmount = Number(sumTaxAmount).toFixed(this.dig);
                    this.orderdetail.dataList[0].totalTax = Number(sumTax).toFixed(this.dig);

                    d.tax = Number(d.tax).toFixed(this.dig);

                    return val
                }
            }
        },
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
                                <th width="7%">币种</th>
                                <th width="8%">税率(%)</th>
                                <th width="10%">税额</th>
                                <th width="5%">操作</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(index,item) in orderdetail.dataList" :class="{'red':item.dispatchAndReturnDocType == 'return'}">
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
                                <td>
                                    <!--<input class="wd100" type="number" @keyup="getAmountsAndTax($index)" v-model="item.outboundReturnQuantity" placeholder="数量">-->
                                    <input-number class="wd100" :code.sync="item.outboundReturnQuantityShowValue | setTaxt 'taxUnitPrice' $index" key="quantity"  placeholder="数量"></input-number>
                                </td>
                                <td>
                                    <div class="show-wrap">
                                        <p class="line">{{item.taxUnitPrice}}</p>
                                        <p class="line"></p>
                                    </div>
                                    <!--<input class="wd100" type="number" @keyup="getQuantityAndTax($index)"  v-model="item.taxAmounts" placeholder="金额">-->
                                    <input-number class="wd100" :code.sync="item.taxAmountsShowValue | calc 'taxUnitPrice' $index"   placeholder="金额"></input-number>
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
                                <td>
                                    <a @click='del($index)' class="delete">删除</a>
                                </td>
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
                                <td width="5%"></td>
                            </tr>
                            </tbody>
                        </table>
                    </containeritem>
                </tabcont>
            </div>
        </div>
    </div>

    <div class="inner-footer">
        <button @click='checkCancel' class="btn-xl-def">关闭</button>
        <button @click='checkAlert' class="btn-xl-imp">确认对账</button>
    </div>
    <!--警告-->
    <alert :config="delCfg" @cb="delRow"></alert>
    <alert :config="checkCfg" @cb="checkConfirm"></alert>
    <warning :config="wCfg"></warning>
</template>
<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';

</style>