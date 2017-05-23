<script>
import logoImg from 'np/images/logo.png'
import faq from '../createCompanyAccount/faq'
import passwordlevel from '../createCompanyAccount/passwordlevel'

export default{
    components: {
        faq,
        passwordlevel,
    },
	data(){
		return{
			logoImg:logoImg,
            //错误消息
			message:{
                phone:'',
                verification:'',
                newPassword:'',
                surePassword:''
            },
            // 验证码按钮倒计时
            reset:60,
            // 验证码按钮是否置灰
            verificationBtnDisabled: true,
            // 验证码按钮是否使用过
            verificationBtnUsed: false,
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
            //表格数据
            formData:{
                phone:'',
                verification:'',
                newPassword:'',
                surePassword:''
            },
            successCfg:{
                show:false,
                type:'success',
                title:'提示',
                msg:'密码修改成功，请您重新登录。',
                quite:false
            },
            errCfg:{
                type:'warning',
                content:'',
                show:false
            }
		}
	},
    computed: {
        phoneComputed () {
            if (this.formData.phone.length === 11 && this.reset === 60) {
                this.checkPhone()
            } else {
                this.verificationBtnDisabled = true
            }
            return this.formData.phone
        },
    },
    methods:{
        //获取验证码
        sendVerification(){
            if(this.checkPhone()){
                this.clockVerification()
                this.$http.post(__URL.service+'account/password/reset/sms',null,{params:{
                    mobile:this.formData.phone,
                }}).then(
                    (res) => {
                        if(res.data.success){
                            console.log('验证码发送成功')
                        }else{
                            this.errCfg.content=res.data.errMsg
                            this.errCfg.show=true;
                        }
                        
                    },
                    (err) => {
                        console.log('请求失败')
                    }
                )
            }
        },
        // 验证码倒计时
        clockVerification () {
            this.verificationBtnUsed = true
            this.verificationBtnDisabled = true
            var that=this;
            var countTime=setInterval(function(){
                if(that.reset>0){
                    that.reset--
                    that.verificationBtnDisabled = true
                }else{
                    that.reset=60
                    clearInterval(countTime)
                    that.verificationBtnDisabled = false
                }
            },1000)
        },
        //手机号码校验
        checkPhone(){
            if(this.formData.phone==''){
                this.verificationBtnDisabled = true
                this.message.phone='请输入您的手机号码'
            }else if(!/^1(3|4|5|7|8)\d{9}$/.test(this.formData.phone)){
                this.verificationBtnDisabled = true
                this.message.phone='您输入的手机号码有误'
            }else{
                if (!this.verificationBtnUsed) {
                    this.verificationBtnDisabled = false
                } else {
                    if (this.reset == 60) this.verificationBtnDisabled = false
                }
                return true
            }
        },
        //验证码
        checkVerification(){
            if(this.formData.verification==''){
                this.message.verification='请输入验证码'
            }else{
                return true
            }
        },
        //密码校验
        checkNewPassword(){
            var message=''
            if(this.formData.newPassword==''){
                this.passwordLevel = 0
                message='请输入您的新密码'
            }else if(this.formData.newPassword.length<6){
                message='密码长度不足6位'
            }else if(this.formData.newPassword.length>20){
                message='密码长度超过20位'
            }else if(!/^[\w\?\!\@\#\$%&=\-_]+$/.test(this.formData.newPassword)){
                message='密码不合法'
            }
            this.message.newPassword=message;
            if(message==''){
                return true
            }
        },
        // 密码强度检测
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
        // 根据密码强度值改变强度组件的 active
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
        //确认密码校验
        checkSurePassword(){
            if(this.formData.surePassword!=this.formData.newPassword){
                this.message.surePassword='两次输入的密码不一致'
            }else{
                return true
            }
        },
        //提交
        submit(){
            if(this.checkPhone() && this.checkVerification() && this.checkNewPassword() && this.checkSurePassword()){
                this.$http.post(__URL.service+'account/password/reset',null,{params:{
                    mobile:this.formData.phone,
                    validateCode:this.formData.verification,
                    password:this.formData.newPassword
                }}).then(
                    (res) => {
                        if(res.data.success){
                            this.successCfg.show=true;
                        }else{
                            this.errCfg.content=res.data.errMsg
                            this.errCfg.show=true;
                        }
                        
                    },
                    (err) => {
                        console.log('请求失败')
                    }
                )
            }
        },
        saveSuccess(){
            window.location.href='/login'
        }
    },
    filters:{
        phone:{
            write(val, oldVal) {
                this.message.phone=''
                return val
            }
        },
        newPassword:{
            write(val,oldVal){
                this.message.newPassword=''
                this.checkPasswordLevel(val);
                return val
            }
        }
    }
}

</script>
<template>
    <div class="whiteBg">
        <header>
            <a href="/login">
                <img :src="logoImg">
                我的经管
            </a>
            <a class="login" href="/login">已有账号？<span>点此登录</span></a>
        </header>

        <main class="main">
            <div class="main_title"><i class="icon-retrieve_password"></i>找回密码</div>

            <div class="part">
                <div class='input_group'>
                    <div class="input_group_row">
                        <label class="input_group_label"><span class="must">*</span>手机号码:</label>
                        <div class="input_group_block">
                            <!-- 以下这个div是保证该计算属性生效而触发实时监测 -->
                            <div hidden>{{ phoneComputed }}</div>
                            <input @blur='checkPhone' v-model='formData.phone | phone'
                                   class="sm" type='number' placeholder='请输入手机号码'>
                        </div>
                    </div>
                    <p class='red'>{{message.phone}}</p>
                </div>

                <div class='input_group'>
                    <div class="input_group_row">
                        <label class="input_group_label"><span class="must">*</span>验证码:</label>
                        <div class="input_group_block">
                            <input v-model='formData.verification'
                                   class='sm' type='text' placeholder='请输入验证码'>
                            <button v-if='reset==60' @click='sendVerification' :disabled="verificationBtnDisabled" class="btn-xl-imp w108">发送验证码</button>
                            <button v-if='reset!=60' :disabled="verificationBtnDisabled" class="btn-xl-imp w108">重新发送{{reset}}s</button>
                        </div>
                    </div>
                    <p class='red'>{{message.verification}}</p>
                </div>

                <div class='input_group'>
                    <div class="input_group_row">
                        <label class="input_group_label"><span class="must">*</span>新密码:</label>
                        <div class="input_group_block">
                            <input @blur='checkNewPassword' v-model='formData.newPassword | newPassword'
                                   class="sm" type='password' placeholder='请输入新密码'>
                        </div>
                    </div>
                    <p>6-20位字符,可由英文大小写、数字或符号组成</p>
                    <p class='red'>{{message.newPassword}}</p>
                    <passwordlevel :cfg="passwordLevelData" class="passwordlevel"></passwordlevel>
                    <!--<p v-if='passwordLevel && !message.newPassword'>密码强度:{{passwordLevel}}</p>-->
                </div>

                <div class='input_group'>
                    <div class="input_group_row">
                        <label class="input_group_label"><span class="must">*</span>确认密码:</label>
                        <div class="input_group_block">
                            <input v-model='formData.surePassword'
                                   class="sm" type='password' placeholder='请确认密码'>
                        </div>
                    </div>
                    <p class='red'>{{message.surePassword}}</p>
                </div>

                <div class="handle">
                    <a href="/login"><button class="btn-xl-def">返回</button></a>
                    <button class="btn-xl-imp" @click='submit'>确认</button>
                </div>
            </div>
        </main>

        <footer>
            <span><a href="http://www.miitbeian.gov.cn">云集智造 2015-2017 粤ICP备16020594号</a></span>
        </footer>
    </div>

    <faq></faq>

    <alert :config='successCfg' @cb='saveSuccess'></alert>

    <warning :config='errCfg'></warning>
</template>
<style lang="less" scoped>
	@import "../../../../../public/css/serverCommon.less";
    .whiteBg {
        width: 100%;
        height: 100%;
        background-color: #fff;
    }

    header {
        border-bottom: 1px solid rgba(141,141,141, .27);
    }

    .login {

        span {
            color: #03A9F4;
        }
    }

    .must, .red {
        padding-right: 4px;
        color: #FD1200 !important;
    }

    input::-webkit-contacts-auto-fill-button,
    input::-webkit-credentials-auto-fill-button {
        visibility: hidden;
        display: none !important;
        pointer-events: none;
        position: absolute;
        right: 0;
    }

    .main {
        padding: 40px 0 120px;
    }

    .main_title {
        padding: 35px 0 75px;
        color: #03A9F4;
        font-size: 20px;
        text-align: center;

        i {
            padding-right: 5px;
            margin-left: -30px;
        }
    }

    .part {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 408px;
        margin: 0 auto;
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
            padding: 10px 0 0 105px;
            color: #A4A4A4;
            font-size: 12px;
        }

        .input_group_row {
            display: flex;
            align-items: center;
        }

        .input_group_label {
            display: block;
            width: 105px;
            padding-right: 15px;
            color: #212121;
            font-size: 12px;
            text-align: right;
        }

        .input_group_block {
            flex: 1;

            button {
                height: 32px;
                line-height: 30px;
            }
        }

        .sm {
            width: 180px;
            height: 32px;
            border: 1px solid #E5E5E9;
            border-radius: 0;
            color: #37474F;
            font-size: 12px;
        }

        .passwordlevel {
            padding: 10px 0 0 105px;
        }
    }

    .handle {
        margin-top: 10px;
        padding-top: 30px;
        border-top: 1px solid #E7E7EB;
        text-align: center;

        > * {
            margin-right: 20px;

            &:last-child {
                margin-right: 0;
            }
        }
    }

    .w108 {
        width: 108px;
        margin-left: 5px;
    }
</style>

