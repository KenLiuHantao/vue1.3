<script>
    export default {
        props: ['orderdetail', 'addsendorder'],
        ready() {
            this.generatorDate()
            let params = {
                "pageIndex": 0,
                "pageSize": 0
            }
            this.$http.post(__URL.arc + 'warehouse/find/ref', params).then(
                    (res) => {
                this.wareData = res.data.data.dataList;
            })
        },
        data() {
            return {
                //附件设置
                uCfg:{
                    limit: 6,
                },
                reqInfo: {
                    "remark": "",
                    "detailReqVos": [],
                    "shippingAddress": "",
                    "shippingUser": "",
                    "attachmentVos": [],
                },
                stockReq: {
                    "inventoryId": "",
                    "warehouseCode": "",
                },
                totalCount: 0,
                isEdit : true,
                headerInfo: "",
                showInfos: [],
                wareData: [],
                wCfg: {
                    show: false,
                    content: '',
                    type: 'warning'
                },
            }
        },

        methods: {
            generatorDate() {
                this.totalCount = this.orderdetail.totalCount;
                this.headerInfo = this.orderdetail.header;
                this.orderdetail.dataList.forEach((item) => {
                    let showInfo = {
                        "docNo": item.docNo,
                        "customerOrderDocNo": item.customerOrderDocNo,
                        "inventoryId": item.inventoryId,
                        "inventoryCode": item.inventoryCode,
                        "inventoryName": item.inventoryName,
                        "inventorySpec": item.inventorySpec,
                        "unitName": item.unitName,
                        "quantity": item.quantity,
                        "taxUnitPrice": item.taxUnitPrice,
                        "taxAmounts": item.taxAmounts,
                        "deliveryDate": item.deliveryDate,
                        "unDspQuantity": item.unDspQuantity,
                        "stockQuantity": item.stockQuantity,
                        "abledStockQty": item.abledStockQty,
                        "warehouseCode": item.warehouseCode,
                        "warehouseName": item.warehouseName,
                        "totalPrice": 0,
                    }
                    this.showInfos.push(showInfo);
                    let reqDetailInfo = {
                        "quantity": 0,
                        "recordId": item.recordId,
                        "recordVersion": item.recordVersion,
                        "warehouseCode": item.warehouseCode,
                        "warehouseName": item.warehouseName,
                        "rowRemark": ""
                    }
                    this.reqInfo.detailReqVos.push(reqDetailInfo);
                })
            },
            // 必填字段校验
            check(){
                let submit = true
                if (this.reqInfo.shippingUser.trim() == '') {
                    submit = false
                    this.wCfg.content = '收货人不能为空'
                    return submit
                }
                if (this.reqInfo.shippingAddress.trim() == '') {
                    submit = false
                    this.wCfg.content = '收货地址不能为空'
                    return submit
                }
                return submit;
            },

            //发货
            sendOrder(){
                if(!this.check()){
                    this.wCfg.show = true
                    this.wCfg.type="failure"
                    return false
                }

                this.$http.post(__URL.sale + 'salesSuspenseDispatch/insert', this.reqInfo).then(
                    (res) => {
                        if (res && res.data.success) {
                            this.wCfg.content = "发货成功！";
                            this.wCfg.show = true;
                            this.wCfg.type = "success";
                            this.addsendorder.show = false;
                            this.$emit("refresh")
                        } else {
                            this.wCfg.content = res.data.errMsg;
                            this.wCfg.type = "failure";
                            this.wCfg.show = true;
                        }
                    }
                )
            },
            /*取消下单*/
            cancelOrder()
            {
                this.addsendorder.show = false;
            },
            changeWarehouse(index){
                for(var i=0;i<this.wareData.length;i++){
                    if(this.reqInfo.detailReqVos[index].warehouseCode==this.wareData[i].warehouseCode){
                        this.reqInfo.detailReqVos[index].warehouseName=this.wareData[i].warehouseName;
                        // 获取及时库存
                        this.stockReq.inventoryId = this.showInfos[index].inventoryId;
                        this.stockReq.warehouseCode = this.reqInfo.detailReqVos[index].warehouseCode;
                        this.$http.post(__URL.sale + 'salesSuspenseDispatch/getStockQty', this.stockReq).then(
                                (res) => {
                                    this.showInfos[index].abledStockQty = res.data.data;
                            })
                    }
                }

            }
        },

    }
