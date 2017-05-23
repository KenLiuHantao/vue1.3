<script>
import bomsetting from '../saleOrder/bomSetting'
export default {
    components:{
        bomsetting
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
            changeSaleCfg:{
                show: false,
                width: '480px',
                height: 'auto',
                header: '销售单变更操作',
                btn: [{
                    name: '取消',
                    className:['btn-xl-def','mgr-10'],
                    emit: 'close',
                }, {
                    name: '确定',
                    className:['btn-xl-imp'],
                    emit: 'sure',
                }],
            },
            //当前操作行
            activeIndex:'',
            //变更对象
            changeData:{
                reason:'',
                remark:''
            },
            hasChange:false
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
                        for(var i=0;i<res.data.data.dataList.length;i++){
                            res.data.data.dataList[i].hasChange=false;
                            res.data.data.dataList[i].changeType=''
                            res.data.data.dataList[i].changeRemark=''
                            res.data.data.dataList[i].oldQuantity=''
                        }
                        this.infoModal = res.data.data;
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
         activeLine(index){
            this.activeIndex=index;
         },
         close(){
            this.$emit('cb')
         },
         audit(){
            var params={
                "dataList": [
                ],
                "header": {
                  "customerChangeType": this.infoModal.header.customerChangeType,
                  "docNo": this.infoModal.header.docNo
                }
            }
            for(var i=0;i<this.infoModal.dataList.length;i++){
                params.dataList.push({
                    "changeRemark":this.infoModal.dataList[i].changeRemark,
                    "changeType":this.infoModal.dataList[i].changeType,
                    "quantity":this.infoModal.dataList[i].quantity,
                    "recordId":this.infoModal.dataList[i].recordId,
                    "rowNum":this.infoModal.dataList[i].rowNum
                })
            }
            this.$http.post(__URL.sale + 'salesOrderFollowing/insertSalesOrderChange',params).then(
                (res) => {
                    if(res.data.success){
                        this.$emit('cb','提交成功')
                    }else{
                        this.wCfg.content=res.data.errMsg
                        this.wCfg.show=true
                    }
                }
            )
         },
         changeNum(){
            this.changeSaleCfg.show=true;
         },
         changeSaleClose(){
            this.changeSaleCfg.show=false;
         },
         changeSaleSure(){
            if(this.changeData.reason==''){
                this.wCfg.content='变更类型不能为空'
                this.wCfg.show=true
            }else{
                this.hasChange=false;
                this.infoModal.dataList[this.activeIndex].changeType=this.changeData.reason;
                this.infoModal.dataList[this.activeIndex].changeRemark=this.changeData.remark;
                this.infoModal.dataList[this.activeIndex].hasChange=true;
                this.changeData.reason='';
                this.changeData.remark='';
                this.infoModal.dataList[this.activeIndex].oldQuantity=this.infoModal.dataList[this.activeIndex].quantity
                this.hasChange=true
                this.changeSaleCfg.show=false;
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
    },
    filters:{
        setTaxt:{
            write(val,oldval,index){
                val=Number(val)
                if(isNaN(val)){
                    val=oldval
                }
                let d = this.infoModal.dataList[index]
                if(d.taxUnitPrice != ''){
                    d.taxAmounts = val * d.taxUnitPrice
                }
                return val
            }
        }
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
                    <div class="form-group">
                        <label>客户信息变更类型:</label>
                        <p>{{infoModal.header.customerChangeType}}</p>
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
                                <th width="15%">库存</th>
                                <th width="18%">交期</th>
                                <th width="15%">备注</th>
                                <th width="10%">操作</th>
                                <th v-show='hasChange' width="15%">变更说明</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in infoModal.dataList" @click='activeLine($index)'>
                                <td>{{$index+1}}</td>
                                <td>
                                    <div class="show-wrap">
                                        <p>编码:{{item.inventoryCode}}</p>
                                        <p>名称:{{item.inventoryName}}</p>
                                        <p>规格型号:{{item.inventorySpec}}</p>
                                        <p>属性:{{item.attributeName}}</p>
                                    </div>
                                </td>
                                <td v-show='!item.hasChange'>
                                    <div class="show-wrap">
                                        <p v-show='!item.hasChange'>{{item.quantity}}</p>
                                    </div>
                                </td>
                                <td v-show='item.hasChange'>
                                    <div class="show-wrap">
                                        <p v-show='!item.hasChange'>{{item.quantity}}</p>
                                        <p v-show='item.hasChange'>变更前:<br/>{{item.oldQuantity}}</p>
                                        <p v-show='item.hasChange'>变更后:<input-number :code.sync="item.quantity | setTaxt $index" type="number"></input-number></p>
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
                                        <p>即时库存:{{ item.stockQuantity }}</p>
                                        <p>可用库存:{{ item.abledStockQty }}</p>
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
                                <td v-show='!hasChange'>
                                    <button v-show="(item.attributeCode == '1' || item.attributeCode == '2' )" class="button-default" style='margin-bottom:10px;' @click="bomSetting(item)">查看配置</button><br/>
                                    <button class="button-primary" v-show='!item.hasChange' @click='changeNum'>变更操作</button>
                                </td>
                                <td v-show='hasChange'>
                                    <button v-show="(item.attributeCode == '1' || item.attributeCode == '2' )" class="button-default" style='margin-bottom:10px;' @click="bomSetting(item)">查看配置</button><br/>
                                    <button class="button-primary" v-show='!item.hasChange' @click='changeNum'>变更操作</button>
                                </td>
                                <td v-show='hasChange'>
                                    <div v-show='item.hasChange' class="show-wrap">
                                        <p style='text-align:left;'>变更类型:</p>
                                        <div class="s-input ic2">
                                            <input type='text' v-model='item.changeType' disabled>
                                        </div>
                                        <p style='text-align:left;'>详细备注:</p>
                                        <div class="s-input ic2">
                                            <textarea class="remark-text" disabled v-model='item.changeRemark'  maxlength='120' placeholder='请输入详细备注'></textarea>
                                        </div>
                                    </div>
                                    <div v-else class="show-wrap">
                                        <p>---</p>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
        </div>
    </div>
    <div class="inner-footer">
        <button class="btn-xl-def" @click="close">取消</button>
        <ajax-button class="btn-xl-imp" @click="audit">提交审核</ajax-button>
    </div>

    <!--提示-->
    <warning :config="wCfg"></warning>
    <!-- 变更弹框 -->
    <modal :config='changeSaleCfg' @sure='changeSaleSure' @close='changeSaleClose'>
        <div class='form-group'>
            <label><span class="must-point">*</span>选择变更类型:</label>
            <div class="s-input ic2">
                <select v-model='changeData.reason'>
                    <option :value='"1、数量变更"'>1、数量变更</option>
                </select>
            </div>
        </div>
        <div class='form-group'>
            <label>详细备注:</label>
            <div class="s-input ic2">
                <textarea v-model='changeData.remark' style='height:100px;' maxlength='120' placeholder='请输入详细备注'></textarea>
            </div>
        </div>
    </modal>
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
    .modal-area .form-group label:first-of-type{
        width: 95px;
    }
    .inner-table tbody tr td tetxarea[disabled] {
        color: #212121;
        background-color: #f5f5f5;
    }
    .form-group > label{
        width: 100px;
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
