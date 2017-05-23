<script>
    export default {
        props: ['show','returndata','returnheader','isedit','status'],
        ready() {
            this.auditData.docNo = this.returnheader.docNo
            this.salesReturnAttachment = this.returnheader.salesReturnAttachment
            if(this.isedit){
                this.returndata.forEach((item)=>{
                    let salesReturnAddDetailReqVo = {
                        "quantity": 0,
                        "recordId": item.recordId,
                        "recordVersion": item.recordVersion,
                        "rowRemark": "",
                    }
                    this.paramData.salesReturnAddDetailReqVos.push(salesReturnAddDetailReqVo)
                })
            }else{
                this.returndata.forEach((item)=>{
                    let recordVersion = {
                        "recordId": item.recordId,
                        "recordVersion": item.recordVersion,
                    }
                    this.auditData.recordVersions.push(recordVersion)
                })
            }
        },
        data() {
            return {
                flowCfg: {
                    data: this.returnheader.workFlowVos
                },
                customerCfg: {
                    show: false,
                },
                //提示消息
                msgCfg: {
                    show: false,
                    msg: '提示消息',
                    type:'warning'

                },
                //附件设置
                uCfg:{
                    limit:5,
                },
                upData:[],
                searchParams: {
                    "customerName": "",
                    "employeeName": "",
                    "inventoryCode": "",
                    "salesOrderDocNo": "",
                    "salesDispatchDocDate": "",
                    "pageIndex": 0,
                    "pageSize": 0,
                },
                paramData: {
                    "remark": "",
                    "returnReason": "",
                    "salesReturnAddDetailReqVos": [],
                },
                auditData: {
                    "docNo": "",
                    "recordVersions": [],
                },
                salesReturnAttachment: []
            }
        },
        methods: {
            //获取table列表数据
            auditReturn(param) {
                this.$http.post(__URL.sale + 'salesReturn/audit', param).then(
                    res => {
                        if (res.data.success) {
                            this.msgCfg.type="success"
                            this.msgCfg.show = true
                            this.msgCfg.msg = "审核成功"

                            this.show = false;
                            this.$emit("refresh");
                        } else {
                            this.msgCfg.show = true
                            this.msgCfg.type="failure"
                            this.msgCfg.msg = res.data.errMsg
                        }
                    }
                )
            },
            rejectReturn(param){
                this.$http.post(__URL.sale + 'salesReturn/updateReject', param).then(
                    res => {
                        if (res.data.success) {
                            this.msgCfg.show = true
                            this.msgCfg.msg = "驳回成功"
                            this.show = false;
                            this.$emit("refresh");
                        } else {
                            this.msgCfg.show = true
                            this.msgCfg.msg = res.data.errMsg
                        }
                    }
                )
            },
            cancelAuditReturn(param) {
                this.$http.post(__URL.sale + 'salesReturn/unaudit', param).then(
                    res => {
                        if (res.data.success) {
                            this.msgCfg.show = true
                            this.msgCfg.msg = "弃审成功"
                            this.show = false;
                            this.$emit("refresh");
                        } else {
                            this.msgCfg.show = true
                            this.msgCfg.msg = res.data.errMsg
                        }
                    }
                )
            },
            auditCommit(){
                this.addSalesReturn(this.paramData)
            },
            audit(){
                this.auditReturn(this.auditData)
            },
            cancelAudit(){
                this.cancelAuditReturn(this.auditData)
            },
            reject(){
                this.rejectReturn(this.auditData)
            },

            hide(){
                this.show = false
                this.$emit('refresh')
            },
            checkCustomer(){
                this.customerCfg.show = true
            },
            getCustomer(val){
                this.customerCfg.show = false
                this.infoModal.header.customerName = val.customerName
            }
        },
    }
</script>

