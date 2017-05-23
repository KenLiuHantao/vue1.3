<script>
    import orderDetail from '../productPick/orderDetail'
    export default{
        data(){
            return {
                supplyInfo: {
                    "header": {
                        "docNo": "",
                        "docDate": "",
                        "demandDocNo": "",
                        "demandId": "",
                        "departmentCode": "",
                        "departmentName": "",
                        "departmentPy": "",
                        "employeeCode": "",
                        "employeeName": "",
                        "processCode": "",
                        "processName": "",
                        "processSort": 0,
                        "hasAudit": false
                    },
                    "dataList": []
                },

                auditStatus: [{
                    "audit": 1,
                    "auditDesc": "通过"
                }, {
                    "audit": 2,
                    "auditDesc": "驳回"
                }],

                auditList: [],

                tipsCfg: {
                    show: false,
                    content: '',
                    type: 'warning'
                },
                detailConfig: {
                    show: false,
                    title: "生产订单",
                },
                revokeCb: true,
                order:{
                    srcDocNo:'',
                    taskId:''
                }
            }
        },

        props: ['docNo'],
        components: {
            orderDetail
        },
        ready() {
            this.$http.get(__URL.manufacture + 'production/material/supply/detail/' + this.docNo).then(
                (res) => {
                    this.supplyInfo = res.data.data;
                    this.isAudit = res.data.data.header.hasAudit;
                    this.order.taskId = this.supplyInfo.header.demandId
                    this.order.srcDocNo = this.supplyInfo.header.demandDocNo
                }
            )
        },
        methods: {
            audit() {
                if (this.revokeCb === false)return;
                this.revokeCb = false;
                this.auditList = [];
                for (let i = 0; i < this.supplyInfo.dataList.length; i++) {
                    let data = {
                        "recordId": "",
                        "audit": 0,
                        "remark": "",
                        "recordVersion": 0
                    };
                    if (this.supplyInfo.dataList[i].audit === 0) {
                        this.setWarningSuccess("第" + (i + 1) + "条记录未审核！");
                        this.revokeCb = true;
                        return;
                    }
                    data.recordId = this.supplyInfo.dataList[i].recordId;
                    data.audit = this.supplyInfo.dataList[i].audit;
                    data.remark = this.supplyInfo.dataList[i].remark;
                    data.recordVersion = this.supplyInfo.dataList[i].recordVersion;
                    this.auditList.push(data);
                }
                this.$http.post(__URL.manufacture + 'production/material/supply/audit', this.auditList).then(
                    (res) => {
                        if (res.data.success) {
                            this.$emit('refresh', res.data.data)
                        } else {
                            this.setWarningSuccess(res.data.errMsg)
                        }
                        this.revokeCb = true;
                    }
                )
            },

            setWarningSuccess(data){
                this.tipsCfg.show = true;
                this.tipsCfg.content = data;
                this.tipsCfg.type = "failure";
            },

            close() {
                this.$emit('refresh', null);
            },
            openOrderDetail(){
                 this.detailConfig.show = true
            }
        },
    }


</script>
<template>
    <warning :config="tipsCfg"></warning>
    <div class="inner-wrapper">
        <div class="inner-content">
            <h2 class="tag two-tag"><label>补料申请单信息</label><label class="ft-14">补料申请单号: {{docNo}}</label></h2>

            <div class="inner-item form-box">
                <div class="form-group">
                    <label>生产班组:</label>
                    <p>{{supplyInfo.header.departmentName}}</p>
                </div>
                <div class="form-group">
                    <label>申请人:</label>
                    <p>{{supplyInfo.header.employeeName}}</p>
                </div>
                <div class="form-group">
                    <label>日期:</label>
                    <p>{{supplyInfo.header.docDate}}</p>
                </div>
                <div class="form-group">
                    <label>生产订单号:</label>
                    <p><span style="color:#008af5;" class="hover" @click="openOrderDetail">{{supplyInfo.header.demandDocNo}}</span></p>
                </div>
            </div>

            <div class="inner-item">
                <table class="inner-table mt-15">
                    <thead>
                    <tr>
                        <th width="30px">序号</th>
                        <th width="15%">货品信息</th>
                        <th width="15%">生产领料单号</th>
                        <th width="10%">仓库</th>
                        <th width="10%">生产用量</th>
                        <th width="10%">申请数量</th>
                        <th width="10%">单位</th>
                        <th width="10%">补料原因</th>
                        <th width="10%">审核结果</th>
                        <th width="15%">备注</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for='item in supplyInfo.dataList'>
                        <td>{{$index + 1}}</td>
                        <td>
                            <div class="show-wrap">
                                <p>编码:{{item.inventoryCode}}</p>
                                <p>名称:{{item.inventoryName}}</p>
                                <p>规格型号:{{item.inventorySpec}}</p>
                            </div>
                        </td>
                        <td>
                            <p>{{item.sourceDocNo}}</p>
                        </td>
                        <td>
                            <p>{{item.warehouseName}}</p>
                        </td>
                        <td>
                            <p>{{item.productQuantity}}</p>
                        </td>
                        <td>
                            <p>{{item.quantity}}</p>
                        </td>
                        <td>
                            <p>{{item.unitName}}</p>
                        </td>
                        <td>
                            <p>{{item.reasonDesc}}</p>
                        </td>
                        <td>
                            <p v-if="supplyInfo.header.hasAudit" :class="{'red':item.audit===2,'green':item.audit===1}">
                                {{item.auditDesc}}</p>
                            <select v-else v-model='item.audit'>
                                <option :value='obj.audit' v-for='obj in auditStatus'>
                                    {{obj.auditDesc}}
                                </option>
                            </select>
                        </td>
                        <td>
                            <p v-if="supplyInfo.header.hasAudit">{{item.remark}}</p>
                            <input v-else type="text" class="check-input" placeholder="备注"
                                   v-model="item.remark">
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <div class="inner-footer">
        <button v-if="!supplyInfo.header.hasAudit" class="btn-xl-def" @click='close'>取消</button>
        <button v-else class="btn-xl-def" @click='close'>关闭</button>
        <button v-if="!supplyInfo.header.hasAudit" class="btn-xl-imp" @click='audit'>确认审核</button>
    </div>

    <!-- 详情内页-->
    <inner :config='detailConfig'>
        <order-detail :order="order" :config='detailConfig'></order-detail>
    </inner>

</template>

<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';
    .hover:hover{
        cursor: pointer;
    }

</style>
