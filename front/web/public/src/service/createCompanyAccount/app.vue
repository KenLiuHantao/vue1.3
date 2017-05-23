<script>
    import logoImg from 'np/images/logo.png'
    import faq from './faq'
    import agreement from '../agreement/app'
    import passwordlevel from './passwordlevel'

    export default {
        components: {
            faq,
            agreement,
            passwordlevel,
        },
        data(){
            return {
                // 视图初始化
                logoImg: logoImg,
                flowCfg: {
                    data: [{
                        no: '1',
                        name: '邮箱验证',
                        time: '',
                        filed: '',
                        user: '',
                        flag: true,
                    }, {
                        no: '2',
                        name: '选择版本类型',
                        time: '',
                        filed: '',
                        user: '',
                        flag: false,
                    }, {
                        no: '3',
                        name: '填写企业资料',
                        time: '',
                        filed: '',
                        user: '',
                        flag: false,
                    }, {
                        no: '4',
                        name: '申请完成',
                        time: '',
                        filed: '',
                        user: '',
                        flag: false,
                    }]
                },
                wCfg:{
                    show:false
                },
                // 当前 part 数
                partNum: 1,
                // part1 邮箱验证码获取按钮是否置灰、使用过、字段类型，及倒数的秒数
                getEmailMessageCodeBtn: false,
                getEmailMessageCodeBtnUsed: false,
                getEmailMessageCodeBtnContent: true,
                getEmailMessageCodeTime: 60,
                // part1 服务协议 flag
                agreementProp: true,
                agreementShow: false,
                // part1 是否选中服务协议的checkbox
                agreementChecked: false,
                // part1 邮箱modal的配置
                emailModalCfg: {
                    show: false,
                    header: '邮箱验证',
                    width: '576px',
                },
                // part2 三个选项的数据
                part2_items: [
                    {
                        active: false,
                        no: 1,
                        title: '制造版',
                        summary: '',
                        content: '<p style="padding-bottom: 24px;">•&nbsp;&nbsp;各业务线全覆盖</p>' +
                                 '<p style="padding-bottom: 24px;">•&nbsp;&nbsp;工作流在线化</p>' +
                                 '<p style="padding-bottom: 24px;">•&nbsp;&nbsp;任务分发实时提醒</p>' +
                                 '<p style="padding-bottom: 24px;">•&nbsp;&nbsp;经营状态实时查询</p>' +
                                 '<p style="padding-bottom: 24px;">•&nbsp;&nbsp;风险预警层层上报</p>' +
                                 '<p style="padding-bottom: 24px;">•&nbsp;&nbsp;数据沉淀优化业务</p>',
                        price: '199'
                    },
//                    {
//                        active: false,
//                        no: 2,
//                        title: '贸易版',
//                        summary: '适用于xxx',
//                        content: 'xxxx',
//                        price: '199'
//                    },
//                    {
//                        active: false,
//                        no: 3,
//                        title: '联通版',
//                        summary: '适用于xxx',
//                        content: 'xxx',
//                        price: '199'
//                    }
                ],
                // part2 下一步按钮是否置灰
                part2_btnDisabled: true,
                // part3 表单数据
                formData: {
                    formCode: '',
                    img: '',
                    companyName: '',
                    creditCode: '',
                    placeProvince: '',
                    placeCity: '',
                    corporationName: '',
                    idCard: '',
                    mailNumber: '',
                    emailMessageCode: '',
                    phoneNumber: '',
                    messageCode: '',
                    password: '',
                    passwordAgain: '',
                    industryCategory: '',
                    staffNumber: '',
                    other: ''
                },
                // part3 表单各项名称，方便弹出框报错
                formDataName: {
                    img: '营业执照扫描件',
                    companyName: '企业名称',
                    creditCode: '统一社会信用代码',
                    placeProvince: '注册所在地',
                    placeCity: '注册所在地',
                    corporationName: '法人代表姓名',
                    idCard: '身份证号码',
                    mailNumber: '邮箱号码',
                    phoneNumber: '手机号码',
                    messageCode: '短信验证码',
                    password: '账户密码',
                    passwordAgain: '确认密码',
                    industryCategory: '行业类别',
                    staffNumber: '从业人数'
                },
                // upfile img 的配置和路径
                upfileConfig: {
                    size: 1024 * 1024 * 5,
                    extensions: 'jpg, jpeg, png, bmp, pdf',
                },
                imgSrcPath: '',
                // 上传文件为 pdf 时的解决方案
                upfileIsPdf: false,
                // 手机注册，是否已被占用
                phoneOccupied: false,
                // 密码强度等级
                passwordLevel: 0,
                // 密码强度数据
                passwordLevelData: [
                    {
                        style: {
                            backgroundColor: '#FCDC96',
                        },
                        active: false,
                        text: '弱',
                    },{
                        style: {
                            backgroundColor: '#B7E3A5',
                        },
                        active: false,
                        text: '中',
                    },{
                        style: {
                            backgroundColor: '#87CF68',
                        },
                        active: false,
                        text: '强',
                    }
                ],
                // modelType 的备份
                modelTypeSave: '',
                // part3 验证报错字段和验证通过状态
                formValidate: {
                    img: {
                        writed: false,
                        text: '请上传营业执照扫描件',
                        state: false,
                    },
                    companyName: {
                        writed: false,
                        text: '请正确填写企业名称，长度为30个字符以内',
                        state: false,
                    },
                    creditCode: {
                        writed: false,
                        text: '请正确填写统一社会信用代码，长度为15-18个字符以内',
                        state: false,
                    },
                    placeProvince: {
                        writed: false,
                        text: '请选择完整的注册所在地',
                        state: false,
                    },
                    placeCity: {
                        writed: false,
                        text: '请选择完整的注册所在地',
                        state: false,
                    },
                    corporationName: {
                        writed: false,
                        text: '请正确填写法人代表姓名',
                        state: false,
                    },
                    idCard: {
                        writed: false,
                        text: '请正确填写身份证号码',
                        state: false,
                    },
                    mailNumber: {
                        writed: false,
                        text: '请正确填写邮箱号码',
                        state: false,
                    },
                    emailMessageCode: {
                        writed: false,
                        text: '请正确填写邮箱验证码，为6位数字',
                        state: false,
                    },
                    phoneNumber: {
                        writed: false,
                        text: '请正确填写手机号码',
                        state: false,
                    },
                    messageCode: {
                        writed: false,
                        text: '验证码错误，请重新输入',
                        state: false,
                    },
                    password: {
                        writed: false,
                        text: '请正确填写密码，长度为6-20个字符',
                        state: false,
                    },
                    passwordAgain: {
                        writed: false,
                        text: '两次输入的密码不一致，请重新输入',
                        state: false,
                    },
                    industryCategory: {
                        writed: false,
                        text: '请选择行业类别',
                        state: false,
                    },
                    staffNumber: {
                        writed: false,
                        text: '请选择从业人数',
                        state: false,
                    }
                },
                // 省市数据
                provinces: [],
                cities: [],
                // 行业分类数据
                industryCategory: [],
                // part3 短信获取按钮是否处于 disabled、使用过、按钮的字段类型，及倒数的秒数
                getMessageCodeBtn: false,
                getMessageCodeBtnUsed: false,
                getMessageCodeBtnContent: true,
                getMessageCodeTime: 60,
                // 有 url 参数时，获取 code
                urlCode: '',
                // 有 url 参数时，改变表单数据
                urlFormData: {},
                // part4 提示申请状态的段落
                part4_state: false,
            }
        },
        computed: {
            // part1 邮箱即时验证格式
            emailComputed () {
                let arr = this.formData.mailNumber.split('')
                let maxL = arr.length
                let flag1, flag2
                for (let i = 0; i < maxL; i++) {
                    if (arr[i] == '@' && arr[i + 1] && arr[i + 1] != '.') flag1 = true
                    if (arr[i] == '.' && arr[i + 1]) flag2 = true
                }
                if (flag1 && flag2 && this.getEmailMessageCodeTime === 60) {
                    this.getEmailMessageCodeBtn = true
                } else {
                    this.getEmailMessageCodeBtn = false
                }
                return this.formData.mailNumber
            },
            // part2 行业类型的处理
            modelType () {
                let result = {
                    n1: 'MANUFACTURE',
                    n2: 'TRADE',
                    n3: 'CONNECTION'
                }
                let key
                for (let i = 0; i < this.part2_items.length; i++) {
                    if (this.part2_items[i].active === true) {
                        key = this.part2_items[i].no
                    }
                }
                this.modelTypeSave = result['n' + key]
                return result['n' + key]
            },
            // part3 手机即时验证格式
            phoneComputed () {
                if (this.formData.phoneNumber.length === 11 && this.getMessageCodeTime === 60) {
                    this.getMessageCodeBtn = true
                } else {
                    this.getMessageCodeBtn = false
                }
                return this.formData.phoneNumber
            },
            // part3 其他中的 textarea 数据长度
            otherTextNum () {
                return this.formData.other.length
            },
        },
        methods: {
            // 下一步改变显示的 part
            AddPartNum () {
                this.partNum++
                this.changeFlowCfgFlag (this.partNum)
            },
            // 点击「重新申请」改变显示的 part
            returnPartNum () {
                this.partNum--
                this.changeFlowCfgFlag (this.partNum)
            },
            // part 改变时触发 wf 的 flag 改变
            changeFlowCfgFlag (num) {
                let maxL = this.flowCfg.data.length
                for (let i = 0; i < maxL; i++) {
                    this.flowCfg.data[i].flag = false
                }
                for (let i = 0; i < num; i++) {
                    this.flowCfg.data[i].flag = true
                }
            },
            // part1 邮箱验证 modal 的开启和关闭
            OpenEmailModal () {
                this.emailModalCfg.show = true
            },
            // part1 邮箱验证 modal 的重新填写
            emailReset () {
                this.emailModalCfg.show = false
                this.formValidate.mailNumber.writed = false
                this.formData.mailNumber = ''
                this.getEmailMessageCodeBtn = false
                this.getEmailMessageCodeBtnUsed = false
                this.getEmailMessageCodeBtnContent = true
                this.getEmailMessageCodeTime = 60
                this.formData.emailMessageCode = ''
                this.agreementChecked = false
            },
            // part1 获取邮箱验证码
            getEmailMessageCode () {
                this.validateIsEmail()
                if (this.formValidate.mailNumber.state === false) return
                this.changeEmailMessageCodeTime()
                let params = {
                    params: {
                        email: this.formData.mailNumber
                    }
                }
                this.$http.post(__URL.service + 'organization/email/captcha/send', null, params).then(
                    (res) => {
                        if (res.data.success) {
                            this.OpenEmailModal()
                        } else {
                            this.setWarning(res.data.errMsg,'failure')
                        }
                    }
                )
            },
            // part1 内容是否为邮箱
            validateIsEmail () {
                this.formValidate.mailNumber.writed = true
                let arr = this.formData.mailNumber.split('')
                let maxL = arr.length
                let flag1, flag2
                for (let i = 0; i < maxL; i++) {
                    if (arr[i] == '@' && arr[i + 1] && arr[i + 1] != '.') flag1 = true
                    if (arr[i] == '.' && arr[i + 1]) flag2 = true
                }
                if (flag1 && flag2) {
                    this.formValidate.mailNumber.state = true
                    if (!this.getEmailMessageCodeBtnUsed) {
                        this.getEmailMessageCodeBtn = true
                    } else {
                        if (this.getEmailMessageCodeTime === 60) {
                            this.getEmailMessageCodeBtn = true
                        }
                    }
                } else {
                    this.formValidate.mailNumber.state = false
                    this.getEmailMessageCodeBtn = false
                }
            },
            // part1 邮箱验证码倒计时
            changeEmailMessageCodeTime () {
                this.getEmailMessageCodeBtn = false
                this.getEmailMessageCodeBtnUsed = true
                this.getEmailMessageCodeBtnContent = false
                let clock = setInterval(() => {
                    this.getEmailMessageCodeTime--
                    this.getEmailMessageCodeBtn = false
                    if (this.getEmailMessageCodeTime === 0) {
                        clearInterval(clock)
                        this.getEmailMessageCodeTime = 60
                        this.getEmailMessageCodeBtn = true
                        this.getEmailMessageCodeBtnContent = true
                    }
                }, 1000)
            },
            // part1 验证码的格式验证
            validateEmailMessageCode () {
                this.formValidate.emailMessageCode.writed = true
                if (/^\d{6}$/.test(this.formData.emailMessageCode)) {
                    this.formValidate.emailMessageCode.state = true
                } else {
                    this.formValidate.emailMessageCode.state = false
                }
            },
            // part1 服务协议开启
            agreementOpen () {
                //if (this.agreementShow === false) this.agreementShow = true
                let newWindow = window.open('about:blank')
                newWindow.location.href = 'https://yj2025.com/public/#!/s/agreement'
            },
            // part1 服务协议关闭（回调）
            agreementClose () {
                if (this.agreementShow === true) this.agreementShow = false
            },
            // part1 点击改变 checkbox 的状态
            changeAgreementChecked () {
                this.agreementChecked = !this.agreementChecked
            },
            // part1 提交邮箱表单信息
            submitEmailData () {
                this.validateIsEmail()
                if (this.formValidate.mailNumber.state === false) return
                this.validateEmailMessageCode()
                if (this.formValidate.emailMessageCode.state === false) return
                let params = {
                    params: {
                        email: this.formData.mailNumber,
                        captcha: this.formData.emailMessageCode
                    }
                }
                this.$http.post(__URL.service + 'organization/email/captcha/check', null, params).then(
                    (res) => {
                        if (res.data.success) {
                            if (res.data.data) {
                                this.AddPartNum()
                            } else {
                                this.setWarning('验证码有误，请修正','failure')
                            }
                        } else {
                            this.setWarning(res.data.errMsg,'failure')
                        }
                    }
                )
            },
            // part2 选项框，选择变色
            changeItemActive (index) {
                if (this.part2_items[index].active === true) {
                    this.part2_items[index].active = false
                    this.part2_btnDisabled = true
                    return
                }
                let maxL = this.part2_items.length
                for (let i = 0; i < maxL; i++) {
                    this.part2_items[i].active = false
                }
                this.part2_items[index].active = true
                this.part2_btnDisabled = false
            },
            // part3 表单验证
            // part3 upfile 的 cb
            file(val) {
                this.formData.img = val.fileId
                this.imgSrcPath = val.url
                this.formValidate.img.state = true
                this.upfileIsPdfFunc()
            },
            // 上传格式为 pdf 的提示
            upfileIsPdfFunc () {
                let arr = this.imgSrcPath.split('.')
                if (arr[arr.length - 1] === 'pdf') {
                    this.upfileIsPdf = true
                } else {
                    this.upfileIsPdf = false
                }
            },
            // part3 获取省数据
            getProvincesData () {
                this.$http.get(__URL.service + 'public/provinces').then(
                    (res) => {
                        if(res.data.success) {
                            this.provinces = res.data.data
                        } else {
                            console.log(res.data.errMsg)
                        }
                    }
                )
            },
            // part3 获取市数据
            getCitiesData () {
                let params = {
                    params: {
                        provinceCode: this.formData.placeProvince
                    }
                }
                this.$http.get(__URL.service + '/public/cities', params).then(
                    (res) => {
                        if(res.data.success) {
                            this.cities = res.data.data
                        } else {
                            console.log(res.data.errMsg)
                        }
                    }
                )
            },
            // part3 获取行业分类
            getIndustryCategory () {
                this.$http.get(__URL.service + 'public/categories').then(
                    (res) => {
                        if(res.data.success) {
                            this.industryCategory = res.data.data
                        } else {
                            console.log(res.data.errMsg)
                        }
                    }
                )
            },
            // part3 内容是否为空
            validateIsEmpty (name) {
                this.formValidate[name].writed = true
                if (this.formData[name]) {
                    this.formValidate[name].state = true
                } else {
                    this.formValidate[name].state = false
                }
            },
            // part3 内容长度是否在 n 个字符以内
            validateLength (name, maxL, minL, password, passwordAgain) {
                this.formValidate[name].writed = true
                if (minL) {
                    if (this.formData[name].length >= minL && this.formData[name].length <= maxL) {
                        this.formValidate[name].state = true
                    } else {
                        this.formValidate[name].state = false
                    }
                } else {
                    if (this.formData[name].length <= maxL) {
                        this.formValidate[name].state = true
                    } else {
                        this.formValidate[name].state = false
                    }
                }
                if (name == 'idCard') {
                    this.idCardReg(name)
                }
                if (name == 'password' && this.formValidate.passwordAgain.writed) {
                    this.validatePassword(password, passwordAgain)
                }
            },
            // part3 身份证正则验证
            idCardReg (name) {
                // let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
                let reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/
                if (!reg.test(this.formData[name])) {
                    this.formValidate[name].state = false
                }
            },
            // part3 两次密码是否一致
            validatePassword (password, passwordAgain) {
                this.formValidate[passwordAgain].writed = true
                if (this.formData[password] == this.formData[passwordAgain]) {
                    this.formValidate[passwordAgain].state = true
                } else {
                    this.formValidate[passwordAgain].state = false
                }
            },
            // part3 select 是否已选择
            validateSelect (name) {
                this.formValidate[name].writed = true
                if (this.formData[name] != '请选择') {
                    this.formValidate[name].state = true
                } else {
                    this.formValidate[name].state = false
                }

                if (name == 'placeProvince') {
                    this.formData.placeCity = 'unselect'
                    this.getCitiesData(this.formData[name])
                }
            },
            // part3 验证手机号，启用「获取验证码」按钮
            validatePhoneNumber (name, maxL, minL) {
                this.validateLength(name, maxL, minL)
                // 正则验证
                let reg = /^1(3|4|5|7|8)\d{9}$/
                if (!reg.test(this.formData[name])) {
                    this.formValidate[name].state = false
                }
                if (this.formValidate[name].state === true) {
                    if (!this.getMessageCodeBtnUsed) {
                        this.getMessageCodeBtn = true
                    } else {
                        if (this.getMessageCodeTime === 60) {
                            this.getMessageCodeBtn = true
                        }
                    }
                } else {
                    this.getMessageCodeBtn = false
                }
                this.validatePhoneOccupied()
            },
            // part3 验证手机号，是否已是注册用户
            validatePhoneOccupied () {
                let params = {
                    params: {
                        mobile: this.formData.phoneNumber
                    }
                }
                this.$http.post(__URL.service + 'organization/register/mobile/occupied', null, params).then(
                    (res) => {
                        if (res.data.success) {
                            if (res.data.data === true) {
                                this.phoneOccupied = true
                                this.formData.password = ''
                                this.formData.passwordAgain = ''
                            } else {
                                this.phoneOccupied = false
                            }
                        } else {
                            this.setWarning(res.data.errMsg,'failure')
                        }
                    }
                )
            },
            // part3 获取验证码
            getMessageCode () {
                this.validatePhoneNumber('phoneNumber', '11', '11')
                if (this.formValidate.phoneNumber.state === false) return
                this.changeMessageCodeTime()
                let params = {
                    params: {
                        mobile: this.formData.phoneNumber
                    }
                }
                this.$http.post(__URL.service + 'organization/register/mobile/sms', null, params).then(
                    (res) => {
                        if (res.data.success) {
                            // this.changeMessageCodeTime()
                        } else {
                            this.setWarning(res.data.errMsg,'failure')
                        }
                    }
                )
            },
            // part3 短信验证码倒计时
            changeMessageCodeTime () {
                this.getMessageCodeBtn = false
                this.getMessageCodeBtnUsed = true
                this.getMessageCodeBtnContent = false
                let clock = setInterval(() => {
                    this.getMessageCodeTime--
                    this.getMessageCodeBtn = false
                    if (this.getMessageCodeTime === 0) {
                        clearInterval(clock)
                        this.getMessageCodeTime = 60
                        this.getMessageCodeBtn = true
                        this.getMessageCodeBtnContent = true
                    }
                }, 1000)
            },
            // part3 强度检测
            checkPasswordLevel(val){
                var strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
                var mediumRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
                var enoughRegex = new RegExp("(?=.{6,}).*", "g");
                if(enoughRegex.test(val)){
                    this.passwordLevel=1
                }
                if(mediumRegex.test(val)){
                    this.passwordLevel=2
                }
                if(strongRegex.test(val)){
                    this.passwordLevel=3
                }
                this.changePWL(val)
            },
            // part3 密码校验
            checkNewPassword () {
              if (this.formData.password === '') {
                  this.passwordLevel = 0
              }
            },
            // part3 根据密码强度值改变强度组件的 active
            changePWL (val) {
                for (let i = 0; i < this.passwordLevelData.length; i++) {
                    this.passwordLevelData[i].active = false
                }
                // 如果密码处于判断(6-20)范围则出现active效果
                let len = val.length
                if (len >= 6 && len <= 20 ) {
                    this.passwordLevelData[this.passwordLevel - 1].active = true
                }
            },
            // part3 表单是否填写完毕，否则不执行表单提交操作并报错
            validateFormComplete () {
                for (let key in this.formData) {
                    if (key === 'formCode') continue
                    if (key === 'idCard') continue
                    if (key === 'other') continue
                    if (this.phoneOccupied === true) {
                        if (key === 'password' || key === 'passwordAgain') continue
                    }
                    if (this.formData[key] == '' || this.formData[key] == 'unselect') {
                        this.setWarning(this.formDataName[key] + '填写不完整,请填写完成后提交','failure')
                        return
                    }
                    if (key === 'messageCode') continue
                    if (this.formValidate[key].state == false) {
                        this.setWarning(this.formDataName[key] + '填写有误，请您更正后提交','failure')
                        return
                    }
                }
                this.submitFormData()
            },
            // part3 提交表单数据
            submitFormData () {
                // 需发送的数据格式
                let organizationRegisterForm = {
                    adminEmail:         this.formData.mailNumber,
                    captcha:            this.formData.emailMessageCode,
                    adminForm: {
                        mobile:         this.formData.phoneNumber,
                        password:       this.formData.password,
                        validateCode:   this.formData.messageCode,
                    },
                    adminIdCard:        this.formData.idCard,
                    adminName:          this.formData.corporationName,
                    city:               this.formData.placeCity,
                    // 表单编号
                    code:               this.formData.formCode,
                    creditCode:         this.formData.creditCode,
                    employeeCount:      this.formData.staffNumber,
                    industryType:       this.formData.industryCategory,
                    licenseImageId:     this.formData.img,
                    modelType:          this.modelType,
                    name:               this.formData.companyName,
                    province:           this.formData.placeProvince,
                    remark:             this.formData.other,
                }
                this.$http.post(__URL.service + 'organization/register', organizationRegisterForm).then(
                    (res) => {
                        if (res.data.success) {
                            this.part4_state = true
                            this.AddPartNum()
                        } else {
                            this.setWarning(res.data.errMsg,'failure')
                        }
                    }
                )
            },
            // 邮件链接 如果有 url 参数，则改变页面状态，并加载已填写的表单数据
            initPageState () {
                let url = document.location.href
                if (url.indexOf('?') == -1) return
                this.changePageState()
                this.getUrlParamsAndFormData(url)
            },
            // 邮件链接 获取 url 的参数，之后开始加载表单数据
            getUrlParamsAndFormData (url) {
                let arr = url.split('')
                let count
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i] == '?') {
                        count = i
                        break
                    }
                }
                let param = url.substr(count + 1)
                this.urlCode = param.split('&')[0].split('=')[1]
                this.getFormData()
            },
            // 邮件链接 改变页面状态
            changePageState() {
                // 直接进入 part4 提示错误
                this.AddPartNum()
                this.AddPartNum()
                this.AddPartNum()
            },
            // 邮件链接 表单加载数据
            getFormData () {
                let params = {
                    params: {
                        code: this.urlCode
                    }
                }
                this.$http.post(__URL.service + 'organization/register/result', null, params).then(
                    (res) => {
                        if (res.data.success) {
                            if (res.data.data.status == 'NORMAL') {
                                window.location.href='/login'
                            }
                            this.urlFormData = res.data.data
                            console.log(this.urlFormData)
                            this.formData = {
                                formCode:           this.urlCode,
                                img:                this.urlFormData.licenseImageId,
                                companyName:        this.urlFormData.name,
                                creditCode:         this.urlFormData.creditCode,
                                placeProvince:      this.urlFormData.province,
                                placeCity:          this.urlFormData.city,
                                corporationName:    this.urlFormData.adminName,
                                idCard:             this.urlFormData.adminIdCard,
                                mailNumber:         this.urlFormData.adminEmail,
                                phoneNumber:        this.urlFormData.adminMobile,
                                messageCode:        this.urlFormData.validateCode,
                                password:           this.urlFormData.password,
                                passwordAgain:      this.urlFormData.password,
                                industryCategory:   this.urlFormData.industryType,
                                staffNumber:        this.urlFormData.employeeCount,
                                other:              this.urlFormData.remark
                            }
                            // 再次填写表单，自动改变 state 状态
                            for (let key in this.formValidate) {
                                this.formValidate[key].writed = true
                                this.formValidate[key].state = true
                            }
                            // 获取并更新图片的 this.imgSrcPath
                            let params = {
                                params: {
                                    fileId: this.urlFormData.licenseImageId
                                }
                            }
                            this.$http.post(__URL.v1+'file/url',null,params).then(
                                (res) => {
                                    if (res.data.success) {
                                        this.imgSrcPath = res.data.data.split('?')[0]
                                        this.upfileIsPdfFunc()
                                    } else {
                                        console.log(res.data.errMsg)
                                    }
                                }
                            )
                            // 套餐类型点亮并启用下一步
                            this.modelTypeSave = this.urlFormData.modelType
                            this.part2_btnDisabled = false
                            switch (this.urlFormData.modelType) {
                                case 'MANUFACTURE':
                                this.part2_items[0].active = true
                                break
                                case 'TRADE':
                                this.part2_items[1].active = true
                                break
                                case 'CONNECTION':
                                this.part2_items[2].active = true
                                break
                            }
                            // 开启获取验证码按钮
                            this.getMessageCodeBtn = true
                            // 获取到 city 编码后，再发送请求获取城市字段
                            this.getCitiesData()
                        } else {
                            this.setWarning(res.data.errMsg,'failure')
                        }
                    }
                )
            },
            // 邮件链接 再次获取手机验证码
            getMessageCodeAgain () {
                this.changeMessageCodeTime()
                let params = {
                    params: {
                        code: this.urlCode
                    }
                }
                this.$http.post(__URL.service + '/organization/register/org/sms', null, params).then(
                    (res) => {
                        if (res.data.success) {
                            // this.changeMessageCodeTime()
                        } else {
                            this.setWarning(res.data.errMsg,'failure')
                        }
                    }
                )
            },
            setWarning(msg,type){
                 this.wCfg.type = type
                 this.wCfg.content = msg
                 this.wCfg.show = true
            },
        },
        created () {
            // 加载页面即开始获取 省数据
            this.getProvincesData()
            // 加载页面即开始获取 行业分类数据
            this.getIndustryCategory()
            this.initPageState()
        },
        filters: {
            // part3 密码强度测试
            filterPassword: {
                write (val,oldVal) {
                    this.filterPassword = ''
                    this.checkPasswordLevel(val);
                    return val
                }
            }
        },
    }
