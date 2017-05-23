<script>
import bomsetting from './bomSetting'
import inventory  from '../../development/inventory/item.vue'
import customer from '../../crm/customerDevAndRelation/newCustomer.vue'
export default {
    components:{
        bomsetting,inventory,customer
    },
    props:['id','add','show','presetData'],
    data() {
        return {
            selfReg:{
                limit:''
            },
            flowCfg:{
              data: []
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
            inventoryCfg:{
                key:'inventoryName',
                code:'inventoryCode',
                refer:['inventoryId', 'inventoryName','inventoryCode','attributeCode','attributeName','inventorySpec','unitCode','unitName','stockQuantity','abledStockQty','firstInventoryCategoryCode','firstInventoryCategoryName','secondInventoryCategoryCode','secondInventoryCategoryName','inventoryTypeCode','inventoryTypeName'],
                item: ['inventoryId', 'inventoryName','inventoryCode','attributeCode','attributeName','inventorySpec','unitCode','unitName','stockQuantity','abledStockQty','firstInventoryCategoryCode','firstInventoryCategoryName','secondInventoryCategoryCode','secondInventoryCategoryName','inventoryTypeCode','inventoryTypeName'],
                del: ['inventoryId', 'inventoryName','inventoryCode','attributeCode','attributeName','inventorySpec','unitCode','unitName','stockQuantity','abledStockQty','firstInventoryCategoryCode','firstInventoryCategoryName','secondInventoryCategoryCode','secondInventoryCategoryName','inventoryTypeCode','inventoryTypeName'],
                addNew:{
                    name:'新增货品档案',
                    icon:'icon-hp_list__add'
                }
            },
            customerCfg:{
                key:'customerName',
                code:'customerCode',
                refer:['customerName','customerCode','currencyCode','currencyName','employeeCode','employeeName','recAgreementCode','recAgreementName','customerCategoryCode','customerCategoryName','exchangeRate','taxRate','paymentName','dispatchModelName'],
                item:['customerName','customerCode','currencyCode','currencyName','employeeCode','employeeName','recAgreementCode','recAgreementName','customerCategoryCode','customerCategoryName','exchRate','taxRate','payment','dispatchModel'],
                del:['customerName','customerCode','currencyCode','currencyName','employeeCode','employeeName','recAgreementCode','recAgreementName','customerCategoryCode','customerCategoryName','exchRate','taxRate','payment','dispatchModel'],
                addNew:{
                    name:'新增客户档案',
                    icon:'icon-hp_list__add'
                }
            },
            ajaxlock:true,
            beforeChangeAttributeCode:'',
            changeCfg:{
                show: false,
                type:'warning',
                title:'属性更改提示',
            },
            activeIndex:'',
            newInventoryCfg:{
                show: false,
                title: '新增货品档案'
            },
            newCustomerCfg:{
                show: false,
                title: '新增客户档案'
            },
            referPriceCfg:{
                show: false,
                url:__URL.sale + 'pricing/findSalePriceRef/'
            },
            selectedItem:''
        }
    },
    ready(){
        this.getSelectList()
        if(this.id)this.getInfo()
        if(this.presetData != undefined && this.presetData != ''){
            this.infoModal = this.presetData
        }
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
                this.wCfg.type="failure"
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
                        this.wCfg.type="success"
                        this.wCfg.content="保存成功！"
                        this.wCfg.show= true
                        this.$emit('refresh','success',"保存成功");
                        
                        //切换页面状态
                        this.isEdit = false
                        this.add = false
                        //将返回的数据赋给pushData，给编辑、提交审核时用
                        this.pushedBackData = res.data.data
                        //新增后，更新infoModal的数据
                         this.id =this.infoModal.header.docNo = this.pushedBackData.docNo
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
                this.auditData(__URL.sale+ 'salesOrder/auditDraft',this.pushedBackData,'提交审核')
         },
         giveUpAudit(){
                this.auditData(__URL.sale + 'salesOrder/unAudit',this.pushedBackData,'弃审')
         },
         returnAudit(){
                this.auditData(__URL.sale + 'salesOrder/updateReject',this.pushedBackData,'驳回')
         },
         audit(){
                this.auditData(__URL.sale + 'salesOrder/audit',this.pushedBackData,'审核')
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
                if(!item.inventoryId || !item.quantity){
                    this.wCfg.type="warning"
                    this.wCfg.content = '请先选择货品和数量'
                    this.wCfg.show = true
                    return
                }
                var params={
                    inventoryId:item.inventoryId,
                    quantity:item.quantity,
                    attributeCode:item.attributeCode,
                    attributeName:item.attributeName,
                    docNo:this.infoModal.header.docNo
                }
                this.$http.post(__URL.sale + 'salesOrder/insertSalesOrderTemp',params).then(
                    res=>{
                       if(res.data.success){
                            item.recordId=res.data.data.recordId
                            this.infoModal.header.docNo=res.data.data.docNo
                            this.activeItem = item
                            this.detailCfg.show = true
                       }
                    }
                )
            }else{
                this.activeItem = item
                this.detailCfg.show = true
            }
         },
         //必填字段校验
         check(){
            let submit = true
            if(this.infoModal.header.customerName.trim() == ''){
                submit = false
                this.wCfg.content = '客户名称不能为空'
                return submit
            }
             if(this.infoModal.header.employeeName.trim() == ''){
                 submit = false
                 this.wCfg.content = '业务员名称不能为空'
                 return submit
             }
             if(this.infoModal.header.currencyName.trim() == ''){
                 submit = false
                 this.wCfg.content = '币种不能为空'
                 return submit
             }
             if(this.infoModal.header.taxRate == ''|| this.infoModal.header.taxRate == undefined){
                 submit = false
                 this.wCfg.content = '税率不能为空'
                 return submit
             }
             if(Number(this.infoModal.header.taxRate) > 100 || Number(this.infoModal.header.taxRate) < 0){
                 submit = false
                 this.wCfg.content = '税率不在数据范围内'
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
                    if(d[i].quantity <= 0){
                        submit = false
                        this.wCfg.content = '表单第'+(i+1)+'行的数量不能小于0'
                        return false
                    }
                    if(d[i].taxUnitPrice <= 0){
                        submit = false
                        this.wCfg.content = '表单第'+(i+1)+'行的含税单价不能小于0'
                        return false
                    }
                    if(d[i].taxAmounts <= 0){
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
         closeBom(){
            this.wCfg.type='success'
            this.wCfg.content = '保存成功'
            this.wCfg.show = true
            this.detailCfg.show = false
            this.getInfo()
         },
         getWareHouse(data,val){
             this.$http.get(__URL.sale + 'salesOrder/findStockQty/'+val.inventoryId).then(
                 res=>{
                    if(res.data.success){
                        data.abledStockQty = res.data.data.abledStockQty;
                        data.stockQuantity = res.data.data.stockQuantity;
                    }
                 }
             )
         },
         //修改货品属性
         changeAttribute(code,index){
            this.activeIndex=index;
            //根据新的code获取新的属性
            var newAttributeName='';
            if(code==0){
                newAttributeName='采购件'
            }else if(code==1){
                newAttributeName='自制件'
            }else if(code==2){
                newAttributeName='委外加工件'
            }
            this.changeCfg.msg='是否将该货品的属性更改为'+newAttributeName+'?'
            this.changeCfg.show=true
         },
         sureChange(){
            //根据新的code计算新的name
            if(this.infoModal.dataList[this.activeIndex].attributeCode==0){
                this.infoModal.dataList[this.activeIndex].attributeName='采购件'
            }else if(this.infoModal.dataList[this.activeIndex].attributeCode==1){
                this.infoModal.dataList[this.activeIndex].attributeName='自制件'
            }else if(this.infoModal.dataList[this.activeIndex].attributeCode==2){
                this.infoModal.dataList[this.activeIndex].attributeName='委外加工件'
            }
         },
         cancelChange(){
            //将选择的属性还原回去
            this.infoModal.dataList[this.activeIndex].attributeCode=this.beforeChangeAttributeCode
         },
         //新增货品档案
         addNewInventory(){
            this.newInventoryCfg.show=true
         },
         //带出新增的货品档案
         closeNewInventory(item){
            if(item){
                this.infoModal.dataList[this.activeIndex].inventoryId=item.inventoryId;
                this.infoModal.dataList[this.activeIndex].inventoryName=item.inventoryName;
                this.infoModal.dataList[this.activeIndex].inventoryCode=item.inventoryCode;
                this.infoModal.dataList[this.activeIndex].attributeCode=item.attributeCode;
                this.infoModal.dataList[this.activeIndex].attributeName=item.attributeName;
                this.infoModal.dataList[this.activeIndex].inventorySpec=item.inventorySpec;
                this.infoModal.dataList[this.activeIndex].unitCode=item.unitCode;
                this.infoModal.dataList[this.activeIndex].unitName=item.unitName;
                this.infoModal.dataList[this.activeIndex].stockQuantity=item.stockQuantity;
                this.infoModal.dataList[this.activeIndex].abledStockQty=item.abledStockQty;
                this.infoModal.dataList[this.activeIndex].firstInventoryCategoryCode=item.firstInventoryCategoryCode;
                this.infoModal.dataList[this.activeIndex].firstInventoryCategoryName=item.firstInventoryCategoryName;
                this.infoModal.dataList[this.activeIndex].secondInventoryCategoryCode=item.secondInventoryCategoryCode;
                this.infoModal.dataList[this.activeIndex].secondInventoryCategoryName=item.secondInventoryCategoryName;
                this.infoModal.dataList[this.activeIndex].inventoryTypeCode=item.inventoryTypeCode;
                this.infoModal.dataList[this.activeIndex].inventoryTypeName=item.inventoryTypeName;
            }
            this.newInventoryCfg.show=false
         },
         //新增客户档案
         addNewCustomer(){
            this.newCustomerCfg.show=true
         },
         closeNewCustomer(msg,item){
            if(item){
                this.infoModal.header.customerName=item.customerName;
                this.infoModal.header.customerCode=item.customerCode;
                this.infoModal.header.currencyCode=item.currencyCode;
                this.infoModal.header.currencyName=item.currencyName;
                this.infoModal.header.employeeCode=item.employeeCode;
                this.infoModal.header.employeeName=item.employeeName;
                this.infoModal.header.recAgreementCode=item.recAgreementCode;
                this.infoModal.header.recAgreementName=item.recAgreementName;
                this.infoModal.header.customerCategoryCode=item.customerCategoryCode;
                this.infoModal.header.customerCategoryName=item.customerCategoryName;
                this.infoModal.header.exchRate=item.exchRate;
                this.infoModal.header.taxRate=item.taxRate;
                this.infoModal.header.payment=item.payment;
                this.infoModal.header.dispatchModel=item.dispatchModel;
            }
            this.newCustomerCfg.show=false;
         },
         //打开价格参照
         openPrice(item,index){
            this.selectedItem=item;
            this.activeIndex=index;
            this.referPriceCfg.show=true;
         },
         getPrice(item){
            if(item)this.infoModal.dataList[this.activeIndex].taxUnitPrice=item.taxUnitPrice
         },
         activeline(index){
            this.activeIndex=index
         },
         closeModal(){
             this.show.show=false
             this.$emit('quite')
         }
    },
    filters :{
        //同步计算价税总计
        setTaxt:{
            write(val,oldval,x,index){
                val=Number(val)
                if(isNaN(val)){
                    val=oldval
                }
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
                val=Number(val)
                if(isNaN(val)){
                    val=oldval
                }
                let d = this.infoModal.dataList[index]
                if(d.quantity != ''){
                    d.taxUnitPrice = val / d.quantity
                }
                return val
            }
        },
        changeAttributeCode:{
            write(val,oldval){
                this.beforeChangeAttributeCode=oldval
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
                        <label><span v-if="isEdit || add" class="must-point">*</span>客户名称:</label>
                            <div v-if="isEdit || add" class="check-input">
                                <fuzzy-customer :config="customerCfg" @addnew='addNewCustomer' :data='infoModal.header' ></fuzzy-customer>
                            </div>
                            <p  v-else >{{infoModal.header.customerName}}</p>
                    </div>
                    <div class="form-group">
                        <label><span v-if="isEdit || add" class="must-point">*</span>业务员:</label>
                        <div v-if="isEdit || add"class="check-input">
                            <fuzzy-employee :data='infoModal.header'></fuzzy-employee>
                        </div>
                        <p  v-else >{{infoModal.header.employeeName}}</p>
                    </div>
                    <div class="form-group">
                        <label><span v-if="isEdit || add" class="must-point">*</span>币种:</label>
                        <div v-if="isEdit || add">
                            <select v-model="infoModal.header.currencyName">
                                <option v-for="item in currencyListData" :value="item.currencyName">{{item.currencyName}}</option>
                            </select>
                        </div>
                        <p v-else >{{infoModal.header.currencyName}}</p>

                    </div>
                    <div class="form-group">
                        <label>客户订单号:</label>
                        <div v-if="isEdit || add" >
                            <input type="text" maxlength='20' v-model="infoModal.header.customerOrderDocNo">
                        </div>
                        <p v-else>{{infoModal.header.customerOrderDocNo}}</p>
                    </div>
                    <div class="form-group">
                        <label>收款协议:</label>
                        <div v-if="isEdit || add" >
                            <select v-model="infoModal.header.recAgreementName">
                                <option v-for="item in collectListData" :value="item.recAgreementName">{{item.recAgreementName}}</option>
                            </select>
                        </div>
                        <p v-else>{{infoModal.header.recAgreementName}}</p>
                    </div>
                    <div class="form-group">
                        <label><span v-if="isEdit || add" class="must-point">*</span>税率(%):</label>
                        <div v-if="isEdit || add" >
                            <input-number :code.sync="infoModal.header.taxRate" type="number"></input-number>
                        </div>
                        <p v-else>{{infoModal.header.taxRate}}</p>
                    </div>
                    <div class="form-group">
                        <label>结算方式:</label>
                        <div v-if="isEdit || add">
                            <select v-model="infoModal.header.payment">
                                <option v-for="item in paymentData" :value="item.paymentName">{{item.paymentName}}</option>
                            </select>
                        </div>
                        <p v-else >{{infoModal.header.payment}}</p>
                    </div>
                    <div class="form-group">
                        <label>交货方式:</label>
                        <div v-if="isEdit || add">
                            <select v-model="infoModal.header.dispatchModel">
                                <option value="FOB">FOB</option>
                                <option value="CIF">CIF</option>
                                <option value="EXW">EXW</option>
                            </select>
                        </div>
                        <p v-else >{{infoModal.header.dispatchModel}}</p>
                    </div>
                </div>

                <div class="inner-item">
                    <div class="form-group ac wd-100">
                        <label>订单图档附件:</label>
                        <upfile-group :data='infoModal.header.salesOrderAttachment' :edit="isEdit || add"></upfile-group>
                    </div>
                    <div class="form-group ac wd-100">
                        <label>客户订单合同:</label>
                        <upfile-group :config="ugCfgTwo" :data='infoModal.header.customerContractAttachment' :edit="isEdit || add"></upfile-group>
                    </div>
                    <div class="form-group">
                        <label>订单备注:</label>
                        <div v-if="isEdit || add">
                            <textarea class="h28" v-model="infoModal.header.remark"></textarea>
                        </div>
                        <p v-else class="lh-20">{{infoModal.header.remark}}</p>
                    </div>
                </div>

                <div class="inner-item">
                    <table class="inner-table it-fix">
                        <thead>
                            <tr>
                                <th width="5%">序号</th>
                                <th width="20%">货品信息</th>
                                <th width="10%">数量</th>
                                <th width="15%">价格信息</th>
                                <th width="10%">价税合计</th>
                                <th width="15%">交货日期</th>
                                <th width="18%">可用库存</th>
                                <th width="15%">备注</th>
                                <th width="9%">编辑Bom</th>
                            </tr>
                        </thead>
                        <tbody>
                        <template v-if="isEdit || add">
                                <tr v-for="item in infoModal.dataList" @click='activeline($index)'>
                                    <td>{{$index+1}}</td>
                                    <td>
                                        <div class="edit-check-wrap" v-else>
                                            <div class="check-input">
                                                <fuzzy-inventory @addnew='addNewInventory' @cb="getWareHouse" :config="inventoryCfg"  :data="item"> </fuzzy-inventory>
                                            </div>
                                            <input type="text" class="check-input" disabled v-model="item.inventoryCode">
                                            <input type="text" class="check-input" disabled v-model="item.inventorySpec">
                                            <select v-if='edit' @change='changeAttribute(item.attributeCode,$index)' v-model='item.attributeCode | changeAttributeCode'>
                                                <option :value='"0"'>采购件</option>
                                                <option :value='1'>自制件</option>
                                                <option :value='2'>委外加工件</option>
                                            </select>
                                            <!-- <input type="text" disabled v-model="item.attributeName"> -->
                                        </div>
                                    </td>
                                    <td>
                                        <input-number class="wd-100"  :code.sync="item.quantity | setTaxt 'taxUnitPrice' $index" key="quantity"></input-number>
                                    </td>
                                    <td>
                                        <div class='form-group wd-100 s-input'>
                                            <label style='width:28px'>单价:</label><input-number style='margin:0'  :code.sync="item.taxUnitPrice| setTaxt 'quantity' $index" key="price"></input-number>
                                            <i v-if='item.inventoryCode' class=" icon icon-search newPrice" @click='openPrice(item,$index)'></i>
                                        </div>
                                        <p style='text-align:left'>单位:{{item.unitName}}</p>
                                    </td>
                                    <td>
                                        <input-number class="wd-100"  :code.sync="item.taxAmounts | setUnit $index" key="price"></input-number>
                                    </td>
                                    <td>
                                        <date-picker :date.sync="item.deliveryDate" :config="dateCfg"></date-picker>
                                    </td>
                                    <td>
                                        {{ item.stockQuantity }}
                                    </td>
                                    <td>
                                        <textarea class="wd-100 h60" v-model="item.rowRemark"></textarea>
                                    </td>
                                    <td> 
                                        <div class="show-operation">
                                            <button v-if="(item.attributeCode == '1' || item.attributeCode == '2' )" @click='bomSetting(item)'
                                                    class="button-primary" style="margin-bottom: 8px;">Bom配置</button>
                                            <button class="button-danger" @click='del($index)'>删除</button>
                                        </div>
                                    </td>
                                </tr>
                            </template>
                            <template  v-else>
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
                                        {{item.quantity}}
                                    </td>
                                    <td>
                                        <p>单价:{{item.taxUnitPrice}}</p>
                                        <p>单位:{{item.unitName}}</p>
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
                                            <button v-if="item.recordId != '' && (item.attributeCode == '1' || item.attributeCode == '2' )" @click='bomSetting(item)'
                                                    class="button-primary" style="margin-bottom: 8px;">Bom配置</button>
                                        </div>
                                    </td>
                                </tr>
                            </template>
                        </tbody>
                    </table>

                    <div class="add-wrap" v-if="isEdit || add">
                        <button @click="addRow"><i class="icon icon-product__add"></i>&nbsp;增加货品</button>
                    </div>
                </div>
        </div>
    </div>
    <div class="inner-footer">
        <button class="btn-xl-def" @click="closeModal">{{ infoModal.header.docStatus == -2 || infoModal.header.docStatus == 2 || infoModal.header.docStatus === '' ? '取消' : '关闭' }}</button>
        <slot v-if="infoModal.header.docStatus == -2 || infoModal.header.docStatus == 2 || infoModal.header.docStatus === ''" >
            <button class="btn-xl-imp" @click="edit" v-if="!add && !isEdit">编辑</button>
            <ajax-button class="btn-xl-imp" @click="save(false)" v-if="isEdit || add" >保存草搞</ajax-button>
            <ajax-button class="btn-xl-imp" @click="save(true)" >提交审核</ajax-button>
        </slot>
        <!--<button class="btn-xl-imp" @click="audit" v-if="infoModal.header.docStatus == 0">审核</button>-->
        <!--<button class="btn-xl-imp" @click="returnAudit" v-if="infoModal.header.docStatus == 0">驳回</button>-->
        <!--<button class="btn-xl-imp" @click="giveUpAudit" v-if="infoModal.header.docStatus == 1">弃审</button>-->
    </div>

    <!--提示-->
    <warning :config="wCfg"></warning>
    <alert :config='changeCfg' @cb='sureChange' @quite='cancelChange'></alert>
    <!--Bom设置-->
    <inner :config='detailCfg'>
        <bomsetting :act="activeItem" @refresh="closeBom" :show="detailCfg" :docstatus='infoModal.header.docStatus'></bomsetting>
    </inner>
    <!-- 新增货品选项 -->
    <inner :config.sync='newInventoryCfg'>
        <inventory :edit='0' :data='{}' :type="1" @cb='closeNewInventory'></inventory>
    </inner>
    <!-- 新增客户选项 -->
    <inner :config.sync='newCustomerCfg'>
        <customer  @refresh='closeNewCustomer'></customer>
    </inner>
    <!-- 货品价目参照 -->
    <refer-goods-price :config="referPriceCfg" :data="selectedItem" @cb="getPrice" :refer-type="'customer'"></refer-goods-price>
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
    .newPrice{
        position: absolute;
        width: 28px;
        height: 28px;
        line-height: 28px;
        text-align: center;
        top: 0px;
        margin-right: 0;
        cursor: pointer;
        right: 0;
        border-left: 1px solid #F2F3F3;
    }
</style>
