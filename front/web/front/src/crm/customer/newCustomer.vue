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
                    }, {
                        id: 'tab2',
                        name: '货运地址',
                        icon: 'icon-freight__address'
                    }]
                },
                docDateConfig: {
                    placeholder: '请选择成立日期',
                    format: 'YYYY-MM-DD',
                    maxDate: new Date(),
                    clear: false
                },
                valiShow: {
                    industryName: false,
                    customerCategoryName: false,
                    customerName: false,
                    employeeName: false,
                    currency: false,
                    taxRate: false
                },
                newCustomer: JSON.parse(JSON.stringify(cfg.customerCfg)),
                uCfg: {
                    limit: 6,
                },
                isEdit: true,
                allCurrency: [],
                allAgreement: [],
                allPayment: [],
                allRegionLocation: [],
                allDisPatchModel: [{name: "FOB", code: "FOB"}, {name: "CIF", code: "CIF"}, {name: "EXW", code: "EXW"}],
                allTransport: [{name: "本公司负责", code: "本公司负责"}, {name: "客户负责", code: "客户负责"}],
                allCustomerDeclaration: [{name: "需要报关", code: "是"}, {name: "不需要报关", code: "否"}],
                allImportanceRating: [],
                allCreditRating: [],
                allCustomerStatus: [],
                allBusinessLiaison: [],
                ajaxlock: true,
                selectDate: [{name: "国内", code: "BU020"}, {name: "海外", code: "BU021"}],
                //业务员弹框
                codeModal: {
                    show: false,
                    width: '800px',
                    height: '400px',
                    header: '请选择业务员',
                    btn: [{
                        name: '关闭',
                        emit: 'codeclose'
                    }, {
                        name: '确认',
                        emit: 'codesure'
                    }]
                },
                //行业分类弹框
                industryCfg: {
                    show: false,
                    data: {},
                    notChoiceFirst: true
                },
                pickedname: '',
                pickedcode: '',
                //msg
                msgconfig: {
                    type: 'warning',
                    show: false,
                    content: ''
                },
                wCfg: {
                    show: false,
                    content: '保存成功',
                    type: 'success'
                },
                dCfg: {
                    show: false,
                    msg: '请确认是否删除此联系人？',
                    subMsg: '删除后不可以恢复！',
                    type: 'failure',
                    index: ''
                },
                aCfg:{
                    show:false,
                    msg:'请确认是否删除此货运地址？',
                    subMsg:'删除后不可以恢复！',
                    type:'failure',
                    index:''
                }
            }
        },
        methods: {
            // 上传组件回调成功事件
            success(val) {
                let ucloud = this.newCustomer.attachments;
                let imgItem = {
                    fileId: val.fileId,
                    fileName: val.fileName
                }
                if (ucloud.length >= 6) {
                    this.msgconfig.show = true
                    this.msgconfig.content = '附件最多上传6个'
                    return
                }
                ucloud.push(imgItem)
            },
            // 组件删除事件
            deleteImg(index) {
                this.newCustomer.attachments.splice(index, 1)
            },
            //新增联系人
            addContact(){
                var contact = {
                    "contactCode": "",
                    "contactName": "",
                    "duty": "",
                    "address": "",
                    "phone": "",
                    "email": "",
                    "businessLiaisonCode": "",
                    "businessLiaisonName": "",
                    "remark": "",
                    "customerCode": "",
                };
                this.newCustomer.contacts.push(contact);
            },
            //删除联系人
            deleteContact(index){
                this.dCfg.show = true;
                this.dCfg.index = index
            },
            //确认删除联系人
            sureDeleteContact(){
                this.newCustomer.contacts.splice(this.dCfg.index, 1)
                this.dCfg.index = ''
            },
            //新增货运地址
            addAddress(){
                var address = {
                    "addressCode": "",
                    "address": "",
                    "customerCode": "",
                    "isDefault": ""
                };
                if (this.newCustomer.addresses.length >= 1) {
                    address.isDefault = "";
                    this.newCustomer.addresses.push(address);
                } else {
                    address.isDefault = "on";
                    this.newCustomer.addresses.push(address);
                }
            },
            //修改默认地址
            changeAddress(index){
                for (var i = 0; i < this.newCustomer.addresses.length; i++) {
                    this.newCustomer.addresses[i].isDefault = "";
                }
                this.newCustomer.addresses[index].isDefault = "on";
            },
            //删除货运地址
            deleteAddress(index){
                this.aCfg.show = true;
                this.aCfg.index = index
            },
            //确认删除货运地址
            sureDeleteAddress(){
                this.newCustomer.addresses.splice(this.aCfg.index, 1)
                this.aCfg.index = ''
            },
            getLocation(){
                //初始化拿到区域列表
                this.$http.post(__URL.crm + 'regionLocation/remote/' + this.newCustomer.regionCategoryCode, {}).then(
                    (res) => {
                        if (res.data.success) {
                            this.allRegionLocation = res.data.data;
                        }
                    },
                    (err) => {
                        console.log('初始化未能拿到区域列表数据')
                    }
                )
            },
            warnMessage(message, messageContent){
                var flag = true;
                if (message == '') {
                    this.msgconfig.show = true;
                    this.msgconfig.content = messageContent;
                    flag = false;
                }
                return flag;
            },
            //保存事件
            saveCustomer(ind){
                /*if (ind == 0) {
                    this.saveAjax(__URL.osiu + 'customer/add', this.newCustomer);
                    return
                }*/ /*else if (ind == 1) {
                    this.saveAjax(__URL.crm + 'customer/add', data);
                }*/
                if (!this.ajaxlock) {
                    return
                }
                var flag = true;
                flag = this.warnMessage(this.newCustomer.customerName, "请输入客户名称");
                if (!flag) {
                    return;
                }
                flag = this.warnMessage(this.newCustomer.regionCategoryCode, "请选择区域分类");
                if (!flag) {
                    return;
                }
                flag = this.warnMessage(this.newCustomer.regionLocationCode, "请选择区域");
                if (!flag) {
                    return;
                }
                flag = this.warnMessage(this.newCustomer.industryCode, "请选择行业分类");
                if (!flag) {
                    return;
                }
                flag = this.warnMessage(this.newCustomer.currencyCode, "请选择默认币种");
                if (!flag) {
                    return;
                }
                flag = this.warnMessage(this.newCustomer.importanceRatingCode, "请选择客户重要度分级");
                if (!flag) {
                    return;
                }
                flag = this.warnMessage(this.newCustomer.establishmentDate, "请选择成立日期");
                if (!flag) {
                    return;
                }
                //根据区域分类code添加name
                for (var i = 0; i < this.selectDate.length; i++) {
                    if (this.newCustomer.regionCategoryCode == this.selectDate[i].code) {
                        this.newCustomer.regionCategoryName = this.selectDate[i].name;
                    }
                }

                //根据区域code添加name
                for (var i = 0; i < this.allRegionLocation.length; i++) {
                    if (this.newCustomer.regionLocationCode == this.allRegionLocation[i].code) {
                        this.newCustomer.regionLocationName = this.allRegionLocation[i].name;
                    }
                }

                //根据币种code添加name
                for (var i = 0; i < this.allCurrency.length; i++) {
                    if (this.newCustomer.currencyCode == this.allCurrency[i].currencyCode) {
                        this.newCustomer.currencyName = this.allCurrency[i].currencyName
                    }
                }

                //根据收款协议code添加name
                if (this.newCustomer.recAgreementCode != '') {
                    for (var i = 0; i < this.allAgreement.length; i++) {
                        if (this.newCustomer.recAgreementCode == this.allAgreement[i].recAgreementCode) {
                            this.newCustomer.recAgreementName = this.allAgreement[i].recAgreementName
                        }
                    }
                }
                //根据结算方式code添加name
                if (this.newCustomer.paymentCode != '') {
                    for (var i = 0; i < this.allPayment.length; i++) {
                        if (this.newCustomer.paymentCode == this.allPayment[i].paymentCode) {
                            this.newCustomer.paymentName = this.allPayment[i].paymentName
                        }
                    }
                }

                if (this.newCustomer.dispatchModelCode != '') {
                    for (var i = 0; i < this.allDisPatchModel.length; i++) {
                        if (this.newCustomer.dispatchModelCode == this.allDisPatchModel[i].code) {
                            this.newCustomer.dispatchModelName = this.allDisPatchModel[i].name;
                        }
                    }
                }

                //根据重要度评级code添加name
                if (this.newCustomer.importanceRatingCode != '') {
                    for (var i = 0; i < this.allImportanceRating.length; i++) {
                        if (this.newCustomer.importanceRatingCode == this.allImportanceRating[i].code) {
                            this.newCustomer.importanceRatingName = this.allImportanceRating[i].name;
                        }
                    }
                }

                //根据信用评级code添加name
                if (this.newCustomer.creditRatingCode != '') {
                    for (var i = 0; i < this.allCreditRating.length; i++) {
                        if (this.newCustomer.creditRatingCode == this.allCreditRating[i].code) {
                            this.newCustomer.creditRatingName = this.allCreditRating[i].name;
                        }
                    }
                }

                //根据运输方code添加name
                if (this.newCustomer.transportCode != '') {
                    for (var i = 0; i < this.allTransport.length; i++) {
                        if (this.newCustomer.transportCode == this.allTransport[i].code) {
                            this.newCustomer.transportName = this.allTransport[i].name
                        }
                    }
                }

                this.newCustomer.customerStatusCode = 'BU0230001';
                for (var i = 0; i < this.allCustomerStatus.length; i++) {
                    if (this.newCustomer.customerStatusCode == this.allCustomerStatus[i].code) {
                        this.newCustomer.customerStatusName = this.allCustomerStatus[i].name;
                    }
                }

                this.newCustomer.cooperativeStateAssessment = '暂未合作';

                //检查联系人
                for (var i = 0; i < this.newCustomer.contacts.length; i++) {
                    if (this.newCustomer.contacts[i].businessLiaisonCode != '') {
                        for (var j = 0; j < this.allBusinessLiaison.length; j++) {
                            if (this.newCustomer.contacts[i].businessLiaisonCode == this.allBusinessLiaison[j].code) {
                                this.newCustomer.contacts[i].businessLiaisonName = this.allBusinessLiaison[j].name;
                            }
                        }
                    }
                }

                if (ind == 0) {
                    this.saveAjax(__URL.osiu + 'customer/add', this.newCustomer);
                } else if (ind == 1) {
                    this.saveAjax(__URL.crm + 'customer/add', this.newCustomer);
                }
                // }
            },
            saveAjax(url, param){
                this.ajaxlock = false;
                this.$http.post(url, param).then(
                    (res) => {
                        this.ajaxlock = true;
                        if (res.data.success) {
                            // this.show=false;
                            this.wCfg.show = true;
                            this.$emit('refresh')
                        } else {
                            this.msgconfig.show = true
                            this.msgconfig.content = res.data.errMsg
                        }
                    },
                    (err) => {
                        this.ajaxlock = true;
                        console.log(err)
                    }
                )
            },
            //取消新增
            cancelCustomer(){
                this.$emit('refresh')
            },
            searchemployee: function () {
                this.codeModal.show = true;
            },
            //打开行业分类弹框
            searchIndustry: function () {
                this.industryCfg.show = false;
                this.industryCfg.show = true;
            },
            //清除业务员和行业分类
            clearemployeeName(){
                this.newCustomer.employeeCode = '';
                this.newCustomer.employeeName = '';
            },
            clearIndustry(){
                this.newCustomer.industryCode = '';
                this.newCustomer.industryName = '';
                this.industryCfg.data = {};
            },
            pickPerson(data){
                this.codeModal.show = false;
                this.newCustomer.employeeCode = data.employeeCode;
                this.newCustomer.employeeName = data.employeeName;
            },
            industrySure(data,parent){
                this.newCustomer.majorIndustryCode = parent.industryCode;
                this.newCustomer.majorIndustryName = parent.industryName;
                this.newCustomer.industryCode = data.industryCode;
                this.newCustomer.industryName = data.industryName;
                this.industryCfg.data = data
            }
        },
        ready(){
            //初始化时拿到币种列表
            this.$http.post(__URL.arc + 'currency/local', {}).then(
                (res) => {
                    if (res.data.success) {
                        this.allCurrency = res.data.data;
                        for (var i = 0; i < this.allCurrency.length; i++) {
                            if (this.allCurrency[i].localCurrency == '是') {
                                this.allCurrency[i].localCurrency = 'true'
                            }
                        }
                    }
                },
                (err) => {
                    console.log('初始化未能拿到币种数据')
                }
            )
            //初始化拿到收款协议
            this.$http.post(__URL.arc + 'rec/agreement/list', {}).then(
                (res) => {
                    if (res.data.success) {
                        this.allAgreement = res.data.data;
                    }
                },
                (err) => {
                    console.log('初始化未能拿到收款数据')
                }
            )
            //初始化拿到结算方式
            this.$http.post(__URL.arc + 'payment/list', {}).then(
                (res) => {
                    if (res.data.success) {
                        this.allPayment = res.data.data.dataList
                    }
                },
                (err) => {
                    console.log('初始化未能拿到结算数据')
                }
            )

            //初始化拿到重要度分级
            this.$http.post(__URL.crm + 'importanceRating/remote', {}).then(
                (res) => {
                    if (res.data.success) {
                        this.allImportanceRating = res.data.data;
                    }
                },
                (err) => {
                    console.log('初始化未能拿到重要度分级数据')
                }
            )

            //初始化拿到信用评级方式
            this.$http.post(__URL.crm + 'creditRating/remote', {}).then(
                (res) => {
                    if (res.data.success) {
                        this.allCreditRating = res.data.data;
                    }
                },
                (err) => {
                    console.log('初始化未能拿到信用评级数据')
                }
            )

            //初始化拿到合作评估方式
            this.$http.post(__URL.crm + 'customerStatus/remote', {}).then(
                (res) => {
                    if (res.data.success) {
                        this.allCustomerStatus = res.data.data;
                    }
                },
                (err) => {
                    console.log('初始化未能拿到客户状态数据')
                }
            )

            //初始化拿到业务联络方式
            this.$http.post(__URL.crm + 'businessLiaison/remote', {}).then(
                (res) => {
                    if (res.data.success) {
                        this.allBusinessLiaison = res.data.data;
                    }
                },
                (err) => {
                    console.log('初始化未能拿到业务联络数据')
                }
            )
        }
    }