</script>

<template>
    <header>
        <a href="/login">
            <img :src="logoImg">
            我的经管
        </a>
        <a class="login" href="/login">已有账号？<span>点此登录</span></a>
    </header>

    <main class="main register">
        <workflow :config="flowCfg"></workflow>

        <section v-if="partNum == '1'" class="part">
            <div class="part1">
                <div class="input_group">
                    <div class="input_group_row">
                        <label class="input_group_label"><span class="must">*</span>邮箱号码:</label>
                        <div class="input_group_block">
                            <!-- 以下这个div是保证该计算属性生效而触发实时监测 -->
                            <div hidden>{{ emailComputed }}</div>
                            <input :readonly="!!urlCode" @change="validateIsEmail" v-model="formData.mailNumber"
                                   class="w180" type="text">
                            <button v-if="!urlCode" @click="getEmailMessageCode" :disabled="!getEmailMessageCodeBtn" class="btn-lg-imp">
                                <template v-if="getEmailMessageCodeBtnContent">发送验证码</template>
                                <template v-else>重新发送{{ getEmailMessageCodeTime }}s</template>
                            </button>
                        </div>
                    </div>
                    <p><i class="icon-warning__warn"></i><span>请输入邮箱号码，此邮箱将作为接收系统邮件之用</span></p>
                    <p v-if="formValidate.mailNumber.writed && !formValidate.mailNumber.state"
                       class="red">{{ formValidate.mailNumber.text }}</p>
                </div>

                <div class="input_group">
                    <div class="input_group_row">
                        <label class="input_group_label"><span class="must">*</span>验证码:</label>
                        <div class="input_group_block">
                            <input @change="validateEmailMessageCode" v-model="formData.emailMessageCode"
                                   class="sm" type="text" maxlength="6">
                        </div>
                    </div>
                    <p v-if="formValidate.emailMessageCode.writed && !formValidate.emailMessageCode.state"
                       class="red">{{ formValidate.emailMessageCode.text }}</p>
                </div>

                <div class="check_group">
                    <input @click="changeAgreementChecked" :checked="agreementChecked" type="checkbox">
                    <label>我已阅读并同意 <a @click="agreementOpen" href="javascript:;">《我的经管软件服务条款》</a></label>
                </div>

                <div class="handle">
                    <button @click="submitEmailData" :disabled="!agreementChecked" class="btn-lg-imp">下一步</button>
                </div>
            </div>
        </section>

        <section v-if="partNum == '2'" class="part">
            <div class="part2">
                <div v-for="item in part2_items" @click="changeItemActive($index)" :class="{ 'active': item.active }"
                 class="item">
                    <div class="item_header">
                        <h3>{{ item.title }}</h3>
                        <!-- <p v-text="item.summary"></p>-->
                        <i class="icon-success"></i>
                    </div>
                    <div class="item_content">
                        <div class="content-info">{{{ item.content }}}</div>
                        <!-- <div><span>¥ {{ item.price }} </span>元/月</div>-->
                    </div>
                </div>
            </div>
        </section>

        <section v-show="partNum == '3'" class="part">
            <div class="part3">
                <div class="item">
                    <div class="item_title">
                        <h3 class="item_title_h">企业信息<i class="item_title_h_icon icon1"></i></h3>
                        <p class="item_title_p">本信息关乎企业账号所有权权益之承认，请准确完整填写。</p>
                    </div>

                    <div class="item_form">
                        <div class="input_group upfile">
                            <div class="input_group_row">
                                <label class="input_group_label"><span class="must">*</span>营业执照扫描件:</label>
                                <div class="input_group_block upfile_item">
                                    <div class="upfile_block">
                                        <span v-if="!upfileIsPdf && !imgSrcPath" class="default"></span>
                                        <img v-if="!upfileIsPdf && imgSrcPath" :src="imgSrcPath">
                                        <span v-if="upfileIsPdf">PDF</span>
                                        <upfile :config="upfileConfig" @cb="file">
                                            <button class="btn-lg-imp def-opt">上传文件</button>
                                        </upfile>
                                    </div>
                                    <div>
                                        <p>请上传营业执照清晰彩色原件扫描件或数码照，在有效期内且年检章齐全（当年成立的可无年检章），<br>由中国大陆工商局或市场监督管理局颁发, 或由境外机构颁发。</p>
                                        <p>支持.jpg .jpeg .png .bmp .pdf格式图片，大小不超过5M。</p>
                                        <p v-if="formValidate.img.writed && !formValidate.img.state"
                                         class="red">{{ formValidate.img.text }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="input_group">
                            <div class="input_group_row">
                                <label class="input_group_label"><span class="must">*</span>企业名称:</label>
                                <div class="input_group_block">
                                    <input @change="validateLength('companyName', '30')" v-model="formData.companyName"
                                     class="lg" type="text">
                                </div>
                            </div>
                            <p>请填写营业执照上的名称</p>
                            <!--<p v-if="!formValidate.companyName.writed">请填写营业执照上的名称</p>-->
                            <p v-if="formValidate.companyName.writed && !formValidate.companyName.state"
                               class="red">{{ formValidate.companyName.text }}</p>
                        </div>

                        <div class="input_group">
                            <div class="input_group_row">
                                <label class="input_group_label"><span class="must">*</span>统一社会信用代码:</label>
                                <div class="input_group_block">
                                    <input @change="validateLength('creditCode', '18', '15')" v-model="formData.creditCode"
                                     class="sm" type="text">
                                </div>
                            </div>
                            <p>请输入18位统一社会信用代码或15位的营业执照注册号, 境外证件请填写商业登记证号码</p>
                            <!--<p v-if="!formValidate.creditCode.writed">请输入18位统一社会信用代码或15位的营业执照注册号, 境外证件请填写商业登记证号码</p>-->
                            <p v-if="formValidate.creditCode.writed && !formValidate.creditCode.state"
                               class="red">{{ formValidate.creditCode.text }}</p>
                        </div>

                        <div class="input_group">
                            <div class="input_group_row">
                                <label class="input_group_label"><span class="must">*</span>注册所在地:</label>
                                <div class="input_group_block">
                                    <select @change="validateSelect('placeProvince')" v-model="formData.placeProvince"
                                     class="xs">
                                        <option value="unselect" selected>请选择</option>
                                        <option v-for="item in provinces" :value="item.regionCode">{{ item.regionName }}</option>
                                    </select>
                                    <select @change="validateSelect('placeCity')" v-model="formData.placeCity"
                                     class="xs">
                                        <option value="unselect" selected>请选择</option>
                                        <option v-for="item in cities" :value="item.regionCode">{{ item.regionName }}</option>
                                    </select>
                                </div>
                            </div>
                            <template v-if="formValidate.placeProvince.writed && formValidate.placeCity.writed">
                                <p v-if="!formValidate.placeProvince.state || !formValidate.placeCity.state"
                                   class="red">{{ formValidate.placeProvince.text }}</p>
                            </template>
                        </div>
                    </div>
                </div>

                <div class="item">
                    <div class="item_title">
                        <h3 class="item_title_h">法人代表信息<i class="item_title_h_icon icon2"></i></h3>
                    </div>

                    <div class="item_form">
                        <div class="input_group">
                            <div class="input_group_row">
                                <label class="input_group_label"><span class="must">*</span>法人代表姓名:</label>
                                <div class="input_group_block">
                                    <input @change="validateIsEmpty('corporationName')" v-model="formData.corporationName"
                                     class="sm" type="text">
                                </div>
                            </div>
                            <p v-if="formValidate.corporationName.writed && !formValidate.corporationName.state"
                               class="red">{{ formValidate.corporationName.text }}</p>
                        </div>

                        <div class="input_group">
                            <div class="input_group_row">
                                <label class="input_group_label" style="padding-left: 10px;">身份证号码:</label>
                                <div class="input_group_block">
                                    <input @change="validateLength('idCard', '18', '15')" v-model="formData.idCard"
                                     class="sm" type="text">
                                </div>
                            </div>
                            <p v-if="formValidate.idCard.writed && !formValidate.idCard.state"
                               class="red">{{ formValidate.idCard.text }}</p>
                        </div>

                        <div class="input_group">
                            <div class="input_group_row">
                                <label class="input_group_label"><span class="must">*</span>手机号码:</label>
                                <div class="input_group_block">
                                    <!-- 以下这个div是保证该计算属性生效而触发实时监测 -->
                                    <div hidden>{{ phoneComputed }}</div>
                                    <input :readonly="!!urlCode" @change="validatePhoneNumber('phoneNumber', '11', '11')" v-model="formData.phoneNumber"
                                     class="sm" type="text">
                                    <button v-if="!urlCode" @click="getMessageCode" :disabled="!getMessageCodeBtn"
                                            class="btn-lg-imp">
                                        <template v-if="getMessageCodeBtnContent">发送验证码</template>
                                        <template v-else>重新发送{{ getMessageCodeTime }}s</template>
                                    </button>
                                    <button v-if="!!urlCode" @click="getMessageCodeAgain" :disabled="!getMessageCodeBtn"
                                            class="btn-lg-imp">
                                        <template v-if="getMessageCodeBtnContent">发送验证码</template>
                                        <template v-else>重新发送{{ getMessageCodeTime }}s</template>
                                    </button>
                                </div>
                            </div>
                            <p><i class="icon-warning__warn"></i><span>此号码将作为系统登录账号</span></p>
                            <!--<p v-if="!formValidate.phoneNumber.writed">请输入手机号码，此号码将作为系统登录账号</p>-->
                            <p v-if="formValidate.phoneNumber.writed && !formValidate.phoneNumber.state"
                               class="red">{{ formValidate.phoneNumber.text }}</p>
                        </div>

                        <div class="input_group">
                            <div class="input_group_row">
                                <label class="input_group_label"><span class="must">*</span>短信验证码:</label>
                                <div class="input_group_block">
                                    <input v-model="formData.messageCode"
                                     class="sm" type="text">
                                </div>
                            </div>
                            <p>请输入短信验证码</p>
                            <!--<p v-if="!formValidate.messageCode.writed">请输入短信验证码</p>-->
                            <p v-if="formValidate.messageCode.writed && !formValidate.messageCode.state"
                             class="red">{{ formValidate.messageCode.text }}</p>
                        </div>

                        <div v-if="!(urlCode || phoneOccupied)" class="input_group">
                            <div class="input_group_row">
                                <label class="input_group_label"><span class="must">*</span>账户密码:</label>
                                <div class="input_group_block">
                                    <input @change="validateLength('password', '20', '6', 'password', 'passwordAgain')" v-model="formData.password | filterPassword" @blur='checkNewPassword'
                                     class="sm" type="password">
                                </div>
                            </div>
                            <p>6-20位字符，可由英文大小写、数字或符号组成</p>
                            <!--<p v-if="!formValidate.password.writed">6-20位字符，可由英文大小写、数字或符号组成</p>-->
                            <p v-if="formValidate.password.writed && !formValidate.password.state"
                               class="red">{{ formValidate.password.text }}</p>
                            <passwordlevel :cfg="passwordLevelData" class="passwordlevel"></passwordlevel>
                        </div>

                        <div v-if="!(urlCode || phoneOccupied)" class="input_group">
                            <div class="input_group_row">
                                <label class="input_group_label"><span class="must">*</span>确认密码:</label>
                                <div class="input_group_block">
                                    <input @change="validatePassword('password', 'passwordAgain')" v-model="formData.passwordAgain"
                                     class="sm" type="password">
                                </div>
                            </div>
                            <p>请再次输入密码</p>
                            <!--<p v-if="!formValidate.passwordAgain.writed">请再次输入密码</p>-->
                            <p v-if="formValidate.passwordAgain.writed && !formValidate.passwordAgain.state"
                             class="red">{{ formValidate.passwordAgain.text }}</p>
                        </div>
                    </div>
                </div>

                <div class="item">
                    <div class="item_title">
                        <h3 class="item_title_h">企业概况<i class="item_title_h_icon icon3"></i></h3>
                    </div>

                    <div class="item_form">
                        <div class="input_group">
                            <div class="input_group_row">
                                <label class="input_group_label"><span class="must">*</span>行业类别:</label>
                                <div class="input_group_block">
                                    <select @change="validateSelect('industryCategory')" v-model="formData.industryCategory"
                                     class="md">
                                        <option value="unselect" selected>请选择</option>
                                        <option v-for="item in industryCategory" :value="item.categoryCode">{{ item.categoryName }}</option>
                                    </select>
                                </div>
                            </div>
                            <template v-if="formValidate.industryCategory.writed">
                                <p v-if="!formValidate.industryCategory.state" class="red">{{ formValidate.industryCategory.text }}</p>
                            </template>
                        </div>

                        <div class="input_group">
                            <div class="input_group_row">
                                <label class="input_group_label"><span class="must">*</span>从业人数:</label>
                                <div class="input_group_block">
                                    <select @change="validateSelect('staffNumber')" v-model="formData.staffNumber"
                                     class="md">
                                        <option value="unselect" selected>请选择</option>
                                        <option value="A">1-49人</option>
                                        <option value="B">50-99人</option>
                                        <option value="C">100-499人</option>
                                        <option value="D">500-999人</option>
                                        <option value="E">1000人以上</option>
                                    </select>
                                </div>
                            </div>
                            <template v-if="formValidate.staffNumber.writed">
                                <p v-if="!formValidate.staffNumber.state" class="red">{{ formValidate.staffNumber.text }}</p>
                            </template>
                        </div>

                        <div class="input_group textarea">
                            <label class="input_group_label">企业简介:</label>
                            <div class="input_group_block">
                                <textarea v-model="formData.other" maxlength="200"
                                 class="lg" placeholder="企业简介，选填。"></textarea>
                                <p>{{ otherTextNum }}/200字</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section v-if="partNum == '4'" class="part">
            <div class="part4">
                <div class="item" v-if="part4_state">
                    <div class="icon-finish"></div>
                    <h3>注册已完成</h3>
                    <div>
                        <p>•&nbsp;&nbsp;您已完成注册流程，感谢您注册我的经管企业账户。</p>
                        <p>•&nbsp;&nbsp;资料审核周期为一个工作日之内。</p>
                        <p>•&nbsp;&nbsp;审核完成之后我们会给您发送短信和邮件通知，请您注意查收。</p>
                    </div>
                </div>

                <div class="item" v-if="!part4_state">
                    <div class="icon-exclamatory"></div>
                    <h3>您的资料未通过审核</h3>
                    <p>原因说明：{{ urlFormData.rejectReason }}，请您重新提交资料申请，谢谢。</p>
                    <button @click="returnPartNum" class="btn-lg-imp">重新申请</button>
                </div>
            </div>
        </section>
    </main>

    <faq></faq>

    <footer v-if="partNum != '1'" :class="{ 'btnState': partNum == '2' || partNum == '3' }">
        <button v-if="partNum == '2'" @click="AddPartNum" :disabled="part2_btnDisabled" class="btn-lg-imp">下一步</button>

        <button v-if="partNum == '3'" @click="returnPartNum" class="btn-lg-def">上一步</button>
        <button v-if="partNum == '3'" @click="validateFormComplete" class="btn-lg-imp">下一步</button>

        <span v-if="partNum == '4'"><a href="http://www.miitbeian.gov.cn">云集智造 2015-2017 粤ICP备16020594号</a></span>
    </footer>

    <warning :config="wCfg"></warning>

    <div v-show="agreementShow" class="agreement">
        <agreement @cb="agreementClose" :is-components="agreementProp"></agreement>
    </div>

    <modal :config="emailModalCfg">
        <div class="email_modal">
            <i class="icon-email"></i>
            <div>验证邮件已发送至您的注册邮箱 {{ formData.mailNumber }}</div>
            <div>请登录您的邮箱，获取验证码，完成邮箱验证。</div>
            <div>（为了保障您的账号安全性，请尽快完成验证）</div>

            <div>没有收到邮件？</div>
            <div>1、请检查邮箱地址是否正确，若不正确，请返回 <a @click="emailReset" href="javascript:;">重新填写</a>；</div>
            <div>2、请检查邮箱设置是否设置了邮件过滤，或查看邮件的垃圾箱。</div>
        </div>
    </modal>
</template>

<style lang="less" scoped>
    @import "../../../../../public/css/serverCommon.less";
    .login {

        span {
            color: #03A9F4;
        }
    }

    .icon-finish,
    .icon-exclamatory {
        display: block;
        padding-bottom: 16px;
        font-size: 60px;
    }
    .icon-finish {
        color: #7ed321;
    }
    .icon-exclamatory {
        color: #feb61a;
    }

    .icon-warning__warn {
        position: relative;
        top: 1px;
        display: inline-block;
        width: 15px;
        height: 15px;
        color: #03A9F4;
        font-size: 15px;
        transform: rotate(180deg);
        & + span {
            color: #212121;
        }
    }

    .item_title_h_icon {
        position: absolute;
        display: inline-block;

        &.icon1 {
            top: 0;
            left: -25px;
            width: 18px;
            height: 16px;
            background-image: url("company_msg.png");
        }
        &.icon2 {
            top: 2px;
            left: -28px;
            width: 22px;
            height: 16px;
            background-image: url("person_resume.png");
        }
        &.icon3 {
            top: 0;
            left: -25px;
            width: 17px;
            height: 17px;
            background-image: url("company_summary.png");
        }
    }

    .must, .red {
        padding-right: 4px;
        color: #FD1200 !important;
    }

    .main {
        width: 75%;
        margin: 0 auto;
        padding: 40px 0 120px;
    }

    input[type='password']:focus {
        border: 1px solid #008af5;
    }

    input::-webkit-contacts-auto-fill-button,
    input::-webkit-credentials-auto-fill-button {
        visibility: hidden;
        display: none !important;
        pointer-events: none;
        position: absolute;
        right: 0;
    }

    .part1 {
        display: flex;
        justify-content: center;
        width: 408px;
        padding-top: 50px;
        margin: 0 auto;

        label {
            width: 85px !important;
            padding-right: 15px;
            text-align: right;
        }

        p {
            padding-left: 85px !important;
        }

        .check_group {
            padding-left: 85px;
            font-size: 14px;

            input {
                position: relative;
                top: -2px;
            }
            
            a {
                color: #03A9F4;
            }
        }
    }

    .handle {
        margin-top: 40px;
        padding-top: 20px;
        border-top: 1px solid #E7E7EB;
        text-align: center;
    }

    .part2 {
        display: flex;
        justify-content: center;
        padding-top: 30px;

        .item {
            width: 244px;
            margin: 0 60px;
            cursor: pointer;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(00, 00, 00, .22);
            overflow: hidden;

            &.active {
                
                .item_header {
                    color: #fff;
                    background: linear-gradient(90deg, #58c8f3 10%, #49b6ff 90%);

                    i {
                        opacity: 1;
                    }
                }
            }
        }

        .item_header {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 46px;
            background: #fff;
            border-bottom: 1px solid #DEDEDE;
            color: #757575;

            h3 {
                font-size: 16px;
                font-weight: normal;
            }

            i {
                position: absolute;
                top: 10px;
                right: 10px;
                font-size: 24px;
                opacity: 0;
            }
        }

        .item_content {
            display: flex;
            justify-content: center;
            align-items: flex-start;
            padding-top: 40px;
            height: 300px;
            background-color: #fff;

            .content-info * {
                padding-bottom: 24px;
            }
        }
    }

    .part1, .part3 {
        display: flex;
        flex-direction: column;

        .item {
            display: flex;
            flex-direction: column;
            padding-top: 50px;

            .item_title {
                padding-left: 30px;
                border-bottom: 1px dotted #E4E4E4;

                .item_title_h {
                    position: relative;
                    margin-bottom: 10px;
                    font-size: 16px;
                    font-weight: normal;
                }
                
                .item_title_p {
                    margin-bottom: 20px;
                    color: #A4A4A4;
                }
            }
        }

        .item_form {
            flex: 1;
            padding: 30px 0 0 50px;
        }

        .input_group {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            padding-bottom: 18px;

            &:last-of-type {
                padding-bottom: 0;
            }

            p {
                padding: 10px 0 0 160px;
                color: #A4A4A4;
                font-size: 12px;
            }

            .input_group_row {
                display: flex;
                align-items: center;
            }

            .input_group_label {
                display: block;
                width: 160px;
                color: #212121;
                font-size: 12px;
            }

            .input_group_block {
                flex: 1;

                button {
                    height: 32px;
                    line-height: 30px;
                }
            }

            .xs, .sm, .md, .lg, .w180 {
                height: 32px;
                border: 1px solid #E5E5E9;
                border-radius: 0;
                color: #37474F;
                font-size: 12px;
            }
            .xs {
                width: 112px;
            }
            .sm {
                width: 180px;
            }
            .md {
                width: 233px;
            }
            .lg {
                width: 400px;
            }
            .w180 {
                width: 180px;
            }

            &.upfile {

                .input_group_row {
                    align-items: flex-start;
                }

                .upfile_item {
                    display: flex;

                    img {
                        display: block;
                        width: 80px;
                        height: 80px;
                        border: 1px solid #E5E5E9;
                        background-color: #fff;
                        opacity: 1;
                    }

                    span {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 80px;
                        height: 80px;
                        border: 1px solid #ddd;
                        background-color: #fff;
                    }
                    
                    .default {
                        background: #fff url("img_default.svg") no-repeat center center;
                        background-size: 48px 48px;
                    }

                    p {
                        padding: 0 0 20px 12px;
                        line-height: 16px;

                        &:last-of-type {
                            padding-bottom: 0;
                        }
                    }

                    .def-opt {
                        width: 80px;
                        height: 28px;
                        margin-top: 5px;
                        text-align: center;
                        line-height: 26px;
                        font-size: 14px;
                    }
                }
            }

            .passwordlevel {
                padding: 10px 0 0 160px;
            }

            &.textarea {
                flex-direction: row;

                label {
                    padding-left: 10px;
                }
                
                div {
                    position: relative;
    
                    textarea {
                        height: 150px;
                    }
    
                    p {
                        position: absolute;
                        left: 180px;
                        bottom: 10px;
                    }
                }
            }
        }
    }


    .part4 {
        margin-top: 40px;

        .item {
            display: flex;
            flex-direction: column;
            align-items: center;

            h3 {
                margin-bottom: 16px;
                font-size: 18px;
                font-weight: normal;
            }
            p {
                color: #757575;
                font-size: 12px;
                line-height: 20px;
            }
            button {
                margin-top: 16px;
            }
        }
    }

    footer.btnState {
        align-items: center;
        height: 60px;

        button:nth-of-type(n+2) {
            margin-left: 30px;
        }
    }

    .agreement {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        background-color: #fbfbfb;
        z-index: 9999;
    }

    .email_modal {
        position: relative;
        width: 600px;
        height: 320px;
        padding: 35px 130px 0 110px;

        .icon-email {
            position: absolute;
            top: 35px;
            left: 50px;
            color: #7ed321;
            font-size: 40px;
        }

        div {
            &:nth-of-type(1),
            &:nth-of-type(4) {
                padding-bottom: 15px;
                color: #212121;
                font-size: 14px;
            }

            &:nth-of-type(2),
            &:nth-of-type(3),
            &:nth-of-type(5),
            &:nth-of-type(6) {
                padding-bottom: 5px;
                color: #757575;
                font-size: 12px;
            }

            &:nth-of-type(3) {
                padding-bottom: 45px;
                margin-bottom: 45px;
                border-bottom: 1px solid #EBEBEB;
            }

            &:nth-of-type(5) {
                a {
                    color: #03A9F4;
                }
            }
        }
    }
</style>
