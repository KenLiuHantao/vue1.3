<script>
    import edit from './edit.vue'
    import bomsetting from '../saleOrder/bomSetting'
    export default {
        components:{
            edit,bomsetting
        },
        props:['id','tab'],
        data() {
            return {
                selfReg:{
                    limit:''
                },
                flowCfg:{
                    data: [{
                        no: '1',
                        name: '新增销售订单',
                        time: '',
                        filed: '',
                        user: '',
                        flag: true,
                    }, {
                        no: '2',
                        name: 'BOM配置',
                        time: '',
                        filed: '',
                        user: '',
                        flag: true,
                    }, {
                        no: '3',
                        name: 'BOM完善',
                        time: '',
                        filed: '',
                        user: '',
                        flag: true,
                    }, {
                        no: '4',
                        name: '审核销售订单',
                        time: '',
                        filed: '',
                        user: '',
                        flag: true,
                    }, {
                        no: '5',
                        name: '完成',
                        time: '',
                        filed: '',
                        user: '',
                        flag: this.tab=="dispatched",
                    }]
                },
                //当前页面状态
                isEdit: false,
                isChange: false,

                //人员参照config
                employeeCfg:{
                    show:false
                },
                //附件组2
                ugCfgTwo:{
                    limit:1,
                },

                //table数据模型
                tableModal:{
                    "recordId":"",
                    "deliveryDate": "",
                    "inventoryCode": "",
                    "inventoryName": "",
                    "inventorySpec": "",
                    "quantity": 0,
                    "recordId": "",
                    "recordVersion": 0,
                    "rowNum": 0,
                    "rowRemark": "",
                    "taxAmounts": 0,
                    "taxUnitPrice": 0,
                    "unitName": "",
                    "stockQuantity": 0,
                    "attributeCode":'',
                    "attributeName":'',
                    //后台计算的值
                    "lcAmounts": 0,
                    "lcTax": 0,
                    "lcTaxAmounts": 0,
                    "lcTaxUnitPrice": 0,
                    "lcUnitPrice": 0,
                    "unitPrice": 0,
                    "amounts": 0
                },
                //页面数据模型
                infoModal:{
                    "dataList": [],
                    "header": {
                        "salesOrderAttachment":[],
                        "customerContractAttachment":[],
                        "currencyCode": "",
                        "currencyName": "",
                        "currencySymbol": "",
                        "customerCode": "",
                        "customerName": "",
                        "customerOrderDocNo": "",
                        "docNo": "",
                        "employeeCode": "",
                        "employeeName": "",
                        "recAgreementCode": "",
                        "recAgreementName": "",
                        "remark": "",
                        "taxRate": 0,
                        "docStatus":'',
                        "exchangeRate":'',
                        "payment":'',
                        "dispatchModel":'',
                    },
                },
                currencyListData:'',
                collectListData:'',
                paymentData:'',

                //当前操作的表行
                currentRow:'',

                //warming配置
                wCfg:{
                    show:false,
                    content:'',
                    type:'warning'
                },
                //alert配置
                dCfg:{
                    show:false,
                    msg:'该销售单已产生发货单,确定要变更？',
                    subMsg:'',
                    type:'warning',
                    quite:true
                },
                //保存后返回的数据
                pushedBackData:'',

                //日期配置
                dateCfg:{
                    format:'YYYY-MM-DD'
                },
                detailCfg:{
                    title:'BOM配置',
                    show:false
                },
                activeItem:'',
                ajaxlock:true,
                editCfg:{
                    show:false,
                    title:'销售订单变更申请单'
                }
            }
        },
        ready(){
            this.getSelectList()
            if(this.id)this.getInfo()
        },
        methods: {
            //获取详情信息
            getInfo(){
                this.$http.get(__URL.sale + 'salesOrder/findOne/'+this.id).then(
                    res=>{
                        if(res.data.success){
                            this.infoModal = res.data.data
                            let param = {}
                            param.docNo = this.infoModal.header.docNo
                            param.recordVersions = this.infoModal.dataList.map(item=>{
                                return {
                                    'recordId' :item.recordId,
                                    'recordVersion' :item.recordVersion,
                                }
                            })
                            this.pushedBackData = param
                        }
                    }
                )
            },
            //获取表头选择默认数据
            getSelectList(){
                this.getInitSelectData(__URL.arc + 'currency/local','currencyListData')
                this.getInitSelectData(__URL.arc + 'rec/agreement/list','collectListData')
                this.getPaymentListData()
            },
            getInitSelectData(url,val){
                this.$http.post(url).then(
                    (res) => {
                        if(res.data.success){
                            this[val] = res.data.data
                        }else{
                            console.log('网络出错:'+res.data.errMsg)
                        }
                    }
                )
            },
            getPaymentListData(){
                this.$http.post(__URL.arc + 'payment/list').then(
                    (res) => {
                        if(res.data.success){
                            this.paymentData = res.data.data.dataList
                        }else{
                            console.log('网络出错:'+res.data.errMsg)
                        }
                    }
                )
            },
            close(){
                this.$emit('refresh')
            },
            changeSale(){
                this.$http.get(__URL.sale + 'salesOrder/findSaleOrderChange/' + this.id).then(
                        (res) => {
                        if (res.data.data>0) {
//                            this.$emit('refresh','warning',"该销售订单已经生成过变更单了")
                            this.wCfg.type='warning'
                            this.wCfg.content = '该销售订单已经生成过变更单了'
                            this.wCfg.show = true
                            this.isChange = true
                        }

                if (this.isChange) {
                    return
                }

                var flag=false;
                for(var i=0;i<this.infoModal.dataList.length;i++){
                    if(this.infoModal.dataList[i].totalDspQty>0){
                        flag=true;
                        break
                    }
                }
                if(flag){
                    this.dCfg.show=true;
                }else{
                    this.editCfg.show=true;
                }
                    })


            },
            sureAlert(){
                this.dCfg.show=false;
                this.editCfg.show=true;
            },
            closeEdit(text){
                this.editCfg.show=false;
                if(text){
                    this.$emit('refresh','success',text)
                }
            },
            bomSetting(item){
                this.activeItem = item
                this.detailCfg.show = true
            },
            closeBom(){
                this.wCfg.type='success'
                this.wCfg.content = '保存成功'
                this.wCfg.show = true
                this.detailCfg.show = false
                this.getInfo()
            },
        }
    }