<template>
    <!-- 弹框内置dom结构 -->
    <div class="inner-wrapper">
        <workflow :config="flowCfg"></workflow>
        <div class="inner-content">

            <h2 class="tag two-tag"><label>退货单信息</label><label class="ft-14">退货单号:{{returnheader.docNo}}</label></h2>

            <div class="block">
                <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
                <div class="inner-item form-box">
                    <div class="form-group">
                        <label>客户名称:</label>
                        <p >{{returnheader.customerName}}</p>
                    </div>
                    <div class="form-group">
                        <label>退货日期:</label>
                        <p >{{returnheader.docDate}}</p>
                    </div>
                    <div class="form-group">
                        <label>业务员:</label>
                        <p >{{returnheader.employeeName}}</p>
                    </div>
                    <div class="form-group">
                        <label>退货原因:</label>
                        <p >{{returnheader.returnReason}}</p>
                    </div>
                    <div class="form-group">
                        <label>币种:</label>
                        <p >{{returnheader.currencyName}}</p>
                    </div>
                </div>

                <div class="inner-item mt-15">
                    <div class="form-group wd-100">
                        <label>附件:</label>
                        <upfile-group :config ='uCfg' :edit="isedit" :data="salesReturnAttachment"></upfile-group>
                    </div>
                    <div v-if="isedit" class="form-group wd-100">
                        <label>备注:</label>
                        <div class="check-input">
                            <input type="text" maxlength='120' v-model='paramData.remark'>
                        </div>
                    </div>
                    <div v-else class="form-group wd-100 align-items__baseline">
                        <label>备注:</label>
                        <p class="lh-20">{{returnheader.remark}}</p>
                    </div>
                </div>

                <div class="inner-item">
                    <table class="inner-table mt-15">
                        <thead>
                        <tr>
                            <th width="5%">序号</th>
                            <th width="10%">发货单号</th>
                            <th width="10%">销售订单号</th>
                            <th width="20%">货品信息</th>
                            <th width="10%">价格信息</th>
                            <th width="10%">数量</th>
                            <th width="10%">退货仓库</th>
                            <th width="10%">发货日期</th>
                            <th width="15%">备注</th>
                            <th width="10%">客户订单号</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="item in returndata">
                            <td>{{$index+1}}</td>
                            <td>
                                {{item.salesDispatchDocNo}}
                            </td>
                            <td>
                                {{item.salesOrderDocNo}}
                            </td>
                            <td>
                                <div class="show-wrap">
                                    <p><label>编码:</label><label>{{item.inventoryCode}}</label></p>
                                    <p><label>名称:</label><label>{{item.inventoryName}}</label></p>
                                    <p><label>规格型号:</label><label>{{item.inventorySpec}}</label></p>
                                </div>
                            </td>
                            <td>
                                <div class="show-wrap">
                                    <p><label>单价:</label>{{ item.taxUnitPrice }}</p>
                                    <p><label>单位:</label>{{ item.unitName }}</p>
                                    <p><label>合计:</label>{{ item.taxAmounts }}</p>
                                </div>
                            </td>
                            <td>
                                <div class="show-wrap">
                                    <p><label>订单:</label><label>{{item.salesOrderQuantity}}</label></p>
                                    <p><label>已发:</label><label>{{item.salesDispatchQuantity}}</label></p>
                                    <p><label>退货:</label><label>{{item.quantity}}</label></p>
                                </div>
                            </td>
                            <td>
                                <p>{{item.warehouseName}}</p>
                            </td>
                            <td>
                                {{item.salesDispatchDocDate }}
                            </td>
                            <td>
                                <div class="show-wrap">
                                <p class="lh-20">{{item.rowRemark}}</p>
                                </div>
                            </td>
                            <td>
                                {{item.customerOrderDocNo}}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <div class="inner-footer">
        <!--<button class="btn-xl-imp" @click="cancelAudit" v-if="status == 1">弃审</button>-->
        <button class="btn-xl-def" @click="show=false" v-if="status == 0">取消</button>
        <button class="btn-xl-def" @click="show=false" v-else>关闭</button>
        <ajax-button class="btn-xl-imp" @click="audit" v-if="status == 0">审核</ajax-button>
        <ajax-button class="btn-xl-imp" @click="reject" v-if="status == 0">驳回</ajax-button>
    </div>

    <!--提示信息-->
    <alert :config="msgCfg" @cb="hide"></alert>
</template>
<style lang='less' scoped>
    /* 此处为自己定义的样式 */
    @import '../../../../../public/css/variable.less';
</style>


