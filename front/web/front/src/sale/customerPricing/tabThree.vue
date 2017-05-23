
<script>
    import cfg from './cfg'
    export default{
        props:['pricingDetail','show'],
        data(){
        return{
            updateData : {
                docNo :'',
                recordVersion:'',
                audit:'',
            },
            newPricing:this.pricingDetail,
            newPricingHeader:this.pricingDetail.header,
            tableConfig: this.pricingDetail.body,
            tabOneConfig:cfg.tableCfg1,
            item :'',
            ajaxLock:true,
            invalidationCfg:{
                title:'报价失效提示',
                show:false,
                type:'warning',
                msg:'确定要失效处理此行的报价信息吗？',
                subMsg:'确定后此报价信息将不能使用！'
            },
        }
    },
    methods : {
        invalidation(item){
            this.item = item;
            this.invalidationCfg.show = true;
        },
        invalidationFunction(){

            this.updateData.docNo = this.item.docNo;
            this.updateData.recordVersion = this.item.recordVersion;
            this.updateData.audit = -2;
            if(!this.ajaxLock){
                return
            }
            this.ajaxLock=false;
            this.$http.post(__URL.sale + 'pricing/updateAuditState',this.updateData).then(
                    (res) => {
                        this.ajaxLock=true;
                        if(res.data.success){
                            this.item.audit =-2;
                            this.invalidationCfg.show = false;
                        }else{
                            alert(res.data.errMsg);
                        }
                    }
            )
        }
    },
    ready(){
        console.log(this.tableConfig)
    }
    }
</script>

<template  :config='modalCfg'>
    <div class="inner-wrapper">
        <div class="inner-content">

            <h2 class="tag">价格表信息</h2>

            <div class="inner-item form-box">
                <div class="form-group">
                    <label>货品编码:</label>
                    <div >{{newPricingHeader.inventoryCode}}</div>
                </div>
                <div class="form-group">
                    <label>货品名称:</label>
                    <div >{{newPricingHeader.inventoryName}}</div>
                </div>
                <div class="form-group">
                    <label>规格型号:</label>
                    <div >{{newPricingHeader.inventorySpec}}</div>
                </div>
            </div>


            <div class="inner-item">
                <!--<tabbar :config.sync='tabConfig'></tabbar>-->

                <table class="inner-table mt-15">
                    <thead>
                    <tr>
                        <th width="30px">序号</th>
                        <th width="10%">单号</th>
                        <th width="8%">客户</th>
                        <th width="8%">业务员</th>
                        <th width="8%">币种</th>
                        <th width="5%">税率(%)</th>
                        <th width="8%">单价信息</th>
                        <th width="8%">订单量</th>
                        <th width="12%">生/失效日</th>
                        <th width="8%">价格状态</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(index,item) in tableConfig">
                        <td>{{ $index+1 }}</td>
                        <td>
                            <p v-if="item.sourceType==2">{{item.sourceDocNo}}</p>
                            <p v-if="item.sourceType==1">{{item.docNo}}</p>
                        </td>
                        <td>
                            <p>{{item.customerName}}</p>
                        </td>
                        <td>
                            <p>{{item.employeeName}}</p>
                        </td>
                        <td>
                            <p>{{item.currencyName}}</p>
                        </td>
                        <td>
                            <p>{{item.taxRate}}</p>
                        </td>
                        <td>
                            <div class="show-wrap">
                                <p>单位:{{item.unitName}}</p>
                                <p>单价:{{item.taxUnitPrice}}</p>
                                <p v-if="item.sourceType==2">价格来源:销售单</p>
                                <p v-else>价格来源:报价单</p>
                            </div>
                        <td>
                            <div  v-if="item.sourceType===1"class="show-wrap">
                                <p>订单量(从):{{item.lowerLimit}}</p>
                                <p>订单量(到):{{item.upperLimit}}</p>
                            </div>
                            <div>
                                {{item.lowerLimit}}
                            </div>
                        </td>
                        <td>
                            <div v-if="item.sourceType==1" class="show-wrap">
                                <p>生效日:{{item.effectiveDate}}</p>
                                <p>失效日:{{item.expiryDate}}</p>
                            </div>
                            <div v-if="item.sourceType==2">
                                {{item.effectiveDate}}
                            </div>
                        </td>
                        <td>
                            <p v-if="item.audit == -2" style="color: #ff0700">报价已被失效</p>
                            <p v-if="item.audit == -3" style="color: #ff0700">到期失效</p>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div v-if="formEdit" class="add-wrap">
                    <button @click="addRow"><i class="icon icon-add-data"></i>&nbsp;增加价格</button>
                </div>
            </div>

        </div>
    </div>
    <div class="inner-footer">
        <button class="btn-xl-def" @click="show = false">关闭</button>
    </div>

    <alert :config='invalidationCfg' @cb='invalidationFunction' ></alert>

</template>