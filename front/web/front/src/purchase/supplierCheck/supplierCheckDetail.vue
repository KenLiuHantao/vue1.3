<script>
    import tabbar from 'nc/tab/page-tab-bar'
    import tabcont from 'nc/tab/tab-container'
    import containeritem from 'nc/tab/tab-container-item'


    export default{
        props:['orderdetail','suppliercheckcfg'],
        data(){
            return {
                tableCfg:{
                    width:[3,2,3,2,3,3,2,2],
                    serial: true,
                    totalShow:[true,
                        [{key:'purchaseQuantity',value:'totalPurchaseQuantity'},
                            {key:'quantity',value:'totalInboundReturnQuantity'},
                            {key:'taxAmounts',value:'totalTaxAmounts'}]],
                    match: [
                        'purchaseDocNo',
                        'docDate',
                        [{key:'inboundDocNo',prefix:'入:'},{prefix:'退:',key:'inboundReturnDocNo'}],
                        [{prefix:'编码:',key:'inventoryCode',suffix:''},{prefix:'名称:',key:'inventoryName'},{prefix:'规格:',key:'inventorySpec'}],
                        [{prefix:'含税单价:',key:'taxUnitPrice'},{prefix:'单位:',key:'unitName'}],
                        'purchaseQuantity',
                        'quantity',
                        'taxAmounts'
                    ],
                    head: ['采购单号', '入(退)库日期', '入(退)库单号', '货品信息', '单价信息','采购数量','入(退)库数量','价税合计'],
                },
                checkItem:[]
            }
        },

        components:{
            tabcont,
            containeritem,
        },
        ready(){

            this.tableCfg.totalShow[1][0].value = this.orderdetail.dataList[0].totalPurchaseQuantity;
            this.tableCfg.totalShow[1][1].value = this.orderdetail.dataList[0].totalInboundReturnQuantity;
            this.tableCfg.totalShow[1][2].value = this.orderdetail.dataList[0].totalTaxAmounts;
        },
        methods:{
        },
        computed:{

        }
    }

</script>
<template :config="detailConfig">
    <div class="inner-wrapper" id="inner-orderdetail">
        <div class="inner-content">

            <h2 class="tag two-tag"><label>供应商对账信息</label><label class="ft-14">对账单号:{{orderdetail.checkDocNo}}</label></h2>

            <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
            <div class="inner-item form-box">
                <div class="form-group">
                    <label>供应商名称:</label>
                    <p class="orderData">{{orderdetail.header.supplierName}}</p>
                </div>
                <div class="form-group">
                    <label>会计期间:</label>
                    <p class="orderData">{{orderdetail.header.yearMonthStr}}</p>
                </div>
                <div class="form-group">
                    <label>对账日期:</label>
                    <p class="orderData">{{orderdetail.header.supplierCheckDate}}</p>
                </div>
                <div class="form-group">
                    <label>币种:</label>
                    <p class="orderData">{{orderdetail.header.currencyName}}</p>
                </div>
            </div>

            <div class="inner-item">
                <div class="inner-table-wrap">
                    <tabcont>
                        <containeritem>
                            <div style="min-height: 700px">
                                <vtable :config="tableCfg"  :data="orderdetail.dataList"></vtable>
                            </div>
                        </containeritem>
                    </tabcont>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';
    .inner-table-wrap {
        table {
            width: 100%;
            font-size: 12px !important;
            color: #212121;
            text-align: center;
            table-layout: fixed;
            position: relative;
        }

        thead {
            border: 1px solid #F2F3F3;
        }

        tr {
            background-color: #fff !important;
        }

        th {
            background-color: #FAFAFA;
            padding: 14px 7px;
            position: relative;
            font-weight: normal;
            color: #37474F;
        }

        td {
            position: relative;
            border: 1px solid #F2F3F3;
            font-size: 12px;
            padding: 15px 15px;
            word-wrap: break-word;
        }
    }
</style>