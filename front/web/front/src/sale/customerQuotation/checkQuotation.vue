<script>
    import cfg from './cfg'
    export default {
        props:['quotationDetail','show'],
        data() {
            return {
                modalCfg: {
                    show: true,
                    title: '客户报价单'
                },
                tabConfig: {
                    type:'page',
                    select: 'contactsTab',
                    tabBarData: []
                },
                msgConfig:{
                    show:false,
                    content:'提交成功',
                    type:'success'
                },
                inventoryCfg:{
                    key:'inventoryName',
                    code:'inventoryCode',
                    refer:['inventoryId', 'inventoryName','inventoryCode','attributeCode','attributeName','inventorySpec','unitCode','unitName','firstInventoryCategoryCode','firstInventoryCategoryName','secondInventoryCategoryCode','secondInventoryCategoryName'],
                    item: ['inventoryId', 'inventoryName','inventoryCode','attributeCode','attributeName','inventorySpec','unitCode','unitName','firstInventoryCategoryCode','firstInventoryCategoryName','secondInventoryCategoryCode','secondInventoryCategoryName'],
                    del:['inventoryId', 'inventoryName','inventoryCode','attributeCode','attributeName','inventorySpec','unitCode','unitName','firstInventoryCategoryCode','firstInventoryCategoryName','secondInventoryCategoryCode','secondInventoryCategoryName']
                },

                customerCfg:{
                    key:'customerName',
                    code:'customerCode',
                    refer:['customerCategoryCode','customerCategoryName','customerName','customerCode','currencyCode','currencyName','currencySymbol','employeeCode','employeeName','taxRate'],
                    item:['customerCategoryCode','customerCategoryName','customerName','customerCode','currencyCode','currencyName','currencySymbol','employeeCode','employeeName','taxRate'],
                    del:['customerName','customerCode'],
                },
                uCfg:{
                    limit:6,
                },
                isEdit:true,
                formEdit:false,
                upData:[],
                defaultRow: {
                    inventoryId:"",
                    inventoryCode:"",
                    attributeCode:"",
                    attributeName:"",
                    inventoryName:"",
                    inventorySpec:"",
                    unitCode: "",
                    unitName: "",
                    startQuantity: 0,
                    endQuantity: 0,
                    taxUnitPrice: "",
                    rowRemark: "",
                    effectiveDate: "",
                    expiryDate: ""
                },
                newQuotation:this.quotationDetail,
                newQuotationHeader:this.quotationDetail.header,
                tableConfig : this.quotationDetail.dataList,
                ajaxLock:true,
                rowIndex:0,
                allCurrency:[],
                auditStatusVo:{
                    "docNo":this.quotationDetail.header.docNo,
                    "recordVersions":this.quotationDetail.dataList
                }
            }
        },
        methods: {
            //增加单行
            addRow() {
                var tmpDefaultRow = Object.assign({}, this.defaultRow);
                this.tableConfig.push(tmpDefaultRow);
            },

            delRow(index) {
                if (this.tableConfig.length == 1) {
                    alert("表格必须保留一行！");
                    return;
                }
                this.tableConfig.splice(index, 1);
                return;
                //中断

                if( this.tableConfig[index].recordId &&  this.tableConfig[index].recordId != ""){
                    this.delData(index);
                }else{
                    this.tableConfig.splice(index, 1);
                }
            },
            saveSumbit() {

                if(!this.check()){
                    this.msgConfig.show = true
                    this.msgConfig.type = "warning"
                    return false
                }

                if(!this.ajaxLock){
                    return
                }
                if(this.newQuotation.header.attachmentVos == ""){
                    this.newQuotation.header.attachmentVos = [];
                }

                for(var i=0;i<this.allCurrency.length;i++){
                    let _c = this.allCurrency[i]
                    if(_c.currencyCode == this.newQuotationHeader.currencyCode){
                        this.newQuotationHeader.currencyName = _c.currencyName;
                    }
                }

                this.ajaxLock=false;
                this.$http.post(__URL.sale + 'customer/quotation/updateSubmit', this.newQuotation).then( (res) => {
                        this.ajaxLock=true;
                        if(res.data.success){
                            this.show = false;
                            this.formEdit = false
                        }else{
                            this.msgConfig.show=true;
                            this.msgConfig.type='failure';
                            this.msgConfig.content = res.data.errMsg;
                        }
                    }
                )


            },
            saveDraft() {

                if(!this.check()){
                    this.msgConfig.show = true
                    this.msgConfig.type = "warning"
                    return false
                }

                if(!this.ajaxLock){
                    return
                }
                if(this.newQuotation.header.attachmentVos == ""){
                    this.newQuotation.header.attachmentVos = [];
                }

                for(var i=0;i<this.allCurrency.length;i++){
                    let _c = this.allCurrency[i]
                    if(_c.currencyCode == this.newQuotationHeader.currencyCode){
                        this.newQuotationHeader.currencyName = _c.currencyName;
                    }
                }

                this.ajaxLock=false;
                this.$http.post(__URL.sale + 'customer/quotation/updateDraft', this.newQuotation).then( (res) => {
                        this.ajaxLock=true;
                        if(res.data.success){
                            this.msgConfig.type="success"
                            this.msgConfig.show = true
                            this.msgConfig.msg = "保存成功"
                            this.show = false;
                            this.formEdit = false
                            this.$emit('closeNewQuotation');
                        }else{
                            this.msgConfig.show=true;
                            this.msgConfig.type='failure';
                            this.msgConfig.content = res.data.errMsg;
                        }
                    }
                )


            },
            sumbitAudit() {

                if(!this.ajaxLock){
                    return
                }

                this.ajaxLock=false;
                this.$http.post(__URL.sale + 'customer/quotation/updateSumbit', this.auditStatusVo).then( (res) => {
                        this.ajaxLock=true;
                        if(res.data.success){
                            this.show = false;
                        }else{
                            this.msgConfig.show=true;
                            this.msgConfig.type='failure';
                            this.msgConfig.content = res.data.errMsg;
                        }
                    }
                )


            },
            check(){
                if(this.newQuotationHeader.customerCode == ''){
                    this.msgConfig.content = '客户不能为空'
                    return false
                }
                if(this.newQuotationHeader.employeeCode == ''){
                    this.msgConfig.content = '业务员不能为空'
                    return false
                }
                if(this.newQuotationHeader.currencyCode == ''){
                    this.msgConfig.content = '币种不能为空'
                    return false
                }
                if(this.newQuotationHeader.taxRate == ''){
                    this.msgConfig.content = '税率不能为空'
                    return false
                }

                if(this.newQuotationHeader.taxRate >100){
                    this.msgConfig.content = '税率不在数据范围内'
                    return false
                }

                if(this.tableConfig.length < 1){
                    this.msgConfig.content = '至少要添加一行货品'
                    return false
                }else{
                    for(let i=0,l=this.tableConfig.length;i<l;i++){

                        if(this.tableConfig[i].inventoryId.trim() == ''){
                            this.msgConfig.content = '表单第'+(i+1)+'行的货品不能为空'
                            return false
                        }

                        if(!this.tableConfig[i].startQuantity || this.tableConfig[i].startQuantity <= 0){
                            this.msgConfig.content = '表单第'+(i+1)+'行的从数量必须大于0'
                            return false
                        }

                        if(!this.tableConfig[i].endQuantity || Number(this.tableConfig[i].endQuantity) < Number(this.tableConfig[i].startQuantity)){
                            this.msgConfig.content = '表单第'+(i+1)+'行的到数量不能小于从数量'
                            return false
                        }

                        if(!this.tableConfig[i].taxUnitPrice || this.tableConfig[i].taxUnitPrice <= 0){
                            this.msgConfig.content = '表单第'+(i+1)+'行的含税单价必须大于0'
                            return false
                        }

                        if(this.tableConfig[i].effectiveDate.trim() == ''){
                            this.msgConfig.content = '表单第'+(i+1)+'行的生效日期不能为空'
                            return false
                        }

                        if(this.tableConfig[i].expiryDate.trim() == ''){
                            this.msgConfig.content = '表单第'+(i+1)+'行的失效日期不能为空'
                            return false
                        }
                        if(this.tableConfig[i].expiryDate<=this.tableConfig[i].effectiveDate) {
                            this.msgConfig.content = '表单第'+(i+1)+'行的失效日期必须大于生效日期'
                            return false
                        }
                    }
                }
                return true
            },
            audit(){
                if(!this.ajaxLock){
                    return
                }

                this.ajaxLock=false;
                this.$http.post(__URL.sale + 'customer/quotation/audit', this.auditStatusVo).then( (res) => {
                        this.ajaxLock=true;
                        if(res.data.success){
                            this.show = false;
                        }else{
                            this.msgConfig.show=true;
                            this.msgConfig.type='failure';
                            this.msgConfig.content = res.data.errMsg;
                        }
                    }
                )
            },
            refusal(){
                if(!this.ajaxLock){
                    return
                }

                this.ajaxLock=false;
                this.$http.post(__URL.sale + 'customer/quotation/updateRefusal', this.auditStatusVo).then( (res) => {
                        this.ajaxLock=true;
                        if(res.data.success){
                            this.show = false;
                        }else{
                            this.msgConfig.show=true;
                            this.msgConfig.type='failure';
                            this.msgConfig.content = res.data.errMsg;
                        }
                    }
                )

            },
            delData(index){
                var delRow = this.tableConfig[index];
                var recordId = delRow.recordId;
                if(!this.ajaxLock){
                    return
                }
                this.ajaxLock=false;
                this.$http.get(__URL.sale + 'customer/quotation/deleteRecord/'+recordId).then( (res) => {
                        console.log(res.data.success);
                        this.ajaxLock=true;
                        if(res.data.success){
                            this.tableConfig.splice(index, 1);
                        }else{
                            alert(res.data.errMsg);
                        }
                    }
                );

            },
            delDoc(){
                var docNo = this.newQuotationHeader.docNo;
                if(!this.ajaxLock){
                    return
                }
                this.ajaxLock=false;
                this.$http.get(__URL.sale + 'customer/quotation/deleteDoc/'+docNo).then( (res) => {
                        this.ajaxLock=true;
                        this.show = false;
                    }
                );
            }
        },
        ready() {
            this.$http.post(__URL.arc+'currency/local',{}).then(
                (res) => {
                    if(res.data.success){
                        this.allCurrency=res.data.data;
                        for(var i=0;i<this.allCurrency.length;i++){
                            if(this.allCurrency[i].localCurrency=='是'){
                                this.allCurrency[i].localCurrency='true'
                            }
                        }
                    }
                },
                (err) => {
                    console.log('初始化未能拿到币种数据')
                }
            )
        },
        filters :{
            //同步计算价税总计
            setTaxt:{
                write(val,oldval,x,index){
                    let d = this.tableConfig[index]
                    let taxRate = this.newQuotationHeader.taxRate
                    if(d[x] != ''){
                        d.taxAmounts = val * d[x];
                        if(taxRate != ''){
                            d.tax = parseFloat(d.taxAmounts * (taxRate/100)).toFixed(5);
                        }
                    }
                    return val
                }
            },
            //同步计算含税单价
            setUnit:{
                write(val,oldval,index){
                    let d = this.tableConfig[index]
                    let taxRate = this.newQuotationHeader.taxRate
                    if(d.quantity != ''){
                        d.taxUnitPrice = val / d.quantity
                        if(taxRate != ''){
                            d.tax = parseFloat(d.taxAmounts * (taxRate/100)).toFixed(5);
                        }
                    }
                    return val
                }
            },
        }
    }

