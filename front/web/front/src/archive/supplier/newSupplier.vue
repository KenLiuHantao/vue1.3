<script>
import cfg from './cfg.js'
export default {
    data() {
        return {
            valiVal: '',
            tabConfig: {
                type:'page',
                select: '',
                tabBarData: [{
                    id: 'tab1',
                    name: '联系人',
                    icon: 'icon-contacts'
                }]
            },
            valiShow: {
                secondIndustryCategoryName:false,
                supplierCategoryName: false,
                supplierName: false,
                employeeName:false,
                currency:false,
                taxRate:false
            },
            newsupplier:JSON.parse(JSON.stringify(cfg.supplierCfg)),
            upfileCfg:cfg.upfileCfg,
            supplierCategoryConfig:{
                searchKey:'',
                showKey:'',
                url: __URL.arc+'supplier/category/tree' ,
                width:210
            },
            allCurrency:[],
            agreementList:[],
            paymentList:[],
            taxRateList:[],
            ajaxlock:true,
            //供应商分类弹框显示和隐藏
            supplierShow:{
                show: false,
                width: '400px',
                height: 'auto',
                header: '请选择供应商分类',
                btn: []
            },
            supplierCategoryCode:'',
            supplierCategoryName:'',
            //采购员弹框
            codeModal: {
                show: false,
                width: '800px',
                height: '400px',
                header: '请选择采购员',
                btn: [{
                    name: '取消',
                    emit: 'codeclose'
                }, {
                    name: '确认',
                    emit: 'codesure'
                }]
            },
            //行业分类弹框
            industryCfg:{
                show:false,
                data:{},
                notChoiceFirst: true
            },
            pickedname:'',
            pickedcode:'',
            //msg
            msgconfig:{
                type:'warning',
                show:false,
                content:''
            },
            wCfg:{
                show:false,
                content:'保存成功',
                type:'success'
            },
            dCfg:{
                show:false,
                msg:'确定是否删除所选择的行记录吗？',
                subMsg:'删除后不可以恢复！',
                type:'failure',
                index:''
            },
            isEdit:true,
            uCfg: {
                limit: 6,
            },
        }
    },
    methods: {
        //新增联系人
        addContact(){
            if(this.newsupplier.contacts.length>=1){
                this.newsupplier.contacts.push({'major':false})
            }else{
                this.newsupplier.contacts.push({'major':true})
            }
        },
        //删除联系人
        deleteContact(index){
            this.dCfg.show=true;
            this.dCfg.index=index
        },
        //确认删除联系人
        sureDeleteContact(){
            this.newsupplier.contacts.splice(this.dCfg.index,1)
            this.dCfg.index=''
        },
        //修改主联系人
        changeMajor(index){
            if(this.newsupplier.contacts[index].major==true){
                for(var i=0;i<this.newsupplier.contacts.length;i++){
                    this.newsupplier.contacts[i].major=false
                }
                this.newsupplier.contacts[index].major=true
            }
        },
        //保存事件
        savesupplier(){
            if(!this.ajaxlock){
                return
            }
            var flag=true;
            if(this.newsupplier.secondIndustryCategoryCode==''){
                this.valiShow.secondIndustryCategoryName=true;
                flag=false;
            }else{
                this.valiShow.secondIndustryCategoryName=false;
            }
            if(this.newsupplier.supplierCategoryCode==''){
                this.valiShow.supplierCategoryName=true;
                flag=false;
            }else{
                this.valiShow.supplierCategoryName=false;
            }
            if(this.newsupplier.supplierName==''){
                this.valiShow.supplierName=true;
                flag=false;
            }else{
                this.valiShow.supplierName=false;
            }
            if(this.newsupplier.employeeName==''){
                this.valiShow.employeeName=true;
                flag=false;
            }else{
                this.valiShow.employeeName=false;
            }
            if(this.newsupplier.currencyCode==''){
                this.valiShow.currency=true;
                flag=false;
            }else{
                this.valiShow.currency=false;
                for(var i=0;i<this.allCurrency.length;i++){
                    if(this.newsupplier.currencyCode==this.allCurrency[i].currencyCode){
                        this.newsupplier.currencyName=this.allCurrency[i].currencyName
                    }
                }
            }
            //根据增值税率code添加name
            if(this.newsupplier.taxCode!=''){
                for(var i=0;i<this.taxRateList.length;i++){
                    if(this.newsupplier.taxCode==this.taxRateList[i].taxCode){
                        this.newsupplier.taxRate=this.taxRateList[i].taxRate
                    }
                }
            }
            if(this.newsupplier.taxCode===undefined){
                this.valiShow.taxRate=true;
                flag=false;
            }else{
                this.valiShow.taxRate=false;
            }
             //根据付款条件code添加name
            if(this.newsupplier.payAgreementCode!=''){
                for(var i=0;i<this.agreementList.length;i++){
                    if(this.newsupplier.payAgreementCode==this.agreementList[i].payAgreementCode){
                        this.newsupplier.payAgreementName=this.agreementList[i].payAgreementName
                    }
                }
            }
            //根据结算方式code添加name
            if(this.newsupplier.paymentCode!=''){
                for(var i=0;i<this.paymentList.length;i++){
                    if(this.newsupplier.paymentCode==this.paymentList[i].paymentCode){
                        this.newsupplier.paymentName=this.paymentList[i].paymentName
                    }
                }
            }

            //检查联系人并将major替换成布尔值
            for(var i=0;i<this.newsupplier.contacts.length;i++){
                if(!this.newsupplier.contacts[i].contactName){
                    this.msgconfig.show=true;
                    this.msgconfig.content='联系人名称不能为空';
                    this.flag=false;
                    return
                }else if(!this.newsupplier.contacts[i].phone){
                    this.msgconfig.show=true;
                    this.msgconfig.content='联系人电话不能为空';
                    this.flag=false;
                    return
                }
            }
            var data=this.newsupplier;
            // if(flag){
                // for(var i=0;i<this.newsupplier.contacts.length;i++){
                //     if(this.newsupplier.contacts[i].major=='on'){
                //         this.newsupplier.contacts[i].major=true
                //     }else{
                //         this.newsupplier.contacts[i].major=false
                //     }
                // }
                this.ajaxlock=false;
                this.$http.post(__URL.arc + 'supplier/add', data).then(
                    (res) => {
                        this.ajaxlock=true;
                        if(res.data.success){
                            // this.show=false;
                            this.wCfg.show=true;
                            this.$emit('refresh','新增成功!',res.data.data)
                        }else{
                            this.msgconfig.show=true
                            this.msgconfig.content=res.data.errMsg
                            //请求失败时江major转回on
                            // for(var i=0;i<this.newsupplier.contacts.length;i++){
                            //     if(this.newsupplier.contacts[i].major==true){
                            //         this.newsupplier.contacts[i].major='on'
                            //     }else{
                            //         this.newsupplier.contacts[i].major=''
                            //     }
                            // }
                        }
                    },
                    (err) => {
                        this.ajaxlock=true;
                        console.log(err)
                    }
                )
            // }
        },
        //取消新增
        cancelsupplier(){
            this.$emit('refresh')
        },
        //供应商分类和采购员弹框
        searchCategory:function(){
            this.supplierShow.show=true;
        },
        searchemployee:function(){
            this.codeModal.show=true;
        },
        //打开行业分类弹框
        searchIndustry:function(){
            this.industryCfg.show=false;
            this.industryCfg.show=true;
        },
        //清除供应商分类和采购员和行业分类
        clearCategoryName(){
            this.newsupplier.supplierCategoryCode='';
            this.newsupplier.supplierCategoryName='';
        },
        clearemployeeName(){
            this.newsupplier.employeeCode='';
            this.newsupplier.employeeName='';
        },
        clearIndustry(){
            this.newsupplier.secondIndustryCategoryCode='';
            this.newsupplier.secondIndustryCategoryName='';
            this.industryCfg.data={};
        },
        // 供应商分类弹框
        supplierClose(){
            this.supplierShow.show=false;
        },
        supplierSure(item){
            this.supplierShow.show=false;
            this.newsupplier.supplierCategoryCode=item.supplierCategoryCode;
            this.newsupplier.supplierCategoryName=item.supplierCategoryName;
        },
        //业务员弹框
        // codeClose(){
        //     this.codeModal.show = false;
        // },
        // codeSure(){
        //     this.codeModal.show = false;
        //     this.newsupplier.employeeCode=this.pickedcode;
        //     this.newsupplier.employeeName=this.pickedname;
        // },
        pickPerson(data){
            this.codeModal.show=false;
            this.newsupplier.employeeCode=data.employeeCode;
            this.newsupplier.employeeName=data.employeeName;
        },
        industrySure(data,parent){
            this.newsupplier.firstIndustryCategoryCode=parent.industryCode;
            this.newsupplier.firstIndustryCategoryName=parent.industryName;
            this.newsupplier.secondIndustryCategoryCode=data.industryCode;
            this.newsupplier.secondIndustryCategoryName=data.industryName;
            this.industryCfg.data=data
        }
    },
    ready(){
        //初始化时拿到币种列表
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
        //初始化拿到付款条件
        this.$http.post(__URL.arc+'pay/agreement/list',{}).then(
            (res) => {
                if(res.data.success){
                    this.agreementList=res.data.data;
                }
            },
            (err) => {
                console.log('初始化未能拿到付款数据')
            }
        )
        //初始化拿到结算方式
        this.$http.post(__URL.arc+'payment/list',{}).then(
            (res) => {
                if(res.data.success){
                    this.paymentList=res.data.data.dataList
                }
            },
            (err) => {
                console.log('初始化未能拿到结算数据')
            }
        )
        //初始化拿到增值税率
        this.$http.post(__URL.arc+'taxrate/list',{}).then(
            (res) => {
                if(res.data.success){
                    this.taxRateList=res.data.data.dataList;
                }
            },
            (err) => {
                console.log('初始化未能拿到税率数据')
            }
        )
    }
}
</script>
<template>
    <div class="inner-wrapper">
        <alert @cb='sureDeleteContact' :config="dCfg"></alert>
        <warning :config="wCfg"></warning>
        <div class="inner-content">

            <h2 class="tag">供应商档案信息</h2>

            <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
            <div class="inner-item form-box">
                <div class="form-group">
                    <label><span class="must-point">*</span>供应商名称:</label>
                    <!-- 如果要加验证请加外层dom -->
                    <!-- <div class="vaGroup">
                        <input v-va:vtel='valiVal' tag='验证1' type="text" v-model='valiVal'>
                    </div> -->
                    <input type='text' maxlength='32' v-model='newsupplier.supplierName'>
                    <!-- <i class="error" v-show='valiShow.supplierName'>供应商名称不能为空</i> -->
                </div>
                <div class="form-group">
                    <label><span class="must-point">*</span>供应商分类:</label>
                    <div class="s-input ic2">
                        <input v-model='newsupplier.supplierCategoryName' readonly type="text">
                        <i class="icon-close__round r2" v-show='newsupplier.supplierCategoryName' @click='clearCategoryName'></i>
                        <i @click='searchCategory' class="icon-search r1"></i>
                    </div>
                    <!-- <i class="error" v-show='valiShow.supplierCategoryName'>供应商分类不能为空</i> -->
                </div>
                <div class="form-group">
                    <label><span class="must-point">*</span>供应商行业:</label>
                    <div class="s-input ic2">
                        <input v-model='newsupplier.secondIndustryCategoryName' readonly type="text">
                        <i class="icon-close__round r2" v-show='newsupplier.secondIndustryCategoryName' @click='clearIndustry'></i>
                        <i @click='searchIndustry' class="icon-search r1"></i>
                    </div>
                    <!-- <i class="error" v-show='valiShow.industryName'>供应商行业不能为空</i> -->
                </div>
                <div class="form-group">
                    <label><span class="must-point">*</span>采购员:</label>
                    <div class="s-input ic2">
                        <input v-model='newsupplier.employeeName' readonly type="text">
                        <i class="icon-close__round r2" v-show='newsupplier.employeeName' @click='clearemployeeName'></i>
                        <i @click='searchemployee' class="icon-search r1"></i>
                    </div>
                    <!-- <i class="error" v-show='valiShow.employeeName'>采购员不能为空</i> -->
                </div>
                <div class="form-group">
                    <label><span class="must-point">*</span>默认币种:</label>
                    <select v-model='newsupplier.currencyCode'>
                        <option :value='item.currencyCode' v-for='item in allCurrency'>{{item.currencyName}}</option>
                    </select>
                    <!-- <i class="error" v-show='valiShow.currency'>默认币种不能为空</i> -->
                </div>
                <div class="form-group">
                    <label><span class="must-point">*</span>税率(%):</label>
                    <!-- <input type="number" maxlength='2' v-model='newsupplier.taxRate'> -->
                    <select v-model='newsupplier.taxCode'>
                        <option :value='item.taxCode' v-for='item in taxRateList'>{{item.taxRate}}</option>
                    </select>
                    <!-- <i class="error" v-show='valiShow.taxRate'>税率不能为空</i> -->
                </div>
                <div class="form-group">
                    <label>付款条件:</label>
                    <select v-model='newsupplier.payAgreementCode'>
                        <option :value='item.payAgreementCode' v-for='item in agreementList'>{{item.payAgreementName}}
                        </option>
                    </select>
                </div>
                <div class="form-group">
                    <label>结算方式:</label>
                    <select v-model='newsupplier.paymentCode'>
                        <option :value='item.paymentCode' v-for='item in paymentList'>{{item.paymentName}}</option>
                    </select>
                </div>
            </div>

            <div class="inner-item mt-15">
                <div class="form-group wd-100">
                    <label>附件</label>
                   <!--  <div class='annexBox'>
                        <a class='img_item' v-for='imgitem in newsupplier.attachments'
                           :href="imgitem.downloadUrl?imgitem.downloadUrl:'javascript:;'">
                            {{imgitem.fileName}}
                            <i @click='deleteImg($index)' class="icon-modal__close ml-5"></i>
                        </a>
                        <upfile @cb='success' :config="upfileCfg"></upfile>
                    </div> -->
                    <div class='annexBox'>
                        <upfile-group :config='uCfg' :edit="isEdit" :data="newsupplier.attachments"></upfile-group>
                    </div>

                </div>
                <div class="form-group wd-100">
                    <label>备注</label>
                    <input type="text" maxlength='120' v-model='newsupplier.remark'>
                </div>
            </div>

            <div class="inner-item">
                <tab-bar :config.sync='tabConfig'></tab-bar>
                <tab-container :active.sync='tabConfig.select'>
                    <tab-item id='tab1'>
                        <table class='inner-table mt-15'>
                            <thead>
                                <tr>
                                    <th width="40px">序号</th>
                                    <th width="110px">联系人</th>
                                    <th width="120px">职务</th>
                                    <th width="140px">联系电话</th>
                                    <th width="160px">E-mail</th>
                                    <th width="260px">地址</th>
                                    <th width="90px">默认订单联系人</th>
                                    <th width="60px">操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for='item in newsupplier.contacts'>
                                    <td>{{$index+1}}</td>
                                    <td>
                                        <input type='text' placeholder='联系人' v-model='item.contactName' maxlength='16'>
                                    </td>
                                    <td>
                                        <input type='text' placeholder='职务' v-model='item.duty' maxlength='16'>
                                    </td>
                                    <td>
                                        <input type='text' placeholder='联系电话' v-model='item.phone' maxlength='100'>
                                    </td>
                                    <td>
                                        <input type='text' placeholder='E-mail' v-model='item.email' maxlength='120'>
                                    </td>
                                    <td>
                                        <input class="w100" type='text' placeholder='地址' v-model='item.address' maxlength='32'>
                                    </td>
                                    <td>
                                        <!-- <input type='radio'  @change='changeMajor($index)'  v-model='item.major' name='major'> -->
                                        <select v-model='item.major' @change='changeMajor($index)' style='width:100%'>
                                            <option :value='true'>是</option>
                                            <option :value='false'>否</option>
                                        </select>
                                    </td>
                                    <td>
                                        <!-- <i @click='deleteContact($index)' class="icon-modal__close r2" style='vertical-align:-webkit-baseline-middle'></i>-->
                                        <button class="button-danger" @click='deleteContact($index)'>删除</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <div class="add-wrap">
                            <button @click='addContact'><i class="icon icon-contacts__add"></i>新增联系人</button>
                        </div>

                    </tab-item>
                </tab-container>
            </div>
        </div>
    </div>
    <div class="inner-footer">
        <button @click='cancelsupplier' class="btn-xl-def">取消</button>
        <button @click='savesupplier' class="btn-xl-imp">保存</button>
    </div>
    <!-- 采购员弹框 start -->
    <!-- <modal :config.sync='codeModal' @codeclose='codeClose' @codesure='codeSure'> -->
    <refer-employee :config='codeModal' @cb='pickPerson'></refer-employee>
    <!-- </modal> -->
    <!-- 采购员弹框 end -->
    <!-- 供应商分类弹框 start -->
    <modal :config.sync='supplierShow'>
        <category-supplier @cb='supplierSure'></category-supplier>
    </modal>
    <!-- 供应商分类弹框 end -->
    <!-- 行业分类弹框 start -->
    <category-industry :config='industryCfg' @cb='industrySure'></category-industry>
    <!-- 行业分类弹框 end -->
    <warning :config="msgconfig"></warning>
</template>
<style lang='less' scoped>
@import '../../../../../public/css/variable.less';
/* 此处为自己定义的样式 */
.inner_body{
    width: 1140px;
    margin: 0 auto;
    padding-top: 20px;
    background: white;
    margin-top: 20px;
    border: 1px solid #F2F3F3;
}
.cont{
    padding: 0 20px;
}
.error {
    font-style: normal;
    position: absolute;
    margin-top: 4px;
    left: 100px;
    top: 28px;
    width: 210px;
    color: @danger;
    font-size: @font-size-small;
}
.searchBox {
    display: flex;
    flex-wrap: wrap;
    border-bottom: 1px solid #F2F3F3;
}

.inner-wrapper{
    background: #fbfbfb;
}

table {
    border-collapse: collapse;
}

.w100 {
    width: 100%;
}
</style>
