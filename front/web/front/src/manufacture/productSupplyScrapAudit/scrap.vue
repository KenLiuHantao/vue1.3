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
                    "dataList": [],
                },

                auditStatus: [{
                    "audit": 1,
                    "auditDesc": "通过"
                }, {
                    "audit": 2,
                    "auditDesc": "驳回"
                }],

                warehouseList: [],

                auditList: [],

                tipsCfg: {
                    show: false,
                    content: '',
                    type: 'warning'
                },

                revokeCb: true,
            }
        },

        props: ['docNo'],

        components: {},

        ready() {
            this.$http.get(__URL.manufacture + 'production/material/scrap/detail/' + this.docNo).then(
                (res) => {
                    if (res.data.success) {
                        this.scrapInfo = res.data.data;
                        this.getWarehouseList();
                    }
                }
            );

        },

        methods: {

            audit() {
                if (this.revokeCb === false)return;
                this.revokeCb = false;
                this.auditList = [];
                for (let i = 0; i < this.scrapInfo.dataList.length; i++) {
                    let data = {
                        "recordId": "",
                        "audit": 0,
                        "remark": "",
                        "warehouseCode": "",
                        "warehouseName": "",
                        "recordVersion": 0
                    };
                    if (this.scrapInfo.dataList[i].audit === 0) {
                        this.setWarningSuccess("第" + (i + 1) + "条记录未审核！");
                        this.revokeCb = true;
                        return;
                    }
                    data.recordId = this.scrapInfo.dataList[i].recordId;
                    data.audit = this.scrapInfo.dataList[i].audit;
                    data.remark = this.scrapInfo.dataList[i].auditRemark;
                    data.warehouseCode = this.scrapInfo.dataList[i].warehouseCode;
                    for (let j = 0; j < this.warehouseList.length; j++) {
                        if (data.warehouseCode === this.warehouseList[j].code) {
                            data.warehouseName = this.warehouseList[j].name;
                        }
                    }
                    data.recordVersion = this.scrapInfo.dataList[i].recordVersion;
                    this.auditList.push(data);
                }
                this.$http.post(__URL.manufacture + 'production/material/scrap/audit', this.auditList).then(
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

            getWarehouseList(){
                this.$http.get(__URL.manufacture + 'production/material/scrap/warehouse').then(
                    (res) => {
                        if (res.data.success) {
                            this.warehouseList = res.data.data;
                        }
                    },
                    (err) => {
                        console.log('初始化未能拿到仓库数据')
                    }
                )
            },

            setWarningSuccess(data){
                this.tipsCfg.show = true;
                this.tipsCfg.content = data;
                this.tipsCfg.type = "failure";
            },

            close() {
                this.$emit('refresh');
            },
        },
    }


</script>
<template>
    <warning :config="tipsCfg"></warning>
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
                        <th width="10%">审核结果</th>
                        <th width="15%">备注</th>
                        <th width="10%">报废去向</th>
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
                        <td>
                            <p v-if="scrapInfo.header.hasAudit" :class="{'red':item.audit===2,'green':item.audit===1}">
                                {{item.auditDesc}}</p>
                            <select  v-else v-model='item.audit'>
                                <option :value='obj.audit' v-for='obj in auditStatus'>
                                    {{obj.auditDesc}}
                                </option>
                            </select>
                        </td>
                        <td>
                            <p v-if="scrapInfo.header.hasAudit">{{item.auditRemark}}</p>
                            <input v-else type="text" class="check-input" placeholder="备注"
                                   v-model="item.auditRemark">
                        </td>
                        <td>
                            <p v-if="scrapInfo.header.hasAudit && item.audit==1">{{item.warehouseName}}</p>
                            <select v-if="!scrapInfo.header.hasAudit && item.audit != 2" v-model='item.warehouseCode'>
                                <option :value='obj.code' v-for='obj in warehouseList'>
                                    {{obj.name}}
                                </option>
                            </select>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <div class="inner-footer">
        <button v-if="!scrapInfo.header.hasAudit" class="btn-xl-def" @click='close'>取消</button>
        <button v-else class="btn-xl-def" @click='close'>关闭</button>
        <button v-if="!scrapInfo.header.hasAudit" class="btn-xl-imp" @click='audit'>确认审核</button>
    </div>
</template>

<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';

</style>
