<script>
    export default {
        props:['edit','data'],
        data(){
            return {
                paymentData:'',
                currencyListData:'',
                collectListData:'',
                tax:'',
                //行业分类弹框
                industryCfg:{
                    show:false,
                },
                customerCfg:{
                    show:false
                },
                currency:this.data.currencyName,
                agree:this.data.recAgreementName,
                payment:this.data.paymentName,

            }
        },
        ready(){
            this.getSelectList()
        },
        methods:{

            getSelectList(){
                    this.getInitSelectData(__URL.arc + 'currency/local',{},'currencyListData','data')
                    this.getInitSelectData(__URL.arc + 'rec/agreement/list',{},'collectListData','data')
                    this.getInitSelectData(__URL.arc + 'payment/list',{},'paymentData')
                    this.getInitSelectData(__URL.arc + 'taxrate/list',{"taxCode": ""},'tax',)
             },
            getInitSelectData(url,data,val,item){
                this.$http.post(url,data).then(
                        (res) => {
                            if(res.data.success){
                                if(item != undefined && item == 'data'){
                                    this[val] = res.data.data
                                }else{
                                    this[val] = res.data.data.dataList
                                }
                            }else{
                                console.log('网络出错:'+res.data.errMsg)
                            }
                        }
                    )
             },
             industryModal(){
                this.industryCfg.show=false;
                this.industryCfg.show = true;
             },
             industrySure(item){
                this.data.industryCategoryName = item.industryName
                this.data.industryCategoryCode = item.industryCode
             },
             industryClear(){
                this.data.industryCategoryName = ''
                this.data.industryCategoryCode = ''
             },
             customerModal(){
                this.customerCfg.show = true
             },
             customerSure(item){
                this.data.customerCategoryName = item.customerCategoryName
                this.data.customerCategoryCode = item.customerCategoryCode
             },
             customerClear(){
                this.data.customerCategoryName = ''
                this.data.customerCategoryCode = ''
             },
             passNameSetCode(arr,val,target,name,code){
                if(arr.length > 0){
                    let i = _.find(arr,item=>{
                        return item[name] == val
                    })
                    target[name] = i[name]
                    target[code] = i[code]
                }
            }
        },
        watch:{
            currency(val,old){
               if(val.trim() == ''){
                    this.currencyName = this.currencyCode = ''
               }
               if(val != old){
                    this.passNameSetCode(this.currencyListData,val,this.data,'currencyName','currencyCode')
               }
            },
            agree(val,old){
                if(val.trim() == ''){
                    this.recAgreementName = this.recAgreementCode = ''
                }
                if(val != old){
                    this.passNameSetCode(this.collectListData,val,this.data,'recAgreementName','recAgreementCode')
                }
            },
            payment(val,old){
                if(val.trim() == ''){
                    this.paymentName = this.paymentCode = ''
                }
                if(val != old){
                    this.passNameSetCode(this.paymentData,val,this.data,'paymentName','paymentCode')
                }
            }
        }

    }
