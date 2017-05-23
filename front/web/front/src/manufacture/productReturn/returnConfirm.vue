<script>

    export default{
        data(){
            return {
                returnInfo: {
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

                returnArray:[],
                saveObj:{
                    recordId:'',
                    recordVersion:'',
                    returnQuantity:''
                },
                tipsCfg:{
                    type:'success',
                    show:false,
                    content:''
                },
                lock:false
            }
        },

        props: ['docNo'],
        components: {},
        ready() {
            this.$http.get(__URL.manufacture + 'production/material/return/inner/detail/' + this.docNo).then(
                (res) => {
                    this.returnInfo = res.data.data;
                    for(var idx in this.returnInfo.dataList){
                        this.returnInfo.dataList[idx].returnedQuantity = this.returnInfo.dataList[idx].lastQuantity;
                    }
                }
            )
        },
        methods: {
            close() {
                this.$emit('refresh');
            },
            confirmReturn(){
                if(!this.lock){
                    this.lock = true
                    this.returnArray = []
                    for(let idx in this.returnInfo.dataList){
                        let order = this.returnInfo.dataList[idx];
                        let rowNum = parseInt(idx) + 1;
                        this.saveObj.recordId = order.recordId;
                        this.saveObj.recordVersion = order.recordVersion;
                        this.saveObj.returnQuantity = order.returnedQuantity
                        this.saveObj.rowNum = rowNum;
                        if(order.returnQuantity == ''){
                            this.setWarningSuccess("第"+rowNum+"行退料数量不能为空")
                            this.lock = false
                            return;
                        }
                        if(order.lastQuantity < order.returnQuantity || order.returnQuantity <= 0){
                            this.setWarningSuccess("第"+rowNum+"行退料数量必须小于待退数量")
                            this.lock = false
                            return;
                        }
                        let newObj = JSON.stringify(this.saveObj);
                        this.returnArray.push(JSON.parse(newObj))
                    }
                    this.save()
                }
            },
            save(){
                this.$http.post(__URL.manufacture + 'production/material/return/confirm/quantity',this.returnArray).then(
                    (res) => {
                        if(res.data.success){
                            this.$emit('refresh', res.data.data)
                        }else{
                            this.setWarningSuccess(res.data.errMsg)
                        }
                        this.lock = false
                    }
                )
            },
            setWarningSuccess(data) {
                this.tipsCfg.show = true;
                this.tipsCfg.content = data;
                this.tipsCfg.type = "failure";
            },
        },
    }


</script>
<template>
    <div class="inner-wrapper">
        <div class="inner-content">
            <h2 class="tag two-tag"><label>生产退料信息</label><label class="ft-14">生产退料单号: {{docNo}}</label></h2>

            <div class="inner-item form-box">
                <div class="form-group">
                    <label>生产班组:</label>
                    <p>{{returnInfo.header.departmentName}}</p>
                </div>
                <div class="form-group">
                    <label>申请人:</label>
                    <p>{{returnInfo.header.employeeName}}</p>
                </div>
                <div class="form-group">
                    <label>日期:</label>
                    <p>{{returnInfo.header.docDate}}</p>
                </div>
                <div class="form-group">
                    <label>仓库:</label>
                    <p>{{returnInfo.header.warehouseName}}</p>
                </div>
                <div class="form-group">
                    <label>生产订单号:</label>
                    <p>{{returnInfo.header.demandDocNo}}</p>
                </div>
                <div class="form-group" v-if="returnInfo.header.type != 4">
                    <label>关联单号:</label>
                    <p>{{returnInfo.header.sourceDocNo}}</p>
                </div>
            </div>

            <div class="inner-item">
                <table class="inner-table mt-15">
                    <thead>
                    <tr>
                        <th width="30px">序号</th>
                        <th width="15%">货品信息</th>
                        <th width="15%">生产领料单号</th>
                        <th width="10%">应退数量</th>
                        <th width="10%">实退数量</th>
                        <th width="10%">单位</th>
                        <th width="10%">退料原因</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for='item in returnInfo.dataList'>
                        <td>{{$index + 1}}</td>
                        <td>
                            <div class="show-wrap">
                                <p>编码:{{item.inventoryCode}}</p>
                                <p>名称:{{item.inventoryName}}</p>
                                <p>规格型号:{{item.inventorySpec}}</p>
                            </div>
                        </td>
                        <td>
                            <p>{{item.pickDocNo}}</p>
                        </td>
                        <td>
                            <p>{{item.lastQuantity}}</p>
                        </td>
                        <td>
                            <p> <input-number key="quantity" :code.sync="item.returnedQuantity"></input-number></p>
                        </td>
                        <td>
                            <p>{{item.unitName}}</p>
                        </td>
                        <td>
                            <p>{{item.reasonName}}</p>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <div class="inner-footer">
        <button class="btn-xl-def" @click='close'>取消</button>
        <ajax-button class="btn-xl-imp" @click='confirmReturn'>确认退料</ajax-button>
    </div>

    <warning :config="tipsCfg"></warning>

</template>

<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';

</style>