</script>
<template>
    <!-- 弹框内置dom结构 -->
    <div class="inner-wrapper">
        <workflow :config="flowCfg"></workflow>
        <div class="inner-content">
            <h2 class="tag two-tag"><label>销售订单信息</label><label v-show="id" class="ft-14">销售单号:{{id}}</label></h2>
            <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
            <div class="inner-item form-box">
                <div class="form-group">
                    <label><span class="must-point">*</span>客户名称:</label>
                    <p>{{infoModal.header.customerName}}</p>
                </div>
                <div class="form-group">
                    <label>业务员:</label>
                    <p>{{infoModal.header.employeeName}}</p>
                </div>
                <div class="form-group">
                    <label>币种:</label>
                    <p>{{infoModal.header.currencyName}}</p>
                </div>
                <div class="form-group">
                    <label>客户订单号:</label>
                    <p>{{infoModal.header.customerOrderDocNo}}</p>
                </div>
                <div class="form-group">
                    <label>收款协议:</label>
                    <p>{{infoModal.header.recAgreementName}}</p>
                </div>
                <div class="form-group">
                    <label>税率(%):</label>
                    <p>{{infoModal.header.taxRate}}</p>
                </div>
                <div class="form-group">
                    <label>结算方式:</label>
                    <p>{{infoModal.header.payment}}</p>
                </div>
                <div class="form-group">
                    <label>交货方式:</label>
                    <p>{{infoModal.header.dispatchModel}}</p>
                </div>
            </div>

            <div class="inner-item">
                <div class="form-group ac wd-100">
                    <label>订单图档附件:</label>
                    <upfile-group :data='infoModal.header.salesOrderAttachment' :edit="false"></upfile-group>
                </div>
                <div class="form-group ac wd-100">
                    <label>客户订单合同:</label>
                    <upfile-group :config="ugCfgTwo" :data='infoModal.header.customerContractAttachment' :edit="false"></upfile-group>
                </div>
                <div class="form-group">
                    <label>订单备注:</label>
                    <p class="lh-20">{{infoModal.header.remark}}</p>
                </div>
            </div>

            <div class="inner-item">
                <table class="inner-table it-fix">
                    <thead>
                    <tr>
                        <th width="5%">序号</th>
                        <th width="20%">货品信息</th>
                        <th width="10%">数量</th>
                        <th width="10%">价格信息</th>
                        <th width="10%">价税合计</th>
                        <th width="15%">可用库存</th>
                        <th width="18%">交期</th>
                        <th width="15%">备注</th>
                        <th width="10%">查看BOM</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="item in infoModal.dataList" >
                        <td>{{$index+1}}</td>
                        <td>
                            <div class="show-wrap">
                                <p>编码:{{item.inventoryCode}}</p>
                                <p>名称:{{item.inventoryName}}</p>
                                <p>规格型号:{{item.inventorySpec}}</p>
                                <p>属性:{{item.attributeName}}</p>
                            </div>
                        </td>
                        <td>
                            <div class="show-wrap">
                                <p>{{item.quantity}}</p>
                            </div>
                        </td>
                        <td>
                            <div class="show-wrap">
                                <p>单价:{{item.taxUnitPrice}}</p>
                                <p>单位:{{item.unitName}}</p>
                            </div>
                        </td>
                        <td>
                            <div class="show-wrap">
                                <p>{{item.taxAmounts}}</p>
                            </div>
                        </td>
                        <td>
                            <div class="show-wrap">
                                <p>{{ item.abledStockQty }}</p>
                            </div>
                        </td>
                        <td>
                            <div class="show-wrap">
                                <p>{{item.deliveryDate}}</p>
                            </div>
                        </td>
                        <td>
                            <div class="show-wrap">
                                <p class="lh-20">{{item.rowRemark}}</p>
                            </div>
                        </td>
                        <td>
                            <button v-if="(item.attributeCode == '1' || item.attributeCode == '2' )" class="button-default" @click="bomSetting(item)">查看配置</button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <div class="inner-footer">
        <button class="btn-xl-def" v-if='tab == "completion" || tab == "inbound"' @click="close">取消</button>
        <button class="btn-xl-def" v-else @click="close">关闭</button>
        <ajax-button class="btn-xl-imp" v-if='tab == "completion" || tab == "inbound"' @click="changeSale">申请变更</ajax-button>
    </div>

    <!--提示-->
    <warning :config="wCfg"></warning>
    <alert :config="dCfg" @cb='sureAlert'></alert>

    <!-- 变更详情页面 -->
    <inner :config="editCfg">
        <edit @cb="closeEdit"  :id="id" :tab='tab'></edit>
    </inner>

    <!--Bom设置-->
    <inner :config='detailCfg'>
        <bomsetting :act="activeItem" @refresh="closeBom" :show="detailCfg"></bomsetting>
    </inner>

</template>
<style lang='less' scoped>
    /* 此处为自己定义的样式 */
    @import '../../../../../public/css/variable.less';
    .h28 {
        height: 28px;
    }
    .h60{
        height: 60px;
    }
    .show-wrap {
        .s-input {
            margin-bottom: 10px;
            &:last-of-type {
                margin-bottom: 0;
            }
        }
    }
</style>