</script>
<template  :config='modalCfg'>
    <!--<button class="btn-lg-imp" @click='modal'>内页弹窗按钮</button>-->
    <!-- 弹框内置dom结构 -->
    <!--<inner :config='modalCfg'>-->
    <div class="inner-wrapper">
        <div class="inner-content">

            <h2 class="tag two-tag"><label>报价单信息</label><label class="ft-14">报价单号:{{quotationDetail.header.docNo}}</label></h2>

            <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
            <div class="inner-item form-box">
                <div class="form-group">
                    <label><span v-if="formEdit" class="must-point">*</span>客户:</label>
                    <div v-if="formEdit" class="s-input ic2">
                        <div class="check-input">
                            <fuzzy-customer :config="customerCfg" :data='newQuotationHeader'></fuzzy-customer>
                        </div>
                    </div>
                    <div v-else>{{newQuotationHeader.customerName}}</div>
                </div>
                <div class="form-group">
                    <label><span v-if="formEdit" class="must-point">*</span>业务员:</label>
                    <div v-if="formEdit" class="s-input ic2">
                        <div class="check-input">
                            <fuzzy-employee :data='newQuotationHeader'></fuzzy-employee>
                        </div>
                    </div>
                    <div v-else>{{newQuotationHeader.employeeName}}</div>
                </div>
                <div class="form-group">
                    <label><span v-if="formEdit" class="must-point">*</span>币种:</label>
                    <select v-if="formEdit" v-model='newQuotationHeader.currencyCode'>
                        <option :value='item.currencyCode' v-for='item in allCurrency'>{{item.currencyName}}</option>
                    </select>
                    <div v-else>{{newQuotationHeader.currencyName}}</div>
                </div>
                <div class="form-group">
                    <label><span v-if="formEdit" class="must-point">*</span>税率(%):</label>
                    <!--<input v-if="formEdit" type="text"  v-model="newQuotationHeader.taxRate">-->
                    <input-number   v-if="formEdit" class="wd100"  :code.sync="newQuotationHeader.taxRate" ></input-number>
                    <div v-else>{{newQuotationHeader.taxRate}}</div>
                </div>
            </div>

            <div class="inner-item mt-15">
                <div class="form-group wd-100">
                    <label>上传附件:</label>
                    <upfile-group :config ='uCfg' :edit="formEdit" :data="newQuotationHeader.attachmentVos"></upfile-group>
                </div>
                <div v-if="formEdit" class="form-group wd-100">
                    <label>备注:</label>
                    <textarea  v-if="formEdit" v-model="newQuotationHeader.remark"></textarea>
                </div>
                <div v-else class="form-group wd-100 align-items__baseline">
                    <label>备注:</label>
                    <p class="lh-20">{{newQuotationHeader.remark}}</p>
                </div>
            </div>

            <div class="inner-item">
                <!--<tabbar :config.sync='tabConfig'></tabbar>-->
                <tab-container :active.sync='tabConfig.select'>
                    <tab-item id='contactsTab'>
                        <table class="inner-table mt-15">
                            <thead>
                            <tr>
                                <th width="30px">序号</th>
                                <th width="20%">货品信息</th>
                                <th width="10%">单位</th>
                                <th width="10%">含税单价</th>
                                <th width="10%">订单量</th>
                                <th width="10%">生/失效日</th>
                                <th width="10%">备注</th>
                                <th width="10%" v-if="formEdit">操作</th>
                            </tr>
                            </thead>
                            <tbody>
                            <template v-if="formEdit">
                                <tr v-for="(index,item) in tableConfig">
                                    <td>
                                        <div class="show-wrap">
                                            <p>{{ $index+1 }}</p>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="show-wrap">
                                            <input type="hidden" v-model="item.recordId">
                                            <div class="s-input ic2">
                                                <div class="check-input">
                                                    <fuzzy-inventory :config="inventoryCfg" :data='item'></fuzzy-inventory>
                                                </div>
                                                <input type="text" class="check-input" disabled v-model="item.inventoryCode">
                                                <input type="text" class="check-input" disabled v-model="item.inventorySpec">
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="show-wrap">
                                            <input type="hidden" v-model="item.unitCode" placeholder="单位code">
                                            <input type="text" v-model="item.unitName" placeholder="单位" disabled>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="show-wrap">
                                            <input-number class="wd100" :code.sync="item.taxUnitPrice" ></input-number>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="show-wrap">
                                            <input-number class="wd100" :code.sync="item.startQuantity"></input-number>
                                            <input-number class="wd100" :code.sync="item.endQuantity"></input-number>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="show-wrap">
                                            <date-picker :config="dateConfig" :date.sync="item.effectiveDate" placeholder="生效日" format="YYYY-MM-DD"></date-picker>
                                            <date-picker :config="dateConfig" :date.sync="item.expiryDate" placeholder="失效日" format="YYYY-MM-DD"></date-picker>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="show-wrap">
                                            <input type="text" v-model="item.rowRemark" placeholder="备注">
                                        </div>
                                    </td>
                                    <td v-if="formEdit">
                                        <div class="show-wrap">
                                            <button @click="delRow($index)" class="button-danger">删除</button>
                                        </div>
                                    </td>
                                </tr>
                            </template>
                            <template v-else>
                                <tr v-for="(index,item) in tableConfig">
                                    <td>{{ $index+1 }}</td>
                                    <td>
                                        <div class="show-wrap">
                                            <p>编码:{{item.inventoryCode}}</p>
                                            <p>名称:{{item.inventoryName}}</p>
                                            <p>规格型号:{{item.inventorySpec}}</p>
                                        </div>
                                    </td>
                                    <td>
                                        {{item.unitName}}
                                        </td>
                                    <td>
                                        {{item.taxUnitPrice}}
                                        </td>
                                    <td>
                                        <div class="show-wrap">
                                            <p>订单量（从）:{{item.startQuantity}}</p>
                                            <p>订单量（到）:{{item.endQuantity}}</p>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="show-wrap">
                                            <p>{{item.effectiveDate}}</p>
                                            <p>{{item.expiryDate}}</p>
                                        </div>
                                    </td>
                                </tr>
                            </template>
                            </tbody>
                        </table>
                        <div v-if="formEdit" class="add-wrap" >
                            <button @click="addRow"><i class="icon icon-product__add"></i>增加货品</button>
                        </div>
                    </tab-item>
                </tab-container>
            </div>
        </div>
    </div>

    <div class="inner-footer">
        <button class="btn-xl-def" @click="show = false">{{ newQuotationHeader.audit != 1 ? '取消' : '关闭' }}</button>
        <!--<button class="btn-xl-danger" @click="delDoc" v-if="!formEdit &&  newQuotationHeader.audit == 2 ">删除</button>-->
        <button class="btn-xl-imp" @click="formEdit=true" v-if="!formEdit &&  newQuotationHeader.audit == 2 ">编辑</button>
        <button class="btn-xl-imp" @click="formEdit=true" v-if="!formEdit &&  newQuotationHeader.audit == -1 ">编辑</button>
        <ajax-button class="btn-xl-imp" @click="sumbitAudit" v-if="!formEdit && newQuotationHeader.audit == -1">提交审核</ajax-button>
        <ajax-button class="btn-xl-imp" @click="sumbitAudit" v-if="!formEdit && newQuotationHeader.audit == 2">提交审核</ajax-button>
        <ajax-button class="btn-xl-imp" @click="saveDraft" v-if="formEdit && newQuotationHeader.audit == -1">保存草稿</ajax-button>
        <ajax-button class="btn-xl-imp" @click="saveDraft" v-if="formEdit && newQuotationHeader.audit == 2">保存草稿</ajax-button>
        <ajax-button class="btn-xl-imp" @click="saveSumbit" v-if="formEdit && newQuotationHeader.audit != 1">提交审核</ajax-button>

        <!--<button class="btn-xl-imp" @click="audit" v-if="newQuotationHeader.audit == 0" >审核</button>-->
        <!--<button class="btn-xl-imp" @click="refusal" v-if="newQuotationHeader.audit == 0" >驳回</button>-->
    </div>
    <!--</inner>-->
    <warning :config="msgConfig"></warning>
</template>

<style lang="less" scoped>
    @import "../../../../../public/css/variable.less";
    .show-wrap {
        > * {
            margin-bottom: 5px;
            &:last-of-type {
                margin-bottom: 0;
            }
        }
        .check-input {
            margin-bottom: 5px;
        }
    }
</style>
