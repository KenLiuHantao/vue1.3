<script>
import bom from 'nb/treeTable/app'
import cfg from './cfg.js'

export default {
    components: {
        bom
    },
    props: ['docno','workflow'],
    ready() {
         //   this.itemData = Object.assign({}, this.data)
         this.$http.get(__URL.manufacture + 'productOrder/productOrderDetailInfo/' + this.docno).then(res => {
            if (res.data.success) {
                this.currentItem = res.data.data;
                this.itemData = res.data.data;
              //  this.getOrderInfo();
                this.getBomDat();
                this.genWorkFlow();
            }
        });
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
                    name: '待下达',
                    time: '',
                    flag: false,
                }, {
                    no: '3',
                    name: '待领料',
                    time: '',
                    flag: false,
                }, {
                    no: '4',
                    name: '待生产',
                    time: '',
                    flag: false,
                }, {
                    no: '5',
                    name: '待入库',
                    time: '',
                    flag: false,
                }, {
                    no: '6',
                    name: '完成',
                    time: '',
                    flag: false,
                }]
            },
            flowCfgArray:[
               {
                 no:1,
                 name1:"生产订单",
                 name2:"生产订单"
               },
               {
                 no:2,
                 name1:"待下达",
                 name2:"已下达"
               },
               {
                 no:3,
                 name1:"待领料",
                 name2:"已领料"
               },
               {
                 no:4,
                 name1:"待生产",
                 name2:"已生产"
               },
              {
                 no:5,
                 name1:"待入库",
                 name2:"已入库"
               },
               {
                 no:6,
                 name1:"完成",
                 name2:"完成"
               },
            ],
             msgCfg: {
                show: false,
                type: 'success',
                content: ''
            },
            itemData: {},
            bomData: {},
            currentItem: {
                saleRecordId: '',
                productInventoryBomDocNo: ''
            }
        }
    },
    methods: {
        close() {
            this.$emit('close');
        },
        /**
         getOrderInfo() {
            this.$http.get(__URL.manufacture + 'productOrder/detailInfo/' + this.currentItem.recordId).then(res => {
                if (res.data.success) {
                    this.itemData = res.data.data
                }
            });
        },
        **/
        getBomDat() {
            this.$http.get(__URL.dev + 'order/bom/get/' + this.currentItem.saleBomDocNo).then(res => {
                this.bomData = res.data.data
            });
        },
        createTask() {
            let recordIdList = []
            recordIdList.push(this.currentItem.docNo)
            this.$http.post(__URL.manufacture + 'productOrder/create/task', recordIdList).then(
                res => {
                    if (res.data.success) {
                        this.msgCfg.type = 'success'
                        this.msgCfg.content = '成功下达生产'
                    } else {
                        this.msgCfg.type = 'failure'
                        this.msgCfg.content = res.data.errMsg
                    }
                    this.msgCfg.show = true
                }
            )
        },
        genWorkFlow(){
            if(this.workflow.no > 0 && this.workflow.no <= 6){
                for(let idx = 0; idx < this.workflow.no - 1;idx++){
                    this.flowCfg.data[idx].flag = true;
                    this.flowCfg.data[idx].name = this.flowCfgArray[idx].name2;
                }
                if(this.workflow.name == '已入库'){
                    this.flowCfg.data[this.workflow.no].flag = true;
                }
                this.flowCfg.data[this.workflow.no - 1].flag = true;
                this.flowCfg.data[this.workflow.no - 1].name = this.workflow.name;
            }
        }
    }
}
</script>
<template>
    <div class="inner-wrapper">
        <workflow :config='flowCfg'></workflow>
        <div class="inner-content">
            <h2 class="tag">生产订单信息</h2>
                <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
                <div class="inner-item form-box">
                    <div class="form-group">
                        <label>货品编码:</label>
                        <p>{{itemData.inventoryCode}}</p>
                    </div>
                    <div class="form-group">
                        <label>生产数量:</label>
                        <p>{{itemData.quantity}}</p>
                    </div>
                    <div class="form-group">
                        <label>销售单号:</label>
                        <p>{{itemData.saleDocNo}}</p>
                    </div>
                    <div class="form-group">
                        <label>货品名称:</label>
                        <p>{{itemData.inventoryName}}</p>
                    </div>
                    <div class="form-group">
                        <label>下单日期:</label>
                        <p>{{itemData.docDate}}</p>
                    </div>
                    <div class="form-group">
                        <label>客户名称:</label>
                        <p>{{itemData.customerName}}</p>
                    </div>
                    <div class="form-group">
                        <label>规格:</label>
                        <p>{{itemData.inventorySpec}}</p>
                    </div>
                    <div class="form-group">
                        <label>客户交期:</label>
                        <p>{{itemData.deliveryDate}}</p>
                    </div>
                    <div class="form-group">
                        <label>业务员:</label>
                        <p>{{itemData.employeeName}}</p>
                    </div>
                </div>

                <div class="inner-item mt-15">
                    <div class="form-group wd-100">
                        <label>上传附件:</label>
                        <div class='annexBox'>
                            <a class='img_item' v-for='imgitem in itemData.salesOrderAttachment' :href="imgitem.url?imgitem.url:'javascript:;'">
                                {{imgitem.fileName}}
                            </a>
                        </div>
                    </div>
                    <div class="form-group wd-100">
                        <label>上传图片:</label>
                        <div class='annexBox'>
                            <a class='img_item' v-for='imgitem in itemData.customerContractAttachment' :href="imgitem.url?imgitem.url:'javascript:;'">
                                {{imgitem.fileName}}
                            </a>
                        </div>
                    </div>
                </div>

                <div class="inner-item">
                    <bom :data='bomData'></bom>
                </div>
        </div>
    </div>

    <div class="inner-footer">
        <button class="btn-xl-def" @click='close'>关闭</button>
        <!--<slot v-if="itemData.ready" >-->
                <!--<button class="btn-xl-def" @click='createTask'>下达生产</button>-->
        <!--</slot>-->
    </div>

    <warning :config='msgCfg'></warning>
</template>

<style lang='less' scoped>
@import '../../../../../public/css/variable.less';
</style>
