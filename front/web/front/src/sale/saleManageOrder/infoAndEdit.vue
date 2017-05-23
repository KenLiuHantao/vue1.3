<script>
    import bomsetting from './bomSetting'
    export default {
        components:{
            bomsetting
        },
        props:['id','add','show'],
        data() {
            return {
                workflow:4,
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
                        flag: false,
                    }]
                },
                //当前页面状态
                isEdit:false,

                //客户参照config
                customerCfg:{
                    show:false,
                },

                //人员参照config
                employeeCfg:{
                    show:false
                },

                //货品参照config
                inventoryCfg:{
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
                    //后台计算的值
                    "lcAmounts": 0,
                    "lcTax": 0,
                    "lcTaxAmounts": 0,
                    "lcTaxUnitPrice": 0,
                    "lcUnitPrice": 0,
                    "unitPrice": 0,
                    "amounts": 0,
                    "attributeCode":''
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
                        "docStatus":-1,
                        "exchangeRate":''
                    },
                },
                currencyListData:'',
                collectListData:'',
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
                    title:'查看BOM信息',
                    show:false
                },
                activeItem:'',
                ajaxlock:true,

                //销售价格参照
                referPriceCfg: {
                    show: false,
                    url:__URL.sale + 'pricing/findSalePriceRef/'
                },

            }
        },
        ready(){
            this.getSelectList();
            if(this.id)this.getInfo();
        },
        methods: {
            //获取详情信息
            getInfo(){
                this.$http.get(__URL.sale + 'salesOrder/findOne/'+this.id).then(
                    res=>{
                        if(res.data.success){
                            this.infoModal = res.data.data
                            this.flowCfg.data = res.data.data.header.workFlowVos
                            let param = {}
                            param.docNo = this.infoModal.header.docNo
                            param.recordVersions = this.infoModal.dataList.map(item=>{
                                return {
                                    'recordId' :item.recordId,
                                    'recordVersion' :item.recordVersion,
                                }
                            })
                            this.pushedBackData = param;
                            if(this.infoModal.docStatus == 0){
                                this.workflow = 3;
                                this.flowCfg.data[3].flag = true;
                            }else{
                                this.workflow = 4;
                                this.flowCfg.data[4].flag = true;
                            }
                        }
                    }
                )
            },
            //获取表头选择默认数据
            getSelectList(){
                this.getInitSelectData(__URL.arc + 'currency/local','currencyListData')
                this.getInitSelectData(__URL.arc + 'rec/agreement/list','collectListData')
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
            //添加新行
            addRow(){
                this.infoModal.dataList.push(Object.assign({},this.tableModal))
            },
            //编辑状态切换
            edit(){
                this.isEdit = true
                this.add = false
            },
            //保存
            save(push){
                //检测必填数据是否已填
                if(!this.ajaxlock){
                    return
                }
                if(!this.check()){
                    this.wCfg.show = true
                    return false
                }
                //新增 | push为true则同时提交审核
                if(this.add){
                    this.getCurrency()
                    this.getRace()
                    this.saveData(__URL.sale + 'salesOrder/insertSaveDraft',this.infoModal,push)
                    //编辑 | push为true则同时提交审核
                }else if(this.isEdit){
                    this.getCurrency()
                    this.getRace()
                    this.saveData(__URL.sale + 'salesOrder/updateSaveDraft',this.infoModal,push)
                    //只提交审核
                }else if(push){
                    this.pushAudit()
                }
            },
            saveData(url,param,push){
                this.ajaxlock=false;
                this.$http.post(url,param).then(
                    res=>{
                        this.ajaxlock=true;
                        if(res.data.success){
                            this.wCfg.show= true
                            this.wCfg.content="保存成功！"
                            //切换页面状态
                            this.isEdit = false
                            this.add = false
                            //将返回的数据赋给pushData，给编辑、提交审核时用
                            this.pushedBackData = res.data.data
                            //新增后，更新infoModal的数据
                            this.infoModal.header.docNo = this.pushedBackData.docNo
                            this.pushedBackData.recordVersions.forEach((item,index)=>{
                                this.infoModal.dataList[index] = Object.assign(this.infoModal.dataList[index],item)
                            })
                            //当push为true时提交审核
                            if(push){
                                this.pushAudit()
                            }
                        }else{
                            this.wCfg.show= true
                            this.wCfg.content= res.data.errMsg
                            this.wCfg.type="failure"
                        }
                    }
                )
            },
            //审核系列
            pushAudit(){
                this.auditData(__URL.sale+ 'salesOrder/auditDraft',this.pushedBackData,'提交审核成功')
            },
            giveUpAudit(){
                this.auditData(__URL.sale + 'salesOrder/unAudit',this.pushedBackData,'弃审成功')
            },
            returnAudit(){
                this.auditData(__URL.sale + 'salesOrder/updateReject',this.pushedBackData,'驳回成功')
            },
            audit(){
                this.auditData(__URL.sale + 'salesOrder/audit',this.pushedBackData,'审核成功')
            },
            auditData(url,param,txt){
                if(!this.ajaxlock){
                    return
                }
                this.ajaxlock=false;
                this.$http.post(url,param).then(
                    res=>{
                        this.ajaxlock=true;
                        if(res.data.success){
                            this.$emit('refresh','success',txt)
                        }else{
                            this.wCfg.show= true
                            this.wCfg.content= res.data.errMsg
                            this.wCfg.type="failure"
                        }
                    }
                )
            },
            //选择客户参照
            checkCustomer(){
                this.customerCfg.show = true
            },
            //设置客户数据及带出来的其它数据
            getCustomer(val){
                this.customerCfg.show = false
                let h = this.infoModal.header
                h.currencyCode = val.currencyCode
                h.currencyName = val.currencyName
                h.currencySymbol = val.currencySymbol
                h.employeeCode = val.employeeCode
                h.employeeName = val.employeeName
                h.recAgreementCode = val.recAgreementCode
                h.recAgreementName = val.recAgreementName
                h.customerCode = val.customerCode
                h.customerName = val.customerName
                h.customerCode = val.customerCode
            },
            //选择人员参照
            checkemployee(){
                this.employeeCfg.show = true
            },
            //设置人员数据
            getEmployee(val){
                let h = this.infoModal.header
                this.employeeCfg.show = false
                h.employeeName = val.employeeName
                h.employeeCode = val.employeeCode
            },
            //选择货品
            checkInventory(item){
                this.currentRow = item
                this.inventoryCfg.show = true
            },
            //赋与当前数据
            getInventory(val){
                this.currentRow = Object.assign(this.currentRow,val)
            },
            //查找币种的值并带出其它值
            getCurrency(){
                let h = this.infoModal.header
                if(h.currencyName == '')return
                let d = this.currencyListData.filter(item=>{
                    return item.currencyName == h.currencyName
                })
                h.currencyCode = d[0].currencyCode
                h.currencyName = d[0].currencyName
                h.currencySymbol = d[0].currencySymbol
            },
            //查找收款协议
            getRace(){
                let h = this.infoModal.header
                if(h.recAgreementName == '')return
                let  d = this.collectListData.filter(item=>{
                    return item.recAgreementName == h.recAgreementName
                })
                h.recAgreementCode = d[0].recAgreementCode
                h.recAgreementName = d[0].recAgreementName
            },
            del(i){
                this.infoModal.dataList.splice(i,1)
            },
            bomSetting(item){
                if(item.recordId == ''){
                    this.wCfg.content = '请先保存草稿'
                    this.wCfg.show = true
                    return
                }
                this.activeItem = item
                this.detailCfg.show = true
            },
            //必填字段校验
            check(){
                let submit = true
                if(this.infoModal.header.customerName.trim() == ''){
                    submit = false
                    this.wCfg.content = '客户名称不能为空'
                    return submit
                }
                if(this.infoModal.dataList.length < 1){
                    submit = false
                    this.wCfg.content = '至少要添加一行货品'
                    return submit
                }else{
                    let d = this.infoModal.dataList
                    for(let i=0,l=d.length;i<l;i++){
                        if(d[i].inventoryName.trim() == ''){
                            submit = false
                            this.wCfg.content = '表单第'+(i+1)+'行的货品不能为空'
                            return false
                        }
                        if(d[i].quantity < 1){
                            submit = false
                            this.wCfg.content = '表单第'+(i+1)+'行的数量不能小于0'
                            return false
                        }
                        if(d[i].taxUnitPrice < 1){
                            submit = false
                            this.wCfg.content = '表单第'+(i+1)+'行的含税单价不能小于0'
                            return false
                        }
                        if(d[i].taxAmounts < 1){
                            submit = false
                            this.wCfg.content = '表单第'+(i+1)+'行的价税合计不能小于0'
                            return false
                        }
                        if(d[i].deliveryDate == ''){
                            submit = false
                            this.wCfg.content = '表单第'+(i+1)+'行的交期不能为空'
                            return false
                        }
                    }
                    return submit
                }

            },
            //查看销售价格详情
            lookPriceInfo(item){
                this.activeItem = item
                this.referPriceCfg.show = true
            }
        },
        filters :{
            //同步计算价税总计
            setTaxt:{
                write(val,oldval,x,index){
                    let d = this.infoModal.dataList[index]
                    if(d[x] != ''){
                        d.taxAmounts = val * d[x]
                    }
                    return val
                }
            },
            //同步计算含税单价
            setUnit:{
                write(val,oldval,index){
                    let d = this.infoModal.dataList[index]
                    if(d.quantity != ''){
                        d.taxUnitPrice = val / d.quantity
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

            <!--<h2 class="tag">货品档案</h2>-->
            <h2 class="tag two-tag"><label>销售订单信息</label><label class="ft-14">销售单号:{{id}}</label></h2>
            <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
            <div class="inner-item form-box">
                <div class="form-group">
                    <label>客户名称:</label>
                    <div v-if="isEdit || add" class="check-input">
                        <input type="text" disabled v-model="infoModal.header.customerName">
                        <i class="icon icon-reference" @click="checkCustomer"></i>
                    </div>
                    <p v-else>{{infoModal.header.customerName}}</p>
                    <refer-customer :config="customerCfg" @cb="getCustomer"></refer-customer>
                </div>
                <div class="form-group">
                    <label>业务员:</label>
                    <div v-if="isEdit || add" class="check-input">
                        <input type="text" disabled v-model="infoModal.header.employeeName">
                        <i class="icon icon-reference" @click="checkemployee"></i>
                    </div>
                    <p v-else>{{infoModal.header.employeeName}}</p>
                    <refer-employee :config="employeeCfg" @cb="getEmployee"></refer-employee>
                </div>
                <div class="form-group">
                    <label>币种:</label>
                    <div v-if="isEdit || add">
                        <select v-model="infoModal.header.currencyName">
                            <option v-for="item in currencyListData" :value="item.currencyName">
                                {{item.currencyName}}
                            </option>
                        </select>
                    </div>
                    <p v-else>{{infoModal.header.currencyName}}</p>

                </div>
                <div class="form-group">
                    <label>客户订单号:</label>
                    <div v-if="isEdit || add">
                        <input type="number" v-model="infoModal.header.customerOrderDocNo">
                    </div>
                    <p v-else>{{infoModal.header.customerOrderDocNo}}</p>
                </div>
                <div class="form-group">
                    <label>收款协议:</label>
                    <div v-if="isEdit || add">
                        <select v-model="infoModal.header.recAgreementName">
                            <option v-for="item in collectListData" :value="item.recAgreementName">
                                {{item.recAgreementName}}
                            </option>
                        </select>
                    </div>
                    <p v-else>{{infoModal.header.recAgreementName}}</p>
                </div>
                <div class="form-group">
                    <label>税率(%):</label>
                    <div v-if="isEdit || add">
                        <input type="number" v-model="infoModal.header.taxRate">
                    </div>
                    <p v-else>{{infoModal.header.taxRate}}</p>
                </div>
                <div class="form-group">
                    <label>结算方式:</label>
                    <div v-if="isEdit || add">
                        <input type="number" v-model="infoModal.header.taxRate">
                    </div>
                    <p v-else>{{infoModal.header.payment}}</p>
                </div>
                <div class="form-group">
                    <label>交货方式:</label>
                    <div v-if="isEdit || add">
                        <input type="number" v-model="infoModal.header.taxRate">
                    </div>
                    <p v-else>{{infoModal.header.dispatchModel}}</p>
                </div>
            </div>

            <div class="inner-item mt-15">
                <div class="form-group ac wd-100">
                    <label>订单图档附件:</label>
                    <upfile-group :data='infoModal.header.salesOrderAttachment' :edit="isEdit || add"></upfile-group>
                </div>
                <div class="form-group ac wd-100">
                    <label>客户订单合同:</label>
                    <upfile-group :config="ugCfgTwo" :data='infoModal.header.customerContractAttachment'
                                  :edit="isEdit || add"></upfile-group>
                </div>
                <div v-if="isEdit || add" class="form-group wd-100">
                    <label>订单备注:</label>
                    <textarea class="h28" v-model="infoModal.header.remark"></textarea>
                </div>
                <div v-else class="form-group wd-100 align-items__baseline">
                    <label>订单备注:</label>
                    <p class="lh-20">{{infoModal.header.remark}}</p>
                </div>
            </div>

            <div class="inner-item">
                <table class="inner-table mt-15">
                    <thead>
                    <tr>
                        <th width="5%">序号</th>
                        <th width="20%">货品信息</th>
                        <th width="10%">数量</th>
                        <th width="10%">价格信息</th>
                        <th width="8%">成本价</th>
                        <th width="10%">价税合计</th>
                        <th width="15%">交货日期</th>
                        <th width="15%">可用库存</th>
                        <th width="13%">备注</th>
                        <th width="9%">查看Bom</th>
                    </tr>
                    </thead>
                    <tbody>
                    <template v-if="isEdit || add">
                        <tr v-for="item in infoModal.dataList">
                            <td>{{$index+1}}</td>
                            <td>
                                <div class="edit-check-wrap" v-else>
                                    <div class="check-input">
                                        <input type="text" disabled v-model="item.inventoryCode">
                                        <i class="icon icon-reference" @click="checkInventory(item)"></i>
                                    </div>
                                    <div class="check-input">
                                        <input type="text" disabled v-model="item.inventoryName">
                                        <i class="icon icon-reference" @click="checkInventory(item)"></i>
                                    </div>
                                    <input type="text" disabled v-model="item.inventorySpec">
                                </div>
                            </td>
                            <td>
                                <input class="wd100" disabled type="text" v-model="item.unitName ">
                            </td>
                            <td>
                                <input-number class="wd100" :code.sync="item.quantity | setTaxt 'taxUnitPrice' $index"
                                              key="quantity"></input-number>
                            </td>
                            <td>
                                <input-number class="wd100" :code.sync="item.taxUnitPrice| setTaxt 'quantity' $index"
                                              key="price"></input-number>
                            </td>
                            <td>
                                <input-number class="wd100" :code.sync="item.taxAmounts | setUnit $index"
                                              key="price"></input-number>
                            </td>
                            <td>
                                <date-picker :date.sync="item.deliveryDate" :config="dateCfg"></date-picker>
                            </td>
                            <td>
                                <textarea class="wd100 h60" v-model="item.rowRemark"></textarea>
                            </td>
                            <td>
                                <div class="show-operation">
                                    <button class="button-primary" v-if="item.attributeCode == '1' || item.attributeCode == '2'" @click="bomSetting(item)">查看配置</button>
                                    <button class="button-primary" @click="del($index)">删除</button>
                                </div>
                            </td>
                        </tr>
                    </template>
                    <template v-else>
                        <tr v-for="item in infoModal.dataList">
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
                                {{item.quantity}}
                            </td>
                            <td>
                                <div class="show-wrap">
                                    <p>单价:{{item.taxUnitPrice}}<i class="icon icon-light" @click="lookPriceInfo(item)"></i></p>
                                    <p>单位:{{item.unitName}}</p>
                                </div>

                            </td>
                            <td>
                                {{item.costPrice}}
                            </td>
                            <td>
                                {{item.taxAmounts}}
                            </td>
                            <td>
                                {{item.deliveryDate}}
                            </td>
                            <td>
                                {{item.abledStockQty}}
                            </td>
                            <td>
                                <div class="show-wrap">
                                    <p class="lh-20">{{item.rowRemark}}</p>
                                </div>
                            </td>
                            <td>
                                <div class="show-operation">
                                    <button v-if="item.recordId != '' && (item.attributeCode == '1' || '2' == item.attributeCode)"
                                       @click="bomSetting(item)" class="button-primary">查看配置</button>
                                </div>
                            </td>
                        </tr>
                    </template>
                    </tbody>
                </table>
                <refer-inventory :config="inventoryCfg" @cb="getInventory"></refer-inventory>
                <div class="add-wrap" v-if="isEdit || add">
                    <button @click="addRow"><i class="icon icon-product__add"></i>&nbsp;增加货品</button>
                </div>
            </div>
        </div>
    </div>

    <div class="inner-footer">
        <!--<slot v-if="infoModal.header.docStatus == -1 || infoModal.header.docStatus == -2" >
            <button class="btn-xl-def" @click="show.show=false">取消</button>
            <button class="btn-xl-imp" @click="edit" v-if="!add && !isEdit">编辑</button>
            <button class="btn-xl-imp" @click="save(false)" v-if="isEdit || add" >保存草搞</button>
            <button class="btn-xl-imp" @click="save(true)" >提交审核</button>
        </slot>-->
        <button class="btn-xl-def" @click="show.show=false" v-if="infoModal.header.docStatus == 0">取消</button>
        <button class="btn-xl-def" @click="show.show=false" v-else>关闭</button>
        <ajax-button class="btn-xl-def" @click="returnAudit" v-if="infoModal.header.docStatus == 0">驳回</ajax-button>
        <ajax-button class="btn-xl-imp" @click="audit" v-if="infoModal.header.docStatus == 0">审核</ajax-button>
    </div>

    <!--提示-->
    <warning :config="wCfg"></warning>

    <!--Bom设置-->
    <inner :config='detailCfg'>
        <bomsetting :act="activeItem" :show="detailCfg" :workflow="workflow"></bomsetting>
    </inner>

    <refer-goods-price :config="referPriceCfg" :data="activeItem" :read-only="true" :refer-type="'customer'"></refer-goods-price>
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
    .icon{
        margin-right: 0px!important;
        margin-left: 3px;
        color: #ffd830;

        &:hover{
            color: @link-hover;
            cursor: pointer;
        }
    }
</style>
