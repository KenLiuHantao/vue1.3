<script>

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
            }
        },

        props: ['docNo'],
        components: {},
        ready() {
            this.$http.get(__URL.manufacture + 'production/material/supply/detail/' + this.docNo).then(
                (res) => {
                    this.supplyInfo = res.data.data;
                    this.isAudit = res.data.data.header.hasAudit;
                }
            )
        },
        methods: {
            close() {
                this.$emit('refresh');
            },
        },
    }


</script>
<template>
    <div class="inner-wrapper">
        <div class="inner-content">
            <h2 class="tag two-tag"><label>补料申请信息</label><label class="ft-14">补料申请单号: {{docNo}}</label></h2>

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
                    <p>{{supplyInfo.header.demandDocNo}}</p>
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
                        <th v-if="supplyInfo.header.hasAudit" width="10%">审核结果</th>
                        <th v-if="supplyInfo.header.hasAudit" width="10%">备注</th>
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
                        <td v-if="supplyInfo.header.hasAudit">
                            <p :class="{'red':item.audit===2,'green':item.audit===1}">{{item.auditDesc}}</p>
                        </td>
                        <td v-if="supplyInfo.header.hasAudit">
                            <p>{{item.remark}}</p>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <div class="inner-footer">
        <button class="btn-xl-def" @click='close'>关闭</button>
    </div>
</template>

<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';

</style>
