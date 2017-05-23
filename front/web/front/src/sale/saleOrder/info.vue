<script>
export default {
    props:['docno','show'],
    data() {
        return {
            selfReg:{
                limit:''
            },
            //附件组2
            ugCfgTwo:{
                limit:1,
            },
            flowCfg:{
                    data:[{
                    no:'1',
                    name:'新增BOM',
                    time:'',
                    filed:'',
                    user:'',
                    flag:true,
                    },{
                    no:'2',
                    name:'审核BOM',
                    time:'',
                    filed:'',
                    user:'',
                    flag:true,
                    }]
            },
            //table数据模型
            tableModal:{
                "recordId":"",
                "deliveryDate": "",
                "inventoryCode": "",
                "inventoryName": "",
                "inventorySpec": "",
                "quantity": 0,
                "recordId": "",
                "recordVersion": 0,
                "rowNum": 0,
                "rowRemark": "",
                "taxAmounts": 0,
                "taxUnitPrice": 0,
                "unitName": "",
                "attributeCode":'',
                "attributeName":'',
                //后台计算的值
                "lcAmounts": 0,
                "lcTax": 0,
                "lcTaxAmounts": 0,
                "lcTaxUnitPrice": 0,
                "lcUnitPrice": 0,
                "unitPrice": 0,
                "amounts": 0
              },
            //页面数据模型
            infoModal:{
                "dataList": [],
                "header": {
                       "salesOrderAttachment":[],
                       "customerContractAttachment":[],
                       "currencyCode": "",
                       "currencyName": "",
                       "currencySymbol": "",
                       "customerCode": "",
                       "customerName": "",
                       "customerOrderDocNo": "",
                       "docNo": "",
                       "employeeCode": "",
                       "employeeName": "",
                       "recAgreementCode": "",
                       "recAgreementName": "",
                       "remark": "",
                       "taxRate": 0,
                       "docStatus":0,
                       "exchangeRate":'',
                       "payment":'',
                       "dispatchModel":'',
                },
            }
        }
    },
    ready(){
        if(this.docno)this.getInfo()
    },
    methods: {
        //获取详情信息
        getInfo(){
            this.$http.get(__URL.sale + 'salesOrder/findOne/'+this.docno).then(
                res=>{
                    if(res.data.success){
                        this.infoModal = res.data.data
                    }
                }
            )
        }
    },
    filters :{

    }
}

</script>
<template>
    <!-- 弹框内置dom结构 -->
    <div class="inner-wrapper">
        <div class="inner-content">
            <h2 class="tag two-tag"><label>销售订单信息</label><label class="ft-14">销售单号:{{docno}}</label></h2>
            <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
            <div class="inner-item form-box">
                <div class="form-group">
                    <label>客户名称:</label>
                    <p>{{infoModal.header.customerName}}</p>
                </div>
                <div class="form-group">
                    <label>业务员:</label>
                    <p>{{infoModal.header.employeeName}}</p>
                </div>
                <div class="form-group">
                    <label>币种:</label>
                    <p>{{infoModal.header.currencyName}}</p>
                </div>
                <div class="form-group">
                    <label>客户订单号:</label>
                    <p>{{infoModal.header.customerOrderDocNo}}</p>
                </div>
                <div class="form-group">
                    <label>收款协议:</label>
                    <p>{{infoModal.header.recAgreementName}}</p>
                </div>
                <div class="form-group">
                    <label>税率(%):</label>
                    <p>{{infoModal.header.taxRate}}</p>
                </div>
                <div class="form-group">
                    <label>结算方式:</label>
                    <p>{{infoModal.header.payment}}</p>
                </div>
                <div class="form-group">
                    <label>交货方式:</label>
                    <p>{{infoModal.header.dispatchModel}}</p>
                </div>
            </div>

            <div class="inner-item">
                <div class="form-group ac wd-100">
                    <label>订单图档附件:</label>
                    <upfile-group :data='infoModal.header.salesOrderAttachment'></upfile-group>
                </div>
                <div class="form-group ac wd-100">
                    <label>客户订单合同:</label>
                    <upfile-group :config="ugCfgTwo" :data='infoModal.header.customerContractAttachment'></upfile-group>
                </div>
                <div class="form-group wd-100 align-items__baseline">
                    <label>订单备注:</label>
                    <p class="lh-20">{{infoModal.header.remark}}</p>
                </div>
            </div>

            <div class="inner-item">
                <table class="inner-table">
                    <thead>
                    <tr>
                        <th width="5%">序号</th>
                        <th width="20%">货品信息</th>
                        <th width="5%">单位</th>
                        <th width="10%">数量</th>
                        <th width="10%">含税单价</th>
                        <th width="10%">价税合计</th>
                        <th width="15%">交期</th>
                        <th width="15%">库存</th>
                        <th width="18%">备注</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="item in infoModal.dataList">
                        <td>{{$index+1}}</td>
                        <td>
                            <div class="show-wrap">
                                <p>编码:{{item.inventoryCode}}</p>
                                <p>名称:{{item.inventoryName}}</p>
                                <p>规格型号:{{item.inventorySpec}}</p>
                                <p>属性:{{item.attributeName}}</p>
                            </div>

                        </td>
                        <td>
                            {{item.unitName}}
                        </td>
                        <td>
                            {{item.quantity}}
                        </td>
                        <td>
                            {{item.taxUnitPrice}}
                        </td>
                        <td>
                            {{item.taxAmounts}}
                        </td>
                        <td>
                            {{item.deliveryDate}}
                        </td>
                        <td>
                            <div class="show-wrap">
                            <p> 即时库存:   {{ item.stockQuantity }}</p>
                            <p> 可用库存:   {{ item.abledStockQty }}</p>
                            </div>
                        </td>
                        <td>
                            <div class="show-wrap">
                            <p class="lh-20">{{item.rowRemark}}</p>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>

            </div>
        </div>
    </div>
    <div class="inner-footer">
        <button class="btn-xl-def" @click="show.show=false">关闭</button>
    </div>

</template>
<style lang='less' scoped>
    /* 此处为自己定义的样式 */
    @import '../../../../../public/css/variable.less';

    .inner-content .tag {
        :nth-child(1) {
            width: 50%;
            float: left
        }
        :nth-child(2) {
            width: 50%;
            text-align: right;
            float: right;
        }
    }
</style>
