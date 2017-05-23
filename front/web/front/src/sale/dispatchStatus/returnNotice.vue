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
                        "warehouseCode": item.warehouseCode,
                        "warehouseName": item.warehouseName,
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
                flowCfg: {
                    data: [{
                        no: '1',
                        name: '新增退货通知单',
                        filed: '',
                        user: '',
                        flag: true,
                    }, {
                        no: '2',
                        name: '审核',
                        filed: '',
                        user: '',
                        flag: false,
                    }, {
                        no: '3',
                        name: '收货',
                        filed: '',
                        user: '',
                        flag: false,
                    }]
                },
                customerCfg: {
                    show: false,
                },
                //提示消息
                msgCfg: {
                    show: false,
                    content: '',
                    type: 'warning'
                },
                wareData: [],
                //附件设置
                uCfg:{
                    limit: 6,
                },
                upData:[],
                ajaxlock:true,
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
                    "salesReturnAttachment": [],
                },
                auditData: {
                    "docNo": "",
                    "recordVersions": [],
                },
                salesReturnAttachment: []
            }
        },
        methods: {
            // 检查数据
            check(){
                let submit = true
                let d = this.paramData.salesReturnAddDetailReqVos
                for (let i=0,l=d.length;i<l;i++) {
                    if (d[i].warehouseCode=='' || d[i].warehouseCode==undefined) {
                        submit = false
                        this.msgCfg.content = '表单第'+(i+1)+'行的仓库不能为空'
                        return false
                    }
                }
                return submit
            },
            //新增提交审核
            addSalesReturn(param) {
                if(!this.ajaxlock){
                    return
                }
                if(!this.check()){
                    this.msgCfg.show = true
                    this.msgCfg.type="failure"
                    return false
                }
                this.ajaxlock=false;
                this.paramData.salesReturnAttachment = this.salesReturnAttachment
                this.$http.post(__URL.sale + 'salesReturn/insert', param).then(
                    res => {
                    this.ajaxlock = true;
                        if (res.data.success) {
                            this.msgCfg.show = true;
                            this.msgCfg.content = "提交成功";
                            this.msgCfg.type = "success";
                            this.$emit("refresh");
                        } else {
                            this.msgCfg.show = true;
                            this.msgCfg.content = res.data.errMsg;
                            this.msgCfg.type = "failure";
                        }
                    }
                )
            },
            //驳回提交审核
            submitSalesReturn(param) {
                this.$http.post(__URL.sale + 'salesReturn/updateSubmitAudit', param).then(
                    res => {
                        if (res.data.success) {
                            this.msgCfg.show = true
                            this.msgCfg.msg = "提交成功"
                        } else {
                            this.msgCfg.show = true
                            this.msgCfg.msg = res.data.errMsg
                        }
                    }
                )
            },
            //删除退货单
            deleteReturn(param){
                this.$http.post(__URL.sale + 'salesReturn/delete', param).then(
                    res => {
                        if (res.data.success) {
                            this.msgCfg.show = true;
                            this.msgCfg.content = "删除成功";
                            this.msgCfg.type = "success";
                            this.show = false;
                            this.$emit("refresh");
                        } else {
                            this.msgCfg.show = true
                            this.msgCfg.msg = res.data.errMsg
                        }
                    }
                )
            },
            addCommit(){
                this.addSalesReturn(this.paramData)
            },
            refuseCommit(){
                this.submitSalesReturn(this.auditData)
            },
            delete(){
                this.deleteReturn(this.auditData)
            },
            checkCustomer(){
                this.customerCfg.show = true
            },
            getCustomer(val){
                this.customerCfg.show = false
                this.infoModal.header.customerName = val.customerName
            },
            hide(){
                this.show = false
                this.$emit('refresh')
            },
            changeWarehouse(index){
                for(var i=0;i<this.wareData.length;i++){
                    if(this.paramData.salesReturnAddDetailReqVos[index].warehouseCode==this.wareData[i].warehouseCode){
                        this.paramData.salesReturnAddDetailReqVos[index].warehouseName=this.wareData[i].warehouseName;
                    }
                }

            }
        },
    }
</script>
<template>
    <!-- 弹框内置dom结构 -->
    <div class="inner-wrapper">
        <workflow :config="flowCfg"></workflow>
        <div class="inner-content">

            <h2 class="tag two-tag"><label>退货单信息</label></h2>

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
                    <div v-if="isedit" class="check-input">
                        <input type="text" v-model="paramData.returnReason">
                    </div>
                    <p v-else >{{returnheader.returnReason}}</p>
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
                        <th width="10%">销售订单号</th>
                        <th width="20%">货品信息</th>
                        <th width="10%">单位</th>
                        <th width="10%">数量</th>
                        <th width="15%">退货仓库</th>
                        <th width="10%">价格</th>
                        <th width="10%">发货日期</th>
                        <th width="15%">备注</th>
                        <th width="10%">客户订单号</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="item in returndata">
                        <td>{{$index+1}}</td>
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
                            {{item.unitName}}
                        </td>
                        <td>
                            <div class="show-wrap">
                                <p><label>订单:</label><label>{{item.salesOrderQuantity}}</label></p>
                                <p><label>已发:</label><label>{{item.salesDispatchQuantity}}</label></p>
                                <p v-if="returndata[$index]">
                                <div v-if="isedit" class="check-input">
                                    <input type="number" v-model="paramData.salesReturnAddDetailReqVos[$index].quantity">
                                </div>
                                    <p v-else>{{item.quantity}}</p>
                                </p>
                            </div>
                        </td>
                        <td>
                            <div class="s-input">
                                <select v-model='paramData.salesReturnAddDetailReqVos[$index].warehouseCode' @change='changeWarehouse($index)'>
                                    <option v-for='item in wareData' :value='item.warehouseCode'>{{item.warehouseName}}</option>
                                </select>
                            </div>
                        </td>
                        <td>
                            <div class="show-wrap">
                            <p>{{item.taxUnitPrice}}</p>
                            <p>{{(item.taxUnitPrice * item.salesDispatchQuantity).toFixed(2)}}</p>
                            </div>
                        </td>
                        <td>
                            {{item.salesDispatchDocDate}}
                        </td>
                        <td>
                            <p v-if="returndata[$index]">
                                <div v-if="isedit" class="check-input">
                                    <input type="text" v-model="paramData.salesReturnAddDetailReqVos[$index].rowRemark">
                                </div>
                                <div v-else class="text-left">
                                    <p class="lh-20">{{item.rowRemark}}</p>
                                </div>
                            </p>
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

    <div class="inner-footer">
        <button class="btn-xl-def" @click="show=false" v-if="isedit || status==1">关闭</button>
        <ajax-button class="btn-xl-imp" @click="addCommit" v-if="isedit">提交审核</ajax-button>
        <ajax-button class="btn-xl-danger" @click="delete" v-if="!isedit && status==0">删除</ajax-button>
        <!--<button class="btn-xl-imp" @click="refuseCommit" v-if="!isedit && status==0">提交审核</button>-->
    </div>

    <!--提示信息-->
    <!--<
     :config="msgCfg" @cb="hide"></alert>-->
    <warning :config="msgCfg"></warning>
</template>

<style lang='less' scoped>
    /* 此处为自己定义的样式 */
    @import '../../../../../public/css/variable.less';
</style>

