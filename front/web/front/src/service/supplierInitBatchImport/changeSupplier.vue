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
                industryName:false,
                supplierCategoryName: false,
                supplierName: false,
                employeeName:false,
                currency:false,
                taxRate:false
            },
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
                width: '600px',
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
                    name: '关闭',
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
                content:'修改成功',
                type:'success'
            },
            dCfg:{
                show:false,
                msg:'确定是否删除所选择的行记录吗？',
                subMsg:'删除后不可以恢复！',
                type:'failure',
                index:''
            },
            cdCfg:{
                show:false,
                msg:'确定是否删除？',
                subMsg:'',
                type:'failure'
            },
        }
    },
    props:['detail','edit'],
    methods: {
        // 上传组件回调成功事件
        success(val) {
            let ucloud = this.newSupplier.attachments;
            let imgItem = {
                fileId: val.fileId,
                fileName: val.fileName
            }
            if(ucloud.length>=6){
                this.msgconfig.show=true
                this.msgconfig.content='附件最多上传6个'
                return
            }
            ucloud.push(imgItem)
        },
        // 组件删除事件
        deleteImg(index) {
            this.newSupplier.attachments.splice(index, 1)
        },
        //新增联系人
        addContact(){
            if(this.newSupplier.contacts.length>=1){
                this.newSupplier.contacts.push({'major':false})
            }else{
                this.newSupplier.contacts.push({'major':true})
            }
        },
        //删除联系人
        deleteContact(index){
            this.dCfg.show=true;
            this.dCfg.index=index
        },
        //确认删除联系人
        sureDeleteContact(){
            this.newSupplier.contacts.splice(this.dCfg.index,1)
            this.dCfg.index=''
        },
        //修改主联系人
        changeMajor(index){
            if(this.newSupplier.contacts[index].major==true){
                for(var i=0;i<this.newSupplier.contacts.length;i++){
                    this.newSupplier.contacts[i].major=false
                }
                this.newSupplier.contacts[index].major=true
            }
        },
        //保存事件
        saveSupplier(){
            if(!this.ajaxlock){
                return
            }
            var flag=true;
            if(this.newSupplier.secondIndustryCategoryCode==''){
                this.valiShow.industryName=true;
                flag=false;
            }else{
                this.valiShow.industryName=false;
            }
            if(this.newSupplier.supplierCategoryCode==''){
                this.valiShow.supplierCategoryName=true;
                flag=false;
            }else{
                this.valiShow.supplierCategoryName=false;
            }
            if(this.newSupplier.supplierName==''){
                this.valiShow.supplierName=true;
                flag=false;
            }else{
                this.valiShow.supplierName=false;
            }
            if(this.newSupplier.employeeName==''){
                this.valiShow.employeeName=true;
                flag=false;
            }else{
                this.valiShow.employeeName=false;
            }
            if(this.newSupplier.currencyCode==''){
                this.valiShow.currency=true;
                flag=false;
            }else{
                this.valiShow.currency=false;
                for(var i=0;i<this.allCurrency.length;i++){
                    if(this.newSupplier.currencyCode==this.allCurrency[i].currencyCode){
                        this.newSupplier.currencyName=this.allCurrency[i].currencyName
                    }
                }
            }
            //根据增值税率code添加name
            if(this.newSupplier.taxCode!=''){
                for(var i=0;i<this.taxRateList.length;i++){
                    if(this.newSupplier.taxCode==this.taxRateList[i].taxCode){
                        this.newSupplier.taxRate=this.taxRateList[i].taxRate
                    }
                }
            }
            if(this.newSupplier.taxCode===undefined){
                this.valiShow.taxRate=true;
                flag=false;
            }else{
                this.valiShow.taxRate=false;
            }
             //根据付款条件code添加name
            if(this.newSupplier.payAgreementCode!=''){
                for(var i=0;i<this.agreementList.length;i++){
                    if(this.newSupplier.payAgreementCode==this.agreementList[i].payAgreementCode){
                        this.newSupplier.payAgreementName=this.agreementList[i].payAgreementName
                    }
                }
            }
            //根据结算方式code添加name
            if(this.newSupplier.paymentCode!=''){
                for(var i=0;i<this.paymentList.length;i++){
                    if(this.newSupplier.paymentCode==this.paymentList[i].paymentCode){
                        this.newSupplier.paymentName=this.paymentList[i].paymentName
                    }
                }
            }

            //检查联系人并将major替换成布尔值
            for(var i=0;i<this.newSupplier.contacts.length;i++){
                if(!this.newSupplier.contacts[i].contactName){
                    this.msgconfig.show=true;
                    this.msgconfig.content='联系人名称不能为空';
                    this.flag=false;
                    return
                }else if(!this.newSupplier.contacts[i].phone){
                    this.msgconfig.show=true;
                    this.msgconfig.content='联系人电话不能为空';
                    this.flag=false;
                    return
                }
            }
            var data=this.newSupplier;
            //新需求加属性区别于正式的导入
            data.sourceBeginPeriod=true
            // if(flag){
                // for(var i=0;i<this.newCustomer.contacts.length;i++){
                //     if(this.newCustomer.contacts[i].major=='on'){
                //         this.newCustomer.contacts[i].major=true
                //     }else{
                //         this.newCustomer.contacts[i].major=false
                //     }
                // }
                this.ajaxlock=false;
                this.$http.post(__URL.arc + 'supplier/update', data).then(
                    (res) => {
                        this.ajaxlock=true;
                        if(res.data.success){
                            // this.show=false;
                            // this.wCfg.show=true;
                            this.$emit('refresh','保存成功！')
                            // this.refreshDetail();
                            // this.edit=false;
                            // this.$emit('refresh', this.newCustomer.customerCategoryCode)
                        }else{
                            this.msgconfig.show=true
                            this.msgconfig.content=res.data.errMsg
                            //请求失败时江major转回on
                            // for(var i=0;i<this.newCustomer.contacts.length;i++){
                            //     if(this.newCustomer.contacts[i].major==true){
                            //         this.newCustomer.contacts[i].major='on'
                            //     }else{
                            //         this.newCustomer.contacts[i].major=''
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
        // cancelCustomer(){
        //     this.$emit('refresh')
        // },
        //供应商分类和采购弹框
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
            this.newSupplier.supplierCategoryCode='';
            this.newSupplier.supplierCategoryName='';
        },
        clearemployeeName(){
            this.newSupplier.employeeCode='';
            this.newSupplier.employeeName='';
        },
        clearIndustry(){
            this.newSupplier.firstIndustryCategoryCode='';
            this.newSupplier.firstIndustryCategoryName='';
            this.newSupplier.secondIndustryCategoryCode='';
            this.newSupplier.secondIndustryCategoryName='';
            this.industryCfg.data={};
        },
        // 供应商分类弹框
        supplierClose(){
            this.supplierShow.show=false;
        },
        supplierSure(item){
            this.supplierShow.show=false;
            this.newSupplier.supplierCategoryCode=item.supplierCategoryCode;
            this.newSupplier.supplierCategoryName=item.supplierCategoryName;
        },
        //采购员弹框
        // codeClose(){
        //     this.codeModal.show = false;
        // },
        // codeSure(){
        //     this.codeModal.show = false;
        //     this.newCustomer.employeeCode=this.pickedcode;
        //     this.newCustomer.employeeName=this.pickedname;
        // },
        pickPerson(data){
            this.codeModal.show=false;
            this.newSupplier.employeeCode=data.employeeCode;
            this.newSupplier.employeeName=data.employeeName;
        },
        industrySure(data,parent){
            this.newSupplier.firstIndustryCategoryCode=parent.industryCode;
            this.newSupplier.firstIndustryCategoryName=parent.industryName;
            this.newSupplier.secondIndustryCategoryCode=data.industryCode;
            this.newSupplier.secondIndustryCategoryName=data.industryName;
            this.industryCfg.data=data
        },
        //进入编辑状态
        enterEdit(){
            this.edit=true
        },
        //放弃修改
        cancelEdit(){
            this.$emit('refresh')
            // this.refreshDetail();
            // this.edit=false;
        },
        //刷新内页数据
        refreshDetail(){
            this.$http.get(__URL.arc+'supplier/detail/'+this.newSupplier.supplierCode).then(
                (res) => {
                    this.detail=res.data.data;
                }
            )
        },
        //删除当前供应商档案
        deleteSupplier(){
            this.cdCfg.show=true;
        },
        sureDeleteSupplier(){
            this.$http.get(__URL.arc+'supplier/delete/'+this.newSupplier.supplierCode).then(
                (res) => {
                    this.cdCfg.show=false;
                    if(res.data.success){
                        this.$emit('refresh','删除成功！')
                    }else{
                        this.msgconfig.show=true
                        this.msgconfig.content=res.data.errMsg
                    }
                }
            )
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
                    this.paymentList=res.data.data.dataList;
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
    },
    computed:{
        newSupplier:function(){
            return this.detail
        }
    }
}
</script>
<template>
    <div class="inner-wrapper">
        <alert @cb='sureDeleteContact' :config="dCfg"></alert>
        <warning :config="wCfg"></warning>
        <alert @cb='sureDeleteSupplier' :config="cdCfg"></alert>
        <!-- 编辑状态 -->

        <div class="inner-content" v-show='edit==true'>

            <h2 class="tag">供应商档案信息</h2>

                    <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
                    <div class="inner-item form-box">
                        <div class="form-group">
                            <label><span class="must-point">*</span>行业分类:</label>
                            <div class="s-input ic2">
                                <input v-model='newSupplier.secondIndustryCategoryName' readonly type="text">
                                <i class="icon-close__round r2" v-show='newSupplier.secondIndustryCategoryName' @click='clearIndustry'></i>
                                <i @click='searchIndustry' class="icon-search r1"></i>
                            </div>
                            <!-- <i class="error" v-show='valiShow.industryName'>行业分类不能为空</i> -->
                        </div>
                        <div class="form-group">
                            <label>供应商分类:</label>
                            <div class="s-input ic2">
                                <input v-model='newSupplier.supplierCategoryName' readonly type="text">
                                <i class="icon-close__round r2" v-show='newSupplier.supplierCategoryName' @click='clearCategoryName'></i>
                                <i @click='searchCategory' class="icon-search r1"></i>
                            </div>
                            <!-- <i class="error" v-show='valiShow.supplierCategoryName'>供应商分类不能为空</i> -->
                        </div>
                        <div class="form-group">
                            <label><span class="must-point">*</span>供应商名称:</label>
                            <!-- 如果要加验证请加外层dom -->
                            <!-- <div class="vaGroup">
                                <input v-va:vtel='valiVal' tag='验证1' type="text" v-model='valiVal'>
                            </div> -->
                            <input type='text' maxlength='32' v-model='newSupplier.supplierName'>
                            <!-- <i class="error" v-show='valiShow.supplierName'>供应商名称不能为空</i> -->
                        </div>
                        <div class="form-group">
                            <label><span class="must-point">*</span>采购员:</label>
                            <div class="s-input ic2">
                                <input v-model='newSupplier.employeeName' readonly type="text">
                                <i class="icon-close__round r2" v-show='newSupplier.employeeName' @click='clearemployeeName'></i>
                                <i @click='searchemployee' class="icon-search r1"></i>
                            </div>
                            <!-- <i class="error" v-show='valiShow.employeeName'>采购员不能为空</i> -->
                        </div>
                        <div class="form-group">
                            <label><span class="must-point">*</span>默认币种:</label>
                            <select v-model='newSupplier.currencyCode'>
                                <option :value='item.currencyCode' v-for='item in allCurrency'>{{item.currencyName}}</option>
                            </select>
                            <!-- <i class="error" v-show='valiShow.currency'>默认币种不能为空</i> -->
                        </div>
                        <div class="form-group">
                            <label><span class="must-point">*</span>税率(%):</label>
                            <!-- <input type="number" maxlength='2' v-model='newCustomer.taxRate'> -->
                            <select v-model='newSupplier.taxCode'>
                                <option :value='item.taxCode' v-for='item in taxRateList'>{{item.taxRate}}</option>
                            </select>
                            <!-- <i class="error" v-show='valiShow.taxRate'>税率不能为空</i> -->
                        </div>
                        <div class="form-group">
                            <label>付款条件:</label>
                            <select v-model='newSupplier.payAgreementCode'>
                                <option :value='item.payAgreementCode' v-for='item in agreementList'>{{item.payAgreementName}}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>结算方式:</label>
                            <select v-model='newSupplier.paymentCode'>
                                <option :value='item.paymentCode' v-for='item in paymentList'>{{item.paymentName}}</option>
                            </select>
                        </div>
                    </div>

                    <div class="inner-item mt-15">
                        <div class="form-group wd-100">
                            <label>附件:</label>
                            <div class='annexBox'>
                                <a class='img_item' v-for='imgitem in newSupplier.attachments' href="javascript:;">
                                    {{imgitem.fileName}}
                                    <i @click='deleteImg($index)' class="icon-modal__close ml-5"></i>
                                </a>
                                <upfile @cb='success' :config="upfileCfg"></upfile>
                            </div>

                        </div>
                        <div class="form-group wd-100">
                            <label>备注:</label>
                            <input type="text" maxlength='120' v-model='newSupplier.remark'>
                        </div>
                    </div>

                    <div class="inner-item">
                        <tab-bar :config.sync='tabConfig'></tab-bar>
                        <tab-container :active.sync='tabConfig.select'>
                            <tab-item id='tab1'>
                                <table class='inner-table mt-15'>
                                <thead>
                                    <tr>
                                        <th style='width:50px'>序号</th>
                                        <th style='width:120px'>联系人</th>
                                        <th style='width:150px'>职务</th>
                                        <th style='width:170px'>联系电话</th>
                                        <th style='width:180px'>地址</th>
                                        <th style='width:160px'>E-mail</th>
                                        <th style="width: 110px">默认订单联系人</th>
                                        <th style="width: 60px">操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for='item in newSupplier.contacts'>
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
                                            <input type='text' placeholder='地址' v-model='item.address' maxlength='32'>
                                        </td>
                                        <td>
                                            <input type='text' placeholder='E-mail' v-model='item.email' maxlength='120'>
                                        </td>
                                        <td>
                                            <!-- <input type='radio'  @change='changeMajor($index)'  v-model='item.major' name='major'> -->
                                            <select v-model='item.major' @change='changeMajor($index)' style='width:100%'>
                                                <option :value='true'>是</option>
                                                <option :value='false'>否</option>
                                            </select>
                                        </td>
                                        <td>
                                            <!-- <i @click='deleteContact($index)' class="icon-modal__close r2" style='vertical-align:-webkit-baseline-middle'></i>
 -->                                         <a @click='deleteContact($index)' class="delete">删除</a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <div class="add-wrap" >
                                <button @click='addContact'><i class="icon icon-contacts__add"></i>新增联系人</button>
                            </div>

                            </tab-item>
                        </tab-container>
                    </div>
        </div>

        <!-- 只读状态 -->

        <div class="inner-content" v-show='edit==false'>

            <h2 class="tag">供应商档案信息</h2>

                    <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
                    <div class="inner-item form-box">
                        <div class="form-group">
                            <label><!-- <span class="must-point">*</span> -->行业分类:</label>
                            <!-- <div class="s-input ic2">
                                <input v-model='newCustomer.industryName' readonly type="text">
                                <i class="icon-modal__close r2" @click='clearIndustry'></i>
                                <i @click='searchIndustry' class="icon-search r1"></i>
                            </div>
                            <i class="error" v-show='valiShow.industryName'>行业分类不能为空</i> -->
                            <p>{{newSupplier.industryName}}</p>
                        </div>
                        <div class="form-group">
                            <label><!-- <span class="must-point">*</span> -->供应商分类:</label>
                            <!-- <div class="s-input ic2">
                                <input v-model='newCustomer.customerCategoryName' readonly type="text">
                                <i class="icon-modal__close r2" @click='clearCategoryName'></i>
                                <i @click='searchCategory' class="icon-search r1"></i>
                            </div>
                            <i class="error" v-show='valiShow.customerCategoryName'>供应商分类不能为空</i> -->
                            <p>{{newSupplier.supplierCategoryName}}</p>
                        </div>
                        <div class="form-group">
                            <label><!-- <span class="must-point">*</span> -->供应商名称:</label>
                            <!-- 如果要加验证请加外层dom -->
                            <!-- <div class="vaGroup">
                                <input v-va:vtel='valiVal' tag='验证1' type="text" v-model='valiVal'>
                            </div> -->
                            <!-- <input type='text' maxlength='32' v-model='newCustomer.customerName'>
                            <i class="error" v-show='valiShow.customerName'>供应商名称不能为空</i> -->
                            <p>{{newSupplier.supplierName}}</p>
                        </div>
                        <div class="form-group">
                            <label><!-- <span class="must-point">*</span> -->采购员:</label>
                            <!-- <div class="s-input ic2">
                                <input v-model='newCustomer.employeeName' readonly type="text">
                                <i class="icon-modal__close r2" @click='clearemployeeName'></i>
                                <i @click='searchemployee' class="icon-search r1"></i>
                            </div>
                            <i class="error" v-show='valiShow.employeeName'>采购员不能为空</i> -->
                            <p>{{newSupplier.employeeName}}</p>
                        </div>
                        <div class="form-group">
                            <label><!-- <span class="must-point">*</span> -->默认币种:</label>
                            <!-- <select v-model='newCustomer.currencyCode'>
                                <option :value='item.currencyCode' v-for='item in allCurrency'>{{item.currencyName}}</option>
                            </select>
                            <i class="error" v-show='valiShow.currency'>默认币种不能为空</i> -->
                            <p>{{newSupplier.currencyName}}</p>
                        </div>
                        <div class="form-group">
                            <label><!-- <span class="must-point">*</span> -->税率(%):</label>
                            <!-- <input type="number" maxlength='2' v-model='newCustomer.taxRate'> -->
                            <!-- <select v-model='newCustomer.taxCode'>
                                <option :value='item.taxCode' v-for='item in taxRateList'>{{item.taxRate}}</option>
                            </select>
                            <i class="error" v-show='valiShow.taxRate'>增值税率不能为空</i> -->
                            <p>{{newSupplier.taxRate}}</p>
                        </div>
                        <div class="form-group">
                            <label>付款条件:</label>
                            <!-- <select v-model='newCustomer.recAgreementCode'>
                                <option :value='item.recAgreementCode' v-for='item in agreementList'>{{item.recAgreementName}}</option>
                            </select> -->
                            <p>{{newSupplier.payAgreementName}}</p>
                        </div>
                        <div class="form-group">
                            <label>结算方式:</label>
                            <!-- <select v-model='newCustomer.paymentCode'>
                                <option :value='item.paymentCode' v-for='item in paymentList'>{{item.paymentName}}</option>
                            </select> -->
                            <p>{{newSupplier.paymentName}}</p>
                        </div>
                    </div>
                    <div class="inner-item mt-15">
                        <div class="form-group wd-100">
                            <label>附件:</label>
                            <div class='annexBox'>
                                <a class='img_item' v-for='imgitem in newSupplier.attachments' :href="imgitem.url?imgitem.url:'javascript:;'">
                                    {{imgitem.fileName}}
                                    <!-- <i @click='deleteImg($index)' class="icon-modal__close ml-5"></i> -->
                                </a>
                                <!-- <upload @cb='success' :config="upfileCfg"></upload> -->
                            </div>

                        </div>
                        <div class="form-group wd-100 align-items__baseline">
                            <label>备注:</label>
                            <!-- <input type="text" maxlength='120' v-model='newCustomer.remark'> -->
                            <p class="lh-20">{{newSupplier.remark}}</p>
                        </div>
                    </div>

                    <div class="inner-item">
                        <tab-bar :config.sync='tabConfig'></tab-bar>
                        <tab-container :active.sync='tabConfig.select'>
                            <tab-item id='tab1'>
                                <table class='inner-table mt-15'>
                                <thead>
                                    <tr>
                                        <th style='width:50px'>序号</th>
                                        <th style='width:120px'>联系人</th>
                                        <th style='width:150px'>职务</th>
                                        <th style='width:170px'>联系电话</th>
                                        <th style='width:270px'>地址</th>
                                        <th style='width:200px'>E-mail</th>
                                        <th>默认订单联系人</th>
                                        <!-- <td>操作</td> -->
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for='item in newSupplier.contacts'>
                                        <td>{{$index+1}}</td>
                                        <td>
                                            <!-- <input type='text' style='width:80px' placeholder='联系人' v-model='item.contactName' maxlength='16'> -->
                                            <p>{{item.contactName}}</p>
                                        </td>
                                        <td>
                                            <!-- <input type='text' style='width:80px' placeholder='职务' v-model='item.duty' maxlength='16'> -->
                                            <p>{{item.duty}}</p>
                                        </td>
                                        <td>
                                            <!-- <input type='text' style='width:120px' placeholder='联系电话' v-model='item.phone' maxlength='100'> -->
                                            <p>{{item.phone}}</p>
                                        </td>
                                        <td>
                                            <!-- <input type='text' style='width:150px' placeholder='地址' v-model='item.address' maxlength='32'> -->
                                            <p>{{item.address}}</p>
                                        </td>
                                        <td>
                                            <!-- <input type='text' style='width:150px' placeholder='E-mail' v-model='item.email' maxlength='120'> -->
                                            <p>{{item.email}}</p>
                                        </td>
                                        <td>
                                            <!-- <input type='radio'  @change='changeMajor($index)'  v-model='item.major' name='major'> -->
                                            <!-- <select v-model='item.major' @change='changeMajor($index)'>
                                                <option :value='true'>是</option>
                                                <option :value='false'>否</option>
                                            </select> -->
                                            <p v-show='item.major==true'>是</p>
                                            <p v-show='item.major==false'>否</p>
                                        </td>
                                        <!-- <td>
                                            <i @click='deleteContact($index)' class="icon-modal__close r2" style='vertical-align:-webkit-baseline-middle'></i>
                                         <a @click='deleteContact($index)'>删除</a>
                                        </td> -->
                                    </tr>
                                </tbody>
                            </table>

                            </tab-item>
                        </tab-container>
                    </div>
            </div>
        </div>
    </div>
    <div class="inner-footer">
        <button v-if='edit==true' @click='cancelEdit' class="btn-xl-def">取消</button>
        <button v-if='edit==true' @click='saveSupplier' class="btn-xl-imp">保存</button>
        <!--暂时屏蔽删除操作-->
        <!--<button v-if='edit==false' @click='deleteSupplier' class="btn-xl-danger">删除</button>-->
        <button v-if='edit==false' @click='enterEdit' class="btn-xl-imp">编辑</button>
    </div>
    <!-- 采购员弹框 start -->
    <!-- <modal :config.sync='codeModal' @codeclose='codeClose' @codesure='codeSure'> -->
        <refer-employee :config='codeModal' @cb='pickPerson' ></refer-employee>
    <!-- </modal> -->
    <!-- 采购员弹框 end -->
    <!-- 供应商分类弹框 start -->
    <modal :config.sync='supplierShow'>
        <category-supplier  @cb='supplierSure'></category-supplier>
    </modal>
    <!-- 供应商分类弹框 end -->
    <!-- 行业分类弹框 start -->
    <category-industry :config='industryCfg' @cb='industrySure'></category-industry>
    <!-- 行业分类弹框 end -->
    <warning :config="msgconfig" ></warning>
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
.inner-wrapper{
    background: #fbfbfb;
}
</style>
