<script>
    import rnotice from './returnNotice.vue'
    export default {
        components:{
            rnotice
        },
        props: ['show'],
        ready() {
            this.getListData(this.searchParams),
            this.all = false
        },
        data() {
            return {
                //是否全选
                all:false,
                //选中的全部信息
                chooseInfo:[],
                chooseArr:[],
                listData:[],
                isEdit:true,
                customerCfg:{
                    show:false,
                },
                //提示消息
                msgCfg: {
                    type:'failure',
                    show:false,
                    content:'',
                },
                searchParams: {
                    "customerName": "",
                    "employeeName": "",
                    "inventoryCode": "",
                    "salesOrderDocNo": "",
                    "salesDispatchDocDate":"",
                    "pageIndex": 0,
                    "pageSize": 0,
                },
                tableData: '',
                returnData:[],
                returnHeader:{
                    "currencyName": "",
                    "customerName": "",
                    "docDate": "",
                    "docNo": "",
                    "docStatus": 0,
                    "employeeName": "",
                    "remark":'',
                    "returnReason":'',
                    "salesReturnAttachment":[]
                },
                noticeConfig:{
                    show: false,
                    width: '100%',
                    height: '100%',
                    title: '退货通知单',
                },
                salesReturnGeneratorReqVos:{
                    ids: []
                }
            }
        },
        methods: {
            //获取table列表数据
            getListData(param) {
                this.$http.post(__URL.sale + 'salesReturn/findWaitingList', param).then(
                    res => {
                        if (res.data.success) {
                            this.tableData = res.data.data.dataList
                        } else {
                            this.msgCfg.show = true
                            this.msgCfg.content = res.data.errMsg
                        }
                    }
                )
            },
            search(){
                this.getListData(this.searchParams)
            },
            exit(){
                this.noticeConfig.show = true
            },
            return(){
                this.salesReturnGeneratorReqVos.ids = this.chooseArr
                this.getReturnData(this.salesReturnGeneratorReqVos)
            },
            getReturnData(param) {
                this.$http.post(__URL.sale + 'salesReturn/createSalesReturn', param).then(
                    res => {
                        if (res.data.success) {
                            this.returnData = res.data.data.dataList
                            this.returnHeader = res.data.data.header
                            this.noticeConfig.show = true
                        } else {
                            this.msgCfg.show = true
                            this.msgCfg.content = res.data.errMsg
                        }
                    }
                )
            },
            checkCustomer(){
                this.customerCfg.show = true
            },
            getCustomer(val){
                this.customerCfg.show = false
                this.searchParams.customerName = val.customerName
            },
            //全选
            checkAll(){
                if(this.all){
                    this.chooseArr = []
                }else{
                    this.chooseArr = []
                    this.tableData.forEach((item)=>{
                        this.chooseArr.push(item.recordId)
                    })
                }
                this.all = !this.all
            },
            //判断是否有未被选中的 true 全选中 false 未全选中
            haveAllCheck(){
                let c = true
                this.chooseInfo = []
                if(this.tableData.length > 0){
                    this.tableData.forEach((item)=>{
                        if(this.chooseArr.indexOf(item.recordId) < 0){
                            c = false
                        }else{
                            this.chooseInfo.push(item.recordId)
                        }
                    })
                }else{
                    c = false
                }
                return c
            },

            refresh(){
                this.show = false
                this.$emit('refresh')
            },
            clearCustomer(){
                this.searchParams.customerName = ''
            }


        },
        watch:{
            chooseArr:{
                handler:function(val,oldval){
                    if(this.haveAllCheck()){
                        this.all = true
                    }else{
                        this.all = false
                    }
                },
                deep:true
            }
        }
    }
