
<script>
   export default{
        data(){
            return{
                dataList: [
                 {
                    "audit": 0,
                    "auditDesc": "",
                    "inventoryCode": "",
                    "inventoryId": "",
                    "inventoryName": "",
                    "inventorySpec": "",
                    "productQuantity": 0,
                    "quantity": 0,
                    "reason": 0,
                    "reasonDesc": "",
                    "recordId": "",
                    "recordVersion": 0,
                    "remark": "",
                    "sourceDocNo": "",
                    "sourceId": "",
                    "unitCode": "",
                    "unitName": "",
                    "warehouseCode": "",
                    "warehouseName": ""
                 }
                ],
                header: {
                  "applyDate": "",
                  "demandDocNo": "",
                  "demandId": "",
                  "departmentCode": "",
                  "departmentName": "",
                  "departmentPy": "",
                  "docDate": "2017-04-21",
                  "docNo": "",
                  "employeeCode": "",
                  "employeeName": "",
                  "hasAudit": false,
                  "processCode": "",
                  "processName": "",
                  "processSort": 0
                },
                allReasons:[],
                params:{
                    taskRecordId:'',
                    inventoryIds:[]
                },
                orders:{
                    dataList:[],
                    header:{}
                },
                lock: false,
                tipsCfg:{
                    type:'success',
                    show:false,
                    content:''
                },
            }
        },
        props:['taskId','inventories','innercfg'],
        components:{
        },
        ready(){
            this.params.taskRecordId = this.taskId;
            this.params.inventoryIds = this.inventories;
            this.getData();
        },
        methods:{
            getData(){
                this.$http.post(__URL.manufacture + 'production/material/supply/apply',this.params).then(
                    (res) => {
                        if(res.data.success){
                             this.header = res.data.data.header;
                             this.dataList = res.data.data.dataList;

                        }
                    }
                );
                 this.$http.get(__URL.manufacture + 'production/supply/reason').then(
                    (res) => {
                        if(res.data.success){
                             this.allReasons = res.data.data.dataList;
                        }
                    }
                );
            },
            doSupply(){
               if(!this.lock){
                    this.lock = true
                    this.orders.dataList = this.dataList;
                    this.orders.header = this.header;
                    for(let idx in this.dataList){
                        let rowNum = parseInt(idx) + 1
                        this.dataList[idx].rowNum = rowNum;
                        if(this.dataList[idx].reason == ''){
                            this.setWarningSuccess("第" + rowNum + "行没有选择补料原因。")
                            this.lock = false
                            return
                        }
                    }
                    this.$http.post(__URL.manufacture + 'production/material/supply/create',this.orders).then(
                        (res) => {
                            if (res.data.success) {
                                this.$emit('refresh', res.data.data)
                            } else {
                                this.setWarningSuccess(res.data.errMsg)
                            }
                            this.lock = false
                        }
                    );
                }
            },

            setWarningSuccess(data) {
                this.tipsCfg.show = true;
                this.tipsCfg.content = data;
                this.tipsCfg.type = "failure";
            },

            close(){
                this.innercfg.show = false
            }
        }
    }

</script>
<template>
    <div class="inner-wrapper">
        <div class="inner-content">
            <h2 class="tag two-tag"><label>补料申请信息</label></h2>
            <div class="block">
                <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
                <div class="inner-item form-box">
                    <div class="form-group">
                        <label>生产班组:</label>
                        <p class="orderData">{{header.departmentName}}</p>
                    </div>
                    <div class="form-group">
                        <label>申请人:</label>
                        <p class="orderData">{{header.employeeName}}</p>
                    </div>
                    <div class="form-group">
                        <label>日期:</label>
                        <p class="orderData">{{header.applyDate}}</p>
                    </div>
                    <div class="form-group">
                        <label>生产订单号:</label>
                        <p class="orderData">{{header.demandDocNo}}</p>
                    </div>
                </div>

                <div class="inner-item">
                    <table class="inner-table">
                        <thead>
                        <tr>
                            <th width="30px">序号</th>
                            <th width="15%">货品信息</th>
                            <th width="15%">生产领料单号</th>
                            <th width="10%">仓库</th>
                            <th width="10%">生产用量</th>
                            <th width="10%">申请补料</th>
                            <th width="10%">单位</th>
                            <th width="10%">补料原因</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for='item in dataList'>
                            <td>{{$index + 1}}</td>
                            <td>
                                <div class="show-wrap">
                                    <p>编码:{{item.inventoryCode}}</p>
                                    <p>名称:{{item.inventoryName}}</p>
                                    <p>规格型号:{{item.inventorySpec}}</p>
                                </div>
                            </td>
                            <td>
                                <div class="show-wrap">
                                    <p>{{item.sourceDocNo}}</p>
                                </div>
                            </td>
                            <td>
                                <div class="show-wrap">
                                    <p>{{item.warehouseName}}</p>
                                </div>
                            </td>
                            <td>
                                <div class="show-wrap">
                                    <p>{{item.productQuantity}}</p>
                                </div>
                            </td>
                            <td>
                                <div class="show-wrap">
                                    <p><input-number :code.sync="item.quantity" key="quantity"></input-number></p>
                                </div>
                            </td>
                            <td>
                                <div class="show-wrap">
                                    <p>{{item.unitName}}</p>
                                </div>
                            </td>
                            <td>
                                <div class="show-wrap">
                                    <select v-model='item.reason'>
                                        <option value="" disabled selected style="display: none;">请选择原因</option>
                                        <option :value='itm.no' v-for='itm in allReasons'>{{itm.name}}
                                        </option>
                                    </select>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <div class="inner-footer">
        <button @click='close' class="btn-xl-def">取消</button>
        <ajax-button class="btn-xl-imp" @click='doSupply'>提交补料申请</ajax-button>
    </div>

    <warning :config="tipsCfg"></warning>

</template>

<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';


    .table-title {
        font-size: 16px;
        font-weight: normal;
        height: 50px;
        line-height: 50px;
        background: #fafafa;
        margin-bottom: -5px;
        box-sizing: border-box;
        overflow: hidden;
        position: relative;
        span {
            margin-left: 20px;
            padding-right: 100px;
            label {
                padding-right: 10px;
            }
        }
    }
    .bomTree{
        @gray: #f2f3f3;
        margin-top: 20px;

        .table-title {
            border-top: 1px solid @gray;

            span:nth-of-type(n+2) {
                position: relative;
                top: -2px;
                color: #37474f;
                font-size: 12px;
            }
        }

        .inner-item {
            padding: 0;
            border-bottom: none;
        }

        .inner-table {

            thead {
                border: none;
                border-top: 1px solid @gray;
            }

            th {
                background-color: #fff;
                color: #757575;
            }

            td {
                border-left: none;
                border-right: none;

                .show-wrap {
                    align-items: center;
                }
            }
        }
    }
</style>