</script>
<template>
    <!-- 弹框内置dom结构 -->
    <div class="inner-wrapper">
        <!-- <workflow :config="flowCfg"></workflow>-->
        <div class="inner-content">
            <h2 class="tag">发货信息</h2>
            <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
            <div class="inner-item form-box">
                <div class="form-group">
                    <label>客户名称:</label>
                    <p class="orderData">{{headerInfo.customerName}}</p>
                </div>
                <div class="form-group">
                    <label>业务员:</label>
                    <p class="orderData">{{headerInfo.employeeName}}</p>
                </div>
                <div class="form-group">
                    <label>币种:</label>
                    <p class="orderData">{{headerInfo.currencyName}}</p>
                </div>
                <div class="form-group">
                    <label><span class="must-point">*</span>收货人:</label>
                    <input v-model='reqInfo.shippingUser' type="text">
                </div>
                <div class="form-group">
                    <label><span class="must-point">*</span>收货地址:</label>
                    <input v-model='reqInfo.shippingAddress' type="text">
                </div>
            </div>
            <div class="inner-item">
                <div class="form-group ac wd-100">
                    <label>发货附件:</label>
                    <upfile-group :config ='uCfg' :data='reqInfo.attachmentVos' :edit="isEdit || add"></upfile-group>
                </div>
                <div class="form-group wd-100">
                    <label>发货备注:</label>
                    <input v-model='reqInfo.remark' type="text">
                </div>
            </div>
            <div class="inner-item">
                <table class="inner-table">
                    <thead>
                    <tr>
                        <th width="30px">序号</th>
                        <th width="15%">销售单号</th>
                        <th width="20%">货品信息</th>
                        <th width="15%">价格信息</th>
                        <th width="15%">数量</th>
                        <th width="15%">发货仓库</th>
                        <th width="10%">可用库存</th>
                        <th width="10%">交货日期</th>
                        <th width="15%">备注</th>
                        <th width="10%">客户订单号</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for='index in totalCount'>
                        <td>{{index+1}}</td>
                        <td>
                            {{showInfos[index].docNo}}
                        </td>
                        <td>
                            <div class="show-wrap">
                                <p>编码:{{showInfos[index].inventoryCode}}</p>
                                <p>名称:{{showInfos[index].inventoryName}}</p>
                                <p>规格:{{showInfos[index].inventorySpec}}</p>
                            </div>
                        </td>
                        <td>
                            <div class="show-wrap">
                                <p>单价: {{showInfos[index].taxUnitPrice}}</p>
                                <p>单位: {{showInfos[index].unitName}}</p>
                                <p>合计: {{(showInfos[index].taxUnitPrice * reqInfo.detailReqVos[index].quantity).toFixed(2)}}</p>
                            </div>
                        </td>
                        <td>
                            <div class="show-wrap">
                                <p>订单数:{{showInfos[index].quantity}}</p>
                                <p>未发货:{{showInfos[index].unDspQuantity}}</p>
                                 <div class="form-group wd-100">
                                     <label style="width: 42px"><span class="must-point">*</span>发货:</label>
                                     <input-number :code.sync='reqInfo.detailReqVos[index].quantity'></input-number>
                                 </div>
                            </div>
                        </td>
                        <td>
                            <div class="s-input">
                                <select v-model='reqInfo.detailReqVos[index].warehouseCode' @change='changeWarehouse(index)'>
                                    <option v-for='item in wareData' :value='item.warehouseCode'>{{item.warehouseName}}</option>
                                </select>
                            </div>
                        </td>
                        <td>
                            {{ showInfos[index].abledStockQty }}
                        </td>
                        <td>
                            {{showInfos[index].deliveryDate}}
                        </td>
                        <td>
                            <span>
                                <input class="wd100" type="text"
                                       v-model='reqInfo.detailReqVos[index].rowRemark'>
                            </span>
                        </td>
                        <td>
                            {{showInfos[index].customerOrderDocNo}}
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <div class="inner-footer">
        <button class="btn-xl-def" @click='cancelOrder'>关闭</button>
        <ajax-button class="btn-xl-imp" @click='sendOrder'>保存</ajax-button>
    </div>
    <warning :config="wCfg"></warning>
</template>

<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';

</style>