</script>
<template>
    <!-- 弹框内置dom结构 -->
    <div class="inner-wrapper">
        <div class="inner-content">

            <h2 class="tag">出库信息</h2>

            <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
            <div class="inner-item form-box">
                <div class="form-group">
                    <label><span class="must-point">*</span>客户名称:</label>
                    <div v-else class="check-input">
                        <!--<div class="s-input">
                        <input type="text" readonly v-model="searchParams.customerName">
                        <i class="icon icon-search r1" @click="checkCustomer"></i>
                        </div>-->
                        <input-group :data="searchParams.customerName" @modal="checkCustomer" @clear="clearCustomer"></input-group>
                    </div>
                    <refer-customer :config="customerCfg" @cb="getCustomer"></refer-customer>
                </div>
                <div class="form-group">
                    <label>销售订单号:</label>
                    <div v-else >
                        <input type="text" v-model="searchParams.salesOrderDocNo">
                    </div>
                </div>
                <div class="form-group">
                    <label>业务员:</label>
                    <div v-else class="check-input">
                        <input type="text" v-model="searchParams.employeeName">
                    </div>
                </div>
                <div class="form-group">
                    <label>货品:</label>
                    <div v-else >
                        <input type="text" v-model="searchParams.inventoryCode">
                    </div>
                </div>
                <div class="form-group">
                    <label>发货日期:</label>
                    <div v-else>
                        <input type="text" v-model="searchParams.salesDispatchDocDate">
                    </div>
                </div>
            </div>

            <div class="inner-buttom">
                <button class="btn-xl-imp" @click="search">查询</button>
            </div>

            <div class="inner-item">
                <table class="inner-table mt-15">
                    <thead>
                    <tr>
                        <th width="5%"><input type="checkbox" @click="checkAll" :checked="all"></th>
                        <th width="5%">序号</th>
                        <th width="20%">销售订单号</th>
                        <th width="10%">发货日期</th>
                        <th width="10%">业务员</th>
                        <th width="20%">货品信息</th>
                        <th width="10%">数量</th>
                        <th width="10%">价格</th>
                        <th width="10%">币种</th>
                    </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in tableData" >
                            <td><input type="checkbox" :value="item.recordId" v-model="chooseArr"></td>
                            <td>{{$index+1}}</td>
                            <td>
                                {{item.salesOrderDocNo}}

                            </td>
                            <td>
                                {{item.salesDispatchDocDate}}
                            </td>
                            <td>
                                {{item.employeeName}}
                            </td>
                            <td>
                                <div class="show-wrap">
                                    <p><label>编码:</label><label>{{item.inventoryCode}}</label></p>
                                    <p><label>名称:</label><label>{{item.inventoryName}}</label></p>
                                    <p><label>规格型号:</label><label>{{item.inventorySpec}}</label></p>
                                </div>
                            </td>
                            <td>
                                <div class="show-wrap">
                                    <p><label>订单:</label><label>{{item.salesOrderQuantity}}</label></p>
                                    <p><label>已出:</label><label>{{item.outboundQuantity}}</label></p>
                                </div>
                            </td>
                            <td>
                                <div class="show-wrap">
                                <p>{{item.taxUnitPrice}}</p>
                                <p>{{(item.taxUnitPrice * item.outboundQuantity).toFixed(2)}}</p>
                                </div>
                            </td>
                            <td>
                                {{item.currencyName}}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <div class="inner-footer">
        <button class="btn-xl-def" @click="show=false">关闭</button>
        <ajax-button class="btn-xl-imp" @click="return">退货</ajax-button>
    </div>

    <!-- 退货通知 -->
    <inner :config="noticeConfig">
        <rnotice :show.sync="noticeConfig.show" :returndata="returnData" :returnheader="returnHeader" :isedit="isEdit" @refresh="refresh"></rnotice>
    </inner>
    <!--提示信息-->
    <warning :config="msgCfg"></warning>
</template>

<style lang='less' scoped>
    /* 此处为自己定义的样式 */
    @import '../../../../../public/css/variable.less';
    .inner-buttom {
        margin: 15px 0 -15px 15px;
    }
</style>

