<script>
    import cfg from './cfg'
    export default {
        props:['show'],
        data() {
            return {

               modalCfg: {
                    show: true,
                    title: '报价单信息'
                },

                tabConfig: {
                   type:"page",
                    select: 'contactsTab',
                    tabBarData: []
                },

                   //warming配置
                wCfg:{
                    show:false,
                    content:'',
                    type:'warning'
                },

                inventoryCfg:{
                    key:'inventoryName',
                    code:'inventoryCode',
                    refer:['inventoryId', 'inventoryName','inventoryCode','attributeCode','attributeName','inventorySpec','unitCode','unitName','firstInventoryCategoryCode','firstInventoryCategoryName','secondInventoryCategoryCode','secondInventoryCategoryName'],
                    item: ['inventoryId', 'inventoryName','inventoryCode','attributeCode','attributeName','inventorySpec','unitCode','unitName','firstInventoryCategoryCode','firstInventoryCategoryName','secondInventoryCategoryCode','secondInventoryCategoryName'],
                    del: ['inventoryId', 'inventoryName','inventoryCode','attributeCode','attributeName','inventorySpec','unitCode','unitName']
                },

            customerCfg:{
                key:'customerName',
                code:'customerCode',
                refer:['customerCategoryCode','customerCategoryName','customerName','customerCode','currencyCode','currencyName','currencySymbol','employeeCode','employeeName','taxRate'],
                item:['customerCategoryCode','customerCategoryName','customerName','customerCode','currencyCode','currencyName','currencySymbol','employeeCode','employeeName','taxRate'],
                del:['customerName','customerCode','customerCategoryCode','customerCategoryName'],
            },
                uCfg:{
                        limit:6,
                 },

                 isEdit:true,

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

//                newQuotation: cfg.quotationCfg,

                newQuotationHeader:JSON.parse(JSON.stringify(cfg.quotationCfg.header)),

                tableConfig : JSON.parse(JSON.stringify(cfg.quotationCfg.dataList)),

                ajaxLock:true,

                rowIndex:0,

                allCurrency:[],

                allUnit:[],
            }
        },
        computed: {
            newQuotation(){
                return {'header':this.newQuotationHeader,'dataList':this.tableConfig }
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
            },
            // 保存草稿
            saveDraft() {
                if(!this.check()){
                  this.wCfg.show = true
                  return false
                }

             if(!this.ajaxLock){
                return
            }

              for(var i=0;i<this.allCurrency.length;i++){
                        let _c = this.allCurrency[i]
                        if(_c.currencyCode == this.newQuotationHeader.currencyCode){
                                 this.newQuotationHeader.currencyName = _c.currencyName;
                        }
                }

              this.ajaxLock=false;
                console.log(this.newQuotation);
              this.$http.post(__URL.sale + 'customer/quotation/insertDraft', this.newQuotation).then( (res) => {
                                    this.ajaxLock=true;
                                   if(res.data.success){
                                             this.wCfg.type="success";
                                             this.wCfg.content = "保存草稿成功";
                                             this.show = false;
                                   }else{
                                         this.wCfg.type="failure";
                                         this.wCfg.content = res.data.errMsg;
                                   }
                                    this.wCfg.show=true;
                                }
                            )


            },
            // 提交审核
            saveSubmit() {
                if(!this.check()){
                    this.wCfg.show = true
                    return false
                }

                if(!this.ajaxLock){
                    return
                }

                for(var i=0;i<this.allCurrency.length;i++){
                    let _c = this.allCurrency[i]
                    if(_c.currencyCode == this.newQuotationHeader.currencyCode){
                        this.newQuotationHeader.currencyName = _c.currencyName;
                    }
                }

                this.ajaxLock=false;
                this.$http.post(__URL.sale + 'customer/quotation/insertSubmit', this.newQuotation).then( (res) => {
                        this.ajaxLock=true;
                        if(res.data.success){
                            this.wCfg.type="success";
                            this.wCfg.content = "提交成功";
                            this.show = false;
                        }else{
                            this.wCfg.type="failure";
                            this.wCfg.content = res.data.errMsg;
                        }
                        this.wCfg.show=true;
                    }
                )


            },
           check(){
              if(this.newQuotationHeader.customerCode == ''){
                    this.wCfg.content = '客户不能为空'
                    return false
              }
              if(this.newQuotationHeader.employeeCode == ''){
                    this.wCfg.content = '业务员不能为空'
                    return false
              }
              if(this.newQuotationHeader.currencyCode == ''){
                    this.wCfg.content = '币种不能为空'
                    return false
              }
              if(this.newQuotationHeader.taxRate == '' || this.newQuotationHeader.taxRate==undefined){
                    this.wCfg.content = '税率不能为空'
                    return false
              }
             if(this.newQuotationHeader.taxRate > 100){
                        this.wCfg.content = '税率不在数据范围内'
                        return false
              }

              if(this.tableConfig.length < 1){
                    this.wCfg.content = '至少要添加一行货品'
                    return false
              }else{
                     for(let i=0,l=this.tableConfig.length;i<l;i++){

                        if(this.tableConfig[i].inventoryId.trim() == ''){
                            this.wCfg.content = '表单第'+(i+1)+'行的货品不能为空'
                            return false
                          }

                          if(!this.tableConfig[i].startQuantity || this.tableConfig[i].startQuantity <= 0){
                            this.wCfg.content = '表单第'+(i+1)+'行的从数量必须大于0'
                            return false
                          }

                         if(!this.tableConfig[i].endQuantity || Number(this.tableConfig[i].endQuantity) < Number(this.tableConfig[i].startQuantity)){
                             this.wCfg.content = '表单第'+(i+1)+'行的到数量不能小于从数量'
                             return false
                         }

                         if(!this.tableConfig[i].taxUnitPrice || this.tableConfig[i].taxUnitPrice < 0){
                            this.wCfg.content = '表单第'+(i+1)+'行的含税单价不正确'
                            return false
                          }

//                         if(this.tableConfig[i].effectiveDate.trim() == ''){
//                             this.wCfg.content = '表单第'+(i+1)+'行的生效日期不能为空'
//                             return false
//                         }
//
//                         if(this.tableConfig[i].expiryDate.trim() == ''){
//                             this.wCfg.content = '表单第'+(i+1)+'行的失效日期不能为空'
//                             return false
//                         }

                         if(this.tableConfig[i].effectiveDate.trim() != ''  && this.tableConfig[i].expiryDate.trim() != ''){
                             if(this.tableConfig[i].expiryDate<=this.tableConfig[i].effectiveDate) {
                                 this.wCfg.content = '表单第'+(i+1)+'行的失效日期必须大于生效日期'
                                 return false
                             }
                         }

                     }
              }
                return true
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
            );
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
                      d.tax = parseFloat(d.taxAmounts - d.taxAmounts / (1 + taxRate/100)).toFixed(5);
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
                      d.tax = parseFloat(d.taxAmounts - d.taxAmounts / (1 + taxRate/100)).toFixed(5);
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

                <h2 class="tag">报价单信息</h2>

                <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
                <div class="inner-item form-box">
                    <div class="form-group">
                        <label><span class="must-point">*</span>客户:</label>
                        <div class="s-input ic2">
                            <div class="check-input">
                                <fuzzy-customer :config="customerCfg" :data='newQuotationHeader'></fuzzy-customer>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label><span class="must-point">*</span>业务员:</label>
                        <div class="s-input ic2">
                            <div class="check-input">
                                <fuzzy-employee :data='newQuotationHeader'></fuzzy-employee>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label><span class="must-point">*</span>币种:</label>
                        <select v-model='newQuotationHeader.currencyCode'>
                            <option :value='item.currencyCode' v-for='item in allCurrency'>{{item.currencyName}}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label><span class="must-point">*</span>税率(%):</label>
                        <input-number  class="wd100"   :code.sync ="newQuotationHeader.taxRate" key="taxRate"></input-number>
                        <!--<input type="text"  v-model="newQuotationHeader.taxRate">-->
                    </div>
                </div>

                <div class="inner-item mt-15">
                    <div class="form-group wd-100">
                        <label>上传附件:</label>
                        <upfile-group :config ='uCfg' :edit="isEdit" :data="newQuotationHeader.attachmentVos"></upfile-group>
                        <!--<upload></upload>-->
                    </div>
                    <div class="form-group wd-100">
                        <label>备注:</label>
                        <textarea v-model="newQuotationHeader.remark"></textarea>
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
                                    <th width="8%">单位</th>
                                    <th width="8%">含税单价</th>
                                    <th width="8%">订单量</th>
                                    <th width="15%">生/失效日</th>
                                    <th width="6%">操作</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(index,item) in tableConfig">
                                    <td>
                                        <div class="show-wrap">
                                            <p>{{ $index+1 }}</p>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="show-wrap">
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
                                            <input type="number" v-model="item.taxUnitPrice" placeholder="含税单价">
                                        </div>
                                    </td>
                                    <td>
                                        <div class="show-wrap">
                                            <input type="number" v-model="item.startQuantity" placeholder="从">
                                            <input type="number" v-model="item.endQuantity" placeholder="到">
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
                                            <button @click="delRow($index)" class="button-danger">删除</button>
                                        </div>
                                    </td>
                                </tr>
                                </tbody>
                            </table>

                            <div class="add-wrap">
                                <button @click="addRow"><i class="icon icon-product__add"></i>增加货品</button>
                            </div>
                        </tab-item>
                    </tab-container>
                </div>
            </div>
        </div>
        <div class="inner-footer">
            <button class="btn-xl-def" @click="show = false">取消</button>
            <ajax-button class="btn-xl-imp" @click="saveDraft">保存草稿</ajax-button>
            <ajax-button class="btn-xl-imp" @click="saveSubmit">提交审核</ajax-button>
        </div>
    <!--</inner>-->
    <warning :config="wCfg"></warning>
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