</script>
<template>
    <div class="inner-wrapper">
        <alert @cb='sureDeleteContact' :config="dCfg"></alert>
        <alert @cb='sureDeleteAddress' :config="aCfg"></alert>
        <warning :config="wCfg"></warning>
        <div class="inner-content">

            <h2 class="tag">客户基本信息</h2>

            <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
            <div class="inner-item form-box">
                <div class="form-group">
                    <label><span class="must-point">*</span>客户名称:</label>
                    <input type='text' maxlength='120' v-model='newCustomer.customerName'>
                </div>
                <div class="form-group">
                    <label><span class="must-point">*</span>区域分类:</label>
                    <div class="s-input ic2">
                        <div class="s-input ic2" style="float:left">
                            <select style="width: 100px" v-model="newCustomer.regionCategoryCode" @change="getLocation">
                                <option :value='item.code' v-for="item in selectDate">{{item.name}}</option>
                            </select>
                        </div>
                        <div class="s-input ic2" style="float:left;margin-left:10px;">
                            <select style="width: 100px;" v-model="newCustomer.regionLocationCode">
                                <option :value='item.code' v-for='item in allRegionLocation'>{{item.name}}</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label><span class="must-point">*</span>行业分类:</label>
                    <div class="s-input ic2">
                        <input v-model='newCustomer.industryName' readonly type="text">
                        <i class="icon-close__round r2" v-show='newCustomer.industryName' @click='clearIndustry'></i>
                        <i @click='searchIndustry' class="icon-search r1"></i>
                    </div>
                </div>
                <div class="form-group">
                    <label style="width: 90px;"><span class="must-point">*</span>默认交易币种:</label>
                    <select v-model='newCustomer.currencyCode'>
                        <option :value='item.currencyCode' v-for='item in allCurrency'>{{item.currencyName}}</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>收款协议:</label>
                    <select v-model='newCustomer.recAgreementCode'>
                        <option :value='item.recAgreementCode' v-for='item in allAgreement'>
                            {{item.recAgreementName}}
                        </option>
                    </select>
                </div>
                <div class="form-group">
                    <label>结算方式:</label>
                    <select v-model='newCustomer.paymentCode'>
                        <option :value='item.paymentCode' v-for='item in allPayment'>{{item.paymentName}}</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>交货方式:</label>
                    <select v-model='newCustomer.dispatchModelCode'>
                        <option :value='item.code' v-for='item in allDisPatchModel'>{{item.name}}</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>运输方:</label>
                    <select v-model='newCustomer.transportCode'>
                        <option :value='item.code' v-for='item in allTransport'>{{item.name}}</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>需要报关:</label>
                    <select v-model='newCustomer.customerDeclaration'>
                        <option :value='item.code' v-for="item in allCustomerDeclaration">{{item.name}}</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>业务员:</label>
                    <div class="s-input ic2">
                        <input v-model='newCustomer.employeeName' readonly type="text">
                        <i class="icon-close__round r2" v-show='newCustomer.employeeName'
                           @click='clearemployeeName'></i>
                        <i @click='searchemployee' class="icon-search r1"></i>
                    </div>
                </div>
            </div>

            <div class="inner-item">
                <div class="form-group wd-100">
                    <label>附件:</label>
                    <div class='annexBox'>
                        <upfile-group :config='uCfg' :edit="isEdit" :data="newCustomer.attachments"></upfile-group>
                    </div>

                </div>
                <div class="form-group wd-100">
                    <label>备注:</label>
                    <input type="text" maxlength='200' v-model='newCustomer.remark'>
                </div>
            </div>
            <h2 class="tag">分类评级信息</h2>
            <div class="inner-item form-box">
                <div class="form-group">
                    <label><span class="must-point">*</span></span>重要度分级:</label>
                    <select v-model='newCustomer.importanceRatingCode'>
                        <option :value='item.code' v-for='item in allImportanceRating'>
                            {{item.name}}
                        </option>
                    </select>
                </div>
                <div class="form-group">
                    <label>信用评级:</label>
                    <select v-model='newCustomer.creditRatingCode'>
                        <option :value='item.code' v-for='item in allCreditRating'>
                            {{item.name}}
                        </option>
                    </select>
                </div>
                <div class="form-group">
                    <label>合作状态评估:</label>
                    <span>暂未合作</span>
                </div>
                <div class="form-group">
                    <label><span class="must-point">*</span>成立时间:</label>
                    <date-picker :config='docDateConfig' :date.sync='newCustomer.establishmentDate'></date-picker>
                </div>
                <div class="form-group">
                    <label>注册资本:</label>
                    <input type='text' maxlength='20' v-model='newCustomer.registeredCapital'>
                </div>
                <div class="form-group">
                    <label>法人代表:</label>
                    <input type='text' maxlength='20' v-model='newCustomer.corporateRepresentative'>
                </div>
            </div>

            <div class="inner-item">
                <tab-bar :config.sync='tabConfig'></tab-bar>
                <tab-container :active.sync='tabConfig.select'>
                    <tab-item id='tab1'>
                        <table class='inner-table mt-15'>
                            <thead>
                            <tr>
                                <th style="width: 40px;">序号</th>
                                <th style='width:110px'>姓名</th>
                                <th style='width:135px'>职务</th>
                                <th style='width:170px'>联系方式</th>
                                <th style='width:170px'>办公地址</th>
                                <th style='width:200px'>备注</th>
                                <th style='width:120px'>业务联络</th>
                                <th style="width: 80px;">操作</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for='item in newCustomer.contacts'>
                                <td>{{$index+1}}</td>
                                <td>
                                    <input type='text'  placeholder='姓名' v-model='item.contactName'
                                           maxlength='20'>
                                </td>
                                <td>
                                    <input type='text'  placeholder='职务' v-model='item.duty'
                                           maxlength='20'>
                                </td>
                                <td>
                                    <input type='text'  placeholder='联系电话' v-model='item.phone'
                                           maxlength='20'>
                                    <input type='text'  placeholder='邮件地址' v-model='item.email'
                                           maxlength='20'>
                                </td>
                                <td>
                                    <input type='text'  placeholder='办公地址' v-model='item.address'
                                           maxlength='50'>
                                </td>
                                <td>
                                    <input type='text'  placeholder='备注' v-model='item.remark'
                                           maxlength='200'>
                                </td>
                                <td>
                                    <select v-model='item.businessLiaisonCode'>
                                        <option :value='business.code' v-for='business in allBusinessLiaison'>
                                            {{business.name}}
                                        </option>
                                    </select>
                                </td>
                                <td>
                                    <button class="button-danger" @click='deleteContact($index)'>删除</button>
                                </td>
                            </tr>

                            </tbody>
                        </table>
                        <div class="add-wrap">
                            <button @click="addContact"><i class="icon icon-contacts__add"></i>&nbsp;新增联系人</button>
                        </div>
                    </tab-item>
                    <tab-item id='tab2'>
                        <table class='inner-table mt-15'>
                            <thead>
                            <tr>
                                <th style="width: 40px;">序号</th>
                                <th>地址</th>
                                <th></th>
                                <th style='width:240px'>操作</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for='item in newCustomer.addresses'>
                                <td>{{$index+1}}</td>
                                <td>
                                    <input type='text' placeholder='地址' v-model='item.address'
                                           maxlength='50'>
                                </td>
                                <td>
                                    <input type="radio" name="default" @change="changeAddress($index)"
                                           :checked="item.isDefault == 'on'?true:false" v-model="item.isDefault"/>
                                    <label><span>设为默认地址</span></label>
                                </td>
                                <td>
                                    <button class="button-danger" @click='deleteAddress($index)'>删除</button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <div class="add-wrap">
                            <button @click="addAddress"><i class="icon icon-contacts__add"></i>&nbsp;新增地址</button>
                        </div>
                    </tab-item>
                </tab-container>
            </div>
        </div>
    </div>
    <div class="inner-footer">
        <button @click='cancelCustomer' class="btn-xl-def">取消</button>
        <ajax-button @click='saveCustomer(0)' class="btn-xl-imp">保存草稿</ajax-button>
        <ajax-button @click='saveCustomer(1)' class="btn-xl-imp">提交</ajax-button>
    </div>
    <!-- 业务员弹框 start -->
    <!-- <modal :config.sync='codeModal' @codeclose='codeClose' @codesure='codeSure'> -->
    <refer-employee :config='codeModal' @cb='pickPerson'></refer-employee>
    <!-- </modal> -->
    <!-- 业务员弹框 end -->
    <!-- 客户分类弹框 start -->
    <!--<customermodal :config.sync='customerShow' @cb='customerSure'></customermodal>-->
    <!-- 客户分类弹框 end -->
    <!-- 行业分类弹框 start -->
    <category-industry :config='industryCfg' @cb='industrySure'></category-industry>
    <!-- 行业分类弹框 end -->
    <warning :config="msgconfig"></warning>
</template>
<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';
    /* 此处为自己定义的样式 */
    .inner_body {
        width: 1140px;
        margin: 0 auto;
        padding-top: 20px;
        background: white;
        margin-top: 20px;
        border: 1px solid #F2F3F3;
    }

    .cont {
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

    .inner-wrapper {
        background: #fbfbfb;
    }
</style>
