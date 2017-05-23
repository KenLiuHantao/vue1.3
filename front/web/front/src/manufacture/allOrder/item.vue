<script>
    import cfg from './cfg.js'
    import productInfo from './productInfo'
    import inboundInfo from './inboundInfo'
    import productStatus from './productStatus'
    import treeNode from './treeNode.js'

    export default {
        props: ['status','productOrder','config'],
        components: {
            productInfo,
            productStatus,
            inboundInfo,
            treeNode
        },
        ready() {
            this.getData();
            this.setWorkflow();
        },
        data() {
            return {
                flowCfg: {
                    data: [{
                        no: '1',
                        name: '生产订单',
                        time: '',
                        flag: true,
                    }, {
                        no: '2',
                        name: '下达',
                        time: '',
                        flag: false,
                    }, {
                        no: '3',
                        name: '领料',
                        time: '',
                        flag: false,
                    }, {
                        no: '4',
                        name: '生产',
                        time: '',
                        flag: false,
                    }, {
                        no: '5',
                        name: '入库',
                        time: '',
                        flag: false,
                    }, {
                        no: '6',
                        name: '完成',
                        time: '',
                        flag: false,
                    }]
                },
                productModCfg:{
                    show: false,
                    width: '350px',
                    height: 'auto',
                    header: '下达生产',
                    btn: [{
                        name: '取消',
                        emit: 'close',
                    }, {
                        name: '确定',
                        emit: 'sure',
                    }],
                },
                createProductTaskReq:{
                    docNo:'',
                    releasedNum:''
                },
                msgCfg: {
                    show: false,
                    type: 'success',
                    content: ''
                },
                productDetailModalCfg:{
                    show: false,
                    width: '680px',
                    height: 'auto',
                    header: '生产订单状态'
                },
                inboundDetailModalCfg:{
                    show: false,
                    width: '680px',
                    height: 'auto',
                    header: '成品入库详情'
                },
                // modal 中箭头的 top值是否改变
                arrowTopFlag: false,
                //表体数据
                bomData:{
                    saleInfo: {
                        customerName: "",
                        deliveryDate: "",
                        demandDocNo: "",
                        destQuantity: "",
                        docDate: "",
                        employeeName: "",
                        inventoryCode: "",
                        inventoryId: "",
                        inventoryName: "",
                        inventorySpec: "",
                        quantity: "",
                        recordId: "",
                        saleDocNo: "",
                        readyQuantity:"",
                        saleInventoryWaitQuantity: '',
                        salesOrderAttachment: [],
                        customerContractAttachment: []
                    },
                    treeVos: [],
                    lock:false

                }
            }
        },
        methods: {
            getData(){
                let url = '';
                if(this.status == 0){
                    url = __URL.manufacture + 'productOrder/detailInfo/'+this.productOrder.demandDocNo;
                }else{
                    url = __URL.manufacture + 'productOrder/detailInfo/task/'+this.productOrder.docNo;
                    this.$http.get(__URL.manufacture + 'workflow/find/list/'+ this.productOrder.recordId).then(
                        (resp) => {
                            this.flowCfg.data = resp.data.data.dataList
                        }
                    )
                }
                this.$http.get(url).then(
                    res => {
                        this.bomData = res.data.data;
                        if(this.status == 0){
                            this.setWorkflow(this.bomData.saleInfo.status)
                        }
                    }
                );

            },
            setWorkflow(point){
                for(var idx=0;idx < point; idx++){
                    this.flowCfg.data[idx].flag = true;
                }
            },
            cancel() {
                this.$emit('refresh')
            },
            toProduct(){
                this.productOrder.sureProductQuantity = "";
                this.productModCfg.show = true
            },
            sureProduct(){
                if(!this.lock){
                    this.lock = true
                    if(parseFloat(this.productOrder.sureProductQuantity) >  parseFloat(this.productOrder.readyQuantity)){
                        this.errTips("本次下达数量不能超过齐料数量","failure")
                        this.lock = false;
                        return
                    }
                    if(parseFloat(this.productOrder.sureProductQuantity) >  parseFloat(this.productOrder.waitProductQuantity)){
                        this.errTips("本次下达数量不能超过待排产数量","failure")
                        this.lock = false
                        return;
                    }
                    this.createProductTaskReq.docNo = this.productOrder.demandDocNo
                    this.createProductTaskReq.releasedNum = this.productOrder.sureProductQuantity
                    this.$http.post(__URL.manufacture + 'productOrder/create/task',  this.createProductTaskReq).then(
                        res => {
                            if (res.data.success) {
                                this.productOrder.waitProductQuantity = this.productOrder.waitProductQuantity - this.productOrder.sureProductQuantity;
                                this.productOrder.readyQuantity = this.productOrder.readyQuantity - this.productOrder.sureProductQuantity;
                                this.productModCfg.show = false
                                this.errTips( '成功下达生产','success')

                            } else {
                                this.errTips(res.data.errMsg,"failure")
                            }
                            this.lock = false;
                        })
                }
            },
            cancelProduct(){
                this.productModCfg.show = false
            },
            closeInboundDetailModalDialog(){
                this.inboundDetailModalCfg.show = false;
            },
            closeProductDetailModalDialog(){
                this.productDetailModalCfg.show = false;
            },
            getProductStatus(){
                this.productDetailModalCfg.show = true;
            },
            getProductInboundInfo(){
                this.inboundDetailModalCfg.show = true;
            },
            errTips(msg, type){
                this.msgCfg.type = type
                this.msgCfg.content = msg
                this.msgCfg.show = true
            },
            closeInner(){
                this.$emit('refresh')
            }
        },
        computed: {

        }
    }


