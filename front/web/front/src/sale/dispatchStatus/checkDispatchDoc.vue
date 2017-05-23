<script>
    import cfg from './cfg'
    import rnotice from './returnNotice.vue'
    export default {
        components:{
            rnotice
        },
         props:['dispatchDetail','show','tab'],
        ready() {
            debugger;
            if (this.dispatchDetail.header.abledReturnQty > 0) {
                this.isReturn = false;
            }
        },
        data() {
            return {
               modalCfg: {
                    show: true,
                    title: '发货单'
                },
                tabConfig: {
                    type:'page',
                    select: 'contactsTab',
                    tabBarData: []
                },
                msgConfig:{
                    show:false,
                  },
                customerCfg:{
                    show:false
                  },
                ugCfgTwo:{
                    limit:6,
                },
                defaultRow: {
                    inventoryId:"",
                    inventoryCode:"",
                    inventoryName:"",
                    inventorySpec:"",
                    unitCode: "",
                    unitName: "",
                    quantity: "",
                    taxUnitPrice: "",
                    taxAmounts: "",
                    tax: "",
                    rowRemark: ""
                },
                currency:[
                                 {currencyCode:'RMB',currencyName:'人民币',currencySymbol:'￥'},
                                 {currencyCode:'DOLLAR',currencyName:'美元',currencySymbol:'$'}
                           ],
                dispatchDoc:this.dispatchDetail,
                dispatchDocHeader:this.dispatchDetail.header,
                tableConfig : this.dispatchDetail.dataList,
                ajaxLock:true,
                isEdit:true,
                isReturn:true,
                auditStatusVo:{
                            "docNo":this.dispatchDetail.header.docNo,
                            "recordVersions":this.dispatchDetail.dataList
                },
                noticeConfig:{
                    show: false,
                    width: '100%',
                    height: '100%',
                    title: '退货通知单',
                },
                salesReturnGeneratorReqVos:{
                    docNo: "",
                    ids: []
                },
                returnData:[],
                returnHeader:{
                    "currencyName": "",
                    "customerName": "",
                    "docDate": "",
                    "docNo": "",
                    "docStatus": 0,
                    "employeeName": "",
                    "remark":'',
                    "returnReason":'',
                    "salesReturnAttachment":[]
                }
            }
        },
        methods: {
           //增加单行
            addRow() {
                var tmpDefaultRow = Object.assign({}, this.defaultRow);
               this.tableConfig.push(tmpDefaultRow);
            },

            delRow(index) {
                if (this.tableConfig.length == 1) {
                    alert("表格必须保留一行！");
                    return;
                }

            },

            saveData() {

                 if(!this.ajaxLock){
                     return
                    }
                  this.ajaxLock=false;
                  this.$http.post(__URL.sale + 'salesDispatch/audit', this.auditStatusVo).then( (res) => {
                                        this.ajaxLock=true;
                                       if(res.data.success){
                                                this.show = false;
                                                 this.$emit('refresh');
                                       }else{
                                             this.msgConfig.show=true
                                             this.msgConfig.content = res.data.errMsg
                                       }
                                    }
                                )


            },
            refresh(){
                this.noticeConfig.show = false;
                this.$emit('refresh');
            },
            return(){
                this.salesReturnGeneratorReqVos.docNo = this.dispatchDocHeader.docNo
                this.getReturnData(this.salesReturnGeneratorReqVos)
            },
            getReturnData(param) {
                this.$http.post(__URL.sale + 'salesReturn/createSalesReturnForDispatch', param).then(
                        res => {
                    if (res.data.success) {
                    this.returnData = res.data.data.dataList
                    this.returnHeader = res.data.data.header
                    this.noticeConfig.show = true
                } else {
                    this.msgConfig.show = true
                    this.msgConfig.content = res.data.errMsg
                }
            }
            )
            }


        }
    }

