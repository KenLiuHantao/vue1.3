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

            <h2 class="tag">报价单信息</h2>

            <div class="inner-item form-box">
                <div class="form-group">
                    <label>客户:</label>
                    <div >{{newPricingHeader.customerName}}</div>
                </div>
                <div class="form-group">
                    <label>业务员:</label>
                    <div >{{newPricingHeader.employeeName}}</div>
                </div>
                <div class="form-group">
                    <label>币种:</label>
                    <div >{{newPricingHeader.currencyName}}</div>
                </div>
                <div class="form-group">
                    <label>税率:</label>
                    <div >{{newPricingHeader.taxRate}}</div>
                </div>
            </div>

            <div class="inner-item mt-15">
                <div class="form-group wd-100">
                    <label>上传附件:</label>
                    <upfile-group :config ='uCfg' :edit="false" :data="newPricingHeader.attachmentVos"></upfile-group>
                </div>
                <div  class="form-group wd-100 align-items__baseline">
                    <label>摘要:</label>
                    <p class="lh-20">{{newPricingHeader.remark}}</p>
                </div>
            </div>

            <div class="inner-item">
                <!--<tabbar :config.sync='tabConfig'></tabbar>-->

                <table class="inner-table mt-15">
                    <thead>
                    <tr>
                        <th width="30px">序号</th>
                        <th width="20%">货品信息</th>
                        <th width="8%">单价信息</th>
                        <th width="8%">订单量</th>
                        <th width="8%">生/失效日</th>
                        <th width="8%">备注</th>
                        <th width="8%">状态</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(index,item) in tableConfig">
                        <td>{{ $index+1 }}</td>
                        <td>
                            <div class="show-wrap">
                                <p>编码:{{item.inventoryCode}}</p>
                                <p>名称:{{item.inventoryName}}</p>
                                <p>规格型号:{{item.inventorySpec}}</p>
                            </div>
                        </td>
                        <td>
                            <div class="show-wrap">
                                <p>单位:{{item.unitName}}</p>
                                <p>单价:{{item.taxUnitPrice}}</p>

                            </div>
                        </td>
                        <td>
                            <div class="show-wrap">
                                <p>订单量(从):{{item.lowerLimit}}</p>
                                <p>订单量(到):{{item.upperLimit}}</p>

                            </div>
                        </td>
                        <td>
                            <div class="show-wrap">
                                <p>生效日:{{item.effectiveDate}}</p>
                                <p>失效日:{{item.expiryDate}}</p>

                            </div>
                        </td>
                        <td>
                            {{item.rowRemark}}
                        </td>
                        <td>
                            <!--<button v-if="item.audit == -2" @click="invalidation(item)" class="button-danger">失效此报价</button>-->
                            <span v-if="item.flag == 2" style="color: #ff0700">报价已被失效</span>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div v-if="formEdit" class="add-wrap">
                    <button @click="addRow"><i class="icon icon-add-data" ></i>&nbsp;增加价格</button>
                </div>
            </div>

        </div>
    </div>
    <div class="inner-footer">
        <button class="btn-xl-def" @click="show = false">关闭</button>
    </div>

    <alert :config='invalidationCfg' @cb='invalidationFunction' ></alert>

</template>