</script>
<template>
    <div class="inner-wrapper">
        <workflow :config='flowCfg'></workflow>
        <div class="inner-content">

            <!--<h2 class="tag">生产订单信息</h2>-->
            <h2 class="tag two-tag"><label>生产订单信息</label><label
                    class="ft-14">生产订单号:{{bomData.saleInfo.demandDocNo}}</label></h2>
            <div class="block">
                <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
                <div class="inner-item form-box">
                    <div class="form-group">
                        <label>货品编码:</label>
                        <p>{{bomData.saleInfo.inventoryCode}}</p>
                    </div>
                    <div class="form-group">
                        <label>生产数量:</label>
                        <p>{{bomData.saleInfo.quantity}}</p>
                    </div>
                    <div class="form-group">
                        <label>销售单号:</label>
                        <p>{{bomData.saleInfo.saleDocNo}}</p>
                    </div>
                    <div class="form-group">
                        <label>货品名称:</label>
                        <p>{{bomData.saleInfo.inventoryName}}</p>
                    </div>
                    <div class="form-group">
                        <label>下单日期:</label>
                        <p>{{bomData.saleInfo.docDate}}</p>
                    </div>
                    <div class="form-group">
                        <label>客户名称:</label>
                        <p>{{bomData.saleInfo.customerName}}</p>
                    </div>
                    <div class="form-group">
                        <label>规格:</label>
                        <p>{{bomData.saleInfo.inventorySpec}}</p>
                    </div>
                    <div class="form-group">
                        <label>客户交期:</label>
                        <p>{{bomData.saleInfo.deliveryDate}}</p>
                    </div>
                    <div class="form-group">
                        <label>业务员:</label>
                        <p>{{bomData.saleInfo.employeeName}}</p>
                    </div>
                </div>

                <div class="inner-item mt-15">
                    <div class="form-group wd-100">
                        <label>附件:</label>
                        <div class='annexBox'>
                            <upfile-group :data='bomData.saleInfo.salesOrderAttachment' :edit="false"></upfile-group>
                        </div>
                    </div>
                </div>
                <div class="for-treenode">
                    <tree-node :material="bomData.treeVos" :status="status"></tree-node>
                </div>
            </div>
        </div>
    </div>

    <div class="inner-footer">

        <slot v-if="productOrder.readyQuantity > 0 && productOrder.waitProductQuantity > 0">
            <button class="btn-xl-def" @click='cancel'>取消</button>
            <ajax-button class="btn-xl-imp" @click='toProduct' v-if="status==0">下达生产</ajax-button>
        </slot>
        <slot v-else>
            <button class="btn-xl-def" @click='closeInner'>关闭</button>
        </slot>
        <button class="btn-xl-imp" @click='getProductStatus' v-if="status==1">查看状态</button>
        <button class="btn-xl-imp" @click='getProductInboundInfo' v-if="status==2">查看入库详情</button>
    </div>

    <warning :config='msgCfg'></warning>

    <modal :config='productModCfg' @sure='sureProduct' @close='cancelProduct'>
        <product-info :detail.sync='productOrder'></product-info>
    </modal>

    <!--入库详情-->
    <modal :config.sync='inboundDetailModalCfg' @close='closeInboundDetailModalDialog'>
        <inbound-info :record-id="productOrder.recordId"></inbound-info>
    </modal>

    <!-- 生产详情弹窗 -->
    <modal :config.sync='productDetailModalCfg' @close='closeProductDetailModalDialog'>
        <product-status :doc-no="productOrder.docNo"></product-status>
    </modal>
</template>

<style lang='less'>
    @import '../../../../../public/css/variable.less';

    .for-treenode {
        .bomTree {
            margin-top: 20px;
        }
        .table-ul {
            width: 100%;
        }
        .table-ul > li.head {
            padding: 0 15px;
            background-color: #EBF7FD;
            border-left: 2px solid #008af5;
            color: #37474f;
            height: 47px;
        }
        .table-ul li {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            -ms-flex-wrap: nowrap;
            flex-wrap: wrap;
            /*height: 46px;*/
            border-bottom: 1px solid #F2F3F3;
            font-size: 12px;
            color: #757575;
        }
        .table-ul .head {
            height: 33px;
        }
        .table-ul > li.bodyHead {
            height: 33px;
        }
        .table-ul > li.bodyCnt {
            min-height: 76px;
            color: #C2C2C2;
            padding: 0 0 0 20px;
        }
        .table-ul > li .ser {
            width: 53px;
            position: relative;
        }
        .wd1 {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -ms-flex-wrap: wrap;
            flex-wrap: wrap;
            width: 15%;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            justify-content: center;
            padding: 15px 0;
            position: relative;
        }
        .wd1 > * {
            width: 100%;
            margin: 5px 0;
            text-align: center;
        }
        .process-name {
            font-size: 12px;
        }
        .icon-select_caret:after {
            display: inline-block;
            -webkit-transform: rotate(-90deg);
            transform: rotate(-90deg);
            -webkit-transition: all .2s linear;
            transition: all .2s linear;
            color: #757575;
            cursor: pointer;
        }
        .open:after {
            color: #008af5 !important;
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
        }
        .open:before {
            content: '';
            display: inline-block;
            position: absolute;
            width: 10px;
            height: 40px;
            background-color: transparent;
            border-left: 1px solid #7ED321;
            border-bottom: 1px solid #7ED321;
            top: 45px;
            left: -10px;
        }
    }
    .bodyCnt {
        color: #212121 !important;
    }
</style>