</script>
<template  :config='modalCfg'>
    <!--<button class="btn-lg-imp" @click='modal'>内页弹窗按钮</button>-->
    <!-- 弹框内置dom结构 -->
    <!--<inner :config='modalCfg'>-->
        <div class="inner-wrapper">
            <div class="inner-content">

                <h2 class="tag two-tag"><label>发货单信息</label><label class="ft-14">发货单号:{{dispatchDocHeader.docNo}}</label></h2>

                <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
                <div class="inner-item form-box">
                    <div class="form-group">
                        <label>客户:</label>
                        <p>
                        {{dispatchDocHeader.customerName}}
                        </p>
                    </div>
                    <div class="form-group">
                        <label>业务员:</label>
                        <p>
                        {{dispatchDocHeader.employeeName}}
                        </p>
                    </div>
                    <div class="form-group">
                        <label>币种:</label>
                        <p>
                        {{dispatchDocHeader.currencyName}}
                        </p>
                    </div>
                    <div class="form-group">
                        <label>收货人:</label>
                        <p>
                         {{dispatchDocHeader.shippingUser}}
                        </p>
                    </div>
                    <div class="form-group">
                        <label>收货地址:</label>
                        <p>
                        {{dispatchDocHeader.shippingAddress}}
                        </p>
                    </div>
                </div>

                <div class="inner-item mt-15">
                    <div class="form-group wd-100">
                        <label>发货附件:</label>
                        <upfile-group :config="ugCfgTwo" :data='dispatchDocHeader.attachmentVos'></upfile-group>
                    </div>
                    <div class="form-group wd-100 align-items__baseline">
                        <label>备注:</label>
                        <p class="lh-20">{{dispatchDocHeader.remark}}</p>
                    </div>
                </div>

                <div class="inner-item">
                    <!--<tabbar :config.sync='tabConfig'></tabbar>-->
                    <tab-container :active.sync='tabConfig.select'>
                        <tab-item id='contactsTab'>
                            <table class="inner-table mt-15">
                                <thead>
                                <tr>
                                    <th width="30px">序号</th>
                                    <th width="10%">销售单号</th>
                                    <th width="20%">货品信息</th>
                                    <th width="15%">价格信息</th>
                                    <th width="15%">数量</th>
                                    <th width="10%">发货仓库</th>
                                    <th width="10%">可用库存数</th>
                                    <th width="10%">交货日期</th>
                                    <th width="10%">备注</th>
                                    <th width="10%">客户订单</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(index,item) in tableConfig">
                                    <td>{{ $index+1 }}</td>
                                    <td>{{ item.salesOrderDocNo }}</td>
                                    <td>
                                        <div class="show-wrap">
                                        <p>编码:  {{item.inventoryCode}}</p>
                                        <p>名称:  {{item.inventoryName}}</p>
                                        <p>规格型号:    {{item.inventorySpec}}</p>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="show-wrap">
                                            <p>单价: {{ item.taxUnitPrice }}</p>
                                            <p>单位: {{ item.unitName }}</p>
                                            <p>合计: {{ item.taxAmounts }}</p>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="show-wrap">
                                        <p> 订单数量:     {{ item.salesOrderQuantity }}</p>
                                        <p>未发货:     {{ item.salesOrderQuantity - item.quantity}} </p>
                                        <p>发货数量:     {{ item.quantity }}</p>
                                        </div>
                                    </td>
                                    <td>
                                        <p>{{item.warehouseName}}</p>
                                    </td>
                                    <td>
                                        <p> {{ item.abledStockQty }}</p>
                                    </td>
                                    <td>
                                        <p>{{ item.salesOrderDeliveryDate }}</p>
                                    </td>
                                    <td>
                                        <div class="show-wrap">
                                        <p class="lh-20">{{ item.rowRemark }}</p>
                                        </div>
                                    </td>
                                    <td>
                                        <p>{{ item.customerOrderDocNo }}</p>
                                    </td>
                                </tr>
                                </tbody>
                            </table>

                            <!--<div class="add-wrap" >-->
                                <!--<button @click="addRow"><i class="icon icon-product__add"></i>增加产品</button>-->
                            <!--</div>-->
                        </tab-item>
                    </tab-container>
                </div>
            </div>
        </div>

        <div class="inner-footer">
            <button class="btn-xl-def" @click="this.show.show=false">关闭</button>
            <ajax-button class="btn-xl-imp" v-if="tab=='tab3'" :disabled="isReturn" @click="return">退货</ajax-button>
            <!--<button class="btn-xl-imp" @click="saveData" v-if="dispatchDocHeader.docStatus != 1" >审核</button>-->
        </div>

    <!-- 退货通知 -->
    <inner :config="noticeConfig">
        <rnotice :show.sync="noticeConfig.show" :returndata="returnData" :returnheader="returnHeader" :isedit="isEdit" @refresh="refresh"></rnotice>
    </inner>

    <!--</inner>-->
    <refer-customer :config="customerCfg" @cb="sureCustomer"></refer-customer>

    <message :config="msgConfig" ></message>
</template>
<style lang="less" scoped>
    @import "../../../../../public/css/variable.less";
</style>