</script>
<template>
    <div class="form-modal">
        <!--<pre class="show">
            {{data | json}}
        </pre>-->
        <div class="form-group">
            <label><span class="must-point">*</span>客户名称:</label>
            <div class="s-input">
            <input v-if="edit"  type="text"  v-model="data.customerName" placeholder="输入客户名称">
            <p  v-else >{{data.customerName}}</p>
            </div>
        </div>
        <div class="form-group">
            <label><span class="must-point">*</span>行业分类:</label>
            <input-group v-if="edit" :data="data.industryCategoryName" :config="{icon:'icon-reference',disabled:true}" @modal="industryModal" @clear="industryClear"></input-group>
            <p  v-else >{{data.industryCategoryName}}</p>
        </div>
        <div class="form-group">
            <label><span class="must-point">*</span>客户分类:</label>
            <input-group v-if="edit" :data="data.customerCategoryName" :config="{icon:'icon-reference',disabled:true}" @modal="customerModal" @clear="customerClear"></input-group>
            <p  v-else >{{data.customerCategoryName}}</p>
        </div>
        <div class="form-group">
            <label><span class="must-point">*</span>业务员:</label>
            <fuzzy-employee v-if='edit' :data='data'></fuzzy-employee>
            <p  v-else >{{data.employeeName}}</p>
        </div>
        <div class="form-group">
            <label><span class="must-point">*</span>默认币种:</label>
            <div class="s-input">
                <select v-if="edit" v-model="currency">
                    <option v-for="item in currencyListData" :value="item.currencyName">{{item.currencyName}}</option>
                </select>
            <p  v-else >{{data.currencyName}}</p>
            </div>
        </div>
        <div class="form-group">
            <label><span class="must-point">*</span>税率(%):</label>
            <div class="s-input">
                <select v-if="edit" v-model="data.taxRateVal">
                    <option  v-for="item in tax" :value="item.taxRate">{{item.taxRate}}</option>
                </select>
            <p v-else >{{data.taxRateVal}}</p>
            </div>
        </div>
        <div class="form-group">
            <label><span class="must-point"></span>收款条件:</label>
            <div class="s-input">
                <select v-if="edit" v-model="agree">
                    <option v-for="item in collectListData" :value="item.recAgreementName">{{item.recAgreementName}}</option>
                </select>
            <p v-else >{{data.recAgreementName}}</p>
            </div>
        </div>
        <div class="form-group">
            <label><span class="must-point"></span>结算方式:</label>
            <div class="s-input">
                <select v-if="edit" v-model="payment">
                    <option v-for="item in paymentData" :value="item.paymentName">{{item.paymentName}}</option>
                </select>
            <p v-else >{{data.paymentName}}</p>
            </div>
        </div>
        <div class="form-group">
            <label><span class="must-point"></span>交货方式:</label>
            <div class="s-input">
                <select v-if="edit" v-model="data.dispatchModelName">
                    <option value="FOB">FOB</option>
                    <option value="CIF">CIF</option>
                    <option value="EXW">EXW</option>
                </select>
            <p v-else >{{data.dispatchModelName}}</p>
            </div>
        </div>
        <div class="form-group">
            <label><span class="must-point">*</span>联系人:</label>
            <div class="s-input">
            <input v-if="edit" type="text"  v-model="data.contactName" placeholder="输入联系人">
            <p  v-else >{{data.contactName}}</p>
            </div>
        </div>
        <div class="form-group">
            <label><span class="must-point">*</span>职务:</label>
            <div class="s-input">
            <input v-if="edit"  type="text"  v-model="data.contactDuty" placeholder="输入职务">
            <p  v-else >{{data.contactDuty}}</p>
            </div>
        </div>
        <div class="form-group">
            <label><span class="must-point"></span>联系电话:</label>
            <div class="s-input">
            <input v-if="edit"  type="text"  v-model="data.contactPhone" placeholder="输入联系电话">
            <p  v-else >{{data.contactPhone}}</p>
            </div>
        </div>
        <div class="form-group">
            <label><span class="must-point"></span>E-MAIL:</label>
            <div class="s-input">
            <input v-if="edit"  type="text"  v-model="data.contactEmail" placeholder="输入E-MAIL">
            <p  v-else >{{data.contactEmail}}</p>
            </div>
        </div>
        <div class="form-group">
            <label><span class="must-point"></span>地址:</label>
            <div class="s-input">
            <input v-if="edit"  type="text"  v-model="data.contactAddress" placeholder="输入地址">
            <p  v-else >{{data.contactAddress}}</p>
            </div>
        </div>
        <div class="form-group">
            <label><span class="must-point"></span>主联系人:</label>
            <div class="s-input">
                <select v-if="edit" v-model="data.contactMajor">
                    <option value="是">是</option>
                    <option value="否">否</option>
                </select>
            <p  v-else >{{data.contactMajor}}</p>
            </div>
        </div>
        <div class="form-group">
            <label><span class="must-point"></span>备注:</label>
            <div class="s-input">
            <input v-if="edit"  type="text"  v-model="data.remark" placeholder="输入备注">
            <p v-else class="lh-20">{{data.remark}}</p>
            </div>
        </div>

        <category-industry :config='industryCfg' @cb='industrySure'></category-industry>
        <category-customer :config='customerCfg' @cb='customerSure'></category-customer>
    </div>
</template>
<style lang="less">
    .form-modal{
        height: 450px;
        padding: 20px;
        overflow: auto;
    }
</style>

