<script>

    export default{
        data(){
            return {
                scrapInfo: {
                    "header": {
                        "docNo": "",
                        "sourceDocNo": "",
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
            this.$http.get(__URL.manufacture + 'production/material/scrap/detail/' + this.docNo).then(
                (res) => {
                    this.scrapInfo = res.data.data;
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
            <h2 class="tag two-tag"><label>报废申请信息</label><label class="ft-14">报废申请单号: {{docNo}}</label></h2>

            <div class="inner-item form-box">
                <div class="form-group">
                    <label>生产班组:</label>
                    <p>{{scrapInfo.header.departmentName}}</p>
                </div>
                <div class="form-group">
                    <label>申请人:</label>
                    <p>{{scrapInfo.header.employeeName}}</p>
                </div>
                <div class="form-group">
                    <label>日期:</label>
                    <p>{{scrapInfo.header.docDate}}</p>
                </div>
                <div class="form-group">
                    <label>生产订单号:</label>
                    <p>{{scrapInfo.header.demandDocNo}}</p>
                </div>
                <div class="form-group">
                    <label>关联单号:</label>
                    <p>{{scrapInfo.header.sourceDocNo}}</p>
                </div>
            </div>

            <div class="inner-item">
                <table class="inner-table mt-15">
                    <thead>
                    <tr>
                        <th width="30px">序号</th>
                        <th width="15%">货品信息</th>
                        <th width="10%">应退数量</th>
                        <th width="10%">申请报废</th>
                        <th width="10%">单位</th>
                        <th width="10%">报废原因</th>
                        <th v-if="scrapInfo.header.hasAudit" width="10%">审核结果</th>
                        <th width="10%">备注</th>
                        <th v-if="scrapInfo.header.hasAudit" width="10%">报废去向</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for='item in scrapInfo.dataList'>
                        <td>{{$index + 1}}</td>
                        <td>
                            <div class="show-wrap">
                                <p>编码:{{item.inventoryCode}}</p>
                                <p>名称:{{item.inventoryName}}</p>
                                <p>规格型号:{{item.inventorySpec}}</p>
                            </div>
                        </td>
                        <td>
                            <p>{{item.returnQuantity}}</p>
                        </td>
                        <td>
                            <p>{{item.scrapQuantity}}</p>
                        </td>
                        <td>
                            <p>{{item.unitName}}</p>
                        </td>
                        <td>
                            <p>{{item.reasonDesc}}</p>
                        </td>
                        <td v-if="scrapInfo.header.hasAudit">
                            <p :class="{'red':item.audit===2,'green':item.audit===1}">{{item.auditDesc}}</p>
                        </td>
                        <td>
                            <p v-if="scrapInfo.header.hasAudit">{{item.auditRemark}}</p>
                            <p v-if="!scrapInfo.header.hasAudit">{{item.scrapRemark}}</p>
                        </td>
                        <td v-if="scrapInfo.header.hasAudit">
                            <p>{{item.warehouseName}}</p>
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
