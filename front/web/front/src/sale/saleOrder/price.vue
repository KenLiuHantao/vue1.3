<script>
/*
    config: {
        show:false, //弹框显示 true|false 必填
    },
    //回调函数
    @cb(val)
*/
export default {
    props:{
        config: {
            type: Object
        },
        data:''
    },
    ready() {

    },
    data() {
        return {
            modalCfg: {
                show: this.config.show || false,
                width: '960px',
                height: 'auto',
                header: '选取货品价格',
                btn: [{
                    name: '取消',
                    emit: 'quite'
                }, {
                    name: '确定',
                    emit: 'sure'
                }],
            },
            tableData: {
                dataList:[{
                    inventoryCode:'',
                    inventoryName:'',
                    inventorySpec:''
                }]
            }, 
            currentUl: '-1', //当前操作分类
            chooseRadio: '', //当前选中列
            keyWord: ''  //搜索关键字
        }
    },
    methods: {
        getTableData(item, index) {
            this.currentUl = index
            this.$http.get(__URL.sale + 'pricing/findSalePriceRef/' + item.inventoryCode).then(res => {
               if(res.data.success){
                   this.tableData = res.data.data;
               }
            });
        },
        quite() {
            this.config.show = false
            this.chooseRadio = ''
        },
        sure() {
            this.config.show = false
            this.$emit('cb', this.chooseRadio)
        },
        checkThisLine(item){
            this.chooseRadio = item
        }
    },
    watch: {
        data:{
            handler(val) {
                this.getTableData(val, -1);
            },
            deep:true
        },
        config:{
             handler: function (val, oldVal) {
                this.modalCfg.show = val.show
                if(val.show == true && val.data &&  val.data != '') {
                    this.chooseRadio = val.data
                }
             },
             deep: true
        },
        keyWord(val,oldval) {
            if(val.trim() == '') {
                this.getTableData('',-1)
            }
        },
        modalCfg:{
            handler: function (val, oldVal) {
                this.config.show = val.show
             },
             deep: true
        }
    }
}
</script>
<template>
    <modal :config="modalCfg" @quite="quite" @sure="sure">
        <div class="check-wrap ">
            <div class="right-wrap">
                <div class="common-head">
                        <div class="form-group">
                            <label><i class="icon icon-product__codes"></i>货品编码:</label>
                            <p class="orderData">{{tableData.dataList[0].inventoryCode}}</p>
                        </div>
                        <div class="form-group">
                            <label><i class="icon icon-product__name"></i>货品名称:</label>
                            <p class="orderData">{{tableData.dataList[0].inventoryName}}</p>
                        </div>
                        <div class="form-group">
                            <label><i class="icon icon-specification__model"></i>规格型号:</label>
                            <p class="orderData">{{tableData.dataList[0].inventorySpec}}</p>
                        </div>
                </div>
                <div class="left-content">
                    <table class="modal-table">
                        <thead>
                            <tr>
                                <th width="5%"></th>
                                <th width="30px">序号</th>
                                <th width="20%" class="text-left">单号</th>
                                <th width="12%">客户</th>
                                <th width="12%">业务员</th>
                                <th width="5%">币种</th>
                                <th width="5%">税率</th>
                                <th width="5%">单位</th>
                                <th width="15%">单价信息</th>
                                <th width="20%">订购量</th>
                                <th width="20%">生/失效日期</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in tableData.dataList" @click.stop='checkThisLine(item)'>
                                <td>
                                    <input type="radio" :value="item" v-model="chooseRadio">
                                </td>
                                <td>{{ $index+1 }}</td>
                                <td class="text-left">
                                    <a href="javascript:;" :title='item.docNo'>{{item.docNo}}</a>
                                </td>
                                <td>{{item.customerName}}</td>
                                <td>{{item.employeeName}}</td>
                                <td>{{item.currencyName}}</td>
                                <td>{{item.taxRate}}</td>
                                <td>{{item.unitName}}</td>
                                <td>
                                    <div class="show-wrap">
                                        <p>单位: {{item.unitName}}</p>
                                        <p>单价: {{item.taxUnitPrice}}</p>
                                        <p>单价类型: {{item.priceType == 1 ? '采购价' : '委外加工价'}}</p>
                                    </div>
                                </td>
                                <td>
                                    <div class="show-wrap">
                                        <p>订购量(从): {{item.lowerLimit}}</p>
                                        <p>订购量(到): {{item.upperLimit}}</p>
                                    </div>
                                </td>
                                <td>
                                    <div class="show-wrap">
                                        <p>生效日: {{item.effectiveDate}}</p>
                                        <p>失效日: {{item.expiredDate}}</p>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </modal>
</template>
<style lang="less" scoped>
    @import '../../../../../public/css/variable.less';
    @import '../../../../../public/css/referCommon.less';
    .check-wrap {
        .common-head{
            justify-content: flex-start;
            .form-group{
                width:25%;
                >label{
                    width: 75px;
                }
            };
        }
    }
    .modal-table td{
        text-align: left;
    }
    .icon-product__codes,
    .icon-product__name,
    .icon-specification__model {
        font-size: 16px;
        vertical-align: sub;
    }
    .icon-product__codes {
        color: #34bb9d;
    }
    .icon-product__name {
        color: #f2746e;
    }
    .icon-specification__model {
        color: #e26ef2;
    }
</style>

