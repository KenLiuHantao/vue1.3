<script>
    import cfg from './cfg'
    export default {
        props:['pricingDetail','show'],
        data() {
            return {
                modalCfg: {
                        show: true,
                        title: '新增销售价格表'
                   },

                 tabConfig: {
                     type:'page',
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
                    refer:['inventoryId', 'inventoryName','inventoryCode','attributeCode','attributeName','inventorySpec','unitCode','unitName'],
                    item: ['inventoryId', 'inventoryName','inventoryCode','attributeCode','attributeName','inventorySpec','unitCode','unitName'],
                    del:['inventoryId', 'inventoryName','inventoryCode','attributeCode','attributeName','inventorySpec','unitCode','unitName']
                },

            customerCfg:{
                key:'customerName',
                code:'customerCode',
                refer:['customerName','customerCode','currencyCode','currencyName','currencySymbol','employeeCode','employeeName','taxRate'],
                item:['customerName','customerCode','currencyCode','currencyName','currencySymbol','employeeCode','employeeName','taxRate'],
                del:['customerName','customerCode'],
            },

                 dateConfig:{
                   placeholder: '请选择时间',
                   format: 'YYYY-MM-DD',
                 },

                 uCfg:{
                        limit:6,
                 },

                 formEdit:false,
                 upData:[],
                defaultRow: {
                    customerCode:"",
                    customerName:"",
                    inventoryId:"",
                    inventoryCode:"",
                    inventoryName:"",
                    inventorySpec:"",
                    unitCode: "",
                    unitName: "",
                    currencyCode:"",
                    currencyName:"",
                    currencySymbol:"",
                    taxRate: "",
                    lowerLimit: "",
                    upperLimit: "",
                    effectiveDate: "",
                    expiryDate: ""
                },
                newPricing:this.pricingDetail,
                newPricingHeader:this.pricingDetail.header,
                tableConfig: this.pricingDetail.dataList,
                ajaxLock:true,
                 rowIndex:0,
                allCurrency:[],
                auditStatusVo:{
                            "docNo":this.pricingDetail.header.docNo,
                            "recordVersions":this.pricingDetail.dataList
                },

            }
        },
        methods: {
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
            saveData() {
                  if(!this.check()){
                      this.wCfg.show = true
                      return false
                 }

                if(!this.ajaxLock){
                    return
                 }
                 this.ajaxLock = false;
                 if(this.newPricing.header.attachmentVos == ""){
                    this.newPricing.header.attachmentVos = [];
                 }

                 this.$http.post(__URL.sale + 'customer/pricing/updateSubmit', this.newPricing).then( (res) => {

                                    this.ajaxLock=true;
                                   if(res.data.success){
                                          this.show = false;
                                          this.$emit('refresh');
                                          this.formEdit=false;
                                   }else{
                                         this.wCfg.show=true
                                         this.wCfg.content = res.data.errMsg
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
                  this.$http.get(__URL.sale + 'customer/pricing/deleteRecord/'+recordId).then( (res) => {
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
            audit(){
                     if(!this.ajaxLock){
                            return
                    }

                  this.ajaxLock=false;
                  this.$http.post(__URL.sale + 'customer/pricing/audit', this.auditStatusVo).then( (res) => {
                                        this.ajaxLock=true;
                                       if(res.data.success){
                                                this.show = false;
                                       }else{
                                             this.wCfg.show=true;
                                             this.wCfg.type='failure';
                                             this.wCfg.content = res.data.errMsg;
                                       }
                                    }
                                )
            },
            refusal(){
                if(!this.ajaxLock){
                     return
                    }

                  this.ajaxLock=false;
                  this.$http.post(__URL.sale + 'customer/pricing/updateRefusal', this.auditStatusVo).then( (res) => {
                                        this.ajaxLock=true;
                                       if(res.data.success){
                                                this.show = false;
                                       }else{
                                             this.wCfg.show=true;
                                             this.wCfg.type='failure';
                                             this.wCfg.content = res.data.errMsg;
                                       }
                                    }
                                )

            },
                //业务员
            openEmployee(){
                this.employeeCfg.show=true;
            },
            clearEmployee(){
                this.newPricingHeader.employeeCode = '';
                this.newPricingHeader.employeeName = '';
                //this.depCfg.data={};
            },
            sureEmployee(val){
               this.newPricingHeader.employeeCode = val.employeeCode;
               this.newPricingHeader.employeeName = val.employeeName;
            },
             check(){
              if(this.newPricingHeader.employeeCode == ''){
                    this.wCfg.content = '业务员不能为空'
                    return false
              }

              if(this.tableConfig.length < 1){
                    this.wCfg.content = '至少要添加一行货品'
                    return false
              }else{
                     for(let i=0,l=this.tableConfig.length;i<l;i++){

                        if(this.tableConfig[i].customerCode.trim() == ''){
                            this.wCfg.content = '表单第'+(i+1)+'行的客户不能为空'
                            return false
                          }

                        if(this.tableConfig[i].inventoryId.trim() == ''){
                            this.wCfg.content = '表单第'+(i+1)+'行的货品不能为空'
                            return false
                          }

                        if(!this.tableConfig[i].taxUnitPrice || this.tableConfig[i].taxUnitPrice < 0){
                            this.wCfg.content = '表单第'+(i+1)+'行的含税单价不能为空'
                            return false
                          }

                        if(this.tableConfig[i].currencyCode.trim() == ''){
                            this.wCfg.content = '表单第'+(i+1)+'行的币种不能为空'
                            return false
                          }

                        if(!this.tableConfig[i].taxRate || this.tableConfig[i].taxRate < 0){
                            this.wCfg.content = '表单第'+(i+1)+'行的税率不能为空'
                            return false
                          }

                        if(!this.tableConfig[i].lowerLimit || !this.tableConfig[i].upperLimit || this.tableConfig[i].lowerLimit<= 0 || this.tableConfig[i].upperLimit <= 0){
                            this.wCfg.content = '表单第'+(i+1)+'行的订单量必须大于0'
                            return false
                          }

                        if(this.tableConfig[i].effectiveDate.trim() == ''){
                            this.wCfg.content = '表单第'+(i+1)+'行的生效日期不能为空'
                            return false
                          }
                     }
              }
                return true
            },
        delDoc(){
             var docNo = this.newPricingHeader.docNo;
              if(!this.ajaxLock){
                        return
                    }
               this.ajaxLock=false;
               this.$http.get(__URL.sale + 'customer/pricing/deleteDoc/'+docNo).then( (res) => {
                            this.ajaxLock=true;
                            this.show = false;
                        }
                    );
             }

        },
        ready(){
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

        }
    }


</script>
<template :config='modalCfg'>
    <!--<button class="btn-lg-imp" @click='modal'>内页弹窗按钮</button>-->
    <!-- 弹框内置dom结构 -->
    <!--<inner :config='modalCfg'>-->
    <div class="inner-wrapper">
        <div class="inner-content">

            <h2 class="tag">销售价格表</h2>

            <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
            <div class="inner-item form-box">
                <div class="form-group">
                    <label><span class="must-point">*</span>业务员:</label>
                    <!-- 如果要加验证请加外层dom -->
                    <div v-if="formEdit" class="s-input ic2">
                        <fuzzy-employee :data='newPricingHeader'></fuzzy-employee>
                    </div>
                    <div v-else>{{newPricingHeader.employeeName}}</div>
                </div>
            </div>

            <div class="inner-item mt-15">
                <div class="form-group wd-100">
                    <label>上传附件:</label>
                    <upfile-group :config='uCfg' :edit="formEdit" :data="newPricingHeader.attachmentVos"></upfile-group>
                </div>
                <div v-if="formEdit" class="form-group wd-100">
                    <label>备注:</label>
                    <textarea v-if="formEdit" v-model="newPricingHeader.remark"></textarea>
                </div>
                <div v-else class="form-group wd-100 align-items__baseline">
                    <label>备注:</label>
                    <p class="lh-20">{{newPricingHeader.remark}}</p>
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
                                <th width="20%">客户</th>
                                <th width="20%">货品信息</th>
                                <th width="8%">单位</th>
                                <th width="8%">含税单价</th>
                                <th width="8%">币种</th>
                                <th width="8%">税率(%)</th>
                                <th width="8%">订单量</th>
                                <th width="15%">生/失效日</th>
                                <th width="6%" v-if="formEdit">操作</th>
                            </tr>
                            </thead>
                            <tbody>
                            <template v-if="formEdit">
                                <tr v-for="(index,item) in tableConfig">
                                    <td>{{ $index+1 }}</td>
                                    <td>
                                        <div class="s-input ic2">
                                            <fuzzy-customer :config="customerCfg" :data='item'></fuzzy-customer>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="check-input">
                                            <fuzzy-inventory :config="inventoryCfg" :data='item'></fuzzy-inventory>
                                        </div>
                                        <input type="text" class="check-input" disabled v-model="item.inventoryCode">
                                        <input type="text" class="check-input" disabled v-model="item.inventorySpec">
                                    </td>
                                    <td>
                                        <input type="hidden" v-model="item.unitCode" placeholder="单位code">
                                        <input type="text" v-model="item.unitName" placeholder="单位" disabled>
                                    </td>
                                    <td>
                                        <input type="text" v-model="item.taxUnitPrice" placeholder="含税单价">
                                    </td>
                                    <td>
                                        <select v-model='item.currencyCode'>
                                            <option :value='item.currencyCode' v-for='item in allCurrency'>
                                                {{item.currencyName}}
                                            </option>
                                        </select>

                                    </td>
                                    <td>
                                        <input type="text" v-model="item.taxRate" placeholder="税率">
                                    </td>
                                    <td>
                                        <input type="text" v-model="item.lowerLimit" placeholder="从"><br>
                                        <input type="text" v-model="item.upperLimit" placeholder="到">
                                    </td>
                                    <td>
                                        <date-picker :config="dateConfig" :date.sync="item.effectiveDate"
                                                    placeholder="生效日" format="YYYY-MM-DD"></date-picker>
                                        <date-picker :config="dateConfig" :date.sync="item.expiryDate" placeholder="失效日"
                                                    format="YYYY-MM-DD"></date-picker>
                                    </td>
                                    <td>
                                        <a href="javascript:;" @click="delRow($index)" class="delete">删除</a>
                                    </td>
                                </tr>
                            </template>
                            <template v-else>
                                <tr v-for="(index,item) in tableConfig">
                                    <td>{{ $index+1 }}</td>
                                    <td>{{ item.customerName }}</td>
                                    <td>
                                        <div class="show-wrap">
                                            <p>名称:{{item.inventoryName}}</p>
                                            <p>编码:{{item.inventoryCode}}</p>
                                            <p>规格型号:{{item.inventorySpec}}</p>
                                        </div>
                                    </td>
                                    <td>{{ item.unitName }}</td>
                                    <td>{{ item.taxUnitPrice }}</td>
                                    <td>{{ item.currencyName }}</td>
                                    <td>{{ item.taxRate }}</td>
                                    <td>
                                        <div class="show-wrap">
                                            <p>{{item.lowerLimit}}</p>
                                            <p>{{item.upperLimit}}</p>
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
                        <div v-if="formEdit" class="add-wrap">
                            <button @click="addRow"><i class="icon icon-add-data"></i>&nbsp;增加价格</button>
                        </div>
                    </tab-item>
                </tab-container>
            </div>
        </div>
    </div>

    <div class="inner-footer">
        <button class="btn-xl-def" @click="show = false">关闭</button>
        <!--<button class="btn-xl-danger" @click="delDoc" v-if="!formEdit &&  newPricingHeader.audit == 2 ">删除</button>-->
        <!--<button class="btn-xl-imp" @click="formEdit=true" v-if="!formEdit &&  newPricingHeader.audit != 1 ">编辑</button>-->
        <!--<button class="btn-xl-imp" @click="saveData"  v-if="formEdit &&  newPricingHeader.audit != 1 " >提交审核</button>-->
        <ajax-button class="btn-xl-danger" @click="refusal" v-if="newPricingHeader.audit == 0 ">驳回</ajax-button>
        <ajax-button class="btn-xl-imp" @click="audit" v-if="newPricingHeader.audit == 0 ">审核</ajax-button>
    </div>
    <!--</inner>-->
    <warning :config="wCfg"></warning>
</template>
<style lang="less" scoped>
    @import "../../../../../public/css/variable.less";
</style>
