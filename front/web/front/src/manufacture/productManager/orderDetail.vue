<script>
    import productAdditional from './productAdditional'
    import productReturn from './productReturn'
    import createRegister from './createRegister'
    import registerDetail from './registerDetail'
    import redirectDetail from './redirectDetail'
    import inboundDetail from './inboundDetail'

    export default{
        data(){
            return{
                orders:{
                    "header" : {
                      "productTaskDocNo" : "",
                      "inventoryCode" : "",
                      "inventoryName" : "",
                      "inventorySpec" : "",
                      "productTaskQty" : "",
                      "productDocDate" : "",
                      "saleDocNo" : "",
                      "deliveryDate":"",
                      "customerName" : "",
                      "saleEmployeeName" : "",
                      "processName":"",
                      "departmentName":"",
                      "employeeName":"",
                      "processProductQty":""
                    },
                    "dataList" : [
                        {
                            "materialInventoryCode":"",
                            "materialInventoryName":"",
                            "materialInventorySpec":"",
                            "unitName":"",
                            "perUsageQty":"",
                            "orderUsageQty":"",
                            "wasteRate":"",
                            "productUsageQty":"",
                            "pickedQty":""
                        }
                    ]
                },
                flowCfg:{
                    data:[

                    ]
                },
                addAdditionModalCfg:{
                    show: false,
                    title: "补料申请单"
                },
                addReturnModalCfg:{
                    show: false,
                    title: "新增报退",
                },
                tipsCfg:{
                    type:'success',
                    show:false,
                    content:''
                },
                taskId:'',
                checked:"",
                inventories:[],
                registerDetail:{
                    "taskId":"",
                    "departmentName":"",
                    "processName":"",
                    "productionQuantity":0,
                    "waitRegisterQuantity":0,
                    "createTime":"",
                    "quantity":0,
                    "userName":"",
                    "registerTotalQuantity":0
                },
                addRegisterModalCfg: {
                    show: false,
                    width: '680px',
                    height: 'auto',
                    header: '生产订单登记数量',
                    btn: [{
                        name: '取消',
                        emit: 'close',
                    }, {
                        name: '确定',
                        emit: 'sure',
                    }]
                },
                registerDetailModalCfg: {
                    show: false,
                    width: '680px',
                    height: 'auto',
                    header: '生产订单登记详情'
                },
                inboundDetailModalCfg:{
                    show: false,
                    width: '680px',
                    height: 'auto',
                    header: '查看成品入库详情'
                },
                redirectDetailModalCfg:{
                    show: false,
                    width: '680px',
                    height: 'auto',
                    header: '查看生产订单状态'
                },
                redirectObj:{
                    productQuantity:'0',
                    completeQuantity:'0',
                    redirectQuantity:'0',
                    redirectedQuantity:'0'
                },
                repeatSubmit:false
            }
        },
        props:['order','detailconfig'],
        components:{
            productAdditional,
            productReturn,
            registerDetail,
            createRegister,
            redirectDetail,
            inboundDetail
        },
        ready() {
            this.taskId = this.order.recordId;
            this.getData();
        },
        methods:{
            getData(){
                //获取详情信息
                this.$http.get(__URL.manufacture + 'product/task/detail/'+ this.order.recordId).then(
                    (res) => {
                        this.orders = res.data.data;
                    }
                )
                this.$http.get(__URL.manufacture + 'workflow/find/list/'+ this.order.recordId).then(
                    (resp) => {
                        this.flowCfg.data = resp.data.data.dataList
                    }
                )

            },
            multiOperate(){
                if(this.order.operate == '确认生产'){
                    this.sureProduce();
                }else if(this.order.operate == '待流转' || this.order.operate == '已流转' ){
                    this.redirectDetailModalCfg.show = true;
                }else if(this.order.operate == '待入库' || this.order.operate == '已入库' ){
                    this.inboundDetailModalCfg.show = true;
                }
            },
            sureProduce(){
                if(!this.repeatSubmit){
                    this.repeatSubmit = true;
                    this.$http.post(__URL.manufacture + 'production/manager/start/product',{'recordId':this.order.recordId,'recordVersion':this.order.recordVersion}).then(
                        (res) => {
                            if(res.data.success){
                                 this.tipsCfg.show = true;
                                 this.tipsCfg.content = res.data.data;
                                 this.close("下达成功")
                            }else{
                                this.errTips(res.data.errMsg)
                            }
                            this.repeatSubmit = false;
                        }
                    );
                }
            },
            createAddition(){
                if(this.inventories.length == 0){
                   this.tipsCfg.show = true;
                   this.tipsCfg.type = 'failure';
                    this.tipsCfg.content = '未选择货品';
                    return;
                }
                this.addAdditionModalCfg.show=true;
            },
            createReturn(){
                if(this.inventories.length == 0){
                    this.tipsCfg.show = true;
                    this.tipsCfg.type = 'failure';
                    this.tipsCfg.content = '未选择货品';
                    return;
                }
                this.addReturnModalCfg.show=true;
            },
            checkAll: function() {
                var _this = this;
                console.log(_this.inventories);
                if (this.checked) {//实现反选
                    _this.inventories = [];
                }else{//实现全选
                    _this.inventories = [];
                    this.orders.dataList.forEach(function(item) {
                        _this.inventories.push(item.materialInventoryId);
                    });
                }
            },
            close(tips){
                this.$emit('refresh',tips)
            },
            createRegister(){
                if(!this.repeatSubmit){
                    this.repeatSubmit = true;
                    this.$http.get(__URL.manufacture + 'production/manager/go/register/' + this.order.taskId).then(
                        (res) => {
                            if(res.data.success){
                                var detail = res.data.data;
                                if(detail.waitRegisterQuantity <= 0){
                                    this.tipsCfg.type = "success";
                                    this.tipsCfg.show = true;
                                    this.tipsCfg.content = '当前生产单已经登记完成,无需再登数';
                                }else{
                                    this.registerDetail = detail;
                                    this.addRegisterModalCfg.show = true;
                                }
                            }else{
                                this.errTips(res.data.errMsg);
                            }
                            this.repeatSubmit = false;
                        }
                    );
                }
            },
            saveRegister(){
                if(this.repeatSubmit)return;
                this.repeatSubmit = true;
                this.$http.post(__URL.manufacture + 'production/manager/saveProductionRegister', this.registerDetail).then(
                    (res) => {
                        if(res.data.success){
                            this.tipsCfg.type = "success";
                            this.tipsCfg.show = true;
                            this.tipsCfg.content = res.data.data;
                            this.closeCreateRegisterModalDialog();
                            this.close('登数成功')
                        }else{
                            this.errTips(res.data.errMsg);
                        }
                        this.repeatSubmit = false;
                    }
                )
            },
            viewStatus(){
                //入库
                if(this.order.operate== '入库'){
                    this.openInboundDetail()
                }else if(this.order.operate== '流转'){
                //流转
                    this.openRedirectDetail()
                }
            },
            closeCreateRegisterModalDialog() {
                this.addRegisterModalCfg.show = false;
            },
            openInboundDetail(){
                this.inboundDetailModalCfg.show = true;
            },
            openRegisterDetail(){
                this.registerDetailModalCfg.show = true;
            },
            closeRegisterDetailModalDialog() {
                this.registerDetailModalCfg.show = false;
            },
            closeInboundDetailModalDialog(){
                this.inboundDetailModalCfg.show = false;
            },
            openRedirectDetail(){
                this.redirectDetailModalCfg.show = true;
            },
            closeRedirectDetailModalDialog(){
                this.redirectDetailModalCfg.show = false;
            },
            errTips(msg){
                this.tipsCfg.type = "failure";
                this.tipsCfg.show = true;
                this.tipsCfg.content = msg;
            }
        },
        watch: {
            'inventories': {
                  handler: function (val, oldVal) {
                      if (this.inventories.length === this.orders.dataList.length) {
                        this.checked=true;
                      }else{
                        this.checked=false;
                      }
                  },
                  deep: true
            }
        },
    }




