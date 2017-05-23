<script>
    export default {
        props:['edit','data'],
        data(){
            return {
                currencyListData:'',
                tax:'',
                //行业分类弹框
                industryCfg:{
                    show:false,
                },
                customerCfg:{
                    show:false
                },
                industryFirst:[],
                region:[
                    {
                        regionCategoryCode:"BU020",
                        regionCategoryName:"国内"
                    },
                    {
                        regionCategoryCode:"BU021",
                        regionCategoryName:"海外"
                    },
                ],
                employeeCfg:{
                    key:'employeeName',
                    code:'employeeCode',
                    refer:['employeeName','employeeCode','jobNumber'],
                    item:['employeeName','employeeCode','employeeJobNumber'],
                    del:['employeeName','employeeCode','employeeJobNumber'],
                    init:true
                }
            }
        },
        ready(){
            this.$http.get(__URL.arc + 'industry/category/first').then(
                (res) => {
                    if(res.data.success){
                        this.industryFirst=res.data.data
                    }
                }
            )
            this.$http.post(__URL.arc + 'currency/local',{}).then(
                (res) => {
                    if(res.data.success){
                        this.currencyListData=res.data.data
                    }
                }
            )
        },
        methods:{
            changefirstIndustryCategoryName(){
               for(let i=0;i<this.industryFirst.length;i++){
                   if(this.industryFirst[i].industryCategoryCode==this.data.firstIndustryCategoryCode){
                       this.data.firstIndustryCategoryName=this.industryFirst[i].industryCategoryName
                   }
               } 
            },
            changeCurrency(){
               for(let i=0;i<this.currencyListData.length;i++){
                   if(this.currencyListData[i].currencyCode==this.data.currencyCode){
                       this.data.currencyName=this.currencyListData[i].currencyName
                   }
               } 
            },
            changeregionCategoryCode(){
               for(let i=0;i<this.region.length;i++){
                   if(this.region[i].regionCategoryCode==this.data.regionCategoryCode){
                       this.data.regionCategoryName=this.region[i].regionCategoryName
                   }
               }
            }
        },
    }
</script>
<template>
    <div class="form-modal">
        <!-- <pre class="show">
            {{data | json}}
        </pre> -->
        <div class="form-group">
            <label><span class="must-point">*</span>客户名称:</label>
            <div class="s-input">
            <input v-if="edit"  type="text"  v-model="data.customerName" placeholder="输入客户名称">
            <p  v-else >{{data.customerName}}</p>
            </div>
        </div>
        <div class="form-group">
            <label>联系人:</label>
            <div class="s-input">
            <input v-if="edit" type="text"  v-model="data.contactName" placeholder="输入联系人">
            <p  v-else >{{data.contactName}}</p>
            </div>
        </div>
        <div class="form-group">
            <label>联系电话:</label>
            <div class="s-input">
            <input v-if="edit"  type="text" maxlength='100'  v-model="data.contactPhone" placeholder="输入联系电话">
            <p  v-else >{{data.contactPhone}}</p>
            </div>
        </div>
        <div class="form-group">
            <label><span class="must-point">*</span>默认币种:</label>
            <div class="s-input">
                <select v-if="edit" v-model="data.currencyCode" @change='changeCurrency'>
                    <option v-for="item in currencyListData" :value="item.currencyCode">{{item.currencyName}}</option>
                </select>
            <p  v-else >{{data.currencyName}}</p>
            </div>
        </div>
        <div class="form-group">
            <label>业务员:</label>
            <fuzzy-employee v-if='edit' :data='data' :config='employeeCfg'></fuzzy-employee>
            <p  v-else >{{data.employeeName}}</p>
        </div>
        <div class="form-group">
            <label><span class="must-point">*</span>行业分类:</label>
            <div class="s-input">
                <select v-if="edit" v-model='data.firstIndustryCategoryCode' @change='changefirstIndustryCategoryName'>
                    <option :value='item.industryCategoryCode' v-for='item in industryFirst'>{{item.industryCategoryName}}
                    </option>
                </select>
            <p  v-else >{{data.industryCategoryName}}</p>
            </div>
        </div>
        <div class="form-group">
            <label><span class="must-point">*</span>区域分类:</label>
            <div class="s-input">
                <select v-if="edit" v-model='data.regionCategoryCode' @change='changeregionCategoryCode'>
                    <option :value='item.regionCategoryCode' v-for='item in region'>{{item.regionCategoryName}}
                    </option>
                </select>
            <p  v-else >{{data.regionCategoryName}}</p>
            </div>
        </div>
    </div>
</template>
<style lang="less">
    .form-modal{
        height: 450px;
        padding: 20px;
        overflow: auto;
    }
</style>

