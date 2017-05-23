<script>

    export default {
        props: ['status','inbound', 'docNo'],
        data() {
            return {
                flowCfg: {
                    data: [{
                        no: '1',
                        name: '待确认应付款',
                        time: '',
                        filed: '',
                        user: '',
                        flag: true,
                    }, {
                        no: '2',
                        name: '已确认',
                        time: '',
                        filed: '',
                        user: '',
                        flag: false,
                    }, {
                        no: '3',
                        name: '完成',
                        time: '',
                        filed: '',
                        user: '',
                        flag: false,
                    }]
                },
                //warming配置
                wCfg: {
                    show: false,
                    content: '',
                    type: 'warning',
                    showtime: 2000,
                },
                //提示消息
                msgCfg: {
                    show: true,
                    msg: '提示消息'
                },
                infoModal: {
                    header:{
                        supplierName : '',
                        currencyName : '',
                        exchangeRate : '',
                        purchaseDocNo : '',
                        docNo : '',
                        docDate : ''
                    },
                    dataList:{
                        inventoryCode:'',
                        inventoryId:'',
                        inventoryName:'',
                        inventorySpec:'',
                        quantity:'',
                        recordId:'',
                        showQuantity:'',
                        showTax:'',
                        showTaxAmounts:'',
                        tax:'',
                        taxAmounts:'',
                        taxRate:'',
                        unitName:'',
                        unitPrice:''
                    }

                },
            }
        },
        ready(){
            if(this.status == 0){
                this.getWaitInfo()
            }else{
                this.getConfirmInfo()
            }

        },
        methods: {
            //获取详情信息
            getWaitInfo(){
                this.$http.get(__URL.financial + 'confirm/payable/wait/detail/' + this.docNo).then(
                    res => {
                        if (res.data.success) {
                            this.infoModal.header = res.data.data.header
                            this.infoModal.dataList = res.data.data.dataList
                        }
                    }
                )
            },
            getConfirmInfo(){
                this.$http.get(__URL.financial + 'confirm/payable/confirm/detail/' + this.docNo).then(
                    res => {
                        if (res.data.success) {
                            this.infoModal.header = res.data.data.header
                            this.infoModal.dataList = res.data.data.dataList
                        }
                        for (var i = 0; i <= 3; i++) {
                            this.flowCfg.data[i].flag = true
                        }
                    }
                )
            },
            confirm(){
                this.$http.get(__URL.financial + 'confirm/payable/confirm/' + this.docNo).then(
                    res => {
                        if (res.data.success) {
                            this.msgCfg.show = true
                            this.msgCfg.msg = "确认成功"
                        } else {
                            this.wCfg.show = true
                            this.wCfg.content = res.data.errMsg
                        }
                    }
                )
            },
            unConfirm(){
                this.$http.get(__URL.financial + 'confirm/payable/abandon/' + this.docNo).then(
                    res => {
                        if (res.data.success) {
                            this.msgCfg.show = true
                            this.msgCfg.msg = "操作成功"
                        } else {
                            this.wCfg.show = true
                            this.wCfg.content = res.data.errMsg
                        }
                    }
                )
            },
            hide(){
                this.$emit('refresh')
            },
            close(){
                this.$emit('close')
            },
        },
        computed: {

        }
    }

</script>
<template>
    <!--&lt;!&ndash; 弹框内置dom结构 &ndash;&gt;-->
    <div class="inner-wrapper">
        <workflow :config="flowCfg"></workflow>
        <div class="inner-content">

            <h2 class="tag">应付款确认单信息</h2>

            <!--&lt;!&ndash; inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 &ndash;&gt;-->
            <div class="inner-item form-box">
                <div class="form-group">
                    <label>供应商名称:</label>
                    <p>{{infoModal.header.supplierName}}</p>
                </div>
                <div class="form-group">
                    <label>币种:</label>
                    <p>{{infoModal.header.currencyName}}</p>
                </div>
                <div class="form-group">
                    <label>汇率:</label>
                    <p>{{infoModal.header.exchangeRate}}</p>
                </div>
                <div class="form-group">
                    <label>采购单号:</label>
                    <p>{{infoModal.header.purchaseDocNo}}</p>
                </div>
                <div class="form-group">
                    <label>入/退货单号:</label>
                    <p>{{infoModal.header.docNo}}</p>
                </div>
                <div class="form-group">
                    <label>入/退货日期:</label>
                    <p>{{infoModal.header.docDate}}</p>
                </div>
            </div>

            <div class="inner-item">
                <table class="inner-table mt-15">
                    <thead>
                    <tr>
                        <th width="10%">序号</th>
                        <th width="20%">货品信息</th>
                        <th width="10%">单位</th>
                        <th width="10%">入/退货数量</th>
                        <th width="10%">单价</th>
                        <th width="10%">税率(%)</th>
                        <th width="15%">税额</th>
                        <th width="15%">应付金额</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="item in infoModal.dataList" :style="inbound==false?'color:red':''">
                        <td>{{$index+1}}</td>
                        <td>
                            <div class="show-wrap">
                            <p>
                                <label>编码:</label><label>{{item.inventoryCode}}</label>
                            </p>
                            <p>
                                <label>名称:</label><label>{{item.inventoryName}}</label>
                            </p>
                            <p>
                                <label>规格型号:</label><label>{{item.inventorySpec}}</label>
                            </p>
                            </div>
                        </td>
                        <td>
                            {{item.unitName}}
                        </td>
                        <td>
                            {{item.showQuantity}}
                        </td>
                        <td>
                            {{item.unitPrice}}
                        </td>
                        <td>
                            {{item.taxRate}}
                        </td>
                        <td>
                            {{item.showTax}}
                        </td>
                        <td>
                            {{item.showTaxAmounts}}
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <div class="inner-footer">
        <button class="btn-xl-def" @click="close">取消</button>
        <ajax-button class="btn-xl-imp" @click="confirm" v-if="status==0">确认应付</ajax-button>
        <ajax-button class="btn-xl-danger" @click="unConfirm" v-if="status==1">放弃确认</ajax-button>
    </div>
    <!--&lt;!&ndash;提示&ndash;&gt;-->
    <warning :config="wCfg"></warning>
    <alert :config="msgCfg" @cb="hide"></alert>
</template>
<style lang='less' scoped>
    /* 此处为自己定义的样式 */
    @import '../../../../../public/css/variable.less';
</style>
