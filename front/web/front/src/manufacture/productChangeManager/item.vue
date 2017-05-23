<script>
import treeNode from './treeNode'

export default {
    props: ['order', 'status'],
    components: {
        treeNode
    },
    ready() {
        this.getData()
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
            bomData: {},
            msgCfg: {
                show: false,
                type: 'success',
                content: ''
            },
            recordId:"",
            docNo:"",
            alertCfg:{
                show: false,
                type: 'success',
                content: ''
            },
            lock:false
        }
    },
    methods: {
        getData(){
            this.$http.get(__URL.manufacture + 'order/manager/detail/'+this.order.recordId).then(
                res => {
                    this.bomData = res.data.data;
                    this.setWorkflow(this.bomData.saleInfo.status)
                }
            );

        },
        setWorkflow(point){
            for(var idx=0;idx < point; idx++){
                this.flowCfg.data[idx].flag = true;
            }
        },
        closeItem() {
            this.$emit('cb')
        },
        confirmChange(){
            if(this.lock){
                return

            }
            this.lock = true
            this.$http.post(__URL.manufacture + 'order/manager/confirm/change/'+this.order.recordId).then(
                res => {
                    if(res.data.success){
                        this.$emit('refresh',res.data.data)
                    }else{
                        this.msgCfg.type = 'failure'
                        this.msgCfg.content = res.data.errMsg;
                        this.msgCfg.show = true;
                    }
                    this.lock = false
                }
            );
        },
        hide(){
            this.msgCfg.show = false;
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

            <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
            <div class="inner-item form-box">
                <div class="form-group">
                    <label>货品编码:</label>
                    <p>{{bomData.saleInfo.inventoryCode}}</p>
                </div>
                <div class="form-group">
                    <label>货品名称:</label>
                    <p>{{bomData.saleInfo.inventoryName}}</p>
                </div>
                <div class="form-group">
                    <label>规格:</label>
                    <p>{{bomData.saleInfo.inventorySpec}}</p>
                </div>
                <div class="form-group">
                    <label>原生产数量:</label>
                    <p>{{bomData.saleInfo.quantity}}</p>
                </div>
                <div class="form-group">
                    <label>变更后需求数量:</label>
                    <p>{{bomData.saleInfo.destQuantity}}</p>
                </div>
                <div class="form-group">
                    <label>销售单号:</label>
                    <p>{{bomData.saleInfo.saleDocNo}}</p>
                </div>
                <div class="form-group">
                    <label>客户名称:</label>
                    <p>{{bomData.saleInfo.customerName}}</p>
                </div>
                <div class="form-group">
                    <label>下单日期:</label>
                    <p>{{bomData.saleInfo.docDate}}</p>
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
                        <a class='img_item' v-for='imgitem in bomData.saleInfo.salesOrderAttachment'
                           :href="imgitem.url?imgitem.url:'javascript:;'">
                            {{imgitem.fileName}}
                        </a>
                    </div>
                </div>
            </div>

            <div class="for-treenode">
                <tree-node :material="bomData.treeVos" :status="status"></tree-node>
            </div>
        </div>
    </div>

    <div class="inner-footer">
        <button v-if="order.status==0" class="btn-xl-def" @click='closeItem'>取消</button>
        <button v-else class="btn-xl-def" @click='closeItem'>关闭</button>
        <ajax-button class="btn-xl-imp" @click='confirmChange' v-if="order.status==0">确认变更</ajax-button>
    </div>

    <warning :config='msgCfg'></warning>

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
</style>
