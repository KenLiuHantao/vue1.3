<script>
    export default {
        props: ['docno', 'show'],
        ready() {
            if (this.docno) this.getInfo()
        },
        data() {
            return {
                customerCfg: {
                    show: false,
                },
                //提示消息
                msgCfg: {
                    show: true,
                    msg: '提示消息'

                },
                //附件设置
                uCfg: {
                    limit: 6,
                },
                upData: [],
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
                //table数据模型
                tableModal: {
                    "salesOrderDocNo": "",
                    "inventoryCode": "",
                    "inventoryName": "",
                    "inventorySpec": "",
                    "unitName": "",
                    "salesOrderQuantity": 0,
                    "salesDispatchQuantity": 0,
                    "quantity": 0,
                    "taxUnitPrice": 0,
                    "salesDispatchDocDate": 0,
                    "rowRemark": "",
                    "customerOrderDocNo": "",
                },
                //页面数据模型
                infoModal: {
                    "dataList": [],
                    "header": {
                        "customerName": "",
                        "docDate": "",
                        "employeeName": "",
                        "currencyName": "",
                        "returnReason": "",
                        "salesReturnAttachment": [],
                        "remark": "",
                    },
                }
            }
        },
        methods: {
            //获取详情信息
            getInfo(){
                this.$http.get(__URL.sale + 'salesReturn/findOne/' + this.docno).then(
                    res => {
                        if (res.data.success) {
                            this.infoModal = res.data.data
                        }
                    }
                )
            }
        },
    }
</script>
<template>
    <!-- 弹框内置dom结构 -->
    <div class="inner-wrapper">
        <workflow :config="flowCfg"></workflow>
        <div class="inner-content">

            <h2 class="tag two-tag"><label>退货单信息</label><label class="ft-14">退货单号:{{docno}}</label></h2>
            <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
            <div class="inner-item form-box">
                <div class="form-group">
                    <label>客户名称:</label>
                    <p>{{infoModal.header.customerName}}</p>
                </div>
                <div class="form-group">
                    <label>退货日期:</label>
                    <p>{{infoModal.header.docDate}}</p>
                </div>
                <div class="form-group">
                    <label>业务员:</label>
                    <p>{{infoModal.header.employeeName}}</p>
                </div>
                <div class="form-group">
                    <label>退货原因:</label>
                    <div v-if="isedit" class="check-input">
                        <input type="text" v-model="paramData.returnReason">
                    </div>
                    <p v-else>{{infoModal.header.returnReason}}</p>
                </div>
                <div class="form-group">
                    <label>币种:</label>
                    <p>{{infoModal.header.currencyName}}</p>
                </div>
            </div>

            <div class="inner-item mt-15">
                <div class="form-group wd-100">
                    <label>附件:</label>
                    <upfile-group :config='uCfg' :edit="isedit" :data="salesReturnAttachment"></upfile-group>
                </div>
                <div v-if="isedit" class="form-group wd-100">
                    <label>备注:</label>
                    <div class="check-input">
                        <input type="text" maxlength='120' v-model='paramData.remark'>
                    </div>
                </div>
                <div v-else class="form-group wd-100 align-items__baseline">
                    <label>备注:</label>
                    <p class="lh-20">{{infoModal.header.remark}}</p>
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
                        <th width="10%">价格</th>
                        <th width="10%">发货日期</th>
                        <th width="15%">备注</th>
                        <th width="10%">客户订单号</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(index,item) in infoModal.dataList">
                        <td>{{$index + 1}}</td>
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
                                <p v-if="infoModal.dataList[$index]">
                                <div v-if="isedit" class="check-input">
                                    <input type="number"
                                           v-model="paramData.salesReturnAddDetailReqVos[$index].quantity">
                                </div>
                                <p v-else>{{item.quantity}}</p>
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
                            <p v-if="infoModal.dataList[$index]">
                            <div v-if="isedit" class="check-input">
                                <input type="text" v-model="paramData.salesReturnAddDetailReqVos[$index].rowRemark">
                            </div>
                            <div v-else class="text-left">
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

    <div class="inner-footer">
        <button class="btn-xl-def" @click="show=false">关闭</button>
    </div>

    <!--提示信息-->
    <!--<alert :config="msgCfg" @cb="hide"></alert>-->
</template>

<style lang='less' scoped>
    /* 此处为自己定义的样式 */
    @import '../../../../../public/css/variable.less';
</style>