</script>
<template>
    <div class="inner-wrapper">
        <workflow :config="flowCfg"></workflow>
        <div class="inner-content">
            <h2 class="tag two-tag"><label>生产订单信息</label><label class="ft-14">生产单号:{{order.docNo}}</label></h2>
            <div class="block">
                <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
                <div class="inner-item form-box">
                    <div class="form-group">
                        <label>货品编码:</label>
                        <p class="orderData">{{orders.header.inventoryCode}}</p>
                    </div>
                    <div class="form-group">
                        <label>生产数量:</label>
                        <p class="orderData">{{orders.header.processProductQty}}</p>
                    </div>
                    <div class="form-group">
                        <label>销售单号:</label>
                        <p class="orderData">{{orders.header.saleDocNo}}</p>
                    </div>
                    <div class="form-group">
                        <label>货品名称:</label>
                        <p class="orderData">{{orders.header.inventoryName}}</p>
                    </div>
                    <div class="form-group">
                        <label>下单日期:</label>
                        <p class="orderData">{{orders.header.saleDocDate}}</p>
                    </div>
                    <div class="form-group">
                        <label>客户名称:</label>
                        <p class="orderData">{{orders.header.customerName}}</p>
                    </div>
                    <div class="form-group">
                        <label>规格型号:</label>
                        <p class="orderData">{{orders.header.inventorySpec}}</p>
                    </div>
                    <div class="form-group">
                        <label>客户交期:</label>
                        <p class="orderData">{{orders.header.deliveryDate}}</p>
                    </div>
                    <div class="form-group">
                        <label>业务员:</label>
                        <p class="orderData">{{orders.header.saleEmployeeName}}</p>
                    </div>
                </div>

                <div class="inner-item mt-15">
                    <div class="form-group wd-100">
                        <label>附件:</label>
                        <div class="attachment">
                            <a class='img_item' v-for='imgitem in orders.header.attachments' href="javascript:;">
                                {{imgitem.fileName}}
                            </a>
                        </div>
                    </div>
                </div>

                <div class="bomTree">
                    <div class="table-title">
                        <span>
                            <label>{{orders.header.processName}}</label>
                        </span>
                        <span>
                            <label>生产车间:</label><label>{{orders.header.departmentName}}</label>
                        </span>

                        <span>
                            <label>生产负责人:</label><label>{{orders.header.employeeName}}</label>
                        </span>
                    </div>

                    <div class="inner-item">

                        <table class="inner-table">
                            <thead>
                            <tr>
                                <th width="30px" v-if="order.tabIndex ==1">序号</th>
                                <th width="30px" v-if="order.tabIndex > 1"><input type="checkbox" v-model="checked"
                                                                                  @click='checkAll'/></th>
                                <th width="15%">货品信息</th>
                                <th width="15%">单位</th>
                                <th width="10%">单位用量</th>
                                <th width="10%">订单用量</th>
                                <th width="10%">损耗率(%)</th>
                                <th width="10%">生产用量</th>
                                <th width="15%">领料数量</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for='item in orders.dataList'>
                                <td v-if="order.tabIndex ==1">{{$index + 1}}</td>
                                <td v-if="order.tabIndex > 1"><input type="checkbox" v-model="inventories"
                                                                     :value="item.materialInventoryId"/></td>
                                <td>
                                    <div class="show-wrap">
                                        <p>{{item.materialInventoryCode}}:{{item.materialInventoryName}}</p>
                                        <p>{{item.materialAttributeName}}/{{item.materialInventorySpec}}</p>
                                    </div>
                                </td>
                                <td>
                                    <div class="show-wrap">
                                        <p>{{item.unitName}}</p>
                                    </div>
                                </td>
                                <td>
                                    <div class="show-wrap">
                                        <p>{{item.perUsageQty}}</p>
                                    </div>
                                </td>
                                <td>
                                    <div class="show-wrap">
                                        <p>{{item.orderUsageQty}}</p>
                                    </div>
                                </td>
                                <td>
                                    <div class="show-wrap">
                                        <p>{{item.wasteRate}}</p>
                                    </div>
                                </td>
                                <td>
                                    <div class="show-wrap">
                                        <p>{{item.productUsageQty}}</p>
                                    </div>
                                </td>
                                <td>
                                    <div class="show-wrap">
                                        <p>{{item.pickedQty}}</p>
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="inner-footer">
        <button v-if="order.tabIndex == 2" @click='close("")' class="btn-xl-def">取消</button>
        <button v-else @click='close("")' class="btn-xl-def">关闭</button>
        <ajax-button class="btn-xl-imp" @click='multiOperate'
                v-if="order.operate && order.operate == '确认生产' && order.tabIndex != 2">{{order.operate}}
        </ajax-button>
        <ajax-button class="btn-xl-imp" @click='createRegister' v-if="order.tabIndex == 2">登数</ajax-button>
        <button class="btn-xl-imp" @click='openRegisterDetail' v-if="order.tabIndex == 2">登数详情</button>
        <ajax-button class="btn-xl-imp" @click='createAddition' v-if="order.tabIndex == 2"
                :disabled="inventories.length == 0">申请补料
        </ajax-button>
        <ajax-button class="btn-xl-imp" @click='createReturn' v-if="order.tabIndex == 3" :disabled="inventories.length == 0">
            报退
        </ajax-button>
        <button class="btn-xl-imp" @click='viewStatus' v-if="order.tabIndex == 3">
            查看状态
        </button>
    </div>

    <!--退料新增-->
    <inner :config='addReturnModalCfg'>
        <product-return :task-id="taskId" :inventories='inventories' :innercfg.sync="addReturnModalCfg"
                        @refresh="close"></product-return>
    </inner>

    <!--补料新增-->
    <inner :config='addAdditionModalCfg'>
        <product-additional :task-id="taskId" :inventories='inventories' :innercfg.sync="addAdditionModalCfg"
                            @refresh="close"></product-additional>
    </inner>

    <!--登数弹窗-->
    <modal :config='addRegisterModalCfg' @sure='saveRegister' @close='closeCreateRegisterModalDialog'>
        <create-register :detail.sync='registerDetail'></create-register>
    </modal>

    <!--登数详情-->
    <modal :config='registerDetailModalCfg' @close='closeRegisterDetailModalDialog'>
        <register-detail :task-id.sync='order.taskId'></register-detail>
    </modal>


    <!--流转详情-->
    <modal :config='redirectDetailModalCfg' @close='closeRedirectDetailModalDialog'>
        <redirect-detail :task-id.sync='order.taskId'></redirect-detail>
    </modal>

    <!--入库详情-->
    <modal :config='inboundDetailModalCfg' @close='closeInboundDetailModalDialog'>
        <inbound-detail :task-id.sync='order.taskId'></inbound-detail>
    </modal>

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

    .bomTree {
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